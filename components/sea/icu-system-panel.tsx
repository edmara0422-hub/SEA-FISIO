'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { ICU_REFERENCE_SYSTEMS } from '@/lib/generated/icu-reference-data'

type ClinicalSystem = (typeof ICU_REFERENCE_SYSTEMS)[number]
type ClinicalProblem = ClinicalSystem['problems'][number] & { block?: string; goals?: readonly string[]; assess?: readonly string[]; interv?: readonly string[]; phases?: readonly { timeframe: string; interv?: readonly string[] }[] }

function SystemGlyph({ path, color }: { path: string; color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" className="h-3 w-3 shrink-0">
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SectionList({
  title,
  items,
  accent,
}: {
  title: string
  items?: readonly string[]
  accent: string
}) {
  if (!items?.length) return null

  return (
    <div className="space-y-1.5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/36">{title}</p>
      <div className="space-y-1">
        {items.map((item) => (
          <div key={`${title}-${item}`} className="flex gap-2 text-[11px] leading-snug text-white/68">
            <span className="mt-px shrink-0 text-[10px]" style={{ color: accent }}>•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ICUSystemPanel() {
  const [query, setQuery] = useState('')
  const [activeSystemId, setActiveSystemId] = useState<string>(ICU_REFERENCE_SYSTEMS[0]?.id ?? '')
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null)

  const HIDDEN_SYSTEMS = new Set(['renal', 'infectious', 'metabolic', 'gastrointestinal', 'hematologic', 'infectionsSepsis'])

  const filteredSystems = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return ICU_REFERENCE_SYSTEMS.filter((s) => !HIDDEN_SYSTEMS.has(s.id)).map((system) => {
      if (!normalized) return system

      const problems = system.problems.filter((rawProblem) => {
        const problem = rawProblem as ClinicalProblem
        const haystack = [
          problem.name,
          'desc' in problem ? (problem as { desc?: string }).desc : '',
          problem.block ?? '',
          ...(problem.goals ?? []),
          ...(problem.assess ?? []),
          ...(problem.interv ?? []),
          ...(problem.phases?.flatMap((phase) => [phase.timeframe, ...(phase.interv ?? [])]) ?? []),
        ]
          .join(' ')
          .toLowerCase()

        return haystack.includes(normalized)
      })

      return { ...system, problems }
    }).filter((system) => system.problems.length > 0)
  }, [query])

  useEffect(() => {
    if (!filteredSystems.length) {
      setExpandedProblemId(null)
      return
    }
    if (!filteredSystems.some((system) => system.id === activeSystemId)) {
      setActiveSystemId(filteredSystems[0].id)
    }
  }, [activeSystemId, filteredSystems])

  const activeSystem = filteredSystems.find((system) => system.id === activeSystemId) ?? filteredSystems[0] ?? null

  useEffect(() => {
    setExpandedProblemId(null)
  }, [activeSystemId])

  const groupedProblems = useMemo(() => {
    if (!activeSystem) return []
    const groups = new Map<string, ClinicalProblem[]>()
    activeSystem.problems.forEach((rawProblem) => {
      const problem = rawProblem as ClinicalProblem
      const block = problem.block || 'Base clinica'
      const current = groups.get(block) ?? []
      current.push(problem)
      groups.set(block, current)
    })
    return Array.from(groups.entries()).map(([block, problems]) => ({ block, problems }))
  }, [activeSystem])

  return (
    <div className="space-y-3">

      {/* Search */}
      <div className="chrome-panel rounded-[0.9rem] p-1.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 text-white/36" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar..."
            className="w-full rounded-[0.6rem] border border-white/10 bg-black/20 py-1 pl-7 pr-2 text-[10px] text-white outline-none transition-all placeholder:text-white/26 focus:border-white/18"
          />
        </div>
      </div>

      {/* System selector — 2-col grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {filteredSystems.map((system) => {
          const active = system.id === activeSystem?.id

          return (
            <button
              key={system.id}
              onClick={() => setActiveSystemId(system.id)}
              className={`flex w-full items-center gap-1.5 rounded-[0.7rem] border px-2 py-1.5 text-left transition-all ${
                active
                  ? 'border-white/20 bg-white/10'
                  : 'border-white/8 bg-transparent hover:border-white/14 hover:bg-white/4'
              }`}
            >
              <SystemGlyph path={system.icon} color={active ? system.color : 'rgba(255,255,255,0.36)'} />
              <span className={`min-w-0 flex-1 truncate text-[10px] font-medium ${active ? 'text-white/88' : 'text-white/50'}`}>
                {system.name}
              </span>
              <span
                className="shrink-0 text-[9px] font-semibold"
                style={{ color: active ? system.color : 'rgba(255,255,255,0.28)' }}
              >
                {system.problems.length}
              </span>
            </button>
          )
        })}
      </div>

      {/* Active system content */}
      {activeSystem ? (
        <div>

          {/* Compact header */}
          <div className="mb-3 flex items-center gap-2">
            <div
              className="chrome-subtle flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.6rem] border"
              style={{ borderColor: `${activeSystem.color}30` }}
            >
              <SystemGlyph path={activeSystem.icon} color={activeSystem.color} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-white/88">{activeSystem.name}</p>
              <p className="text-[9px] text-white/40">{groupedProblems.length} blocos · {activeSystem.problems.length} problemas{query ? ' · filtrado' : ''}</p>
            </div>
          </div>

          {/* Blocks */}
          <div className="space-y-3">
            {groupedProblems.map(({ block, problems }) => (
              <div key={block}>
                <div className="mb-1.5 flex items-center justify-between gap-2 px-0.5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em]" style={{ color: activeSystem.color }}>
                    {block}
                  </p>
                  <span className="text-[9px] text-white/30">
                    {problems.length}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {problems.map((problem) => {
                    const open = expandedProblemId === problem.name

                    return (
                      <div
                        key={problem.name}
                        className={`rounded-[0.9rem] border transition-all ${
                          open ? 'border-white/14 bg-white/[0.03]' : 'border-white/8 bg-transparent'
                        }`}
                      >
                        <button
                          onClick={() => setExpandedProblemId(open ? null : problem.name)}
                          className="flex w-full items-start justify-between gap-3 px-3 py-2.5 text-left"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold leading-snug text-white/88">{problem.name}</p>
                            <p className="mt-0.5 text-[10px] leading-snug text-white/50">{problem.desc}</p>
                          </div>
                          <span
                            className="mt-0.5 shrink-0 rounded-full border px-1.5 py-px text-[9px] uppercase tracking-[0.14em]"
                            style={{
                              borderColor: `${activeSystem.color}28`,
                              color: open ? activeSystem.color : 'rgba(255,255,255,0.36)',
                            }}
                          >
                            {open ? '▲' : '▼'}
                          </span>
                        </button>

                        {open ? (
                          <div className="border-t border-white/7 px-3 py-3">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <SectionList
                                title="Objetivos"
                                items={problem.goals}
                                accent={activeSystem.color}
                              />
                              <SectionList
                                title="Avaliação"
                                items={problem.assess}
                                accent={activeSystem.color}
                              />
                            </div>

                            {problem.phases?.length ? (
                              <div className="mt-3 space-y-2">
                                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/36">Fases</p>
                                <div className="grid gap-2 sm:grid-cols-2">
                                  {problem.phases.map((phase) => (
                                    <div
                                      key={`${problem.name}-${phase.timeframe}`}
                                      className="rounded-[0.8rem] border border-white/7 bg-black/14 p-2.5"
                                    >
                                      <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: activeSystem.color }}>
                                        {phase.timeframe}
                                      </p>
                                      <div className="space-y-1">
                                        {(phase.interv ?? []).map((item) => (
                                          <div
                                            key={`${phase.timeframe}-${item}`}
                                            className="flex gap-1.5 text-[11px] leading-snug text-white/62"
                                          >
                                            <span className="mt-px shrink-0 text-[10px]" style={{ color: activeSystem.color }}>→</span>
                                            <span>{item}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}

                            <div className="mt-3">
                              <SectionList
                                title="Condutas e intervenções"
                                items={problem.interv}
                                accent={activeSystem.color}
                              />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="chrome-panel rounded-[1.4rem] p-6 text-center">
          <p className="text-[11px] text-white/46">Nenhum sistema corresponde ao filtro.</p>
        </div>
      )}
    </div>
  )
}
