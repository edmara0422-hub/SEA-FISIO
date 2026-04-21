'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Plus, Trash2, Save, RefreshCw, Brain, CheckSquare, Square, ChevronDown, ChevronUp, Zap, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

type PhaseId   = 'f1' | 'f2' | 'f3' | 'f4' | 'f5' | 'f6'
type MatStatus = 'nao_iniciado' | 'em_desenvolvimento' | 'implementado' | 'otimizado'
type TndStatus = 'nao_monitorando' | 'estudando' | 'implementado' | 'liderando'
type KR        = { id: string; descricao: string; progresso: number }
type OKR       = { id: string; objetivo: string; krs: KR[] }

type Metrics = {
  totalUsers: number; activeWeek: number; retention7d: number
  nps: number | null; subsActive: number; loadedAt: string
}

type StrategyState = {
  companyPhase  : PhaseId | ''
  marketPhase   : PhaseId | ''
  marketSignals : Partial<Record<PhaseId, string>>
  phaseMetas    : Partial<Record<PhaseId, string>>
  checksDone    : string[]
  sgi           : Partial<Record<string, MatStatus>>
  dddm          : Partial<Record<string, MatStatus>>
  tendencias    : Partial<Record<string, TndStatus>>
  sust          : Partial<Record<string, MatStatus>>
  okrs          : OKR[]
  h1: number; h2: number; h3: number
  notas         : string
  ultimaRevisao : string
}

// ─── Static data ──────────────────────────────────────────────────────────────

const PHASES: { id: PhaseId; label: string; sublabel: string; desc: string }[] = [
  { id: 'f1', label: 'F1', sublabel: 'Infra',         desc: 'Infraestrutura básica digital instalada' },
  { id: 'f2', label: 'F2', sublabel: 'Processo',      desc: 'Processos internos digitalizados' },
  { id: 'f3', label: 'F3', sublabel: 'Estratégia',    desc: 'Tecnologia como vantagem competitiva' },
  { id: 'f4', label: 'F4', sublabel: 'Digitização',   desc: 'Dados e produtos digitais ativos' },
  { id: 'f5', label: 'F5', sublabel: 'Digitalização', desc: 'Modelo de negócio digital-first' },
  { id: 'f6', label: 'F6', sublabel: 'Transformação', desc: 'Empresa reinventada pela tecnologia' },
]

type CheckItem = {
  id: string; label: string
  proximo?: string
  autoDetect?: (m: Metrics) => boolean
  autoSource?: string; autoDetail?: string
}

const PHASE_CHECKS: Record<PhaseId, CheckItem[]> = {
  f1: [
    { id: 'hosting',   label: 'App hospedado via HTTPS',           autoDetect: () => true,               autoSource: 'Vercel',        autoDetail: 'SEA hospedado em Vercel — HTTPS ativo' },
    { id: 'db',        label: 'Banco de dados estruturado',         autoDetect: () => true,               autoSource: 'Supabase',      autoDetail: 'Supabase com tabelas e RLS configurados' },
    { id: 'auth',      label: 'Autenticação com roles ativa',       autoDetect: () => true,               autoSource: 'Supabase Auth', autoDetail: 'Auth + perfis + bloqueio de conta' },
    { id: 'analytics', label: 'Analytics básico ativo',             autoDetect: () => true,               autoSource: 'Admin Panel',   autoDetail: 'Painel Admin com eventos e indicadores' },
  ],
  f2: [
    { id: 'users_mgmt',    label: 'Gestão de usuários ativa',       autoDetect: () => true,               autoSource: 'Supabase profiles', autoDetail: 'Perfis com histórico de login e controle' },
    { id: 'processes_doc', label: 'Processos-chave documentados',   proximo: 'Documentar o fluxo clínico completo: admissão → avaliação → evolução → alta. 1 processo por semana.' },
    { id: 'automation',    label: 'Ao menos 1 automação ativa',     proximo: 'Criar trigger: novo usuário cadastrado → notificação de boas-vindas automática via Supabase Edge Function.' },
    { id: 'metrics_dash',  label: 'Dashboard de métricas do negócio', autoDetect: () => true,             autoSource: 'Admin Panel',   autoDetail: 'Analytics com retenção, eventos, insights IA e OKRs' },
  ],
  f3: [
    { id: 'nps_active',  label: 'NPS coletado regularmente',        autoDetect: m => m.nps !== null,      autoSource: 'sea_feedback',  proximo: 'Ativar coleta de NPS inline após 7 dias de uso — mínimo 10 respostas.' },
    { id: 'core_feat',   label: 'Feature core identificada (>40%)', autoDetect: m => m.activeWeek >= 10, proximo: 'Analisar Top Features no Analytics — identificar o que gera 40%+ do uso.' },
    { id: 'differentiator', label: 'Diferencial competitivo documentado', proximo: 'Responder: o que o SEA faz que nenhuma alternativa replica em 6 meses?' },
    { id: 'organic_ch',  label: 'Canal de aquisição orgânica ativo', proximo: 'Criar série de conteúdo clínico exclusivo que gera retorno semanal sem ads.' },
  ],
  f4: [
    { id: 'dddm_full',  label: 'Decisões de produto 100% data-driven', proximo: 'Definir quais 3 métricas determinam cada decisão de produto no próximo sprint.' },
    { id: 'premium',    label: 'Feature premium lançada e mensurável',  proximo: 'Identificar e lançar 1 funcionalidade que usuários pagariam separadamente.' },
    { id: 'mrr1k',      label: 'MRR > R$ 1.000',                        autoDetect: m => m.subsActive >= 2, proximo: 'Converter early adopters em pagantes — modelo de precificação definido.' },
    { id: 'nps30',      label: 'NPS > 30 com 20+ respostas',             autoDetect: m => (m.nps ?? -999) > 30, proximo: 'Coletar NPS de todos os usuários ativos — identificar promotores.' },
  ],
  f5: [
    { id: 'mrr5k',      label: 'MRR > R$ 5.000 com churn < 5%',    autoDetect: m => m.subsActive >= 10, proximo: 'Ativar programa de sucesso do cliente — contato proativo antes do churn.' },
    { id: 'growth_loop', label: 'Growth loop ativo',                 proximo: 'Criar mecanismo: fisioterapeuta usa → compartilha → novo usuário chega sem custo.' },
    { id: 'b2b',        label: 'Parceria B2B institucional',          proximo: 'Identificar 3 hospitais ou clínicas e propor piloto B2B com contrato anual.' },
    { id: 'ai_core',    label: 'IA integrada ao core clínico',        proximo: 'Implementar agente IA para análise automática de parâmetros ventilatórios.' },
  ],
  f6: [
    { id: 'users500', label: '500+ usuários ativos',                  autoDetect: m => m.totalUsers >= 500, proximo: 'Atingir 500 usuários ativos com NPS > 50.' },
    { id: 'nps50',    label: 'NPS > 50 com amostra representativa',   autoDetect: m => (m.nps ?? -999) > 50, proximo: 'Manter NPS acima de 50 com revisão quinzenal.' },
    { id: 'latam',    label: 'Expansão LatAm iniciada',               proximo: 'Identificar 1 parceiro em outro país para piloto internacional.' },
    { id: 'paper',    label: 'Relatório de impacto clínico publicado', proximo: 'Publicar primeiro paper ou relatório com dados anonimizados do SEA.' },
  ],
}

const MAT_STATUS_LIST: { id: MatStatus; short: string }[] = [
  { id: 'nao_iniciado',       short: 'N/I' },
  { id: 'em_desenvolvimento', short: 'Dev' },
  { id: 'implementado',       short: 'Impl' },
  { id: 'otimizado',          short: 'Otim' },
]

const TND_STATUS_LIST: { id: TndStatus; short: string }[] = [
  { id: 'nao_monitorando', short: 'N/Mon' },
  { id: 'estudando',       short: 'Estud' },
  { id: 'implementado',    short: 'Impl' },
  { id: 'liderando',       short: 'Lider' },
]

const SGI_ROWS = [
  { id: 'projetos',   emoji: '🏗️', label: 'Estrutura de Projetos' },
  { id: 'processos',  emoji: '⚙️', label: 'Processos' },
  { id: 'cultura',    emoji: '🧬', label: 'Cultura' },
  { id: 'resultados', emoji: '📈', label: 'Resultados' },
]

const DDDM_ROWS = [
  { id: 'coleta',       emoji: '💾', label: 'Coleta e Armazenamento' },
  { id: 'analise',      emoji: '🧠', label: 'Análise e Processamento' },
  { id: 'visualizacao', emoji: '📊', label: 'Visualização' },
  { id: 'integracao',   emoji: '🎯', label: 'Integração Estratégica' },
]

const TEND_ROWS = [
  { id: 'agentes_ia', emoji: '🤖', label: 'Agentes de IA Autônomos',           alerta: 'Concorrentes com IA autônoma vão entregar análises antes de você perguntar.' },
  { id: 'regtech',    emoji: '⚖️', label: 'RegTech e Compliance Automatizado', alerta: 'Quem não automatiza compliance paga mais e erra mais.' },
  { id: 'ambidestra', emoji: '🔀', label: 'Inovação Ambidestra',               alerta: 'Só eficiência = estagnação. Só inovação = caos sem receita.' },
  { id: 'offline',    emoji: '📡', label: 'Offline-First & Edge',              alerta: 'UTIs têm conectividade instável — offline-first é diferencial clínico.' },
]

const SUST_ROWS = [
  { id: 'carbono',          emoji: '🌱', label: 'Pegada de Carbono Digital' },
  { id: 'offline_esg',      emoji: '♻️', label: 'Offline-First como ESG' },
  { id: 'papel',            emoji: '📄', label: 'Zero Papel na UTI' },
  { id: 'antigreenwashing', emoji: '🔍', label: 'Antigreenwashing' },
]

const STORAGE_KEY = 'sea-strategy-v5'

const DEFAULT_STATE: StrategyState = {
  companyPhase: '', marketPhase: '', marketSignals: {}, phaseMetas: {},
  checksDone: [], sgi: {}, dddm: {}, tendencias: {}, sust: {},
  okrs: [], h1: 70, h2: 20, h3: 10, notas: '', ultimaRevisao: '',
}

const EMPTY_METRICS: Metrics = { totalUsers: 0, activeWeek: 0, retention7d: 0, nps: null, subsActive: 0, loadedAt: '' }

function genId() { return Math.random().toString(36).slice(2) }

function detectPhase(m: Metrics): PhaseId {
  if (m.totalUsers >= 500 && m.retention7d >= 50) return 'f6'
  if (m.totalUsers >= 200 && m.retention7d >= 40) return 'f5'
  if (m.totalUsers >= 50  && m.retention7d >= 30) return 'f4'
  if (m.totalUsers >= 20  && m.retention7d >= 20) return 'f3'
  if (m.totalUsers >= 5)                           return 'f2'
  return 'f1'
}

// ─── Compact status pill row ──────────────────────────────────────────────────

function MatRow<S extends string>({
  emoji, label, status, statusList, onChange,
}: {
  emoji: string; label: string
  status: S; statusList: { id: S; short: string }[]
  onChange: (s: S) => void
}) {
  return (
    <div className="flex items-center gap-2 border-b border-white/4 py-2 last:border-0">
      <span className="text-sm leading-none">{emoji}</span>
      <p className="flex-1 text-[9px] text-white/65">{label}</p>
      <div className="flex shrink-0 gap-0.5">
        {statusList.map(s => (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={`rounded-full px-1.5 py-0.5 text-[7px] font-medium transition-all ${
              status === s.id
                ? 'bg-white/15 text-white/85'
                : 'bg-transparent text-white/22 hover:text-white/45'
            }`}
          >{s.short}</button>
        ))}
      </div>
    </div>
  )
}

// ─── Collapsible section ──────────────────────────────────────────────────────

function Sec({ label, sub, open, toggle, children }: { label: string; sub?: string; open: boolean; toggle: () => void; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <button onClick={toggle} className="flex w-full items-center justify-between border-b border-white/6 pb-1.5">
        <div>
          <p className="text-left text-[9px] font-semibold uppercase tracking-[0.16em] text-white/50">{label}</p>
          {sub && <p className="text-left text-[7px] text-white/25">{sub}</p>}
        </div>
        {open ? <ChevronUp className="h-3 w-3 text-white/20" /> : <ChevronDown className="h-3 w-3 text-white/20" />}
      </button>
      {open && children}
    </div>
  )
}

// ─── Phase checklist item ─────────────────────────────────────────────────────

function CheckRow({ item, done, onToggle, metrics }: {
  item: CheckItem; done: boolean; onToggle: () => void; metrics: Metrics
}) {
  const isAuto = !!(item.autoDetect && item.autoDetect(metrics))
  const checked = done || isAuto
  return (
    <div className={`flex items-start gap-2.5 rounded-[0.6rem] px-2.5 py-2 transition-all ${checked ? 'bg-white/[0.02]' : ''}`}>
      <button onClick={!isAuto ? onToggle : undefined} className={`mt-0.5 shrink-0 ${isAuto ? 'cursor-default' : 'hover:opacity-80'}`}>
        {checked
          ? <CheckSquare className="h-3.5 w-3.5 text-white/55" />
          : <Square      className="h-3.5 w-3.5 text-white/20" />
        }
      </button>
      <div className="min-w-0 flex-1">
        <p className={`text-[9px] leading-snug ${checked ? 'text-white/40' : 'text-white/70'}`}>{item.label}</p>
        {isAuto && item.autoSource && (
          <p className="mt-0.5 text-[7px] text-white/25">via {item.autoSource} — {item.autoDetail}</p>
        )}
        {!checked && item.proximo && (
          <p className="mt-1 text-[7px] leading-relaxed text-white/35">O que fazer: {item.proximo}</p>
        )}
      </div>
    </div>
  )
}

// ─── Phase node (trilho item) ─────────────────────────────────────────────────

function PhaseNode({ phase, idx, isCurrent, isDone, isMarket, metrics, checksDone, onToggleCheck, meta, onSetMeta, onSelectPhase }: {
  phase: typeof PHASES[0]; idx: number
  isCurrent: boolean; isDone: boolean; isMarket: boolean
  metrics: Metrics
  checksDone: string[]; onToggleCheck: (id: string) => void
  meta: string; onSetMeta: (v: string) => void
  onSelectPhase: () => void
}) {
  const checks = isMarket ? [] : PHASE_CHECKS[phase.id as PhaseId]
  const autoCount   = checks.filter(c => c.autoDetect && c.autoDetect(metrics)).length
  const manualCount = checks.filter(c => !c.autoDetect && checksDone.includes(c.id)).length
  const totalDone   = autoCount + manualCount
  const nextPhase   = PHASES[idx + 1]

  return (
    <div className={`rounded-[0.9rem] border transition-all ${isCurrent || isMarket ? 'border-white/12 bg-white/[0.025]' : 'border-white/4 bg-transparent'}`}>
      {/* Header row */}
      <button onClick={onSelectPhase} className="flex w-full items-center gap-3 px-3 py-2.5 text-left">
        {/* Node circle */}
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold ${
          isDone    ? 'border-white/30 bg-white/[0.06] text-white/50' :
          isCurrent ? 'border-white/70 bg-white/[0.10] text-white' :
          isMarket  ? 'border-white/50 bg-white/[0.06] text-white/65' :
                      'border-white/10 text-white/20'
        }`}>
          {isDone ? '✓' : phase.label}
        </div>
        {/* Labels */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className={`text-[9px] font-semibold ${isCurrent || isMarket ? 'text-white/80' : isDone ? 'text-white/45' : 'text-white/20'}`}>{phase.sublabel}</p>
            {isCurrent && <span className="rounded-full border border-white/20 px-1.5 py-0.5 text-[6px] font-bold uppercase tracking-wider text-white/70">Fase atual</span>}
            {isMarket  && <span className="rounded-full border border-white/15 px-1.5 py-0.5 text-[6px] font-bold uppercase tracking-wider text-white/50">Mercado aqui</span>}
            {isDone    && <span className="text-[7px] text-white/35">{totalDone} itens verificados ✓</span>}
          </div>
          <p className={`text-[7px] ${isCurrent || isMarket ? 'text-white/35' : isDone ? 'text-white/25' : 'text-white/15'}`}>{phase.desc}</p>
        </div>
        {(isCurrent || !isDone) && !isMarket && <ChevronDown className="h-3 w-3 shrink-0 text-white/20" />}
      </button>

      {/* Expanded content — current phase only */}
      {isCurrent && !isMarket && (
        <div className="border-t border-white/5 px-3 pb-3 pt-2">
          {nextPhase && (
            <div className="mb-2 flex items-center gap-1">
              <ArrowRight className="h-3 w-3 text-white/25" />
              <p className="text-[7px] text-white/30">Para avançar para <span className="text-white/50">{nextPhase.label} · {nextPhase.sublabel}</span></p>
              <span className="ml-auto text-[7px] text-white/35">{totalDone}/{checks.length}</span>
            </div>
          )}
          <div className="space-y-0.5">
            {checks.map(item => (
              <CheckRow
                key={item.id}
                item={item}
                done={checksDone.includes(item.id)}
                onToggle={() => onToggleCheck(item.id)}
                metrics={metrics}
              />
            ))}
          </div>
          <div className="mt-2">
            <input
              className="w-full rounded-[0.5rem] border border-white/6 bg-transparent px-2.5 py-1.5 text-[8px] text-white/55 placeholder:text-white/18 outline-none focus:border-white/15"
              placeholder="Meta: Ex: Q3 2025 / próximos 60 dias..."
              value={meta}
              onChange={e => onSetMeta(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function StrategicPanel() {
  const [state, setState] = useState<StrategyState>(DEFAULT_STATE)
  const [metrics, setMetrics] = useState<Metrics>(EMPTY_METRICS)
  const [loadingM, setLoadingM] = useState(false)
  const [saved, setSaved] = useState(false)
  const [openSec, setOpenSec] = useState<Record<string, boolean>>({
    sgi: false, dddm: false, tend: false, sust: false, okrs: true, notas: false,
  })

  useEffect(() => {
    try {
      const r = localStorage.getItem(STORAGE_KEY)
      if (r) setState({ ...DEFAULT_STATE, ...JSON.parse(r) })
    } catch {}
  }, [])

  function update(patch: Partial<StrategyState>) {
    setState(prev => { const next = { ...prev, ...patch }; localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); return next })
  }

  const loadMetrics = useCallback(async () => {
    if (!supabase) return
    setLoadingM(true)
    const DAY = 86400000; const now = Date.now()
    const [{ data: profiles }, { data: subs }, { data: fb }] = await Promise.all([
      supabase.from('profiles').select('id, last_login, role'),
      supabase.from('subscriptions').select('status, user_id'),
      supabase.from('sea_feedback').select('score, type'),
    ])
    const real  = (profiles ?? []).filter((p: { role?: string }) => p.role !== 'admin')
    const total = real.length
    const week  = real.filter((p: { last_login?: string | null }) => p.last_login && now - new Date(p.last_login).getTime() < DAY * 7).length
    const ret7  = total > 0 ? Math.round((week / total) * 100) : 0
    const npsE  = (fb ?? []).filter((f: { type: string; score: number | null }) => f.type === 'nps' && f.score !== null)
    let nps: number | null = null
    if (npsE.length > 0) {
      const pr = npsE.filter((f: { score: number }) => f.score >= 9).length
      const de = npsE.filter((f: { score: number }) => f.score <= 6).length
      nps = Math.round(((pr - de) / npsE.length) * 100)
    }
    const realIds    = new Set(real.map((p: { id: string }) => p.id))
    const subsActive = (subs ?? []).filter((s: { user_id: string; status: string }) => realIds.has(s.user_id) && s.status === 'active').length
    setMetrics({ totalUsers: total, activeWeek: week, retention7d: ret7, nps, subsActive, loadedAt: new Date().toLocaleTimeString('pt-BR') })
    setLoadingM(false)
  }, [])

  useEffect(() => { loadMetrics() }, [loadMetrics])

  // Auto-detected phase
  const autoPhase = useMemo(() => detectPhase(metrics), [metrics])

  // Apply auto-diagnosis
  function applyDiagnosis() {
    update({ companyPhase: autoPhase })
  }

  // Phase checks helpers
  function toggleCheck(id: string) {
    const done = state.checksDone
    update({ checksDone: done.includes(id) ? done.filter(d => d !== id) : [...done, id] })
  }

  // Gap
  const gapInfo = useMemo(() => {
    if (!state.companyPhase || !state.marketPhase) return null
    const ci = PHASES.findIndex(p => p.id === state.companyPhase)
    const mi = PHASES.findIndex(p => p.id === state.marketPhase)
    const gap = ci - mi
    const label = gap > 0 ? `+${gap} À FRENTE` : gap === 0 ? 'ALINHADO' : `${gap} ATRÁS`
    const desc  = gap > 0 ? 'Vantagem competitiva estrutural — velocidade define quem lidera.' : gap === 0 ? 'Janela de oportunidade máxima — quem executa mais rápido captura o segmento.' : 'Gap de maturidade — fechar antes de expandir.'
    return { label, desc, ahead: gap > 0, even: gap === 0 }
  }, [state.companyPhase, state.marketPhase])

  // Weekly plan: top 3 pending actions from current phase
  const weeklyPlan = useMemo(() => {
    if (!state.companyPhase) return []
    const checks = PHASE_CHECKS[state.companyPhase]
    return checks
      .filter(c => {
        const isAuto = c.autoDetect && c.autoDetect(metrics)
        const isDone = state.checksDone.includes(c.id)
        return !isAuto && !isDone && c.proximo
      })
      .slice(0, 3)
  }, [state.companyPhase, state.checksDone, metrics])

  // Pergunta do dia
  const pergunta = useMemo(() => {
    if (!state.companyPhase) return 'Em qual fase estamos? Em qual fase o mercado chegou?'
    const checks = PHASE_CHECKS[state.companyPhase]
    const totalDone = checks.filter(c => (c.autoDetect && c.autoDetect(metrics)) || state.checksDone.includes(c.id)).length
    if (totalDone === checks.length) return `${PHASES.find(p=>p.id===state.companyPhase)?.sublabel} completa — o que falta para avançar para a próxima fase?`
    return `O que ainda trava o SEA em ${PHASES.find(p=>p.id===state.companyPhase)?.sublabel}? Identifique, remova, avance.`
  }, [state.companyPhase, state.checksDone, metrics])

  // OKR helpers
  function addOKR()                                    { update({ okrs: [...state.okrs, { id: genId(), objetivo: '', krs: [] }] }) }
  function updateOKR(id: string, obj: string)          { update({ okrs: state.okrs.map(o => o.id === id ? { ...o, objetivo: obj } : o) }) }
  function removeOKR(id: string)                       { update({ okrs: state.okrs.filter(o => o.id !== id) }) }
  function addKR(oid: string)                          { update({ okrs: state.okrs.map(o => o.id === oid ? { ...o, krs: [...o.krs, { id: genId(), descricao: '', progresso: 0 }] } : o) }) }
  function updateKR(oid: string, kid: string, p: Partial<KR>) { update({ okrs: state.okrs.map(o => o.id === oid ? { ...o, krs: o.krs.map(k => k.id === kid ? { ...k, ...p } : k) } : o) }) }
  function removeKR(oid: string, kid: string)          { update({ okrs: state.okrs.map(o => o.id === oid ? { ...o, krs: o.krs.filter(k => k.id !== kid) } : o) }) }

  const ci = state.companyPhase ? PHASES.findIndex(p => p.id === state.companyPhase) : -1
  const mi = state.marketPhase  ? PHASES.findIndex(p => p.id === state.marketPhase)  : -1
  const inCls = 'w-full rounded-[0.5rem] border border-white/8 bg-transparent px-2.5 py-1.5 text-[9px] text-white/65 placeholder:text-white/20 outline-none focus:border-white/15'

  return (
    <div className="space-y-5">

      {/* ── PERGUNTA DO DIA ────────────────────────────────────────────────── */}
      <div className="rounded-[1rem] border border-white/8 bg-white/[0.025] p-4">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-[7px] font-semibold uppercase tracking-[0.16em] text-white/35">Pergunta do dia</p>
          <button onClick={loadMetrics} disabled={loadingM} className="flex items-center gap-1 text-[7px] text-white/25 hover:text-white/45">
            <RefreshCw className={`h-2.5 w-2.5 ${loadingM ? 'animate-spin' : ''}`} /> {metrics.loadedAt || 'Carregar'}
          </button>
        </div>
        <p className="mb-3 text-[11px] font-medium leading-snug text-white/75">{pergunta}</p>

        {/* 4 metrics inline */}
        <div className="flex gap-2">
          {[
            { l: 'Usuários', v: metrics.totalUsers },
            { l: 'Ativos/sem', v: metrics.activeWeek },
            { l: 'Ret 7d', v: `${metrics.retention7d}%` },
            { l: 'NPS', v: metrics.nps ?? '--' },
          ].map(m => (
            <div key={m.l} className="flex flex-col items-center">
              <p className="text-[11px] font-bold tabular-nums text-white/70">{m.v}</p>
              <p className="text-[6px] text-white/30">{m.l}</p>
            </div>
          ))}
          <div className="ml-auto flex flex-col items-end justify-center">
            {gapInfo ? (
              <>
                <p className={`text-[9px] font-bold ${gapInfo.ahead ? 'text-white/80' : gapInfo.even ? 'text-white/60' : 'text-white/40'}`}>{gapInfo.label}</p>
                <p className="text-[6px] text-white/30">{gapInfo.ahead ? 'Liderar' : gapInfo.even ? 'Acelerar' : 'Fechar gap'}</p>
              </>
            ) : (
              <p className="text-[7px] text-white/20">Defina as fases</p>
            )}
          </div>
        </div>

        {/* Diagnóstico */}
        {metrics.loadedAt && (
          <div className="mt-3 flex items-center gap-2 rounded-[0.6rem] border border-white/6 bg-white/[0.02] px-3 py-2">
            <Zap className="h-3 w-3 shrink-0 text-white/40" />
            <div className="flex-1">
              <p className="text-[8px] text-white/55">
                Diagnóstico automático ativo · Fase detectada: <span className="font-semibold text-white/80">{PHASES.find(p=>p.id===autoPhase)?.label} · {PHASES.find(p=>p.id===autoPhase)?.sublabel}</span>
              </p>
              <p className="text-[7px] text-white/30">{metrics.totalUsers} usuários · {metrics.retention7d}% retenção · {metrics.subsActive} assinaturas ativas</p>
            </div>
            {state.companyPhase !== autoPhase && (
              <button onClick={applyDiagnosis} className="shrink-0 rounded-[0.4rem] border border-white/10 bg-white/[0.05] px-2 py-1 text-[7px] text-white/55 hover:text-white/80">
                Aplicar
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── PLANO DA SEMANA ────────────────────────────────────────────────── */}
      {weeklyPlan.length > 0 && (
        <div className="rounded-[0.9rem] border border-white/6 bg-white/[0.015] p-4">
          <div className="mb-2 flex items-center gap-1.5">
            <Brain className="h-3 w-3 text-white/35" />
            <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/35">Plano de ação — esta semana</p>
          </div>
          <div className="space-y-2">
            {weeklyPlan.map((item, i) => (
              <div key={item.id} className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white/12 text-[7px] font-bold text-white/30">{i+1}</span>
                <p className="text-[8px] leading-relaxed text-white/55">{item.proximo}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TRILHO DA EMPRESA ──────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/35">Trilho da empresa</p>
        {PHASES.map((ph, idx) => (
          <PhaseNode
            key={ph.id}
            phase={ph} idx={idx}
            isCurrent={ph.id === state.companyPhase}
            isDone={ci > idx}
            isMarket={false}
            metrics={metrics}
            checksDone={state.checksDone}
            onToggleCheck={toggleCheck}
            meta={state.phaseMetas[ph.id] ?? ''}
            onSetMeta={v => update({ phaseMetas: { ...state.phaseMetas, [ph.id]: v } })}
            onSelectPhase={() => update({ companyPhase: ph.id })}
          />
        ))}
      </div>

      {/* ── TRILHO DO MERCADO ──────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/35">Trilho do mercado</p>
        {PHASES.map((ph, idx) => (
          <div key={ph.id}>
            <button
              onClick={() => update({ marketPhase: ph.id })}
              className={`flex w-full items-center gap-3 rounded-[0.9rem] border px-3 py-2 text-left transition-all ${ph.id === state.marketPhase ? 'border-white/12 bg-white/[0.025]' : 'border-white/4'}`}
            >
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[8px] font-bold ${
                ph.id === state.marketPhase ? 'border-white/50 bg-white/[0.06] text-white/65' :
                mi > idx                    ? 'border-white/20 text-white/30' :
                                              'border-white/8 text-white/15'
              }`}>{ph.label}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-[9px] font-semibold ${ph.id === state.marketPhase ? 'text-white/70' : 'text-white/20'}`}>{ph.sublabel}</p>
                  {ph.id === state.marketPhase && <span className="rounded-full border border-white/15 px-1.5 py-0.5 text-[6px] font-bold uppercase tracking-wider text-white/45">Mercado aqui</span>}
                </div>
                {ph.id === state.marketPhase && (
                  <input
                    className="mt-1 w-full bg-transparent text-[7px] text-white/35 placeholder:text-white/18 outline-none"
                    placeholder="O que você observa no mercado nesta fase?"
                    value={state.marketSignals[ph.id] ?? ''}
                    onChange={e => update({ marketSignals: { ...state.marketSignals, [ph.id]: e.target.value } })}
                    onClick={e => e.stopPropagation()}
                  />
                )}
              </div>
            </button>
          </div>
        ))}

        {gapInfo && (
          <div className="rounded-[0.8rem] border border-white/6 bg-white/[0.015] px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="rounded-full border border-white/15 px-2 py-0.5 text-[7px] font-bold text-white/55">Empresa</span>
                <span className="text-[8px] font-bold text-white/70">{gapInfo.label}</span>
                <span className="rounded-full border border-white/8 px-2 py-0.5 text-[7px] text-white/35">Mercado</span>
              </div>
            </div>
            <p className="mt-1 text-[7px] leading-relaxed text-white/35">{gapInfo.desc}</p>
          </div>
        )}
      </div>

      {/* ── SGI + TD ───────────────────────────────────────────────────────── */}
      <Sec label="SGI + TD — Maturidade de Execução" sub="Sistema de Gestão da Inovação" open={!!openSec.sgi} toggle={() => setOpenSec(p=>({...p, sgi: !p.sgi}))}>
        <div className="rounded-[0.8rem] border border-white/5 bg-white/[0.01] px-3 py-1">
          {SGI_ROWS.map(row => (
            <MatRow<MatStatus>
              key={row.id}
              emoji={row.emoji} label={row.label}
              status={(state.sgi[row.id] as MatStatus) ?? 'nao_iniciado'}
              statusList={MAT_STATUS_LIST}
              onChange={s => update({ sgi: { ...state.sgi, [row.id]: s } })}
            />
          ))}
        </div>
      </Sec>

      {/* ── DDDM ───────────────────────────────────────────────────────────── */}
      <Sec label="DDDM — Decisão Baseada em Dados" sub="Data-Driven Decision Making" open={!!openSec.dddm} toggle={() => setOpenSec(p=>({...p, dddm: !p.dddm}))}>
        <div className="rounded-[0.8rem] border border-white/5 bg-white/[0.01] px-3 py-1">
          {DDDM_ROWS.map(row => (
            <MatRow<MatStatus>
              key={row.id}
              emoji={row.emoji} label={row.label}
              status={(state.dddm[row.id] as MatStatus) ?? 'nao_iniciado'}
              statusList={MAT_STATUS_LIST}
              onChange={s => update({ dddm: { ...state.dddm, [row.id]: s } })}
            />
          ))}
        </div>
      </Sec>

      {/* ── TENDÊNCIAS ─────────────────────────────────────────────────────── */}
      <Sec label="Tendências 2025 — Watchlist" open={!!openSec.tend} toggle={() => setOpenSec(p=>({...p, tend: !p.tend}))}>
        <div className="space-y-1.5">
          {TEND_ROWS.map(row => (
            <div key={row.id} className="rounded-[0.7rem] border border-white/5 bg-white/[0.01] px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm leading-none">{row.emoji}</span>
                <p className="flex-1 text-[9px] text-white/65">{row.label}</p>
                <div className="flex shrink-0 gap-0.5">
                  {TND_STATUS_LIST.map(s => (
                    <button
                      key={s.id}
                      onClick={() => update({ tendencias: { ...state.tendencias, [row.id]: s.id } })}
                      className={`rounded-full px-1.5 py-0.5 text-[7px] font-medium transition-all ${
                        (state.tendencias[row.id] ?? 'nao_monitorando') === s.id
                          ? 'bg-white/15 text-white/85'
                          : 'bg-transparent text-white/22 hover:text-white/45'
                      }`}
                    >{s.short}</button>
                  ))}
                </div>
              </div>
              <p className="mt-1 text-[7px] italic leading-relaxed text-white/22">{row.alerta}</p>
            </div>
          ))}
        </div>
      </Sec>

      {/* ── SUSTENTABILIDADE ───────────────────────────────────────────────── */}
      <Sec label="Sustentabilidade Digital" sub="ESG nativo — práticas verificáveis" open={!!openSec.sust} toggle={() => setOpenSec(p=>({...p, sust: !p.sust}))}>
        <div className="rounded-[0.8rem] border border-white/5 bg-white/[0.01] px-3 py-1">
          {SUST_ROWS.map(row => (
            <MatRow<MatStatus>
              key={row.id}
              emoji={row.emoji} label={row.label}
              status={(state.sust[row.id] as MatStatus) ?? 'nao_iniciado'}
              statusList={MAT_STATUS_LIST}
              onChange={s => update({ sust: { ...state.sust, [row.id]: s } })}
            />
          ))}
        </div>
      </Sec>

      {/* ── OKRs ───────────────────────────────────────────────────────────── */}
      <Sec label="OKRs do Ciclo" open={!!openSec.okrs} toggle={() => setOpenSec(p=>({...p, okrs: !p.okrs}))}>
        <div className="space-y-2">
          {state.okrs.map(okr => (
            <div key={okr.id} className="rounded-[0.8rem] border border-white/6 bg-white/[0.02] p-3">
              <div className="mb-2 flex items-center gap-2">
                <input className={inCls + ' flex-1'} placeholder="Objetivo..." value={okr.objetivo} onChange={e => updateOKR(okr.id, e.target.value)} />
                <button onClick={() => removeOKR(okr.id)} className="shrink-0 text-white/15 hover:text-red-400/60"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              {okr.krs.map(kr => (
                <div key={kr.id} className="mb-1.5 flex items-center gap-2">
                  <span className="text-[7px] text-white/25">KR</span>
                  <input className={inCls + ' flex-1'} placeholder="Key result..." value={kr.descricao} onChange={e => updateKR(okr.id, kr.id, { descricao: e.target.value })} />
                  <input type="range" min={0} max={100} value={kr.progresso} onChange={e => updateKR(okr.id, kr.id, { progresso: Number(e.target.value) })} className="w-14 accent-white/40" />
                  <span className="w-7 text-right text-[8px] text-white/35">{kr.progresso}%</span>
                  <button onClick={() => removeKR(okr.id, kr.id)} className="text-white/12 hover:text-red-400/60"><Trash2 className="h-3 w-3" /></button>
                </div>
              ))}
              <button onClick={() => addKR(okr.id)} className="mt-1 flex items-center gap-1 text-[7px] text-white/22 hover:text-white/45"><Plus className="h-3 w-3" /> Key Result</button>
            </div>
          ))}
          <button onClick={addOKR} className="flex w-full items-center justify-center gap-1 rounded-[0.7rem] border border-white/8 py-2 text-[8px] text-white/30 hover:text-white/55">
            <Plus className="h-3 w-3" /> Objetivo
          </button>
        </div>
      </Sec>

      {/* ── NOTAS ──────────────────────────────────────────────────────────── */}
      <Sec label="Notas do Ciclo" open={!!openSec.notas} toggle={() => setOpenSec(p=>({...p, notas: !p.notas}))}>
        <div className="space-y-1.5">
          <textarea
            rows={3}
            className="w-full resize-none rounded-[0.7rem] border border-white/8 bg-white/[0.02] px-3 py-2 text-[9px] leading-relaxed text-white/55 placeholder:text-white/18 outline-none focus:border-white/15"
            placeholder="Reflexões, decisões, aprendizados..."
            value={state.notas}
            onChange={e => update({ notas: e.target.value })}
          />
          <button
            onClick={() => { update({ ultimaRevisao: new Date().toLocaleString('pt-BR') }); setSaved(true); setTimeout(() => setSaved(false), 2500) }}
            className="flex items-center gap-2 rounded-[0.5rem] border border-white/8 px-3 py-1.5 text-[8px] text-white/45 hover:text-white/70"
          >
            <Save className="h-3 w-3" />{saved ? 'Registrado ✓' : 'Registrar revisão'}
          </button>
          {state.ultimaRevisao && <p className="text-[6px] text-white/18">Última revisão: {state.ultimaRevisao}</p>}
        </div>
      </Sec>

    </div>
  )
}
