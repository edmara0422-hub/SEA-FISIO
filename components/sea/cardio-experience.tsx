'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { generateECGData } from '@/lib/ecgModel'

interface CardioExperienceProps {
  bpm?: number
  isActive?: boolean
}

export function CardioExperience({ bpm = 72, isActive = true }: CardioExperienceProps) {
  const [ecgData, setEcgData] = useState<Array<{ time: number; ecg: number }>>([])

  const formatTooltipValue = (value: string | number | (string | number)[]) => {
    const v = Array.isArray(value) ? value[0] : value
    const numericValue = typeof v === 'number' ? v : Number(v)
    return Number.isFinite(numericValue) ? numericValue.toFixed(3) : String(v)
  }

  useEffect(() => {
    if (!isActive) return

    // Gera dados de ECG
    const rawData = generateECGData({
      bpm,
      sampleRate: 250,
      beats: 4,
    })

    // Formata para Recharts
    const formattedData = rawData.map((point) => ({
      time: Math.round(point.t * 1000), // em ms
      ecg: point.value,
    }))

    setEcgData(formattedData)
  }, [bpm, isActive])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center rounded-lg bg-white/5 border border-white/10 p-6">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-white">Atividade Cardíaca</h3>
        <p className="text-sm text-white/60">{bpm} BPM</p>
      </div>

      {ecgData.length > 0 && (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={ecgData}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.3)"
              tick={{ fontSize: 12 }}
              label={{ value: 'Tempo (ms)', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              tick={{ fontSize: 12 }}
              domain={[-1.5, 1.5]}
              label={{ value: 'mV', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
              formatter={(value) => formatTooltipValue(value)}
            />
            <Line
              type="monotone"
              dataKey="ecg"
              stroke="#ff1744"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <div className="mt-4 grid grid-cols-3 gap-4 w-full text-center text-xs text-white/70">
        <div>
          <span className="block text-white/40">Frequência</span>
          <span className="block font-semibold">{bpm} bpm</span>
        </div>
        <div>
          <span className="block text-white/40">Ritmo</span>
          <span className="block font-semibold">Sinusal</span>
        </div>
        <div>
          <span className="block text-white/40">QTc</span>
          <span className="block font-semibold">420ms</span>
        </div>
      </div>
    </div>
  )
}
