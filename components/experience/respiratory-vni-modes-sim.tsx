'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

/* ────────────────────────────────────────────────────────
   CPAP vs BIPAP – Curvas de Pressão em Tempo Real
   Mostra os dois modos lado a lado com parâmetros ajustáveis
   ──────────────────────────────────────────────────────── */

type Mode = 'cpap' | 'bipap'

export function RespiratoryVniModesSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef  = useRef(0)
  const timeRef   = useRef(0)

  const [mode, setMode]     = useState<Mode>('cpap')
  const [cpap, setCpap]     = useState(8)    // cmH₂O
  const [ipap, setIpap]     = useState(15)   // cmH₂O
  const [epap, setEpap]     = useState(5)    // cmH₂O
  const [rr, setRr]         = useState(15)   // resp/min
  const [paused, setPaused] = useState(false)

  /* ── breathing waveform helpers ── */
  const cycleDuration = useCallback(() => 60 / rr, [rr]) // seconds per breath
  const iTime = useCallback(() => cycleDuration() * 0.4, [cycleDuration]) // 40% inspiration

  /* ── draw ── */
  const draw = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number, dt: number) => {
    timeRef.current += dt

    ctx.fillStyle = '#0a0f1a'
    ctx.fillRect(0, 0, W, H)

    const pad = { top: 70, bot: 90, left: 70, right: 30 }
    const gW = W - pad.left - pad.right
    const gH = H - pad.top - pad.bot

    // pressure range: -2 to 22 cmH₂O
    const pMin = -2, pMax = 22
    const pRange = pMax - pMin

    const toX = (sec: number, windowSec: number) => pad.left + (sec / windowSec) * gW
    const toY = (p: number) => pad.top + gH - ((p - pMin) / pRange) * gH

    const windowSec = 8 // show 8 seconds of trace

    /* ── title ── */
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.font = 'bold 15px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    const title = mode === 'cpap'
      ? `CPAP — ${cpap} cmH₂O (Pressão Constante)`
      : `BIPAP — IPAP ${ipap} / EPAP ${epap} cmH₂O (PS = ${ipap - epap})`
    ctx.fillText(title, W / 2, 28)

    ctx.font = '11px Inter, system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.fillText(`FR: ${rr} rpm  •  Ti: ${(iTime() * 1000).toFixed(0)}ms  •  Te: ${((cycleDuration() - iTime()) * 1000).toFixed(0)}ms`, W / 2, 48)

    /* ── grid ── */
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    for (let p = 0; p <= 20; p += 5) {
      const y = toY(p)
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + gW, y); ctx.stroke()
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.font = '10px Inter, system-ui, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`${p}`, pad.left - 8, y + 3)
    }

    // zero line
    const y0 = toY(0)
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(pad.left, y0); ctx.lineTo(pad.left + gW, y0); ctx.stroke()
    ctx.setLineDash([])

    /* ── axis labels ── */
    ctx.save()
    ctx.translate(16, pad.top + gH / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = '11px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Pressão (cmH₂O)', 0, 0)
    ctx.restore()

    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = '11px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Tempo (segundos)', pad.left + gW / 2, H - pad.bot + 50)

    // time labels
    for (let s = 0; s <= windowSec; s++) {
      const x = toX(s, windowSec)
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.font = '9px Inter, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${s}s`, x, pad.top + gH + 18)
    }

    /* ── pressure waveform ── */
    const getPressure = (t: number): number => {
      const cycle = cycleDuration()
      const phase = ((t % cycle) + cycle) % cycle
      const ti = iTime()
      const riseTime = 0.08 // 80ms rise/fall

      if (mode === 'cpap') {
        return cpap
      } else {
        // BIPAP: transition between EPAP and IPAP
        if (phase < riseTime) {
          // rising to IPAP
          const frac = phase / riseTime
          const smooth = frac * frac * (3 - 2 * frac) // smoothstep
          return epap + (ipap - epap) * smooth
        } else if (phase < ti) {
          // at IPAP
          return ipap
        } else if (phase < ti + riseTime) {
          // falling to EPAP
          const frac = (phase - ti) / riseTime
          const smooth = frac * frac * (3 - 2 * frac)
          return ipap - (ipap - epap) * smooth
        } else {
          // at EPAP
          return epap
        }
      }
    }

    // Draw pressure trace
    const samples = 400
    ctx.beginPath()
    ctx.strokeStyle = mode === 'cpap' ? '#2dd4bf' : '#818cf8'
    ctx.lineWidth = 2.5
    ctx.shadowColor = mode === 'cpap' ? 'rgba(45,212,191,0.4)' : 'rgba(129,140,248,0.4)'
    ctx.shadowBlur = 8

    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * windowSec
      const shiftedT = t + timeRef.current
      const p = getPressure(shiftedT)
      const x = toX(t, windowSec)
      const y = toY(p)
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.shadowBlur = 0

    /* ── flow waveform (small, below) ── */
    const flowH = 35
    const flowTop = pad.top + gH + 60
    const flowBot = flowTop + flowH

    // flow label
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '9px Inter, system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('Fluxo', pad.left - 8, flowTop + flowH / 2 + 3)

    // flow trace
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(251,191,36,0.6)'
    ctx.lineWidth = 1.5

    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * windowSec
      const shiftedT = t + timeRef.current
      const cycle = cycleDuration()
      const phase = ((shiftedT % cycle) + cycle) % cycle
      const ti = iTime()

      let flow: number
      if (phase < ti) {
        // inspiratory flow (positive) - decelerating pattern
        const frac = phase / ti
        flow = Math.cos(frac * Math.PI * 0.5) * 0.8
      } else {
        // expiratory flow (negative) - passive
        const frac = (phase - ti) / (cycle - ti)
        flow = -Math.exp(-frac * 3) * 0.5
      }

      const x = toX(t, windowSec)
      const y = flowTop + flowH / 2 - flow * (flowH / 2)
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // flow zero line
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.beginPath()
    ctx.moveTo(pad.left, flowTop + flowH / 2)
    ctx.lineTo(pad.left + gW, flowTop + flowH / 2)
    ctx.stroke()

    /* ── CPAP/BIPAP reference lines ── */
    if (mode === 'cpap') {
      // CPAP level line
      const yc = toY(cpap)
      ctx.strokeStyle = 'rgba(45,212,191,0.3)'
      ctx.setLineDash([6, 4])
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(pad.left, yc); ctx.lineTo(pad.left + gW, yc); ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = 'rgba(45,212,191,0.7)'
      ctx.font = 'bold 10px Inter, system-ui, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`CPAP = ${cpap} cmH₂O`, pad.left + gW + 4, yc + 3)
    } else {
      // IPAP line
      const yi = toY(ipap)
      ctx.strokeStyle = 'rgba(129,140,248,0.3)'
      ctx.setLineDash([6, 4])
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(pad.left, yi); ctx.lineTo(pad.left + gW, yi); ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = 'rgba(129,140,248,0.7)'
      ctx.font = 'bold 10px Inter, system-ui, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`IPAP = ${ipap}`, pad.left - 8, yi - 6)

      // EPAP line
      const ye = toY(epap)
      ctx.strokeStyle = 'rgba(251,191,36,0.3)'
      ctx.setLineDash([6, 4])
      ctx.beginPath(); ctx.moveTo(pad.left, ye); ctx.lineTo(pad.left + gW, ye); ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = 'rgba(251,191,36,0.7)'
      ctx.fillText(`EPAP = ${epap}`, pad.left - 8, ye + 14)

      // PS bracket on the right
      const psX = pad.left + gW + 10
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.moveTo(psX, yi); ctx.lineTo(psX + 8, yi)
      ctx.lineTo(psX + 8, ye); ctx.lineTo(psX, ye)
      ctx.stroke()

      // PS label
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.font = 'bold 10px Inter, system-ui, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`PS=${ipap - epap}`, psX + 12, (yi + ye) / 2 + 4)
    }

    /* ── inspiration/expiration phase indicator ── */
    const currentPhase = ((timeRef.current % cycleDuration()) + cycleDuration()) % cycleDuration()
    const isInsp = currentPhase < iTime()

    // phase bar at bottom of graph
    const barY = pad.top + gH + 2
    const barH = 4
    ctx.fillStyle = isInsp ? 'rgba(45,212,191,0.5)' : 'rgba(251,191,36,0.3)'
    const barProgress = currentPhase / cycleDuration()
    ctx.fillRect(pad.left, barY, gW * barProgress, barH)

    // phase label
    ctx.fillStyle = isInsp ? 'rgba(45,212,191,0.8)' : 'rgba(251,191,36,0.8)'
    ctx.font = 'bold 9px Inter, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(isInsp ? '▲ INSPIRAÇÃO' : '▼ EXPIRAÇÃO', pad.left, barY + 18)

  }, [mode, cpap, ipap, epap, rr, cycleDuration, iTime])

  /* ── animation loop ── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let lastTime = 0
    const animate = (now: number) => {
      const dt = lastTime ? (now - lastTime) / 1000 : 0.016
      lastTime = now

      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      const W = rect.width
      const H = rect.height

      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width = W * dpr
        canvas.height = H * dpr
      }

      ctx.save()
      ctx.scale(dpr, dpr)
      if (!paused) draw(ctx, W, H, dt)
      else draw(ctx, W, H, 0)
      ctx.restore()

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [draw, paused])

  const ps = ipap - epap

  return (
    <div className={`flex flex-col gap-3 ${className ?? ''}`}>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 px-2">
        {/* Mode toggle */}
        <div className="flex rounded-lg overflow-hidden border border-white/10">
          <button
            onClick={() => setMode('cpap')}
            className={`px-4 py-1.5 text-xs font-bold transition-all ${
              mode === 'cpap'
                ? 'bg-teal-500/20 text-teal-400 border-r border-teal-500/30'
                : 'bg-white/5 text-white/40 border-r border-white/10 hover:text-white/60'
            }`}
          >
            CPAP
          </button>
          <button
            onClick={() => setMode('bipap')}
            className={`px-4 py-1.5 text-xs font-bold transition-all ${
              mode === 'bipap'
                ? 'bg-indigo-500/20 text-indigo-400'
                : 'bg-white/5 text-white/40 hover:text-white/60'
            }`}
          >
            BIPAP
          </button>
        </div>

        {/* Pause */}
        <button
          onClick={() => setPaused(!paused)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-white/60 hover:text-white/90 transition-all"
        >
          {paused ? '▶ Play' : '⏸ Pausar'}
        </button>

        {/* FR slider */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[10px] text-white/40">FR:</span>
          <input
            type="range" min={8} max={30} value={rr}
            onChange={e => setRr(+e.target.value)}
            className="w-20 h-1 accent-teal-400"
          />
          <span className="text-[10px] text-white/70 w-10">{rr} rpm</span>
        </div>
      </div>

      {/* Parameter controls */}
      <div className="flex flex-wrap items-center gap-3 px-2">
        {mode === 'cpap' ? (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-teal-400/70 font-semibold">CPAP:</span>
            <button onClick={() => setCpap(Math.max(4, cpap - 1))} className="w-6 h-6 rounded bg-white/5 text-white/50 text-sm hover:bg-white/10">−</button>
            <span className="text-sm font-bold text-teal-400 w-14 text-center">{cpap} cmH₂O</span>
            <button onClick={() => setCpap(Math.min(20, cpap + 1))} className="w-6 h-6 rounded bg-white/5 text-white/50 text-sm hover:bg-white/10">+</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-indigo-400/70 font-semibold">IPAP:</span>
              <button onClick={() => setIpap(Math.max(epap + 2, ipap - 1))} className="w-6 h-6 rounded bg-white/5 text-white/50 text-sm hover:bg-white/10">−</button>
              <span className="text-sm font-bold text-indigo-400 w-8 text-center">{ipap}</span>
              <button onClick={() => setIpap(Math.min(25, ipap + 1))} className="w-6 h-6 rounded bg-white/5 text-white/50 text-sm hover:bg-white/10">+</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-amber-400/70 font-semibold">EPAP:</span>
              <button onClick={() => setEpap(Math.max(3, epap - 1))} className="w-6 h-6 rounded bg-white/5 text-white/50 text-sm hover:bg-white/10">−</button>
              <span className="text-sm font-bold text-amber-400 w-8 text-center">{epap}</span>
              <button onClick={() => setEpap(Math.min(ipap - 2, epap + 1))} className="w-6 h-6 rounded bg-white/5 text-white/50 text-sm hover:bg-white/10">+</button>
            </div>
            <div className="px-3 py-1 rounded bg-white/5 border border-white/10">
              <span className="text-[10px] text-white/40">PS = </span>
              <span className="text-sm font-bold text-white/80">{ps} cmH₂O</span>
            </div>
          </>
        )}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full rounded-xl border border-white/10"
        style={{ height: 380, background: '#0a0f1a' }}
      />

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-2 px-2">
        <div className={`rounded-lg p-3 border ${mode === 'cpap' ? 'bg-teal-500/5 border-teal-500/15' : 'bg-white/[0.03] border-white/8'}`}>
          <p className="text-[10px] font-bold text-teal-400/70 mb-1">CPAP</p>
          <p className="text-[9px] text-white/50 leading-relaxed">
            Pressão CONSTANTE durante todo o ciclo.
            Paciente respira espontaneamente.
            Ideal para EAP e apneia do sono.
          </p>
        </div>
        <div className={`rounded-lg p-3 border ${mode === 'bipap' ? 'bg-indigo-500/5 border-indigo-500/15' : 'bg-white/[0.03] border-white/8'}`}>
          <p className="text-[10px] font-bold text-indigo-400/70 mb-1">BIPAP</p>
          <p className="text-[9px] text-white/50 leading-relaxed">
            DOIS níveis: IPAP (inspiração) e EPAP (expiração).
            PS = IPAP − EPAP. Maior suporte ventilatório.
            Ideal para DPOC, asma, doenças neuromusculares.
          </p>
        </div>
      </div>
    </div>
  )
}
