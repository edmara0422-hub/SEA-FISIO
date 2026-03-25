'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Clock, ChevronDown, Brain } from 'lucide-react'
import { API_BASE } from '@/lib/api-url'
import { loadModuleContent } from '@/data/caderno-content-loader'
import { useCadernoStore } from '@/lib/stores/cadernoStore'
import { CadernoBlock } from '@/components/caderno/caderno-block'
import { StudySidebar } from '@/components/caderno/study-sidebar'
import type { CadernoModuleContent, TutorMessage } from '@/types/caderno'

type SidebarTool = 'summary' | 'tutor' | 'review' | 'notes' | 'performance'

const MODULE_NAMES: Record<string, string> = {
  M1: 'Neuro',
  M2: 'Pneumo/VM',
  M3: 'Cardio',
  M4: 'Trauma',
  M5: 'UTI',
}

export function CadernoModulePanel({ moduleId }: { moduleId: string }) {
  const [module, setModule] = useState<CadernoModuleContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    loadModuleContent(moduleId).then((content) => {
      setModule(content)
      setIsLoading(false)
    })
  }, [moduleId])

  const [openTopicId, setOpenTopicId]               = useState<string | null>(null)
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

  if (isLoading) return <SkeletonDocument />
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
      const res = await fetch(`${API_BASE}/api/tutor`, {
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

  function openTopic(id: string) {
    const isOpen = openTopicId === id
    setOpenTopicId(isOpen ? null : id)
    if (!isOpen) { setActiveTopicId(id); setActiveSidebarTool('summary') }
  }

  return (
    <div className="flex flex-col gap-3">
      {module.topics.map((topic, i) => {
        const isOpen = openTopicId === topic.id
        const slideCount = topic.blocks.reduce((n, b) => n + (b.type === 'slides' ? b.slides.length : 0), 0)
        const simCount = topic.blocks.filter((b) => b.type === 'simulation').length

        return (
          <div key={topic.id}>
            {/* ── Card fechado ── */}
            <button
              onClick={() => openTopic(topic.id)}
              className="flex w-full items-center gap-3 rounded-[1.3rem] px-4 py-3.5 text-left transition-all"
              style={{
                border: `1px solid ${isOpen ? 'rgba(45,212,191,0.20)' : 'rgba(255,255,255,0.08)'}`,
                background: isOpen
                  ? 'linear-gradient(160deg, rgba(45,212,191,0.04) 0%, rgba(0,0,0,0) 100%)'
                  : 'rgba(255,255,255,0.025)',
              }}
            >
              {/* Número */}
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.6rem] font-mono text-[10px] font-bold"
                style={{
                  background: isOpen ? 'rgba(45,212,191,0.14)' : 'rgba(255,255,255,0.06)',
                  color: isOpen ? 'rgba(45,212,191,0.85)' : 'rgba(255,255,255,0.40)',
                  border: `1px solid ${isOpen ? 'rgba(45,212,191,0.24)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="text-[8px] font-semibold uppercase tracking-[0.22em]" style={{ color: isOpen ? 'rgba(45,212,191,0.60)' : 'rgba(255,255,255,0.28)' }}>
                  {moduleId} {MODULE_NAMES[moduleId] ?? moduleId}
                </p>
                <p className="truncate text-[12px] font-semibold" style={{ color: isOpen ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.65)' }}>
                  {topic.title}
                </p>
                {!isOpen && (
                  <p className="mt-0.5 text-[9px] text-white/25">
                    {slideCount ? `${slideCount} slides` : ''}
                    {simCount ? ` · ${simCount} simulações` : ''}
                    {topic.blocks.some((b) => b.type === 'video') ? ' · vídeo' : ''}
                  </p>
                )}
              </div>

              {/* Arrow */}
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="h-4 w-4" style={{ color: isOpen ? 'rgba(45,212,191,0.60)' : 'rgba(255,255,255,0.25)' }} />
              </motion.div>
            </button>

            {/* ── Conteúdo expandido ── */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-5">
                    {/* Main layout: sidebar + content */}
                    <div className="grid gap-5 xl:grid-cols-[1fr_256px]">
                      <div className="order-1 xl:order-2">
                        <StudySidebar
                          topicId={topic.id}
                          topicTitle={topic.title}
                          moduleId={moduleId}
                          activeTool={activeSidebarTool}
                          onToolChange={setActiveSidebarTool}
                          tutorHistory={tutorHistory[topic.id] ?? []}
                          onTutorHistoryChange={(msgs) => setTutorHistory((h) => ({ ...h, [topic.id]: msgs }))}
                          tutorInput={tutorInput}
                          onTutorInputChange={setTutorInput}
                          isTutorLoading={isTutorLoading}
                          onSendTutor={(q) => handleAskTutor(q)}
                          videoUrls={topic.blocks
                            .filter((b): b is Extract<typeof b, { type: 'video' }> => b.type === 'video' && !!b.url)
                            .map((b) => ({ title: b.title, url: b.url }))}
                        />
                      </div>
                      <div className={(activeSidebarTool === 'summary' || activeSidebarTool === 'tutor') ? 'order-2 xl:order-1 space-y-8 min-w-0' : 'hidden'}>
                        {topic.blocks.length === 0 ? (
                          <SkeletonDocument />
                        ) : (
                          topic.blocks.filter((b) => b.type !== 'video').map((block) => <CadernoBlock key={block.id} block={block} />)
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      {/* Floating popup */}
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
