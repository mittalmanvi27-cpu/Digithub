'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { AlertTriangle, ArrowRight, CheckCircle2, Globe, Loader2, RotateCcw, Sparkles, XCircle } from 'lucide-react'
import { whatsappLink } from '@/lib/site'
import { Markdown } from './markdown'
import { readSSE } from './sse'
import { WhatsAppIcon } from './ui'
import { getAttribution, trackLead } from '@/lib/track'

type Check = { id: string; label: string; status: 'pass' | 'warn' | 'fail'; detail: string }
type Category = { id: string; label: string; score: number; checks: Check[] }
type Result = { url: string; host: string; title: string; overall: number; categories: Category[] }

const tone = (n: number) => (n >= 80 ? 'text-mint-600' : n >= 55 ? 'text-amber' : 'text-rose')
const stroke = (n: number) => (n >= 80 ? '#17946F' : n >= 55 ? '#F5B544' : '#F0626B')

function Ring({ value, size = 132 }: { value: number; size?: number }) {
  const r = size / 2 - 9
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(11 18 32 / 0.08)" strokeWidth="9" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={stroke(value)}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (c * value) / 100}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)' }}
      />
    </svg>
  )
}

const StatusIcon = ({ s }: { s: Check['status'] }) =>
  s === 'pass' ? <CheckCircle2 className="size-[18px] shrink-0 text-mint-600" /> : s === 'warn' ? <AlertTriangle className="size-[18px] shrink-0 text-amber" /> : <XCircle className="size-[18px] shrink-0 text-rose" />

const LOG = [
  'resolving DNS + SSRF guard … fetching homepage',
  'parsing DOM: title, meta, headings, schema.org JSON-LD',
  'probing robots.txt, sitemap.xml, llms.txt',
  'scoring SEO · AI-search · conversion · technical',
]

export function AuditTool() {
  const params = useSearchParams()
  const [url, setUrl] = useState(params.get('url') ?? '')
  const [phase, setPhase] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [report, setReport] = useState('')
  const [reportState, setReportState] = useState<'none' | 'writing' | 'done' | 'unavailable'>('none')
  const [lead, setLead] = useState<'idle' | 'sending' | 'sent'>('idle')
  const started = useRef(false)

  const run = useCallback(async (target: string) => {
    if (!target.trim()) return
    setPhase('running')
    setStep(0)
    setError('')
    setResult(null)
    setReport('')
    setReportState('none')
    setLead('idle')
    history.replaceState(null, '', `/audit?url=${encodeURIComponent(target.trim())}`)
    const ticker = setInterval(() => setStep((s) => Math.min(s + 1, 3)), 1100)
    try {
      const res = await fetch('/api/audit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: target }) })
      if (!res.ok || !res.body) {
        const out = await res.json().catch(() => ({}))
        throw new Error(out.error || 'The audit failed. Please try again.')
      }
      await readSSE(res, (event, data) => {
        if (event === 'result') {
          clearInterval(ticker)
          setResult(data)
          setPhase('done')
          setStep(4)
        } else if (event === 'status' && data.step === 'report') setReportState('writing')
        else if (event === 'delta') setReport((r) => r + data.text)
        else if (event === 'done') setReportState(data.report ? 'done' : 'unavailable')
        else if (event === 'error') {
          throw new Error(data.message)
        }
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The audit failed.')
      setPhase((p) => (p === 'done' ? 'done' : 'error'))
      setReportState((r) => (r === 'writing' ? 'unavailable' : r))
    } finally {
      clearInterval(ticker)
    }
  }, [])

  useEffect(() => {
    const initial = params.get('url')
    if (initial && !started.current) {
      started.current = true
      run(initial)
    }
  }, [params, run])

  async function requestReview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!result) return
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    setLead('sending')
    const issues = result.categories.flatMap((c) => c.checks.filter((k) => k.status === 'fail').map((k) => `${c.label}: ${k.label} — ${k.detail}`))
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        company: data.company,
        website: result.url,
        service: 'Not sure yet',
        source: 'ai-audit',
        attribution: getAttribution(),
        message: 'Requested a manual review after running the AI audit.',
        context: `AI audit score ${result.overall}/100 (${result.categories.map((c) => `${c.label} ${c.score}`).join(', ')}). Failing checks: ${issues.join('; ') || 'none'}.\n\n${report.slice(0, 2000)}`,
      }),
    }).catch(() => null)
    setLead(res?.ok ? 'sent' : 'idle')
    if (res?.ok) trackLead('ai-audit')
    if (!res?.ok) alert('Couldn’t send — please WhatsApp us instead.')
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          run(url)
        }}
        className="mx-auto flex max-w-2xl flex-col gap-2 rounded-[22px] border border-white/12 bg-white/[0.05] p-2 backdrop-blur-md sm:flex-row sm:items-center sm:rounded-full"
      >
        <label className="flex flex-1 items-center gap-3 px-4 py-2.5 sm:py-0">
          <Globe className="size-5 shrink-0 text-white/40" />
          <span className="sr-only">Website address</span>
          <input
            type="text"
            inputMode="url"
            autoComplete="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourbusiness.in"
            className="w-full bg-transparent text-[1rem] text-white outline-none placeholder:text-white/35"
          />
        </label>
        <button type="submit" disabled={phase === 'running'} className="btn btn-mint btn-lg">
          {phase === 'running' ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {phase === 'running' ? 'Auditing…' : result ? 'Run again' : 'Run free audit'}
        </button>
      </form>

      {phase === 'running' && (
        <div className="mx-auto mt-12 max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a1120] text-left font-mono text-[0.8rem]">
          <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5 text-white/40">
            <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
            <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
            <span className="size-2.5 rounded-full bg-[#28c840]/80" />
            <span className="ml-2 text-[0.7rem]">digitroot-audit — crawler</span>
          </div>
          <div className="space-y-1.5 p-4">
            <p className="text-white/40">$ audit --url {url.replace(/^https?:\/\//, '')} --checks 26</p>
            {LOG.slice(0, step + 1).map((l, i) => (
              <p key={l} className={clsx(i < step ? 'text-white/55' : 'text-white')}>
                <span className={i < step ? 'text-mint' : 'text-amber'}>{i < step ? '✓' : '›'}</span> {l}
                {i === step && <span className="ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-mint" />}
              </p>
            ))}
          </div>
        </div>
      )}

      {phase === 'error' && (
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-rose/30 bg-rose/10 p-5 text-center text-white">
          <p>{error}</p>
          <button type="button" onClick={() => run(url)} className="btn btn-ghost-dark mt-4">
            <RotateCcw className="size-4" /> Try again
          </button>
        </div>
      )}

      {result && (
        <div className="mt-14 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          {/* Scores + checks */}
          <div className="rounded-[28px] bg-paper p-6 text-text sm:p-8">
            <div className="flex flex-col items-center gap-6 border-b border-text/[0.08] pb-8 sm:flex-row">
              <div className="relative grid place-items-center">
                <Ring value={result.overall} />
                <span className={clsx('absolute text-[2.4rem] font-medium tracking-[-0.04em]', tone(result.overall))}>{result.overall}</span>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-faint">Growth score</p>
                <p className="mt-1 text-2xl font-medium">{result.host}</p>
                {result.title && <p className="mt-1 line-clamp-1 text-[0.88rem] text-muted">{result.title}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 py-6 sm:grid-cols-4">
              {result.categories.map((c) => (
                <a key={c.id} href={`#cat-${c.id}`} className="rounded-2xl bg-cloud p-4 transition hover:bg-mint-50">
                  <p className="text-[0.78rem] text-muted">{c.label}</p>
                  <p className={clsx('mt-1 text-[1.8rem] font-medium leading-none tracking-[-0.03em]', tone(c.score))}>{c.score}</p>
                </a>
              ))}
            </div>
            <div className="space-y-8">
              {result.categories.map((c) => (
                <div key={c.id} id={`cat-${c.id}`}>
                  <p className="mb-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-faint">{c.label}</p>
                  <ul className="divide-y divide-text/[0.06] rounded-2xl border border-text/[0.07] bg-white">
                    {c.checks.map((k) => (
                      <li key={k.id} className="flex gap-3 px-4 py-3">
                        <StatusIcon s={k.status} />
                        <div className="min-w-0">
                          <p className="text-[0.92rem] font-medium">{k.label}</p>
                          <p className="break-words text-[0.82rem] text-muted">{k.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* AI report + lead capture */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 text-white sm:p-8">
              <div className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-mint">
                <Sparkles className="size-4" /> AI strategist report
                {reportState === 'writing' && <Loader2 className="ml-auto size-4 animate-spin" />}
              </div>
              <div className="mt-5 text-[0.95rem] leading-relaxed text-white/75 [&_.md_a]:text-mint [&_.md_h3]:text-white [&_.md_strong]:text-white">
                {report ? (
                  <Markdown text={report} />
                ) : reportState === 'writing' ? (
                  <p className="text-white/50">Reading your page and writing a prioritised plan…</p>
                ) : reportState === 'unavailable' ? (
                  <p className="text-white/60">The written AI report isn’t available right now — but your scores are ready on the left, and a strategist can walk you through them for free.</p>
                ) : null}
              </div>
            </div>

            <div className="rounded-[28px] bg-mint p-6 text-ink sm:p-8">
              {lead === 'sent' ? (
                <div>
                  <CheckCircle2 className="size-8" />
                  <p className="mt-3 text-xl font-medium">Request received.</p>
                  <p className="mt-1 text-[0.92rem] text-ink/70">A strategist will review {result.host} by hand and WhatsApp you a 90-day plan within 48 hours.</p>
                </div>
              ) : (
                <form onSubmit={requestReview}>
                  <p className="text-xl font-medium leading-snug">Want a human to go deeper?</p>
                  <p className="mt-1.5 text-[0.9rem] text-ink/70">Free manual review of your Google listing, ads and AI visibility, plus a 90-day plan — on WhatsApp within 48 hours.</p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    <input name="name" required minLength={2} maxLength={80} placeholder="Your name" autoComplete="name" className="rounded-xl border border-ink/10 bg-white/80 px-4 py-3 text-[0.95rem] outline-none placeholder:text-ink/40 focus:bg-white" />
                    <input name="phone" required type="tel" minLength={8} maxLength={20} pattern="[+\d\s()\-]+" placeholder="WhatsApp number" autoComplete="tel" className="rounded-xl border border-ink/10 bg-white/80 px-4 py-3 text-[0.95rem] outline-none placeholder:text-ink/40 focus:bg-white" />
                    <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="submit" disabled={lead === 'sending'} className="btn btn-ink">
                      {lead === 'sending' && <Loader2 className="size-4 animate-spin" />} Get my free review <ArrowRight className="size-4" />
                    </button>
                    <a href={whatsappLink(`Hi Digitroot, I ran your AI audit on ${result.host} (score ${result.overall}/100). Can you help me improve it?`)} target="_blank" rel="noopener" className="btn border border-ink/15 hover:bg-ink/5">
                      <WhatsAppIcon className="size-4" /> WhatsApp
                    </a>
                  </div>
                </form>
              )}
            </div>
            {error && phase === 'done' && <p className="text-center text-[0.85rem] text-white/50">{error}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
