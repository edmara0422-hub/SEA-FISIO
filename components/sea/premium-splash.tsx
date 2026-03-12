'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type PremiumSplashProps = {
  redirectTo?: string | null
  durationMs?: number
  onComplete?: () => void
  exitHoldMs?: number
}

const PremiumSplashScene = dynamic(
  () => import('@/components/sea/premium-splash-scene').then((mod) => mod.PremiumSplashScene),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#020202]" />,
  }
)

const statusMessages = ['Mapeando cortex', 'Sinapses online', 'Nucleo estavel', 'Abrindo SEA']

export function PremiumSplash({
  redirectTo = '/sea',
  durationMs = 9800,
  onComplete,
  exitHoldMs = 1800,
}: PremiumSplashProps) {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const status = useMemo(
    () => statusMessages[Math.min(Math.floor((progress / 100) * statusMessages.length), statusMessages.length - 1)],
    [progress]
  )

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
        const step =
          current < 52 ? 100 / (totalSteps * 1.25) : current < 86 ? 100 / (totalSteps * 1.95) : 100 / (totalSteps * 3.4)
        const next = Math.min(current + step, 100)

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
      <PremiumSplashScene />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_28%,rgba(2,2,2,0.78)_100%)]" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-5 top-5 h-24 w-24 rounded-tl-[2.25rem] border-l border-t border-white/10 md:left-8 md:top-8 md:h-32 md:w-32" />
        <div className="absolute right-5 top-5 h-24 w-24 rounded-tr-[2.25rem] border-r border-t border-white/10 md:right-8 md:top-8 md:h-32 md:w-32" />
        <div className="absolute bottom-5 left-5 h-24 w-24 rounded-bl-[2.25rem] border-b border-l border-white/10 md:bottom-8 md:left-8 md:h-32 md:w-32" />
        <div className="absolute bottom-5 right-5 h-24 w-24 rounded-br-[2.25rem] border-b border-r border-white/10 md:bottom-8 md:right-8 md:h-32 md:w-32" />
      </div>

      <div className="relative flex h-full flex-col items-center justify-between px-5 py-8 md:px-8 md:py-10">
        <div className="h-12" />

        <motion.div
          className="flex flex-1 flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2 }}
        >
          <p className="text-[11px] uppercase tracking-[0.42em] text-white/30">Sistema de Estudo Avancado</p>
          <h1 className="mt-6 bg-gradient-to-b from-white via-[#e7e7e7] to-[#7a7a7a] bg-clip-text text-6xl font-semibold tracking-[-0.08em] text-transparent sm:text-7xl md:text-8xl">
            SEA
          </h1>
        </motion.div>

        <motion.div
          className="w-full max-w-xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.42 }}
        >
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-white/34">
            <span>{status}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/7">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#4f4f4f_0%,#ffffff_50%,#888888_100%)]"
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
