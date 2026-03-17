'use client'

import { ReactNode, useLayoutEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { BottomNav } from '@/components/sea/bottom-nav'
import { PremiumSplash } from '@/components/sea/premium-splash'

let splashShownForRuntime = false

export function MainShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [showSplash, setShowSplash] = useState<boolean | null>(null)

  useLayoutEffect(() => {
    if (!splashShownForRuntime) {
      splashShownForRuntime = true
      setShowSplash(true)
      return
    }

    setShowSplash(false)
  }, [pathname])

  return (
    <>
      {showSplash === null ? <div className="fixed inset-0 z-[89] bg-[#010101]" /> : null}

      {showSplash ? (
        <PremiumSplash durationMs={2400} exitHoldMs={500} onComplete={() => setShowSplash(false)} />
      ) : null}

      <div className="min-h-screen bg-[#020202] text-white">
        <main className="pb-28">{children}</main>
        <BottomNav />
      </div>
    </>
  )
}
