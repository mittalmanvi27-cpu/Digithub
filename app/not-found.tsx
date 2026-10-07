import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-ink pt-24 text-white">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="glow pointer-events-none absolute inset-0" />
      <div className="container-x relative text-center">
        <p className="font-mono text-sm text-mint">404</p>
        <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.04em]">
          This page <span className="serif text-gradient">wandered off.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-white/60">The link may be old or mistyped. Let’s get you somewhere useful.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-mint">Back to home <ArrowRight className="size-4" /></Link>
          <Link href="/audit" className="btn btn-ghost-dark">Run a free AI audit</Link>
        </div>
      </div>
    </section>
  )
}
