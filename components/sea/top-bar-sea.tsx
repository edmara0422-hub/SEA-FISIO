'use client'

import { motion } from 'framer-motion'
import { Bell, User } from 'lucide-react'

export function TopBarSEA() {
  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-40 px-3 pt-3 md:px-6"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="chrome-shell mx-auto flex h-[4.8rem] max-w-7xl items-center justify-between gap-4 rounded-[1.9rem] px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.05rem] border border-white/16"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(219,225,232,0.36) 16%, rgba(96,101,108,0.94) 42%, rgba(14,15,18,0.98) 100%)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.24), inset 0 -1px 0 rgba(255,255,255,0.05), 0 16px 32px rgba(0,0,0,0.36)',
            }}
          >
            <span
              className="text-[0.8rem] font-semibold tracking-[0.32em] text-white"
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
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(18,18,20,0.84) 60%, rgba(8,8,10,0.98) 100%)',
            }}
          >
            <Bell className="h-4 w-4" />
          </button>

          <button
            aria-label="Perfil"
            className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-white/14 text-white transition"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.68) 0%, rgba(220,225,232,0.28) 16%, rgba(76,80,87,0.94) 44%, rgba(10,10,12,0.98) 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.header>
  )
}
