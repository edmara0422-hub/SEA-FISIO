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
  const [showGov, setShowGov] = useState<string | null>(null)

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

        <div className="grid grid-cols-4 gap-1.5">
          <MiniImpact icon={Stethoscope} value={metrics.prontuarios} label="Prontuários" />
          <MiniImpact icon={BookOpen} value={metrics.conteudosAcessados} label="Conteúdos" />
          <MiniImpact icon={Leaf} value={folhasEconomizadas} label="Folhas" />
          <MiniImpact icon={Heart} value={metrics.calculosRealizados} label="Cálculos" />
        </div>
      </div>

      {/* NPS + Feedback — dados em tempo real */}
      <div
        className="rounded-[1.4rem] p-4"
        style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)' }}
      >
        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">NPS e Feedback</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-[0.8rem] border border-white/6 bg-white/[0.02] px-2 py-2 text-center">
            <p className="text-xl font-semibold tabular-nums text-white/85">{nps ? nps.score : '--'}</p>
            <p className="text-[7px] text-white/40">NPS Score</p>
          </div>
          <div className="rounded-[0.8rem] border border-white/6 bg-white/[0.02] px-2 py-2 text-center">
            <p className="text-xl font-semibold tabular-nums text-white/85">{nps ? nps.total : 0}</p>
            <p className="text-[7px] text-white/40">Avaliações</p>
          </div>
          <div className="rounded-[0.8rem] border border-white/6 bg-white/[0.02] px-2 py-2 text-center">
            <p className="text-xl font-semibold tabular-nums text-white/85">{fbCount}</p>
            <p className="text-[7px] text-white/40">Feedbacks</p>
          </div>
        </div>
      </div>

      {/* Sustentabilidade — TBL + ODS + CSV juntos */}
      <div
        className="rounded-[1.4rem] p-4"
        style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)' }}
      >
        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Sustentabilidade
        </p>

        {/* TBL */}
        <div className="mb-3 grid grid-cols-3 gap-1.5">
          {TBL_ITEMS.map((item) => (
            <div key={item.label} className="rounded-[0.8rem] border border-white/6 bg-white/[0.02] px-2 py-2.5 text-center">
              <item.icon className="mx-auto mb-1 h-3.5 w-3.5 text-white/45" />
              <p className="text-[9px] font-semibold text-white/65">{item.label}</p>
              <p className="mt-0.5 text-[7px] leading-snug text-white/35">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ODS inline */}
        <div className="mb-3 text-center">
          <p className="mb-1.5 text-[7px] font-semibold uppercase tracking-[0.15em] text-white/30">ODS</p>
          <div className="flex flex-wrap justify-center gap-1">
            {ODS_ITEMS.map((item) => (
              <div key={item.num} className="flex items-center gap-1 rounded-full border border-white/6 bg-white/[0.02] px-2 py-0.5">
                <span className="text-[9px] font-bold text-white/60">{item.num}</span>
                <span className="text-[8px] text-white/40">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CSV inline */}
        <div className="text-center">
          <p className="mb-1.5 text-[7px] font-semibold uppercase tracking-[0.15em] text-white/30">CSV — Valor Compartilhado</p>
          <div className="grid grid-cols-3 gap-1.5">
            {CSV_ITEMS.map((item) => (
              <div key={item.label} className="rounded-[0.6rem] border border-white/5 bg-white/[0.015] px-2 py-2 text-center">
                <p className="text-[8px] font-semibold text-white/55">{item.label}</p>
                <p className="text-[7px] leading-snug text-white/30">{item.desc}</p>
              </div>
            ))}
          </div>
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
              onClick={() => {
                if (item.label.includes('Denúncia')) setShowReport(true)
                else if (item.label === 'Políticas') setShowGov('politicas')
                else if (item.label === 'Práticas') setShowGov('praticas')
                else if (item.label === 'Compliance') setShowGov('compliance')
              }}
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
        {showReport && <FeedbackModal onClose={() => setShowReport(false)} startTab="denuncia" />}
        {showGov && <GovernanceModal type={showGov} onClose={() => setShowGov(null)} />}
      </AnimatePresence>
    </motion.section>
  )
}

const GOV_CONTENT: Record<string, { title: string; sections: { heading: string; items: string[] }[] }> = {
  politicas: {
    title: 'Políticas SEA FISIO',
    sections: [
      {
        heading: 'Política de Privacidade e LGPD',
        items: [
          'Os dados clínicos permanecem exclusivamente no dispositivo do profissional (localStorage)',
          'Nenhum dado identificável de paciente é transmitido para servidores externos',
          'O prontuário SEA é uma ferramenta de raciocínio clínico pessoal, não um PEP',
          'A sincronização via Supabase utiliza identificadores anônimos (session_id)',
          'O usuário pode excluir todos os seus dados a qualquer momento',
        ],
      },
      {
        heading: 'Política de Sustentabilidade',
        items: [
          'Compromisso com o Triple Bottom Line: Pessoas, Planeta e Prosperidade',
          'Alinhamento com os ODS 3, 4, 9, 10 e 12 da ONU',
          'Priorização do modo offline para reduzir consumo energético de servidores',
          'Eliminação do uso de papel na prática clínica à beira do leito',
        ],
      },
      {
        heading: 'Política de Inclusão e Diversidade',
        items: [
          'Design acessível como princípio, não como adaptação posterior',
          'Compromisso com igualdade de acesso ao conhecimento clínico',
          'Respeito à diversidade de perfis profissionais e acadêmicos',
          'Canal de denúncias anônimo para assédio e discriminação',
        ],
      },
    ],
  },
  praticas: {
    title: 'Práticas SEA FISIO',
    sections: [
      {
        heading: 'Práticas de Segurança do Paciente',
        items: [
          'Cálculos automáticos validados por literatura (driving pressure, RSBI, P/F)',
          'Alertas inteligentes para intubação prolongada (>7 dias)',
          'Detecção automática de elegibilidade para desmame ventilatório',
          'Histórico completo de condução para rastreabilidade clínica',
        ],
      },
      {
        heading: 'Práticas de Educação Continuada',
        items: [
          'Conteúdo baseado em guidelines AMIB, SBPT, ATS e ERS',
          'Simulações 3D interativas para aprendizado imersivo',
          'IA tutor especialista com raciocínio clínico contextualizado',
          'Atualização contínua de protocolos e evidências',
        ],
      },
      {
        heading: 'Práticas de Controle de Infecção',
        items: [
          'Zero papel = zero vetor de transmissão por contato',
          'Eliminação de pranchetas compartilhadas na UTI',
          'Dispositivo pessoal higienizável vs. papel contaminado',
          'Conformidade com práticas de precaução de contato',
        ],
      },
    ],
  },
  compliance: {
    title: 'Compliance SEA FISIO',
    sections: [
      {
        heading: 'Conformidade Legal',
        items: [
          'LGPD (Lei Geral de Proteção de Dados) — dados no dispositivo, sem coleta de PII',
          'Código de Ética Profissional da Fisioterapia (COFFITO)',
          'Resoluções do COFFITO sobre prontuário eletrônico e teleatendimento',
          'Marco Civil da Internet — transparência no tratamento de dados',
        ],
      },
      {
        heading: 'Conformidade Ética',
        items: [
          'Canal de denúncias anônimo e confidencial',
          'Política de tolerância zero para assédio e discriminação',
          'Transparência na utilização de IA (o tutor informa que é IA)',
          'Conteúdo revisado por profissionais especializados',
        ],
      },
      {
        heading: 'Conformidade Técnica',
        items: [
          'Criptografia de dados em trânsito (HTTPS/TLS)',
          'Armazenamento local isolado (sandboxed localStorage)',
          'Código-fonte versionado e auditável',
          'Testes de integridade nos cálculos clínicos',
        ],
      },
    ],
  },
}

function GovernanceModal({ type, onClose }: { type: string; onClose: () => void }) {
  const content = GOV_CONTENT[type]
  if (!content) return null

  return (
    <ModalShell title={content.title} onClose={onClose}>
      <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
        {content.sections.map((section) => (
          <div key={section.heading}>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/60">{section.heading}</p>
            <ul className="space-y-1.5">
              {section.items.map((item, i) => (
                <li key={i} className="flex gap-2 text-[10px] leading-relaxed text-white/45">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-white/30" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </ModalShell>
  )
}

function MiniImpact({ icon: Icon, value, label }: { icon: typeof Leaf; value: number; label: string }) {
  return (
    <div className="rounded-[0.7rem] border border-white/6 bg-white/[0.02] px-1.5 py-2 text-center">
      <Icon className="mx-auto mb-0.5 h-3 w-3 text-white/35" />
      <p className="text-sm font-semibold tabular-nums text-white/80">{value}</p>
      <p className="text-[6px] uppercase tracking-wider text-white/40">{label}</p>
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

function FeedbackModal({ onClose, startTab = 'nps' }: { onClose: () => void; startTab?: string }) {
  const [tab, setTab] = useState(startTab)
  const [npsScore, setNpsScore] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [reportType, setReportType] = useState('denuncia')
  const [sent, setSent] = useState(false)

  const tabs = [
    { id: 'nps', label: 'NPS' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'denuncia', label: 'Denúncia' },
  ]

  const reportTypes = [
    { value: 'denuncia', label: 'Denúncia' },
    { value: 'assedio', label: 'Assédio' },
    { value: 'etica', label: 'Ética' },
    { value: 'outro', label: 'Outro' },
  ]

  const handleSubmit = async () => {
    if (!supabase) return
    if (tab === 'nps' && npsScore !== null) {
      await supabase.from('sea_feedback').insert({ type: 'nps', score: npsScore, message: message.trim() || null })
    } else if (tab === 'feedback' && message.trim()) {
      await supabase.from('sea_feedback').insert({ type: 'feedback', message: message.trim() })
    } else if (tab === 'denuncia' && message.trim()) {
      await supabase.from('sea_reports').insert({ type: reportType, message: message.trim(), anonymous: true })
    } else return
    setSent(true)
    setTimeout(onClose, 1500)
  }

  if (sent) {
    return (
      <ModalShell title="Enviado" onClose={onClose}>
        <div className="flex flex-col items-center gap-3 py-6">
          <Check className="h-8 w-8 text-white/60" />
          <p className="text-sm text-white/70">{tab === 'denuncia' ? 'Recebemos sua denúncia.' : 'Obrigado pelo seu feedback!'}</p>
          {tab === 'denuncia' && <p className="text-[10px] text-white/35">Sua identidade está protegida.</p>}
        </div>
      </ModalShell>
    )
  }

  const canSubmit = tab === 'nps' ? npsScore !== null : message.trim().length > 0

  return (
    <ModalShell title="Canal de Denúncias e Feedback" onClose={onClose}>
      {/* Tabs */}
      <div className="mb-4 flex gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setMessage(''); setNpsScore(null) }}
            className={`flex-1 rounded-[0.6rem] py-1.5 text-[9px] font-semibold tracking-wider transition ${
              tab === t.id ? 'bg-white/12 text-white/80' : 'text-white/40 hover:bg-white/[0.04]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* NPS */}
      {tab === 'nps' && (
        <>
          <p className="mb-3 text-[10px] text-white/40">De 0 a 10, o quanto recomendaria o SEA?</p>
          <div className="mb-3 flex flex-wrap justify-center gap-1.5">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                onClick={() => setNpsScore(i)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg border text-[10px] font-semibold transition ${
                  npsScore === i ? 'border-white/30 bg-white/15 text-white' : 'border-white/8 bg-white/[0.03] text-white/50'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
          <textarea
            className="mb-3 w-full rounded-[0.8rem] border border-white/8 bg-white/[0.03] px-3 py-2 text-[11px] text-white/80 outline-none placeholder:text-white/25"
            rows={2}
            placeholder="Comentário (opcional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </>
      )}

      {/* Feedback */}
      {tab === 'feedback' && (
        <textarea
          className="mb-3 w-full rounded-[0.8rem] border border-white/8 bg-white/[0.03] px-3 py-2 text-[11px] text-white/80 outline-none placeholder:text-white/25"
          rows={4}
          placeholder="Deixe seu feedback, sugestão ou elogio..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      )}

      {/* Denúncia */}
      {tab === 'denuncia' && (
        <>
          <p className="mb-2 text-[9px] text-white/35">Anônimo e confidencial.</p>
          <div className="mb-3 flex flex-wrap gap-1">
            {reportTypes.map((t) => (
              <button
                key={t.value}
                onClick={() => setReportType(t.value)}
                className={`rounded-full border px-2.5 py-0.5 text-[8px] font-semibold transition ${
                  reportType === t.value ? 'border-white/25 bg-white/12 text-white/80' : 'border-white/8 text-white/40'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <textarea
            className="mb-3 w-full rounded-[0.8rem] border border-white/8 bg-white/[0.03] px-3 py-2 text-[11px] text-white/80 outline-none placeholder:text-white/25"
            rows={4}
            placeholder="Descreva..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="flex w-full items-center justify-center gap-2 rounded-[0.8rem] border border-white/12 bg-white/[0.06] py-2 text-[10px] font-semibold tracking-wider text-white/70 transition disabled:opacity-30 hover:bg-white/[0.1]"
      >
        <Send className="h-3 w-3" /> Enviar
      </button>
    </ModalShell>
  )
}
