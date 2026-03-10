'use client'

import { GlassCard } from './glass-card'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const weeklyData = [
  { day: 'S', value: 40 },
  { day: 'T', value: 65 },
  { day: 'Q', value: 45 },
  { day: 'Q', value: 80 },
  { day: 'S', value: 55 },
  { day: 'S', value: 70 },
  { day: 'D', value: 50 },
]

export function AdminDashboard() {
  return (
    <GlassCard className="p-4">
      <h3 className="text-xs tracking-wider text-silver-light/80 uppercase font-medium mb-4">
        Dashboard Admin (Small Data)
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Weekly Activity */}
        <div>
          <p className="text-[10px] text-silver-light/60 mb-2">Atividade Semanal</p>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 8, fill: 'rgba(255,255,255,0.3)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide domain={[0, 100]} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* NPS Score */}
        <div>
          <p className="text-[10px] text-silver-light/60 mb-2">NPS Score</p>
          <div className="space-y-2">
            {/* Progress bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-white/40 to-white/60 rounded-full"
                style={{ width: '92%' }}
              />
            </div>
            <p className="text-[9px] text-silver-light/50">
              Sua Pontuacao de Neuroestrategia (6G): <span className="text-white font-medium">92</span>
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
