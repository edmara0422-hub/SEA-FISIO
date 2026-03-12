'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

type PremiumSplashProps = {
  durationMs?: number
  onComplete?: () => void
  exitHoldMs?: number
}

type FieldNode = {
  id: string
  x: number
  y: number
  r: number
  bright: boolean
  delay: number
}

type FieldLink = {
  id: string
  d: string
  opacity: number
  delay: number
}

type NeuralField = {
  links: FieldLink[]
  traces: FieldLink[]
  nodes: FieldNode[]
}

export function PremiumSplash({
  durationMs = 8200,
  onComplete,
  exitHoldMs = 1200,
}: PremiumSplashProps) {
  const [progress, setProgress] = useState(0)
  const field = useMemo(() => buildNeuralField(), [])

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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_18%,rgba(2,2,2,0.9)_58%,rgba(2,2,2,1)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_26%,rgba(255,255,255,0.09),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(201,201,201,0.07),transparent_30%),radial-gradient(circle_at_14%_84%,rgba(181,181,181,0.05),transparent_26%),radial-gradient(circle_at_86%_78%,rgba(255,255,255,0.06),transparent_30%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(180deg,rgba(255,255,255,0.025)_0px,rgba(255,255,255,0.025)_1px,transparent_1px,transparent_8px)]" />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[24rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.16),rgba(255,255,255,0.04)_42%,transparent_72%)] blur-3xl"
        animate={{ opacity: [0.2, 0.34, 0.22], scale: [0.96, 1.04, 0.98] }}
        transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <NeuralMesh field={field} />
      <CentralPulseColumn />

      <div className="relative flex h-full items-center justify-center px-6">
        <motion.div
          className="pointer-events-none relative text-center"
          initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, delay: 0.2, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 h-28 w-[20rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.22),transparent_74%)] blur-3xl"
            animate={{ opacity: [0.35, 0.52, 0.38] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <h1 className="relative bg-[linear-gradient(180deg,#ffffff_0%,#dedede_46%,#8b8b8b_100%)] bg-clip-text text-[4.8rem] font-semibold tracking-[-0.18em] text-transparent sm:text-[6.4rem] md:text-[8.6rem]">
            SEA
          </h1>
          <motion.div
            className="mx-auto mt-5 h-px w-28 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.75),transparent)]"
            animate={{ opacity: [0.35, 0.8, 0.35], scaleX: [0.92, 1.08, 0.92] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
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
              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(130,130,130,0.14)_0%,rgba(255,255,255,0.98)_50%,rgba(130,130,130,0.2)_100%)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function NeuralMesh({ field }: { field: NeuralField }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 900"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="sea-silver-link" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(130,130,130,0.1)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="100%" stopColor="rgba(130,130,130,0.12)" />
        </linearGradient>
        <linearGradient id="sea-silver-trace" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0.32)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
        </linearGradient>
      </defs>

      {field.links.map((link) => (
        <motion.path
          key={link.id}
          d={link.d}
          fill="none"
          stroke="url(#sea-silver-link)"
          strokeWidth="1.15"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0.2 }}
          animate={{ opacity: [link.opacity * 0.55, link.opacity, link.opacity * 0.6], pathLength: 1 }}
          transition={{
            duration: 5.8,
            delay: link.delay,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}

      {field.traces.map((trace) => (
        <motion.path
          key={trace.id}
          d={trace.d}
          fill="none"
          stroke="url(#sea-silver-trace)"
          strokeWidth="1.35"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: [trace.opacity * 0.35, trace.opacity, trace.opacity * 0.25], pathLength: 1 }}
          transition={{
            duration: 4.6,
            delay: trace.delay,
            repeat: Infinity,
            repeatDelay: 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}

      {field.nodes.map((node) => (
        <motion.circle
          key={node.id}
          cx={node.x}
          cy={node.y}
          r={node.r}
          fill={node.bright ? '#ffffff' : '#cfcfcf'}
          initial={{ opacity: 0 }}
          animate={{
            opacity: node.bright ? [0.45, 1, 0.5] : [0.12, 0.42, 0.16],
            scale: node.bright ? [0.92, 1.18, 0.96] : [1, 1.06, 1],
          }}
          transition={{
            duration: node.bright ? 3.6 : 4.8,
            delay: node.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: `${node.x}px ${node.y}px` }}
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
          className="absolute left-1/2 top-1/2 h-[52vh] w-px -translate-y-1/2 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.48),transparent)]"
          style={{ marginLeft: `${offset}px` }}
          animate={{ opacity: [0.14, index % 2 === 0 ? 0.46 : 0.32, 0.16] }}
          transition={{ duration: 4.5 + index * 0.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {pulses.map((pulse) => (
        <motion.span
          key={`pulse-${pulse.x}`}
          className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.42)]"
          style={{ marginLeft: `${pulse.x - 5}px` }}
          initial={{ y: '18vh', opacity: 0 }}
          animate={{ y: ['18vh', '0vh', '-18vh'], opacity: [0, 1, 0] }}
          transition={{ duration: pulse.duration, delay: pulse.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function buildNeuralField(): NeuralField {
  const nodes: FieldNode[] = []
  const links: FieldLink[] = []
  const traces: FieldLink[] = []
  const rowTemplate = [4, 5, 6, 6, 5, 4]

  ;[
    { prefix: 'left', centerX: 428, direction: -1 },
    { prefix: 'right', centerX: 1012, direction: 1 },
  ].forEach((hemisphere, hemisphereIndex) => {
    const rows: FieldNode[][] = []

    for (let row = 0; row < rowTemplate.length; row += 1) {
      const cols = rowTemplate[row]
      const rowNodes: FieldNode[] = []
      const t = row / (rowTemplate.length - 1)
      const wave = Math.sin(t * Math.PI)
      const span = 148 + wave * 156
      const baseY = 178 + row * 108 + Math.sin((row + 1) * 0.65) * 8

      for (let col = 0; col < cols; col += 1) {
        const u = cols === 1 ? 0.5 : col / (cols - 1)
        const offset = (u - 0.5) * span
        const jitterX = Math.sin((row + 2) * (col + 1) * 1.18) * 12 + hemisphere.direction * Math.cos((col + 3) * 0.92) * 8
        const jitterY = Math.cos((row + 1) * (col + 2) * 0.54) * 11
        const node: FieldNode = {
          id: `${hemisphere.prefix}-${row}-${col}`,
          x: hemisphere.centerX + offset + jitterX,
          y: baseY + jitterY,
          r: row === 2 || row === 3 ? (col % 2 === 0 ? 4.8 : 3.4) : col % 2 === 0 ? 3.4 : 2.8,
          bright: (row === 2 || row === 3) && (col === 1 || col === cols - 2 || col === Math.floor(cols / 2)),
          delay: hemisphereIndex * 0.12 + row * 0.1 + col * 0.05,
        }

        rowNodes.push(node)
        nodes.push(node)
      }

      rows.push(rowNodes)
    }

    rows.forEach((rowNodes, rowIndex) => {
      rowNodes.forEach((node, colIndex) => {
        const next = rowNodes[colIndex + 1]
        if (next) {
          const curveY = (rowIndex < 3 ? -1 : 1) * (12 + Math.abs(colIndex - rowNodes.length / 2) * 3)
          links.push({
            id: `${node.id}-h-${next.id}`,
            d: `M ${node.x} ${node.y} Q ${(node.x + next.x) / 2} ${(node.y + next.y) / 2 + curveY} ${next.x} ${next.y}`,
            opacity: 0.16,
            delay: node.delay,
          })
        }

        const nextRow = rows[rowIndex + 1]
        if (nextRow) {
          const targetIndex = Math.round((colIndex / Math.max(rowNodes.length - 1, 1)) * (nextRow.length - 1))
          const target = nextRow[targetIndex]
          const curveX = hemisphere.direction * (18 + rowIndex * 3)
          links.push({
            id: `${node.id}-v-${target.id}`,
            d: `M ${node.x} ${node.y} Q ${(node.x + target.x) / 2 + curveX} ${(node.y + target.y) / 2} ${target.x} ${target.y}`,
            opacity: 0.12,
            delay: node.delay + 0.08,
          })
        }
      })
    })

    ;[1, 2, 3, 4].forEach((rowIndex, traceIndex) => {
      const rowNodes = rows[rowIndex]
      const innerNode = hemisphere.direction === -1 ? rowNodes[rowNodes.length - 1] : rowNodes[0]
      const targetX = hemisphere.direction === -1 ? 620 : 820
      const targetY = 292 + traceIndex * 82
      traces.push({
        id: `${hemisphere.prefix}-trace-${rowIndex}`,
        d: `M ${innerNode.x} ${innerNode.y} Q ${hemisphere.direction === -1 ? 594 : 846} ${(innerNode.y + targetY) / 2 - 26} ${targetX} ${targetY}`,
        opacity: 0.22,
        delay: 0.25 + rowIndex * 0.12,
      })
    })
  })

  return { links, traces, nodes }
}
