'use client'

import { motion } from 'framer-motion'
import { Brain, Sparkles, Settings, Wrench, ChevronRight } from 'lucide-react'

const pills = [
  { id: 'ia', label: 'IA Adaptativa', icon: Sparkles },
  { id: 'sim', label: 'Simulacoes', icon: Brain },
  { id: 'pers', label: 'Personalizacao', icon: Settings },
  { id: 'tools', label: 'Ferramentas', icon: Wrench },
]

export function QuickAccessPills() {
  return (
    <div className="px-4 py-3">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {pills.map((pill, index) => {
          const Icon = pill.icon
          return (
            <motion.button
              key={pill.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 glass rounded-full hover:bg-white/[0.06] transition-all group"
            >
              <Icon className="w-4 h-4 text-silver-light" />
              <span className="text-sm text-white whitespace-nowrap">{pill.label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-silver-light/50 group-hover:text-silver-light group-hover:translate-x-0.5 transition-all" />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
