import 'server-only'
import dns from 'node:dns/promises'
import net from 'node:net'

/**
 * Fetches a public web page on behalf of a visitor (the AI audit) without
 * letting them point us at internal services: http(s) on standard ports only,
 * every hop's hostname must resolve to public IPs, redirects are followed
 * manually and re-checked, and the body is capped.
 */

export class FetchBlockedError extends Error {}

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number)
    return (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) || // CGNAT
      (a === 169 && b === 254) || // link-local / cloud metadata
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0) ||
      (a === 198 && (b === 18 || b === 19))
    )
  }
  const v6 = ip.toLowerCase()
  if (v6.startsWith('::ffff:')) return isPrivateIp(v6.slice(7))
  return v6 === '::' || v6 === '::1' || /^f[cd]/.test(v6) || /^fe[89ab]/.test(v6) || v6.startsWith('ff')
}

async function assertPublic(url: URL) {
  if (!['http:', 'https:'].includes(url.protocol)) throw new FetchBlockedError('Only http and https websites can be audited.')
  if (url.port && !['80', '443'].includes(url.port)) throw new FetchBlockedError('Only websites on standard ports can be audited.')
  if (url.username || url.password) throw new FetchBlockedError('URLs with credentials are not allowed.')
  const host = url.hostname.replace(/^\[|\]$/g, '')
  if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal') || !host.includes('.'))
    throw new FetchBlockedError('That doesn’t look like a public website.')
  const addrs = net.isIP(host) ? [{ address: host }] : await dns.lookup(host, { all: true }).catch(() => [])
  if (!addrs.length) throw new FetchBlockedError('We couldn’t find that domain. Check the spelling and try again.')
  if (addrs.some((a) => isPrivateIp(a.address))) throw new FetchBlockedError('That doesn’t look like a public website.')
}

export function normaliseUrl(input: string): URL {
  let s = input.trim()
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s
  const url = new URL(s)
  url.hash = ''
  return url
}

export type FetchedPage = { url: string; status: number; ms: number; html: string; bytes: number; headers: Headers }

const UA = 'Mozilla/5.0 (compatible; DigitrootAuditBot/2.0; +https://www.digitroot.in/audit)'

export async function safeFetch(start: URL, { maxBytes = 2_500_000, timeoutMs = 12_000, maxRedirects = 4 } = {}): Promise<FetchedPage> {
  let url = start
  const t0 = Date.now()
  for (let hop = 0; hop <= maxRedirects; hop++) {
    await assertPublic(url)
    const res = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.5' },
    })
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      url = new URL(res.headers.get('location')!, url)
      await res.body?.cancel()
      continue
    }
    const ms = Date.now() - t0
    // Read at most maxBytes so a huge or endless response can't exhaust memory.
    const reader = res.body?.getReader()
    const chunks: Uint8Array[] = []
    let bytes = 0
    if (reader) {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        bytes += value.byteLength
        if (bytes > maxBytes) {
          await reader.cancel()
          break
        }
        chunks.push(value)
      }
    }
    const html = new TextDecoder('utf-8', { fatal: false }).decode(Buffer.concat(chunks))
    return { url: url.toString(), status: res.status, ms, html, bytes, headers: res.headers }
  }
  throw new FetchBlockedError('That website redirects too many times.')
}

/** Lightweight existence check for robots.txt / sitemap.xml / llms.txt on the same (already-validated) origin. */
export async function exists(url: URL): Promise<boolean> {
  try {
    await assertPublic(url)
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(6000), headers: { 'User-Agent': UA } })
    const ok = res.ok && !(res.headers.get('content-type') ?? '').includes('text/html')
    await res.body?.cancel()
    return ok
  } catch {
    return false
  }
}
