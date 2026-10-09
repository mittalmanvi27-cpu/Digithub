'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { ArrowUp, Sparkles, X } from 'lucide-react'
import { site, whatsappLink } from '@/lib/site'
import { Markdown } from './markdown'
import { readSSE } from './sse'
import { WhatsAppIcon } from './ui'

type Msg = { role: 'user' | 'assistant'; content: string; sources?: { title: string; url: string }[]; error?: boolean }

const OPEN_EVENT = 'digi:open'

/** Open the assistant from anywhere, optionally sending a first question. */
export function openChat(prompt?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { prompt } }))
}

const SUGGESTIONS = ['How much does SEO cost?', 'What is AI search optimisation?', 'Google Ads ka budget kitna rakhna chahiye?', 'Do you have lock-in contracts?']

const GREETING: Msg = {
  role: 'assistant',
  content:
    'Hi, I’m **Digi** — Digitroot’s AI assistant. Ask me anything about SEO, AI search, ads, websites or pricing. English, Hindi or Hinglish — all good.',
}

function offlineAnswer(q: string): string {
  const s = q.toLowerCase()
  if (/price|cost|kitna|paisa|fee|plan|charge/.test(s))
    return 'Plans start at **₹9,999/month** for SEO, **₹7,999/month** for ads management and **₹14,999** one-time for a website (all excl. GST). See the full breakdown in the pricing section: /#pricing'
  if (/ai|chatgpt|gemini|geo|aeo|perplexity/.test(s))
    return 'AI search optimisation makes your business the one ChatGPT, Gemini and Google AI Overviews recommend — through answer-first content, schema and trusted mentions. Run the free AI audit to see where you stand: /audit'
  if (/contract|lock|cancel/.test(s)) return 'No lock-in. SEO and ads plans run month-to-month with 30 days’ notice.'
  return `Good question — a strategist can answer that properly. WhatsApp us on ${site.phone}, or run the free AI audit: /audit`
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [aiOn, setAiOn] = useState<boolean | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!open || aiOn !== null) return
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setAiOn(!!d.ai))
      .catch(() => setAiOn(false))
  }, [open, aiOn])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [msgs])

  const send = useCallback(
    async (text: string) => {
      const q = text.trim()
      if (!q || busy) return
      setInput('')
      const history = msgs.filter((m) => m !== GREETING && !m.error).map(({ role, content }) => ({ role, content }))
      setMsgs((m) => [...m, { role: 'user', content: q }, { role: 'assistant', content: '' }])
      setBusy(true)

      const patch = (fn: (m: Msg) => Msg) => setMsgs((all) => [...all.slice(0, -1), fn(all[all.length - 1])])

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: q, history }),
        })
        if (!res.ok || !res.body) {
          const err = await res.json().catch(() => ({}))
          if (res.status === 503) {
            setAiOn(false)
            patch((m) => ({ ...m, content: offlineAnswer(q) }))
          } else patch((m) => ({ ...m, content: err.error ?? 'Something went wrong — please try again.', error: true }))
          return
        }
        await readSSE(res, (event, data) => {
          if (event === 'sources') patch((m) => ({ ...m, sources: data }))
          else if (event === 'delta') patch((m) => ({ ...m, content: m.content + data.text }))
          else if (event === 'error') patch((m) => ({ ...m, content: (m.content ? m.content + '\n\n' : '') + data.message, error: !m.content }))
        })
      } catch {
        patch((m) => ({ ...m, content: m.content || offlineAnswer(q) }))
      } finally {
        setBusy(false)
      }
    },
    [busy, msgs],
  )

  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true)
      const prompt = (e as CustomEvent).detail?.prompt
      if (prompt) send(prompt)
      else setTimeout(() => inputRef.current?.focus(), 250)
    }
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_EVENT, onOpen)
  }, [send])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <div className={clsx('fixed bottom-[84px] right-4 z-40 flex items-center gap-3 transition-all duration-500 md:bottom-6 md:right-6', open && 'pointer-events-none translate-y-4 opacity-0')}>
        <a
          href={whatsappLink('Hi Digitroot, I’d like to know more about your services.')}
          target="_blank"
          rel="noopener"
          aria-label="Chat on WhatsApp"
          className="hidden size-12 place-items-center rounded-full bg-[#25D366] md:grid text-white shadow-[0_12px_30px_-8px_rgb(37_211_102/0.6)] transition hover:scale-105"
        >
          <WhatsAppIcon className="size-6" />
        </a>
        <button
          type="button"
          onClick={() => openChat()}
          className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-ink py-2 pl-2 pr-5 text-white shadow-[0_20px_40px_-12px_rgb(7_11_20/0.6)] transition hover:-translate-y-0.5"
        >
          <span className="relative grid size-9 place-items-center rounded-full bg-gradient-to-br from-mint to-mint-600 text-ink">
            <Sparkles className="size-4" />
            <span className="absolute -right-0.5 -top-0.5 size-2.5 animate-pulse-dot rounded-full border-2 border-ink bg-mint" />
          </span>
          <span className="text-[0.9rem] font-medium">Ask Digi</span>
        </button>
      </div>

      <section
        role="dialog"
        aria-label="Chat with Digi, Digitroot’s AI assistant"
        aria-hidden={!open}
        inert={!open}
        className={clsx(
          'fixed inset-x-3 bottom-3 z-50 flex h-[min(640px,calc(100dvh-24px))] flex-col overflow-hidden rounded-[28px] border border-text/10 bg-paper shadow-[0_40px_100px_-20px_rgb(7_11_20/0.45)] transition-all duration-500 ease-out-expo sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px]',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0',
        )}
      >
        <div className="relative flex items-center gap-3 overflow-hidden bg-ink px-5 py-4 text-white">
          <div className="glow pointer-events-none absolute inset-0 opacity-70" />
          <span className="relative grid size-10 place-items-center rounded-full bg-gradient-to-br from-mint to-mint-600 text-ink">
            <Sparkles className="size-[18px]" />
          </span>
          <div className="relative">
            <p className="font-medium leading-tight">Digi</p>
            <p className="flex items-center gap-1.5 text-xs text-white/55">
              <span className={clsx('size-1.5 rounded-full', aiOn === false ? 'bg-amber' : 'bg-mint')} />
              {aiOn === false ? 'Guided mode' : 'AI assistant · answers from our site'}
            </p>
          </div>
          <div className="relative ml-auto flex gap-1">
            <a href={whatsappLink()} target="_blank" rel="noopener" aria-label="Talk to a human on WhatsApp" className="grid size-9 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white">
              <WhatsAppIcon className="size-[18px]" />
            </a>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="grid size-9 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white">
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
          {msgs.map((m, i) => (
            <div key={i} className={clsx('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div
                className={clsx(
                  'max-w-[86%] rounded-2xl px-4 py-3 text-[0.92rem] leading-relaxed',
                  m.role === 'user' ? 'rounded-br-md bg-ink text-white' : 'rounded-bl-md border border-text/[0.07] bg-white text-[#2a3445]',
                  m.error && 'border-rose/30 bg-rose/5',
                )}
              >
                {m.role === 'assistant' && !m.content ? (
                  <span className="flex gap-1 py-1.5" aria-label="Digi is typing">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="size-1.5 animate-bounce rounded-full bg-faint" style={{ animationDelay: `${d * 120}ms` }} />
                    ))}
                  </span>
                ) : m.role === 'assistant' ? (
                  <Markdown text={m.content} />
                ) : (
                  m.content
                )}
                {m.sources && m.sources.length > 0 && m.content && !busy && (
                  <div className="mt-3 flex flex-wrap gap-1.5 border-t border-text/[0.06] pt-2.5">
                    {m.sources.map((s) => (
                      <Link key={s.url} href={s.url} className="rounded-full bg-cloud px-2.5 py-1 text-[0.72rem] text-muted transition hover:bg-mint-50 hover:text-mint-600">
                        {s.title.length > 34 ? s.title.slice(0, 32) + '…' : s.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {msgs.length === 1 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-text/10 bg-white px-3.5 py-2 text-left text-[0.82rem] text-text transition hover:border-mint-600 hover:text-mint-600">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className="border-t border-text/[0.07] bg-white p-3"
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
        >
          <div className="flex items-end gap-2 rounded-2xl border border-text/10 bg-paper p-1.5 pl-4 focus-within:border-mint-600">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={800}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              placeholder="Ask about SEO, ads, pricing…"
              aria-label="Your message"
              className="max-h-28 flex-1 resize-none bg-transparent py-2 text-[0.92rem] outline-none placeholder:text-faint"
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send" className="grid size-9 place-items-center rounded-xl bg-ink text-white transition disabled:opacity-30">
              <ArrowUp className="size-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[0.68rem] text-faint">AI can make mistakes. Prices & policies are confirmed by our team.</p>
        </form>
      </section>
    </>
  )
}
