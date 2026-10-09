import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ArrowUpRight, Check, ChevronRight, MessageCircle } from 'lucide-react'
import { groupFor, serviceHref, servicePageBySlug, servicePages } from '@/lib/service-pages'
import { pricing } from '@/lib/pricing'
import { site, whatsappLink } from '@/lib/site'
import { getPost } from '@/lib/blog'
import { Pricing } from '@/components/pricing'
import { ContactForm } from '@/components/contact-form'
import { ChatButton } from '@/components/chat-button'
import { HeroAuditForm } from '@/components/hero-audit-form'
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/json-ld'
import { SectionHead, serviceIcons, WhatsAppIcon } from '@/components/ui'

export const dynamicParams = false

export function generateStaticParams() {
  return servicePages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = servicePageBySlug((await params).slug)
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/services/${page.slug}` },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: 'en_IN',
      url: `/services/${page.slug}`,
      title: page.h1,
      description: page.description,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: page.h1 }],
    },
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const page = servicePageBySlug((await params).slug)
  if (!page) notFound()
  const group = groupFor(page)
  const Icon = serviceIcons[group.icon]
  const tab = page.pricingTab ? pricing.find((t) => t.id === page.pricingTab) : undefined
  const posts = page.relatedPosts.map(getPost).filter((p) => !!p)
  const others = servicePages.filter((p) => p.slug !== page.slug)

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${site.url}/services/${page.slug}#service`,
    name: group.name,
    serviceType: group.name,
    description: page.description,
    url: `${site.url}/services/${page.slug}`,
    provider: { '@id': `${site.url}/#org` },
    areaServed: { '@type': 'Country', name: 'India' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: group.name,
      itemListElement: group.items.map((i) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: i.name, description: i.text } })),
    },
    ...(tab && {
      offers: tab.plans.map((p) => ({
        '@type': 'Offer',
        name: `${tab.label} — ${p.name}`,
        price: p.price.replace(/[^\d]/g, ''),
        priceCurrency: 'INR',
        description: p.features.join(', '),
      })),
    }),
  }

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema(page.faqs)} />
      <JsonLd data={breadcrumbSchema([{ name: 'Services', path: '/services' }, { name: group.name, path: `/services/${page.slug}` }])} />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-ink pb-20 pt-32 text-white sm:pt-40">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="glow pointer-events-none absolute inset-0" />
        <div className="container-x relative">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[0.82rem] text-white/45">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="size-3.5" />
            <Link href="/services" className="hover:text-white">Services</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-white/75" aria-current="page">{group.name}</span>
          </nav>
          <div className="mt-10 grid items-end gap-12 lg:grid-cols-[1.25fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[0.82rem] text-white/70">
                <Icon className="size-4 text-mint" /> {group.name}
              </span>
              <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.8rem)] font-medium leading-[0.98] tracking-[-0.045em]">{page.h1}</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">{page.intro}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="#contact" className="btn btn-mint btn-lg">
                  Get a free proposal <ArrowRight className="size-4" />
                </Link>
                <a href={whatsappLink(`Hi Digitroot, I'd like to know more about ${group.name}.`)} target="_blank" rel="noopener" data-track={`service-hero:${page.slug}`} className="btn btn-ghost-dark btn-lg">
                  <WhatsAppIcon className="size-5" /> WhatsApp us
                </a>
              </div>
              {tab && (
                <p className="mt-6 text-[0.88rem] text-white/45">
                  Plans from <span className="font-medium text-white">{tab.plans[0].price}</span> {tab.plans[0].unit} · No lock-in · Prices excl. GST
                </p>
              )}
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md sm:p-7">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mint">This is for you if…</p>
              <ul className="mt-5 space-y-3.5">
                {page.forWho.map((w) => (
                  <li key={w} className="flex gap-3 text-[0.95rem] leading-relaxed text-white/75">
                    <Check className="mt-1 size-4 shrink-0 text-mint" /> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Outcomes ---------- */}
      <section className="py-24 sm:py-28">
        <div className="container-x">
          <SectionHead eyebrow="What you get" title={<>Built around <span className="serif text-mint-600">results,</span> not reports.</>} />
          <div className="grid gap-4 md:grid-cols-3">
            {page.outcomes.map((o, i) => (
              <div key={o.title} className="reveal card p-7">
                <span className="font-mono text-[0.75rem] text-mint-600">0{i + 1}</span>
                <h2 className="mt-8 text-[1.35rem] font-medium leading-tight">{o.title}</h2>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{o.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Included services ---------- */}
      <section className="bg-cloud py-24 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div className="reveal lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow">What’s included</span>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1.04]">
              {group.items.length} ways we <span className="serif text-mint-600">grow</span> you
            </h2>
            <p className="mt-5 max-w-sm text-muted">{group.text} We recommend only what will move your numbers after a free audit.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.items.map((s) => (
              <article key={s.id} id={s.id} className="reveal card flex scroll-mt-28 flex-col bg-white p-6">
                <h3 className="text-[1.08rem] font-medium">{s.name}</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">{s.text}</p>
                <ChatButton prompt={`Tell me about your ${s.name} service — what's included and what does it cost?`} className="mt-auto inline-flex items-center gap-1 self-start pt-5 text-[0.85rem] font-medium text-mint-600">
                  Ask Digi about this <ArrowUpRight className="size-4" />
                </ChatButton>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="py-24 sm:py-28">
        <div className="container-x">
          <SectionHead eyebrow="How it works" title={<>From audit to <span className="serif text-mint-600">enquiries.</span></>} />
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {page.steps.map((s, i) => (
              <li key={s.title} className="reveal card p-7">
                <span className="grid size-9 place-items-center rounded-full bg-ink font-mono text-[0.78rem] text-mint">{i + 1}</span>
                <h3 className="mt-7 text-xl font-medium">{s.title}</h3>
                <p className="mt-2.5 text-[0.92rem] leading-relaxed text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Pricing ---------- */}
      {tab && (
        <section id="pricing" className="border-t border-text/[0.06] py-24 sm:py-28">
          <div className="container-x">
            <SectionHead center eyebrow="Pricing" title={<>{tab.label} plans, <span className="serif text-mint-600">clearly</span> priced.</>} sub="Choose a starting point — every plan is refined after your free audit." />
            <Pricing only={tab.id} />
          </div>
        </section>
      )}

      {/* ---------- Audit CTA ---------- */}
      <section className="relative overflow-hidden bg-ink py-20 text-white">
        <div className="glow pointer-events-none absolute inset-0 opacity-70" />
        <div className="container-x relative flex flex-col items-center text-center">
          <span className="eyebrow text-mint/80">Free · 60 seconds</span>
          <h2 className="mt-5 max-w-2xl text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.05]">
            See where your website is <span className="serif text-gradient">losing enquiries.</span>
          </h2>
          <div className="mt-9 w-full">
            <HeroAuditForm />
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="py-24 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div className="reveal">
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1.04]">
              {group.name}, <span className="serif text-mint-600">answered.</span>
            </h2>
            <p className="mt-5 text-muted">Ask our AI assistant anything else about this service, or talk to a human on WhatsApp.</p>
            <ChatButton prompt={`I have a question about your ${group.name} service.`} className="btn btn-ink mt-8">
              <MessageCircle className="size-4" /> Ask Digi
            </ChatButton>
          </div>
          <div className="divide-y divide-text/[0.08] border-y border-text/[0.08]">
            {page.faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="group py-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[1.08rem] font-medium">
                  <h3>{f.q}</h3>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-text/10 text-muted transition group-open:rotate-45 group-open:border-mint-600 group-open:text-mint-600">+</span>
                </summary>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Related reading + other services (internal links) ---------- */}
      <section className="border-t border-text/[0.06] bg-cloud py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          {posts.length > 0 && (
            <div>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-faint">Related guides</p>
              <div className="mt-5 space-y-3">
                {posts.map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="card group flex items-center justify-between gap-4 bg-white p-5 transition hover:border-mint/40">
                    <span className="font-medium leading-snug">{p.title}</span>
                    <ArrowUpRight className="size-4 shrink-0 text-mint-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className={posts.length ? '' : 'lg:col-span-2'}>
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-faint">Other services</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {others.map((p) => (
                <Link key={p.slug} href={serviceHref(p.groupId)} className="rounded-full border border-text/10 bg-white px-4 py-2 text-[0.88rem] text-muted transition hover:border-mint-600 hover:text-text">
                  {groupFor(p).name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section id="contact" className="relative overflow-hidden bg-ink py-24 text-white sm:py-28">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
        <div className="glow pointer-events-none absolute inset-0" />
        <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="reveal">
            <span className="eyebrow text-mint/80">Free proposal</span>
            <h2 className="mt-5 text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[0.98]">
              Let’s plan your <span className="serif text-gradient">growth.</span>
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/60">
              Tell us about your business. A senior strategist replies within one working day with a short {group.name.toLowerCase()} proposal or a call slot.
            </p>
            <a href={site.phoneHref} data-track={`service-contact:${page.slug}`} className="mt-8 inline-flex items-center gap-2 text-lg text-white transition hover:text-mint">
              Or call {site.phone}
            </a>
          </div>
          <div className="reveal overflow-hidden rounded-[28px] bg-paper text-text shadow-[0_40px_100px_-30px_rgb(0_0_0/0.6)]">
            <ContactForm source={`service:${page.slug}`} service={page.formService} />
          </div>
        </div>
      </section>
    </>
  )
}
