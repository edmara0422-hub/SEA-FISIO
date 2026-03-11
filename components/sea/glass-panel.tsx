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
        relative overflow-hidden rounded-2xl
        bg-white/[0.05] backdrop-blur-xl
        border border-white/10 hover:border-white/20
        transition-all duration-300
        shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
        ${className}
      `}
      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.3)' }}
      whileTap={{ scale: 0.98 }}
      {...motionProps}
    >
      {/* Gradient overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
            {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>

      {/* Animated border gradient effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 rounded-2xl" />
      </div>
    </motion.div>
  )
}
