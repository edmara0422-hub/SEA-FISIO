'use client'

import { motion } from 'framer-motion'
import { Activity, ArrowLeft, Brain, FileText, Heart, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { SeaBackdrop } from '@/components/sea/sea-backdrop'
import { StudyRailBoard } from '@/components/sea/study-rail-board'

const systemModules = [
  {
    id: 'M1',
    title: 'Calculadora VM',
    icon: Activity,
    description: 'Base do trilho ventilatorio.',
    content:
      'Modulo direcionado a calculos respiratorios, parametros de ventilacao, leitura de indices e organizacao progressiva da ferramenta dentro do fluxo de estudo.',
  },
  {
    id: 'M2',
    title: 'Analise Cardiaca',
    icon: Heart,
    description: 'Leitura cardiaca e interpretacao.',
    content:
      'Modulo voltado a leitura de ritmo, entendimento de intervalos, interpretacao de sinais e relacao entre comportamento do sistema e decisao clinica.',
  },
  {
    id: 'M3',
    title: 'Prontuario Eletronico',
    icon: FileText,
    description: 'Estrutura de registro e acompanhamento.',
    content:
      'Modulo pensado para uso organizado de historico, evolucao, registro de conduta e consolidacao dos dados ao longo da jornada do aluno.',
  },
  {
    id: 'M4',
    title: 'Analise Bioneural',
    icon: Brain,
    description: 'Leitura neural em camada avancada.',
    content:
      'Espaco para mapear a camada neuro, organizar correlacoes com plasticidade e entender a progressao de uma experiencia mais imersiva de estudo.',
  },
  {
    id: 'M5',
    title: 'MKT Vortex',
    icon: TrendingUp,
    description: 'Sistema de estrategia e crescimento.',
    content:
      'Modulo que estrutura visao de jornada, performance, posicionamento e camada de expansao do ecossistema sem sair da mesma experiencia de produto.',
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

          <StudyRailBoard badge="Sistemas" modules={systemModules} icon={Activity} />
        </div>
      </main>
    </div>
  )
}
