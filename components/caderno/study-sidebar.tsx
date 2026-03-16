'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, Send, Loader2, ScanText,
  FlipHorizontal2, PenLine, Activity,
} from 'lucide-react'
import { useCadernoStore } from '@/lib/stores/cadernoStore'
import type { TutorMessage } from '@/types/caderno'

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
  isTutorLoading: boolean
  onSendTutor: (q: string) => void
}

const TABS: { id: SidebarTool; label: string; icon: React.ElementType }[] = [
  { id: 'summary',     label: 'Sumário',  icon: ScanText       },
  { id: 'tutor',       label: 'IA',       icon: Bot            },
  { id: 'review',      label: 'Revisão',  icon: FlipHorizontal2 },
  { id: 'notes',       label: 'Notas',    icon: PenLine        },
  { id: 'performance', label: 'Stats',    icon: Activity       },
]

export function StudySidebar({
  topicId, topicTitle, moduleId,
  activeTool, onToolChange,
  tutorHistory, onTutorHistoryChange,
  tutorInput, onTutorInputChange,
  isTutorLoading, onSendTutor,
}: StudySidebarProps) {
  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(6,6,10,0.85)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* ── Tab rail ── */}
      <div
        className="flex gap-1 p-1.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTool === id
          return (
            <button
              key={id}
              onClick={() => onToolChange(id)}
              className="relative flex flex-1 flex-col items-center gap-0.5 rounded-[0.55rem] py-1.5 transition-colors"
              style={{
                background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                color: active ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.22)',
              }}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={active ? 2 : 1.5} />
              <span className="text-[7px] font-semibold uppercase tracking-[0.12em] leading-none">
                {label}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Panel ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTool}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {activeTool === 'summary'     && <SummaryPanel topicTitle={topicTitle} />}
          {activeTool === 'tutor'       && (
            <TutorPanel
              history={tutorHistory}
              input={tutorInput}
              onInputChange={onTutorInputChange}
              isLoading={isTutorLoading}
              onSend={onSendTutor}
            />
          )}
          {activeTool === 'review'      && <ReviewPanel />}
          {activeTool === 'notes'       && <NotesPanel topicId={topicId} />}
          {activeTool === 'performance' && <PerformancePanel topicId={topicId} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Summary ────────────────────────────────────────────────────────────────────

function SummaryPanel({ topicTitle }: { topicTitle: string }) {
  return (
    <div className="p-3 space-y-2">
      {/* Header chip */}
      <div className="flex items-center gap-1.5 pb-1">
        <span
          className="h-1 w-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.30)' }}
        />
        <span
          className="text-[8.5px] font-bold uppercase tracking-[0.22em]"
          style={{ color: 'rgba(255,255,255,0.28)' }}
        >
          Sumário do módulo
        </span>
      </div>

      {/* Topic pill */}
      <div
        className="rounded-[0.65rem] px-3 py-2"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-[11px] font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.72)' }}>
          {topicTitle}
        </p>
      </div>

      {/* Skeleton lines — coming soon */}
      <div className="space-y-1.5 pt-1">
        {[92, 78, 85, 60].map((w, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full"
            style={{ width: `${w}%`, background: 'rgba(255,255,255,0.05)' }}
          />
        ))}
      </div>

      <p
        className="pt-1 text-[9px] text-center"
        style={{ color: 'rgba(255,255,255,0.18)' }}
      >
        Sumário por IA em breve
      </p>
    </div>
  )
}

// ── Review ─────────────────────────────────────────────────────────────────────

function ReviewPanel() {
  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center gap-1.5 pb-1">
        <span className="h-1 w-1 rounded-full" style={{ background: 'rgba(255,255,255,0.30)' }} />
        <span className="text-[8.5px] font-bold uppercase tracking-[0.22em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
          Flashcards
        </span>
      </div>

      {/* Card placeholder */}
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-[0.8rem] py-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <FlipHorizontal2 className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.12)' }} />
        <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.20)' }}>
          Flashcards em breve
        </p>
      </div>
    </div>
  )
}

// ── Notes ──────────────────────────────────────────────────────────────────────

function NotesPanel({ topicId }: { topicId: string }) {
  const { notes, setNote } = useCadernoStore()
  const value = notes[topicId] ?? ''

  return (
    <div className="flex flex-col">
      <div
        className="flex items-center gap-1.5 px-3 pt-2.5 pb-1"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span className="h-1 w-1 rounded-full" style={{ background: 'rgba(255,255,255,0.30)' }} />
        <span className="text-[8.5px] font-bold uppercase tracking-[0.22em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
          Anotações
        </span>
        {value.length > 0 && (
          <span
            className="ml-auto font-mono text-[8px]"
            style={{ color: 'rgba(255,255,255,0.18)' }}
          >
            {value.length}
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => setNote(topicId, e.target.value)}
        placeholder="Escreva aqui..."
        className="w-full resize-none bg-transparent px-3 py-2.5 text-[11.5px] leading-relaxed focus:outline-none"
        style={{
          color: 'rgba(255,255,255,0.68)',
          minHeight: '180px',
          caretColor: 'rgba(255,255,255,0.5)',
        }}
      />
    </div>
  )
}

// ── Performance ────────────────────────────────────────────────────────────────

const STATS = [
  { label: 'Questões',  value: '—', unit: '' },
  { label: 'Acertos',   value: '—', unit: '%' },
  { label: 'Estudo',    value: '—', unit: 'min' },
]

function PerformancePanel({ topicId }: { topicId: string }) {
  const { progress } = useCadernoStore()
  const isRead = progress[topicId] ?? false

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center gap-1.5 pb-1">
        <span className="h-1 w-1 rounded-full" style={{ background: 'rgba(255,255,255,0.30)' }} />
        <span className="text-[8.5px] font-bold uppercase tracking-[0.22em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
          Desempenho
        </span>
        {/* Status badge */}
        <span
          className="ml-auto rounded-full px-2 py-0.5 text-[7.5px] font-bold uppercase tracking-[0.14em]"
          style={{
            background: isRead ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
            color: isRead ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.22)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {isRead ? 'Concluído' : 'Pendente'}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {STATS.map(({ label, value, unit }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center rounded-[0.65rem] py-2.5 gap-0.5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span
              className="font-mono text-[14px] font-bold leading-none"
              style={{ color: 'rgba(255,255,255,0.30)' }}
            >
              {value}
            </span>
            {unit && (
              <span className="text-[7px] font-semibold" style={{ color: 'rgba(255,255,255,0.18)' }}>
                {unit}
              </span>
            )}
            <span className="text-[7.5px] uppercase tracking-[0.10em] mt-0.5" style={{ color: 'rgba(255,255,255,0.20)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Mini bar — progress placeholder */}
      <div
        className="rounded-full overflow-hidden"
        style={{ height: '3px', background: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: isRead ? '100%' : '0%', background: 'rgba(255,255,255,0.28)' }}
        />
      </div>
      <p className="text-[8.5px] text-right" style={{ color: 'rgba(255,255,255,0.16)' }}>
        {isRead ? '100%' : '0%'} concluído
      </p>
    </div>
  )
}

// ── Tutor IA ──────────────────────────────────────────────────────────────────

function TutorPanel({
  history, input, onInputChange, isLoading, onSend,
}: {
  history: TutorMessage[]
  input: string
  onInputChange: (v: string) => void
  isLoading: boolean
  onSend: (q: string) => void
}) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, isLoading])

  function handleSend() {
    const q = input.trim()
    if (!q || isLoading) return
    onInputChange('')
    onSend(q)
  }

  return (
    <>
      {/* Header */}
      <div
        className="flex items-center gap-1.5 px-3 py-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span className="h-1 w-1 rounded-full" style={{ background: 'rgba(255,255,255,0.30)' }} />
        <span className="text-[8.5px] font-bold uppercase tracking-[0.22em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
          Tutor IA
        </span>
        {/* Live dot */}
        <span className="ml-auto flex items-center gap-1">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: isLoading ? 'rgba(255,220,80,0.70)' : 'rgba(80,220,120,0.70)',
              boxShadow: isLoading
                ? '0 0 4px rgba(255,220,80,0.50)'
                : '0 0 4px rgba(80,220,120,0.50)',
            }}
          />
          <span className="text-[7.5px]" style={{ color: 'rgba(255,255,255,0.22)' }}>
            {isLoading ? 'pensando' : 'online'}
          </span>
        </span>
      </div>

      {/* Messages */}
      <div
        className="overflow-y-auto px-3 py-2.5 space-y-2"
        style={{ minHeight: 140, maxHeight: 300 }}
      >
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-4 gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Bot className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.18)' }} />
            </div>
            <p className="text-[9.5px] text-center leading-relaxed" style={{ color: 'rgba(255,255,255,0.22)' }}>
              Selecione um trecho<br />ou escreva uma pergunta
            </p>
          </div>
        )}

        {history.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className="max-w-[92%] text-[11px] leading-relaxed rounded-[0.8rem] px-3 py-2"
              style={{
                color: msg.role === 'user' ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.60)',
                background: msg.role === 'user'
                  ? 'rgba(255,255,255,0.07)'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              {msg.role === 'assistant' && (
                <span
                  className="mb-1 block text-[8px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: 'rgba(255,255,255,0.22)' }}
                >
                  IA
                </span>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div
              className="flex items-center gap-2 rounded-[0.8rem] px-3 py-2"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <Loader2 className="h-3 w-3 animate-spin" style={{ color: 'rgba(255,255,255,0.28)' }} />
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
                Respondendo
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        className="flex items-center gap-2 px-2.5 py-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Pergunta..."
          className="flex-1 rounded-[0.55rem] bg-transparent px-2 py-1.5 text-[11px] focus:outline-none"
          style={{
            color: 'rgba(255,255,255,0.70)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            caretColor: 'rgba(255,255,255,0.5)',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.55rem] transition-opacity disabled:opacity-20"
          style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <Send className="h-3 w-3" style={{ color: 'rgba(255,255,255,0.75)' }} />
        </button>
      </div>
    </>
  )
}
