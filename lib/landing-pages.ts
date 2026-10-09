import type { ServicePage } from './service-pages'

/**
 * Paid-traffic landing pages (/lp/<slug>). Distraction-free (no main nav),
 * form above the fold, and noindex so they never compete with the SEO
 * service pages. Point each ad group at the page whose headline matches it —
 * message match lifts Quality Score and conversion rate.
 */
export type LandingPage = {
  slug: string
  /** The SEO service page this one borrows outcomes, steps and FAQs from. */
  servicePage: ServicePage['slug']
  title: string
  eyebrow: string
  headline: string
  highlight: string
  sub: string
  bullets: string[]
  formTitle: string
  cta: string
  formService: string
}

export const landingPages: LandingPage[] = [
  {
    slug: 'seo-agency',
    servicePage: 'seo-services',
    title: 'SEO Agency — Free SEO Audit & Proposal',
    eyebrow: 'Free SEO audit · Reply in 1 working day',
    headline: 'Rank on Google. Get found on Maps.',
    highlight: 'Get more enquiries.',
    sub: 'Senior-led SEO for growing Indian businesses — local, technical and content SEO, with AI search (ChatGPT, Gemini) built in. Month-to-month, from ₹9,999.',
    bullets: ['Free audit of your website and Google listing', 'No lock-in — cancel with 30 days’ notice', 'You own every account and all data', 'Plain-English monthly report on enquiries'],
    formTitle: 'Get your free SEO audit',
    cta: 'Get my free audit',
    formService: 'SEO',
  },
  {
    slug: 'google-ads-agency',
    servicePage: 'google-ads-ppc-management',
    title: 'Google Ads Agency — Free Ad Account Audit',
    eyebrow: 'Free ad account audit · Reply in 1 working day',
    headline: 'Stop wasting ad spend.',
    highlight: 'Start getting leads.',
    sub: 'Google & Meta Ads managed around cost per enquiry — conversion tracking first, wasted spend out. Management from ₹7,999/month; ad spend stays in your own account.',
    bullets: ['Free audit of where your budget leaks today', 'Calls, forms & WhatsApp tracked as conversions', 'Ads run in your own Google & Meta accounts', 'Month-to-month, no lock-in'],
    formTitle: 'Get your free ads audit',
    cta: 'Audit my ads for free',
    formService: 'Google / Meta Ads',
  },
  {
    slug: 'website-design',
    servicePage: 'website-design-development',
    title: 'Website Design Company — Free Quote in 24 Hours',
    eyebrow: 'Free quote · Reply in 1 working day',
    headline: 'A website that brings',
    highlight: 'customers, not just visitors.',
    sub: 'Fast, mobile-first websites with SEO, WhatsApp and lead tracking built in. Starter sites from ₹14,999, delivered in about two weeks.',
    bullets: ['Mobile-first, fast-loading design', 'SEO, schema and Google Analytics from day one', 'Click-to-call & WhatsApp buttons built in', 'Edit it yourself — no developer needed'],
    formTitle: 'Get a free website quote',
    cta: 'Get my free quote',
    formService: 'Website Design',
  },
]

export const landingPageBySlug = (slug: string) => landingPages.find((p) => p.slug === slug)
