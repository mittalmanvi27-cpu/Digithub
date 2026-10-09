import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, KeyRound, Phone, ShieldCheck, Unlock, Zap } from 'lucide-react'
import { landingPageBySlug, landingPages } from '@/lib/landing-pages'
import { groupFor, servicePageBySlug } from '@/lib/service-pages'
import { site, whatsappLink } from '@/lib/site'
import { ContactForm } from '@/components/contact-form'
import { Pricing } from '@/components/pricing'
import { SectionHead, WhatsAppIcon } from '@/components/ui'

export const dynamicParams = false

export function generateStaticParams() {
  return landingPages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const lp = landingPageBySlug((await params).slug)
  if (!lp) return {}
  return {
    title: lp.title,
    description: lp.sub,
    // Ad landing pages stay out of Google's index so they don't compete with /services/* pages.
    robots: { index: false, follow: true },
    alternates: { canonical: `/services/${lp.servicePage}` },
  }
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const lp = landingPageBySlug((await params).slug)
  if (!lp) notFound()
  const sp = servicePageBySlug(lp.servicePage)!
  const group = groupFor(sp)

  return (
    <>
      {/* ---------- Hero + form above the fold ---------- */}
      <section className="relative overflow-hidden bg-ink pb-16 pt-28 text-white sm:pb-24 sm:pt-32">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="glow pointer-events-none absolute inset-0" />
        <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div>
            <span className="eyebrow text-mint/80">{lp.eyebrow}</span>
            <h1 className="mt-5 text-[clamp(2.4rem,5.6vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.045em]">
              {lp.headline} <span className="serif text-gradient">{lp.highlight}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">{lp.sub}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {lp.bullets.map((b) => (
                <li key={b} className="flex gap-2.5 text-[0.95rem] text-white/80">
                  <Check className="mt-0.5 size-5 shrink-0 text-mint" /> {b}
                </li>
              ))}
            </ul>
            <div className="mt-9 hidden flex-wrap items-center gap-x-6 gap-y-3 text-[0.9rem] lg:flex">
              <a href={site.phoneHref} data-track={`lp-hero:${lp.slug}`} className="inline-flex items-center gap-2 text-white transition hover:text-mint">
                <Phone className="size-4 text-mint" /> {site.phone}
              </a>
              <a href={whatsappLink(`Hi Digitroot, I'm interested in ${group.name}.`)} target="_blank" rel="noopener" data-track={`lp-hero:${lp.slug}`} className="inline-flex items-center gap-2 text-white transition hover:text-mint">
                <WhatsAppIcon className="size-4 text-mint" /> WhatsApp us
              </a>
            </div>
          </div>
          <div id="get-started" className="scroll-mt-24 overflow-hidden rounded-[28px] bg-paper text-text shadow-[0_40px_100px_-30px_rgb(0_0_0/0.6)]">
            <div className="border-b border-text/[0.07] px-6 pt-6 sm:px-7 sm:pt-7">
              <h2 className="text-[1.45rem] font-medium leading-tight">{lp.formTitle}</h2>
              <p className="mt-1.5 pb-5 text-[0.9rem] text-muted">Takes 20 seconds. A senior strategist replies within one working day.</p>
            </div>
            <ContactForm compact source={`lp:${lp.slug}`} service={lp.formService} cta={lp.cta} />
          </div>
        </div>
      </section>

      {/* ---------- Trust strip ---------- */}
      <section className="border-b border-text/[0.06] bg-paper py-8">
        <div className="container-x grid grid-cols-2 gap-6 text-[0.9rem] md:grid-cols-4">
          {[
            [Zap, 'Senior specialists only'],
            [Unlock, 'No lock-in contracts'],
            [KeyRound, 'You own every account'],
            [ShieldCheck, 'Udyam-registered MSME'],
          ].map(([Icon, t]) => {
            const I = Icon as typeof Zap
            return (
              <span key={t as string} className="flex items-center gap-2.5 text-muted">
                <I className="size-5 shrink-0 text-mint-600" /> {t as string}
              </span>
            )
          })}
        </div>
      </section>

      {/* ---------- What you get ---------- */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <SectionHead eyebrow="What you get" title={sp.h1} sub={sp.intro} />
          <div className="grid gap-4 md:grid-cols-3">
            {sp.outcomes.map((o, i) => (
              <div key={o.title} className="card p-7">
                <span className="font-mono text-[0.75rem] text-mint-600">0{i + 1}</span>
                <h3 className="mt-7 text-[1.3rem] font-medium leading-tight">{o.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{o.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="bg-cloud py-20 sm:py-24">
        <div className="container-x">
          <SectionHead eyebrow="How it works" title={<>Simple, <span className="serif text-mint-600">transparent</span> process.</>} />
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {sp.steps.map((s, i) => (
              <li key={s.title} className="card bg-white p-7">
                <span className="grid size-9 place-items-center rounded-full bg-ink font-mono text-[0.78rem] text-mint">{i + 1}</span>
                <h3 className="mt-6 text-xl font-medium">{s.title}</h3>
                <p className="mt-2.5 text-[0.92rem] leading-relaxed text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {sp.pricingTab && (
        <section className="py-20 sm:py-24">
          <div className="container-x">
            <SectionHead center eyebrow="Pricing" title={<>Clear pricing. <span className="serif text-mint-600">No</span> surprises.</>} />
            <Pricing only={sp.pricingTab} />
          </div>
        </section>
      )}

      {/* ---------- FAQ ---------- */}
      <section className="border-t border-text/[0.06] py-20 sm:py-24">
        <div className="container-x max-w-3xl">
          <h2 className="text-center text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.04]">
            Questions, <span className="serif text-mint-600">answered.</span>
          </h2>
          <div className="mt-10 divide-y divide-text/[0.08] border-y border-text/[0.08]">
            {sp.faqs.map((f) => (
              <details key={f.q} className="group py-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[1.05rem] font-medium">
                  {f.q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-text/10 text-muted transition group-open:rotate-45 group-open:border-mint-600 group-open:text-mint-600">+</span>
                </summary>
                <p className="mt-4 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="relative overflow-hidden bg-ink py-20 text-white">
        <div className="glow pointer-events-none absolute inset-0" />
        <div className="container-x relative flex flex-col items-center text-center">
          <h2 className="max-w-2xl text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.03]">
            Ready to <span className="serif text-gradient">grow?</span>
          </h2>
          <p className="mt-4 max-w-md text-white/60">Free, no-obligation. Reply within one working day.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#get-started" className="btn btn-mint btn-lg">{lp.cta}</a>
            <a href={site.phoneHref} data-track={`lp-final:${lp.slug}`} className="btn btn-ghost-dark btn-lg">
              <Phone className="size-4" /> Call {site.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Minimal footer — policy links are required by Google & Meta ad policies. */}
      <footer className="bg-ink pb-24 text-[0.8rem] text-white/40 md:pb-8">
        <div className="container-x flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] pt-6 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name} · {site.email}</p>
          <nav className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-white">Privacy policy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href={`/services/${sp.slug}`} className="hover:text-white">About this service</Link>
          </nav>
        </div>
      </footer>
    </>
  )
}
