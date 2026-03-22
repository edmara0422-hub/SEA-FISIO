'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface NeuroGliaEcosystemSimProps {
  className?: string
}

type GliaType = 'oligodendrocyte' | 'astrocyte' | 'microglia' | 'ependymal' | 'schwann' | 'satellite'

interface GliaCell {
  type: GliaType
  label: string
  location: string
  x: number
  y: number
  radius: number
  color: string
  colorGlow: string
  desc: string
  functions: string[]
}

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.03)'
const COL_TEXT = 'rgba(255, 255, 255, 0.88)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.38)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

const GLIA_DEFS: Omit<GliaCell, 'x' | 'y' | 'radius'>[] = [
  {
    type: 'astrocyte',
    label: 'Astrócito',
    location: 'SNC',
    color: 'rgba(45, 212, 191, 0.85)',
    colorGlow: 'rgba(45, 212, 191, 0.25)',
    desc: 'Sustentação e barreira hematoencefálica',
    functions: [
      'Suporte estrutural e metabólico',
      'Formação da barreira hematoencefálica',
      'Regulação do K⁺ extracelular',
      'Captação de neurotransmissores',
    ],
  },
  {
    type: 'oligodendrocyte',
    label: 'Oligodendrócito',
    location: 'SNC',
    color: 'rgba(250, 204, 21, 0.85)',
    colorGlow: 'rgba(250, 204, 21, 0.25)',
    desc: 'Mielinização no SNC',
    functions: [
      'Produção de bainha de mielina no SNC',
      '1 oligodendrócito → até 50 axônios',
      'Acelera condução saltatória',
      'Isolamento elétrico dos axônios',
    ],
  },
  {
    type: 'microglia',
    label: 'Microglia',
    location: 'SNC',
    color: 'rgba(244, 63, 94, 0.85)',
    colorGlow: 'rgba(244, 63, 94, 0.25)',
    desc: 'Defesa imunológica do SNC',
    functions: [
      'Fagocitose de patógenos e debris',
      'Poda sináptica no desenvolvimento',
      'Resposta inflamatória',
      'Vigilância imunológica contínua',
    ],
  },
  {
    type: 'ependymal',
    label: 'Cél. Ependimárias',
    location: 'SNC',
    color: 'rgba(167, 139, 250, 0.85)',
    colorGlow: 'rgba(167, 139, 250, 0.25)',
    desc: 'Produção e circulação do LCR',
    functions: [
      'Revestem ventrículos cerebrais',
      'Cílios que circulam o LCR',
      'Barreira cérebro-LCR',
      'Produção de líquido cerebrospinal',
    ],
  },
  {
    type: 'schwann',
    label: 'Cél. de Schwann',
    location: 'SNP',
    color: 'rgba(34, 211, 238, 0.85)',
    colorGlow: 'rgba(34, 211, 238, 0.25)',
    desc: 'Mielinização no SNP',
    functions: [
      'Produção de mielina no SNP',
      '1 célula → 1 internodo',
      'Regeneração axonal',
      'Formação de tubos de regeneração',
    ],
  },
  {
    type: 'satellite',
    label: 'Cél. Satélite',
    location: 'SNP',
    color: 'rgba(251, 146, 60, 0.85)',
    colorGlow: 'rgba(251, 146, 60, 0.25)',
    desc: 'Suporte nos gânglios do SNP',
    functions: [
      'Envolvem corpos celulares nos gânglios',
      'Regulação do microambiente',
      'Comunicação bidirecional com neurônios',
      'Suporte nutricional',
    ],
  },
]

/* ─────────────────────── helpers ─────────────────────── */

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/* ─────────────────────── component ─────────────────────── */

export function NeuroGliaEcosystemSim({ className }: NeuroGliaEcosystemSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedGlia, setSelectedGlia] = useState<GliaType | null>(null)
  const [hoveredGlia, setHoveredGlia] = useState<GliaType | null>(null)
  const stateRef = useRef({ t: 0, lastTimestamp: 0 })
  const cellsRef = useRef<GliaCell[]>([])

  /* ── draw individual glia shapes ── */
  const drawAstrocyte = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, r: number, t: number, glow: boolean) => {
    // star-shaped processes
    const arms = 8
    for (let i = 0; i < arms; i++) {
      const a = (i / arms) * Math.PI * 2 + Math.sin(t * 0.8 + i) * 0.08
      const len = r * (1.6 + Math.sin(t * 1.2 + i * 1.5) * 0.15)
      const ex = x + Math.cos(a) * len
      const ey = y + Math.sin(a) * len

      ctx.beginPath()
      ctx.moveTo(x, y)
      // wavy arm
      const mx1 = x + Math.cos(a + 0.2) * len * 0.4
      const my1 = y + Math.sin(a + 0.2) * len * 0.4
      const mx2 = x + Math.cos(a - 0.15) * len * 0.7
      const my2 = y + Math.sin(a - 0.15) * len * 0.7
      ctx.bezierCurveTo(mx1, my1, mx2, my2, ex, ey)
      ctx.strokeStyle = glow ? 'rgba(45, 212, 191, 0.9)' : 'rgba(45, 212, 191, 0.5)'
      ctx.lineWidth = glow ? 2.5 : 1.8
      ctx.stroke()

      // end foot
      ctx.beginPath()
      ctx.arc(ex, ey, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(45, 212, 191, 0.7)'
      ctx.fill()
    }
    // cell body
    ctx.beginPath()
    ctx.arc(x, y, r * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = glow ? 'rgba(45, 212, 191, 0.3)' : 'rgba(45, 212, 191, 0.15)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.8)'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }, [])

  const drawOligodendrocyte = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, r: number, t: number, glow: boolean) => {
    // smaller body with wrapping extensions
    const arms = 5
    for (let i = 0; i < arms; i++) {
      const a = (i / arms) * Math.PI * 2 + t * 0.03
      const len = r * 1.4
      const ex = x + Math.cos(a) * len
      const ey = y + Math.sin(a) * len

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(ex, ey)
      ctx.strokeStyle = glow ? 'rgba(250, 204, 21, 0.85)' : 'rgba(250, 204, 21, 0.45)'
      ctx.lineWidth = glow ? 2 : 1.5
      ctx.stroke()

      // myelin wrap at end
      ctx.beginPath()
      const perpA = a + Math.PI / 2
      ctx.ellipse(ex, ey, 10, 4, perpA, 0, Math.PI * 2)
      ctx.fillStyle = glow ? 'rgba(250, 204, 21, 0.25)' : 'rgba(250, 204, 21, 0.12)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)'
      ctx.lineWidth = 1
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.arc(x, y, r * 0.35, 0, Math.PI * 2)
    ctx.fillStyle = glow ? 'rgba(250, 204, 21, 0.3)' : 'rgba(250, 204, 21, 0.15)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.75)'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }, [])

  const drawMicroglia = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, r: number, t: number, glow: boolean) => {
    // amoeboid shape with pseudopods
    const points = 12
    ctx.beginPath()
    for (let i = 0; i <= points; i++) {
      const a = (i / points) * Math.PI * 2
      const pr = r * 0.6 * (1 + 0.35 * Math.sin(a * 3 + t * 2) + 0.15 * Math.cos(a * 5 + t * 1.5))
      const px = x + Math.cos(a) * pr
      const py = y + Math.sin(a) * pr
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fillStyle = glow ? 'rgba(244, 63, 94, 0.3)' : 'rgba(244, 63, 94, 0.12)'
    ctx.fill()
    ctx.strokeStyle = glow ? 'rgba(244, 63, 94, 0.9)' : 'rgba(244, 63, 94, 0.6)'
    ctx.lineWidth = glow ? 2 : 1.5
    ctx.stroke()

    // phagocytic processes
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + t * 0.4
      const len = r * (0.8 + Math.sin(t + i) * 0.2)
      ctx.beginPath()
      ctx.moveTo(x, y)
      const cx1 = x + Math.cos(a + 0.3) * len * 0.5
      const cy1 = y + Math.sin(a + 0.3) * len * 0.5
      const ex = x + Math.cos(a) * len
      const ey = y + Math.sin(a) * len
      ctx.quadraticCurveTo(cx1, cy1, ex, ey)
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)'
      ctx.lineWidth = 1.2
      ctx.stroke()
    }
  }, [])

  const drawEpendymal = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, r: number, t: number, glow: boolean) => {
    // columnar cell with cilia
    const cellW = r * 0.8
    const cellH = r * 1.2
    ctx.beginPath()
    ctx.roundRect(x - cellW / 2, y - cellH / 2, cellW, cellH, 6)
    ctx.fillStyle = glow ? 'rgba(167, 139, 250, 0.25)' : 'rgba(167, 139, 250, 0.12)'
    ctx.fill()
    ctx.strokeStyle = glow ? 'rgba(167, 139, 250, 0.9)' : 'rgba(167, 139, 250, 0.6)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // cilia on top
    const ciliaCount = 7
    for (let i = 0; i < ciliaCount; i++) {
      const cx2 = x - cellW / 2 + 4 + (i / (ciliaCount - 1)) * (cellW - 8)
      const sway = Math.sin(t * 3 + i * 0.8) * 6
      ctx.beginPath()
      ctx.moveTo(cx2, y - cellH / 2)
      ctx.quadraticCurveTo(cx2 + sway, y - cellH / 2 - 12, cx2 + sway * 1.2, y - cellH / 2 - 18)
      ctx.strokeStyle = glow ? 'rgba(167, 139, 250, 0.8)' : 'rgba(167, 139, 250, 0.5)'
      ctx.lineWidth = 1.2
      ctx.stroke()
    }

    // nucleus
    ctx.beginPath()
    ctx.arc(x, y + 2, r * 0.2, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(167, 139, 250, 0.4)'
    ctx.fill()
  }, [])

  const drawSchwann = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, r: number, t: number, glow: boolean) => {
    // wrapped around an axon segment
    const axonLen = r * 2.2
    // axon line
    ctx.beginPath()
    ctx.moveTo(x - axonLen / 2, y)
    ctx.lineTo(x + axonLen / 2, y)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 2
    ctx.stroke()

    // myelin wrapping - concentric arcs
    for (let layer = 0; layer < 4; layer++) {
      const lr = 5 + layer * 3.5
      ctx.beginPath()
      ctx.ellipse(x, y, axonLen * 0.38, lr, 0, 0, Math.PI * 2)
      ctx.strokeStyle = glow
        ? `rgba(34, 211, 238, ${0.6 - layer * 0.1})`
        : `rgba(34, 211, 238, ${0.3 - layer * 0.05})`
      ctx.lineWidth = 1.2
      ctx.stroke()
    }

    // nucleus on outside
    ctx.beginPath()
    ctx.ellipse(x + 5, y - 16, 8, 4, 0.3, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(34, 211, 238, 0.4)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)'
    ctx.lineWidth = 1
    ctx.stroke()
  }, [])

  const drawSatellite = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, r: number, t: number, glow: boolean) => {
    // neuron body in center (ganglion)
    ctx.beginPath()
    ctx.arc(x, y, r * 0.35, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1
    ctx.stroke()

    // satellite cells surrounding
    const sCount = 6
    for (let i = 0; i < sCount; i++) {
      const a = (i / sCount) * Math.PI * 2 + t * 0.05
      const sr = r * 0.65
      const sx = x + Math.cos(a) * sr
      const sy = y + Math.sin(a) * sr

      ctx.beginPath()
      ctx.ellipse(sx, sy, 7, 5, a, 0, Math.PI * 2)
      ctx.fillStyle = glow ? 'rgba(251, 146, 60, 0.3)' : 'rgba(251, 146, 60, 0.15)'
      ctx.fill()
      ctx.strokeStyle = glow ? 'rgba(251, 146, 60, 0.85)' : 'rgba(251, 146, 60, 0.55)'
      ctx.lineWidth = 1.2
      ctx.stroke()
    }
  }, [])

  /* ── main draw ── */
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const st = stateRef.current
      const scale = Math.min(w / 700, h / 420)

      ctx.fillStyle = COL_BG
      ctx.fillRect(0, 0, w, h)

      // grid
      ctx.strokeStyle = COL_GRID
      ctx.lineWidth = 0.5
      const gridStep = 30 * scale
      for (let gx = 0; gx < w; gx += gridStep) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke()
      }
      for (let gy = 0; gy < h; gy += gridStep) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke()
      }

      // divider line SNC | SNP
      const divX = w * 0.62
      ctx.beginPath()
      ctx.setLineDash([4, 4])
      ctx.moveTo(divX, 30)
      ctx.lineTo(divX, h - 30)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.setLineDash([])

      // labels
      const fontSize = Math.max(9, 10 * scale)
      ctx.font = `700 ${fontSize}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(45, 212, 191, 0.5)'
      ctx.fillText('SNC', divX * 0.5, 22)
      ctx.fillStyle = 'rgba(34, 211, 238, 0.5)'
      ctx.fillText('SNP', divX + (w - divX) * 0.5, 22)

      // position cells
      const cells: GliaCell[] = [
        // SNC - 2x2 grid
        { ...GLIA_DEFS[0], x: divX * 0.3, y: h * 0.35, radius: 28 * scale },    // astrocyte
        { ...GLIA_DEFS[1], x: divX * 0.7, y: h * 0.35, radius: 25 * scale },    // oligodendrocyte
        { ...GLIA_DEFS[2], x: divX * 0.3, y: h * 0.72, radius: 22 * scale },    // microglia
        { ...GLIA_DEFS[3], x: divX * 0.7, y: h * 0.72, radius: 22 * scale },    // ependymal
        // SNP
        { ...GLIA_DEFS[4], x: divX + (w - divX) * 0.5, y: h * 0.35, radius: 25 * scale }, // schwann
        { ...GLIA_DEFS[5], x: divX + (w - divX) * 0.5, y: h * 0.72, radius: 22 * scale }, // satellite
      ]
      cellsRef.current = cells

      const active = selectedGlia || hoveredGlia

      // draw each cell
      for (const cell of cells) {
        const isActive = cell.type === active
        const isUnfocused = active && !isActive
        ctx.globalAlpha = isUnfocused ? 0.3 : 1

        // glow ring
        if (isActive) {
          const grad = ctx.createRadialGradient(cell.x, cell.y, 0, cell.x, cell.y, cell.radius * 2.2)
          grad.addColorStop(0, cell.colorGlow)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(cell.x - cell.radius * 2.5, cell.y - cell.radius * 2.5, cell.radius * 5, cell.radius * 5)
        }

        switch (cell.type) {
          case 'astrocyte': drawAstrocyte(ctx, cell.x, cell.y, cell.radius, st.t, isActive); break
          case 'oligodendrocyte': drawOligodendrocyte(ctx, cell.x, cell.y, cell.radius, st.t, isActive); break
          case 'microglia': drawMicroglia(ctx, cell.x, cell.y, cell.radius, st.t, isActive); break
          case 'ependymal': drawEpendymal(ctx, cell.x, cell.y, cell.radius, st.t, isActive); break
          case 'schwann': drawSchwann(ctx, cell.x, cell.y, cell.radius, st.t, isActive); break
          case 'satellite': drawSatellite(ctx, cell.x, cell.y, cell.radius, st.t, isActive); break
        }

        // cell label
        ctx.font = `600 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
        ctx.textAlign = 'center'
        ctx.fillStyle = isActive ? cell.color : COL_TEXT_DIM
        ctx.fillText(cell.label, cell.x, cell.y + cell.radius * 1.8 + 5)

        // location tag
        ctx.font = `500 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
        ctx.fillStyle = isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'
        ctx.fillText(cell.location, cell.x, cell.y + cell.radius * 1.8 + 17)

        ctx.globalAlpha = 1
      }

      // HUD
      ctx.font = `600 ${Math.max(9, 10 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'left'
      ctx.fillStyle = COL_TEXT_DIM
      ctx.fillText('GLIA.ECOSYSTEM', 12, h - 12)
    },
    [selectedGlia, hoveredGlia, drawAstrocyte, drawOligodendrocyte, drawMicroglia, drawEpendymal, drawSchwann, drawSatellite],
  )

  /* ── animation loop ── */
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
      const w = rect.width * dpr
      const h = rect.height * dpr
      if (cvs.width !== w || cvs.height !== h) {
        cvs.width = w
        cvs.height = h
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(ctx, rect.width, rect.height)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [draw])

  /* ── mouse handlers ── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const cvs = canvasRef.current
    if (!cvs) return
    const rect = cvs.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    let found: GliaType | null = null
    for (const cell of cellsRef.current) {
      const dx = mx - cell.x
      const dy = my - cell.y
      if (Math.sqrt(dx * dx + dy * dy) < cell.radius * 1.8) {
        found = cell.type
        break
      }
    }
    setHoveredGlia(found)
    cvs.style.cursor = found ? 'pointer' : 'default'
  }, [])

  const handleClick = useCallback(() => {
    setSelectedGlia(prev => prev === hoveredGlia ? null : hoveredGlia)
  }, [hoveredGlia])

  const active = selectedGlia || hoveredGlia
  const activeCell = active ? GLIA_DEFS.find(g => g.type === active) : null

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas
        ref={canvasRef}
        className="w-full rounded-2xl"
        style={{ aspectRatio: '16/9', background: COL_BG }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={() => setHoveredGlia(null)}
      />
      {activeCell && (
        <div
          className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md px-4 py-3"
          style={{ pointerEvents: 'none' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full" style={{ background: activeCell.color }} />
            <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider">
              {activeCell.label}
            </span>
            <span className="text-[9px] text-white/40 ml-1">{activeCell.location}</span>
          </div>
          <p className="text-[10px] text-white/50 mb-1">{activeCell.desc}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {activeCell.functions.map((fn, i) => (
              <span key={i} className="text-[9px] text-white/40">▸ {fn}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
