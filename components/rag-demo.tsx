'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { ArrowRight, Binary, Brain, Database, Layers, MessageSquareText, Play, Search } from 'lucide-react'
import { openChat } from './chat-widget'

type Token = { raw: string; token: string | null; kind: 'term' | 'synonym' | 'stem' | 'stopword' }
type Hit = { title: string; url: string; score: number; weight: number; snippet: string }
type Result = { query: string; tokens: Token[]; indexSize: number; vocabulary: number; ms: number; hits: Hit[] }

const PRESETS = ['SEO ka kitna paisa lagega?', 'How do I get recommended by ChatGPT?', 'Is there a lock-in contract?', 'Google Ads budget for a small business']

const STAGES = [
  { icon: MessageSquareText, title: 'Query', text: 'Visitor asks in English, Hindi or Hinglish' },
  { icon: Binary, title: 'Normalise', text: 'Tokenise, drop stopwords, stem, map Hinglish → intent' },
  { icon: Search, title: 'Retrieve', text: 'Okapi BM25 ranks every knowledge chunk' },
  { icon: Layers, title: 'Ground', text: 'Top-k chunks become the only allowed context' },
  { icon: Brain, title: 'Generate', text: 'Claude Opus 5.5 streams a cited answer over SSE' },
]

const kindStyle: Record<Token['kind'], string> = {
  term: 'border-white/15 text-white/80',
  synonym: 'border-mint/50 bg-mint/10 text-mint',
  stem: 'border-sky-400/40 bg-sky-400/10 text-sky-300',
  stopword: 'border-white/5 text-white/25 line-through',
}

export function RagDemo() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [stage, setStage] = useState(-1)
  const [busy, setBusy] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const autoplayed = useRef(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const run = useCallback(async (q: string) => {
    if (!q.trim()) return
    timers.current.forEach(clearTimeout)
    setBusy(true)
    setResult(null)
    setStage(0)
    const res = await fetch(`/api/retrieve?q=${encodeURIComponent(q)}`).then((r) => r.json()).catch(() => null)
    // Walk the pipeline visually so each stage is readable.
    ;[1, 2, 3].forEach((s, i) => timers.current.push(setTimeout(() => setStage(s), 350 * (i + 1))))
    timers.current.push(
      setTimeout(() => {
        if (res && !res.error) setResult(res)
        setBusy(false)
      }, 1100),
    )
  }, [])

  // Type the first preset out once the section scrolls into view.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || autoplayed.current) return
      autoplayed.current = true
      const text = PRESETS[0]
      let i = 0
      const tick = () => {
        i++
        setQuery(text.slice(0, i))
        if (i < text.length) timers.current.push(setTimeout(tick, 45))
        else run(text)
      }
      tick()
    }, { threshold: 0.35 })
    io.observe(el)
    const t = timers.current
    return () => {
      io.disconnect()
      t.forEach(clearTimeout)
    }
  }, [run])

  return (
    <div ref={root}>
      {/* Pipeline */}
      <ol className="relative grid gap-3 md:grid-cols-5">
        <div className="pointer-events-none absolute left-[10%] right-[10%] top-[34px] hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />
        {STAGES.map((s, i) => {
          const Icon = s.icon
          const on = stage >= i
          return (
            <li key={s.title} className="relative flex flex-col items-center text-center">
              <span
                className={clsx(
                  'relative z-10 grid size-[68px] place-items-center rounded-2xl border transition-all duration-500',
                  on ? 'border-mint/60 bg-mint/15 text-mint shadow-[0_0_40px_-6px_rgb(63_201_160/0.7)]' : 'border-white/10 bg-ink-2 text-white/40',
                )}
              >
                <Icon className="size-6" />
                <span className="absolute -right-2 -top-2 rounded-md bg-ink px-1.5 font-mono text-[0.62rem] text-white/40">0{i + 1}</span>
              </span>
              <p className={clsx('mt-4 font-medium transition', on ? 'text-white' : 'text-white/60')}>{s.title}</p>
              <p className="mt-1 max-w-[180px] text-[0.8rem] leading-snug text-white/45">{s.text}</p>
            </li>
          )
        })}
      </ol>

      {/* Playground */}
      <div className="mt-14 overflow-hidden rounded-[24px] border border-white/10 bg-[#0a1120] shadow-[0_40px_100px_-30px_rgb(0_0_0/0.7)]">
        <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]/80" />
          <span className="size-3 rounded-full bg-[#febc2e]/80" />
          <span className="size-3 rounded-full bg-[#28c840]/80" />
          <span className="ml-3 rounded-md bg-white/[0.05] px-2.5 py-1 font-mono text-[0.72rem] text-white/55">rag-playground.ts</span>
          <span className="ml-auto hidden items-center gap-1.5 font-mono text-[0.68rem] text-mint sm:flex">
            <span className="size-1.5 animate-pulse rounded-full bg-mint" /> live · real retrieval engine
          </span>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.25fr]">
          <div className="border-b border-white/[0.07] p-5 sm:p-6 lg:border-b-0 lg:border-r">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                run(query)
              }}
            >
              <label className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/40" htmlFor="rag-q">
                <span className="text-mint">const</span> query =
              </label>
              <div className="mt-2 flex gap-2 rounded-xl border border-white/10 bg-black/30 p-1.5 focus-within:border-mint/50">
                <input
                  id="rag-q"
                  value={query}
                  maxLength={200}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything…"
                  className="min-w-0 flex-1 bg-transparent px-2 font-mono text-[0.9rem] text-white outline-none placeholder:text-white/30"
                />
                <button type="submit" disabled={busy} className="grid size-9 place-items-center rounded-lg bg-mint text-ink disabled:opacity-50" aria-label="Run retrieval">
                  <Play className="size-4" />
                </button>
              </div>
            </form>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button key={p} type="button" onClick={() => (setQuery(p), run(p))} className="rounded-md border border-white/10 px-2 py-1 font-mono text-[0.7rem] text-white/50 transition hover:border-mint/40 hover:text-mint">
                  {p}
                </button>
              ))}
            </div>

            <p className="mt-7 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/40">
              <span className="text-mint">tokenize</span>(query)
            </p>
            <div className="mt-3 flex min-h-10 flex-wrap gap-1.5">
              {result?.tokens.map((t, i) => (
                <span key={i} className={clsx('rounded-md border px-2 py-1 font-mono text-[0.75rem]', kindStyle[t.kind])} title={t.kind}>
                  {t.kind === 'synonym' || t.kind === 'stem' ? (
                    <>
                      {t.raw} <span className="opacity-60">→</span> {t.token}
                    </>
                  ) : (
                    t.raw
                  )}
                </span>
              ))}
              {!result && <span className="font-mono text-[0.75rem] text-white/25">{busy ? 'normalising…' : '// run a query'}</span>}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.66rem] text-white/35">
              <span><i className="mr-1 inline-block size-2 rounded-sm bg-mint/60" />Hinglish/synonym map</span>
              <span><i className="mr-1 inline-block size-2 rounded-sm bg-sky-400/60" />stemmed</span>
              <span><i className="mr-1 inline-block size-2 rounded-sm bg-white/20" />stopword</span>
            </div>

            {result && (
              <pre className="mt-7 overflow-x-auto rounded-xl bg-black/30 p-4 font-mono text-[0.72rem] leading-relaxed text-white/55">
                <span className="text-white/30">{'// retrieval stats'}</span>
                {'\n'}index: <span className="text-mint">{result.indexSize}</span> chunks
                {'\n'}vocab: <span className="text-mint">{result.vocabulary}</span> terms
                {'\n'}algo:  <span className="text-sky-300">okapi_bm25</span>(k1=1.4, b=0.75)
                {'\n'}top_k: <span className="text-mint">{result.hits.length}</span>
                {'\n'}took:  <span className="text-amber">{result.ms} ms</span>
              </pre>
            )}
          </div>

          <div className="p-5 sm:p-6">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/40">
              <span className="text-mint">retrieve</span>(tokens, k=4) <span className="text-white/25">→ context window</span>
            </p>
            <ul className="mt-4 space-y-2.5">
              {(result?.hits ?? Array.from({ length: 4 }, () => null)).map((h, i) =>
                h ? (
                  <li key={i} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-mint/30" style={{ animation: `reveal .5s ${i * 0.08}s both` }}>
                    <div className="flex items-center justify-between gap-3">
                      <a href={h.url} className="truncate text-[0.88rem] font-medium text-white hover:text-mint">
                        {h.title}
                      </a>
                      <span className="shrink-0 font-mono text-[0.72rem] text-mint">{h.score.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div className="h-full rounded-full bg-gradient-to-r from-mint-600 to-mint transition-all duration-700" style={{ width: `${h.weight}%` }} />
                    </div>
                    <p className="mt-2.5 line-clamp-2 text-[0.78rem] leading-relaxed text-white/45">{h.snippet}</p>
                  </li>
                ) : (
                  <li key={i} className="h-[104px] animate-pulse rounded-xl border border-white/[0.05] bg-white/[0.015]" />
                ),
              )}
              {result && result.hits.length === 0 && <li className="font-mono text-[0.8rem] text-white/40">// no matching chunks — Digi would say it isn’t sure and offer WhatsApp</li>}
            </ul>
            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-mint/20 bg-mint/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[0.75rem] text-white/60">
                <span className="text-mint">claude</span>.generate(<span className="text-white/40">context, query</span>)
              </p>
              <button type="button" disabled={!result} onClick={() => (setStage(4), openChat(result?.query))} className="btn btn-mint py-2.5 text-[0.85rem]">
                Generate the answer <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stack */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        <Database className="mr-1 size-4 text-white/30" />
        {['Next.js 16', 'React 19', 'TypeScript', 'Claude Opus 5.5', 'RAG · BM25', 'SSE streaming', 'Structured outputs', 'Edge-ready APIs', 'Schema.org + llms.txt'].map((t) => (
          <span key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[0.7rem] text-white/55">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
