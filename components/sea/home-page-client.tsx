'use client'

import dynamic from 'next/dynamic'
import BusinessClock from '@/components/sea/greeting-clock-card'
import { PerformanceBar } from '@/components/sea/performance-bar'
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
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020202] text-white">
      <SeaBackdrop />
      <TopBarSEA />

      <main className="relative z-10 px-4 pb-32 pt-[4.5rem] md:px-8 md:pt-20">
        <div className="mx-auto max-w-2xl">

          {/* Greeting + Clock */}
          <div className="mb-6">
            <BusinessClock variant="hero" showGreeting />
          </div>

          {/* Divider subtle */}
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 50%, transparent)' }} />
            <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-white/16">Simulacoes</span>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 50%, transparent)' }} />
          </div>

          {/* 3D Simulation Cards */}
          <SimulationsGrid />

          {/* Performance */}
          <div className="mt-5">
            <PerformanceBar />
          </div>
        </div>
      </main>
    </div>
  )
}

function SimulationsFallback() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="sea-dark-glass md:col-span-2 rounded-[1.75rem] p-5">
        <div className="h-5 w-40 rounded-full bg-white/10" />
        <div className="mt-3 h-3 w-72 max-w-full rounded-full bg-white/6" />
        <div className="sea-dark-glass mt-5 h-72 rounded-[1.4rem] border border-white/8" />
      </div>
      <div className="sea-dark-glass rounded-[1.75rem] p-5">
        <div className="h-5 w-32 rounded-full bg-white/10" />
        <div className="sea-dark-glass mt-4 h-56 rounded-[1.4rem] border border-white/8" />
      </div>
      <div className="sea-dark-glass rounded-[1.75rem] p-5">
        <div className="h-5 w-32 rounded-full bg-white/10" />
        <div className="sea-dark-glass mt-4 h-56 rounded-[1.4rem] border border-white/8" />
      </div>
    </div>
  )
}
