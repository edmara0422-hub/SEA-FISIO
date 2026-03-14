'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Calculator, FileText } from 'lucide-react'
import Link from 'next/link'
import { SeaBackdrop } from '@/components/sea/sea-backdrop'
import { ProntuarioSystemPanel } from '@/components/sea/prontuario-system-panel'
import { StudyRailBoard } from '@/components/sea/study-rail-board'
import { VMSystemPanel } from '@/components/sea/vm-system-panel'

const systemModules = [
  {
    id: 'S1',
    title: 'Prontuario ICU',
    icon: FileText,
    description: '',
    panel: <ProntuarioSystemPanel />,
  },
  {
    id: 'S2',
    title: 'Calculadoras',
    icon: Calculator,
    description: '',
    panel: <VMSystemPanel />,
  },
]

export default function SistemasPageClient() {
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
            icon={Calculator}
            itemLabel="sistema"
            actionLabel={null}
            readingLabel="em uso"
            hideDetailHeader
          />
        </div>
      </main>
    </div>
  )
}
