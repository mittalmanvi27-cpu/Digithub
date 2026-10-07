# Digitroot website

Next.js 16 (App Router, TypeScript, Tailwind CSS 4) marketing site with three AI automations powered by Claude (`claude-opus-5-5`).

## Run locally

```bash
npm install
cp .env.example .env.local     # add ANTHROPIC_API_KEY (everything else optional)
npm run dev                    # http://localhost:3000
```

Production: `npm run build && npm start`, or push to GitHub and import the repo on [Vercel](https://vercel.com) (add the same env vars there).

Without an API key the site still works fully: the chat falls back to guided answers, the audit shows its automated scores without the written report, and leads are still delivered (just not AI-scored).

## AI automations

| Feature | Where | What it does |
|---|---|---|
| **Instant AI website audit** | `/audit`, hero input | Fetches the visitor's homepage (blocking internal or private addresses), runs 26 checks across SEO, AI-search readiness, conversion and technical health, then Claude streams a prioritised report and 90-day plan. A "Get my free review" form turns it into a lead with the audit attached. Optional `PAGESPEED_API_KEY` adds real Lighthouse / Core Web Vitals. |
| **Digi, the AI assistant** | Floating "Ask Digi" + buttons across the site | Retrieval-augmented chat: BM25 search over services, pricing, FAQ, blog posts and `content/knowledge/*.md`; answers stream in English, Hindi or Hinglish with source links. |
| **AI lead scoring and routing** | Contact form, pricing "Choose" buttons, calculator, audit | The response returns instantly; then in the background Claude scores the lead (hot/warm/cold, 0–100), picks the right service, writes a next action and drafts a WhatsApp reply in the lead's language. The result is sent to `LEAD_WEBHOOK_URL` (Make, Zapier, n8n, Slack…) and/or emailed through Resend, with a one-click "Reply on WhatsApp" link. |

All Claude calls use server-side refusal fallback (`fallbacks: "default"`), prompt caching on system prompts, and per-IP rate limits (chat 12/min, audit 5 per 10 min, leads 5 per 10 min). The rate limits are counted per server instance; for heavy traffic, put a shared store or your host's firewall rate limit in front.

## SEO / AI-search built in

Static pre-rendering, `sitemap.xml`, `robots.txt`, a generated OG image, Organization + FAQ + BlogPosting JSON-LD, and `/llms.txt` (a plain-text brief for ChatGPT/Gemini/Perplexity). Old `.html` URLs (`/services.html`, `/blog/*.html`) 308-redirect to the new routes.

## Updating content

| What | File |
|---|---|
| Contact details, FAQ, comparison table, industries | `lib/site.ts` |
| Services (8 groups, 46 services) | `lib/services.ts` |
| Pricing plans | `lib/pricing.ts` |
| Extra facts for Digi (policies, timelines…) | `content/knowledge/company.md` |
| Blog posts | add `content/blog/<slug>.md` with frontmatter `title, description, category, date, readTime` — Markdown or HTML body |

Digi's knowledge base rebuilds from these files automatically.

## Structure

```
app/                 pages, API routes (api/chat, api/audit, api/lead, api/health), sitemap, robots, llms.txt, OG image
components/          header, footer, chat widget, audit tool, pricing, calculator, contact form
lib/                 site data, knowledge base (BM25), audit engine, SSRF-safe fetch, lead scoring, AI client
content/             blog posts + knowledge for Digi
legacy/              previous static HTML + Python version, kept for reference (safe to delete)
```
