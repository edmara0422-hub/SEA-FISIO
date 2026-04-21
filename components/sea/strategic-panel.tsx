'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  ChevronDown, ChevronUp, Plus, Trash2, Save, RefreshCw,
  CheckCircle2, Circle, ArrowRight, Brain, Target, Zap,
  TrendingUp, AlertTriangle, Flag,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ─── Types ───────────────────────────────────────────────────────────────────

type CompanyPhaseId = 'validacao' | 'pmf' | 'crescimento' | 'escala' | 'lideranca'
type MarketPhaseId  = 'digitizacao' | 'digitalizacao' | 'transformacao'

type KR  = { id: string; descricao: string; progresso: number }
type OKR = { id: string; objetivo: string; krs: KR[] }

type Metrics = {
  totalUsers: number
  activeToday: number
  activeWeek: number
  activeMonth: number
  retention7d: number
  retention30d: number
  nps: number | null
  npsTotal: number
  subsCount: number
  subsActive: number
  topEvent: string | null
  loadedAt: string
}

type ManualChecks = Record<string, boolean>

type StrategyState = {
  phaseOverride: CompanyPhaseId | ''
  marketPhase: MarketPhaseId | ''
  manualChecks: ManualChecks
  okrs: OKR[]
  h1: number; h2: number; h3: number
  funil: string; trl: number; hype: string
  notas: string; ultimaRevisao: string
}

// ─── Phase Definitions ───────────────────────────────────────────────────────

type Criterio = {
  id: string; label: string
  tipo: 'auto' | 'manual'
  check?: (m: Metrics) => boolean
}

type CompanyPhase = {
  id: CompanyPhaseId; label: string; sublabel: string; desc: string
  criterios: Criterio[]
  paraProxima: string[]
  icon: typeof Flag
}

const COMPANY_PHASES: CompanyPhase[] = [
  {
    id: 'validacao', label: 'Validação', sublabel: 'MVP & Descoberta', icon: Target,
    desc: 'Produto mínimo funcional com primeiros usuários reais testando o core value.',
    criterios: [
      { id: 'produto_funcional',   label: 'Produto funcional e usável',                      tipo: 'manual' },
      { id: 'primeiro_usuario',    label: '1+ usuário real ativo',                            tipo: 'auto', check: m => m.totalUsers >= 1 },
      { id: 'feedback_qualitativo',label: 'Feedback qualitativo coletado (entrevistas)',      tipo: 'manual' },
      { id: 'problema_validado',   label: 'Dor real do fisioterapeuta confirmada',            tipo: 'manual' },
      { id: 'hipotese_monetizacao',label: 'Hipótese de monetização definida',                tipo: 'manual' },
    ],
    paraProxima: [
      '10+ usuários ativos por semana (consecutivo)',
      'Retenção 7 dias > 30%',
      'NPS calculado e positivo (> 0)',
      'Usuários retornam sem push notification',
      '1 usuário pagante ou lista de espera com 50+',
    ],
  },
  {
    id: 'pmf', label: 'PMF', sublabel: 'Product-Market Fit', icon: Zap,
    desc: 'Usuários consistentes que retornam por valor real — não curiosidade ou novidade.',
    criterios: [
      { id: 'usuarios_ativos_semana', label: '10+ usuários ativos por semana', tipo: 'auto', check: m => m.activeWeek >= 10 },
      { id: 'retencao_7d',            label: 'Retenção 7 dias > 30%',         tipo: 'auto', check: m => m.retention7d >= 30 },
      { id: 'nps_positivo',           label: 'NPS > 0',                        tipo: 'auto', check: m => m.nps !== null && m.nps > 0 },
      { id: 'retorno_voluntario',     label: 'Usuários voltam sem push — uso voluntário', tipo: 'manual' },
      { id: 'core_feature',           label: 'Feature core usada em > 60% das sessões',  tipo: 'manual' },
    ],
    paraProxima: [
      '100+ usuários cadastrados',
      'MRR > R$ 1.000 (primeiros pagantes recorrentes)',
      'Retenção 30 dias > 40%',
      'Crescimento MoM de usuários ativos > 15%',
      'Canal de aquisição orgânico identificado e validado',
    ],
  },
  {
    id: 'crescimento', label: 'Crescimento', sublabel: 'Tração & Revenue', icon: TrendingUp,
    desc: 'Base crescendo organicamente com receita recorrente inicial e canal validado.',
    criterios: [
      { id: 'usuarios_100',    label: '100+ usuários cadastrados', tipo: 'auto', check: m => m.totalUsers >= 100 },
      { id: 'mrr_1k',         label: 'MRR > R$ 1.000',           tipo: 'manual' },
      { id: 'retencao_30d',   label: 'Retenção 30 dias > 40%',  tipo: 'auto', check: m => m.retention30d >= 40 },
      { id: 'growth_mom',     label: 'Crescimento MoM > 15%',   tipo: 'manual' },
      { id: 'canal_aquisicao',label: 'Canal de aquisição escalável identificado', tipo: 'manual' },
    ],
    paraProxima: [
      '1.000+ usuários ativos',
      'MRR > R$ 10.000',
      'Churn < 5% ao mês',
      'Marketing pago com LTV > 3× CAC validado',
      'Equipe ou sócio técnico contratado',
    ],
  },
  {
    id: 'escala', label: 'Escala', sublabel: 'Growth & Automação', icon: ArrowRight,
    desc: 'Growth loops rodando, marketing pago, automações e equipe formada.',
    criterios: [
      { id: 'usuarios_1k',    label: '1.000+ usuários ativos',            tipo: 'auto', check: m => m.totalUsers >= 1000 },
      { id: 'mrr_10k',       label: 'MRR > R$ 10.000',                   tipo: 'manual' },
      { id: 'churn_baixo',   label: 'Churn < 5% ao mês',                 tipo: 'manual' },
      { id: 'growth_loops',  label: 'Growth loops automatizados rodando', tipo: 'manual' },
      { id: 'equipe_3',      label: 'Equipe de 3+ pessoas',              tipo: 'manual' },
    ],
    paraProxima: [
      '10.000+ usuários ativos',
      'MRR > R$ 50.000',
      'Presença consolidada em 3+ estados ou segmentos',
      'Produto ou linha secundária lançada',
      'Reconhecimento de marca no mercado de fisioterapia',
    ],
  },
  {
    id: 'lideranca', label: 'Liderança', sublabel: 'Consolidação', icon: Flag,
    desc: 'Referência nacional. Múltiplos produtos. Expansão de plataforma.',
    criterios: [
      { id: 'usuarios_10k',    label: '10.000+ usuários ativos',               tipo: 'auto', check: m => m.totalUsers >= 10000 },
      { id: 'mrr_50k',        label: 'MRR > R$ 50.000',                       tipo: 'manual' },
      { id: 'multiestado',    label: 'Presença consolidada em 3+ estados',     tipo: 'manual' },
      { id: 'marca_referencia',label: 'Referência reconhecida no setor',       tipo: 'manual' },
      { id: 'expansao_produto',label: 'Produto secundário ou parceria estratégica', tipo: 'manual' },
    ],
    paraProxima: [],
  },
]

const MARKET_PHASES = [
  {
    id: 'digitizacao' as MarketPhaseId, label: 'Digitização', sublabel: 'Infra Digital',
    desc: 'Mercado usa papel, WhatsApp e planilhas. Pouca adoção de sistemas integrados.',
    posicionamento: 'SEA está 2 fases à frente. Oportunidade enorme, mas o mercado pode não estar pronto para pagar. Estratégia: educar primeiro, converter depois.',
  },
  {
    id: 'digitalizacao' as MarketPhaseId, label: 'Digitalização', sublabel: 'Processos Online',
    desc: 'Processos digitalizados, mas sistemas isolados. A dor de integração é real e crescente.',
    posicionamento: 'SEA 1 fase à frente — janela ideal. O fisioterapeuta já sente o gap e está pronto para uma solução. Estratégia: capturar agora, antes de competidores amadurecerem.',
  },
  {
    id: 'transformacao' as MarketPhaseId, label: 'Transformação', sublabel: 'IA & Dados',
    desc: 'Dados como estratégia. IA integrada. Decisões data-driven à beira do leito.',
    posicionamento: 'Mercado alinhado com o SEA — velocidade de execução é o único diferencial. Estratégia: dominar o segmento antes que big players percebam a oportunidade.',
  },
]

const HYPE_LABELS: Record<string, string> = {
  gatilho: '1 · Gatilho Tecnológico',
  pico: '2 · Pico de Expectativas Infladas',
  vale: '3 · Vale da Desilusão',
  encosta: '4 · Encosta da Iluminação',
  platô: '5 · Platô de Produtividade',
}

const FUNIL_LABELS: Record<string, string> = {
  ffe: '1 · Fuzzy Front-End — Ideação',
  triagem: '2 · Stage Gate 1 — Triagem',
  desenvolvimento: '3 · Desenvolvimento e Validação',
  decisao: '4 · Stage Gate 2 — Decisão Final',
  escala: '5 · Lançamento e Escala',
}

const STORAGE_KEY = 'sea-strategy-v2'

const DEFAULT_STATE: StrategyState = {
  phaseOverride: '', marketPhase: '', manualChecks: {},
  okrs: [], h1: 70, h2: 20, h3: 10,
  funil: '', trl: 1, hype: '', notas: '', ultimaRevisao: '',
}

function genId() { return Math.random().toString(36).slice(2) }

// ─── Phase detection ─────────────────────────────────────────────────────────

function detectPhase(metrics: Metrics, manualChecks: ManualChecks): CompanyPhaseId {
  for (let i = COMPANY_PHASES.length - 1; i >= 0; i--) {
    const phase = COMPANY_PHASES[i]
    const done = phase.criterios.filter(c =>
      c.tipo === 'auto' ? (c.check?.(metrics) ?? false) : (manualChecks[c.id] ?? false)
    ).length
    if (done >= Math.ceil(phase.criterios.length * 0.6)) return phase.id
  }
  return 'validacao'
}

function phaseProgress(metrics: Metrics, manualChecks: ManualChecks, phaseId: CompanyPhaseId): number {
  const phase = COMPANY_PHASES.find(p => p.id === phaseId)
  if (!phase) return 0
  const done = phase.criterios.filter(c =>
    c.tipo === 'auto' ? (c.check?.(metrics) ?? false) : (manualChecks[c.id] ?? false)
  ).length
  return Math.round((done / phase.criterios.length) * 100)
}

// ─── Reflexão do Dia generator ───────────────────────────────────────────────

function gerarReflexao(metrics: Metrics, phase: CompanyPhaseId, manualChecks: ManualChecks, okrs: OKR[]) {
  const acoes: string[] = []
  const krAll = okrs.flatMap(o => o.krs)
  const avgOkr = krAll.length > 0 ? Math.round(krAll.reduce((s, k) => s + k.progresso, 0) / krAll.length) : -1
  const dayOfWeek = new Date().getDay()

  if (phase === 'validacao') {
    if (metrics.totalUsers === 0) {
      acoes.push('Missão crítica: conseguir o primeiro usuário real hoje. Não beta — um fisioterapeuta que vai usar o SEA no trabalho.')
      acoes.push('Envie mensagem pessoal para 3 fisioterapeutas intensivistas que você conhece. Peça 15 min de teste real.')
    } else if (metrics.totalUsers < 5) {
      acoes.push(`${metrics.totalUsers} usuário(s) cadastrado(s). Fale com todos esta semana: o que usam mais? O que trava? O que falta?`)
      acoes.push('Meta: dobrar usuários ativos antes da próxima semana. Quem mais pode testar o SEA agora?')
    } else {
      acoes.push(`${metrics.totalUsers} usuários cadastrados. Fase de Validação exige qualidade de feedback, não quantidade de usuários.`)
    }
    if (!manualChecks['problema_validado']) acoes.push('Ação urgente: confirmar a dor real com uma entrevista estruturada esta semana (20 min, foco no problema, não no produto).')
    if (!manualChecks['hipotese_monetizacao']) acoes.push('Defina hoje a hipótese de monetização: quem paga, quanto, e por quê pagaria pelo SEA.')
  }

  if (phase === 'pmf') {
    if (metrics.activeWeek < 10) acoes.push(`Usuários ativos esta semana: ${metrics.activeWeek} (meta: 10+). Foque em reativação, não em aquisição de novos.`)
    if (metrics.retention7d < 30) acoes.push(`Retenção 7 dias: ${metrics.retention7d}% (meta: 30%+). Qual é o momento "aha!" do SEA? Ele acontece rápido o suficiente?`)
    if (metrics.nps !== null && metrics.nps < 30) acoes.push(`NPS em ${metrics.nps} (meta: >30). Leia todos os feedbacks recentes — há padrão de insatisfação?`)
    if (!manualChecks['retorno_voluntario']) acoes.push('Verifique: usuários estão voltando sem push? Se não, PMF ainda não foi encontrado — entenda o bloqueio.')
  }

  if (phase === 'crescimento') {
    if (metrics.totalUsers < 100) acoes.push(`${metrics.totalUsers} usuários (meta: 100+). Qual canal orgânico está trazendo mais? Dobre nele.`)
    if (!manualChecks['mrr_1k']) acoes.push('MRR ainda abaixo de R$1.000. Defina o modelo de precificação e as próximas ações de monetização para os 60 dias.')
    if (!manualChecks['canal_aquisicao']) acoes.push('Canal de aquisição ainda não validado. Teste 2 canais esta semana e meça qual converte melhor.')
  }

  if (phase === 'escala') {
    if (!manualChecks['growth_loops']) acoes.push('Growth loops ainda não automatizados. Mapeie o loop viral atual e identifique onde está a fricção.')
    if (!manualChecks['equipe_3']) acoes.push('Equipe ainda menor que 3. Em Escala, crescer sozinho é o maior gargalo. Priorize contratação ou parceria técnica.')
  }

  if (phase === 'lideranca') {
    acoes.push('Em Liderança, o risco é a complacência. Defina hoje: qual nova frente de inovação o SEA deve explorar nos próximos 6 meses?')
    if (!manualChecks['expansao_produto']) acoes.push('Produto secundário ou parceria estratégica ainda não definida. Explore adjacências do mercado de saúde digital.')
  }

  // OKR insight
  if (okrs.length === 0) {
    acoes.push('Nenhum OKR definido. Defina hoje 1 objetivo com 2-3 Key Results mensuráveis para o ciclo atual.')
  } else if (avgOkr >= 0 && avgOkr < 30) {
    acoes.push(`OKRs em ${avgOkr}% de progresso médio. Revise o que está bloqueando e ajuste o plano de ação desta semana.`)
  } else if (avgOkr >= 70) {
    acoes.push(`OKRs em ${avgOkr}% — você está no caminho certo. Documente o que está funcionando para replicar.`)
  }

  if (dayOfWeek === 1) acoes.push('Segunda-feira: revise os OKRs, defina as 3 prioridades críticas desta semana antes de qualquer outra coisa.')
  if (dayOfWeek === 5) acoes.push('Sexta-feira: registre o aprendizado mais importante desta semana. O que mudou na sua visão do negócio?')

  const titulo: Record<CompanyPhaseId, string> = {
    validacao:   'Fase Validação — dados reais > suposições',
    pmf:         'Fase PMF — retenção e retorno voluntário são o sinal',
    crescimento: 'Fase Crescimento — receita real valida o modelo',
    escala:      'Fase Escala — o sistema precisa crescer sem você',
    lideranca:   'Fase Liderança — consolidar e inovar ao mesmo tempo',
  }

  const contexto: Record<CompanyPhaseId, string> = {
    validacao:   `${metrics.totalUsers === 0 ? 'Sem usuários ainda' : `${metrics.totalUsers} usuário(s)`} · Em Validação, cada conversa com um fisioterapeuta real vale mais do que qualquer feature nova.`,
    pmf:         `${metrics.activeWeek} ativos/semana · Retenção 7d: ${metrics.retention7d}% · NPS: ${metrics.nps ?? '--'} · PMF existe quando usuários ficam sem você perguntar.`,
    crescimento: `${metrics.totalUsers} usuários · Retenção 30d: ${metrics.retention30d}% · Crescimento saudável exige receita real antes de accelerar.`,
    escala:      `${metrics.totalUsers} usuários · ${metrics.subsActive} assinaturas ativas · Em escala, o sistema cresce mais rápido do que você consegue trabalhar.`,
    lideranca:   `${metrics.totalUsers} usuários · ${metrics.subsActive} assinaturas · Liderança exige inovação contínua e defesa agressiva do posicionamento.`,
  }

  return { titulo: titulo[phase], contexto: contexto[phase], acoes: acoes.slice(0, 5) }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ label, open, toggle, badge }: { label: string; open: boolean; toggle: () => void; badge?: string }) {
  return (
    <button
      onClick={toggle}
      className="flex w-full items-center justify-between rounded-[0.7rem] border border-white/6 bg-white/[0.02] px-3 py-2 text-left"
    >
      <div className="flex items-center gap-2">
        <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/55">{label}</p>
        {badge && <span className="rounded-full border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[6px] text-white/40">{badge}</span>}
      </div>
      {open ? <ChevronUp className="h-3 w-3 text-white/30" /> : <ChevronDown className="h-3 w-3 text-white/30" />}
    </button>
  )
}

function Sel({ label, value, options, onChange }: { label: string; value: string; options: { v: string; l: string }[]; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-1 text-[7px] uppercase tracking-[0.12em] text-white/35">{label}</p>
      <div className="flex flex-wrap gap-1">
        {options.map(o => (
          <button key={o.v} onClick={() => onChange(o.v)}
            className={`rounded-full border px-2 py-0.5 text-[7px] font-medium transition-colors ${
              value === o.v ? 'border-white/25 bg-white/[0.08] text-white/80' : 'border-white/6 bg-transparent text-white/35 hover:text-white/55'
            }`}
          >{o.l}</button>
        ))}
      </div>
    </div>
  )
}

// ─── Phase Railway ───────────────────────────────────────────────────────────

function PhaseRailway({
  phases, currentId, nextProgress, onOverride,
}: {
  phases: CompanyPhase[]
  currentId: CompanyPhaseId
  nextProgress: number
  onOverride: (id: CompanyPhaseId | '') => void
}) {
  const currentIdx = phases.findIndex(p => p.id === currentId)

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max items-start gap-0 px-1 pt-2">
        {phases.map((phase, idx) => {
          const done    = idx < currentIdx
          const current = idx === currentIdx
          const isNext  = idx === currentIdx + 1
          const future  = idx > currentIdx

          const Icon = phase.icon

          return (
            <div key={phase.id} className="flex items-start">
              {/* Connector */}
              {idx > 0 && (
                <div className="relative mt-[1.1rem] flex h-0.5 w-10 items-center">
                  <div className={`h-full w-full ${done || current ? 'bg-white/30' : 'bg-white/8'}`} />
                  {/* Progress fill for next segment */}
                  {idx === currentIdx + 1 && nextProgress > 0 && (
                    <div
                      className="absolute left-0 top-0 h-full bg-white/50 transition-all"
                      style={{ width: `${nextProgress}%` }}
                    />
                  )}
                </div>
              )}

              {/* Station */}
              <button
                onClick={() => onOverride(current ? '' : phase.id)}
                title={`Definir fase manualmente: ${phase.label}`}
                className={`flex flex-col items-center gap-1 transition-opacity ${future ? 'opacity-35' : ''}`}
              >
                {/* Node circle */}
                <div className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                  done    ? 'border-white/40 bg-white/8' :
                  current ? 'border-white/80 bg-white/[0.12] shadow-[0_0_16px_rgba(255,255,255,0.12)]' :
                            'border-white/10 bg-transparent'
                }`}>
                  {done
                    ? <CheckCircle2 className="h-4 w-4 text-white/60" />
                    : current
                      ? <Icon className="h-4 w-4 text-white" />
                      : <Circle className="h-3.5 w-3.5 text-white/20" />
                  }
                  {/* Pulse ring for current */}
                  {current && (
                    <span className="absolute inset-0 animate-ping rounded-full border border-white/20" />
                  )}
                </div>

                {/* Labels */}
                <p className={`text-[7px] font-semibold ${current ? 'text-white/90' : done ? 'text-white/55' : 'text-white/25'}`}>
                  {phase.label}
                </p>
                <p className={`text-[6px] ${current ? 'text-white/45' : 'text-white/20'}`}>
                  {phase.sublabel}
                </p>

                {/* Tag */}
                {current && (
                  <span className="mt-0.5 rounded-full border border-white/25 bg-white/[0.08] px-2 py-0.5 text-[6px] font-bold uppercase tracking-wider text-white/80">
                    Aqui
                  </span>
                )}
                {isNext && nextProgress > 0 && (
                  <span className="mt-0.5 text-[6px] text-white/30">{nextProgress}% →</span>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Market Phase Rail ───────────────────────────────────────────────────────

function MarketRailway({ phases, currentId, onSelect }: { phases: typeof MARKET_PHASES; currentId: MarketPhaseId | ''; onSelect: (id: MarketPhaseId) => void }) {
  return (
    <div className="flex items-start gap-0 overflow-x-auto py-2">
      {phases.map((phase, idx) => {
        const active = phase.id === currentId
        return (
          <div key={phase.id} className="flex items-start">
            {idx > 0 && <div className={`mt-[1.1rem] h-0.5 w-12 ${active || phases.findIndex(p => p.id === currentId) > idx ? 'bg-white/25' : 'bg-white/8'}`} />}
            <button onClick={() => onSelect(phase.id)} className="flex flex-col items-center gap-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                active ? 'border-white/70 bg-white/10 shadow-[0_0_12px_rgba(255,255,255,0.1)]' : 'border-white/10'
              }`}>
                <div className={`h-2 w-2 rounded-full ${active ? 'bg-white/80' : 'bg-white/15'}`} />
              </div>
              <p className={`text-[7px] font-semibold ${active ? 'text-white/80' : 'text-white/25'}`}>{phase.label}</p>
              <p className={`text-[6px] ${active ? 'text-white/40' : 'text-white/15'}`}>{phase.sublabel}</p>
              {active && <span className="mt-0.5 rounded-full border border-white/20 bg-white/[0.06] px-1.5 py-0.5 text-[6px] font-bold text-white/70">Mercado</span>}
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

const EMPTY_METRICS: Metrics = {
  totalUsers: 0, activeToday: 0, activeWeek: 0, activeMonth: 0,
  retention7d: 0, retention30d: 0, nps: null, npsTotal: 0,
  subsCount: 0, subsActive: 0, topEvent: null, loadedAt: '',
}

export function StrategicPanel() {
  const [state, setState] = useState<StrategyState>(DEFAULT_STATE)
  const [metrics, setMetrics] = useState<Metrics>(EMPTY_METRICS)
  const [loadingMetrics, setLoadingMetrics] = useState(false)
  const [open, setOpen] = useState<Record<string, boolean>>({
    trilho: true, market: false, reflexao: true,
    okrs: false, horizontes: false, funil: false, ref: false,
  })
  const [saved, setSaved] = useState(false)

  // Persist state
  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE_KEY); if (r) setState(JSON.parse(r)) } catch {}
  }, [])

  function update(patch: Partial<StrategyState>) {
    setState(prev => { const next = { ...prev, ...patch }; localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); return next })
  }

  // Load live metrics from Supabase
  const loadMetrics = useCallback(async () => {
    if (!supabase) return
    setLoadingMetrics(true)
    const now = Date.now(); const DAY = 86400000

    const [{ data: profiles }, { data: subs }, { data: feedback }] = await Promise.all([
      supabase.from('profiles').select('id, created_at, last_login, role'),
      supabase.from('subscriptions').select('status, user_id'),
      supabase.from('sea_feedback').select('score, type'),
    ])

    const nonAdmin = (profiles ?? []).filter((p: { role?: string }) => p.role !== 'admin')
    const total    = nonAdmin.length
    const today    = nonAdmin.filter((p: { last_login?: string | null }) => p.last_login && now - new Date(p.last_login).getTime() < DAY).length
    const week     = nonAdmin.filter((p: { last_login?: string | null }) => p.last_login && now - new Date(p.last_login).getTime() < DAY * 7).length
    const month    = nonAdmin.filter((p: { last_login?: string | null }) => p.last_login && now - new Date(p.last_login).getTime() < DAY * 30).length
    const ret7  = total > 0 ? Math.round((week  / total) * 100) : 0
    const ret30 = total > 0 ? Math.round((month / total) * 100) : 0

    const npsEntries = (feedback ?? []).filter((f: { type: string; score: number | null }) => f.type === 'nps' && f.score !== null)
    let npsScore: number | null = null
    if (npsEntries.length > 0) {
      const promoters  = npsEntries.filter((f: { score: number }) => f.score >= 9).length
      const detractors = npsEntries.filter((f: { score: number }) => f.score <= 6).length
      npsScore = Math.round(((promoters - detractors) / npsEntries.length) * 100)
    }

    const nonAdminIds = new Set((profiles ?? []).filter((p: { role?: string }) => p.role !== 'admin').map((p: { id: string }) => p.id))
    const subsNonAdmin = (subs ?? []).filter((s: { user_id: string }) => nonAdminIds.has(s.user_id))
    const subsActive   = subsNonAdmin.filter((s: { status: string }) => s.status === 'active').length

    setMetrics({
      totalUsers: total, activeToday: today, activeWeek: week, activeMonth: month,
      retention7d: ret7, retention30d: ret30, nps: npsScore, npsTotal: npsEntries.length,
      subsCount: subsNonAdmin.length, subsActive,
      topEvent: null, loadedAt: new Date().toLocaleTimeString('pt-BR'),
    })
    setLoadingMetrics(false)
  }, [])

  useEffect(() => { loadMetrics() }, [loadMetrics])

  // Derived
  const detectedPhase = useMemo(() => detectPhase(metrics, state.manualChecks), [metrics, state.manualChecks])
  const activePhase   = (state.phaseOverride || detectedPhase) as CompanyPhaseId
  const activeIdx     = COMPANY_PHASES.findIndex(p => p.id === activePhase)
  const nextPhase     = COMPANY_PHASES[activeIdx + 1]
  const nextProg      = nextPhase ? phaseProgress(metrics, state.manualChecks, nextPhase.id) : 0
  const currProg      = phaseProgress(metrics, state.manualChecks, activePhase)
  const reflexao      = useMemo(() => gerarReflexao(metrics, activePhase, state.manualChecks, state.okrs), [metrics, activePhase, state.manualChecks, state.okrs])

  function toggle(k: string) { setOpen(prev => ({ ...prev, [k]: !prev[k] })) }
  function toggleCheck(id: string) { update({ manualChecks: { ...state.manualChecks, [id]: !(state.manualChecks[id] ?? false) } }) }

  // OKR helpers
  function addOKR() { update({ okrs: [...state.okrs, { id: genId(), objetivo: '', krs: [] }] }) }
  function updateOKR(id: string, obj: string) { update({ okrs: state.okrs.map(o => o.id === id ? { ...o, objetivo: obj } : o) }) }
  function removeOKR(id: string) { update({ okrs: state.okrs.filter(o => o.id !== id) }) }
  function addKR(okrId: string) { update({ okrs: state.okrs.map(o => o.id === okrId ? { ...o, krs: [...o.krs, { id: genId(), descricao: '', progresso: 0 }] } : o) }) }
  function updateKR(oid: string, kid: string, p: Partial<KR>) { update({ okrs: state.okrs.map(o => o.id === oid ? { ...o, krs: o.krs.map(k => k.id === kid ? { ...k, ...p } : k) } : o) }) }
  function removeKR(oid: string, kid: string) { update({ okrs: state.okrs.map(o => o.id === oid ? { ...o, krs: o.krs.filter(k => k.id !== kid) } : o) }) }

  const inputCls = 'w-full rounded-[0.5rem] border border-white/10 bg-white/[0.03] px-2 py-1 text-[9px] text-white placeholder:text-white/25 outline-none focus:border-white/20'

  const currentPhaseData = COMPANY_PHASES.find(p => p.id === activePhase)!
  const okrAvg = (() => {
    const krs = state.okrs.flatMap(o => o.krs)
    return krs.length > 0 ? Math.round(krs.reduce((s, k) => s + k.progresso, 0) / krs.length) : null
  })()

  return (
    <div className="space-y-2">

      {/* ── Header com métricas live ── */}
      <div className="rounded-[1rem] border border-white/6 bg-white/[0.02] px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-semibold text-white/70">Inteligência Estratégica SEA</p>
            <p className="text-[7px] text-white/35">Todo dia: diagnosticar · decidir · executar · aprender</p>
          </div>
          <button onClick={loadMetrics} disabled={loadingMetrics} className="flex items-center gap-1 rounded-[0.5rem] border border-white/8 px-2 py-1 text-[7px] text-white/35 hover:text-white/55">
            <RefreshCw className={`h-2.5 w-2.5 ${loadingMetrics ? 'animate-spin' : ''}`} /> Atualizar
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { l: 'Usuários', v: metrics.totalUsers },
            { l: 'Ativos/sem', v: metrics.activeWeek },
            { l: 'Retenção 7d', v: `${metrics.retention7d}%` },
            { l: 'NPS', v: metrics.nps ?? '--' },
          ].map(m => (
            <div key={m.l} className="rounded-[0.7rem] border border-white/5 bg-white/[0.02] px-2 py-2 text-center">
              <p className="text-[11px] font-bold tabular-nums text-white/80">{m.v}</p>
              <p className="text-[6px] text-white/35">{m.l}</p>
            </div>
          ))}
        </div>
        {metrics.loadedAt && <p className="mt-2 text-[6px] text-white/20">Dados às {metrics.loadedAt} · clique em atualizar para recarregar</p>}
        {state.ultimaRevisao && <p className="mt-1 text-[6px] text-white/20">Última revisão registrada: {state.ultimaRevisao}</p>}
      </div>

      {/* ── 1. TRILHO DE FASE DA EMPRESA ── */}
      <SectionHeader label="1 · Fase da Empresa" open={!!open.trilho} toggle={() => toggle('trilho')}
        badge={`${activePhase === 'validacao' ? 'Validação' : activePhase === 'pmf' ? 'PMF' : activePhase === 'crescimento' ? 'Crescimento' : activePhase === 'escala' ? 'Escala' : 'Liderança'} · ${currProg}%`}
      />
      {open.trilho && (
        <div className="space-y-3 rounded-[0.8rem] border border-white/4 bg-white/[0.01] px-3 py-4">

          {/* Railway */}
          <PhaseRailway
            phases={COMPANY_PHASES}
            currentId={activePhase}
            nextProgress={nextProg}
            onOverride={id => update({ phaseOverride: id })}
          />

          {state.phaseOverride && (
            <div className="flex items-center gap-2 rounded-[0.5rem] border border-white/8 bg-white/[0.02] px-2 py-1.5">
              <AlertTriangle className="h-3 w-3 shrink-0 text-white/30" />
              <p className="flex-1 text-[7px] text-white/40">Fase definida manualmente. Clique na fase atual no trilho para remover override.</p>
              <button onClick={() => update({ phaseOverride: '' })} className="text-[6px] text-white/30 hover:text-white/60">Auto</button>
            </div>
          )}

          {/* Current phase detail */}
          <div className="space-y-2">
            <div className="rounded-[0.7rem] border border-white/6 bg-white/[0.02] px-3 py-2.5">
              <p className="mb-0.5 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/50">{currentPhaseData.label} · {currentPhaseData.sublabel}</p>
              <p className="text-[8px] leading-relaxed text-white/40">{currentPhaseData.desc}</p>
            </div>

            {/* Criteria checklist */}
            <div>
              <p className="mb-1.5 text-[7px] uppercase tracking-[0.1em] text-white/30">Critérios desta fase — {currProg}% concluído</p>
              <div className="space-y-1">
                {currentPhaseData.criterios.map(c => {
                  const checked = c.tipo === 'auto' ? (c.check?.(metrics) ?? false) : (state.manualChecks[c.id] ?? false)
                  return (
                    <button
                      key={c.id}
                      onClick={() => c.tipo === 'manual' ? toggleCheck(c.id) : undefined}
                      className={`flex w-full items-center gap-2 rounded-[0.5rem] border px-2 py-1.5 text-left transition-colors ${
                        checked ? 'border-white/12 bg-white/[0.04]' : 'border-white/5 bg-transparent'
                      } ${c.tipo === 'manual' ? 'cursor-pointer hover:border-white/15' : 'cursor-default'}`}
                    >
                      {checked
                        ? <CheckCircle2 className="h-3 w-3 shrink-0 text-white/60" />
                        : <Circle className="h-3 w-3 shrink-0 text-white/20" />
                      }
                      <span className={`flex-1 text-[8px] ${checked ? 'text-white/60' : 'text-white/35'}`}>{c.label}</span>
                      <span className={`text-[6px] ${c.tipo === 'auto' ? 'text-white/25' : 'text-white/20'}`}>{c.tipo === 'auto' ? 'auto' : 'manual'}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Next phase requirements */}
            {nextPhase && (
              <div className="rounded-[0.7rem] border border-white/6 bg-white/[0.015] px-3 py-2.5">
                <div className="mb-2 flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-white/30" />
                  <p className="text-[7px] font-semibold uppercase tracking-[0.1em] text-white/40">Para avançar para {nextPhase.label}</p>
                </div>
                <div className="space-y-1">
                  {currentPhaseData.paraProxima.map((item, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-white/20" />
                      <p className="text-[7px] leading-relaxed text-white/35">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!nextPhase && (
              <div className="rounded-[0.7rem] border border-white/8 bg-white/[0.03] px-3 py-2.5">
                <p className="text-[8px] text-white/50">Fase máxima atingida. Foco em consolidação, expansão e inovação disruptiva (H3).</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 2. FASE DO MERCADO ── */}
      <SectionHeader label="2 · Fase do Mercado" open={!!open.market} toggle={() => toggle('market')}
        badge={state.marketPhase ? MARKET_PHASES.find(p => p.id === state.marketPhase)?.label ?? '' : 'Selecionar'}
      />
      {open.market && (
        <div className="space-y-3 rounded-[0.8rem] border border-white/4 bg-white/[0.01] px-3 py-4">
          <MarketRailway
            phases={MARKET_PHASES}
            currentId={state.marketPhase}
            onSelect={id => update({ marketPhase: id })}
          />
          {state.marketPhase && (() => {
            const mp = MARKET_PHASES.find(p => p.id === state.marketPhase)!
            const seaIdx = activeIdx
            const mktIdx = MARKET_PHASES.findIndex(p => p.id === state.marketPhase)
            const gap = (seaIdx + 1) - (mktIdx + 1) // SEA phase level vs market phase level (rough)

            return (
              <div className="space-y-2">
                <div className="rounded-[0.7rem] border border-white/6 bg-white/[0.02] px-3 py-2.5">
                  <p className="mb-0.5 text-[7px] font-semibold text-white/50">{mp.label} — {mp.sublabel}</p>
                  <p className="text-[7px] leading-relaxed text-white/35">{mp.desc}</p>
                </div>
                <div className="rounded-[0.7rem] border border-white/6 bg-white/[0.015] px-3 py-2.5">
                  <p className="mb-1 text-[7px] font-semibold uppercase tracking-[0.1em] text-white/35">Posicionamento do SEA</p>
                  <p className="text-[7px] leading-relaxed text-white/40">{mp.posicionamento}</p>
                  {gap > 0 && <p className="mt-1 text-[7px] text-white/30">Gap: SEA está {gap === 1 ? '~1 patamar' : `~${gap} patamares`} à frente do mercado — vantagem competitiva estrutural.</p>}
                  {gap === 0 && <p className="mt-1 text-[7px] text-white/30">SEA alinhado com o mercado — janela de oportunidade máxima. Execução define quem lidera.</p>}
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* ── 3. REFLEXÃO DO DIA ── */}
      <SectionHeader label="3 · Reflexão do Dia" open={!!open.reflexao} toggle={() => toggle('reflexao')} badge="auto" />
      {open.reflexao && (
        <div className="space-y-2 rounded-[0.8rem] border border-white/4 bg-white/[0.01] px-3 py-3">
          <div className="flex items-start gap-2 rounded-[0.7rem] border border-white/6 bg-white/[0.02] px-3 py-2.5">
            <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/40" />
            <div>
              <p className="text-[8px] font-semibold text-white/65">{reflexao.titulo}</p>
              <p className="mt-0.5 text-[7px] leading-relaxed text-white/40">{reflexao.contexto}</p>
            </div>
          </div>
          {reflexao.acoes.length > 0 && (
            <div className="space-y-1">
              <p className="text-[7px] uppercase tracking-[0.1em] text-white/25">Ações para hoje</p>
              {reflexao.acoes.map((a, i) => (
                <div key={i} className="flex items-start gap-2 rounded-[0.5rem] border border-white/5 bg-white/[0.01] px-2 py-1.5">
                  <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-white/15 text-[6px] font-bold text-white/40">{i + 1}</span>
                  <p className="text-[7px] leading-relaxed text-white/45">{a}</p>
                </div>
              ))}
            </div>
          )}
          {okrAvg !== null && (
            <div className="flex items-center gap-2 rounded-[0.5rem] border border-white/5 bg-white/[0.01] px-2 py-1.5">
              <Target className="h-3 w-3 shrink-0 text-white/30" />
              <p className="text-[7px] text-white/35">OKRs em <span className="font-semibold text-white/60">{okrAvg}%</span> de progresso médio · {state.okrs.length} objetivo(s) · {state.okrs.flatMap(o => o.krs).length} KR(s)</p>
            </div>
          )}
          <p className="text-[6px] text-white/20">Reflexão gerada automaticamente a partir dos dados ao vivo + estado dos OKRs e fase detectada.</p>
        </div>
      )}

      {/* ── 4. OKRs ── */}
      <SectionHeader label="4 · OKRs do Ciclo" open={!!open.okrs} toggle={() => toggle('okrs')} badge={state.okrs.length > 0 ? `${state.okrs.length} obj · ${okrAvg ?? 0}%` : undefined} />
      {open.okrs && (
        <div className="space-y-3 rounded-[0.8rem] border border-white/4 bg-white/[0.01] px-3 py-3">
          <p className="text-[7px] leading-relaxed text-white/30">Objetivo = o que quero alcançar. Key Result = como vou medir. Atingir 70% já é sucesso — OKRs são ambiciosos por definição.</p>
          {state.okrs.map(okr => (
            <div key={okr.id} className="rounded-[0.7rem] border border-white/6 bg-white/[0.02] p-3">
              <div className="mb-2 flex items-center gap-2">
                <input className={inputCls + ' flex-1'} placeholder="Objetivo — o que quero alcançar..." value={okr.objetivo} onChange={e => updateOKR(okr.id, e.target.value)} />
                <button onClick={() => removeOKR(okr.id)} className="text-white/20 hover:text-red-400/70"><Trash2 className="h-3 w-3" /></button>
              </div>
              <div className="space-y-1.5">
                {okr.krs.map(kr => (
                  <div key={kr.id} className="flex items-center gap-2">
                    <span className="text-[7px] text-white/25">KR</span>
                    <input className={inputCls + ' flex-1'} placeholder="Key result mensurável..." value={kr.descricao} onChange={e => updateKR(okr.id, kr.id, { descricao: e.target.value })} />
                    <div className="flex items-center gap-1">
                      <input type="range" min={0} max={100} value={kr.progresso} onChange={e => updateKR(okr.id, kr.id, { progresso: Number(e.target.value) })} className="w-16 accent-white/50" />
                      <span className="w-7 text-right text-[7px] text-white/40">{kr.progresso}%</span>
                    </div>
                    <button onClick={() => removeKR(okr.id, kr.id)} className="text-white/15 hover:text-red-400/70"><Trash2 className="h-2.5 w-2.5" /></button>
                  </div>
                ))}
              </div>
              <button onClick={() => addKR(okr.id)} className="mt-2 flex items-center gap-1 text-[7px] text-white/25 hover:text-white/50"><Plus className="h-2.5 w-2.5" /> Key Result</button>
            </div>
          ))}
          <button onClick={addOKR} className="flex w-full items-center justify-center gap-1 rounded-[0.7rem] border border-white/8 py-2 text-[8px] text-white/35 hover:text-white/55">
            <Plus className="h-3 w-3" /> Objetivo
          </button>
        </div>
      )}

      {/* ── 5. TRÊS HORIZONTES ── */}
      <SectionHeader label="5 · Três Horizontes" open={!!open.horizontes} toggle={() => toggle('horizontes')} badge={`H1:${state.h1}% H2:${state.h2}% H3:${state.h3}%`} />
      {open.horizontes && (
        <div className="space-y-3 rounded-[0.8rem] border border-white/4 bg-white/[0.01] px-3 py-3">
          <p className="text-[7px] leading-relaxed text-white/30">Distribuição de esforço: H1 mantém o que funciona, H2 expande para adjacências, H3 explora o disruptivo.</p>
          {[
            { key: 'h1' as const, label: 'H1 · Core', desc: 'Prontuário, calculadoras, conteúdo principal. Inovações incrementais.' },
            { key: 'h2' as const, label: 'H2 · Adjacente', desc: 'Novos perfis de usuário, parceiros, funcionalidades complementares.' },
            { key: 'h3' as const, label: 'H3 · Disruptivo', desc: 'IA avançada, novos mercados, plataforma B2B, expansão LatAm.' },
          ].map(h => (
            <div key={h.key}>
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[8px] font-medium text-white/55">{h.label}</p>
                <span className="text-[8px] font-bold text-white/70">{state[h.key]}%</span>
              </div>
              <p className="mb-1.5 text-[7px] text-white/30">{h.desc}</p>
              <input type="range" min={0} max={100} value={state[h.key]} onChange={e => update({ [h.key]: Number(e.target.value) })} className="w-full accent-white/50" />
            </div>
          ))}
          <div className="rounded-[0.6rem] border border-white/6 bg-white/[0.02] px-3 py-2">
            <p className="text-[7px] text-white/30">
              Soma: <span className={state.h1 + state.h2 + state.h3 === 100 ? 'font-semibold text-white/60' : 'font-semibold text-red-400/70'}>
                {state.h1 + state.h2 + state.h3}%
              </span>
              {state.h1 + state.h2 + state.h3 !== 100 && ' — deve somar exatamente 100%'}
              {state.h1 + state.h2 + state.h3 === 100 && ' ✓'}
            </p>
          </div>
        </div>
      )}

      {/* ── 6. FUNIL + TRL + HYPE ── */}
      <SectionHeader label="6 · Funil · TRL · Hype" open={!!open.funil} toggle={() => toggle('funil')} />
      {open.funil && (
        <div className="space-y-3 rounded-[0.8rem] border border-white/4 bg-white/[0.01] px-3 py-3">
          <Sel label="Estágio no Funil de Inovação" value={state.funil}
            options={Object.entries(FUNIL_LABELS).map(([v, l]) => ({ v, l }))}
            onChange={v => update({ funil: v })}
          />
          <div>
            <div className="mb-1 flex items-center justify-between">
              <p className="text-[7px] uppercase tracking-[0.12em] text-white/35">TRL — Maturidade Tecnológica (NASA)</p>
              <span className="text-[8px] font-bold text-white/70">Nível {state.trl}</span>
            </div>
            <input type="range" min={1} max={9} value={state.trl} onChange={e => update({ trl: Number(e.target.value) })} className="w-full accent-white/50" />
            <div className="mt-1 flex justify-between text-[6px] text-white/20">
              <span>1 · Conceito</span><span>5 · Validado</span><span>9 · Mercado</span>
            </div>
          </div>
          <Sel label="Posição no Hype Cycle (Gartner)" value={state.hype}
            options={Object.entries(HYPE_LABELS).map(([v, l]) => ({ v, l }))}
            onChange={v => update({ hype: v })}
          />
        </div>
      )}

      {/* ── 7. FRAMEWORKS ── */}
      <SectionHeader label="7 · Frameworks de Referência" open={!!open.ref} toggle={() => toggle('ref')} />
      {open.ref && (
        <div className="space-y-2 rounded-[0.8rem] border border-white/4 bg-white/[0.01] px-3 py-3">
          {[
            { t: 'OKRs (Google · Nubank · iFood)', b: 'Objetivo = o que quero alcançar. Key Results = como medir. Atingir 70% já é sucesso. Ciclos trimestrais com revisão semanal.' },
            { t: 'Design Sprint (Google Ventures · 5 dias)', b: 'Segunda: mapear. Terça: desenhar. Quarta: decidir. Quinta: prototipar. Sexta: testar. Valida ideias sem construir produto completo.' },
            { t: 'Agile / Scrum', b: 'Sprints de 2 semanas, entrega contínua, feedback a cada ciclo. Squads autônomos de 6-8. Não é metodologia de TI — é cultura organizacional.' },
            { t: 'DDDM — Decisão Baseada em Dados', b: 'Coleta → Análise → Visualização → Integração Estratégica. Tecnologia sozinha não basta — precisa de cultura de dados primeiro.' },
            { t: 'COBIT · ISO 38500 · ITIL 4', b: 'COBIT: governança de TI alinhada ao negócio. ISO 38500: 6 princípios para dirigentes. ITIL 4: entrega tática com IA e cloud.' },
            { t: 'TRL (NASA) — 9 Níveis', b: 'Mede maturidade de 1 (conceito) a 9 (mercado). Cada nível exige evidência diferente. Usado para alocar recursos e definir risco.' },
            { t: 'Hype Cycle (Gartner)', b: 'Gatilho → Pico → Vale → Encosta → Platô. Objetivo: chegar à Encosta com casos reais antes que concorrentes percebam a janela.' },
            { t: 'Inovação Ambidestra', b: 'H1 (eficiência) e H3 (exploração) ao mesmo tempo. O maior desafio: fazer os dois sem que um sabote o outro — requer estruturas separadas.' },
          ].map(f => (
            <div key={f.t} className="rounded-[0.7rem] border border-white/5 bg-white/[0.015] px-3 py-2.5">
              <p className="mb-1 text-[8px] font-semibold text-white/60">{f.t}</p>
              <p className="text-[7px] leading-relaxed text-white/35">{f.b}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Notas + Salvar ── */}
      <div className="space-y-2 rounded-[0.8rem] border border-white/4 bg-white/[0.01] px-3 py-3">
        <p className="text-[7px] uppercase tracking-[0.12em] text-white/30">Notas do ciclo</p>
        <textarea
          className={inputCls + ' min-h-[4rem] resize-none'}
          placeholder="Reflexões, decisões, aprendizados, próximos passos..."
          value={state.notas}
          onChange={e => update({ notas: e.target.value })}
        />
        <button
          onClick={() => { update({ ultimaRevisao: new Date().toLocaleString('pt-BR') }); setSaved(true); setTimeout(() => setSaved(false), 2000) }}
          className="flex items-center gap-1.5 rounded-[0.6rem] border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[8px] text-white/60 hover:text-white/80"
        >
          <Save className="h-3 w-3" />
          {saved ? 'Revisão registrada ✓' : 'Registrar revisão'}
        </button>
      </div>

    </div>
  )
}
