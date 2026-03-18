'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { generateNeuralSignal, analyzeNeuralSignal } from '@/lib/neuroModel'

interface NeuroExperienceProps {
  frequency?: number
  duration?: number
  isActive?: boolean
}

export function NeuroExperience({
  frequency = 10, // Ritmo alfa
  duration = 3,
  isActive = true,
}: NeuroExperienceProps) {
  const [neuroData, setNeuroData] = useState<Array<{ time: number; signal: number }>>([])
  const [analysis, setAnalysis] = useState<any>(null)

  const formatTooltipValue = (value: string | number | (string | number)[]) => {
    const v = Array.isArray(value) ? value[0] : value
    const numericValue = typeof v === 'number' ? v : Number(v)
    return Number.isFinite(numericValue) ? numericValue.toFixed(3) : String(v)
  }

  useEffect(() => {
    if (!isActive) return

    const sampleRate = 250 // Hz
    const rawData = generateNeuralSignal({
      duration,
      sampleRate,
      frequency,
      amplitude: 1.0,
      burstProbability: 0.3,
    })

    // Formata para Recharts
    const formattedData = rawData.map((value, index) => ({
      time: (index / sampleRate) * 1000, // em ms
      signal: value,
    }))

    setNeuroData(formattedData)

    // Analisa o sinal
    const analysis = analyzeNeuralSignal(rawData)
    setAnalysis(analysis)
  }, [frequency, duration, isActive])

  const getFrequencyLabel = (freq: number) => {
    if (freq < 4) return 'Delta'
    if (freq < 8) return 'Theta'
    if (freq < 12) return 'Alpha'
    if (freq < 30) return 'Beta'
    return 'Gamma'
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center rounded-lg bg-white/5 border border-white/10 p-6">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-white">Atividade Neural</h3>
        <p className="text-sm text-white/60">{frequency} Hz ({getFrequencyLabel(frequency)})</p>
      </div>

      {neuroData.length > 0 && (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={neuroData}
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
              label={{ value: 'μV', angle: -90, position: 'insideLeft' }}
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
              dataKey="signal"
              stroke="#7c3aed"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {analysis && (
        <div className="mt-4 grid grid-cols-3 gap-4 w-full text-center text-xs text-white/70">
          <div>
            <span className="block text-white/40">Amplitude</span>
            <span className="block font-semibold">{analysis.stdDev.toFixed(2)}</span>
          </div>
          <div>
            <span className="block text-white/40">Ritmo</span>
            <span className="block font-semibold">{getFrequencyLabel(frequency)}</span>
          </div>
          <div>
            <span className="block text-white/40">Picos</span>
            <span className="block font-semibold">{analysis.peakCount}</span>
          </div>
        </div>
      )}
    </div>
  )
}
