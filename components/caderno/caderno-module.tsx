'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle2, Circle, Sparkles } from 'lucide-react'
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

  // ── FIX 2: reseta a tab da sidebar ao abrir novo sub-módulo ──
  const toggle = (id: string) => {
    const isOpening = openSubmoduleId !== id
    setOpenSubmoduleId((prev) => (prev === id ? null : id))
    if (isOpening) setActiveSidebarTool('summary')
    setSelectionPopup(null)
  }

  // ── Igual ao IPB: envia imediatamente ao clicar em "Explicar" ──
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
        body: JSON.stringify({
          selectedText: text,
          question: q,
          topicTitle: topic?.title ?? '',
          moduleId,
          history: prev,
        }),
      })
      const data = await res.json()
      setTutorHistory((h) => ({
        ...h,
        [openSubmoduleId ?? '']: [
          ...updated,
          { role: 'assistant', content: data.response },
        ],
      }))
    } catch {
      setTutorHistory((h) => ({
        ...h,
        [openSubmoduleId ?? '']: [
          ...updated,
          { role: 'assistant', content: 'Erro ao conectar. Tente novamente.' },
        ],
      }))
    } finally {
      setIsTutorLoading(false)
    }
  }

  return (
    <div className="space-y-2">
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
          onTutorHistoryChange={(msgs) =>
            setTutorHistory((h) => ({ ...h, [topic.id]: msgs }))
          }
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
    onSelectionPopup({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top - 48,
      text,
    })
  }, [onSelectionPopup])

  const num = String(index + 1).padStart(2, '0')

  return (
    <div
      className="overflow-hidden rounded-[1.1rem] transition-colors"
      style={{
        border: `1px solid ${isOpen ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
        background: isOpen ? 'rgba(255,255,255,0.025)' : 'transparent',
      }}
    >
      {/* Accordion header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              isRead ? markUnread(topic.id) : markRead(topic.id)
            }}
            className="shrink-0 transition-opacity hover:opacity-70"
          >
            {isRead
              ? <CheckCircle2 className="h-3.5 w-3.5 text-white/55" />
              : <Circle className="h-3.5 w-3.5 text-white/20" />
            }
          </button>
          <span
            className="shrink-0 text-[9px] font-bold tracking-[0.14em]"
            style={{ color: isOpen ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.20)' }}
          >
            {num}
          </span>
          <span
            className="truncate text-[12px] font-semibold transition-colors"
            style={{ color: isOpen ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.50)' }}
          >
            {topic.title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease }}
          className="shrink-0"
        >
          <ChevronDown className="h-3.5 w-3.5 text-white/30" />
        </motion.div>
      </button>

      {/* Accordion panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease }}
            style={{ overflow: 'hidden' }}
          >
            <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>

              {/* ── FIX 1: container com position relative para o popup ── */}
              <div className="relative p-4" ref={containerRef}>

                {/* Floating selection popup */}
                <AnimatePresence>
                  {selectionPopup && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.88, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.88, y: 4 }}
                      transition={{ duration: 0.14 }}
                      style={{
                        position: 'absolute',
                        left: selectionPopup.x,
                        top: selectionPopup.y,
                        transform: 'translateX(-50%)',
                        zIndex: 20,
                        background: 'rgba(10,10,12,0.94)',
                        border: '1px solid rgba(255,255,255,0.16)',
                        color: 'rgba(255,255,255,0.82)',
                        backdropFilter: 'blur(12px)',
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onAskTutor('', selectionPopup.text)
                      }}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
                    >
                      <Sparkles className="h-3 w-3" />
                      Explicar
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Grid caderno | sidebar */}
                <div className="grid gap-4 xl:grid-cols-[1fr_256px]">

                  {/* Coluna 1 — Caderno */}
                  <div
                    className="min-w-0 space-y-5"
                    onMouseUp={handleTextMouseUp}
                    onClick={() => onSelectionPopup(null)}
                  >
                    {topic.blocks.length === 0 ? (
                      <p className="py-8 text-center text-[11px]" style={{ color: 'rgba(255,255,255,0.18)' }}>
                        Conteúdo em breve
                      </p>
                    ) : (
                      topic.blocks.map((block) => (
                        <CadernoBlock key={block.id} block={block} />
                      ))
                    )}
                    {!isRead && topic.blocks.length > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); markRead(topic.id) }}
                        className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors"
                        style={{ color: 'rgba(255,255,255,0.28)' }}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Marcar como lido
                      </button>
                    )}
                  </div>

                  {/* Coluna 2 — Sidebar */}
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
