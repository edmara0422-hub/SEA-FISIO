'use client'

import { useState } from 'react'

/* ─── Types ─── */

type Pattern = 'normal' | 'obstructive' | 'restrictive'
type CurveView = 'volume-time' | 'flow-volume'

interface PatternData {
  label: string
  color: string
  cvf: number      // L
  vef1: number     // L
  ratio: number    // VEF1/CVF %
  pfe: number      // L/s
  fef2575: number  // L/s
  tef: number      // seconds
  desc: string
  examples: string
}

const PATTERNS: Record<Pattern, PatternData> = {
  normal: {
    label: 'Normal', color: 'rgba(45, 212, 191, 0.8)',
    cvf: 4.8, vef1: 3.84, ratio: 80, pfe: 9.5, fef2575: 4.5, tef: 6,
    desc: 'Curva ascendente rápida e suave. VEF₁/CVF ≥ 70%.',
    examples: 'Indivíduo saudável',
  },
  obstructive: {
    label: 'Obstrutivo (DVO)', color: 'rgba(244, 63, 94, 0.8)',
    cvf: 3.8, vef1: 1.52, ratio: 40, pfe: 5.0, fef2575: 1.0, tef: 10,
    desc: 'Ascensão lenta, curva achatada. VEF₁/CVF < LIN. Concavidade na curva fluxo-volume.',
    examples: 'DPOC, asma, bronquite crônica',
  },
  restrictive: {
    label: 'Restritivo (DVR)', color: 'rgba(250, 204, 21, 0.8)',
    cvf: 2.8, vef1: 2.38, ratio: 85, pfe: 7.0, fef2575: 3.8, tef: 4,
    desc: 'CVF reduzida, curva curta. VEF₁/CVF normal ou aumentada.',
    examples: 'Fibrose pulmonar, doenças neuromusculares',
  },
}

/* ─── Curve generation (pre-computed points) ─── */

function genVolumeTime(p: PatternData, n: number): { t: number; v: number }[] {
  const pts: { t: number; v: number }[] = []
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * p.tef
    // Exponential rise: V(t) = CVF × (1 - e^(-k×t))
    // k adjusted so VEF1 is reached at t=1
    const k = -Math.log(1 - p.vef1 / p.cvf)
    const v = p.cvf * (1 - Math.exp(-k * t))
    pts.push({ t, v: Math.min(v, p.cvf) })
  }
  return pts
}

function genFlowVolume(p: PatternData, n: number): { v: number; f: number }[] {
  const pts: { v: number; f: number }[] = []
  for (let i = 0; i <= n; i++) {
    const frac = i / n // 0→1 of exhaled volume
    const v = frac * p.cvf

    let f: number
    if (frac < 0.08) {
      // rapid rise to PFE
      f = (frac / 0.08) * p.pfe
    } else if (frac < 0.15) {
      // at peak
      f = p.pfe
    } else {
      // decay — linear for normal, concave for obstructive
      const decayFrac = (frac - 0.15) / 0.85
      if (p.ratio < 60) {
        // obstructive: concave decay (scooped out)
        f = p.pfe * Math.pow(1 - decayFrac, 0.4) * 0.5
      } else {
        // normal/restrictive: linear-ish decay
        f = p.pfe * (1 - decayFrac * 0.85)
      }
    }
    pts.push({ v, f: Math.max(f, 0) })
  }
  return pts
}

/* ─── Component ─── */

export function RespiratorySpirometrySim({ className }: { className?: string }) {
  const [pattern, setPattern] = useState<Pattern>('normal')
  const [view, setView] = useState<CurveView>('volume-time')
  const [showAll, setShowAll] = useState(false)

  const p = PATTERNS[pattern]

  return (
    <div className={`w-full ${className ?? ''}`}>
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(2, 6, 12, 0.94)' }}>
        {/* Controls */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-2 flex-wrap">
          <div className="flex gap-1">
            {(['volume-time', 'flow-volume'] as CurveView[]).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-2 py-1 rounded-lg text-[8px] font-mono font-bold uppercase transition-all ${
                  view === v ? 'bg-white/10 text-white/80 border border-white/20' : 'text-white/25 hover:text-white/40 border border-transparent'
                }`}>{v === 'volume-time' ? 'Volume-Tempo' : 'Fluxo-Volume'}</button>
            ))}
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex gap-1">
            {(['normal', 'obstructive', 'restrictive'] as Pattern[]).map(pt => (
              <button key={pt} onClick={() => { setPattern(pt); setShowAll(false) }}
                className={`px-2 py-1 rounded-lg text-[8px] font-mono font-bold uppercase transition-all ${
                  pattern === pt && !showAll ? 'bg-white/10 text-white/80 border border-white/20' : 'text-white/25 hover:text-white/40 border border-transparent'
                }`} style={pattern === pt && !showAll ? { borderColor: PATTERNS[pt].color.replace('0.8', '0.4') } : {}}>
                {PATTERNS[pt].label.split(' ')[0]}</button>
            ))}
            <button onClick={() => setShowAll(a => !a)}
              className={`px-2 py-1 rounded-lg text-[8px] font-mono font-bold uppercase transition-all ${
                showAll ? 'bg-white/10 text-white/80 border border-white/20' : 'text-white/25 hover:text-white/40 border border-transparent'
              }`}>Todos</button>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="px-4 pb-2">
          <svg viewBox="0 0 600 300" className="w-full" style={{ maxHeight: '280px' }}>
            <defs>
              {Object.entries(PATTERNS).map(([k, v]) => (
                <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={v.color.replace('0.8', '0.15')} />
                  <stop offset="100%" stopColor={v.color.replace('0.8', '0.02')} />
                </linearGradient>
              ))}
            </defs>

            {/* Grid */}
            {Array.from({ length: 7 }, (_, i) => (
              <line key={`gx${i}`} x1={70 + i * 80} y1={20} x2={70 + i * 80} y2={260} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <line key={`gy${i}`} x1={70} y1={20 + i * 48} x2={550} y2={20 + i * 48} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            ))}

            {/* Axes */}
            <line x1="70" y1="20" x2="70" y2="260" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
            <line x1="70" y1="260" x2="550" y2="260" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />

            {view === 'volume-time' ? (
              <>
                {/* Y axis: Volume 0-6L */}
                {[0, 1, 2, 3, 4, 5, 6].map(v => {
                  const y = 260 - (v / 6) * 240
                  return <g key={v}>
                    <text x="65" y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.22)" fontSize="9" fontFamily="monospace">{v}</text>
                    <line x1="67" y1={y} x2="70" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
                  </g>
                })}
                <text x="30" y="140" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="monospace" transform="rotate(-90,30,140)">Volume (L)</text>

                {/* X axis: Time 0-10s */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(t => {
                  const x = 70 + (t / 10) * 480
                  return <g key={t}>
                    <text x={x} y="275" textAnchor="middle" fill="rgba(255,255,255,0.22)" fontSize="8" fontFamily="monospace">{t}</text>
                  </g>
                })}
                <text x="310" y="295" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="monospace">Tempo (s)</text>

                {/* VEF1 marker at t=1s */}
                <line x1={70 + 48} y1="20" x2={70 + 48} y2="260" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="3,4" />
                <text x={70 + 48} y="15" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="7" fontFamily="monospace">1s (VEF₁)</text>

                {/* Curves */}
                {(showAll ? (['normal', 'obstructive', 'restrictive'] as Pattern[]) : [pattern]).map(pt => {
                  const pd = PATTERNS[pt]
                  const pts = genVolumeTime(pd, 100)
                  const maxT = 10
                  const pathD = pts.map((p2, i) => {
                    const x = 70 + (p2.t / maxT) * 480
                    const y = 260 - (p2.v / 6) * 240
                    return `${i === 0 ? 'M' : 'L'}${x},${y}`
                  }).join(' ')

                  const fillD = pathD + ` L${70 + (pts[pts.length - 1].t / maxT) * 480},260 L70,260 Z`
                  const isActive = pt === pattern || showAll

                  return <g key={pt}>
                    <path d={fillD} fill={`url(#grad-${pt})`} opacity={isActive ? 1 : 0.3} />
                    <path d={pathD} fill="none" stroke={pd.color} strokeWidth={isActive ? 2.5 : 1.5} opacity={isActive ? 1 : 0.4}
                      strokeLinecap="round" strokeLinejoin="round" />
                    {/* CVF label at end */}
                    {isActive && (
                      <text x={70 + (pts[pts.length - 1].t / maxT) * 480 + 5} y={260 - (pd.cvf / 6) * 240 + 4}
                        fill={pd.color} fontSize="8" fontFamily="monospace" fontWeight="700">{pd.cvf}L</text>
                    )}
                  </g>
                })}
              </>
            ) : (
              <>
                {/* Y axis: Flow 0-12 L/s */}
                {[0, 2, 4, 6, 8, 10, 12].map(f => {
                  const y = 260 - (f / 12) * 240
                  return <g key={f}>
                    <text x="65" y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.22)" fontSize="9" fontFamily="monospace">{f}</text>
                    <line x1="67" y1={y} x2="70" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
                  </g>
                })}
                <text x="30" y="140" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="monospace" transform="rotate(-90,30,140)">Fluxo (L/s)</text>

                {/* X axis: Volume 0-6L */}
                {[0, 1, 2, 3, 4, 5, 6].map(v => {
                  const x = 70 + (v / 6) * 480
                  return <g key={v}>
                    <text x={x} y="275" textAnchor="middle" fill="rgba(255,255,255,0.22)" fontSize="8" fontFamily="monospace">{v}</text>
                  </g>
                })}
                <text x="310" y="295" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="monospace">Volume (L)</text>

                {/* Curves */}
                {(showAll ? (['normal', 'obstructive', 'restrictive'] as Pattern[]) : [pattern]).map(pt => {
                  const pd = PATTERNS[pt]
                  const pts = genFlowVolume(pd, 100)
                  const pathD = pts.map((p2, i) => {
                    const x = 70 + (p2.v / 6) * 480
                    const y = 260 - (p2.f / 12) * 240
                    return `${i === 0 ? 'M' : 'L'}${x},${y}`
                  }).join(' ')
                  const fillD = pathD + ` L${70 + (pd.cvf / 6) * 480},260 L70,260 Z`
                  const isActive = pt === pattern || showAll

                  return <g key={pt}>
                    <path d={fillD} fill={`url(#grad-${pt})`} opacity={isActive ? 1 : 0.3} />
                    <path d={pathD} fill="none" stroke={pd.color} strokeWidth={isActive ? 2.5 : 1.5} opacity={isActive ? 1 : 0.4}
                      strokeLinecap="round" strokeLinejoin="round" />
                    {isActive && (
                      <text x={70 + (pd.cvf * 0.15 / 6) * 480} y={260 - (pd.pfe / 12) * 240 - 6}
                        fill={pd.color} fontSize="8" fontFamily="monospace" fontWeight="700">PFE {pd.pfe}</text>
                    )}
                  </g>
                })}
              </>
            )}
          </svg>
        </div>

        {/* Data Panel */}
        <div className="px-4 pb-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
              <span className="text-[11px] font-mono font-bold text-white/80">{p.label}</span>
              <span className="text-[8px] font-mono text-white/30 ml-auto">{p.examples}</span>
            </div>
            <p className="text-[9px] font-mono text-white/40 mb-2">{p.desc}</p>

            {/* Parameters grid */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'CVF', val: `${p.cvf} L`, sub: 'Cap. Vital Forçada' },
                { label: 'VEF₁', val: `${p.vef1} L`, sub: 'Vol. Exp. Forçado 1s' },
                { label: 'VEF₁/CVF', val: `${p.ratio}%`, sub: p.ratio < 70 ? '⚠ REDUZIDA' : '✓ Normal' },
                { label: 'PFE', val: `${p.pfe} L/s`, sub: 'Pico Fluxo Exp.' },
                { label: 'FEF₂₅₋₇₅', val: `${p.fef2575} L/s`, sub: 'Fluxo Médio' },
                { label: 'TEF', val: `${p.tef} s`, sub: 'Tempo Exp. Forçada' },
              ].map(param => (
                <div key={param.label} className="rounded-lg bg-white/[0.02] border border-white/[0.04] px-2 py-1.5">
                  <div className="text-[7px] font-mono text-white/25 uppercase">{param.label}</div>
                  <div className="text-[11px] font-mono font-bold" style={{ color: p.color }}>{param.val}</div>
                  <div className="text-[6px] font-mono text-white/20">{param.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
