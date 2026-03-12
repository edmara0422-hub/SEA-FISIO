'use client'

import { motion, MotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassPanelProps extends MotionProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
}

export function GlassPanel({ children, className = '', title, subtitle, ...motionProps }: GlassPanelProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl sea-dark-glass
        transition-all duration-300
        ${className}
      `}
      whileHover={{ scale: 1.01, borderColor: 'rgba(255,255,255,0.22)' }}
      whileTap={{ scale: 0.98 }}
      {...motionProps}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_22%)] pointer-events-none" />

      <div className="relative z-10 p-6">
        {title && (
          <div className="mb-4">
            <h3 className="mb-1 text-lg font-semibold text-white">{title}</h3>
            {subtitle && <p className="text-sm text-white/46">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_30%)]" />
      </div>
    </motion.div>
  )
}
