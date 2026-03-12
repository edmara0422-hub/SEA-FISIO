'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Brain, FileText, GraduationCap, Wind } from 'lucide-react'
import Link from 'next/link'
import { SeaBackdrop } from '@/components/sea/sea-backdrop'
import { StudyRailBoard } from '@/components/sea/study-rail-board'

const contentModules = [
  {
    id: 'M1',
    title: 'Ventilacao Mecanica',
    icon: Wind,
    description: 'Fundamentos iniciais do trilho respiratorio.',
    content:
      'Modulo dedicado a base de ventilacao mecanica, leitura inicial de curvas, parametros de ajuste e interpretacao clinica essencial para estudo progressivo.',
  },
  {
    id: 'M2',
    title: 'Neuroplasticidade Avancada',
    icon: Brain,
    description: 'Fundamentos de reorganizacao neural.',
    content:
      'Modulo focado em neuroplasticidade, resposta adaptativa do sistema nervoso, estrategias de reabilitacao e leitura integrada de estimulos e funcao.',
  },
  {
    id: 'M3',
    title: 'Artigos e Sinteses',
    icon: FileText,
    description: 'Leitura guiada de artigos e resumos.',
    content:
      'Espaco para leitura estruturada, sintese de conceitos, anotacao de pontos-chave e consolidacao do raciocinio antes de avancar no trilho.',
  },
  {
    id: 'M4',
    title: 'Trilha de Certificacao',
    icon: GraduationCap,
    description: 'Organizacao do progresso educacional.',
    content:
      'Modulo pensado para organizar progresso por blocos de estudo, checkpoints de dominio e consolidacao de conhecimento aplicado ao produto.',
  },
]

export default function ConteudosPage() {
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
              Conteudos
            </h1>
          </div>

          <StudyRailBoard badge="Conteudos" modules={contentModules} icon={BookOpen} />
        </div>
      </main>
    </div>
  )
}
