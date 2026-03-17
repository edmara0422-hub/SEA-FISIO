'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Compass, Home } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

export function BottomNav({
  active,
  onSwitch,
}: {
  active?: string
  onSwitch?: (tab: string) => void
}) {
  const pathname = usePathname()
  const router = useRouter()

  // Prefetch both routes immediately on mount
  useEffect(() => {
    router.prefetch('/sea')
    router.prefetch('/explore')
  }, [router])

  const isHome = pathname === '/sea' || pathname === '/home' || pathname === '/'
  const isExplore = pathname === '/explore' || pathname.startsWith('/explore/')

  const tabClass = (active: boolean) =>
    `flex items-center justify-center gap-2 rounded-[1.3rem] px-6 py-4 text-sm font-semibold tracking-[0.16em] transition-colors duration-200 ${
      active ? 'chrome-active text-[#050505]' : 'text-white/82 hover:text-white'
    }`

  return (
    <motion.nav
      data-sea-bottom-nav="true"
      className="fixed bottom-6 left-1/2 z-50 w-[min(30rem,calc(100vw-1.5rem))] -translate-x-1/2"
      initial={{ y: 70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="grid grid-cols-2 gap-1.5 rounded-[1.85rem] border border-white/16 p-1.5 shadow-[0_24px_48px_rgba(0,0,0,0.36)] backdrop-blur-xl"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(231,236,243,0.3) 14%, rgba(86,92,101,0.9) 42%, rgba(9,10,12,0.98) 100%)',
        }}
      >
        <Link href="/sea" prefetch className={tabClass(isHome)} onClick={() => onSwitch?.('home')}>
          <Home className="h-4 w-4" />
          <span>HOME</span>
        </Link>

        <Link href="/explore" prefetch className={tabClass(isExplore)} onClick={() => onSwitch?.('explorar')}>
          <Compass className="h-4 w-4" />
          <span>EXPLORAR</span>
        </Link>
      </div>
    </motion.nav>
  )
}
