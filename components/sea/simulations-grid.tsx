'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Brain, HeartPulse, Wind } from 'lucide-react'

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
      {/* ── NEURO — full width hero ──────────────────────────────── */}
      <motion.div
        className="col-span-2 relative overflow-hidden rounded-[2rem] cursor-pointer"
        style={{
          height: 'clamp(280px, 44vw, 400px)',
          border: '1px solid rgba(255,255,255,0.09)',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)',
          boxShadow: '0 32px 72px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}
        whileHover={{ scale: 1.008 }}
        transition={spring}
      >
        {/* 3D scene fills the card */}
        <div className="absolute inset-0">
          <BrainHeroScene compact transparent />
        </div>

        {/* Top shimmer */}
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14) 50%, transparent)' }} />

        {/* Bottom overlay */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-36"
          style={{ background: 'linear-gradient(to top, rgba(4,5,6,0.92) 0%, transparent 100%)' }} />

        <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 flex items-end justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.30em] text-white/35 mb-1.5">Sistema Neural</p>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-white/50" />
              <span className="text-xl font-semibold text-white/90 tracking-wide">Neuro</span>
            </div>
          </div>
          <span
            className="text-[9px] font-semibold uppercase tracking-[0.22em] px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: 'rgba(255,255,255,0.50)',
            }}
          >
            10 Hz
          </span>
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
