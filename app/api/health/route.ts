import { anthropic, MODEL } from '@/lib/ai'
import { knowledge } from '@/lib/knowledge'

export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json({
    ai: anthropic !== null,
    model: anthropic ? MODEL : null,
    chunks: knowledge().chunks.length,
    leadChannels: {
      webhook: !!process.env.LEAD_WEBHOOK_URL,
      email: !!(process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_TO),
    },
    pagespeed: !!process.env.PAGESPEED_API_KEY,
  })
}
