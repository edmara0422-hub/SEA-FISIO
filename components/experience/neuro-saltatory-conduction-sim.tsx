'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface NeuroSaltatorySimProps {
  className?: string
}

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.03)'
const COL_TEXT = 'rgba(255, 255, 255, 0.88)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.38)'
const COL_AXON = 'rgba(255, 255, 255, 0.15)'
const COL_AXON_ACTIVE = 'rgba(250, 204, 21, 0.6)'
const COL_MYELIN = 'rgba(45, 212, 191, 0.3)'
const COL_MYELIN_STROKE = 'rgba(45, 212, 191, 0.5)'
const COL_NODE = 'rgba(250, 204, 21, 0.8)'
const COL_NODE_GLOW = 'rgba(250, 204, 21, 0.3)'
const COL_SIGNAL_UNMYEL = 'rgba(244, 63, 94, 0.85)'
const COL_SIGNAL_UNMYEL_GLOW = 'rgba(244, 63, 94, 0.2)'
const COL_ION_NA = 'rgba(244, 63, 94, 0.8)'
const COL_ION_K = 'rgba(34, 211, 238, 0.8)'
const COL_VOLTAGE = 'rgba(250, 204, 21, 0.85)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

// physiology constants
const MYELINATED_SPEED = 120    // m/s
const UNMYELINATED_SPEED = 2    // m/s
const SPEED_RATIO = 60          // ≈60x faster

/* ─────────────────────── helpers ─────────────────────── */

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/* ─────────────────────── component ─────────────────────── */

export function NeuroSaltatoryConductionSim({ className }: NeuroSaltatorySimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<'saltatory' | 'continuous' | 'both'>('both')
  const stateRef = useRef({
    t: 0,
    lastTimestamp: 0,
    saltatoryPos: -0.05,  // 0→1
    continuousPos: -0.05,
    activeNode: -1,
    voltageHistory: [] as { pos: number; v: number }[],
  })

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const st = stateRef.current
    const scale = Math.min(w / 700, h / 450)

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

    const margin = 55 * scale
    const trackLeft = margin
    const trackRight = w - margin
    const trackW = trackRight - trackLeft

    const showSaltatory = mode === 'saltatory' || mode === 'both'
    const showContinuous = mode === 'continuous' || mode === 'both'

    const saltatoryY = mode === 'both' ? h * 0.30 : h * 0.45
    const continuousY = mode === 'both' ? h * 0.65 : h * 0.45
    const trackH = 16 * scale

    // ── SALTATORY (myelinated) ──
    if (showSaltatory) {
      // header
      ctx.font = `700 ${Math.max(9, 11 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'left'
      ctx.fillStyle = COL_NODE
      ctx.fillText('CONDUÇÃO SALTATÓRIA', trackLeft, saltatoryY - trackH - 18 * scale)
      ctx.font = `500 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
      ctx.fillStyle = COL_TEXT_DIM
      ctx.fillText(`Fibra mielinizada  •  ${MYELINATED_SPEED} m/s`, trackLeft, saltatoryY - trackH - 4 * scale)

      // axon body
      ctx.beginPath()
      ctx.roundRect(trackLeft, saltatoryY - trackH / 2, trackW, trackH, trackH / 2)
      ctx.fillStyle = COL_AXON
      ctx.fill()

      // myelin sheaths and nodes
      const nodeCount = 7
      const sheathW = trackW / (nodeCount * 2 + 1) * 1.7
      const gapW = (trackW - nodeCount * sheathW) / (nodeCount + 1)
      const sheathH = trackH * 1.6

      const nodePositions: number[] = []

      for (let i = 0; i < nodeCount; i++) {
        const sx = trackLeft + gapW + i * (sheathW + gapW)

        // myelin sheath
        ctx.beginPath()
        ctx.roundRect(sx, saltatoryY - sheathH / 2, sheathW, sheathH, 8 * scale)
        ctx.fillStyle = COL_MYELIN
        ctx.fill()
        ctx.strokeStyle = COL_MYELIN_STROKE
        ctx.lineWidth = 1
        ctx.stroke()

        // wrap layers
        ctx.globalAlpha = 0.2
        for (let l = 0; l < 3; l++) {
          const ly = saltatoryY - sheathH / 2 + 3 + l * (sheathH - 6) / 3
          ctx.beginPath()
          ctx.moveTo(sx + 3, ly)
          ctx.lineTo(sx + sheathW - 3, ly)
          ctx.strokeStyle = COL_MYELIN_STROKE
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
        ctx.globalAlpha = 1

        // node of Ranvier
        if (i < nodeCount - 1) {
          const nx = sx + sheathW + gapW / 2
          nodePositions.push((nx - trackLeft) / trackW) // normalized

          // ion channels at node
          const nodeActive = Math.abs(st.saltatoryPos - (nx - trackLeft) / trackW) < 0.04

          if (nodeActive) {
            // glow
            const grad = ctx.createRadialGradient(nx, saltatoryY, 0, nx, saltatoryY, 25 * scale)
            grad.addColorStop(0, COL_NODE_GLOW)
            grad.addColorStop(1, 'transparent')
            ctx.fillStyle = grad
            ctx.fillRect(nx - 30 * scale, saltatoryY - 30 * scale, 60 * scale, 60 * scale)

            // Na+ rushing in
            for (let ion = 0; ion < 3; ion++) {
              const iy = saltatoryY - sheathH / 2 - 5 - ion * 6
              const ix = nx + Math.sin(st.t * 5 + ion) * 3
              ctx.beginPath()
              ctx.arc(ix, iy + Math.sin(st.t * 8 + ion) * 3, 2.5, 0, Math.PI * 2)
              ctx.fillStyle = COL_ION_NA
              ctx.fill()
            }
            // Na+ label
            ctx.font = `600 ${Math.max(6, 7 * scale)}px ${FONT_MONO}`
            ctx.textAlign = 'center'
            ctx.fillStyle = COL_ION_NA
            ctx.fillText('Na⁺↓', nx, saltatoryY - sheathH / 2 - 22)

            // K+ going out
            for (let ion = 0; ion < 2; ion++) {
              const iy = saltatoryY + sheathH / 2 + 5 + ion * 6
              const ix = nx + Math.sin(st.t * 5 + ion + 1) * 3
              ctx.beginPath()
              ctx.arc(ix, iy - Math.sin(st.t * 8 + ion) * 3, 2, 0, Math.PI * 2)
              ctx.fillStyle = COL_ION_K
              ctx.fill()
            }
            ctx.fillStyle = COL_ION_K
            ctx.fillText('K⁺↑', nx, saltatoryY + sheathH / 2 + 26)
          }

          // node dot
          ctx.beginPath()
          ctx.arc(nx, saltatoryY, 3 * scale, 0, Math.PI * 2)
          ctx.fillStyle = nodeActive ? COL_NODE : 'rgba(250, 204, 21, 0.4)'
          ctx.fill()
        }
      }

      // saltatory signal - JUMPS between nodes
      st.saltatoryPos += 0.012
      if (st.saltatoryPos > 1.1) st.saltatoryPos = -0.1

      if (st.saltatoryPos >= 0 && st.saltatoryPos <= 1) {
        // find nearest node ahead and behind to show "jump" arcs
        const sigX = trackLeft + st.saltatoryPos * trackW

        // signal dot
        ctx.beginPath()
        ctx.arc(sigX, saltatoryY, 5 * scale, 0, Math.PI * 2)
        ctx.fillStyle = COL_VOLTAGE
        ctx.fill()

        // jump arc visualization
        for (let i = 0; i < nodePositions.length - 1; i++) {
          const n1x = trackLeft + nodePositions[i] * trackW
          const n2x = trackLeft + nodePositions[i + 1] * trackW
          const midNorm = (nodePositions[i] + nodePositions[i + 1]) / 2

          if (Math.abs(st.saltatoryPos - midNorm) < 0.08) {
            ctx.beginPath()
            ctx.moveTo(n1x, saltatoryY)
            ctx.quadraticCurveTo((n1x + n2x) / 2, saltatoryY - 25 * scale, n2x, saltatoryY)
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.3)'
            ctx.lineWidth = 1.5
            ctx.setLineDash([3, 3])
            ctx.stroke()
            ctx.setLineDash([])
          }
        }
      }

      // "saltos" label
      ctx.font = `500 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(250, 204, 21, 0.4)'
      ctx.fillText('↗ salta entre nós de Ranvier ↗', trackLeft + trackW / 2, saltatoryY + sheathH / 2 + 35 * scale)
    }

    // ── CONTINUOUS (unmyelinated) ──
    if (showContinuous) {
      ctx.font = `700 ${Math.max(9, 11 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'left'
      ctx.fillStyle = COL_SIGNAL_UNMYEL
      ctx.fillText('CONDUÇÃO CONTÍNUA', trackLeft, continuousY - trackH - 18 * scale)
      ctx.font = `500 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
      ctx.fillStyle = COL_TEXT_DIM
      ctx.fillText(`Fibra não-mielinizada  •  ${UNMYELINATED_SPEED} m/s`, trackLeft, continuousY - trackH - 4 * scale)

      // bare axon
      ctx.beginPath()
      ctx.roundRect(trackLeft, continuousY - trackH / 2, trackW, trackH, trackH / 2)
      ctx.fillStyle = COL_AXON
      ctx.fill()

      // ion channels distributed along
      const chanCount = 25
      for (let i = 0; i < chanCount; i++) {
        const cx = trackLeft + (i / (chanCount - 1)) * trackW
        const chanNorm = i / (chanCount - 1)
        const isActive = Math.abs(st.continuousPos - chanNorm) < 0.03

        ctx.beginPath()
        ctx.rect(cx - 1.5, continuousY - trackH / 2 - 2, 3, trackH + 4)
        ctx.fillStyle = isActive ? 'rgba(244, 63, 94, 0.5)' : 'rgba(255,255,255,0.06)'
        ctx.fill()

        if (isActive) {
          // ions
          ctx.beginPath()
          ctx.arc(cx, continuousY - trackH / 2 - 6, 1.8, 0, Math.PI * 2)
          ctx.fillStyle = COL_ION_NA
          ctx.fill()
        }
      }

      // continuous signal - moves slowly
      st.continuousPos += 0.002 // much slower
      if (st.continuousPos > 1.1) st.continuousPos = -0.1

      if (st.continuousPos >= 0 && st.continuousPos <= 1) {
        const sigX = trackLeft + st.continuousPos * trackW

        // depolarization wave
        const waveLen = 40 * scale
        const grad = ctx.createLinearGradient(sigX - waveLen, continuousY, sigX, continuousY)
        grad.addColorStop(0, 'transparent')
        grad.addColorStop(0.5, COL_SIGNAL_UNMYEL_GLOW)
        grad.addColorStop(1, COL_SIGNAL_UNMYEL)
        ctx.fillStyle = grad
        ctx.fillRect(sigX - waveLen, continuousY - trackH, waveLen, trackH * 2)

        // signal dot
        ctx.beginPath()
        ctx.arc(sigX, continuousY, 4 * scale, 0, Math.PI * 2)
        ctx.fillStyle = COL_SIGNAL_UNMYEL
        ctx.fill()
      }

      ctx.font = `500 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(244, 63, 94, 0.4)'
      ctx.fillText('→ propagação ponto a ponto →', trackLeft + trackW / 2, continuousY + trackH + 25 * scale)
    }

    // ── speed comparison (both mode)
    if (mode === 'both') {
      const compY = h - 30 * scale
      ctx.font = `700 ${Math.max(10, 12 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'center'

      // speed bars
      const barW = 120 * scale
      const barH = 6 * scale

      // myelinated
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      ctx.fillRect(w / 2 - barW - 20, compY - barH, barW, barH)
      ctx.fillStyle = COL_NODE
      ctx.fillRect(w / 2 - barW - 20, compY - barH, barW, barH)
      ctx.fillStyle = COL_NODE
      ctx.textAlign = 'right'
      ctx.font = `600 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
      ctx.fillText(`${MYELINATED_SPEED} m/s`, w / 2 - barW - 25, compY)

      // unmyelinated
      const slowBarW = barW * (UNMYELINATED_SPEED / MYELINATED_SPEED)
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      ctx.fillRect(w / 2 + 20, compY - barH, barW, barH)
      ctx.fillStyle = COL_SIGNAL_UNMYEL
      ctx.fillRect(w / 2 + 20, compY - barH, Math.max(3, slowBarW), barH)
      ctx.textAlign = 'left'
      ctx.fillStyle = COL_SIGNAL_UNMYEL
      ctx.fillText(`${UNMYELINATED_SPEED} m/s`, w / 2 + barW + 25, compY)

      // ratio
      ctx.font = `800 ${Math.max(11, 14 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(45, 212, 191, 0.7)'
      ctx.fillText(`${SPEED_RATIO}×`, w / 2, compY + 2)
    }

    // ── mini voltage graph
    const graphW = 100 * scale
    const graphH = 40 * scale
    const graphX = w - graphW - 15
    const graphY = 35

    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 0.5
    ctx.strokeRect(graphX, graphY, graphW, graphH)

    // voltage curve
    ctx.beginPath()
    const vPoints = 30
    for (let i = 0; i <= vPoints; i++) {
      const vx = graphX + (i / vPoints) * graphW
      const phase = (i / vPoints) * Math.PI * 2 + st.t * 2
      // action potential waveform
      let v = 0
      const p = ((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
      if (p < 0.3) v = 0
      else if (p < 0.8) v = Math.sin((p - 0.3) / 0.5 * Math.PI) * 1 // depolarization
      else if (p < 1.3) v = Math.cos((p - 0.8) / 0.5 * Math.PI * 0.5) * 0.8 // repolarization
      else if (p < 2.0) v = -0.2 * Math.sin((p - 1.3) / 0.7 * Math.PI) // hyperpolarization
      else v = 0

      const vy = graphY + graphH / 2 - v * graphH * 0.4
      if (i === 0) ctx.moveTo(vx, vy)
      else ctx.lineTo(vx, vy)
    }
    ctx.strokeStyle = COL_VOLTAGE
    ctx.lineWidth = 1.5
    ctx.stroke()

    // graph labels
    ctx.font = `500 ${Math.max(6, 7 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('+40mV', graphX + 2, graphY + 8)
    ctx.fillText('-70mV', graphX + 2, graphY + graphH - 2)

    // HUD
    ctx.font = `600 ${Math.max(9, 10 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('SALTATORY.CONDUCTION', 12, 20)
    ctx.fillStyle = 'rgba(45, 212, 191, 0.5)'
    ctx.fillText(`▸ ${mode === 'both' ? 'COMPARAÇÃO' : mode === 'saltatory' ? 'SALTATÓRIA' : 'CONTÍNUA'}`, 12, 34)
  }, [mode])

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
      {/* mode toggle */}
      <div className="absolute top-3 right-3 flex gap-1">
        {(['both', 'saltatory', 'continuous'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-wider transition-all ${
              mode === m
                ? 'bg-white/10 text-white/80 border border-white/20'
                : 'text-white/30 hover:text-white/50 border border-transparent'
            }`}
          >
            {m === 'both' ? 'Ambos' : m === 'saltatory' ? 'Saltatória' : 'Contínua'}
          </button>
        ))}
      </div>
    </div>
  )
}
