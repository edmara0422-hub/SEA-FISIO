'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Activity, Brain, Wind } from 'lucide-react'
import { GreetingClockCard } from '@/components/sea/greeting-clock-card'
import { PerformanceBar } from '@/components/sea/performance-bar'
import { PremiumSplash } from '@/components/sea/premium-splash'
import { SeaBackdrop } from '@/components/sea/sea-backdrop'
import { TopBarSEA } from '@/components/sea/top-bar-sea'

const SimulationsGrid = dynamic(
  () => import('@/components/sea/simulations-grid').then((mod) => mod.SimulationsGrid),
  {
    ssr: false,
    loading: () => <SimulationsFallback />,
  }
)

export default function HomePageClient() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <>
      {showSplash ? (
        <PremiumSplash durationMs={8200} exitHoldMs={1200} onComplete={() => setShowSplash(false)} />
      ) : null}

      <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
        <SeaBackdrop />
        <TopBarSEA />

        <main className="relative z-10 px-4 pb-32 pt-24 md:px-8 md:pt-28">
          <div className="mx-auto max-w-7xl space-y-6">
            <GreetingClockCard />

            <motion.section
              className="chrome-card overflow-hidden rounded-[2rem] p-5 md:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
                    SEA Home
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-[3.4rem]">
                    Centro de simulacoes clinicas com leitura viva.
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/56 md:text-base">
                    Neuro, pneumo e cardio permanecem como o nucleo visual da entrada, agora
                    apoiados por uma shell cromada mais limpa.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <SignalTag icon={Brain} label="Neuro" />
                  <SignalTag icon={Wind} label="Pneumo" />
                  <SignalTag icon={Activity} label="Cardio" />
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  Simulacoes
                </span>
                <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,255,255,0.18),transparent)]" />
              </div>
              <SimulationsGrid />
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  Fidelidade
                </span>
                <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,255,255,0.18),transparent)]" />
              </div>
              <PerformanceBar />
            </motion.section>
          </div>
        </main>
      </div>
    </>
  )
}

function SignalTag({
  icon: Icon,
  label,
}: {
  icon: typeof Brain
  label: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
      <Icon className="h-3.5 w-3.5 text-white/74" />
      <span>{label}</span>
    </div>
  )
}

function SimulationsFallback() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="chrome-card md:col-span-2 rounded-[1.75rem] p-5">
        <div className="h-5 w-40 rounded-full bg-white/10" />
        <div className="mt-3 h-3 w-72 max-w-full rounded-full bg-white/6" />
        <div className="mt-5 h-72 rounded-[1.4rem] border border-white/8 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_58%)]" />
      </div>
      <div className="chrome-card rounded-[1.75rem] p-5">
        <div className="h-5 w-32 rounded-full bg-white/10" />
        <div className="mt-4 h-56 rounded-[1.4rem] border border-white/8 bg-white/[0.03]" />
      </div>
      <div className="chrome-card rounded-[1.75rem] p-5">
        <div className="h-5 w-32 rounded-full bg-white/10" />
        <div className="mt-4 h-56 rounded-[1.4rem] border border-white/8 bg-white/[0.03]" />
      </div>
    </div>
  )
}
