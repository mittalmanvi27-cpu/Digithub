import type { Metadata } from 'next'
import { ThankYou } from '@/components/thank-you'

export const metadata: Metadata = {
  title: 'Thank you',
  robots: { index: false, follow: false },
  alternates: { canonical: '/thank-you' },
}

export default function ThankYouPage() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-ink pb-24 pt-36 text-white sm:pt-44">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="glow pointer-events-none absolute inset-0" />
      <div className="container-x relative">
        <ThankYou />
      </div>
    </section>
  )
}
