'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface RespiratoryOxyHbCurveSimProps { className?: string }
type CurveMode = 'normal' | 'right' | 'left' | 'all'

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.02)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.30)'
const COL_NORMAL = 'rgba(45, 212, 191, 0.85)'
const COL_RIGHT = 'rgba(244, 63, 94, 0.8)'
const COL_LEFT = 'rgba(34, 211, 238, 0.8)'
const COL_AXIS = 'rgba(255, 255, 255, 0.12)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

// Hill equation for oxyhemoglobin dissociation
// SaO₂ = PO₂ⁿ / (P50ⁿ + PO₂ⁿ) — sigmoidal curve
function hillSat(po2: number, p50: number, n: number): number {
  if (po2 <= 0) return 0
  const po2n = Math.pow(po2, n)
  return (po2n / (Math.pow(p50, n) + po2n)) * 100
}

/* ─────────────────────── component ─────────────────────── */

export function RespiratoryOxyHbCurveSim({ className }: RespiratoryOxyHbCurveSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<CurveMode>('normal')
  const [hoverPO2, setHoverPO2] = useState<number | null>(null)
  const stRef = useRef({ t: 0, last: 0 })

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const st = stRef.current
    const S = Math.min(w / 720, h / 480)

    ctx.fillStyle = COL_BG; ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = COL_GRID; ctx.lineWidth = 0.5
    const gs = 26 * S
    for (let gx = 0; gx < w; gx += gs) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke() }
    for (let gy = 0; gy < h; gy += gs) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke() }

    // graph area
    const gL = 80 * S, gR = w * 0.62, gT = 40 * S, gB = h - 65 * S
    const gW = gR - gL, gH = gB - gT

    // PO₂ range: 0-120 mmHg, SaO₂ range: 0-100%
    const maxPO2 = 120, maxSat = 100

    const po2ToX = (po2: number) => gL + (po2 / maxPO2) * gW
    const satToY = (sat: number) => gB - (sat / maxSat) * gH
    const xToPO2 = (x: number) => ((x - gL) / gW) * maxPO2

    // ── AXES
    ctx.strokeStyle = COL_AXIS; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(gL, gT - 5); ctx.lineTo(gL, gB); ctx.lineTo(gR + 5, gB); ctx.stroke()

    // X axis ticks and labels (PO₂)
    ctx.font = `500 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'; ctx.fillStyle = COL_TEXT_DIM
    for (let po2 = 0; po2 <= 120; po2 += 20) {
      const x = po2ToX(po2)
      ctx.beginPath(); ctx.moveTo(x, gB); ctx.lineTo(x, gB + 4)
      ctx.strokeStyle = COL_AXIS; ctx.lineWidth = 1; ctx.stroke()
      ctx.fillText(`${po2}`, x, gB + 15)
      // grid line
      if (po2 > 0) {
        ctx.beginPath(); ctx.moveTo(x, gT); ctx.lineTo(x, gB)
        ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 0.5; ctx.stroke()
      }
    }
    ctx.font = `600 ${Math.max(8, 9 * S)}px ${FONT_MONO}`
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('PO₂ (mmHg)', gL + gW / 2, gB + 35)

    // Y axis ticks and labels (SaO₂ %)
    ctx.textAlign = 'right'
    for (let sat = 0; sat <= 100; sat += 25) {
      const y = satToY(sat)
      ctx.beginPath(); ctx.moveTo(gL - 4, y); ctx.lineTo(gL, y)
      ctx.strokeStyle = COL_AXIS; ctx.lineWidth = 1; ctx.stroke()
      ctx.font = `500 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
      ctx.fillStyle = COL_TEXT_DIM
      ctx.fillText(`${sat}%`, gL - 8, y + 4)
      if (sat > 0 && sat < 100) {
        ctx.beginPath(); ctx.moveTo(gL, y); ctx.lineTo(gR, y)
        ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 0.5; ctx.stroke()
      }
    }
    ctx.save()
    ctx.translate(gL - 40, gT + gH / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.font = `600 ${Math.max(8, 9 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'; ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('SaO₂ (%)', 0, 0)
    ctx.restore()

    // ── DRAW CURVES
    // Normal: P50=27, n=2.7
    // Right shift (Bohr): P50=32, n=2.7 — ↑temp, ↑CO₂, ↑H⁺, ↑2,3-DPG
    // Left shift (Haldane): P50=20, n=2.7 — ↓temp, ↓CO₂, ↓H⁺, fetal Hb

    const curves = [
      { id: 'left', p50: 20, n: 2.7, color: COL_LEFT, label: '← Desvio Esquerda', show: mode === 'left' || mode === 'all' },
      { id: 'normal', p50: 27, n: 2.7, color: COL_NORMAL, label: 'Normal', show: mode === 'normal' || mode === 'all' },
      { id: 'right', p50: 32, n: 2.7, color: COL_RIGHT, label: 'Desvio Direita →', show: mode === 'right' || mode === 'all' },
    ]

    for (const curve of curves) {
      if (!curve.show) continue
      const isMain = curve.id === mode || mode === 'all'

      // fill under curve
      ctx.beginPath()
      ctx.moveTo(po2ToX(0), gB)
      for (let po2 = 0; po2 <= maxPO2; po2 += 1) {
        const sat = hillSat(po2, curve.p50, curve.n)
        ctx.lineTo(po2ToX(po2), satToY(sat))
      }
      ctx.lineTo(po2ToX(maxPO2), gB)
      ctx.closePath()
      ctx.fillStyle = curve.color.replace(/[\d.]+\)$/, `${isMain ? 0.06 : 0.02})`)
      ctx.fill()

      // curve line
      ctx.beginPath()
      for (let po2 = 0; po2 <= maxPO2; po2 += 0.5) {
        const sat = hillSat(po2, curve.p50, curve.n)
        const x = po2ToX(po2), y = satToY(sat)
        po2 === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = curve.color.replace(/[\d.]+\)$/, `${isMain ? 0.85 : 0.2})`)
      ctx.lineWidth = isMain ? 2.5 : 1.5
      ctx.stroke()

      // P50 marker
      if (isMain || mode === 'all') {
        const p50X = po2ToX(curve.p50)
        const p50Y = satToY(50)
        ctx.beginPath()
        ctx.setLineDash([3, 3])
        ctx.moveTo(p50X, gB); ctx.lineTo(p50X, p50Y)
        ctx.moveTo(gL, p50Y); ctx.lineTo(p50X, p50Y)
        ctx.strokeStyle = curve.color.replace(/[\d.]+\)$/, '0.25)')
        ctx.lineWidth = 1; ctx.stroke()
        ctx.setLineDash([])

        ctx.beginPath(); ctx.arc(p50X, p50Y, 4, 0, Math.PI * 2)
        ctx.fillStyle = curve.color; ctx.fill()

        ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
        ctx.textAlign = 'center'
        ctx.fillStyle = curve.color
        ctx.fillText(`P50=${curve.p50}`, p50X, p50Y - 10)
      }
    }

    // ── PHYSIOLOGICAL MARKERS
    // Arterial point: PO₂ ~100, SaO₂ ~97-98%
    const artSat = hillSat(100, 27, 2.7)
    const artX = po2ToX(100), artY = satToY(artSat)
    if (mode === 'normal' || mode === 'all') {
      ctx.beginPath(); ctx.arc(artX, artY, 5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(34, 211, 238, 0.3)'; ctx.fill()
      ctx.strokeStyle = COL_NORMAL; ctx.lineWidth = 1.5; ctx.stroke()
      ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'left'
      ctx.fillStyle = 'rgba(34, 211, 238, 0.6)'
      ctx.fillText(`Arterial`, artX + 8, artY - 3)
      ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
      ctx.fillText(`PO₂=100 SaO₂=${artSat.toFixed(0)}%`, artX + 8, artY + 8)
    }

    // Venous point: PO₂ ~40, SaO₂ ~75%
    const venSat = hillSat(40, 27, 2.7)
    const venX = po2ToX(40), venY = satToY(venSat)
    if (mode === 'normal' || mode === 'all') {
      ctx.beginPath(); ctx.arc(venX, venY, 5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(167, 139, 250, 0.3)'; ctx.fill()
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.7)'; ctx.lineWidth = 1.5; ctx.stroke()
      ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'right'
      ctx.fillStyle = 'rgba(167, 139, 250, 0.6)'
      ctx.fillText(`Venoso`, venX - 8, venY - 3)
      ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
      ctx.fillText(`PO₂=40 SaO₂=${venSat.toFixed(0)}%`, venX - 8, venY + 8)

      // O₂ delivery zone (between arterial and venous)
      ctx.fillStyle = 'rgba(45, 212, 191, 0.03)'
      ctx.fillRect(venX, artY, artX - venX, venY - artY)
      ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(45, 212, 191, 0.25)'
      ctx.fillText(`↕ Liberação: ~${(artSat - venSat).toFixed(0)}%`, (venX + artX) / 2, (venY + artY) / 2)
    }

    // ── HOVER crosshair
    if (hoverPO2 !== null && hoverPO2 >= 0 && hoverPO2 <= maxPO2) {
      const hx = po2ToX(hoverPO2)
      const activeCurve = mode === 'all' ? curves[1] : curves.find(c => c.show)!
      const hSat = hillSat(hoverPO2, activeCurve.p50, activeCurve.n)
      const hy = satToY(hSat)

      // crosshair
      ctx.beginPath()
      ctx.setLineDash([2, 2])
      ctx.moveTo(hx, gB); ctx.lineTo(hx, hy)
      ctx.moveTo(gL, hy); ctx.lineTo(hx, hy)
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.stroke()
      ctx.setLineDash([])

      ctx.beginPath(); ctx.arc(hx, hy, 5, 0, Math.PI * 2)
      ctx.fillStyle = activeCurve.color; ctx.fill()

      // tooltip
      ctx.font = `700 ${Math.max(8, 10 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'left'
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      ctx.fillText(`PO₂: ${hoverPO2.toFixed(0)} mmHg`, hx + 10, hy - 12)
      ctx.fillText(`SaO₂: ${hSat.toFixed(1)}%`, hx + 10, hy + 2)
    }

    // ── HYPOXEMIA ZONES (bottom of graph)
    const hypZones = [
      { label: 'Normal', from: 80, to: 120, color: 'rgba(45, 212, 191, 0.15)' },
      { label: 'Leve', from: 60, to: 80, color: 'rgba(250, 204, 21, 0.12)' },
      { label: 'Moderada', from: 40, to: 60, color: 'rgba(251, 146, 60, 0.12)' },
      { label: 'Grave', from: 20, to: 40, color: 'rgba(244, 63, 94, 0.12)' },
    ]
    for (const z of hypZones) {
      const x1 = po2ToX(z.from), x2 = po2ToX(z.to)
      ctx.fillStyle = z.color
      ctx.fillRect(x1, gB + 2, x2 - x1, 8 * S)
      ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.fillText(z.label, (x1 + x2) / 2, gB + 8 * S + 10)
    }

    // ═══ RIGHT PANEL ═══
    const rpX = w * 0.66, rpY = 55 * S

    ctx.font = `700 ${Math.max(10, 12 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillText('Curva de Dissociação', rpX, rpY)
    ctx.fillText('Oxi-Hemoglobina', rpX, rpY + 16)

    // equation
    ctx.font = `600 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.fillStyle = COL_NORMAL
    ctx.fillText('Hb + 4O₂ ⇄ Hb(O₂)₄', rpX, rpY + 38)

    // Hill equation
    ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('SaO₂ = PO₂ⁿ / (P50ⁿ + PO₂ⁿ)', rpX, rpY + 55)
    ctx.fillText('n ≈ 2.7 (cooperatividade)', rpX, rpY + 68)

    // shift explanations
    const shiftY = rpY + 95
    ctx.font = `700 ${Math.max(8, 9 * S)}px ${FONT_MONO}`

    // right shift
    ctx.fillStyle = COL_RIGHT
    ctx.fillText('→ Desvio DIREITA (Efeito Bohr)', rpX, shiftY)
    ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(244, 63, 94, 0.5)'
    const rightLines = ['↑ Temperatura', '↑ PCO₂ / ↑ H⁺ (↓pH)', '↑ 2,3-DPG', '→ ↑P50 → Facilita LIBERAÇÃO nos tecidos']
    rightLines.forEach((l, i) => ctx.fillText(l, rpX, shiftY + 14 + i * 12))

    // left shift
    const leftY = shiftY + 14 + rightLines.length * 12 + 18
    ctx.font = `700 ${Math.max(8, 9 * S)}px ${FONT_MONO}`
    ctx.fillStyle = COL_LEFT
    ctx.fillText('← Desvio ESQUERDA (Haldane)', rpX, leftY)
    ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(34, 211, 238, 0.5)'
    const leftLines = ['↓ Temperatura', '↓ PCO₂ / ↓ H⁺ (↑pH)', 'HbF (fetal) / CO', '→ ↓P50 → Facilita CAPTAÇÃO nos pulmões']
    leftLines.forEach((l, i) => ctx.fillText(l, rpX, leftY + 14 + i * 12))

    // O₂ dissolved
    const dissY = leftY + 14 + leftLines.length * 12 + 18
    ctx.font = `600 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(250, 204, 21, 0.6)'
    ctx.fillText('O₂ Dissolvido = PaO₂ × 0,003', rpX, dissY)
    ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('100 × 0,003 = 0,3 vol% (apenas 1,5%)', rpX, dissY + 13)
    ctx.fillText('98,5% do O₂ → ligado à Hb', rpX, dissY + 26)

    // HUD
    ctx.font = `600 ${Math.max(9, 10 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM; ctx.fillText('OXYHEMOGLOBIN.CURVE', 12, h - 8)
    ctx.fillStyle = 'rgba(45, 212, 191, 0.4)'; ctx.fillText('▸ EQUAÇÃO DE HILL', 12, h - 22)
  }, [mode, hoverPO2])

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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current; if (!c) return
    const r = c.getBoundingClientRect()
    const S = Math.min(r.width / 720, r.height / 480)
    const gL = 80 * S, gR = r.width * 0.62
    const mx = e.clientX - r.left
    if (mx >= gL && mx <= gR) {
      setHoverPO2(((mx - gL) / (gR - gL)) * 120)
    } else {
      setHoverPO2(null)
    }
  }, [])

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas ref={canvasRef} className="w-full rounded-2xl"
        style={{ aspectRatio: '16/9', background: COL_BG }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverPO2(null)} />
      <div className="absolute top-3 left-3 flex gap-1">
        {([
          { id: 'normal' as CurveMode, label: 'Normal' },
          { id: 'right' as CurveMode, label: '→ Bohr' },
          { id: 'left' as CurveMode, label: '← Haldane' },
          { id: 'all' as CurveMode, label: 'Todas' },
        ]).map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`px-2 py-1 rounded-lg text-[8px] font-semibold uppercase tracking-wider transition-all ${
              mode === m.id ? 'bg-white/10 text-white/80 border border-white/20' : 'text-white/30 hover:text-white/50 border border-transparent'
            }`}>{m.label}</button>
        ))}
      </div>
    </div>
  )
}
