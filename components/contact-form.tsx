'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'
import { getAttribution } from '@/lib/track'

type Prefill = { service?: string; message?: string }
const EVENT = 'lead:prefill'
const STORE = 'dr_prefill'
/** Handed to /thank-you, which fires the conversion once and offers WhatsApp. */
export const LEAD_DONE = 'dr_lead_done'

export const SERVICES = ['Not sure yet', 'SEO', 'AI Search Optimisation', 'Google / Meta Ads', 'Website Design', 'SEO + Ads bundle', 'Social Media', 'Founding Partner Programme']
const BUDGETS = ['Prefer not to say', 'Under ₹10,000 / month', '₹10,000 – ₹25,000 / month', '₹25,000 – ₹50,000 / month', '₹50,000+ / month']

/** Pre-fill the enquiry form (from pricing, calculator, etc.) and scroll to it — or go to it from another page. */
export function prefillLead(p: Prefill) {
  const form = document.getElementById('contact-form') ?? document.getElementById('lead-form')
  if (form) {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: p }))
    const section = document.getElementById('contact')
    if (section) section.scrollIntoView({ behavior: 'smooth' })
    else form.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } else {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(p))
    } catch {}
    window.location.href = '/#contact'
  }
}

/**
 * Enquiry form. `compact` (ad landing pages) asks only for name, phone and
 * website — fewer fields, more conversions — with the service fixed.
 */
export function ContactForm({
  source = 'contact',
  compact = false,
  service,
  cta = 'Send me a proposal',
}: {
  source?: string
  compact?: boolean
  service?: string
  cta?: string
}) {
  const form = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    const apply = (p: Prefill) => {
      const f = form.current
      if (!f) return
      if (p.service && f.elements.namedItem('service') instanceof HTMLSelectElement) {
        const sel = f.elements.namedItem('service') as HTMLSelectElement
        const match = SERVICES.find((s) => s.toLowerCase() === p.service!.toLowerCase()) ?? SERVICES.find((s) => s.toLowerCase().includes(p.service!.toLowerCase().split(' ')[0]))
        if (match) sel.value = match
      }
      const msg = f.elements.namedItem('message')
      if (p.message && msg instanceof HTMLTextAreaElement) msg.value = p.message
      setTimeout(() => (f.elements.namedItem('name') as HTMLInputElement).focus({ preventScroll: true }), 600)
    }
    try {
      const stored = sessionStorage.getItem(STORE)
      if (stored) {
        sessionStorage.removeItem(STORE)
        apply(JSON.parse(stored))
      }
    } catch {}
    const onPrefill = (e: Event) => apply((e as CustomEvent<Prefill>).detail)
    window.addEventListener(EVENT, onPrefill)
    return () => window.removeEventListener(EVENT, onPrefill)
  }, [])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    setState('sending')
    setError('')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source, attribution: getAttribution() }),
      })
      const out = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(out.error || 'Something went wrong.')
      try {
        sessionStorage.setItem(
          LEAD_DONE,
          JSON.stringify({
            source,
            service: data.service,
            name: data.name,
            whatsapp: `Hi Digitroot, I'm ${data.name}. I just sent an enquiry about ${data.service || 'your services'}${data.website ? ` for ${data.website}` : ''}.`,
          }),
        )
      } catch {}
      router.push('/thank-you')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setState('error')
    }
  }

  return (
    <form id={compact ? 'lead-form' : 'contact-form'} ref={form} onSubmit={submit} className={compact ? 'grid gap-3.5 p-6 sm:p-7' : 'grid gap-4 p-6 sm:grid-cols-2 sm:p-8'}>
      <div>
        <label className="label" htmlFor="cf-name">Your name *</label>
        <input id="cf-name" name="name" required minLength={2} maxLength={80} autoComplete="name" className="field" />
      </div>
      <div>
        <label className="label" htmlFor="cf-phone">Phone / WhatsApp *</label>
        <input id="cf-phone" name="phone" required type="tel" minLength={8} maxLength={20} pattern="[+\d\s()\-]+" autoComplete="tel" placeholder="+91" className="field" />
      </div>
      <div>
        <label className="label" htmlFor="cf-site">Website (if any)</label>
        <input id="cf-site" name="website" maxLength={200} inputMode="url" placeholder="yourbusiness.in" className="field" />
      </div>
      {compact ? (
        <input type="hidden" name="service" value={service ?? SERVICES[0]} />
      ) : (
        <>
          <div>
            <label className="label" htmlFor="cf-email">Work email</label>
            <input id="cf-email" name="email" type="email" maxLength={120} autoComplete="email" className="field" />
          </div>
          <div>
            <label className="label" htmlFor="cf-service">Service</label>
            <select id="cf-service" name="service" className="field" defaultValue={service && SERVICES.includes(service) ? service : SERVICES[0]}>
              {SERVICES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="cf-budget">Monthly budget</label>
            <select id="cf-budget" name="budget" className="field" defaultValue={BUDGETS[0]}>
              {BUDGETS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="cf-msg">What are you looking to achieve?</label>
            <textarea id="cf-msg" name="message" rows={4} maxLength={1500} className="field resize-none" placeholder="e.g. More patient enquiries from Google in Pune" />
          </div>
        </>
      )}
      {/* Honeypot — hidden from people, irresistible to bots */}
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <div className={compact ? 'flex flex-col gap-3' : 'flex flex-col gap-3 sm:col-span-2 sm:flex-row-reverse sm:items-center sm:justify-between'}>
        <button type="submit" disabled={state === 'sending'} className={compact ? 'btn btn-mint btn-lg w-full' : 'btn btn-ink btn-lg'}>
          {state === 'sending' ? <Loader2 className="size-4 animate-spin" /> : null}
          {cta} <ArrowRight className="size-4" />
        </button>
        <p className="text-[0.8rem] text-muted" role={state === 'error' ? 'alert' : undefined}>
          {state === 'error' ? (
            <span className="text-rose">{error}</span>
          ) : (
            <>
              Reply within one working day. No spam —{' '}
              <a href="/privacy-policy" className="underline underline-offset-2 hover:text-text">
                privacy policy
              </a>
              .
            </>
          )}
        </p>
      </div>
    </form>
  )
}
