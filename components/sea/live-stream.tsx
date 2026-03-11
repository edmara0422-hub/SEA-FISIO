'use client'

import { useEffect, useState } from 'react'
import { GlassPanel } from '@/components/sea/glass-panel'
import { Badge } from '@/components/ui/badge'
import { Activity, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface LiveUpdate {
  id: string
  type: 'calculation' | 'alert' | 'sync'
  message: string
  timestamp: Date
  severity: 'info' | 'warning' | 'critical'
}

export function LiveStream() {
  const [updates, setUpdates] = useState<LiveUpdate[]>([
    {
      id: '1',
      type: 'calculation',
      message: 'Cálculo de VM finalizado - Compliance: 28 mL/cmH₂O',
      timestamp: new Date(),
      severity: 'info',
    },
  ])
  const [connectionStatus, setConnectionStatus] = useState('connected')

  useEffect(() => {
    const eventSource = new EventSource('/api/stream/updates')

    eventSource.onopen = () => setConnectionStatus('connected')

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setUpdates((prev) => [
        {
          id: String(Date.now()),
          ...data,
          timestamp: new Date(),
        },
        ...prev.slice(0, 9),
      ])
    }

    eventSource.onerror = () => {
      setConnectionStatus('disconnected')
      eventSource.close()
    }

    return () => eventSource.close()
  }, [])

  return (
    <GlassPanel title="Live Stream de Atualizações" subtitle="Sincronização em tempo real">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <motion.div
            className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
            }`}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <span className="text-xs text-white/60 capitalize">{connectionStatus}</span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {updates.map((update) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-2 items-start text-xs bg-white/5 p-2 rounded border border-white/10"
            >
              <Activity className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-400" />
              <div className="flex-1 min-w-0">
                <p className="text-white/90 truncate">{update.message}</p>
                <p className="text-white/40 text-[10px]">
                  {update.timestamp.toLocaleTimeString('pt-BR')}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] flex-shrink-0 ${
                  update.severity === 'critical'
                    ? 'border-red-500/50 text-red-300'
                    : 'border-blue-500/50 text-blue-300'
                }`}
              >
                {update.severity}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassPanel>
  )
}
