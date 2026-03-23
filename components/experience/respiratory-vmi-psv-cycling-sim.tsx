'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

/* ──────────────────────────────────────────────────────────────
   PSV CICLAGEM — Como o % de ciclagem muda o Ti
   10%: Ciclagem tardia → Ti aumentado
   25%: Ciclagem padrão → Ti normal
   40%: Ciclagem precoce → Ti diminuído
   ────────────────────────────────────────────────────────────── */

const smooth = (t: number) => t * t * (3 - 2 * t)

export function RespiratoryVmiPsvCyclingSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef  = useRef(0)
  const timeRef   = useRef(0)

  const [cyclePercent, setCyclePercent] = useState(25)
  const [paused, setPaused]            = useState(false)

  const peep = 5
  const ps = 14
  const rr = 14
  const cycleSec = 60 / rr
  const tau = 0.35
  const peakFlow = (ps / 10) * 60  // ~84 L/min

  // Ti determinado pelo % de ciclagem (quando fluxo = cyclePercent% do pico)
  // Flow(t) = peakFlow * exp(-t/tau) → cyclePercent/100 = exp(-Ti/tau) → Ti = -tau * ln(cyclePercent/100)
  const tiCalc = Math.min(-tau * Math.log(cyclePercent / 100) + 0.07, cycleSec * 0.6)
  const te = cycleSec - tiCalc

  const wave = useCallback((t: number) => {
    const ph = ((t % cycleSec) + cycleSec) % cycleSec

    if (ph < tiCalc) {
      const rF = Math.min(ph / 0.07, 1)
      const rs = smooth(rF)

      const P = peep + ps * rs
      const F = peakFlow * rs * Math.exp(-Math.max(0, ph - 0.07) / tau)
      const V = ps * 40 * (1 - Math.exp(-ph / tau))

      return { P, F, V }
    } else {
      const ef = (ph - tiCalc) / te
      const vEnd = ps * 40 * (1 - Math.exp(-tiCalc / tau))
      const expD = Math.exp(-ef * te / 0.4)

      const pDrop = ph - tiCalc < 0.07 ? ps * (1 - (ph - tiCalc) / 0.07) : 0

      return {
        P: peep + pDrop,
        F: -peakFlow * 0.55 * expD,
        V: vEnd * expD,
      }
    }
  }, [cycleSec, tiCalc, te, ps, peakFlow, tau, peep])

  const draw = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number, dt: number) => {
    timeRef.current += dt

    ctx.fillStyle = '#050a14'
    ctx.fillRect(0, 0, W, H)

    const left = 56
    const right = 58
    const top = 10
    const bot = 10
    const gap = 20
    const gW = W - left - right
    const gH = (H - top - bot - gap * 2) / 3

    const windowSec = 8
    const samples = Math.min(gW * 2, 700)
    const toX = (frac: number) => left + frac * gW

    const cycleColor = cyclePercent <= 15 ? '#818cf8' : cyclePercent >= 35 ? '#38bdf8' : '#4ade80'
    const cycleLabel = cyclePercent <= 15 ? 'TARDIA' : cyclePercent >= 35 ? 'PRECOCE' : 'NORMAL'

    const graphs = [
      { label: 'Paw',  unit: 'cmH₂O', color: '#22d3ee', glow: 'rgba(34,211,238,0.3)',  min: -2,  max: 28,  ticks: [0, 5, 10, 20], key: 'P' as const },
      { label: 'Flow', unit: 'L/min',  color: '#a78bfa', glow: 'rgba(167,139,250,0.3)', min: -55, max: 95,  ticks: [-30, 0, 40, 80], key: 'F' as const },
      { label: 'Vol',  unit: 'mL',     color: '#4ade80', glow: 'rgba(74,222,128,0.3)',  min: -20, max: 650, ticks: [0, 200, 400],     key: 'V' as const },
    ]

    graphs.forEach((g, gi) => {
      const gTop = top + gi * (gH + gap)
      const range = g.max - g.min
      const toY = (v: number) => gTop + gH - ((Math.min(g.max, Math.max(g.min, v)) - g.min) / range) * gH

      ctx.fillStyle = 'rgba(255,255,255,0.008)'
      ctx.fillRect(left, gTop, gW, gH)
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'
      ctx.lineWidth = 0.5
      ctx.strokeRect(left, gTop, gW, gH)

      ctx.font = '9px "SF Mono", Menlo, monospace'
      ctx.textAlign = 'right'
      g.ticks.forEach(v => {
        const y = toY(v)
        if (y < gTop || y > gTop + gH) return
        ctx.strokeStyle = v === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'
        ctx.lineWidth = v === 0 ? 0.8 : 0.5
        ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(left + gW, y); ctx.stroke()
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.fillText(`${v}`, left - 4, y + 3)
      })

      ctx.fillStyle = g.color
      ctx.font = 'bold 10px Inter, system-ui, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(g.label, left - 4, gTop + 12)

      // Waveform
      ctx.save()
      ctx.beginPath()
      ctx.rect(left, gTop - 1, gW, gH + 2)
      ctx.clip()

      ctx.beginPath()
      ctx.strokeStyle = g.color
      ctx.lineWidth = 2.2
      ctx.shadowColor = g.glow
      ctx.shadowBlur = 6

      for (let i = 0; i <= samples; i++) {
        const frac = i / samples
        const t = timeRef.current - (1 - frac) * windowSec
        const w = wave(t)
        const x = toX(frac)
        const y = toY(w[g.key])
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0

      // Cycling threshold line on flow graph
      if (gi === 1) {
        const threshFlow = peakFlow * (cyclePercent / 100)
        const yThresh = toY(threshFlow)
        ctx.setLineDash([4, 3])
        ctx.strokeStyle = `${cycleColor}60`
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(left, yThresh); ctx.lineTo(left + gW, yThresh); ctx.stroke()
        ctx.setLineDash([])

        ctx.fillStyle = cycleColor
        ctx.font = 'bold 8px "SF Mono", Menlo, monospace'
        ctx.textAlign = 'left'
        ctx.fillText(`${cyclePercent}% = ${threshFlow.toFixed(0)} L/min`, left + 4, yThresh - 4)
      }

      ctx.restore()

      // Current value
      const now = wave(timeRef.current)
      ctx.fillStyle = g.color
      ctx.font = 'bold 13px "SF Mono", Menlo, monospace'
      ctx.textAlign = 'left'
      ctx.fillText(g.key === 'V' ? `${Math.max(0, now[g.key]).toFixed(0)}` : `${now[g.key].toFixed(g.key === 'P' ? 1 : 0)}`, left + gW + 6, gTop + gH / 2 + 5)
    })

    // Info
    ctx.fillStyle = cycleColor
    ctx.font = 'bold 12px "SF Mono", Menlo, monospace'
    ctx.textAlign = 'right'
    ctx.fillText(`Ciclagem: ${cyclePercent}%`, W - 6, top + 14)
    ctx.font = '9px "SF Mono", Menlo, monospace'
    ctx.fillText(`Ti: ${tiCalc.toFixed(2)}s | ${cycleLabel}`, W - 6, top + 26)

  }, [wave, cyclePercent, tiCalc, peakFlow])

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    if (!ctx) return
    let prev = 0
    const loop = (now: number) => {
      const dt = prev ? Math.min((now - prev) / 1000, 0.05) : 0.016
      prev = now
      const dpr = window.devicePixelRatio || 1
      const r = cvs.getBoundingClientRect()
      if (cvs.width !== r.width * dpr || cvs.height !== r.height * dpr) {
        cvs.width = r.width * dpr; cvs.height = r.height * dpr
      }
      ctx.save(); ctx.scale(dpr, dpr)
      draw(ctx, r.width, r.height, paused ? 0 : dt)
      ctx.restore()
      frameRef.current = requestAnimationFrame(loop)
    }
    frameRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameRef.current)
  }, [draw, paused])

  const cycleColor = cyclePercent <= 15 ? '#818cf8' : cyclePercent >= 35 ? '#38bdf8' : '#4ade80'

  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <div className="flex items-center gap-3 px-1">
        <span className="text-[9px] font-mono font-bold" style={{ color: cycleColor }}>Ciclagem %</span>
        <input type="range" min={5} max={50} value={cyclePercent}
          onChange={e => setCyclePercent(+e.target.value)}
          className="flex-1 h-1" style={{ accentColor: cycleColor }} />
        <span className="text-sm font-bold font-mono w-8 text-right" style={{ color: cycleColor }}>{cyclePercent}%</span>
        <button onClick={() => setPaused(!paused)} className="px-2 py-1 rounded text-[10px] font-semibold bg-white/[0.03] border border-white/8 text-white/40 hover:text-white/70">{paused ? '▶' : '⏸'}</button>
      </div>

      <div className="flex gap-1 px-1">
        {[10, 25, 40].map(p => (
          <button key={p} onClick={() => setCyclePercent(p)}
            className={`px-2 py-1 rounded text-[8px] font-bold border transition-colors ${cyclePercent === p ? 'border-white/15' : 'border-white/5'}`}
            style={cyclePercent === p ? { backgroundColor: `${cycleColor}18`, color: cycleColor } : { color: 'rgba(255,255,255,0.3)' }}
          >{p}%{p === 10 ? ' (tardia)' : p === 25 ? ' (normal)' : ' (precoce)'}</button>
        ))}
      </div>

      <canvas ref={canvasRef} className="w-full rounded-lg border border-white/8" style={{ height: 480, background: '#050a14' }} />

      <div className="rounded-lg p-2 bg-white/[0.02] border border-white/5">
        <p className="text-[9px] text-white/30 font-mono">
          Ti = {tiCalc.toFixed(2)}s | Te = {te.toFixed(2)}s | I:E = 1:{(te / tiCalc).toFixed(1)} |
          Limiar de fluxo = {(peakFlow * cyclePercent / 100).toFixed(0)} L/min ({cyclePercent}% de {peakFlow.toFixed(0)})
        </p>
      </div>
    </div>
  )
}
