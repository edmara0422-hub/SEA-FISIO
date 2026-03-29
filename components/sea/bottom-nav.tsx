'use client'

import { motion } from 'framer-motion'
import { Compass, Home } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function BottomNav({
  onSwitch,
}: {
  active?: string
  onSwitch?: (tab: string) => void
}) {
  const pathname = usePathname()

  const p = pathname?.replace(/\/$/, '') ?? ''
  const isHome = p === '/sea' || p === '/home' || p === ''
  const isExplore = p === '/explore' || p.startsWith('/explore/')

  const tabClass = (active: boolean) =>
    `flex items-center justify-center gap-1.5 rounded-[1rem] px-5 py-2.5 text-xs font-semibold tracking-[0.16em] transition-colors duration-200 ${
      active ? 'chrome-active text-[#050505]' : 'text-white/82 hover:text-white'
    }`

  return (
    <>
    {/* Solid block below nav to hide content underneath */}
    <div className="fixed bottom-0 left-0 right-0 z-40 h-20" style={{ background: '#010101' }} />
    <motion.nav
      data-sea-bottom-nav="true"
      className="fixed bottom-5 left-0 right-0 z-50 px-2.5 md:px-8"
      initial={{ y: 70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="mx-auto grid max-w-2xl grid-cols-2 gap-1 rounded-[1.4rem] border border-white/16 p-1 shadow-[0_24px_48px_rgba(0,0,0,0.36)] backdrop-blur-xl"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(231,236,243,0.3) 14%, rgba(86,92,101,0.9) 42%, rgba(9,10,12,0.98) 100%)',
        }}
      >
        <button className={tabClass(isHome)} onClick={() => onSwitch?.('home')}>
          <Home className="h-3.5 w-3.5" />
          <span>HOME</span>
        </button>

        <button className={tabClass(isExplore)} onClick={() => onSwitch?.('explorar')}>
          <Compass className="h-3.5 w-3.5" />
          <span>EXPLORAR</span>
        </button>
      </div>
    </motion.nav>
    </>
  )
}
