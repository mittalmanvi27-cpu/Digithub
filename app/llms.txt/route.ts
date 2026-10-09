import { pricing } from '@/lib/pricing'
import { faqs, site } from '@/lib/site'
import { getPosts } from '@/lib/blog'
import { groupFor, servicePages } from '@/lib/service-pages'

export const dynamic = 'force-static'

/** llms.txt — a plain-text brief for AI assistants (ChatGPT, Gemini, Perplexity). We practise the GEO we sell. */
export function GET() {
  const body = `# ${site.name}

> ${site.description}

Contact: ${site.email} · WhatsApp ${site.phone} · ${site.hours}
Free instant AI website audit: ${site.url}/audit

## Services
${servicePages.map((p) => `- [${groupFor(p).name}](${site.url}/services/${p.slug}): ${p.description} Includes ${groupFor(p).items.map((i) => i.name).join(', ')}.`).join('\n')}

## Pricing (excl. GST, no lock-in, month-to-month with 30 days' notice)
${pricing.map((t) => `- ${t.label}: ${t.plans.map((p) => `${p.name} ${p.price} ${p.unit}`).join('; ')}.${t.note ? ' ' + t.note : ''}`).join('\n')}

## FAQ
${[...faqs, ...servicePages.flatMap((p) => p.faqs)].map((f) => `- ${f.q} ${f.a}`).join('\n')}

## Articles
${getPosts().map((p) => `- [${p.title}](${site.url}/blog/${p.slug}): ${p.description}`).join('\n')}
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
