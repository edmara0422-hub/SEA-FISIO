'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface HomeSectionProps {
  label: string
  children: ReactNode
  delay?: number
}

export function HomeSection({ label, children, delay = 0 }: HomeSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Label com efeito de gradiente */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: delay + 0.1 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-semibold">
            {label}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.15 }}
      >
        {children}
      </motion.div>
    </motion.section>
  )
}
