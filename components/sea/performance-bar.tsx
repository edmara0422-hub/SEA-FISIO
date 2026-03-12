'use client'

import { motion } from 'framer-motion'
import { ClipboardCheck, Gauge, MessageSquareQuote, ShieldCheck, Sparkles } from 'lucide-react'

export function PerformanceBar() {
  const dashboard = [
    {
      icon: ClipboardCheck,
      label: 'Coleta de feedback',
      value: 'Pronta para ativacao',
    },
    {
      icon: Gauge,
      label: 'NPS',
      value: 'Aguardando primeira rodada',
    },
    {
      icon: MessageSquareQuote,
      label: 'Leitura qualitativa',
      value: 'Sem temas recorrentes mapeados',
    },
    {
      icon: ShieldCheck,
      label: 'Proxima revisao',
      value: 'Definir janela clinica',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="chrome-card rounded-[2rem] p-5 md:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/46">
              Fidelidade clinica
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white md:text-[2rem]">
              Feedback e NPS com leitura real, sem numeros artificiais.
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/56">
              Esta camada valida experiencia, clareza, valor clinico e estabilidade do
              produto sem inventar metricas. O objetivo aqui e preparar a coleta e a leitura
              das respostas reais.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <StatusChip
              icon={MessageSquareQuote}
              title="Canal de feedback"
              subtitle="Pronto para abrir coleta guiada"
            />
            <StatusChip
              icon={Sparkles}
              title="NPS"
              subtitle="Sem baseline definido ainda"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          className="chrome-card rounded-[1.85rem] p-5"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/44">
            Feedback estruturado
          </p>
          <h4 className="mt-3 text-xl font-semibold text-white">O que precisa ser lido</h4>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              'Clareza da jornada de estudo',
              'Valor percebido das simulacoes',
              'Estabilidade e fluidez visual',
              'Confianca clinica na experiencia',
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/68"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="chrome-card rounded-[1.85rem] p-5"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/44">
            Painel NPS
          </p>
          <h4 className="mt-3 text-xl font-semibold text-white">Pronto para leitura quando a base nascer</h4>
          <div className="mt-5 flex gap-2">
            {['Detratores', 'Neutros', 'Promotores'].map((label, index) => (
              <div
                key={label}
                className={`h-24 flex-1 rounded-[1.3rem] border border-white/10 ${
                  index === 2
                    ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.03))]'
                    : 'bg-white/[0.03]'
                }`}
              />
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-white/58">
            Sem respostas ainda. Quando o fluxo for ativado, este bloco passa a mostrar a
            distribuicao real de percepcao do produto.
          </p>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboard.map((item, index) => {
          const Icon = item.icon

          return (
            <motion.div
              key={item.label}
              className="chrome-card rounded-[1.55rem] p-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 + index * 0.06 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] border border-white/12 bg-white/[0.06]">
                  <Icon className="h-4 w-4 text-white/74" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-white/72">{item.value}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function StatusChip({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof MessageSquareQuote
  title: string
  subtitle: string
}) {
  return (
    <div className="rounded-[1.35rem] border border-white/12 bg-white/[0.04] px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-[0.95rem] border border-white/12 bg-black/24">
          <Icon className="h-4 w-4 text-white/74" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-white/52">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
