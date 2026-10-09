import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal-page'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms for using the Digitroot website, free AI tools and our digital marketing services.',
  alternates: { canonical: '/terms' },
}

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="9 October 2026">
      <p>By using this website or engaging {site.name} for services, you agree to these terms. A signed proposal or agreement for a specific engagement takes precedence where it differs.</p>

      <h2>Free tools</h2>
      <p>
        The AI website audit and the Digi assistant are provided free, as-is, for general guidance. They use automated checks and AI-generated text, which can be incomplete or wrong — please verify before acting on them. Only audit websites you own or are authorised to review.
      </p>

      <h2>Services and pricing</h2>
      <ul>
        <li>Prices shown on this website are starting points, exclude GST, and are confirmed in a written proposal.</li>
        <li>Advertising budgets are paid by you directly to the ad platform (e.g. Google, Meta) and are separate from our management fee.</li>
        <li>Monthly services (SEO, PPC, social) are month-to-month and can be cancelled with 30 days’ written notice.</li>
        <li>One-time projects (e.g. websites) follow the payment milestones in the proposal.</li>
      </ul>

      <h2>No guaranteed results</h2>
      <p>
        Search rankings, AI-assistant recommendations and ad performance depend on third-party platforms and market factors outside our control. We commit to doing the agreed work professionally and reporting transparently, but we do not guarantee specific rankings, traffic, leads or revenue.
      </p>

      <h2>Ownership</h2>
      <p>
        You own your website content, ad accounts, analytics properties and data. On full payment, deliverables we create specifically for you (such as website designs and written content) belong to you. We may reuse our general know-how, tools and templates.
      </p>

      <h2>Liability</h2>
      <p>To the extent permitted by law, our total liability for any engagement is limited to the fees you paid us in the three months before the claim.</p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India.</p>

      <h2>Contact</h2>
      <p>
        Questions? Email <a href={`mailto:${site.email}`}>{site.email}</a> or WhatsApp {site.phone}.
      </p>
    </LegalPage>
  )
}
