import 'server-only'
import Anthropic from '@anthropic-ai/sdk'

export const MODEL = process.env.DIGI_MODEL || 'claude-opus-5-5'

/** Null when no credentials are configured; every AI feature has a non-AI fallback. */
export const anthropic: Anthropic | null =
  process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN ? new Anthropic() : null

/**
 * Request options shared by every call. `fallbacks: "default"` re-runs a request
 * that the model's safety classifiers decline on Anthropic's recommended
 * fallback model, server-side, so visitors rarely see a refusal.
 */
export const FALLBACK: { betas: Anthropic.Beta.AnthropicBeta[]; fallbacks: 'default' } = {
  betas: ['server-side-fallback-2026-07-01'],
  fallbacks: 'default',
}

export const WHATSAPP_HELP = 'WhatsApp us on +91 77102 42183'

/** Map SDK errors to a short, visitor-safe message (and log the detail server-side). */
export function friendlyError(err: unknown): string {
  if (err instanceof Anthropic.RateLimitError) return `We're busy right now — please try again in a moment, or ${WHATSAPP_HELP}.`
  if (err instanceof Anthropic.AuthenticationError) {
    console.error('[ai] Anthropic authentication failed — check ANTHROPIC_API_KEY')
    return `AI is temporarily unavailable. Please ${WHATSAPP_HELP}.`
  }
  if (err instanceof Anthropic.APIConnectionError) return 'Couldn’t reach the AI service. Please try again shortly.'
  if (err instanceof Anthropic.APIError) {
    console.error(`[ai] API error ${err.status}: ${err.message}`)
    return `Something went wrong on our side. Please try again, or ${WHATSAPP_HELP}.`
  }
  console.error('[ai] unexpected error', err)
  return `Something went wrong. Please try again, or ${WHATSAPP_HELP}.`
}

/** Server-Sent Events helper for streaming route handlers. */
export function sseStream(run: (send: (event: string, data: unknown) => void) => Promise<void>) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
        } catch {
          /* client disconnected */
        }
      }
      try {
        await run(send)
      } catch (err) {
        send('error', { message: friendlyError(err) })
      } finally {
        try {
          controller.close()
        } catch {}
      }
    },
  })
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  })
}
