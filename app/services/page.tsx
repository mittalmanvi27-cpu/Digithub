import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { serviceGroups, serviceCount } from '@/lib/services'
import { serviceIcons } from '@/components/ui'
import { ChatButton } from '@/components/chat-button'

export const metadata: Metadata = {
  title: 'Services — SEO, AI Search, Google & Meta Ads, Websites',
  description: `${serviceCount}+ digital marketing services across 8 disciplines: AI search (ChatGPT, Gemini, Perplexity), SEO, Google & Meta Ads, websites, social, content, analytics and app marketing.`,
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-20 pt-36 text-white sm:pt-44">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="glow pointer-events-none absolute inset-0" />
        <div className="container-x relative">
          <span className="eyebrow text-mint/80">{serviceCount}+ services · 8 disciplines</span>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.6rem,6.4vw,5.2rem)] font-medium leading-[0.98] tracking-[-0.045em]">
            Every growth channel, <span className="serif text-gradient">under one roof.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/60">From Google rankings and AI search to ads, social and websites — one senior team, one plan, one monthly report.</p>
          <nav className="mt-12 flex flex-wrap gap-2" aria-label="Disciplines">
            {serviceGroups.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="rounded-full border border-white/12 px-4 py-2 text-[0.85rem] text-white/70 transition hover:border-mint/50 hover:text-white">
                {g.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="container-x divide-y divide-text/[0.08] py-10">
        {serviceGroups.map((g, gi) => {
          const Icon = serviceIcons[g.icon]
          return (
            <section key={g.id} id={g.id} className="grid gap-10 py-16 lg:grid-cols-[1fr_2fr]">
              <div className="reveal lg:sticky lg:top-28 lg:self-start">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-ink text-mint">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-mono text-[0.75rem] text-faint">0{gi + 1}</span>
                </div>
                <h2 className="mt-6 text-[clamp(1.8rem,3.2vw,2.6rem)] font-medium leading-[1.05]">{g.name}</h2>
                <p className="mt-3 max-w-sm text-muted">{g.text}</p>
                <Link href="/audit" className="mt-6 inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-mint-600 hover:underline">
                  Start with a free AI audit <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {g.items.map((s) => (
                  <article key={s.id} id={s.id} className="reveal card group flex scroll-mt-28 flex-col p-6 transition hover:border-mint/40">
                    <h3 className="text-[1.1rem] font-medium">{s.name}</h3>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">{s.text}</p>
                    <ChatButton
                      prompt={`Tell me about your ${s.name} service — what's included and what does it cost?`}
                      className="mt-auto inline-flex items-center gap-1 self-start pt-5 text-[0.85rem] font-medium text-mint-600"
                    >
                      Ask Digi about this <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </ChatButton>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <section className="pb-24">
        <div className="container-x">
          <div className="reveal relative overflow-hidden rounded-[32px] bg-ink p-10 text-white sm:p-14">
            <div className="glow pointer-events-none absolute inset-0" />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <span className="eyebrow text-mint/80">Not sure where to start?</span>
                <h2 className="mt-4 max-w-xl text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.05]">
                  Get a free audit and a <span className="serif text-gradient">90-day plan.</span>
                </h2>
                <p className="mt-4 max-w-lg text-white/60">We’ll recommend only the services that will move your numbers.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/audit" className="btn btn-mint btn-lg">
                  Run my free AI audit <ArrowRight className="size-4" />
                </Link>
                <Link href="/#contact" className="btn btn-ghost-dark btn-lg">
                  Talk to a strategist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
