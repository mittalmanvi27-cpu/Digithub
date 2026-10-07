import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import { serviceGroups, aiSearchFeatures } from './services'
import { pricing } from './pricing'
import { faqs, comparison, industries, processSteps as steps } from './site'
import { getPosts } from './blog'

/**
 * Retrieval layer for Digi: builds a small knowledge base from the site's own
 * data (services, pricing, FAQ, blog posts, content/knowledge/*.md) and ranks
 * chunks with BM25. No vector DB needed at this size (~100 chunks), and it
 * understands common Hinglish ("kitna paisa" -> price).
 */

export type Chunk = { title: string; url: string; text: string; tokens: string[] }

const STOPWORDS = new Set(
  `a an and are as at be but by can do does for from has have how i if in into is it its me my of on or our so
than that the their them then there these they this to us was we were what when where which who why will with
you your yours about also just any all more most some such very hai hain ka ki ke ko se me mein kya`.split(/\s+/),
)

// Hinglish / colloquial -> canonical terms.
const SYNONYMS: Record<string, string> = {
  kitna: 'price', kitne: 'price', paisa: 'price', paise: 'price', cost: 'price', costs: 'price', charges: 'price',
  charge: 'price', fee: 'price', fees: 'price', rate: 'price', rates: 'price', pricing: 'price', budget: 'price',
  package: 'plan', packages: 'plan', plans: 'plan', kab: 'time', long: 'time', duration: 'time', din: 'time',
  results: 'result', ppc: 'ads', adwords: 'ads', advertising: 'ads', campaign: 'ads', campaigns: 'ads',
  facebook: 'meta', instagram: 'meta', insta: 'meta', fb: 'meta',
  chatgpt: 'ai', gemini: 'ai', perplexity: 'ai', llm: 'ai', geo: 'ai', aeo: 'ai',
  website: 'web', site: 'web', wordpress: 'web', shopify: 'web', landing: 'web',
  maps: 'local', gmb: 'local', gbp: 'local', listing: 'local', nearby: 'local',
  contract: 'lockin', lock: 'lockin', cancel: 'lockin', notice: 'lockin',
  baat: 'contact', call: 'contact', whatsapp: 'contact', phone: 'contact', number: 'contact',
  ranking: 'rank', rankings: 'rank',
}

/** Step-by-step view of tokenisation for the "under the hood" demo. */
export function explainTokens(text: string) {
  return (text.toLowerCase().match(/[a-z0-9₹]+/g) ?? []).map((raw) => {
    if (STOPWORDS.has(raw) || raw.length < 2) return { raw, token: null, kind: 'stopword' as const }
    const [token] = tokenize(raw)
    return { raw, token, kind: SYNONYMS[raw] ? ('synonym' as const) : token !== raw ? ('stem' as const) : ('term' as const) }
  })
}

export function tokenize(text: string): string[] {
  const out: string[] = []
  for (let w of text.toLowerCase().match(/[a-z0-9₹]+/g) ?? []) {
    if (STOPWORDS.has(w) || w.length < 2) continue
    w = SYNONYMS[w] ?? w
    for (const suf of ['ing', 'ies', 'es', 's']) {
      if (w.length > 4 && w.endsWith(suf)) {
        w = w.slice(0, -suf.length) + (suf === 'ies' ? 'y' : '')
        break
      }
    }
    out.push(w)
  }
  return out
}

const strip = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

function split(text: string, size = 900): string[] {
  if (text.length <= size) return [text]
  const parts: string[] = []
  let cur = ''
  for (const sent of text.split(/(?<=[.!?])\s+/)) {
    if (cur.length + sent.length > size && cur) {
      parts.push(cur.trim())
      cur = ''
    }
    cur += sent + ' '
  }
  if (cur.trim()) parts.push(cur.trim())
  return parts
}

class KnowledgeBase {
  chunks: Chunk[] = []
  df = new Map<string, number>()
  avgdl = 1

  constructor() {
    const add = (title: string, url: string, text: string) => {
      for (const piece of split(text)) {
        this.chunks.push({ title, url, text: piece, tokens: tokenize(`${title} ${title} ${piece}`) })
      }
    }

    for (const g of serviceGroups) {
      add(g.name, `/services#${g.id}`, `${g.name}: ${g.text} Services: ${g.items.map((i) => `${i.name} — ${i.text}`).join(' ')}`)
    }
    add('AI Search Optimisation', '/#ai-search', aiSearchFeatures.map((f) => `${f.k}: ${f.v}`).join(' '))
    for (const tab of pricing) {
      for (const p of tab.plans) {
        add(`${tab.label} pricing — ${p.name}`, '/#pricing', `${tab.label} ${p.name} plan: ${p.price} ${p.unit} (excluding GST). For: ${p.for}. Includes: ${p.features.join(', ')}. ${tab.note ?? ''}`)
      }
    }
    for (const f of faqs) add(f.q, '/#faq', `${f.q} ${f.a}`)
    add('Why Digitroot', '/#why', comparison.map((c) => `${c.row}: Digitroot — ${c.us}; typical agency — ${c.them}.`).join(' ') + ` Industries: ${industries.join(', ')}.`)
    add('How we work', '/#process', steps.map((s) => `${s.title}: ${s.text}`).join(' '))

    for (const post of getPosts()) {
      // Chunk each article by h2 section so citations point at the right anchor.
      const sections = post.html.split(/(?=<h2 id=")/)
      for (const sec of sections) {
        const m = sec.match(/^<h2 id="([^"]+)">(.*?)<\/h2>/)
        add(m ? `${post.title} — ${strip(m[2])}` : post.title, `/blog/${post.slug}${m ? `#${m[1]}` : ''}`, strip(sec))
      }
    }

    const kdir = path.join(process.cwd(), 'content', 'knowledge')
    for (const file of fs.existsSync(kdir) ? fs.readdirSync(kdir).filter((f) => f.endsWith('.md')) : []) {
      let section = file.replace(/\.md$/, '')
      let buf: string[] = []
      const flush = () => buf.length && add(section, '/#contact', buf.join(' '))
      for (const line of fs.readFileSync(path.join(kdir, file), 'utf8').split(/\r?\n/)) {
        if (line.startsWith('## ')) {
          flush()
          section = line.slice(3).trim()
          buf = []
        } else if (line.trim() && !line.startsWith('# ')) {
          buf.push(line.replace(/^[-•\s]+/, '').trim())
        }
      }
      flush()
    }

    for (const c of this.chunks) for (const t of new Set(c.tokens)) this.df.set(t, (this.df.get(t) ?? 0) + 1)
    this.avgdl = this.chunks.reduce((n, c) => n + c.tokens.length, 0) / Math.max(this.chunks.length, 1)
  }

  search(query: string, k = 6): Chunk[] {
    return this.searchScored(query, k).map(([c]) => c)
  }

  searchScored(query: string, k = 6, k1 = 1.4, b = 0.75): [Chunk, number][] {
    const q = [...new Set(tokenize(query))]
    if (!q.length) return []
    const n = this.chunks.length
    const scored: [Chunk, number][] = []
    for (const c of this.chunks) {
      const tf = new Map<string, number>()
      for (const t of c.tokens) tf.set(t, (tf.get(t) ?? 0) + 1)
      let s = 0
      for (const term of q) {
        const f = tf.get(term)
        if (!f) continue
        const df = this.df.get(term) ?? 0
        const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5))
        s += (idf * (f * (k1 + 1))) / (f + k1 * (1 - b + (b * c.tokens.length) / this.avgdl))
      }
      if (s > 0) scored.push([c, s])
    }
    scored.sort((a, b) => b[1] - a[1])
    return scored.slice(0, k)
  }
}

let kb: KnowledgeBase | null = null
export function knowledge() {
  return (kb ??= new KnowledgeBase())
}
