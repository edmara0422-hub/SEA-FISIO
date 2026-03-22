'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface RespiratoryBronchialTreeSimProps { className?: string }
type ZoneFilter = 'all' | 'conducting' | 'transition' | 'respiratory'

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.02)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.3)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

const ZONE_COLORS = {
  conducting: { main: 'rgba(45, 212, 191, VAL)', dim: 'rgba(45, 212, 191, 0.08)' },
  transition: { main: 'rgba(167, 139, 250, VAL)', dim: 'rgba(167, 139, 250, 0.06)' },
  respiratory: { main: 'rgba(250, 204, 21, VAL)', dim: 'rgba(250, 204, 21, 0.05)' },
}

function getZone(gen: number): 'conducting' | 'transition' | 'respiratory' {
  if (gen <= 16) return 'conducting'
  if (gen <= 19) return 'transition'
  return 'respiratory'
}

function zoneCol(zone: string, alpha: number): string {
  const base = zone === 'conducting' ? '45, 212, 191' : zone === 'transition' ? '167, 139, 250' : '250, 204, 21'
  return `rgba(${base}, ${alpha})`
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

/* ─────────────────────── component ─────────────────────── */

export function RespiratoryBronchialTreeSim({ className }: RespiratoryBronchialTreeSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoneFilter, setZoneFilter] = useState<ZoneFilter>('all')
  const stRef = useRef({ t: 0, last: 0 })

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const st = stRef.current
    const S = Math.min(w / 720, h / 520)

    ctx.fillStyle = COL_BG; ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = COL_GRID; ctx.lineWidth = 0.5
    const gs = 26 * S
    for (let x = 0; x < w; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
    for (let y = 0; y < h; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

    const cx = w * 0.5
    const treeTop = 15 * S
    const treeBot = h - 55 * S
    const treeH = treeBot - treeTop

    // ── ZONE BACKGROUND BANDS
    const z1Bot = treeTop + treeH * 0.58  // gen 0-16
    const z2Bot = treeTop + treeH * 0.74  // gen 17-19
    const z3Bot = treeBot                  // gen 20-23

    const zones = [
      { top: treeTop, bot: z1Bot, zone: 'conducting', label: 'ZONA CONDUTORA', sub: 'Gerações 0 – 16', desc: 'Condução • Filtração • Aquecimento' },
      { top: z1Bot, bot: z2Bot, zone: 'transition', label: 'ZONA DE TRANSIÇÃO', sub: 'Gerações 17 – 19', desc: 'Bronquíolos respiratórios iniciais' },
      { top: z2Bot, bot: z3Bot, zone: 'respiratory', label: 'ZONA RESPIRATÓRIA', sub: 'Gerações 20 – 23', desc: 'Ductos • Sacos • Alvéolos • TROCA GASOSA' },
    ]

    for (const z of zones) {
      const show = zoneFilter === 'all' || zoneFilter === z.zone
      ctx.fillStyle = show ? ZONE_COLORS[z.zone as keyof typeof ZONE_COLORS].dim : 'rgba(255,255,255,0.005)'
      ctx.fillRect(0, z.top, w, z.bot - z.top)

      // zone label (left margin)
      ctx.save()
      ctx.translate(16, (z.top + z.bot) / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.font = `700 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = show ? zoneCol(z.zone, 0.5) : 'rgba(255,255,255,0.08)'
      ctx.fillText(z.label, 0, 0)
      ctx.restore()

      // sub/desc (right margin)
      ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'right'
      ctx.fillStyle = show ? zoneCol(z.zone, 0.35) : 'rgba(255,255,255,0.06)'
      ctx.fillText(z.sub, w - 12, (z.top + z.bot) / 2 - 5)
      ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
      ctx.fillStyle = show ? zoneCol(z.zone, 0.22) : 'rgba(255,255,255,0.04)'
      ctx.fillText(z.desc, w - 12, (z.top + z.bot) / 2 + 7)

      // zone border
      if (z.zone !== 'conducting') {
        ctx.beginPath(); ctx.moveTo(30, z.top); ctx.lineTo(w - 30, z.top)
        ctx.strokeStyle = zoneCol(z.zone, 0.1); ctx.lineWidth = 0.5; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([])
      }
    }

    // ── RECURSIVE TREE DRAWING
    // We visually draw ~12 levels but label them to represent 23 real generations
    // depth → real generation mapping
    const depthToGen = [0, 1, 2, 3, 5, 8, 12, 16, 17, 18, 20, 22, 23]

    const drawBranch = (x1: number, y1: number, angle: number, length: number, depth: number, parentWidth: number) => {
      if (depth > 12) return

      const gen = depthToGen[Math.min(depth, depthToGen.length - 1)]
      const zone = getZone(gen)
      const show = zoneFilter === 'all' || zoneFilter === zone

      const x2 = x1 + Math.cos(angle) * length
      const y2 = y1 + Math.sin(angle) * length

      // width decreases with depth (anatomically: trachea 12mm → bronchiole <1mm → alveolar duct ~0.3mm)
      const bw = Math.max(0.4, parentWidth * 0.72)

      ctx.globalAlpha = show ? 1 : 0.08

      // ── draw branch segment
      ctx.beginPath()
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2)
      ctx.strokeStyle = zoneCol(zone, show ? (0.5 - depth * 0.025) : 0.08)
      ctx.lineWidth = bw
      ctx.lineCap = 'round'
      ctx.stroke()

      // ── cartilage rings on thick branches (gen 0-8)
      if (gen <= 8 && bw > 1.5) {
        const dx = x2 - x1, dy = y2 - y1
        const segLen = Math.sqrt(dx * dx + dy * dy)
        const perp = Math.atan2(dy, dx) + Math.PI / 2
        const ringN = Math.max(2, Math.floor(segLen / (8 * S)))
        for (let r = 1; r < ringN; r++) {
          const t = r / ringN
          const rx = lerp(x1, x2, t), ry = lerp(y1, y2, t)
          ctx.beginPath()
          ctx.moveTo(rx + Math.cos(perp) * bw * 0.4, ry + Math.sin(perp) * bw * 0.4)
          ctx.lineTo(rx - Math.cos(perp) * bw * 0.4, ry - Math.sin(perp) * bw * 0.4)
          ctx.strokeStyle = zoneCol(zone, 0.15)
          ctx.lineWidth = 1; ctx.stroke()
        }
      }

      // ── smooth muscle bands on bronchioles (gen 12-16)
      if (gen >= 12 && gen <= 16 && bw > 0.8) {
        ctx.beginPath()
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2)
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.08)'
        ctx.lineWidth = bw + 2; ctx.stroke()
      }

      // ── alveoli at terminal branches (gen >= 20)
      if (gen >= 20 && depth >= 10) {
        const alvCount = 5 + Math.floor(Math.random() * 3)
        for (let a = 0; a < alvCount; a++) {
          const aa = (a / alvCount) * Math.PI * 2 + depth
          const ar = (2 + Math.sin(st.t * 0.8 + a) * 0.5) * S
          const ax = x2 + Math.cos(aa) * ar * 2.2
          const ay = y2 + Math.sin(aa) * ar * 2.2

          ctx.beginPath(); ctx.arc(ax, ay, ar, 0, Math.PI * 2)
          ctx.fillStyle = zoneCol('respiratory', show ? 0.08 : 0.02)
          ctx.fill()
          ctx.strokeStyle = zoneCol('respiratory', show ? 0.3 : 0.05)
          ctx.lineWidth = 0.5; ctx.stroke()
        }
      }

      ctx.globalAlpha = 1

      // ── recurse
      if (depth < 12) {
        // spread decreases with depth (anatomical: wide split at carina, narrow at bronchioles)
        const spread = depth === 0 ? 0.42 : (0.35 - depth * 0.012)
        const nextLen = length * (0.72 - depth * 0.01)

        // right side slightly more vertical (anatomically correct)
        const rightBias = depth === 0 ? -0.05 : 0

        drawBranch(x2, y2, angle - spread + rightBias, nextLen, depth + 1, bw)
        drawBranch(x2, y2, angle + spread, nextLen, depth + 1, bw)
      }
    }

    // ── TRACHEA (gen 0) — special: vertical tube with C-rings
    const traLen = treeH * 0.18
    const traTop2 = treeTop + 5
    const traBif = traTop2 + traLen
    const traW = 6 * S

    const showConduct = zoneFilter === 'all' || zoneFilter === 'conducting'
    ctx.globalAlpha = showConduct ? 1 : 0.08

    // trachea tube
    ctx.beginPath()
    ctx.moveTo(cx - traW, traTop2); ctx.lineTo(cx - traW, traBif)
    ctx.moveTo(cx + traW, traTop2); ctx.lineTo(cx + traW, traBif)
    ctx.strokeStyle = zoneCol('conducting', 0.45); ctx.lineWidth = 1.5; ctx.stroke()

    // C-rings
    const ringN = 8
    for (let r = 0; r < ringN; r++) {
      const ry = traTop2 + 4 + r * (traLen - 8) / (ringN - 1)
      ctx.beginPath()
      ctx.arc(cx, ry, traW * 0.85, -0.5, Math.PI + 0.5)
      ctx.strokeStyle = zoneCol('conducting', 0.2); ctx.lineWidth = 2.5 * S; ctx.stroke()
    }

    // trachea label
    ctx.font = `700 ${Math.max(8, 9 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = zoneCol('conducting', showConduct ? 0.5 : 0.08)
    ctx.fillText('TRAQUEIA', cx, traTop2 - 4)
    ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
    ctx.fillStyle = zoneCol('conducting', showConduct ? 0.3 : 0.05)
    ctx.fillText('Geração 0 • Ø12mm', cx, traTop2 + traLen + 14)

    // carina
    ctx.beginPath(); ctx.arc(cx, traBif + 2, 3 * S, 0, Math.PI)
    ctx.fillStyle = zoneCol('conducting', 0.25); ctx.fill()

    ctx.globalAlpha = 1

    // ── BIFURCATION → RECURSIVE TREE
    const bifLen = treeH * 0.12
    // right bronchus (wider, more vertical)
    drawBranch(cx, traBif, Math.PI / 2 - 0.4, bifLen * 1.05, 0, 5 * S)
    // left bronchus
    drawBranch(cx, traBif, Math.PI / 2 + 0.45, bifLen, 0, 4.5 * S)

    // ── AIR PARTICLES flowing through tree
    const particleN = 12
    for (let i = 0; i < particleN; i++) {
      const pPhase = ((st.t * 0.4 + i * 0.08) % 1)

      // follow trachea then split
      let px: number, py: number
      if (pPhase < 0.25) {
        const t = pPhase / 0.25
        px = cx + Math.sin(st.t * 3 + i * 2) * 2
        py = lerp(traTop2 - 5, traBif, t)
      } else {
        const t = (pPhase - 0.25) / 0.75
        const side = i % 2 === 0 ? -1 : 1
        const angle = Math.PI / 2 + side * (0.4 + t * 0.2)
        const dist = t * treeH * 0.4
        px = cx + Math.cos(angle) * dist + Math.sin(st.t * 2 + i) * (3 + t * 8)
        py = traBif + Math.sin(angle) * dist
      }

      if (py > treeTop && py < treeBot) {
        const zone = py < z1Bot ? 'conducting' : py < z2Bot ? 'transition' : 'respiratory'
        const show2 = zoneFilter === 'all' || zoneFilter === zone
        if (show2) {
          const g = ctx.createRadialGradient(px, py, 0, px, py, 5)
          g.addColorStop(0, zoneCol(zone, 0.3)); g.addColorStop(1, 'transparent')
          ctx.fillStyle = g; ctx.fillRect(px - 6, py - 6, 12, 12)
          ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = zoneCol(zone, 0.8); ctx.fill()
        }
      }
    }

    // ── GENERATION SCALE (right-center column)
    const scaleX = w - 55 * S
    const scaleTop = treeTop + 10
    const scaleBot = treeBot - 5
    const scaleH = scaleBot - scaleTop

    // scale line
    ctx.beginPath(); ctx.moveTo(scaleX, scaleTop); ctx.lineTo(scaleX, scaleBot)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1; ctx.stroke()

    // generation ticks
    const genTicks = [
      { gen: 0, label: 'Traqueia', y: 0 },
      { gen: 1, label: 'Brônquios Princ.', y: 0.08 },
      { gen: 2, label: 'Lobares', y: 0.13 },
      { gen: 3, label: 'Segmentares', y: 0.18 },
      { gen: 8, label: 'Bronquíolos', y: 0.35 },
      { gen: 16, label: 'B. Terminais', y: 0.56 },
      { gen: 17, label: 'B. Respiratórios', y: 0.62 },
      { gen: 20, label: 'Ductos Alv.', y: 0.78 },
      { gen: 23, label: 'Sacos Alv.', y: 0.95 },
    ]

    for (const tick of genTicks) {
      const ty = scaleTop + tick.y * scaleH
      const zone = getZone(tick.gen)
      const show3 = zoneFilter === 'all' || zoneFilter === zone

      // tick mark
      ctx.beginPath(); ctx.moveTo(scaleX - 4, ty); ctx.lineTo(scaleX + 4, ty)
      ctx.strokeStyle = show3 ? zoneCol(zone, 0.4) : 'rgba(255,255,255,0.04)'
      ctx.lineWidth = 1.5; ctx.stroke()

      // gen number
      ctx.font = `700 ${Math.max(8, 10 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'right'
      ctx.fillStyle = show3 ? zoneCol(zone, 0.6) : 'rgba(255,255,255,0.06)'
      ctx.fillText(`${tick.gen}`, scaleX - 8, ty + 4)

      // name
      ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'left'
      ctx.fillStyle = show3 ? zoneCol(zone, 0.35) : 'rgba(255,255,255,0.04)'
      ctx.fillText(tick.label, scaleX + 8, ty + 3)
    }

    // ── STATS BAR
    const statY = h - 20 * S
    ctx.font = `600 ${Math.max(8, 10 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    const stats2 = [
      { v: '23', l: 'Gerações', c: zoneCol('conducting', 0.6) },
      { v: '2²³', l: 'Ramificações', c: zoneCol('transition', 0.6) },
      { v: '70-100m²', l: 'Área Alveolar', c: zoneCol('respiratory', 0.6) },
      { v: '300-500M', l: 'Alvéolos', c: zoneCol('respiratory', 0.6) },
    ]
    const sw = (w - 60) / stats2.length
    for (let i = 0; i < stats2.length; i++) {
      const sx = 30 + i * sw + sw / 2
      ctx.fillStyle = stats2[i].c; ctx.fillText(stats2[i].v, sx, statY)
      ctx.font = `500 ${Math.max(5, 6.5 * S)}px ${FONT_MONO}`
      ctx.fillStyle = COL_TEXT_DIM; ctx.fillText(stats2[i].l, sx, statY + 12)
      ctx.font = `600 ${Math.max(8, 10 * S)}px ${FONT_MONO}`
    }

    // HUD
    ctx.font = `600 ${Math.max(9, 10 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM; ctx.fillText('TRACHEOBRONCHIAL.TREE', 35, h - 8)
  }, [zoneFilter])

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
      <div className="absolute top-3 right-3 flex gap-1">
        {([
          { id: 'all' as ZoneFilter, label: 'Todas' },
          { id: 'conducting' as ZoneFilter, label: 'Condutora' },
          { id: 'transition' as ZoneFilter, label: 'Transição' },
          { id: 'respiratory' as ZoneFilter, label: 'Respiratória' },
        ]).map(m => (
          <button key={m.id} onClick={() => setZoneFilter(m.id)}
            className={`px-2 py-1 rounded-lg text-[8px] font-semibold uppercase tracking-wider transition-all ${
              zoneFilter === m.id ? 'bg-white/10 text-white/80 border border-white/20' : 'text-white/30 hover:text-white/50 border border-transparent'
            }`}>
            {m.label}
          </button>
        ))}
      </div>
    </div>
  )
}
