'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

type PremiumSplashProps = {
  durationMs?: number
  onComplete?: () => void
  exitHoldMs?: number
}

type CoreTrace = {
  id: string
  d: string
  width: number
  opacity: number
  delay: number
}

type CoreSpark = {
  id: string
  x: number
  y: number
  r: number
  opacity: number
  delay: number
}

type CoreField = {
  traces: CoreTrace[]
  sparks: CoreSpark[]
}

export function PremiumSplash({
  durationMs = 8200,
  onComplete,
  exitHoldMs = 1200,
}: PremiumSplashProps) {
  const [progress, setProgress] = useState(0)
  const field = useMemo(() => buildCoreField(), [])

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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_16%,rgba(1,1,1,0.94)_56%,rgba(1,1,1,1)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_26%),radial-gradient(circle_at_80%_18%,rgba(205,205,205,0.04),transparent_28%),radial-gradient(circle_at_18%_82%,rgba(255,255,255,0.04),transparent_26%),radial-gradient(circle_at_82%_80%,rgba(170,170,170,0.035),transparent_30%)]" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:repeating-linear-gradient(180deg,rgba(255,255,255,0.018)_0px,rgba(255,255,255,0.018)_1px,transparent_1px,transparent_11px)]" />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[22rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.16),rgba(255,255,255,0.03)_46%,transparent_76%)] blur-3xl"
        animate={{ opacity: [0.22, 0.34, 0.24], scale: [0.98, 1.03, 0.99] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <CoreAura field={field} />
      <CentralPulseColumn />

      <div className="relative flex h-full items-center justify-center px-4">
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

          <div className="mx-auto flex w-fit items-center justify-center -space-x-[0.05em] text-[4.8rem] font-semibold sm:text-[6.4rem] md:text-[8.5rem]">
            <CutLetter
              value="S"
              cuts={[
                { top: '30%', left: '-6%', right: '24%' },
                { top: '63%', left: '34%', right: '-6%' },
              ]}
            />
            <Letter value="E" />
            <CutLetter
              value="A"
              cuts={[
                { top: '34%', left: '38%', right: '-6%' },
                { top: '69%', left: '-6%', right: '42%' },
              ]}
            />
          </div>

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
              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(120,120,120,0.08)_0%,rgba(255,255,255,0.98)_50%,rgba(120,120,120,0.12)_100%)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Letter({ value }: { value: string }) {
  return (
    <span className="relative inline-flex bg-[linear-gradient(180deg,#ffffff_0%,#dddddd_45%,#848484_100%)] bg-clip-text px-[0.03em] text-transparent drop-shadow-[0_0_18px_rgba(255,255,255,0.08)]">
      {value}
    </span>
  )
}

function CutLetter({
  value,
  cuts,
}: {
  value: string
  cuts: Array<{ top: string; left: string; right: string }>
}) {
  return (
    <span className="relative inline-flex bg-[linear-gradient(180deg,#ffffff_0%,#dddddd_45%,#848484_100%)] bg-clip-text px-[0.03em] text-transparent drop-shadow-[0_0_18px_rgba(255,255,255,0.08)]">
      {value}
      {cuts.map((cut, index) => (
        <span
          key={`${value}-${index}`}
          className="absolute h-[6%] rounded-full bg-[#010101]/96 shadow-[0_0_10px_rgba(1,1,1,0.92)]"
          style={{ top: cut.top, left: cut.left, right: cut.right }}
        />
      ))}
    </span>
  )
}

function CoreAura({ field }: { field: CoreField }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 900"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="sea-core-trace" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(120,120,120,0.04)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.76)" />
          <stop offset="100%" stopColor="rgba(120,120,120,0.04)" />
        </linearGradient>
      </defs>

      {field.traces.map((trace) => (
        <motion.path
          key={trace.id}
          d={trace.d}
          fill="none"
          stroke="url(#sea-core-trace)"
          strokeWidth={trace.width}
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0.35 }}
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

      {field.sparks.map((spark) => (
        <motion.circle
          key={spark.id}
          cx={spark.x}
          cy={spark.y}
          r={spark.r}
          fill="#ffffff"
          initial={{ opacity: 0 }}
          animate={{ opacity: [spark.opacity * 0.35, spark.opacity, spark.opacity * 0.42], scale: [0.94, 1.14, 1] }}
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

function buildCoreField(): CoreField {
  const traces: CoreTrace[] = [
    { id: 'bridge-top', d: 'M 610 312 C 670 284, 770 284, 830 312', width: 1.2, opacity: 0.18, delay: 0.25 },
    { id: 'bridge-mid', d: 'M 590 450 C 670 420, 770 420, 850 450', width: 1.2, opacity: 0.2, delay: 0.5 },
    { id: 'bridge-low', d: 'M 620 590 C 690 566, 750 566, 820 590', width: 1.2, opacity: 0.18, delay: 0.75 },
    { id: 'crest-top', d: 'M 470 168 C 620 122, 820 122, 970 168', width: 0.9, opacity: 0.1, delay: 0.35 },
    { id: 'crest-bottom', d: 'M 470 732 C 620 778, 820 778, 970 732', width: 0.9, opacity: 0.1, delay: 0.65 },
    { id: 'inner-top', d: 'M 650 246 C 690 226, 750 226, 790 246', width: 0.8, opacity: 0.14, delay: 0.2 },
    { id: 'inner-bottom', d: 'M 650 654 C 690 674, 750 674, 790 654', width: 0.8, opacity: 0.14, delay: 0.55 },
  ]

  const sparks: CoreSpark[] = [
    { id: 'core-1', x: 614, y: 312, r: 1.6, opacity: 0.28, delay: 0.28 },
    { id: 'core-2', x: 826, y: 312, r: 1.6, opacity: 0.28, delay: 0.36 },
    { id: 'core-3', x: 596, y: 450, r: 1.8, opacity: 0.3, delay: 0.44 },
    { id: 'core-4', x: 844, y: 450, r: 1.8, opacity: 0.3, delay: 0.52 },
    { id: 'core-5', x: 624, y: 590, r: 1.6, opacity: 0.28, delay: 0.6 },
    { id: 'core-6', x: 816, y: 590, r: 1.6, opacity: 0.28, delay: 0.68 },
    { id: 'core-7', x: 720, y: 168, r: 1.2, opacity: 0.18, delay: 0.76 },
    { id: 'core-8', x: 720, y: 732, r: 1.2, opacity: 0.18, delay: 0.84 },
    { id: 'core-9', x: 720, y: 450, r: 2.2, opacity: 0.36, delay: 0.3 },
  ]

  return { traces, sparks }
}
