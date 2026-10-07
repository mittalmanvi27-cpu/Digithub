"""Retrieval layer for Digi.

Builds a knowledge base from the site's own HTML pages plus `knowledge/*.md`,
splits it into heading-scoped chunks, and ranks chunks for a query with BM25.
Pure standard library, so it runs anywhere Python does.
"""
from __future__ import annotations

import math
import re
from collections import Counter
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path

SITE_ROOT = Path(__file__).resolve().parent.parent
KNOWLEDGE_DIR = Path(__file__).resolve().parent / "knowledge"

# Pages that make up the knowledge base, with the URL the assistant may cite.
PAGES = [("index.html", "/"), ("services.html", "/services.html")]

STOPWORDS = set("""
a an and are as at be but by can do does for from has have how i if in into is it its me my of on or our so
than that the their them then there these they this to us was we were what when where which who why will with
you your yours about also just any all more most some such very
""".split())

# Hinglish / colloquial -> canonical terms, so "kitna paisa" finds pricing.
SYNONYMS = {
    "kitna": "price", "kitne": "price", "paisa": "price", "paise": "price", "cost": "price", "costs": "price",
    "charges": "price", "charge": "price", "fee": "price", "fees": "price", "rate": "price", "rates": "price",
    "pricing": "price", "budget": "price", "package": "plan", "packages": "plan", "plans": "plan",
    "kab": "time", "kitne din": "time", "long": "time", "duration": "time", "results": "result",
    "ppc": "ads", "adwords": "ads", "advertising": "ads", "campaign": "ads", "campaigns": "ads",
    "facebook": "meta", "instagram": "meta", "insta": "meta", "fb": "meta",
    "chatgpt": "ai", "gemini": "ai", "perplexity": "ai", "llm": "ai", "geo": "ai", "aeo": "ai",
    "website": "web", "site": "web", "wordpress": "web", "shopify": "web", "landing": "web",
    "maps": "local", "gmb": "local", "gbp": "local", "listing": "local", "nearby": "local",
    "contract": "lockin", "lock": "lockin", "cancel": "lockin", "notice": "lockin",
    "baat": "contact", "call": "contact", "whatsapp": "contact", "phone": "contact", "number": "contact",
    "ranking": "rank", "rankings": "rank", "rank": "rank",
}


def tokenize(text: str) -> list[str]:
    words = re.findall(r"[a-z0-9₹]+", text.lower())
    out = []
    for w in words:
        if w in STOPWORDS or len(w) < 2:
            continue
        w = SYNONYMS.get(w, w)
        # light stemming: plurals and common suffixes
        for suf in ("ing", "ies", "es", "s"):
            if len(w) > 4 and w.endswith(suf):
                w = w[: -len(suf)] + ("y" if suf == "ies" else "")
                break
        out.append(w)
    return out


@dataclass
class Chunk:
    id: int
    title: str
    url: str
    text: str
    tokens: list[str] = field(default_factory=list)


class _SectionParser(HTMLParser):
    """Collects visible text grouped under the nearest h1/h2/h3 heading."""

    SKIP = {"head", "script", "style", "svg", "noscript", "template"}
    VOID = {"br", "img", "input", "meta", "link", "hr", "source", "wbr"}
    DROP_CLASSES = {"header", "assist", "mbar", "loader", "progress", "related", "toc", "cta-box", "posts", "crumbs", "filters", "orbit", "shot"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.sections: list[tuple[str, str, str]] = []  # (heading, anchor, text)
        self._heading = "Overview"
        self._anchor = ""
        self._buf: list[str] = []
        self._skip = 0
        self._drop = 0
        self._in_heading = False
        self._heading_buf: list[str] = []
        self._section_id = ""
        self._pending_anchor = ""

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = (a.get("class") or "").split(" ")[0]
        void = tag in self.VOID
        if tag in ("section", "article") and a.get("id"):
            self._section_id = a["id"]
        # Hidden / chrome regions: count nesting depth until they close.
        if self._skip:
            self._skip += 0 if void else 1
            return
        if tag in self.SKIP or a.get("aria-hidden") == "true" or "sr-only" in (a.get("class") or ""):
            self._skip = 0 if void else 1
            return
        if self._drop:
            self._drop += 0 if void else 1
            return
        if tag in ("footer", "nav") or cls in self.DROP_CLASSES:
            self._drop = 0 if void else 1
            return
        if tag in ("h1", "h2", "h3"):
            self._flush()
            self._pending_anchor = a.get("id") or self._section_id
            self._in_heading = True
            self._heading_buf = []
        if tag in ("p", "li", "br", "div", "td", "th", "summary"):
            self._buf.append(" ")

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if self._skip:
            self._skip -= 1
            return
        if self._drop:
            self._drop -= 1
            return
        if tag in ("h1", "h2", "h3") and self._in_heading:
            self._in_heading = False
            self._heading = " ".join("".join(self._heading_buf).split()) or self._heading
            self._anchor = self._pending_anchor

    def handle_data(self, data):
        if self._skip or self._drop:
            return
        if self._in_heading:
            self._heading_buf.append(data)
        self._buf.append(data)

    def _flush(self):
        text = " ".join("".join(self._buf).split())
        if len(text) > 40:
            self.sections.append((self._heading, self._anchor, text))
        self._buf = []

    def close(self):
        super().close()
        self._flush()


def _split(text: str, size: int = 900) -> list[str]:
    """Split long sections on sentence boundaries into ~size-char pieces."""
    if len(text) <= size:
        return [text]
    parts, cur = [], ""
    for sent in re.split(r"(?<=[.!?])\s+", text):
        if len(cur) + len(sent) > size and cur:
            parts.append(cur.strip())
            cur = ""
        cur += sent + " "
    if cur.strip():
        parts.append(cur.strip())
    return parts


class KnowledgeBase:
    def __init__(self) -> None:
        self.chunks: list[Chunk] = []
        self.df: Counter = Counter()
        self.avgdl = 1.0
        self.build()

    # ---------- indexing ----------
    def _add(self, title: str, url: str, text: str) -> None:
        for piece in _split(text):
            c = Chunk(len(self.chunks), title, url, piece, tokenize(title + " " + title + " " + piece))
            self.chunks.append(c)

    def build(self) -> None:
        self.chunks.clear()
        pages = list(PAGES)
        for p in sorted((SITE_ROOT / "blog").glob("*.html")):
            if p.name == "index.html":  # listing page only repeats article excerpts
                continue
            pages.append((f"blog/{p.name}", f"/blog/{p.name}"))
        for rel, url in pages:
            path = SITE_ROOT / rel
            if not path.exists():
                continue
            parser = _SectionParser()
            parser.feed(path.read_text(encoding="utf-8"))
            parser.close()
            for heading, anchor, text in parser.sections:
                self._add(heading, url + (f"#{anchor}" if anchor and "#" not in url else ""), text)
        for md in sorted(KNOWLEDGE_DIR.glob("*.md")):
            section, buf = md.stem.replace("-", " ").title(), []
            for line in md.read_text(encoding="utf-8").splitlines():
                if line.startswith("## "):
                    if buf:
                        self._add(section, "/#contact", " ".join(buf))
                    section, buf = line[3:].strip(), []
                elif line.strip() and not line.startswith("# "):
                    buf.append(line.strip("-• ").strip())
            if buf:
                self._add(section, "/#contact", " ".join(buf))

        self.df = Counter()
        for c in self.chunks:
            self.df.update(set(c.tokens))
        self.avgdl = sum(len(c.tokens) for c in self.chunks) / max(len(self.chunks), 1)

    # ---------- retrieval ----------
    def search(self, query: str, k: int = 6, k1: float = 1.4, b: float = 0.75) -> list[tuple[Chunk, float]]:
        q = tokenize(query)
        if not q:
            return []
        n = len(self.chunks)
        scored = []
        for c in self.chunks:
            tf = Counter(c.tokens)
            dl = len(c.tokens)
            s = 0.0
            for term in set(q):
                f = tf.get(term)
                if not f:
                    continue
                idf = math.log(1 + (n - self.df[term] + 0.5) / (self.df[term] + 0.5))
                s += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * dl / self.avgdl))
            if s > 0:
                scored.append((c, s))
        scored.sort(key=lambda x: x[1], reverse=True)
        # de-duplicate near-identical chunks from the same section
        seen, out = set(), []
        for c, s in scored:
            key = (c.url, c.title)
            if key in seen and len(out) >= 3:
                continue
            seen.add(key)
            out.append((c, s))
            if len(out) == k:
                break
        return out


if __name__ == "__main__":
    import sys
    kb = KnowledgeBase()
    print(f"{len(kb.chunks)} chunks indexed")
    for c, s in kb.search(" ".join(sys.argv[1:]) or "seo price"):
        print(f"{s:6.2f}  {c.title[:50]:50}  {c.url}")
