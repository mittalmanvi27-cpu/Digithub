'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import { pricing, type PricingTab } from '@/lib/pricing'
import { prefillLead } from './contact-form'

/** All plans with tabs, or just one tab's plans via `only` (service pages). */
export function Pricing({ only }: { only?: PricingTab['id'] }) {
  const [tab, setTab] = useState(only ?? pricing[0].id)
  const current = pricing.find((p) => p.id === tab)!

  return (
    <div>
      <div hidden={!!only} className="mx-auto mb-10 flex w-fit gap-1 rounded-full border border-text/[0.08] bg-white p-1 shadow-sm" role="tablist">
        {pricing.map((p) => (
          <button
            key={p.id}
            role="tab"
            type="button"
            aria-selected={tab === p.id}
            onClick={() => setTab(p.id)}
            className={clsx('rounded-full px-4 py-2 text-[0.88rem] transition sm:px-5', tab === p.id ? 'bg-ink text-white' : 'text-muted hover:text-text')}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3" role="tabpanel">
        {current.plans.map((plan) => (
          <div
            key={plan.name}
            className={clsx(
              'relative flex flex-col rounded-3xl p-7 sm:p-8',
              plan.popular ? 'bg-ink text-white shadow-[0_40px_80px_-30px_rgb(7_11_20/0.6)] lg:-my-3 lg:py-11' : 'card',
            )}
          >
            {plan.popular && (
              <>
                <div className="glow pointer-events-none absolute inset-0 rounded-3xl opacity-50" />
                <span className="absolute right-6 top-6 rounded-full bg-mint px-2.5 py-1 font-mono text-[0.64rem] uppercase tracking-wider text-ink">Most popular</span>
              </>
            )}
            <div className="relative">
              <h3 className="text-xl font-medium">{plan.name}</h3>
              <p className={clsx('mt-1 text-[0.88rem]', plan.popular ? 'text-white/55' : 'text-muted')}>{plan.for}</p>
              <p className="mt-7 flex items-baseline gap-1.5">
                <span className="text-[2.8rem] font-medium leading-none tracking-[-0.04em]">{plan.price}</span>
                <span className={clsx('text-[0.9rem]', plan.popular ? 'text-white/50' : 'text-muted')}>{plan.unit}</span>
              </p>
              <button
                type="button"
                onClick={() => prefillLead({ service: current.service, message: `I'm interested in the ${current.label} ${plan.name} plan (${plan.price} ${plan.unit}).` })}
                className={clsx('btn mt-7 w-full', plan.popular ? 'btn-mint' : 'btn-ink')}
              >
                Choose {plan.name}
              </button>
              <ul className="mt-8 space-y-3 text-[0.92rem]">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check className={clsx('mt-0.5 size-4 shrink-0', plan.popular ? 'text-mint' : 'text-mint-600')} />
                    <span className={plan.popular ? 'text-white/80' : 'text-[#2a3445]'}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-[0.85rem] text-muted">
        {current.note ?? 'Every plan is refined after your free audit.'} Prices exclude GST. No lock-in contracts.
      </p>
    </div>
  )
}
