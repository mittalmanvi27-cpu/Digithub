export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-14 pt-36 text-white sm:pt-44">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="container-x relative max-w-3xl">
          <span className="eyebrow text-mint/80">Legal</span>
          <h1 className="mt-5 text-[clamp(2.4rem,5.6vw,4rem)] font-medium leading-[1] tracking-[-0.04em]">{title}</h1>
          <p className="mt-4 text-white/50">Last updated {updated}</p>
        </div>
      </section>
      <div className="container-x max-w-3xl py-16">
        <div className="prose-dr">{children}</div>
      </div>
    </>
  )
}
