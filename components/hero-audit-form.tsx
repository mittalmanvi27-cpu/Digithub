'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Globe } from 'lucide-react'

/** Hero entry point for the AI audit: type a URL, land on /audit with it running. */
export function HeroAuditForm() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (url.trim()) router.push(`/audit?url=${encodeURIComponent(url.trim())}`)
        else router.push('/audit')
      }}
      className="flex w-full max-w-xl flex-col gap-2 rounded-[22px] border border-white/12 bg-white/[0.05] p-2 shadow-[0_30px_80px_-30px_rgb(63_201_160/0.35)] backdrop-blur-md sm:flex-row sm:items-center sm:rounded-full"
    >
      <label className="flex flex-1 items-center gap-3 px-4 py-2.5 sm:py-0">
        <Globe className="size-5 shrink-0 text-white/40" />
        <span className="sr-only">Your website</span>
        <input
          type="text"
          inputMode="url"
          autoComplete="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="yourbusiness.in"
          className="w-full bg-transparent text-[1rem] text-white outline-none placeholder:text-white/35"
        />
      </label>
      <button type="submit" className="btn btn-mint btn-lg">
        Run free AI audit <ArrowRight className="size-4" />
      </button>
    </form>
  )
}
