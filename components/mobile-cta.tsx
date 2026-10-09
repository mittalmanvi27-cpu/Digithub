'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Phone } from 'lucide-react'
import { site, whatsappLink } from '@/lib/site'
import { WhatsAppIcon } from './ui'

/** Renders children everywhere except the distraction-free ad landing pages. */
export function HideOnLanding({ children }: { children: React.ReactNode }) {
  return usePathname().startsWith('/lp/') ? null : children
}

/**
 * Sticky call / WhatsApp / audit bar on phones — most Indian SMB enquiries
 * come from mobile, and one-tap contact is the highest-converting action.
 */
export function MobileCta() {
  const pathname = usePathname()
  if (pathname === '/thank-you') return null
  const lp = pathname.startsWith('/lp/')

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-[1fr_1fr_1.3fr] gap-2">
        <a href={site.phoneHref} data-track="mobile-bar" className="flex items-center justify-center gap-1.5 rounded-full border border-white/15 py-2.5 text-[0.85rem] font-medium text-white">
          <Phone className="size-4 text-mint" /> Call
        </a>
        <a href={whatsappLink('Hi Digitroot, I found you on your website.')} target="_blank" rel="noopener" data-track="mobile-bar" className="flex items-center justify-center gap-1.5 rounded-full border border-white/15 py-2.5 text-[0.85rem] font-medium text-white">
          <WhatsAppIcon className="size-4 text-[#25D366]" /> WhatsApp
        </a>
        {lp ? (
          <a href="#get-started" className="flex items-center justify-center gap-1 rounded-full bg-mint py-2.5 text-[0.85rem] font-semibold text-ink">
            Get started <ArrowRight className="size-4" />
          </a>
        ) : (
          <Link href="/audit" className="flex items-center justify-center gap-1 rounded-full bg-mint py-2.5 text-[0.85rem] font-semibold text-ink">
            Free audit <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
