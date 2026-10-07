import { Fragment, type ReactNode } from 'react'

/**
 * Tiny, safe markdown renderer for streamed AI text (chat + audit report).
 * Builds React elements directly — no innerHTML — so model output can never
 * inject markup. Supports ### headings, - / • / 1. lists, **bold** and links
 * to this site.
 */
function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((\/[^)\s]*|https:\/\/(?:www\.)?digitroot\.in[^)\s]*)\)|(\/(?:audit|services|blog)[\w\-/#]*)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1]) out.push(<strong key={`${key}-${i++}`}>{m[1]}</strong>)
    else if (m[2]) out.push(<a key={`${key}-${i++}`} href={m[3]}>{m[2]}</a>)
    else if (m[4]) out.push(<a key={`${key}-${i++}`} href={m[4]}>{m[4]}</a>)
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function Markdown({ text, className = 'md' }: { text: string; className?: string }) {
  const blocks: ReactNode[] = []
  let list: { ordered: boolean; items: string[] } | null = null
  let para: string[] = []
  let k = 0

  const flushPara = () => {
    if (para.length) blocks.push(<p key={k++}>{inline(para.join(' '), `p${k}`)}</p>)
    para = []
  }
  const flushList = () => {
    if (!list) return
    const items = list.items.map((it, j) => <li key={j}>{inline(it, `l${k}-${j}`)}</li>)
    blocks.push(list.ordered ? <ol key={k++}>{items}</ol> : <ul key={k++}>{items}</ul>)
    list = null
  }

  for (const raw of text.split('\n')) {
    const line = raw.trim()
    const h = line.match(/^#{1,4}\s+(.*)/)
    const ul = line.match(/^(?:[-*•])\s+(.*)/)
    const ol = line.match(/^\d+[.)]\s+(.*)/)
    if (!line) {
      flushPara()
      flushList()
    } else if (h) {
      flushPara()
      flushList()
      blocks.push(<h3 key={k++}>{inline(h[1].replace(/\*\*/g, ''), `h${k}`)}</h3>)
    } else if (ul || ol) {
      flushPara()
      const ordered = !!ol
      if (list && list.ordered !== ordered) flushList()
      list ??= { ordered, items: [] }
      list.items.push((ul ?? ol)![1])
    } else if (list && raw.startsWith('  ')) {
      list.items[list.items.length - 1] += ' ' + line
    } else {
      flushList()
      para.push(line)
    }
  }
  flushPara()
  flushList()
  return <div className={className}>{blocks.map((b, i) => <Fragment key={i}>{b}</Fragment>)}</div>
}
