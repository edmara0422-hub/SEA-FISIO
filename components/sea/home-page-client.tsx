'use client'

import dynamic from 'next/dynamic'
import { BookOpen, Cpu, Brain } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import BusinessClock from '@/components/sea/greeting-clock-card'
import { PerformanceBar } from '@/components/sea/performance-bar'
import { SeaBackdrop } from '@/components/sea/sea-backdrop'
import { TopBarSEA } from '@/components/sea/top-bar-sea'

const SimulationMarquee = dynamic(
  () => import('@/components/sea/simulation-marquee').then((m) => m.SimulationMarquee),
  { ssr: false, loading: () => <div className="h-[clamp(140px,24vw,190px)] animate-pulse rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }} /> }
)

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

        {/* ── 3D Marquee — single WebGL, all models ── */}
        <SimulationMarquee />

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
