'use client'

import { ReactNode, useLayoutEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { BottomNav } from '@/components/sea/bottom-nav'
import { PremiumSplash } from '@/components/sea/premium-splash'

let runtimeEntryPath: string | null = null
let splashShownForRuntime = false

export function MainShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [showSplash, setShowSplash] = useState<boolean | null>(pathname === '/sea' ? null : false)

  useLayoutEffect(() => {
    if (runtimeEntryPath === null) {
      runtimeEntryPath = pathname
    }

    if (pathname !== '/sea') {
      setShowSplash(false)
      return
    }

    const shouldShowOnBoot = runtimeEntryPath === '/sea' && !splashShownForRuntime

    if (shouldShowOnBoot) {
      splashShownForRuntime = true
      setShowSplash(true)
      return
    }

    setShowSplash(false)
  }, [pathname])

  return (
    <>
      {pathname === '/sea' && showSplash === null ? (
        <div className="fixed inset-0 z-[89] bg-[#010101]" />
      ) : null}

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
