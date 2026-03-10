'use client'

import { useState, useEffect } from 'react'
import { GlassPanel } from '@/components/sea/glass-panel'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Zap } from 'lucide-react'

interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  percentageRollout: number
}

export function FeatureFlagsPanel() {
  const [flags, setFlags] = useState<FeatureFlag[]>([
    {
      id: 'ai-clinical-insights',
      name: 'Insights IA Clínica',
      description: 'Análise automática com Assistente SEA',
      enabled: true,
      percentageRollout: 100,
    },
    {
      id: 'real-time-collab',
      name: 'Colaboração em Tempo Real',
      description: 'Edição simultânea de prontuários',
      enabled: true,
      percentageRollout: 75,
    },
    {
      id: 'voice-input',
      name: 'Entrada de Voz',
      description: 'Ditado de dados clínicos',
      enabled: false,
      percentageRollout: 0,
    },
    {
      id: 'predictive-alerts',
      name: 'Alertas Preditivos',
      description: 'ML para avisar sobre deterioração',
      enabled: false,
      percentageRollout: 10,
    },
  ])

  const toggleFlag = (id: string) => {
    setFlags((prev) =>
      prev.map((flag) =>
        flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
      )
    )
  }

  return (
    <GlassPanel title="Feature Flags" subtitle="Controle de experimentos">
      <div className="space-y-3">
        {flags.map((flag) => (
          <div
            key={flag.id}
            className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="font-medium text-white text-sm">{flag.name}</span>
              </div>
              <p className="text-xs text-white/60">{flag.description}</p>
              {flag.percentageRollout > 0 && flag.percentageRollout < 100 && (
                <Badge variant="outline" className="mt-1 text-[10px]">
                  {flag.percentageRollout}% rollout
                </Badge>
              )}
            </div>
            <Switch
              checked={flag.enabled}
              onCheckedChange={() => toggleFlag(flag.id)}
            />
          </div>
        ))}
      </div>
    </GlassPanel>
  )
}
