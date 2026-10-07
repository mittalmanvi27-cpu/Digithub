export type ServiceItem = { id: string; name: string; text: string }
export type ServiceGroup = {
  id: string
  name: string
  icon: 'megaphone' | 'sparkles' | 'search' | 'code' | 'target' | 'pen' | 'chart' | 'smartphone'
  short: string
  text: string
  items: ServiceItem[]
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const item = (name: string, text: string): ServiceItem => ({ id: slug(name), name, text })

export const serviceGroups: ServiceGroup[] = [
  {
    id: 'ai-search',
    name: 'AI Search & LLM SEO',
    icon: 'sparkles',
    short: 'Get recommended and cited by ChatGPT, Gemini, Perplexity and AI Overviews.',
    text: 'Get recommended and cited when buyers ask ChatGPT, Gemini, Perplexity and Google AI Overviews.',
    items: [
      item('AI SEO Services', 'A complete programme to make your brand visible across AI assistants.'),
      item('Answer Engine Optimisation (AEO)', 'Answer-first content and schema so engines lift your answers directly.'),
      item('Generative Engine Optimisation (GEO)', 'Entity signals, mentions and authority that AI models trust.'),
      item('ChatGPT SEO', 'Get named in ChatGPT’s recommendations for your category and city.'),
      item('Gemini & AI Overviews SEO', 'Show up in Google’s AI answers above the classic blue links.'),
      item('Perplexity SEO', 'Earn citations from the sources Perplexity reads and links.'),
      item('AI Visibility Tracking', 'Monthly prompt tracking and AI referral reporting in plain English.'),
    ],
  },
  {
    id: 'seo',
    name: 'Search Engine Optimisation',
    icon: 'search',
    short: 'Local, ecommerce and national SEO that puts you first when buyers search.',
    text: 'Rank for the searches that bring buyers — locally, nationally and for ecommerce.',
    items: [
      item('Local SEO & Google Maps', 'Google Business Profile, citations and reviews to win the Maps pack.'),
      item('Technical SEO', 'Speed, crawlability, indexing and Core Web Vitals fixed properly.'),
      item('On-Page SEO', 'Titles, content, internal links and schema optimised page by page.'),
      item('Ecommerce SEO', 'Category, product and filter pages structured to rank and sell.'),
      item('Link Building', 'Genuine, relevant backlinks and digital PR — no spammy networks.'),
      item('Enterprise SEO', 'SEO at scale for large sites, multiple locations and complex stacks.'),
      item('Multilingual SEO', 'Hindi and regional-language SEO to reach Bharat beyond English search.'),
      item('Online Reputation Management', 'Review generation, response and monitoring to protect your brand.'),
    ],
  },
  {
    id: 'paid-marketing',
    name: 'Performance Ads (PPC)',
    icon: 'target',
    short: 'Google & Meta campaigns with ROI-first bidding and tracking from day one.',
    text: 'Performance campaigns engineered around cost per lead and return on ad spend.',
    items: [
      item('Google Ads Management', 'Search, Display and Performance Max campaigns that bring ready buyers.'),
      item('Meta Ads Management', 'Facebook and Instagram ads with sharp targeting and creative testing.'),
      item('Shopping & Performance Max', 'Product feeds and PMax campaigns for ecommerce growth.'),
      item('Remarketing', 'Bring back visitors who didn’t convert the first time.'),
      item('YouTube Ads', 'Video campaigns that build awareness and drive action.'),
      item('LinkedIn Ads', 'Reach decision-makers by job title, company and industry.'),
      item('Amazon Ads', 'Sponsored product and brand campaigns for Amazon sellers.'),
    ],
  },
  {
    id: 'design-development',
    name: 'Websites & Development',
    icon: 'code',
    short: 'Fast, mobile-first websites engineered to rank and convert from day one.',
    text: 'Fast, mobile-first websites built to rank, convert and grow with you.',
    items: [
      item('Website Design', 'Custom business websites with clear messaging and strong calls to action.'),
      item('Ecommerce Website Design', 'Online stores with smooth checkout, payments and inventory.'),
      item('WordPress Development', 'Flexible, easy-to-edit WordPress sites with clean code.'),
      item('Shopify Development', 'Shopify stores, themes and apps set up for Indian D2C brands.'),
      item('Landing Page Design', 'High-converting pages for ad campaigns, launches and offers.'),
      item('Website Speed Optimisation', 'Faster load times for better rankings and fewer drop-offs.'),
    ],
  },
  {
    id: 'digital-marketing',
    name: 'Social & Digital Marketing',
    icon: 'megaphone',
    short: 'Paid and organic social that builds demand — not just followers.',
    text: 'Build demand where your customers spend their time — social, video, email and messaging.',
    items: [
      item('Social Media Marketing', 'Content calendars, reels and community management that grow a real audience.'),
      item('Social Media Advertising', 'Paid social campaigns built around enquiries and sales, not just likes.'),
      item('Facebook & Instagram Marketing', 'Organic + paid growth on Meta platforms with creative that stops the scroll.'),
      item('LinkedIn Marketing', 'Founder branding, company pages and LinkedIn Ads for B2B lead generation.'),
      item('YouTube Marketing', 'Channel strategy, video SEO and YouTube Ads that build trust at scale.'),
      item('WhatsApp Marketing', 'Broadcasts, catalogues and automated flows on the WhatsApp Business API.'),
      item('Email Marketing', 'Newsletters and automated sequences that turn leads into repeat customers.'),
      item('Influencer Marketing', 'Matched creators, clear briefs and trackable campaigns for D2C brands.'),
    ],
  },
  {
    id: 'content-marketing',
    name: 'Content Marketing',
    icon: 'pen',
    short: 'Expert articles, copy and PR that earn trust, rankings and AI citations.',
    text: 'Content that earns trust, rankings and AI citations.',
    items: [
      item('Content Strategy', 'Topic research and a calendar built around what buyers search and ask.'),
      item('Blog & Article Writing', 'Expert, original articles written by humans who know your industry.'),
      item('Website Copywriting', 'Clear, persuasive copy for homepages, service and landing pages.'),
      item('Guest Posting & Digital PR', 'Placements on relevant, respected publications.'),
    ],
  },
  {
    id: 'analytics-cro',
    name: 'Analytics & CRO',
    icon: 'chart',
    short: 'Track every call and form, then turn more of your traffic into enquiries.',
    text: 'Measure what matters, then turn more of your visitors into enquiries.',
    items: [
      item('GA4 & Tag Manager Setup', 'Clean tracking for forms, calls, WhatsApp clicks and sales.'),
      item('Conversion Rate Optimisation', 'Testing and UX fixes that raise enquiries from the same traffic.'),
      item('Call & Lead Tracking', 'Know exactly which channel and keyword produced each lead.'),
      item('Looker Studio Dashboards', 'Live, plain-English dashboards for your marketing performance.'),
    ],
  },
  {
    id: 'app-marketing',
    name: 'App Marketing',
    icon: 'smartphone',
    short: 'Grow installs and engagement for your mobile app.',
    text: 'Grow installs and engagement for your mobile app.',
    items: [
      item('App Store Optimisation', 'Rank higher in Google Play and the App Store with better listings.'),
      item('App Install Campaigns', 'Google App Campaigns and Meta app ads focused on quality users.'),
    ],
  },
]

export const serviceCount = serviceGroups.reduce((n, g) => n + g.items.length, 0)

export const aiSearchFeatures = [
  { k: 'AEO', v: 'Answer Engine Optimisation — structure content so AI pulls your answers.' },
  { k: 'GEO', v: 'Generative Engine Optimisation — build the entity signals models trust.' },
  { k: 'ChatGPT SEO', v: 'Get mentioned in ChatGPT’s recommendations for your category.' },
  { k: 'AI Overviews', v: 'Show up in Google’s AI answers above the blue links.' },
  { k: 'Perplexity', v: 'Earn citations from the sources Perplexity reads.' },
  { k: 'Visibility report', v: 'Monthly tracking of where AI mentions your brand.' },
]
