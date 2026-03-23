'use client'

import { useState, useMemo } from 'react'

/* ──────────────────────────────────────────────────────────────
   MECÂNICA RESPIRATÓRIA — Calculadora Interativa
   ΔP, Cest, Cdyn, RAW com barras visuais
   ────────────────────────────────────────────────────────────── */

export function RespiratoryVmiMechanicsSim({ className }: { className?: string }) {
  const [vcMl, setVc]     = useState(450)
  const [plato, setPlato] = useState(25)
  const [pico, setPico]   = useState(32)
  const [peep, setPeep]   = useState(5)
  const [flowLmin, setFlow] = useState(50)

  const calc = useMemo(() => {
    const dp     = plato - peep                          // Driving Pressure
    const cest   = dp > 0 ? vcMl / dp : 0               // Complacência Estática
    const cdyn   = (pico - peep) > 0 ? vcMl / (pico - peep) : 0  // Complacência Dinâmica
    const flowLs = flowLmin / 60                         // L/min → L/s
    const raw    = flowLs > 0 ? (pico - plato) / flowLs : 0  // Resistência VA

    return { dp, cest, cdyn, raw }
  }, [vcMl, plato, pico, peep, flowLmin])

  // Status helper
  const status = (val: number, ok: [number, number], warn: [number, number]) => {
    if (val >= ok[0] && val <= ok[1]) return { color: '#4ade80', label: '✅ Normal', bg: 'rgba(74,222,128,0.08)' }
    if (val >= warn[0] && val <= warn[1]) return { color: '#fbbf24', label: '⚠️ Atenção', bg: 'rgba(251,191,36,0.08)' }
    return { color: '#f87171', label: '❌ Crítico', bg: 'rgba(248,113,113,0.08)' }
  }

  const dpStatus   = calc.dp <= 15 ? status(0, [0,0], [0,0]) : calc.dp <= 20 ? status(20, [0,14], [15,20]) : status(100, [0,14], [15,20])
  const cestStatus = calc.cest >= 50 ? status(0, [0,0], [0,0]) : calc.cest >= 30 ? status(35, [50,200], [30,49]) : status(100, [50,200], [30,49])
  const cdynStatus = calc.cdyn >= 40 ? status(0, [0,0], [0,0]) : calc.cdyn >= 25 ? status(30, [40,200], [25,39]) : status(100, [40,200], [25,39])
  const rawStatus  = calc.raw <= 10 ? status(0, [0,0], [0,0]) : calc.raw <= 15 ? status(12, [0,10], [11,15]) : status(100, [0,10], [11,15])

  // Override status objects manually for clarity
  const dpS   = calc.dp <= 15 ? { color: '#4ade80', label: '✅ Protetor', bg: 'rgba(74,222,128,0.08)' }
              : calc.dp <= 20 ? { color: '#fbbf24', label: '⚠️ Elevado', bg: 'rgba(251,191,36,0.08)' }
              : { color: '#f87171', label: '❌ Risco VILI', bg: 'rgba(248,113,113,0.08)' }

  const cestS = calc.cest >= 50 ? { color: '#4ade80', label: '✅ Normal', bg: 'rgba(74,222,128,0.08)' }
              : calc.cest >= 30 ? { color: '#fbbf24', label: '⚠️ Reduzida', bg: 'rgba(251,191,36,0.08)' }
              : { color: '#f87171', label: '❌ Muito baixa', bg: 'rgba(248,113,113,0.08)' }

  const cdynS = calc.cdyn >= 40 ? { color: '#4ade80', label: '✅ Normal', bg: 'rgba(74,222,128,0.08)' }
              : calc.cdyn >= 25 ? { color: '#fbbf24', label: '⚠️ Reduzida', bg: 'rgba(251,191,36,0.08)' }
              : { color: '#f87171', label: '❌ ↑ Resistência', bg: 'rgba(248,113,113,0.08)' }

  const rawS  = calc.raw <= 10 ? { color: '#4ade80', label: '✅ Normal', bg: 'rgba(74,222,128,0.08)' }
              : calc.raw <= 15 ? { color: '#fbbf24', label: '⚠️ Elevada', bg: 'rgba(251,191,36,0.08)' }
              : { color: '#f87171', label: '❌ Obstrução', bg: 'rgba(248,113,113,0.08)' }

  const platoS = plato < 30 ? { color: '#4ade80', label: '✅ Seguro' }
               : plato <= 35 ? { color: '#fbbf24', label: '⚠️ Limite' }
               : { color: '#f87171', label: '❌ Barotrauma' }

  const InputSlider = ({ label, val, unit, min, max, step = 1, color, set }: {
    label: string; val: number; unit: string; min: number; max: number; step?: number; color: string; set: (v: number) => void
  }) => (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono font-bold w-12 text-right" style={{ color }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e => set(+e.target.value)}
        className="flex-1 h-1" style={{ accentColor: color }} />
      <span className="text-sm font-bold font-mono w-10 text-right" style={{ color }}>{val}</span>
      <span className="text-[8px] text-white/20 font-mono w-14">{unit}</span>
    </div>
  )

  const ResultCard = ({ title, formula, val, unit, status: s, maxBar }: {
    title: string; formula: string; val: number; unit: string; status: { color: string; label: string; bg: string }; maxBar: number
  }) => {
    const pct = Math.min(100, Math.max(0, (val / maxBar) * 100))
    return (
      <div className="rounded-lg p-3 border border-white/6" style={{ background: s.bg }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-white/60">{title}</span>
          <span className="text-[9px] font-mono" style={{ color: s.color }}>{s.label}</span>
        </div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-2xl font-bold font-mono" style={{ color: s.color }}>{val.toFixed(1)}</span>
          <span className="text-[10px] text-white/25 font-mono">{unit}</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden mb-1">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: s.color }} />
        </div>
        <span className="text-[8px] text-white/20 font-mono">{formula}</span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-3 ${className ?? ''}`}>
      {/* Title */}
      <div className="text-center">
        <h3 className="text-sm font-bold text-white/50">Mecânica Respiratória — Calculadora</h3>
        <p className="text-[9px] text-white/20 font-mono mt-0.5">Ajuste os parâmetros e veja os resultados em tempo real</p>
      </div>

      {/* Input sliders */}
      <div className="space-y-1.5 px-1 py-2 rounded-lg bg-white/[0.02] border border-white/5">
        <InputSlider label="VC" val={vcMl} unit="mL" min={200} max={700} step={10} color="#4ade80" set={setVc} />
        <InputSlider label="Platô" val={plato} unit="cmH₂O" min={10} max={45} color="#22d3ee" set={setPlato} />
        <InputSlider label="Pico" val={pico} unit="cmH₂O" min={plato} max={55} color="#f97316" set={setPico} />
        <InputSlider label="PEEP" val={peep} unit="cmH₂O" min={0} max={20} color="#fbbf24" set={setPeep} />
        <InputSlider label="Fluxo" val={flowLmin} unit="L/min" min={20} max={80} step={5} color="#a78bfa" set={setFlow} />
      </div>

      {/* Pressure bar visualization */}
      <div className="px-1">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[9px] text-white/25 font-mono">Pressões (cmH₂O)</span>
        </div>
        <div className="relative h-8 rounded bg-white/[0.02] border border-white/5 overflow-hidden">
          {/* PEEP bar */}
          <div className="absolute left-0 top-0 h-full flex items-center" style={{ width: `${(peep / 55) * 100}%`, background: 'rgba(251,191,36,0.15)' }}>
            <span className="text-[7px] text-amber-400/60 font-mono pl-1">PEEP {peep}</span>
          </div>
          {/* Platô bar */}
          <div className="absolute left-0 top-0 h-full flex items-center" style={{ width: `${(plato / 55) * 100}%`, borderRight: '2px solid rgba(34,211,238,0.5)' }}>
            <span className="text-[7px] text-cyan-400/60 font-mono absolute right-1">Platô {plato}</span>
          </div>
          {/* Pico bar */}
          <div className="absolute left-0 top-0 h-full flex items-center" style={{ width: `${(pico / 55) * 100}%`, borderRight: '2px solid rgba(249,115,22,0.5)' }}>
            <span className="text-[7px] text-orange-400/60 font-mono absolute right-1">Pico {pico}</span>
          </div>
          {/* ΔP range */}
          <div className="absolute top-0 h-1" style={{ left: `${(peep / 55) * 100}%`, width: `${((plato - peep) / 55) * 100}%`, background: dpS.color, opacity: 0.3 }} />
          {/* RAW range */}
          <div className="absolute bottom-0 h-1" style={{ left: `${(plato / 55) * 100}%`, width: `${((pico - plato) / 55) * 100}%`, background: '#a78bfa', opacity: 0.3 }} />
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="text-[7px] font-mono" style={{ color: dpS.color }}>ΔP = {calc.dp} (Platô - PEEP)</span>
          <span className="text-[7px] font-mono" style={{ color: platoS.color }}>{platoS.label} (Platô {'<'}30)</span>
          <span className="text-[7px] text-purple-400/60 font-mono">RAW ∝ Pico - Platô = {pico - plato}</span>
        </div>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-2 gap-2">
        <ResultCard title="ΔP (Driving Pressure)" formula="Platô − PEEP" val={calc.dp} unit="cmH₂O" status={dpS} maxBar={30} />
        <ResultCard title="Cest (Estática)" formula="VC / (Platô − PEEP)" val={calc.cest} unit="mL/cmH₂O" status={cestS} maxBar={80} />
        <ResultCard title="Cdyn (Dinâmica)" formula="VC / (Pico − PEEP)" val={calc.cdyn} unit="mL/cmH₂O" status={cdynS} maxBar={60} />
        <ResultCard title="RAW (Resistência VA)" formula="(Pico − Platô) / Fluxo" val={calc.raw} unit="cmH₂O/L/s" status={rawS} maxBar={25} />
      </div>

      {/* Clinical interpretation */}
      <div className="rounded-lg p-2 bg-white/[0.02] border border-white/5">
        <span className="text-[9px] text-white/30 font-bold">Interpretação Clínica</span>
        <div className="mt-1 space-y-0.5">
          {calc.dp > 15 && (
            <p className="text-[9px] text-amber-400/70 font-mono">
              ΔP {'>'} 15: Associado a maior mortalidade em SDRA. Considerar ↓ VC ou ↑ PEEP (se recrutar).
            </p>
          )}
          {plato >= 30 && (
            <p className="text-[9px] text-red-400/70 font-mono">
              Platô ≥ 30: Risco de barotrauma. Reduzir VC ou pressão inspiratória.
            </p>
          )}
          {calc.cest < 30 && (
            <p className="text-[9px] text-red-400/70 font-mono">
              Cest muito baixa: Sugere ↓ complacência pulmonar (SDRA, fibrose, atelectasia, edema).
            </p>
          )}
          {calc.raw > 15 && (
            <p className="text-[9px] text-red-400/70 font-mono">
              RAW elevada: Sugere obstrução de vias aéreas (broncoespasmo, secreção, tubo pequeno).
            </p>
          )}
          {calc.dp <= 15 && plato < 30 && calc.cest >= 50 && calc.raw <= 10 && (
            <p className="text-[9px] text-green-400/70 font-mono">
              Todos os parâmetros dentro da faixa de proteção pulmonar.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
