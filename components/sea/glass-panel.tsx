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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.08),transparent_34%)] pointer-events-none" />

      <div className="relative z-10 p-6">
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
            {subtitle && <p className="text-sm text-white/46">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>

      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 via-transparent to-white/10" />
      </div>
    </motion.div>
  )
}
