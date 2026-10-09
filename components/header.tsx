'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { ArrowRight, ChevronDown, Menu, MessageCircle, Phone, X } from 'lucide-react'
import { serviceGroups, serviceCount } from '@/lib/services'
import { serviceHref } from '@/lib/service-pages'
import { site } from '@/lib/site'
import { Logo, serviceIcons } from './ui'
import { openChat } from './chat-widget'

const links = [
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#why', label: 'Why us' },
  { href: '/blog', label: 'Insights' },
  { href: '/#contact', label: 'Contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [open])

  // Ad landing pages: logo + call button only, so paid visitors aren't pulled away from the form.
  if (pathname.startsWith('/lp/')) {
    return (
      <header className={clsx('fixed inset-x-0 top-0 z-50 transition-[background] duration-500', scrolled ? 'border-b border-white/[0.07] bg-ink/85 backdrop-blur-xl' : 'bg-ink/0')}>
        <div className="container-x flex h-[68px] items-center justify-between gap-4">
          <span className="pointer-events-none">
            <Logo dark />
          </span>
          <a href={site.phoneHref} data-track="lp-header" className="btn btn-mint py-2.5 text-[0.88rem]">
            <Phone className="size-4" /> <span className="hidden sm:inline">Call</span> {site.phone}
          </a>
        </div>
      </header>
    )
  }

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-500',
        scrolled || open ? 'border-b border-white/[0.07] bg-ink/80 backdrop-blur-xl backdrop-saturate-150' : 'border-b border-transparent bg-ink/0',
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <div className="container-x flex h-[72px] items-center gap-6">
        <Logo dark />

        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Main">
          <div className="group relative">
            <Link href="/services" className="flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.92rem] text-white/75 transition hover:bg-white/5 hover:text-white">
              Services <ChevronDown className="size-3.5 transition group-hover:rotate-180 group-focus-within:rotate-180" />
            </Link>
            <div className="invisible absolute left-1/2 top-full w-[760px] -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-300 ease-out-expo group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-[1fr_240px] overflow-hidden rounded-3xl border border-white/10 bg-ink-2/95 shadow-[0_40px_80px_-20px_rgb(0_0_0/0.6)] backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-1 p-3">
                  {serviceGroups.map((g) => {
                    const Icon = serviceIcons[g.icon]
                    return (
                      <Link key={g.id} href={serviceHref(g.id)} className="group/item flex gap-3 rounded-2xl p-3 transition hover:bg-white/[0.05]">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-mint transition group-hover/item:border-mint/40">
                          <Icon className="size-4" />
                        </span>
                        <span>
                          <span className="block text-[0.9rem] font-medium text-white">{g.name}</span>
                          <span className="mt-0.5 line-clamp-2 block text-[0.78rem] leading-snug text-white/50">{g.short}</span>
                        </span>
                      </Link>
                    )
                  })}
                </div>
                <div className="flex flex-col justify-between border-l border-white/[0.07] bg-gradient-to-b from-mint/[0.08] to-transparent p-5">
                  <div>
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-mint">Free · 60 seconds</span>
                    <p className="mt-2 text-[1.05rem] font-medium leading-snug text-white">See what’s costing you enquiries — instantly.</p>
                    <p className="mt-2 text-[0.8rem] leading-relaxed text-white/50">Our AI audit checks SEO, AI-search readiness, speed and conversion on any website.</p>
                  </div>
                  <Link href="/audit" className="btn btn-mint mt-5 w-full text-[0.85rem]">
                    Run the AI audit <ArrowRight className="size-4" />
                  </Link>
                  <Link href="/services" className="mt-3 text-center text-[0.78rem] text-white/50 hover:text-white">
                    All {serviceCount}+ services →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Link href="/audit" className="flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.92rem] text-white/75 transition hover:bg-white/5 hover:text-white">
            AI Audit <span className="rounded-full bg-mint/15 px-1.5 py-px font-mono text-[0.6rem] uppercase tracking-wider text-mint">New</span>
          </Link>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full px-3.5 py-2 text-[0.92rem] text-white/75 transition hover:bg-white/5 hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={() => openChat()} className="btn btn-ghost-dark hidden py-2.5 text-[0.88rem] md:inline-flex">
            <MessageCircle className="size-4" /> Ask Digi
          </button>
          <Link href="/audit" className="btn btn-mint hidden py-2.5 text-[0.88rem] sm:inline-flex">
            Free AI audit <ArrowRight className="size-4" />
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-white/15 text-white lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="h-[calc(100dvh-72px)] overflow-y-auto border-t border-white/[0.07] bg-ink lg:hidden">
          <div className="container-x flex flex-col gap-1 py-6">
            <Link href="/audit" className="flex items-center justify-between rounded-2xl border border-mint/25 bg-mint/[0.07] px-4 py-4 text-white">
              <span>
                <span className="block font-medium">Free AI website audit</span>
                <span className="text-sm text-white/55">Instant report in 60 seconds</span>
              </span>
              <ArrowRight className="size-5 text-mint" />
            </Link>
            <p className="mt-6 px-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/40">Services</p>
            <div className="grid grid-cols-2 gap-1">
              {serviceGroups.map((g) => (
                <Link key={g.id} href={serviceHref(g.id)} className="rounded-xl px-3 py-2.5 text-[0.9rem] text-white/80 hover:bg-white/5">
                  {g.name}
                </Link>
              ))}
            </div>
            <div className="my-4 h-px bg-white/[0.07]" />
            {[{ href: '/services', label: 'All services' }, ...links].map((l) => (
              <Link key={l.href} href={l.href} className="rounded-xl px-3 py-3 text-lg text-white hover:bg-white/5">
                {l.label}
              </Link>
            ))}
            <div className="mt-6 grid gap-3">
              <button type="button" onClick={() => (setOpen(false), openChat())} className="btn btn-ghost-dark w-full">
                <MessageCircle className="size-4" /> Ask Digi, our AI assistant
              </button>
              <a href={site.phoneHref} className="btn btn-ghost-dark w-full">
                Call {site.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
