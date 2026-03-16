'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Sparkles, BookOpen, FileText, Clock } from 'lucide-react'
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

  const [activeTopicId, setActiveTopicId]         = useState<string>('')
  const [activeSidebarTool, setActiveSidebarTool] = useState<SidebarTool>('summary')
  const [tutorHistory, setTutorHistory]           = useState<Record<string, TutorMessage[]>>({})
  const [tutorInput, setTutorInput]               = useState('')
  const [isTutorLoading, setIsTutorLoading]       = useState(false)
  const [selectionPopup, setSelectionPopup]       = useState<SelectionPopup>(null)

  if (!module) return null

  const resolvedTopicId = activeTopicId || module.topics[0]?.id || ''
  const activeTopic = module.topics.find((t) => t.id === resolvedTopicId) ?? module.topics[0]

  if (!activeTopic) return null

  function selectTopic(id: string) {
    setActiveTopicId(id)
    setActiveSidebarTool('summary')
    setSelectionPopup(null)
  }

  async function handleAskTutor(question: string, preText?: string) {
    const text = preText ?? ''
    const q = question || `Explica este trecho: "${text.slice(0, 160)}"`
    setActiveSidebarTool('tutor')
    setSelectionPopup(null)

    const prev = tutorHistory[resolvedTopicId] ?? []
    const userMsg: TutorMessage = { role: 'user', content: q }
    const updated = [...prev, userMsg]
    setTutorHistory((h) => ({ ...h, [resolvedTopicId]: updated }))
    setIsTutorLoading(true)

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedText: text, question: q,
          topicTitle: activeTopic.title, moduleId, history: prev,
        }),
      })
      const data = await res.json()
      setTutorHistory((h) => ({
        ...h, [resolvedTopicId]: [...updated, { role: 'assistant', content: data.response }],
      }))
    } catch {
      setTutorHistory((h) => ({
        ...h, [resolvedTopicId]: [...updated, { role: 'assistant', content: 'Erro ao conectar. Tente novamente.' }],
      }))
    } finally {
      setIsTutorLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Topic tabs — só aparece quando há mais de 1 tópico ── */}
      {module.topics.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {module.topics.map((topic, i) => {
            const active = topic.id === resolvedTopicId
            return (
              <button
                key={topic.id}
                onClick={() => selectTopic(topic.id)}
                className="flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 transition-all"
                style={{
                  background: active ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}`,
                  color: active ? 'rgba(255,255,255,0.84)' : 'rgba(255,255,255,0.36)',
                  boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,0.07)' : 'none',
                }}
              >
                <span className="font-mono text-[8px] font-bold tracking-[0.14em]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-semibold">{topic.title}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Main layout: document | sidebar ── */}
      <div className="grid gap-4 xl:grid-cols-[1fr_272px]">

        {/* ── Document page — only visible when summary or tutor is active ── */}
        {(activeSidebarTool === 'summary' || activeSidebarTool === 'tutor') && (
          <DocumentPage
            topic={activeTopic}
            moduleId={moduleId}
            selectionPopup={selectionPopup}
            onSelectionPopup={setSelectionPopup}
            onAskTutor={handleAskTutor}
          />
        )}

        {/* ── Study sidebar ── */}
        <StudySidebar
          topicId={resolvedTopicId}
          topicTitle={activeTopic.title}
          moduleId={moduleId}
          activeTool={activeSidebarTool}
          onToolChange={setActiveSidebarTool}
          tutorHistory={tutorHistory[resolvedTopicId] ?? []}
          onTutorHistoryChange={(msgs) => setTutorHistory((h) => ({ ...h, [resolvedTopicId]: msgs }))}
          tutorInput={tutorInput}
          onTutorInputChange={setTutorInput}
          isTutorLoading={isTutorLoading}
          onSendTutor={(q) => handleAskTutor(q)}
        />
      </div>
    </div>
  )
}

// ── Document page ──────────────────────────────────────────────────────────────

function DocumentPage({
  topic, moduleId, selectionPopup, onSelectionPopup, onAskTutor,
}: {
  topic: { id: string; title: string; blocks: ContentBlock[] }
  moduleId: string
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
    const cRect = container.getBoundingClientRect()
    onSelectionPopup({
      x: rect.left + rect.width / 2 - cRect.left,
      y: rect.top - cRect.top - 52,
      text,
    })
  }, [onSelectionPopup])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-[1.6rem]"
      style={{
        background: 'rgba(5,5,9,0.97)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 32px 72px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
        minHeight: '480px',
      }}
    >
      {/* Radial depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at 18% 0%, rgba(255,255,255,0.04), transparent 45%), radial-gradient(circle at 82% 100%, rgba(255,255,255,0.02), transparent 40%)' }}
      />

      {/* ── Doc header ── */}
      <div
        className="flex items-center justify-between gap-3 px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.55rem]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            <BookOpen className="h-3.5 w-3.5" style={{ color: 'rgba(255,255,255,0.50)' }} />
          </div>
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.20em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
            {moduleId}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.14)' }}>/</span>
          <span className="truncate text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {topic.title}
          </span>
        </div>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">
          {topic.blocks.length > 0 && (
            <span
              className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.16em]"
              style={{ color: 'rgba(255,255,255,0.22)' }}
            >
              <FileText className="h-3 w-3" />
              {topic.blocks.length} bloco{topic.blocks.length !== 1 ? 's' : ''}
            </span>
          )}
          <button
            onClick={() => isRead ? markUnread(topic.id) : markRead(topic.id)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all"
            style={{
              background: isRead ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isRead ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
              color: isRead ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.28)',
            }}
          >
            {isRead
              ? <CheckCircle2 className="h-3 w-3" />
              : <Circle className="h-3 w-3" />
            }
            <span className="text-[8.5px] font-bold uppercase tracking-[0.14em]">
              {isRead ? 'Lido' : 'Marcar lido'}
            </span>
          </button>
        </div>
      </div>

      {/* ── Selection popup ── */}
      <AnimatePresence>
        {selectionPopup && (
          <motion.button
            initial={{ opacity: 0, scale: 0.88, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 6 }}
            transition={{ duration: 0.14, ease }}
            onClick={(e) => { e.stopPropagation(); onAskTutor('', selectionPopup.text) }}
            className="absolute z-30 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{
              left: selectionPopup.x,
              top: selectionPopup.y,
              transform: 'translateX(-50%)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(8,8,14,0.97) 100%)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'rgba(255,255,255,0.90)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.14)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <Sparkles className="h-3 w-3" />
            Explicar com IA
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Content body ── */}
      <div
        className="relative space-y-5 px-6 py-6"
        onMouseUp={handleTextMouseUp}
        onClick={() => onSelectionPopup(null)}
      >
        {topic.blocks.length === 0
          ? <SkeletonDocument />
          : topic.blocks.map((block) => <CadernoBlock key={block.id} block={block} />)
        }

        {!isRead && topic.blocks.length > 0 && (
          <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button
              onClick={(e) => { e.stopPropagation(); markRead(topic.id) }}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: 'rgba(255,255,255,0.40)',
              }}
            >
              <CheckCircle2 className="h-3 w-3" />
              Marcar como lido
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function SkeletonDocument() {
  const sections = [
    { heading: 52, lines: [100, 92, 87, 78, 94, 83] },
    { heading: 40, lines: [100, 88, 95, 72] },
    { heading: 48, lines: [100, 90, 85, 93, 68, 80] },
    { heading: 36, lines: [100, 76, 88] },
  ]

  return (
    <div className="pointer-events-none select-none space-y-8">
      {/* Status banner */}
      <div
        className="flex items-center gap-3 rounded-[1rem] px-4 py-3"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: 'rgba(255,255,255,0.24)' }} />
        <div>
          <p className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Conteúdo em produção
          </p>
          <p className="text-[9.5px]" style={{ color: 'rgba(255,255,255,0.20)' }}>
            O material será publicado em breve
          </p>
        </div>
      </div>

      {/* Skeleton sections */}
      {sections.map((section, si) => (
        <div key={si} className="space-y-2.5">
          {/* Section heading */}
          <div
            className="h-[7px] rounded-full"
            style={{ width: `${section.heading}%`, background: 'rgba(255,255,255,0.09)', maxWidth: '240px' }}
          />
          {/* Body lines */}
          <div className="space-y-2">
            {section.lines.map((w, li) => (
              <div key={li} className="h-[4px] rounded-full" style={{ width: `${w}%`, background: 'rgba(255,255,255,0.05)' }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
