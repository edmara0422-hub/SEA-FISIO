'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, Send, Loader2, ScanText, Play, PenLine, TrendingUp, Sparkles,
  BookmarkPlus, Eraser,
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

const TABS: { id: SidebarTool; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { id: 'summary',     icon: ScanText,   label: 'Sumário'  },
  { id: 'tutor',       icon: Sparkles,   label: 'IA Tutor' },
  { id: 'notes',       icon: PenLine,    label: 'Notas'    },
  { id: 'performance', icon: TrendingUp, label: 'Stats'    },
  { id: 'review',      icon: Play,       label: 'Vídeos'   },
]

export function StudySidebar({
  topicId, topicTitle, moduleId,
  activeTool, onToolChange,
  tutorHistory, onTutorHistoryChange,
  tutorInput, onTutorInputChange,
  isTutorLoading, onSendTutor,
}: StudySidebarProps) {
  function handleClearTutor() {
    onTutorHistoryChange([])
  }

  function handleSaveToNotes() {
    if (tutorHistory.length === 0) return
    const { notes, setNote } = useCadernoStore.getState()
    const formatted = tutorHistory
      .map((m) => (m.role === 'user' ? `Pergunta: ${m.content}` : `Tutor: ${m.content}`))
      .join('\n\n')
    const current = notes[topicId] ?? ''
    const separator = current ? '\n\n---\n\n' : ''
    setNote(topicId, current + separator + formatted)
    onToolChange('notes')
  }

  return (
    <div className="flex h-full flex-col rounded-[1.5rem] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(6,6,8,0.06)_100%)] backdrop-blur-xl">
      {/* Tool tabs */}
      <div className="flex gap-1 border-b border-white/[0.06] p-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onToolChange(id)}
            title={label}
            className={`flex flex-1 flex-col items-center gap-1 rounded-[0.9rem] py-2.5 transition-all duration-200 ${
              activeTool === id ? 'bg-white/[0.08] text-white/90' : 'text-white/28 hover:text-white/52'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="text-[8px] uppercase tracking-[0.18em]">{label}</span>
          </button>
        ))}
      </div>

      {/* Tool content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">

          {activeTool === 'summary' && (
            <motion.div key="summary" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="space-y-1">
              <p className="mb-3 text-[9px] uppercase tracking-[0.32em] text-white/28">Índice do caderno</p>
              <div className="rounded-[0.85rem] px-3 py-2.5">
                <p className="text-[12px] font-medium text-white/60">{topicTitle}</p>
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-white/28">
                Selecione um trecho do conteúdo e clique em{' '}
                <span className="text-white/50">Explicar com IA</span> para aprofundar.
              </p>
            </motion.div>
          )}

          {activeTool === 'tutor' && (
            <motion.div key="tutor" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="flex h-full flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[9px] uppercase tracking-[0.32em] text-white/28">IA Tutor · {topicTitle}</p>
                {tutorHistory.length > 0 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleSaveToNotes}
                      title="Salvar em Notas"
                      className="flex items-center gap-1 rounded-[0.6rem] px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-white/32 transition hover:bg-white/[0.05] hover:text-white/62"
                    >
                      <BookmarkPlus className="h-3 w-3" />
                      Notas
                    </button>
                    <button
                      onClick={handleClearTutor}
                      title="Limpar conversa"
                      className="flex items-center gap-1 rounded-[0.6rem] px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-white/32 transition hover:bg-white/[0.05] hover:text-white/62"
                    >
                      <Eraser className="h-3 w-3" />
                      Limpar
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {tutorHistory.length === 0 && (
                  <p className="text-[12px] leading-relaxed text-white/34">
                    Selecione um trecho do caderno e clique em{' '}
                    <span className="text-white/60">Explicar</span>, ou faça uma pergunta abaixo.
                  </p>
                )}
                {tutorHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`rounded-[1rem] px-3 py-2.5 text-[12px] leading-relaxed ${
                      msg.role === 'user' ? 'bg-white/[0.06] text-white/72' : 'text-white/62'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <p className="mb-1 text-[9px] uppercase tracking-[0.2em] text-white/28">Tutor</p>
                    )}
                    {msg.content}
                  </div>
                ))}
                {isTutorLoading && (
                  <div className="flex items-center gap-2 text-white/36">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span className="text-[11px]">Pensando...</span>
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); if (tutorInput.trim()) { onSendTutor(tutorInput.trim()); onTutorInputChange('') } }}
                className="flex items-center gap-2 rounded-[1.1rem] border border-white/[0.08] bg-black/20 px-3 py-2"
              >
                <input
                  value={tutorInput}
                  onChange={(e) => onTutorInputChange(e.target.value)}
                  placeholder="Pergunta..."
                  className="flex-1 bg-transparent text-[12px] text-white/72 outline-none placeholder:text-white/24"
                />
                <button type="submit" disabled={!tutorInput.trim() || isTutorLoading} className="text-white/42 transition hover:text-white/82 disabled:opacity-30">
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </motion.div>
          )}

          {activeTool === 'notes' && (
            <motion.div key="notes" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="flex h-full flex-col gap-2">
              <NotesPanel topicId={topicId} />
            </motion.div>
          )}

          {activeTool === 'performance' && (
            <motion.div key="performance" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="space-y-4">
              <PerformancePanel topicId={topicId} />
            </motion.div>
          )}

          {activeTool === 'review' && (
            <motion.div key="review" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="space-y-2">
              <p className="mb-3 text-[9px] uppercase tracking-[0.32em] text-white/28">Vídeos do tópico</p>
              <p className="text-[12px] leading-relaxed text-white/28">
                Nenhum vídeo neste tópico ainda.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Notes ──────────────────────────────────────────────────────────────────────

function NotesPanel({ topicId }: { topicId: string }) {
  const { notes, setNote } = useCadernoStore()
  const value = notes[topicId] ?? ''
  return (
    <>
      <p className="text-[9px] uppercase tracking-[0.32em] text-white/28">Suas notas</p>
      <textarea
        value={value}
        onChange={(e) => setNote(topicId, e.target.value)}
        placeholder="Escreva suas anotações..."
        className="flex-1 resize-none rounded-[1rem] border border-white/[0.06] bg-black/16 p-3 text-[12px] leading-relaxed text-white/68 outline-none placeholder:text-white/22"
        rows={12}
      />
      {value.length > 0 && (
        <p className="text-right text-[9px] text-white/22">{value.length} caracteres · salvo</p>
      )}
    </>
  )
}

// ── Performance ────────────────────────────────────────────────────────────────

function PerformancePanel({ topicId }: { topicId: string }) {
  const { progress } = useCadernoStore()
  const isRead = progress[topicId] ?? false

  return (
    <>
      <p className="text-[9px] uppercase tracking-[0.32em] text-white/28">Progresso do tópico</p>

      <div
        className="rounded-[1.1rem] p-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/32">Status</p>
          <span
            className="rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em]"
            style={{
              background: isRead ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.09)',
              color: isRead ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.24)',
            }}
          >
            {isRead ? 'Concluído' : 'Pendente'}
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-white/52 transition-all duration-700"
            initial={{ width: '0%' }}
            animate={{ width: isRead ? '100%' : '0%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <p className="text-[12px] leading-relaxed text-white/34">
        Marque o tópico como lido no caderno para avançar no progresso.
      </p>
    </>
  )
}
