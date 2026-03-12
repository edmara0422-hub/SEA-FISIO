'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type PremiumSplashProps = {
  redirectTo?: string | null
  durationMs?: number
  onComplete?: () => void
  exitHoldMs?: number
}

type NeuralNode = {
  x: number
  y: number
  radius: number
  phase: number
}

type NeuralLink = {
  from: number
  to: number
  speed: number
  phase: number
}

const statusMessages = ['Mapeando cortex', 'Sinapses online', 'Nucleo estavel', 'Abrindo SEA']

function buildNodes(): NeuralNode[] {
  return [
    { x: 0.18, y: 0.36, radius: 2.8, phase: 0.1 },
    { x: 0.28, y: 0.28, radius: 3.8, phase: 0.4 },
    { x: 0.36, y: 0.22, radius: 2.5, phase: 0.2 },
    { x: 0.46, y: 0.3, radius: 4.2, phase: 0.6 },
    { x: 0.56, y: 0.22, radius: 2.8, phase: 0.15 },
    { x: 0.66, y: 0.28, radius: 3.8, phase: 0.65 },
    { x: 0.76, y: 0.36, radius: 3.0, phase: 0.25 },
    { x: 0.22, y: 0.52, radius: 3.2, phase: 0.8 },
    { x: 0.34, y: 0.44, radius: 3.6, phase: 0.12 },
    { x: 0.46, y: 0.5, radius: 2.6, phase: 0.52 },
    { x: 0.58, y: 0.44, radius: 3.4, phase: 0.26 },
    { x: 0.7, y: 0.52, radius: 3.2, phase: 0.72 },
    { x: 0.28, y: 0.68, radius: 2.8, phase: 0.38 },
    { x: 0.4, y: 0.6, radius: 3.7, phase: 0.62 },
    { x: 0.52, y: 0.66, radius: 2.8, phase: 0.18 },
    { x: 0.64, y: 0.6, radius: 3.6, phase: 0.82 },
    { x: 0.76, y: 0.68, radius: 2.9, phase: 0.3 },
  ]
}

function buildLinks(): NeuralLink[] {
  return [
    { from: 0, to: 1, speed: 0.22, phase: 0.1 },
    { from: 1, to: 2, speed: 0.16, phase: 0.5 },
    { from: 2, to: 3, speed: 0.2, phase: 0.2 },
    { from: 3, to: 4, speed: 0.18, phase: 0.66 },
    { from: 4, to: 5, speed: 0.21, phase: 0.33 },
    { from: 5, to: 6, speed: 0.17, phase: 0.8 },
    { from: 0, to: 7, speed: 0.14, phase: 0.42 },
    { from: 1, to: 8, speed: 0.18, phase: 0.74 },
    { from: 3, to: 9, speed: 0.25, phase: 0.12 },
    { from: 3, to: 10, speed: 0.19, phase: 0.57 },
    { from: 5, to: 10, speed: 0.16, phase: 0.26 },
    { from: 6, to: 11, speed: 0.2, phase: 0.68 },
    { from: 7, to: 8, speed: 0.15, phase: 0.22 },
    { from: 8, to: 9, speed: 0.23, phase: 0.61 },
    { from: 9, to: 10, speed: 0.17, phase: 0.31 },
    { from: 10, to: 11, speed: 0.21, phase: 0.51 },
    { from: 8, to: 13, speed: 0.2, phase: 0.43 },
    { from: 9, to: 13, speed: 0.14, phase: 0.18 },
    { from: 9, to: 14, speed: 0.24, phase: 0.74 },
    { from: 10, to: 15, speed: 0.18, phase: 0.24 },
    { from: 11, to: 16, speed: 0.2, phase: 0.86 },
    { from: 12, to: 13, speed: 0.17, phase: 0.35 },
    { from: 13, to: 14, speed: 0.19, phase: 0.69 },
    { from: 14, to: 15, speed: 0.23, phase: 0.46 },
    { from: 15, to: 16, speed: 0.18, phase: 0.58 },
  ]
}

function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodes = useMemo(() => buildNodes(), [])
  const links = useMemo(() => buildLinks(), [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let frameId = 0

    const render = (time: number) => {
      const bounds = canvas.getBoundingClientRect()
      const width = Math.max(1, Math.floor(bounds.width))
      const height = Math.max(1, Math.floor(bounds.height))
      const ratio = window.devicePixelRatio || 1

      if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
        canvas.width = width * ratio
        canvas.height = height * ratio
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, width, height)
      context.fillStyle = '#040404'
      context.fillRect(0, 0, width, height)

      context.save()
      context.globalAlpha = 0.09
      context.strokeStyle = 'rgba(255,255,255,0.18)'
      context.lineWidth = 1
      for (let x = 0; x < width; x += 56) {
        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x, height)
        context.stroke()
      }
      for (let y = 0; y < height; y += 56) {
        context.beginPath()
        context.moveTo(0, y)
        context.lineTo(width, y)
        context.stroke()
      }
      context.restore()

      const centerX = width * 0.5
      const centerY = height * 0.47
      const t = time * 0.001

      const halo = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 0.26)
      halo.addColorStop(0, 'rgba(255,255,255,0.12)')
      halo.addColorStop(0.4, 'rgba(255,255,255,0.03)')
      halo.addColorStop(1, 'rgba(255,255,255,0)')
      context.fillStyle = halo
      context.fillRect(0, 0, width, height)

      context.save()
      context.translate(centerX, centerY)
      context.strokeStyle = 'rgba(255,255,255,0.18)'
      context.lineWidth = 1
      context.beginPath()
      context.ellipse(0, 0, width * 0.14, width * 0.14, t * 0.14, 0, Math.PI * 2)
      context.stroke()
      context.beginPath()
      context.ellipse(0, 0, width * 0.19, width * 0.07, -t * 0.18, 0, Math.PI * 2)
      context.stroke()
      context.beginPath()
      context.ellipse(0, 0, width * 0.08, width * 0.2, t * 0.12, 0, Math.PI * 2)
      context.stroke()

      context.shadowBlur = 30
      context.shadowColor = 'rgba(255,255,255,0.45)'
      const pulse = 20 + Math.sin(t * 2.3) * 6
      const core = context.createRadialGradient(0, 0, 0, 0, 0, pulse)
      core.addColorStop(0, 'rgba(255,255,255,0.95)')
      core.addColorStop(0.25, 'rgba(232,232,232,0.72)')
      core.addColorStop(0.7, 'rgba(158,158,158,0.22)')
      core.addColorStop(1, 'rgba(255,255,255,0)')
      context.fillStyle = core
      context.beginPath()
      context.arc(0, 0, pulse, 0, Math.PI * 2)
      context.fill()
      context.restore()

      const points = nodes.map((node) => ({
        x: width * node.x,
        y: height * node.y,
        radius: node.radius + Math.sin(t * 1.8 + node.phase * Math.PI * 2) * 0.65,
      }))

      context.lineWidth = 1
      links.forEach((link) => {
        const from = points[link.from]
        const to = points[link.to]

        context.strokeStyle = 'rgba(255,255,255,0.16)'
        context.beginPath()
        context.moveTo(from.x, from.y)
        context.lineTo(to.x, to.y)
        context.stroke()

        const progress = (t * link.speed + link.phase) % 1
        const pulseX = from.x + (to.x - from.x) * progress
        const pulseY = from.y + (to.y - from.y) * progress

        context.save()
        context.shadowBlur = 16
        context.shadowColor = 'rgba(255,255,255,0.7)'
        context.fillStyle = 'rgba(255,255,255,0.95)'
        context.beginPath()
        context.arc(pulseX, pulseY, 1.8, 0, Math.PI * 2)
        context.fill()
        context.restore()
      })

      points.forEach((point, index) => {
        const glow = 10 + Math.sin(t * 2 + index) * 3
        context.save()
        context.shadowBlur = glow
        context.shadowColor = 'rgba(255,255,255,0.5)'
        context.fillStyle = 'rgba(255,255,255,0.92)'
        context.beginPath()
        context.arc(point.x, point.y, Math.max(1.6, point.radius), 0, Math.PI * 2)
        context.fill()
        context.restore()
      })

      context.save()
      context.strokeStyle = 'rgba(255,255,255,0.14)'
      context.lineWidth = 1
      context.beginPath()
      for (let i = 0; i <= 220; i += 1) {
        const x = (i / 220) * width
        const amplitude = height * 0.018
        const y = height * 0.82 + Math.sin(i * 0.09 + t * 2.4) * amplitude + Math.sin(i * 0.04 - t * 1.1) * amplitude * 0.5
        if (i === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
      }
      context.stroke()
      context.restore()

      const vignette = context.createRadialGradient(centerX, centerY, width * 0.08, centerX, centerY, width * 0.62)
      vignette.addColorStop(0, 'rgba(4,4,4,0)')
      vignette.addColorStop(1, 'rgba(4,4,4,0.92)')
      context.fillStyle = vignette
      context.fillRect(0, 0, width, height)

      frameId = window.requestAnimationFrame(render)
    }

    frameId = window.requestAnimationFrame(render)
    return () => window.cancelAnimationFrame(frameId)
  }, [links, nodes])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}

export function PremiumSplash({
  redirectTo = '/sea',
  durationMs = 6800,
  onComplete,
  exitHoldMs = 1400,
}: PremiumSplashProps) {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const statusIndex = Math.min(
    Math.floor((progress / 100) * statusMessages.length),
    statusMessages.length - 1
  )

  useEffect(() => {
    const tickMs = 90
    const totalSteps = Math.max(1, Math.ceil(durationMs / tickMs))
    let completed = false

    const interval = window.setInterval(() => {
      setProgress((current) => {
        const easedStep = current < 72 ? 100 / totalSteps : 100 / (totalSteps * 1.75)
        const next = Math.min(current + easedStep, 100)

        if (next >= 100 && !completed) {
          completed = true
          window.clearInterval(interval)
          window.setTimeout(() => {
            if (redirectTo) {
              router.push(redirectTo)
            }
            onComplete?.()
          }, exitHoldMs)
        }

        return next
      })
    }, tickMs)

    return () => window.clearInterval(interval)
  }, [durationMs, exitHoldMs, onComplete, redirectTo, router])

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#040404]" suppressHydrationWarning>
      <NeuralCanvas />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_32%,rgba(4,4,4,0.78)_100%)]" />

      <div className="relative flex h-full flex-col items-center justify-between px-5 py-6 md:px-8 md:py-8">
        <motion.div
          className="self-start rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/55 backdrop-blur-xl"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Neural Interface
        </motion.div>

        <motion.div
          className="flex flex-1 flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <p className="text-[11px] uppercase tracking-[0.42em] text-white/40">Sistema de Estudo Avancado</p>
          <h1 className="mt-5 bg-gradient-to-b from-white via-[#d7d7d7] to-[#7a7a7a] bg-clip-text text-6xl font-semibold tracking-[-0.08em] text-transparent md:text-8xl">
            SEA
          </h1>
        </motion.div>

        <motion.div
          className="w-full max-w-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-white/42">
            <span>{statusMessages[statusIndex]}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#595959_0%,#ffffff_50%,#8e8e8e_100%)]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 52, damping: 18 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
