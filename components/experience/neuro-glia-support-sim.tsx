'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface NeuroGliaSupportSimProps {
  className?: string
}

type SupportMode = 'all' | 'astrocyte' | 'oligo' | 'microglia'

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.03)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.38)'
const COL_NEURON = 'rgba(255, 255, 255, 0.5)'
const COL_NEURON_FILL = 'rgba(255, 255, 255, 0.05)'
const COL_ASTRO = 'rgba(45, 212, 191, 0.85)'
const COL_OLIGO = 'rgba(250, 204, 21, 0.85)'
const COL_MICRO = 'rgba(244, 63, 94, 0.85)'
const COL_CAPILLARY = 'rgba(244, 63, 94, 0.3)'
const COL_LACTATE = 'rgba(45, 212, 191, 0.7)'
const COL_GLUTAMATE = 'rgba(167, 139, 250, 0.7)'
const COL_K = 'rgba(34, 211, 238, 0.7)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

/* ─────────────────────── helpers ─────────────────────── */

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/* ─────────────────────── component ─────────────────────── */

export function NeuroGliaSupportSim({ className }: NeuroGliaSupportSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<SupportMode>('all')
  const stateRef = useRef({ t: 0, lastTimestamp: 0 })

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
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

    // central neuron
    const neuronX = w * 0.5
    const neuronY = h * 0.45
    const neuronR = 22 * scale
    const showAstro = mode === 'all' || mode === 'astrocyte'
    const showOligo = mode === 'all' || mode === 'oligo'
    const showMicro = mode === 'all' || mode === 'microglia'

    // ── capillary (blood vessel - top right)
    const capX = w * 0.78
    const capY1 = 20
    const capY2 = h * 0.6
    const capW = 18 * scale

    ctx.beginPath()
    ctx.moveTo(capX - capW / 2, capY1)
    ctx.bezierCurveTo(capX - capW / 2 - 10, h * 0.3, capX - capW / 2 + 5, h * 0.5, capX - capW / 2, capY2)
    ctx.lineTo(capX + capW / 2, capY2)
    ctx.bezierCurveTo(capX + capW / 2 + 5, h * 0.5, capX + capW / 2 - 10, h * 0.3, capX + capW / 2, capY1)
    ctx.closePath()
    ctx.fillStyle = 'rgba(244, 63, 94, 0.06)'
    ctx.fill()
    ctx.strokeStyle = COL_CAPILLARY
    ctx.lineWidth = 1.5
    ctx.stroke()

    // red blood cells flowing
    for (let rbc = 0; rbc < 4; rbc++) {
      const rbcPhase = ((st.t * 0.5 + rbc * 0.25) % 1)
      const rbcY = lerp(capY1 + 15, capY2 - 15, rbcPhase)
      ctx.beginPath()
      ctx.ellipse(capX, rbcY, 5, 3, Math.sin(st.t + rbc) * 0.3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(244, 63, 94, 0.4)'
      ctx.fill()
    }

    ctx.font = `600 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = COL_CAPILLARY
    ctx.fillText('CAPILAR', capX, capY2 + 14)

    // ── axon extending from neuron
    const axonStartX = neuronX + neuronR
    const axonEndX = w * 0.88
    const axonY = neuronY + 5

    ctx.beginPath()
    ctx.moveTo(axonStartX, axonY)
    ctx.lineTo(axonEndX, axonY)
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 2.5
    ctx.stroke()

    // ── dendrites from neuron (left)
    const dendAngles = [-2.5, -2.9, -3.3, -3.7]
    for (const a of dendAngles) {
      const len = 50 * scale
      ctx.beginPath()
      ctx.moveTo(neuronX + Math.cos(a) * neuronR, neuronY + Math.sin(a) * neuronR)
      ctx.lineTo(neuronX + Math.cos(a) * len, neuronY + Math.sin(a) * len)
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    // ═══════════════════ ASTROCYTE SUPPORT ═══════════════════
    if (showAstro) {
      const astroX = w * 0.55
      const astroY = h * 0.25
      const astroR = 16 * scale

      // astrocyte body
      ctx.beginPath()
      ctx.arc(astroX, astroY, astroR, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(45, 212, 191, 0.12)'
      ctx.fill()
      ctx.strokeStyle = COL_ASTRO
      ctx.lineWidth = 1.5
      ctx.stroke()

      // processes radiating
      const armCount = 6
      for (let i = 0; i < armCount; i++) {
        const a = (i / armCount) * Math.PI * 2 + st.t * 0.05
        const len = astroR * 2.5
        const ex = astroX + Math.cos(a) * len
        const ey = astroY + Math.sin(a) * len

        ctx.beginPath()
        ctx.moveTo(astroX + Math.cos(a) * astroR, astroY + Math.sin(a) * astroR)
        const mx = astroX + Math.cos(a + 0.2) * len * 0.5
        const my = astroY + Math.sin(a + 0.2) * len * 0.5
        ctx.quadraticCurveTo(mx, my, ex, ey)
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)'
        ctx.lineWidth = 1.2
        ctx.stroke()

        // end foot
        ctx.beginPath()
        ctx.arc(ex, ey, 3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(45, 212, 191, 0.5)'
        ctx.fill()
      }

      // end foot on capillary
      const footX = capX - capW / 2 - 5
      const footY = h * 0.28
      ctx.beginPath()
      ctx.moveTo(astroX + astroR, astroY)
      ctx.bezierCurveTo(astroX + 40 * scale, astroY, footX, footY - 20, footX, footY)
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.5)'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(footX, footY, 5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(45, 212, 191, 0.4)'
      ctx.fill()

      // end foot on neuron
      ctx.beginPath()
      ctx.moveTo(astroX, astroY + astroR)
      ctx.bezierCurveTo(astroX, astroY + 30 * scale, neuronX + 10, neuronY - neuronR - 10, neuronX + 10, neuronY - neuronR)
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.5)'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(neuronX + 10, neuronY - neuronR, 4, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(45, 212, 191, 0.4)'
      ctx.fill()

      // animated particles: lactate from capillary → astrocyte → neuron
      const lacPhase1 = (st.t * 0.4) % 1
      const lacX1 = lerp(footX, astroX, lacPhase1)
      const lacY1 = lerp(footY, astroY, lacPhase1)
      ctx.beginPath()
      ctx.arc(lacX1, lacY1, 3, 0, Math.PI * 2)
      ctx.fillStyle = COL_LACTATE
      ctx.fill()

      const lacPhase2 = (st.t * 0.4 + 0.3) % 1
      const lacX2 = lerp(astroX, neuronX + 10, lacPhase2)
      const lacY2 = lerp(astroY, neuronY - neuronR, lacPhase2)
      ctx.beginPath()
      ctx.arc(lacX2, lacY2, 3, 0, Math.PI * 2)
      ctx.fillStyle = COL_LACTATE
      ctx.fill()

      // K⁺ uptake particle near neuron
      const kPhase = (st.t * 0.6) % 1
      const kStartX = neuronX + 15
      const kStartY = neuronY - neuronR + 5
      const kX = lerp(kStartX, astroX - 5, kPhase)
      const kY = lerp(kStartY, astroY + 10, kPhase)
      ctx.beginPath()
      ctx.arc(kX, kY, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = COL_K
      ctx.fill()

      // glutamate uptake
      const glPhase = (st.t * 0.5 + 0.5) % 1
      const glX = lerp(neuronX - 5, astroX - 10, glPhase)
      const glY = lerp(neuronY - neuronR - 5, astroY + 5, glPhase)
      ctx.beginPath()
      ctx.arc(glX, glY, 2, 0, Math.PI * 2)
      ctx.fillStyle = COL_GLUTAMATE
      ctx.fill()

      // labels
      ctx.font = `700 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = COL_ASTRO
      ctx.fillText('ASTRÓCITO', astroX, astroY - astroR - 8)

      // function labels
      ctx.font = `500 ${Math.max(6, 7 * scale)}px ${FONT_MONO}`
      ctx.fillStyle = COL_LACTATE
      ctx.fillText('Lactato →', (footX + astroX) / 2, (footY + astroY) / 2 - 8)
      ctx.fillStyle = COL_K
      ctx.fillText('← K⁺', kStartX + 20, kStartY - 8)
      ctx.fillStyle = COL_GLUTAMATE
      ctx.fillText('← Glutamato', neuronX - 15, neuronY - neuronR - 18)
    }

    // ═══════════════════ OLIGODENDROCYTE SUPPORT ═══════════════════
    if (showOligo) {
      const oligoX = w * 0.65
      const oligoY = neuronY + 40 * scale
      const oligoR = 12 * scale

      // myelin wraps on axon
      const sheathCount = 4
      const totalAxonLen = axonEndX - axonStartX
      const sheathW = totalAxonLen / (sheathCount * 2)
      for (let i = 0; i < sheathCount; i++) {
        const sx = axonStartX + 10 + i * sheathW * 2
        ctx.beginPath()
        ctx.roundRect(sx, axonY - 8, sheathW, 16, 6)
        ctx.fillStyle = 'rgba(250, 204, 21, 0.1)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)'
        ctx.lineWidth = 1
        ctx.stroke()

        // wrap lines
        ctx.globalAlpha = 0.2
        for (let l = 0; l < 2; l++) {
          ctx.beginPath()
          ctx.moveTo(sx + 3, axonY - 4 + l * 8)
          ctx.lineTo(sx + sheathW - 3, axonY - 4 + l * 8)
          ctx.strokeStyle = COL_OLIGO
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
        ctx.globalAlpha = 1

        // process connecting oligo to sheath
        if (i === 1 || i === 2) {
          ctx.beginPath()
          ctx.moveTo(oligoX, oligoY - oligoR)
          ctx.lineTo(sx + sheathW / 2, axonY + 8)
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.3)'
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // signal jumping (saltatory)
      const sigPhase = (st.t * 0.8) % 1
      const sigX = lerp(axonStartX, axonEndX, sigPhase)
      const grad = ctx.createRadialGradient(sigX, axonY, 0, sigX, axonY, 10)
      grad.addColorStop(0, 'rgba(250, 204, 21, 0.4)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(sigX - 12, axonY - 12, 24, 24)
      ctx.beginPath()
      ctx.arc(sigX, axonY, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(250, 204, 21, 0.9)'
      ctx.fill()

      // oligo body
      ctx.beginPath()
      ctx.arc(oligoX, oligoY, oligoR, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(250, 204, 21, 0.12)'
      ctx.fill()
      ctx.strokeStyle = COL_OLIGO
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.font = `700 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = COL_OLIGO
      ctx.fillText('OLIGODENDRÓCITO', oligoX, oligoY + oligoR + 14)

      ctx.font = `500 ${Math.max(6, 7 * scale)}px ${FONT_MONO}`
      ctx.fillStyle = 'rgba(250, 204, 21, 0.5)'
      ctx.fillText('Mielinização → Condução saltatória', (axonStartX + axonEndX) / 2, axonY + 22)
    }

    // ═══════════════════ MICROGLIA SUPPORT ═══════════════════
    if (showMicro) {
      const microX = w * 0.28
      const microY = h * 0.7
      const microR = 14 * scale

      // amoeboid body
      ctx.beginPath()
      const points2 = 10
      for (let i = 0; i <= points2; i++) {
        const a = (i / points2) * Math.PI * 2
        const pr = microR * (1 + 0.3 * Math.sin(a * 3 + st.t * 2))
        const px = microX + Math.cos(a) * pr
        const py = microY + Math.sin(a) * pr
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fillStyle = 'rgba(244, 63, 94, 0.1)'
      ctx.fill()
      ctx.strokeStyle = COL_MICRO
      ctx.lineWidth = 1.5
      ctx.stroke()

      // phagocytic processes
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + st.t * 0.3
        const len = microR * (1.5 + Math.sin(st.t + i) * 0.3)
        ctx.beginPath()
        ctx.moveTo(microX + Math.cos(a) * microR, microY + Math.sin(a) * microR)
        const ex = microX + Math.cos(a) * len
        const ey = microY + Math.sin(a) * len
        ctx.lineTo(ex, ey)
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // debris particles being engulfed
      for (let d = 0; d < 3; d++) {
        const dPhase = (st.t * 0.3 + d * 0.33) % 1
        const dAngle = (d / 3) * Math.PI * 2 + 0.5
        const dDist = lerp(microR * 3, microR * 0.3, dPhase)
        const dx = microX + Math.cos(dAngle) * dDist
        const dy = microY + Math.sin(dAngle) * dDist
        const dSize = lerp(4, 1, dPhase)

        ctx.beginPath()
        ctx.arc(dx, dy, dSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.15 * (1 - dPhase)})`
        ctx.fill()

        if (dPhase < 0.3) {
          ctx.font = `500 ${5}px ${FONT_MONO}`
          ctx.textAlign = 'center'
          ctx.fillStyle = 'rgba(255,255,255,0.2)'
          ctx.fillText('debris', dx, dy - 6)
        }
      }

      // synapse pruning near dendrites
      const pruneX = neuronX - 35 * scale
      const pruneY = neuronY - 25 * scale
      const prunePhase = (st.t * 0.2) % 1

      // pruning process extending toward synapse
      ctx.beginPath()
      ctx.moveTo(microX, microY - microR)
      ctx.bezierCurveTo(microX, microY - 40 * scale, pruneX, pruneY + 20, pruneX, pruneY)
      ctx.strokeStyle = `rgba(244, 63, 94, ${0.2 + prunePhase * 0.2})`
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.stroke()
      ctx.setLineDash([])

      // scissors icon at prune point
      if (prunePhase > 0.5) {
        ctx.font = `${Math.max(8, 10 * scale)}px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillStyle = 'rgba(244, 63, 94, 0.6)'
        ctx.fillText('✂', pruneX, pruneY - 5)
      }

      ctx.font = `700 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = COL_MICRO
      ctx.fillText('MICRÓGLIA', microX, microY + microR + 20)

      ctx.font = `500 ${Math.max(6, 7 * scale)}px ${FONT_MONO}`
      ctx.fillStyle = 'rgba(244, 63, 94, 0.5)'
      ctx.fillText('Fagocitose + Poda sináptica', microX, microY + microR + 32)
    }

    // ── central neuron (draw last, on top)
    // glow
    const nGrad = ctx.createRadialGradient(neuronX, neuronY, neuronR * 0.3, neuronX, neuronY, neuronR * 2)
    nGrad.addColorStop(0, 'rgba(255, 255, 255, 0.04)')
    nGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = nGrad
    ctx.fillRect(neuronX - neuronR * 2, neuronY - neuronR * 2, neuronR * 4, neuronR * 4)

    ctx.beginPath()
    ctx.arc(neuronX, neuronY, neuronR, 0, Math.PI * 2)
    ctx.fillStyle = COL_NEURON_FILL
    ctx.fill()
    ctx.strokeStyle = COL_NEURON
    ctx.lineWidth = 2
    ctx.stroke()

    // nucleus
    ctx.beginPath()
    ctx.arc(neuronX - 2, neuronY, neuronR * 0.4, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fill()

    ctx.font = `700 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = COL_NEURON
    ctx.fillText('NEURÔNIO', neuronX, neuronY + neuronR + 16)

    // ── title & HUD
    ctx.font = `600 ${Math.max(9, 10 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('GLIA.SUPPORT', 12, 20)
    ctx.fillStyle = 'rgba(45, 212, 191, 0.5)'
    ctx.fillText('▸ INFRAESTRUTURA ATIVA', 12, 34)

    // bottom summary
    ctx.font = `600 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.fillText('Sem glia funcional, o neurônio mais "inteligente" colapsa', w / 2, h - 15)
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
      <div className="absolute top-3 right-3 flex gap-1">
        {([
          { id: 'all' as const, label: 'Todos' },
          { id: 'astrocyte' as const, label: 'Astrócito' },
          { id: 'oligo' as const, label: 'Oligo' },
          { id: 'microglia' as const, label: 'Micróglia' },
        ]).map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-2 py-1 rounded-lg text-[8px] font-semibold uppercase tracking-wider transition-all ${
              mode === m.id
                ? 'bg-white/10 text-white/80 border border-white/20'
                : 'text-white/30 hover:text-white/50 border border-transparent'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  )
}
