'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

/* ──────────────────────────────────────────────────────────────
   MONITOR VM — CPAP vs BIPAP
   3 curvas: Paw (Pressão) • Fluxo • Volume
   Scrolling contínuo da direita para esquerda
   ────────────────────────────────────────────────────────────── */

type Mode = 'cpap' | 'bipap'

const smooth = (t: number) => t * t * (3 - 2 * t)

export function RespiratoryVniModesSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef  = useRef(0)
  const timeRef   = useRef(0)

  const [mode, setMode]     = useState<Mode>('bipap')
  const [cpap, setCpap]     = useState(8)
  const [ipap, setIpap]     = useState(14)
  const [epap, setEpap]     = useState(5)
  const [rr, setRr]         = useState(15)
  const [paused, setPaused] = useState(false)

  const cycleSec = 60 / rr
  const ti       = cycleSec * 0.4
  const te       = cycleSec * 0.6
  const rise     = 0.10

  /* ── Waveform at time t ── */
  const wave = useCallback((t: number) => {
    const ph = ((t % cycleSec) + cycleSec) % cycleSec
    const ps = ipap - epap

    if (mode === 'cpap') {
      // CPAP: pressão constante, respiração espontânea
      const osc = ph < ti
        ? -0.5 * Math.sin((ph / ti) * Math.PI)
        :  0.3 * Math.sin(((ph - ti) / te) * Math.PI)
      const P = cpap + osc

      const F = ph < ti
        ?  20 * Math.sin((ph / ti) * Math.PI)
        : -14 * Math.sin(((ph - ti) / te) * Math.PI)

      const V = ph < ti
        ? 350 * (0.5 - 0.5 * Math.cos((ph / ti) * Math.PI))
        : 350 * (0.5 + 0.5 * Math.cos(((ph - ti) / te) * Math.PI))

      return { P, F, V }
    }

    // BIPAP
    let P: number, F: number, V: number

    if (ph < rise) {
      const f = smooth(ph / rise)
      P = epap + ps * f
      F = ps * 5 * f
    } else if (ph < ti - rise * 0.5) {
      P = ipap
      const platF = (ph - rise) / (ti - rise * 1.5)
      F = ps * 5 * Math.exp(-platF * 3.5)
    } else if (ph < ti) {
      const f = smooth((ph - (ti - rise * 0.5)) / (rise * 0.5))
      P = ipap - ps * f
      F = ps * 0.5 * (1 - f)
    } else if (ph < ti + rise * 0.3) {
      const f = smooth((ph - ti) / (rise * 0.3))
      P = epap + ps * 0.05 * (1 - f)
      F = -ps * 4 * f
    } else {
      P = epap
      const ef = (ph - ti - rise * 0.3) / (te - rise * 0.3)
      F = -ps * 4 * Math.exp(-ef * 3.5)
    }

    const vMax = ps * 30 + 80
    if (ph < ti) {
      const f = ph / ti
      V = vMax * (1 - Math.exp(-f * 4))
    } else {
      const f = (ph - ti) / te
      V = vMax * (1 - Math.exp(-4)) * Math.exp(-f * 3.5)
    }

    return { P, F, V }
  }, [mode, cpap, ipap, epap, cycleSec, ti, te, rise])

  /* ── Draw ── */
  const draw = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number, dt: number) => {
    timeRef.current += dt

    ctx.fillStyle = '#060c18'
    ctx.fillRect(0, 0, W, H)

    const left = 56
    const right = 70
    const top = 12
    const bot = 12
    const gap = 28
    const gW = W - left - right
    const gH = (H - top - bot - gap * 2) / 3

    const windowSec = 6
    const samples = Math.min(gW * 2, 600)

    const toX = (frac: number) => left + frac * gW

    interface GraphDef {
      label: string
      unit: string
      color: string
      glow: string
      min: number
      max: number
      ticks: number[]
      key: 'P' | 'F' | 'V'
    }

    const graphs: GraphDef[] = [
      { label: 'Paw',   unit: 'cmH₂O', color: '#22d3ee', glow: 'rgba(34,211,238,0.35)',  min: -2,  max: 22,  ticks: [0, 5, 10, 15, 20], key: 'P' },
      { label: 'Fluxo', unit: 'L/min',  color: '#a78bfa', glow: 'rgba(167,139,250,0.35)', min: -60, max: 80,  ticks: [-40, 0, 40],       key: 'F' },
      { label: 'Vol',   unit: 'mL',     color: '#4ade80', glow: 'rgba(74,222,128,0.35)',  min: -10, max: 450, ticks: [0, 150, 300],       key: 'V' },
    ]

    graphs.forEach((g, gi) => {
      const gTop = top + gi * (gH + gap)
      const range = g.max - g.min
      const toY = (v: number) => gTop + gH - ((Math.min(g.max, Math.max(g.min, v)) - g.min) / range) * gH

      // background
      ctx.fillStyle = 'rgba(255,255,255,0.012)'
      ctx.fillRect(left, gTop, gW, gH)

      // border
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 0.5
      ctx.strokeRect(left, gTop, gW, gH)

      // grid + tick labels
      ctx.font = '9px "SF Mono", Menlo, monospace'
      ctx.textAlign = 'right'
      g.ticks.forEach(v => {
        const y = toY(v)
        ctx.strokeStyle = v === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'
        ctx.lineWidth = v === 0 ? 0.8 : 0.5
        ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(left + gW, y); ctx.stroke()
        ctx.fillStyle = 'rgba(255,255,255,0.22)'
        ctx.fillText(`${v}`, left - 5, y + 3)
      })

      // label
      ctx.fillStyle = g.color
      ctx.font = 'bold 11px Inter, system-ui, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(g.label, left - 5, gTop + 13)
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.font = '8px Inter, system-ui, sans-serif'
      ctx.fillText(g.unit, left - 5, gTop + 23)

      // WAVEFORM — scrolling right to left
      ctx.save()
      ctx.beginPath()
      ctx.rect(left, gTop - 1, gW, gH + 2)
      ctx.clip()

      ctx.beginPath()
      ctx.strokeStyle = g.color
      ctx.lineWidth = 2
      ctx.shadowColor = g.glow
      ctx.shadowBlur = 6

      for (let i = 0; i <= samples; i++) {
        const frac = i / samples
        const t = timeRef.current - (1 - frac) * windowSec
        const w = wave(t)
        const val = w[g.key]
        const x = toX(frac)
        const y = toY(val)
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.restore()

      // Reference lines for pressure graph
      if (gi === 0) {
        ctx.setLineDash([4, 4])
        ctx.lineWidth = 0.7
        if (mode === 'bipap') {
          ctx.strokeStyle = 'rgba(129,140,248,0.35)'
          ctx.beginPath(); ctx.moveTo(left, toY(ipap)); ctx.lineTo(left + gW, toY(ipap)); ctx.stroke()
          ctx.strokeStyle = 'rgba(251,191,36,0.35)'
          ctx.beginPath(); ctx.moveTo(left, toY(epap)); ctx.lineTo(left + gW, toY(epap)); ctx.stroke()
        } else {
          ctx.strokeStyle = 'rgba(34,211,238,0.35)'
          ctx.beginPath(); ctx.moveTo(left, toY(cpap)); ctx.lineTo(left + gW, toY(cpap)); ctx.stroke()
        }
        ctx.setLineDash([])
      }

      // Current value (right side)
      const now = wave(timeRef.current)
      const cv = now[g.key]
      ctx.fillStyle = g.color
      ctx.font = 'bold 15px "SF Mono", Menlo, monospace'
      ctx.textAlign = 'left'
      ctx.fillText(g.key === 'V' ? `${cv.toFixed(0)}` : `${cv.toFixed(g.key === 'P' ? 1 : 0)}`, left + gW + 8, gTop + gH / 2 + 5)
    })

    // Mode + params (top right corner)
    const infoX = W - 8
    ctx.textAlign = 'right'
    ctx.fillStyle = mode === 'cpap' ? '#22d3ee' : '#818cf8'
    ctx.font = 'bold 12px "SF Mono", Menlo, monospace'
    ctx.fillText(mode === 'cpap' ? 'CPAP' : 'BIPAP', infoX, top + gH + gap + 14)

    ctx.font = '9px "SF Mono", Menlo, monospace'
    let iy = top + gH + gap + 30
    if (mode === 'cpap') {
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillText('PEEP', infoX, iy); iy += 12
      ctx.fillStyle = '#22d3ee'; ctx.fillText(`${cpap}`, infoX, iy); iy += 16
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillText('IPAP', infoX, iy); iy += 12
      ctx.fillStyle = '#818cf8'; ctx.fillText(`${ipap}`, infoX, iy); iy += 14
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillText('EPAP', infoX, iy); iy += 12
      ctx.fillStyle = '#fbbf24'; ctx.fillText(`${epap}`, infoX, iy); iy += 14
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillText('PS', infoX, iy); iy += 12
      ctx.fillStyle = '#f0abfc'; ctx.fillText(`${ipap - epap}`, infoX, iy); iy += 16
    }
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillText('FR', infoX, iy); iy += 12
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillText(`${rr}`, infoX, iy)

  }, [mode, cpap, ipap, epap, rr, wave])

  /* ── Loop ── */
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

  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 px-1">
        <div className="flex rounded-md overflow-hidden border border-white/10">
          <button onClick={() => setMode('cpap')}
            className={`px-3 py-1 text-[10px] font-bold tracking-wider ${mode === 'cpap' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/[0.03] text-white/30 hover:text-white/50'}`}
          >CPAP</button>
          <button onClick={() => setMode('bipap')}
            className={`px-3 py-1 text-[10px] font-bold tracking-wider ${mode === 'bipap' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/[0.03] text-white/30 hover:text-white/50'}`}
          >BIPAP</button>
        </div>

        <button onClick={() => setPaused(!paused)}
          className="px-2 py-1 rounded text-[10px] font-semibold bg-white/[0.03] border border-white/8 text-white/40 hover:text-white/70"
        >{paused ? '▶' : '⏸'}</button>

        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[9px] text-white/30 font-mono">FR</span>
          <input type="range" min={8} max={30} value={rr} onChange={e => setRr(+e.target.value)} className="w-16 h-0.5 accent-cyan-400" />
          <span className="text-[9px] text-white/50 font-mono w-8">{rr}</span>
        </div>
      </div>

      {/* Params */}
      <div className="flex flex-wrap items-center gap-2 px-1">
        {mode === 'cpap' ? (
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-cyan-400/60 font-mono font-bold">CPAP</span>
            <button onClick={() => setCpap(Math.max(4, cpap - 1))} className="w-5 h-5 rounded bg-white/[0.04] text-white/40 text-xs hover:bg-white/10 flex items-center justify-center">−</button>
            <span className="text-xs font-bold text-cyan-400 font-mono w-6 text-center">{cpap}</span>
            <button onClick={() => setCpap(Math.min(20, cpap + 1))} className="w-5 h-5 rounded bg-white/[0.04] text-white/40 text-xs hover:bg-white/10 flex items-center justify-center">+</button>
            <span className="text-[8px] text-white/20 font-mono">cmH₂O</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-indigo-400/60 font-mono font-bold">IPAP</span>
              <button onClick={() => setIpap(Math.max(epap + 2, ipap - 1))} className="w-5 h-5 rounded bg-white/[0.04] text-white/40 text-xs hover:bg-white/10 flex items-center justify-center">−</button>
              <span className="text-xs font-bold text-indigo-400 font-mono w-5 text-center">{ipap}</span>
              <button onClick={() => setIpap(Math.min(25, ipap + 1))} className="w-5 h-5 rounded bg-white/[0.04] text-white/40 text-xs hover:bg-white/10 flex items-center justify-center">+</button>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-amber-400/60 font-mono font-bold">EPAP</span>
              <button onClick={() => setEpap(Math.max(3, epap - 1))} className="w-5 h-5 rounded bg-white/[0.04] text-white/40 text-xs hover:bg-white/10 flex items-center justify-center">−</button>
              <span className="text-xs font-bold text-amber-400 font-mono w-5 text-center">{epap}</span>
              <button onClick={() => setEpap(Math.min(ipap - 2, epap + 1))} className="w-5 h-5 rounded bg-white/[0.04] text-white/40 text-xs hover:bg-white/10 flex items-center justify-center">+</button>
            </div>
            <div className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/6">
              <span className="text-[9px] text-white/30 font-mono">PS </span>
              <span className="text-[11px] font-bold text-fuchsia-300 font-mono">{ipap - epap}</span>
            </div>
          </>
        )}
      </div>

      {/* Monitor */}
      <canvas ref={canvasRef} className="w-full rounded-lg border border-white/8" style={{ height: 520, background: '#060c18' }} />

      {/* Legend */}
      <div className="flex items-center justify-center gap-4">
        {[
          { c: '#22d3ee', l: 'Paw (cmH₂O)' },
          { c: '#a78bfa', l: 'Fluxo (L/min)' },
          { c: '#4ade80', l: 'Volume (mL)' },
        ].map(x => (
          <div key={x.l} className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded" style={{ background: x.c }} />
            <span className="text-[9px] text-white/35 font-mono">{x.l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
