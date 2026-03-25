'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { BookOpen, Cpu, Brain, HeartPulse, Wind } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import BusinessClock from '@/components/sea/greeting-clock-card'
import { PerformanceBar } from '@/components/sea/performance-bar'
import { SeaBackdrop } from '@/components/sea/sea-backdrop'
import { TopBarSEA } from '@/components/sea/top-bar-sea'

const BrainHeroScene = dynamic(
  () => import('@/components/experience/brain-hero-scene').then((m) => m.BrainHeroScene),
  { ssr: false }
)
const CardioHeroScene = dynamic(
  () => import('@/components/experience/cardio-hero-scene').then((m) => m.CardioHeroScene),
  { ssr: false }
)
const PneumoHeroScene = dynamic(
  () => import('@/components/experience/pneumo-hero-scene').then((m) => m.PneumoHeroScene),
  { ssr: false }
)

const SCENES = [
  { id: 'neuro', label: 'Neuro', icon: Brain, color: '#2dd4bf', Scene: BrainHeroScene },
  { id: 'cardio', label: 'Cardio', icon: HeartPulse, color: '#f87171', Scene: CardioHeroScene },
  { id: 'pneumo', label: 'Pneumo', icon: Wind, color: '#38bdf8', Scene: PneumoHeroScene },
] as const

export default function HomePageClient() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020202] text-white">
      <SeaBackdrop />
      <TopBarSEA />

      <main className="relative z-10 pb-32 pt-28 md:pt-32">
        <div className="mx-auto max-w-2xl px-4 md:px-8">
          {/* Greeting + Clock */}
          <div className="mb-8">
            <BusinessClock variant="hero" showGreeting />
          </div>
        </div>

        {/* ── Simulation Strip — fullwidth carousel ── */}
        <SimulationStrip />

        <div className="mx-auto max-w-2xl px-4 md:px-8">
          {/* Quick stats */}
          <div className="mt-8 grid grid-cols-3 gap-2">
            <QuickStat icon={BookOpen} label="Modulos" value="3" sub="Neuro · Cardio · Pneumo" />
            <QuickStat icon={Cpu} label="Simulacoes" value="40+" sub="Interativas" />
            <QuickStat icon={Brain} label="Topicos" value="14" sub="Conteudo clinico" />
          </div>

          {/* Performance */}
          <div className="mt-5">
            <PerformanceBar />
          </div>
        </div>
      </main>
    </div>
  )
}

// ── Simulation Strip: infinite marquee with 3D scenes ──
function SimulationStrip() {
  const [mounted, setMounted] = useState([false, false, false])

  useEffect(() => {
    const timers = [0, 300, 600].map((d, i) =>
      setTimeout(() => setMounted((p) => p.map((v, j) => j === i ? true : v)), d)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  // Duplicate items for seamless loop (3 original + 3 clone)
  const items = [...SCENES, ...SCENES]

  return (
    <div className="relative overflow-hidden" style={{ height: 'clamp(160px, 28vw, 220px)' }}>
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16" style={{ background: 'linear-gradient(to right, #020202, transparent)' }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16" style={{ background: 'linear-gradient(to left, #020202, transparent)' }} />

      {/* Perspective container */}
      <div className="h-full" style={{ perspective: '800px', perspectiveOrigin: '50% 50%' }}>
        {/* Scrolling track */}
        <div
          className="flex h-full items-center gap-4"
          style={{
            animation: 'marquee-strip 20s linear infinite',
            width: 'max-content',
          }}
        >
          {items.map((scene, i) => {
            const origIdx = i % SCENES.length
            const Icon = scene.icon

            return (
              <div
                key={`${scene.id}-${i}`}
                className="relative shrink-0 overflow-hidden"
                style={{
                  width: 'clamp(200px, 40vw, 280px)',
                  height: '85%',
                  borderRadius: '1.4rem',
                  border: `1px solid ${scene.color}18`,
                  background: '#050505',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(-8deg)',
                }}
              >
                {/* 3D Scene — only mount originals (not clones) to save GPU */}
                <div className="absolute inset-0">
                  {i < SCENES.length && mounted[origIdx] && <scene.Scene transparent />}
                </div>

                {/* Color glow at bottom */}
                <div className="pointer-events-none absolute inset-0" style={{
                  background: `linear-gradient(to top, ${scene.color}12 0%, transparent 40%)`,
                }} />

                {/* Top shimmer */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{
                  background: `linear-gradient(90deg, transparent, ${scene.color}30 50%, transparent)`,
                }} />

                {/* Label */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <Icon className="h-3 w-3" style={{ color: `${scene.color}90` }} />
                  <span className="text-[10px] font-semibold tracking-wide" style={{ color: `${scene.color}80` }}>
                    {scene.label}
                  </span>
                </div>

                {/* Subtle badge */}
                <div className="absolute top-3 right-3">
                  <span className="rounded-full px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.2em]"
                    style={{ background: `${scene.color}10`, border: `1px solid ${scene.color}20`, color: `${scene.color}60` }}>
                    3D
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes marquee-strip {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

// ── Quick stat card ──
function QuickStat({ icon: Icon, label, value, sub }: { icon: typeof BookOpen; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/8 p-3 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <Icon className="mx-auto mb-1.5 h-4 w-4 text-white/25" />
      <p className="text-lg font-bold text-white/80">{value}</p>
      <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/30">{label}</p>
      <p className="mt-0.5 text-[7px] text-white/18">{sub}</p>
    </div>
  )
}
