'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Leaf, Shield, Heart, Megaphone, FileText, Scale, BookOpen, Stethoscope, Star, MessageSquare } from 'lucide-react'

// Real metrics from localStorage
function useAppMetrics() {
  const [metrics, setMetrics] = useState({
    prontuarios: 0,
    conteudosAcessados: 0,
    simulacoesUsadas: 0,
    calculosRealizados: 0,
  })

  useEffect(() => {
    try {
      const records = JSON.parse(localStorage.getItem('sea-icu-records') || '[]')
      const conteudos = parseInt(localStorage.getItem('sea-conteudos-count') || '0', 10)
      const sims = parseInt(localStorage.getItem('sea-sims-count') || '0', 10)
      const calcs = parseInt(localStorage.getItem('sea-calcs-count') || '0', 10)
      setMetrics({
        prontuarios: Array.isArray(records) ? records.length : 0,
        conteudosAcessados: conteudos,
        simulacoesUsadas: sims,
        calculosRealizados: calcs,
      })
    } catch { /* empty */ }
  }, [])

  return metrics
}

const SUSTAINABILITY_ITEMS = [
  { icon: Leaf, label: 'Ambiental', desc: 'Zero papel · Digital-first · Offline' },
  { icon: Heart, label: 'Social', desc: 'Profissional preparado = paciente seguro' },
  { icon: Scale, label: 'Econômico', desc: 'Menos tempo VM = menos custo hospitalar' },
]

const GOVERNANCE_ITEMS = [
  { icon: FileText, label: 'Políticas' },
  { icon: Shield, label: 'Práticas' },
  { icon: Scale, label: 'Compliance' },
  { icon: Megaphone, label: 'Canal de Denúncias e Feedback' },
]

export function PerformanceBar() {
  const metrics = useAppMetrics()
  const folhasEconomizadas = metrics.prontuarios * 5

  return (
    <motion.section
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Impacto SEA */}
      <div
        className="rounded-[1.4rem] p-4"
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)',
        }}
      >
        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Impacto SEA
        </p>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <ImpactCard icon={Stethoscope} value={metrics.prontuarios} label="Prontuários" sub={`${folhasEconomizadas} folhas economizadas`} />
          <ImpactCard icon={BookOpen} value={metrics.conteudosAcessados} label="Conteúdos" sub="acessados" />
          <ImpactCard icon={Leaf} value={folhasEconomizadas} label="Folhas" sub="papel economizado" />
          <ImpactCard icon={Heart} value={metrics.calculosRealizados} label="Cálculos" sub="realizados" />
        </div>
      </div>

      {/* NPS e Feedback */}
      <div
        className="rounded-[1.4rem] p-4"
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)',
        }}
      >
        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
          NPS e Feedback
        </p>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[1rem] border border-white/6 bg-white/[0.02] px-3 py-3 text-center">
            <Star className="mx-auto mb-1 h-4 w-4 text-white/40" />
            <p className="text-2xl font-semibold tabular-nums text-white/85">--</p>
            <p className="text-[8px] font-semibold uppercase tracking-wider text-white/50">NPS Score</p>
            <p className="text-[7px] text-white/25">Disponível com avaliações</p>
          </div>
          <div className="rounded-[1rem] border border-white/6 bg-white/[0.02] px-3 py-3 text-center">
            <MessageSquare className="mx-auto mb-1 h-4 w-4 text-white/40" />
            <p className="text-2xl font-semibold tabular-nums text-white/85">--</p>
            <p className="text-[8px] font-semibold uppercase tracking-wider text-white/50">Feedbacks</p>
            <p className="text-[7px] text-white/25">Disponível com respostas</p>
          </div>
        </div>
      </div>

      {/* Sustentabilidade */}
      <div
        className="rounded-[1.4rem] p-4"
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)',
        }}
      >
        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Sustentabilidade (Triple Bottom Line)
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {SUSTAINABILITY_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 rounded-[1rem] border border-white/6 bg-white/[0.02] px-3 py-2.5"
            >
              <item.icon className="h-4 w-4 shrink-0 text-white/50" />
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-white/70">{item.label}</p>
                <p className="text-[8px] text-white/35">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Governança */}
      <div
        className="rounded-[1.4rem] p-4"
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)',
        }}
      >
        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Governança
        </p>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {GOVERNANCE_ITEMS.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-2 rounded-[1rem] border border-white/6 bg-white/[0.02] px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
            >
              <item.icon className="h-3.5 w-3.5 shrink-0 text-white/45" />
              <span className="text-[8px] font-medium tracking-wider text-white/60">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

function ImpactCard({ icon: Icon, value, label, sub }: { icon: typeof Leaf; value: number; label: string; sub: string }) {
  return (
    <div className="rounded-[1rem] border border-white/6 bg-white/[0.02] px-3 py-2.5 text-center">
      <Icon className="mx-auto mb-1 h-4 w-4 text-white/40" />
      <p className="text-lg font-semibold tabular-nums text-white/85">{value}</p>
      <p className="text-[8px] font-semibold uppercase tracking-wider text-white/50">{label}</p>
      <p className="text-[7px] text-white/25">{sub}</p>
    </div>
  )
}
