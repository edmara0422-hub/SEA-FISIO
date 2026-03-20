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

      <main className="relative z-10 px-2.5 pb-32 pt-8 md:px-8 md:pt-10">
        <div className="mx-auto max-w-5xl space-y-6">

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
              <Calculator className="h-4 w-4 text-white/30" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/30">Sistemas</span>
            </div>
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
