'use client'

import { useEffect, useMemo, useRef } from 'react'

interface SignalCanvasProps {
  title: string
  subtitle?: string
  samples: ArrayLike<number>
  stroke?: string
  gridColor?: string
  height?: number
  gain?: number
  verticalOrigin?: number
  speed?: number
}

export function SignalCanvas({
  title,
  subtitle,
  samples,
  stroke = 'rgba(255,255,255,0.95)',
  gridColor = 'rgba(255,255,255,0.08)',
  height = 220,
  gain = 1,
  verticalOrigin = 0.5,
  speed = 0.9,
}: SignalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sampleArray = useMemo(() => Array.from(samples), [samples])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || sampleArray.length === 0) return

    const context = canvas.getContext('2d')
    if (!context) return

    let frame = 0
    let rafId = 0

    const drawGrid = (width: number, drawingHeight: number) => {
      context.strokeStyle = gridColor
      context.lineWidth = 1

      for (let x = 0; x <= width; x += width / 12) {
        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x, drawingHeight)
        context.stroke()
      }

      for (let y = 0; y <= drawingHeight; y += drawingHeight / 8) {
        context.beginPath()
        context.moveTo(0, y)
        context.lineTo(width, y)
        context.stroke()
      }
    }

    const render = () => {
      const ratio = window.devicePixelRatio || 1
      const bounds = canvas.getBoundingClientRect()
      const width = Math.max(1, Math.floor(bounds.width))
      const drawingHeight = Math.max(1, Math.floor(bounds.height))

      if (canvas.width !== width * ratio || canvas.height !== drawingHeight * ratio) {
        canvas.width = width * ratio
        canvas.height = drawingHeight * ratio
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, width, drawingHeight)
      context.fillStyle = 'rgba(2, 6, 12, 0.92)'
      context.fillRect(0, 0, width, drawingHeight)
      drawGrid(width, drawingHeight)

      const originY = drawingHeight * verticalOrigin
      const stepX = sampleArray.length > 1 ? width / (sampleArray.length - 1) : width
      const offset = Math.floor(frame) % sampleArray.length

      context.beginPath()
      context.lineWidth = 2.2
      context.strokeStyle = stroke

      for (let i = 0; i < sampleArray.length; i += 1) {
        const sample = sampleArray[(i + offset) % sampleArray.length]
        const x = i * stepX
        const y = originY - sample * gain

        if (i === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
      }

      context.shadowBlur = 18
      context.shadowColor = stroke
      context.stroke()
      context.shadowBlur = 0

      frame += speed
      rafId = window.requestAnimationFrame(render)
    }

    rafId = window.requestAnimationFrame(render)
    return () => window.cancelAnimationFrame(rafId)
  }, [gain, gridColor, sampleArray, speed, stroke, verticalOrigin])

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-white/40">{title}</p>
        {subtitle ? <p className="mt-2 text-sm text-white/60">{subtitle}</p> : null}
      </div>
      <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
        <canvas ref={canvasRef} className="block w-full" style={{ height }} />
      </div>
    </div>
  )
}
