'use client'

import { openChat } from './chat-widget'

/** Button that opens Digi from a server component, optionally with a question. */
export function ChatButton({ prompt, className, children }: { prompt?: string; className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={() => openChat(prompt)} className={className}>
      {children}
    </button>
  )
}
