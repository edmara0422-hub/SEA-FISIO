'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

/* ──────────────────────────────────────────────────────────────
   ASSINCRONIAS PACIENTE-VENTILADOR
   8 tipos com curvas reais: Pressão, Fluxo, Volume
   Cada tipo mostra o padrão anormal característico
   ────────────────────────────────────────────────────────────── */

type AsyncType =
  | 'ineffective'   // Disparo Ineficaz
  | 'double'        // Duplo Disparo
  | 'reverse'       // Disparo Reverso
  | 'auto'          // Autodisparo
  | 'premature'     // Ciclagem Prematura
  | 'delayed'       // Ciclagem Tardia
  | 'flowStarve'    // Fluxo Insuficiente
  | 'flowExcess'    // Fluxo Excessivo

const ASYNC_INFO: Record<AsyncType, { label: string; short: string; color: string; desc: string }> = {
  ineffective: { label: 'Disparo Ineficaz', short: 'Ineficaz', color: '#f87171', desc: 'Esforço do paciente não inicia ciclo — deflexão na pressão sem fluxo' },
  double:      { label: 'Duplo Disparo',    short: 'Duplo',    color: '#fb923c', desc: 'Dois ciclos consecutivos — segundo antes de expiração completa' },
  reverse:     { label: 'Disparo Reverso',  short: 'Reverso',  color: '#a78bfa', desc: 'Contração reflexa DURANTE a insuflação mecânica' },
  auto:        { label: 'Autodisparo',      short: 'Auto',     color: '#fbbf24', desc: 'Ventilador dispara sem esforço do paciente — oscilação cardíaca' },
  premature:   { label: 'Ciclagem Prematura', short: 'Precoce', color: '#38bdf8', desc: 'TI ventilador < TI neural — ventilador cicla antes do paciente' },
  delayed:     { label: 'Ciclagem Tardia',  short: 'Tardia',   color: '#818cf8', desc: 'TI ventilador > TI neural — ventilador demora a ciclar' },
  flowStarve:  { label: 'Fluxo Insuficiente', short: 'Flow↓',  color: '#4ade80', desc: 'Demanda > fluxo ofertado — concavidade na curva de pressão (VCV)' },
  flowExcess:  { label: 'Fluxo Excessivo',  short: 'Flow↑',    color: '#f0abfc', desc: 'Fluxo/pressão alto demais — overshoot no início da inspiração' },
}

const smooth = (t: number) => t * t * (3 - 2 * t)

export function RespiratoryVmiAsynchronySim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef  = useRef(0)
  const timeRef   = useRef(0)

  const [asyncType, setAsyncType] = useState<AsyncType>('ineffective')
  const [paused, setPaused]       = useState(false)

  const peep = 5
  const rr   = 15
  const cycleSec = 60 / rr  // 4s

  /* ── Normal VCV baseline wave ── */
  const normalWave = useCallback((ph: number): { P: number; F: number; V: number } => {
    const ti = cycleSec * 0.30  // 1.2s
    const te = cycleSec - ti
    const vc = 450
    const flowPeak = 50
    const cest = 40
    const raw = 8
    const riseT = 0.08

    if (ph < ti) {
      const frac = ph / ti
      const rF = Math.min(ph / riseT, 1)
      const rs = rF * rF * (3 - 2 * rF)
      const F = flowPeak * rs
      const V = vc * frac
      const pE = (vc / cest) * Math.min(frac * 1.1, 1)
      const pR = raw * (flowPeak / 60) * rs
      const P = peep + pE + pR
      return { P, F, V }
    } else {
      const eFrac = (ph - ti) / te
      const tau = 0.5
      const exp = Math.exp(-eFrac * te / tau)
      return {
        P: peep + (vc / cest) * exp,
        F: -flowPeak * 0.7 * exp,
        V: vc * exp,
      }
    }
  }, [cycleSec, peep])

  /* ── Asynchrony wave generator ── */
  const wave = useCallback((t: number): { P: number; F: number; V: number } => {
    const ph = ((t % cycleSec) + cycleSec) % cycleSec
    const cycleNum = Math.floor(((t % (cycleSec * 4)) + cycleSec * 4) / cycleSec) % 4

    const ti = cycleSec * 0.30
    const te = cycleSec - ti
    const vc = 450
    const flowPeak = 50

    switch (asyncType) {

      // ═══ DISPARO INEFICAZ ═══
      // Ciclo 2 de cada 4: paciente tenta mas falha
      case 'ineffective': {
        if (cycleNum === 2) {
          // Ciclo com disparo ineficaz — esforço sem ciclo
          // Pequena deflexão negativa na pressão, sem fluxo significativo
          const effortStart = 0.15
          const effortDur = 0.3
          if (ph > effortStart && ph < effortStart + effortDur) {
            const ef = (ph - effortStart) / effortDur
            const effort = -2.5 * Math.sin(ef * Math.PI)  // deflexão de -2.5 cmH₂O
            return {
              P: peep + effort,
              F: effort * 1.5,  // pequeno fluxo oscilante
              V: 8 * Math.sin(ef * Math.PI),  // volume mínimo
            }
          }
          return { P: peep, F: 0, V: 0 }
        }
        return normalWave(ph)
      }

      // ═══ DUPLO DISPARO ═══
      // Ciclo 1 de cada 4: dois ciclos inspiratórios consecutivos
      case 'double': {
        if (cycleNum === 1) {
          const halfCycle = cycleSec * 0.5
          const miniTi = halfCycle * 0.55
          const miniTe = halfCycle - miniTi

          if (ph < halfCycle) {
            // Primeiro ciclo (encurtado)
            if (ph < miniTi) {
              const frac = ph / miniTi
              const rF = Math.min(ph / 0.06, 1)
              const rs = smooth(rF)
              return {
                P: peep + (vc * 0.6 / 40) * frac + 8 * (flowPeak / 60) * rs,
                F: flowPeak * 0.9 * rs * (1 - frac * 0.3),
                V: vc * 0.6 * frac,
              }
            } else {
              const ef = (ph - miniTi) / miniTe
              const exp = Math.exp(-ef * 4)
              return {
                P: peep + (vc * 0.6 / 40) * exp + 1,
                F: -flowPeak * 0.5 * exp,
                V: vc * 0.6 * exp * 0.7 + vc * 0.18,  // não esvazia completamente!
              }
            }
          } else {
            // Segundo ciclo (stacking — começa antes de esvaziar)
            const ph2 = ph - halfCycle
            const miniTi2 = miniTi
            const miniTe2 = halfCycle - miniTi2
            if (ph2 < miniTi2) {
              const frac = ph2 / miniTi2
              const rF = Math.min(ph2 / 0.06, 1)
              const rs = smooth(rF)
              const stackVol = vc * 0.18  // volume residual do primeiro ciclo
              return {
                P: peep + ((stackVol + vc * 0.55 * frac) / 40) + 8 * (flowPeak / 60) * rs,
                F: flowPeak * 0.85 * rs * (1 - frac * 0.3),
                V: stackVol + vc * 0.55 * frac,  // empilhamento!
              }
            } else {
              const ef = (ph2 - miniTi2) / miniTe2
              const exp = Math.exp(-ef * 3)
              const peakV = vc * 0.18 + vc * 0.55
              return {
                P: peep + (peakV / 40) * exp,
                F: -flowPeak * 0.65 * exp,
                V: peakV * exp,
              }
            }
          }
        }
        return normalWave(ph)
      }

      // ═══ DISPARO REVERSO ═══
      // Contração reflexa durante a fase expiratória
      case 'reverse': {
        if (cycleNum === 2) {
          const n = normalWave(ph)
          // Adicionar esforço reflexo durante expiração
          if (ph > ti + 0.3 && ph < ti + 0.3 + 0.5) {
            const ef = (ph - ti - 0.3) / 0.5
            const reflex = -3 * Math.sin(ef * Math.PI)  // esforço reflexo
            return {
              P: n.P + reflex,
              F: n.F + reflex * 8,  // perturbação no fluxo
              V: n.V + 30 * Math.sin(ef * Math.PI),  // pequeno volume adicional
            }
          }
          return n
        }
        return normalWave(ph)
      }

      // ═══ AUTODISPARO ═══
      // Ciclo fantasma disparado por oscilação cardíaca
      case 'auto': {
        if (cycleNum === 3) {
          // Ciclo normal no início
          if (ph < ti * 0.4) {
            // Mini-ciclo automático (não há esforço real)
            const frac = ph / (ti * 0.4)
            const rF = Math.min(ph / 0.05, 1)
            const rs = smooth(rF)
            return {
              P: peep + (vc * 0.25 / 40) * frac + 6 * (flowPeak * 0.5 / 60) * rs,
              F: flowPeak * 0.4 * rs * (1 - frac * 0.5),
              V: vc * 0.2 * frac,
            }
          } else if (ph < ti * 0.4 + 0.3) {
            // Rápida expiração do mini-volume
            const ef = (ph - ti * 0.4) / 0.3
            const exp = Math.exp(-ef * 5)
            return {
              P: peep + (vc * 0.2 / 40) * exp,
              F: -flowPeak * 0.3 * exp,
              V: vc * 0.2 * exp,
            }
          }
          // Oscilações cardíacas (causa)
          const cardiacOsc = 0.8 * Math.sin((ph - ti * 0.4 - 0.3) * Math.PI * 6)
          return { P: peep + cardiacOsc, F: cardiacOsc * 2, V: 3 * Math.abs(cardiacOsc) }
        }
        return normalWave(ph)
      }

      // ═══ CICLAGEM PREMATURA ═══
      // Ti_vent muito curto — paciente ainda quer inspirar
      case 'premature': {
        if (cycleNum === 1 || cycleNum === 3) {
          const shortTi = ti * 0.55  // Ti muito curto
          const longTe = cycleSec - shortTi

          if (ph < shortTi) {
            const frac = ph / shortTi
            const rF = Math.min(ph / 0.06, 1)
            const rs = smooth(rF)
            return {
              P: peep + (vc * 0.45 / 40) * frac + 8 * (flowPeak / 60) * rs,
              F: flowPeak * rs * (1 - frac * 0.2),
              V: vc * 0.45 * frac,
            }
          } else {
            const ef = (ph - shortTi) / longTe

            // Paciente ainda tenta inspirar por mais 0.4s após ciclagem
            let patientEffort = 0
            if (ph < shortTi + 0.4) {
              const pf = (ph - shortTi) / 0.4
              patientEffort = -2.5 * Math.sin(pf * Math.PI)  // esforço inspiratório residual
            }

            const exp = Math.exp(-ef * longTe / 0.5)
            return {
              P: peep + (vc * 0.45 / 40) * exp + patientEffort,
              F: -flowPeak * 0.6 * exp + patientEffort * 6,
              V: vc * 0.45 * exp,
            }
          }
        }
        return normalWave(ph)
      }

      // ═══ CICLAGEM TARDIA ═══
      // Ti_vent muito longo — paciente tenta expirar
      case 'delayed': {
        if (cycleNum === 1 || cycleNum === 3) {
          const longTi = ti * 1.6
          const shortTe = cycleSec - longTi

          if (ph < longTi) {
            const frac = ph / longTi
            const rF = Math.min(ph / 0.08, 1)
            const rs = smooth(rF)

            // Paciente tenta expirar no final (a partir de ~60% do Ti)
            let patientExpEffort = 0
            if (frac > 0.6) {
              const pf = (frac - 0.6) / 0.4
              patientExpEffort = 3 * pf * pf  // pressão extra tentando expirar
            }

            const baseF = flowPeak * rs * Math.max(0.1, 1 - frac * 1.2)
            return {
              P: peep + (vc * 0.9 / 40) * Math.min(frac * 1.5, 1) + 8 * (flowPeak / 60) * rs * Math.max(0, 1 - frac * 1.5) + patientExpEffort,
              F: Math.max(-5, baseF),
              V: vc * 0.9 * (1 - Math.exp(-frac * 3)),
            }
          } else {
            const ef = (ph - longTi) / shortTe
            const exp = Math.exp(-ef * shortTe / 0.35)
            return {
              P: peep + (vc * 0.9 / 40) * exp,
              F: -flowPeak * 0.8 * exp,
              V: vc * 0.9 * exp,
            }
          }
        }
        return normalWave(ph)
      }

      // ═══ FLUXO INSUFICIENTE (Flow Starvation) ═══
      // VCV com fluxo baixo — concavidade na pressão
      case 'flowStarve': {
        const lowFlow = 28  // fluxo muito baixo

        if (ph < ti * 1.4) {
          const frac = ph / (ti * 1.4)
          const rF = Math.min(ph / 0.08, 1)
          const rs = smooth(rF)

          // Pressão com concavidade (scooping) — paciente puxa mais do que o ventilador entrega
          const demand = 3 * Math.sin(frac * Math.PI)  // esforço do paciente
          const pE = (vc / 40) * frac
          const pR = 8 * (lowFlow / 60) * rs
          return {
            P: peep + pE + pR - demand,  // CONCAVIDADE característica
            F: lowFlow * rs,
            V: vc * frac,
          }
        } else {
          const ef = (ph - ti * 1.4) / (cycleSec - ti * 1.4)
          const exp = Math.exp(-ef * (cycleSec - ti * 1.4) / 0.5)
          return {
            P: peep + (vc / 40) * exp,
            F: -lowFlow * 0.8 * exp,
            V: vc * exp,
          }
        }
      }

      // ═══ FLUXO EXCESSIVO ═══
      // Overshoot de pressão no início
      case 'flowExcess': {
        const highFlow = 75
        const shortTi = ti * 0.7

        if (ph < shortTi) {
          const frac = ph / shortTi
          const rF = Math.min(ph / 0.04, 1)  // rise time muito curto
          const rs = smooth(rF)

          // Overshoot de pressão no início (pico acima do platô)
          const overshoot = frac < 0.15 ? 8 * Math.sin((frac / 0.15) * Math.PI) : 0

          const pE = (vc / 40) * frac
          const pR = 8 * (highFlow / 60) * rs
          return {
            P: peep + pE + pR + overshoot,
            F: highFlow * rs * (frac < 0.1 ? 1 : Math.exp(-(frac - 0.1) * 2)),
            V: vc * (1 - Math.exp(-frac * 5)),
          }
        } else {
          const ef = (ph - shortTi) / (cycleSec - shortTi)
          const exp = Math.exp(-ef * (cycleSec - shortTi) / 0.45)
          return {
            P: peep + (vc / 40) * exp,
            F: -highFlow * 0.6 * exp,
            V: vc * exp,
          }
        }
      }

      default:
        return normalWave(ph)
    }
  }, [asyncType, cycleSec, peep, normalWave])

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

    const windowSec = 12  // mais largo para ver padrões
    const samples = Math.min(gW * 2, 800)

    const toX = (frac: number) => left + frac * gW
    const info = ASYNC_INFO[asyncType]

    interface GraphDef {
      label: string; unit: string; color: string
      glow: string; min: number; max: number
      ticks: number[]; key: 'P' | 'F' | 'V'
    }

    const graphs: GraphDef[] = [
      { label: 'Paw',  unit: 'cmH₂O', color: '#22d3ee', glow: 'rgba(34,211,238,0.3)',  min: -3,  max: 35,  ticks: [0, 5, 15, 25], key: 'P' },
      { label: 'Flow', unit: 'L/min',  color: '#a78bfa', glow: 'rgba(167,139,250,0.3)', min: -50, max: 80,  ticks: [-30, 0, 30, 60], key: 'F' },
      { label: 'Vol',  unit: 'mL',     color: '#4ade80', glow: 'rgba(74,222,128,0.3)',  min: -20, max: 550, ticks: [0, 200, 400],     key: 'V' },
    ]

    graphs.forEach((g, gi) => {
      const gTop = top + gi * (gH + gap)
      const range = g.max - g.min
      const toY = (v: number) => gTop + gH - ((Math.min(g.max, Math.max(g.min, v)) - g.min) / range) * gH

      // Background
      ctx.fillStyle = 'rgba(255,255,255,0.008)'
      ctx.fillRect(left, gTop, gW, gH)

      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'
      ctx.lineWidth = 0.5
      ctx.strokeRect(left, gTop, gW, gH)

      // Grid
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

      // Label
      ctx.fillStyle = g.color
      ctx.font = 'bold 10px Inter, system-ui, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(g.label, left - 4, gTop + 12)
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.font = '7px Inter, system-ui, sans-serif'
      ctx.fillText(g.unit, left - 4, gTop + 21)

      // WAVEFORM
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

      // PEEP reference line (pressure)
      if (gi === 0) {
        ctx.setLineDash([3, 3])
        ctx.strokeStyle = 'rgba(251,191,36,0.25)'
        ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(left, toY(peep)); ctx.lineTo(left + gW, toY(peep)); ctx.stroke()
        ctx.setLineDash([])
      }

      // Zero line (flow)
      if (gi === 1) {
        ctx.setLineDash([2, 3])
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'
        ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(left, toY(0)); ctx.lineTo(left + gW, toY(0)); ctx.stroke()
        ctx.setLineDash([])
      }

      // Current value
      const now = wave(timeRef.current)
      const cv = now[g.key]
      ctx.fillStyle = g.color
      ctx.font = 'bold 13px "SF Mono", Menlo, monospace'
      ctx.textAlign = 'left'
      ctx.fillText(g.key === 'V' ? `${Math.max(0, cv).toFixed(0)}` : `${cv.toFixed(g.key === 'P' ? 1 : 0)}`, left + gW + 6, gTop + gH / 2 + 5)
    })

    // Asynchrony type indicator
    ctx.fillStyle = info.color
    ctx.font = 'bold 11px Inter, system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(info.label, W - 6, top + 14)

    // Marker arrows for anomaly cycles
    ctx.fillStyle = `${info.color}60`
    ctx.font = '8px "SF Mono", Menlo, monospace'
    ctx.textAlign = 'center'

    // Draw cycle markers at bottom
    const now = timeRef.current
    for (let c = -4; c <= 0; c++) {
      const cycleStart = Math.floor(now / cycleSec) * cycleSec + c * cycleSec
      const screenFrac = 1 - (now - cycleStart) / windowSec
      if (screenFrac < 0 || screenFrac > 1) continue
      const x = toX(screenFrac)

      const cycleIdx = Math.floor(((cycleStart / cycleSec) % 4 + 4)) % 4
      const isAnomaly = (asyncType === 'ineffective' && cycleIdx === 2) ||
                        (asyncType === 'double' && cycleIdx === 1) ||
                        (asyncType === 'reverse' && cycleIdx === 2) ||
                        (asyncType === 'auto' && cycleIdx === 3) ||
                        ((asyncType === 'premature' || asyncType === 'delayed') && (cycleIdx === 1 || cycleIdx === 3))

      if (isAnomaly) {
        // Red marker for anomaly cycles
        ctx.fillStyle = `${info.color}40`
        ctx.fillRect(x, top, 2, H - top - bot)

        ctx.fillStyle = info.color
        ctx.font = 'bold 8px "SF Mono", Menlo, monospace'
        ctx.fillText('⚠', x + 1, H - 2)
      }
    }

  }, [asyncType, wave, cycleSec, peep])

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

  const info = ASYNC_INFO[asyncType]
  const types: AsyncType[] = ['ineffective', 'double', 'reverse', 'auto', 'premature', 'delayed', 'flowStarve', 'flowExcess']

  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      {/* Type selector — 2 rows */}
      <div className="grid grid-cols-4 gap-1 px-1">
        {types.map(t => {
          const inf = ASYNC_INFO[t]
          const active = asyncType === t
          return (
            <button key={t} onClick={() => setAsyncType(t)}
              className={`px-1.5 py-1.5 rounded text-[8px] font-bold tracking-wider transition-colors border ${
                active ? 'border-white/15' : 'border-white/5 hover:border-white/10'
              }`}
              style={active ? { backgroundColor: `${inf.color}18`, color: inf.color } : { color: 'rgba(255,255,255,0.3)' }}
            >
              {inf.short}
            </button>
          )
        })}
      </div>

      {/* Pause button */}
      <div className="flex items-center gap-2 px-1">
        <button onClick={() => setPaused(!paused)}
          className="px-2 py-1 rounded text-[10px] font-semibold bg-white/[0.03] border border-white/8 text-white/40 hover:text-white/70"
        >{paused ? '▶' : '⏸'}</button>
        <div className="text-[9px] font-mono" style={{ color: info.color }}>{info.label}</div>
        <div className="text-[8px] text-white/20 font-mono ml-auto">⚠ = ciclo anômalo</div>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef}
        className="w-full rounded-lg border border-white/8"
        style={{ height: 520, background: '#050a14' }}
      />

      {/* Legend */}
      <div className="flex items-center justify-center gap-4">
        {[
          { c: '#22d3ee', l: 'Paw' },
          { c: '#a78bfa', l: 'Fluxo' },
          { c: '#4ade80', l: 'Volume' },
        ].map(x => (
          <div key={x.l} className="flex items-center gap-1">
            <div className="w-2.5 h-0.5 rounded" style={{ background: x.c }} />
            <span className="text-[8px] text-white/30 font-mono">{x.l}</span>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="rounded-lg p-2 border border-white/5" style={{ background: `${info.color}08` }}>
        <p className="text-[10px] font-mono" style={{ color: `${info.color}aa` }}>{info.desc}</p>
      </div>
    </div>
  )
}
