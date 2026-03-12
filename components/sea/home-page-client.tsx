'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Brain, HeartPulse, Wind } from 'lucide-react'
import { GreetingHeader } from '@/components/sea/greeting-header'
import { PremiumSplash } from '@/components/sea/premium-splash'
import { HomeSection } from '@/components/sea/home-section'
import { QuickAccessPills } from '@/components/sea/quick-access-pills'
import { PerformanceBar } from '@/components/sea/performance-bar'
import { TwoFacesShortcuts } from '@/components/sea/two-faces-shortcuts'
import { SimulationsGrid } from '@/components/sea/simulations-grid'
import { BioneuralPanel } from '@/components/sea/bioneural-panel'
import { AlertsPanel } from '@/components/sea/alerts-panel'
import { BrainHeroScene } from '@/components/experience/brain-hero-scene'
import { CardioHeroScene } from '@/components/experience/cardio-hero-scene'
import { PneumoHeroScene } from '@/components/experience/pneumo-hero-scene'

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

export default function HomePageClient() {
  const [showSplash, setShowSplash] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
                  {isMounted ? <BrainHeroScene /> : <HeroSceneFallback label="Neuro core" tone="brain" />}
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
                    {isMounted ? <PneumoHeroScene /> : <HeroSceneFallback label="Pneumo engine" tone="pneumo" />}
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
                    {isMounted ? <CardioHeroScene /> : <HeroSceneFallback label="Cardio engine" tone="cardio" />}
                  </div>
                </motion.div>
              </div>
            </div>
          </HomeSection>

          <PerformanceBar />

          <HomeSection label="DOIS CAMINHOS" delay={0.12}>
            <TwoFacesShortcuts />
          </HomeSection>

          <HomeSection label="SIMULACOES CLINICAS" delay={0.18}>
            <SimulationsGrid />
          </HomeSection>

          <HomeSection label="PAINEL E ALERTAS" delay={0.24}>
            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <BioneuralPanel />
              <AlertsPanel />
            </div>
          </HomeSection>
        </div>
      </div>
    </>
  )
}
