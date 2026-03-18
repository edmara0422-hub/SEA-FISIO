'use client'

import { ReactNode, useLayoutEffect, useState, useCallback, startTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { BottomNav } from '@/components/sea/bottom-nav'
import { PremiumSplash } from '@/components/sea/premium-splash'

// Lazy-load both pages once — they stay mounted forever after
const HomePageClient = dynamic(
  () => import('@/components/sea/home-page-client'),
  { ssr: false }
)
const ExplorePageClient = dynamic(
  () => import('@/components/sea/explore-page-client'),
  { ssr: false }
)

let splashShownForRuntime = false

type Tab = 'home' | 'explore' | 'other'

function pathToTab(p: string): Tab {
  if (p === '/sea' || p === '/home' || p === '/') return 'home'
  if (p === '/explore') return 'explore'
  return 'other'
}

export function MainShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [showSplash, setShowSplash] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>(() => pathToTab(pathname))
  // Track if Home/Explore were ever visited so we mount them lazily
  const [visited, setVisited] = useState<Record<'home' | 'explore', boolean>>(() => ({
    home: pathToTab(pathname) === 'home',
    explore: pathToTab(pathname) === 'explore',
  }))

  useLayoutEffect(() => {
    if (!splashShownForRuntime) {
      splashShownForRuntime = true
      setShowSplash(true)
    } else {
      setShowSplash(false)
    }
    const tab = pathToTab(pathname)
    setActiveTab(tab)
    if (tab === 'home' || tab === 'explore') {
      setVisited((v) => ({ ...v, [tab]: true }))
    }
  }, [pathname])

  const handleSwitch = useCallback((tab: string) => {
    const t = tab === 'home' ? 'home' : tab === 'explorar' ? 'explore' : 'other'
    // Instant visual switch
    setActiveTab(t as Tab)
    if (t === 'home' || t === 'explore') {
      setVisited((v) => ({ ...v, [t]: true }))
    }
    // Update URL in background without blocking
    startTransition(() => {
      router.push(t === 'home' ? '/sea' : '/explore', { scroll: false })
    })
  }, [router])

  const isMainTab = activeTab === 'home' || activeTab === 'explore'

  return (
    <>
      {showSplash === null ? <div className="fixed inset-0 z-[89] bg-[#010101]" /> : null}

      {showSplash ? (
        <PremiumSplash durationMs={2400} exitHoldMs={500} onComplete={() => setShowSplash(false)} />
      ) : null}

      <div className="min-h-screen bg-[#020202] text-white">
        <main className="pb-28">
          {/* Cached Home tab — stays mounted once visited */}
          {visited.home && (
            <div style={{ display: activeTab === 'home' ? 'block' : 'none' }}>
              <HomePageClient />
            </div>
          )}

          {/* Cached Explore tab — stays mounted once visited */}
          {visited.explore && (
            <div style={{ display: activeTab === 'explore' ? 'block' : 'none' }}>
              <ExplorePageClient />
            </div>
          )}

          {/* Other routes (profile, conteudos, sistemas, etc.) render normally */}
          {!isMainTab && children}
        </main>
        <BottomNav onSwitch={handleSwitch} />
      </div>
    </>
  )
}
