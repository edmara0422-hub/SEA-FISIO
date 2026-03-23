'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

/* ──────────────────────────────────────────────────────────────
   PSV ANÁLISE GRÁFICA COMPLETA
   100% Espontâneo — Disparo por sensibilidade, Ciclagem por fluxo
   Pressão suporte, Fluxo desacelerante, Volume curvilíneo
   ────────────────────────────────────────────────────────────── */

const COLORS = {
  pressure: '#fbbf24',
  flow: '#f472b6',
  volume: '#4ade80',
  peep: '#6b7280',
  grid: 'rgba(255,255,255,0.08)',
  bg: '#111111',
  cycling: '#38bdf8',
}

export function RespiratoryVmiPsvAnalysisSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const timeRef = useRef(0)

  const [cyclingPct, setCyclingPct] = useState(25)  // 10%, 25%, 40%
  const [paused, setPaused] = useState(false)

  // PSV Parameters
  const peep = 5
  const ps = 12           // pressure support above PEEP
  const pinsp = peep + ps
  const rr = 18           // patient controls FR (spontaneous)
  const cycleSec = 60 / rr
  const riseTime = 0.10

  // TI varies with cycling %: lower % = longer TI
  const baseTI = 0.9
  const tiAdjust = cyclingPct === 10 ? 1.4 : cyclingPct === 40 ? 0.65 : 1.0
  const tInsp = baseTI * tiAdjust
  const tExp = cycleSec - tInsp

  const flowPeak = 70
  const vcTarget = 420

  const trigDur = 0.08
  const trigDepth = 2.5  // PSV always has patient effort

  const ws = cycleSec * 2.2
  const cx = (t: number) => t / ws

  const wave = useCallback((t: number) => {
    const ph = ((t % cycleSec) + cycleSec) % cycleSec
    let P = peep, F = 0, V = 0

    /* PSV Physics: Same as PCV but cycling by FLOW %
       F(t) = (PS/R) × exp(-t/τ), cycles when F drops to cyclingPct% of peak
       R=8 cmH2O/(L/s), C=50 mL/cmH2O → τ = 0.4s */
    const R_aw = 8
    const C_rs = 0.05    // L/cmH2O
    const tau_rc = R_aw * C_rs  // 0.4s
    const peakFlowCalc = (ps / R_aw) * 60  // L/min
    const vcCalc = ps * C_rs * 1000  // mL

    // Patient trigger (always in PSV - 100% spontaneous)
    if (ph < trigDur) {
      const f = Math.sin((ph / trigDur) * Math.PI)
      P = peep - trigDepth * f
      F = -10 * f
      return { P, F, V }
    }

    const effPh = ph - trigDur

    if (effPh >= 0 && effPh < tInsp) {
      // ═══ INSPIRATORY PHASE (PSV) ═══
      // Pressure: rise time then plateau at PS
      if (effPh < riseTime) {
        const rf = effPh / riseTime
        P = peep + ps * (rf * rf * (3 - 2 * rf))
      } else {
        P = pinsp
      }

      // Flow: DECELERATING — starts at peak, decays exponentially
      const tAfterRise = Math.max(effPh - riseTime * 0.5, 0)
      const riseF = Math.min(effPh / 0.035, 1)
      F = peakFlowCalc * riseF * Math.exp(-tAfterRise / tau_rc)

      // Volume: curvilinear (1 - exp)
      V = Math.min(vcCalc, vcCalc * (1 - Math.exp(-tAfterRise / tau_rc)))

    } else if (effPh >= 0) {
      // ═══ EXPIRATORY PHASE ═══
      const expTime = effPh - tInsp
      const vAtEnd = Math.min(vcCalc, vcCalc * (1 - Math.exp(-(tInsp - riseTime * 0.5) / tau_rc)))

      P = peep + ps * 0.02 * Math.exp(-expTime / (tau_rc * 0.3))
      if (P < peep) P = peep

      F = -(vAtEnd / 1000) / tau_rc * Math.exp(-expTime / tau_rc) * 60
      V = vAtEnd * Math.exp(-expTime / tau_rc)
      if (V < 5) V = 0
    }

    return { P, F, V }
  }, [cycleSec, tInsp, tExp, peep, ps, pinsp, riseTime, cyclingPct, tiAdjust, trigDur, trigDepth])

  // Labels
  const pressureLabels = [
    { num: 1, name: 'PEEP', x: cx(-0.12) },
    { num: 2, name: 'Disparo (esforço)', x: cx(0.03) },
    { num: 3, name: 'Rise Time', x: cx(riseTime * 0.5) },
    { num: 4, name: 'PS (Suporte)', x: cx(tInsp * 0.45) },
    { num: 5, name: 'Ciclagem (fluxo)', x: cx(tInsp) },
  ]

  const flowLabels = [
    { num: 1, name: 'Disparo + Pico', x: cx(0.1) },
    { num: 2, name: 'Fluxo Desacelerante', x: cx(tInsp * 0.4) },
    { num: 3, name: `Ciclagem ${cyclingPct}% pico`, x: cx(tInsp - 0.05) },
    { num: 4, name: 'Fluxo Expiratório', x: cx(tInsp + 0.25) },
  ]

  const volumeLabels = [
    { num: 1, name: 'Vti (Entrada)', x: cx(tInsp * 0.35) },
    { num: 2, name: 'VC (variável)', x: cx(tInsp) },
    { num: 3, name: 'Vte (Saída)', x: cx(tInsp + tExp * 0.4) },
  ]

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const W = cvs.clientWidth
    const H = cvs.clientHeight
    cvs.width = W * dpr
    cvs.height = H * dpr
    ctx.scale(dpr, dpr)

    const pad = { top: 12, bot: 10, left: 62, right: 16 }
    const gap = 14
    const graphH = (H - pad.top - pad.bot - gap * 2) / 3
    const gW = W - pad.left - pad.right

    const graphs = [
      { label: 'Pressão (cmH₂O)', color: COLORS.pressure, min: -2, max: 24, key: 'P' as const },
      { label: 'Fluxo (L/min)', color: COLORS.flow, min: -60, max: 90, key: 'F' as const },
      { label: 'Volume (mL)', color: COLORS.volume, min: -20, max: 650, key: 'V' as const },
    ]

    const toY = (val: number, min: number, max: number, top: number) =>
      top + graphH - ((val - min) / (max - min)) * graphH
    const toX = (frac: number) => pad.left + frac * gW

    let prevTime = performance.now()

    const draw = (now: number) => {
      const dt = (now - prevTime) / 1000
      prevTime = now
      if (!paused) timeRef.current += dt

      ctx.fillStyle = COLORS.bg
      ctx.fillRect(0, 0, W, H)

      const windowSec = ws
      const t0 = timeRef.current - windowSec * 0.85

      graphs.forEach((g, gi) => {
        const gTop = pad.top + gi * (graphH + gap)

        // Grid
        ctx.strokeStyle = COLORS.grid; ctx.lineWidth = 0.5
        for (let i = 0; i <= 4; i++) {
          const y = gTop + (graphH / 4) * i
          ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke()
        }

        // PEEP / Zero
        if (gi === 0) {
          const peepY = toY(peep, g.min, g.max, gTop)
          ctx.strokeStyle = COLORS.peep; ctx.setLineDash([4, 4]); ctx.lineWidth = 1
          ctx.beginPath(); ctx.moveTo(pad.left, peepY); ctx.lineTo(W - pad.right, peepY); ctx.stroke()
          ctx.setLineDash([])
          ctx.fillStyle = COLORS.peep; ctx.font = '9px monospace'
          ctx.fillText('PEEP', pad.left + 2, peepY - 3)
        } else if (gi === 1) {
          const zeroY = toY(0, g.min, g.max, gTop)
          ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 0.8
          ctx.beginPath(); ctx.moveTo(pad.left, zeroY); ctx.lineTo(W - pad.right, zeroY); ctx.stroke()

          // Draw cycling threshold line
          const cycThreshVal = flowPeak * (cyclingPct / 100)
          const cycY = toY(cycThreshVal, g.min, g.max, gTop)
          ctx.strokeStyle = COLORS.cycling; ctx.setLineDash([3, 3]); ctx.lineWidth = 0.8
          ctx.beginPath(); ctx.moveTo(pad.left, cycY); ctx.lineTo(W - pad.right, cycY); ctx.stroke()
          ctx.setLineDash([])
          ctx.fillStyle = COLORS.cycling; ctx.font = '8px monospace'; ctx.textAlign = 'right'
          ctx.fillText(`${cyclingPct}%`, W - pad.right - 2, cycY - 2)
        }

        // Y labels
        ctx.fillStyle = g.color; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left'
        ctx.fillText(g.label, 2, gTop + 12)
        ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '9px monospace'; ctx.textAlign = 'right'
        ctx.fillText(String(Math.round(g.max)), pad.left - 4, gTop + 10)
        ctx.fillText(String(Math.round(g.min)), pad.left - 4, gTop + graphH)

        // Waveform
        ctx.strokeStyle = g.color; ctx.lineWidth = 2.2
        ctx.beginPath()
        let started = false
        const steps = Math.floor(gW * 1.5)
        for (let px = 0; px < steps; px++) {
          const frac = px / steps
          const t = t0 + frac * windowSec
          const w = wave(t)
          const x = toX(frac)
          const y = toY(w[g.key], g.min, g.max, gTop)
          if (!started) { ctx.moveTo(x, y); started = true } else ctx.lineTo(x, y)
        }
        ctx.stroke()

        // Labels
        const firstCycleStart = Math.ceil(t0 / cycleSec) * cycleSec
        const cycleOffset = (firstCycleStart - t0) / windowSec

        if (cycleOffset >= 0 && cycleOffset < 0.7) {
          const labels = gi === 0 ? pressureLabels : gi === 1 ? flowLabels : volumeLabels

          labels.forEach(lb => {
            const lx = toX(cycleOffset + lb.x)
            if (lx < pad.left || lx > W - pad.right) return

            const t = firstCycleStart + lb.x * windowSec
            const w = wave(t)
            const ly = toY(w[g.key], g.min, g.max, gTop)

            const radius = 7
            const labelY = ly - 14

            ctx.beginPath()
            ctx.arc(lx, labelY, radius, 0, Math.PI * 2)
            ctx.fillStyle = g.color; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1

            ctx.fillStyle = '#000'; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'center'
            ctx.fillText(String(lb.num), lx, labelY + 3)

            ctx.strokeStyle = g.color; ctx.globalAlpha = 0.4; ctx.lineWidth = 0.6
            ctx.beginPath(); ctx.moveTo(lx, labelY + radius); ctx.lineTo(lx, ly); ctx.stroke()
            ctx.globalAlpha = 1

            ctx.beginPath(); ctx.arc(lx, ly, 2.5, 0, Math.PI * 2)
            ctx.fillStyle = g.color; ctx.fill()
          })
        }

        ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 0.5
        ctx.strokeRect(pad.left, gTop, gW, graphH)
      })

      // Current values
      const cur = wave(timeRef.current)
      ctx.font = 'bold 10px monospace'; ctx.textAlign = 'right'
      graphs.forEach((g, gi) => {
        const gTop = pad.top + gi * (graphH + gap)
        ctx.fillStyle = g.color
        ctx.fillText(`${cur[g.key].toFixed(1)}`, W - pad.right - 2, gTop + graphH - 4)
      })

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameRef.current)
  }, [wave, paused, cyclingPct])

  return (
    <div className={`rounded-xl overflow-hidden bg-[#111] ${className ?? ''}`}>
      <div className="flex flex-wrap gap-1.5 p-3 bg-black/40 border-b border-white/10">
        <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-purple-500/20 text-purple-300">PSV (Espontânea)</span>

        <div className="w-px bg-white/10 mx-1" />

        <span className="text-white/40 text-xs self-center">Ciclagem:</span>
        {[10, 25, 40].map(pct => (
          <button
            key={pct}
            onClick={() => setCyclingPct(pct)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              cyclingPct === pct
                ? 'bg-blue-500/30 text-blue-300 ring-1 ring-blue-500/50'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {pct}%
          </button>
        ))}

        <div className="w-px bg-white/10 mx-1" />

        <button
          onClick={() => setPaused(!paused)}
          className="px-3 py-1.5 rounded-md text-xs font-bold bg-white/5 text-white/60 hover:bg-white/10"
        >
          {paused ? '▶ Play' : '⏸ Pause'}
        </button>
      </div>

      <canvas ref={canvasRef} className="w-full" style={{ height: 420 }} />

      <div className="p-3 bg-black/40 border-t border-white/10 space-y-2 text-[10px]">
        <div>
          <p className="text-yellow-400 font-bold text-[11px] mb-1">Pressão (cmH₂O)</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {pressureLabels.map(l => (
              <div key={l.num} className="flex items-center gap-1">
                <span className="shrink-0 w-4 h-4 rounded-full bg-yellow-500/30 text-yellow-300 flex items-center justify-center font-bold text-[9px]">{l.num}</span>
                <span className="text-white/70">{l.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-pink-400 font-bold text-[11px] mb-1">Fluxo (L/min) — Desacelerante</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {flowLabels.map(l => (
              <div key={l.num} className="flex items-center gap-1">
                <span className="shrink-0 w-4 h-4 rounded-full bg-pink-500/30 text-pink-300 flex items-center justify-center font-bold text-[9px]">{l.num}</span>
                <span className="text-white/70">{l.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-green-400 font-bold text-[11px] mb-1">Volume (mL) — Curvilíneo</p>
          <div className="grid grid-cols-3 gap-1.5">
            {volumeLabels.map(l => (
              <div key={l.num} className="flex items-center gap-1">
                <span className="shrink-0 w-4 h-4 rounded-full bg-green-500/30 text-green-300 flex items-center justify-center font-bold text-[9px]">{l.num}</span>
                <span className="text-white/70">{l.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-white/40 text-[9px] space-y-0.5">
          <p>⚡ PSV é 100% ESPONTÂNEO: Paciente dispara (sensibilidade) e cicla por FLUXO ({cyclingPct}% do pico).</p>
          <p>📊 {cyclingPct === 10 ? 'Ciclagem 10% → TI MAIOR (cicla tarde)' : cyclingPct === 40 ? 'Ciclagem 40% → TI MENOR (cicla cedo)' : 'Ciclagem 25% → TI padrão (recomendado)'}</p>
        </div>
      </div>
    </div>
  )
}
