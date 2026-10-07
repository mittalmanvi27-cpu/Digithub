export type Plan = {
  name: 'Basic' | 'Standard' | 'Premium'
  for: string
  price: string
  unit: string
  popular?: boolean
  features: string[]
}

export type PricingTab = { id: 'seo' | 'ppc' | 'web'; label: string; service: string; note?: string; plans: Plan[] }

export const pricing: PricingTab[] = [
  {
    id: 'seo',
    label: 'SEO + AI Search',
    service: 'SEO',
    plans: [
      {
        name: 'Basic',
        for: 'Local businesses starting out',
        price: '₹9,999',
        unit: '/ month',
        features: ['Up to 10 target keywords', 'Google Business Profile optimisation', 'On-page & technical fixes', '2 blog posts / month', 'Monthly report'],
      },
      {
        name: 'Standard',
        for: 'Growing & multi-service businesses',
        price: '₹19,999',
        unit: '/ month',
        popular: true,
        features: ['Up to 25 target keywords', 'Everything in Basic', '4 blog posts / month', 'AI search (AEO) content structuring', 'Local citations & link building', 'Monthly strategy call'],
      },
      {
        name: 'Premium',
        for: 'Competitive niches & ecommerce',
        price: '₹34,999',
        unit: '/ month',
        features: ['Up to 50 target keywords', 'Everything in Standard', '8 blog posts / month', 'Full GEO + AI visibility tracking', 'Advanced link building & digital PR', 'Fortnightly calls'],
      },
    ],
  },
  {
    id: 'ppc',
    label: 'PPC / Ads',
    service: 'Google / Meta Ads',
    note: 'Management fee only — ad spend is paid directly to Google / Meta from your own account.',
    plans: [
      {
        name: 'Basic',
        for: 'Ad spend up to ₹50k / month',
        price: '₹7,999',
        unit: '/ month',
        features: ['1 platform (Google or Meta)', 'Campaign setup & ad copy', 'Conversion tracking', 'Weekly optimisation', 'Monthly report'],
      },
      {
        name: 'Standard',
        for: 'Ad spend up to ₹1.5L / month',
        price: '₹14,999',
        unit: '/ month',
        popular: true,
        features: ['Google + Meta ads', 'Everything in Basic', 'A/B ad & creative testing', 'Remarketing campaigns', '1 landing page included'],
      },
      {
        name: 'Premium',
        for: 'Ad spend above ₹1.5L / month',
        price: '₹24,999',
        unit: '/ month',
        features: ['All platforms incl. YouTube', 'Everything in Standard', 'Performance Max & Shopping', 'Landing page CRO', 'Weekly reporting calls'],
      },
    ],
  },
  {
    id: 'web',
    label: 'Website',
    service: 'Website Design',
    plans: [
      {
        name: 'Basic',
        for: 'Starter business website',
        price: '₹14,999',
        unit: 'one-time',
        features: ['Up to 5 pages', 'Mobile-first design', 'Contact form & WhatsApp button', 'Basic SEO setup', 'Delivered in ~2 weeks'],
      },
      {
        name: 'Standard',
        for: 'Service businesses that want leads',
        price: '₹29,999',
        unit: 'one-time',
        popular: true,
        features: ['Up to 12 pages', 'Custom design & copy help', 'Blog + CMS', 'Full on-page SEO, schema & GA4', 'Speed optimisation'],
      },
      {
        name: 'Premium',
        for: 'Ecommerce & custom builds',
        price: '₹59,999',
        unit: 'one-time',
        features: ['WooCommerce / custom features', 'Everything in Standard', 'Payment gateway integration', 'Conversion-focused landing pages', '30 days post-launch support'],
      },
    ],
  },
]
