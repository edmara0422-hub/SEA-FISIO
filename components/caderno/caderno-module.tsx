'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle2, Circle, Sparkles, BookOpen } from 'lucide-react'
import { CADERNO_CONTENT } from '@/data/caderno-content'
import { useCadernoStore } from '@/lib/stores/cadernoStore'
import { CadernoBlock } from '@/components/caderno/caderno-block'
import { StudySidebar } from '@/components/caderno/study-sidebar'
import type { TutorMessage, ContentBlock } from '@/types/caderno'

type SidebarTool = 'summary' | 'tutor' | 'review' | 'notes' | 'performance'
type SelectionPopup = { x: number; y: number; text: string } | null

const ease = [0.16, 1, 0.3, 1] as const

export function CadernoModulePanel({ moduleId }: { moduleId: string }) {
  const module = CADERNO_CONTENT.find((m) => m.moduleId === moduleId)

  const [openSubmoduleId, setOpenSubmoduleId]     = useState<string | null>(null)
  const [activeSidebarTool, setActiveSidebarTool] = useState<SidebarTool>('summary')
  const [tutorHistory, setTutorHistory]           = useState<Record<string, TutorMessage[]>>({})
  const [tutorInput, setTutorInput]               = useState('')
  const [isTutorLoading, setIsTutorLoading]       = useState(false)
  const [selectionPopup, setSelectionPopup]       = useState<SelectionPopup>(null)

  if (!module) return null

  const toggle = (id: string) => {
    const isOpening = openSubmoduleId !== id
    setOpenSubmoduleId((prev) => (prev === id ? null : id))
    if (isOpening) setActiveSidebarTool('summary')
    setSelectionPopup(null)
  }

  async function handleAskTutor(question: string, preText?: string) {
    const text = preText ?? ''
    const q = question || `Explica este trecho: "${text.slice(0, 160)}"`
    setActiveSidebarTool('tutor')
    setSelectionPopup(null)

    const prev = tutorHistory[openSubmoduleId ?? ''] ?? []
    const userMsg: TutorMessage = { role: 'user', content: q }
    const updated = [...prev, userMsg]
    setTutorHistory((h) => ({ ...h, [openSubmoduleId ?? '']: updated }))
    setIsTutorLoading(true)

    try {
      const topic = module.topics.find((t) => t.id === openSubmoduleId)
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedText: text, question: q, topicTitle: topic?.title ?? '', moduleId, history: prev }),
      })
      const data = await res.json()
      setTutorHistory((h) => ({
        ...h,
        [openSubmoduleId ?? '']: [...updated, { role: 'assistant', content: data.response }],
      }))
    } catch {
      setTutorHistory((h) => ({
        ...h,
        [openSubmoduleId ?? '']: [...updated, { role: 'assistant', content: 'Erro ao conectar. Tente novamente.' }],
      }))
    } finally {
      setIsTutorLoading(false)
    }
  }

  return (
    <div className="space-y-1.5">
      {module.topics.map((topic, index) => (
        <SubmoduleAccordion
          key={topic.id}
          topic={topic}
          index={index}
          moduleId={moduleId}
          isOpen={openSubmoduleId === topic.id}
          onToggle={() => toggle(topic.id)}
          activeSidebarTool={activeSidebarTool}
          onSidebarToolChange={setActiveSidebarTool}
          tutorHistory={tutorHistory[topic.id] ?? []}
          onTutorHistoryChange={(msgs) => setTutorHistory((h) => ({ ...h, [topic.id]: msgs }))}
          tutorInput={tutorInput}
          onTutorInputChange={setTutorInput}
          isTutorLoading={isTutorLoading}
          selectionPopup={selectionPopup}
          onSelectionPopup={setSelectionPopup}
          onAskTutor={handleAskTutor}
        />
      ))}
    </div>
  )
}

function SubmoduleAccordion({
  topic, index, moduleId, isOpen, onToggle,
  activeSidebarTool, onSidebarToolChange,
  tutorHistory, onTutorHistoryChange,
  tutorInput, onTutorInputChange,
  isTutorLoading,
  selectionPopup, onSelectionPopup, onAskTutor,
}: {
  topic: { id: string; title: string; blocks: ContentBlock[] }
  index: number
  moduleId: string
  isOpen: boolean
  onToggle: () => void
  activeSidebarTool: SidebarTool
  onSidebarToolChange: (t: SidebarTool) => void
  tutorHistory: TutorMessage[]
  onTutorHistoryChange: (msgs: TutorMessage[]) => void
  tutorInput: string
  onTutorInputChange: (v: string) => void
  isTutorLoading: boolean
  selectionPopup: SelectionPopup
  onSelectionPopup: (p: SelectionPopup) => void
  onAskTutor: (question: string, preText?: string) => void
}) {
  const { progress, markRead, markUnread } = useCadernoStore()
  const isRead = progress[topic.id] ?? false
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTextMouseUp = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed) return
    const text = sel.toString().trim()
    if (text.length < 5) return
    const range = sel.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    const container = containerRef.current
    if (!container) return
    const containerRect = container.getBoundingClientRect()
    onSelectionPopup({ x: rect.left + rect.width / 2 - containerRect.left, y: rect.top - containerRect.top - 48, text })
  }, [onSelectionPopup])

  const num = String(index + 1).padStart(2, '0')

  return (
    <div
      className="overflow-hidden rounded-[1.4rem] transition-all duration-300"
      style={{
        border: `1px solid ${isOpen ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.05)'}`,
        background: isOpen
          ? 'rgba(4,4,7,0.98)'
          : 'rgba(255,255,255,0.015)',
        boxShadow: isOpen
          ? '0 24px 56px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)'
          : 'none',
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left"
      >
        {/* Read toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); isRead ? markUnread(topic.id) : markRead(topic.id) }}
          className="shrink-0 transition-all hover:scale-110"
        >
          {isRead
            ? <CheckCircle2 className="h-3.5 w-3.5" style={{ color: 'rgba(255,255,255,0.55)' }} />
            : <Circle className="h-3.5 w-3.5" style={{ color: 'rgba(255,255,255,0.18)' }} />
          }
        </button>

        {/* Num chip */}
        <span
          className="shrink-0 font-mono text-[9px] font-bold tracking-[0.18em]"
          style={{ color: isOpen ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.18)' }}
        >
          {num}
        </span>

        {/* Title */}
        <span
          className="flex-1 truncate text-[13px] font-semibold tracking-[0.01em] transition-colors duration-200"
          style={{ color: isOpen ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.44)' }}
        >
          {topic.title}
        </span>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-2">
          {isRead && (
            <span
              className="rounded-full px-2 py-0.5 text-[7.5px] font-bold uppercase tracking-[0.14em]"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.50)' }}
            >
              Lido
            </span>
          )}
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22, ease }}>
            <ChevronDown className="h-3.5 w-3.5" style={{ color: 'rgba(255,255,255,0.24)' }} />
          </motion.div>
        </div>
      </button>

      {/* Panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.30, ease }}
            style={{ overflow: 'hidden' }}
          >
            {/* Inner radial glow — igual performance-bar */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(circle at 16% 0%, rgba(255,255,255,0.04), transparent 40%), radial-gradient(circle at 84% 0%, rgba(255,255,255,0.02), transparent 36%)' }}
            />

            <div className="relative border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="relative p-5" ref={containerRef}>

                {/* Selection popup */}
                <AnimatePresence>
                  {selectionPopup && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 6 }}
                      transition={{ duration: 0.14, ease }}
                      onClick={(e) => { e.stopPropagation(); onAskTutor('', selectionPopup.text) }}
                      className="absolute z-30 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
                      style={{
                        left: selectionPopup.x,
                        top: selectionPopup.y,
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(10,10,14,0.96) 100%)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        color: 'rgba(255,255,255,0.88)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(16px)',
                      }}
                    >
                      <Sparkles className="h-3 w-3" />
                      Explicar com IA
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Layout grid */}
                <div className="grid gap-5 xl:grid-cols-[1fr_268px]">

                  {/* Col 1 — Conteúdo */}
                  <div
                    className="min-w-0 space-y-4"
                    onMouseUp={handleTextMouseUp}
                    onClick={() => onSelectionPopup(null)}
                  >
                    {topic.blocks.length === 0 ? (
                      <EmptyContent />
                    ) : (
                      topic.blocks.map((block) => <CadernoBlock key={block.id} block={block} />)
                    )}

                    {!isRead && topic.blocks.length > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); markRead(topic.id) }}
                        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.09)',
                          color: 'rgba(255,255,255,0.38)',
                        }}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Marcar como lido
                      </button>
                    )}
                  </div>

                  {/* Col 2 — Sidebar */}
                  <div>
                    <StudySidebar
                      topicId={topic.id}
                      topicTitle={topic.title}
                      moduleId={moduleId}
                      activeTool={activeSidebarTool}
                      onToolChange={onSidebarToolChange}
                      tutorHistory={tutorHistory}
                      onTutorHistoryChange={onTutorHistoryChange}
                      tutorInput={tutorInput}
                      onTutorInputChange={onTutorInputChange}
                      isTutorLoading={isTutorLoading}
                      onSendTutor={(q) => onAskTutor(q)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EmptyContent() {
  return (
    <div
      className="relative overflow-hidden rounded-[1.25rem] px-6 py-10"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05), transparent 60%)' }}
      />
      <div className="relative flex flex-col items-center gap-3 text-center">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-[0.9rem]"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}
        >
          <BookOpen className="h-4.5 w-4.5" style={{ color: 'rgba(255,255,255,0.28)' }} />
        </div>
        <div>
          <p className="text-[12px] font-semibold" style={{ color: 'rgba(255,255,255,0.44)' }}>
            Conteúdo em produção
          </p>
          <p className="mt-0.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.20)' }}>
            O material será publicado em breve
          </p>
        </div>
        {/* Skeleton lines */}
        <div className="w-full space-y-2 pt-2">
          {[100, 88, 94, 72, 82].map((w, i) => (
            <div key={i} className="h-[5px] rounded-full" style={{ width: `${w}%`, background: 'rgba(255,255,255,0.05)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}
