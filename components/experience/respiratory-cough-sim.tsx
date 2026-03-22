'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface RespiratoryCoughSimProps { className?: string }

interface ExpelledParticle { x: number; y: number; vx: number; vy: number; life: number; size: number; type: 'mucus' | 'air' }

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.02)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.32)'
const COL_WALL = 'rgba(45, 212, 191, 0.35)'
const COL_WALL_FILL = 'rgba(45, 212, 191, 0.04)'
const COL_MUCOSA = 'rgba(244, 120, 160, 0.2)'
const COL_CARTILAGE = 'rgba(167, 139, 250, 0.2)'
const COL_MUSCLE = 'rgba(244, 63, 94, 0.2)'
const COL_GLOTTIS = 'rgba(250, 204, 21, 0.75)'
const COL_GLOTTIS_CLOSED = 'rgba(244, 63, 94, 0.8)'
const COL_AIR_IN = 'rgba(34, 211, 238, 0.7)'
const COL_AIR_OUT = 'rgba(250, 204, 21, 0.8)'
const COL_PRESSURE = 'rgba(244, 63, 94, 0.5)'
const COL_DIAPHRAGM = 'rgba(244, 63, 94, 0.35)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

const PHASES = [
  { name: 'Fase Irritativa', color: 'rgba(251, 146, 60, 0.8)', dur: 0.10 },
  { name: 'Fase Inspiratória', color: 'rgba(34, 211, 238, 0.8)', dur: 0.22 },
  { name: 'Fase Compressiva', color: 'rgba(244, 63, 94, 0.8)', dur: 0.22 },
  { name: 'Fase Expulsiva', color: 'rgba(250, 204, 21, 0.8)', dur: 0.28 },
  { name: 'Relaxamento', color: 'rgba(45, 212, 191, 0.7)', dur: 0.18 },
]

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function ease(t: number) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 }
function clamp01(t: number) { return Math.max(0, Math.min(1, t)) }

/* ─────────────────────── component ─────────────────────── */

export function RespiratoryCoughSim({ className }: RespiratoryCoughSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [paused, setPaused] = useState(false)
  const stRef = useRef({
    t: 0, last: 0, cycle: 0, cycles: 0,
    pressure: 0, volume: 2400, glottis: 1, diaY: 0,
    particles: [] as ExpelledParticle[],
    airIn: [] as { t: number }[],
  })

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const s = stRef.current
    const S = Math.min(w / 720, h / 480)
    ctx.fillStyle = COL_BG; ctx.fillRect(0, 0, w, h)

    // grid
    ctx.strokeStyle = COL_GRID; ctx.lineWidth = 0.5
    const gs = 26 * S
    for (let x = 0; x < w; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
    for (let y = 0; y < h; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

    if (!paused) s.cycle = (s.cycle + 0.0028) % 1
    let pi = 0, pt = 0, cum = 0
    for (let i = 0; i < PHASES.length; i++) {
      if (s.cycle >= cum && s.cycle < cum + PHASES[i].dur) { pi = i; pt = (s.cycle - cum) / PHASES[i].dur; break }
      cum += PHASES[i].dur
    }
    if (s.cycle < 0.001 && pi === 0 && pt < 0.01) s.cycles++

    // ── compute physics
    const ept = ease(pt)
    switch (pi) {
      case 0: s.glottis = 1; s.pressure = 0; s.volume = 2400; s.diaY = 0; break
      case 1: s.glottis = 1; s.pressure = 0; s.volume = lerp(2400, 4900, ept); s.diaY = ept * 0.8; break
      case 2: s.glottis = lerp(1, 0, ease(clamp01(pt * 2.5))); s.pressure = lerp(0, 300, ept); s.volume = 4900; s.diaY = 0.8; break
      case 3:
        s.glottis = lerp(0, 1, ease(clamp01(pt * 4)))
        s.pressure = lerp(300, 0, ept); s.volume = lerp(4900, 1800, ept)
        s.diaY = lerp(0.8, -0.1, ept)
        if (pt < 0.4 && !paused && Math.random() < 0.4) {
          for (let k = 0; k < 3; k++) s.particles.push({
            x: 0, y: 0, vx: 6 + Math.random() * 10, vy: (Math.random() - 0.5) * 3,
            life: 1, size: 1.5 + Math.random() * 3, type: Math.random() > 0.4 ? 'air' : 'mucus',
          })
        }
        break
      case 4: s.glottis = 1; s.pressure = 0; s.volume = lerp(1800, 2400, ept); s.diaY = lerp(-0.1, 0, ept); break
    }

    // ── ANATOMY — sagittal airway cross-section ──
    const cx = w * 0.32
    const midY = h * 0.42
    const lungExp = (s.volume - 2400) / 2500

    // helper: draw tube with walls, lumen, mucosa, cartilage
    const drawTube = (x1: number, y1: number, x2: number, y2: number, outerR: number, opts: {
      cartilage?: boolean; muscle?: boolean; cilia?: boolean; mucus?: boolean; constrict?: number
    } = {}) => {
      const dx = x2 - x1, dy = y2 - y1
      const len = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx)
      const perp = angle + Math.PI / 2
      const r = outerR * (1 - (opts.constrict ?? 0) * 0.3)

      // outer wall
      ctx.beginPath()
      ctx.moveTo(x1 + Math.cos(perp) * r, y1 + Math.sin(perp) * r)
      ctx.lineTo(x2 + Math.cos(perp) * r, y2 + Math.sin(perp) * r)
      ctx.lineTo(x2 - Math.cos(perp) * r, y2 - Math.sin(perp) * r)
      ctx.lineTo(x1 - Math.cos(perp) * r, y1 - Math.sin(perp) * r)
      ctx.closePath()
      ctx.fillStyle = COL_WALL_FILL
      ctx.fill()

      // wall strokes
      ctx.beginPath()
      ctx.moveTo(x1 + Math.cos(perp) * r, y1 + Math.sin(perp) * r)
      ctx.lineTo(x2 + Math.cos(perp) * r, y2 + Math.sin(perp) * r)
      ctx.moveTo(x1 - Math.cos(perp) * r, y1 - Math.sin(perp) * r)
      ctx.lineTo(x2 - Math.cos(perp) * r, y2 - Math.sin(perp) * r)
      ctx.strokeStyle = COL_WALL; ctx.lineWidth = 1.5; ctx.stroke()

      // mucosa layer (inner lining)
      if (opts.mucus !== false) {
        ctx.beginPath()
        ctx.moveTo(x1 + Math.cos(perp) * (r - 2), y1 + Math.sin(perp) * (r - 2))
        ctx.lineTo(x2 + Math.cos(perp) * (r - 2), y2 + Math.sin(perp) * (r - 2))
        ctx.moveTo(x1 - Math.cos(perp) * (r - 2), y1 - Math.sin(perp) * (r - 2))
        ctx.lineTo(x2 - Math.cos(perp) * (r - 2), y2 - Math.sin(perp) * (r - 2))
        ctx.strokeStyle = COL_MUCOSA; ctx.lineWidth = 2; ctx.stroke()
      }

      // cartilage rings (C-shaped)
      if (opts.cartilage) {
        const ringN = Math.max(2, Math.floor(len / (12 * S)))
        for (let i = 0; i < ringN; i++) {
          const t = (i + 0.5) / ringN
          const rx = lerp(x1, x2, t), ry = lerp(y1, y2, t)
          ctx.beginPath()
          ctx.arc(rx, ry, r * 0.92, perp - Math.PI * 0.7, perp + Math.PI * 0.7)
          ctx.strokeStyle = COL_CARTILAGE; ctx.lineWidth = 2.5 * S; ctx.stroke()
        }
      }

      // smooth muscle band (posterior wall)
      if (opts.muscle) {
        ctx.beginPath()
        for (let t = 0; t <= 1; t += 0.02) {
          const px = lerp(x1, x2, t) - Math.cos(perp) * (r + 2)
          const py = lerp(y1, y2, t) - Math.sin(perp) * (r + 2)
          t === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
        }
        ctx.strokeStyle = COL_MUSCLE; ctx.lineWidth = 3; ctx.stroke()
      }

      // cilia
      if (opts.cilia) {
        const cilN = Math.floor(len / (5 * S))
        for (let i = 0; i < cilN; i++) {
          const t = (i + 0.5) / cilN
          const phase = s.t * 5 + i * 0.5
          const sway = Math.sin(phase) * 3
          for (const side of [1, -1]) {
            const bx = lerp(x1, x2, t) + Math.cos(perp) * (r - 3) * side
            const by = lerp(y1, y2, t) + Math.sin(perp) * (r - 3) * side
            ctx.beginPath()
            ctx.moveTo(bx, by)
            ctx.lineTo(bx + Math.cos(perp) * sway * side * -0.5, by + Math.sin(perp) * sway * side * -0.5 - 3)
            ctx.strokeStyle = `rgba(45, 212, 191, ${0.2 + Math.sin(phase) * 0.08})`
            ctx.lineWidth = 0.6; ctx.stroke()
          }
        }
      }
    }

    // ── LUNGS (simplified but realistic oval shapes)
    const lungCx = cx
    const lungCy = midY + 80 * S
    const lungWw = 85 * S * (1 + lungExp * 0.15)
    const lungHh = 70 * S * (1 + lungExp * 0.2)

    for (const side of [-1, 1]) {
      const lx = lungCx + side * 45 * S
      ctx.beginPath()
      ctx.ellipse(lx, lungCy, lungWw * (side === 1 ? 0.85 : 0.78), lungHh, 0, 0, Math.PI * 2)
      const pressureAlpha = s.pressure / 300 * 0.12
      ctx.fillStyle = `rgba(45, 212, 191, ${0.04 + pressureAlpha + lungExp * 0.03})`
      ctx.fill()
      ctx.strokeStyle = `rgba(45, 212, 191, ${0.2 + s.pressure / 300 * 0.15})`
      ctx.lineWidth = 1.5; ctx.stroke()

      // pressure glow inside lungs
      if (s.pressure > 20) {
        const pg = ctx.createRadialGradient(lx, lungCy, 0, lx, lungCy, lungWw * 0.8)
        pg.addColorStop(0, `rgba(244, 63, 94, ${s.pressure / 300 * 0.2})`)
        pg.addColorStop(1, 'transparent')
        ctx.fillStyle = pg
        ctx.fillRect(lx - lungWw, lungCy - lungHh, lungWw * 2, lungHh * 2)
      }

      // bronchial branch into lung
      const bx1 = cx + side * 10 * S, by1 = midY + 30 * S
      const bx2 = lx, by2 = lungCy - lungHh * 0.3
      ctx.beginPath(); ctx.moveTo(bx1, by1)
      ctx.quadraticCurveTo(bx1 + side * 15 * S, by1 + 20 * S, bx2, by2)
      ctx.strokeStyle = COL_WALL; ctx.lineWidth = 3 * S; ctx.stroke()

      // label
      ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(45, 212, 191, 0.25)'
      ctx.fillText(side === 1 ? 'D' : 'E', lx, lungCy + lungHh + 12)
    }

    // ── DIAPHRAGM
    const diaBaseY = lungCy + lungHh * 0.85
    const diaDisp = s.diaY * 18 * S
    const diaWw = lungWw * 2 + 30 * S
    ctx.beginPath()
    ctx.moveTo(lungCx - diaWw, diaBaseY + diaDisp + 10 * S)
    ctx.quadraticCurveTo(lungCx, diaBaseY + diaDisp - 8 * S, lungCx + diaWw, diaBaseY + diaDisp + 10 * S)
    ctx.strokeStyle = pi === 1 ? 'rgba(34, 211, 238, 0.5)' : (pi === 3 ? 'rgba(244, 63, 94, 0.5)' : COL_DIAPHRAGM)
    ctx.lineWidth = 3; ctx.stroke()

    // diaphragm label + arrows
    if (pi === 1 || pi === 3) {
      const dir = pi === 1 ? 1 : -1
      ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = pi === 1 ? COL_AIR_IN : 'rgba(244, 63, 94, 0.5)'
      ctx.fillText(pi === 1 ? 'DIAFRAGMA ↓ CONTRAI' : 'DIAFRAGMA ↑ RELAXA', lungCx, diaBaseY + diaDisp + 22 * S)
      // arrows
      for (let a = -1; a <= 1; a++) {
        const ax = lungCx + a * 40 * S
        ctx.beginPath()
        ctx.moveTo(ax, diaBaseY + diaDisp + 3)
        ctx.lineTo(ax, diaBaseY + diaDisp + 3 + dir * 8)
        ctx.strokeStyle = pi === 1 ? COL_AIR_IN : 'rgba(244, 63, 94, 0.4)'
        ctx.lineWidth = 1.5; ctx.stroke()
      }
    }

    // ── TRACHEA (vertical, detailed)
    const traTop = midY - 50 * S
    const traBif = midY + 25 * S
    const traR = 10 * S
    drawTube(cx, traTop, cx, traBif, traR, { cartilage: true, muscle: true, cilia: true })

    // carina
    ctx.beginPath()
    ctx.arc(cx, traBif + 2, 3 * S, 0, Math.PI)
    ctx.fillStyle = COL_CARTILAGE; ctx.fill()
    ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(167, 139, 250, 0.4)'
    ctx.fillText('Carina', cx + traR + 6, traBif + 5)

    // ── LARYNX box above trachea
    const larBot = traTop - 2
    const larTop = larBot - 30 * S
    const larW = 16 * S

    // thyroid cartilage shape
    ctx.beginPath()
    ctx.moveTo(cx, larTop - 4 * S) // Adam's apple point
    ctx.lineTo(cx + larW, larTop + 8 * S)
    ctx.lineTo(cx + larW - 2, larBot)
    ctx.lineTo(cx - larW + 2, larBot)
    ctx.lineTo(cx - larW, larTop + 8 * S)
    ctx.closePath()
    ctx.fillStyle = COL_WALL_FILL; ctx.fill()
    ctx.strokeStyle = COL_WALL; ctx.lineWidth = 1.5; ctx.stroke()

    // cartilage shading
    ctx.strokeStyle = COL_CARTILAGE; ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx - larW + 3, larTop + 10 * S)
    ctx.lineTo(cx + larW - 3, larTop + 10 * S)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx - larW + 4, larBot - 4)
    ctx.lineTo(cx + larW - 4, larBot - 4)
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.25)'; ctx.stroke()

    // epiglottis
    ctx.beginPath()
    ctx.moveTo(cx - 5, larTop + 2 * S)
    ctx.quadraticCurveTo(cx - 10 * S, larTop - 14 * S, cx, larTop - 18 * S)
    ctx.quadraticCurveTo(cx + 10 * S, larTop - 14 * S, cx + 5, larTop + 2 * S)
    ctx.fillStyle = 'rgba(250, 204, 21, 0.06)'; ctx.fill()
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)'; ctx.lineWidth = 1.5; ctx.stroke()

    // ── GLOTTIS (vocal cords)
    const glotY = (larTop + larBot) / 2 + 3 * S
    const glotGap = s.glottis * 7 * S
    const glotColor = s.glottis < 0.3 ? COL_GLOTTIS_CLOSED : COL_GLOTTIS

    // vocal cord bands
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(cx - larW + 5, glotY); ctx.lineTo(cx - glotGap, glotY)
    ctx.strokeStyle = glotColor; ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx + glotGap, glotY); ctx.lineTo(cx + larW - 5, glotY)
    ctx.strokeStyle = glotColor; ctx.stroke()

    // cord mass (thickened)
    ctx.beginPath()
    ctx.ellipse(cx - glotGap - 2, glotY, 4, 2.5, 0, 0, Math.PI * 2)
    ctx.fillStyle = glotColor.replace('0.75', '0.2').replace('0.8', '0.2')
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(cx + glotGap + 2, glotY, 4, 2.5, 0, 0, Math.PI * 2)
    ctx.fillStyle = glotColor.replace('0.75', '0.2').replace('0.8', '0.2')
    ctx.fill()

    // glottis state label
    ctx.font = `700 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'right'
    ctx.fillStyle = glotColor
    ctx.fillText(s.glottis < 0.3 ? '✕ GLOTE FECHADA' : '○ GLOTE ABERTA', cx - larW - 8, glotY + 4)

    // ── PHARYNX / MOUTH exit (curved path upward and right)
    const mouthExitX = cx + 80 * S
    const mouthExitY = larTop - 30 * S

    ctx.beginPath()
    ctx.moveTo(cx, larTop - 18 * S)
    ctx.bezierCurveTo(cx - 5, larTop - 35 * S, cx + 30 * S, mouthExitY - 10, mouthExitX, mouthExitY)
    ctx.lineTo(mouthExitX + 30 * S, mouthExitY)
    ctx.strokeStyle = COL_WALL; ctx.lineWidth = 1.5; ctx.stroke()

    // upper airway wall (parallel)
    ctx.beginPath()
    ctx.moveTo(cx, larTop - 18 * S + 12)
    ctx.bezierCurveTo(cx + 5, larTop - 30 * S, cx + 35 * S, mouthExitY + 5, mouthExitX, mouthExitY + 14)
    ctx.lineTo(mouthExitX + 30 * S, mouthExitY + 14)
    ctx.strokeStyle = COL_WALL; ctx.lineWidth = 1.5; ctx.stroke()

    // mouth opening label
    ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('→ BOCA', mouthExitX + 32 * S, mouthExitY + 10)

    // ── IRRITANT (phase 0)
    if (pi === 0) {
      const ix = cx + Math.sin(s.t * 6) * 4
      const iy = (traTop + traBif) / 2 + Math.sin(s.t * 4) * 6
      // spiky particle
      ctx.beginPath()
      for (let sp = 0; sp <= 8; sp++) {
        const a = (sp / 8) * Math.PI * 2
        const sr = (4 + (sp % 2) * 3) * S
        ctx.lineTo(ix + Math.cos(a + s.t * 2) * sr, iy + Math.sin(a + s.t * 2) * sr)
      }
      ctx.closePath()
      ctx.fillStyle = 'rgba(251, 146, 60, 0.25)'; ctx.fill()
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.7)'; ctx.lineWidth = 1.5; ctx.stroke()

      // receptor activation rings
      const flash = 0.25 + Math.sin(s.t * 8) * 0.15
      ctx.beginPath(); ctx.arc(ix, iy, 18 * S, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(251, 146, 60, ${flash})`
      ctx.lineWidth = 1; ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([])

      ctx.font = `600 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(251, 146, 60, 0.7)'
      ctx.fillText('IRRITANTE', ix, iy - 20 * S)
      ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
      ctx.fillStyle = 'rgba(251, 146, 60, 0.4)'
      ctx.fillText('receptores ativados', ix, iy - 12 * S)
    }

    // ── AIR FLOW IN (phase 1)
    if (pi === 1) {
      const airN = 10
      for (let i = 0; i < airN; i++) {
        const ap = (pt + i / airN * 0.8) % 1
        // path: mouth → pharynx → larynx → trachea → lungs
        let px: number, py: number
        if (ap < 0.3) {
          const t2 = ap / 0.3
          px = lerp(mouthExitX + 25 * S, cx, t2)
          py = lerp(mouthExitY + 7, larTop - 10 * S, t2)
        } else if (ap < 0.6) {
          const t2 = (ap - 0.3) / 0.3
          px = cx + Math.sin(s.t * 3 + i) * 3
          py = lerp(larTop, traBif, t2)
        } else {
          const t2 = (ap - 0.6) / 0.4
          const side = i % 2 === 0 ? 1 : -1
          px = lerp(cx, cx + side * 45 * S, t2) + Math.sin(s.t * 2 + i) * 3
          py = lerp(traBif, lungCy, t2)
        }
        ctx.beginPath(); ctx.arc(px, py, 2 * S, 0, Math.PI * 2)
        ctx.fillStyle = COL_AIR_IN; ctx.fill()
        const g = ctx.createRadialGradient(px, py, 0, px, py, 6)
        g.addColorStop(0, 'rgba(34, 211, 238, 0.2)'); g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.fillRect(px - 8, py - 8, 16, 16)
      }
    }

    // ── EXPELLED PARTICLES (phase 3)
    const exitX = mouthExitX + 20 * S
    const exitY = mouthExitY + 7
    for (let i = s.particles.length - 1; i >= 0; i--) {
      const p = s.particles[i]
      if (p.x === 0) { p.x = exitX; p.y = exitY }
      if (!paused) { p.x += p.vx; p.y += p.vy; p.life -= 0.012; p.vx *= 0.97 }
      if (p.life <= 0 || p.x > w + 20) { s.particles.splice(i, 1); continue }

      ctx.globalAlpha = p.life
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.type === 'mucus' ? 'rgba(45, 212, 191, 0.5)' : COL_AIR_OUT
      ctx.fill()
      // speed trail
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 2.5, p.y)
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 0.5; ctx.stroke()
      ctx.globalAlpha = 1
    }

    // ── structure labels (left side)
    ctx.font = `600 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'right'
    const lblX = cx - larW - 25 * S
    ctx.fillStyle = 'rgba(250, 204, 21, 0.35)'; ctx.fillText('EPIGLOTE', lblX, larTop - 12 * S)
    ctx.fillStyle = 'rgba(167, 139, 250, 0.35)'; ctx.fillText('LARINGE', lblX, (larTop + larBot) / 2 - 8)
    ctx.fillStyle = 'rgba(45, 212, 191, 0.35)'; ctx.fillText('TRAQUEIA', lblX, (traTop + traBif) / 2)
    ctx.fillStyle = 'rgba(167, 139, 250, 0.3)'; ctx.fillText('CARINA', lblX, traBif + 3)

    // ── PHASE TIMELINE BAR
    const barY = h - 50 * S, barH = 8 * S, barL = 60 * S, barR = w * 0.58
    const barW = barR - barL
    let bx = barL
    for (let i = 0; i < PHASES.length; i++) {
      const pw = barW * PHASES[i].dur
      const act = i === pi
      ctx.fillStyle = act ? PHASES[i].color.replace('0.8', '0.2').replace('0.7', '0.15') : 'rgba(255,255,255,0.02)'
      ctx.fillRect(bx, barY, pw, barH)
      ctx.strokeStyle = act ? PHASES[i].color : 'rgba(255,255,255,0.05)'
      ctx.lineWidth = act ? 1.5 : 0.5; ctx.strokeRect(bx, barY, pw, barH)
      ctx.font = `${act ? '700' : '500'} ${Math.max(5, 6.5 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = act ? PHASES[i].color : COL_TEXT_DIM
      ctx.fillText(`${i + 1}`, bx + pw / 2, barY - 5)
      bx += pw
    }
    // progress needle
    ctx.beginPath()
    ctx.moveTo(barL + s.cycle * barW, barY - 1); ctx.lineTo(barL + s.cycle * barW, barY + barH + 1)
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; ctx.stroke()

    // ── INFO PANEL (right side)
    const infoX = w * 0.60, infoY = 25
    ctx.font = `800 ${Math.max(12, 15 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = PHASES[pi].color
    ctx.fillText(PHASES[pi].name.toUpperCase(), infoX, infoY)

    // description
    const descs = [
      'Receptores na laringe/traqueia\ndetectam corpo estranho',
      'Inspiração profunda: ~2,5L\nDiafragma contrai e desce',
      'Glote FECHA + músculos contraem\nPressão intratorácica: até 300mmHg',
      'Glote ABRE bruscamente\nAr expelido a até 160 km/h',
      'Músculos relaxam\nVia aérea volta ao normal',
    ]
    ctx.font = `500 ${Math.max(7, 8.5 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    const lines = descs[pi].split('\n')
    lines.forEach((l, i) => ctx.fillText(l, infoX, infoY + 18 + i * 14))

    // vitals
    const vY = infoY + 18 + lines.length * 14 + 20
    ctx.font = `600 ${Math.max(9, 11 * S)}px ${FONT_MONO}`

    // volume bar
    const volFrac = (s.volume - 1800) / 3100
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.fillRect(infoX, vY, 120 * S, 6 * S)
    ctx.fillStyle = pi === 1 ? COL_AIR_IN : 'rgba(45, 212, 191, 0.4)'
    ctx.fillRect(infoX, vY, 120 * S * volFrac, 6 * S)
    ctx.fillStyle = 'rgba(45, 212, 191, 0.6)'
    ctx.fillText(`Volume: ${Math.round(s.volume)} mL`, infoX, vY - 5)

    // pressure bar
    const presFrac = s.pressure / 300
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.fillRect(infoX, vY + 28 * S, 120 * S, 6 * S)
    ctx.fillStyle = s.pressure > 50 ? COL_PRESSURE : 'rgba(255,255,255,0.1)'
    ctx.fillRect(infoX, vY + 28 * S, 120 * S * presFrac, 6 * S)
    ctx.fillStyle = s.pressure > 50 ? 'rgba(244, 63, 94, 0.7)' : 'rgba(255,255,255,0.3)'
    ctx.fillText(`Pressão: ${Math.round(s.pressure)} mmHg`, infoX, vY + 23 * S)

    // glottis
    ctx.fillStyle = s.glottis < 0.3 ? COL_GLOTTIS_CLOSED : COL_GLOTTIS
    ctx.fillText(`Glote: ${s.glottis < 0.3 ? 'FECHADA ✕' : 'ABERTA ○'}`, infoX, vY + 50 * S)

    // speed (phase 3)
    if (pi === 3) {
      const speed = Math.round(160 * (1 - pt))
      ctx.fillStyle = COL_AIR_OUT
      ctx.fillText(`Velocidade: ~${speed} km/h`, infoX, vY + 68 * S)
    }

    // cycle counter
    ctx.font = `500 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText(`Ciclos: ${s.cycles}`, infoX, vY + 88 * S)

    // HUD
    ctx.font = `600 ${Math.max(9, 10 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM; ctx.fillText('COUGH.REFLEX', 12, h - 10)
    ctx.fillStyle = 'rgba(45, 212, 191, 0.4)'; ctx.fillText('▸ MECÂNICA REAL', 12, h - 24)
  }, [paused])

  useEffect(() => {
    const c = canvasRef.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    let raf = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const s = stRef.current
      if (now - s.last < FRAME_MS) return; s.last = now; s.t += 0.03
      const dpr = window.devicePixelRatio || 1
      const r = c.getBoundingClientRect()
      const cw = r.width * dpr, ch = r.height * dpr
      if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(ctx, r.width, r.height)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [draw])

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas ref={canvasRef} className="w-full rounded-2xl" style={{ aspectRatio: '16/9', background: COL_BG }} />
      <div className="absolute top-3 right-3">
        <button onClick={() => setPaused(p => !p)}
          className="px-2.5 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-wider bg-white/10 text-white/80 border border-white/20">
          {paused ? '▶ Retomar' : '⏸ Pausar'}
        </button>
      </div>
    </div>
  )
}
