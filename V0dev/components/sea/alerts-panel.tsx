'use client'

import { motion } from 'framer-motion'
import { GlassCard } from './glass-card'
import { Bell, MessageSquare, Lightbulb } from 'lucide-react'

const alerts = [
  { id: 1, icon: Bell, message: 'Simulacao Cardio concluida', time: '2min' },
  { id: 2, icon: MessageSquare, message: 'Feedback recebido', time: '15min' },
  { id: 3, icon: Lightbulb, message: 'Sugestao de novo modulo', time: '1h' },
]

export function AlertsPanel() {
  return (
    <GlassCard className="p-4">
      <h3 className="text-xs tracking-wider text-silver-light/80 uppercase font-medium mb-3">
        Alertas e Feedbacks Estrategicos
      </h3>
      
      <div className="space-y-2">
        {alerts.map((alert, index) => {
          const Icon = alert.icon
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-silver-light/60 group-hover:text-silver-light transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{alert.message}</p>
              </div>
              <span className="text-[10px] text-silver-light/40 flex-shrink-0">{alert.time}</span>
            </motion.div>
          )
        })}
      </div>
    </GlassCard>
  )
}
