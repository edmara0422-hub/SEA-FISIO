'use client'

import { motion, useMotionValue, useTransform, useSpring, animate } from 'framer-motion'
import { BookOpen, ChevronRight, Cpu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { GreetingClockCard } from '@/components/sea/greeting-clock-card'
import { SeaBackdrop } from '@/components/sea/sea-backdrop'

const spring = { type: 'spring', stiffness: 380, damping: 32 } as const

const CARDS = [
  {
    href: '/explore/conteudos',
    icon: BookOpen,
    title: 'Conteudos',
    sub: 'Protocolos, referencias e fluxos clinicos para a beira do leito',
    color: '#A8B8FF',
    glow: 'rgba(168,184,255,0.18)',
    grain: 'from-[#1a1e3a] via-[#0d0f1e] to-[#020202]',
  },
  {
    href: '/explore/sistemas',
    icon: Cpu,
    title: 'Sistemas',
    sub: 'Modulos interativos — neuro, cardio, pneumo e mais',
    color: '#7EEFC0',
    glow: 'rgba(126,239,192,0.14)',
    grain: 'from-[#0e2420] via-[#081410] to-[#020202]',
  },
] as const

export default function ExplorePageClient() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020202] text-white">
      <SeaBackdrop />
      <main className="relative z-10 px-4 pb-36 pt-8 md:px-8 md:pt-12">
        <div className="mx-auto max-w-2xl space-y-10">
          <GreetingClockCard />
          <Carousel3D />
        </div>
      </main>
    </div>
  )
}

function Carousel3D() {
  const [active, setActive] = useState(0)
  const dragX = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const didDrag = useRef(false)
  const router = useRouter()

  useEffect(() => {
    CARDS.forEach((c) => router.prefetch(c.href))
  }, [router])

  const handleDragStart = () => { didDrag.current = false }

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (Math.abs(info.offset.x) > 12) {
      didDrag.current = true
      if (info.offset.x < -50 && active < CARDS.length - 1) setActive((v) => v + 1)
      else if (info.offset.x > 50 && active > 0) setActive((v) => v - 1)
    }
    animate(dragX, 0, { type: 'spring', stiffness: 600, damping: 44 })
  }

  const handleCardClick = (i: number) => {
    if (didDrag.current) { didDrag.current = false; return }
    if (i === active) router.push(CARDS[i].href)
    else setActive(i)
  }

  return (
    <div className="space-y-5">
      {/* 3D Stage */}
      <div
        ref={containerRef}
        className="relative select-none"
        style={{ perspective: '1100px', perspectiveOrigin: '50% 45%', height: 'clamp(340px, 58vh, 520px)' }}
      >
        {CARDS.map((card, i) => {
          const offset = i - active
          const isActive = offset === 0
          const isRight = offset > 0
          const isLeft = offset < 0

          return (
            <motion.div
              key={card.href}
              drag={isActive ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              style={{
                x: isActive ? dragX : undefined,
                position: 'absolute',
                inset: 0,
                transformStyle: 'preserve-3d',
                transformOrigin: isRight ? 'left center' : isLeft ? 'right center' : 'center center',
                zIndex: isActive ? 10 : 1,
              }}
              animate={{
                rotateY: isActive ? 0 : isRight ? 44 : -44,
                x: isActive ? 0 : isRight ? '58%' : '-58%',
                z: isActive ? 60 : -40,
                scale: isActive ? 1 : 0.82,
                opacity: isActive ? 1 : 0.46,
              }}
              transition={spring}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onClick={() => handleCardClick(i)}
              className={isActive ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
            >
              <Card3D card={card} isActive={isActive} />
            </motion.div>
          )
        })}
      </div>

      {/* Dots + nav */}
      <div className="flex items-center justify-center gap-3">
        {CARDS.map((card, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="relative flex items-center justify-center"
          >
            <motion.span
              animate={{
                width: active === i ? 28 : 6,
                background: active === i ? card.color : 'rgba(255,255,255,0.18)',
              }}
              transition={spring}
              className="block h-1.5 rounded-full"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function Card3D({
  card,
  isActive,
}: {
  card: (typeof CARDS)[number]
  isActive: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 160, damping: 20 })
  const rotY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 160, damping: 20 })
  const glowX = useTransform(mx, [0, 1], [20, 80])
  const glowY = useTransform(my, [0, 1], [20, 80])
  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(340px circle at ${x}% ${y}%, rgba(255,255,255,0.055), transparent 65%)`,
  )

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => { mx.set(0.5); my.set(0.5) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: isActive ? rotX : 0, rotateY: isActive ? rotY : 0 }}
      className="h-full w-full"
    >
      <div
        className={`relative h-full w-full overflow-hidden rounded-[2rem] border border-white/10`}
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 40%, rgba(0,0,0,0) 100%)',
          boxShadow: isActive
            ? `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06) inset, 0 1px 0 rgba(255,255,255,0.10) inset`
            : '0 20px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Dynamic spotlight */}
        {isActive && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: glowBackground }}
          />
        )}

        {/* Top shimmer */}
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18)_50%,transparent)]" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-7 md:p-8">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <motion.div
              animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0.6 }}
              transition={spring}
              className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-white/10"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <card.icon className="h-6 w-6 text-white/60" />
            </motion.div>

            {isActive ? (
              <motion.div
                whileHover={{ x: 2, y: -2, scale: 1.06 }}
                transition={spring}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/14 bg-white/6"
              >
                <ChevronRight className="h-4 w-4 text-white/55" />
              </motion.div>
            ) : (
              <div className="text-[9px] font-semibold uppercase tracking-[0.26em] text-white/24">
                Toque para ver
              </div>
            )}
          </div>

          {/* Bottom */}
          <div className="space-y-3">
            <motion.div
              className="h-px w-12"
              animate={{ width: isActive ? 48 : 24, opacity: isActive ? 1 : 0.4 }}
              transition={spring}
              style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.5), transparent)' }}
            />
            <div className="space-y-2">
              <h2
                className="font-semibold leading-none tracking-[0.1em]"
                style={{
                  fontSize: 'clamp(2rem, 8vw, 3.2rem)',
                  color: isActive ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.35)',
                }}
              >
                {card.title}
              </h2>
              {isActive && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-[12px] leading-relaxed tracking-[0.03em] text-white/40 max-w-[28ch]"
                >
                  {card.sub}
                </motion.p>
              )}
            </div>

            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={spring}
                  className="mt-1 inline-flex items-center gap-2 rounded-[0.9rem] border border-white/14 bg-white/6 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60"
                >
                  Abrir
                  <ChevronRight className="h-3.5 w-3.5" />
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
