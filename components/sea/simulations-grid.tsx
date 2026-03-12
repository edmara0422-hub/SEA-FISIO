'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Brain, HeartPulse, Wind } from 'lucide-react'
import { GlassPanel } from '@/components/sea/glass-panel'

const BrainHeroScene = dynamic(
  () => import('@/components/experience/brain-hero-scene').then((mod) => mod.BrainHeroScene),
  { ssr: false, loading: () => <SceneFallback label="Neuro core" tone="brain" /> }
)

const CardioHeroScene = dynamic(
  () => import('@/components/experience/cardio-hero-scene').then((mod) => mod.CardioHeroScene),
  { ssr: false, loading: () => <SceneFallback label="Cardio engine" tone="cardio" /> }
)

const PneumoHeroScene = dynamic(
  () => import('@/components/experience/pneumo-hero-scene').then((mod) => mod.PneumoHeroScene),
  { ssr: false, loading: () => <SceneFallback label="Pneumo engine" tone="pneumo" /> }
)

function SceneFallback({
  label,
  tone,
}: {
  label: string
  tone: 'brain' | 'cardio' | 'pneumo'
}) {
  const gradient =
    tone === 'brain'
      ? 'from-white/16 via-white/6 to-transparent'
      : tone === 'cardio'
      ? 'from-rose-500/18 via-red-300/8 to-transparent'
      : tone === 'pneumo'
        ? 'from-cyan-500/18 via-sky-300/8 to-transparent'
        : 'from-white/16 via-white/6 to-transparent'

  return (
    <div className={`flex h-full items-end rounded-2xl bg-gradient-to-br ${gradient} p-5`}>
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">{label}</p>
        <div className="mt-3 flex gap-2">
          <span className="h-2 w-2 rounded-full bg-white/40" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>
      </div>
    </div>
  )
}

export function SimulationsGrid() {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <GlassPanel
        title="Neuro"
        subtitle="Core neural"
        className="md:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="sea-dark-glass inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/55">
              <Brain className="h-3.5 w-3.5 text-silver-light" />
              Neuro Core
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MetricCard label="Frequencia" value="10 Hz" />
              <MetricCard label="Modo" value="Imersivo" />
            </div>
          </div>
          <div className="sea-dark-glass h-72 overflow-hidden rounded-2xl border border-white/10">
            <BrainHeroScene compact />
          </div>
        </div>
      </GlassPanel>

      <GlassPanel
        title="Pneumo"
        subtitle="Pulmao e loops"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="space-y-4">
          <div className="sea-dark-glass h-56 overflow-hidden rounded-2xl border border-cyan-400/18">
            <PneumoHeroScene />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-sm text-white/65">
              <Wind className="h-4 w-4 text-cyan-300" />
              Pneumo engine
            </div>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-200/80">
              PEEP 5
            </span>
          </div>
        </div>
      </GlassPanel>

      <GlassPanel
        title="Cardio"
        subtitle="Leitura cardiaca"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <div className="space-y-4">
          <div className="sea-dark-glass h-56 overflow-hidden rounded-2xl border border-rose-400/18">
            <CardioHeroScene />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-sm text-white/65">
              <HeartPulse className="h-4 w-4 text-rose-300" />
              Cardio engine
            </div>
            <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-rose-200/80">
              72 BPM
            </span>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="sea-dark-glass rounded-2xl border border-white/10 p-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  )
}
