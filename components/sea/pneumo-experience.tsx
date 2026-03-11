'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { generateVentilationData } from '@/lib/vmModel'

interface PneumoExperienceProps {
  respiratoryRate?: number
  peep?: number
  peakPressure?: number
  isActive?: boolean
}

export function PneumoExperience({
  respiratoryRate = 16,
  peep = 5,
  peakPressure = 25,
  isActive = true,
}: PneumoExperienceProps) {
  const [vmData, setVmData] = useState<Array<{ time: number; pressure: number }>>([])

  useEffect(() => {
    if (!isActive) return

    // Gera dados de ventilação
    const rawData = generateVentilationData({
      respiratoryRate,
      inspiratoryTime: 0.4, // I:E = 1:1.5
      peep,
      peakPressure,
      sampleRate: 100,
      cycles: 2,
    })

    // Formata para Recharts
    const cycleDuration = 60 / respiratoryRate
    const formattedData = rawData.map((value, index) => ({
      time: (index / 100) * 1000, // em ms
      pressure: value,
    }))

    setVmData(formattedData)
  }, [respiratoryRate, peep, peakPressure, isActive])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center rounded-lg bg-white/5 border border-white/10 p-6">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-white">Ventilação Mecânica</h3>
        <p className="text-sm text-white/60">{respiratoryRate} ciclos/min</p>
      </div>

      {vmData.length > 0 && (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={vmData}
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
              label={{ value: 'Pressão (cmH₂O)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
              formatter={(value: number) => value.toFixed(2)}
            />
            <Line
              type="monotone"
              dataKey="pressure"
              stroke="#00bfff"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <div className="mt-4 grid grid-cols-3 gap-4 w-full text-center text-xs text-white/70">
        <div>
          <span className="block text-white/40">FR</span>
          <span className="block font-semibold">{respiratoryRate}</span>
        </div>
        <div>
          <span className="block text-white/40">PEEP</span>
          <span className="block font-semibold">{peep} cmH₂O</span>
        </div>
        <div>
          <span className="block text-white/40">Pico</span>
          <span className="block font-semibold">{peakPressure} cmH₂O</span>
        </div>
      </div>
    </div>
  )
}
