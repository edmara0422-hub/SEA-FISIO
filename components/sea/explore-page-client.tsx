'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { BookOpen, ChevronRight, Cpu } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'
import { GreetingClockCard } from '@/components/sea/greeting-clock-card'
import { SeaBackdrop } from '@/components/sea/sea-backdrop'

const ease = [0.16, 1, 0.3, 1] as const

export default function ExplorePageClient() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020202] text-white">
      <SeaBackdrop />

      <main className="relative z-10 px-4 pb-36 pt-8 md:px-8 md:pt-12">
        <div className="mx-auto max-w-4xl space-y-6">
          <GreetingClockCard />

          <motion.div
            className="grid gap-4 md:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <FeatureCard
              href="/explore/conteudos"
              icon={BookOpen}
              title="Conteudos"
              description="Protocolos, referencias clinicas e fluxos atualizados para a beira do leito."
              index={0}
            />
            <FeatureCard
              href="/explore/sistemas"
              icon={Cpu}
              title="Sistemas"
              description="Modulos interativos por sistema — neuro, cardio, pneumo e mais."
              index={1}
            />
          </motion.div>

          <Divider />
        </div>
      </main>
    </div>
  )
}

function FeatureCard({
  href,
  icon: Icon,
  title,
  description,
  index,
}: {
  href: string
  icon: typeof BookOpen
  title: string
  description: string
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 22, stiffness: 180 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), springConfig)
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [30, 70]), springConfig)
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, 80]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group"
    >
      <Link href={href} prefetch className="block outline-none">
        <motion.article
          className="relative h-[22rem] overflow-hidden rounded-[2rem] border border-white/10 md:h-[26rem]"
          whileHover={{ borderColor: 'rgba(255,255,255,0.22)', y: -3 }}
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.25, ease }}
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.012) 40%, rgba(0,0,0,0) 100%)',
            boxShadow: '0 2px 0 rgba(255,255,255,0.06) inset, 0 24px 60px rgba(0,0,0,0.42)',
          }}
        >
          {/* Dynamic radial glow that follows cursor */}
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: useTransform(
                [glowX, glowY],
                ([x, y]) =>
                  `radial-gradient(280px circle at ${x}% ${y}%, rgba(255,255,255,0.07), transparent 70%)`,
              ),
            }}
          />

          {/* Top shimmer line */}
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.28)_50%,transparent_100%)]" />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col justify-between p-7">
            {/* Header row */}
            <div className="flex items-start justify-between">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-white/10"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <Icon className="h-5 w-5 text-white/60" />
              </div>
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10"
                whileHover={{ borderColor: 'rgba(255,255,255,0.28)', scale: 1.08 }}
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <ChevronRight className="h-3.5 w-3.5 text-white/36 transition-colors group-hover:text-white/64" />
              </motion.div>
            </div>

            {/* Footer */}
            <div className="space-y-3">
              <div className="h-px w-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.6),transparent)]" />
              <h2
                className="text-[2.6rem] font-semibold leading-none tracking-[0.12em] md:text-[3rem]"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.52) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {title}
              </h2>
              <p className="text-[11px] leading-relaxed tracking-[0.04em] text-white/36 max-w-[22ch]">
                {description}
              </p>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  )
}

function Divider() {
  return (
    <motion.div
      className="flex items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.08)_60%,transparent)]" />
      <span className="text-[9px] font-semibold uppercase tracking-[0.32em] text-white/18">SEA</span>
      <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.08)_60%,transparent)]" />
    </motion.div>
  )
}
