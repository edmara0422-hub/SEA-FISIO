'use client'

import { useEffect, useState } from 'react'
import { GlassPanel } from '@/components/sea/glass-panel'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BarChart, Bar } from 'recharts'
import { TrendingUp, Users, AlertTriangle } from 'lucide-react'

interface AnalyticsData {
  time: string
  calculations: number
  exports: number
  errors: number
}

export function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsData[]>([
    { time: '09:00', calculations: 12, exports: 3, errors: 0 },
    { time: '10:00', calculations: 19, exports: 5, errors: 1 },
    { time: '11:00', calculations: 15, exports: 4, errors: 0 },
    { time: '12:00', calculations: 25, exports: 8, errors: 2 },
    { time: '13:00', calculations: 22, exports: 6, errors: 1 },
  ])

  const [stats, setStats] = useState({
    activeUsers: 24,
    totalEvents: 1250,
    errorRate: 0.8,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        activeUsers: Math.max(prev.activeUsers + Math.floor(Math.random() * 5) - 2, 10),
        totalEvents: prev.totalEvents + Math.floor(Math.random() * 50),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.5)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <GlassPanel title="Analytics em Tempo Real" subtitle="PostHog + Sentry">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/5 p-3 rounded border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] text-white/60">Usuários Ativos</span>
            </div>
            <p className="text-lg font-bold text-white">{stats.activeUsers}</p>
          </div>

          <div className="bg-white/5 p-3 rounded border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-[10px] text-white/60">Eventos</span>
            </div>
            <p className="text-lg font-bold text-white">{stats.totalEvents}</p>
          </div>

          <div className="bg-white/5 p-3 rounded border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-3 h-3 text-orange-400" />
              <span className="text-[10px] text-white/60">Taxa de Erro</span>
            </div>
            <p className="text-lg font-bold text-white">{stats.errorRate.toFixed(1)}%</p>
          </div>
        </div>

        <div className="h-32 bg-white/5 p-2 rounded border border-white/10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" height={20} style={{ fontSize: '10px' }} />
              <YAxis stroke="rgba(255,255,255,0.4)" width={30} style={{ fontSize: '10px' }} />
              <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }} />
              <Line type="monotone" dataKey="calculations" stroke="#3b82f6" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="errors" stroke="#ef4444" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassPanel>
  )
}
