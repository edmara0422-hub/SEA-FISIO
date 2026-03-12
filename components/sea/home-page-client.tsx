'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Brain, FlaskConical, HeartPulse, Wind } from 'lucide-react'
import { GreetingHeader } from '@/components/sea/greeting-header'
import { GlassCard } from '@/components/sea/glass-card'
import { HomeSection } from '@/components/sea/home-section'
import { PerformanceBar } from '@/components/sea/performance-bar'
import { PremiumSplash } from '@/components/sea/premium-splash'
import { QuickAccessPills } from '@/components/sea/quick-access-pills'
import { TwoFacesShortcuts } from '@/components/sea/two-faces-shortcuts'

const SimulationsGrid = dynamic(
  () => import('@/components/sea/simulations-grid').then((mod) => mod.SimulationsGrid),
  {
    ssr: false,
    loading: () => <SimulationsFallback />,
  }
)

const labCards = [
  {
    href: '/lab/neuro-v2',
    title: 'Neuro Lab',
    description: 'Cena cerebral e leitura de sinais em um ambiente imersivo.',
    icon: Brain,
  },
  {
    href: '/lab/vmi-v2',
    title: 'VMI Lab',
    description: 'Loops, pulmao e mecanica ventilatoria em fluxo continuo.',
    icon: Wind,
  },
  {
    href: '/lab/cardio-v2',
    title: 'Cardio Lab',
    description: 'ECG, ritmo e atividade cardiaca com leitura visual viva.',
    icon: HeartPulse,
  },
]

export default function HomePageClient() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <>
      {showSplash ? (
        <PremiumSplash durationMs={8200} exitHoldMs={1200} onComplete={() => setShowSplash(false)} />
      ) : null}

      <div className="min-h-screen overflow-x-hidden bg-background pb-28 text-foreground">
        <GreetingHeader userName="Edmar" />
        <QuickAccessPills />

        <div className="space-y-6 px-4 pb-8">
          <HomeSection label="SEA Home" delay={0.05}>
            <GlassCard className="overflow-hidden border border-white/10 p-0" glow>
              <div className="grid gap-6 border-b border-white/8 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_40%)] px-5 py-5 md:grid-cols-[1.25fr_0.75fr] md:px-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-silver-light/80">
                    <FlaskConical className="h-3.5 w-3.5 text-white/80" />
                    Sistema de Estudo Avancado
                  </div>

                  <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-white md:text-4xl">
                    Estrutura SEA restaurada com splash e simulacoes novas integradas na home.
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58 md:text-base">
                    A base visual volta ao formato antigo do app e as experiencias novas de
                    cerebro, pulmao e cardio seguem na entrada, sem desmontar o resto do SEA.
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

                <div className="grid gap-3 text-sm text-white/70">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-silver-light/55">
                      Presenca clinica
                    </p>
                    <p className="mt-2 text-base font-semibold text-white">Neuro, pneumo e cardio</p>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      Canvases novos acoplados ao layout SEA, sem perder o fluxo do app.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-silver-light/55">
                        Acesso
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-white">Home</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-silver-light/55">
                        Estado
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-white">SEA</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </HomeSection>

          <HomeSection label="Centro de Simulacoes" delay={0.1}>
            <SimulationsGrid />
          </HomeSection>

          <HomeSection label="Fidelidade Estrategica" delay={0.15}>
            <PerformanceBar />
          </HomeSection>

          <HomeSection label="Dois Caminhos" delay={0.2}>
            <TwoFacesShortcuts />
          </HomeSection>

          <HomeSection label="Laboratorios" delay={0.25}>
            <div className="grid gap-4 md:grid-cols-3">
              {labCards.map((card) => {
                const Icon = card.icon

                return (
                  <Link key={card.href} href={card.href}>
                    <GlassCard className="h-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 transition-all hover:border-white/20">
                      <div className="flex items-start justify-between gap-4">
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                          <Icon className="h-5 w-5 text-silver-light" />
                        </div>
                        <ArrowRight className="mt-1 h-4 w-4 text-white/50" />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-white">{card.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/58">{card.description}</p>
                    </GlassCard>
                  </Link>
                )
              })}
            </div>
          </HomeSection>
        </div>
      </div>
    </>
  )
}

function SimulationsFallback() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="md:col-span-2 rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
        <div className="h-5 w-40 rounded-full bg-white/10" />
        <div className="mt-3 h-3 w-72 max-w-full rounded-full bg-white/6" />
        <div className="mt-5 h-72 rounded-[1.4rem] border border-white/8 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_58%)]" />
      </div>
      <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
        <div className="h-5 w-32 rounded-full bg-white/10" />
        <div className="mt-4 h-56 rounded-[1.4rem] border border-white/8 bg-white/[0.03]" />
      </div>
      <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
        <div className="h-5 w-32 rounded-full bg-white/10" />
        <div className="mt-4 h-56 rounded-[1.4rem] border border-white/8 bg-white/[0.03]" />
      </div>
    </div>
  )
}
