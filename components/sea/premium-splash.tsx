'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type PremiumSplashProps = {
  redirectTo?: string | null
  durationMs?: number
  onComplete?: () => void
  exitHoldMs?: number
}

type PositionedElement = {
  left: string
  top: string
  size: number
  opacity: number
  delay: number
  duration: number
}

export function PremiumSplash({
  redirectTo = '/sea',
  durationMs = 8200,
  onComplete,
  exitHoldMs = 1200,
}: PremiumSplashProps) {
  const router = useRouter()
  const [progress, setProgress] = useState(0)

  const halos = useMemo<PositionedElement[]>(
    () => [
      { left: '12%', top: '18%', size: 240, opacity: 0.08, delay: 0.2, duration: 9 },
      { left: '86%', top: '20%', size: 220, opacity: 0.07, delay: 1.1, duration: 11 },
      { left: '18%', top: '76%', size: 260, opacity: 0.05, delay: 0.8, duration: 12 },
      { left: '82%', top: '78%', size: 250, opacity: 0.06, delay: 1.7, duration: 10 },
      { left: '50%', top: '16%', size: 180, opacity: 0.05, delay: 0.5, duration: 8 },
      { left: '50%', top: '86%', size: 180, opacity: 0.04, delay: 1.4, duration: 10 },
    ],
    []
  )

  const particles = useMemo<PositionedElement[]>(() => {
    return Array.from({ length: 34 }, (_, index) => ({
      left: `${8 + ((index * 17) % 84)}%`,
      top: `${10 + ((index * 13) % 78)}%`,
      size: 2 + (index % 4),
      opacity: 0.18 + (index % 5) * 0.06,
      delay: index * 0.14,
      duration: 4 + (index % 6),
    }))
  }, [])

  const nodes = useMemo(() => {
    const elements: Array<PositionedElement & { tone: 'soft' | 'bright' }> = []

    ;([-1, 1] as const).forEach((side) => {
      for (let row = 0; row < 5; row += 1) {
        for (let col = 0; col < 6; col += 1) {
          const ringFactor = 1 - Math.abs(2 - row) * 0.18
          const leftBase = side === -1 ? 33 : 67
          const left = leftBase + side * (col * 2.7 + ringFactor * 1.6)
          const top = 28 + row * 10 + ((col + row) % 2 === 0 ? -1.4 : 1.6)

          elements.push({
            left: `${left}%`,
            top: `${top}%`,
            size: col % 3 === 0 ? 8 : 5,
            opacity: col % 3 === 0 ? 0.92 : 0.45,
            delay: row * 0.18 + col * 0.09,
            duration: 3.8 + ((row + col) % 4),
            tone: col % 3 === 0 ? 'bright' : 'soft',
          })
        }
      }
    })

    return elements
  }, [])

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
        if (redirectTo) {
          router.push(redirectTo)
        }
        onComplete?.()
      }, exitHoldMs)
    }

    frameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(exitTimer)
    }
  }, [durationMs, exitHoldMs, onComplete, redirectTo, router])

  return (
    <div className="fixed inset-0 z-[90] h-[100dvh] w-screen overflow-hidden bg-[#020202]" suppressHydrationWarning>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_24%,rgba(2,2,2,0.84)_64%,rgba(2,2,2,0.98)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%,transparent_70%,rgba(255,255,255,0.02))]" />

      {halos.map((halo, index) => (
        <div
          key={`halo-${index}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),rgba(255,255,255,0.04)_45%,transparent_72%)] blur-3xl animate-pulse"
          style={{
            left: halo.left,
            top: halo.top,
            width: `${halo.size}px`,
            height: `${halo.size}px`,
            opacity: halo.opacity,
            animationDelay: `${halo.delay}s`,
            animationDuration: `${halo.duration}s`,
          }}
        />
      ))}

      <div className="absolute inset-0">
        {particles.map((particle, index) => (
          <span
            key={`particle-${index}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white animate-pulse"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 8}px rgba(255,255,255,0.22)`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}

        {nodes.map((node, index) => (
          <span
            key={`node-${index}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse"
            style={{
              left: node.left,
              top: node.top,
              width: `${node.size}px`,
              height: `${node.size}px`,
              opacity: node.opacity,
              background: node.tone === 'bright' ? '#ffffff' : 'rgba(210,210,210,0.88)',
              boxShadow:
                node.tone === 'bright'
                  ? '0 0 22px rgba(255,255,255,0.45)'
                  : '0 0 14px rgba(255,255,255,0.18)',
              animationDelay: `${node.delay}s`,
              animationDuration: `${node.duration}s`,
            }}
          />
        ))}

        {[-18, -6, 6, 18].map((offset, index) => (
          <div
            key={`signal-${offset}`}
            className="absolute left-1/2 top-1/2 h-[52vh] w-px -translate-y-1/2 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.42),transparent)] blur-[0.4px] animate-pulse"
            style={{
              marginLeft: `${offset}px`,
              opacity: index % 2 === 0 ? 0.42 : 0.28,
              animationDelay: `${index * 0.35}s`,
              animationDuration: `${5 + index}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex h-full items-center justify-center px-6">
        <div className="pointer-events-none relative text-center">
          <div className="absolute left-1/2 top-1/2 h-32 w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_70%)] blur-3xl" />
          <h1 className="relative bg-[linear-gradient(180deg,#ffffff_0%,#d9d9d9_48%,#7b7b7b_100%)] bg-clip-text text-[4.8rem] font-semibold tracking-[-0.18em] text-transparent sm:text-[6.4rem] md:text-[8.2rem]">
            SEA
          </h1>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-6 bottom-8 md:bottom-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="h-px overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(120,120,120,0.1)_0%,rgba(255,255,255,0.95)_50%,rgba(120,120,120,0.18)_100%)] transition-[width] duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
