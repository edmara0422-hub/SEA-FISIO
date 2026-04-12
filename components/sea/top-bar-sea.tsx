'use client'

import { Bell, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CalendarDays, MoonStar, SunMedium } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function TopBarSEA() {
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const [showNotif, setShowNotif] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

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

  const iconSize = 'h-3.5 w-3.5'
  const btnClass = 'flex h-6 w-6 items-center justify-center rounded-[0.5rem] border border-white/12 text-white/70 transition hover:text-white'

  return (
    <>
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
              onClick={() => { setShowNotif((v) => !v); setShowProfile(false) }}
              className={btnClass}
              style={{ background: shellBackground }}
            >
              <Bell className={iconSize} />
            </button>
            <button
              aria-label="Perfil"
              onClick={() => { setShowProfile((v) => !v); setShowNotif(false) }}
              className={btnClass}
              style={{ background: shellBackground }}
            >
              <User className={iconSize} />
            </button>
          </div>
        </div>
      </header>

      {/* Painel Notificações */}
      <AnimatePresence>
        {showNotif && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 top-16 z-50 w-72 rounded-[1rem] border border-white/10 bg-[#0a0a0c]/95 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl md:right-8 md:top-18"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/50">Notificacoes</p>
              <button onClick={() => setShowNotif(false)} className="text-white/30 hover:text-white/60"><X className="h-3 w-3" /></button>
            </div>
            <div className="space-y-1.5">
              <div className="rounded-[0.5rem] border border-white/6 bg-white/[0.02] px-2 py-1.5">
                <p className="text-[7px] font-semibold text-white/60">Sistema atualizado.</p>
                <p className="text-[6px] text-white/30">Novas analises automaticas em Lab, BH e Gasometria.</p>
              </div>
              <div className="rounded-[0.5rem] border border-white/6 bg-white/[0.02] px-2 py-1.5">
                <p className="text-[7px] font-semibold text-white/60">Prontuario inteligente.</p>
                <p className="text-[6px] text-white/30">Cruzamento de dados ativo: Lab + BH + Gaso + Neuro + DVA.</p>
              </div>
              <p className="pt-1 text-center text-[6px] text-white/20">Sem novas notificacoes.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Painel Perfil */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 top-16 z-50 w-64 rounded-[1rem] border border-white/10 bg-[#0a0a0c]/95 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl md:right-8 md:top-18"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/50">Perfil</p>
              <button onClick={() => setShowProfile(false)} className="text-white/30 hover:text-white/60"><X className="h-3 w-3" /></button>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 rounded-[0.5rem] border border-white/6 bg-white/[0.02] px-2 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                  <User className="h-4 w-4 text-white/40" />
                </div>
                <div>
                  <p className="text-[8px] font-semibold text-white/70">Fisioterapeuta</p>
                  <p className="text-[6px] text-white/30">SEA Fisio · Plano ativo.</p>
                </div>
              </div>
              <div className="rounded-[0.5rem] border border-white/6 bg-white/[0.02] px-2 py-1.5">
                <p className="text-[7px] text-white/40">Versao do app: 1.0.0</p>
                <p className="text-[6px] text-white/25">Dados sincronizados via Supabase.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
