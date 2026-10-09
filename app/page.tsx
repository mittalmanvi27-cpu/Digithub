import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Check, Clock, KeyRound, Mail, MessageCircle, Phone, ShieldCheck, Sparkles, TrendingUp, Unlock, X, Zap } from 'lucide-react'
import { HeroAuditForm } from '@/components/hero-audit-form'
import { NeuralBackground } from '@/components/neural-bg'
import { RagDemo } from '@/components/rag-demo'
import { Calculator } from '@/components/calculator'
import { Pricing } from '@/components/pricing'
import { ContactForm } from '@/components/contact-form'
import { ChatButton } from '@/components/chat-button'
import { SectionHead, serviceIcons, WhatsAppIcon } from '@/components/ui'
import { serviceGroups, aiSearchFeatures, serviceCount } from '@/lib/services'
import { comparison, faqs, industries, platforms, processSteps, site, whatsappLink } from '@/lib/site'
import { formatDate, getPosts } from '@/lib/blog'
import { serviceHref } from '@/lib/service-pages'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}

export default function Home() {
  const posts = getPosts().slice(0, 3)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-ink pb-24 pt-36 text-white sm:pt-44">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
        <div className="glow pointer-events-none absolute inset-0" />
        <NeuralBackground className="absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,#000_30%,transparent_85%)]" />
        <div className="container-x relative flex flex-col items-center text-center">
          <Link href="/audit" className="group mb-8 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-[0.82rem] text-white/75 backdrop-blur transition hover:border-mint/40">
            <span className="rounded-full bg-mint px-2 py-0.5 font-mono text-[0.64rem] font-medium uppercase tracking-wider text-ink">New</span>
            Instant AI audit for any website
            <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
          </Link>
          <h1 className="max-w-5xl text-[clamp(2.9rem,8.4vw,6.6rem)] font-medium leading-[0.95] tracking-[-0.05em]">
            Get found. Get <span className="serif text-gradient pr-1">chosen.</span>
            <br className="hidden sm:block" /> Get growing.
          </h1>
          <p className="mt-7 max-w-2xl text-[clamp(1.05rem,1.6vw,1.25rem)] leading-relaxed text-white/60">
            Digitroot is a senior-led growth studio for SEO, AI search, ads and websites — built to make Google, ChatGPT and Gemini send you customers, and measured in real enquiries.
          </p>
          <div className="mt-10 flex w-full flex-col items-center">
            <HeroAuditForm />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.85rem] text-white/50">
              {[
                [Zap, 'Report in 60 seconds'],
                [Unlock, 'No lock-in contracts'],
                [KeyRound, 'You own every account'],
              ].map(([Icon, t]) => {
                const I = Icon as typeof Zap
                return (
                  <span key={t as string} className="flex items-center gap-2">
                    <I className="size-4 text-mint" /> {t as string}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Product visual */}
          <div className="relative mt-20 w-full max-w-5xl">
            <div className="absolute -inset-x-10 -top-10 bottom-0 bg-[radial-gradient(closest-side,rgb(63_201_160/0.18),transparent)]" />
            <div className="relative grid gap-4 rounded-[32px] border border-white/10 bg-white/[0.03] p-3 text-left backdrop-blur-md sm:p-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/[0.07] bg-ink-2 p-5">
                <div className="flex items-center gap-2 text-[0.78rem] text-white/45">
                  <span className="grid size-6 place-items-center rounded-full bg-white text-[0.72rem] font-bold text-[#4285F4]">G</span> dentist near me
                </div>
                <p className="mt-5 text-[2.6rem] font-medium leading-none tracking-[-0.04em]">#1</p>
                <p className="mt-2 text-[0.85rem] text-white/55">on Google Maps</p>
                <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-mint/12 px-2.5 py-1 font-mono text-[0.72rem] text-mint">
                  <TrendingUp className="size-3.5" /> up 8 positions
                </p>
              </div>
              <div className="rounded-3xl border border-white/[0.07] bg-ink-2 p-5">
                <div className="flex items-center gap-2 text-[0.78rem] text-white/45">
                  <Sparkles className="size-4 text-mint" /> AI assistant answer
                </div>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-white/80">
                  “For a 3BHK interior in Pune, a top pick is <span className="rounded bg-mint/15 px-1 text-mint">YourStudio</span> — rated 4.9 with detailed reviews…”
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {['yourstudio.in', 'google.com/maps'].map((s) => (
                    <span key={s} className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[0.66rem] text-white/45">{s}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/[0.07] bg-ink-2 p-5">
                <div className="flex items-center justify-between text-[0.78rem] text-white/45">
                  Enquiries this month <span className="font-mono text-mint">+64</span>
                </div>
                <svg viewBox="0 0 200 80" className="mt-5 h-24 w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#3FC9A0" stopOpacity=".35" />
                      <stop offset="1" stopColor="#3FC9A0" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 70 L25 64 L50 66 L75 52 L100 54 L125 38 L150 34 L175 18 L200 10 L200 80 L0 80Z" fill="url(#spark)" />
                  <path d="M0 70 L25 64 L50 66 L75 52 L100 54 L125 38 L150 34 L175 18 L200 10" fill="none" stroke="#3FC9A0" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="200" cy="10" r="3.5" fill="#3FC9A0" />
                </svg>
                <p className="mt-2 text-[0.75rem] text-white/40">Calls · forms · WhatsApp, tracked</p>
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/30">Illustrative example</p>
          </div>
        </div>
      </section>

      {/* ---------- Platforms marquee ---------- */}
      <section className="overflow-hidden border-y border-white/[0.06] bg-ink py-7" aria-label="Platforms we grow you on">
        <div className="flex w-max animate-marquee gap-12 pr-12 hover:[animation-play-state:paused]">
          {[...platforms, ...platforms].map((p, i) => (
            <span key={i} className="flex items-center gap-12 whitespace-nowrap text-[1.05rem] text-white/40">
              {p} <span className="size-1 rounded-full bg-mint/50" />
            </span>
          ))}
        </div>
      </section>

      {/* ---------- Belief ---------- */}
      <section className="py-24 sm:py-32">
        <div className="container-x reveal">
          <span className="eyebrow">Our belief</span>
          <p className="mt-6 max-w-5xl text-[clamp(1.8rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.035em]">
            Most businesses don’t need more marketing. They need the <span className="serif text-mint-600">right</span> marketing — set up properly, measured honestly, and improved every single month.
          </p>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section id="services" className="pb-24 sm:pb-32">
        <div className="container-x">
          <SectionHead eyebrow="What we do" title={<>Eight disciplines. <span className="serif text-mint-600">One</span> senior team.</>} sub="One plan built around where your enquiries actually come from — not a menu of disconnected services.">
            <Link href="/services" className="btn btn-ghost shrink-0">
              All {serviceCount}+ services <ArrowRight className="size-4" />
            </Link>
          </SectionHead>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceGroups.map((g, i) => {
              const Icon = serviceIcons[g.icon]
              const featured = i < 2
              return (
                <Link
                  key={g.id}
                  href={serviceHref(g.id)}
                  className={`reveal group relative flex flex-col overflow-hidden rounded-3xl border p-6 transition duration-500 hover:-translate-y-1 ${
                    featured ? 'border-white/[0.06] bg-ink text-white lg:col-span-2 lg:min-h-[260px]' : `card min-h-[240px] hover:border-mint/40 ${i >= 6 ? 'lg:col-span-2' : ''}`
                  }`}
                >
                  {featured && <div className="glow pointer-events-none absolute inset-0 opacity-50" />}
                  <div className="relative flex items-start justify-between">
                    <span className={`grid size-11 place-items-center rounded-2xl ${featured ? 'bg-mint text-ink' : 'bg-mint-50 text-mint-600'}`}>
                      <Icon className="size-5" />
                    </span>
                    <span className={`font-mono text-[0.72rem] ${featured ? 'text-white/35' : 'text-faint'}`}>0{i + 1}</span>
                  </div>
                  <div className="relative mt-auto pt-10">
                    <h3 className="text-[1.25rem] font-medium leading-tight">{g.name}</h3>
                    <p className={`mt-2 text-[0.92rem] leading-relaxed ${featured ? 'max-w-md text-white/60' : 'text-muted'}`}>{g.short}</p>
                    <span className={`mt-4 inline-flex items-center gap-1 text-[0.85rem] font-medium ${featured ? 'text-mint' : 'text-mint-600'}`}>
                      Explore <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------- AI search ---------- */}
      <section id="ai-search" className="relative overflow-hidden bg-ink py-24 text-white sm:py-32">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
          <div className="reveal">
            <span className="eyebrow text-mint/80">AI search optimisation</span>
            <h2 className="mt-5 text-[clamp(2.1rem,4.6vw,3.6rem)] font-medium leading-[1.02]">
              Be the answer when buyers <span className="serif text-gradient">ask AI.</span>
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/60">
              Your customers now ask ChatGPT, Gemini and Perplexity who to hire. We make sure your business is the one they recommend — and cite.
            </p>
            <dl className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2">
              {aiSearchFeatures.map((f) => (
                <div key={f.k} className="bg-ink-2 p-5">
                  <dt className="font-mono text-[0.75rem] uppercase tracking-wider text-mint">{f.k}</dt>
                  <dd className="mt-1.5 text-[0.88rem] leading-relaxed text-white/60">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="reveal">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-3 backdrop-blur">
              <div className="rounded-3xl bg-paper p-6 text-text sm:p-8">
                <div className="flex items-center gap-2 text-[0.8rem] text-muted">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-mint-600" />
                  </span>
                  AI assistant · answering
                </div>
                <p className="mt-5 ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-3 text-[0.95rem] text-white">Who’s the best interior designer in Pune for a 3BHK?</p>
                <div className="mt-4 max-w-[92%] rounded-2xl rounded-bl-md border border-text/[0.07] bg-white p-4 text-[0.95rem] leading-relaxed text-[#2a3445]">
                  Based on reviews and recent projects, <b className="text-text">YourStudio</b> stands out for 3BHK interiors in Pune — known for transparent pricing, 4.9★ from 180+ reviews and on-time handovers.
                  <div className="mt-3 flex flex-wrap gap-1.5 border-t border-text/[0.06] pt-3">
                    {['yourstudio.in', 'google.com/maps', 'houzz.in'].map((s, i) => (
                      <span key={s} className="inline-flex items-center gap-1 rounded-full bg-cloud px-2.5 py-1 font-mono text-[0.68rem] text-muted">
                        <span className="grid size-4 place-items-center rounded-full bg-white text-[0.58rem]">{i + 1}</span> {s}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-faint">Illustrative example</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/audit" className="btn btn-mint">
                Check my AI visibility <ArrowRight className="size-4" />
              </Link>
              <Link href="/blog/geo-chatgpt-seo-guide" className="btn btn-ghost-dark">
                Read the GEO guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Under the hood (RAG) ---------- */}
      <section id="under-the-hood" className="relative overflow-hidden border-t border-white/[0.06] bg-ink py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_circle_at_50%_0%,rgb(63_201_160/0.12),transparent_70%)]" />
        <div className="container-x relative">
          <SectionHead
            dark
            center
            eyebrow="Under the hood"
            title={<>Not a template. An AI system <span className="serif text-gradient">we engineered.</span></>}
            sub="Digi doesn’t guess. Every answer runs through a retrieval-augmented generation (RAG) pipeline over our own knowledge base. Try it — this playground runs the real retrieval engine live."
          />
          <RagDemo />
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section id="process" className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHead eyebrow="The growth loop" title={<>Attract. Convert. <span className="serif text-mint-600">Measure.</span> Repeat.</>} sub="Every engagement starts with an audit and a 90-day roadmap, then runs on this loop — so growth compounds month after month." />
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((s) => (
              <li key={s.n} className="reveal card relative p-7">
                <span className="font-mono text-[0.75rem] text-mint-600">{s.n}</span>
                <h3 className="mt-8 text-2xl font-medium">{s.title}</h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">{s.text}</p>
                <span className="mt-6 inline-block rounded-full bg-cloud px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted">{s.tag}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Calculator ---------- */}
      <section id="calculator" className="bg-cloud py-24 sm:py-32">
        <div className="container-x">
          <SectionHead eyebrow="Growth calculator" title={<>What could growth be <span className="serif text-mint-600">worth</span> to you?</>} sub="Move the sliders to match your business. We’ll estimate what a realistic lift in traffic and conversion could add each month." />
          <div className="reveal">
            <Calculator />
          </div>
        </div>
      </section>

      {/* ---------- Pricing ---------- */}
      <section id="pricing" className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHead center eyebrow="Pricing" title={<>Clear pricing. <span className="serif text-mint-600">No</span> surprises.</>} sub="Choose a starting point — every plan is refined after your free audit." />
          <Pricing />
        </div>
      </section>

      {/* ---------- Why ---------- */}
      <section id="why" className="relative overflow-hidden bg-ink py-24 text-white sm:py-32">
        <div className="glow pointer-events-none absolute inset-0 opacity-50" />
        <div className="container-x relative">
          <SectionHead dark eyebrow="Why Digitroot" title={<>A small team, <span className="serif text-gradient">on purpose.</span></>} sub="Big agencies hand small accounts to the newest hire. Here, the people you speak to are the people doing the work." />
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="reveal overflow-hidden rounded-3xl border border-white/[0.08]">
              <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-white/[0.04] px-5 py-4 font-mono text-[0.7rem] uppercase tracking-wider text-white/45 sm:px-7">
                <span />
                <span className="text-mint">Digitroot</span>
                <span>Typical agency</span>
              </div>
              {comparison.map((c) => (
                <div key={c.row} className="grid grid-cols-[1.2fr_1fr_1fr] items-center gap-3 border-t border-white/[0.06] px-5 py-4 text-[0.88rem] sm:px-7 sm:text-[0.95rem]">
                  <span className="text-white/60">{c.row}</span>
                  <span className="flex items-start gap-2 font-medium">
                    <Check className="mt-0.5 size-4 shrink-0 text-mint" /> {c.us}
                  </span>
                  <span className="flex items-start gap-2 text-white/40">
                    <X className="mt-0.5 size-4 shrink-0" /> {c.them}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-6">
              <div className="reveal card-dark p-7">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/40">Industries we love</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {industries.map((i) => (
                    <span key={i} className="rounded-full border border-white/10 px-3 py-1.5 text-[0.82rem] text-white/70">{i}</span>
                  ))}
                </div>
              </div>
              <div className="reveal relative overflow-hidden rounded-3xl border border-mint/30 bg-gradient-to-br from-mint/15 to-transparent p-7">
                <span className="inline-flex items-center gap-2 rounded-full bg-mint px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-wider text-ink">
                  Limited · 5 spots
                </span>
                <h3 className="mt-5 text-2xl font-medium">The Founding Partner Programme</h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-white/65">
                  Our first five partners get 20% off for the first three months — in exchange for honest feedback and a case study once you see results.
                </p>
                <Link href="/#contact" className="btn btn-mint mt-6">
                  Apply for a spot <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Insights ---------- */}
      <section id="insights" className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHead eyebrow="Insights" title={<>Marketing & AI search, <span className="serif text-mint-600">explained.</span></>}>
            <Link href="/blog" className="btn btn-ghost shrink-0">
              All articles <ArrowRight className="size-4" />
            </Link>
          </SectionHead>
          <div className="grid gap-5 md:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="reveal card group flex flex-col p-7 transition hover:-translate-y-1 hover:border-mint/40">
                <div className="flex items-center gap-3 text-[0.78rem] text-muted">
                  <span className="rounded-full bg-mint-50 px-2.5 py-1 font-medium text-mint-600">{p.category}</span>
                  {formatDate(p.date)}
                </div>
                <h3 className="mt-6 text-[1.25rem] font-medium leading-snug">{p.title}</h3>
                <p className="mt-3 line-clamp-3 text-[0.9rem] leading-relaxed text-muted">{p.description}</p>
                <span className="mt-auto flex items-center gap-1 pt-6 text-[0.85rem] font-medium text-mint-600">
                  Read · {p.readTime} <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="border-t border-text/[0.06] py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div className="reveal">
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-5 text-[clamp(2.1rem,4.6vw,3.6rem)] font-medium leading-[1.02]">
              Questions, <span className="serif text-mint-600">answered.</span>
            </h2>
            <p className="mt-5 text-muted">Still curious? Our AI assistant knows our services, pricing and process inside out — or talk to a human.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ChatButton className="btn btn-ink">
                <MessageCircle className="size-4" /> Ask Digi
              </ChatButton>
              <a href={whatsappLink()} target="_blank" rel="noopener" className="btn btn-ghost">
                <WhatsAppIcon className="size-4" /> WhatsApp
              </a>
            </div>
          </div>
          <div className="divide-y divide-text/[0.08] border-y border-text/[0.08]">
            {faqs.map((f) => (
              <details key={f.q} className="group py-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[1.08rem] font-medium">
                  {f.q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-text/10 text-muted transition group-open:rotate-45 group-open:border-mint-600 group-open:text-mint-600">+</span>
                </summary>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section id="contact" className="relative overflow-hidden bg-ink py-24 text-white sm:py-32">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
        <div className="glow pointer-events-none absolute inset-0" />
        <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="reveal">
            <span className="eyebrow text-mint/80">Let’s talk</span>
            <h2 className="mt-5 text-[clamp(2.4rem,5.4vw,4.4rem)] font-medium leading-[0.98]">
              Let’s grow something <span className="serif text-gradient">real.</span>
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/60">Tell us a little about your business. A senior strategist replies within one working day with a short proposal or a call slot.</p>
            <ul className="mt-10 space-y-5">
              {[
                [Mail, 'Email', site.email, `mailto:${site.email}`],
                [Phone, 'Phone / WhatsApp', site.phone, whatsappLink()],
                [Clock, 'Hours', site.hours, null],
                [ShieldCheck, 'Your data', 'Never shared or sold', null],
              ].map(([Icon, k, v, href]) => {
                const I = Icon as typeof Mail
                return (
                  <li key={k as string} className="flex items-center gap-4">
                    <span className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-mint">
                      <I className="size-5" />
                    </span>
                    <span>
                      <span className="block text-[0.78rem] text-white/40">{k as string}</span>
                      {href ? (
                        <a href={href as string} className="text-white transition hover:text-mint">{v as string}</a>
                      ) : (
                        <span className="text-white">{v as string}</span>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="reveal overflow-hidden rounded-[28px] bg-paper text-text shadow-[0_40px_100px_-30px_rgb(0_0_0/0.6)]">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
