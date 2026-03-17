'use client'

import { useEffect, useState } from 'react'
import { MoonStar, SunMedium } from 'lucide-react'

export function GreetingClockCard({ className = '' }: { className?: string }) {
  const [now, setNow] = useState(() => new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  if (!mounted) {
    return (
      <div className={`h-11 w-full rounded-[1.1rem] bg-white/4 ${className}`} />
    )
  }

  const hour = now.getHours()
  const isDay = hour >= 6 && hour < 18
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const Icon = isDay ? SunMedium : MoonStar

  const dateLabel = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short', day: '2-digit', month: 'short',
  }).format(now)

  const timeLabel = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).format(now)

  return (
    <div
      className={`relative flex w-full items-center justify-between overflow-hidden rounded-[1.85rem] border border-white/16 px-5 py-2.5 shadow-[0_24px_48px_rgba(0,0,0,0.36)] backdrop-blur-xl md:px-6 ${className}`}
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(231,236,243,0.3) 14%, rgba(86,92,101,0.9) 42%, rgba(9,10,12,0.98) 100%)',
      }}
    >
      {/* top shimmer */}
      <div className="pointer-events-none absolute inset-x-3 top-1 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.56)_50%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-x-[8%] bottom-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.42)_50%,transparent_100%)] opacity-70" />

      {/* Left: greeting + date */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3 w-3 text-white/40" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.20em] text-white/50">
            {greeting}
          </span>
        </div>
        <div className="h-3 w-px bg-white/12" />
        <span className="text-[10px] uppercase tracking-[0.14em] text-white/28">
          {dateLabel}
        </span>
      </div>

      {/* Right: clock */}
      <p className="font-mono text-[1.15rem] font-light leading-none tracking-[0.18em] text-white/70">
        {timeLabel}
      </p>
    </div>
  )
}
