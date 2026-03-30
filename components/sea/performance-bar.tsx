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
        heading: 'Política de Privacidade e Proteção de Dados (LGPD)',
        items: [
          'Lei nº 13.709/2018 (LGPD) — O SEA FISIO opera sob o princípio de minimização de dados. Nenhum dado pessoal identificável (PII) de pacientes é coletado, armazenado ou transmitido a servidores externos',
          'Os dados clínicos inseridos no prontuário permanecem exclusivamente no dispositivo do profissional (localStorage sandboxed do navegador/app)',
          'O prontuário SEA é classificado como ferramenta de apoio ao raciocínio clínico pessoal — não é Prontuário Eletrônico do Paciente (PEP) conforme Resolução CFM nº 1.638/2002',
          'A sincronização opcional via Supabase utiliza identificadores anônimos (UUID), sem vinculação a dados pessoais',
          'Direito ao esquecimento: o usuário pode excluir permanentemente todos os seus dados a qualquer momento, sem necessidade de justificativa',
          'Não há compartilhamento de dados com terceiros, parceiros comerciais ou para fins de marketing',
          'Bases legais utilizadas: consentimento (Art. 7º, I) e legítimo interesse (Art. 7º, IX) da LGPD',
        ],
      },
      {
        heading: 'Política de Sustentabilidade Corporativa',
        items: [
          'Compromisso formal com o Triple Bottom Line (TBL): equilíbrio entre impacto Social, Ambiental e Econômico em todas as decisões de produto',
          'Alinhamento com a Agenda 2030 da ONU — ODS 3 (Saúde), ODS 4 (Educação), ODS 9 (Inovação), ODS 10 (Redução das Desigualdades), ODS 12 (Consumo Responsável)',
          'Aplicação do modelo de Criação de Valor Compartilhado (CSV) de Porter & Kramer — inovação que gera lucro ao resolver problemas sociais',
          'Priorização arquitetural do modo offline-first para reduzir consumo energético de servidores e pegada de carbono digital',
          'Eliminação do uso de papel na prática clínica: cada prontuário digital substitui ~5 folhas/dia por paciente',
          'Código otimizado para menor consumo de bateria e processamento — eco-eficiência digital',
          'Meta: neutralização de carbono digital até 2027 através de otimização de infraestrutura',
        ],
      },
      {
        heading: 'Política de Inclusão, Diversidade e Equidade (IDE)',
        items: [
          'Desenho Universal como princípio de design — acessibilidade desde a concepção, não como adaptação posterior',
          'Cocriação com profissionais de saúde de diferentes perfis, regiões e níveis de experiência',
          'Compromisso com igualdade de acesso ao conhecimento clínico independente de localização geográfica ou condição socioeconômica',
          'Respeito à diversidade de gênero, etnia, orientação sexual, deficiência e neurodivergência em todo o conteúdo e comunicação',
          'Canal de denúncias anônimo e confidencial para assédio, discriminação e qualquer forma de violência',
          'Linguagem inclusiva e não-discriminatória em todos os materiais educacionais',
          'Avaliação periódica de vieses algorítmicos na IA tutor para garantir equidade nas respostas',
        ],
      },
      {
        heading: 'Política de Qualidade e Segurança da Informação',
        items: [
          'ISO 27001 como referência para gestão de segurança da informação',
          'Criptografia TLS 1.3 em todas as comunicações cliente-servidor',
          'Atualizações de segurança aplicadas em ciclos de no máximo 30 dias',
          'Backup automático de dados do usuário via sincronização opcional',
          'Princípio do menor privilégio em todas as integrações de API',
          'Monitoramento contínuo de vulnerabilidades em dependências (npm audit)',
        ],
      },
      {
        heading: 'Política Anticorrupção e Antissuborno',
        items: [
          'Tolerância zero para corrupção, suborno e práticas antiéticas em qualquer nível',
          'Proibição de pagamentos facilitadores ou vantagens indevidas',
          'Transparência total nas relações comerciais e parcerias',
          'Conformidade com a Lei Anticorrupção (Lei nº 12.846/2013)',
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
          'Cálculos automáticos validados por literatura científica: driving pressure (Amato et al., 2015), RSBI (Yang & Tobin, 1991), relação P/F (Berlin Definition, 2012)',
          'Alertas inteligentes para intubação prolongada (>7 dias) com sugestão de avaliação para traqueostomia conforme diretrizes AMIB',
          'Detecção automática de elegibilidade para desmame ventilatório baseada em 10 critérios clínicos simultâneos',
          'Classificação automática de SDRA (leve/moderada/grave) pela relação PaO₂/FiO₂',
          'Cálculo de mechanical power com alerta para ventilação lesiva (>17 J/min)',
          'Monitorização de driving pressure com alerta para valores >15 cmH₂O',
          'Histórico completo de condução ventilatória para rastreabilidade clínica e aprendizado',
          'Cross-referência automática entre gasometria, mecânica respiratória e parâmetros de desmame',
          'Detecção de assincronia paciente-ventilador pelas curvas em tempo real',
        ],
      },
      {
        heading: 'Práticas de Educação Baseada em Evidências',
        items: [
          'Conteúdo fundamentado em guidelines internacionais: AMIB, SBPT, ATS, ERS, ESICM, AARC',
          'Simulações 3D interativas de órgãos reais (pulmão, coração, cérebro) para aprendizado imersivo',
          'IA tutor especialista com contexto clínico: responde com raciocínio fisiopatológico, não apenas definições',
          'Curvas de ventilação mecânica em tempo real: Pressão×Tempo, Fluxo×Tempo, Volume×Tempo',
          'Loops P×V e F×V com análise de histerese, WOB, padrão obstrutivo e restritivo',
          'Atualização contínua de protocolos conforme publicação de novas evidências',
          'Metodologia de ensino ativo: estudar → aplicar → questionar → evoluir',
          'Calculadoras clínicas validadas: peso ideal, volume corrente, complacência, resistência, MRC, PERME, IMS',
        ],
      },
      {
        heading: 'Práticas de Prevenção e Controle de Infecção',
        items: [
          'Zero papel na UTI = eliminação de vetor de transmissão por contato direto e indireto',
          'Substituição de pranchetas compartilhadas (fômite) por dispositivo pessoal higienizável',
          'Conformidade com diretrizes da ANVISA (RDC 36/2013) e CCIH sobre precauções de contato',
          'Redução do manuseio de superfícies compartilhadas no ambiente de terapia intensiva',
          'Contribuição para indicadores de prevenção de IRAS (Infecções Relacionadas à Assistência à Saúde)',
          'Rastreabilidade de dados sem necessidade de documentos físicos que transitam entre setores',
        ],
      },
      {
        heading: 'Práticas de Desenvolvimento Profissional',
        items: [
          'Ferramenta de autoavaliação contínua: o profissional aprende com seus próprios casos',
          'Exposição a cenários clínicos complexos via simulações antes de enfrentá-los na prática',
          'Redução da curva de aprendizado de profissionais recém-formados',
          'Suporte ao ensino clínico de residentes e especializandos em fisioterapia intensiva',
          'Padronização de condutas baseada em protocolos institucionais adaptáveis',
          'Mentoria digital: IA tutor como segundo olhar para decisões clínicas',
        ],
      },
      {
        heading: 'Práticas de Gestão e Eficiência',
        items: [
          'Redução do tempo de documentação: interface otimizada para input rápido à beira do leito',
          'Dashboards de impacto em tempo real para gestão de indicadores',
          'NPS e feedback contínuo para melhoria iterativa do produto',
          'Canal de denúncias como instrumento de governança e cultura organizacional',
        ],
      },
    ],
  },
  compliance: {
    title: 'Compliance SEA FISIO',
    sections: [
      {
        heading: 'Conformidade com Legislação Brasileira',
        items: [
          'LGPD — Lei nº 13.709/2018: dados pessoais tratados com base legal definida, minimização de coleta, direito ao esquecimento implementado',
          'Marco Civil da Internet — Lei nº 12.965/2014: transparência, neutralidade de rede, proteção de registros',
          'Código de Defesa do Consumidor — Lei nº 8.078/1990: clareza nas funcionalidades, ausência de práticas abusivas',
          'Lei Anticorrupção — Lei nº 12.846/2013: programa de integridade, canal de denúncias, tolerância zero',
          'Estatuto da Pessoa com Deficiência — Lei nº 13.146/2015: compromisso com acessibilidade digital',
          'Lei de Acesso à Informação — Lei nº 12.527/2011: transparência nas práticas e políticas',
        ],
      },
      {
        heading: 'Conformidade com Regulamentação Profissional',
        items: [
          'COFFITO — Código de Ética e Deontologia da Fisioterapia (Resolução nº 424/2013)',
          'Resolução COFFITO nº 516/2020 — Teleconsulta e telemonitoramento em fisioterapia',
          'Resolução CFM nº 1.638/2002 — Definição de prontuário médico (SEA não é PEP)',
          'Resolução CFM nº 1.821/2007 — Normas técnicas para digitalização de documentos',
          'RDC ANVISA nº 36/2013 — Ações de segurança do paciente em serviços de saúde',
          'NR 32 — Segurança e saúde no trabalho em serviços de saúde',
        ],
      },
      {
        heading: 'Conformidade Ética e Conduta',
        items: [
          'Programa de integridade com canal de denúncias anônimo, confidencial e sem retaliação',
          'Política de tolerância zero para assédio moral, sexual, discriminação e bullying',
          'Transparência na utilização de IA: todas as respostas do tutor são identificadas como geradas por IA',
          'Ausência de conflitos de interesse: conteúdo educacional independente de indústria farmacêutica ou de equipamentos',
          'Consentimento informado claro antes de qualquer coleta de dados',
          'Proibição de uso de dados para perfilamento, scoring ou decisões automatizadas sobre pessoas',
          'Compromisso com a verdade científica: conteúdo atualizado conforme melhores evidências disponíveis',
        ],
      },
      {
        heading: 'Conformidade Técnica e de Segurança',
        items: [
          'OWASP Top 10: proteção contra XSS, injection, CSRF e demais vulnerabilidades web',
          'Criptografia TLS 1.3 em todas as comunicações externas',
          'Content Security Policy (CSP) implementada no servidor',
          'Armazenamento local sandboxed — isolamento de dados entre origens',
          'Código-fonte versionado (Git) e auditável a qualquer momento',
          'Dependências auditadas continuamente via npm audit e Dependabot',
          'Testes de integridade nos cálculos clínicos com valores de referência publicados',
          'Rate limiting e proteção contra abuso nas APIs públicas',
          'Logs de acesso sem PII para monitoramento de disponibilidade',
        ],
      },
      {
        heading: 'Programa de Conformidade Contínua',
        items: [
          'Revisão trimestral de todas as políticas e práticas',
          'Treinamento obrigatório em LGPD e ética para toda a equipe',
          'Auditoria interna semestral de segurança e privacidade',
          'Indicadores de compliance monitorados no dashboard (NPS, feedbacks, denúncias)',
          'Comitê de ética para análise de denúncias e decisões complexas',
          'Atualização automática de compliance conforme mudanças legislativas',
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
