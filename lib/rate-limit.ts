import 'server-only'

/**
 * Simple sliding-window limiter, per server instance. Good enough to stop
 * casual abuse of the AI endpoints; for multi-region production traffic put a
 * shared store (e.g. Upstash Redis) or your host's WAF rate limit in front.
 */
const hits = new Map<string, number[]>()

export function rateLimited(req: Request, bucket: string, limit: number, windowMs = 60_000): boolean {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'local'
  const key = `${bucket}:${ip}`
  const now = Date.now()
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (list.length >= limit) {
    hits.set(key, list)
    return true
  }
  list.push(now)
  hits.set(key, list)
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k)
  return false
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}
