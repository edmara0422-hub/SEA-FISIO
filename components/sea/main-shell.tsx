'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { BottomNav } from '@/components/sea/bottom-nav'
import { PremiumSplash } from '@/components/sea/premium-splash'

let runtimeEntryPath: string | null = null
let splashShownForRuntime = false

export function MainShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [showSplash, setShowSplash] = useState(() => {
    if (runtimeEntryPath === null) {
      runtimeEntryPath = pathname
    }

    const shouldShowOnBoot = pathname === '/sea' && runtimeEntryPath === '/sea' && !splashShownForRuntime

    if (shouldShowOnBoot) {
      splashShownForRuntime = true
      return true
    }

    return false
  })

  useEffect(() => {
    if (pathname !== '/sea') {
      setShowSplash(false)
    }
  }, [pathname])

  return (
    <>
      {pathname === '/sea' && showSplash ? (
        <PremiumSplash durationMs={8200} exitHoldMs={1200} onComplete={() => setShowSplash(false)} />
      ) : null}

      <div className="min-h-screen bg-[#020202] text-white">
        <main className="pb-28">
          {children}
        </main>
        <BottomNav />
      </div>
    </>
  )
}
