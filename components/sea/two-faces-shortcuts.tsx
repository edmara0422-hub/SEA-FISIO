'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg p-6 hover:from-blue-500/30 hover:to-blue-600/20 transition-all cursor-pointer group h-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex flex-col items-start justify-between h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                <BookOpen className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Conteúdo</h3>
                <p className="text-xs text-blue-200/60">Cursos e Vídeos</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-300 text-xs group-hover:translate-x-1 transition-transform">
              <span>Explorar</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Systems Face */}
      <Link href="/explore?filter=sistemas">
        <motion.div
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-lg p-6 hover:from-purple-500/30 hover:to-purple-600/20 transition-all cursor-pointer group h-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex flex-col items-start justify-between h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                <Cpu className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Sistemas</h3>
                <p className="text-xs text-purple-200/60">Ferramentas e Simuladores</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-purple-300 text-xs group-hover:translate-x-1 transition-transform">
              <span>Explorar</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
