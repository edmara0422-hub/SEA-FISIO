'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  NotebookPen, Bot, Send, Loader2,
  FileText, RefreshCw, BarChart2,
} from 'lucide-react'
import { useCadernoStore } from '@/lib/stores/cadernoStore'
import type { TutorMessage } from '@/types/caderno'
import { useState } from 'react'

type SidebarTool = 'summary' | 'tutor' | 'review' | 'notes' | 'performance'

interface StudySidebarProps {
  topicId: string
  topicTitle: string
  moduleId: string
  activeTool: SidebarTool
  onToolChange: (t: SidebarTool) => void
  tutorHistory: TutorMessage[]
  onTutorHistoryChange: (msgs: TutorMessage[]) => void
  tutorInput: string
  onTutorInputChange: (v: string) => void
}

const TABS: { id: SidebarTool; label: string; icon: React.ElementType }[] = [
  { id: 'summary',     label: 'Sumário',     icon: FileText    },
  { id: 'tutor',       label: 'IA Tutor',    icon: Bot         },
  { id: 'review',      label: 'Revisão',     icon: RefreshCw   },
  { id: 'notes',       label: 'Notas',       icon: NotebookPen },
  { id: 'performance', label: 'Performance', icon: BarChart2   },
]

export function StudySidebar({
  topicId,
  topicTitle,
  moduleId,
  activeTool,
  onToolChange,
  tutorHistory,
  onTutorHistoryChange,
  tutorInput,
  onTutorInputChange,
}: StudySidebarProps) {
  return (
    <div
      className="flex h-full flex-col rounded-[1.1rem] overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.25)' }}
    >
      {/* Tab bar */}
      <div
        className="flex border-b overflow-x-auto scrollbar-none"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onToolChange(id)}
            className="flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 py-2 px-1 transition-colors"
            style={{ color: activeTool === id ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.25)' }}
          >
            <Icon className="h-3 w-3 shrink-0" />
            <span className="text-[8px] font-semibold uppercase tracking-[0.10em] truncate w-full text-center">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTool}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="flex-1 flex flex-col min-h-0"
        >
          {activeTool === 'summary' && (
            <SummaryPanel topicTitle={topicTitle} />
          )}
          {activeTool === 'tutor' && (
            <TutorPanel
              topicTitle={topicTitle}
              moduleId={moduleId}
              history={tutorHistory}
              onHistoryChange={onTutorHistoryChange}
              input={tutorInput}
              onInputChange={onTutorInputChange}
            />
          )}
          {activeTool === 'review' && (
            <ReviewPanel topicId={topicId} />
          )}
          {activeTool === 'notes' && (
            <NotesPanel topicId={topicId} />
          )}
          {activeTool === 'performance' && (
            <PerformancePanel topicId={topicId} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Summary ────────────────────────────────────────────────────────────────────

function SummaryPanel({ topicTitle }: { topicTitle: string }) {
  return (
    <div className="flex-1 p-3 overflow-y-auto">
      <p
        className="text-center text-[10px] mt-6"
        style={{ color: 'rgba(255,255,255,0.20)' }}
      >
        Sumário de <span style={{ color: 'rgba(255,255,255,0.38)' }}>{topicTitle}</span> em breve
      </p>
    </div>
  )
}

// ── Review ─────────────────────────────────────────────────────────────────────

function ReviewPanel({ topicId }: { topicId: string }) {
  return (
    <div className="flex-1 p-3 overflow-y-auto">
      <p
        className="text-center text-[10px] mt-6"
        style={{ color: 'rgba(255,255,255,0.20)' }}
      >
        Flashcards de revisão em breve
      </p>
    </div>
  )
}

// ── Notes ──────────────────────────────────────────────────────────────────────

function NotesPanel({ topicId }: { topicId: string }) {
  const { notes, setNote } = useCadernoStore()
  const value = notes[topicId] ?? ''

  return (
    <textarea
      value={value}
      onChange={(e) => setNote(topicId, e.target.value)}
      placeholder="Escreva suas anotações aqui..."
      className="flex-1 w-full resize-none bg-transparent p-3 text-[12px] leading-relaxed placeholder:text-white/20 focus:outline-none"
      style={{ color: 'rgba(255,255,255,0.62)', minHeight: '160px' }}
    />
  )
}

// ── Performance ────────────────────────────────────────────────────────────────

function PerformancePanel({ topicId }: { topicId: string }) {
  return (
    <div className="flex-1 p-3 overflow-y-auto">
      <p
        className="text-center text-[10px] mt-6"
        style={{ color: 'rgba(255,255,255,0.20)' }}
      >
        Métricas de desempenho em breve
      </p>
    </div>
  )
}

// ── Tutor IA ──────────────────────────────────────────────────────────────────

function TutorPanel({
  topicTitle,
  moduleId,
  history,
  onHistoryChange,
  input,
  onInputChange,
}: {
  topicTitle: string
  moduleId: string
  history: TutorMessage[]
  onHistoryChange: (msgs: TutorMessage[]) => void
  input: string
  onInputChange: (v: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  async function send() {
    const q = input.trim()
    if (!q || loading) return
    onInputChange('')
    const userMsg: TutorMessage = { role: 'user', content: q }
    const next = [...history, userMsg]
    onHistoryChange(next)
    setLoading(true)

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, topicTitle, moduleId, history }),
      })
      const data = await res.json()
      onHistoryChange([...next, { role: 'assistant', content: data.response }])
    } catch {
      onHistoryChange([...next, { role: 'assistant', content: 'Erro ao conectar. Tente novamente.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ minHeight: 0 }}>
        {history.length === 0 && (
          <p className="text-center text-[10px] mt-4" style={{ color: 'rgba(255,255,255,0.22)' }}>
            Selecione um trecho ou faça uma pergunta
          </p>
        )}
        {history.map((msg, i) => (
          <div
            key={i}
            className={`text-[11px] leading-relaxed rounded-[0.7rem] px-3 py-2 ${
              msg.role === 'user' ? 'ml-4 text-right' : 'mr-4'
            }`}
            style={{
              color: msg.role === 'user' ? 'rgba(255,255,255,0.70)' : 'rgba(255,255,255,0.55)',
              background: msg.role === 'user' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 mr-4 px-3 py-2">
            <Loader2 className="h-3 w-3 animate-spin text-white/30" />
            <span className="text-[10px] text-white/28">Respondendo...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 p-2 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Pergunta..."
          className="flex-1 bg-transparent text-[11px] placeholder:text-white/22 focus:outline-none px-1"
          style={{ color: 'rgba(255,255,255,0.65)' }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-opacity disabled:opacity-30"
          style={{ background: 'rgba(255,255,255,0.10)' }}
        >
          <Send className="h-3 w-3 text-white/70" />
        </button>
      </div>
    </>
  )
}
