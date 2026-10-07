import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react'
import { formatDate, getPost, getPosts } from '@/lib/blog'
import { site } from '@/lib/site'
import { ChatButton } from '@/components/chat-button'
import { LogoMark } from '@/components/ui'

export const dynamicParams = false

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: 'article', title: post.title, description: post.description, publishedTime: post.date },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug)
  if (!post) notFound()
  const related = getPosts().filter((p) => p.slug !== post.slug).slice(0, 2)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'Digitroot Team', url: site.url },
    publisher: { '@id': `${site.url}/#org` },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  }

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <header className="relative overflow-hidden bg-ink pb-16 pt-36 text-white sm:pt-44">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="glow pointer-events-none absolute inset-0 opacity-70" />
        <div className="container-x relative max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-[0.85rem] text-white/50 transition hover:text-white">
            <ArrowLeft className="size-4" /> All insights
          </Link>
          <span className="mt-8 block w-fit rounded-full bg-mint/15 px-3 py-1 text-[0.8rem] font-medium text-mint">{post.category}</span>
          <h1 className="mt-5 text-[clamp(2.1rem,5vw,3.8rem)] font-medium leading-[1.04] tracking-[-0.04em]">{post.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/60">{post.description}</p>
          <div className="mt-8 flex items-center gap-3 text-[0.85rem] text-white/50">
            <LogoMark className="size-8" />
            <span className="text-white">Digitroot Team</span>·<span>{formatDate(post.date)}</span>·<span>{post.readTime}</span>
          </div>
        </div>
      </header>

      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1fr_260px] lg:py-20">
        <div className="max-w-[720px]">
          <div className="prose-dr" dangerouslySetInnerHTML={{ __html: post.html }} />
          <div className="relative mt-16 overflow-hidden rounded-3xl bg-ink p-8 text-white sm:p-10">
            <div className="glow pointer-events-none absolute inset-0" />
            <div className="relative">
              <h2 className="text-2xl font-medium">Want us to do this for you?</h2>
              <p className="mt-2 text-white/60">Run a free AI audit of your website, then get a prioritised fix list from a strategist in 48 hours.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/audit" className="btn btn-mint">
                  Run my free AI audit <ArrowRight className="size-4" />
                </Link>
                <ChatButton prompt={`I just read "${post.title}". How would this apply to my business?`} className="btn btn-ghost-dark">
                  <MessageCircle className="size-4" /> Ask Digi about this
                </ChatButton>
              </div>
            </div>
          </div>
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            {post.toc.length > 0 && (
              <>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-faint">On this page</p>
                <ol className="mt-4 space-y-2.5 border-l border-text/10 text-[0.88rem]">
                  {post.toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="-ml-px block border-l border-transparent pl-4 text-muted transition hover:border-mint-600 hover:text-text">
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </>
            )}
            <div className="card mt-8 p-5">
              <p className="text-[0.92rem] font-medium">Free AI growth audit</p>
              <p className="mt-1 text-[0.82rem] text-muted">Score your site in 60 seconds.</p>
              <Link href="/audit" className="btn btn-ink mt-4 w-full py-2.5 text-[0.85rem]">
                Run audit <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-text/[0.07] bg-cloud py-20">
          <div className="container-x">
            <h2 className="text-3xl font-medium">
              Keep <span className="serif text-mint-600">reading</span>
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="card group p-7 transition hover:border-mint/40">
                  <span className="text-[0.8rem] text-muted">
                    {p.category} · {p.readTime}
                  </span>
                  <h3 className="mt-3 text-xl font-medium leading-snug">{p.title}</h3>
                  <span className="mt-4 inline-flex items-center gap-1 text-[0.85rem] font-medium text-mint-600">
                    Read <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
