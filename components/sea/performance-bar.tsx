'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, MessageSquareQuote, RotateCcw, Sparkles, Trash2 } from 'lucide-react'

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
              <MessageSquareQuote className="h-5 w-5 text-white/76" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/46">
                Feedback estruturado + NPS
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white md:text-[1.6rem]">
                Dashboard demo de fidelidade
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

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="NPS" value={state.nps} suffix={state.mode === 'clean' ? '' : ''} />
          <MetricCard label="Fidelidade" value={state.fidelity} suffix={state.mode === 'clean' ? '' : '%'} />
          <MetricCard label="Respostas" value={state.responses} />
          <MetricCard label="Feedbacks lidos" value={state.structured} />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[1.6rem] border border-white/10 bg-black/18 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
                Distribuicao NPS
              </p>
              <p className="text-xs text-white/52">
                {state.mode === 'clean' ? 'Sem base' : `${totalBars} respostas classificadas`}
              </p>
            </div>

            <div className="grid gap-3">
              {bars.map((bar) => (
                <div key={bar.label}>
                  <div className="mb-1 flex items-center justify-between text-xs text-white/58">
                    <span>{bar.label}</span>
                    <span>{bar.value}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className={`h-full rounded-full ${bar.tone}`}
                      style={{ width: `${(bar.value / totalBars) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-black/18 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
                Leitura de feedback
              </p>
              <p className="text-xs text-white/52">
                {state.mode === 'clean' ? 'Vazio' : 'Modo demo ativo'}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                state.mode === 'clean' ? 'Sem retorno clinico' : 'Clareza alta no neuro core',
                state.mode === 'clean' ? 'Sem retorno de UX' : 'Pneumo com boa leitura visual',
                state.mode === 'clean' ? 'Sem retorno de valor' : 'Cardio com resposta imediata',
                state.mode === 'clean' ? 'Sem retorno de fluxo' : 'Shell cromada com boa percepcao',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72"
                >
                  {item}
                </div>
              ))}
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
    <div className="rounded-[1.45rem] border border-white/10 bg-black/18 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">
        {value}
        <span className="text-base text-white/54">{suffix}</span>
      </p>
    </div>
  )
}
