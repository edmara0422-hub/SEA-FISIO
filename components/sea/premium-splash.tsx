'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

// Deterministic seeded random - sempre retorna os mesmos valores
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

interface OrbConfig {
  id: number
  delay: number
  duration: number
  xStart: number
  yStart: number
  xMid: number
  yMid: number
  xEnd: number
  yEnd: number
}

// Pré-gerar configs determinísticas para orbs
function generateOrbConfigs(): OrbConfig[] {
  return Array.from({ length: 5 }, (_, i) => {
    const baseSeed = i * 100
    return {
      id: i,
      delay: i * 0.3,
      duration: 8 + i,
      xStart: (seededRandom(baseSeed) * 400 - 200),
      yStart: (seededRandom(baseSeed + 1) * 400 - 200),
      xMid: (seededRandom(baseSeed + 0.5) * 400 - 200),
      yMid: (seededRandom(baseSeed + 1.5) * 400 - 200),
      xEnd: (seededRandom(baseSeed + 2) * 400 - 200),
      yEnd: (seededRandom(baseSeed + 2.5) * 400 - 200),
    }
  })
}

function Orb({ config }: { config: OrbConfig }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 120,
        height: 120,
        background: 'radial-gradient(circle at 30% 30%, rgba(147, 112, 219, 0.4), rgba(59, 130, 246, 0.1))',
        filter: 'blur(40px)',
      }}
      initial={{
        x: config.xStart,
        y: config.yStart,
        opacity: 0,
      }}
      animate={{
        x: [config.xStart, config.xMid, config.xEnd],
        y: [config.yStart, config.yMid, config.yEnd],
        opacity: [0, 0.6, 0],
      }}
      transition={{
        duration: config.duration,
        delay: config.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      suppressHydrationWarning
    />
  )
}

function Grid() {
  return (
    <svg 
      className="absolute inset-0 w-full h-full opacity-10" 
      preserveAspectRatio="none"
      suppressHydrationWarning
    >
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(147, 112, 219, 0.5)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  )
}

function AnimatedText({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
    >
      <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
        {text}
      </h1>
    </motion.div>
  )
}

type PremiumSplashProps = {
  redirectTo?: string | null
  durationMs?: number
  onComplete?: () => void
}

export function PremiumSplash({
  redirectTo = '/sea',
  durationMs = 2200,
  onComplete,
}: PremiumSplashProps) {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  // Gerar configs determinísticas uma só vez
  const orbConfigs = useMemo(() => generateOrbConfigs(), [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const tickMs = 80
    const totalSteps = Math.max(1, Math.ceil(durationMs / tickMs))
    const increment = 100 / totalSteps
    let completed = false

    const interval = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + increment, 100)

        if (next >= 100 && !completed) {
          completed = true
          clearInterval(interval)
          window.setTimeout(() => {
            if (redirectTo) {
              router.push(redirectTo)
            }
            onComplete?.()
          }, 220)
        }

        return next
      })
    }, tickMs)

    return () => clearInterval(interval)
  }, [durationMs, onComplete, redirectTo, router])

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-hidden" suppressHydrationWarning>
      <Grid />

      {isMounted && (
        <div className="absolute inset-0" suppressHydrationWarning>
          {orbConfigs.map((config) => (
            <Orb key={config.id} config={config} />
          ))}
        </div>
      )}

      <div className="relative h-full flex flex-col items-center justify-center px-4">
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
          }}
          suppressHydrationWarning
        />

        <div className="relative z-10 space-y-8 text-center max-w-2xl">
          <AnimatedText text="SEA" delay={0.2} />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-lg md:text-xl text-white/60 font-light tracking-wide">
              Sistema de Estudo Avançado
            </p>
            <p className="text-sm md:text-base text-white/40 mt-2 leading-relaxed">
              Tecnologia de ponta para simulações clínicas em tempo real
            </p>
          </motion.div>

          <motion.div
            className="flex gap-3 justify-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-white"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-12 w-full max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="space-y-3">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
              />
            </div>
            <p className="text-xs text-white/40 text-center font-mono tracking-wider">
              {Math.min(Math.round(progress), 100)}%
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
