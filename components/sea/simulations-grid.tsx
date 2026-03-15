'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Brain, HeartPulse, Wind, Activity } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const BrainHeroScene = dynamic(
  () => import('@/components/experience/brain-hero-scene').then((mod) => mod.BrainHeroScene),
  { ssr: false, loading: () => <SceneSkeleton /> }
)
const CardioHeroScene = dynamic(
  () => import('@/components/experience/cardio-hero-scene').then((mod) => mod.CardioHeroScene),
  { ssr: false, loading: () => <SceneSkeleton /> }
)
const PneumoHeroScene = dynamic(
  () => import('@/components/experience/pneumo-hero-scene').then((mod) => mod.PneumoHeroScene),
  { ssr: false, loading: () => <SceneSkeleton /> }
)

function SceneSkeleton() {
  return <div className="h-full w-full animate-pulse bg-white/4 rounded-[2rem]" />
}

const spring = { type: 'spring', stiffness: 280, damping: 28 } as const

export function SimulationsGrid() {
  return (
    <motion.div
      className="grid grid-cols-2 gap-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >
      {/* ── NEURO — Medical HUD hero ─────────────────────────────── */}
      <motion.div
        className="col-span-2 relative overflow-hidden rounded-[2rem] cursor-pointer"
        style={{
          height: 'clamp(300px, 46vw, 420px)',
          border: '1px solid rgba(0,200,255,0.18)',
          background: '#020a10',
          boxShadow: '0 32px 72px rgba(0,0,0,0.6), inset 0 1px 0 rgba(0,200,255,0.08), 0 0 40px rgba(0,140,200,0.08)',
        }}
        whileHover={{ scale: 1.006 }}
        transition={spring}
      >
        {/* 3D scene fills the card */}
        <div className="absolute inset-0">
          <BrainHeroScene compact transparent />
        </div>

        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,200,255,0.018) 3px, rgba(0,200,255,0.018) 4px)',
          }}
        />

        {/* Top shimmer — cyan */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,220,255,0.30) 50%, transparent)' }} />

        {/* Top-left: scan label + pulsing dot */}
        <div className="absolute top-4 left-5 flex items-center gap-2">
          <NeuralPulse />
          <span className="text-[8px] font-mono uppercase tracking-[0.28em]" style={{ color: 'rgba(0,220,255,0.55)' }}>
            Neural Scan
          </span>
        </div>

        {/* Top-right: live Hz readout */}
        <div className="absolute top-4 right-5">
          <HzCounter />
        </div>

        {/* Corner brackets */}
        <CornerBrackets />

        {/* Bottom gradient */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-40"
          style={{ background: 'linear-gradient(to top, rgba(2,10,16,0.95) 0%, transparent 100%)' }} />

        {/* Bottom: label + waveform */}
        <div className="absolute bottom-0 inset-x-0 p-5 md:p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[8px] uppercase tracking-[0.30em] mb-1.5" style={{ color: 'rgba(0,200,255,0.45)' }}>
                Sistema Neural
              </p>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" style={{ color: 'rgba(0,210,255,0.65)' }} />
                <span className="text-xl font-semibold tracking-wide" style={{ color: 'rgba(0,220,255,0.90)' }}>
                  Neuro
                </span>
              </div>
            </div>
            <NeuralWave />
          </div>
        </div>
      </motion.div>

      {/* ── CARDIO ───────────────────────────────────────────────── */}
      <motion.div
        className="relative overflow-hidden rounded-[1.8rem] cursor-pointer"
        style={{
          height: 'clamp(220px, 36vw, 300px)',
          border: '1px solid rgba(204,17,32,0.18)',
          background: 'linear-gradient(160deg, rgba(120,10,18,0.12) 0%, rgba(0,0,0,0) 100%)',
          boxShadow: '0 24px 56px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,200,200,0.06)',
        }}
        whileHover={{ scale: 1.012 }}
        transition={spring}
      >
        <div className="absolute inset-0">
          <CardioHeroScene transparent />
        </div>

        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-28"
          style={{ background: 'linear-gradient(to top, rgba(5,3,4,0.92) 0%, transparent 100%)' }} />

        <div className="pointer-events-none absolute inset-x-4 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(204,40,50,0.20) 50%, transparent)' }} />

        <div className="absolute bottom-0 inset-x-0 p-4 md:p-5 flex items-end justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.28em] text-white/30 mb-1">Cardio</p>
            <div className="flex items-center gap-1.5">
              <HeartPulse className="h-3.5 w-3.5 text-rose-400/70" />
              <span className="text-base font-semibold text-white/88 tracking-wide">Coração</span>
            </div>
          </div>
          <span
            className="text-[8px] font-semibold uppercase tracking-[0.20em] px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(204,17,32,0.12)',
              border: '1px solid rgba(204,17,32,0.22)',
              color: 'rgba(255,160,160,0.70)',
            }}
          >
            72 BPM
          </span>
        </div>
      </motion.div>

      {/* ── PNEUMO ───────────────────────────────────────────────── */}
      <motion.div
        className="relative overflow-hidden rounded-[1.8rem] cursor-pointer"
        style={{
          height: 'clamp(220px, 36vw, 300px)',
          border: '1px solid rgba(56,189,248,0.14)',
          background: 'linear-gradient(160deg, rgba(7,30,45,0.18) 0%, rgba(0,0,0,0) 100%)',
          boxShadow: '0 24px 56px rgba(0,0,0,0.5), inset 0 1px 0 rgba(150,230,255,0.05)',
        }}
        whileHover={{ scale: 1.012 }}
        transition={spring}
      >
        <div className="absolute inset-0">
          <PneumoHeroScene transparent />
        </div>

        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-28"
          style={{ background: 'linear-gradient(to top, rgba(4,6,7,0.92) 0%, transparent 100%)' }} />

        <div className="pointer-events-none absolute inset-x-4 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.16) 50%, transparent)' }} />

        <div className="absolute bottom-0 inset-x-0 p-4 md:p-5 flex items-end justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.28em] text-white/30 mb-1">Pneumo</p>
            <div className="flex items-center gap-1.5">
              <Wind className="h-3.5 w-3.5 text-cyan-400/70" />
              <span className="text-base font-semibold text-white/88 tracking-wide">Pulmão</span>
            </div>
          </div>
          <span
            className="text-[8px] font-semibold uppercase tracking-[0.20em] px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(56,189,248,0.10)',
              border: '1px solid rgba(56,189,248,0.18)',
              color: 'rgba(150,230,255,0.70)',
            }}
          >
            PEEP 5
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Medical HUD helpers ───────────────────────────────────────────────────────

function NeuralPulse() {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
        style={{ background: 'rgba(0,220,255,0.7)' }}
      />
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ background: 'rgba(0,220,255,0.9)' }}
      />
    </span>
  )
}

function HzCounter() {
  const [hz, setHz] = useState(10)
  useEffect(() => {
    const id = setInterval(() => {
      setHz((v) => {
        const delta = (Math.random() - 0.5) * 2
        return Math.min(14, Math.max(7, Math.round(v + delta)))
      })
    }, 1800)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="text-right">
      <p className="text-[7px] uppercase tracking-[0.26em] mb-0.5" style={{ color: 'rgba(0,200,255,0.40)' }}>
        Freq
      </p>
      <p className="font-mono text-sm font-bold leading-none" style={{ color: 'rgba(0,220,255,0.80)' }}>
        {hz} <span className="text-[9px] font-normal" style={{ color: 'rgba(0,200,255,0.45)' }}>Hz</span>
      </p>
    </div>
  )
}

function CornerBrackets() {
  const c = 'rgba(0,200,255,0.28)'
  const size = 14
  const thick = 1.5
  const corners = [
    { top: 12, left: 12,  borderTop: thick, borderLeft: thick },
    { top: 12, right: 12, borderTop: thick, borderRight: thick },
    { bottom: 12, left: 12,  borderBottom: thick, borderLeft: thick },
    { bottom: 12, right: 12, borderBottom: thick, borderRight: thick },
  ]
  return (
    <>
      {corners.map((style, i) => (
        <div
          key={i}
          className="pointer-events-none absolute"
          style={{
            width: size, height: size,
            borderColor: c,
            borderStyle: 'solid',
            borderTopWidth: style.borderTop ?? 0,
            borderBottomWidth: style.borderBottom ?? 0,
            borderLeftWidth: style.borderLeft ?? 0,
            borderRightWidth: style.borderRight ?? 0,
            top: style.top,
            bottom: style.bottom,
            left: style.left,
            right: style.right,
          }}
        />
      ))}
    </>
  )
}

function NeuralWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let frame = 0
    let raf: number
    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = 'rgba(0,210,255,0.65)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      const w = canvas.width, h = canvas.height
      for (let x = 0; x <= w; x++) {
        const t = x / w
        const y = h / 2
          + Math.sin(t * 8 + frame * 0.06) * 5
          + Math.sin(t * 18 + frame * 0.12) * 3
          + Math.sin(t * 3 - frame * 0.04) * 4
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      frame++
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <canvas
      ref={canvasRef}
      width={100}
      height={28}
      className="opacity-80"
    />
  )
}
