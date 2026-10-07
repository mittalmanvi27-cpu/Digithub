import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChatWidget } from '@/components/chat-widget'
import { site } from '@/lib/site'
import { serviceGroups } from '@/lib/services'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Digitroot — SEO, AI Search, Google Ads & Website Design Agency',
    template: '%s | Digitroot',
  },
  description: site.description,
  applicationName: 'Digitroot',
  keywords: ['SEO agency India', 'AI search optimisation', 'GEO', 'AEO', 'ChatGPT SEO', 'Google Ads agency', 'Meta Ads', 'website design', 'local SEO'],
  alternates: { canonical: '/' },
  icons: { icon: '/assets/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'Digitroot',
    locale: 'en_IN',
    url: site.url,
    title: 'Digitroot — Get found. Get chosen. Get growing.',
    description: site.description,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#070b14',
  width: 'device-width',
  initialScale: 1,
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${site.url}/#org`,
  name: site.name,
  url: site.url,
  logo: `${site.url}/assets/digitroot-logo.png`,
  description: site.description,
  email: site.email,
  telephone: '+91-77102-42183',
  areaServed: 'IN',
  priceRange: '₹₹',
  address: { '@type': 'PostalAddress', addressCountry: 'IN' },
  openingHours: 'Mo-Sa 10:00-19:00',
  sameAs: [site.linkedin, site.instagram],
  makesOffer: serviceGroups.map((g) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: g.name, description: g.text } })),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema).replace(/</g, '\\u003c') }} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  )
}
