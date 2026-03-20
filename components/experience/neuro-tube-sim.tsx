'use client'

import { useRef, useEffect } from 'react'

// ---------------------------------------------------------------------------
// Constants & Colors
// ---------------------------------------------------------------------------

const BG         = '#07080f'
const TEAL       = 'rgba(45,212,191,'
const YELLOW     = 'rgba(250,204,21,'
const ROSE       = 'rgba(251,113,133,'
const LABEL_DIM  = 'rgba(255,255,255,0.45)'
const LABEL_HI   = 'rgba(255,255,255,0.85)'
const MONO_FONT  = 'ui-monospace, SFMono-Regular, Menlo, monospace'

// Animation timing
const CYCLE_DURATION = 10000  // ms for one full cycle through all stages
const PAUSE_AFTER    = 2000   // ms pause after cycle completes
const TOTAL_CYCLE    = CYCLE_DURATION + PAUSE_AFTER
const FPS_INTERVAL   = 1000 / 30 // 30 fps throttle

// Stage boundaries (as fractions of the cycle)
const STAGE_1_END = 0.20  // Neural Plate
const STAGE_2_END = 0.45  // Neural Groove
const STAGE_3_END = 0.70  // Neural Tube Closing
// Stage 4 runs from 0.70 to 1.0 — Neural Crest Migration

// ---------------------------------------------------------------------------
// Easing & Interpolation Helpers
// ---------------------------------------------------------------------------

/** Smooth-step: 0→1 with ease in/out */
function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t))
  return c * c * (3 - 2 * c)
}

/** Lerp between a and b */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Get stage local progress (0..1) within a range */
function stageProgress(global: number, start: number, end: number): number {
  if (global <= start) return 0
  if (global >= end) return 1
  return (global - start) / (end - start)
}

// ---------------------------------------------------------------------------
// Neural Crest Cell
// ---------------------------------------------------------------------------

interface CrestCell {
  startAngle: number  // angle from origin point
  speed: number       // multiplier
  offsetY: number     // slight vertical variation
  side: -1 | 1       // left or right
}

function buildCrestCells(count: number): CrestCell[] {
  const cells: CrestCell[] = []
  for (let i = 0; i < count; i++) {
    const side = (i % 2 === 0 ? 1 : -1) as 1 | -1
    cells.push({
      startAngle: (Math.random() - 0.5) * 0.8,
      speed: 0.6 + Math.random() * 0.7,
      offsetY: (Math.random() - 0.5) * 18,
      side,
    })
  }
  return cells
}

// ---------------------------------------------------------------------------
// Drawing Helpers
// ---------------------------------------------------------------------------

/** Draw a smooth curve through the ectoderm control points */
function drawEctoderm(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  halfW: number,
  bendDepth: number,    // how far the center sags down (0 = flat, positive = down)
  foldHeight: number,   // how far the edges rise up
  closeFrac: number,    // 0 = open folds, 1 = folds fully closed at top
  tubeRadius: number,
  opacity: number,
) {
  // Control points for the ectoderm cross-section
  // From left edge to right edge

  const leftX = cx - halfW
  const rightX = cx + halfW
  const baseY = cy

  // Fold tip positions
  const foldSpread = lerp(halfW * 0.35, 0, closeFrac)
  const foldTipY = baseY - foldHeight
  const foldTipLeftX = cx - foldSpread
  const foldTipRightX = cx + foldSpread

  ctx.save()
  ctx.strokeStyle = `${TEAL}${opacity})`
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // Glow
  ctx.shadowColor = `${TEAL}0.3)`
  ctx.shadowBlur = 10

  ctx.beginPath()

  if (closeFrac >= 0.95) {
    // Draw as closed tube (circle) + flat ectoderm on sides
    // Flat ectoderm left side
    ctx.moveTo(leftX, baseY)
    ctx.lineTo(cx - tubeRadius - 4, baseY)

    ctx.stroke()

    // Tube circle
    ctx.beginPath()
    ctx.arc(cx, baseY - tubeRadius - 2, tubeRadius, 0, Math.PI * 2)
    ctx.stroke()

    // Flat ectoderm right side
    ctx.beginPath()
    ctx.moveTo(cx + tubeRadius + 4, baseY)
    ctx.lineTo(rightX, baseY)
    ctx.stroke()

    // Filled tube interior (slight tint)
    ctx.fillStyle = `${TEAL}0.08)`
    ctx.beginPath()
    ctx.arc(cx, baseY - tubeRadius - 2, tubeRadius, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // Open / folding shape using bezier curves

    // Left flat portion
    ctx.moveTo(leftX, baseY)

    // Left shoulder approaching fold
    const shoulderX = cx - halfW * 0.45
    ctx.lineTo(shoulderX, baseY)

    // Left fold going up
    ctx.bezierCurveTo(
      shoulderX, baseY,
      foldTipLeftX - halfW * 0.15, lerp(baseY, foldTipY, 0.5),
      foldTipLeftX, foldTipY,
    )

    // Center bend down (the groove)
    if (bendDepth > 2) {
      ctx.bezierCurveTo(
        foldTipLeftX + (foldTipRightX - foldTipLeftX) * 0.15, foldTipY + bendDepth * 0.1,
        cx - halfW * 0.08, baseY + bendDepth,
        cx, baseY + bendDepth,
      )
      ctx.bezierCurveTo(
        cx + halfW * 0.08, baseY + bendDepth,
        foldTipRightX - (foldTipRightX - foldTipLeftX) * 0.15, foldTipY + bendDepth * 0.1,
        foldTipRightX, foldTipY,
      )
    } else {
      // Almost flat top — just connect fold tips
      ctx.bezierCurveTo(
        foldTipLeftX, foldTipY,
        foldTipRightX, foldTipY,
        foldTipRightX, foldTipY,
      )
    }

    // Right fold going down
    const shoulderRX = cx + halfW * 0.45
    ctx.bezierCurveTo(
      foldTipRightX + halfW * 0.15, lerp(baseY, foldTipY, 0.5),
      shoulderRX, baseY,
      shoulderRX, baseY,
    )

    // Right flat portion
    ctx.lineTo(rightX, baseY)
    ctx.stroke()
  }

  ctx.restore()
}

/** Draw the notochord (small circle below center) */
function drawNotochord(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  showSignal: boolean,
  signalPhase: number,
) {
  // Notochord body
  ctx.save()
  ctx.shadowColor = `${YELLOW}0.35)`
  ctx.shadowBlur = 8

  ctx.fillStyle = `${YELLOW}0.85)`
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = `${YELLOW}0.5)`
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()

  // SHH signal arrows going upward
  if (showSignal) {
    const arrowCount = 3
    for (let i = 0; i < arrowCount; i++) {
      const spread = (i - 1) * radius * 0.7
      const baseYPos = cy - radius - 4
      const animOffset = ((signalPhase * 40) % 20)

      for (let j = 0; j < 3; j++) {
        const dotY = baseYPos - j * 7 - animOffset
        const alpha = Math.max(0, 0.7 - j * 0.2 - (animOffset / 40))
        if (alpha <= 0) continue
        ctx.fillStyle = `${YELLOW}${alpha})`
        ctx.beginPath()
        ctx.arc(cx + spread, dotY, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
}

/** Draw neural crest cells migrating outward */
function drawCrestCells(
  ctx: CanvasRenderingContext2D,
  cx: number,
  originY: number,
  cells: CrestCell[],
  migrationProgress: number, // 0..1
  maxDistance: number,
) {
  for (const cell of cells) {
    const dist = migrationProgress * cell.speed * maxDistance
    const x = cx + cell.side * dist
    const y = originY + cell.offsetY + Math.sin(migrationProgress * Math.PI * 2 + cell.startAngle) * 6
    const alpha = Math.min(1, migrationProgress * 3) * 0.9

    if (alpha <= 0) continue

    // Glow
    ctx.save()
    ctx.shadowColor = `${ROSE}0.4)`
    ctx.shadowBlur = 6
    ctx.fillStyle = `${ROSE}${alpha})`
    ctx.beginPath()
    ctx.arc(x, y, 3.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // Bright core
    ctx.fillStyle = `${ROSE}${alpha * 0.6})`
    ctx.beginPath()
    ctx.arc(x, y, 1.8, 0, Math.PI * 2)
    ctx.fill()
  }
}

/** Draw a label with optional fade */
function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  alpha: number,
  fontSize: number = 12,
  color: string = LABEL_HI,
) {
  if (alpha <= 0.01) return
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.font = `bold ${fontSize}px ${MONO_FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y)
  ctx.restore()
}

/** Draw the progress indicator at the bottom */
function drawProgressBar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  y: number,
  width: number,
  progress: number,
  stageIndex: number,
) {
  const stageNames = ['Placa Neural', 'Sulco Neural', 'Tubo Neural', 'Crista Neural']
  const stageBounds = [0, STAGE_1_END, STAGE_2_END, STAGE_3_END, 1.0]
  const barH = 3

  // Background track
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  const barX = cx - width / 2
  ctx.beginPath()
  ctx.roundRect(barX, y, width, barH, 1.5)
  ctx.fill()

  // Filled portion
  ctx.fillStyle = `${TEAL}0.6)`
  ctx.beginPath()
  ctx.roundRect(barX, y, width * Math.min(progress, 1), barH, 1.5)
  ctx.fill()

  // Stage markers
  for (let i = 0; i < 4; i++) {
    const markerX = barX + stageBounds[i] * width
    const isActive = i === stageIndex
    const dotR = isActive ? 4 : 2.5
    const dotY = y + barH / 2

    ctx.fillStyle = isActive ? `${TEAL}1)` : 'rgba(255,255,255,0.2)'
    ctx.beginPath()
    ctx.arc(markerX, dotY, dotR, 0, Math.PI * 2)
    ctx.fill()

    // Stage label below
    const labelAlpha = isActive ? 0.9 : 0.3
    ctx.fillStyle = `rgba(255,255,255,${labelAlpha})`
    ctx.font = `${isActive ? 'bold ' : ''}9px ${MONO_FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(stageNames[i], markerX + (stageBounds[i + 1] - stageBounds[i]) * width / 2, dotY + 8)
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NeuroTubeSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)
  const startRef  = useRef<number>(0)
  const cellsRef  = useRef<CrestCell[]>(buildCrestCells(14))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cells = cellsRef.current

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

    // ---- Animation ----
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

      // Central coordinates
      const cx = w / 2
      const cy = h * 0.45
      const halfW = Math.min(w * 0.38, 180)
      const notochordY = cy + 55
      const notochordR = 8

      // Determine current stage index
      let stageIndex: number
      if (progress < STAGE_1_END) stageIndex = 0
      else if (progress < STAGE_2_END) stageIndex = 1
      else if (progress < STAGE_3_END) stageIndex = 2
      else stageIndex = 3

      // ---- Clear background ----
      ctx!.clearRect(0, 0, w, h)
      ctx!.fillStyle = BG
      ctx!.fillRect(0, 0, w, h)

      // ================================================================
      //  Stage 1: Neural Plate (0% → 20%)
      // ================================================================
      const s1 = smoothstep(stageProgress(progress, 0, STAGE_1_END))

      // ================================================================
      //  Stage 2: Neural Groove (20% → 45%)
      // ================================================================
      const s2 = smoothstep(stageProgress(progress, STAGE_1_END, STAGE_2_END))

      // ================================================================
      //  Stage 3: Neural Tube Closing (45% → 70%)
      // ================================================================
      const s3 = smoothstep(stageProgress(progress, STAGE_2_END, STAGE_3_END))

      // ================================================================
      //  Stage 4: Neural Crest Migration (70% → 100%)
      // ================================================================
      const s4 = smoothstep(stageProgress(progress, STAGE_3_END, 1.0))

      // ---- Compute morphing parameters ----

      // Bend depth: flat in S1, deepens through S2, max at S2 end, then closes to tube
      let bendDepth: number
      if (progress < STAGE_1_END) {
        bendDepth = 0
      } else if (progress < STAGE_2_END) {
        bendDepth = s2 * 45
      } else {
        bendDepth = lerp(45, 60, s3)
      }

      // Fold height: zero in S1, rises in S2, full in S3+
      let foldHeight: number
      if (progress < STAGE_1_END) {
        foldHeight = s1 * 3
      } else if (progress < STAGE_2_END) {
        foldHeight = lerp(3, 55, s2)
      } else {
        foldHeight = lerp(55, 60, s3)
      }

      // Close fraction: only in S3, goes from 0 to 1
      const closeFrac = progress >= STAGE_2_END ? s3 : 0

      // Tube radius when closed
      const tubeRadius = 18

      // ---- Draw ectoderm / neural structures ----
      const ectodermOpacity = progress < STAGE_1_END
        ? lerp(0.3, 0.9, s1)
        : 0.9

      drawEctoderm(
        ctx!,
        cx,
        cy,
        halfW,
        bendDepth,
        foldHeight,
        closeFrac,
        tubeRadius,
        ectodermOpacity,
      )

      // ---- Notochord (always present) ----
      const showSignal = progress < STAGE_3_END
      drawNotochord(ctx!, cx, notochordY, notochordR, showSignal, progress * 10)

      // ---- Neural Crest Cells (Stage 4) ----
      if (progress >= STAGE_3_END) {
        const migrationOriginY = cy - tubeRadius - 8
        drawCrestCells(ctx!, cx, migrationOriginY, cells, s4, halfW * 1.2)
      }

      // ---- Labels ----

      // Title label: changes per stage
      const labelY = cy - foldHeight - 30

      if (stageIndex === 0) {
        // Placa Neural
        const fadeIn = smoothstep(stageProgress(progress, 0, 0.05))
        const fadeOut = 1 - smoothstep(stageProgress(progress, STAGE_1_END - 0.03, STAGE_1_END))
        drawLabel(ctx!, 'Placa Neural', cx, Math.min(labelY, cy - 28), fadeIn * fadeOut, 14)
      }

      if (stageIndex === 1) {
        const fadeIn = smoothstep(stageProgress(progress, STAGE_1_END, STAGE_1_END + 0.04))
        const fadeOut = 1 - smoothstep(stageProgress(progress, STAGE_2_END - 0.03, STAGE_2_END))
        drawLabel(ctx!, 'Sulco Neural', cx, labelY - 10, fadeIn * fadeOut, 14)
      }

      if (stageIndex === 2) {
        const fadeIn = smoothstep(stageProgress(progress, STAGE_2_END, STAGE_2_END + 0.04))
        const fadeOut = 1 - smoothstep(stageProgress(progress, STAGE_3_END - 0.03, STAGE_3_END))
        drawLabel(ctx!, 'Tubo Neural', cx, cy - tubeRadius - 30, fadeIn * fadeOut, 14)
      }

      if (stageIndex === 3) {
        const fadeIn = smoothstep(stageProgress(progress, STAGE_3_END, STAGE_3_END + 0.05))

        // "SNC" label on the tube
        drawLabel(ctx!, 'SNC', cx, cy - tubeRadius - 2, fadeIn, 11, `${TEAL}0.9)`)

        // "Crista Neural → SNP" label above migrating cells
        const crestLabelY = cy - tubeRadius - 38
        drawLabel(ctx!, 'Crista Neural → SNP', cx, crestLabelY, fadeIn, 12, `${ROSE}0.9)`)
      }

      // Notochord label
      const notoLabelAlpha = progress < STAGE_1_END
        ? smoothstep(stageProgress(progress, 0.03, 0.10))
        : (progress < STAGE_2_END ? 0.7 : 0.4)
      drawLabel(ctx!, 'Notocorda', cx, notochordY + notochordR + 16, notoLabelAlpha, 10, LABEL_DIM)

      // SHH label (arrows description)
      if (showSignal) {
        const shhAlpha = progress < STAGE_1_END
          ? smoothstep(stageProgress(progress, 0.06, 0.12))
          : 0.55
        drawLabel(ctx!, 'SHH ↑', cx, notochordY - notochordR - 20, shhAlpha, 9, `${YELLOW}0.7)`)
      }

      // ---- Progress indicator ----
      const barWidth = Math.min(w * 0.7, 300)
      const barY = h - 35
      drawProgressBar(ctx!, cx, barY, barWidth, progress, stageIndex)

      // ---- Pause prompt ----
      if (progress >= 1) {
        ctx!.fillStyle = 'rgba(255,255,255,0.25)'
        ctx!.font = `11px ${MONO_FONT}`
        ctx!.textAlign = 'center'
        ctx!.textBaseline = 'middle'
        ctx!.fillText('reiniciando...', cx, h - 12)
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
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        touchAction: 'manipulation',
      }}
    />
  )
}
