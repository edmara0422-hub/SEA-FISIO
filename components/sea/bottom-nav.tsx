'use client'

import { motion } from 'framer-motion'
import { Compass, Home } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

type Tab = 'home' | 'explorar'

export function BottomNav({
  active,
  onSwitch,
}: {
  active?: Tab
  onSwitch?: (tab: Tab) => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const resolvedActive: Tab =
    active ?? (pathname === '/explore' || pathname.startsWith('/explore/') ? 'explorar' : 'home')

  const handleSwitch = (tab: Tab) => {
    onSwitch?.(tab)

    if (!onSwitch) {
      if (tab === 'home') {
        window.sessionStorage.setItem('sea-skip-splash', '1')

        if (resolvedActive === 'home') {
          return
        }

        router.push('/sea')
        return
      }

      if (resolvedActive === 'explorar') {
        return
      }

      router.push('/explore')
    }
  }

  return (
    <motion.nav
      data-sea-bottom-nav="true"
      className="fixed bottom-6 left-1/2 z-50 w-[min(30rem,calc(100vw-1.5rem))] -translate-x-1/2"
      initial={{ y: 70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="grid grid-cols-2 gap-1.5 rounded-[1.85rem] border border-white/16 p-1.5 shadow-[0_24px_48px_rgba(0,0,0,0.36)] backdrop-blur-xl"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(231,236,243,0.3) 14%, rgba(86,92,101,0.9) 42%, rgba(9,10,12,0.98) 100%)',
        }}
      >
        <button
          type="button"
          onClick={() => handleSwitch('home')}
          className={`flex items-center justify-center gap-2 rounded-[1.3rem] px-6 py-4 text-sm font-semibold tracking-[0.16em] transition-all duration-300 ${
            resolvedActive === 'home'
              ? 'chrome-active text-[#050505]'
              : 'text-white/82 hover:text-white'
          }`}
        >
          <Home className="h-4 w-4" />
          <span>HOME</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitch('explorar')}
          className={`flex items-center justify-center gap-2 rounded-[1.3rem] px-6 py-4 text-sm font-semibold tracking-[0.16em] transition-all duration-300 ${
            resolvedActive === 'explorar'
              ? 'chrome-active text-[#050505]'
              : 'text-white/82 hover:text-white'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>EXPLORAR</span>
        </button>
      </div>
    </motion.nav>
  )
}
