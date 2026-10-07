'use client'

import { useEffect, useRef } from 'react'

/**
 * Animated neural-network field: drifting nodes, distance-weighted edges and
 * "signals" that travel along edges like activations. Nodes near the cursor
 * light up. Pauses off-screen and honours prefers-reduced-motion.
 */
export function NeuralBackground({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

    type Node = { x: number; y: number; vx: number; vy: number; r: number; layer: number }
    type Pulse = { a: number; b: number; t: number; speed: number }
    let nodes: Node[] = []
    let pulses: Pulse[] = []
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    const mouse = { x: -9999, y: -9999 }
    const LINK = 150

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(90, (w * h) / 16000))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.8,
        layer: Math.random(),
      }))
      pulses = []
    }

    const frame = () => {
      ctx.clearRect(0, 0, w, h)
      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0 || n.x > w) n.vx *= -1
          if (n.y < 0 || n.y > h) n.vy *= -1
        }
      }
      // edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d > LINK) continue
          const near = Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y) < 160
          ctx.strokeStyle = near ? `rgba(63,201,160,${0.5 * (1 - d / LINK)})` : `rgba(148,190,210,${0.22 * (1 - d / LINK)})`
          ctx.lineWidth = near ? 1 : 0.6
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
          if (!reduced && pulses.length < 18 && Math.random() < 0.0015) pulses.push({ a: i, b: j, t: 0, speed: 0.008 + Math.random() * 0.012 })
        }
      }
      // signals travelling along edges
      pulses = pulses.filter((p) => {
        p.t += p.speed
        const a = nodes[p.a]
        const b = nodes[p.b]
        if (!a || !b || p.t > 1 || Math.hypot(a.x - b.x, a.y - b.y) > LINK) return false
        const x = a.x + (b.x - a.x) * p.t
        const y = a.y + (b.y - a.y) * p.t
        const g = ctx.createRadialGradient(x, y, 0, x, y, 8)
        g.addColorStop(0, 'rgba(126,224,194,0.9)')
        g.addColorStop(1, 'rgba(63,201,160,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()
        return true
      })
      // nodes
      for (const n of nodes) {
        const near = Math.hypot(n.x - mouse.x, n.y - mouse.y) < 140
        ctx.fillStyle = near ? 'rgba(126,224,194,0.95)' : `rgba(190,205,225,${0.25 + n.layer * 0.35})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, near ? n.r + 1.2 : n.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!reduced && visible) raf = requestAnimationFrame(frame)
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      if (reduced) frame()
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(frame)
    })

    resize()
    frame()
    io.observe(canvas)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
