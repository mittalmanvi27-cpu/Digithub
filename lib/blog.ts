import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { Marked } from 'marked'

export type Post = {
  slug: string
  title: string
  description: string
  category: string
  date: string
  readTime: string
  html: string
  toc: { id: string; text: string }[]
}

const DIR = path.join(process.cwd(), 'content', 'blog')

const headingId = (text: string) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// Markdown posts get ids on their h2s so the table of contents can link to them.
const marked = new Marked({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens)
      return `<h${depth} id="${headingId(text)}">${text}</h${depth}>\n`
    },
  },
})

let cache: Post[] | null = null

export function getPosts(): Post[] {
  if (cache && process.env.NODE_ENV === 'production') return cache
  const posts = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(DIR, file), 'utf8'))
      const html = marked.parse(content, { async: false }) as string
      const toc = [...html.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)].map((m) => ({
        id: m[1],
        text: m[2].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&'),
      }))
      return {
        slug: file.replace(/\.md$/, ''),
        title: String(data.title),
        description: String(data.description),
        category: String(data.category),
        date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date),
        readTime: String(data.readTime ?? ''),
        html,
        toc,
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
  cache = posts
  return posts
}

export function getPost(slug: string) {
  return getPosts().find((p) => p.slug === slug)
}

export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}
