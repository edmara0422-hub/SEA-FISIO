'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

/* ──────────────────────────────────────────────────────────────
   MONITOR de VENTILAÇÃO MECÂNICA — CPAP vs BIPAP
   3 curvas reais: Pressão × Fluxo × Volume
   Waveforms fiéis aos monitores de VM reais
   ────────────────────────────────────────────────────────────── */

type Mode = 'cpap' | 'bipap'

// Smoothstep for transitions
const smoothstep = (t: number) => t * t * (3 - 2 * t)

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

  // Derived
  const cycleSec  = 60 / rr
  const tiRatio   = 0.4  // I:E ~1:1.5
  const ti        = cycleSec * tiRatio
  const te        = cycleSec - ti
  const riseTime  = 0.12 // 120ms pressure rise/fall (realistic)

  /* ──────────────── Waveform generators ──────────────── */

  // Returns { pressure, flow, volume } at time t
  const getWaveforms = useCallback((t: number) => {
    const phase = ((t % cycleSec) + cycleSec) % cycleSec

    if (mode === 'cpap') {
      // CPAP: constant pressure, patient breathes spontaneously
      // Pressure: small oscillations around set CPAP
      // Flow: sinusoidal-ish spontaneous breathing
      // Volume: integral of flow

      // CPAP: pressão constante (só PEEP), paciente respira espontaneamente
      // Fluxo e volume são BAIXOS — gerados apenas pelo esforço do paciente

      // Pressure: quase constante, oscilação mínima (~0.5 cmH₂O)
      const pOscillation = phase < ti
        ? -0.5 * Math.sin((phase / ti) * Math.PI)
        : 0.3 * Math.sin(((phase - ti) / te) * Math.PI)
      const pressure = cpap + pOscillation

      // Flow: respiração espontânea suave (baixa amplitude ~20 L/min)
      let flow: number
      if (phase < ti) {
        const frac = phase / ti
        flow = 0.25 * Math.sin(frac * Math.PI)
      } else {
        const frac = (phase - ti) / te
        flow = -0.18 * Math.sin(frac * Math.PI)
      }

      // Volume: VC espontâneo ~350 mL
      let volume: number
      if (phase < ti) {
        const frac = phase / ti
        volume = 350 * (0.5 - 0.5 * Math.cos(frac * Math.PI))
      } else {
        const frac = (phase - ti) / te
        volume = 350 * (0.5 + 0.5 * Math.cos(frac * Math.PI))
      }

      return { pressure, flow: flow * 60, volume }
    } else {
      // BIPAP: two pressure levels with proper transitions
      let pressure: number
      let flow: number
      let volume: number

      const ps = ipap - epap

      if (phase < riseTime) {
        // Rising edge: EPAP → IPAP
        const frac = smoothstep(Math.min(1, phase / riseTime))
        pressure = epap + (ipap - epap) * frac
        // Peak inspiratory flow during rise
        flow = (ps / 8) * frac * 1.2
      } else if (phase < ti - riseTime * 0.5) {
        // Plateau at IPAP - decelerating flow
        pressure = ipap
        const platFrac = (phase - riseTime) / (ti - riseTime * 1.5)
        // Decelerating flow pattern (characteristic of pressure support)
        flow = (ps / 8) * Math.exp(-platFrac * 3.5)
      } else if (phase < ti) {
        // Falling edge: IPAP → EPAP (start)
        const frac = smoothstep((phase - (ti - riseTime * 0.5)) / riseTime)
        pressure = ipap - (ipap - epap) * frac
        flow = (ps / 8) * 0.05 * (1 - frac)
      } else if (phase < ti + riseTime * 0.3) {
        // Transition to expiration
        const frac = (phase - ti) / (riseTime * 0.3)
        pressure = epap + (ipap - epap) * (1 - smoothstep(frac)) * 0.1
        // Expiratory flow starts
        flow = -(ps / 6) * smoothstep(frac)
      } else {
        // Expiratory phase at EPAP - passive expiratory flow
        pressure = epap
        const expFrac = (phase - ti - riseTime * 0.3) / (te - riseTime * 0.3)
        flow = -(ps / 6) * Math.exp(-expFrac * 3.5)
      }

      // Volume: integral approximation
      if (phase < ti) {
        const frac = phase / ti
        // Volume rises during inspiration
        const vMax = ps * 30 + 100 // ~VC depends on PS
        volume = vMax * (1 - Math.exp(-frac * 4))
      } else {
        const frac = (phase - ti) / te
        const vMax = ps * 30 + 100
        const peakVol = vMax * (1 - Math.exp(-4))
        volume = peakVol * Math.exp(-frac * 3.5)
      }

      return { pressure, flow: flow * 60, volume }
    }
  }, [mode, cpap, ipap, epap, cycleSec, ti, te, riseTime])

  /* ──────────────── Draw ──────────────── */
  const draw = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number, dt: number) => {
    timeRef.current += dt

    // Dark monitor background
    ctx.fillStyle = '#050a12'
    ctx.fillRect(0, 0, W, H)

    // Monitor border
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    ctx.strokeRect(1, 1, W - 2, H - 2)

    const pad = { left: 58, right: 80, top: 14, gap: 6 }
    const gW = W - pad.left - pad.right
    const numGraphs = 3
    const totalGap = pad.gap * (numGraphs - 1)
    const graphH = (H - pad.top - 10 - totalGap) / numGraphs

    const windowSec = 6 // 6 seconds window
    const samples = 500

    const toX = (sec: number) => pad.left + (sec / windowSec) * gW

    // Current time for scan line
    const scanPos = (timeRef.current % windowSec) / windowSec

    // Waveform configs
    const graphs = [
      {
        label: 'Paw', unit: 'cmH₂O',
        color: '#22d3ee', // cyan
        min: -2, max: 25,
        gridLines: [0, 5, 10, 15, 20],
        getValue: (w: { pressure: number; flow: number; volume: number }) => w.pressure,
        currentLabel: (v: number) => `${v.toFixed(0)}`,
      },
      {
        label: 'Fluxo', unit: 'L/min',
        color: '#a78bfa', // violet
        min: -60, max: 80,
        gridLines: [-40, 0, 40],
        getValue: (w: { pressure: number; flow: number; volume: number }) => w.flow,
        currentLabel: (v: number) => `${v.toFixed(0)}`,
      },
      {
        label: 'Vol', unit: 'mL',
        color: '#4ade80', // green
        min: -20, max: 500,
        gridLines: [0, 200, 400],
        getValue: (w: { pressure: number; flow: number; volume: number }) => w.volume,
        currentLabel: (v: number) => `${v.toFixed(0)}`,
      },
    ]

    graphs.forEach((g, gi) => {
      const gTop = pad.top + gi * (graphH + pad.gap)
      const gBot = gTop + graphH
      const range = g.max - g.min

      const toY = (v: number) => gBot - ((v - g.min) / range) * graphH

      // Graph background
      ctx.fillStyle = 'rgba(255,255,255,0.015)'
      ctx.fillRect(pad.left, gTop, gW, graphH)

      // Grid lines
      g.gridLines.forEach(v => {
        const y = toY(v)
        ctx.strokeStyle = v === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'
        ctx.lineWidth = v === 0 ? 1 : 0.5
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + gW, y); ctx.stroke()

        // Grid value
        ctx.fillStyle = 'rgba(255,255,255,0.25)'
        ctx.font = '9px "SF Mono", Menlo, monospace'
        ctx.textAlign = 'right'
        ctx.fillText(`${v}`, pad.left - 6, y + 3)
      })

      // Label on left
      ctx.fillStyle = g.color
      ctx.font = 'bold 11px Inter, system-ui, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(g.label, pad.left - 6, gTop + 12)

      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.font = '8px Inter, system-ui, sans-serif'
      ctx.fillText(g.unit, pad.left - 6, gTop + 23)

      // Draw waveform trace (sweeping)
      ctx.beginPath()
      ctx.strokeStyle = g.color
      ctx.lineWidth = 2
      ctx.shadowColor = g.color
      ctx.shadowBlur = 4

      let lastVal = 0
      let hasStarted = false

      for (let i = 0; i <= samples; i++) {
        const frac = i / samples
        const sec = frac * windowSec
        const t = timeRef.current - (scanPos * windowSec - sec)

        // Only draw behind the scan line
        if (frac > scanPos + 0.01) break

        const waveforms = getWaveforms(t)
        const val = g.getValue(waveforms)
        lastVal = val
        const x = toX(sec)
        const y = toY(val)

        if (!hasStarted) { ctx.moveTo(x, y); hasStarted = true }
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0

      // Draw "old" trace (faded, ahead of scan line)
      ctx.beginPath()
      ctx.strokeStyle = g.color.replace(')', ', 0.15)').replace('rgb', 'rgba')
      ctx.lineWidth = 1.5

      let oldStarted = false
      for (let i = 0; i <= samples; i++) {
        const frac = i / samples
        if (frac < scanPos + 0.03) continue

        const sec = frac * windowSec
        const t = timeRef.current - windowSec + sec - scanPos * windowSec
        const waveforms = getWaveforms(t)
        const val = g.getValue(waveforms)
        const x = toX(sec)
        const y = toY(val)

        if (!oldStarted) { ctx.moveTo(x, y); oldStarted = true }
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Scan line (vertical sweep)
      const scanX = pad.left + scanPos * gW
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(scanX, gTop); ctx.lineTo(scanX, gBot); ctx.stroke()

      // Clear zone ahead of scan (erase band)
      const clearW = gW * 0.04
      const grad = ctx.createLinearGradient(scanX, 0, scanX + clearW, 0)
      grad.addColorStop(0, 'rgba(5,10,18,0)')
      grad.addColorStop(0.3, 'rgba(5,10,18,1)')
      grad.addColorStop(1, 'rgba(5,10,18,0)')
      ctx.fillStyle = grad
      ctx.fillRect(scanX, gTop, clearW, graphH)

      // Current value display (right side)
      const currentWaveforms = getWaveforms(timeRef.current)
      const currentVal = g.getValue(currentWaveforms)
      ctx.fillStyle = g.color
      ctx.font = 'bold 16px "SF Mono", Menlo, monospace'
      ctx.textAlign = 'left'
      ctx.fillText(g.currentLabel(currentVal), pad.left + gW + 10, gTop + graphH / 2 + 6)

      // Separator line
      if (gi < numGraphs - 1) {
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(pad.left, gBot + pad.gap / 2)
        ctx.lineTo(pad.left + gW, gBot + pad.gap / 2)
        ctx.stroke()
      }
    })

    // Mode indicator (top-right)
    const modeLabel = mode === 'cpap' ? 'CPAP' : 'BIPAP'
    const modeColor = mode === 'cpap' ? '#22d3ee' : '#818cf8'

    ctx.fillStyle = modeColor
    ctx.font = 'bold 13px "SF Mono", Menlo, monospace'
    ctx.textAlign = 'right'
    ctx.fillText(modeLabel, W - 12, pad.top + 14)

    // Parameters display (right column, below mode)
    ctx.font = '10px "SF Mono", Menlo, monospace'
    let infoY = pad.top + 34

    if (mode === 'cpap') {
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.fillText(`CPAP`, W - 12, infoY); infoY += 14
      ctx.fillStyle = '#22d3ee'
      ctx.fillText(`${cpap} cmH₂O`, W - 12, infoY); infoY += 20
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.fillText(`IPAP`, W - 12, infoY); infoY += 13
      ctx.fillStyle = '#818cf8'
      ctx.fillText(`${ipap}`, W - 12, infoY); infoY += 16

      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.fillText(`EPAP`, W - 12, infoY); infoY += 13
      ctx.fillStyle = '#fbbf24'
      ctx.fillText(`${epap}`, W - 12, infoY); infoY += 16

      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.fillText(`PS`, W - 12, infoY); infoY += 13
      ctx.fillStyle = '#f0abfc'
      ctx.fillText(`${ipap - epap}`, W - 12, infoY); infoY += 16
    }

    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.fillText(`FR`, W - 12, infoY); infoY += 13
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillText(`${rr}`, W - 12, infoY)

    // IPAP/EPAP reference lines on pressure graph (BIPAP only)
    if (mode === 'bipap') {
      const pTop = pad.top
      const pBot = pTop + graphH
      const pRange = 25 - (-2)
      const ipapY = pBot - ((ipap - (-2)) / pRange) * graphH
      const epapY = pBot - ((epap - (-2)) / pRange) * graphH

      ctx.setLineDash([3, 3])
      ctx.lineWidth = 0.8

      ctx.strokeStyle = 'rgba(129,140,248,0.3)'
      ctx.beginPath(); ctx.moveTo(pad.left, ipapY); ctx.lineTo(pad.left + gW, ipapY); ctx.stroke()

      ctx.strokeStyle = 'rgba(251,191,36,0.3)'
      ctx.beginPath(); ctx.moveTo(pad.left, epapY); ctx.lineTo(pad.left + gW, epapY); ctx.stroke()

      ctx.setLineDash([])
    } else {
      // CPAP reference line
      const pTop = pad.top
      const pBot = pTop + graphH
      const pRange = 25 - (-2)
      const cpapY = pBot - ((cpap - (-2)) / pRange) * graphH

      ctx.setLineDash([3, 3])
      ctx.lineWidth = 0.8
      ctx.strokeStyle = 'rgba(34,211,238,0.3)'
      ctx.beginPath(); ctx.moveTo(pad.left, cpapY); ctx.lineTo(pad.left + gW, cpapY); ctx.stroke()
      ctx.setLineDash([])
    }

  }, [mode, cpap, ipap, epap, rr, getWaveforms, cycleSec, ti, te])

  /* ──────────────── Animation loop ──────────────── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let lastTime = 0
    const animate = (now: number) => {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016
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
      draw(ctx, W, H, paused ? 0 : dt)
      ctx.restore()

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [draw, paused])

  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      {/* Top controls */}
      <div className="flex flex-wrap items-center gap-2 px-1">
        {/* Mode toggle */}
        <div className="flex rounded-md overflow-hidden border border-white/10">
          <button
            onClick={() => setMode('cpap')}
            className={`px-3 py-1 text-[10px] font-bold tracking-wider transition-all ${
              mode === 'cpap'
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-white/[0.03] text-white/30 hover:text-white/50'
            }`}
          >CPAP</button>
          <button
            onClick={() => setMode('bipap')}
            className={`px-3 py-1 text-[10px] font-bold tracking-wider transition-all ${
              mode === 'bipap'
                ? 'bg-indigo-500/20 text-indigo-400'
                : 'bg-white/[0.03] text-white/30 hover:text-white/50'
            }`}
          >BIPAP</button>
        </div>

        <button
          onClick={() => setPaused(!paused)}
          className="px-2 py-1 rounded text-[10px] font-semibold bg-white/[0.03] border border-white/8 text-white/40 hover:text-white/70"
        >{paused ? '▶' : '⏸'}</button>

        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[9px] text-white/30 font-mono">FR</span>
          <input type="range" min={8} max={30} value={rr} onChange={e => setRr(+e.target.value)}
            className="w-16 h-0.5 accent-cyan-400" />
          <span className="text-[9px] text-white/50 font-mono w-8">{rr}</span>
        </div>
      </div>

      {/* Parameter controls */}
      <div className="flex flex-wrap items-center gap-2 px-1">
        {mode === 'cpap' ? (
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-cyan-400/60 font-mono font-bold">CPAP</span>
            <button onClick={() => setCpap(Math.max(4, cpap - 1))}
              className="w-5 h-5 rounded bg-white/[0.04] text-white/40 text-xs hover:bg-white/10 flex items-center justify-center">−</button>
            <span className="text-xs font-bold text-cyan-400 font-mono w-6 text-center">{cpap}</span>
            <button onClick={() => setCpap(Math.min(20, cpap + 1))}
              className="w-5 h-5 rounded bg-white/[0.04] text-white/40 text-xs hover:bg-white/10 flex items-center justify-center">+</button>
            <span className="text-[8px] text-white/25 font-mono">cmH₂O</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-indigo-400/60 font-mono font-bold">IPAP</span>
              <button onClick={() => setIpap(Math.max(epap + 2, ipap - 1))}
                className="w-5 h-5 rounded bg-white/[0.04] text-white/40 text-xs hover:bg-white/10 flex items-center justify-center">−</button>
              <span className="text-xs font-bold text-indigo-400 font-mono w-5 text-center">{ipap}</span>
              <button onClick={() => setIpap(Math.min(25, ipap + 1))}
                className="w-5 h-5 rounded bg-white/[0.04] text-white/40 text-xs hover:bg-white/10 flex items-center justify-center">+</button>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-amber-400/60 font-mono font-bold">EPAP</span>
              <button onClick={() => setEpap(Math.max(3, epap - 1))}
                className="w-5 h-5 rounded bg-white/[0.04] text-white/40 text-xs hover:bg-white/10 flex items-center justify-center">−</button>
              <span className="text-xs font-bold text-amber-400 font-mono w-5 text-center">{epap}</span>
              <button onClick={() => setEpap(Math.min(ipap - 2, epap + 1))}
                className="w-5 h-5 rounded bg-white/[0.04] text-white/40 text-xs hover:bg-white/10 flex items-center justify-center">+</button>
            </div>
            <div className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/6">
              <span className="text-[9px] text-white/30 font-mono">PS </span>
              <span className="text-[11px] font-bold text-fuchsia-300 font-mono">{ipap - epap}</span>
            </div>
          </>
        )}
      </div>

      {/* Canvas — monitor screen */}
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border border-white/8"
        style={{ height: 380, background: '#050a12' }}
      />

      {/* Bottom legend */}
      <div className="flex items-center justify-center gap-4 px-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded" style={{ background: '#22d3ee' }} />
          <span className="text-[9px] text-white/40 font-mono">Paw (cmH₂O)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded" style={{ background: '#a78bfa' }} />
          <span className="text-[9px] text-white/40 font-mono">Fluxo (L/min)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded" style={{ background: '#4ade80' }} />
          <span className="text-[9px] text-white/40 font-mono">Volume (mL)</span>
        </div>
      </div>
    </div>
  )
}
