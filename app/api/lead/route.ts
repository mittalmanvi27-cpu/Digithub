import { after } from 'next/server'
import { LeadInput, notifyLead, qualifyLead } from '@/lib/leads'
import { json, rateLimited } from '@/lib/rate-limit'

export const maxDuration = 60

export async function POST(req: Request) {
  if (rateLimited(req, 'lead', 5, 10 * 60_000)) return json({ error: 'Too many requests — please WhatsApp us instead.' }, 429)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }
  const parsed = LeadInput.safeParse(body)
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0]
    if (field === 'company') return json({ ok: true }) // honeypot: pretend success to bots
    return json({ error: field ? `Please check the ${String(field)} field.` : 'Please check the form.' }, 400)
  }

  const lead = parsed.data
  // Respond instantly; AI scoring + notifications run after the response is sent.
  after(async () => {
    const q = await qualifyLead(lead)
    await notifyLead(lead, q)
  })
  return json({ ok: true })
}
