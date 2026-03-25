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

// ── Simulation Strip: 3D scenes in perspective carousel ──
function SimulationStrip() {
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  // Auto-rotate every 4s
  useEffect(() => {
    timerRef.current = setInterval(() => setActive((v) => (v + 1) % SCENES.length), 4000)
    return () => clearInterval(timerRef.current)
  }, [])

  const handleClick = (i: number) => {
    setActive(i)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setActive((v) => (v + 1) % SCENES.length), 4000)
  }

  return (
    <div className="relative" style={{ perspective: '900px', perspectiveOrigin: '50% 50%' }}>
      {/* Track */}
      <div className="flex items-center justify-center gap-3 py-2" style={{ height: 'clamp(180px, 30vw, 260px)' }}>
        {SCENES.map((scene, i) => {
          const offset = i - active
          const isActive = offset === 0
          const SceneComp = scene.Scene
          const Icon = scene.icon

          return (
            <motion.div
              key={scene.id}
              onClick={() => handleClick(i)}
              className="relative shrink-0 cursor-pointer overflow-hidden"
              style={{
                width: isActive ? 'clamp(240px, 55vw, 360px)' : 'clamp(80px, 18vw, 120px)',
                height: '100%',
                borderRadius: isActive ? '1.5rem' : '1.2rem',
                border: `1px solid ${isActive ? `${scene.color}30` : 'rgba(255,255,255,0.06)'}`,
                transformStyle: 'preserve-3d',
              }}
              animate={{
                rotateY: offset < 0 ? 25 : offset > 0 ? -25 : 0,
                scale: isActive ? 1 : 0.88,
                opacity: isActive ? 1 : 0.5,
                z: isActive ? 40 : -20,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* 3D Scene */}
              <div className="absolute inset-0" style={{ background: '#050505' }}>
                {isActive && <SceneComp transparent />}
              </div>

              {/* Gradient overlay */}
              <div className="pointer-events-none absolute inset-0" style={{
                background: isActive
                  ? `linear-gradient(to top, ${scene.color}18 0%, transparent 50%)`
                  : 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)',
              }} />

              {/* Top shimmer */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{
                background: `linear-gradient(90deg, transparent, ${isActive ? scene.color + '40' : 'rgba(255,255,255,0.08)'} 50%, transparent)`,
              }} />

              {/* Label */}
              <div className="absolute bottom-0 inset-x-0 p-3">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3" style={{ color: isActive ? scene.color : 'rgba(255,255,255,0.4)' }} />
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs font-semibold tracking-wide"
                      style={{ color: `${scene.color}cc` }}
                    >
                      {scene.label}
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Dots */}
      <div className="mt-3 flex justify-center gap-2">
        {SCENES.map((scene, i) => (
          <button key={i} onClick={() => handleClick(i)} className="p-1">
            <motion.div
              animate={{
                width: active === i ? 20 : 5,
                background: active === i ? scene.color : 'rgba(255,255,255,0.15)',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="h-1 rounded-full"
            />
          </button>
        ))}
      </div>
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
