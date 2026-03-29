'use client'

import { motion } from 'framer-motion'
import { Bell, User } from 'lucide-react'
import { useState, useEffect } from 'react'

function useStaticClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [])
  return time
}

export function TopBarSEA() {
  const time = useStaticClock()
  const shellBackground =
    'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(10,10,12,0.92) 52%, rgba(3,3,4,0.985) 100%)'

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-40 px-2.5 pt-5 md:px-8 md:pt-6"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="sea-dark-glass mx-auto flex h-12 max-w-2xl items-center justify-between gap-3 rounded-[1.4rem] px-3 md:px-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.7rem] border border-white/16"
            style={{
              background: shellBackground,
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 20px rgba(0,0,0,0.38)',
            }}
          >
            <span
              className="metal-text text-[0.6rem] font-semibold tracking-[0.32em]"
              style={{
                fontFamily: 'Poppins, sans-serif',
                paddingLeft: '0.32em',
                textShadow: '0 0 20px rgba(255,255,255,0.12)',
              }}
            >
              SEA
            </span>
          </div>

          <p
            className="metal-text text-[9px] font-semibold uppercase tracking-[0.14em] text-white/74 md:text-[10px]"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Sistema de Estudo Avancado
          </p>
        </div>

        {/* Clock */}
        {time && (
          <span className="text-[11px] font-light tabular-nums tracking-wider text-white/50">
            {time}
          </span>
        )}

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            aria-label="Notificacoes"
            className="flex h-8 w-8 items-center justify-center rounded-[0.7rem] border border-white/12 text-white/70 transition hover:text-white"
            style={{ background: shellBackground }}
          >
            <Bell className="h-3.5 w-3.5" />
          </button>

          <button
            aria-label="Perfil"
            className="flex h-8 w-8 items-center justify-center rounded-[0.7rem] border border-white/12 text-white/70 transition hover:text-white"
            style={{ background: shellBackground }}
          >
            <User className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.header>
  )
}
