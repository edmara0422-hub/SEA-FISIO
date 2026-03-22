'use client'

import { useEffect, useRef, useCallback } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface RespiratoryGasExchangeSimProps {
  className?: string
}

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.03)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.38)'
const COL_O2 = 'rgba(34, 211, 238, 0.9)'
const COL_O2_GLOW = 'rgba(34, 211, 238, 0.2)'
const COL_CO2 = 'rgba(244, 63, 94, 0.85)'
const COL_CO2_GLOW = 'rgba(244, 63, 94, 0.2)'
const COL_ALVEOLUS = 'rgba(250, 204, 21, 0.4)'
const COL_ALVEOLUS_FILL = 'rgba(250, 204, 21, 0.04)'
const COL_CAPILLARY = 'rgba(244, 63, 94, 0.35)'
const COL_CAPILLARY_FILL = 'rgba(244, 63, 94, 0.04)'
const COL_HB = 'rgba(244, 63, 94, 0.7)'
const COL_HB_OXY = 'rgba(34, 211, 238, 0.7)'
const COL_MEMBRANE = 'rgba(255, 255, 255, 0.12)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

// real values
const PO2_ALVEOLAR = 104 // mmHg
const PO2_VENOUS = 40    // mmHg
const PCO2_ALVEOLAR = 40 // mmHg
const PCO2_VENOUS = 45   // mmHg
const MEMBRANE_THICKNESS = 0.2 // µm

/* ─────────────────────── helpers ─────────────────────── */

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/* ─────────────────────── component ─────────────────────── */

export function RespiratoryGasExchangeSim({ className }: RespiratoryGasExchangeSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    t: 0,
    lastTimestamp: 0,
    breathPhase: 0,
    o2Particles: Array.from({ length: 8 }, (_, i) => ({
      phase: Math.random(),
      crossed: false,
      delay: i * 0.12,
    })),
    co2Particles: Array.from({ length: 6 }, (_, i) => ({
      phase: Math.random(),
      crossed: false,
      delay: i * 0.15,
    })),
    rbcPhase: 0,
  })

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const st = stateRef.current
    const scale = Math.min(w / 700, h / 420)

    ctx.fillStyle = COL_BG
    ctx.fillRect(0, 0, w, h)

    // grid
    ctx.strokeStyle = COL_GRID
    ctx.lineWidth = 0.5
    const gs = 30 * scale
    for (let gx = 0; gx < w; gx += gs) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke() }
    for (let gy = 0; gy < h; gy += gs) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke() }

    st.breathPhase = (st.breathPhase + 0.006) % 2
    const breathExpand = Math.sin(st.breathPhase * Math.PI) * 0.06

    // layout
    const cx = w * 0.5
    const cy = h * 0.45
    const alvR = 85 * scale * (1 + breathExpand)

    // ── alveolus (large circle, top half)
    ctx.beginPath()
    ctx.arc(cx, cy - alvR * 0.15, alvR, 0, Math.PI * 2)
    ctx.fillStyle = COL_ALVEOLUS_FILL
    ctx.fill()
    ctx.strokeStyle = COL_ALVEOLUS
    ctx.lineWidth = 2
    ctx.stroke()

    // type I pneumocytes (thin wall cells)
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      const px = cx + Math.cos(a) * alvR * 0.95
      const py = (cy - alvR * 0.15) + Math.sin(a) * alvR * 0.95
      ctx.beginPath()
      ctx.ellipse(px, py, 5, 2, a, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(250, 204, 21, 0.15)'
      ctx.fill()
    }

    // alveolar air label
    ctx.font = `700 ${Math.max(10, 12 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(250, 204, 21, 0.5)'
    ctx.fillText('AR ALVEOLAR', cx, cy - alvR * 0.45)

    // O₂ inside alveolus (floating)
    for (let i = 0; i < 6; i++) {
      const oa = (i / 6) * Math.PI * 2 + st.t * 0.3
      const or2 = alvR * 0.4 + Math.sin(st.t + i) * 8
      const ox = cx + Math.cos(oa) * or2
      const oy = (cy - alvR * 0.15) + Math.sin(oa) * or2 * 0.6
      ctx.beginPath()
      ctx.arc(ox, oy, 3, 0, Math.PI * 2)
      ctx.fillStyle = COL_O2
      ctx.fill()
    }

    // ── capillary (curved tube wrapping bottom of alveolus)
    const capStartX = cx - alvR * 1.1
    const capEndX = cx + alvR * 1.1
    const capY = cy + alvR * 0.5
    const capH = 28 * scale

    // capillary path (wrapping around bottom of alveolus)
    ctx.beginPath()
    ctx.moveTo(capStartX, capY + 15)
    ctx.bezierCurveTo(
      cx - alvR * 0.6, capY - alvR * 0.3,
      cx + alvR * 0.6, capY - alvR * 0.3,
      capEndX, capY + 15
    )
    ctx.lineTo(capEndX, capY + 15 + capH)
    ctx.bezierCurveTo(
      cx + alvR * 0.6, capY - alvR * 0.3 + capH,
      cx - alvR * 0.6, capY - alvR * 0.3 + capH,
      capStartX, capY + 15 + capH
    )
    ctx.closePath()
    ctx.fillStyle = COL_CAPILLARY_FILL
    ctx.fill()
    ctx.strokeStyle = COL_CAPILLARY
    ctx.lineWidth = 1.5
    ctx.stroke()

    // blood flow direction
    ctx.font = `500 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(244, 63, 94, 0.5)'
    ctx.fillText('← Sangue Venoso', capStartX + 50 * scale, capY + 15 + capH + 15)
    ctx.fillText('Sangue Arterial →', capEndX - 50 * scale, capY + 15 + capH + 15)

    // ── respiratory membrane (interface between alveolus and capillary)
    const memY = cy + alvR * 0.55
    ctx.beginPath()
    ctx.setLineDash([3, 2])
    ctx.moveTo(cx - alvR * 0.7, memY)
    ctx.lineTo(cx + alvR * 0.7, memY)
    ctx.strokeStyle = COL_MEMBRANE
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.setLineDash([])

    ctx.font = `600 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.fillText(`Membrana respiratória (${MEMBRANE_THICKNESS}µm)`, cx, memY - 6)

    // ── red blood cells flowing through capillary
    st.rbcPhase = (st.rbcPhase + 0.003) % 1
    for (let rbc = 0; rbc < 5; rbc++) {
      const rbcT = (st.rbcPhase + rbc * 0.2) % 1
      // follow capillary curve
      const rbcX = lerp(capStartX + 20, capEndX - 20, rbcT)
      const curveFactor = Math.sin(rbcT * Math.PI)
      const rbcY = capY + 15 + capH * 0.5 - curveFactor * (alvR * 0.25)

      const isOxygenated = rbcT > 0.45 // past the exchange zone

      // RBC shape (biconcave disc)
      ctx.beginPath()
      ctx.ellipse(rbcX, rbcY, 7, 4, rbcT * 0.3, 0, Math.PI * 2)
      ctx.fillStyle = isOxygenated ? 'rgba(34, 211, 238, 0.2)' : 'rgba(244, 63, 94, 0.2)'
      ctx.fill()
      ctx.strokeStyle = isOxygenated ? COL_HB_OXY : COL_HB
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Hb label
      ctx.font = `600 ${5}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = isOxygenated ? COL_HB_OXY : COL_HB
      ctx.fillText(isOxygenated ? 'HbO₂' : 'Hb', rbcX, rbcY + 1.5)
    }

    // ── O₂ diffusion (alveolus → capillary)
    for (const p of st.o2Particles) {
      p.phase += 0.008
      if (p.phase > 1) p.phase = 0

      const startX = cx + (Math.sin(p.delay * 20) * alvR * 0.4)
      const startY = cy - alvR * 0.15 + (Math.cos(p.delay * 15) * alvR * 0.3)
      const endY = memY + capH * 0.4
      const endX = cx + (Math.sin(p.delay * 20) * alvR * 0.3)

      const px = lerp(startX, endX, p.phase)
      const py = lerp(startY, endY, p.phase)

      // crossing membrane highlight
      const atMembrane = Math.abs(py - memY) < 8
      if (atMembrane) {
        ctx.beginPath()
        ctx.arc(px, memY, 6, 0, Math.PI * 2)
        ctx.fillStyle = COL_O2_GLOW
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(px, py, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = COL_O2
      ctx.fill()

      // trail
      const grad = ctx.createRadialGradient(px, py, 0, px, py, 6)
      grad.addColorStop(0, COL_O2_GLOW)
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(px - 8, py - 8, 16, 16)
    }

    // ── CO₂ diffusion (capillary → alveolus)
    for (const p of st.co2Particles) {
      p.phase += 0.006
      if (p.phase > 1) p.phase = 0

      const startY = memY + capH * 0.3
      const startX = cx + (Math.cos(p.delay * 18) * alvR * 0.3)
      const endY = cy - alvR * 0.15 + (Math.sin(p.delay * 12) * alvR * 0.3)
      const endX = cx + (Math.cos(p.delay * 18) * alvR * 0.35)

      const px = lerp(startX, endX, p.phase)
      const py = lerp(startY, endY, p.phase)

      ctx.beginPath()
      ctx.arc(px, py, 2, 0, Math.PI * 2)
      ctx.fillStyle = COL_CO2
      ctx.fill()

      const grad = ctx.createRadialGradient(px, py, 0, px, py, 5)
      grad.addColorStop(0, COL_CO2_GLOW)
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(px - 7, py - 7, 14, 14)
    }

    // ── diffusion arrows
    ctx.font = `700 ${Math.max(9, 10 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'left'

    // O₂ arrow
    const arrowX1 = cx + alvR + 15
    ctx.fillStyle = COL_O2
    ctx.fillText('O₂ ↓', arrowX1, memY - 15)
    ctx.font = `500 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(34, 211, 238, 0.5)'
    ctx.fillText(`PO₂ alv: ${PO2_ALVEOLAR} mmHg`, arrowX1, memY - 2)
    ctx.fillText(`PO₂ ven: ${PO2_VENOUS} mmHg`, arrowX1, memY + 10)
    ctx.fillText(`ΔP = ${PO2_ALVEOLAR - PO2_VENOUS} mmHg`, arrowX1, memY + 24)

    // CO₂ arrow
    const arrowX2 = 15
    ctx.font = `700 ${Math.max(9, 10 * scale)}px ${FONT_MONO}`
    ctx.fillStyle = COL_CO2
    ctx.textAlign = 'left'
    ctx.fillText('CO₂ ↑', arrowX2, memY - 15)
    ctx.font = `500 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(244, 63, 94, 0.5)'
    ctx.fillText(`PCO₂ ven: ${PCO2_VENOUS} mmHg`, arrowX2, memY - 2)
    ctx.fillText(`PCO₂ alv: ${PCO2_ALVEOLAR} mmHg`, arrowX2, memY + 10)
    ctx.fillText(`ΔP = ${PCO2_VENOUS - PCO2_ALVEOLAR} mmHg`, arrowX2, memY + 24)

    // ── equation
    ctx.font = `700 ${Math.max(10, 12 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.fillText('Hb + 4O₂ ⇄ Hb(O₂)₄', cx, h - 40 * scale)
    ctx.font = `500 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('Difusão por gradiente de pressão parcial (Lei de Fick)', cx, h - 22 * scale)

    // HUD
    ctx.font = `600 ${Math.max(9, 10 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('GAS.EXCHANGE', 12, 20)
    ctx.fillStyle = 'rgba(45, 212, 191, 0.5)'
    ctx.fillText('▸ HEMATOSE ALVEOLAR', 12, 34)
  }, [])

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

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas
        ref={canvasRef}
        className="w-full rounded-2xl"
        style={{ aspectRatio: '16/9', background: COL_BG }}
      />
    </div>
  )
}
