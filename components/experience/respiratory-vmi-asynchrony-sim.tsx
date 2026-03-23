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

export function RespiratoryVmiAsynchronySim({ className, fixedType }: { className?: string; fixedType?: AsyncType }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef  = useRef(0)
  const timeRef   = useRef(0)

  const [asyncType, setAsyncType] = useState<AsyncType>(fixedType ?? 'ineffective')
  const [paused, setPaused]       = useState(false)
  const isFixed = !!fixedType

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
      // Esforço muscular inspiratório durante expiração que NÃO dispara o ventilador
      // Na curva real: pequena deflexão negativa no fluxo e pressão DURANTE a fase expiratória
      case 'ineffective': {
        const n = normalWave(ph)

        if (cycleNum === 1 || cycleNum === 3) {
          // Durante a EXPIRAÇÃO do ciclo normal, paciente faz esforço que falha
          const effortStart = ti + te * 0.35  // no meio da expiração
          const effortDur = 0.35
          if (ph > effortStart && ph < effortStart + effortDur) {
            const ef = (ph - effortStart) / effortDur
            const effort = Math.sin(ef * Math.PI)
            return {
              P: n.P - 2.5 * effort,           // deflexão negativa na pressão
              F: n.F + 8 * effort,              // pequena deflexão positiva no fluxo (tenta inspirar)
              V: n.V + 15 * effort,             // volume mínimo oscila
            }
          }
          return n
        }
        return n
      }

      // ═══ DUPLO DISPARO ═══
      // Esforço inspiratório continua além do TI → segundo disparo sem expiração completa
      // Volume se EMPILHA (air stacking) — segundo VC soma ao primeiro
      case 'double': {
        if (cycleNum === 1 || cycleNum === 3) {
          // Primeiro ciclo encurtado + segundo ciclo empilhado
          const ti1 = ti * 0.85
          const gap = 0.15  // mini-expiração muito curta
          const ti2 = ti * 0.85
          const te2 = cycleSec - ti1 - gap - ti2

          if (ph < ti1) {
            // 1ª inspiração normal
            const frac = ph / ti1
            const rF = Math.min(ph / 0.06, 1)
            const rs = smooth(rF)
            return {
              P: peep + (vc / 40) * frac + 8 * (flowPeak / 60) * rs,
              F: flowPeak * rs,
              V: vc * frac,
            }
          } else if (ph < ti1 + gap) {
            // Mini-expiração incompleta (fluxo mal cruza zero)
            const ef = (ph - ti1) / gap
            return {
              P: peep + (vc / 40) * (1 - ef * 0.2),
              F: -flowPeak * 0.4 * Math.sin(ef * Math.PI),
              V: vc * (1 - ef * 0.15),  // quase não esvazia
            }
          } else if (ph < ti1 + gap + ti2) {
            // 2ª inspiração — volume EMPILHA sobre o residual
            const ph2 = ph - ti1 - gap
            const frac = ph2 / ti2
            const rF = Math.min(ph2 / 0.06, 1)
            const rs = smooth(rF)
            const residual = vc * 0.85  // volume que ficou do 1º ciclo
            const vc2 = vc * 0.8
            return {
              P: peep + ((residual + vc2 * frac) / 40) + 8 * (flowPeak / 60) * rs,
              F: flowPeak * 0.9 * rs,
              V: residual + vc2 * frac,  // EMPILHAMENTO — volume vai acima do normal!
            }
          } else {
            // Expiração do volume empilhado
            const ef = (ph - ti1 - gap - ti2) / te2
            const totalV = vc * 0.85 + vc * 0.8
            const expD = Math.exp(-ef * te2 / 0.6)
            return {
              P: peep + (totalV / 40) * expD,
              F: -flowPeak * 0.9 * expD,
              V: totalV * expD,
            }
          }
        }
        return normalWave(ph)
      }

      // ═══ DISPARO REVERSO ═══
      // Contração diafragmática reflexa causada pela insuflação PASSIVA (ciclos controlados)
      // Ocorre DURANTE a inspiração mecânica ou no final dela — NÃO na expiração
      // Pode gerar duplo disparo se ocorre no final da inspiração
      case 'reverse': {
        const n = normalWave(ph)

        if (cycleNum === 1 || cycleNum === 3) {
          // Contração reflexa no FINAL da inspiração mecânica (~70-100% do TI)
          const reflexStart = ti * 0.65
          const reflexDur = ti * 0.45

          if (ph > reflexStart && ph < reflexStart + reflexDur) {
            const ef = (ph - reflexStart) / reflexDur
            const reflex = Math.sin(ef * Math.PI)

            return {
              P: n.P + 4 * reflex,       // pico extra de pressão (esforço somado à máquina)
              F: n.F + 15 * reflex,       // aumento de fluxo (contração soma ao ventilador)
              V: n.V + 40 * (1 - Math.cos(ef * Math.PI)) / 2,  // volume extra
            }
          }

          // Se o reflexo é forte, pode continuar como mini-inspiração na expiração precoce
          if (ph > ti && ph < ti + 0.3) {
            const ef = (ph - ti) / 0.3
            const tail = 3 * Math.exp(-ef * 4) * (1 - ef)
            return {
              P: n.P + tail,
              F: n.F + tail * 3,
              V: n.V + 20 * Math.exp(-ef * 3),
            }
          }
          return n
        }
        return n
      }

      // ═══ AUTODISPARO ═══
      // Ventilador dispara SEM esforço do paciente — timing irregular
      // Causas: oscilação cardíaca, vazamento, água no circuito, sensibilidade excessiva
      // Ciclo normal mas com timing errado (antecipado) e sem esforço real
      case 'auto': {
        if (cycleNum === 2) {
          // Ciclo AUTO: dispara precocemente, no meio da expiração do ciclo anterior
          // Aparece como um ciclo extra com timing irregular
          const autoTi = ti * 0.7  // ciclo mais curto
          const autoTe = cycleSec - autoTi

          if (ph < autoTi) {
            const frac = ph / autoTi
            const rF = Math.min(ph / 0.06, 1)
            const rs = smooth(rF)
            return {
              P: peep + (vc * 0.6 / 40) * frac + 8 * (flowPeak * 0.7 / 60) * rs,
              F: flowPeak * 0.7 * rs,
              V: vc * 0.6 * frac,
            }
          } else {
            const ef = (ph - autoTi) / autoTe
            const expD = Math.exp(-ef * autoTe / 0.5)
            // Oscilações cardíacas visíveis na baseline
            const cardiac = 0.6 * Math.sin(ef * autoTe * Math.PI * 5)
            return {
              P: peep + (vc * 0.6 / 40) * expD + cardiac,
              F: -flowPeak * 0.5 * expD + cardiac * 2,
              V: vc * 0.6 * expD,
            }
          }
        }
        // Ciclos normais mas com oscilações cardíacas na baseline
        const n = normalWave(ph)
        if (ph > ti) {
          const cardiac = 0.5 * Math.sin(ph * Math.PI * 5)
          return { P: n.P + cardiac, F: n.F + cardiac * 1.5, V: n.V }
        }
        return n
      }

      // ═══ CICLAGEM PREMATURA ═══
      // TI_vent < TI_neural — ventilador cicla ANTES do paciente terminar de inspirar
      // Na curva: fluxo expiratório começa, mas paciente puxa de volta (esforço residual no fluxo)
      // Volume menor que esperado
      case 'premature': {
        if (cycleNum === 1 || cycleNum === 3) {
          const shortTi = ti * 0.5  // TI muito curto
          const longTe = cycleSec - shortTi
          const vcReduced = vc * 0.4  // volume reduzido pela ciclagem precoce

          if (ph < shortTi) {
            const frac = ph / shortTi
            const rF = Math.min(ph / 0.06, 1)
            const rs = smooth(rF)
            return {
              P: peep + (vcReduced / 40) * frac + 8 * (flowPeak / 60) * rs,
              F: flowPeak * rs,
              V: vcReduced * frac,
            }
          } else {
            const ef = (ph - shortTi) / longTe
            const expD = Math.exp(-ef * longTe / 0.5)

            // Paciente CONTINUA tentando inspirar por ~0.5s após ciclagem
            // Isso cria uma deflexão no fluxo (volta positivo brevemente) e queda na pressão
            let patientEffort = 0
            if (ph < shortTi + 0.5) {
              const pf = (ph - shortTi) / 0.5
              patientEffort = Math.sin(pf * Math.PI)
            }

            return {
              P: peep + (vcReduced / 40) * expD - 3 * patientEffort,  // queda de pressão pelo esforço
              F: -flowPeak * 0.5 * expD + flowPeak * 0.3 * patientEffort,  // fluxo volta positivo!
              V: vcReduced * expD + 30 * patientEffort,  // pequeno ganho de volume
            }
          }
        }
        return normalWave(ph)
      }

      // ═══ CICLAGEM TARDIA ═══
      // TI_vent > TI_neural — ventilador continua insuflando, paciente tenta expirar
      // PSV com fluxo desacelerante — ciclagem em % baixa do pico (ex: 10%)
      // Na curva: fluxo cai a zero e fica oscilando, pressão sobe acima do set
      case 'delayed': {
        if (cycleNum === 1 || cycleNum === 3) {
          const longTi = ti * 1.8  // TI muito longo
          const shortTe = cycleSec - longTi
          const pcvPressure = 15  // pressão controlada tipo PSV

          const peakF = flowPeak * 1.2

          if (ph < longTi) {
            const frac = ph / longTi
            const rF = Math.min(ph / 0.08, 1)
            const rs = smooth(rF)

            // Fluxo desacelerante (PSV) — cai rápido
            const flowDecay = peakF * Math.exp(-frac * longTi / 0.3)

            // Paciente tenta EXPIRAR a partir de ~50% do TI
            let expEffort = 0
            if (frac > 0.45) {
              const pf = (frac - 0.45) / 0.55
              expEffort = pf * pf * 0.8  // esforço expiratório crescente
            }

            // Fluxo: cai e pode ficar negativo quando paciente tenta expirar
            const F = flowDecay * rs - peakF * expEffort

            // Pressão: mantida pelo ventilador mas com spike pela luta do paciente
            const P = peep + pcvPressure * rs + 4 * expEffort

            // Volume: sobe rápido e depois platô/leve queda
            const V = vc * (1 - Math.exp(-frac * longTi / 0.35)) - vc * 0.1 * expEffort

            return { P, F, V }
          } else {
            // Expiração rápida (finalmente cicla)
            const ef = (ph - longTi) / shortTe
            const expD = Math.exp(-ef * shortTe / 0.3)
            return {
              P: peep + pcvPressure * Math.max(0, 1 - ((ph - longTi) / 0.08)),
              F: -peakF * 0.8 * expD,
              V: vc * 0.9 * expD,
            }
          }
        }
        return normalWave(ph)
      }

      // ═══ FLUXO INSUFICIENTE (Flow Starvation) ═══
      // VCV com fluxo constante (onda quadrada) mas BAIXO DEMAIS para a demanda
      // ASSINATURA: concavidade (scooping) na curva de PRESSÃO durante inspiração
      // A pressão sobe, depois CAI no meio (paciente puxa), e sobe novamente no final
      case 'flowStarve': {
        const lowFlow = 30  // fluxo baixo

        // TI mais longo porque fluxo é baixo (TI = VC/Flow)
        const tiLong = (vc / 1000) / (lowFlow / 60)
        const teLong = cycleSec - tiLong

        if (ph < tiLong) {
          const frac = ph / tiLong
          const rF = Math.min(ph / 0.08, 1)
          const rs = smooth(rF)

          // Fluxo: constante (onda quadrada) — é VCV
          const F = lowFlow * rs

          // Volume: rampa linear (VCV normal)
          const V = vc * frac

          // Pressão: CONCAVIDADE — sobe no início, cai no meio, sobe no final
          // Paciente faz esforço inspiratório vigoroso que "puxa" a pressão para baixo
          const pElastic = (vc / 40) * frac
          const pResistive = 8 * (lowFlow / 60) * rs
          // Esforço do paciente: máximo no meio da inspiração
          const demandDip = 6 * Math.sin(frac * Math.PI)  // concavidade forte
          const P = peep + pElastic + pResistive - demandDip

          return { P, F, V }
        } else {
          const ef = (ph - tiLong) / teLong
          const expD = Math.exp(-ef * teLong / 0.5)
          return {
            P: peep + (vc / 40) * expD,
            F: -lowFlow * 0.9 * expD,
            V: vc * expD,
          }
        }
      }

      // ═══ FLUXO EXCESSIVO ═══
      // PCV/PSV com Rise Time muito curto ou pressão muito alta
      // ASSINATURA: overshoot de pressão no início (pico > set pressure)
      // Fluxo tem pico muito alto e desacelera bruscamente
      case 'flowExcess': {
        const highPressure = 22  // pressão alta
        const peakF = 75  // fluxo pico muito alto

        if (ph < ti) {
          const frac = ph / ti
          const rF = Math.min(ph / 0.03, 1)  // rise time MUITO curto
          const rs = smooth(rF)

          // Pressão: OVERSHOOT no início, depois estabiliza
          const overshoot = frac < 0.12 ? 8 * Math.sin((frac / 0.12) * Math.PI) : 0
          const P = peep + highPressure * rs + overshoot

          // Fluxo: pico altíssimo com desaceleração brusca (PCV)
          const F = peakF * rs * Math.exp(-Math.max(0, frac - 0.05) * ti / 0.25)

          // Volume: exponencial (PCV)
          const V = vc * 1.1 * (1 - Math.exp(-frac * ti / 0.3))

          return { P, F, V }
        } else {
          const ef = (ph - ti) / te
          const expD = Math.exp(-ef * te / 0.4)
          return {
            P: peep + highPressure * Math.max(0, 1 - ((ph - ti) / 0.06)),
            F: -peakF * 0.6 * expD,
            V: vc * 1.1 * (1 - Math.exp(-1 * ti / 0.3)) * expD,
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
      {/* Type selector — only when not fixed */}
      {!isFixed && (
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
      )}

      {/* Pause + label */}
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

/* ── Individual exports for each asynchrony type ── */
export const AsyncIneffectiveSim = ({ className }: { className?: string }) => <RespiratoryVmiAsynchronySim className={className} fixedType="ineffective" />
export const AsyncDoubleSim      = ({ className }: { className?: string }) => <RespiratoryVmiAsynchronySim className={className} fixedType="double" />
export const AsyncReverseSim     = ({ className }: { className?: string }) => <RespiratoryVmiAsynchronySim className={className} fixedType="reverse" />
export const AsyncAutoSim        = ({ className }: { className?: string }) => <RespiratoryVmiAsynchronySim className={className} fixedType="auto" />
export const AsyncPrematureSim   = ({ className }: { className?: string }) => <RespiratoryVmiAsynchronySim className={className} fixedType="premature" />
export const AsyncDelayedSim     = ({ className }: { className?: string }) => <RespiratoryVmiAsynchronySim className={className} fixedType="delayed" />
export const AsyncFlowStarveSim  = ({ className }: { className?: string }) => <RespiratoryVmiAsynchronySim className={className} fixedType="flowStarve" />
export const AsyncFlowExcessSim  = ({ className }: { className?: string }) => <RespiratoryVmiAsynchronySim className={className} fixedType="flowExcess" />
