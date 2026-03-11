'use client'

import { useEffect, useRef } from 'react'

interface LoopPoint {
  x: number
  y: number
}

interface LoopCanvasProps {
  title: string
  xLabel: string
  yLabel: string
  points: LoopPoint[]
  stroke?: string
}

export function LoopCanvas({
  title,
  xLabel,
  yLabel,
  points,
  stroke = 'rgba(255,255,255,0.95)',
}: LoopCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || points.length === 0) return

    const context = canvas.getContext('2d')
    if (!context) return

    const ratio = window.devicePixelRatio || 1
    const bounds = canvas.getBoundingClientRect()
    const width = Math.max(1, Math.floor(bounds.width))
    const height = Math.max(1, Math.floor(bounds.height))

    canvas.width = width * ratio
    canvas.height = height * ratio
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, width, height)
    context.fillStyle = 'rgba(2, 6, 12, 0.92)'
    context.fillRect(0, 0, width, height)

    const pad = 28
    const xs = points.map((point) => point.x)
    const ys = points.map((point) => point.y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    context.strokeStyle = 'rgba(255,255,255,0.08)'
    context.lineWidth = 1
    for (let i = 0; i <= 6; i += 1) {
      const x = pad + ((width - pad * 2) / 6) * i
      const y = pad + ((height - pad * 2) / 6) * i

      context.beginPath()
      context.moveTo(x, pad)
      context.lineTo(x, height - pad)
      context.stroke()

      context.beginPath()
      context.moveTo(pad, y)
      context.lineTo(width - pad, y)
      context.stroke()
    }

    context.beginPath()
    context.strokeStyle = stroke
    context.lineWidth = 2.2

    points.forEach((point, index) => {
      const x =
        pad + ((point.x - minX) / Math.max(0.0001, maxX - minX)) * (width - pad * 2)
      const y =
        height -
        pad -
        ((point.y - minY) / Math.max(0.0001, maxY - minY)) * (height - pad * 2)

      if (index === 0) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y)
      }
    })

    context.shadowBlur = 18
    context.shadowColor = stroke
    context.stroke()
    context.shadowBlur = 0
  }, [points, stroke])

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-white/40">{title}</p>
        <p className="mt-2 text-sm text-white/60">
          {xLabel} x {yLabel}
        </p>
      </div>
      <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
        <canvas ref={canvasRef} className="block h-[18rem] w-full" />
      </div>
    </div>
  )
}
