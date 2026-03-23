'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

/* ──────────────────────────────────────────────────────────────
   MONITOR VMI — VCV • PCV • PSV
   3 curvas: Pressão (Paw) • Fluxo (L/min) • Volume (mL)
   Scrolling contínuo — formas de onda reais de ventilador
   ────────────────────────────────────────────────────────────── */

type VmiMode = 'vcv' | 'pcv' | 'psv'

export function RespiratoryVmiVentilatorSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef  = useRef(0)
  const timeRef   = useRef(0)

  const [mode, setMode]     = useState<VmiMode>('vcv')
  const [paused, setPaused] = useState(false)

  // Parâmetros ventilatórios
  const [rr, setRr]         = useState(15)     // FR (rpm)
  const [peep, setPeep]     = useState(5)      // PEEP (cmH₂O)
  const [vc, setVc]         = useState(450)    // Volume Corrente (mL) - VCV
  const [flow, setFlow]     = useState(50)     // Fluxo (L/min) - VCV
  const [pip, setPip]       = useState(20)     // Pressão Inspiratória (cmH₂O) - PCV/PSV
  const [ps, setPs]         = useState(12)     // Pressão Suporte (cmH₂O) - PSV

  const cycleSec = 60 / rr

  // Rise time (tempo de pressurização)
  const riseT = 0.08

  /* ── Waveform generator ── */
  const wave = useCallback((t: number) => {
    const ph = ((t % cycleSec) + cycleSec) % cycleSec

    // === VCV — Volume Controlado ===
    if (mode === 'vcv') {
      // Ti = VC / Flow (convertido para segundos)
      const tiCalc = (vc / 1000) / (flow / 60) // VC em L / Flow em L/s
      const ti = Math.min(tiCalc, cycleSec * 0.55)
      const te = cycleSec - ti

      let P: number, F: number, V: number

      if (ph < ti) {
        // INSPIRAÇÃO — fluxo constante (onda quadrada)
        const frac = ph / ti

        // Fluxo: constante (square wave) com rise suave
        const rFrac = Math.min(ph / riseT, 1)
        const riseSm = rFrac * rFrac * (3 - 2 * rFrac)
        F = flow * riseSm

        // Volume: rampa linear
        V = vc * frac * riseSm + vc * Math.max(0, frac - riseT/ti) * (1 - riseSm)
        V = vc * Math.min(frac, 1)

        // Pressão: sobe gradualmente — PIP proporcional ao volume + resistência
        // P = PEEP + (VC/Cest)*frac + Resistência*fluxo
        const cest = 40 // mL/cmH₂O (complacência estimada)
        const raw = 8   // cmH₂O/(L/s)
        const pElast = (vc / cest) * Math.min(frac * 1.1, 1)
        const pRes = raw * (flow / 60) * riseSm
        P = peep + pElast + pRes

      } else {
        // EXPIRAÇÃO — passiva
        const eFrac = (ph - ti) / te
        const tau = 0.5 // constante de tempo (s)
        const expDecay = Math.exp(-eFrac * te / tau)

        F = -flow * 0.7 * expDecay
        V = vc * expDecay
        P = peep + (vc / 40) * expDecay
      }

      return { P, F, V }
    }

    // === PCV — Pressão Controlada ===
    if (mode === 'pcv') {
      const ti = cycleSec * 0.33
      const te = cycleSec - ti
      const pDriving = pip - peep // driving pressure

      let P: number, F: number, V: number

      if (ph < ti) {
        // INSPIRAÇÃO — pressão constante (onda quadrada)
        const rFrac = Math.min(ph / riseT, 1)
        const riseSm = rFrac * rFrac * (3 - 2 * rFrac)

        // Pressão: rise rápido até PIP, mantém constante
        P = peep + pDriving * riseSm

        // Fluxo: decelerating — pico no início, cai exponencialmente
        const tau = 0.4
        const peakFlow = (pDriving / 10) * 60 // L/min estimado
        if (ph < riseT) {
          F = peakFlow * riseSm
        } else {
          F = peakFlow * Math.exp(-(ph - riseT) / tau)
        }

        // Volume: exponencial (rápido no início, desacelera)
        const vMax = pDriving * 40 // estimativa com Cest=40
        V = vMax * (1 - Math.exp(-ph / tau))

      } else {
        // EXPIRAÇÃO
        const eFrac = (ph - ti) / te
        const tau = 0.45
        const expD = Math.exp(-eFrac * te / tau)
        const vMax = pDriving * 40 * (1 - Math.exp(-ti / 0.4))

        // Pressão: cai rapidamente para PEEP
        const rDown = Math.min((ph - ti) / riseT, 1)
        P = peep + pDriving * (1 - rDown * rDown * (3 - 2 * rDown)) * (ph - ti < riseT ? 1 : 0) + (ph - ti >= riseT ? 0 : 0)
        P = peep + (pDriving) * Math.max(0, 1 - ((ph - ti) / riseT))
        if (ph - ti > riseT) P = peep

        // Fluxo: negativo, exponencial
        const peakExpFlow = -((pDriving / 10) * 60) * 0.7
        F = peakExpFlow * expD

        // Volume: decai exponencialmente
        V = vMax * expD
      }

      return { P, F, V }
    }

    // === PSV — Pressão Suporte ===
    {
      // Similar a PCV mas com Ti variável (cicla por fluxo a 25% do pico)
      const pDriving = ps
      const tau = 0.45
      const peakFlow = (pDriving / 10) * 60
      const flowCycleThreshold = 0.25 // 25% do pico
      // Ti estimado: quando fluxo cai a 25% do pico
      const tiPSV = Math.min(-tau * Math.log(flowCycleThreshold) + riseT, cycleSec * 0.45)
      const te = cycleSec - tiPSV

      let P: number, F: number, V: number

      if (ph < tiPSV) {
        const rFrac = Math.min(ph / riseT, 1)
        const riseSm = rFrac * rFrac * (3 - 2 * rFrac)

        P = peep + pDriving * riseSm

        if (ph < riseT) {
          F = peakFlow * riseSm
        } else {
          F = peakFlow * Math.exp(-(ph - riseT) / tau)
        }

        const vMax = pDriving * 40
        V = vMax * (1 - Math.exp(-ph / tau))

      } else {
        const eFrac = (ph - tiPSV) / te
        const vMax = pDriving * 40 * (1 - Math.exp(-tiPSV / tau))
        const expD = Math.exp(-eFrac * te / 0.45)

        if (ph - tiPSV < riseT) {
          P = peep + pDriving * (1 - ((ph - tiPSV) / riseT))
        } else {
          P = peep
        }

        F = -peakFlow * 0.65 * expD
        V = vMax * expD
      }

      return { P, F, V }
    }
  }, [mode, rr, peep, vc, flow, pip, ps, cycleSec, riseT])

  /* ── Draw ── */
  const draw = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number, dt: number) => {
    timeRef.current += dt

    // Background
    ctx.fillStyle = '#050a14'
    ctx.fillRect(0, 0, W, H)

    // Layout — 3 gráficos empilhados
    const left = 58
    const right = 62
    const top = 10
    const bot = 10
    const gap = 22
    const gW = W - left - right
    const gH = (H - top - bot - gap * 2) / 3

    const windowSec = 8 // janela de visualização (segundos)
    const samples = Math.min(gW * 2, 800)

    const toX = (frac: number) => left + frac * gW

    // Ranges dinâmicos baseados no modo
    const pMax = mode === 'vcv' ? Math.max(35, peep + (vc / 40) + 15) : Math.max(30, pip + 5)
    const fMax = mode === 'vcv' ? flow + 10 : (pip - peep) * 6 + 15
    const vMax = mode === 'vcv' ? vc + 50 : (pip - peep) * 40 + 50

    interface GraphDef {
      label: string; unit: string; color: string
      glow: string; min: number; max: number
      ticks: number[]; key: 'P' | 'F' | 'V'
    }

    const pTicks: number[] = [0, peep]
    if (mode === 'vcv') { pTicks.push(Math.round(peep + vc/40 + 8 * flow/60)) }
    else { pTicks.push(mode === 'pcv' ? pip : peep + ps) }

    const graphs: GraphDef[] = [
      {
        label: 'Paw', unit: 'cmH₂O', color: '#22d3ee', glow: 'rgba(34,211,238,0.3)',
        min: -2, max: pMax,
        ticks: [...new Set([0, peep, Math.round(pMax * 0.7)])],
        key: 'P'
      },
      {
        label: 'Flow', unit: 'L/min', color: '#a78bfa', glow: 'rgba(167,139,250,0.3)',
        min: -fMax * 0.8, max: fMax,
        ticks: [-Math.round(fMax * 0.5), 0, Math.round(fMax * 0.7)],
        key: 'F'
      },
      {
        label: 'Vol', unit: 'mL', color: '#4ade80', glow: 'rgba(74,222,128,0.3)',
        min: -20, max: vMax,
        ticks: [0, Math.round(vMax * 0.5), Math.round(vMax * 0.8)],
        key: 'V'
      },
    ]

    graphs.forEach((g, gi) => {
      const gTop = top + gi * (gH + gap)
      const range = g.max - g.min
      const toY = (v: number) => gTop + gH - ((Math.min(g.max, Math.max(g.min, v)) - g.min) / range) * gH

      // Graph background
      ctx.fillStyle = 'rgba(255,255,255,0.008)'
      ctx.fillRect(left, gTop, gW, gH)

      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'
      ctx.lineWidth = 0.5
      ctx.strokeRect(left, gTop, gW, gH)

      // Grid lines + tick labels
      ctx.font = '9px "SF Mono", Menlo, monospace'
      ctx.textAlign = 'right'
      g.ticks.forEach(v => {
        const y = toY(v)
        if (y < gTop || y > gTop + gH) return
        ctx.strokeStyle = v === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'
        ctx.lineWidth = v === 0 ? 0.8 : 0.5
        ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(left + gW, y); ctx.stroke()
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.fillText(`${v}`, left - 5, y + 3)
      })

      // Label
      ctx.fillStyle = g.color
      ctx.font = 'bold 11px Inter, system-ui, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(g.label, left - 5, gTop + 13)
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      ctx.font = '8px Inter, system-ui, sans-serif'
      ctx.fillText(g.unit, left - 5, gTop + 23)

      // WAVEFORM — scrolling right to left
      ctx.save()
      ctx.beginPath()
      ctx.rect(left, gTop - 1, gW, gH + 2)
      ctx.clip()

      ctx.beginPath()
      ctx.strokeStyle = g.color
      ctx.lineWidth = 2.2
      ctx.shadowColor = g.glow
      ctx.shadowBlur = 8

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

      // Reference lines for PEEP (pressure graph)
      if (gi === 0) {
        ctx.setLineDash([4, 4])
        ctx.lineWidth = 0.6
        ctx.strokeStyle = 'rgba(251,191,36,0.3)'
        ctx.beginPath(); ctx.moveTo(left, toY(peep)); ctx.lineTo(left + gW, toY(peep)); ctx.stroke()

        // PIP/PS line
        const refP = mode === 'vcv' ? Math.round(peep + vc/40 + 8 * flow/60) : (mode === 'pcv' ? pip : peep + ps)
        ctx.strokeStyle = 'rgba(248,113,113,0.3)'
        ctx.beginPath(); ctx.moveTo(left, toY(refP)); ctx.lineTo(left + gW, toY(refP)); ctx.stroke()
        ctx.setLineDash([])
      }

      // Zero line for flow
      if (gi === 1) {
        ctx.setLineDash([2, 3])
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'
        ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(left, toY(0)); ctx.lineTo(left + gW, toY(0)); ctx.stroke()
        ctx.setLineDash([])
      }

      // Current value (right side)
      const now = wave(timeRef.current)
      const cv = now[g.key]
      ctx.fillStyle = g.color
      ctx.font = 'bold 14px "SF Mono", Menlo, monospace'
      ctx.textAlign = 'left'
      const text = g.key === 'V' ? `${Math.max(0, cv).toFixed(0)}` : `${cv.toFixed(g.key === 'P' ? 1 : 0)}`
      ctx.fillText(text, left + gW + 8, gTop + gH / 2 + 5)
    })

    // Mode indicator (top-right area)
    const infoX = W - 6
    const infoY = top + 8
    ctx.textAlign = 'right'

    // Mode name
    const modeColors: Record<VmiMode, string> = { vcv: '#22d3ee', pcv: '#f97316', psv: '#a78bfa' }
    const modeNames: Record<VmiMode, string> = { vcv: 'VCV', pcv: 'PCV', psv: 'PSV' }
    ctx.fillStyle = modeColors[mode]
    ctx.font = 'bold 13px "SF Mono", Menlo, monospace'
    ctx.fillText(modeNames[mode], infoX, infoY + 4)

    // Parameters
    ctx.font = '8px "SF Mono", Menlo, monospace'
    let iy = infoY + 22
    const param = (label: string, val: string, col: string) => {
      ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillText(label, infoX, iy); iy += 11
      ctx.fillStyle = col; ctx.font = 'bold 10px "SF Mono", Menlo, monospace'; ctx.fillText(val, infoX, iy); iy += 14
      ctx.font = '8px "SF Mono", Menlo, monospace'
    }

    param('FR', `${rr} rpm`, 'rgba(255,255,255,0.5)')
    param('PEEP', `${peep}`, '#fbbf24')

    if (mode === 'vcv') {
      param('VC', `${vc} mL`, '#4ade80')
      param('Flow', `${flow} L/m`, '#a78bfa')
    } else if (mode === 'pcv') {
      param('PIP', `${pip}`, '#f97316')
      param('ΔP', `${pip - peep}`, '#f87171')
    } else {
      param('PS', `${ps}`, '#a78bfa')
      param('PS+P', `${ps + peep}`, '#f0abfc')
    }

    // Cycle info
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.font = '7px "SF Mono", Menlo, monospace'
    ctx.fillText(`TCiclo: ${cycleSec.toFixed(2)}s`, infoX, iy + 6)
    const ieRatio = mode === 'vcv'
      ? (1 / ((cycleSec / Math.min((vc/1000)/(flow/60), cycleSec*0.55)) - 1)).toFixed(1)
      : (1 / ((cycleSec / (cycleSec * 0.33)) - 1)).toFixed(1)
    ctx.fillText(`I:E 1:${ieRatio}`, infoX, iy + 16)

  }, [mode, rr, peep, vc, flow, pip, ps, wave, cycleSec])

  /* ── Animation loop ── */
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

  /* ── param button helper ── */
  const PB = ({ label, val, unit, color, min, max, step = 1, set }: {
    label: string; val: number; unit: string; color: string
    min: number; max: number; step?: number; set: (v: number) => void
  }) => (
    <div className="flex items-center gap-1">
      <span className="text-[9px] font-mono font-bold" style={{ color }}>{label}</span>
      <button onClick={() => set(Math.max(min, val - step))}
        className="w-5 h-5 rounded bg-white/[0.04] text-white/40 text-xs hover:bg-white/10 flex items-center justify-center">−</button>
      <span className="text-[11px] font-bold font-mono w-7 text-center" style={{ color }}>{val}</span>
      <button onClick={() => set(Math.min(max, val + step))}
        className="w-5 h-5 rounded bg-white/[0.04] text-white/40 text-xs hover:bg-white/10 flex items-center justify-center">+</button>
      <span className="text-[7px] text-white/15 font-mono">{unit}</span>
    </div>
  )

  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      {/* Mode selector */}
      <div className="flex flex-wrap items-center gap-2 px-1">
        <div className="flex rounded-md overflow-hidden border border-white/10">
          {(['vcv', 'pcv', 'psv'] as VmiMode[]).map(m => {
            const cols: Record<VmiMode, string> = { vcv: 'cyan', pcv: 'orange', psv: 'violet' }
            const active = mode === m
            return (
              <button key={m} onClick={() => setMode(m)}
                className={`px-3 py-1 text-[10px] font-bold tracking-wider transition-colors ${
                  active ? `bg-${cols[m]}-500/20 text-${cols[m]}-400` : 'bg-white/[0.03] text-white/25 hover:text-white/50'
                }`}
                style={active ? { backgroundColor: `color-mix(in srgb, ${cols[m] === 'cyan' ? '#22d3ee' : cols[m] === 'orange' ? '#f97316' : '#a78bfa'} 15%, transparent)`, color: cols[m] === 'cyan' ? '#22d3ee' : cols[m] === 'orange' ? '#f97316' : '#a78bfa' } : undefined}
              >{m.toUpperCase()}</button>
            )
          })}
        </div>

        <button onClick={() => setPaused(!paused)}
          className="px-2 py-1 rounded text-[10px] font-semibold bg-white/[0.03] border border-white/8 text-white/40 hover:text-white/70"
        >{paused ? '▶' : '⏸'}</button>

        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[9px] text-white/30 font-mono">FR</span>
          <input type="range" min={6} max={35} value={rr} onChange={e => setRr(+e.target.value)}
            className="w-16 h-0.5 accent-white/50" />
          <span className="text-[9px] text-white/50 font-mono w-6">{rr}</span>
        </div>
      </div>

      {/* Parameters */}
      <div className="flex flex-wrap items-center gap-3 px-1">
        <PB label="PEEP" val={peep} unit="cmH₂O" color="#fbbf24" min={0} max={20} set={setPeep} />

        {mode === 'vcv' && (
          <>
            <PB label="VC" val={vc} unit="mL" color="#4ade80" min={200} max={700} step={50} set={setVc} />
            <PB label="Flow" val={flow} unit="L/min" color="#a78bfa" min={20} max={80} step={5} set={setFlow} />
          </>
        )}
        {mode === 'pcv' && (
          <PB label="PIP" val={pip} unit="cmH₂O" color="#f97316" min={peep + 5} max={40} set={setPip} />
        )}
        {mode === 'psv' && (
          <PB label="PS" val={ps} unit="cmH₂O" color="#a78bfa" min={5} max={25} set={setPs} />
        )}
      </div>

      {/* Monitor canvas */}
      <canvas ref={canvasRef}
        className="w-full rounded-lg border border-white/8"
        style={{ height: 560, background: '#050a14' }}
      />

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

      {/* Mode description */}
      <div className="text-center px-2">
        {mode === 'vcv' && (
          <p className="text-[10px] text-white/25 font-mono">
            VCV: Volume fixo + Fluxo constante (onda quadrada) — Pressão varia conforme complacência e resistência
          </p>
        )}
        {mode === 'pcv' && (
          <p className="text-[10px] text-white/25 font-mono">
            PCV: Pressão fixa (onda quadrada) + Fluxo desacelerante — Volume varia conforme complacência
          </p>
        )}
        {mode === 'psv' && (
          <p className="text-[10px] text-white/25 font-mono">
            PSV: Paciente dispara + Pressão suporte — Cicla quando fluxo cai a 25% do pico
          </p>
        )}
      </div>
    </div>
  )
}
