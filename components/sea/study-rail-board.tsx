'use client'

import { ReactNode, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type ModuleStatus = 'idle' | 'reading' | 'completed'

export type StudyModule = {
  id: string
  title: string
  icon: LucideIcon
  description: string
  content?: string
  panel?: ReactNode
}

const ease = [0.16, 1, 0.3, 1] as const
const spring = { type: 'spring', stiffness: 340, damping: 28 } as const

export function StudyRailBoard({
  badge,
  modules,
  icon: HeaderIcon,
  itemLabel = 'modulo',
  actionLabel = 'Marcar como lido',
  readingLabel = 'em leitura',
  hideDetailHeader = false,
}: {
  badge: string
  modules: StudyModule[]
  icon: LucideIcon
  itemLabel?: string
  actionLabel?: string | null
  readingLabel?: string
  hideDetailHeader?: boolean
}) {
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null)
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, ModuleStatus>>(() =>
    Object.fromEntries(modules.map((m) => [m.id, 'idle'])) as Record<string, ModuleStatus>
  )

  const current = activeModuleIndex !== null ? modules[activeModuleIndex] : null
  const completedCount = modules.filter((m) => moduleStatuses[m.id] === 'completed').length
  const journeyProgress = Math.round((completedCount / modules.length) * 100)

  const selectModule = (index: number) => {
    const m = modules[index]
    setActiveModuleIndex(index)
    setModuleStatuses((prev) => ({
      ...prev,
      [m.id]: prev[m.id] === 'completed' ? 'completed' : 'reading',
    }))
  }

  const completeCurrentModule = () => {
    if (!current) return
    setModuleStatuses((prev) => ({ ...prev, [current.id]: 'completed' }))
  }

  return (
    <div className="space-y-4">
      {/* Rail */}
      <div
        className="overflow-hidden rounded-[1.8rem] border border-white/8 p-5 md:p-6"
        style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 50%, transparent 100%)' }}
      >
        {/* Rail header */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-[0.7rem] border border-white/10"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <HeaderIcon className="h-4 w-4 text-white/60" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/44">{badge}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold tabular-nums text-white/28">{completedCount}/{modules.length}</span>
            <div className="h-1 w-16 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full bg-white/50"
                animate={{ width: `${journeyProgress}%` }}
                transition={{ duration: 0.5, ease }}
              />
            </div>
          </div>
        </div>

        {/* Nodes */}
        <div className="relative">
          {/* Track line */}
          <div className="pointer-events-none absolute inset-x-4 top-[2.4rem] h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.10)_20%,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0.10)_80%,transparent)]" />
          {/* Progress fill */}
          <motion.div
            className="pointer-events-none absolute left-4 top-[2.35rem] h-[3px] rounded-full"
            style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0.3))' }}
            animate={{ width: journeyProgress > 0 ? `calc(${journeyProgress}% - 2rem)` : '0%' }}
            transition={{ duration: 0.5, ease }}
          />

          <div className="relative flex items-start justify-around gap-2">
            {modules.map((module, index) => {
              const isActive = index === activeModuleIndex
              const status = moduleStatuses[module.id]
              const ModuleIcon = module.icon

              return (
                <button
                  key={module.id}
                  onClick={() => selectModule(index)}
                  className="group flex flex-col items-center gap-2.5"
                >
                  {/* Floating icon */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-200"
                      style={{
                        borderColor: isActive ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)',
                        background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                      }}
                    >
                      <ModuleIcon className="h-3.5 w-3.5" style={{ color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)' }} />
                    </div>

                    {/* Node ball */}
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      transition={spring}
                      className="relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200"
                      style={{
                        borderColor: isActive ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.10)',
                        background: isActive
                          ? 'linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(200,206,214,0.30) 20%, rgba(18,20,24,0.95) 100%)'
                          : 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(12,14,18,0.92) 100%)',
                        boxShadow: isActive ? '0 4px 20px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.18) inset' : 'none',
                      }}
                    >
                      <div
                        className="absolute inset-[4px] rounded-full"
                        style={{
                          background: isActive
                            ? 'radial-gradient(circle, rgba(255,255,255,0.38) 0%, transparent 72%)'
                            : 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 72%)',
                        }}
                      />
                      <span
                        className="relative text-[9px] font-bold tracking-[0.14em]"
                        style={{ color: isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.48)' }}
                      >
                        {module.id}
                      </span>
                    </motion.div>
                  </motion.div>

                  {/* Status dot */}
                  <div
                    className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: status === 'completed'
                        ? 'rgba(255,255,255,0.9)'
                        : isActive
                          ? 'rgba(255,255,255,0.65)'
                          : 'rgba(255,255,255,0.15)',
                      boxShadow: status === 'completed' ? '0 0 8px rgba(255,255,255,0.5)' : 'none',
                    }}
                  />

                  {/* Label */}
                  <span
                    className="max-w-[5rem] text-center text-[9px] leading-tight tracking-[0.06em] transition-colors duration-200"
                    style={{ color: isActive ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.28)' }}
                  >
                    {module.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Detail */}
      <AnimatePresence mode="wait">
        {current ? (
          <motion.div
            key={`detail-${current.id}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease }}
          >
            {hideDetailHeader && current.panel ? (
              current.panel
            ) : (
              <div
                className="overflow-hidden rounded-[1.8rem] border border-white/8"
                style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(0,0,0,0) 100%)' }}
              >
                {/* Detail header */}
                <div className="flex items-center justify-between gap-4 border-b border-white/6 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.8rem] border border-white/10"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      <current.icon className="h-4 w-4 text-white/65" />
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/28">{current.id}</p>
                      <h3 className="text-[14px] font-semibold text-white/88">{current.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em]"
                      style={{
                        borderColor: moduleStatuses[current.id] === 'completed'
                          ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)',
                        color: moduleStatuses[current.id] === 'completed'
                          ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.32)',
                        background: moduleStatuses[current.id] === 'completed'
                          ? 'rgba(255,255,255,0.06)' : 'transparent',
                      }}
                    >
                      {moduleStatuses[current.id] === 'completed'
                        ? 'Concluido'
                        : moduleStatuses[current.id] === 'reading'
                          ? readingLabel
                          : 'Aberto'}
                    </span>

                    {actionLabel && moduleStatuses[current.id] !== 'completed' && (
                      <motion.button
                        onClick={completeCurrentModule}
                        whileTap={{ scale: 0.95 }}
                        transition={spring}
                        className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white/80"
                      >
                        <Check className="h-3 w-3" />
                        {actionLabel}
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Detail body */}
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.18 }}
                  className="p-5 md:p-6"
                >
                  {current.description && (
                    <p className="mb-4 text-[13px] leading-relaxed text-white/50">{current.description}</p>
                  )}
                  {current.panel ? (
                    current.panel
                  ) : (
                    <p className="text-[13px] leading-relaxed text-white/65">{current.content}</p>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center rounded-[1.8rem] border border-white/6 py-12"
            style={{ background: 'rgba(255,255,255,0.01)' }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/22">
              Selecione um {itemLabel} para abrir
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
