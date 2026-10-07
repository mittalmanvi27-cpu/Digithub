/** Reads a Server-Sent Events response from fetch() and calls onEvent per event. */
export async function readSSE(res: Response, onEvent: (event: string, data: any) => void) {
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    let idx: number
    while ((idx = buf.indexOf('\n\n')) !== -1) {
      const raw = buf.slice(0, idx)
      buf = buf.slice(idx + 2)
      const event = raw.match(/^event: (.*)$/m)?.[1] ?? 'message'
      const data = raw.match(/^data: (.*)$/m)?.[1]
      if (!data) continue
      let parsed: unknown
      try {
        parsed = JSON.parse(data)
      } catch {
        continue // ignore malformed event
      }
      onEvent(event, parsed)
    }
  }
}
