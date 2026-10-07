# Digitroot website

Marketing site for Digitroot with **Digi**, an AI assistant that answers visitor questions using retrieval-augmented generation (RAG) over the site's own content.

## Run locally

```bash
pip install -r requirements.txt
cp server/.env.example server/.env   # then add your ANTHROPIC_API_KEY
python server/app.py                 # http://localhost:5500/
```

On Windows you can double-click `start-server.bat`.

Without an API key the site still runs, and Digi falls back to its built-in guided answers.

## How Digi works

```
browser (script.js)                    server/app.py                         Claude API
──────────────────                     ─────────────                         ──────────
question ──POST /api/chat──▶  1. retrieve: BM25 over site chunks (rag.py)
                              2. build prompt: system rules + top-6 chunks
                                 + last 8 turns of the conversation
                              3. stream ───────────────────────────────────▶ claude-opus-5-5
◀── SSE: sources, delta… ──  4. relay tokens as Server-Sent Events  ◀────── text stream
render answer + source links
```

- **Knowledge base** (`server/rag.py`): parses `index.html`, `services.html`, every `blog/*.html` article and `server/knowledge/*.md` into heading-scoped chunks at startup (about 120 chunks). Site chrome (header, footer, chat widget, decorative visuals) is excluded.
- **Retrieval**: Okapi BM25 ranking with light stemming and a Hinglish/synonym map ("kitna paisa" → price, "insta" → meta). Pure standard library. Test it with `python server/rag.py <query>`.
- **Generation**: the Anthropic Python SDK with streaming, low effort for short chat replies, prompt caching on the system prompt, and server-side refusal fallback (`fallbacks: "default"`).
- **Guardrails**: answers only from site context, never invents prices or results, 800-char message cap, 12 requests/min per IP, `server/` and dotfiles are never served.

## Updating content

- Edit prices, contact details or policies in `server/knowledge/company.md`, and the matching text in `index.html`.
- New blog posts in `blog/` are indexed automatically on the next server start.

## Files

| Path | Purpose |
|---|---|
| `index.html`, `services.html`, `blog/` | Site pages |
| `styles.css`, `script.js` | Design system, interactions, chat client |
| `server/app.py` | Static server + `/api/health` + `/api/chat` (SSE) |
| `server/rag.py` | Chunking and BM25 retrieval |
| `server/knowledge/` | Extra facts for the assistant (pricing, policies, contact) |
