'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Brain, HeartPulse, Wind } from 'lucide-react'
import { GreetingHeader } from '@/components/sea/greeting-header'
import { PremiumSplash } from '@/components/sea/premium-splash'
import { HomeSection } from '@/components/sea/home-section'
import { QuickAccessPills } from '@/components/sea/quick-access-pills'
import { PerformanceBar } from '@/components/sea/performance-bar'
import { TwoFacesShortcuts } from '@/components/sea/two-faces-shortcuts'

function HeroSceneFallback({
  label,
  tone,
}: {
  label: string
  tone: 'brain' | 'cardio' | 'pneumo'
}) {
  const gradient =
    tone === 'cardio'
      ? 'from-red-500/16 via-red-300/6 to-transparent'
      : tone === 'pneumo'
        ? 'from-cyan-500/16 via-cyan-300/6 to-transparent'
        : 'from-violet-500/16 via-indigo-300/6 to-transparent'

  return (
    <div className={`flex h-full items-end rounded-[1.75rem] bg-gradient-to-br ${gradient} p-5`}>
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

const BrainHeroScene = dynamic(
  () => import('@/components/experience/brain-hero-scene').then((mod) => mod.BrainHeroScene),
  { ssr: false, loading: () => <HeroSceneFallback label="Neuro core" tone="brain" /> }
)

const CardioHeroScene = dynamic(
  () => import('@/components/experience/cardio-hero-scene').then((mod) => mod.CardioHeroScene),
  { ssr: false, loading: () => <HeroSceneFallback label="Cardio engine" tone="cardio" /> }
)

const PneumoHeroScene = dynamic(
  () => import('@/components/experience/pneumo-hero-scene').then((mod) => mod.PneumoHeroScene),
  { ssr: false, loading: () => <HeroSceneFallback label="Pneumo engine" tone="pneumo" /> }
)

const systemCards = [
  {
    href: '/lab/neuro-v2',
    title: 'Neuro Lab',
    description: 'Cena cerebral e leitura de sinais em ambiente imersivo.',
    icon: Brain,
  },
  {
    href: '/lab/vmi-v2',
    title: 'VMI Lab',
    description: 'Pulmao, loops e mecanica ventilatoria em fluxo continuo.',
    icon: Wind,
  },
  {
    href: '/lab/cardio-v2',
    title: 'Cardio Lab',
    description: 'Ritmo, ECG e atividade cardiaca com camada visual viva.',
    icon: HeartPulse,
  },
]

export default function HomePageClient() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <>
      {showSplash ? (
        <PremiumSplash
          redirectTo={null}
          durationMs={1800}
          onComplete={() => setShowSplash(false)}
        />
      ) : null}

      <div className="min-h-screen bg-[#050607] pb-28 text-white">
        <GreetingHeader userName="Usuario" />
        <QuickAccessPills />

        <div className="space-y-6 px-4 pb-8">
          <HomeSection label="SEA HOME" delay={0.05}>
            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
              <motion.div
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(110,132,255,0.18),_transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
              >
                <div className="border-b border-white/10 px-6 py-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/60">
                    <Brain className="h-3.5 w-3.5" />
                    Sistema de Estudo Avancado
                  </div>

                  <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    Home SEA com splash, presenca clinica e simulacoes visiveis logo na entrada.
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-6 text-white/62 sm:text-base">
                    A estrutura voltou ao padrao do V0dev, mas com as cenas novas de cerebro e
                    pulmao sustentando a linguagem tecnologica da plataforma.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/explore"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                    >
                      Explorar o SEA
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/sistemas/calculadora-vm"
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Abrir simulacao VM
                    </Link>
                  </div>
                </div>

                <div className="h-[30rem]">
                  <BrainHeroScene />
                </div>
              </motion.div>

              <div className="grid gap-6">
                <motion.div
                  className="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(14,165,233,0.12),rgba(255,255,255,0.03))]"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.14 }}
                >
                  <div className="border-b border-white/10 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/60">Pneumo Presence</p>
                    <h2 className="mt-2 text-xl font-semibold">Pulmao e mecanica respiratoria em foco</h2>
                  </div>
                  <div className="h-56">
                    <PneumoHeroScene />
                  </div>
                </motion.div>

                <motion.div
                  className="overflow-hidden rounded-[2rem] border border-red-400/20 bg-[linear-gradient(180deg,rgba(255,94,94,0.12),rgba(255,255,255,0.03))]"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.2 }}
                >
                  <div className="border-b border-white/10 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-red-200/60">Cardio Presence</p>
                    <h2 className="mt-2 text-xl font-semibold">Atividade cardiaca como camada de sistema vivo</h2>
                  </div>
                  <div className="h-56">
                    <CardioHeroScene />
                  </div>
                </motion.div>
              </div>
            </div>
          </HomeSection>

          <PerformanceBar />

          <HomeSection label="DOIS CAMINHOS" delay={0.12}>
            <TwoFacesShortcuts />
          </HomeSection>

          <HomeSection label="LABS E SISTEMAS" delay={0.18}>
            <div className="grid gap-4 lg:grid-cols-3">
              {systemCards.map((card, index) => {
                const Icon = card.icon

                return (
                  <motion.div
                    key={card.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.22 + index * 0.06 }}
                  >
                    <Link
                      href={card.href}
                      className="group flex h-full items-center gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
                        <Icon className="h-5 w-5 text-white/80" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-medium text-white">{card.title}</p>
                        <p className="mt-1 text-sm text-white/55">{card.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </HomeSection>
        </div>
      </div>
    </>
  )
}
