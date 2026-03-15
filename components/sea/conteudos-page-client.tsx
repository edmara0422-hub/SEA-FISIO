'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Brain, Heart, Wind } from 'lucide-react'
import Link from 'next/link'
import { SeaBackdrop } from '@/components/sea/sea-backdrop'
import { StudyRailBoard } from '@/components/sea/study-rail-board'

const contentModules = [
  {
    id: 'M1',
    title: 'Neuro',
    icon: Brain,
    description: 'Base do trilho neuro com leitura inicial do sistema nervoso.',
    content:
      'Trilho inicial de neuro com foco em plasticidade, mapas funcionais, correlacoes clinicas e leitura estruturada da experiencia neural dentro do SEA.',
  },
  {
    id: 'M2',
    title: 'Pneumo / VM',
    icon: Wind,
    description: 'Base do trilho respiratorio e ventilatorio.',
    content:
      'Trilho de pneumo e ventilacao mecanica com abertura para curvas, parametros, logica de ajuste e interpretacao aplicada ao estudo clinico.',
  },
  {
    id: 'M3',
    title: 'Cardio',
    icon: Heart,
    description: 'Base do trilho cardiaco com leitura progressiva.',
    content:
      'Trilho cardio para estudo de sinais, comportamento hemodinamico, leitura de resposta e consolidacao de raciocinio clinico dentro da plataforma.',
  },
]

export default function ConteudosPageClient() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020202] text-white">
      <SeaBackdrop />

      <main className="relative z-10 px-4 pb-32 pt-8 md:px-8 md:pt-10">
        <div className="mx-auto max-w-4xl space-y-6">

          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/explore">
              <motion.div
                whileTap={{ scale: 0.92 }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/4 transition-colors hover:bg-white/8"
              >
                <ArrowLeft className="h-4 w-4 text-white/60" />
              </motion.div>
            </Link>
            <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),transparent)]" />
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-white/30" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/30">Conteudos</span>
            </div>
          </div>

          <StudyRailBoard badge="Conteudos" modules={contentModules} icon={BookOpen} />
        </div>
      </main>
    </div>
  )
}
