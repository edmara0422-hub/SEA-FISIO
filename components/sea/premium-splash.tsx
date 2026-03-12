'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

type PremiumSplashProps = {
  durationMs?: number
  onComplete?: () => void
  exitHoldMs?: number
}

type Trace = {
  id: string
  d: string
  width: number
  opacity: number
  delay: number
}

type Spark = {
  id: string
  x: number
  y: number
  r: number
  opacity: number
  delay: number
}

type NeuralVeilData = {
  traces: Trace[]
  sparks: Spark[]
}

export function PremiumSplash({
  durationMs = 8200,
  onComplete,
  exitHoldMs = 1200,
}: PremiumSplashProps) {
  const [progress, setProgress] = useState(0)
  const veil = useMemo(() => buildNeuralVeil(), [])

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
    <div className="fixed inset-0 z-[90] h-[100dvh] w-screen overflow-hidden bg-[#020202]" suppressHydrationWarning>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_16%,rgba(2,2,2,0.92)_56%,rgba(2,2,2,1)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_26%),radial-gradient(circle_at_80%_18%,rgba(205,205,205,0.05),transparent_28%),radial-gradient(circle_at_18%_82%,rgba(255,255,255,0.05),transparent_26%),radial-gradient(circle_at_82%_80%,rgba(170,170,170,0.05),transparent_30%)]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:repeating-linear-gradient(180deg,rgba(255,255,255,0.02)_0px,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_11px)]" />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[22rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.16),rgba(255,255,255,0.03)_46%,transparent_76%)] blur-3xl"
        animate={{ opacity: [0.22, 0.34, 0.24], scale: [0.98, 1.03, 0.99] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <NeuralVeil veil={veil} />
      <CentralPulseColumn />

      <div className="relative flex h-full items-center justify-center px-6">
        <motion.div
          className="pointer-events-none relative text-center"
          initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.3, delay: 0.2, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 h-24 w-[18rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.2),transparent_72%)] blur-3xl"
            animate={{ opacity: [0.34, 0.54, 0.38] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <h1 className="relative bg-[linear-gradient(180deg,#ffffff_0%,#dddddd_45%,#848484_100%)] bg-clip-text text-[4.8rem] font-semibold tracking-[-0.18em] text-transparent sm:text-[6.4rem] md:text-[8.5rem]">
            SEA
          </h1>
          <motion.div
            className="mx-auto mt-5 h-px w-24 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.78),transparent)]"
            animate={{ opacity: [0.3, 0.82, 0.3], scaleX: [0.95, 1.1, 0.95] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-x-8 bottom-8 md:bottom-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.45 }}
      >
        <div className="mx-auto w-full max-w-md">
          <div className="h-px overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(120,120,120,0.12)_0%,rgba(255,255,255,0.98)_50%,rgba(120,120,120,0.18)_100%)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function NeuralVeil({ veil }: { veil: NeuralVeilData }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 900"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="sea-trace" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(120,120,120,0.04)" />
          <stop offset="48%" stopColor="rgba(255,255,255,0.75)" />
          <stop offset="100%" stopColor="rgba(120,120,120,0.05)" />
        </linearGradient>
      </defs>

      {veil.traces.map((trace) => (
        <motion.path
          key={trace.id}
          d={trace.d}
          fill="none"
          stroke="url(#sea-trace)"
          strokeWidth={trace.width}
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0.2 }}
          animate={{ opacity: [trace.opacity * 0.55, trace.opacity, trace.opacity * 0.6], pathLength: 1 }}
          transition={{
            duration: 5.5,
            delay: trace.delay,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}

      {veil.sparks.map((spark) => (
        <motion.circle
          key={spark.id}
          cx={spark.x}
          cy={spark.y}
          r={spark.r}
          fill="#ffffff"
          initial={{ opacity: 0 }}
          animate={{ opacity: [spark.opacity * 0.35, spark.opacity, spark.opacity * 0.4], scale: [0.96, 1.12, 1] }}
          transition={{
            duration: 4.2,
            delay: spark.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: `${spark.x}px ${spark.y}px` }}
        />
      ))}
    </svg>
  )
}

function CentralPulseColumn() {
  const rails = [-18, -6, 6, 18]
  const pulses = [
    { x: -18, delay: 0.1, duration: 3.8 },
    { x: -6, delay: 0.7, duration: 4.2 },
    { x: 6, delay: 0.35, duration: 4 },
    { x: 18, delay: 1.05, duration: 4.6 },
  ]

  return (
    <div className="pointer-events-none absolute inset-0">
      {rails.map((offset, index) => (
        <motion.span
          key={`rail-${offset}`}
          className="absolute left-1/2 top-1/2 h-[52vh] w-px -translate-y-1/2 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.5),transparent)]"
          style={{ marginLeft: `${offset}px` }}
          animate={{ opacity: [0.12, index % 2 === 0 ? 0.45 : 0.3, 0.14] }}
          transition={{ duration: 4.4 + index * 0.55, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {pulses.map((pulse) => (
        <motion.span
          key={`pulse-${pulse.x}`}
          className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.42)]"
          style={{ marginLeft: `${pulse.x - 4}px` }}
          initial={{ y: '18vh', opacity: 0 }}
          animate={{ y: ['18vh', '0vh', '-18vh'], opacity: [0, 1, 0] }}
          transition={{ duration: pulse.duration, delay: pulse.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function buildNeuralVeil(): NeuralVeilData {
  const traces: Trace[] = []
  const sparks: Spark[] = []
  const anchors = [150, 245, 340, 470, 600, 715]

  anchors.forEach((y, index) => {
    const leftStartX = 70 + index * 18
    const leftEndX = 520 + index * 10
    const rightStartX = 1370 - index * 18
    const rightEndX = 920 - index * 10
    const bend = 70 + index * 8
    const drift = (index % 2 === 0 ? -1 : 1) * (18 + index * 2)

    traces.push({
      id: `left-${index}`,
      d: `M ${leftStartX} ${y} C ${220 + index * 24} ${y - bend}, ${350 + index * 18} ${y + drift}, ${leftEndX} ${y + drift}`,
      width: index % 2 === 0 ? 1.1 : 0.9,
      opacity: index < 2 || index > 4 ? 0.14 : 0.22,
      delay: 0.08 + index * 0.12,
    })

    traces.push({
      id: `right-${index}`,
      d: `M ${rightStartX} ${y} C ${1220 - index * 24} ${y - bend}, ${1090 - index * 18} ${y + drift}, ${rightEndX} ${y + drift}`,
      width: index % 2 === 0 ? 1.1 : 0.9,
      opacity: index < 2 || index > 4 ? 0.14 : 0.22,
      delay: 0.14 + index * 0.12,
    })

    sparks.push(
      {
        id: `ls-${index}`,
        x: leftEndX,
        y: y + drift,
        r: index % 2 === 0 ? 1.8 : 1.2,
        opacity: index < 2 || index > 4 ? 0.16 : 0.3,
        delay: 0.1 + index * 0.12,
      },
      {
        id: `rs-${index}`,
        x: rightEndX,
        y: y + drift,
        r: index % 2 === 0 ? 1.8 : 1.2,
        opacity: index < 2 || index > 4 ? 0.16 : 0.3,
        delay: 0.16 + index * 0.12,
      }
    )
  })

  ;[
    { id: 'bridge-top', d: 'M 610 312 C 670 284, 770 284, 830 312', delay: 0.25 },
    { id: 'bridge-mid', d: 'M 590 450 C 670 420, 770 420, 850 450', delay: 0.5 },
    { id: 'bridge-low', d: 'M 620 590 C 690 566, 750 566, 820 590', delay: 0.75 },
    { id: 'crest-top', d: 'M 430 128 C 600 90, 840 90, 1010 128', delay: 0.35 },
    { id: 'crest-bottom', d: 'M 430 770 C 600 808, 840 808, 1010 770', delay: 0.65 },
  ].forEach((trace, index) => {
    traces.push({
      id: trace.id,
      d: trace.d,
      width: index < 3 ? 1.2 : 0.8,
      opacity: index < 3 ? 0.18 : 0.1,
      delay: trace.delay,
    })
  })

  ;[
    [614, 312],
    [826, 312],
    [596, 450],
    [844, 450],
    [624, 590],
    [816, 590],
    [720, 128],
    [720, 770],
  ].forEach(([x, y], index) => {
    sparks.push({
      id: `core-${index}`,
      x,
      y,
      r: index < 6 ? 1.6 : 1.2,
      opacity: index < 6 ? 0.28 : 0.18,
      delay: 0.28 + index * 0.08,
    })
  })

  return { traces, sparks }
}
