'use client'

import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { ArrowRight } from 'lucide-react'
import { prefillLead } from './contact-form'

const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')

const scenarios = {
  conservative: { traffic: 0.2, conv: 0.25, label: 'Conservative' },
  realistic: { traffic: 0.4, conv: 0.5, label: 'Realistic' },
  ambitious: { traffic: 0.8, conv: 1, label: 'Ambitious' },
} as const

function Slider({ label, value, display, min, max, step, onChange }: { label: string; value: number; display: string; min: number; max: number; step: number; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-[0.9rem]">
        <span className="text-muted">{label}</span>
        <span className="font-mono text-[0.95rem] font-medium text-text">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full accent-mint-600"
        style={{ background: `linear-gradient(to right, var(--color-mint-600) ${pct}%, rgb(11 18 32 / 0.1) ${pct}%)` }}
      />
    </label>
  )
}

export function Calculator() {
  const [visitors, setVisitors] = useState(2000)
  const [conv, setConv] = useState(2)
  const [close, setClose] = useState(20)
  const [value, setValue] = useState(15000)
  const [scenario, setScenario] = useState<keyof typeof scenarios>('realistic')

  const r = useMemo(() => {
    const s = scenarios[scenario]
    const now = visitors * (conv / 100) * (close / 100) * value
    const leadsNow = visitors * (conv / 100)
    const leadsAfter = visitors * (1 + s.traffic) * ((conv + s.conv) / 100)
    const after = leadsAfter * (close / 100) * value
    return { now, after, extra: after - now, leads: leadsAfter - leadsNow }
  }, [visitors, conv, close, value, scenario])

  return (
    <div className="card grid overflow-hidden lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-7 p-7 sm:p-10">
        <Slider label="Monthly website visitors" value={visitors} display={visitors.toLocaleString('en-IN')} min={200} max={50000} step={100} onChange={setVisitors} />
        <Slider label="Visitor → enquiry rate" value={conv} display={`${conv}%`} min={0.5} max={10} step={0.5} onChange={setConv} />
        <Slider label="Enquiry → customer rate" value={close} display={`${close}%`} min={5} max={60} step={1} onChange={setClose} />
        <Slider label="Average customer value" value={value} display={inr(value)} min={1000} max={500000} step={1000} onChange={setValue} />
        <div>
          <span className="text-[0.9rem] text-muted">Scenario</span>
          <div className="mt-3 grid grid-cols-3 gap-1 rounded-full bg-cloud p-1">
            {(Object.keys(scenarios) as (keyof typeof scenarios)[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setScenario(k)}
                className={clsx('rounded-full py-2 text-[0.85rem] transition', scenario === k ? 'bg-white font-medium text-text shadow-sm' : 'text-muted hover:text-text')}
              >
                {scenarios[k].label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="relative flex flex-col justify-between overflow-hidden bg-ink p-7 text-white sm:p-10">
        <div className="glow pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-mint">Estimated extra revenue / month</p>
          <p className="mt-3 text-[clamp(2.6rem,6vw,4rem)] font-medium leading-none tracking-[-0.04em] tabular-nums">{inr(Math.max(r.extra, 0))}</p>
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10">
            {[
              ['Today', inr(r.now)],
              ['With Digitroot', inr(r.after)],
              ['Extra enquiries / mo', `+${Math.round(r.leads)}`],
              ['Extra revenue / year', inr(Math.max(r.extra, 0) * 12)],
            ].map(([k, v]) => (
              <div key={k} className="bg-ink-2 p-4">
                <p className="text-[0.75rem] text-white/45">{k}</p>
                <p className="mt-1 font-mono text-[1.02rem] tabular-nums">{v}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative mt-8">
          <button type="button" onClick={() => prefillLead({ message: `I'd like a plan to reach roughly ${inr(r.after)}/month from the website (currently ~${visitors.toLocaleString('en-IN')} visitors/month).` })} className="btn btn-mint w-full">
            Get a plan to hit this <ArrowRight className="size-4" />
          </button>
          <p className="mt-3 text-center text-[0.75rem] text-white/40">
            Assumes +{scenarios[scenario].traffic * 100}% traffic and +{scenarios[scenario].conv} pt conversion. Illustrative estimate, not a guarantee.
          </p>
        </div>
      </div>
    </div>
  )
}
