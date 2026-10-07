import Link from 'next/link'
import clsx from 'clsx'
import {
  BarChart3,
  Code2,
  Megaphone,
  PenLine,
  Search,
  Smartphone,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react'
import type { ServiceGroup } from '@/lib/services'

export const serviceIcons: Record<ServiceGroup['icon'], LucideIcon> = {
  megaphone: Megaphone,
  sparkles: Sparkles,
  search: Search,
  code: Code2,
  target: Target,
  pen: PenLine,
  chart: BarChart3,
  smartphone: Smartphone,
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#1F3A5F" />
      <rect x="14" y="36" width="7.5" height="13" rx="1.5" fill="#fff" />
      <rect x="28" y="28" width="7.5" height="21" rx="1.5" fill="#fff" />
      <rect x="42" y="37" width="7.5" height="12" rx="1.5" fill="#fff" />
      <path d="M38 24 L47 17" stroke="#3FC9A0" strokeWidth="5" strokeLinecap="round" />
      <path d="M42 13 L51 13 L49 21 Z" fill="#3FC9A0" />
    </svg>
  )
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Digitroot home">
      <LogoMark className="size-8" />
      <span className={clsx('text-[1.28rem] font-semibold tracking-[-0.04em]', dark ? 'text-white' : 'text-navy')}>Digitroot</span>
    </Link>
  )
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  dark,
  center,
  children,
}: {
  eyebrow: string
  title: React.ReactNode
  sub?: React.ReactNode
  dark?: boolean
  center?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className={clsx('reveal mb-12 flex flex-col gap-6 md:mb-16', center ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between')}>
      <div className={clsx('max-w-2xl', center && 'flex flex-col items-center')}>
        <span className={clsx('eyebrow', dark && 'text-mint/80')}>{eyebrow}</span>
        <h2 className={clsx('mt-5 text-[clamp(2.1rem,4.6vw,3.6rem)] font-medium leading-[1.02]', dark ? 'text-white' : 'text-text')}>{title}</h2>
        {sub && <p className={clsx('mt-5 max-w-xl text-lg leading-relaxed', dark ? 'text-white/60' : 'text-muted')}>{sub}</p>}
      </div>
      {children}
    </div>
  )
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.38 9.38 0 0 1 9.42 9.44c0 5.2-4.23 9.43-9.43 9.43m8.02-17.46A11.27 11.27 0 0 0 12.04.75C5.8.75.72 5.83.72 12.07c0 2 .52 3.94 1.51 5.65L.62 23.6l6.02-1.58a11.3 11.3 0 0 0 5.4 1.37h.01c6.24 0 11.32-5.08 11.32-11.32 0-3.02-1.18-5.87-3.31-8.01" />
    </svg>
  )
}
