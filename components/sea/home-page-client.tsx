'use client'

import dynamic from 'next/dynamic'
import { useLayoutEffect, useState } from 'react'
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
  const [showSplash, setShowSplash] = useState<boolean | null>(null)

  useLayoutEffect(() => {
    const skipNextSplash = window.sessionStorage.getItem('sea-skip-next-splash')

    if (skipNextSplash === '1') {
      window.sessionStorage.removeItem('sea-skip-next-splash')
      setShowSplash(false)
      return
    }

    setShowSplash(true)
  }, [])

  return (
    <>
      {showSplash === true ? (
        <PremiumSplash durationMs={8200} exitHoldMs={1200} onComplete={() => setShowSplash(false)} />
      ) : null}

      <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
        <SeaBackdrop />
        <TopBarSEA />

        <main className="relative z-10 px-4 pb-32 pt-24 md:px-8 md:pt-28">
          <div className="mx-auto max-w-7xl space-y-5">
            <GreetingClockCard />
            <SimulationsGrid />
            <PerformanceBar />
          </div>
        </main>
      </div>
    </>
  )
}

function SimulationsFallback() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="sea-dark-glass md:col-span-2 rounded-[1.75rem] p-5">
        <div className="h-5 w-40 rounded-full bg-white/10" />
        <div className="mt-3 h-3 w-72 max-w-full rounded-full bg-white/6" />
        <div className="mt-5 h-72 rounded-[1.4rem] border border-white/8 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_58%)]" />
      </div>
      <div className="sea-dark-glass rounded-[1.75rem] p-5">
        <div className="h-5 w-32 rounded-full bg-white/10" />
        <div className="mt-4 h-56 rounded-[1.4rem] border border-white/8 bg-black/18" />
      </div>
      <div className="sea-dark-glass rounded-[1.75rem] p-5">
        <div className="h-5 w-32 rounded-full bg-white/10" />
        <div className="mt-4 h-56 rounded-[1.4rem] border border-white/8 bg-black/18" />
      </div>
    </div>
  )
}
