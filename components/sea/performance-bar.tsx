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

const TBL_ITEMS = [
  { icon: Leaf, label: 'Planeta', desc: 'Zero papel · Digital-first · Offline · Eco-eficiência digital' },
  { icon: Heart, label: 'Pessoas', desc: 'Profissional preparado = paciente seguro · Inclusão · Diversidade' },
  { icon: Scale, label: 'Prosperidade', desc: 'Menos tempo VM = menos custo hospitalar · Valor compartilhado' },
]

const ODS_ITEMS = [
  { num: 3, label: 'Saúde e Bem-Estar', desc: 'Profissionais mais preparados para cuidar de vidas' },
  { num: 4, label: 'Educação de Qualidade', desc: 'Ensino acessível com IA e simulações 3D' },
  { num: 9, label: 'Inovação e Infraestrutura', desc: 'IA adaptativa · Tecnologia à beira do leito' },
  { num: 10, label: 'Redução das Desigualdades', desc: 'Acesso igualitário ao conhecimento clínico' },
  { num: 12, label: 'Consumo Responsável', desc: 'Zero papel · Menos recursos · Digital sustentável' },
]

const CSV_ITEMS = [
  { label: 'Valor Social', desc: 'Reduz evasão profissional · Capacita fisioterapeutas · Melhora desfechos clínicos' },
  { label: 'Valor Econômico', desc: 'Mercado inexplorado de EdTech em saúde · Diferencial competitivo por inclusão' },
  { label: 'Valor Ambiental', desc: 'Digitalização reduz pegada de carbono · Código otimizado · Menos processamento em nuvem' },
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

      {/* Sustentabilidade — TBL */}
      <div
        className="rounded-[1.4rem] p-4"
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)',
        }}
      >
        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Triple Bottom Line (TBL)
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {TBL_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 rounded-[1rem] border border-white/6 bg-white/[0.02] px-3 py-2.5"
            >
              <item.icon className="h-4 w-4 shrink-0 text-white/50" />
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-white/70">{item.label}</p>
                <p className="text-[8px] leading-relaxed text-white/35">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ODS — Objetivos de Desenvolvimento Sustentável */}
      <div
        className="rounded-[1.4rem] p-4"
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)',
        }}
      >
        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
          ODS — Objetivos de Desenvolvimento Sustentável
        </p>

        <div className="grid grid-cols-1 gap-2">
          {ODS_ITEMS.map((item) => (
            <div
              key={item.num}
              className="flex items-center gap-3 rounded-[1rem] border border-white/6 bg-white/[0.02] px-3 py-2"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-[9px] font-bold text-white/70">
                {item.num}
              </span>
              <div>
                <p className="text-[9px] font-semibold text-white/70">{item.label}</p>
                <p className="text-[7px] text-white/35">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSV — Criação de Valor Compartilhado */}
      <div
        className="rounded-[1.4rem] p-4"
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)',
        }}
      >
        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
          CSV — Criação de Valor Compartilhado
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {CSV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="rounded-[1rem] border border-white/6 bg-white/[0.02] px-3 py-2.5"
            >
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/70">{item.label}</p>
              <p className="mt-1 text-[7px] leading-relaxed text-white/35">{item.desc}</p>
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
