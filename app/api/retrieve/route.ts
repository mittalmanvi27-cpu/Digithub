import { explainTokens, knowledge } from '@/lib/knowledge'
import { json, rateLimited } from '@/lib/rate-limit'

/** Exposes the RAG retrieval step (no LLM call) for the live "under the hood" demo. */
export async function GET(req: Request) {
  if (rateLimited(req, 'retrieve', 40)) return json({ error: 'Slow down a little.' }, 429)
  const q = (new URL(req.url).searchParams.get('q') ?? '').slice(0, 200)
  const kb = knowledge()
  const t0 = performance.now()
  const hits = kb.searchScored(q, 4)
  const ms = performance.now() - t0
  const max = hits[0]?.[1] ?? 1
  return json({
    query: q,
    tokens: explainTokens(q),
    indexSize: kb.chunks.length,
    vocabulary: kb.df.size,
    ms: Math.round(ms * 100) / 100,
    hits: hits.map(([c, score]) => ({
      title: c.title,
      url: c.url,
      score: Math.round(score * 100) / 100,
      weight: Math.round((score / max) * 100),
      snippet: c.text.slice(0, 180) + (c.text.length > 180 ? '…' : ''),
    })),
  })
}
