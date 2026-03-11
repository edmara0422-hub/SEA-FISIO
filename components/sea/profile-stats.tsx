'use client'

import { GlassCard } from './glass-card'
import { Clock, BookOpen, Flame, Trophy } from 'lucide-react'

const stats = [
  { icon: Clock, label: 'Tempo total', value: '24h 35m' },
  { icon: BookOpen, label: 'Conteudos', value: '47' },
  { icon: Flame, label: 'Streak', value: '12 dias' },
  { icon: Trophy, label: 'Conquistas', value: '8' },
]

export function ProfileStats() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <GlassCard key={index} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
                <Icon className="w-5 h-5 text-silver-light/60" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{stat.value}</p>
                <p className="text-[10px] text-silver-light/50">{stat.label}</p>
              </div>
            </div>
          </GlassCard>
        )
      })}
    </div>
  )
}
