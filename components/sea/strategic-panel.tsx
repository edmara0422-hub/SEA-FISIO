'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Plus, Trash2, Save, RefreshCw, Brain, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ─── Types ───────────────────────────────────────────────────────────────────

type PhaseId   = 'f1' | 'f2' | 'f3' | 'f4' | 'f5' | 'f6'
type MatStatus = 'nao_iniciado' | 'em_desenvolvimento' | 'implementado' | 'otimizado'
type TndStatus = 'nao_monitorando' | 'estudando' | 'implementado' | 'liderando'

type MatItem  = { status: MatStatus; descricao: string; proximo: string }
type TndItem  = { status: TndStatus; descricao: string; proximo: string }
type KR       = { id: string; descricao: string; progresso: number }
type OKR      = { id: string; objetivo: string; krs: KR[] }

type Metrics = {
  totalUsers: number; activeWeek: number; retention7d: number
  nps: number | null; subsActive: number; loadedAt: string
}

type StrategyState = {
  companyPhase  : PhaseId | ''
  marketPhase   : PhaseId | ''
  marketSignals : Partial<Record<PhaseId, string>>
  sgi           : Partial<Record<string, MatItem>>
  dddm          : Partial<Record<string, MatItem>>
  tendencias    : Partial<Record<string, TndItem>>
  sust          : Partial<Record<string, MatItem>>
  okrs          : OKR[]
  h1: number; h2: number; h3: number
  notas         : string
  ultimaRevisao : string
}

// ─── Static data ─────────────────────────────────────────────────────────────

const PHASES: { id: PhaseId; label: string; sublabel: string; desc: string }[] = [
  { id: 'f1', label: 'F1', sublabel: 'Infra',         desc: 'Infraestrutura básica digital instalada' },
  { id: 'f2', label: 'F2', sublabel: 'Processo',      desc: 'Processos internos digitalizados' },
  { id: 'f3', label: 'F3', sublabel: 'Estratégia',    desc: 'Tecnologia como vantagem competitiva' },
  { id: 'f4', label: 'F4', sublabel: 'Digitização',   desc: 'Dados e produtos digitais ativos' },
  { id: 'f5', label: 'F5', sublabel: 'Digitalização', desc: 'Modelo de negócio digital-first' },
  { id: 'f6', label: 'F6', sublabel: 'Transformação', desc: 'Empresa reinventada pela tecnologia' },
]

const MAT_STATUS: { id: MatStatus; label: string }[] = [
  { id: 'nao_iniciado',      label: 'Não iniciado' },
  { id: 'em_desenvolvimento', label: 'Em desenvolvimento' },
  { id: 'implementado',      label: 'Implementado' },
  { id: 'otimizado',         label: 'Otimizado' },
]

const TND_STATUS: { id: TndStatus; label: string }[] = [
  { id: 'nao_monitorando', label: 'Não monitorando' },
  { id: 'estudando',       label: 'Estudando · Pilotando' },
  { id: 'implementado',    label: 'Implementado' },
  { id: 'liderando',       label: 'Liderando' },
]

const SGI_ITEMS = [
  { id: 'projetos',   emoji: '🏗️', label: 'Estrutura de Projetos',    ph: 'Como está estruturada a gestão de projetos hoje?',               phP: 'Próximo passo concreto para evoluir essa dimensão...' },
  { id: 'processos',  emoji: '⚙️', label: 'Processos',                 ph: 'Como estão os processos internos digitalizados?',                phP: 'O que precisa ser automatizado ou padronizado agora?' },
  { id: 'cultura',    emoji: '🧬', label: 'Cultura',                   ph: 'Como está a cultura de inovação e aprendizado contínuo?',       phP: 'Que ritual ou prática pode ser criado esta semana?' },
  { id: 'resultados', emoji: '📈', label: 'Resultados',                ph: 'Como está a mensuração de resultados e indicadores?',           phP: 'Qual métrica precisa ser visível nos próximos 30 dias?' },
]

const DDDM_ITEMS = [
  { id: 'coleta',       emoji: '💾', label: 'Coleta e Armazenamento',      ph: 'Quais dados são coletados hoje e onde ficam armazenados?',         phP: 'Que dado ainda falta capturar para decisões melhores?' },
  { id: 'analise',      emoji: '🧠', label: 'Análise e Processamento',     ph: 'Como os dados são analisados e processados?',                     phP: 'Que análise automática pode ser implementada esta sprint?' },
  { id: 'visualizacao', emoji: '📊', label: 'Visualização e Comunicação',  ph: 'Como os dados são visualizados e comunicados?',                   phP: 'Que dashboard tornaria as decisões mais rápidas?' },
  { id: 'integracao',   emoji: '🎯', label: 'Integração Estratégica',      ph: 'Como os dados informam as decisões estratégicas hoje?',           phP: 'Qual decisão da próxima semana deve ser data-driven?' },
]

const TEND_ITEMS = [
  { id: 'agentes_ia',   emoji: '🤖', label: 'Agentes de IA Autônomos',          ph: 'Como a IA está sendo usada no SEA hoje?',                         phP: 'Que processo poderia ser executado por um agente autônomo?',       alerta: 'Concorrentes com agentes autônomos vão entregar análises antes de você perguntar.' },
  { id: 'regtech',      emoji: '⚖️', label: 'RegTech e Compliance Automatizado', ph: 'Como o compliance (LGPD, COFFITO) é gerenciado hoje?',            phP: 'Que verificação de conformidade pode ser automatizada?',           alerta: 'Quem não automatiza compliance paga mais e erra mais — especialmente com LGPD evoluindo.' },
  { id: 'ambidestra',   emoji: '🔀', label: 'Inovação Ambidestra',               ph: 'Como H1 (core) e H3 (exploração) estão distribuídos?',            phP: 'Revise a distribuição dos 3 Horizontes nesta sprint.',             alerta: 'Foco só em eficiência = estagnação. Só em inovação = caos sem receita.' },
  { id: 'offline',      emoji: '📡', label: 'Offline-First & Edge',              ph: 'O SEA funciona offline? Em quais cenários críticos?',             phP: 'Mapeie as funcionalidades que precisam funcionar sem conexão na UTI.', alerta: 'UTIs têm conectividade instável — offline-first é diferencial clínico, não só técnico.' },
]

const SUST_ITEMS = [
  { id: 'carbono',          emoji: '🌱', label: 'Pegada de Carbono Digital',   ph: 'Como o SEA minimiza o consumo energético da infraestrutura?',  phP: 'Mapeie o maior consumidor de energia da stack e otimize.' },
  { id: 'offline_esg',      emoji: '♻️', label: 'Offline-First como ESG',       ph: 'Como a arquitetura offline reduz requisições ao servidor?',     phP: 'Documente a economia de CO₂ gerada pelo cache local vs cloud.' },
  { id: 'papel',            emoji: '📄', label: 'Zero Papel na UTI',            ph: 'Quantos prontuários digitais já substituíram papel?',           phP: 'Calcule e publique o impacto ambiental mensalmente.' },
  { id: 'antigreenwashing', emoji: '🔍', label: 'Antigreenwashing',             ph: 'As práticas ESG declaradas têm evidência verificável?',         phP: 'Documente uma prática sustentável com métrica real esta semana.' },
]

const STORAGE_KEY = 'sea-strategy-v3'

const DEFAULT_MAT: MatItem = { status: 'nao_iniciado',    descricao: '', proximo: '' }
const DEFAULT_TND: TndItem = { status: 'nao_monitorando', descricao: '', proximo: '' }

const DEFAULT_STATE: StrategyState = {
  companyPhase: '', marketPhase: '', marketSignals: {},
  sgi: {}, dddm: {}, tendencias: {}, sust: {},
  okrs: [], h1: 70, h2: 20, h3: 10, notas: '', ultimaRevisao: '',
}

function genId() { return Math.random().toString(36).slice(2) }

// ─── Phase railway ────────────────────────────────────────────────────────────

function PhaseRailway({ current, onSelect, title }: { current: PhaseId | ''; onSelect: (id: PhaseId) => void; title: string }) {
  const currentIdx = PHASES.findIndex(p => p.id === current)
  return (
    <div>
      <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/45">{title}</p>
      <div className="overflow-x-auto pb-3">
        <div className="flex min-w-max items-start gap-0">
          {PHASES.map((ph, idx) => {
            const done    = idx < currentIdx
            const active  = ph.id === current
            const future  = idx > currentIdx
            return (
              <div key={ph.id} className="flex items-start">
                {idx > 0 && (
                  <div className={`mt-[1.35rem] h-px w-8 ${done || active ? 'bg-white/35' : 'bg-white/8'}`} />
                )}
                <button onClick={() => onSelect(ph.id)} className={`flex flex-col items-center gap-1 transition-opacity ${future && !active ? 'opacity-40' : ''}`}>
                  {/* Node */}
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all ${
                    active  ? 'border-white/80 bg-white/[0.12] text-white shadow-[0_0_18px_rgba(255,255,255,0.1)]' :
                    done    ? 'border-white/40 bg-white/[0.06] text-white/60' :
                              'border-white/10 bg-transparent text-white/20'
                  }`}>
                    {ph.label}
                  </div>
                  <p className={`text-[8px] font-semibold ${active ? 'text-white/90' : done ? 'text-white/50' : 'text-white/20'}`}>{ph.sublabel}</p>
                  <p className={`text-center text-[7px] leading-snug ${active ? 'text-white/50' : 'text-white/18'}`} style={{ maxWidth: 72 }}>{ph.desc}</p>
                  {active && <span className="mt-0.5 rounded-full border border-white/25 bg-white/[0.08] px-2 py-0.5 text-[6px] font-bold uppercase tracking-wider text-white/80">Atual</span>}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Maturity Item ────────────────────────────────────────────────────────────

function MaturityCard<S extends string>({
  emoji, label, data, statusList, onChange, ph, phP, alerta,
}: {
  emoji: string; label: string
  data: { status: S; descricao: string; proximo: string }
  statusList: { id: S; label: string }[]
  onChange: (patch: Partial<{ status: S; descricao: string; proximo: string }>) => void
  ph: string; phP: string
  alerta?: string
}) {
  const txtCls = 'w-full rounded-[0.6rem] border border-white/8 bg-white/[0.02] px-3 py-2 text-[9px] leading-relaxed text-white/65 placeholder:text-white/20 outline-none focus:border-white/18 resize-none'
  return (
    <div className="rounded-[1rem] border border-white/6 bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg leading-none">{emoji}</span>
        <p className="text-[10px] font-semibold text-white/75">{label}</p>
      </div>
      {/* Status pills */}
      <div className="mb-3 flex flex-wrap gap-1">
        {statusList.map(s => (
          <button key={s.id} onClick={() => onChange({ status: s.id } as Partial<{ status: S; descricao: string; proximo: string }>)}
            className={`rounded-full border px-2.5 py-1 text-[8px] font-medium transition-all ${
              data.status === s.id
                ? 'border-white/30 bg-white/[0.10] text-white/90'
                : 'border-white/6 bg-transparent text-white/30 hover:text-white/55'
            }`}
          >{s.label}</button>
        ))}
      </div>
      {/* Description */}
      <textarea rows={2} className={txtCls} placeholder={ph} value={data.descricao} onChange={e => onChange({ descricao: e.target.value })} />
      {/* Próximo passo */}
      <div className="mt-2">
        <p className="mb-1 text-[7px] uppercase tracking-[0.1em] text-white/25">Próximo passo</p>
        <textarea rows={2} className={txtCls} placeholder={phP} value={data.proximo} onChange={e => onChange({ proximo: e.target.value })} />
      </div>
      {/* Alerta estratégico */}
      {alerta && (
        <p className="mt-2 rounded-[0.5rem] border border-white/5 bg-white/[0.01] px-2 py-1.5 text-[7px] italic leading-relaxed text-white/30">{alerta}</p>
      )}
    </div>
  )
}

// ─── Section header (collapsible, default open) ───────────────────────────────

function SectionHead({ label, sub, open, toggle }: { label: string; sub?: string; open: boolean; toggle: () => void }) {
  return (
    <button onClick={toggle} className="flex w-full items-center justify-between border-b border-white/6 pb-2">
      <div>
        <p className="text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">{label}</p>
        {sub && <p className="text-left text-[8px] text-white/30">{sub}</p>}
      </div>
      {open ? <ChevronUp className="h-3.5 w-3.5 text-white/25" /> : <ChevronDown className="h-3.5 w-3.5 text-white/25" />}
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const EMPTY_METRICS: Metrics = { totalUsers: 0, activeWeek: 0, retention7d: 0, nps: null, subsActive: 0, loadedAt: '' }

export function StrategicPanel() {
  const [state, setState] = useState<StrategyState>(DEFAULT_STATE)
  const [metrics, setMetrics] = useState<Metrics>(EMPTY_METRICS)
  const [loadingM, setLoadingM] = useState(false)
  const [saved, setSaved] = useState(false)

  // All sections open by default
  const [open, setOpen] = useState<Record<string, boolean>>({
    empresa: true, mercado: true, sgi: true, dddm: true,
    tend: true, sust: true, okrs: true, horizontes: true, notas: true,
  })

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE_KEY); if (r) setState(JSON.parse(r)) } catch {}
  }, [])

  function update(patch: Partial<StrategyState>) {
    setState(prev => { const next = { ...prev, ...patch }; localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); return next })
  }

  function toggle(k: string) { setOpen(prev => ({ ...prev, [k]: !prev[k] })) }

  // Load live metrics
  const loadMetrics = useCallback(async () => {
    if (!supabase) return
    setLoadingM(true)
    const now = Date.now(); const DAY = 86400000
    const [{ data: profiles }, { data: subs }, { data: fb }] = await Promise.all([
      supabase.from('profiles').select('id, last_login, role'),
      supabase.from('subscriptions').select('status, user_id'),
      supabase.from('sea_feedback').select('score, type'),
    ])
    const real = (profiles ?? []).filter((p: { role?: string }) => p.role !== 'admin')
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
    const realIds = new Set(real.map((p: { id: string }) => p.id))
    const subsActive = (subs ?? []).filter((s: { user_id: string; status: string }) => realIds.has(s.user_id) && s.status === 'active').length
    setMetrics({ totalUsers: total, activeWeek: week, retention7d: ret7, nps, subsActive, loadedAt: new Date().toLocaleTimeString('pt-BR') })
    setLoadingM(false)
  }, [])

  useEffect(() => { loadMetrics() }, [loadMetrics])

  // Helpers for nested state
  function getMatItem(section: 'sgi' | 'dddm' | 'sust', id: string): MatItem {
    return (state[section][id] as MatItem | undefined) ?? { ...DEFAULT_MAT }
  }
  function setMatItem(section: 'sgi' | 'dddm' | 'sust', id: string, patch: Partial<MatItem>) {
    update({ [section]: { ...state[section], [id]: { ...(getMatItem(section, id)), ...patch } } })
  }
  function getTndItem(id: string): TndItem {
    return (state.tendencias[id] as TndItem | undefined) ?? { ...DEFAULT_TND }
  }
  function setTndItem(id: string, patch: Partial<TndItem>) {
    update({ tendencias: { ...state.tendencias, [id]: { ...getTndItem(id), ...patch } } })
  }

  // OKR helpers
  function addOKR() { update({ okrs: [...state.okrs, { id: genId(), objetivo: '', krs: [] }] }) }
  function updateOKR(id: string, obj: string) { update({ okrs: state.okrs.map(o => o.id === id ? { ...o, objetivo: obj } : o) }) }
  function removeOKR(id: string) { update({ okrs: state.okrs.filter(o => o.id !== id) }) }
  function addKR(oid: string) { update({ okrs: state.okrs.map(o => o.id === oid ? { ...o, krs: [...o.krs, { id: genId(), descricao: '', progresso: 0 }] } : o) }) }
  function updateKR(oid: string, kid: string, p: Partial<KR>) { update({ okrs: state.okrs.map(o => o.id === oid ? { ...o, krs: o.krs.map(k => k.id === kid ? { ...k, ...p } : k) } : o) })  }
  function removeKR(oid: string, kid: string) { update({ okrs: state.okrs.map(o => o.id === oid ? { ...o, krs: o.krs.filter(k => k.id !== kid) } : o) }) }

  // Gap analysis
  const gapInfo = useMemo(() => {
    if (!state.companyPhase || !state.marketPhase) return null
    const ci = PHASES.findIndex(p => p.id === state.companyPhase)
    const mi = PHASES.findIndex(p => p.id === state.marketPhase)
    const gap = ci - mi
    if (gap > 0) return { txt: `SEA ${gap === 1 ? '1 fase' : `${gap} fases`} à frente do mercado — vantagem competitiva estrutural. Velocidade de execução define quem lidera.`, color: 'text-white/60' }
    if (gap === 0) return { txt: 'SEA alinhado com o mercado — janela de oportunidade máxima. Quem executa mais rápido captura o segmento.', color: 'text-white/60' }
    return { txt: `SEA ${Math.abs(gap)} fase(s) atrás do mercado — gap de maturidade. Prioridade: fechar esse gap antes de expandir.`, color: 'text-white/50' }
  }, [state.companyPhase, state.marketPhase])

  // Reflexão do dia
  const reflexao = useMemo(() => {
    const phase = PHASES.find(p => p.id === state.companyPhase)
    const acoes: string[] = []
    if (!state.companyPhase) {
      acoes.push('Defina em qual fase de maturidade digital o SEA está hoje — isso orienta todas as demais decisões estratégicas.')
    } else {
      if (state.companyPhase === 'f1') {
        if (metrics.totalUsers === 0) acoes.push('Prioridade máxima: conseguir o primeiro usuário real utilizando o SEA no trabalho.')
        else acoes.push(`${metrics.totalUsers} usuário(s). Na F1, o objetivo é validar que a infraestrutura suporta o uso real.`)
      }
      if (state.companyPhase === 'f2') acoes.push('F2 exige processos digitalizados e replicáveis. Mapeie o fluxo clínico do fisioterapeuta no SEA e remova fricções.')
      if (state.companyPhase === 'f3') acoes.push('F3 é sobre diferenciação. Identifique: o que o SEA faz que nenhuma alternativa consegue replicar em 6 meses?')
      if (state.companyPhase === 'f4') acoes.push('F4 exige dados ativos. Quais decisões de produto você toma com dados hoje? Quais ainda são baseadas em intuição?')
      if (state.companyPhase === 'f5') acoes.push('F5 é digital-first. O SEA gera receita recorrente previsível? O modelo de negócio funciona sem operação manual?')
      if (state.companyPhase === 'f6') acoes.push('F6 é reinvenção. A empresa foi transformada pela tecnologia — o produto e o modelo de negócio são nativamente digitais.')
    }
    const okrAvg = (() => { const krs = state.okrs.flatMap(o => o.krs); return krs.length > 0 ? Math.round(krs.reduce((s, k) => s + k.progresso, 0) / krs.length) : null })()
    if (state.okrs.length === 0) acoes.push('Nenhum OKR definido. Defina 1 objetivo com 2-3 Key Results mensuráveis para o ciclo atual.')
    else if (okrAvg !== null && okrAvg < 30) acoes.push(`OKRs em ${okrAvg}% — revise o que está bloqueando e ajuste o plano desta semana.`)
    else if (okrAvg !== null && okrAvg >= 70) acoes.push(`OKRs em ${okrAvg}% — no caminho certo. Documente o que está funcionando.`)
    if (gapInfo) acoes.push(gapInfo.txt)
    if (new Date().getDay() === 1) acoes.push('Segunda-feira: revise OKRs e defina as 3 prioridades críticas antes de qualquer outra coisa.')
    if (new Date().getDay() === 5) acoes.push('Sexta-feira: registre o aprendizado mais importante desta semana.')
    return { phase: phase?.sublabel ?? 'Fase não definida', acoes: acoes.slice(0, 4) }
  }, [state.companyPhase, state.okrs, metrics.totalUsers, gapInfo])

  const inputCls = 'w-full rounded-[0.6rem] border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[9px] text-white placeholder:text-white/25 outline-none focus:border-white/20'

  return (
    <div className="space-y-6">

      {/* ── HEADER — live metrics + reflexão ─────────────────────────────── */}
      <div className="rounded-[1rem] border border-white/6 bg-white/[0.02] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold text-white/75">Inteligência Estratégica SEA</p>
            <p className="text-[8px] text-white/35">Todo dia: diagnosticar · decidir · executar · aprender</p>
          </div>
          <button onClick={loadMetrics} disabled={loadingM} className="flex items-center gap-1 rounded-[0.5rem] border border-white/8 px-2 py-1 text-[8px] text-white/35 hover:text-white/55">
            <RefreshCw className={`h-3 w-3 ${loadingM ? 'animate-spin' : ''}`} /> Atualizar
          </button>
        </div>
        <div className="mb-3 grid grid-cols-4 gap-1.5">
          {[
            { l: 'Usuários', v: metrics.totalUsers },
            { l: 'Ativos/sem', v: metrics.activeWeek },
            { l: 'Retenção 7d', v: `${metrics.retention7d}%` },
            { l: 'NPS', v: metrics.nps ?? '--' },
          ].map(m => (
            <div key={m.l} className="rounded-[0.8rem] border border-white/5 bg-white/[0.02] px-2 py-2 text-center">
              <p className="text-[13px] font-bold tabular-nums text-white/80">{m.v}</p>
              <p className="text-[7px] text-white/35">{m.l}</p>
            </div>
          ))}
        </div>
        {/* Reflexão */}
        <div className="rounded-[0.8rem] border border-white/5 bg-white/[0.015] p-3">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5 text-white/40" />
            <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-white/40">Reflexão do dia · {reflexao.phase}</p>
            <span className="text-[7px] text-white/20">auto</span>
          </div>
          <div className="space-y-1">
            {reflexao.acoes.map((a, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white/12 text-[7px] font-bold text-white/35">{i + 1}</span>
                <p className="text-[8px] leading-relaxed text-white/50">{a}</p>
              </div>
            ))}
          </div>
        </div>
        {metrics.loadedAt && <p className="mt-2 text-[6px] text-white/20">Dados às {metrics.loadedAt}</p>}
        {state.ultimaRevisao && <p className="mt-0.5 text-[6px] text-white/18">Última revisão: {state.ultimaRevisao}</p>}
      </div>

      {/* ── TRILHO DA EMPRESA ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHead label="Trilho da Empresa" sub="Maturidade digital do SEA — selecione a fase atual" open={!!open.empresa} toggle={() => toggle('empresa')} />
        {open.empresa && (
          <div className="space-y-3">
            <PhaseRailway current={state.companyPhase} onSelect={id => update({ companyPhase: id })} title="" />
            {state.companyPhase && (
              <div className="rounded-[0.8rem] border border-white/6 bg-white/[0.015] px-4 py-3">
                <p className="text-[8px] font-semibold text-white/55">{PHASES.find(p => p.id === state.companyPhase)?.label} · {PHASES.find(p => p.id === state.companyPhase)?.sublabel}</p>
                <p className="mt-0.5 text-[8px] leading-relaxed text-white/40">{PHASES.find(p => p.id === state.companyPhase)?.desc}</p>
                {PHASES.findIndex(p => p.id === state.companyPhase) < 5 && (
                  <div className="mt-2 flex items-center gap-1">
                    <ArrowRight className="h-3 w-3 text-white/25" />
                    <p className="text-[8px] text-white/35">Próxima fase: <span className="text-white/50">{PHASES[PHASES.findIndex(p => p.id === state.companyPhase) + 1]?.sublabel}</span> — {PHASES[PHASES.findIndex(p => p.id === state.companyPhase) + 1]?.desc}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── TRILHO DO MERCADO ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHead label="Trilho do Mercado" sub="Maturidade digital observada no mercado de fisioterapia intensivista" open={!!open.mercado} toggle={() => toggle('mercado')} />
        {open.mercado && (
          <div className="space-y-3">
            <PhaseRailway current={state.marketPhase} onSelect={id => update({ marketPhase: id })} title="" />

            {/* Sinais observados por fase */}
            <div className="space-y-2">
              <p className="text-[8px] uppercase tracking-[0.1em] text-white/30">Sinais observados no mercado</p>
              {PHASES.map(ph => (
                <div key={ph.id} className={`rounded-[0.8rem] border px-3 py-2.5 transition-all ${state.marketPhase === ph.id ? 'border-white/12 bg-white/[0.025]' : 'border-white/4 bg-transparent'}`}>
                  <p className="mb-1.5 text-[8px] font-semibold text-white/50">{ph.label} · {ph.sublabel}</p>
                  <textarea
                    rows={2}
                    className="w-full rounded-[0.5rem] border border-white/6 bg-white/[0.02] px-2 py-1.5 text-[8px] leading-relaxed text-white/60 placeholder:text-white/18 outline-none focus:border-white/15 resize-none"
                    placeholder={`O que você observa no mercado na fase ${ph.sublabel}?`}
                    value={state.marketSignals[ph.id] ?? ''}
                    onChange={e => update({ marketSignals: { ...state.marketSignals, [ph.id]: e.target.value } })}
                  />
                </div>
              ))}
            </div>

            {gapInfo && (
              <div className="rounded-[0.8rem] border border-white/8 bg-white/[0.02] px-4 py-3">
                <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-white/35">Análise de Gap</p>
                <p className={`mt-1 text-[9px] leading-relaxed ${gapInfo.color}`}>{gapInfo.txt}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── SGI + TD ─────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHead label="SGI + TD — Maturidade de Execução" sub="Sistema de Gestão da Inovação + Transformação Digital" open={!!open.sgi} toggle={() => toggle('sgi')} />
        {open.sgi && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {SGI_ITEMS.map(item => (
              <MaturityCard<MatStatus>
                key={item.id}
                emoji={item.emoji} label={item.label}
                data={getMatItem('sgi', item.id)}
                statusList={MAT_STATUS}
                onChange={patch => setMatItem('sgi', item.id, patch)}
                ph={item.ph} phP={item.phP}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── DDDM ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHead label="DDDM — Decisão Baseada em Dados" sub="Data-Driven Decision Making — 4 dimensões" open={!!open.dddm} toggle={() => toggle('dddm')} />
        {open.dddm && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {DDDM_ITEMS.map(item => (
              <MaturityCard<MatStatus>
                key={item.id}
                emoji={item.emoji} label={item.label}
                data={getMatItem('dddm', item.id)}
                statusList={MAT_STATUS}
                onChange={patch => setMatItem('dddm', item.id, patch)}
                ph={item.ph} phP={item.phP}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── TENDÊNCIAS 2025 ───────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHead label="Tendências 2025 — Watchlist" sub="Monitore, estude, implemente ou lidere" open={!!open.tend} toggle={() => toggle('tend')} />
        {open.tend && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {TEND_ITEMS.map(item => (
              <MaturityCard<TndStatus>
                key={item.id}
                emoji={item.emoji} label={item.label}
                data={getTndItem(item.id)}
                statusList={TND_STATUS}
                onChange={patch => setTndItem(item.id, patch)}
                ph={item.ph} phP={item.phP}
                alerta={item.alerta}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── SUSTENTABILIDADE DIGITAL ─────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHead label="Sustentabilidade Digital" sub="ESG nativo — práticas verificáveis, não selos" open={!!open.sust} toggle={() => toggle('sust')} />
        {open.sust && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {SUST_ITEMS.map(item => (
              <MaturityCard<MatStatus>
                key={item.id}
                emoji={item.emoji} label={item.label}
                data={getMatItem('sust', item.id)}
                statusList={MAT_STATUS}
                onChange={patch => setMatItem('sust', item.id, patch)}
                ph={item.ph} phP={item.phP}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── OKRs ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHead label="OKRs do Ciclo" sub="Objetivo + Key Results mensuráveis" open={!!open.okrs} toggle={() => toggle('okrs')} />
        {open.okrs && (
          <div className="space-y-3">
            <p className="text-[8px] leading-relaxed text-white/35">Objetivo = o que alcançar. Key Result = como medir. Atingir 70% já é sucesso — OKRs são ambiciosos por definição.</p>
            {state.okrs.map(okr => (
              <div key={okr.id} className="rounded-[0.9rem] border border-white/6 bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <input className={inputCls + ' flex-1'} placeholder="Objetivo — o que quero alcançar..." value={okr.objetivo} onChange={e => updateOKR(okr.id, e.target.value)} />
                  <button onClick={() => removeOKR(okr.id)} className="text-white/20 hover:text-red-400/70"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <div className="space-y-2">
                  {okr.krs.map(kr => (
                    <div key={kr.id} className="flex items-center gap-2">
                      <span className="text-[8px] text-white/25">KR</span>
                      <input className={inputCls + ' flex-1'} placeholder="Key result mensurável..." value={kr.descricao} onChange={e => updateKR(okr.id, kr.id, { descricao: e.target.value })} />
                      <div className="flex items-center gap-1">
                        <input type="range" min={0} max={100} value={kr.progresso} onChange={e => updateKR(okr.id, kr.id, { progresso: Number(e.target.value) })} className="w-16 accent-white/50" />
                        <span className="w-8 text-right text-[8px] text-white/40">{kr.progresso}%</span>
                      </div>
                      <button onClick={() => removeKR(okr.id, kr.id)} className="text-white/15 hover:text-red-400/70"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
                <button onClick={() => addKR(okr.id)} className="mt-2 flex items-center gap-1 text-[8px] text-white/25 hover:text-white/50"><Plus className="h-3 w-3" /> Key Result</button>
              </div>
            ))}
            <button onClick={addOKR} className="flex w-full items-center justify-center gap-1 rounded-[0.8rem] border border-white/8 py-2.5 text-[9px] text-white/35 hover:text-white/55">
              <Plus className="h-3.5 w-3.5" /> Objetivo
            </button>
          </div>
        )}
      </div>

      {/* ── 3 HORIZONTES ─────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHead label="Três Horizontes" sub="Distribuição de esforço: Core · Adjacente · Disruptivo" open={!!open.horizontes} toggle={() => toggle('horizontes')} />
        {open.horizontes && (
          <div className="space-y-4">
            {[
              { key: 'h1' as const, label: 'H1 · Core', desc: 'Prontuário, calculadoras, conteúdo principal. Inovações incrementais.' },
              { key: 'h2' as const, label: 'H2 · Adjacente', desc: 'Novos perfis de usuário, parceiros, funcionalidades complementares.' },
              { key: 'h3' as const, label: 'H3 · Disruptivo', desc: 'IA avançada, novos mercados, plataforma B2B, expansão LatAm.' },
            ].map(h => (
              <div key={h.key}>
                <div className="mb-1 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-semibold text-white/65">{h.label}</p>
                    <p className="text-[8px] text-white/35">{h.desc}</p>
                  </div>
                  <span className="text-[10px] font-bold text-white/75">{state[h.key]}%</span>
                </div>
                <input type="range" min={0} max={100} value={state[h.key]} onChange={e => update({ [h.key]: Number(e.target.value) })} className="w-full accent-white/60" />
              </div>
            ))}
            <p className={`text-[8px] ${state.h1 + state.h2 + state.h3 === 100 ? 'text-white/45' : 'text-red-400/60'}`}>
              Soma: {state.h1 + state.h2 + state.h3}% {state.h1 + state.h2 + state.h3 !== 100 ? '— deve somar 100%' : '✓'}
            </p>
          </div>
        )}
      </div>

      {/* ── NOTAS + SALVAR ────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHead label="Notas do Ciclo" sub="Reflexões, decisões, aprendizados" open={!!open.notas} toggle={() => toggle('notas')} />
        {open.notas && (
          <div className="space-y-2">
            <textarea
              rows={4}
              className="w-full rounded-[0.8rem] border border-white/8 bg-white/[0.02] px-3 py-2.5 text-[9px] leading-relaxed text-white/60 placeholder:text-white/20 outline-none focus:border-white/15 resize-none"
              placeholder="Reflexões, decisões, próximos passos, aprendizados desta semana..."
              value={state.notas}
              onChange={e => update({ notas: e.target.value })}
            />
            <button
              onClick={() => { update({ ultimaRevisao: new Date().toLocaleString('pt-BR') }); setSaved(true); setTimeout(() => setSaved(false), 2500) }}
              className="flex items-center gap-2 rounded-[0.6rem] border border-white/10 bg-white/[0.04] px-4 py-2 text-[9px] text-white/60 hover:text-white/80"
            >
              <Save className="h-3.5 w-3.5" />
              {saved ? 'Revisão registrada ✓' : 'Registrar revisão'}
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
