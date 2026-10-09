import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal-page'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Digitroot collects, uses and protects personal data submitted through this website, including enquiry forms, the AI assistant and the AI audit.',
  alternates: { canonical: '/privacy-policy' },
}

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" updated="9 October 2026">
      <p>
        This policy explains how {site.name} (“we”, “us”) handles personal data collected through {site.url.replace(/^https?:\/\//, '')}. We follow the Digital Personal Data Protection Act, 2023 (India) and collect only what we need to reply to you and run this website.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Enquiry details</strong> you submit in our forms: name, phone / WhatsApp number, email, website, service of interest, budget and message.</li>
        <li><strong>AI audit input</strong>: the website address you ask us to audit. We read only that site’s public pages.</li>
        <li><strong>Chat messages</strong> you send to Digi, our AI assistant.</li>
        <li><strong>Marketing attribution</strong>: the ad campaign, keyword or link that brought you here (UTM parameters and ad click IDs such as gclid or fbclid), and the page you first landed on. This is stored in your browser for up to 90 days and sent with your enquiry.</li>
        <li><strong>Usage data</strong> collected by analytics and advertising tools (see Cookies below), such as pages viewed, device and approximate location.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To reply to your enquiry and prepare a proposal or audit.</li>
        <li>To prioritise and route enquiries, including automated scoring by an AI model.</li>
        <li>To measure which marketing channels and ads bring enquiries, and to improve our website.</li>
        <li>To show relevant ads to people who visited our website (remarketing), where those tools are enabled.</li>
      </ul>
      <p>We do not sell your personal data.</p>

      <h2>Who processes it for us</h2>
      <p>We use trusted service providers who process data on our behalf, only for the purposes above:</p>
      <ul>
        <li><strong>Anthropic</strong> — AI model that powers the Digi assistant, the written audit report and enquiry scoring.</li>
        <li><strong>Hosting provider</strong> (e.g. Vercel) — serves this website.</li>
        <li><strong>Email and automation tools</strong> (e.g. Resend, Zapier, Make, Google Sheets, Slack) — deliver enquiries to our team.</li>
        <li><strong>Google</strong> (Analytics, Tag Manager, Ads, PageSpeed Insights) and <strong>Meta</strong> (Pixel) — measurement and advertising, where enabled.</li>
      </ul>

      <h2>Cookies and similar technologies</h2>
      <p>
        We use browser storage and cookies to remember how you arrived (attribution), keep the chat working, and — where enabled — for Google Analytics, Google Ads and Meta Pixel measurement. You can block or delete cookies in your browser settings; the site will still work.
      </p>

      <h2>How long we keep it</h2>
      <p>Enquiry data is kept for as long as needed to respond and for up to 24 months afterwards, unless you become a client or ask us to delete it sooner.</p>

      <h2>Your rights</h2>
      <p>
        You can ask to access, correct or delete your personal data, or withdraw consent, by emailing <a href={`mailto:${site.email}`}>{site.email}</a>. We’ll respond within 30 days. You may also raise a grievance with the Data Protection Board of India.
      </p>

      <h2>Contact</h2>
      <p>
        {site.name} · <a href={`mailto:${site.email}`}>{site.email}</a> · {site.phone}
      </p>
    </LegalPage>
  )
}
