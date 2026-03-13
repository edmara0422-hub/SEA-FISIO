'use client'

import { motion } from 'framer-motion'
import { Activity, ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'
import { SeaBackdrop } from '@/components/sea/sea-backdrop'
import { StudyRailBoard } from '@/components/sea/study-rail-board'

function EmptySystemPanel() {
  return <div className="chrome-panel min-h-[16rem] rounded-[1.45rem]" />
}

const systemModules = [
  {
    id: 'S1',
    title: 'Prontuario ICU',
    icon: FileText,
    description: '',
    panel: <EmptySystemPanel />,
  },
  {
    id: 'S2',
    title: 'Calculadoras VNI e VMI',
    icon: Activity,
    description: '',
    panel: <EmptySystemPanel />,
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
