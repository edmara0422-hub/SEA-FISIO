'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Brain, HeartPulse, Sparkles, Wind } from 'lucide-react'

const BrainHeroScene = dynamic(
  () => import('@/components/experience/brain-hero-scene').then((mod) => mod.BrainHeroScene),
  { ssr: false, loading: () => <SceneFallback label="Neuro core" tone="brain" /> }
)

const CardioHeroScene = dynamic(
  () => import('@/components/experience/cardio-hero-scene').then((mod) => mod.CardioHeroScene),
  { ssr: false, loading: () => <SceneFallback label="Cardio engine" tone="cardio" /> }
)

const PneumoHeroScene = dynamic(
  () => import('@/components/experience/pneumo-hero-scene').then((mod) => mod.PneumoHeroScene),
  { ssr: false, loading: () => <SceneFallback label="Pneumo engine" tone="pneumo" /> }
)

const quickPills = [
  'IA Adaptativa',
  'Simulacoes',
  'Personalizacao',
  'Ferramentas',
]

const shortcutCards = [
  {
    href: '/explore?filter=conteudos',
    title: 'Conteudo',
    subtitle: 'Cursos e videos',
    tone: 'blue',
  },
  {
    href: '/explore?filter=sistemas',
    title: 'Sistemas',
    subtitle: 'Ferramentas e simuladores',
    tone: 'violet',
  },
]

const labCards = [
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

function SceneFallback({
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
        {children}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
    </div>
  )
}

function SplashOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-[#0a0a0a] transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 blur-sm" />
      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="bg-gradient-to-r from-white via-slate-200 to-blue-200 bg-clip-text text-6xl font-bold text-transparent md:text-7xl">
          SEA
        </h1>
        <p className="mt-4 text-lg tracking-wide text-white/60">Sistema de Estudo Avancado</p>
        <p className="mt-2 text-sm text-white/40">
          Tecnologia de ponta para simulacoes clinicas em tempo real
        </p>
        <div className="mt-10 flex gap-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-white [animation-delay:180ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-white [animation-delay:360ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-white [animation-delay:540ms]" />
        </div>
      </div>
    </div>
  )
}

export default function HomePageClient() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 1400)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      <SplashOverlay visible={showSplash} />

      <div className="min-h-screen bg-[#050607] pb-28 text-white">
        <header className="px-4 pb-3 pt-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-white/60">
              SEA
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-right">
              <p className="text-sm font-medium text-white">
                {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-[9px] uppercase tracking-[0.12em] text-white/45">Sistema de Estudo Avancado</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white">
            Bem-vindo ao <span className="text-white/75">SEA</span>
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Estrutura do app restaurada com os canvases novos na entrada.
          </p>
        </header>

        <section className="px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickPills.map((pill) => (
              <div
                key={pill}
                className="glass flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm text-white"
              >
                <Sparkles className="h-4 w-4 text-silver-light" />
                <span>{pill}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-6 px-4 pb-8">
          <section>
            <SectionLabel>SEA HOME</SectionLabel>
            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(110,132,255,0.18),_transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]">
                <div className="border-b border-white/10 px-6 py-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/60">
                    <Brain className="h-3.5 w-3.5" />
                    Sistema de Estudo Avancado
                  </div>

                  <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    Home SEA com splash, presenca clinica e simulacoes logo na entrada.
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-6 text-white/62 sm:text-base">
                    A estrutura foi trazida de volta e os canvases novos de cerebro, pulmao e
                    cardio ficaram preservados na home.
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
              </div>

              <div className="grid gap-6">
                <div className="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(14,165,233,0.12),rgba(255,255,255,0.03))]">
                  <div className="border-b border-white/10 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/60">Pneumo Presence</p>
                    <h3 className="mt-2 text-xl font-semibold">Pulmao e mecanica respiratoria em foco</h3>
                  </div>
                  <div className="h-56">
                    <PneumoHeroScene />
                  </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-red-400/20 bg-[linear-gradient(180deg,rgba(255,94,94,0.12),rgba(255,255,255,0.03))]">
                  <div className="border-b border-white/10 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-red-200/60">Cardio Presence</p>
                    <h3 className="mt-2 text-xl font-semibold">Atividade cardiaca como camada de sistema vivo</h3>
                  </div>
                  <div className="h-56">
                    <CardioHeroScene />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="glass rounded-2xl p-4">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-silver-light/80">
              Performance e Fidelidade Estrategica
            </h3>
            <div className="flex items-center justify-between gap-4 text-sm text-white">
              <div>
                <p className="text-[10px] text-silver-light/50">Churn mensal</p>
                <p className="font-semibold">0</p>
              </div>
              <div>
                <p className="text-[10px] text-silver-light/50">Indicacoes</p>
                <p className="font-semibold">32</p>
              </div>
              <div>
                <p className="text-[10px] text-silver-light/50">Tempo medio</p>
                <p className="font-semibold">18 min</p>
              </div>
            </div>
          </section>

          <section>
            <SectionLabel>DOIS CAMINHOS</SectionLabel>
            <div className="grid grid-cols-2 gap-4">
              {shortcutCards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className={`rounded-lg border p-6 transition ${
                    card.tone === 'blue'
                      ? 'border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-blue-600/10 hover:from-blue-500/30 hover:to-blue-600/20'
                      : 'border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-purple-600/10 hover:from-purple-500/30 hover:to-purple-600/20'
                  }`}
                >
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                  <p className="mt-1 text-xs text-white/60">{card.subtitle}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <SectionLabel>LABS E SISTEMAS</SectionLabel>
            <div className="grid gap-4 lg:grid-cols-3">
              {labCards.map((card) => {
                const Icon = card.icon

                return (
                  <Link
                    key={card.href}
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
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
