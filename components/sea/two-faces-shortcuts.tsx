'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Cpu, ArrowRight } from 'lucide-react'

export function TwoFacesShortcuts() {
  return (
    <motion.div
      className="grid grid-cols-2 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Content Face */}
      <Link href="/explore?filter=conteudos">
        <motion.div
          className="h-full cursor-pointer rounded-[1.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 transition-all group hover:border-white/20 hover:bg-white/[0.06]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex flex-col items-start justify-between h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl border border-white/10 bg-black/20 p-3 transition-colors group-hover:bg-black/30">
                <BookOpen className="w-5 h-5 text-silver-light" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Conteúdo</h3>
                <p className="text-xs text-white/46">Cursos e Vídeos</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/62 transition-transform group-hover:translate-x-1">
              <span>Explorar</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Systems Face */}
      <Link href="/explore?filter=sistemas">
        <motion.div
          className="h-full cursor-pointer rounded-[1.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 transition-all group hover:border-white/20 hover:bg-white/[0.06]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex flex-col items-start justify-between h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl border border-white/10 bg-black/20 p-3 transition-colors group-hover:bg-black/30">
                <Cpu className="w-5 h-5 text-silver-light" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Sistemas</h3>
                <p className="text-xs text-white/46">Ferramentas e Simuladores</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/62 transition-transform group-hover:translate-x-1">
              <span>Explorar</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
