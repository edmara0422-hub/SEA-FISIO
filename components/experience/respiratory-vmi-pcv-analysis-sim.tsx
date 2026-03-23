'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

/* ──────────────────────────────────────────────────────────────
   PCV ANÁLISE GRÁFICA COMPLETA
   Pressão quadrada, Fluxo desacelerante, Volume curvilíneo
   CC (Tempo/JT) vs A/C (Sensibilidade)
   ────────────────────────────────────────────────────────────── */

type TriggerMode = 'cc' | 'ac'

const COLORS = {
  pressure: '#fbbf24',
  flow: '#f472b6',
  volume: '#4ade80',
  peep: '#6b7280',
  grid: 'rgba(255,255,255,0.08)',
  bg: '#111111',
}

export function RespiratoryVmiPcvAnalysisSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const timeRef = useRef(0)

  const [triggerMode, setTriggerMode] = useState<TriggerMode>('cc')
  const [paused, setPaused] = useState(false)

  // PCV Parameters
  const peep = 5
  const pc = 15            // pressure control above PEEP
  const pinsp = peep + pc  // total inspiratory pressure = 20
  const rr = 15
  const cycleSec = 60 / rr
  const tInsp = 1.2        // PCV cycles by TIME
  const tExp = cycleSec - tInsp
  const riseTime = 0.12    // rise time in seconds
  const flowPeak = 80      // L/min peak decelerating flow
  const vcTarget = 500     // typical VC in PCV

  // Trigger parameters
  const trigDur = 0.08
  const trigDepth = triggerMode === 'ac' ? 2.5 : 0

  const ws = cycleSec * 2.2

  const cx = (t: number) => t / ws

  const wave = useCallback((t: number) => {
    /* PCV Physics: Pressure=constant → Flow decelerating → Volume curvilinear
       F(t) = (PC/R) × exp(-t/τ) where τ = R×C
       V(t) = PC×C × (1 - exp(-t/τ))
       R=8 cmH2O/(L/s), C=50 mL/cmH2O → τ = 0.4s */
    const R_aw = 8
    const C_rs = 0.05    // 50 mL/cmH₂O = 0.05 L/cmH₂O
    const tau_rc = R_aw * C_rs  // 0.4s
    const peakFlow = (pc / R_aw) * 60  // L/min = (15/8)×60 = 112.5
    const vcCalc = pc * C_rs * 1000    // mL = 15 × 0.05 × 1000 = 750 → cap at vcTarget

    const ph = ((t % cycleSec) + cycleSec) % cycleSec
    let P = peep, F = 0, V = 0

    // A/C trigger deflection
    if (triggerMode === 'ac' && ph < trigDur) {
      const f = Math.sin((ph / trigDur) * Math.PI)
      P = peep - trigDepth * f
      F = -8 * f
      return { P, F, V }
    }

    const effPh = triggerMode === 'ac' ? ph - trigDur : ph

    if (effPh >= 0 && effPh < tInsp) {
      // ═══ INSPIRATORY PHASE (PCV) ═══
      // Pressure: rapid rise then FLAT plateau (square wave)
      if (effPh < riseTime) {
        const rf = effPh / riseTime
        P = peep + pc * (rf * rf * (3 - 2 * rf))  // smooth S-curve rise
      } else {
        P = pinsp  // flat plateau
      }

      // Flow: DECELERATING exponential from peak
      // After rise time, F = peakFlow × exp(-(t-riseTime)/τ)
      const tAfterRise = Math.max(effPh - riseTime * 0.5, 0)
      const riseF = Math.min(effPh / 0.04, 1)  // sharp initial rise
      F = peakFlow * riseF * Math.exp(-tAfterRise / tau_rc)

      // Volume: curvilinear (1 - exp(-t/τ))
      V = Math.min(vcTarget, vcCalc * (1 - Math.exp(-tAfterRise / tau_rc)))

    } else if (effPh >= 0) {
      // ═══ EXPIRATORY PHASE ═══
      const expTime = effPh - tInsp
      const vAtEndInsp = Math.min(vcTarget, vcCalc * (1 - Math.exp(-(tInsp - riseTime * 0.5) / tau_rc)))

      // Pressure drops sharply to PEEP
      P = peep + pc * 0.03 * Math.exp(-expTime / (tau_rc * 0.3))
      if (P < peep) P = peep

      // Flow: negative exponential
      F = -(vAtEndInsp / 1000) / tau_rc * Math.exp(-expTime / tau_rc) * 60

      // Volume: exponential decay
      V = vAtEndInsp * Math.exp(-expTime / tau_rc)
      if (V < 5) V = 0
    }

    return { P, F, V }
  }, [triggerMode, cycleSec, tInsp, tExp, peep, pinsp, riseTime, flowPeak, vcTarget, trigDur, trigDepth])

  // Labels
  const pressureLabels = [
    { num: 1, name: 'PEEP', x: cx(-0.15) },
    { num: 2, name: 'Disparo', x: cx(0.04) },
    { num: 3, name: 'Rise Time', x: cx(riseTime * 0.6) },
    { num: 4, name: 'ΔP (Variação)', x: cx(riseTime + 0.15) },
    { num: 5, name: 'Pinsp', x: cx(tInsp * 0.5) },
    { num: 6, name: 'Ciclagem', x: cx(tInsp) },
  ]

  const flowLabels = [
    { num: 1, name: 'Disparo', x: cx(0.04) },
    { num: 2, name: 'Pico Fluxo Insp.', x: cx(0.12) },
    { num: 3, name: 'Ciclagem', x: cx(tInsp - 0.08) },
    { num: 4, name: 'Pico Fluxo Exp.', x: cx(tInsp + 0.3) },
    { num: 5, name: 'Const. Tempo τ', x: cx(tInsp + tExp * 0.5) },
  ]

  const volumeLabels = [
    { num: 1, name: 'Vti (Entrada)', x: cx(tInsp * 0.35) },
    { num: 2, name: 'VC (Pico)', x: cx(tInsp) },
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
      { label: 'Pressão (cmH₂O)', color: COLORS.pressure, min: -2, max: 28, key: 'P' as const },
      { label: 'Fluxo (L/min)', color: COLORS.flow, min: -70, max: 100, key: 'F' as const },
      { label: 'Volume (mL)', color: COLORS.volume, min: -20, max: 580, key: 'V' as const },
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
        ctx.strokeStyle = COLORS.grid
        ctx.lineWidth = 0.5
        for (let i = 0; i <= 4; i++) {
          const y = gTop + (graphH / 4) * i
          ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke()
        }

        // PEEP / Zero line
        if (gi === 0) {
          const peepY = toY(peep, g.min, g.max, gTop)
          ctx.strokeStyle = COLORS.peep
          ctx.setLineDash([4, 4]); ctx.lineWidth = 1
          ctx.beginPath(); ctx.moveTo(pad.left, peepY); ctx.lineTo(W - pad.right, peepY); ctx.stroke()
          ctx.setLineDash([])
          ctx.fillStyle = COLORS.peep; ctx.font = '9px monospace'
          ctx.fillText('PEEP', pad.left + 2, peepY - 3)
        } else if (gi === 1) {
          const zeroY = toY(0, g.min, g.max, gTop)
          ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 0.8
          ctx.beginPath(); ctx.moveTo(pad.left, zeroY); ctx.lineTo(W - pad.right, zeroY); ctx.stroke()
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

          // ΔP annotation on pressure
          if (gi === 0) {
            const dpX = toX(cycleOffset + cx(tInsp * 0.7))
            const dpTopY = toY(pinsp, g.min, g.max, gTop)
            const dpBotY = toY(peep, g.min, g.max, gTop)

            ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5
            ctx.beginPath(); ctx.moveTo(dpX, dpBotY); ctx.lineTo(dpX, dpTopY); ctx.stroke()

            ctx.fillStyle = '#ef4444'
            ctx.beginPath(); ctx.moveTo(dpX - 3, dpBotY - 5); ctx.lineTo(dpX + 3, dpBotY - 5); ctx.lineTo(dpX, dpBotY); ctx.fill()
            ctx.beginPath(); ctx.moveTo(dpX - 3, dpTopY + 5); ctx.lineTo(dpX + 3, dpTopY + 5); ctx.lineTo(dpX, dpTopY); ctx.fill()

            ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left'
            ctx.fillText(`ΔP = ${pc}`, dpX + 6, (dpTopY + dpBotY) / 2 + 4)
          }
        }

        // Border
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
  }, [wave, paused, triggerMode])

  return (
    <div className={`rounded-xl overflow-hidden bg-[#111] ${className ?? ''}`}>
      <div className="flex flex-wrap gap-1.5 p-3 bg-black/40 border-b border-white/10">
        <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300">PCV</span>

        <div className="w-px bg-white/10 mx-1" />

        <button
          onClick={() => setTriggerMode(triggerMode === 'cc' ? 'ac' : 'cc')}
          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
            triggerMode === 'ac'
              ? 'bg-cyan-500/30 text-cyan-300 ring-1 ring-cyan-500/50'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          {triggerMode === 'cc' ? 'CC (Tempo/JT)' : 'A/C (Sensibilidade)'}
        </button>

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
          <p className="text-yellow-400 font-bold text-[11px] mb-1">Pressão (cmH₂O) — Onda Quadrada</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
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
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
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
        <p className="text-white/40 text-[9px]">⚠️ CUIDADO: Pinsp ({pinsp} cmH₂O) ≠ PC ({pc} cmH₂O). Pinsp = PEEP + PC. Volume é VARIÁVEL (depende da mecânica).</p>
      </div>
    </div>
  )
}
