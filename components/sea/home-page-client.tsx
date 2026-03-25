'use client'

import dynamic from 'next/dynamic'
import { BookOpen, Cpu, Brain } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import BusinessClock from '@/components/sea/greeting-clock-card'
import { PerformanceBar } from '@/components/sea/performance-bar'
import { SeaBackdrop } from '@/components/sea/sea-backdrop'
import { TopBarSEA } from '@/components/sea/top-bar-sea'

const SimulationsMarquee = dynamic(
  () => import('@/components/sea/simulations-grid').then((mod) => mod.SimulationsMarquee),
  {
    ssr: false,
    loading: () => <div className="h-[clamp(210px,38vw,290px)] animate-pulse rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }} />,
  }
)

export default function HomePageClient() {
  return (
    <div className="relative overflow-hidden bg-[#020202] text-white">
      <SeaBackdrop />
      <TopBarSEA />

      <main className="relative z-10 px-4 pb-0 pt-28 md:px-8 md:pt-32">
        <div className="mx-auto max-w-2xl">
          {/* Greeting + Clock */}
          <div className="mb-8">
            <BusinessClock variant="hero" showGreeting />
          </div>

        </div>

        {/* 3D Simulations marquee — full width */}
        <SimulationsMarquee />

        <div className="mx-auto max-w-2xl">

          {/* Performance */}
          <div className="mt-5">
            <PerformanceBar />
          </div>
        </div>
      </main>
    </div>
  )
}

