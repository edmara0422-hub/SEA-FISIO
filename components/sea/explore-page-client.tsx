'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronRight, Cpu, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { GreetingClockCard } from '@/components/sea/greeting-clock-card'
import { SeaBackdrop } from '@/components/sea/sea-backdrop'

const spring = { type: 'spring', stiffness: 340, damping: 26 } as const
const ease = [0.16, 1, 0.3, 1] as const

const NAV_CARDS = [
  {
    href: '/explore/conteudos',
    icon: BookOpen,
    title: 'Conteudos',
    subtitle: 'Protocolos e referencias',
    badge: 'Clinico',
    accent: 'rgba(200,210,255,0.07)',
  },
  {
    href: '/explore/sistemas',
    icon: Cpu,
    title: 'Sistemas',
    subtitle: 'Modulos por sistema',
    badge: 'Interativo',
    accent: 'rgba(200,255,230,0.06)',
  },
] as const

export default function ExplorePageClient() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020202] text-white">
      <SeaBackdrop />

      <main className="relative z-10 px-4 pb-36 pt-8 md:px-8 md:pt-12">
        <div className="mx-auto max-w-2xl space-y-4">
          <GreetingClockCard />

          <motion.div
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {NAV_CARDS.map((card) => (
              <NavCard key={card.href} {...card} />
            ))}
          </motion.div>

          <PulseBar />
        </div>
      </main>
    </div>
  )
}

function NavCard({
  href,
  icon: Icon,
  title,
  subtitle,
  badge,
  accent,
}: (typeof NAV_CARDS)[number]) {
  const [pressed, setPressed] = useState(false)

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
      }}
    >
      <Link
        href={href}
        prefetch
        className="block outline-none"
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
      >
        <motion.article
          animate={pressed ? { scale: 0.968, y: 2 } : { scale: 1, y: 0 }}
          whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.18)' }}
          transition={spring}
          className="group relative overflow-hidden rounded-[1.6rem] border border-white/10 p-5"
          style={{
            background: `linear-gradient(145deg, ${accent} 0%, rgba(255,255,255,0.025) 50%, transparent 100%)`,
            boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 16px 40px rgba(0,0,0,0.38)',
          }}
        >
          {/* Top shimmer */}
          <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22)_50%,transparent)]" />

          {/* Hover glow */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `radial-gradient(320px circle at 30% 50%, ${accent.replace('0.07', '0.12').replace('0.06', '0.10')}, transparent 70%)` }}
          />

          <div className="relative z-10 flex items-center justify-between gap-4">
            {/* Left */}
            <div className="flex items-center gap-4">
              <motion.div
                animate={pressed ? { scale: 0.88, rotate: -4 } : { scale: 1, rotate: 0 }}
                transition={spring}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] border border-white/10"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <Icon className="h-5 w-5 text-white/60" />
              </motion.div>

              <div className="space-y-0.5">
                <h2 className="text-[15px] font-semibold tracking-[0.06em] text-white/88">{title}</h2>
                <p className="text-[11px] tracking-[0.03em] text-white/36">{subtitle}</p>
              </div>
            </div>

            {/* Right */}
            <div className="flex shrink-0 flex-col items-end gap-2">
              <motion.div
                animate={pressed ? { x: 3, y: -3 } : { x: 0, y: 0 }}
                transition={spring}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 transition-colors group-hover:border-white/22"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <ArrowUpRight className="h-3.5 w-3.5 text-white/32 transition-colors group-hover:text-white/60" />
              </motion.div>
              <span className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/28">
                {badge}
              </span>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  )
}

function PulseBar() {
  return (
    <motion.div
      className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-white/6 px-4 py-3"
      style={{ background: 'rgba(255,255,255,0.02)' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease }}
    >
      <div className="flex items-center gap-2.5">
        <LiveDot />
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/28">
          SEA Fisio
        </span>
      </div>
      <span className="text-[10px] tracking-[0.12em] text-white/18">ICU · Fisioterapia</span>
    </motion.div>
  )
}

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/50"
        animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400/70" />
    </span>
  )
}
