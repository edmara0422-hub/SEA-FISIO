'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Play, FileText, Cpu, Paperclip, ListChecks, ChevronLeft, ChevronRight, Layers } from 'lucide-react'
import type { ContentBlock } from '@/types/caderno'

const NeuroPumpSim = dynamic(() => import('@/components/experience/neuro-pump-sim').then(m => m.NeuroPumpSim), { ssr: false })
const NeuroActionPotentialSim = dynamic(() => import('@/components/experience/neuro-action-potential-sim').then(m => m.NeuroActionPotentialSim), { ssr: false })

const SIM_REGISTRY: Record<string, React.ComponentType<{ className?: string }>> = {
  'neuro-pump': NeuroPumpSim,
  'neuro-action-potential': NeuroActionPotentialSim,
}

export function CadernoBlock({ block }: { block: ContentBlock }) {
  if (block.type === 'text')       return <TextBlock block={block} />
  if (block.type === 'protocol')   return <ProtocolBlock block={block} />
  if (block.type === 'video')      return <VideoBlock block={block} />
  if (block.type === 'simulation') return <SimulationBlock block={block} />
  if (block.type === 'attachment') return <AttachmentBlock block={block} />
  if (block.type === 'slides')     return <SlidesBlock block={block} />
  return null
}

// ── Text ──────────────────────────────────────────────────────────────────────

function TextBlock({ block }: { block: Extract<ContentBlock, { type: 'text' }> }) {
  return (
    <div className="space-y-2">
      {block.title && (
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 shrink-0 text-white/30" />
          <h4 className="text-[12px] font-semibold text-white/70">{block.title}</h4>
        </div>
      )}
      <p className="text-[13px] leading-relaxed text-white/58 pl-5">{block.body}</p>
    </div>
  )
}

// ── Protocol ─────────────────────────────────────────────────────────────────

function ProtocolBlock({ block }: { block: Extract<ContentBlock, { type: 'protocol' }> }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <ListChecks className="h-3.5 w-3.5 shrink-0 text-white/30" />
        <h4 className="text-[12px] font-semibold text-white/70">{block.title}</h4>
      </div>
      <ol className="space-y-1.5 pl-5">
        {block.steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span
              className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}
            >
              {i + 1}
            </span>
            <span className="text-[12px] leading-relaxed text-white/55">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// ── Video ─────────────────────────────────────────────────────────────────────

function VideoBlock({ block }: { block: Extract<ContentBlock, { type: 'video' }> }) {
  const [open, setOpen] = useState(false)
  const hasUrl = !!block.url

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Play className="h-3.5 w-3.5 shrink-0 text-white/30" />
        <h4 className="text-[12px] font-semibold text-white/70">{block.title}</h4>
        {block.duration && (
          <span className="text-[10px] text-white/28">{block.duration}</span>
        )}
      </div>
      {open && hasUrl ? (
        <div className="overflow-hidden rounded-[0.9rem]" style={{ aspectRatio: '16/9' }}>
          <iframe
            src={block.url}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          onClick={() => hasUrl && setOpen(true)}
          className="group relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-[0.9rem]"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            aspectRatio: '16/9',
            cursor: hasUrl ? 'pointer' : 'default',
          }}
        >
          {block.thumbnail && hasUrl && (
            <img src={block.thumbnail} alt={block.title} className="absolute inset-0 h-full w-full object-cover opacity-40" />
          )}
          {hasUrl ? (
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)' }}
            >
              <Play className="h-4 w-4 text-white/80 translate-x-px" />
            </motion.div>
          ) : (
            <>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-[0.75rem]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Play className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.20)' }} />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.32)' }}>Vídeo em produção</p>
                <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.16)' }}>Disponível em breve</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ── Simulation ────────────────────────────────────────────────────────────────

function SimulationBlock({ block }: { block: Extract<ContentBlock, { type: 'simulation' }> }) {
  const [open, setOpen] = useState(false)
  const Comp = SIM_REGISTRY[block.simulationId]

  return (
    <div className="space-y-2">
      <button
        onClick={() => Comp && setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 rounded-[0.9rem] px-4 py-3 transition-colors hover:bg-white/[0.04]"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.6rem]"
            style={{ background: open ? 'rgba(45,212,191,0.12)' : 'rgba(255,255,255,0.06)', border: `1px solid ${open ? 'rgba(45,212,191,0.22)' : 'rgba(255,255,255,0.10)'}` }}
          >
            <Cpu className="h-4 w-4" style={{ color: open ? 'rgba(45,212,191,0.80)' : 'rgba(255,255,255,0.50)' }} />
          </div>
          <div className="text-left">
            <p className="text-[12px] font-semibold text-white/72">{block.title}</p>
            {block.description && (
              <p className="text-[10px] text-white/38">{block.description}</p>
            )}
          </div>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em]"
          style={{
            background: open ? 'rgba(45,212,191,0.10)' : Comp ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${open ? 'rgba(45,212,191,0.20)' : 'rgba(255,255,255,0.10)'}`,
            color: open ? 'rgba(45,212,191,0.70)' : Comp ? 'rgba(255,255,255,0.50)' : 'rgba(255,255,255,0.25)',
          }}
        >
          {open ? 'Fechar' : Comp ? 'Abrir' : 'Em breve'}
        </span>
      </button>
      {open && Comp && (
        <div
          className="overflow-hidden rounded-[1rem]"
          style={{ border: '1px solid rgba(45,212,191,0.12)', height: 'clamp(240px, 50vw, 360px)' }}
        >
          <Comp className="h-full w-full" />
        </div>
      )}
    </div>
  )
}

// ── Attachment ────────────────────────────────────────────────────────────────

function AttachmentBlock({ block }: { block: Extract<ContentBlock, { type: 'attachment' }> }) {
  return (
    <a
      href={block.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-[0.9rem] px-4 py-3 transition-colors hover:bg-white/4"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <Paperclip className="h-4 w-4 shrink-0 text-white/40" />
      <div>
        <p className="text-[12px] font-semibold text-white/65">{block.title}</p>
        <p className="text-[10px] uppercase text-white/30">{block.fileType}</p>
      </div>
    </a>
  )
}

// ── Slides ────────────────────────────────────────────────────────────────────

function SlidesBlock({ block }: { block: Extract<ContentBlock, { type: 'slides' }> }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const total = block.slides.length

  const syncIndex = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    setCurrent(Math.min(idx, total - 1))
  }, [total])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scrollend', syncIndex)
    el.addEventListener('scroll', syncIndex)
    return () => { el.removeEventListener('scrollend', syncIndex); el.removeEventListener('scroll', syncIndex) }
  }, [syncIndex])

  const go = (dir: -1 | 1) => {
    const el = scrollRef.current
    if (!el) return
    const next = Math.max(0, Math.min(current + dir, total - 1))
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
    setCurrent(next)
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 shrink-0 text-white/30" />
          <h4 className="text-[12px] font-semibold text-white/70">{block.title}</h4>
        </div>
        <span className="text-[9px] font-mono tabular-nums text-white/30">
          {current + 1}/{total}
        </span>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {block.slides.map((slide, i) => (
            <div
              key={i}
              className="min-w-full snap-center px-1"
            >
              <div
                className="rounded-[1.2rem] p-4"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  minHeight: '10rem',
                }}
              >
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
                  {slide.title}
                </p>
                <ul className="space-y-1.5">
                  {slide.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/25" />
                      <span className="text-[11px] leading-relaxed text-white/55">{b}</span>
                    </li>
                  ))}
                </ul>
                {slide.highlight && (
                  <div
                    className="mt-3 rounded-[0.7rem] px-3 py-2"
                    style={{ background: 'rgba(45,212,191,0.06)', border: '1px solid rgba(45,212,191,0.14)' }}
                  >
                    <p className="text-[10px] italic leading-relaxed text-teal-300/70">{slide.highlight}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Nav arrows */}
        {current > 0 && (
          <button
            onClick={() => go(-1)}
            className="absolute left-1 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-white/12 bg-black/60 text-white/60 backdrop-blur-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {current < total - 1 && (
          <button
            onClick={() => go(1)}
            className="absolute right-1 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-white/12 bg-black/60 text-white/60 backdrop-blur-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1">
        {block.slides.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-200"
            style={{
              width: i === current ? '12px' : '4px',
              background: i === current ? 'rgba(45,212,191,0.70)' : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
