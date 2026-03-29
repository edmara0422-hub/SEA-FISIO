'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Shield, Heart, Megaphone, FileText, Scale, BookOpen, Stethoscope, Star, MessageSquare, X, Send, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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

function useNpsData() {
  const [nps, setNps] = useState<{ score: number; total: number } | null>(null)
  const [fbCount, setFbCount] = useState(0)
  useEffect(() => {
    if (!supabase) return
    supabase.from('sea_feedback').select('score, type').then(({ data }) => {
      if (!data) return
      const npsEntries = data.filter(d => d.type === 'nps' && d.score !== null)
      const allFb = data.filter(d => d.type !== 'test')
      setFbCount(allFb.length)
      if (npsEntries.length === 0) return
      const promoters = npsEntries.filter(d => d.score >= 9).length
      const detractors = npsEntries.filter(d => d.score <= 6).length
      const score = Math.round(((promoters - detractors) / npsEntries.length) * 100)
      setNps({ score, total: npsEntries.length })
    })
  }, [])
  return { nps, fbCount }
}

export function PerformanceBar() {
  const metrics = useAppMetrics()
  const folhasEconomizadas = metrics.prontuarios * 5
  const { nps, fbCount } = useNpsData()
  const [showFeedback, setShowFeedback] = useState(false)
  const [showReport, setShowReport] = useState(false)

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
            <p className="text-2xl font-semibold tabular-nums text-white/85">{nps ? nps.score : '--'}</p>
            <p className="text-[8px] font-semibold uppercase tracking-wider text-white/50">NPS Score</p>
            <p className="text-[7px] text-white/25">{nps ? `${nps.total} avaliações` : 'Sem avaliações'}</p>
          </div>
          <button onClick={() => setShowFeedback(true)} className="rounded-[1rem] border border-white/6 bg-white/[0.02] px-3 py-3 text-center transition hover:bg-white/[0.04]">
            <MessageSquare className="mx-auto mb-1 h-4 w-4 text-white/40" />
            <p className="text-2xl font-semibold tabular-nums text-white/85">{fbCount || '--'}</p>
            <p className="text-[8px] font-semibold uppercase tracking-wider text-white/50">Feedbacks</p>
            <p className="text-[7px] text-white/25">Toque para avaliar</p>
          </button>
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
              onClick={item.label.includes('Denúncia') ? () => setShowReport(true) : undefined}
              className="flex items-center gap-2 rounded-[1rem] border border-white/6 bg-white/[0.02] px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
            >
              <item.icon className="h-3.5 w-3.5 shrink-0 text-white/45" />
              <span className="text-[8px] font-medium tracking-wider text-white/60">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Modais */}
      <AnimatePresence>
        {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
        {showReport && <ReportModal onClose={() => setShowReport(false)} />}
      </AnimatePresence>
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

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-sm rounded-[1.4rem] border border-white/10 p-5"
        style={{ background: 'linear-gradient(180deg, rgba(20,20,20,0.98) 0%, rgba(8,8,8,0.99) 100%)' }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">{title}</p>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [npsScore, setNpsScore] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    if (!supabase || (npsScore === null && !message.trim())) return
    if (npsScore !== null) {
      await supabase.from('sea_feedback').insert({ type: 'nps', score: npsScore, message: message.trim() || null })
    }
    if (message.trim()) {
      await supabase.from('sea_feedback').insert({ type: 'feedback', message: message.trim() })
    }
    setSent(true)
    setTimeout(onClose, 1500)
  }

  if (sent) {
    return (
      <ModalShell title="Feedback" onClose={onClose}>
        <div className="flex flex-col items-center gap-3 py-6">
          <Check className="h-8 w-8 text-white/60" />
          <p className="text-sm text-white/70">Obrigado pelo seu feedback!</p>
        </div>
      </ModalShell>
    )
  }

  return (
    <ModalShell title="Feedback e NPS" onClose={onClose}>
      <p className="mb-3 text-[10px] text-white/40">De 0 a 10, o quanto você recomendaria o SEA FISIO?</p>

      <div className="mb-4 flex flex-wrap justify-center gap-1.5">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => setNpsScore(i)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border text-[11px] font-semibold transition ${
              npsScore === i
                ? 'border-white/30 bg-white/15 text-white'
                : 'border-white/8 bg-white/[0.03] text-white/50 hover:bg-white/[0.06]'
            }`}
          >
            {i}
          </button>
        ))}
      </div>

      <textarea
        className="mb-3 w-full rounded-[0.8rem] border border-white/8 bg-white/[0.03] px-3 py-2 text-[11px] text-white/80 outline-none placeholder:text-white/25 focus:border-white/15"
        rows={3}
        placeholder="Deixe um comentário (opcional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={npsScore === null && !message.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-[0.8rem] border border-white/12 bg-white/[0.06] py-2 text-[10px] font-semibold tracking-wider text-white/70 transition disabled:opacity-30 hover:bg-white/[0.1]"
      >
        <Send className="h-3 w-3" /> Enviar
      </button>
    </ModalShell>
  )
}

function ReportModal({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState('denuncia')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const types = [
    { value: 'denuncia', label: 'Denúncia' },
    { value: 'assedio', label: 'Assédio' },
    { value: 'etica', label: 'Ética' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'outro', label: 'Outro' },
  ]

  const handleSubmit = async () => {
    if (!supabase || !message.trim()) return
    await supabase.from('sea_reports').insert({ type, message: message.trim(), anonymous: true })
    setSent(true)
    setTimeout(onClose, 1500)
  }

  if (sent) {
    return (
      <ModalShell title="Canal de Denúncias" onClose={onClose}>
        <div className="flex flex-col items-center gap-3 py-6">
          <Check className="h-8 w-8 text-white/60" />
          <p className="text-sm text-white/70">Recebemos sua mensagem.</p>
          <p className="text-[10px] text-white/35">Sua identidade está protegida.</p>
        </div>
      </ModalShell>
    )
  }

  return (
    <ModalShell title="Canal de Denúncias e Feedback" onClose={onClose}>
      <p className="mb-3 text-[10px] text-white/40">Todas as denúncias são anônimas e confidenciais.</p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {types.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`rounded-full border px-3 py-1 text-[9px] font-semibold transition ${
              type === t.value
                ? 'border-white/25 bg-white/12 text-white/80'
                : 'border-white/8 bg-white/[0.03] text-white/45 hover:bg-white/[0.06]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <textarea
        className="mb-3 w-full rounded-[0.8rem] border border-white/8 bg-white/[0.03] px-3 py-2 text-[11px] text-white/80 outline-none placeholder:text-white/25 focus:border-white/15"
        rows={4}
        placeholder="Descreva sua denúncia ou feedback..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={!message.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-[0.8rem] border border-white/12 bg-white/[0.06] py-2 text-[10px] font-semibold tracking-wider text-white/70 transition disabled:opacity-30 hover:bg-white/[0.1]"
      >
        <Send className="h-3 w-3" /> Enviar
      </button>
    </ModalShell>
  )
}
