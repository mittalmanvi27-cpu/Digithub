import 'server-only'
import { exists, safeFetch, type FetchedPage } from './safe-fetch'

export type CheckStatus = 'pass' | 'warn' | 'fail'
export type Check = { id: string; label: string; status: CheckStatus; detail: string }
export type Category = { id: 'seo' | 'ai' | 'conversion' | 'technical'; label: string; score: number; checks: Check[] }
export type Vitals = { performance: number; lcp: string; cls: string; inp: string; strategy: 'mobile' } | null
export type AuditResult = {
  url: string
  host: string
  title: string
  overall: number
  categories: Category[]
  vitals: Vitals
  /** Compact facts + page text sent to Claude for the written report. */
  facts: string
}

const decode = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))

const meta = (html: string, key: string) => {
  const re = new RegExp(`<meta[^>]+(?:name|property)=["']${key}["'][^>]*>`, 'i')
  const tag = html.match(re)?.[0]
  return tag ? decode(tag.match(/content=["']([^"']*)["']/i)?.[1] ?? '').trim() : ''
}

function visibleText(html: string) {
  return decode(
    html
      .replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim()
}

function schemaTypes(html: string): string[] {
  const types = new Set<string>()
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const t of m[1].matchAll(/"@type"\s*:\s*(\[[^\]]*\]|"[^"]+")/g)) {
      for (const name of t[1].matchAll(/"([^"]+)"/g)) types.add(name[1])
    }
  }
  return [...types]
}

const check = (id: string, label: string, ok: boolean | 'warn', detail: string): Check => ({
  id,
  label,
  status: ok === 'warn' ? 'warn' : ok ? 'pass' : 'fail',
  detail,
})

const score = (checks: Check[]) =>
  Math.round((checks.reduce((n, c) => n + (c.status === 'pass' ? 1 : c.status === 'warn' ? 0.5 : 0), 0) / checks.length) * 100)

async function pageSpeed(url: string): Promise<Vitals> {
  const key = process.env.PAGESPEED_API_KEY
  if (!key) return null
  try {
    const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance&key=${key}`
    const res = await fetch(api, { signal: AbortSignal.timeout(45_000) })
    if (!res.ok) return null
    const data = await res.json()
    const audits = data.lighthouseResult?.audits ?? {}
    const field = data.loadingExperience?.metrics ?? {}
    return {
      performance: Math.round((data.lighthouseResult?.categories?.performance?.score ?? 0) * 100),
      lcp: audits['largest-contentful-paint']?.displayValue ?? '—',
      cls: audits['cumulative-layout-shift']?.displayValue ?? '—',
      inp: field.INTERACTION_TO_NEXT_PAINT?.percentile ? `${field.INTERACTION_TO_NEXT_PAINT.percentile} ms` : '—',
      strategy: 'mobile',
    }
  } catch {
    return null
  }
}

export async function runAudit(start: URL): Promise<AuditResult> {
  const page: FetchedPage = await safeFetch(start)
  const finalUrl = new URL(page.url)
  const origin = finalUrl.origin
  const [robots, sitemap, llms, vitals] = await Promise.all([
    exists(new URL('/robots.txt', origin)),
    exists(new URL('/sitemap.xml', origin)),
    exists(new URL('/llms.txt', origin)),
    pageSpeed(page.url),
  ])

  const { html } = page
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').replace(/\s+/g, ' ').trim()
  const description = meta(html, 'description')
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => visibleText(m[1])).filter(Boolean)
  const h2Count = (html.match(/<h2[\s>]/gi) ?? []).length
  const viewport = /<meta[^>]+name=["']viewport["']/i.test(html)
  const lang = html.match(/<html[^>]*\slang=["']([^"']+)["']/i)?.[1] ?? ''
  const canonical = /<link[^>]+rel=["']canonical["']/i.test(html)
  const noindex = /noindex/i.test(meta(html, 'robots'))
  const ogTitle = meta(html, 'og:title')
  const ogImage = meta(html, 'og:image')
  const types = schemaTypes(html)
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0])
  const imgsNoAlt = imgs.filter((t) => !/\salt=["'][^"']+["']/i.test(t)).length
  const scripts = (html.match(/<script\b[^>]*\ssrc=/gi) ?? []).length
  const text = visibleText(html)
  const words = text.split(' ').filter(Boolean).length
  const tel = /href=["']tel:/i.test(html)
  const whatsapp = /wa\.me\/|api\.whatsapp\.com|whatsapp:\/\//i.test(html)
  const form = /<form\b/i.test(html)
  const cta = /(book|call|contact|quote|enquir|appointment|get started|free|consult|demo|buy|order)/i.test(text.slice(0, 4000))
  const faq = types.some((t) => /FAQ/i.test(t)) || /<details\b/i.test(html) || /frequently asked|faq/i.test(text)
  const business = types.find((t) => /LocalBusiness|Organization|ProfessionalService|Store|Restaurant|MedicalBusiness|Dentist|Physician|LegalService|RealEstateAgent/i.test(t))
  const https = finalUrl.protocol === 'https:'
  const kb = Math.round(page.bytes / 1024)
  const compressed = /gzip|br|zstd/i.test(page.headers.get('content-encoding') ?? '')
  const emailOrAddress = /@[a-z0-9-]+\.[a-z]{2,}|address|road|nagar|street|sector/i.test(text)

  const seo: Check[] = [
    check('title', 'Title tag', title.length >= 25 && title.length <= 65 ? true : title ? 'warn' : false, title ? `“${title.slice(0, 80)}” (${title.length} chars; aim for 30–60)` : 'Missing — Google will invent one'),
    check('description', 'Meta description', description.length >= 70 && description.length <= 165 ? true : description ? 'warn' : false, description ? `${description.length} chars (aim for 120–160)` : 'Missing — lower click-through from search'),
    check('h1', 'Single, clear H1', h1s.length === 1 ? true : h1s.length > 1 ? 'warn' : false, h1s.length ? `${h1s.length} H1: “${h1s[0].slice(0, 70)}”` : 'No H1 heading found'),
    check('structure', 'Content structure', h2Count >= 3 ? true : h2Count ? 'warn' : false, `${h2Count} H2 sub-headings`),
    check('content', 'Content depth', words >= 600 ? true : words >= 250 ? 'warn' : false, `~${words.toLocaleString('en-IN')} words on the page`),
    check('alt', 'Image alt text', imgs.length === 0 || imgsNoAlt === 0 ? true : imgsNoAlt / imgs.length < 0.3 ? 'warn' : false, imgs.length ? `${imgsNoAlt} of ${imgs.length} images missing alt text` : 'No images found'),
    check('indexable', 'Indexable by Google', !noindex && page.status < 400, noindex ? 'Page has a noindex robots tag' : `HTTP ${page.status}`),
    check('canonical', 'Canonical URL', canonical, canonical ? 'Present' : 'Missing — risk of duplicate URLs'),
  ]
  const ai: Check[] = [
    check('schema-business', 'Business schema (entity)', !!business, business ? `${business} schema found` : 'No Organization / LocalBusiness schema — AI can’t confirm who you are'),
    check('schema-any', 'Structured data', types.length > 0, types.length ? types.slice(0, 8).join(', ') : 'No JSON-LD structured data'),
    check('faq', 'Answer-first FAQ content', faq ? true : 'warn', faq ? 'FAQ-style content detected' : 'No FAQ — AI assistants love quotable Q&A'),
    check('og', 'Social / Open Graph tags', ogTitle && ogImage ? true : ogTitle || ogImage ? 'warn' : false, ogTitle && ogImage ? 'og:title and og:image present' : 'Incomplete — links shared on WhatsApp look bare'),
    check('llms', 'llms.txt for AI crawlers', llms ? true : 'warn', llms ? 'Present' : 'Not found (emerging standard, easy win)'),
    check('nap', 'Contact & location details', emailOrAddress && (tel || whatsapp) ? true : 'warn', emailOrAddress ? 'Contact details visible' : 'Address / email not clearly visible'),
  ]
  const conversion: Check[] = [
    check('cta', 'Clear call to action', cta, cta ? 'Action words found above the fold' : 'No obvious CTA near the top'),
    check('phone', 'Click-to-call link', tel, tel ? 'tel: link present' : 'No click-to-call link for mobile visitors'),
    check('whatsapp', 'WhatsApp button', whatsapp, whatsapp ? 'WhatsApp link present' : 'No WhatsApp link — Indian buyers expect one'),
    check('form', 'Enquiry form', form ? true : 'warn', form ? 'Form found' : 'No form on this page'),
  ]
  const technical: Check[] = [
    check('https', 'HTTPS', https, https ? 'Secure connection' : 'Not secure — browsers warn visitors'),
    check('mobile', 'Mobile viewport', viewport, viewport ? 'Responsive viewport set' : 'No viewport tag — broken on phones'),
    check('speed', 'Server response', page.ms < 800 ? true : page.ms < 1800 ? 'warn' : false, `${page.ms} ms to first byte from our server`),
    check('weight', 'HTML weight', kb < 150 ? true : kb < 400 ? 'warn' : false, `${kb} KB HTML${compressed ? ', compressed' : ''}`),
    check('scripts', 'Script count', scripts <= 15 ? true : scripts <= 30 ? 'warn' : false, `${scripts} external scripts`),
    check('robots', 'robots.txt', robots, robots ? 'Present' : 'Missing'),
    check('sitemap', 'XML sitemap', sitemap ? true : 'warn', sitemap ? 'Present at /sitemap.xml' : 'Not at /sitemap.xml'),
    check('lang', 'Language declared', !!lang, lang ? `lang="${lang}"` : 'No lang attribute'),
  ]
  if (vitals) {
    technical.unshift(
      check('psi', 'Mobile performance (Lighthouse)', vitals.performance >= 80 ? true : vitals.performance >= 50 ? 'warn' : false, `${vitals.performance}/100 · LCP ${vitals.lcp} · CLS ${vitals.cls}`),
    )
  }

  const categories: Category[] = [
    { id: 'seo', label: 'SEO', score: score(seo), checks: seo },
    { id: 'ai', label: 'AI search', score: score(ai), checks: ai },
    { id: 'conversion', label: 'Conversion', score: score(conversion), checks: conversion },
    { id: 'technical', label: 'Technical', score: score(technical), checks: technical },
  ]
  const overall = Math.round(categories.reduce((n, c) => n + c.score, 0) / categories.length)

  const facts = [
    `URL: ${page.url}`,
    `Overall score: ${overall}/100 (${categories.map((c) => `${c.label} ${c.score}`).join(', ')})`,
    ...categories.flatMap((c) => c.checks.map((k) => `[${c.label}] ${k.label}: ${k.status.toUpperCase()} — ${k.detail}`)),
    vitals ? `PageSpeed mobile: ${vitals.performance}/100, LCP ${vitals.lcp}, CLS ${vitals.cls}, INP ${vitals.inp}` : 'PageSpeed: not measured',
    `Meta description: ${description || '(none)'}`,
    `H1: ${h1s.join(' | ') || '(none)'}`,
  ].join('\n')

  return {
    url: page.url,
    host: finalUrl.hostname.replace(/^www\./, ''),
    title,
    overall,
    categories,
    vitals,
    facts: `${facts}\n\nVISIBLE PAGE TEXT (first 5000 chars):\n${text.slice(0, 5000)}`,
  }
}
