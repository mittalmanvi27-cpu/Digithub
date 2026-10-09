/**
 * Client-side conversion tracking + ad attribution.
 *
 * - Captures UTM parameters and ad click IDs (gclid, gbraid, wbraid, fbclid)
 *   on the first landing and keeps them for 90 days, so every lead records
 *   which campaign, ad group and keyword produced it.
 * - Fires conversions to whatever is installed (GTM dataLayer, gtag for
 *   GA4 / Google Ads, Meta Pixel). Every call is a no-op when nothing is.
 */

type Win = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
  fbq?: (...args: unknown[]) => void
}

const KEY = 'dr_attr'
const TTL = 90 * 24 * 60 * 60 * 1000
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid']

export type Attribution = Partial<Record<(typeof PARAMS)[number] | 'landing_page' | 'referrer' | 'first_seen', string>>

function read(): Attribution & { ts?: number } {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}')
    return raw.ts && Date.now() - raw.ts < TTL ? raw : {}
  } catch {
    return {}
  }
}

/** Call once per page load. A new ad click replaces older attribution (last paid click wins). */
export function captureAttribution() {
  try {
    const url = new URL(window.location.href)
    const found: Attribution = {}
    for (const p of PARAMS) {
      const v = url.searchParams.get(p)
      if (v) found[p as keyof Attribution] = v.slice(0, 200)
    }
    const prev = read()
    if (Object.keys(found).length) {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          ...found,
          landing_page: url.pathname,
          referrer: document.referrer.slice(0, 200),
          first_seen: prev.first_seen ?? new Date().toISOString(),
          ts: Date.now(),
        }),
      )
    } else if (!prev.ts) {
      localStorage.setItem(
        KEY,
        JSON.stringify({ landing_page: url.pathname, referrer: document.referrer.slice(0, 200), first_seen: new Date().toISOString(), ts: Date.now() }),
      )
    }
  } catch {}
}

export function getAttribution(): Attribution {
  const { ts: _, ...rest } = read()
  return rest
}

function push(event: string, params: Record<string, unknown> = {}) {
  const w = window as Win
  w.dataLayer?.push({ event, ...params })
  // With a gtag snapshot installed directly (no GTM), send the event too.
  if (w.gtag && !process.env.NEXT_PUBLIC_GTM_ID) w.gtag('event', event, params)
}

/** A completed enquiry — the primary conversion for Google Ads, GA4 and Meta. */
export function trackLead(source: string, service?: string) {
  const w = window as Win
  push('generate_lead', { lead_source: source, service, currency: 'INR', value: 1 })
  const ads = process.env.NEXT_PUBLIC_GADS_ID
  const label = process.env.NEXT_PUBLIC_GADS_LEAD_LABEL
  if (w.gtag && ads && label) w.gtag('event', 'conversion', { send_to: `${ads}/${label}` })
  w.fbq?.('track', 'Lead', { content_name: service || source })
}

/** Secondary conversions: click-to-call and WhatsApp taps (high intent on mobile). */
export function trackContact(method: 'phone' | 'whatsapp' | 'email', location: string) {
  const w = window as Win
  push('contact_click', { method, location })
  const ads = process.env.NEXT_PUBLIC_GADS_ID
  const label = method === 'phone' ? process.env.NEXT_PUBLIC_GADS_CALL_LABEL : method === 'whatsapp' ? process.env.NEXT_PUBLIC_GADS_WHATSAPP_LABEL : undefined
  if (w.gtag && ads && label) w.gtag('event', 'conversion', { send_to: `${ads}/${label}` })
  w.fbq?.('track', 'Contact', { content_name: method })
}

export function trackEvent(event: string, params?: Record<string, unknown>) {
  push(event, params)
}
