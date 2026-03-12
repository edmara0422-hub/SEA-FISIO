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

  const bars = useMemo(
    () => [
      { label: 'Detratores', value: state.detractors, tone: 'bg-white/[0.08]' },
      { label: 'Neutros', value: state.neutral, tone: 'bg-white/[0.16]' },
      {
        label: 'Promotores',
        value: state.promoters,
        tone: 'bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.08))]',
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
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-white/12 bg-black/24">
              <Activity className="h-5 w-5 text-white/76" />
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-[0.18em] text-white md:text-[1.55rem]">
                DASH
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <ActionButton icon={Sparkles} label="Modo demo" onClick={activateDemo} />
            <ActionButton icon={BarChart3} label="Calcular" onClick={calculateMetrics} />
            <ActionButton icon={RotateCcw} label="Atualizar" onClick={refreshDemo} />
            <ActionButton icon={Trash2} label="Apagar" onClick={clearDashboard} />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <MetricCard label="NPS" value={state.nps} suffix={state.mode === 'clean' ? '' : ''} />
          <MetricCard label="Fidelidade" value={state.fidelity} suffix={state.mode === 'clean' ? '' : '%'} />
          <MetricCard label="Respostas" value={state.responses} />
          <MetricCard label="Feedbacks lidos" value={state.structured} />
        </div>

        <div className="sea-dark-glass rounded-[1.7rem] p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
              Distribuicao NPS
            </p>
            <p className="text-xs text-white/52">
              {state.mode === 'clean' ? 'Sem base' : 'Simulacao ativa'}
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.76fr_1.24fr]">
            <div className="grid grid-cols-3 gap-3 items-end">
              {bars.map((bar) => (
                <div key={bar.label} className="rounded-[1.25rem] border border-white/10 bg-black/18 px-3 py-3">
                  <div className="flex h-36 items-end justify-center">
                    <motion.div
                      className={`w-full rounded-[1rem] ${bar.tone}`}
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

            <div className="rounded-[1.3rem] border border-white/10 bg-black/18 p-4">
              <div className="mb-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
                <span>Pulso de fidelidade</span>
                <span>{state.mode === 'clean' ? 'Standby' : 'Demo realtime'}</span>
              </div>

              <svg viewBox="0 0 420 140" className="h-40 w-full">
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
      className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] border border-white/12 px-4 py-3 text-sm font-semibold text-white/84 transition hover:text-white"
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(18,18,20,0.84) 60%, rgba(8,8,10,0.98) 100%)',
      }}
    >
      <Icon className="h-4 w-4" />
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
      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/42">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white md:text-2xl">
        {value}
        <span className="text-sm text-white/54">{suffix}</span>
      </p>
    </div>
  )
}
