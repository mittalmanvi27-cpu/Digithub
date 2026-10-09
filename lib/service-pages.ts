import { serviceGroups, type ServiceGroup } from './services'
import type { PricingTab } from './pricing'

/**
 * SEO landing-page content for each service group (/services/<slug>).
 * Each page targets one keyword cluster with its own title, H1, FAQs and
 * schema, so Google has a dedicated URL to rank for each service.
 */
export type ServicePage = {
  slug: string
  groupId: ServiceGroup['id']
  /** <title> — keep under ~60 chars (the "| Digitroot" suffix is added). */
  title: string
  /** Meta description — 120–160 chars. */
  description: string
  h1: string
  intro: string
  pricingTab?: PricingTab['id']
  /** Value for the contact form's service select. */
  formService: string
  forWho: string[]
  outcomes: { title: string; text: string }[]
  steps: { title: string; text: string }[]
  faqs: { q: string; a: string }[]
  relatedPosts: string[]
}

export const servicePages: ServicePage[] = [
  {
    slug: 'seo-services',
    groupId: 'seo',
    title: 'SEO Services in India — Local, Technical & Ecommerce SEO',
    description:
      'Senior-led SEO services for Indian businesses: local SEO and Google Maps, technical fixes, content and link building. Month-to-month plans from ₹9,999.',
    h1: 'SEO services that turn searches into enquiries',
    intro:
      'We rank your business for the searches buyers actually make — in your city, across India and inside Google’s AI answers — and report the enquiries it brings, not vanity metrics.',
    pricingTab: 'seo',
    formService: 'SEO',
    forWho: [
      'Local businesses that want to win the Google Maps pack',
      'Service firms whose competitors outrank them for “near me” searches',
      'Ecommerce stores with category pages stuck on page two',
      'Sites that lost traffic after a Google update or redesign',
    ],
    outcomes: [
      { title: 'Rank where buyers look', text: 'Keyword research built around purchase intent, mapped to pages that answer it better than competitors do.' },
      { title: 'Fix what holds you back', text: 'Technical SEO, Core Web Vitals, indexing and internal links fixed properly — not just flagged in a report.' },
      { title: 'Own the Maps pack', text: 'Google Business Profile optimisation, citations and a review system that compounds month after month.' },
    ],
    steps: [
      { title: 'Audit & roadmap', text: 'Technical crawl, competitor gap analysis and a 90-day plan ranked by impact.' },
      { title: 'Fix the foundations', text: 'Speed, indexing, titles, schema and internal linking in the first 30 days.' },
      { title: 'Content & authority', text: 'Answer-first pages and articles, plus genuine links and local citations.' },
      { title: 'Report & refine', text: 'Monthly plain-English report on rankings, traffic and enquiries — then we double down.' },
    ],
    faqs: [
      { q: 'How much do SEO services cost in India?', a: 'Our SEO plans run from ₹9,999 to ₹34,999 per month (excluding GST), depending on how many keywords and how much content and link building you need. There are no lock-in contracts.' },
      { q: 'How long does SEO take to work?', a: 'Technical and Google Business Profile fixes can help within weeks. Strong ranking and traffic growth usually takes 3–6 months depending on competition. You see the trend in every monthly report.' },
      { q: 'Do you guarantee first-page rankings?', a: 'No honest agency can guarantee rankings — Google controls them. We commit to the work, full transparency and enquiry growth you can measure, and you can stop with 30 days’ notice.' },
      { q: 'Is AI search (ChatGPT, Gemini) included?', a: 'Yes. Standard and Premium SEO plans include answer-engine (AEO) content structuring, and Premium adds full GEO and AI visibility tracking.' },
    ],
    relatedPosts: ['google-business-profile-checklist', 'geo-chatgpt-seo-guide'],
  },
  {
    slug: 'google-ads-ppc-management',
    groupId: 'paid-marketing',
    title: 'Google Ads & Meta Ads Management Agency (PPC)',
    description:
      'PPC management for Google Ads, Meta Ads, Performance Max and YouTube — built around cost per lead with conversion tracking from day one. Fees from ₹7,999/mo.',
    h1: 'Google & Meta Ads that pay for themselves',
    intro:
      'We build and manage PPC campaigns around one number — your cost per enquiry. Conversion tracking goes in first, wasted spend comes out, and every rupee is reported.',
    pricingTab: 'ppc',
    formService: 'Google / Meta Ads',
    forWho: [
      'Businesses spending on ads without knowing which clicks became leads',
      'Owners who need enquiries this month, not in six months',
      'Ecommerce brands ready for Shopping and Performance Max',
      'Accounts where cost per lead keeps creeping up',
    ],
    outcomes: [
      { title: 'Tracking before spending', text: 'Calls, forms and WhatsApp clicks tracked as conversions, so Google and Meta optimise for real leads.' },
      { title: 'Less wasted spend', text: 'Tight keyword match types, negative lists, location and schedule controls that stop budget leaking.' },
      { title: 'Pages that convert', text: 'Message-matched landing pages and ad creative testing that lift conversion rate and Quality Score.' },
    ],
    steps: [
      { title: 'Account audit', text: 'We find where budget leaks today — search terms, placements, locations and tracking gaps.' },
      { title: 'Tracking & build', text: 'GA4, Google Ads and Meta conversions set up, then campaigns structured by intent.' },
      { title: 'Launch & optimise', text: 'Weekly bid, keyword, audience and creative optimisation against cost per lead.' },
      { title: 'Scale what works', text: 'Budget shifts to the campaigns producing leads; remarketing brings back the rest.' },
    ],
    faqs: [
      { q: 'How much does Google Ads management cost?', a: 'Our management fee is ₹7,999 to ₹24,999 per month (excluding GST), depending on ad spend and platforms. Your ad budget is paid directly to Google or Meta from your own account.' },
      { q: 'What ad budget should a small business start with?', a: 'Many local service businesses start around ₹20,000–₹50,000 a month in ad spend. The right figure depends on your cost per click and how many leads you need — we’ll model it during the free audit.' },
      { q: 'How quickly will ads bring enquiries?', a: 'Well-built campaigns usually bring enquiries within the first one to two weeks. Performance improves over the following month as conversion data trains the bidding.' },
      { q: 'Do I own the ad accounts?', a: 'Always. Campaigns run in your own Google Ads and Meta Business accounts, and you keep full access and history if you ever leave.' },
    ],
    relatedPosts: ['google-ads-small-business-budget'],
  },
  {
    slug: 'ai-search-optimisation',
    groupId: 'ai-search',
    title: 'AI Search Optimisation — ChatGPT, Gemini & Perplexity SEO',
    description:
      'Get your business recommended and cited by ChatGPT, Gemini, Perplexity and Google AI Overviews with GEO and AEO from a senior-led Indian agency.',
    h1: 'Be the business AI assistants recommend',
    intro:
      'Buyers now ask ChatGPT, Gemini and Perplexity who to hire. Generative engine optimisation (GEO) and answer engine optimisation (AEO) make your brand the answer they give — and the source they cite.',
    pricingTab: 'seo',
    formService: 'AI Search Optimisation',
    forWho: [
      'Brands that rank on Google but never appear in ChatGPT answers',
      'Service businesses whose buyers research with AI before calling',
      'Companies that want a head start before competitors catch on',
      'Marketing teams asked “are we visible in AI?” with no way to measure it',
    ],
    outcomes: [
      { title: 'Entity clarity', text: 'Organization and service schema, consistent business details and profiles that let models confirm who you are.' },
      { title: 'Answer-first content', text: 'Pages structured as clear, quotable answers to the questions buyers ask AI assistants.' },
      { title: 'Measured visibility', text: 'Monthly prompt tracking shows where AI mentions you, cites you, or recommends a competitor.' },
    ],
    steps: [
      { title: 'AI visibility baseline', text: 'We test the prompts your buyers use across ChatGPT, Gemini, Perplexity and AI Overviews.' },
      { title: 'Entity & schema', text: 'Structured data, llms.txt and consistent citations across the web.' },
      { title: 'Answer content', text: 'FAQ and comparison content written to be quoted, plus authoritative mentions.' },
      { title: 'Track & expand', text: 'Monthly AI visibility report and new prompts targeted each cycle.' },
    ],
    faqs: [
      { q: 'What is the difference between GEO and AEO?', a: 'AEO (answer engine optimisation) structures your content so engines can lift direct answers from it. GEO (generative engine optimisation) builds the entity signals, mentions and authority that make AI models trust and recommend your brand.' },
      { q: 'Can you guarantee ChatGPT will recommend my business?', a: 'No one can guarantee what an AI model says. We improve the signals models rely on and track your visibility across the prompts that matter each month, so you can see progress.' },
      { q: 'Does AI search optimisation replace SEO?', a: 'No — it builds on it. AI assistants lean heavily on pages that already rank and on trusted third-party sources, so strong SEO and AI optimisation work best together.' },
      { q: 'Is it included in your SEO plans?', a: 'AEO content structuring is included in Standard SEO, and full GEO with AI visibility tracking is included in Premium.' },
    ],
    relatedPosts: ['geo-chatgpt-seo-guide'],
  },
  {
    slug: 'website-design-development',
    groupId: 'design-development',
    title: 'Website Design & Development Company — SEO-Ready Sites',
    description:
      'Fast, mobile-first business websites, ecommerce stores and landing pages built to rank on Google and convert visitors into enquiries. From ₹14,999.',
    h1: 'Websites built to rank and convert',
    intro:
      'A website should be your best salesperson. We design fast, mobile-first sites with clear messaging, SEO built in from day one, and every call, form and WhatsApp click tracked.',
    pricingTab: 'web',
    formService: 'Website Design',
    forWho: [
      'Businesses with a slow, dated or hard-to-edit website',
      'New brands that need a credible site fast',
      'Advertisers who need landing pages that convert paid traffic',
      'D2C brands moving to Shopify or WooCommerce',
    ],
    outcomes: [
      { title: 'Fast on every phone', text: 'Lightweight builds tuned for Core Web Vitals, because speed affects both rankings and enquiries.' },
      { title: 'SEO from day one', text: 'Clean structure, schema, meta tags, sitemap and analytics in place before launch.' },
      { title: 'Designed to convert', text: 'Clear offers, trust signals, click-to-call and WhatsApp buttons where buyers expect them.' },
    ],
    steps: [
      { title: 'Discovery', text: 'Goals, audience, competitors and the pages you need to win.' },
      { title: 'Design', text: 'Wireframes and visual design reviewed with you before any build.' },
      { title: 'Build & optimise', text: 'Development, copy, SEO setup, speed tuning and tracking.' },
      { title: 'Launch & support', text: 'Redirects, Search Console, training and post-launch support.' },
    ],
    faqs: [
      { q: 'How much does a business website cost?', a: 'Our websites range from ₹14,999 for a starter site of up to 5 pages to ₹59,999 for ecommerce and custom builds (one-time, excluding GST).' },
      { q: 'How long does it take to build a website?', a: 'A starter website takes about two weeks. Larger sites and stores usually take two to four weeks depending on pages, content and integrations.' },
      { q: 'Will I be able to edit the website myself?', a: 'Yes. Standard and Premium sites include a CMS, and we show you how to update pages, blog posts and images.' },
      { q: 'Can you redesign my site without losing Google rankings?', a: 'Yes. We map old URLs to new ones with redirects, keep content that ranks, and monitor Search Console after launch.' },
    ],
    relatedPosts: [],
  },
  {
    slug: 'social-media-marketing',
    groupId: 'digital-marketing',
    title: 'Social Media Marketing Agency — Instagram, Facebook & LinkedIn',
    description:
      'Social media marketing that builds demand and enquiries: content, reels, paid social, WhatsApp and email marketing for Indian businesses.',
    h1: 'Social media that builds demand, not just followers',
    intro:
      'Organic content and paid social working together — reels, posts, ads, WhatsApp and email — planned around the enquiries and sales they produce.',
    formService: 'Social Media',
    forWho: [
      'Brands posting regularly with little to show for it',
      'D2C businesses that need paid social to sell',
      'B2B founders building authority on LinkedIn',
      'Businesses with a customer list they never market to',
    ],
    outcomes: [
      { title: 'Content with a job', text: 'A calendar where each post builds trust, answers objections or drives an action.' },
      { title: 'Paid reach that converts', text: 'Meta and LinkedIn campaigns measured on leads and sales, with creative tested every month.' },
      { title: 'Owned channels', text: 'WhatsApp broadcasts and email sequences that turn followers into repeat customers.' },
    ],
    steps: [
      { title: 'Audit & strategy', text: 'Audience, competitors, content pillars and channel priorities.' },
      { title: 'Create', text: 'Reels, carousels, posts and ad creative produced to a monthly calendar.' },
      { title: 'Distribute & promote', text: 'Organic publishing plus paid amplification of what performs.' },
      { title: 'Measure', text: 'Monthly report on reach, engagement, leads and sales by channel.' },
    ],
    faqs: [
      { q: 'Which social platforms should my business be on?', a: 'Where your buyers spend time: Instagram and Facebook for most consumer brands, LinkedIn for B2B, YouTube for considered purchases. We recommend focus over being everywhere.' },
      { q: 'Do you create the content too?', a: 'Yes — we plan, write and design posts, reels and ad creative, and work with your photos or a shoot when needed.' },
      { q: 'Can social media really bring leads?', a: 'Yes, when content and paid campaigns are built around a clear offer and tracked properly. We report enquiries and sales, not just likes.' },
      { q: 'Do you offer WhatsApp marketing?', a: 'Yes. We set up broadcasts, catalogues and automated flows on the WhatsApp Business API.' },
    ],
    relatedPosts: [],
  },
  {
    slug: 'content-marketing',
    groupId: 'content-marketing',
    title: 'Content Marketing & SEO Copywriting Services',
    description:
      'Expert content marketing: strategy, SEO blog writing, website copy and digital PR that earn rankings, trust and AI citations.',
    h1: 'Content that earns rankings, trust and AI citations',
    intro:
      'Original, expert content written by people who understand your industry — planned around what buyers search for and what AI assistants quote.',
    pricingTab: 'seo',
    formService: 'SEO',
    forWho: [
      'Businesses with a blog that brings no traffic',
      'Experts who know their field but have no time to write',
      'Service pages that explain features instead of selling outcomes',
      'Brands that want mentions on respected publications',
    ],
    outcomes: [
      { title: 'A plan, not random posts', text: 'Topic clusters mapped to search intent and the buyer journey.' },
      { title: 'Copy that sells', text: 'Homepage, service and landing page copy that turns visitors into enquiries.' },
      { title: 'Authority', text: 'Guest posts and digital PR on relevant publications that build links and AI trust.' },
    ],
    steps: [
      { title: 'Research', text: 'Keywords, questions, competitors and gaps in your current content.' },
      { title: 'Plan', text: 'A quarterly calendar with briefs for every piece.' },
      { title: 'Write & optimise', text: 'Expert drafts, edited, optimised and structured for search and AI.' },
      { title: 'Promote & measure', text: 'Distribution, internal links and monthly performance tracking.' },
    ],
    faqs: [
      { q: 'Is your content written by AI?', a: 'Our writers use AI for research and outlines, but every piece is written, fact-checked and edited by people — with your expertise built in.' },
      { q: 'How many articles do I need each month?', a: 'Quality beats volume. Most businesses do well with 2–8 strong pieces a month, which is what our SEO plans include.' },
      { q: 'Do you write in Hindi?', a: 'Yes — we produce Hindi and regional-language content for brands reaching buyers beyond English search.' },
      { q: 'How do you measure content performance?', a: 'Rankings, organic traffic, AI citations and, most importantly, enquiries attributed to each page.' },
    ],
    relatedPosts: ['geo-chatgpt-seo-guide'],
  },
  {
    slug: 'analytics-cro',
    groupId: 'analytics-cro',
    title: 'GA4 Setup, Conversion Tracking & CRO Services',
    description:
      'GA4 and Tag Manager setup, call and lead tracking, Looker Studio dashboards and conversion rate optimisation that turns more visitors into enquiries.',
    h1: 'Know where every lead comes from — then get more of them',
    intro:
      'Clean GA4 and Tag Manager tracking for forms, calls and WhatsApp clicks, live dashboards in plain English, and conversion rate optimisation that raises enquiries from the same traffic.',
    formService: 'Not sure yet',
    forWho: [
      'Businesses that can’t say which channel brings their leads',
      'Ad accounts optimising for clicks instead of conversions',
      'Sites with decent traffic but few enquiries',
      'Owners who want one simple dashboard',
    ],
    outcomes: [
      { title: 'Accurate tracking', text: 'GA4, Tag Manager and ad-platform conversions for every form, call and WhatsApp click.' },
      { title: 'Clear dashboards', text: 'A Looker Studio dashboard showing leads, cost per lead and channel performance.' },
      { title: 'More enquiries', text: 'Testing and UX fixes on the pages that matter most to conversion.' },
    ],
    steps: [
      { title: 'Tracking audit', text: 'What is tracked today, what is broken and what is missing.' },
      { title: 'Implementation', text: 'GA4, GTM, Google Ads and Meta conversions, call tracking and UTMs.' },
      { title: 'Dashboards', text: 'Live reporting built around the numbers you make decisions with.' },
      { title: 'Optimise', text: 'Prioritised CRO tests on forms, offers and page layout.' },
    ],
    faqs: [
      { q: 'Why does conversion tracking matter for ads?', a: 'Google and Meta bidding optimises toward the conversions you track. Without accurate tracking they optimise for clicks, which usually means wasted budget.' },
      { q: 'Can you track phone calls and WhatsApp clicks?', a: 'Yes — click-to-call and WhatsApp clicks are tracked as conversions, and call tracking numbers can attribute calls to the channel and keyword.' },
      { q: 'What is conversion rate optimisation?', a: 'CRO improves the share of visitors who enquire or buy — through clearer offers, faster pages, better forms and tested layouts.' },
      { q: 'Do you work with my existing analytics?', a: 'Yes. We audit and fix your current GA4 property rather than starting over, so you keep your history.' },
    ],
    relatedPosts: ['google-ads-small-business-budget'],
  },
  {
    slug: 'app-marketing',
    groupId: 'app-marketing',
    title: 'App Marketing — App Store Optimisation & Install Campaigns',
    description:
      'Grow installs and engaged users with App Store Optimisation (ASO) for Google Play and the App Store, plus Google App Campaigns and Meta app ads.',
    h1: 'More installs from users who stay',
    intro:
      'App Store Optimisation to rank in Google Play and the App Store, and install campaigns optimised for engaged users — not cheap installs that churn.',
    formService: 'Not sure yet',
    forWho: [
      'Apps with low visibility in store search',
      'Startups launching a new app',
      'Apps paying for installs that never open twice',
      'Teams without in-house performance marketing',
    ],
    outcomes: [
      { title: 'Store visibility', text: 'Keyword-optimised titles, descriptions and screenshots that rank and convert.' },
      { title: 'Quality installs', text: 'Google App Campaigns and Meta app ads optimised for in-app actions.' },
      { title: 'Measured growth', text: 'Install, retention and cost-per-action reporting in one place.' },
    ],
    steps: [
      { title: 'Store audit', text: 'Keywords, listing quality, ratings and competitor benchmarks.' },
      { title: 'Optimise listing', text: 'Copy, screenshots and video tested for conversion.' },
      { title: 'Launch campaigns', text: 'App campaigns with in-app event tracking.' },
      { title: 'Scale', text: 'Budget follows the channels with the best retained users.' },
    ],
    faqs: [
      { q: 'What is App Store Optimisation?', a: 'ASO improves your app’s ranking and conversion in Google Play and Apple App Store search through keywords, visuals and ratings.' },
      { q: 'Do you run Google App Campaigns?', a: 'Yes, along with Meta app install ads, optimised for in-app actions rather than raw installs.' },
      { q: 'How do you measure app marketing?', a: 'Installs, cost per install, in-app actions and retention, using store consoles and your attribution tool.' },
      { q: 'Can you help with an app launch?', a: 'Yes — we prepare the store listing before launch and plan the first campaigns around it.' },
    ],
    relatedPosts: [],
  },
]

export const servicePageBySlug = (slug: string) => servicePages.find((p) => p.slug === slug)
export const servicePageByGroup = (groupId: string) => servicePages.find((p) => p.groupId === groupId)
export const serviceHref = (groupId: string) => {
  const p = servicePageByGroup(groupId)
  return p ? `/services/${p.slug}` : `/services#${groupId}`
}
export const groupFor = (page: ServicePage) => serviceGroups.find((g) => g.id === page.groupId)!
