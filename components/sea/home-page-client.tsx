'use client'

import dynamic from 'next/dynamic'
import { BookOpen, Cpu, Brain } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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

      <main className="relative z-10 px-4 pb-32 pt-28 md:px-8 md:pt-32">
        <div className="mx-auto max-w-2xl">
          {/* Greeting + Clock */}
          <div className="mb-8">
            <BusinessClock variant="hero" showGreeting />
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
    <div className="grid grid-cols-2 gap-2.5">
      <div className="col-span-2 rounded-[1.75rem] border border-white/8 p-5" style={{ height: 'clamp(260px, 42vw, 380px)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="h-5 w-40 rounded-full bg-white/8" />
        <div className="mt-3 h-3 w-60 rounded-full bg-white/4" />
      </div>
      <div className="rounded-[1.75rem] border border-white/8 p-4" style={{ height: 'clamp(200px, 34vw, 280px)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="h-4 w-24 rounded-full bg-white/8" />
      </div>
      <div className="rounded-[1.75rem] border border-white/8 p-4" style={{ height: 'clamp(200px, 34vw, 280px)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="h-4 w-24 rounded-full bg-white/8" />
      </div>
    </div>
  )
}
