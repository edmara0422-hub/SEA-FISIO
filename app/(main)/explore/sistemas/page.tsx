'use client'

import { motion } from 'framer-motion'
import { Activity, ArrowLeft, FileText } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { SeaBackdrop } from '@/components/sea/sea-backdrop'
import { StudyRailBoard } from '@/components/sea/study-rail-board'

const ProntuarioSystemPanel = dynamic(
  () => import('@/components/sea/prontuario-system-panel').then((module) => module.ProntuarioSystemPanel),
  {
    loading: () => (
      <div className="chrome-panel rounded-[1.45rem] p-5">
        <p className="text-sm text-white/56">Carregando prontuario ICU...</p>
      </div>
    ),
  }
)

const VMSystemPanel = dynamic(
  () => import('@/components/sea/vm-system-panel').then((module) => module.VMSystemPanel),
  {
    loading: () => (
      <div className="chrome-panel rounded-[1.45rem] p-5">
        <p className="text-sm text-white/56">Carregando calculadoras VM...</p>
      </div>
    ),
  }
)

const systemModules = [
  {
    id: 'S1',
    title: 'Prontuario ICU',
    icon: FileText,
    description: 'Prontuario com lixeira, calculadora ICU e acesso separado a referencia clinica dos arquivos icu*.js.',
    panel: <ProntuarioSystemPanel />,
  },
  {
    id: 'S2',
    title: 'Calculadoras VM',
    icon: Activity,
    description: 'Calculadoras ventilatorias em React, derivadas da logica do vm-calcs.js e unificadas ao shell do app.',
    panel: <VMSystemPanel />,
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
            actionLabel={null}
            readingLabel="em uso"
          />
        </div>
      </main>
    </div>
  )
}
