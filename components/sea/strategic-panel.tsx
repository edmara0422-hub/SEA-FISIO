'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2, Save } from 'lucide-react'

type FaseOption = 'digitizacao' | 'digitalizacao' | 'transformacao' | ''
type InovTipo = 'produto-servico' | 'organizacional' | 'processo' | 'modelo-negocio' | ''
type InovIntensidade = 'rotina' | 'radical' | 'disruptiva' | 'arquitetonica' | ''
type HypePhase = 'gatilho' | 'pico' | 'vale' | 'encosta' | 'platô' | ''
type FunilPhase = 'ffe' | 'triagem' | 'desenvolvimento' | 'decisao' | 'escala' | ''

type KR = { id: string; descricao: string; progresso: number }
type OKR = { id: string; objetivo: string; krs: KR[] }

type StrategyState = {
  faseAtual: FaseOption
  faseMercado: FaseOption
  tipoInovacao: InovTipo
  intensidade: InovIntensidade
  trl: number
  hype: HypePhase
  funil: FunilPhase
  h1: number
  h2: number
  h3: number
  okrs: OKR[]
  notas: string
  ultimaRevisao: string
}

const STORAGE_KEY = 'sea-strategy-state'

const DEFAULT_STATE: StrategyState = {
  faseAtual: '',
  faseMercado: '',
  tipoInovacao: '',
  intensidade: '',
  trl: 1,
  hype: '',
  funil: '',
  h1: 70,
  h2: 20,
  h3: 10,
  okrs: [],
  notas: '',
  ultimaRevisao: '',
}

const FASE_LABELS: Record<string, string> = {
  digitizacao: 'Fase 1 · Digitização — Infra',
  digitalizacao: 'Fase 2 · Digitalização — Processo',
  transformacao: 'Fase 3 · Transformação — Estratégia',
}

const FASE_GAP: Record<string, Record<string, string>> = {
  digitizacao: { digitizacao: 'Alinhado', digitalizacao: '1 fase de gap', transformacao: '2 fases de gap — risco alto' },
  digitalizacao: { digitizacao: 'À frente do mercado', digitalizacao: 'Alinhado', transformacao: '1 fase de gap' },
  transformacao: { digitizacao: '2 fases à frente', digitalizacao: '1 fase à frente', transformacao: 'Alinhado — liderança' },
}

const HYPE_LABELS: Record<string, string> = {
  gatilho: '1 · Gatilho Tecnológico',
  pico: '2 · Pico de Expectativas Infladas',
  vale: '3 · Vale da Desilusão',
  encosta: '4 · Encosta da Iluminação',
  'platô': '5 · Platô de Produtividade',
}

const FUNIL_LABELS: Record<string, string> = {
  ffe: '1 · Fuzzy Front-End — Ideação',
  triagem: '2 · Stage Gate 1 — Triagem',
  desenvolvimento: '3 · Desenvolvimento e Validação',
  decisao: '4 · Stage Gate 2 — Decisão Final',
  escala: '5 · Lançamento e Escala',
}

function genId() { return Math.random().toString(36).slice(2) }

function SectionHeader({ label, open, toggle }: { label: string; open: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="flex w-full items-center justify-between rounded-[0.7rem] border border-white/6 bg-white/[0.02] px-3 py-2 text-left"
    >
      <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/55">{label}</p>
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
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            className={`rounded-full border px-2 py-0.5 text-[7px] font-medium transition-colors ${
              value === o.v
                ? 'border-white/25 bg-white/[0.08] text-white/80'
                : 'border-white/6 bg-transparent text-white/35 hover:text-white/55'
            }`}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  )
}

export function StrategicPanel() {
  const [state, setState] = useState<StrategyState>(DEFAULT_STATE)
  const [open, setOpen] = useState<Record<string, boolean>>({ fase: true, okrs: false, horizontes: false, funil: false, ref: false })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setState(JSON.parse(raw))
    } catch { /* ignore */ }
  }, [])

  function update(patch: Partial<StrategyState>) {
    setState(prev => {
      const next = { ...prev, ...patch }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  function saveWithTimestamp() {
    const now = new Date().toLocaleString('pt-BR')
    update({ ultimaRevisao: now })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function toggle(k: string) {
    setOpen(prev => ({ ...prev, [k]: !prev[k] }))
  }

  const gap = state.faseAtual && state.faseMercado
    ? FASE_GAP[state.faseAtual]?.[state.faseMercado] ?? ''
    : ''

  // OKR helpers
  function addOKR() {
    update({ okrs: [...state.okrs, { id: genId(), objetivo: '', krs: [] }] })
  }
  function updateOKR(id: string, objetivo: string) {
    update({ okrs: state.okrs.map(o => o.id === id ? { ...o, objetivo } : o) })
  }
  function removeOKR(id: string) {
    update({ okrs: state.okrs.filter(o => o.id !== id) })
  }
  function addKR(okrId: string) {
    update({ okrs: state.okrs.map(o => o.id === okrId ? { ...o, krs: [...o.krs, { id: genId(), descricao: '', progresso: 0 }] } : o) })
  }
  function updateKR(okrId: string, krId: string, patch: Partial<KR>) {
    update({ okrs: state.okrs.map(o => o.id === okrId ? { ...o, krs: o.krs.map(k => k.id === krId ? { ...k, ...patch } : k) } : o) })
  }
  function removeKR(okrId: string, krId: string) {
    update({ okrs: state.okrs.map(o => o.id === okrId ? { ...o, krs: o.krs.filter(k => k.id !== krId) } : o) })
  }

  const inputCls = 'w-full rounded-[0.5rem] border border-white/10 bg-white/[0.03] px-2 py-1 text-[9px] text-white placeholder:text-white/25 outline-none focus:border-white/20'

  return (
    <div className="space-y-2">

      {/* Cabeçalho */}
      <div className="rounded-[1rem] border border-white/6 bg-white/[0.02] px-4 py-4">
        <p className="mb-1 text-[9px] font-semibold text-white/70">A pergunta que separa quem sobrevive de quem lidera:</p>
        <p className="text-[8px] leading-relaxed text-white/45">
          Em qual fase estamos hoje — Digitização · Digitalização · Transformação?
          Em qual fase o mercado ao redor já chegou?
          A diferença entre as duas respostas é o gap que precisa ser fechado.
        </p>
        {state.ultimaRevisao && (
          <p className="mt-2 text-[7px] text-white/25">Última revisão: {state.ultimaRevisao}</p>
        )}
      </div>

      {/* ── 1. DIAGNÓSTICO DE FASE ── */}
      <SectionHeader label="1 · Diagnóstico de Fase" open={!!open.fase} toggle={() => toggle('fase')} />
      {open.fase && (
        <div className="space-y-3 rounded-[0.8rem] border border-white/4 bg-white/[0.01] px-3 py-3">
          <Sel
            label="Onde o SEA está hoje"
            value={state.faseAtual}
            options={[
              { v: 'digitizacao', l: 'Fase 1 · Digitização' },
              { v: 'digitalizacao', l: 'Fase 2 · Digitalização' },
              { v: 'transformacao', l: 'Fase 3 · Transformação' },
            ]}
            onChange={v => update({ faseAtual: v as FaseOption })}
          />
          <Sel
            label="Onde o mercado está"
            value={state.faseMercado}
            options={[
              { v: 'digitizacao', l: 'Fase 1 · Digitização' },
              { v: 'digitalizacao', l: 'Fase 2 · Digitalização' },
              { v: 'transformacao', l: 'Fase 3 · Transformação' },
            ]}
            onChange={v => update({ faseMercado: v as FaseOption })}
          />
          {gap && (
            <div className="rounded-[0.6rem] border border-white/8 bg-white/[0.03] px-3 py-2">
              <p className="text-[7px] uppercase tracking-[0.1em] text-white/30">Gap identificado</p>
              <p className="mt-0.5 text-[9px] font-semibold text-white/70">{gap}</p>
              {state.faseAtual && state.faseMercado && (
                <p className="mt-0.5 text-[7px] text-white/35">
                  {FASE_LABELS[state.faseAtual]} → Mercado: {FASE_LABELS[state.faseMercado]}
                </p>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Sel
              label="Tipo de Inovação"
              value={state.tipoInovacao}
              options={[
                { v: 'produto-servico', l: 'Produto-Serviço' },
                { v: 'organizacional', l: 'Organizacional' },
                { v: 'processo', l: 'Processo' },
                { v: 'modelo-negocio', l: 'Modelo de Negócio' },
              ]}
              onChange={v => update({ tipoInovacao: v as InovTipo })}
            />
            <Sel
              label="Intensidade"
              value={state.intensidade}
              options={[
                { v: 'rotina', l: 'Rotina' },
                { v: 'radical', l: 'Radical' },
                { v: 'disruptiva', l: 'Disruptiva' },
                { v: 'arquitetonica', l: 'Arquitetônica' },
              ]}
              onChange={v => update({ intensidade: v as InovIntensidade })}
            />
          </div>
        </div>
      )}

      {/* ── 2. OKRs ── */}
      <SectionHeader label="2 · OKRs do Ciclo" open={!!open.okrs} toggle={() => toggle('okrs')} />
      {open.okrs && (
        <div className="space-y-3 rounded-[0.8rem] border border-white/4 bg-white/[0.01] px-3 py-3">
          <p className="text-[7px] leading-relaxed text-white/30">
            Objetivo = o que quero alcançar. Key Result = como vou medir. Atingir 70% já é sucesso.
          </p>
          {state.okrs.map(okr => (
            <div key={okr.id} className="rounded-[0.7rem] border border-white/6 bg-white/[0.02] p-3">
              <div className="mb-2 flex items-center gap-2">
                <input
                  className={inputCls + ' flex-1'}
                  placeholder="Objetivo — o que quero alcançar..."
                  value={okr.objetivo}
                  onChange={e => updateOKR(okr.id, e.target.value)}
                />
                <button onClick={() => removeOKR(okr.id)} className="text-white/20 hover:text-red-400">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-1.5">
                {okr.krs.map(kr => (
                  <div key={kr.id} className="flex items-center gap-2">
                    <span className="text-[7px] text-white/25">KR</span>
                    <input
                      className={inputCls + ' flex-1'}
                      placeholder="Key result mensurável..."
                      value={kr.descricao}
                      onChange={e => updateKR(okr.id, kr.id, { descricao: e.target.value })}
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="range" min={0} max={100} value={kr.progresso}
                        onChange={e => updateKR(okr.id, kr.id, { progresso: Number(e.target.value) })}
                        className="w-16 accent-white/50"
                      />
                      <span className="w-6 text-right text-[7px] text-white/40">{kr.progresso}%</span>
                    </div>
                    <button onClick={() => removeKR(okr.id, kr.id)} className="text-white/15 hover:text-red-400">
                      <Trash2 className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addKR(okr.id)}
                className="mt-2 flex items-center gap-1 text-[7px] text-white/25 hover:text-white/50"
              >
                <Plus className="h-2.5 w-2.5" /> Key Result
              </button>
            </div>
          ))}
          <button
            onClick={addOKR}
            className="flex w-full items-center justify-center gap-1 rounded-[0.7rem] border border-white/8 py-2 text-[8px] text-white/35 hover:text-white/55"
          >
            <Plus className="h-3 w-3" /> Objetivo
          </button>
        </div>
      )}

      {/* ── 3. TRÊS HORIZONTES ── */}
      <SectionHeader label="3 · Três Horizontes" open={!!open.horizontes} toggle={() => toggle('horizontes')} />
      {open.horizontes && (
        <div className="space-y-3 rounded-[0.8rem] border border-white/4 bg-white/[0.01] px-3 py-3">
          <p className="text-[7px] leading-relaxed text-white/30">
            Distribuição de esforço entre manter o que funciona, expandir para adjacências e explorar o disruptivo.
          </p>
          {[
            { key: 'h1' as const, label: 'H1 · Core — manter e melhorar', desc: 'Principais produtos e serviços. Inovações incrementais.' },
            { key: 'h2' as const, label: 'H2 · Adjacente — expandir', desc: 'Novos canais, novos clientes, mesma tecnologia.' },
            { key: 'h3' as const, label: 'H3 · Disruptivo — explorar', desc: 'Novos mercados. Risco alto, retorno exponencial.' },
          ].map(h => (
            <div key={h.key}>
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[8px] font-medium text-white/55">{h.label}</p>
                <span className="text-[8px] font-bold text-white/70">{state[h.key]}%</span>
              </div>
              <p className="mb-1.5 text-[7px] text-white/30">{h.desc}</p>
              <input
                type="range" min={0} max={100} value={state[h.key]}
                onChange={e => update({ [h.key]: Number(e.target.value) })}
                className="w-full accent-white/50"
              />
            </div>
          ))}
          <div className="rounded-[0.6rem] border border-white/6 bg-white/[0.02] px-3 py-2">
            <p className="text-[7px] text-white/30">
              Soma atual: <span className={state.h1 + state.h2 + state.h3 === 100 ? 'text-white/60' : 'text-red-400/70'}>
                {state.h1 + state.h2 + state.h3}%
              </span>
              {state.h1 + state.h2 + state.h3 !== 100 && ' — ajuste para somar 100%'}
            </p>
          </div>
        </div>
      )}

      {/* ── 4. FUNIL + TRL + HYPE ── */}
      <SectionHeader label="4 · Funil · TRL · Hype Cycle" open={!!open.funil} toggle={() => toggle('funil')} />
      {open.funil && (
        <div className="space-y-3 rounded-[0.8rem] border border-white/4 bg-white/[0.01] px-3 py-3">
          <Sel
            label="Estágio no Funil de Inovação"
            value={state.funil}
            options={Object.entries(FUNIL_LABELS).map(([v, l]) => ({ v, l }))}
            onChange={v => update({ funil: v as FunilPhase })}
          />
          <div>
            <div className="mb-1 flex items-center justify-between">
              <p className="text-[7px] uppercase tracking-[0.12em] text-white/35">TRL — Maturidade Tecnológica (NASA)</p>
              <span className="text-[8px] font-bold text-white/70">Nível {state.trl}</span>
            </div>
            <input
              type="range" min={1} max={9} value={state.trl}
              onChange={e => update({ trl: Number(e.target.value) })}
              className="w-full accent-white/50"
            />
            <div className="mt-1 flex justify-between text-[6px] text-white/20">
              <span>1 · Conceito</span>
              <span>5 · Validado</span>
              <span>9 · Mercado</span>
            </div>
          </div>
          <Sel
            label="Posição no Hype Cycle (Gartner)"
            value={state.hype}
            options={Object.entries(HYPE_LABELS).map(([v, l]) => ({ v, l }))}
            onChange={v => update({ hype: v as HypePhase })}
          />
        </div>
      )}

      {/* ── 5. FRAMEWORKS DE REFERÊNCIA ── */}
      <SectionHeader label="5 · Frameworks de Referência" open={!!open.ref} toggle={() => toggle('ref')} />
      {open.ref && (
        <div className="space-y-2 rounded-[0.8rem] border border-white/4 bg-white/[0.01] px-3 py-3">
          {[
            {
              title: 'OKRs (Google · Nubank · iFood)',
              body: 'Objetivo = o que quero alcançar. Key Results = como vou medir. Atingir 70% já é sucesso. OKRs são ambiciosos por definição — diferente de KPIs tradicionais.',
            },
            {
              title: 'Design Sprint (Google Ventures · 5 dias)',
              body: 'Segunda: mapear o problema. Terça: desenhar soluções. Quarta: decidir a melhor. Quinta: prototipar. Sexta: testar com usuários. Valida ideias sem construir produto.',
            },
            {
              title: 'Agile / Scrum',
              body: 'Não é metodologia de TI — é cultura organizacional. Ciclos curtos (sprints de 2 semanas), entrega contínua, feedback do cliente a cada ciclo. Squads autônomos de 6-8 pessoas.',
            },
            {
              title: 'DDDM — Decisão Baseada em Dados',
              body: '4 pilares: Coleta e Armazenamento · Análise e Processamento · Visualização e Comunicação · Integração Estratégica. A tecnologia sozinha não basta — precisa de cultura de dados.',
            },
            {
              title: 'COBIT · ISO/IEC 38500 · ITIL 4',
              body: 'COBIT: referência global para governança de TI — conecta objetivos de negócio às metas de tecnologia. ISO 38500: princípios para dirigentes. ITIL 4: entrega tática e operacional com IA e cloud.',
            },
            {
              title: 'TRL (NASA · 1974) — 9 Níveis',
              body: 'Mede maturidade tecnológica de 1 (conceito básico) a 9 (sistema provado em operação). Quanto mais baixo o TRL, maiores as incertezas. Usado por agentes de fomento para alocar recursos.',
            },
            {
              title: 'Hype Cycle (Gartner)',
              body: '5 fases: Gatilho → Pico de Expectativas → Vale da Desilusão → Encosta da Iluminação → Platô de Produtividade. Objetivo: chegar à Encosta antes dos concorrentes com casos reais de impacto.',
            },
            {
              title: 'Inovação Ambidestra',
              body: 'Manter eficiência operacional (H1) enquanto explora novas fronteiras (H3). O maior desafio: fazer os dois ao mesmo tempo sem que um sabote o outro.',
            },
          ].map(f => (
            <div key={f.title} className="rounded-[0.7rem] border border-white/5 bg-white/[0.015] px-3 py-2.5">
              <p className="mb-1 text-[8px] font-semibold text-white/60">{f.title}</p>
              <p className="text-[7px] leading-relaxed text-white/35">{f.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Notas + Salvar ── */}
      <div className="space-y-2 rounded-[0.8rem] border border-white/4 bg-white/[0.01] px-3 py-3">
        <p className="text-[7px] uppercase tracking-[0.12em] text-white/30">Notas do ciclo</p>
        <textarea
          className={inputCls + ' min-h-[4rem] resize-none'}
          placeholder="Reflexões, decisões, próximos passos..."
          value={state.notas}
          onChange={e => update({ notas: e.target.value })}
        />
        <button
          onClick={saveWithTimestamp}
          className="flex items-center gap-1.5 rounded-[0.6rem] border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[8px] text-white/60 hover:text-white/80"
        >
          <Save className="h-3 w-3" />
          {saved ? 'Revisão registrada' : 'Registrar revisão'}
        </button>
      </div>

    </div>
  )
}
