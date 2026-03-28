'use client'

import { ReactNode, useLayoutEffect, useState, useCallback, startTransition, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { BottomNav } from '@/components/sea/bottom-nav'
import { PremiumSplash } from '@/components/sea/premium-splash'
import { SeaLanding } from '@/components/sea/sea-landing'

// Lazy-load both pages once — they stay mounted forever after
const HomePageClient = dynamic(
  () => import('@/components/sea/home-page-client'),
  { ssr: false }
)
const ExplorePageClient = dynamic(
  () => import('@/components/sea/explore-page-client'),
  { ssr: false }
)

// Preload sub-route chunks in background so navigation is instant
function usePreloadRoutes() {
  useEffect(() => {
    const id = setTimeout(() => {
      import('@/components/sea/conteudos-page-client')
      import('@/components/sea/sistemas-page-client')
      import('@/components/sea/explore-page-client')
    }, 1500)
    return () => clearTimeout(id)
  }, [])
}

let splashShownForRuntime = false

type Tab = 'home' | 'explore' | 'other'

function pathToTab(p: string | null): Tab {
  const s = p?.replace(/\/$/, '') ?? ''
  if (s === '/sea' || s === '/home' || s === '' || s === '/sea/index') return 'home'
  if (s === '/explore') return 'explore'
  return 'other'
}

export function MainShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  usePreloadRoutes()

  // Prefetch Next.js routes so server response is instant
  useEffect(() => {
    router.prefetch('/explore')
    router.prefetch('/explore/conteudos')
    router.prefetch('/explore/sistemas')
  }, [router])
  // Landing always shows on app open. Splash after clicking "Entrar no SEA".
  const [phase, setPhase] = useState<'landing' | 'splash' | 'ready'>('landing')
  const [activeTab, setActiveTab] = useState<Tab>(() => pathToTab(pathname))
  const [visited, setVisited] = useState<Record<'home' | 'explore', boolean>>(() => ({
    home: pathToTab(pathname) === 'home',
    explore: pathToTab(pathname) === 'explore',
  }))

  // Sync tab with pathname
  useLayoutEffect(() => {
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
      {/* 1. Landing — sempre aparece primeiro */}
      {phase === 'landing' && (
        <SeaLanding onEnter={() => setPhase('splash')} />
      )}

      {/* 2. Splash SEA — aparece depois do "Entrar no SEA" */}
      {phase === 'splash' && (
        <PremiumSplash durationMs={2400} exitHoldMs={500} onComplete={() => setPhase('ready')} />
      )}

      <div className="sea-shell-root">
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
