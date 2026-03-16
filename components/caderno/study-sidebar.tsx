'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Loader2, ScanText, FlipHorizontal2, PenLine, Activity } from 'lucide-react'
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

const TABS: { id: SidebarTool; icon: React.ElementType; label: string }[] = [
  { id: 'summary',     icon: ScanText,        label: 'Sumário'  },
  { id: 'tutor',       icon: Bot,             label: 'IA Tutor' },
  { id: 'review',      icon: FlipHorizontal2, label: 'Revisão'  },
  { id: 'notes',       icon: PenLine,         label: 'Notas'    },
  { id: 'performance', icon: Activity,        label: 'Stats'    },
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
      className="flex flex-col overflow-hidden rounded-[1.4rem]"
      style={{
        background: 'rgba(3,3,6,0.98)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 24px 56px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Radial glow top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 rounded-t-[1.4rem]"
        style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(255,255,255,0.06), transparent 70%)' }}
      />

      {/* ── Tab rail — ícones + label ativo ── */}
      <div
        className="relative flex items-center gap-0.5 p-1.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {TABS.map(({ id, icon: Icon, label }) => {
          const active = activeTool === id
          return (
            <button
              key={id}
              onClick={() => onToolChange(id)}
              title={label}
              className="relative flex flex-1 flex-col items-center gap-[3px] rounded-[0.6rem] py-2 transition-colors"
              style={{
                background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: active ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.22)',
                border: active ? '1px solid rgba(255,255,255,0.10)' : '1px solid transparent',
              }}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={active ? 2 : 1.5} />
              <span className="text-[6.5px] font-bold uppercase tracking-[0.10em] leading-none">
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
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.14 }}
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

// ── Shared ─────────────────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[1rem] ${className}`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[8px] font-bold uppercase tracking-[0.22em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
      {children}
    </p>
  )
}

// ── Summary ────────────────────────────────────────────────────────────────────

function SummaryPanel({ topicTitle }: { topicTitle: string }) {
  return (
    <div className="p-3 space-y-2.5">
      <Card className="px-3 py-3">
        <SectionLabel>Módulo</SectionLabel>
        <p className="mt-1.5 text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.82)' }}>
          {topicTitle}
        </p>
      </Card>

      <Card className="px-3 py-3 space-y-2.5">
        <SectionLabel>Resumo IA</SectionLabel>
        <div className="space-y-1.5">
          {[92, 78, 85, 62, 74, 55].map((w, i) => (
            <div key={i} className="h-[4px] rounded-full" style={{ width: `${w}%`, background: 'rgba(255,255,255,0.07)' }} />
          ))}
        </div>
        <p className="text-[8.5px]" style={{ color: 'rgba(255,255,255,0.18)' }}>
          Gerado automaticamente em breve
        </p>
      </Card>
    </div>
  )
}

// ── Review ─────────────────────────────────────────────────────────────────────

function ReviewPanel() {
  return (
    <div className="p-3">
      <Card className="flex flex-col items-center gap-3 py-8 px-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-[0.75rem]"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
        >
          <FlipHorizontal2 className="h-4.5 w-4.5" style={{ color: 'rgba(255,255,255,0.28)' }} />
        </div>
        <div className="text-center">
          <p className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.44)' }}>Flashcards</p>
          <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.20)' }}>Disponível em breve</p>
        </div>
      </Card>
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
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <SectionLabel>Anotações</SectionLabel>
        {value.length > 0 && (
          <span className="font-mono text-[8px]" style={{ color: 'rgba(255,255,255,0.18)' }}>
            {value.length}
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => setNote(topicId, e.target.value)}
        placeholder="Escreva aqui..."
        className="w-full resize-none bg-transparent px-3 py-3 text-[12px] leading-relaxed focus:outline-none"
        style={{
          color: 'rgba(255,255,255,0.72)',
          minHeight: '190px',
          caretColor: 'rgba(255,255,255,0.45)',
        }}
      />
    </div>
  )
}

// ── Performance ────────────────────────────────────────────────────────────────

function PerformancePanel({ topicId }: { topicId: string }) {
  const { progress } = useCadernoStore()
  const isRead = progress[topicId] ?? false

  return (
    <div className="p-3 space-y-2">
      {/* Status */}
      <div className="flex items-center justify-between">
        <SectionLabel>Desempenho</SectionLabel>
        <span
          className="rounded-full px-2.5 py-0.5 text-[7.5px] font-bold uppercase tracking-[0.14em]"
          style={{
            background: isRead ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.09)',
            color: isRead ? 'rgba(255,255,255,0.68)' : 'rgba(255,255,255,0.26)',
          }}
        >
          {isRead ? 'Concluído' : 'Pendente'}
        </span>
      </div>

      {/* Stats — exato MetricCard do performance-bar */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: 'Questões', value: '—' },
          { label: 'Acertos',  value: '—' },
          { label: 'Tempo',    value: '—' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 rounded-[0.9rem] py-3"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <span className="font-mono text-[17px] font-semibold leading-none" style={{ color: 'rgba(255,255,255,0.38)' }}>
              {value}
            </span>
            <span className="text-[7px] font-semibold uppercase tracking-[0.10em]" style={{ color: 'rgba(255,255,255,0.22)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress */}
      <Card className="px-3 py-2.5">
        <div className="flex items-center justify-between mb-2">
          <SectionLabel>Progresso</SectionLabel>
          <span className="font-mono text-[9px] font-bold" style={{ color: 'rgba(255,255,255,0.32)' }}>
            {isRead ? '100' : '0'}%
          </span>
        </div>
        <div className="overflow-hidden rounded-full" style={{ height: '3px', background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.65), rgba(255,255,255,0.28))' }}
            initial={{ width: '0%' }}
            animate={{ width: isRead ? '100%' : '0%' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </Card>
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
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <SectionLabel>Tutor IA</SectionLabel>
        <div className="flex items-center gap-1.5">
          <motion.span
            className="h-1.5 w-1.5 rounded-full"
            animate={{ opacity: isLoading ? [1, 0.4, 1] : 1 }}
            transition={{ duration: 1.2, repeat: isLoading ? Infinity : 0 }}
            style={{
              background: isLoading ? 'rgba(255,200,60,0.90)' : 'rgba(60,220,140,0.90)',
              boxShadow: isLoading ? '0 0 7px rgba(255,200,60,0.65)' : '0 0 7px rgba(60,220,140,0.65)',
            }}
          />
          <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.24)' }}>
            {isLoading ? 'pensando' : 'online'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="overflow-y-auto px-3 py-3 space-y-2" style={{ minHeight: 120, maxHeight: 290 }}>
        {history.length === 0 && (
          <div className="flex flex-col items-center gap-2.5 py-5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[0.8rem]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <Bot className="h-4.5 w-4.5" style={{ color: 'rgba(255,255,255,0.24)' }} />
            </div>
            <p className="text-center text-[9.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.26)' }}>
              Selecione um trecho<br />ou escreva uma pergunta
            </p>
          </div>
        )}

        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[93%] rounded-[0.85rem] px-3 py-2 text-[11px] leading-relaxed"
              style={{
                color: msg.role === 'user' ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.62)',
                background: msg.role === 'user' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)'}`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              {msg.role === 'assistant' && (
                <span className="mb-1 block text-[7.5px] font-bold uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.24)' }}>
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
              className="flex items-center gap-2 rounded-[0.85rem] px-3 py-2.5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
            >
              <Loader2 className="h-3 w-3 animate-spin" style={{ color: 'rgba(255,255,255,0.30)' }} />
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.30)' }}>Respondendo...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div
          className="flex items-center gap-2 rounded-[0.8rem] px-3 py-2"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(8,8,12,0.95) 100%)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Pergunta..."
            className="flex-1 bg-transparent text-[11px] focus:outline-none"
            style={{ color: 'rgba(255,255,255,0.75)', caretColor: 'rgba(255,255,255,0.45)' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[0.45rem] transition-opacity disabled:opacity-20"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <Send className="h-2.5 w-2.5" style={{ color: 'rgba(255,255,255,0.82)' }} />
          </button>
        </div>
      </div>
    </>
  )
}
