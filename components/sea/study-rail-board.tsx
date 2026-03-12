'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Radar } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type ModuleStatus = 'idle' | 'reading' | 'completed'

export type StudyModule = {
  id: string
  title: string
  icon: LucideIcon
  description: string
  content: string
}

export function StudyRailBoard({
  badge,
  modules,
  icon: HeaderIcon,
  itemLabel = 'modulo',
  actionLabel = 'Marcar como lido',
  readingLabel = 'em leitura',
}: {
  badge: string
  modules: StudyModule[]
  icon: LucideIcon
  itemLabel?: string
  actionLabel?: string
  readingLabel?: string
}) {
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null)
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, ModuleStatus>>(() =>
    Object.fromEntries(modules.map((module) => [module.id, 'idle'])) as Record<string, ModuleStatus>
  )

  const current = activeModuleIndex !== null ? modules[activeModuleIndex] : null
  const CurrentIcon = current?.icon

  const completedCount = modules.filter((module) => moduleStatuses[module.id] === 'completed').length
  const journeyProgress = Math.round((completedCount / modules.length) * 100)
  const railIds = modules.map((module) => module.id).join(', ')

  const selectModule = (index: number) => {
    const selectedModule = modules[index]

    setActiveModuleIndex(index)
    setModuleStatuses((prev) => ({
      ...prev,
      [selectedModule.id]: prev[selectedModule.id] === 'completed' ? 'completed' : 'reading',
    }))
  }

  const completeCurrentModule = () => {
    if (!current) {
      return
    }

    setModuleStatuses((prev) => ({
      ...prev,
      [current.id]: 'completed',
    }))
  }

  return (
    <div className="space-y-6">
      <div className="chrome-board rounded-[2rem] p-6 md:p-7">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="chrome-subtle flex h-11 w-11 items-center justify-center rounded-[1rem]">
              <HeaderIcon className="h-5 w-5 text-white" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/72">
              {badge}
            </p>
          </div>

          <StudyProgressRail
            modules={modules}
            activeIndex={activeModuleIndex}
            statuses={moduleStatuses}
            onSelect={selectModule}
            progress={journeyProgress}
            completedCount={completedCount}
            itemLabel={itemLabel}
            railIds={railIds}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {current ? (
          <motion.div
            key={`detail-shell-${current.id}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.28 }}
            className="space-y-5"
          >
            <div className="chrome-panel rounded-[1.8rem] p-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">
                    Pagina do {itemLabel}
                  </p>
                  <h3 className="text-sm font-semibold text-white/86">{current.title}</h3>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/52">
                  <Radar className="h-3.5 w-3.5 text-white/66" />
                  <span>
                    {moduleStatuses[current.id] === 'completed'
                      ? `${current.id} concluido`
                      : moduleStatuses[current.id] === 'reading'
                        ? `${current.id} ${readingLabel}`
                        : current.id}
                  </span>
                </div>
              </div>

              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.28 }}
                className="space-y-5"
              >
                <div className="chrome-board rounded-[1.7rem] p-5">
                  <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="chrome-subtle flex h-14 w-14 items-center justify-center rounded-[1.2rem]">
                        {CurrentIcon ? <CurrentIcon className="h-6 w-6 text-white" /> : null}
                      </div>
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/52">
                            {current.id}
                          </span>
                        </div>
                        <h3 className="text-[1.55rem] font-semibold text-white/94">{current.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/64">{current.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={completeCurrentModule}
                      className="chrome-subtle rounded-[1.1rem] border border-white/12 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72 transition-all duration-300 hover:text-white"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Check className="h-3.5 w-3.5" />
                        {actionLabel}
                      </span>
                    </button>
                  </div>

                  <div className="chrome-panel rounded-[1.45rem] p-5">
                    <p className="text-sm leading-relaxed text-white/72">{current.content}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty-module-state"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.28 }}
            className="chrome-panel rounded-[1.8rem] p-8"
          >
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
              <div className="chrome-subtle flex h-14 w-14 items-center justify-center rounded-full">
                <Radar className="h-5 w-5 text-white/82" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">Study pronta</p>
              <h3 className="text-lg font-semibold text-white/86">
                Selecione um {itemLabel} no trilho superior para abrir a pagina de estudo.
              </h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StudyProgressRail({
  modules,
  activeIndex,
  statuses,
  onSelect,
  progress,
  completedCount,
  itemLabel,
  railIds,
}: {
  modules: StudyModule[]
  activeIndex: number | null
  statuses: Record<string, ModuleStatus>
  onSelect: (index: number) => void
  progress: number
  completedCount: number
  itemLabel: string
  railIds: string
}) {
  return (
    <div className="chrome-panel overflow-hidden rounded-[1.65rem] p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">Rail sincronizado</p>
          <h3 className="mt-2 text-sm font-semibold text-white/84">
            Clique em {railIds} para abrir o {itemLabel}.
          </h3>
        </div>
        <div className="chrome-subtle rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/58">
          {completedCount}/{modules.length} concluidos
        </div>
      </div>

      <div className="relative px-2 md:px-4">
        <div className="pointer-events-none absolute inset-x-0 top-[1.3rem] h-px bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.26)_18%,rgba(255,255,255,0.16)_52%,rgba(255,255,255,0.08)_100%)]" />
        <motion.div
          className="pointer-events-none absolute left-0 top-[1.15rem] h-[5px] rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.95)_0%,rgba(214,219,226,0.9)_54%,rgba(143,148,155,0.68)_100%)] shadow-[0_0_18px_rgba(255,255,255,0.22)]"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="relative flex items-start justify-between gap-2 md:gap-3">
          {modules.map((module, index) => {
            const active = index === activeIndex
            const status = statuses[module.id]
            const ModuleIcon = module.icon

            return (
              <button
                key={module.id}
                onClick={() => onSelect(index)}
                className="group flex min-w-0 flex-1 flex-col items-center gap-2 text-center"
                title={module.title}
              >
                <motion.div
                  className="flex flex-col items-center gap-2.5"
                  animate={{ y: [0, -7, 0] }}
                  transition={{
                    duration: 4.2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                    delay: index * 0.28,
                  }}
                >
                  <div
                    className={`chrome-subtle flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 md:h-10 md:w-10 ${
                      active ? 'border-white/18 text-white' : 'border-white/8 text-white/62'
                    }`}
                  >
                    <ModuleIcon className="h-4 w-4" />
                  </div>

                  <motion.div
                    className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 md:h-12 md:w-12 ${
                      active
                        ? 'border-white/24 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(218,224,231,0.34)_20%,rgba(22,24,28,0.96)_100%)]'
                        : 'border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(14,16,20,0.92)_100%)]'
                    }`}
                    whileHover={{ y: -2, scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={`absolute inset-[5px] rounded-full ${
                        active
                          ? 'bg-[radial-gradient(circle,rgba(255,255,255,0.42)_0%,rgba(186,194,203,0.16)_45%,transparent_78%)]'
                          : 'bg-[radial-gradient(circle,rgba(255,255,255,0.16)_0%,transparent_72%)]'
                      }`}
                    />
                    <span
                      className={`relative text-[10px] font-semibold uppercase tracking-[0.16em] ${
                        active ? 'text-white' : 'text-white/54'
                      }`}
                    >
                      {module.id}
                    </span>
                  </motion.div>
                </motion.div>

                <div
                  className={`mx-auto h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    status === 'completed'
                      ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]'
                      : active
                        ? 'bg-white/82 shadow-[0_0_10px_rgba(255,255,255,0.32)]'
                        : 'bg-white/20 group-hover:bg-white/42'
                  }`}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
