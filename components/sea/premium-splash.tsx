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

type DustParticle = {
  x: number
  y: number
  radius: number
  drift: number
  phase: number
}

function buildNodes(): NeuralNode[] {
  return [
    { x: 0.08, y: 0.24, radius: 2.4, phase: 0.12 },
    { x: 0.16, y: 0.18, radius: 3.1, phase: 0.28 },
    { x: 0.22, y: 0.34, radius: 2.2, phase: 0.45 },
    { x: 0.3, y: 0.2, radius: 3.6, phase: 0.65 },
    { x: 0.34, y: 0.42, radius: 2.8, phase: 0.18 },
    { x: 0.42, y: 0.28, radius: 2.6, phase: 0.77 },
    { x: 0.46, y: 0.14, radius: 2.2, phase: 0.33 },
    { x: 0.5, y: 0.46, radius: 4.4, phase: 0.52 },
    { x: 0.54, y: 0.3, radius: 2.9, phase: 0.62 },
    { x: 0.6, y: 0.2, radius: 3.4, phase: 0.24 },
    { x: 0.66, y: 0.38, radius: 2.7, phase: 0.56 },
    { x: 0.72, y: 0.2, radius: 3.2, phase: 0.14 },
    { x: 0.82, y: 0.28, radius: 2.5, phase: 0.42 },
    { x: 0.9, y: 0.22, radius: 2.2, phase: 0.7 },
    { x: 0.12, y: 0.68, radius: 2.4, phase: 0.38 },
    { x: 0.2, y: 0.56, radius: 3.0, phase: 0.8 },
    { x: 0.28, y: 0.78, radius: 2.5, phase: 0.2 },
    { x: 0.36, y: 0.62, radius: 3.1, phase: 0.58 },
    { x: 0.46, y: 0.76, radius: 2.6, phase: 0.11 },
    { x: 0.56, y: 0.6, radius: 3.2, phase: 0.67 },
    { x: 0.64, y: 0.8, radius: 2.4, phase: 0.31 },
    { x: 0.72, y: 0.62, radius: 3.0, phase: 0.73 },
    { x: 0.8, y: 0.74, radius: 2.6, phase: 0.19 },
    { x: 0.9, y: 0.62, radius: 2.3, phase: 0.49 },
  ]
}

function buildLinks(): NeuralLink[] {
  return [
    { from: 0, to: 1, speed: 0.16, phase: 0.2 },
    { from: 1, to: 3, speed: 0.2, phase: 0.7 },
    { from: 3, to: 5, speed: 0.18, phase: 0.34 },
    { from: 5, to: 7, speed: 0.22, phase: 0.5 },
    { from: 7, to: 8, speed: 0.17, phase: 0.17 },
    { from: 8, to: 9, speed: 0.21, phase: 0.63 },
    { from: 9, to: 11, speed: 0.16, phase: 0.42 },
    { from: 11, to: 12, speed: 0.19, phase: 0.12 },
    { from: 12, to: 13, speed: 0.14, phase: 0.81 },
    { from: 2, to: 4, speed: 0.18, phase: 0.27 },
    { from: 4, to: 7, speed: 0.23, phase: 0.46 },
    { from: 7, to: 10, speed: 0.2, phase: 0.58 },
    { from: 10, to: 12, speed: 0.18, phase: 0.31 },
    { from: 6, to: 7, speed: 0.14, phase: 0.66 },
    { from: 14, to: 15, speed: 0.17, phase: 0.36 },
    { from: 15, to: 17, speed: 0.19, phase: 0.57 },
    { from: 17, to: 18, speed: 0.21, phase: 0.22 },
    { from: 18, to: 20, speed: 0.16, phase: 0.75 },
    { from: 20, to: 22, speed: 0.2, phase: 0.43 },
    { from: 22, to: 23, speed: 0.17, phase: 0.61 },
    { from: 16, to: 17, speed: 0.14, phase: 0.18 },
    { from: 17, to: 19, speed: 0.23, phase: 0.72 },
    { from: 19, to: 21, speed: 0.2, phase: 0.29 },
    { from: 21, to: 23, speed: 0.18, phase: 0.53 },
    { from: 4, to: 17, speed: 0.12, phase: 0.14 },
    { from: 7, to: 19, speed: 0.14, phase: 0.84 },
    { from: 10, to: 21, speed: 0.12, phase: 0.41 },
    { from: 3, to: 18, speed: 0.11, phase: 0.33 },
    { from: 9, to: 20, speed: 0.12, phase: 0.62 },
  ]
}

function buildDust(): DustParticle[] {
  return Array.from({ length: 56 }, (_, index) => ({
    x: ((index * 37) % 100) / 100,
    y: ((index * 23 + 17) % 100) / 100,
    radius: 0.7 + (index % 4) * 0.35,
    drift: 6 + (index % 7),
    phase: index * 0.31,
  }))
}

function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodes = useMemo(() => buildNodes(), [])
  const links = useMemo(() => buildLinks(), [])
  const dust = useMemo(() => buildDust(), [])

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
      context.fillStyle = '#020202'
      context.fillRect(0, 0, width, height)

      const t = time * 0.001
      const centerX = width * 0.5
      const centerY = height * 0.48

      context.save()
      context.globalAlpha = 0.08
      context.strokeStyle = 'rgba(255,255,255,0.18)'
      context.lineWidth = 1
      for (let x = 0; x < width; x += 64) {
        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x, height)
        context.stroke()
      }
      for (let y = 0; y < height; y += 64) {
        context.beginPath()
        context.moveTo(0, y)
        context.lineTo(width, y)
        context.stroke()
      }
      context.restore()

      const leftGlow = context.createRadialGradient(width * 0.16, height * 0.28, 0, width * 0.16, height * 0.28, width * 0.22)
      leftGlow.addColorStop(0, 'rgba(255,255,255,0.08)')
      leftGlow.addColorStop(1, 'rgba(255,255,255,0)')
      context.fillStyle = leftGlow
      context.fillRect(0, 0, width, height)

      const rightGlow = context.createRadialGradient(width * 0.82, height * 0.66, 0, width * 0.82, height * 0.66, width * 0.24)
      rightGlow.addColorStop(0, 'rgba(255,255,255,0.06)')
      rightGlow.addColorStop(1, 'rgba(255,255,255,0)')
      context.fillStyle = rightGlow
      context.fillRect(0, 0, width, height)

      dust.forEach((particle, index) => {
        const driftX = Math.sin(t * 0.18 + particle.phase) * particle.drift
        const driftY = Math.cos(t * 0.12 + particle.phase) * particle.drift * 0.4
        const x = width * particle.x + driftX
        const y = height * particle.y + driftY
        context.save()
        context.globalAlpha = 0.22 + (index % 5) * 0.05
        context.fillStyle = 'rgba(255,255,255,0.85)'
        context.beginPath()
        context.arc(x, y, particle.radius, 0, Math.PI * 2)
        context.fill()
        context.restore()
      })

      context.save()
      context.translate(centerX, centerY)
      context.strokeStyle = 'rgba(255,255,255,0.16)'
      context.lineWidth = 1
      context.beginPath()
      context.ellipse(0, 0, width * 0.16, width * 0.055, t * 0.16, 0, Math.PI * 2)
      context.stroke()
      context.beginPath()
      context.ellipse(0, 0, width * 0.11, width * 0.16, -t * 0.11, 0, Math.PI * 2)
      context.stroke()
      context.beginPath()
      context.ellipse(0, 0, width * 0.22, width * 0.22, t * 0.04, 0, Math.PI * 2)
      context.stroke()

      context.shadowBlur = 36
      context.shadowColor = 'rgba(255,255,255,0.48)'
      const pulseRadius = 22 + Math.sin(t * 2.1) * 7
      const core = context.createRadialGradient(0, 0, 0, 0, 0, pulseRadius)
      core.addColorStop(0, 'rgba(255,255,255,0.98)')
      core.addColorStop(0.24, 'rgba(222,222,222,0.72)')
      core.addColorStop(0.62, 'rgba(135,135,135,0.18)')
      core.addColorStop(1, 'rgba(255,255,255,0)')
      context.fillStyle = core
      context.beginPath()
      context.arc(0, 0, pulseRadius, 0, Math.PI * 2)
      context.fill()
      context.restore()

      const points = nodes.map((node) => ({
        x: width * node.x,
        y: height * node.y,
        radius: node.radius + Math.sin(t * 1.8 + node.phase * Math.PI * 2) * 0.8,
      }))

      links.forEach((link) => {
        const from = points[link.from]
        const to = points[link.to]
        const cx = (from.x + to.x) * 0.5
        const cy = (from.y + to.y) * 0.5 - Math.abs(to.x - from.x) * 0.06

        context.strokeStyle = 'rgba(255,255,255,0.14)'
        context.lineWidth = 1
        context.beginPath()
        context.moveTo(from.x, from.y)
        context.quadraticCurveTo(cx, cy, to.x, to.y)
        context.stroke()

        const progress = (t * link.speed + link.phase) % 1
        const pulseX =
          (1 - progress) * (1 - progress) * from.x +
          2 * (1 - progress) * progress * cx +
          progress * progress * to.x
        const pulseY =
          (1 - progress) * (1 - progress) * from.y +
          2 * (1 - progress) * progress * cy +
          progress * progress * to.y

        context.save()
        context.shadowBlur = 14
        context.shadowColor = 'rgba(255,255,255,0.74)'
        context.fillStyle = 'rgba(255,255,255,0.96)'
        context.beginPath()
        context.arc(pulseX, pulseY, 1.7, 0, Math.PI * 2)
        context.fill()
        context.restore()
      })

      points.forEach((point, index) => {
        context.save()
        context.shadowBlur = 10 + Math.sin(t * 2 + index) * 4
        context.shadowColor = 'rgba(255,255,255,0.54)'
        context.fillStyle = 'rgba(255,255,255,0.95)'
        context.beginPath()
        context.arc(point.x, point.y, Math.max(1.4, point.radius), 0, Math.PI * 2)
        context.fill()
        context.restore()
      })

      context.save()
      context.strokeStyle = 'rgba(255,255,255,0.12)'
      context.lineWidth = 1
      context.beginPath()
      for (let i = 0; i <= 260; i += 1) {
        const x = (i / 260) * width
        const amplitude = height * 0.016
        const y =
          height * 0.84 +
          Math.sin(i * 0.085 + t * 1.8) * amplitude +
          Math.sin(i * 0.038 - t * 1.1) * amplitude * 0.6

        if (i === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
      }
      context.stroke()
      context.restore()

      const vignette = context.createRadialGradient(centerX, centerY, width * 0.06, centerX, centerY, width * 0.64)
      vignette.addColorStop(0, 'rgba(2,2,2,0)')
      vignette.addColorStop(1, 'rgba(2,2,2,0.94)')
      context.fillStyle = vignette
      context.fillRect(0, 0, width, height)

      frameId = window.requestAnimationFrame(render)
    }

    frameId = window.requestAnimationFrame(render)
    return () => window.cancelAnimationFrame(frameId)
  }, [dust, links, nodes])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}

export function PremiumSplash({
  redirectTo = '/sea',
  durationMs = 9200,
  onComplete,
  exitHoldMs = 1800,
}: PremiumSplashProps) {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const statusMessages = ['Mapeando cortex', 'Sinapses online', 'Nucleo estavel', 'Abrindo SEA']

  useEffect(() => {
    document.body.classList.add('sea-splash-active')

    return () => {
      document.body.classList.remove('sea-splash-active')
    }
  }, [])

  useEffect(() => {
    const tickMs = 90
    const totalSteps = Math.max(1, Math.ceil(durationMs / tickMs))
    let completed = false

    const interval = window.setInterval(() => {
      setProgress((current) => {
        const easedStep =
          current < 58 ? 100 / (totalSteps * 1.2) : current < 88 ? 100 / (totalSteps * 1.9) : 100 / (totalSteps * 3.2)
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
    <div className="fixed inset-0 z-[90] overflow-hidden bg-[#020202]" suppressHydrationWarning>
      <NeuralCanvas />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015),transparent_34%,rgba(2,2,2,0.82)_100%)]" />

      <div className="relative flex h-full flex-col items-center justify-center px-5 py-8 md:px-8">
        <motion.div
          className="flex flex-1 flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.18 }}
        >
          <p className="text-[11px] uppercase tracking-[0.42em] text-white/34">Sistema de Estudo Avancado</p>
          <h1 className="mt-6 bg-gradient-to-b from-white via-[#dddddd] to-[#747474] bg-clip-text text-6xl font-semibold tracking-[-0.08em] text-transparent sm:text-7xl md:text-8xl">
            SEA
          </h1>
        </motion.div>

        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.36 }}
        >
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-white/38">
            <span>{statusMessages[Math.min(Math.floor((progress / 100) * statusMessages.length), statusMessages.length - 1)]}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#5b5b5b_0%,#ffffff_50%,#8a8a8a_100%)]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 42, damping: 18 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
