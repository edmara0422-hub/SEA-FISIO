'use client'

import { motion } from 'framer-motion'
import { GlassCard } from './glass-card'

const funnelStages = [
  { label: 'Visitantes', value: 58, width: 100 },
  { label: 'Clientes', value: 32, width: 85 },
  { label: 'Leads', value: 26, width: 70 },
  { label: 'Qualificados', value: 16, width: 55 },
  { label: 'Clientes', value: 1, width: 40 },
]

function VortexFunnel() {
  return (
    <div className="relative flex flex-col items-center py-4">
      {/* Vortex visual */}
      <svg viewBox="0 0 120 140" className="w-full max-w-[180px]">
        {/* Spiral lines */}
        {[0, 1, 2, 3].map((i) => (
          <motion.ellipse
            key={i}
            cx="60"
            cy={30 + i * 25}
            rx={50 - i * 10}
            ry={12 - i * 2}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
        
        {/* Funnel shape */}
        <motion.path
          d="M10 25 Q60 40 110 25 L80 130 Q60 140 40 130 Z"
          fill="url(#vortexGradient)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="vortexGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
        </defs>
        
        {/* Swirl animation */}
        <motion.path
          d="M60 30 Q70 50 60 70 Q50 90 60 110"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
          strokeDasharray="5 5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>

      {/* Stage values */}
      <div className="absolute inset-0 flex flex-col justify-between py-2">
        {funnelStages.map((stage, i) => (
          <motion.div
            key={stage.label + i}
            className="flex items-center justify-end gap-2 pr-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <div className="flex flex-col items-end">
              <motion.span
                className="text-lg font-semibold text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
              >
                {stage.value}
              </motion.span>
              <span className="text-[8px] text-silver-light/50">{stage.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function MktVortexPanel() {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs tracking-wider text-silver-light/80 uppercase font-medium">
          MKT Conversion Vortex (6D)
        </h3>
      </div>
      
      <VortexFunnel />
      
      <div className="mt-2 pt-3 border-t border-white/5 text-center">
        <p className="text-[9px] text-silver-light/60">
          Neuroestrategia de Marketing & Branding
        </p>
      </div>
    </GlassCard>
  )
}
