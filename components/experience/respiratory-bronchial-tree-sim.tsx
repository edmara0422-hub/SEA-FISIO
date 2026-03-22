'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface RespiratoryBronchialTreeSimProps {
  className?: string
}

type ZoneFilter = 'all' | 'conducting' | 'transition' | 'respiratory'

interface Branch {
  x1: number; y1: number; x2: number; y2: number
  gen: number; zone: 'conducting' | 'transition' | 'respiratory'
  width: number
}

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.025)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.35)'
const COL_CONDUCT = 'rgba(45, 212, 191, 0.7)'
const COL_TRANSIT = 'rgba(167, 139, 250, 0.7)'
const COL_RESP = 'rgba(250, 204, 21, 0.7)'
const COL_CONDUCT_DIM = 'rgba(45, 212, 191, 0.2)'
const COL_TRANSIT_DIM = 'rgba(167, 139, 250, 0.15)'
const COL_RESP_DIM = 'rgba(250, 204, 21, 0.12)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

const GEN_LABELS: Record<number, string> = {
  0: 'Traqueia',
  1: 'Brônquios Principais',
  2: 'Brônquios Lobares',
  3: 'Brônquios Segmentares',
  8: 'Bronquíolos',
  16: 'Bronquíolos Terminais',
  17: 'Bronquíolos Respiratórios',
  20: 'Ductos Alveolares',
  23: 'Sacos Alveolares',
}

/* ─────────────────────── helpers ─────────────────────── */

function getZone(gen: number): 'conducting' | 'transition' | 'respiratory' {
  if (gen <= 16) return 'conducting'
  if (gen <= 19) return 'transition'
  return 'respiratory'
}

function getZoneColor(zone: string, bright: boolean): string {
  if (zone === 'conducting') return bright ? COL_CONDUCT : COL_CONDUCT_DIM
  if (zone === 'transition') return bright ? COL_TRANSIT : COL_TRANSIT_DIM
  return bright ? COL_RESP : COL_RESP_DIM
}

/* ─────────────────────── component ─────────────────────── */

export function RespiratoryBronchialTreeSim({ className }: RespiratoryBronchialTreeSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoneFilter, setZoneFilter] = useState<ZoneFilter>('all')
  const [hoveredGen, setHoveredGen] = useState<number | null>(null)
  const stateRef = useRef({
    t: 0,
    lastTimestamp: 0,
    branches: null as Branch[] | null,
    airParticles: Array.from({ length: 15 }, () => ({
      gen: 0, side: Math.random() > 0.5 ? 1 : -1, phase: Math.random(), speed: 0.003 + Math.random() * 0.004,
    })),
  })
  const genRegionsRef = useRef<{ gen: number; x: number; y: number; w: number; h: number }[]>([])

  const buildTree = useCallback((w: number, h: number, S: number): Branch[] => {
    const branches: Branch[] = []
    const cx = w * 0.5
    const topY = 20 * S
    const maxVisualGen = 10 // max we can visually render (23 would be too dense)

    const recurse = (x: number, y: number, angle: number, len: number, gen: number, depth: number) => {
      if (depth > maxVisualGen) return
      const x2 = x + Math.cos(angle) * len
      const y2 = y + Math.sin(angle) * len
      const zone = getZone(gen)
      const width = Math.max(0.5, (4 - depth * 0.35) * S)

      branches.push({ x1: x, y1: y, x2, y2, gen, zone, width })

      // map visual depth to real generation
      const nextGen = depth <= 3 ? gen + 1 : (depth <= 5 ? gen + 2 : gen + 3)
      const spread = 0.38 - depth * 0.02
      const nextLen = len * (0.68 - depth * 0.01)

      recurse(x2, y2, angle - spread, nextLen, nextGen, depth + 1)
      recurse(x2, y2, angle + spread, nextLen, nextGen, depth + 1)
    }

    // trachea
    const traLen = 55 * S
    branches.push({
      x1: cx, y1: topY, x2: cx, y2: topY + traLen,
      gen: 0, zone: 'conducting', width: 5 * S,
    })

    // main bronchi
    const bifY = topY + traLen
    const spread0 = 0.45
    const bronchLen = 40 * S

    // left
    recurse(cx, bifY, Math.PI / 2 + spread0, bronchLen, 1, 1)
    // right
    recurse(cx, bifY, Math.PI / 2 - spread0, bronchLen, 1, 1)

    return branches
  }, [])

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const st = stateRef.current
    const S = Math.min(w / 700, h / 500)

    ctx.fillStyle = COL_BG
    ctx.fillRect(0, 0, w, h)

    // grid
    ctx.strokeStyle = COL_GRID
    ctx.lineWidth = 0.5
    const gs = 28 * S
    for (let gx = 0; gx < w; gx += gs) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke() }
    for (let gy = 0; gy < h; gy += gs) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke() }

    // build tree on first frame
    if (!st.branches) st.branches = buildTree(w, h, S)

    // ── zone background bands (left side)
    const bandW = 50 * S
    const bandX = 8

    // conducting zone (gen 0-16)
    const condTop = 15
    const condBot = h * 0.52
    ctx.fillStyle = zoneFilter === 'conducting' ? 'rgba(45, 212, 191, 0.05)' : 'rgba(45, 212, 191, 0.015)'
    ctx.fillRect(bandX, condTop, bandW, condBot - condTop)
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.12)'
    ctx.lineWidth = 1
    ctx.strokeRect(bandX, condTop, bandW, condBot - condTop)

    ctx.save()
    ctx.translate(bandX + bandW * 0.5, (condTop + condBot) / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.font = `700 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = COL_CONDUCT
    ctx.fillText('ZONA CONDUTORA (0-16)', 0, 3)
    ctx.restore()

    // transition zone (gen 17-19)
    const transTop = condBot + 2
    const transBot = h * 0.68
    ctx.fillStyle = zoneFilter === 'transition' ? 'rgba(167, 139, 250, 0.05)' : 'rgba(167, 139, 250, 0.015)'
    ctx.fillRect(bandX, transTop, bandW, transBot - transTop)
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.12)'
    ctx.lineWidth = 1
    ctx.strokeRect(bandX, transTop, bandW, transBot - transTop)

    ctx.save()
    ctx.translate(bandX + bandW * 0.5, (transTop + transBot) / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.fillStyle = COL_TRANSIT
    ctx.fillText('TRANSIÇÃO (17-19)', 0, 3)
    ctx.restore()

    // respiratory zone (gen 20-23)
    const respTop = transBot + 2
    const respBot = h - 30
    ctx.fillStyle = zoneFilter === 'respiratory' ? 'rgba(250, 204, 21, 0.05)' : 'rgba(250, 204, 21, 0.015)'
    ctx.fillRect(bandX, respTop, bandW, respBot - respTop)
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.12)'
    ctx.lineWidth = 1
    ctx.strokeRect(bandX, respTop, bandW, respBot - respTop)

    ctx.save()
    ctx.translate(bandX + bandW * 0.5, (respTop + respBot) / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.fillStyle = COL_RESP
    ctx.fillText('RESPIRATÓRIA (20-23)', 0, 3)
    ctx.restore()

    // ── draw branches
    const genRegions: typeof genRegionsRef.current = []

    for (const b of st.branches) {
      const zoneMatch = zoneFilter === 'all' || zoneFilter === b.zone
      const isGenHovered = hoveredGen !== null && b.gen === hoveredGen
      const bright = zoneMatch && (zoneFilter !== 'all' || isGenHovered)
      const alpha = zoneMatch ? 1 : 0.15

      ctx.globalAlpha = alpha

      // branch line
      ctx.beginPath()
      ctx.moveTo(b.x1, b.y1)
      ctx.lineTo(b.x2, b.y2)
      ctx.strokeStyle = getZoneColor(b.zone, bright)
      ctx.lineWidth = b.width
      ctx.lineCap = 'round'
      ctx.stroke()

      // cartilage rings on thicker branches
      if (b.width > 2 * S && b.gen <= 4) {
        const dx = b.x2 - b.x1
        const dy = b.y2 - b.y1
        const len = Math.sqrt(dx * dx + dy * dy)
        const rings = Math.floor(len / (8 * S))
        const perpA = Math.atan2(dy, dx) + Math.PI / 2
        for (let r = 1; r < rings; r++) {
          const t = r / rings
          const rx = b.x1 + dx * t
          const ry = b.y1 + dy * t
          const rr = b.width * 0.5
          ctx.beginPath()
          ctx.moveTo(rx + Math.cos(perpA) * rr, ry + Math.sin(perpA) * rr)
          ctx.lineTo(rx - Math.cos(perpA) * rr, ry - Math.sin(perpA) * rr)
          ctx.strokeStyle = getZoneColor(b.zone, bright).replace(/[\d.]+\)$/, `${bright ? 0.4 : 0.12})`)
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // alveoli at terminal branches (respiratory zone)
      if (b.zone === 'respiratory' && b.width < 1.5) {
        const alvCount = 4
        for (let a = 0; a < alvCount; a++) {
          const aa = (a / alvCount) * Math.PI * 2 + st.t * 0.3
          const ar = 3 * S
          const ax = b.x2 + Math.cos(aa) * ar * 1.5
          const ay = b.y2 + Math.sin(aa) * ar * 1.5
          ctx.beginPath()
          ctx.arc(ax, ay, ar, 0, Math.PI * 2)
          ctx.fillStyle = getZoneColor(b.zone, bright).replace(/[\d.]+\)$/, `${bright ? 0.15 : 0.05})`)
          ctx.fill()
          ctx.strokeStyle = getZoneColor(b.zone, bright)
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      ctx.globalAlpha = 1

      // collect gen regions for hover
      const minX = Math.min(b.x1, b.x2) - 10
      const minY = Math.min(b.y1, b.y2) - 5
      const existing = genRegions.find(r => r.gen === b.gen)
      if (!existing) {
        genRegions.push({ gen: b.gen, x: minX, y: minY, w: Math.abs(b.x2 - b.x1) + 20, h: Math.abs(b.y2 - b.y1) + 10 })
      }
    }
    genRegionsRef.current = genRegions

    // ── air flow particles
    for (const p of st.airParticles) {
      p.phase += p.speed
      if (p.phase > 1) { p.phase = 0; p.side = Math.random() > 0.5 ? 1 : -1 }

      // follow tree path approximately
      const totalBranches = st.branches.length
      const bIdx = Math.floor(p.phase * totalBranches * 0.4) // use first 40% of branches
      if (bIdx < totalBranches) {
        const b = st.branches[bIdx]
        const bt = (p.phase * totalBranches * 0.4) - bIdx
        const px = b.x1 + (b.x2 - b.x1) * bt + Math.sin(st.t * 3 + p.phase * 15) * 3
        const py = b.y1 + (b.y2 - b.y1) * bt

        const grad = ctx.createRadialGradient(px, py, 0, px, py, 5)
        grad.addColorStop(0, 'rgba(34, 211, 238, 0.3)')
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(px - 6, py - 6, 12, 12)

        ctx.beginPath()
        ctx.arc(px, py, 1.8, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(34, 211, 238, 0.8)'
        ctx.fill()
      }
    }

    // ── generation labels (right side)
    const labelX = w - 15
    ctx.textAlign = 'right'
    const genKeys = [0, 1, 2, 3, 8, 16, 17, 20, 23]
    const genYMap: Record<number, number> = {
      0: 35 * S,
      1: 80 * S,
      2: 110 * S,
      3: 135 * S,
      8: 180 * S,
      16: condBot - 15,
      17: transTop + 15,
      20: respTop + 15,
      23: respBot - 15,
    }

    for (const g of genKeys) {
      const gy = genYMap[g] ?? 0
      const zone = getZone(g)
      const isHi = hoveredGen === g
      const zoneCol = zone === 'conducting' ? COL_CONDUCT : (zone === 'transition' ? COL_TRANSIT : COL_RESP)

      // gen number
      ctx.font = `700 ${Math.max(10, 12 * S)}px ${FONT_MONO}`
      ctx.fillStyle = isHi ? zoneCol : COL_TEXT_DIM
      ctx.fillText(`${g}`, labelX - 80 * S, gy + 4)

      // label
      ctx.font = `500 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
      ctx.fillStyle = isHi ? zoneCol : 'rgba(255,255,255,0.25)'
      ctx.fillText(GEN_LABELS[g] ?? '', labelX, gy + 4)

      // zone tag
      ctx.font = `600 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
      ctx.fillStyle = zoneCol.replace('0.7', '0.35')
      const zoneLabel = zone === 'conducting' ? 'CONDUÇÃO' : (zone === 'transition' ? 'TRANSIÇÃO' : 'TROCA GASOSA')
      ctx.fillText(zoneLabel, labelX, gy + 14)
    }

    // ── stats bar at bottom
    ctx.font = `600 ${Math.max(9, 11 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    const stats = [
      { label: 'Gerações', value: '23', color: COL_CONDUCT },
      { label: 'Ramificações', value: '2²³', color: COL_TRANSIT },
      { label: 'Área Alveolar', value: '70-100m²', color: COL_RESP },
      { label: 'Alvéolos', value: '300M', color: COL_RESP },
    ]
    const statW = (w - 120) / stats.length
    for (let i = 0; i < stats.length; i++) {
      const sx = 60 + i * statW + statW / 2
      ctx.fillStyle = stats[i].color
      ctx.fillText(stats[i].value, sx, h - 18)
      ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
      ctx.fillStyle = COL_TEXT_DIM
      ctx.fillText(stats[i].label, sx, h - 6)
      ctx.font = `600 ${Math.max(9, 11 * S)}px ${FONT_MONO}`
    }

    // HUD
    ctx.font = `600 ${Math.max(9, 10 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('BRONCHIAL.TREE', 12, h - 6)
  }, [zoneFilter, hoveredGen, buildTree])

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    if (!ctx) return
    let raf = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const st = stateRef.current
      if (now - st.lastTimestamp < FRAME_MS) return
      st.lastTimestamp = now
      st.t += 0.03
      const dpr = window.devicePixelRatio || 1
      const rect = cvs.getBoundingClientRect()
      const cw = rect.width * dpr
      const ch = rect.height * dpr
      if (cvs.width !== cw || cvs.height !== ch) { cvs.width = cw; cvs.height = ch; stateRef.current.branches = null }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(ctx, rect.width, rect.height)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [draw])

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas ref={canvasRef} className="w-full rounded-2xl" style={{ aspectRatio: '16/9', background: COL_BG }} />
      <div className="absolute top-3 right-3 flex gap-1">
        {([
          { id: 'all' as ZoneFilter, label: 'Todas', col: '' },
          { id: 'conducting' as ZoneFilter, label: 'Condutora', col: 'text-teal-400' },
          { id: 'transition' as ZoneFilter, label: 'Transição', col: 'text-purple-400' },
          { id: 'respiratory' as ZoneFilter, label: 'Respiratória', col: 'text-yellow-400' },
        ]).map(m => (
          <button
            key={m.id}
            onClick={() => setZoneFilter(m.id)}
            className={`px-2 py-1 rounded-lg text-[8px] font-semibold uppercase tracking-wider transition-all ${
              zoneFilter === m.id
                ? `bg-white/10 text-white/80 border border-white/20`
                : `text-white/30 hover:text-white/50 border border-transparent`
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  )
}
