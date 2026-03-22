'use client'

import { useEffect, useRef, useCallback } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface NeuroAxonTransportSimProps {
  className?: string
}

interface Cargo {
  x: number
  label: string
  color: string
  speed: 'slow' | 'fast'
  size: number
}

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.03)'
const COL_TEXT = 'rgba(255, 255, 255, 0.88)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.38)'
const COL_AXON = 'rgba(255, 255, 255, 0.12)'
const COL_MICROTUBULE = 'rgba(45, 212, 191, 0.35)'
const COL_SLOW = 'rgba(251, 146, 60, 0.85)'
const COL_SLOW_GLOW = 'rgba(251, 146, 60, 0.2)'
const COL_FAST = 'rgba(34, 211, 238, 0.9)'
const COL_FAST_GLOW = 'rgba(34, 211, 238, 0.25)'
const COL_KINESIN = 'rgba(250, 204, 21, 0.7)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

// real values
const SLOW_SPEED = 0.2  // mm/day label
const FAST_SPEED = 400  // mm/day label
const SPEED_RATIO = 160 // fast is 160x faster

/* ─────────────────────── component ─────────────────────── */

export function NeuroAxonTransportSim({ className }: NeuroAxonTransportSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    t: 0,
    lastTimestamp: 0,
    slowCargos: [
      { x: 0.05, label: 'Enzimas', color: COL_SLOW, speed: 'slow' as const, size: 6 },
      { x: 0.25, label: 'Citoesqueleto', color: 'rgba(244, 63, 94, 0.8)', speed: 'slow' as const, size: 7 },
      { x: 0.55, label: 'Proteínas', color: 'rgba(167, 139, 250, 0.8)', speed: 'slow' as const, size: 5 },
    ] as Cargo[],
    fastCargos: [
      { x: 0.02, label: 'Mitocôndria', color: COL_FAST, speed: 'fast' as const, size: 9 },
      { x: 0.15, label: 'Vesícula', color: 'rgba(45, 212, 191, 0.85)', speed: 'fast' as const, size: 6 },
      { x: 0.40, label: 'Organela', color: 'rgba(250, 204, 21, 0.85)', speed: 'fast' as const, size: 7 },
      { x: 0.65, label: 'Vesícula', color: 'rgba(45, 212, 191, 0.85)', speed: 'fast' as const, size: 5 },
    ] as Cargo[],
    elapsed: 0,
    slowDistance: 0,
    fastDistance: 0,
  })

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const st = stateRef.current
    const scale = Math.min(w / 700, h / 400)

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

    const margin = 60 * scale
    const trackLeft = margin
    const trackRight = w - margin
    const trackW = trackRight - trackLeft

    const slowY = h * 0.32
    const fastY = h * 0.68
    const trackH = 24 * scale

    // ── speed labels
    const fontSize = Math.max(9, 11 * scale)
    ctx.font = `700 ${fontSize}px ${FONT_MONO}`
    ctx.textAlign = 'left'

    // slow track header
    ctx.fillStyle = COL_SLOW
    ctx.fillText('🐌 TRANSPORTE LENTO', trackLeft, slowY - trackH - 12 * scale)
    ctx.font = `500 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText(`${SLOW_SPEED}–2,5 mm/dia  •  Fluxo axoplasmático`, trackLeft, slowY - trackH + 2 * scale)

    // fast track header
    ctx.font = `700 ${fontSize}px ${FONT_MONO}`
    ctx.fillStyle = COL_FAST
    ctx.fillText('⚡ TRANSPORTE RÁPIDO', trackLeft, fastY - trackH - 12 * scale)
    ctx.font = `500 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText(`até ${FAST_SPEED} mm/dia  •  Via microtúbulos  •  ${SPEED_RATIO}x mais rápido`, trackLeft, fastY - trackH + 2 * scale)

    // ── draw tracks
    const drawTrack = (y: number, isFast: boolean) => {
      // axon body
      ctx.beginPath()
      ctx.roundRect(trackLeft, y - trackH / 2, trackW, trackH, trackH / 2)
      ctx.fillStyle = COL_AXON
      ctx.fill()

      // microtubules inside (only for fast track)
      if (isFast) {
        const mtCount = 3
        for (let i = 0; i < mtCount; i++) {
          const my = y - trackH / 2 + 5 + (i / (mtCount - 1)) * (trackH - 10)
          ctx.beginPath()
          ctx.moveTo(trackLeft + 10, my)
          ctx.lineTo(trackRight - 10, my)
          ctx.strokeStyle = COL_MICROTUBULE
          ctx.lineWidth = 1.5
          ctx.setLineDash([6, 4])
          ctx.stroke()
          ctx.setLineDash([])
        }
      }

      // soma marker
      ctx.beginPath()
      ctx.arc(trackLeft, y, 8 * scale, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(45, 212, 191, 0.15)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.5)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.font = `600 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = COL_TEXT_DIM
      ctx.fillText('SOMA', trackLeft, y + 22 * scale)

      // terminal marker
      ctx.beginPath()
      ctx.arc(trackRight, y, 6 * scale, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(244, 63, 94, 0.15)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.fillStyle = COL_TEXT_DIM
      ctx.fillText('TERMINAL', trackRight, y + 22 * scale)

      // direction arrow
      ctx.beginPath()
      const arrowX = trackLeft + trackW * 0.5
      ctx.moveTo(arrowX - 15, y)
      ctx.lineTo(arrowX + 15, y)
      ctx.lineTo(arrowX + 10, y - 4)
      ctx.moveTo(arrowX + 15, y)
      ctx.lineTo(arrowX + 10, y + 4)
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    drawTrack(slowY, false)
    drawTrack(fastY, true)

    // ── animate cargos
    const slowRate = 0.0004 // normalized speed per frame
    const fastRate = slowRate * 12 // visually 12x faster (compressed from 160x for visual clarity)

    const drawCargo = (cargo: Cargo, y: number, rate: number) => {
      cargo.x += rate
      if (cargo.x > 1.1) cargo.x = -0.1

      if (cargo.x < 0 || cargo.x > 1) return

      const cx = trackLeft + cargo.x * trackW
      const isFast = cargo.speed === 'fast'

      // glow trail
      const trailLen = isFast ? 30 * scale : 8 * scale
      const grad = ctx.createLinearGradient(cx - trailLen, y, cx, y)
      grad.addColorStop(0, 'transparent')
      grad.addColorStop(1, isFast ? COL_FAST_GLOW : COL_SLOW_GLOW)
      ctx.fillStyle = grad
      ctx.fillRect(cx - trailLen, y - cargo.size * 1.5, trailLen, cargo.size * 3)

      // kinesin legs (fast transport only)
      if (isFast) {
        const legPhase = st.t * 8 + cargo.x * 20
        const legY = y + trackH * 0.15
        // two "walking" legs
        for (let leg = 0; leg < 2; leg++) {
          const lx = cx - 3 + leg * 6
          const stepOff = Math.sin(legPhase + leg * Math.PI) * 3
          ctx.beginPath()
          ctx.moveTo(lx, y - cargo.size)
          ctx.lineTo(lx + stepOff, legY)
          ctx.strokeStyle = COL_KINESIN
          ctx.lineWidth = 1.5
          ctx.stroke()
          // foot
          ctx.beginPath()
          ctx.arc(lx + stepOff, legY, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = COL_KINESIN
          ctx.fill()
        }
      }

      // cargo body
      if (cargo.label === 'Mitocôndria') {
        // elongated
        ctx.beginPath()
        ctx.ellipse(cx, y - 2, cargo.size * 1.3, cargo.size * 0.7, 0, 0, Math.PI * 2)
        ctx.fillStyle = cargo.color.replace('0.85', '0.25').replace('0.8', '0.25')
        ctx.fill()
        ctx.strokeStyle = cargo.color
        ctx.lineWidth = 1.5
        ctx.stroke()
        // cristae
        for (let ci = 0; ci < 3; ci++) {
          ctx.beginPath()
          ctx.moveTo(cx - 5 + ci * 4, y - cargo.size * 0.5)
          ctx.lineTo(cx - 5 + ci * 4, y + cargo.size * 0.3)
          ctx.strokeStyle = cargo.color.replace('0.85', '0.3').replace('0.8', '0.3')
          ctx.lineWidth = 0.7
          ctx.stroke()
        }
      } else if (cargo.label === 'Vesícula') {
        ctx.beginPath()
        ctx.arc(cx, y - 2, cargo.size, 0, Math.PI * 2)
        ctx.fillStyle = cargo.color.replace('0.85', '0.2')
        ctx.fill()
        ctx.strokeStyle = cargo.color
        ctx.lineWidth = 1.5
        ctx.stroke()
        // dots inside
        for (let d = 0; d < 3; d++) {
          const da = (d / 3) * Math.PI * 2 + st.t
          ctx.beginPath()
          ctx.arc(cx + Math.cos(da) * 2.5, y - 2 + Math.sin(da) * 2.5, 1, 0, Math.PI * 2)
          ctx.fillStyle = cargo.color
          ctx.fill()
        }
      } else {
        // generic blob
        ctx.beginPath()
        ctx.arc(cx, y - 2, cargo.size, 0, Math.PI * 2)
        ctx.fillStyle = cargo.color.replace('0.8', '0.2').replace('0.85', '0.2')
        ctx.fill()
        ctx.strokeStyle = cargo.color
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // cargo label
      ctx.font = `500 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = cargo.color
      ctx.fillText(cargo.label, cx, y - cargo.size - 6)
    }

    for (const c of st.slowCargos) drawCargo(c, slowY, slowRate)
    for (const c of st.fastCargos) drawCargo(c, fastY, fastRate)

    // ── distance comparison bar
    st.elapsed += 1 / FPS
    st.slowDistance = st.elapsed * SLOW_SPEED / 86400 * 1000 // µm
    st.fastDistance = st.elapsed * FAST_SPEED / 86400 * 1000

    const barY = h - 35 * scale
    const barH = 6 * scale
    const maxBar = trackW * 0.6
    const barLeft = trackLeft

    // normalize to fast distance
    const fastFill = Math.min(1, (st.fastDistance % 500) / 500)
    const slowFill = fastFill / SPEED_RATIO

    ctx.font = `600 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'left'

    // slow bar
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    ctx.fillRect(barLeft, barY, maxBar, barH)
    ctx.fillStyle = COL_SLOW
    ctx.fillRect(barLeft, barY, Math.max(2, maxBar * slowFill), barH)
    ctx.fillStyle = COL_SLOW
    ctx.fillText(`Lento: ${SLOW_SPEED} mm/dia`, barLeft + maxBar + 10, barY + barH)

    // fast bar
    const fBarY = barY - 14 * scale
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    ctx.fillRect(barLeft, fBarY, maxBar, barH)
    ctx.fillStyle = COL_FAST
    ctx.fillRect(barLeft, fBarY, Math.max(2, maxBar * fastFill), barH)
    ctx.fillStyle = COL_FAST
    ctx.fillText(`Rápido: ${FAST_SPEED} mm/dia`, barLeft + maxBar + 10, fBarY + barH)

    // ratio
    ctx.font = `700 ${Math.max(10, 12 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'right'
    ctx.fillStyle = 'rgba(250, 204, 21, 0.7)'
    ctx.fillText(`${SPEED_RATIO}x`, w - 15, barY + barH)

    // HUD
    ctx.font = `600 ${Math.max(9, 10 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('AXON.TRANSPORT', 12, 20)
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
      st.t += 0.04

      const dpr = window.devicePixelRatio || 1
      const rect = cvs.getBoundingClientRect()
      const cw = rect.width * dpr
      const ch = rect.height * dpr
      if (cvs.width !== cw || cvs.height !== ch) {
        cvs.width = cw
        cvs.height = ch
      }
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
