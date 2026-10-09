'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { whatsappLink } from '@/lib/site'
import { trackLead } from '@/lib/track'
import { LEAD_DONE } from './contact-form'
import { WhatsAppIcon } from './ui'

/** Fires the lead conversion exactly once per submission (refreshes don't double-count). */
export function ThankYou() {
  const [lead, setLead] = useState<{ name?: string; whatsapp?: string } | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(LEAD_DONE)
      if (!raw) return
      sessionStorage.removeItem(LEAD_DONE)
      const data = JSON.parse(raw)
      trackLead(data.source || 'contact', data.service)
      setLead(data)
    } catch {}
  }, [])

  const first = lead?.name?.split(' ')[0]

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center text-center">
      <span className="grid size-16 place-items-center rounded-full bg-mint/15">
        <CheckCircle2 className="size-9 text-mint" />
      </span>
      <h1 className="mt-7 text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.04em]">
        Thanks{first ? `, ${first}` : ''} — <span className="serif text-gradient">we’ve got it.</span>
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-white/60">
        A senior strategist will reply within one working day (Mon–Sat) with a short proposal or a call slot. Want a faster answer?
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <a href={whatsappLink(lead?.whatsapp ?? 'Hi Digitroot, I just sent an enquiry on your website.')} target="_blank" rel="noopener" data-track="thank-you" className="btn btn-lg bg-[#25D366] text-white hover:bg-[#1fb955]">
          <WhatsAppIcon className="size-5" /> Continue on WhatsApp
        </a>
        <Link href="/audit" className="btn btn-ghost-dark btn-lg">
          Run a free AI audit meanwhile <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}
