'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Brain, HeartPulse, Wind } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const BrainHeroScene = dynamic(
  () => import('@/components/experience/brain-hero-scene').then((m) => m.BrainHeroScene),
  { ssr: false, loading: () => <SceneSkeleton /> }
)
const CardioHeroScene = dynamic(
  () => import('@/components/experience/cardio-hero-scene').then((m) => m.CardioHeroScene),
  { ssr: false, loading: () => <SceneSkeleton /> }
)
const PneumoHeroScene = dynamic(
  () => import('@/components/experience/pneumo-hero-scene').then((m) => m.PneumoHeroScene),
  { ssr: false, loading: () => <SceneSkeleton /> }
)

function SceneSkeleton() {
  return <div className="h-full w-full animate-pulse" style={{ background: 'rgba(255,255,255,0.025)' }} />
}

// Pause rendering when browser tab is hidden — saves GPU/CPU when user switches tabs
function usePageVisible() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const h = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, [])
  return visible
}

// Stagger canvas mounts so the page isn't blocked by 3 WebGL inits at once
function useStaggeredMount(delays: number[]) {
  const [mounted, setMounted] = useState(delays.map(() => false))
  useEffect(() => {
    const timers = delays.map((d, i) =>
      setTimeout(() => setMounted((prev) => prev.map((v, j) => j === i ? true : v)), d)
    )
    return () => timers.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return mounted
}

const spring = { type: 'spring', stiffness: 280, damping: 28 } as const

// ── Marquee mode: same cards scrolling horizontally ──
export function SimulationsMarquee() {
  const pageVisible = usePageVisible()
  const [neuroOn, cardioOn, pneumoOn] = useStaggeredMount([0, 200, 400])

  const cardStyle = {
    width: 'clamp(260px, 65vw, 340px)',
    height: 'clamp(200px, 36vw, 280px)',
    flexShrink: 0,
  }

  const neuroCard = (key: string) => (
    <div key={key} className="relative overflow-hidden rounded-[1.5rem]" style={{ ...cardStyle, border: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(160deg, rgba(45,212,191,0.03) 0%, rgba(0,0,0,0) 100%)' }}>
      <div className="absolute inset-0">{neuroOn && pageVisible && <BrainHeroScene compact transparent />}</div>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent 10%, rgba(45,212,191,0.55) 30%, rgba(180,255,248,0.90) 50%, rgba(45,212,191,0.55) 70%, transparent 90%)', boxShadow: '0 0 8px 2px rgba(45,212,191,0.30)', animation: 'scanline 4s linear infinite' }} />
      </div>
      <style>{`@keyframes scanline { 0% { top: -60px } 100% { top: 100% } }`}</style>
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-28" style={{ background: 'linear-gradient(to top, rgba(4,12,16,0.95) 0%, transparent 100%)' }} />
      <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between">
        <div>
          <p className="text-[8px] uppercase tracking-[0.30em] text-teal-400/40 mb-1">Sistema Neural</p>
          <div className="flex items-center gap-2"><Brain className="h-4 w-4 text-teal-400/60" /><span className="text-lg font-semibold text-teal-100/90">Neuro</span></div>
        </div>
      </div>
    </div>
  )

  const cardioCard = (key: string) => (
    <div key={key} className="relative overflow-hidden rounded-[1.5rem]" style={{ ...cardStyle, border: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(160deg, rgba(180,30,40,0.04) 0%, rgba(0,0,0,0) 100%)' }}>
      <div className="absolute inset-0">{cardioOn && pageVisible && <CardioHeroScene transparent />}</div>
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-28" style={{ background: 'linear-gradient(to top, rgba(5,3,4,0.92) 0%, transparent 100%)' }} />
      <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between">
        <div>
          <p className="text-[8px] uppercase tracking-[0.28em] text-white/30 mb-1">Cardio</p>
          <div className="flex items-center gap-1.5"><HeartPulse className="h-3.5 w-3.5 text-rose-400/70" /><span className="text-base font-semibold text-white/88">Coração</span></div>
        </div>
        <span className="text-[8px] font-semibold uppercase tracking-[0.20em] px-2.5 py-1 rounded-full" style={{ background: 'rgba(204,17,32,0.12)', border: '1px solid rgba(204,17,32,0.22)', color: 'rgba(255,160,160,0.70)' }}>72 BPM</span>
      </div>
    </div>
  )

  const pneumoCard = (key: string) => (
    <div key={key} className="relative overflow-hidden rounded-[1.5rem]" style={{ ...cardStyle, border: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(160deg, rgba(30,120,180,0.04) 0%, rgba(0,0,0,0) 100%)' }}>
      <div className="absolute inset-0">{pneumoOn && pageVisible && <PneumoHeroScene transparent />}</div>
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-28" style={{ background: 'linear-gradient(to top, rgba(4,6,7,0.92) 0%, transparent 100%)' }} />
      <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between">
        <div>
          <p className="text-[8px] uppercase tracking-[0.28em] text-white/30 mb-1">Pneumo</p>
          <div className="flex items-center gap-1.5"><Wind className="h-3.5 w-3.5 text-cyan-400/70" /><span className="text-base font-semibold text-white/88">Pulmão</span></div>
        </div>
        <span className="text-[8px] font-semibold uppercase tracking-[0.20em] px-2.5 py-1 rounded-full" style={{ background: 'rgba(56,189,248,0.10)', border: '1px solid rgba(56,189,248,0.18)', color: 'rgba(150,230,255,0.70)' }}>PEEP 5</span>
      </div>
    </div>
  )

  return (
    <div className="relative overflow-hidden" style={{ height: 'clamp(210px, 38vw, 290px)' }}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12" style={{ background: 'linear-gradient(to right, #020202, transparent)' }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12" style={{ background: 'linear-gradient(to left, #020202, transparent)' }} />
      <div className="flex items-center gap-4 h-full" style={{ animation: 'sim-marquee 25s linear infinite', width: 'max-content' }}>
        {neuroCard('n1')}{cardioCard('c1')}{pneumoCard('p1')}
        {neuroCard('n2')}{cardioCard('c2')}{pneumoCard('p2')}
      </div>
      <style>{`@keyframes sim-marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`}</style>
    </div>
  )
}

// ── Grid mode: original static layout ──
export function SimulationsGrid() {
  const pageVisible = usePageVisible()
  const [neuroOn, cardioOn, pneumoOn] = useStaggeredMount([0, 200, 400])

  return (
    <motion.div
      className="grid grid-cols-2 gap-2.5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >

      {/* ── NEURO ────────────────────────────────────────────────── */}
      <motion.div
        className="col-span-2 relative overflow-hidden rounded-[1.75rem] cursor-pointer"
        style={{
          height: 'clamp(260px, 42vw, 380px)',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(160deg, rgba(45,212,191,0.03) 0%, rgba(255,255,255,0.01) 30%, rgba(0,0,0,0) 100%)',
          boxShadow: '0 28px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
        whileHover={{ scale: 1.007 }}
        transition={spring}
      >
        <div className="absolute inset-0">
          {neuroOn && pageVisible && <BrainHeroScene compact transparent />}
        </div>

        {/* Scanner sweep */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '60px',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(45,212,191,0.10) 40%, rgba(45,212,191,0.22) 50%, rgba(45,212,191,0.10) 60%, transparent 100%)',
            animation: 'scanline 4s linear infinite',
          }} />
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.0) 10%, rgba(45,212,191,0.55) 30%, rgba(180,255,248,0.90) 50%, rgba(45,212,191,0.55) 70%, rgba(45,212,191,0.0) 90%, transparent 100%)',
            boxShadow: '0 0 8px 2px rgba(45,212,191,0.30)',
            animation: 'scanline 4s linear infinite',
          }} />
        </div>
        <style>{`@keyframes scanline { 0% { top: -60px } 100% { top: 100% } }`}</style>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 50%, transparent)' }} />

        <div className="absolute top-4 left-5 flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400/70 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-400" />
          </span>
          <span className="text-[8px] font-mono uppercase tracking-[0.28em] text-teal-400/60">Neural Scan · 10 Hz</span>
        </div>

        <NeuroVitals />

        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-36"
          style={{ background: 'linear-gradient(to top, rgba(4,12,16,0.95) 0%, transparent 100%)' }} />

        <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 flex items-end justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.30em] text-teal-400/40 mb-1.5">Sistema Neural</p>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-teal-400/60" />
              <span className="text-xl font-semibold text-teal-100/90 tracking-wide">Neuro</span>
            </div>
          </div>
          <EEGWave />
        </div>
      </motion.div>

      {/* ── CARDIO ───────────────────────────────────────────────── */}
      <motion.div
        className="relative overflow-hidden rounded-[1.75rem] cursor-pointer"
        style={{
          height: 'clamp(200px, 34vw, 280px)',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(160deg, rgba(180,30,40,0.04) 0%, rgba(255,255,255,0.01) 40%, rgba(0,0,0,0) 100%)',
          boxShadow: '0 20px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
        whileHover={{ scale: 1.012 }}
        transition={spring}
      >
        <div className="absolute inset-0">
          {cardioOn && pageVisible && <CardioHeroScene transparent />}
        </div>
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 50%, transparent)' }} />
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-28"
          style={{ background: 'linear-gradient(to top, rgba(5,3,4,0.92) 0%, transparent 100%)' }} />
        <div className="absolute bottom-0 inset-x-0 p-4 md:p-5 flex items-end justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.28em] text-white/30 mb-1">Cardio</p>
            <div className="flex items-center gap-1.5">
              <HeartPulse className="h-3.5 w-3.5 text-rose-400/70" />
              <span className="text-base font-semibold text-white/88 tracking-wide">Coração</span>
            </div>
          </div>
          <span className="text-[8px] font-semibold uppercase tracking-[0.20em] px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(204,17,32,0.12)', border: '1px solid rgba(204,17,32,0.22)', color: 'rgba(255,160,160,0.70)' }}>
            72 BPM
          </span>
        </div>
      </motion.div>

      {/* ── PNEUMO ───────────────────────────────────────────────── */}
      <motion.div
        className="relative overflow-hidden rounded-[1.75rem] cursor-pointer"
        style={{
          height: 'clamp(200px, 34vw, 280px)',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(160deg, rgba(30,120,180,0.04) 0%, rgba(255,255,255,0.01) 40%, rgba(0,0,0,0) 100%)',
          boxShadow: '0 20px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
        whileHover={{ scale: 1.012 }}
        transition={spring}
      >
        <div className="absolute inset-0">
          {pneumoOn && pageVisible && <PneumoHeroScene transparent />}
        </div>
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 50%, transparent)' }} />
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-28"
          style={{ background: 'linear-gradient(to top, rgba(4,6,7,0.92) 0%, transparent 100%)' }} />
        <div className="absolute bottom-0 inset-x-0 p-4 md:p-5 flex items-end justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.28em] text-white/30 mb-1">Pneumo</p>
            <div className="flex items-center gap-1.5">
              <Wind className="h-3.5 w-3.5 text-cyan-400/70" />
              <span className="text-base font-semibold text-white/88 tracking-wide">Pulmão</span>
            </div>
          </div>
          <span className="text-[8px] font-semibold uppercase tracking-[0.20em] px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(56,189,248,0.10)', border: '1px solid rgba(56,189,248,0.18)', color: 'rgba(150,230,255,0.70)' }}>
            PEEP 5
          </span>
        </div>
      </motion.div>

    </motion.div>
  )
}

// ── Neuro HUD helpers ─────────────────────────────────────────────────────────

function useAnimatedVital(base: number, range: number, interval: number) {
  const [val, setVal] = useState(base)
  useEffect(() => {
    const id = setInterval(() => setVal(Math.round(base + (Math.random() - 0.5) * range)), interval)
    return () => clearInterval(id)
  }, [base, range, interval])
  return val
}

function NeuroVitals() {
  const sys = useAnimatedVital(120, 6, 2200)
  const dia = useAnimatedVital(94, 4, 2800)
  const pul = useAnimatedVital(72, 8, 1600)
  return (
    <div className="absolute top-4 right-5 font-mono text-right space-y-0.5">
      <VitalRow label="SYS." value={sys} unit="mmHg" />
      <VitalRow label="DIA." value={dia} unit="mmHg" />
      <VitalRow label="Pul." value={pul} unit="/min" />
    </div>
  )
}

function VitalRow({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="flex items-baseline justify-end gap-1.5">
      <span className="text-[7px] uppercase tracking-[0.22em]" style={{ color: 'rgba(45,212,191,0.45)' }}>{label}</span>
      <span className="text-base font-bold leading-none" style={{ color: 'rgba(45,212,191,0.90)' }}>{value}</span>
      <span className="text-[7px]" style={{ color: 'rgba(45,212,191,0.40)' }}>{unit}</span>
    </div>
  )
}

function EEGWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let frame = 0, raf: number
    let last = 0
    function draw(now: number) {
      raf = requestAnimationFrame(draw)
      // Throttle EEG canvas to 30fps
      if (now - last < 33) return
      last = now
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const w = canvas.width, h = canvas.height
      for (let pass = 0; pass < 2; pass++) {
        ctx.strokeStyle = pass === 0 ? 'rgba(45,212,191,0.75)' : 'rgba(45,212,191,0.28)'
        ctx.lineWidth = pass === 0 ? 1.5 : 1
        ctx.beginPath()
        for (let x = 0; x <= w; x++) {
          const t = x / w, f = pass === 0 ? 1 : 1.7
          const y = h / 2
            + Math.sin(t * 8 * f + frame * (0.05 + pass * 0.03)) * 5
            + Math.sin(t * 20 * f + frame * 0.10) * 2.5
            + Math.sin(t * 3 - frame * 0.03) * 3.5
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      frame++
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={canvasRef} width={140} height={30} />
}
