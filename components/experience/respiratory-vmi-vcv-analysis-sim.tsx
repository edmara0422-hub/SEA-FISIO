'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

/* ──────────────────────────────────────────────────────────────
   VCV ANÁLISE GRÁFICA COMPLETA
   Pressão, Fluxo e Volume com pontos legendados
   Com/Sem Pausa | Stress Index | P1/P2 Heterogeneidade
   ────────────────────────────────────────────────────────────── */

type ViewMode = 'normal' | 'noPause' | 'stressIndex' | 'p1p2'
type SIMode = 'ideal' | 'overdist' | 'recruit'
type P1P2Mode = 'normal' | 'pendelluft'
type TriggerMode = 'cmv' | 'ac'  // CMV = tempo (JT), A/C = sensibilidade

const COLORS = {
  pressure: '#fbbf24',   // amarelo
  flow: '#f472b6',       // rosa
  volume: '#4ade80',     // verde
  peep: '#6b7280',
  grid: 'rgba(255,255,255,0.08)',
  gridMajor: 'rgba(255,255,255,0.15)',
  bg: '#111111',
  label: '#ffffff',
  labelBg: 'rgba(0,0,0,0.7)',
  highlight: '#ef4444',
  p1: '#ef4444',
  p2: '#3b82f6',
}

const VIEW_LABELS: Record<ViewMode, string> = {
  normal: 'Com Pausa',
  noPause: 'Sem Pausa',
  stressIndex: 'Stress Index',
  p1p2: 'P1 / P2',
}

export function RespiratoryVmiVcvAnalysisSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const timeRef = useRef(0)

  const [viewMode, setViewMode] = useState<ViewMode>('normal')
  const [siMode, setSiMode] = useState<SIMode>('ideal')
  const [p1p2Mode, setP1p2Mode] = useState<P1P2Mode>('normal')
  const [triggerMode, setTriggerMode] = useState<TriggerMode>('cmv')
  const [paused, setPaused] = useState(false)
  const [activeLabel, setActiveLabel] = useState<number | null>(null)

  // VCV Parameters
  const peep = 5
  const rr = 15
  const cycleSec = 60 / rr    // 4s
  const pauseFrac = 0.08      // 8% of cycle for inspiratory pause
  const tInsp = cycleSec * 0.25  // 1s flow delivery
  const tPause = viewMode === 'noPause' ? 0 : cycleSec * pauseFrac // 0.32s pause
  const tExp = cycleSec - tInsp - tPause

  const flowSet = 50           // L/min constant
  const vcTarget = 450         // mL
  const pPeak = 30             // cmH2O
  const pPlateau = 22          // cmH2O
  const pResistive = pPeak - pPlateau  // 8 cmH2O
  const drivingP = pPlateau - peep     // 17 cmH2O

  /* ── Waveform generator ── */
  const wave = useCallback((t: number) => {
    const ph = ((t % cycleSec) + cycleSec) % cycleSec
    const ramp = (v: number, dur: number) => Math.min(v / dur, 1)

    let P = peep, F = 0, V = 0

    // A/C mode: trigger deflection before inspiration (0.08s)
    const trigDur = 0.08
    const trigDepth = triggerMode === 'ac' ? 2.5 : 0  // cmH2O negative deflection
    const trigFlowDip = triggerMode === 'ac' ? 8 : 0  // L/min negative

    if (triggerMode === 'ac' && ph < trigDur) {
      // Patient effort deflection
      const trigFrac = ph / trigDur
      const bellCurve = Math.sin(trigFrac * Math.PI)
      P = peep - trigDepth * bellCurve
      F = -trigFlowDip * bellCurve
      V = 0
      return { P, F, V }
    }

    const effPh = triggerMode === 'ac' ? ph - trigDur : ph

    if (effPh >= 0 && effPh < tInsp) {
      // INSPIRATORY FLOW PHASE
      const frac = effPh / tInsp
      const riseF = Math.min(effPh / 0.06, 1)

      F = flowSet * riseF

      // Volume: linear ramp (VCV)
      V = vcTarget * frac

      // Pressure: linear ramp from PEEP to Ppeak
      // Stress Index morphology
      if (viewMode === 'stressIndex') {
        const baseLin = peep + (pPeak - peep) * frac
        if (siMode === 'ideal') {
          P = baseLin
        } else if (siMode === 'overdist') {
          // SI > 1: concave (pressure accelerates upward)
          P = peep + (pPeak - peep) * Math.pow(frac, 0.6)
        } else {
          // SI < 1: convex (pressure decelerates)
          P = peep + (pPeak - peep) * Math.pow(frac, 1.6)
        }
      } else {
        // Normal: linear ramp (SI=1)
        P = peep + (pPeak - peep) * frac
      }

    } else if (effPh >= 0 && effPh < tInsp + tPause) {
      // INSPIRATORY PAUSE PHASE
      F = 0
      V = vcTarget

      if (viewMode === 'p1p2') {
        const pauseFr = (effPh - tInsp) / Math.max(tPause, 0.01)
        const p1 = pPlateau + (p1p2Mode === 'pendelluft' ? 4 : 1)
        const p2 = pPlateau
        // P1 decays to P2
        P = p2 + (p1 - p2) * Math.exp(-pauseFr * 6)
      } else {
        // Immediate drop from Ppeak to Pplateau
        const pauseFr = (effPh - tInsp) / Math.max(tPause, 0.01)
        const dropDur = 0.15
        if (pauseFr < dropDur) {
          P = pPeak - (pPeak - pPlateau) * (pauseFr / dropDur)
        } else {
          P = pPlateau
        }
      }

    } else if (effPh >= 0) {
      // EXPIRATORY PHASE
      const expPh = effPh - tInsp - tPause
      const expFrac = expPh / tExp
      const tau = 0.4 // time constant

      F = -flowSet * 0.8 * Math.exp(-expFrac / tau)
      V = vcTarget * Math.exp(-expFrac / tau) * 0.95
      P = peep + (pPlateau - peep) * Math.exp(-expFrac / (tau * 0.8))

      if (V < 0) V = 0
      if (P < peep) P = peep
    }

    return { P, F, V }
  }, [viewMode, siMode, p1p2Mode, tInsp, tPause, tExp, cycleSec, peep, pPeak, pPlateau, vcTarget, flowSet])

  /* ── Label data for each point ── */
  const pressureLabelsWithPause = [
    { num: 1, name: 'PEEP', x: 0.02, desc: 'Pressão expiratória final positiva' },
    { num: 2, name: 'Disparo', x: 0.06, desc: 'Início da fase inspiratória' },
    { num: 3, name: 'Componente Resistivo', x: 0.15, desc: 'Pressão gerada pela resistência das vias aéreas' },
    { num: 4, name: 'Stress Index', x: 0.20, desc: 'Morfologia da rampa — avalia complacência' },
    { num: 5, name: 'Pressão de Pico (VA)', x: 0.245, desc: 'Ppico = Resistiva + Elástica' },
    { num: 6, name: 'Pressão de Platô', x: 0.30, desc: 'Pressão alveolar (pausa inspiratória)' },
    { num: 7, name: 'Ciclagem', x: 0.33, desc: 'Transição inspiração → expiração' },
    { num: 8, name: 'Driving Pressure', x: 0.55, desc: `ΔP = Platô - PEEP = ${drivingP} cmH₂O` },
  ]

  const flowLabels = [
    { num: 1, name: 'Disparo', x: 0.06, desc: 'Deflexão negativa que dispara o ciclo' },
    { num: 2, name: 'Pico Fluxo Inspiratório', x: 0.10, desc: `Fluxo constante = ${flowSet} L/min (onda quadrada)` },
    { num: 3, name: 'Ciclagem', x: 0.245, desc: 'Fluxo cai a zero — fim da inspiração' },
    { num: 4, name: 'Pico Fluxo Expiratório', x: 0.27, desc: 'Pico negativo — expiração passiva' },
    { num: 5, name: 'Constantes de Tempo Exp.', x: 0.60, desc: 'Decaimento exponencial (τ = R × C)' },
  ]

  const volumeLabels = [
    { num: 1, name: 'Vti (Volume Entrada)', x: 0.15, desc: 'Rampa ascendente linear (fluxo constante)' },
    { num: 2, name: 'Volume Corrente', x: 0.245, desc: `VC = ${vcTarget} mL (controlado — sempre igual)` },
    { num: 3, name: 'Vte (Volume Saída)', x: 0.55, desc: 'Decaimento exponencial passivo' },
  ]

  /* ── Drawing ── */
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
    const gapBetween = 14
    const graphH = (H - pad.top - pad.bot - gapBetween * 2) / 3
    const gW = W - pad.left - pad.right

    const graphs = [
      { label: 'Pressão (cmH₂O)', color: COLORS.pressure, min: -2, max: 38, key: 'P' as const },
      { label: 'Fluxo (L/min)', color: COLORS.flow, min: -70, max: 70, key: 'F' as const },
      { label: 'Volume (mL)', color: COLORS.volume, min: -20, max: 520, key: 'V' as const },
    ]

    const toY = (val: number, min: number, max: number, top: number) => {
      return top + graphH - ((val - min) / (max - min)) * graphH
    }

    const toX = (frac: number) => pad.left + frac * gW

    let prevTime = performance.now()

    const draw = (now: number) => {
      const dt = (now - prevTime) / 1000
      prevTime = now
      if (!paused) timeRef.current += dt

      ctx.fillStyle = COLORS.bg
      ctx.fillRect(0, 0, W, H)

      const windowSec = cycleSec * 2.2
      const t0 = timeRef.current - windowSec * 0.85

      // Draw each graph
      graphs.forEach((g, gi) => {
        const gTop = pad.top + gi * (graphH + gapBetween)

        // Grid
        ctx.strokeStyle = COLORS.grid
        ctx.lineWidth = 0.5
        for (let i = 0; i <= 4; i++) {
          const y = gTop + (graphH / 4) * i
          ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke()
        }

        // Zero/PEEP line
        if (gi === 0) {
          // PEEP line
          const peepY = toY(peep, g.min, g.max, gTop)
          ctx.strokeStyle = COLORS.peep
          ctx.lineWidth = 1
          ctx.setLineDash([4, 4])
          ctx.beginPath(); ctx.moveTo(pad.left, peepY); ctx.lineTo(W - pad.right, peepY); ctx.stroke()
          ctx.setLineDash([])
          ctx.fillStyle = COLORS.peep
          ctx.font = '9px monospace'
          ctx.fillText('PEEP', pad.left + 2, peepY - 3)
        } else if (gi === 1) {
          // Zero line for flow
          const zeroY = toY(0, g.min, g.max, gTop)
          ctx.strokeStyle = COLORS.gridMajor
          ctx.lineWidth = 0.8
          ctx.beginPath(); ctx.moveTo(pad.left, zeroY); ctx.lineTo(W - pad.right, zeroY); ctx.stroke()
        }

        // Y-axis labels
        ctx.fillStyle = g.color
        ctx.font = 'bold 10px system-ui'
        ctx.textAlign = 'left'
        ctx.fillText(g.label, 2, gTop + 12)

        // Min/Max labels
        ctx.fillStyle = 'rgba(255,255,255,0.4)'
        ctx.font = '9px monospace'
        ctx.textAlign = 'right'
        ctx.fillText(String(Math.round(g.max)), pad.left - 4, gTop + 10)
        ctx.fillText(String(Math.round(g.min)), pad.left - 4, gTop + graphH)
        if (gi === 0) {
          const midVal = Math.round((g.max + g.min) / 2)
          ctx.fillText(String(midVal), pad.left - 4, gTop + graphH / 2 + 4)
        }

        // Draw waveform
        ctx.strokeStyle = g.color
        ctx.lineWidth = 2.2
        ctx.beginPath()
        let started = false

        const steps = Math.floor(gW * 1.5)
        for (let px = 0; px < steps; px++) {
          const frac = px / steps
          const t = t0 + frac * windowSec
          const w = wave(t)
          const val = w[g.key]
          const x = toX(frac)
          const y = toY(val, g.min, g.max, gTop)

          if (!started) { ctx.moveTo(x, y); started = true }
          else ctx.lineTo(x, y)
        }
        ctx.stroke()

        // Draw labels for the FIRST complete cycle visible
        const firstCycleStart = Math.ceil(t0 / cycleSec) * cycleSec
        const cycleOffset = (firstCycleStart - t0) / windowSec

        if (cycleOffset >= 0 && cycleOffset < 0.7) {
          let labels: typeof pressureLabelsWithPause = []
          if (gi === 0) {
            labels = viewMode === 'noPause'
              ? pressureLabelsWithPause.filter(l => l.num !== 6 && l.num !== 7)
              : pressureLabelsWithPause
          } else if (gi === 1) {
            labels = flowLabels
          } else {
            labels = volumeLabels
          }

          // Special labels for P1/P2 mode
          if (gi === 0 && viewMode === 'p1p2') {
            labels = [
              { num: 1, name: 'PEEP', x: 0.02, desc: '' },
              { num: 2, name: 'P1', x: 0.26, desc: 'Pressão no ponto de ciclagem' },
              { num: 3, name: 'P2', x: 0.32, desc: 'Pressão após acomodação (stress relaxation)' },
            ]
          }

          if (viewMode !== 'stressIndex' || gi !== 0) {
            labels.forEach(lb => {
              const lx = toX(cycleOffset + lb.x)
              if (lx < pad.left || lx > W - pad.right) return

              const t = firstCycleStart + lb.x * windowSec
              const w = wave(t)
              const val = w[g.key]
              const ly = toY(val, g.min, g.max, gTop)

              // Label number circle
              const radius = 10
              const labelY = ly - 18
              const isActive = activeLabel === lb.num * 10 + gi

              ctx.beginPath()
              ctx.arc(lx, labelY, radius, 0, Math.PI * 2)
              ctx.fillStyle = isActive ? COLORS.highlight : COLORS.labelBg
              ctx.fill()
              ctx.strokeStyle = isActive ? '#fff' : g.color
              ctx.lineWidth = 1.5
              ctx.stroke()

              ctx.fillStyle = '#fff'
              ctx.font = 'bold 11px system-ui'
              ctx.textAlign = 'center'
              ctx.fillText(String(lb.num), lx, labelY + 4)

              // Connector line
              ctx.strokeStyle = 'rgba(255,255,255,0.3)'
              ctx.lineWidth = 0.8
              ctx.beginPath()
              ctx.moveTo(lx, labelY + radius)
              ctx.lineTo(lx, ly)
              ctx.stroke()

              // Small dot on curve
              ctx.beginPath()
              ctx.arc(lx, ly, 3, 0, Math.PI * 2)
              ctx.fillStyle = g.color
              ctx.fill()
            })
          }

          // Stress Index special drawing
          if (gi === 0 && viewMode === 'stressIndex') {
            const siStartX = toX(cycleOffset + 0.08)
            const siEndX = toX(cycleOffset + 0.24)
            const siMidX = (siStartX + siEndX) / 2

            // Highlight region
            ctx.fillStyle = siMode === 'ideal' ? 'rgba(74,222,128,0.1)' : siMode === 'overdist' ? 'rgba(248,113,113,0.1)' : 'rgba(56,189,248,0.1)'
            ctx.fillRect(siStartX, gTop, siEndX - siStartX, graphH)

            // SI label
            const siColor = siMode === 'ideal' ? '#4ade80' : siMode === 'overdist' ? '#f87171' : '#38bdf8'
            const siText = siMode === 'ideal' ? 'SI = 1 (Linear)' : siMode === 'overdist' ? 'SI > 1 (Côncava)' : 'SI < 1 (Convexa)'

            ctx.fillStyle = 'rgba(0,0,0,0.8)'
            ctx.fillRect(siMidX - 60, gTop + 8, 120, 22)
            ctx.fillStyle = siColor
            ctx.font = 'bold 12px system-ui'
            ctx.textAlign = 'center'
            ctx.fillText(siText, siMidX, gTop + 23)
          }

          // P1/P2 special markers
          if (gi === 0 && viewMode === 'p1p2') {
            const p1X = toX(cycleOffset + 0.25)
            const p2X = toX(cycleOffset + 0.33)
            const p1Val = p1p2Mode === 'pendelluft' ? pPlateau + 4 : pPlateau + 1
            const p1Y = toY(p1Val, g.min, g.max, gTop)
            const p2Y = toY(pPlateau, g.min, g.max, gTop)

            // P1 marker
            ctx.beginPath()
            ctx.arc(p1X, p1Y, 12, 0, Math.PI * 2)
            ctx.strokeStyle = COLORS.p1
            ctx.lineWidth = 2
            ctx.stroke()
            ctx.fillStyle = COLORS.p1
            ctx.font = 'bold 13px system-ui'
            ctx.textAlign = 'center'
            ctx.fillText('P1', p1X, p1Y - 16)

            // P2 marker
            ctx.beginPath()
            ctx.arc(p2X, p2Y, 12, 0, Math.PI * 2)
            ctx.strokeStyle = COLORS.p2
            ctx.lineWidth = 2
            ctx.stroke()
            ctx.fillStyle = COLORS.p2
            ctx.font = 'bold 13px system-ui'
            ctx.fillText('P2', p2X, p2Y - 16)

            // Status
            const statusText = p1p2Mode === 'normal' ? 'NORMAL: P1 ≈ P2' : 'PENDELLUFT: P1 > P2'
            const statusColor = p1p2Mode === 'normal' ? '#4ade80' : '#f87171'
            ctx.fillStyle = 'rgba(0,0,0,0.8)'
            ctx.fillRect(p1X + 30, p1Y - 12, 140, 22)
            ctx.fillStyle = statusColor
            ctx.font = 'bold 11px system-ui'
            ctx.textAlign = 'left'
            ctx.fillText(statusText, p1X + 36, p1Y + 3)
          }

          // Driving Pressure annotation (pressure graph, com pausa)
          if (gi === 0 && (viewMode === 'normal')) {
            const dpStartY = toY(peep, g.min, g.max, gTop)
            const dpEndY = toY(pPlateau, g.min, g.max, gTop)
            const dpX = toX(cycleOffset + 0.38)

            // Double arrow
            ctx.strokeStyle = '#ef4444'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(dpX, dpStartY)
            ctx.lineTo(dpX, dpEndY)
            ctx.stroke()

            // Arrow heads
            ctx.fillStyle = '#ef4444'
            ctx.beginPath(); ctx.moveTo(dpX - 4, dpStartY - 6); ctx.lineTo(dpX + 4, dpStartY - 6); ctx.lineTo(dpX, dpStartY); ctx.fill()
            ctx.beginPath(); ctx.moveTo(dpX - 4, dpEndY + 6); ctx.lineTo(dpX + 4, dpEndY + 6); ctx.lineTo(dpX, dpEndY); ctx.fill()

            // ΔP label
            ctx.fillStyle = '#ef4444'
            ctx.font = 'bold 10px system-ui'
            ctx.textAlign = 'left'
            ctx.fillText(`ΔP = ${drivingP}`, dpX + 6, (dpStartY + dpEndY) / 2 + 4)

            // Resistive component annotation
            const resStartY = toY(pPlateau, g.min, g.max, gTop)
            const resEndY = toY(pPeak, g.min, g.max, gTop)
            const resX = toX(cycleOffset + 0.26)

            ctx.strokeStyle = '#f59e0b'
            ctx.lineWidth = 1.2
            ctx.beginPath()
            ctx.moveTo(resX, resStartY)
            ctx.lineTo(resX, resEndY)
            ctx.stroke()

            ctx.fillStyle = '#f59e0b'
            ctx.beginPath(); ctx.moveTo(resX - 3, resStartY - 4); ctx.lineTo(resX + 3, resStartY - 4); ctx.lineTo(resX, resStartY); ctx.fill()
            ctx.beginPath(); ctx.moveTo(resX - 3, resEndY + 4); ctx.lineTo(resX + 3, resEndY + 4); ctx.lineTo(resX, resEndY); ctx.fill()

            ctx.fillStyle = '#f59e0b'
            ctx.font = '9px system-ui'
            ctx.textAlign = 'left'
            ctx.fillText(`Pres = ${pResistive}`, resX + 5, (resStartY + resEndY) / 2 + 3)
          }
        }

        // Graph border
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'
        ctx.lineWidth = 0.5
        ctx.strokeRect(pad.left, gTop, gW, graphH)
      })

      // Time axis
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.font = '9px monospace'
      ctx.textAlign = 'center'
      const totalGraphH = pad.top + 3 * graphH + 2 * gapBetween
      for (let s = 0; s <= Math.ceil(windowSec); s++) {
        const frac = s / windowSec
        const x = toX(frac)
        if (x >= pad.left && x <= W - pad.right) {
          ctx.fillText(`${s}s`, x, totalGraphH + 10)
        }
      }

      // Current values
      const cur = wave(timeRef.current)
      const valX = W - pad.right - 2
      const valFont = 'bold 10px monospace'
      ctx.font = valFont
      ctx.textAlign = 'right'

      graphs.forEach((g, gi) => {
        const gTop = pad.top + gi * (graphH + gapBetween)
        const val = cur[g.key]
        ctx.fillStyle = g.color
        ctx.fillText(`${val.toFixed(1)}`, valX, gTop + graphH - 4)
      })

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameRef.current)
  }, [wave, paused, viewMode, siMode, p1p2Mode, activeLabel])

  return (
    <div className={`rounded-xl overflow-hidden bg-[#111] ${className ?? ''}`}>
      {/* Controls */}
      <div className="flex flex-wrap gap-1.5 p-3 bg-black/40 border-b border-white/10">
        {/* View mode buttons */}
        {(Object.keys(VIEW_LABELS) as ViewMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => { setViewMode(mode); setActiveLabel(null) }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              viewMode === mode
                ? 'bg-yellow-500/30 text-yellow-300 ring-1 ring-yellow-500/50'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {VIEW_LABELS[mode]}
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

      {/* Sub-controls for Stress Index */}
      {viewMode === 'stressIndex' && (
        <div className="flex gap-1.5 px-3 py-2 bg-black/30 border-b border-white/10">
          {(['ideal', 'overdist', 'recruit'] as SIMode[]).map(mode => {
            const labels: Record<SIMode, { text: string; color: string }> = {
              ideal: { text: 'SI = 1 (Linear)', color: 'text-green-400 bg-green-500/20 ring-green-500/40' },
              overdist: { text: 'SI > 1 (Côncava)', color: 'text-red-400 bg-red-500/20 ring-red-500/40' },
              recruit: { text: 'SI < 1 (Convexa)', color: 'text-blue-400 bg-blue-500/20 ring-blue-500/40' },
            }
            const l = labels[mode]
            return (
              <button
                key={mode}
                onClick={() => setSiMode(mode)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  siMode === mode ? `${l.color} ring-1` : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {l.text}
              </button>
            )
          })}
        </div>
      )}

      {/* Sub-controls for P1/P2 */}
      {viewMode === 'p1p2' && (
        <div className="flex gap-1.5 px-3 py-2 bg-black/30 border-b border-white/10">
          <button
            onClick={() => setP1p2Mode('normal')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              p1p2Mode === 'normal' ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/40' : 'bg-white/5 text-white/50'
            }`}
          >
            Normal (P1 ≈ P2)
          </button>
          <button
            onClick={() => setP1p2Mode('pendelluft')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              p1p2Mode === 'pendelluft' ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40' : 'bg-white/5 text-white/50'
            }`}
          >
            Pendelluft (P1 {'>'} P2)
          </button>
        </div>
      )}

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: 420 }}
        />
      </div>

      {/* Legend */}
      <div className="p-3 bg-black/40 border-t border-white/10">
        {viewMode === 'normal' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
            {pressureLabelsWithPause.map(l => (
              <div key={l.num} className="flex items-start gap-1.5">
                <span className="shrink-0 w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-300 flex items-center justify-center font-bold text-[10px]">{l.num}</span>
                <div>
                  <span className="text-white/80 font-semibold">{l.name}</span>
                  <p className="text-white/40 leading-tight">{l.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {viewMode === 'noPause' && (
          <p className="text-white/50 text-xs">
            <span className="text-yellow-400 font-bold">Sem Pausa:</span> Não há platô — pressão vai direto do pico para expiração. Não é possível medir Pplatô nem Driving Pressure.
          </p>
        )}
        {viewMode === 'stressIndex' && (
          <div className="text-xs space-y-1">
            <p className="text-white/50">
              <span className="text-yellow-400 font-bold">Stress Index</span> avalia a morfologia da rampa de pressão durante fluxo constante (VCV).
            </p>
            <div className="flex gap-4">
              <span className="text-green-400">SI = 1: Ideal (complacência constante)</span>
              <span className="text-red-400">SI {'>'} 1: Sobredistensão</span>
              <span className="text-blue-400">SI {'<'} 1: Recrutamento</span>
            </div>
          </div>
        )}
        {viewMode === 'p1p2' && (
          <div className="text-xs space-y-1">
            <p className="text-white/50">
              <span className="text-red-400 font-bold">P1</span> = pressão no ponto de ciclagem |
              <span className="text-blue-400 font-bold"> P2</span> = pressão após acomodação
            </p>
            <p className="text-white/40">
              {p1p2Mode === 'normal'
                ? 'Normal: P1 ≈ P2 — pulmão homogêneo, sem redistribuição de gás'
                : 'P1 > P2 — indica pendelluft, stress relaxation ou vazamentos. Pulmão heterogêneo.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
