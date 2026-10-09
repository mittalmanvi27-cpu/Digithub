import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { serviceGroups } from '@/lib/services'
import { serviceHref } from '@/lib/service-pages'
import { site, whatsappLink } from '@/lib/site'
import { Logo } from './ui'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white/60">
      <div className="container-x relative grid gap-12 border-t border-white/[0.07] py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo dark />
          <p className="mt-5 max-w-xs text-[0.92rem] leading-relaxed">{site.tagline}</p>
          <p className="mt-5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-white/35">Udyam-registered MSME · India</p>
        </div>
        <div>
          <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/35">Services</p>
          <ul className="space-y-2.5 text-[0.9rem]">
            {serviceGroups.slice(0, 7).map((g) => (
              <li key={g.id}>
                <Link href={serviceHref(g.id)} className="transition hover:text-white">
                  {g.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/35">Company</p>
          <ul className="space-y-2.5 text-[0.9rem]">
            {[
              ['/audit', 'Free AI audit'],
              ['/#pricing', 'Pricing'],
              ['/#why', 'Why Digitroot'],
              ['/#process', 'How we work'],
              ['/blog', 'Insights'],
              ['/#faq', 'FAQ'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/35">Contact</p>
          <ul className="space-y-2.5 text-[0.9rem]">
            <li>
              <a href={`mailto:${site.email}`} className="transition hover:text-white">
                {site.email}
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener" className="transition hover:text-white">
                WhatsApp {site.phone}
              </a>
            </li>
            <li>{site.hours}</li>
            <li className="flex gap-4 pt-2">
              <a href={site.linkedin} target="_blank" rel="noopener" className="inline-flex items-center gap-1 transition hover:text-white">
                LinkedIn <ArrowUpRight className="size-3.5" />
              </a>
              <a href={site.instagram} target="_blank" rel="noopener" className="inline-flex items-center gap-1 transition hover:text-white">
                Instagram <ArrowUpRight className="size-3.5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col justify-between gap-3 border-t border-white/[0.07] py-6 text-[0.8rem] text-white/35 sm:flex-row">
        <p>© {new Date().getFullYear()} Digitroot. All rights reserved.</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legal">
          <Link href="/privacy-policy" className="transition hover:text-white">Privacy policy</Link>
          <Link href="/terms" className="transition hover:text-white">Terms</Link>
          <span>Prices exclude GST. Results vary by market and starting point.</span>
        </nav>
      </div>
      <p aria-hidden="true" className="pointer-events-none select-none text-center text-[clamp(5rem,21vw,19rem)] font-semibold leading-[0.75] tracking-[-0.06em] text-white/[0.03]">
        digitroot
      </p>
    </footer>
  )
}
