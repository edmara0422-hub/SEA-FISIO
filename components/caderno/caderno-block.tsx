'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, FileText, Cpu, Paperclip, ListChecks } from 'lucide-react'
import type { ContentBlock } from '@/types/caderno'

export function CadernoBlock({ block }: { block: ContentBlock }) {
  if (block.type === 'text')       return <TextBlock block={block} />
  if (block.type === 'protocol')   return <ProtocolBlock block={block} />
  if (block.type === 'video')      return <VideoBlock block={block} />
  if (block.type === 'simulation') return <SimulationBlock block={block} />
  if (block.type === 'attachment') return <AttachmentBlock block={block} />
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
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-[0.9rem] px-4 py-3"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.6rem]"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <Cpu className="h-4 w-4 text-white/50" />
        </div>
        <div>
          <p className="text-[12px] font-semibold text-white/72">{block.title}</p>
          {block.description && (
            <p className="text-[10px] text-white/38">{block.description}</p>
          )}
        </div>
      </div>
      <span
        className="shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em]"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.40)' }}
      >
        Em breve
      </span>
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
