'use client'

import { Bell, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, MoonStar, SunMedium } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/authStore'

export function TopBarSEA() {
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const router = useRouter()
  const { profile } = useAuthStore()

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

  const btnClass = 'flex h-6 w-6 items-center justify-center rounded-[0.5rem] border border-white/12 text-white/70 transition hover:text-white active:scale-95'

  return (
    <header className="fixed left-0 right-0 top-0 z-40 px-2.5 pt-5 md:px-8 md:pt-6">
      <div
        className="mx-auto flex max-w-2xl items-center justify-between overflow-hidden rounded-[1.4rem] border border-white/12 p-0.5 px-2 text-white shadow-[0_6px_16px_rgba(0,0,0,0.2)] backdrop-blur-xl md:px-3"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(231,236,243,0.3) 14%, rgba(86,92,101,0.9) 42%, rgba(9,10,12,0.98) 100%)',
        }}
      >
        {/* Left: SEA logo + greeting + date */}
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[0.4rem] border border-white/16"
            style={{ background: shellBackground }}
          >
            <span
              className="metal-text text-[0.4rem] font-semibold tracking-[0.25em]"
              style={{ paddingLeft: '0.3em' }}
            >
              SEA
            </span>
          </div>

          {mounted && (
            <>
              <div className="flex items-center gap-1 rounded-full border border-white/12 bg-black/18 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.15em] text-white/74">
                <GreetingIcon className="h-2.5 w-2.5 text-white/74" />
                <span>{greeting}</span>
              </div>

              <div className="flex items-center gap-1 text-[7px] text-white/55">
                <CalendarDays className="h-2.5 w-2.5 text-white/50" />
                <span className="uppercase tracking-[0.08em]">{dateLabel}</span>
              </div>
            </>
          )}
        </div>

        {/* Right: time + buttons */}
        <div className="flex shrink-0 items-center gap-1.5">
          {mounted && (
            <span className="text-[8px] font-bold tabular-nums tracking-[0.12em] text-white/75">
              {timeLabel}
            </span>
          )}
          <button
            aria-label="Notificacoes"
            onClick={() => router.push('/profile')}
            className={btnClass}
            style={{ background: shellBackground }}
          >
            <Bell className="h-3.5 w-3.5" />
          </button>
          <button
            aria-label="Perfil"
            onClick={() => router.push('/profile')}
            className={btnClass}
            style={{ background: shellBackground }}
          >
            {profile?.photo_url ? (
              <img src={profile.photo_url} alt="" className="h-5 w-5 rounded-[0.3rem] object-cover" />
            ) : (
              <User className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
