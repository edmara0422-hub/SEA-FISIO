'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

/* ──────────────────────────────────────────────────────────────
   STRESS INDEX — Análise morfologia curva Pressão × Tempo (VCV)
   SI > 1: Côncava → Sobredistensão
   SI = 1: Linear → IDEAL
   SI < 1: Convexa → Recrutamento
   ────────────────────────────────────────────────────────────── */

type SIMode = 'ideal' | 'overdist' | 'recruit'

const SI_INFO: Record<SIMode, { label: string; si: string; shape: string; color: string; meaning: string }> = {
  ideal:    { label: 'IDEAL',          si: 'SI = 1',   shape: 'Linear',  color: '#4ade80', meaning: 'Complacência constante durante inspiração — ventilação protetora adequada' },
  overdist: { label: 'SOBREDISTENSÃO', si: 'SI > 1',   shape: 'Côncava', color: '#f87171', meaning: 'Complacência DIMINUI durante inspiração — pulmão sendo hiperdistendido' },
  recruit:  { label: 'RECRUTAMENTO',   si: 'SI < 1',   shape: 'Convexa', color: '#38bdf8', meaning: 'Complacência AUMENTA durante inspiração — alvéolos sendo recrutados' },
}

const smooth = (t: number) => t * t * (3 - 2 * t)

export function RespiratoryVmiStressIndexSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef  = useRef(0)
  const timeRef   = useRef(0)

  const [siMode, setSiMode] = useState<SIMode>('ideal')
  const [paused, setPaused] = useState(false)

  const peep = 5
  const rr = 15
  const cycleSec = 60 / rr
  const ti = cycleSec * 0.30
  const te = cycleSec - ti
  const vc = 450
  const flowPeak = 50

  /* ── VCV wave with Stress Index morphology ── */
  const wave = useCallback((t: number) => {
    const ph = ((t % cycleSec) + cycleSec) % cycleSec

    if (ph < ti) {
      const frac = ph / ti
      const rF = Math.min(ph / 0.07, 1)
      const rs = smooth(rF)

      // Fluxo: constante (VCV onda quadrada)
      const F = flowPeak * rs

      // Volume: linear (VCV)
      const V = vc * frac

      // Pressão: depende do Stress Index
      const pResistive = 8 * (flowPeak / 60) * rs
      let pElastic: number

      if (siMode === 'ideal') {
        // SI = 1: pressão sobe LINEARMENTE
        pElastic = (vc / 40) * frac
      } else if (siMode === 'overdist') {
        // SI > 1: CÔNCAVA — pressão acelera (complacência diminui)
        // Curva côncava para cima: frac^1.6
        pElastic = (vc / 35) * Math.pow(frac, 1.6)
      } else {
        // SI < 1: CONVEXA — pressão desacelera (complacência aumenta)
        // Curva convexa: frac^0.5
        pElastic = (vc / 45) * Math.pow(frac, 0.55)
      }

      const P = peep + pElastic + pResistive
      return { P, F, V }
    } else {
      const eFrac = (ph - ti) / te
      const expD = Math.exp(-eFrac * te / 0.5)
      return {
        P: peep + (vc / 40) * expD,
        F: -flowPeak * 0.7 * expD,
        V: vc * expD,
      }
    }
  }, [siMode, cycleSec, ti, te])

  /* ── Draw ── */
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
    const info = SI_INFO[siMode]

    const graphs = [
      { label: 'Paw',  unit: 'cmH₂O', color: info.color, glow: `${info.color}50`, min: -2,  max: 35,  ticks: [0, 5, 15, 25], key: 'P' as const },
      { label: 'Flow', unit: 'L/min',  color: '#a78bfa',  glow: 'rgba(167,139,250,0.3)', min: -50, max: 70,  ticks: [-30, 0, 30, 50], key: 'F' as const },
      { label: 'Vol',  unit: 'mL',     color: '#4ade80',  glow: 'rgba(74,222,128,0.3)',  min: -20, max: 550, ticks: [0, 200, 400],     key: 'V' as const },
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
      ctx.restore()

      // PEEP line
      if (gi === 0) {
        ctx.setLineDash([3, 3])
        ctx.strokeStyle = 'rgba(251,191,36,0.25)'
        ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(left, toY(peep)); ctx.lineTo(left + gW, toY(peep)); ctx.stroke()
        ctx.setLineDash([])
      }
      if (gi === 1) {
        ctx.setLineDash([2, 3])
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'
        ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(left, toY(0)); ctx.lineTo(left + gW, toY(0)); ctx.stroke()
        ctx.setLineDash([])
      }

      const now = wave(timeRef.current)
      ctx.fillStyle = g.color
      ctx.font = 'bold 13px "SF Mono", Menlo, monospace'
      ctx.textAlign = 'left'
      ctx.fillText(g.key === 'V' ? `${Math.max(0, now[g.key]).toFixed(0)}` : `${now[g.key].toFixed(g.key === 'P' ? 1 : 0)}`, left + gW + 6, gTop + gH / 2 + 5)
    })

    // SI label
    ctx.fillStyle = info.color
    ctx.font = 'bold 12px Inter, system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${info.si} — ${info.shape}`, W - 6, top + 14)
    ctx.fillStyle = `${info.color}80`
    ctx.font = '9px Inter, system-ui, sans-serif'
    ctx.fillText(info.label, W - 6, top + 26)

  }, [siMode, wave])

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

  const info = SI_INFO[siMode]

  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <div className="flex items-center gap-2 px-1">
        {(['ideal', 'overdist', 'recruit'] as SIMode[]).map(m => {
          const inf = SI_INFO[m]
          const active = siMode === m
          return (
            <button key={m} onClick={() => setSiMode(m)}
              className={`px-3 py-1.5 rounded text-[9px] font-bold tracking-wider border transition-colors ${active ? 'border-white/15' : 'border-white/5 hover:border-white/10'}`}
              style={active ? { backgroundColor: `${inf.color}18`, color: inf.color } : { color: 'rgba(255,255,255,0.3)' }}
            >{inf.si}</button>
          )
        })}
        <button onClick={() => setPaused(!paused)} className="px-2 py-1 rounded text-[10px] font-semibold bg-white/[0.03] border border-white/8 text-white/40 hover:text-white/70 ml-auto">{paused ? '▶' : '⏸'}</button>
      </div>

      <canvas ref={canvasRef} className="w-full rounded-lg border border-white/8" style={{ height: 480, background: '#050a14' }} />

      <div className="rounded-lg p-2 border border-white/5" style={{ background: `${info.color}08` }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold" style={{ color: info.color }}>{info.si} — {info.shape}</span>
          <span className="text-[9px] text-white/30">|</span>
          <span className="text-[10px] font-bold" style={{ color: info.color }}>{info.label}</span>
        </div>
        <p className="text-[9px] font-mono" style={{ color: `${info.color}99` }}>{info.meaning}</p>
      </div>
    </div>
  )
}
