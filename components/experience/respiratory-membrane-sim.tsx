'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface RespiratoryMembraneSimProps {
  className?: string
}

type MemLayer = 1 | 2 | 3 | 4 | 5 | 6 | null

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.025)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.35)'
const COL_O2 = 'rgba(34, 211, 238, 0.9)'
const COL_CO2 = 'rgba(244, 63, 94, 0.8)'
const COL_ALVEOLAR = 'rgba(250, 204, 21, 0.15)'
const COL_CAPILLARY = 'rgba(244, 63, 94, 0.08)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

const LAYERS: { id: number; name: string; color: string; thickness: string }[] = [
  { id: 1, name: 'Fluido Alveolar (Surfactante)', color: 'rgba(250, 204, 21, 0.5)', thickness: '~0.01µm' },
  { id: 2, name: 'Epitélio Alveolar (Pneumócito I)', color: 'rgba(45, 212, 191, 0.5)', thickness: '~0.1µm' },
  { id: 3, name: 'Membrana Basal do Epitélio', color: 'rgba(167, 139, 250, 0.5)', thickness: '~0.05µm' },
  { id: 4, name: 'Espaço Intersticial', color: 'rgba(255, 255, 255, 0.2)', thickness: '~0.02µm' },
  { id: 5, name: 'Membrana Basal do Endotélio', color: 'rgba(167, 139, 250, 0.5)', thickness: '~0.05µm' },
  { id: 6, name: 'Endotélio Capilar', color: 'rgba(244, 63, 94, 0.5)', thickness: '~0.1µm' },
]

/* ─────────────────────── helpers ─────────────────────── */

function lerp(a: number, b: number, t: number): number { return a + (b - a) * t }

/* ─────────────────────── component ─────────────────────── */

export function RespiratoryMembraneSim({ className }: RespiratoryMembraneSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredLayer, setHoveredLayer] = useState<MemLayer>(null)
  const stateRef = useRef({
    t: 0,
    lastTimestamp: 0,
    o2Particles: Array.from({ length: 10 }, (_, i) => ({ phase: i * 0.1, x: 0 })),
    co2Particles: Array.from({ length: 8 }, (_, i) => ({ phase: i * 0.12 + 0.05, x: 0 })),
  })
  const layerRegionsRef = useRef<{ layer: MemLayer; y: number; h: number }[]>([])

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const st = stateRef.current
    const S = Math.min(w / 700, h / 450)

    ctx.fillStyle = COL_BG
    ctx.fillRect(0, 0, w, h)

    // grid
    ctx.strokeStyle = COL_GRID
    ctx.lineWidth = 0.5
    const gs = 28 * S
    for (let gx = 0; gx < w; gx += gs) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke() }
    for (let gy = 0; gy < h; gy += gs) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke() }

    // layout
    const memLeft = 100 * S
    const memRight = w - 100 * S
    const memW = memRight - memLeft

    // alveolar space (top)
    const alvTop = 30
    const alvBot = h * 0.25
    ctx.fillStyle = COL_ALVEOLAR
    ctx.fillRect(memLeft, alvTop, memW, alvBot - alvTop)
    ctx.font = `700 ${Math.max(10, 13 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(250, 204, 21, 0.5)'
    ctx.fillText('AR ALVEOLAR', memLeft + memW / 2, alvTop + (alvBot - alvTop) / 2 + 4)
    ctx.font = `500 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(250, 204, 21, 0.3)'
    ctx.fillText('PO₂ = 104 mmHg  •  PCO₂ = 40 mmHg', memLeft + memW / 2, alvTop + (alvBot - alvTop) / 2 + 18)

    // O₂ molecules floating in alveolar space
    for (let i = 0; i < 8; i++) {
      const ox = memLeft + 30 + (i / 8) * (memW - 60)
      const oy = alvTop + 15 + Math.sin(st.t * 1.5 + i * 1.3) * 8
      ctx.beginPath()
      ctx.arc(ox, oy, 3, 0, Math.PI * 2)
      ctx.fillStyle = COL_O2
      ctx.fill()
      ctx.font = `600 ${5}px ${FONT_MONO}`
      ctx.fillStyle = 'rgba(34, 211, 238, 0.5)'
      ctx.textAlign = 'center'
      ctx.fillText('O₂', ox, oy - 6)
    }

    // capillary space (bottom)
    const capTop = h * 0.75
    const capBot = h - 30
    ctx.fillStyle = COL_CAPILLARY
    ctx.fillRect(memLeft, capTop, memW, capBot - capTop)
    ctx.font = `700 ${Math.max(10, 13 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(244, 63, 94, 0.45)'
    ctx.fillText('SANGUE CAPILAR', memLeft + memW / 2, capTop + (capBot - capTop) / 2 + 4)
    ctx.font = `500 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(244, 63, 94, 0.3)'
    ctx.fillText('PO₂ = 40 mmHg  •  PCO₂ = 45 mmHg', memLeft + memW / 2, capTop + (capBot - capTop) / 2 + 18)

    // red blood cells in capillary
    for (let i = 0; i < 5; i++) {
      const rx = memLeft + 40 + ((st.t * 20 + i * 60) % (memW - 80))
      const ry = capTop + (capBot - capTop) / 2 + Math.sin(st.t + i) * 5
      ctx.beginPath()
      ctx.ellipse(rx, ry, 10, 5, 0.2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(244, 63, 94, 0.2)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // ── 6 membrane layers
    const memTop = alvBot + 5
    const memBot = capTop - 5
    const totalMemH = memBot - memTop
    const layerH = totalMemH / 6
    const layerRegions: typeof layerRegionsRef.current = []

    for (let i = 0; i < 6; i++) {
      const ly = memTop + i * layerH
      const layer = LAYERS[i]
      const isHovered = hoveredLayer === (i + 1)
      const isO2Side = true // O₂ passes top to bottom

      // layer background
      ctx.fillStyle = isHovered
        ? layer.color.replace('0.5', '0.15')
        : layer.color.replace('0.5', '0.04')
      ctx.fillRect(memLeft, ly, memW, layerH)

      // layer border
      ctx.strokeStyle = isHovered
        ? layer.color.replace('0.5', '0.6')
        : layer.color.replace('0.5', '0.12')
      ctx.lineWidth = isHovered ? 1.5 : 0.5
      ctx.strokeRect(memLeft, ly, memW, layerH)

      // layer number
      ctx.font = `800 ${Math.max(14, 18 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = isHovered
        ? layer.color.replace('0.5', '0.7')
        : layer.color.replace('0.5', '0.15')
      ctx.fillText(`${i + 1}`, memLeft - 25 * S, ly + layerH / 2 + 6)

      // layer name (right side)
      ctx.font = `600 ${Math.max(7, 8.5 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'left'
      ctx.fillStyle = isHovered
        ? layer.color.replace('0.5', '0.8')
        : layer.color.replace('0.5', '0.35')
      ctx.fillText(layer.name, memRight + 10, ly + layerH / 2 + 2)

      // thickness
      ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
      ctx.fillStyle = isHovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'
      ctx.fillText(layer.thickness, memRight + 10, ly + layerH / 2 + 14)

      // cellular texture inside layer
      if (i === 1) {
        // pneumocyte I (thin squamous cells)
        for (let c = 0; c < 12; c++) {
          const cx2 = memLeft + 15 + c * (memW - 30) / 11
          ctx.beginPath()
          ctx.ellipse(cx2, ly + layerH / 2, 12, 2, 0, 0, Math.PI * 2)
          ctx.fillStyle = isHovered ? 'rgba(45, 212, 191, 0.12)' : 'rgba(45, 212, 191, 0.04)'
          ctx.fill()
        }
      }
      if (i === 5) {
        // endothelial cells
        for (let c = 0; c < 12; c++) {
          const cx2 = memLeft + 15 + c * (memW - 30) / 11
          ctx.beginPath()
          ctx.ellipse(cx2, ly + layerH / 2, 11, 2.5, 0.1, 0, Math.PI * 2)
          ctx.fillStyle = isHovered ? 'rgba(244, 63, 94, 0.12)' : 'rgba(244, 63, 94, 0.04)'
          ctx.fill()
        }
      }

      layerRegions.push({ layer: (i + 1) as MemLayer, y: ly, h: layerH })
    }
    layerRegionsRef.current = layerRegions

    // ── O₂ diffusing DOWN (alveolar → capillary)
    for (const p of st.o2Particles) {
      p.phase += 0.005
      if (p.phase > 1) { p.phase = 0; p.x = memLeft + 30 + Math.random() * (memW - 60) }
      if (p.x === 0) p.x = memLeft + 30 + Math.random() * (memW - 60)

      const py = lerp(alvBot - 5, capTop + 5, p.phase)
      const px = p.x + Math.sin(st.t * 2 + p.phase * 8) * 5

      // crossing highlight
      const inMembrane = py > memTop && py < memBot
      if (inMembrane) {
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 8)
        grad.addColorStop(0, 'rgba(34, 211, 238, 0.25)')
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(px - 10, py - 10, 20, 20)
      }

      ctx.beginPath()
      ctx.arc(px, py, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = COL_O2
      ctx.fill()

      // arrow trail
      if (p.phase > 0.1 && p.phase < 0.9) {
        ctx.beginPath()
        ctx.moveTo(px, py - 5)
        ctx.lineTo(px, py + 5)
        ctx.lineTo(px + 3, py + 2)
        ctx.moveTo(px, py + 5)
        ctx.lineTo(px - 3, py + 2)
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)'
        ctx.lineWidth = 0.8
        ctx.stroke()
      }
    }

    // ── CO₂ diffusing UP (capillary → alveolar)
    for (const p of st.co2Particles) {
      p.phase += 0.004
      if (p.phase > 1) { p.phase = 0; p.x = memLeft + 30 + Math.random() * (memW - 60) }
      if (p.x === 0) p.x = memLeft + 30 + Math.random() * (memW - 60)

      const py = lerp(capTop + 5, alvBot - 5, p.phase)
      const px = p.x + Math.sin(st.t * 1.8 + p.phase * 6) * 4

      ctx.beginPath()
      ctx.arc(px, py, 2, 0, Math.PI * 2)
      ctx.fillStyle = COL_CO2
      ctx.fill()
    }

    // ── diffusion labels
    ctx.font = `700 ${Math.max(9, 11 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'

    // O₂ arrow
    ctx.fillStyle = COL_O2
    ctx.fillText('O₂ ↓', memLeft - 50 * S, h / 2 - 10)
    ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(34, 211, 238, 0.4)'
    ctx.fillText('ΔP = 64 mmHg', memLeft - 50 * S, h / 2 + 4)

    // CO₂ arrow
    ctx.font = `700 ${Math.max(9, 11 * S)}px ${FONT_MONO}`
    ctx.fillStyle = COL_CO2
    ctx.fillText('CO₂ ↑', memLeft - 50 * S, h / 2 + 25)
    ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(244, 63, 94, 0.4)'
    ctx.fillText('ΔP = 5 mmHg', memLeft - 50 * S, h / 2 + 38)

    // total thickness label
    ctx.font = `700 ${Math.max(10, 12 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.fillText('≈ 0,5 µm', memLeft + memW / 2, memBot + 16)
    ctx.font = `500 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('Espessura total da membrana respiratória', memLeft + memW / 2, memBot + 28)

    // Fick's law
    ctx.font = `600 ${Math.max(8, 9 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.fillText('Difusão ∝ Área × ΔP / Espessura  (Lei de Fick)', memLeft + memW / 2, h - 12)

    // HUD
    ctx.font = `600 ${Math.max(9, 10 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('RESPIRATORY.MEMBRANE', 12, 20)
    ctx.fillStyle = 'rgba(45, 212, 191, 0.5)'
    ctx.fillText('▸ 6 CAMADAS', 12, 34)
  }, [hoveredLayer])

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
      if (cvs.width !== cw || cvs.height !== ch) { cvs.width = cw; cvs.height = ch }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(ctx, rect.width, rect.height)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [draw])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const cvs = canvasRef.current
    if (!cvs) return
    const rect = cvs.getBoundingClientRect()
    const my = e.clientY - rect.top
    let found: MemLayer = null
    for (const r of layerRegionsRef.current) {
      if (my >= r.y && my <= r.y + r.h) { found = r.layer; break }
    }
    setHoveredLayer(found)
    cvs.style.cursor = found ? 'pointer' : 'default'
  }, [])

  const info = hoveredLayer ? LAYERS[hoveredLayer - 1] : null

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas
        ref={canvasRef}
        className="w-full rounded-2xl"
        style={{ aspectRatio: '16/9', background: COL_BG }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredLayer(null)}
      />
      {info && (
        <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md px-4 py-2.5" style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ background: info.color }} />
            <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider">Camada {hoveredLayer}: {info.name}</span>
            <span className="text-[9px] text-white/40 ml-auto">{info.thickness}</span>
          </div>
        </div>
      )}
    </div>
  )
}
