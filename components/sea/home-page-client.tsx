'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Brain, Activity, FlaskConical, Sparkles } from 'lucide-react'
import { GreetingHeader } from '@/components/sea/greeting-header'

const quickLinks = [
  {
    href: '/explore',
    title: 'Explorar trilhas',
    description: 'Acesse conteudos, sistemas e modulos interativos.',
    icon: Sparkles,
  },
  {
    href: '/lab/home-v2',
    title: 'Abrir laboratorio',
    description: 'Entrar nas simulacoes visuais e experiencias imersivas.',
    icon: FlaskConical,
  },
  {
    href: '/sistemas/calculadora-vm',
    title: 'Simulacao VM',
    description: 'Ir direto para a calculadora e monitor ventilatorio.',
    icon: Activity,
  },
]

export default function HomePageClient() {
  return (
    <div className="min-h-screen bg-[#050607] pb-28 text-white">
      <GreetingHeader userName="Usuario" />

      <section className="px-4 pb-6 pt-4">
        <motion.div
          className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/8 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-slate-300/8 blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/60">
              <Brain className="h-3.5 w-3.5" />
              SEA
            </div>

            <h1 className="mt-5 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
              Plataforma de estudo com simulacao, calculo e laboratorio clinico.
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-white/65 sm:text-base">
              A entrada ficou leve para abrir rapido. As experiencias mais pesadas continuam
              acessiveis sob demanda, sem travar a tela inicial.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
              >
                Entrar no app
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/lab/home-v2"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Abrir laboratorio
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-4 px-4">
        {quickLinks.map((item, index) => {
          const Icon = item.icon

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 + index * 0.08 }}
            >
              <Link
                href={item.href}
                className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-white/5 p-4 transition hover:border-white/16 hover:bg-white/[0.07]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/7">
                  <Icon className="h-5 w-5 text-white/80" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-white/55">{item.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
              </Link>
            </motion.div>
          )
        })}
      </section>
    </div>
  )
}
