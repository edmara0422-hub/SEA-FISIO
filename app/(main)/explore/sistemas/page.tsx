'use client'

import { motion } from 'framer-motion'
import { Activity, ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'
import { SeaBackdrop } from '@/components/sea/sea-backdrop'
import { StudyRailBoard } from '@/components/sea/study-rail-board'

const systemModules = [
  {
    id: 'S1',
    title: 'Prontuario',
    icon: FileText,
    description: 'Sistema base de registro e acompanhamento.',
    content:
      'Sistema de prontuario para organizar historico, evolucao, condutas e consolidacao dos dados clinicos dentro da mesma experiencia de estudo.',
  },
  {
    id: 'S2',
    title: 'Calculadoras VM',
    icon: Activity,
    description: 'Sistema de calculo ventilatorio.',
    content:
      'Sistema dedicado a calculos de ventilacao mecanica, parametros, indices e apoio rapido a tomada de decisao no fluxo respiratorio.',
  },
]

export default function SistemasPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020202] text-white">
      <SeaBackdrop />

      <main className="relative z-10 px-4 pb-32 pt-8 md:px-8 md:pt-10">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="flex items-center gap-4">
            <Link href="/explore">
              <motion.div
                className="chrome-subtle flex h-11 w-11 items-center justify-center rounded-[1rem]"
                whileTap={{ scale: 0.94 }}
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </motion.div>
            </Link>
            <h1 className="metal-text text-[1.4rem] font-semibold uppercase tracking-[0.24em] md:text-[1.7rem]">
              Sistemas
            </h1>
          </div>

          <StudyRailBoard
            badge="Sistemas"
            modules={systemModules}
            icon={Activity}
            itemLabel="sistema"
            actionLabel="Marcar como visto"
            readingLabel="em uso"
          />
        </div>
      </main>
    </div>
  )
}
