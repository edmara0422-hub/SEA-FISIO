'use client'

import { useRef, useEffect, useCallback } from 'react'

// ---------------------------------------------------------------------------
// Action Potential curve data
// ---------------------------------------------------------------------------

/** A single point on the voltage-vs-time curve */
interface CurvePoint {
  t: number   // ms
  v: number   // mV
}

/**
 * Build the canonical action-potential waveform as an array of (t, v) points.
 * Times are in ms; voltages in mV.
 *
 *   Phase 0  – Resting:           0–2 ms   → -70 mV
 *   Phase 1  – Stimulus/Threshold: 2–3 ms  → -70 → -55 mV
 *   Phase 2  – Depolarization:     3–4 ms  → -55 → +40 mV
 *   Phase 3  – Peak plateau:       4–4.3 ms → +40 mV
 *   Phase 4  – Repolarization:     4.3–6 ms → +40 → -80 mV
 *   Phase 5  – Hyperpolarization:  6–7 ms   → -80 mV (slight hold)
 *   Phase 6  – Return to rest:     7–9 ms   → -80 → -70 mV
 *   Phase 7  – Resting tail:       9–11 ms  → -70 mV
 */
function buildCurve(): CurvePoint[] {
  const pts: CurvePoint[] = []
  const N = 600 // total samples

  for (let i = 0; i <= N; i++) {
    const frac = i / N
    const t = frac * 11 // 0..11 ms
    let v: number

    if (t <= 2) {
      // Phase 0 – Resting
      v = -70
    } else if (t <= 3) {
      // Phase 1 – Stimulus → threshold
      const p = (t - 2) / 1
      v = -70 + p * 15 // -70 → -55
    } else if (t <= 4) {
      // Phase 2 – Rapid depolarization (sigmoid-ish rise)
      const p = (t - 3) / 1
      const s = p * p * (3 - 2 * p) // smoothstep
      v = -55 + s * 95 // -55 → +40
    } else if (t <= 4.3) {
      // Phase 3 – Peak
      const p = (t - 4) / 0.3
      v = 40 - p * 2 // tiny droop 40 → 38
    } else if (t <= 6) {
      // Phase 4 – Repolarization
      const p = (t - 4.3) / 1.7
      const s = p * p * (3 - 2 * p)
      v = 38 - s * 118 // 38 → -80
    } else if (t <= 7) {
      // Phase 5 – Hyperpolarization hold
      v = -80
    } else if (t <= 9) {
      // Phase 6 – Return to resting
      const p = (t - 7) / 2
      const s = p * p * (3 - 2 * p)
      v = -80 + s * 10 // -80 → -70
    } else {
      // Phase 7 – Resting tail
      v = -70
    }

    pts.push({ t, v })
  }

  return pts
}

// ---------------------------------------------------------------------------
// Phase classification
// ---------------------------------------------------------------------------

interface PhaseInfo {
  label: string
  color: string
}

function getPhase(t: number): PhaseInfo {
  if (t <= 2)        return { label: 'Repouso',            color: 'rgba(255,255,255,0.6)' }
  if (t <= 3)        return { label: 'Estímulo',           color: 'rgba(250,204,21,0.9)' }
  if (t <= 4)        return { label: 'Despolarização',     color: 'rgba(45,212,191,1)' }
  if (t <= 4.3)      return { label: 'Pico',               color: 'rgba(250,204,21,1)' }
  if (t <= 6)        return { label: 'Repolarização',      color: 'rgba(251,113,133,1)' }
  if (t <= 7)        return { label: 'Hiperpolarização',   color: 'rgba(56,189,248,1)' }
  return               { label: 'Repouso',            color: 'rgba(255,255,255,0.6)' }
}

// ---------------------------------------------------------------------------
// Drawing helpers
// ---------------------------------------------------------------------------

const BG            = '#07080f'
const GRID_COLOR    = 'rgba(255,255,255,0.07)'
const AXIS_COLOR    = 'rgba(255,255,255,0.35)'
const LABEL_COLOR   = 'rgba(255,255,255,0.50)'
const TEAL          = 'rgba(45,212,191,0.85)'
const TEAL_GLOW     = 'rgba(45,212,191,0.25)'

const PADDING = { top: 40, right: 30, bottom: 50, left: 62 }

// Voltage range
const V_MIN = -90
const V_MAX = 50
// Time range
const T_MIN = 0
const T_MAX = 11

// Grid voltage lines
const V_GRID = [-80, -70, -55, 0, 40]
const V_GRID_LABELS: Record<number, string> = {
  [-80]: '-80',
  [-70]: '-70 (repouso)',
  [-55]: '-55 (limiar)',
  [0]:   '0',
  [40]:  '+40 (pico)',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NeuroActionPotentialSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)
  const startRef  = useRef<number>(0)
  const curveRef  = useRef<CurvePoint[]>(buildCurve())

  // Restart handler
  const restart = useCallback(() => {
    startRef.current = performance.now()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const curve = curveRef.current

    // ---- Resize ----
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas!.getBoundingClientRect()
      canvas!.width  = rect.width  * dpr
      canvas!.height = rect.height * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    // ---- Coordinate mapping ----
    function mapX(t: number): number {
      const rect = canvas!.getBoundingClientRect()
      const plotW = rect.width - PADDING.left - PADDING.right
      return PADDING.left + ((t - T_MIN) / (T_MAX - T_MIN)) * plotW
    }

    function mapY(v: number): number {
      const rect = canvas!.getBoundingClientRect()
      const plotH = rect.height - PADDING.top - PADDING.bottom
      return PADDING.top + ((V_MAX - v) / (V_MAX - V_MIN)) * plotH
    }

    // ---- Draw frame ----
    const CYCLE_DURATION = 4500 // ms for one full sweep
    const PAUSE_AFTER    = 1200 // ms pause after curve completes
    const TOTAL_CYCLE    = CYCLE_DURATION + PAUSE_AFTER
    const FPS_INTERVAL   = 1000 / 30 // 30 fps throttle

    let lastFrameTime = 0
    startRef.current = performance.now()

    function draw(now: number) {
      animRef.current = requestAnimationFrame(draw)

      // Throttle to ~30 fps
      if (now - lastFrameTime < FPS_INTERVAL) return
      lastFrameTime = now

      const rect = canvas!.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      const elapsed = (now - startRef.current) % TOTAL_CYCLE
      const progress = Math.min(elapsed / CYCLE_DURATION, 1) // 0..1

      // How many curve points to show
      const visibleCount = Math.floor(progress * curve.length)

      // ---- Background ----
      ctx!.clearRect(0, 0, w, h)
      ctx!.fillStyle = BG
      ctx!.fillRect(0, 0, w, h)

      // ---- Grid lines ----
      ctx!.lineWidth = 1
      for (const vLine of V_GRID) {
        const y = mapY(vLine)
        ctx!.strokeStyle = GRID_COLOR
        ctx!.beginPath()
        ctx!.moveTo(PADDING.left, y)
        ctx!.lineTo(w - PADDING.right, y)
        ctx!.stroke()

        // Label
        const label = V_GRID_LABELS[vLine] ?? `${vLine}`
        ctx!.fillStyle = LABEL_COLOR
        ctx!.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx!.textAlign = 'right'
        ctx!.textBaseline = 'middle'
        ctx!.fillText(label, PADDING.left - 6, y)
      }

      // ---- Axes ----
      ctx!.strokeStyle = AXIS_COLOR
      ctx!.lineWidth = 1

      // Y axis
      ctx!.beginPath()
      ctx!.moveTo(PADDING.left, PADDING.top)
      ctx!.lineTo(PADDING.left, h - PADDING.bottom)
      ctx!.stroke()

      // X axis (at v=0 is more educational, but let's put it at bottom)
      ctx!.beginPath()
      ctx!.moveTo(PADDING.left, h - PADDING.bottom)
      ctx!.lineTo(w - PADDING.right, h - PADDING.bottom)
      ctx!.stroke()

      // Axis labels
      ctx!.fillStyle = LABEL_COLOR
      ctx!.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'top'
      ctx!.fillText('Tempo (ms)', (PADDING.left + w - PADDING.right) / 2, h - PADDING.bottom + 28)

      // Y axis label (rotated)
      ctx!.save()
      ctx!.translate(14, (PADDING.top + h - PADDING.bottom) / 2)
      ctx!.rotate(-Math.PI / 2)
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'middle'
      ctx!.fillText('Voltagem (mV)', 0, 0)
      ctx!.restore()

      // X-axis tick labels
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'top'
      for (let tVal = 0; tVal <= 11; tVal += 1) {
        const x = mapX(tVal)
        ctx!.fillStyle = LABEL_COLOR
        ctx!.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx!.fillText(`${tVal}`, x, h - PADDING.bottom + 6)

        // Small tick
        ctx!.strokeStyle = AXIS_COLOR
        ctx!.beginPath()
        ctx!.moveTo(x, h - PADDING.bottom)
        ctx!.lineTo(x, h - PADDING.bottom + 4)
        ctx!.stroke()
      }

      // ---- Draw revealed curve ----
      if (visibleCount > 1) {
        // Glow pass
        ctx!.save()
        ctx!.shadowColor = TEAL_GLOW
        ctx!.shadowBlur = 12
        ctx!.strokeStyle = TEAL
        ctx!.lineWidth = 2.5
        ctx!.lineJoin = 'round'
        ctx!.lineCap = 'round'
        ctx!.beginPath()

        for (let i = 0; i < visibleCount; i++) {
          const px = mapX(curve[i].t)
          const py = mapY(curve[i].v)
          if (i === 0) ctx!.moveTo(px, py)
          else ctx!.lineTo(px, py)
        }
        ctx!.stroke()
        ctx!.restore()

        // Solid pass (on top, crisper)
        ctx!.strokeStyle = TEAL
        ctx!.lineWidth = 2
        ctx!.lineJoin = 'round'
        ctx!.lineCap = 'round'
        ctx!.beginPath()
        for (let i = 0; i < visibleCount; i++) {
          const px = mapX(curve[i].t)
          const py = mapY(curve[i].v)
          if (i === 0) ctx!.moveTo(px, py)
          else ctx!.lineTo(px, py)
        }
        ctx!.stroke()
      }

      // ---- Moving dot ----
      if (visibleCount > 0 && progress < 1) {
        const idx = Math.min(visibleCount - 1, curve.length - 1)
        const pt = curve[idx]
        const dx = mapX(pt.t)
        const dy = mapY(pt.v)
        const phase = getPhase(pt.t)

        // Outer glow
        ctx!.beginPath()
        ctx!.arc(dx, dy, 10, 0, Math.PI * 2)
        ctx!.fillStyle = phase.color.replace(/[\d.]+\)$/, '0.18)')
        ctx!.fill()

        // Middle glow
        ctx!.beginPath()
        ctx!.arc(dx, dy, 6, 0, Math.PI * 2)
        ctx!.fillStyle = phase.color.replace(/[\d.]+\)$/, '0.35)')
        ctx!.fill()

        // Core dot
        ctx!.beginPath()
        ctx!.arc(dx, dy, 3.5, 0, Math.PI * 2)
        ctx!.fillStyle = phase.color
        ctx!.fill()

        // Phase label
        ctx!.fillStyle = phase.color
        ctx!.font = 'bold 13px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx!.textAlign = 'left'
        ctx!.textBaseline = 'bottom'

        // Position label to avoid overlap with axes
        let labelX = dx + 14
        let labelY = dy - 14
        // Keep label inside canvas
        const labelMetrics = ctx!.measureText(phase.label)
        if (labelX + labelMetrics.width > w - PADDING.right) {
          labelX = dx - labelMetrics.width - 14
        }
        if (labelY < PADDING.top + 16) {
          labelY = dy + 22
          ctx!.textBaseline = 'top'
        }

        // Background pill for readability
        const pillPadX = 6
        const pillPadY = 3
        const pillW = labelMetrics.width + pillPadX * 2
        const pillH = 18
        const pillX = labelX - pillPadX
        const pillY = ctx!.textBaseline === 'top' ? labelY - pillPadY : labelY - pillH + pillPadY

        ctx!.fillStyle = 'rgba(7,8,15,0.75)'
        ctx!.beginPath()
        ctx!.roundRect(pillX, pillY, pillW, pillH, 4)
        ctx!.fill()

        ctx!.fillStyle = phase.color
        ctx!.fillText(phase.label, labelX, labelY)

        // Voltage readout
        ctx!.fillStyle = 'rgba(255,255,255,0.55)'
        ctx!.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace'
        const voltText = `${pt.v.toFixed(0)} mV`
        if (ctx!.textBaseline === 'top') {
          ctx!.fillText(voltText, labelX, labelY + pillH + 2)
        } else {
          ctx!.fillText(voltText, labelX, labelY + 14)
        }
      }

      // ---- Ion channel indicators ----
      if (visibleCount > 0) {
        const idx = Math.min(visibleCount - 1, curve.length - 1)
        const pt = curve[idx]
        const tNow = pt.t

        // Na+ and K+ channel state text
        let naState = ''
        let kState  = ''

        if (tNow <= 2) {
          naState = 'Na⁺: fechado'
          kState  = 'K⁺: fechado'
        } else if (tNow <= 3) {
          naState = 'Na⁺: abrindo...'
          kState  = 'K⁺: fechado'
        } else if (tNow <= 4.3) {
          naState = 'Na⁺: ABERTO ↑'
          kState  = 'K⁺: fechado'
        } else if (tNow <= 6) {
          naState = 'Na⁺: fechando'
          kState  = 'K⁺: ABERTO ↓'
        } else if (tNow <= 7) {
          naState = 'Na⁺: fechado'
          kState  = 'K⁺: fechando'
        } else {
          naState = 'Na⁺: fechado'
          kState  = 'K⁺: fechado'
        }

        const boxX = w - PADDING.right - 130
        const boxY = PADDING.top + 4

        ctx!.fillStyle = 'rgba(7,8,15,0.65)'
        ctx!.beginPath()
        ctx!.roundRect(boxX, boxY, 126, 42, 6)
        ctx!.fill()

        ctx!.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx!.textAlign = 'left'
        ctx!.textBaseline = 'top'

        // Na+ in teal
        ctx!.fillStyle = tNow > 2 && tNow <= 4.3
          ? 'rgba(45,212,191,1)'
          : 'rgba(45,212,191,0.4)'
        ctx!.fillText(naState, boxX + 8, boxY + 6)

        // K+ in rose
        ctx!.fillStyle = tNow > 4.3 && tNow <= 7
          ? 'rgba(251,113,133,1)'
          : 'rgba(251,113,133,0.4)'
        ctx!.fillText(kState, boxX + 8, boxY + 24)
      }

      // ---- "Toque para reiniciar" prompt when paused ----
      if (progress >= 1) {
        ctx!.fillStyle = 'rgba(255,255,255,0.3)'
        ctx!.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx!.textAlign = 'center'
        ctx!.textBaseline = 'middle'
        ctx!.fillText('toque para reiniciar', w / 2, h - 14)
      }
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      onClick={restart}
      onTouchStart={restart}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        cursor: 'pointer',
        touchAction: 'manipulation',
      }}
    />
  )
}
