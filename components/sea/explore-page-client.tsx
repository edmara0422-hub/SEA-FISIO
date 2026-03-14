'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { BookOpen, ChevronRight, Cpu, HeartPulse, Brain, Wind } from 'lucide-react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { GreetingClockCard } from '@/components/sea/greeting-clock-card'
import { SeaBackdrop } from '@/components/sea/sea-backdrop'

const BrainHeroScene = dynamic(
  () => import('@/components/experience/brain-hero-scene').then((mod) => mod.BrainHeroScene),
  { ssr: false, loading: () => <SimulationFallback label="Neuro" /> }
)

const CardioHeroScene = dynamic(
  () => import('@/components/experience/cardio-hero-scene').then((mod) => mod.CardioHeroScene),
  { ssr: false, loading: () => <SimulationFallback label="Cardio" /> }
)

const PneumoHeroScene = dynamic(
  () => import('@/components/experience/pneumo-hero-scene').then((mod) => mod.PneumoHeroScene),
  { ssr: false, loading: () => <SimulationFallback label="Pneumo" /> }
)

const railTransition = { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }

export default function ExplorePageClient() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020202] text-white">
      <SeaBackdrop />

      <main className="relative z-10 px-4 pb-32 pt-8 md:px-8 md:pt-10">
        <div className="mx-auto max-w-7xl space-y-5">
          <GreetingClockCard />

          <section className="space-y-4">
            <motion.div
              className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={railTransition}
            >
              <FeatureCard
                href="/explore/conteudos"
                icon={BookOpen}
                title="Conteudos"
                tone="conteudos"
                delay={0.04}
              />

              <FeatureCard
                href="/explore/sistemas"
                icon={Cpu}
                title="Sistemas"
                tone="sistemas"
                delay={0.1}
              />

              <SimulationCard />
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  )
}

function FeatureCard({
  href,
  icon: Icon,
  title,
  tone,
  delay,
}: {
  href: string
  icon: typeof BookOpen
  title: string
  tone: 'conteudos' | 'sistemas'
  delay: number
}) {
  const accent =
    tone === 'conteudos'
      ? 'from-white/14 via-white/4 to-transparent'
      : 'from-white/12 via-slate-200/5 to-transparent'

  return (
    <motion.div
      className="block min-w-[86%] snap-center text-left md:min-w-[48%] xl:min-w-[32%]"
      initial={{ opacity: 0, x: 36 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...railTransition, delay }}
      whileTap={{ scale: 0.985 }}
    >
      <Link href={href} prefetch className="block">
        <article className="sea-dark-glass group relative h-[26rem] overflow-hidden rounded-[2rem] border border-white/12 p-6">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.04),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(255,255,255,0.08),transparent_26%)]" />
          <div className={`pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b ${accent}`} />
          <div className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,transparent_68%)] blur-3xl" />
          <div className="pointer-events-none absolute inset-x-6 top-6 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.34)_50%,transparent_100%)]" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="sea-dark-glass flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-white/12">
                <Icon className="h-6 w-6 text-white/78" />
              </div>
              <ChevronRight className="h-5 w-5 text-white/28 transition group-hover:text-white/56" />
            </div>

            <div className="space-y-4">
              <div className="h-px w-16 bg-[linear-gradient(90deg,rgba(255,255,255,0.72),transparent)]" />
              <h2 className="metal-text text-[2.2rem] font-semibold leading-none tracking-[0.14em] md:text-[2.7rem]">
                {title}
              </h2>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}

function SimulationCard() {
  return (
    <motion.article
      className="sea-dark-glass relative min-w-[86%] snap-center overflow-hidden rounded-[2rem] border border-white/12 p-6 md:min-w-[48%] xl:min-w-[52%]"
      initial={{ opacity: 0, x: 36 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...railTransition, delay: 0.16 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.04),transparent_28%),radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(214,220,228,0.08),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-x-6 top-6 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.34)_50%,transparent_100%)]" />

      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="sea-dark-glass flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-white/12">
            <HeartPulse className="h-6 w-6 text-white/78" />
          </div>
          <h2 className="metal-text text-[1.2rem] font-semibold uppercase tracking-[0.22em]">
            Simulacoes Reais
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SimulationViewport label="Neuro" icon={Brain}>
            <BrainHeroScene compact transparent />
          </SimulationViewport>
          <SimulationViewport label="Cardio" icon={HeartPulse}>
            <CardioHeroScene transparent />
          </SimulationViewport>
          <SimulationViewport label="Pneumo" icon={Wind}>
            <PneumoHeroScene transparent />
          </SimulationViewport>
        </div>
      </div>
    </motion.article>
  )
}

function SimulationViewport({
  children,
  label,
  icon: Icon,
}: {
  children: ReactNode
  label: string
  icon: typeof Brain
}) {
  return (
    <div className="space-y-3">
      <div
        className="relative h-56 overflow-hidden rounded-[1.6rem] border border-white/12 shadow-[0_18px_42px_rgba(0,0,0,0.26)]"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(24,26,30,0.58) 44%, rgba(10,11,14,0.72) 100%)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.14),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_20%)]" />
        <div className="absolute inset-0">{children}</div>
      </div>
      <div className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-white/58">
        <Icon className="h-4 w-4 text-white/62" />
        <span>{label}</span>
      </div>
    </div>
  )
}

function SimulationFallback({ label }: { label: string }) {
  return (
    <div className="flex h-full items-end rounded-[1.6rem] bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(16,18,22,0.4)_36%,rgba(7,8,10,0.08)_100%)] p-4">
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">{label}</p>
        <div className="flex gap-2">
          <span className="h-2 w-2 rounded-full bg-white/40" />
          <span className="h-2 w-2 rounded-full bg-white/24" />
          <span className="h-2 w-2 rounded-full bg-white/14" />
        </div>
      </div>
    </div>
  )
}
