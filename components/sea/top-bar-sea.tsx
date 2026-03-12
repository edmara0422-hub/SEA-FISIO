'use client'

import { motion } from 'framer-motion'
import { Bell, User } from 'lucide-react'

export function TopBarSEA() {
  const shellBackground =
    'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(10,10,12,0.92) 52%, rgba(3,3,4,0.985) 100%)'

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-40 px-3 pt-3 md:px-6"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="sea-dark-glass mx-auto flex h-[4.8rem] max-w-7xl items-center justify-between gap-4 rounded-[1.9rem] px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.05rem] border border-white/16"
            style={{
              background: shellBackground,
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.12), 0 16px 32px rgba(0,0,0,0.38)',
            }}
          >
            <span
              className="metal-text text-[0.8rem] font-semibold tracking-[0.32em]"
              style={{
                fontFamily: 'Poppins, sans-serif',
                paddingLeft: '0.32em',
                textShadow: '0 0 20px rgba(255,255,255,0.12)',
              }}
            >
              SEA
            </span>
          </div>

          <div>
            <p
              className="metal-text text-[10px] font-semibold uppercase tracking-[0.14em] text-white/74 md:text-[11px]"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Sistema de Estudo Avancado
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            aria-label="Notificacoes"
            className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-white/12 text-white/70 transition hover:text-white"
            style={{
              background: shellBackground,
            }}
          >
            <Bell className="h-4 w-4" />
          </button>

          <button
            aria-label="Perfil"
            className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-white/12 text-white/70 transition hover:text-white"
            style={{
              background: shellBackground,
            }}
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.header>
  )
}
