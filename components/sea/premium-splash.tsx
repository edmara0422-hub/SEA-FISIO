'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type PremiumSplashProps = {
  durationMs?: number
  onComplete?: () => void
  exitHoldMs?: number
}


export function PremiumSplash({
  durationMs = 3000,
  onComplete,
  exitHoldMs = 600,
}: PremiumSplashProps) {
  const [progress, setProgress] = useState(0)
  // orb canvas handles visuals now

  useEffect(() => {
    document.documentElement.classList.add('sea-splash-active')
    document.body.classList.add('sea-splash-active')

    return () => {
      document.documentElement.classList.remove('sea-splash-active')
      document.body.classList.remove('sea-splash-active')
    }
  }, [])

  useEffect(() => {
    let frameId = 0
    let exitTimer = 0
    let startAt = 0

    const ease = (value: number) => 1 - Math.pow(1 - value, 4)

    const animate = (timestamp: number) => {
      if (!startAt) {
        startAt = timestamp
      }

      const elapsed = timestamp - startAt
      const ratio = Math.min(elapsed / durationMs, 1)
      setProgress(ease(ratio) * 100)

      if (ratio < 1) {
        frameId = window.requestAnimationFrame(animate)
        return
      }

      exitTimer = window.setTimeout(() => {
        onComplete?.()
      }, exitHoldMs)
    }

    frameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(exitTimer)
    }
  }, [durationMs, exitHoldMs, onComplete])

  return (
    <div className="fixed inset-0 z-[90] h-[100dvh] w-screen overflow-hidden bg-[#010101]" suppressHydrationWarning>
      {/* Orb canvas — same as landing but with expansion effect */}
      <SplashOrb progress={progress} />

      {/* Floating particles around the orb */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-white/20"
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 0.4, 0],
            x: [0, Math.cos(i * 0.785) * 180],
            y: [0, Math.sin(i * 0.785) * 180],
            scale: [0.5, 1.5, 0],
          }}
          transition={{ duration: 2.5, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
        />
      ))}

      {/* SEA text */}
      <div className="relative flex h-full items-center justify-center px-4">
        <motion.div
          className="pointer-events-none relative text-center"
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.15, ease: 'easeOut' }}
        >
          <div className="mx-auto flex w-fit items-center justify-center gap-[0.02em] text-[4.8rem] font-semibold sm:text-[6.4rem] md:text-[8.5rem]">
            <Letter value="S" />
            <Letter value="E" />
            <Letter value="A" />
          </div>

          {/* Animated line under SEA */}
          <motion.div
            className="mx-auto mt-4 h-px w-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.78),transparent)]"
            animate={{ width: '6rem', opacity: [0, 0.8] }}
            transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
          />
        </motion.div>
      </div>

      {/* Progress bar */}
      <motion.div
        className="pointer-events-none absolute inset-x-8 bottom-8 md:bottom-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="mx-auto w-full max-w-md">
          <div className="h-[2px] overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(120,120,120,0.08)_0%,rgba(255,255,255,0.9)_50%,rgba(120,120,120,0.12)_100%)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.15, ease: 'linear' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function SplashOrb({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrame = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = Math.min(window.innerWidth * 0.85, 380)
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const baseR = size * 0.38
    let t = 0

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, size, size)
      t += 0.01

      // Expansion based on progress
      const expand = 1 + (progress / 100) * 0.15
      const breathe = 1 + Math.sin(t * 1.5) * 0.04
      const r = baseR * breathe * expand

      // Outer glow — grows with progress
      const glow = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 1.6)
      glow.addColorStop(0, `rgba(200, 200, 200, ${0.04 + (progress / 100) * 0.06})`)
      glow.addColorStop(0.5, 'rgba(150, 150, 150, 0.02)')
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, size, size)

      // Main orb
      const orbGrad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.05, cx, cy, r)
      orbGrad.addColorStop(0, `rgba(255, 255, 255, ${0.12 + (progress / 100) * 0.1})`)
      orbGrad.addColorStop(0.25, 'rgba(200, 200, 200, 0.08)')
      orbGrad.addColorStop(0.5, 'rgba(150, 150, 150, 0.05)')
      orbGrad.addColorStop(1, 'rgba(60, 60, 60, 0.01)')
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = orbGrad
      ctx.fill()

      // Inner ring — pulses
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.94, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + Math.sin(t * 2.5) * 0.04})`
      ctx.lineWidth = 0.8
      ctx.stroke()

      // Outer ring — expands with progress
      const outerR = r * (1.1 + (progress / 100) * 0.1)
      ctx.beginPath()
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 + Math.sin(t * 1.8) * 0.02})`
      ctx.lineWidth = 0.5
      ctx.stroke()

      // Second outer ring
      ctx.beginPath()
      ctx.arc(cx, cy, outerR * 1.08, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.015 + Math.sin(t * 1.2) * 0.01})`
      ctx.lineWidth = 0.3
      ctx.stroke()

      // Orbiting particles — faster than landing
      for (let i = 0; i < 8; i++) {
        const angle = t * (0.6 + i * 0.1) + (i * Math.PI * 2) / 8
        const orbitR = r * (1.05 + i * 0.05)
        const px = cx + Math.cos(angle) * orbitR
        const py = cy + Math.sin(angle) * orbitR * 0.88
        const pSize = 1 + Math.sin(t * 3 + i) * 0.6
        const alpha = 0.12 + Math.sin(t * 2 + i) * 0.08 + (progress / 100) * 0.1

        ctx.beginPath()
        ctx.arc(px, py, pSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 220, 220, ${alpha})`
        ctx.fill()
      }

      animFrame.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animFrame.current)
  }, [progress])

  return (
    <canvas
      ref={canvasRef}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
  )
}

function Letter({ value }: { value: string }) {
  return (
    <span className="relative inline-flex bg-[linear-gradient(180deg,#ffffff_0%,#dddddd_45%,#848484_100%)] bg-clip-text px-[0.02em] text-transparent drop-shadow-[0_0_18px_rgba(255,255,255,0.08)]">
      {value}
    </span>
  )
}

