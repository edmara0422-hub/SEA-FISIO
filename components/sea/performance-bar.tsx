'use client'

import { GlassCard } from './glass-card'
import { TrendingDown, Users, Clock } from 'lucide-react'

const kpis = [
  { icon: TrendingDown, label: 'Churn mensal', value: '0', color: 'text-green-400' },
  { icon: Users, label: 'Indicacoes', value: '32' },
  { icon: Clock, label: 'Tempo medio', value: '18', unit: 'MINUTOS' },
]

export function PerformanceBar() {
  return (
    <GlassCard className="p-4">
      <h3 className="text-xs tracking-wider text-silver-light/80 uppercase font-medium mb-3">
        Performance e Fidelidade Estrategica
      </h3>
      
      <div className="flex items-center justify-between">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <div key={index} className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${kpi.color || 'text-silver-light/50'}`} />
              <div>
                <p className="text-[10px] text-silver-light/50">{kpi.label}:</p>
                <p className="text-sm font-semibold text-white">
                  {kpi.value}
                  {kpi.unit && <span className="text-[8px] text-silver-light/50 ml-1">{kpi.unit}</span>}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
