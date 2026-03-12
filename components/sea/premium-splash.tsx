'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
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

export function PremiumSplash({
  redirectTo = '/sea',
  durationMs = 12000,
  onComplete,
  exitHoldMs = 2200,
}: PremiumSplashProps) {
  const router = useRouter()
  const [progress, setProgress] = useState(0)

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

    const easeOutQuart = (value: number) => 1 - Math.pow(1 - value, 4)

    const animate = (timestamp: number) => {
      if (!startAt) {
        startAt = timestamp
      }

      const elapsed = timestamp - startAt
      const ratio = Math.min(elapsed / durationMs, 1)
      setProgress(easeOutQuart(ratio) * 100)

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
    <div
      className="fixed inset-0 z-[90] h-[100dvh] w-screen overflow-hidden bg-[#020202] overscroll-none"
      suppressHydrationWarning
    >
      <PremiumSplashScene />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_24%,rgba(2,2,2,0.64)_58%,rgba(2,2,2,0.92)_100%)]" />

      <div className="relative flex h-full items-center justify-center px-6">
        <motion.div
          className="pointer-events-none relative text-center"
          initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, delay: 0.25, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 -z-10 translate-y-4 bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_60%)] blur-3xl" />
          <h1 className="bg-[linear-gradient(180deg,#ffffff_0%,#d7d7d7_52%,#707070_100%)] bg-clip-text text-[4.8rem] font-semibold tracking-[-0.16em] text-transparent sm:text-[6.5rem] md:text-[8.5rem]">
            SEA
          </h1>
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-x-6 bottom-8 md:bottom-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.55 }}
      >
        <div className="mx-auto w-full max-w-sm">
          <div className="h-px overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(120,120,120,0.15)_0%,rgba(255,255,255,0.95)_50%,rgba(120,120,120,0.25)_100%)]"
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
