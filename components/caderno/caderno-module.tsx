'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Sparkles, BookOpen, Clock } from 'lucide-react'
import { CADERNO_CONTENT } from '@/data/caderno-content'
import { useCadernoStore } from '@/lib/stores/cadernoStore'
import { CadernoBlock } from '@/components/caderno/caderno-block'
import { StudySidebar } from '@/components/caderno/study-sidebar'
import type { TutorMessage } from '@/types/caderno'

type SidebarTool = 'summary' | 'tutor' | 'review' | 'notes' | 'performance'

export function CadernoModulePanel({ moduleId }: { moduleId: string }) {
  const module = CADERNO_CONTENT.find((m) => m.moduleId === moduleId)

  const [activeTopicId, setActiveTopicId]         = useState<string>('')
  const [activeSidebarTool, setActiveSidebarTool] = useState<SidebarTool>('summary')
  const [tutorHistory, setTutorHistory]           = useState<Record<string, TutorMessage[]>>({})
  const [tutorInput, setTutorInput]               = useState('')
  const [isTutorLoading, setIsTutorLoading]       = useState(false)
  const [selectionPopup, setSelectionPopup]       = useState<{ x: number; y: number; text: string } | null>(null)
  const popupRef = useRef<HTMLButtonElement>(null)

  // ── Selection popup — document-level listeners (same fix as IPB) ──
  useEffect(() => {
    function onMouseUp() {
      setTimeout(() => {
        const selection = window.getSelection()
        if (!selection || selection.isCollapsed || selection.rangeCount === 0) return
        const text = selection.toString().trim()
        if (text.length < 4) return
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        if (rect.width === 0 && rect.height === 0) return
        setSelectionPopup({ x: rect.left + rect.width / 2, y: rect.top - 52, text })
      }, 20)
    }

    function onMouseDown(e: MouseEvent) {
      if (popupRef.current && popupRef.current.contains(e.target as Node)) return
      setSelectionPopup(null)
    }

    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousedown', onMouseDown)
    return () => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  if (!module) return null

  const resolvedTopicId = activeTopicId || module.topics[0]?.id || ''
  const activeTopic = module.topics.find((t) => t.id === resolvedTopicId) ?? module.topics[0]

  if (!activeTopic) return null

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

  const { markRead } = useCadernoStore()

  return (
    <div className="flex flex-col gap-4">

      {/* Topic tabs — só quando há mais de 1 tópico */}
      {module.topics.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {module.topics.map((topic, i) => {
            const active = topic.id === resolvedTopicId
            return (
              <button
                key={topic.id}
                onClick={() => { setActiveTopicId(topic.id); setActiveSidebarTool('summary') }}
                className="flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 transition-all"
                style={{
                  background: active ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}`,
                  color: active ? 'rgba(255,255,255,0.84)' : 'rgba(255,255,255,0.36)',
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

      {/* Main layout: sidebar primeiro no mobile, documento em xl */}
      <div className="grid gap-5 xl:grid-cols-[1fr_256px]">

        {/* Sidebar — order-1 mobile, order-2 desktop */}
        <div className="order-1 xl:order-2">
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

        {/* Caderno — só visível em sumário e IA tutor */}
        <div className={(activeSidebarTool === 'summary' || activeSidebarTool === 'tutor') ? 'order-2 xl:order-1 space-y-8 min-w-0' : 'hidden'}>
          <DocumentPage
            topic={activeTopic}
            moduleId={moduleId}
            onAskTutor={handleAskTutor}
            onMarkRead={() => markRead(resolvedTopicId)}
          />
        </div>
      </div>

      {/* Floating popup — Portal para escapar de transforms do Framer Motion */}
      {selectionPopup && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          <motion.button
            key="selection-popup"
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.8, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 4 }}
            transition={{ duration: 0.18 }}
            style={{ position: 'fixed', left: selectionPopup.x, top: selectionPopup.y, transform: 'translateX(-50%)', zIndex: 9999 }}
            onClick={() => handleAskTutor('', selectionPopup.text)}
            className="flex items-center gap-1.5 rounded-full border border-white/16 bg-[rgba(10,10,12,0.94)] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/82 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:bg-white/10 transition"
          >
            <Sparkles className="h-3 w-3" />
            Explicar
          </motion.button>
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

// ── Document page ──────────────────────────────────────────────────────────────

function DocumentPage({
  topic, moduleId, onAskTutor, onMarkRead,
}: {
  topic: { id: string; title: string; blocks: import('@/types/caderno').ContentBlock[] }
  moduleId: string
  onAskTutor: (question: string, preText?: string) => void
  onMarkRead: () => void
}) {
  const { progress } = useCadernoStore()
  const isRead = progress[topic.id] ?? false

  return (
    <div
      className="relative overflow-hidden rounded-[1.6rem]"
      style={{
        background: 'rgba(5,5,9,0.97)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 32px 72px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
        minHeight: '480px',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at 18% 0%, rgba(255,255,255,0.04), transparent 45%), radial-gradient(circle at 82% 100%, rgba(255,255,255,0.02), transparent 40%)' }}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
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

        <button
          onClick={onMarkRead}
          className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 transition-all"
          style={{
            background: isRead ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isRead ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
            color: isRead ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.28)',
          }}
        >
          <CheckCircle2 className="h-3 w-3" />
          <span className="text-[8.5px] font-bold uppercase tracking-[0.14em]">
            {isRead ? 'Lido' : 'Marcar lido'}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="relative space-y-5 px-6 py-6">
        {topic.blocks.length === 0
          ? <SkeletonDocument />
          : topic.blocks.map((block) => <CadernoBlock key={block.id} block={block} />)
        }

        {!isRead && topic.blocks.length > 0 && (
          <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button
              onClick={onMarkRead}
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
      <div
        className="flex items-center gap-3 rounded-[1rem] px-4 py-3"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: 'rgba(255,255,255,0.24)' }} />
        <div>
          <p className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.40)' }}>Conteúdo em produção</p>
          <p className="text-[9.5px]" style={{ color: 'rgba(255,255,255,0.20)' }}>O material será publicado em breve</p>
        </div>
      </div>
      {sections.map((section, si) => (
        <div key={si} className="space-y-2.5">
          <div className="h-[7px] rounded-full" style={{ width: `${section.heading}%`, background: 'rgba(255,255,255,0.09)', maxWidth: '240px' }} />
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
