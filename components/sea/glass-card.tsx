'use client'

import { cn } from '@/lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'strong' | 'subtle'
  glow?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', glow = false, children, ...props }, ref) => {
    const variants = {
      default: 'glass',
      strong: 'glass-strong',
      subtle: 'bg-white/[0.02] backdrop-blur-md border border-white/[0.05]',
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          variants[variant],
          'rounded-2xl',
          glow && 'glow-silver-sm',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

GlassCard.displayName = 'GlassCard'
