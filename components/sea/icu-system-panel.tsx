'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookMarked, FolderKanban, Search } from 'lucide-react'
import { ICU_REFERENCE_SYSTEMS } from '@/lib/generated/icu-reference-data'

type ClinicalSystem = (typeof ICU_REFERENCE_SYSTEMS)[number]
type ClinicalProblem = ClinicalSystem['problems'][number] & { block?: string; goals?: readonly string[]; assess?: readonly string[]; interv?: readonly string[]; phases?: readonly { timeframe: string; interv?: readonly string[] }[] }

function SystemGlyph({ path, color }: { path: string; color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" className="h-4 w-4">
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SectionList({
  title,
  items,
  accent,
  bullet,
}: {
  title: string
  items?: readonly string[]
  accent: string
  bullet: string
}) {
  if (!items?.length) {
    return null
  }

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/36">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={`${title}-${item}`} className="flex gap-2.5 text-sm leading-relaxed text-white/70">
            <span className="pt-1 text-[11px]" style={{ color: accent }}>
              {bullet}
            </span>
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
      if (!normalized) {
        return system
      }

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

      return {
        ...system,
        problems,
      }
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

  const totalProblems = useMemo(
    () => ICU_REFERENCE_SYSTEMS.reduce((total, system) => total + system.problems.length, 0),
    []
  )

  const visibleProblems = filteredSystems.reduce((total, system) => total + system.problems.length, 0)

  const groupedProblems = useMemo(() => {
    if (!activeSystem) {
      return []
    }

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
    <div className="space-y-5">

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

      <div className="flex gap-3 overflow-x-auto pb-1">
        {filteredSystems.map((system) => {
          const active = system.id === activeSystem?.id

          return (
            <button
              key={system.id}
              onClick={() => setActiveSystemId(system.id)}
              className={`min-w-[14rem] rounded-[1.45rem] border p-4 text-left transition-all ${
                active
                  ? 'border-white/18 bg-white/10 shadow-[0_18px_42px_rgba(0,0,0,0.28)]'
                  : 'border-white/8 bg-black/18 hover:border-white/14 hover:bg-white/6'
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div
                  className="chrome-subtle flex h-10 w-10 items-center justify-center rounded-[1rem] border"
                  style={{ borderColor: active ? `${system.color}40` : 'rgba(255,255,255,0.08)' }}
                >
                  <SystemGlyph path={system.icon} color={system.color} />
                </div>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/48">
                  {system.problems.length}
                </span>
              </div>
              <p className="text-sm font-semibold text-white/88">{system.name}</p>
            </button>
          )
        })}
      </div>

      {activeSystem ? (
        <div className="chrome-board rounded-[1.8rem] p-5 md:p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div
                className="chrome-subtle flex h-14 w-14 items-center justify-center rounded-[1.2rem] border"
                style={{ borderColor: `${activeSystem.color}30` }}
              >
                <SystemGlyph path={activeSystem.icon} color={activeSystem.color} />
              </div>
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/50">
                    ICU reference
                  </span>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/50">
                    {activeSystem.problems.length} problemas
                  </span>
                </div>
                <h3 className="text-[1.4rem] font-semibold text-white/92">{activeSystem.name}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/60">
                  Referencia clinica completa com problemas, objetivos, avaliacao e condutas agrupadas por bloco.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:min-w-[18rem]">
              <div className="chrome-panel rounded-[1.15rem] p-3">
                <div className="mb-2 flex items-center gap-2 text-white/46">
                  <FolderKanban className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-[0.18em]">Blocos</span>
                </div>
                <p className="text-lg font-semibold text-white/88">{groupedProblems.length}</p>
              </div>
              <div className="chrome-panel rounded-[1.15rem] p-3">
                <div className="mb-2 flex items-center gap-2 text-white/46">
                  <BookMarked className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-[0.18em]">Busca</span>
                </div>
                <p className="text-lg font-semibold text-white/88">{query ? 'Filtrada' : 'Integral'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {groupedProblems.map(({ block, problems }) => (
              <div key={block} className="chrome-panel rounded-[1.5rem] p-4 md:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: activeSystem.color }}>
                    {block}
                  </p>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/46">
                    {problems.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {problems.map((problem) => {
                    const open = expandedProblemId === problem.name

                    return (
                      <div
                        key={problem.name}
                        className={`rounded-[1.25rem] border transition-all ${
                          open ? 'border-white/14 bg-white/[0.045]' : 'border-white/8 bg-black/14'
                        }`}
                      >
                        <button
                          onClick={() => setExpandedProblemId(open ? null : problem.name)}
                          className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left"
                        >
                          <div>
                            <p className="text-sm font-semibold text-white/90">{problem.name}</p>
                            <p className="mt-2 text-sm leading-relaxed text-white/56">{problem.desc}</p>
                          </div>
                          <span
                            className="mt-0.5 rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.18em]"
                            style={{
                              borderColor: `${activeSystem.color}30`,
                              color: activeSystem.color,
                            }}
                          >
                            {open ? 'Aberto' : 'Abrir'}
                          </span>
                        </button>

                        {open ? (
                          <div className="border-t border-white/8 px-4 py-4">
                            <div className="grid gap-5 lg:grid-cols-2">
                              <SectionList
                                title="Objetivos"
                                items={problem.goals}
                                accent={activeSystem.color}
                                bullet="•"
                              />
                              <SectionList
                                title="Avaliacao"
                                items={problem.assess}
                                accent={activeSystem.color}
                                bullet="•"
                              />
                            </div>

                            {problem.phases?.length ? (
                              <div className="mt-5 space-y-3">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/36">
                                  Fases
                                </p>
                                <div className="grid gap-3 lg:grid-cols-2">
                                  {problem.phases.map((phase) => (
                                    <div
                                      key={`${problem.name}-${phase.timeframe}`}
                                      className="rounded-[1.2rem] border border-white/8 bg-black/16 p-4"
                                    >
                                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: activeSystem.color }}>
                                        {phase.timeframe}
                                      </p>
                                      <div className="space-y-2">
                                        {(phase.interv ?? []).map((item) => (
                                          <div
                                            key={`${phase.timeframe}-${item}`}
                                            className="flex gap-2.5 text-sm leading-relaxed text-white/68"
                                          >
                                            <span className="pt-1 text-[11px]" style={{ color: activeSystem.color }}>
                                              →
                                            </span>
                                            <span>{item}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}

                            <div className="mt-5">
                              <SectionList
                                title="Condutas e intervencoes"
                                items={problem.interv}
                                accent={activeSystem.color}
                                bullet="•"
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
        <div className="chrome-panel rounded-[1.6rem] p-8 text-center">
          <p className="text-sm text-white/56">Nenhum sistema ICU corresponde ao filtro atual.</p>
        </div>
      )}
    </div>
  )
}
