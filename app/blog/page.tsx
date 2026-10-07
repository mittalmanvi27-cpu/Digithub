import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { formatDate, getPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Insights — SEO, AI Search & Google Ads Guides',
  description: 'Practical guides on SEO, AI search optimisation (GEO / AEO), Google Business Profile and Google Ads for growing Indian businesses.',
  alternates: { canonical: '/blog' },
}

export default function BlogIndex() {
  const [first, ...rest] = getPosts()
  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-20 pt-36 text-white sm:pt-44">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="glow pointer-events-none absolute inset-0" />
        <div className="container-x relative">
          <span className="eyebrow text-mint/80">Insights</span>
          <h1 className="mt-5 max-w-3xl text-[clamp(2.6rem,6.4vw,5rem)] font-medium leading-[0.98] tracking-[-0.045em]">
            Marketing & AI search, <span className="serif text-gradient">explained.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/60">No fluff. Practical playbooks we use with clients, written for business owners.</p>
        </div>
      </section>
      <section className="py-16 sm:py-24">
        <div className="container-x">
          {first && (
            <Link href={`/blog/${first.slug}`} className="reveal card group mb-6 grid gap-6 p-8 transition hover:border-mint/40 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <div className="flex items-center gap-3 text-[0.8rem] text-muted">
                  <span className="rounded-full bg-mint-50 px-2.5 py-1 font-medium text-mint-600">{first.category}</span>
                  {formatDate(first.date)} · {first.readTime}
                </div>
                <h2 className="mt-6 text-[clamp(1.7rem,3.4vw,2.6rem)] font-medium leading-[1.08]">{first.title}</h2>
              </div>
              <div>
                <p className="leading-relaxed text-muted">{first.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-[0.9rem] font-medium text-mint-600">
                  Read article <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          )}
          <div className="grid gap-6 md:grid-cols-2">
            {rest.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="reveal card group flex flex-col p-8 transition hover:-translate-y-1 hover:border-mint/40">
                <div className="flex items-center gap-3 text-[0.8rem] text-muted">
                  <span className="rounded-full bg-mint-50 px-2.5 py-1 font-medium text-mint-600">{p.category}</span>
                  {formatDate(p.date)} · {p.readTime}
                </div>
                <h2 className="mt-6 text-[1.4rem] font-medium leading-snug">{p.title}</h2>
                <p className="mt-3 leading-relaxed text-muted">{p.description}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-6 text-[0.9rem] font-medium text-mint-600">
                  Read article <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
