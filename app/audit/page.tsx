import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Bot, Gauge, MousePointerClick, Search } from 'lucide-react'
import { AuditTool } from '@/components/audit-tool'

export const metadata: Metadata = {
  title: 'Free AI Website Audit — SEO, AI Search & Conversion Score',
  description:
    'Enter your website and get an instant AI audit: SEO, ChatGPT/Gemini readiness, speed and conversion checks, plus a prioritised fix list written by an AI strategist. Free, no signup.',
  alternates: { canonical: '/audit' },
}

const what = [
  { icon: Search, t: 'SEO foundations', d: 'Titles, descriptions, headings, content depth, indexability, canonicals and image alt text.' },
  { icon: Bot, t: 'AI-search readiness', d: 'Business schema, FAQ content, entity details and llms.txt — what ChatGPT and Gemini need to recommend you.' },
  { icon: MousePointerClick, t: 'Conversion', d: 'Calls to action, click-to-call, WhatsApp and enquiry forms — where visitors drop off.' },
  { icon: Gauge, t: 'Technical health', d: 'HTTPS, mobile viewport, response time, page weight, scripts, robots.txt and sitemap.' },
]

export default function AuditPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-24 pt-36 text-white sm:pt-44">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="glow pointer-events-none absolute inset-0" />
        <div className="container-x relative">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="eyebrow text-mint/80">Free AI audit · No signup</span>
            <h1 className="mt-5 text-[clamp(2.6rem,6.4vw,5rem)] font-medium leading-[0.98] tracking-[-0.045em]">
              What’s costing you <span className="serif text-gradient">enquiries?</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
              Enter your website. In about a minute you’ll get a growth score, 26 automated checks and a prioritised fix list written by our AI strategist.
            </p>
          </div>
          <Suspense>
            <AuditTool />
          </Suspense>
        </div>
      </section>
      <section className="py-24">
        <div className="container-x">
          <h2 className="reveal max-w-2xl text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-[1.05]">
            What the audit <span className="serif text-mint-600">checks</span>
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {what.map(({ icon: Icon, t, d }) => (
              <div key={t} className="reveal card p-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-mint-50 text-mint-600">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-6 text-lg font-medium">{t}</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[0.85rem] text-muted">
            We only read your public homepage, the same way Google does. Nothing is stored unless you ask for a manual review.
          </p>
        </div>
      </section>
    </>
  )
}
