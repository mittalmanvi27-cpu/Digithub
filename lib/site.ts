export const site = {
  name: 'Digitroot',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.digitroot.in').replace(/\/$/, ''),
  tagline: 'SEO, AI search, ads & websites — measured in real enquiries.',
  description:
    'Digitroot is a senior-led growth studio for SEO, AI search optimisation (ChatGPT, Gemini, Perplexity), Google & Meta Ads and high-converting websites for growing businesses in India.',
  email: 'hello@digitroot.in',
  phone: '+91 77102 42183',
  phoneHref: 'tel:+917710242183',
  whatsapp: '917710242183',
  hours: 'Mon–Sat · 10:00–19:00 IST',
  linkedin: 'https://www.linkedin.com/company/digitroot',
  instagram: 'https://www.instagram.com/digitroot',
}

export function whatsappLink(text?: string) {
  return `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

export const industries = [
  'Clinics & Healthcare',
  'Coaching & Education',
  'Real Estate',
  'Interiors & Architecture',
  'Legal & CA Firms',
  'D2C & Ecommerce',
  'B2B & SaaS',
  'Restaurants & Hospitality',
  'Local Services',
]

export const platforms = [
  'Google Search',
  'ChatGPT',
  'Google Ads',
  'Gemini',
  'Google Maps',
  'Perplexity',
  'Meta Ads',
  'AI Overviews',
  'Instagram',
  'YouTube',
]

export const processSteps = [
  { n: '01', title: 'Attract', tag: 'Visibility', text: 'SEO, AI search and paid ads put you in front of buyers at the exact moment they’re looking.' },
  { n: '02', title: 'Convert', tag: 'Enquiries', text: 'Fast pages, clear offers and frictionless forms turn that attention into calls and enquiries.' },
  { n: '03', title: 'Measure', tag: 'Clarity', text: 'GA4, call and form tracking show exactly which channel produces leads — and at what cost.' },
  { n: '04', title: 'Repeat', tag: 'Compounding', text: 'We double down on what works, cut what doesn’t, and report it all in plain English every month.' },
]

export const comparison = [
  { row: 'Who runs your account', us: 'Senior specialist', them: 'Junior executive' },
  { row: 'Contract', us: 'Month-to-month', them: '6–12 month lock-in' },
  { row: 'AI search (ChatGPT, Gemini)', us: 'Built into SEO plans', them: 'Extra cost or ignored' },
  { row: 'Communication', us: 'Direct WhatsApp & calls', them: 'Tickets & account managers' },
  { row: 'Reporting', us: 'Plain-English + monthly call', them: 'Auto-generated PDF' },
  { row: 'Account & data ownership', us: 'Always 100% yours', them: 'Often agency-owned' },
]

export const faqs = [
  {
    q: 'How long does SEO take to show results?',
    a: 'Quick technical and Google Business Profile fixes can help within weeks. Meaningful ranking and traffic growth usually takes 3–6 months, depending on your competition and starting point. You’ll see the trend every month.',
  },
  {
    q: 'What is AI search optimisation (AEO / GEO)?',
    a: 'It’s the work of making your business the source that ChatGPT, Gemini, Perplexity and Google AI Overviews cite and recommend — through structured, answer-first content, schema, entity signals, reviews and authoritative mentions. It’s included in our Standard and Premium SEO plans.',
  },
  {
    q: 'Is the free audit really free?',
    a: 'Yes. Our AI audit runs instantly on this page, and a strategist then reviews your website, Google listing, ads and AI visibility by hand and sends a short report with the top issues and quick wins. There’s no obligation to work with us.',
  },
  {
    q: 'Do I have to sign a long contract?',
    a: 'No. SEO and PPC plans run month-to-month. We recommend giving SEO at least three months to judge results fairly, but you can stop with 30 days’ notice.',
  },
  {
    q: 'Is ad spend included in PPC pricing?',
    a: 'No — our fee covers strategy, setup and management. Your ad budget is paid directly to Google or Meta from your own account, so you stay in full control.',
  },
  {
    q: 'Can you work on my existing website?',
    a: 'Absolutely. Most SEO clients keep their current site. If it’s holding you back on speed, mobile or structure, we’ll tell you honestly and quote for a fix or a rebuild.',
  },
]
