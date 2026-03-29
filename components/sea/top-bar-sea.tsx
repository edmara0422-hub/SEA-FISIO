'use client'

import { motion } from 'framer-motion'
import { Bell, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CalendarDays, MoonStar, SunMedium } from 'lucide-react'

export function TopBarSEA() {
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    setMounted(true)
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hour = now.getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const isDay = hour >= 6 && hour < 18
  const GreetingIcon = isDay ? SunMedium : MoonStar

  const dateLabel = mounted
    ? new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).format(now)
    : ''
  const timeLabel = mounted
    ? new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now)
    : ''

  const shellBackground =
    'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(10,10,12,0.92) 52%, rgba(3,3,4,0.985) 100%)'

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-40 px-2.5 pt-5 md:px-8 md:pt-6"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="floating-silver-strip mx-auto flex max-w-2xl items-center justify-between overflow-hidden rounded-[1.4rem] border border-white/12 px-3 py-1.5 text-white shadow-[0_6px_16px_rgba(0,0,0,0.2)] backdrop-blur-xl md:px-5"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(231,236,243,0.3) 14%, rgba(86,92,101,0.9) 42%, rgba(9,10,12,0.98) 100%)',
        }}
      >
        {/* Left: SEA logo + greeting + date */}
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.6rem] border border-white/16"
            style={{ background: shellBackground }}
          >
            <span
              className="metal-text text-[0.5rem] font-semibold tracking-[0.3em]"
              style={{ paddingLeft: '0.3em' }}
            >
              SEA
            </span>
          </div>

          {mounted && (
            <>
              <div className="flex items-center gap-1 rounded-full border border-white/12 bg-black/18 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.18em] text-white/74">
                <GreetingIcon className="h-2.5 w-2.5 text-white/74" />
                <span>{greeting}</span>
              </div>

              <div className="hidden items-center gap-1 text-[8px] text-white/55 sm:flex">
                <CalendarDays className="h-2.5 w-2.5 text-white/50" />
                <span className="uppercase tracking-[0.1em]">{dateLabel}</span>
              </div>
            </>
          )}
        </div>

        {/* Center: time */}
        {mounted && (
          <p className="metal-text text-[0.7rem] font-semibold leading-none tracking-[0.18em] tabular-nums">
            {timeLabel}
          </p>
        )}

        {/* Right: buttons */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            aria-label="Notificacoes"
            className="flex h-7 w-7 items-center justify-center rounded-[0.6rem] border border-white/12 text-white/70 transition hover:text-white"
            style={{ background: shellBackground }}
          >
            <Bell className="h-3 w-3" />
          </button>
          <button
            aria-label="Perfil"
            className="flex h-7 w-7 items-center justify-center rounded-[0.6rem] border border-white/12 text-white/70 transition hover:text-white"
            style={{ background: shellBackground }}
          >
            <User className="h-3 w-3" />
          </button>
        </div>
      </div>
    </motion.header>
  )
}
