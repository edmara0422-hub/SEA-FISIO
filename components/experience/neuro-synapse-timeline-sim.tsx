'use client'

import { useRef, useEffect, useCallback } from 'react'

// ---------------------------------------------------------------------------
// Synaptic density curve data
// ---------------------------------------------------------------------------

/** A single point on the density-vs-age curve */
interface CurvePoint {
  age: number    // years
  density: number // 0–100 (percentage)
}

/**
 * Build the synaptic density vs age waveform.
 * Ages are in years (0–30); density is a percentage (0–100).
 *
 *   Phase 1 – Sinaptogênese:    0–3 years   → 40% → 100% (steep rise)
 *   Phase 2 – Poda Sináptica:   3–10 years  → 100% → 60%  (pruning)
 *   Phase 3 – Adolescência:     10–20 years → 60% → 45%   (continued decline)
 *   Phase 4 – Estabilidade:     20–30 years → 45% → 40%   (plateau)
 */
function buildCurve(): CurvePoint[] {
  const pts: CurvePoint[] = []
  const N = 600 // total samples

  for (let i = 0; i <= N; i++) {
    const frac = i / N
    const age = frac * 30 // 0..30 years
    let density: number

    if (age <= 3) {
      // Sinaptogênese – steep rise from 40% to 100%
      // Use a smoothstep that starts slow then accelerates
      const p = age / 3
      const s = p * p * (3 - 2 * p) // smoothstep
      density = 40 + s * 60
    } else if (age <= 10) {
      // Poda Sináptica – pruning from 100% down to 60%
      const p = (age - 3) / 7
      const s = p * p * (3 - 2 * p)
      density = 100 - s * 40
    } else if (age <= 20) {
      // Adolescência – continued decline from 60% to 45%
      const p = (age - 10) / 10
      const s = p * p * (3 - 2 * p)
      density = 60 - s * 15
    } else {
      // Estabilidade – gentle decline from 45% to 40%
      const p = (age - 20) / 10
      const s = p * p * (3 - 2 * p)
      density = 45 - s * 5
    }

    pts.push({ age, density })
  }

  return pts
}

// ---------------------------------------------------------------------------
// Phase classification
// ---------------------------------------------------------------------------

interface PhaseInfo {
  label: string
  color: string
  fillColor: string
}

function getPhase(age: number): PhaseInfo {
  if (age <= 3) return {
    label: 'Sinaptogênese',
    color: 'rgba(45,212,191,1)',
    fillColor: 'rgba(45,212,191,0.25)',
  }
  if (age <= 10) return {
    label: 'Poda Sináptica',
    color: 'rgba(251,113,133,1)',
    fillColor: 'rgba(251,113,133,0.20)',
  }
  if (age <= 20) return {
    label: 'Adolescência',
    color: 'rgba(250,204,21,1)',
    fillColor: 'rgba(250,204,21,0.18)',
  }
  return {
    label: 'Estabilidade',
    color: 'rgba(255,255,255,0.6)',
    fillColor: 'rgba(255,255,255,0.08)',
  }
}

// ---------------------------------------------------------------------------
// Drawing constants
// ---------------------------------------------------------------------------

const BG          = '#07080f'
const GRID_COLOR  = 'rgba(255,255,255,0.07)'
const AXIS_COLOR  = 'rgba(255,255,255,0.35)'
const LABEL_COLOR = 'rgba(255,255,255,0.50)'
const TITLE_COLOR = 'rgba(255,255,255,0.75)'

const PADDING = { top: 52, right: 30, bottom: 54, left: 58 }

// Density range (Y axis)
const D_MIN = 0
const D_MAX = 100

// Age range (X axis)
const A_MIN = 0
const A_MAX = 30

// Y grid lines (density %)
const D_GRID = [0, 25, 50, 75, 100]
const D_GRID_LABELS: Record<number, string> = {
  [0]: '0%',
  [25]: '25%',
  [50]: '50%',
  [75]: '75%',
  [100]: '100%',
}

// X axis key age markers
const AGE_MARKERS = [
  { age: 0,  label: 'Nasc.' },
  { age: 1,  label: '1a' },
  { age: 3,  label: '3a' },
  { age: 10, label: '10a' },
  { age: 15, label: '15a' },
  { age: 20, label: '20a' },
  { age: 25, label: '25a' },
  { age: 30, label: '30a' },
]

// ---------------------------------------------------------------------------
// Annotations that appear at specific ages
// ---------------------------------------------------------------------------

interface Annotation {
  age: number
  density: number
  text: string
  color: string
  offsetX: number
  offsetY: number
}

const ANNOTATIONS: Annotation[] = [
  {
    age: 3,
    density: 100,
    text: 'Pico: ~10.000 sinapses/neurônio',
    color: 'rgba(45,212,191,1)',
    offsetX: 10,
    offsetY: -16,
  },
  {
    age: 7,
    density: 76,
    text: '≈70% eliminadas',
    color: 'rgba(251,113,133,1)',
    offsetX: 10,
    offsetY: -14,
  },
  {
    age: 22,
    density: 44,
    text: 'Mielinização pré-frontal',
    color: 'rgba(255,255,255,0.6)',
    offsetX: -10,
    offsetY: -16,
  },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NeuroSynapseTimelineSim({ className }: { className?: string }) {
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
    function mapX(age: number): number {
      const rect = canvas!.getBoundingClientRect()
      const plotW = rect.width - PADDING.left - PADDING.right
      return PADDING.left + ((age - A_MIN) / (A_MAX - A_MIN)) * plotW
    }

    function mapY(density: number): number {
      const rect = canvas!.getBoundingClientRect()
      const plotH = rect.height - PADDING.top - PADDING.bottom
      return PADDING.top + ((D_MAX - density) / (D_MAX - D_MIN)) * plotH
    }

    // ---- Animation timing ----
    const CYCLE_DURATION = 6000 // 6 seconds for one full sweep
    const PAUSE_AFTER    = 1500 // 1.5s pause after completion
    const TOTAL_CYCLE    = CYCLE_DURATION + PAUSE_AFTER
    const FPS_INTERVAL   = 1000 / 30 // throttle to 30 fps

    let lastFrameTime = 0
    startRef.current = performance.now()

    // ---- Draw frame ----
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

      // ---- Title ----
      ctx!.fillStyle = TITLE_COLOR
      ctx!.font = 'bold 14px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'top'
      ctx!.fillText('Densidade Sináptica ao Longo da Vida', w / 2, 14)

      // ---- Grid lines ----
      ctx!.lineWidth = 1
      for (const dLine of D_GRID) {
        const y = mapY(dLine)

        // Horizontal grid line
        ctx!.strokeStyle = GRID_COLOR
        ctx!.beginPath()
        ctx!.moveTo(PADDING.left, y)
        ctx!.lineTo(w - PADDING.right, y)
        ctx!.stroke()

        // Y-axis label
        const label = D_GRID_LABELS[dLine] ?? `${dLine}%`
        ctx!.fillStyle = LABEL_COLOR
        ctx!.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx!.textAlign = 'right'
        ctx!.textBaseline = 'middle'
        ctx!.fillText(label, PADDING.left - 8, y)
      }

      // Vertical grid lines at age markers
      for (const marker of AGE_MARKERS) {
        const x = mapX(marker.age)
        ctx!.strokeStyle = GRID_COLOR
        ctx!.beginPath()
        ctx!.moveTo(x, PADDING.top)
        ctx!.lineTo(x, h - PADDING.bottom)
        ctx!.stroke()
      }

      // ---- Axes ----
      ctx!.strokeStyle = AXIS_COLOR
      ctx!.lineWidth = 1

      // Y axis
      ctx!.beginPath()
      ctx!.moveTo(PADDING.left, PADDING.top)
      ctx!.lineTo(PADDING.left, h - PADDING.bottom)
      ctx!.stroke()

      // X axis
      ctx!.beginPath()
      ctx!.moveTo(PADDING.left, h - PADDING.bottom)
      ctx!.lineTo(w - PADDING.right, h - PADDING.bottom)
      ctx!.stroke()

      // Axis labels
      ctx!.fillStyle = LABEL_COLOR
      ctx!.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'top'
      ctx!.fillText('Idade (anos)', (PADDING.left + w - PADDING.right) / 2, h - PADDING.bottom + 32)

      // Y axis label (rotated)
      ctx!.save()
      ctx!.translate(14, (PADDING.top + h - PADDING.bottom) / 2)
      ctx!.rotate(-Math.PI / 2)
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'middle'
      ctx!.fillText('Densidade Sináptica', 0, 0)
      ctx!.restore()

      // X-axis age marker labels + ticks
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'top'
      for (const marker of AGE_MARKERS) {
        const x = mapX(marker.age)

        // Tick
        ctx!.strokeStyle = AXIS_COLOR
        ctx!.beginPath()
        ctx!.moveTo(x, h - PADDING.bottom)
        ctx!.lineTo(x, h - PADDING.bottom + 5)
        ctx!.stroke()

        // Label
        ctx!.fillStyle = LABEL_COLOR
        ctx!.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx!.fillText(marker.label, x, h - PADDING.bottom + 8)
      }

      // ---- Filled area under revealed curve ----
      if (visibleCount > 1) {
        const lastVisible = curve[Math.min(visibleCount - 1, curve.length - 1)]
        const currentPhase = getPhase(lastVisible.age)

        // Build the fill path: curve points + drop to baseline
        ctx!.save()
        ctx!.beginPath()
        ctx!.moveTo(mapX(curve[0].age), mapY(0))
        for (let i = 0; i < visibleCount; i++) {
          ctx!.lineTo(mapX(curve[i].age), mapY(curve[i].density))
        }
        const lastPt = curve[Math.min(visibleCount - 1, curve.length - 1)]
        ctx!.lineTo(mapX(lastPt.age), mapY(0))
        ctx!.closePath()

        // Create gradient fill that transitions through phase colors
        const grd = ctx!.createLinearGradient(PADDING.left, PADDING.top, mapX(lastPt.age), PADDING.top)

        // Calculate fractional stops based on visible age range
        const visibleAgeMax = lastPt.age
        if (visibleAgeMax > 0) {
          // Always start with synaptogenesis teal
          grd.addColorStop(0, 'rgba(45,212,191,0.25)')

          if (visibleAgeMax > 3) {
            const stop3 = Math.min(3 / visibleAgeMax, 1)
            grd.addColorStop(stop3, 'rgba(45,212,191,0.25)')
            grd.addColorStop(Math.min(stop3 + 0.01, 1), 'rgba(251,113,133,0.20)')
          }
          if (visibleAgeMax > 10) {
            const stop10 = Math.min(10 / visibleAgeMax, 1)
            grd.addColorStop(stop10, 'rgba(251,113,133,0.20)')
            grd.addColorStop(Math.min(stop10 + 0.01, 1), 'rgba(250,204,21,0.18)')
          }
          if (visibleAgeMax > 20) {
            const stop20 = Math.min(20 / visibleAgeMax, 1)
            grd.addColorStop(stop20, 'rgba(250,204,21,0.18)')
            grd.addColorStop(Math.min(stop20 + 0.01, 1), 'rgba(255,255,255,0.08)')
          }

          grd.addColorStop(1, currentPhase.fillColor)
        }

        ctx!.fillStyle = grd
        ctx!.fill()
        ctx!.restore()
      }

      // ---- Draw revealed curve line ----
      if (visibleCount > 1) {
        const lastVisible = curve[Math.min(visibleCount - 1, curve.length - 1)]
        const currentPhase = getPhase(lastVisible.age)

        // Glow pass
        ctx!.save()
        ctx!.shadowColor = currentPhase.color.replace(/[\d.]+\)$/, '0.30)')
        ctx!.shadowBlur = 14
        ctx!.strokeStyle = currentPhase.color
        ctx!.lineWidth = 2.5
        ctx!.lineJoin = 'round'
        ctx!.lineCap = 'round'
        ctx!.beginPath()
        for (let i = 0; i < visibleCount; i++) {
          const px = mapX(curve[i].age)
          const py = mapY(curve[i].density)
          if (i === 0) ctx!.moveTo(px, py)
          else ctx!.lineTo(px, py)
        }
        ctx!.stroke()
        ctx!.restore()

        // Solid curve with per-segment phase coloring
        ctx!.lineWidth = 2
        ctx!.lineJoin = 'round'
        ctx!.lineCap = 'round'

        let prevPhaseLabel = getPhase(curve[0].age).label
        ctx!.beginPath()
        ctx!.moveTo(mapX(curve[0].age), mapY(curve[0].density))
        ctx!.strokeStyle = getPhase(curve[0].age).color

        for (let i = 1; i < visibleCount; i++) {
          const phase = getPhase(curve[i].age)
          if (phase.label !== prevPhaseLabel) {
            // Stroke the current segment, start new one with new color
            ctx!.stroke()
            ctx!.beginPath()
            ctx!.moveTo(mapX(curve[i - 1].age), mapY(curve[i - 1].density))
            ctx!.strokeStyle = phase.color
            prevPhaseLabel = phase.label
          }
          ctx!.lineTo(mapX(curve[i].age), mapY(curve[i].density))
        }
        ctx!.stroke()
      }

      // ---- Phase labels (appear as dot enters each zone) ----
      if (visibleCount > 0) {
        const lastIdx = Math.min(visibleCount - 1, curve.length - 1)
        const lastAge = curve[lastIdx].age

        // Phase zone boundaries with label positioning
        const phaseZones = [
          { startAge: 0,  endAge: 3,  label: 'Sinaptogênese',  color: 'rgba(45,212,191,1)',    posAge: 1.5, posDensity: 20 },
          { startAge: 3,  endAge: 10, label: 'Poda Sináptica', color: 'rgba(251,113,133,1)',   posAge: 6.5, posDensity: 20 },
          { startAge: 10, endAge: 20, label: 'Adolescência',   color: 'rgba(250,204,21,1)',    posAge: 15,  posDensity: 20 },
          { startAge: 20, endAge: 30, label: 'Estabilidade',   color: 'rgba(255,255,255,0.6)', posAge: 25,  posDensity: 20 },
        ]

        for (const zone of phaseZones) {
          // Show label once the dot has entered the zone
          if (lastAge >= zone.startAge) {
            const x = mapX(zone.posAge)
            const y = mapY(zone.posDensity)

            // Fade in effect: fully visible once 0.5 years into the zone
            const fadeAge = Math.min((lastAge - zone.startAge) / 0.5, 1)
            const alpha = fadeAge

            // Background pill
            ctx!.font = 'bold 11px ui-monospace, SFMono-Regular, Menlo, monospace'
            const textW = ctx!.measureText(zone.label).width
            const pillPadX = 6
            const pillPadY = 3
            const pillW = textW + pillPadX * 2
            const pillH = 18

            ctx!.fillStyle = `rgba(7,8,15,${0.7 * alpha})`
            ctx!.beginPath()
            ctx!.roundRect(x - pillW / 2, y - pillH / 2, pillW, pillH, 4)
            ctx!.fill()

            // Text
            ctx!.fillStyle = zone.color.replace(/[\d.]+\)$/, `${alpha})`)
            ctx!.textAlign = 'center'
            ctx!.textBaseline = 'middle'
            ctx!.fillText(zone.label, x, y)
          }
        }
      }

      // ---- Annotations ----
      if (visibleCount > 0) {
        const lastIdx = Math.min(visibleCount - 1, curve.length - 1)
        const lastAge = curve[lastIdx].age

        for (const ann of ANNOTATIONS) {
          // Show annotation once the dot passes the annotation's age
          if (lastAge >= ann.age) {
            const fadeAge = Math.min((lastAge - ann.age) / 0.3, 1)

            const anchorX = mapX(ann.age)
            const anchorY = mapY(ann.density)

            // Determine text alignment based on offset direction
            const textX = anchorX + ann.offsetX
            const textY = anchorY + ann.offsetY

            ctx!.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace'
            const textW = ctx!.measureText(ann.text).width

            // Decide alignment: if offsetX is negative, right-align
            const align = ann.offsetX < 0 ? 'right' : 'left'

            // Background pill
            const pillPadX = 5
            const pillH = 16
            const pillW = textW + pillPadX * 2
            const pillX = align === 'left' ? textX - pillPadX : textX - textW - pillPadX
            const pillY = textY - pillH / 2

            ctx!.fillStyle = `rgba(7,8,15,${0.8 * fadeAge})`
            ctx!.beginPath()
            ctx!.roundRect(pillX, pillY, pillW, pillH, 3)
            ctx!.fill()

            // Annotation text
            ctx!.fillStyle = ann.color.replace(/[\d.]+\)$/, `${fadeAge})`)
            ctx!.textAlign = align as CanvasTextAlign
            ctx!.textBaseline = 'middle'
            ctx!.fillText(ann.text, textX, textY)

            // Small connecting line from anchor to text
            ctx!.strokeStyle = ann.color.replace(/[\d.]+\)$/, `${0.3 * fadeAge})`)
            ctx!.lineWidth = 1
            ctx!.beginPath()
            ctx!.moveTo(anchorX, anchorY)
            ctx!.lineTo(textX, textY)
            ctx!.stroke()

            // Small dot at the anchor point on the curve
            ctx!.beginPath()
            ctx!.arc(anchorX, anchorY, 3, 0, Math.PI * 2)
            ctx!.fillStyle = ann.color.replace(/[\d.]+\)$/, `${0.6 * fadeAge})`)
            ctx!.fill()
          }
        }
      }

      // ---- Glowing moving dot ----
      if (visibleCount > 0 && progress < 1) {
        const idx = Math.min(visibleCount - 1, curve.length - 1)
        const pt = curve[idx]
        const dx = mapX(pt.age)
        const dy = mapY(pt.density)
        const phase = getPhase(pt.age)

        // Outer glow
        ctx!.beginPath()
        ctx!.arc(dx, dy, 12, 0, Math.PI * 2)
        ctx!.fillStyle = phase.color.replace(/[\d.]+\)$/, '0.12)')
        ctx!.fill()

        // Middle glow
        ctx!.beginPath()
        ctx!.arc(dx, dy, 7, 0, Math.PI * 2)
        ctx!.fillStyle = phase.color.replace(/[\d.]+\)$/, '0.30)')
        ctx!.fill()

        // Core dot
        ctx!.beginPath()
        ctx!.arc(dx, dy, 3.5, 0, Math.PI * 2)
        ctx!.fillStyle = phase.color
        ctx!.fill()

        // Density readout near the dot
        ctx!.fillStyle = 'rgba(255,255,255,0.55)'
        ctx!.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx!.textAlign = 'left'
        ctx!.textBaseline = 'bottom'

        const readoutText = `${pt.density.toFixed(0)}%`
        const readoutX = dx + 14
        let readoutY = dy - 8
        // Keep readout inside canvas
        if (readoutY < PADDING.top + 12) readoutY = dy + 18

        ctx!.fillText(readoutText, readoutX, readoutY)
      }

      // ---- "toque para reiniciar" prompt when paused ----
      if (progress >= 1) {
        ctx!.fillStyle = 'rgba(255,255,255,0.3)'
        ctx!.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx!.textAlign = 'center'
        ctx!.textBaseline = 'middle'
        ctx!.fillText('toque para reiniciar', w / 2, h - 16)
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
