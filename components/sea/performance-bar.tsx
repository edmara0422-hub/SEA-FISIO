'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, BarChart3, RotateCcw, Sparkles, Trash2 } from 'lucide-react'

type DemoState = {
  mode: 'demo' | 'clean'
  nps: number
  fidelity: number
  responses: number
  structured: number
  promoters: number
  neutral: number
  detractors: number
}

const demoSeed: DemoState = {
  mode: 'demo',
  nps: 72,
  fidelity: 91,
  responses: 48,
  structured: 34,
  promoters: 30,
  neutral: 10,
  detractors: 8,
}

const cleanSeed: DemoState = {
  mode: 'clean',
  nps: 0,
  fidelity: 0,
  responses: 0,
  structured: 0,
  promoters: 0,
  neutral: 0,
  detractors: 0,
}

export function PerformanceBar() {
  const [state, setState] = useState<DemoState>(demoSeed)
  const totalBars = Math.max(state.promoters + state.neutral + state.detractors, 1)
  const finalPulseY = 58 - (state.mode === 'clean' ? 8 : state.fidelity) * 0.08

  const bars = useMemo(
    () => [
      {
        label: 'Detratores',
        value: state.detractors,
        fill: 'linear-gradient(180deg, rgba(255,255,255,0.26) 0%, rgba(173,178,186,0.1) 38%, rgba(71,75,82,0.08) 100%)',
      },
      {
        label: 'Neutros',
        value: state.neutral,
        fill: 'linear-gradient(180deg, rgba(255,255,255,0.52) 0%, rgba(207,212,219,0.18) 42%, rgba(86,90,98,0.1) 100%)',
      },
      {
        label: 'Promotores',
        value: state.promoters,
        fill: 'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(225,229,235,0.34) 42%, rgba(104,109,116,0.14) 100%)',
      },
    ],
    [state.detractors, state.neutral, state.promoters]
  )

  const activateDemo = () => setState(demoSeed)

  const clearDashboard = () => setState(cleanSeed)

  const calculateMetrics = () => {
    setState((current) => {
      const total = current.promoters + current.neutral + current.detractors
      if (total === 0) return current

      const computedNps = Math.round(((current.promoters - current.detractors) / total) * 100)
      const computedFidelity = Math.max(0, Math.min(100, Math.round((computedNps + current.structured) / 2)))

      return {
        ...current,
        nps: computedNps,
        fidelity: computedFidelity,
      }
    })
  }

  const refreshDemo = () => {
    setState((current) => {
      if (current.mode === 'clean') {
        return current
      }

      const responses = current.responses + 3
      const promoters = current.promoters + 2
      const neutral = current.neutral + 1
      const detractors = current.detractors
      const structured = Math.min(responses, current.structured + 2)
      const total = promoters + neutral + detractors
      const nps = Math.round(((promoters - detractors) / total) * 100)
      const fidelity = Math.max(0, Math.min(100, Math.round((nps + structured) / 2)))

      return {
        mode: 'demo',
        responses,
        promoters,
        neutral,
        detractors,
        structured,
        nps,
        fidelity,
      }
    })
  }

  const pulsePath = useMemo(() => {
    const fidelity = state.mode === 'clean' ? 8 : state.fidelity
    const nps = state.mode === 'clean' ? 4 : state.nps
    const responses = state.mode === 'clean' ? 6 : Math.min(state.responses, 90)
    const structured = state.mode === 'clean' ? 5 : Math.min(state.structured, 80)

    return `M 0 108
      C 34 ${110 - fidelity * 0.4}, 58 ${102 - nps * 0.35}, 88 ${100 - fidelity * 0.25}
      S 150 ${88 - responses * 0.18}, 188 ${82 - structured * 0.16}
      S 250 ${76 - fidelity * 0.14}, 290 ${66 - nps * 0.12}
      S 354 ${70 - responses * 0.1}, 420 ${58 - fidelity * 0.08}`
  }, [state.fidelity, state.mode, state.nps, state.responses, state.structured])

  return (
    <motion.section
      className="sea-dark-glass rounded-[2rem] p-5 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.14 }}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <div className="sea-dark-glass flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-white/12">
              <Activity className="h-5 w-5 text-white/76" />
            </div>
            <div className="flex flex-wrap gap-2">
              <ActionButton icon={Sparkles} label="Modo demo" onClick={activateDemo} />
              <ActionButton icon={BarChart3} label="Calcular" onClick={calculateMetrics} />
              <ActionButton icon={RotateCcw} label="Atualizar" onClick={refreshDemo} />
              <ActionButton icon={Trash2} label="Apagar" onClick={clearDashboard} />
            </div>
            <h3 className="text-xl font-semibold tracking-[0.18em] text-white md:text-[1.55rem]">
              DASH
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 md:gap-3">
          <MetricCard label="NPS" value={state.nps} suffix={state.mode === 'clean' ? '' : ''} />
          <MetricCard label="Fidelidade" value={state.fidelity} suffix={state.mode === 'clean' ? '' : '%'} />
          <MetricCard label="Respostas" value={state.responses} />
          <MetricCard label="Feedbacks lidos" value={state.structured} />
        </div>

        <div className="sea-dark-glass relative overflow-hidden rounded-[1.7rem] p-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_86%_22%,rgba(226,231,238,0.08),transparent_28%)]" />
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
              Distribuicao NPS
            </p>
            <p className="text-xs text-white/52">
              {state.mode === 'clean' ? 'Standby' : 'Demo'}
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.76fr_1.24fr]">
            <div className="grid grid-cols-3 gap-3 items-end">
              {bars.map((bar) => (
                <div key={bar.label} className="sea-dark-glass relative overflow-hidden rounded-[1.25rem] border border-white/10 px-3 py-3">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.08),transparent_34%)]" />
                  <div className="relative flex h-36 items-end justify-center overflow-hidden rounded-[0.95rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(10,10,12,0.92)_26%,rgba(2,2,3,0.98)_100%)] px-2 py-2">
                    <div className="absolute inset-x-2 bottom-2 top-2 rounded-[0.8rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_30%,rgba(255,255,255,0.02)_100%)]" />
                    <motion.div
                      className="relative z-10 w-full rounded-[1rem] shadow-[0_0_26px_rgba(255,255,255,0.18)]"
                      style={{ background: bar.fill }}
                      initial={{ height: 0 }}
                      animate={{ height: `${state.mode === 'clean' ? 10 : (bar.value / totalBars) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">{bar.label}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{bar.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="sea-dark-glass relative overflow-hidden rounded-[1.3rem] border border-white/10 p-4">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(214,220,228,0.06),transparent_30%)]" />
              <div className="mb-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
                <span>Pulso NPS</span>
                <span>{state.mode === 'clean' ? 'Standby' : 'Realtime'}</span>
              </div>

              <svg viewBox="0 0 420 140" className="relative h-40 w-full">
                <defs>
                  <linearGradient id="dashStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,0.92)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.22)" />
                  </linearGradient>
                  <linearGradient id="dashFill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.24)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                </defs>

                <path
                  d={`${pulsePath} L 420 140 L 0 140 Z`}
                  fill="url(#dashFill)"
                  opacity="0.7"
                />
                <path
                  d={pulsePath}
                  fill="none"
                  stroke="url(#dashStroke)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <motion.circle
                  cx="420"
                  cy={finalPulseY}
                  r="5.5"
                  fill="#ffffff"
                  initial={{ opacity: 0.45, scale: 0.9 }}
                  animate={{ opacity: [0.42, 1, 0.42], scale: [0.9, 1.18, 0.9] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: `420px ${finalPulseY}px` }}
                />
                {[72, 164, 256, 348].map((x) => (
                  <line
                    key={x}
                    x1={x}
                    x2={x}
                    y1="12"
                    y2="132"
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="6 10"
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Sparkles
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-1.5 rounded-[0.9rem] border border-white/12 px-2.5 py-1.5 text-[10px] font-semibold text-white/84 transition hover:text-white md:text-[11px]"
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(10,10,12,0.92) 52%, rgba(3,3,4,0.985) 100%)',
      }}
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </button>
  )
}

function MetricCard({
  label,
  value,
  suffix = '',
}: {
  label: string
  value: number
  suffix?: string
}) {
  return (
    <div className="sea-dark-glass rounded-[1.25rem] px-3 py-3">
      <p className="whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.14em] text-white/42 md:text-[9px]">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white md:text-xl">
        {value}
        <span className="ml-0.5 text-[11px] text-white/54 md:text-xs">{suffix}</span>
      </p>
    </div>
  )
}
