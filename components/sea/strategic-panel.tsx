'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Plus, Trash2, Save, RefreshCw, CheckSquare, Square, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

type PhaseId = 'f1' | 'f2' | 'f3' | 'f4' | 'f5' | 'f6'
type KR      = { id: string; descricao: string; progresso: number }
type OKR     = { id: string; objetivo: string; krs: KR[] }

type Metrics = {
  totalUsers: number; activeWeek: number; retention7d: number
  nps: number | null; subsActive: number; loadedAt: string
}

type Directive = {
  foco     : string         // headline - what matters RIGHT NOW
  diretiva : string         // the instruction
  acoes    : string[]       // 3 concrete weekly actions
  bloqueio : string         // the real block to remove
  sinal    : string         // how you know you're advancing
}

type StrategyState = {
  marketPhase  : PhaseId | ''
  weekDone     : string[]
  okrs         : OKR[]
  notas        : string
  ultimaRevisao: string
}

// ─── Intelligence ─────────────────────────────────────────────────────────────

const PHASES: { id: PhaseId; label: string; sublabel: string }[] = [
  { id: 'f1', label: 'F1', sublabel: 'Infra' },
  { id: 'f2', label: 'F2', sublabel: 'Processo' },
  { id: 'f3', label: 'F3', sublabel: 'Estratégia' },
  { id: 'f4', label: 'F4', sublabel: 'Digitização' },
  { id: 'f5', label: 'F5', sublabel: 'Digitalização' },
  { id: 'f6', label: 'F6', sublabel: 'Transformação' },
]

function detectPhase(m: Metrics): PhaseId {
  if (m.totalUsers >= 500 && m.retention7d >= 50) return 'f6'
  if (m.totalUsers >= 200 && m.retention7d >= 40) return 'f5'
  if (m.totalUsers >= 50  && m.retention7d >= 30) return 'f4'
  if (m.totalUsers >= 20  && m.retention7d >= 20) return 'f3'
  if (m.totalUsers >= 5)                           return 'f2'
  return 'f1'
}

function getDirective(phase: PhaseId, m: Metrics): Directive {
  // F1 → F2: 0 users
  if (phase === 'f1' && m.totalUsers === 0) return {
    foco: 'O SEA está pronto. Falta o único ingrediente que nenhuma linha de código resolve: usuários reais.',
    diretiva: 'Abra o WhatsApp agora e mande mensagem para 3 fisioterapeutas de UTI que você conhece pessoalmente. Não mande link — marque uma demo ao vivo. 30 minutos. Mostre o prontuário, as calculadoras, as simulações.',
    acoes: [
      'Lista agora os 5 fisioterapeutas de UTI mais próximos de você. Manda mensagem hoje para cada um.',
      'Faz 1 demo ao vivo ainda esta semana. Não precisa ser perfeita — precisa ser real.',
      'Registra na sexta: o que funcionou, o que não funcionou, o que surpreendeu.',
    ],
    bloqueio: 'O bloqueio não é técnico. O SEA já funciona. O bloqueio é comercial — sair do computador e falar com pessoas. Isso não se resolve com mais features.',
    sinal: 'Um fisioterapeuta abrir o SEA sozinho, sem você pedir — esse é o sinal de que tem valor real.',
  }

  // F1 → F2: few users
  if (phase === 'f1') return {
    foco: `${m.totalUsers} usuário(s) cadastrado(s). Cada um é ouro — converse com todos esta semana.`,
    diretiva: 'Fale com cada usuário individualmente. Pergunte: o que você usou? O que travou? O que faltou? As respostas dessa conversa valem mais do que qualquer analytics.',
    acoes: [
      'Entrevista individual com cada usuário: 20 min, sem script, escuta ativa.',
      'Documente o fluxo clínico real: o que eles fazem no SEA, passo a passo.',
      'Identifique 1 ponto de fricção crítico e corrija ainda esta semana.',
    ],
    bloqueio: 'Com poucos usuários, o risco é ignorá-los e continuar construindo. O produto se define agora — ouça antes de decidir.',
    sinal: `Retenção 7 dias acima de 40% (hoje: ${m.retention7d}%) e usuários voltando sem você pedir.`,
  }

  // F2: processes
  if (phase === 'f2') return {
    foco: `${m.totalUsers} usuários · ${m.retention7d}% retenção. Processos definem se o crescimento vai escalar ou travar.`,
    diretiva: 'Mapeie o fluxo clínico do fisioterapeuta no SEA do início ao fim. Onde o usuário para, hesita ou sai? Esse é o processo a corrigir primeiro. Onboarding de novo usuário deve levar menos de 5 minutos.',
    acoes: [
      'Grave ou anote o fluxo completo: novo usuário → primeiro prontuário → primeira calculadora.',
      'Identifique o "momento aha" — o que faz o usuário entender o valor do SEA.',
      'Configure 1 automação: novo cadastro → mensagem de boas-vindas automática.',
    ],
    bloqueio: `Retenção em ${m.retention7d}% significa que ${100 - m.retention7d}% dos usuários não voltam. Antes de atrair mais, entenda por que os atuais somem.`,
    sinal: 'Usuário cria prontuário nos primeiros 5 minutos e volta no dia seguinte sem você pedir.',
  }

  // F3: strategy
  if (phase === 'f3') return {
    foco: `${m.totalUsers} usuários · ${m.activeWeek} ativos/semana. A diferenciação define quem sobrevive nessa fase.`,
    diretiva: 'Responda esta pergunta sem enrolar: o que o SEA faz que nenhum concorrente consegue replicar em 6 meses? Se você não souber responder, os usuários também não saberão — e a retenção vai provar isso.',
    acoes: [
      'Entreviste os 5 usuários mais engajados: por que eles usam o SEA toda semana?',
      'Defina 1 feature core que nenhuma alternativa tem — e invista 80% do sprint nela.',
      'Ative coleta de NPS: envie para todos os ativos da semana.',
    ],
    bloqueio: `NPS ${m.nps ?? 'não coletado'} · Sem NPS, você não sabe se tem promotores ou detratores. Um produto que não se defende sozinho depende da fundadora para crescer — isso não escala.`,
    sinal: `NPS acima de 30 com pelo menos 20 respostas. Hoje: ${m.nps ?? 'não coletado'}.`,
  }

  // F4: data
  if (phase === 'f4') return {
    foco: `${m.totalUsers} usuários · ${m.subsActive} assinantes. Dados são a vantagem — quem decide com dados move mais rápido.`,
    diretiva: 'Toda decisão de produto da próxima sprint precisa ter uma métrica associada. Se você não sabe o que vai medir, não tome a decisão ainda. Dados primeiro, feature depois.',
    acoes: [
      'Identifique as 3 métricas que determinam o sucesso do produto esta semana.',
      'Lance 1 feature premium mensurável — algo que usuários pagariam separadamente.',
      'Revise o churn: quem cancelou nos últimos 30 dias e por quê?',
    ],
    bloqueio: `Churn em ${m.subsActive > 0 ? 'andamento' : 'não mensurável'} · Cada cancelamento é LTV destruído com CAC já pago. Entenda o motivo real antes de qualquer outra ação de crescimento.`,
    sinal: `MRR crescendo 10%+ mês a mês com churn abaixo de 5%. Assinaturas ativas: ${m.subsActive}.`,
  }

  // F5: scale
  if (phase === 'f5') return {
    foco: `${m.totalUsers} usuários · R$ MRR em construção. Digital-first: o modelo funciona sem você operando manualmente?`,
    diretiva: 'Teste esta semana: se você sair de férias por 30 dias, o SEA continua crescendo? Onde você ainda é indispensável é onde está o próximo gargalo. Elimine-o.',
    acoes: [
      'Mapeie os 3 processos onde sua presença ainda é necessária — automatize 1 deles.',
      'Ative growth loop: como um usuário traz o próximo sem custo de aquisição?',
      'Prospecte 1 parceria B2B institucional — hospital ou clínica com contrato anual.',
    ],
    bloqueio: `Retenção ${m.retention7d}% · Digital-first exige retenção acima de 40%. Cada ponto abaixo disso é receita recorrente que vaza.`,
    sinal: 'MRR > R$ 5.000 com churn < 5% e 1 novo usuário chegando por semana sem ads.',
  }

  // F6: transformation
  return {
    foco: `${m.totalUsers} usuários · Transformação em curso. O SEA é o produto — e a plataforma.`,
    diretiva: 'Você chegou na fase onde a empresa é reinventada pela tecnologia. A pergunta agora é escala internacional: o que é necessário para levar o SEA para 1 mercado LatAm em 12 meses?',
    acoes: [
      'Publique o primeiro relatório de impacto clínico do SEA com dados reais.',
      'Identifique 1 parceiro estratégico em outro país para expansão piloto.',
      'Lance programa de certificação SEA para fisioterapeutas intensivistas.',
    ],
    bloqueio: 'O bloqueio nessa fase é governança e escala organizacional — o produto está provado. Construa o time.',
    sinal: `NPS acima de 60, ${m.totalUsers}+ usuários ativos, 1 novo mercado pilotado.`,
  }
}

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'sea-strategy-v6'
const DEFAULT_STATE: StrategyState = { marketPhase: '', weekDone: [], okrs: [], notas: '', ultimaRevisao: '' }
const EMPTY_METRICS: Metrics = { totalUsers: 0, activeWeek: 0, retention7d: 0, nps: null, subsActive: 0, loadedAt: '' }

function genId() { return Math.random().toString(36).slice(2) }

// ─── Sub-components ───────────────────────────────────────────────────────────

function Pill({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span className={`rounded-full border px-1.5 py-0.5 text-[6px] font-bold uppercase tracking-wider ${active ? 'border-white/25 bg-white/[0.08] text-white/80' : 'border-white/8 text-white/30'}`}>
      {children}
    </span>
  )
}

function Sec({ label, open, toggle, children }: { label: string; open: boolean; toggle: () => void; children: React.ReactNode }) {
  return (
    <div className="space-y-2 border-t border-white/5 pt-3">
      <button onClick={toggle} className="flex w-full items-center justify-between">
        <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/35">{label}</p>
        {open ? <ChevronUp className="h-3 w-3 text-white/20" /> : <ChevronDown className="h-3 w-3 text-white/20" />}
      </button>
      {open && children}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function StrategicPanel() {
  const [state, setState] = useState<StrategyState>(DEFAULT_STATE)
  const [metrics, setMetrics] = useState<Metrics>(EMPTY_METRICS)
  const [loadingM, setLoadingM] = useState(true)
  const [saved, setSaved] = useState(false)
  const [open, setOpen] = useState<Record<string, boolean>>({ mercado: false, okrs: false, notas: false })

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE_KEY); if (r) setState({ ...DEFAULT_STATE, ...JSON.parse(r) }) } catch {}
  }, [])

  function update(patch: Partial<StrategyState>) {
    setState(prev => { const next = { ...prev, ...patch }; localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); return next })
  }

  const loadMetrics = useCallback(async () => {
    if (!supabase) { setLoadingM(false); return }
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
    const m = { totalUsers: total, activeWeek: week, retention7d: ret7, nps, subsActive, loadedAt: new Date().toLocaleTimeString('pt-BR') }
    setMetrics(m)
    setLoadingM(false)
    // After metrics load, trigger AI analysis
    const detectedPhase = detectPhase(m)
    fetchAI(m, detectedPhase)
  }, [])

  // ── Groq AI analysis ──
  const [aiDirective, setAiDirective]   = useState<Directive | null>(null)
  const [loadingAI, setLoadingAI]       = useState(false)
  const [aiError, setAiError]           = useState(false)

  const fetchAI = useCallback(async (m: Metrics, ph: PhaseId) => {
    setLoadingAI(true); setAiError(false)
    try {
      const res = await fetch('/api/strategic-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics: m, phase: ph }),
      })
      if (!res.ok) throw new Error('api error')
      const data = await res.json()
      if (data.foco && data.diretiva && data.acoes) {
        setAiDirective(data as Directive)
        // Reset weekly actions when new analysis arrives
        update({ weekDone: [] })
      } else { setAiError(true) }
    } catch { setAiError(true) }
    setLoadingAI(false)
  }, [])

  useEffect(() => { loadMetrics() }, [loadMetrics])

  const phase     = useMemo(() => detectPhase(metrics), [metrics])
  // Use AI directive if available, fall back to static
  const directive = useMemo(() => aiDirective ?? getDirective(phase, metrics), [aiDirective, phase, metrics])
  const phaseIdx  = PHASES.findIndex(p => p.id === phase)
  const mktIdx    = PHASES.findIndex(p => p.id === state.marketPhase)

  const gapLabel = useMemo(() => {
    if (!state.marketPhase) return null
    const gap = phaseIdx - mktIdx
    if (gap > 0) return { txt: `+${gap} À FRENTE`, dim: false }
    if (gap === 0) return { txt: 'ALINHADO', dim: true }
    return { txt: `${gap} ATRÁS`, dim: true }
  }, [phaseIdx, mktIdx, state.marketPhase])

  function toggleWeek(i: number) {
    const key = `w${i}`
    const done = state.weekDone.includes(key) ? state.weekDone.filter(d => d !== key) : [...state.weekDone, key]
    update({ weekDone: done })
  }

  // OKR helpers
  function addOKR()                                         { update({ okrs: [...state.okrs, { id: genId(), objetivo: '', krs: [] }] }) }
  function removeOKR(id: string)                            { update({ okrs: state.okrs.filter(o => o.id !== id) }) }
  function updateOKR(id: string, obj: string)               { update({ okrs: state.okrs.map(o => o.id === id ? { ...o, objetivo: obj } : o) }) }
  function addKR(oid: string)                               { update({ okrs: state.okrs.map(o => o.id === oid ? { ...o, krs: [...o.krs, { id: genId(), descricao: '', progresso: 0 }] } : o) }) }
  function removeKR(oid: string, kid: string)               { update({ okrs: state.okrs.map(o => o.id === oid ? { ...o, krs: o.krs.filter(k => k.id !== kid) } : o) }) }
  function updateKR(oid: string, kid: string, p: Partial<KR>) { update({ okrs: state.okrs.map(o => o.id === oid ? { ...o, krs: o.krs.map(k => k.id === kid ? { ...k, ...p } : k) } : o) }) }

  const inCls = 'w-full rounded-[0.5rem] border border-white/8 bg-transparent px-2.5 py-1.5 text-[9px] text-white/65 placeholder:text-white/20 outline-none focus:border-white/15'

  if (loadingM) return (
    <div className="flex items-center justify-center py-16">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
    </div>
  )

  return (
    <div className="space-y-5">

      {/* ── POSIÇÃO + TRILHO ─────────────────────────────────────────────── */}
      <div className="rounded-[1rem] border border-white/8 bg-white/[0.025] p-4">

        {/* Header row */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {PHASES.map((ph, i) => (
              <div key={ph.id} className="flex items-center gap-1">
                {i > 0 && <span className="text-white/12 text-[8px]">→</span>}
                <span className={`text-[8px] font-bold ${i === phaseIdx ? 'text-white/90' : i < phaseIdx ? 'text-white/35' : 'text-white/18'}`}>
                  {ph.label}
                  {i === phaseIdx && <span className="ml-0.5 text-[6px] font-normal text-white/50"> {ph.sublabel}</span>}
                </span>
              </div>
            ))}
          </div>
          <button onClick={loadMetrics} className="shrink-0 text-white/20 hover:text-white/45">
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>

        {/* Metrics row */}
        <div className="mb-3 flex items-center gap-4">
          {[
            { l: 'Usuários',  v: metrics.totalUsers },
            { l: 'Ativos/sem', v: metrics.activeWeek },
            { l: 'Ret 7d',    v: `${metrics.retention7d}%` },
            { l: 'NPS',       v: metrics.nps ?? '--' },
            { l: 'Assin.',    v: metrics.subsActive },
          ].map(m => (
            <div key={m.l}>
              <p className="text-[12px] font-bold tabular-nums text-white/75">{m.v}</p>
              <p className="text-[6px] text-white/30">{m.l}</p>
            </div>
          ))}
          {gapLabel && (
            <div className="ml-auto">
              <p className={`text-[9px] font-bold ${gapLabel.dim ? 'text-white/40' : 'text-white/80'}`}>{gapLabel.txt}</p>
              <p className="text-[6px] text-white/25">Empresa vs Mercado</p>
            </div>
          )}
        </div>

        {/* Phase label */}
        <div className="flex items-center gap-2">
          <Pill active>{PHASES[phaseIdx]?.label} · {PHASES[phaseIdx]?.sublabel}</Pill>
          {metrics.loadedAt && <p className="text-[6px] text-white/20">{metrics.loadedAt}</p>}
        </div>
      </div>

      {/* ── DIRETIVA ─────────────────────────────────────────────────────── */}
      <div className="rounded-[1rem] border border-white/10 bg-white/[0.03] p-4 space-y-4">

        {/* AI status bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {loadingAI
              ? <><div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/40" /><p className="text-[7px] text-white/35">Gerando análise com Groq...</p></>
              : aiError
                ? <><div className="h-1.5 w-1.5 rounded-full bg-white/20" /><p className="text-[7px] text-white/25">Análise local (Groq indisponível)</p></>
                : aiDirective
                  ? <><div className="h-1.5 w-1.5 rounded-full bg-white/55" /><p className="text-[7px] text-white/40">Análise gerada por IA · Groq</p></>
                  : null
            }
          </div>
          <button
            onClick={() => fetchAI(metrics, phase)}
            disabled={loadingAI}
            className="flex items-center gap-1 rounded-[0.4rem] border border-white/8 px-2 py-1 text-[7px] text-white/30 hover:text-white/55 disabled:opacity-30"
          >
            <Sparkles className="h-2.5 w-2.5" />
            {loadingAI ? 'Gerando...' : 'Regenerar'}
          </button>
        </div>

        {/* Foco */}
        <div>
          <p className="mb-1 text-[7px] font-semibold uppercase tracking-[0.16em] text-white/30">Foco agora</p>
          <p className="text-[11px] font-medium leading-snug text-white/85">{directive.foco}</p>
        </div>

        {/* Diretiva */}
        <div className="rounded-[0.8rem] border border-white/8 bg-white/[0.02] p-3">
          <p className="mb-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/30">O que fazer</p>
          <p className="text-[9px] leading-relaxed text-white/70">{directive.diretiva}</p>
        </div>

        {/* Bloqueio */}
        <div>
          <p className="mb-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/25">Bloqueio a remover</p>
          <p className="text-[8px] leading-relaxed text-white/45 italic">{directive.bloqueio}</p>
        </div>

        {/* Sinal de progresso */}
        <div className="rounded-[0.7rem] border border-white/5 bg-white/[0.01] px-3 py-2">
          <p className="text-[7px] font-semibold uppercase tracking-[0.1em] text-white/25">Você saberá que está evoluindo quando</p>
          <p className="mt-0.5 text-[8px] leading-relaxed text-white/50">{directive.sinal}</p>
        </div>
      </div>

      {/* ── ESTA SEMANA ───────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-white/35">Esta semana — 3 ações</p>
        {directive.acoes.map((acao, i) => {
          const done = state.weekDone.includes(`w${i}`)
          return (
            <button
              key={i}
              onClick={() => toggleWeek(i)}
              className={`flex w-full items-start gap-3 rounded-[0.8rem] border px-3 py-2.5 text-left transition-all ${done ? 'border-white/8 bg-white/[0.025]' : 'border-white/5 bg-transparent hover:bg-white/[0.015]'}`}
            >
              {done
                ? <CheckSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/50" />
                : <Square      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/20" />
              }
              <div className="flex-1">
                <span className="mr-1.5 text-[7px] font-bold text-white/30">{i + 1}.</span>
                <span className={`text-[9px] leading-relaxed ${done ? 'text-white/30 line-through' : 'text-white/65'}`}>{acao}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── TRILHO DO MERCADO (colapsado) ─────────────────────────────────── */}
      <Sec label="Trilho do mercado" open={!!open.mercado} toggle={() => setOpen(p => ({ ...p, mercado: !p.mercado }))}>
        <p className="text-[8px] text-white/30">Clique na fase em que o mercado está hoje</p>
        <div className="flex flex-wrap gap-1.5">
          {PHASES.map((ph, i) => (
            <button
              key={ph.id}
              onClick={() => update({ marketPhase: ph.id })}
              className={`rounded-full border px-3 py-1.5 text-[8px] font-semibold transition-all ${
                state.marketPhase === ph.id
                  ? 'border-white/25 bg-white/[0.08] text-white/80'
                  : mktIdx > i
                    ? 'border-white/12 text-white/35'
                    : 'border-white/6 text-white/18 hover:text-white/40'
              }`}
            >
              {ph.label} · {ph.sublabel}
            </button>
          ))}
        </div>
        {gapLabel && (
          <p className="text-[8px] text-white/40">
            {gapLabel.dim
              ? 'SEA alinhado ao mercado — execução define quem lidera.'
              : `SEA ${phaseIdx - mktIdx} fase(s) à frente — vantagem competitiva estrutural.`}
          </p>
        )}
      </Sec>

      {/* ── OKRs (colapsado) ─────────────────────────────────────────────── */}
      <Sec label="OKRs do ciclo" open={!!open.okrs} toggle={() => setOpen(p => ({ ...p, okrs: !p.okrs }))}>
        <div className="space-y-2">
          {state.okrs.map(okr => (
            <div key={okr.id} className="rounded-[0.8rem] border border-white/6 bg-white/[0.02] p-3">
              <div className="mb-2 flex gap-2">
                <input className={inCls + ' flex-1'} placeholder="Objetivo..." value={okr.objetivo} onChange={e => updateOKR(okr.id, e.target.value)} />
                <button onClick={() => removeOKR(okr.id)} className="text-white/15 hover:text-red-400/60"><Trash2 className="h-3.5 w-3.5" /></button>
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
              <button onClick={() => addKR(okr.id)} className="mt-1 flex items-center gap-1 text-[7px] text-white/22 hover:text-white/45"><Plus className="h-3 w-3" /> KR</button>
            </div>
          ))}
          <button onClick={addOKR} className="flex w-full items-center justify-center gap-1 rounded-[0.7rem] border border-white/8 py-2 text-[8px] text-white/30 hover:text-white/55">
            <Plus className="h-3 w-3" /> Objetivo
          </button>
        </div>
      </Sec>

      {/* ── NOTAS (colapsado) ────────────────────────────────────────────── */}
      <Sec label="Notas do ciclo" open={!!open.notas} toggle={() => setOpen(p => ({ ...p, notas: !p.notas }))}>
        <textarea
          rows={3}
          className="w-full resize-none rounded-[0.7rem] border border-white/8 bg-white/[0.02] px-3 py-2 text-[9px] leading-relaxed text-white/55 placeholder:text-white/18 outline-none focus:border-white/15"
          placeholder="Reflexões, decisões, aprendizados..."
          value={state.notas}
          onChange={e => update({ notas: e.target.value })}
        />
        <button
          onClick={() => { update({ ultimaRevisao: new Date().toLocaleString('pt-BR') }); setSaved(true); setTimeout(() => setSaved(false), 2500) }}
          className="flex items-center gap-2 rounded-[0.5rem] border border-white/8 px-3 py-1.5 text-[8px] text-white/40 hover:text-white/65"
        >
          <Save className="h-3 w-3" />{saved ? 'Registrado ✓' : 'Registrar revisão'}
        </button>
        {state.ultimaRevisao && <p className="text-[6px] text-white/18">Última: {state.ultimaRevisao}</p>}
      </Sec>

    </div>
  )
}
