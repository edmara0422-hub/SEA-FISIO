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

// Same card aesthetic as explore page — glass border, gradient overlay, label at bottom
const SIMS = [
  {
    id: 'neuro',
    label: 'Sistema Neural',
    title: 'Neuro',
    icon: Brain,
    iconColor: 'text-indigo-300/70',
    badge: '10 Hz',
    badgeBg: 'rgba(168,184,255,0.10)',
    badgeBorder: 'rgba(168,184,255,0.20)',
    badgeText: 'rgba(168,184,255,0.70)',
    border: 'rgba(168,184,255,0.14)',
    shimmer: 'rgba(168,184,255,0.20)',
    fog: 'rgba(4,4,18,0.90)',
    colSpan: true,
    height: 'clamp(280px, 44vw, 400px)',
  },
  {
    id: 'cardio',
    label: 'Cardio',
    title: 'Coração',
    icon: HeartPulse,
    iconColor: 'text-rose-400/70',
    badge: '72 BPM',
    badgeBg: 'rgba(204,17,32,0.12)',
    badgeBorder: 'rgba(204,17,32,0.22)',
    badgeText: 'rgba(255,160,160,0.70)',
    border: 'rgba(204,17,32,0.14)',
    shimmer: 'rgba(204,40,50,0.20)',
    fog: 'rgba(5,3,4,0.90)',
    colSpan: false,
    height: 'clamp(220px, 36vw, 300px)',
  },
  {
    id: 'pneumo',
    label: 'Pneumo',
    title: 'Pulmão',
    icon: Wind,
    iconColor: 'text-cyan-400/70',
    badge: 'PEEP 5',
    badgeBg: 'rgba(56,189,248,0.10)',
    badgeBorder: 'rgba(56,189,248,0.18)',
    badgeText: 'rgba(150,230,255,0.70)',
    border: 'rgba(56,189,248,0.14)',
    shimmer: 'rgba(56,189,248,0.16)',
    fog: 'rgba(4,6,7,0.90)',
    colSpan: false,
    height: 'clamp(220px, 36vw, 300px)',
  },
] as const

export function SimulationsGrid() {
  return (
    <motion.div
      className="grid grid-cols-2 gap-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >
      {SIMS.map((sim) => (
        <motion.div
          key={sim.id}
          className={`${sim.colSpan ? 'col-span-2' : ''} relative overflow-hidden rounded-[2rem] cursor-pointer`}
          style={{
            height: sim.height,
            border: `1px solid ${sim.border}`,
            background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 40%, rgba(0,0,0,0) 100%)',
            boxShadow: `0 32px 72px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)`,
          }}
          whileHover={{ scale: sim.colSpan ? 1.007 : 1.012 }}
          transition={spring}
        >
          {/* 3D scene */}
          <div className="absolute inset-0">
            {sim.id === 'neuro'   && <BrainHeroScene compact transparent />}
            {sim.id === 'cardio'  && <CardioHeroScene transparent />}
            {sim.id === 'pneumo'  && <PneumoHeroScene transparent />}
          </div>

          {/* Top shimmer — accent colour */}
          <div
            className="pointer-events-none absolute inset-x-6 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${sim.shimmer} 50%, transparent)` }}
          />

          {/* Bottom fog gradient */}
          <div
            className="pointer-events-none absolute bottom-0 inset-x-0 h-32"
            style={{ background: `linear-gradient(to top, ${sim.fog} 0%, transparent 100%)` }}
          />

          {/* Label row — same layout as explore Card3D */}
          <div className={`absolute bottom-0 inset-x-0 ${sim.colSpan ? 'p-5 md:p-6' : 'p-4 md:p-5'} flex items-end justify-between`}>
            <div>
              <p className={`${sim.colSpan ? 'text-[9px]' : 'text-[8px]'} uppercase tracking-[0.28em] text-white/30 mb-1`}>
                {sim.label}
              </p>
              <div className="flex items-center gap-1.5">
                <sim.icon className={`${sim.colSpan ? 'h-4 w-4' : 'h-3.5 w-3.5'} ${sim.iconColor}`} />
                <span className={`${sim.colSpan ? 'text-xl' : 'text-base'} font-semibold text-white/88 tracking-wide`}>
                  {sim.title}
                </span>
              </div>
            </div>
            <span
              className={`${sim.colSpan ? 'text-[9px] px-3 py-1.5' : 'text-[8px] px-2.5 py-1'} font-semibold uppercase tracking-[0.20em] rounded-full`}
              style={{
                background: sim.badgeBg,
                border: `1px solid ${sim.badgeBorder}`,
                color: sim.badgeText,
              }}
            >
              {sim.badge}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
