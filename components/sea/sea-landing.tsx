'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PHRASES = [
  'Raciocínio clínico\nà beira do leito',
  'Simulações 3D reais\nPulmão · Coração · Cérebro',
  'IA especialista\nque ensina em segundos',
  'Prontuário inteligente\nDetecção automática de desmame',
  'Zero papel\nZero infecção cruzada\nZero prancheta',
  'Criatividade\nCocriação com profissionais reais',
  'Inovação\nIA adaptativa · Análise gráfica',
  'Sustentabilidade social\nProfissional preparado\n= paciente mais seguro',
  'Sustentabilidade ambiental\nDigital-first · Offline',
  'Sustentabilidade econômica\nMenos tempo de VM\n= menos custo hospitalar',
  'Acessibilidade · Inclusão\nDiversidade · Igualdade',
  'Acelerador de\ncompetência clínica',
]

const PHASE_DURATION = 3200

export function SeaLanding({ onEnter }: { onEnter: () => void }) {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [showFinal, setShowFinal] = useState(false)
  const [exiting, setExiting] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrame = useRef(0)

  // Auto-advance phrases
  useEffect(() => {
    if (phraseIdx >= PHRASES.length) {
      setShowFinal(true)
      return
    }
    const t = setTimeout(() => setPhraseIdx((i) => i + 1), PHASE_DURATION)
    return () => clearTimeout(t)
  }, [phraseIdx])

  // Animated orb — silver/white on black
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = Math.min(window.innerWidth * 0.9, 400)
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const baseR = size * 0.42
    let t = 0

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, size, size)
      t += 0.006

      // Outer glow
      const glow = ctx.createRadialGradient(cx, cy, baseR * 0.3, cx, cy, baseR * 1.5)
      glow.addColorStop(0, 'rgba(200, 200, 200, 0.06)')
      glow.addColorStop(0.5, 'rgba(150, 150, 150, 0.03)')
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, size, size)

      // Main orb — breathing
      const breathe = 1 + Math.sin(t * 1.2) * 0.04
      const r = baseR * breathe

      const orbGrad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.05, cx, cy, r)
      orbGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)')
      orbGrad.addColorStop(0.25, 'rgba(200, 200, 200, 0.12)')
      orbGrad.addColorStop(0.5, 'rgba(150, 150, 150, 0.07)')
      orbGrad.addColorStop(0.8, 'rgba(80, 80, 80, 0.04)')
      orbGrad.addColorStop(1, 'rgba(30, 30, 30, 0.01)')

      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = orbGrad
      ctx.fill()

      // Subtle ring
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.96, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.06 + Math.sin(t * 2) * 0.03})`
      ctx.lineWidth = 0.8
      ctx.stroke()

      // Outer ring
      ctx.beginPath()
      ctx.arc(cx, cy, r * 1.08, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 + Math.sin(t * 1.5) * 0.02})`
      ctx.lineWidth = 0.5
      ctx.stroke()

      // Orbiting particles
      for (let i = 0; i < 6; i++) {
        const angle = t * (0.3 + i * 0.12) + (i * Math.PI * 2) / 6
        const orbitR = r * (1.12 + i * 0.06)
        const px = cx + Math.cos(angle) * orbitR
        const py = cy + Math.sin(angle) * orbitR * 0.9
        const pSize = 1.2 + Math.sin(t * 2.5 + i) * 0.5
        const alpha = 0.15 + Math.sin(t * 2 + i * 1.2) * 0.1

        ctx.beginPath()
        ctx.arc(px, py, pSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 220, 220, ${alpha})`
        ctx.fill()
      }

      animFrame.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animFrame.current)
  }, [])

  const handleEnter = useCallback(() => {
    setExiting(true)
    setTimeout(onEnter, 700)
  }, [onEnter])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#010101' }}
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* Orb + ALL content inside it */}
      <div className="relative flex items-center justify-center">
        <canvas ref={canvasRef} />

        {/* Inside orb: SEA top-center, Entrar bottom */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="-mt-6 flex items-center justify-center gap-[0.02em] text-[4.8rem] font-semibold leading-none sm:text-[5.5rem]">
            {'SEA'.split('').map((letter, i) => (
              <motion.span
                key={i}
                className="text-white/90 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          <motion.button
            onClick={handleEnter}
            className="mt-10 rounded-full border border-white/15 bg-white/[0.06] px-5 py-1.5 text-[9px] font-light tracking-wider text-white/70 transition-all active:scale-95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            Entrar
          </motion.button>
        </div>
      </div>

      {/* Phrases + dots together below the orb */}
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="relative h-16 w-full max-w-xs text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={phraseIdx < PHRASES.length ? phraseIdx : 'done'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center whitespace-pre-line text-[11px] font-light leading-relaxed tracking-wide text-white/35"
            >
              {phraseIdx < PHRASES.length ? PHRASES[phraseIdx] : 'Acelerador de competência clínica'}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex gap-1.5">
          {PHRASES.map((_, i) => (
            <div
              key={i}
              className="h-[3px] rounded-full transition-all duration-500"
              style={{
                width: i <= phraseIdx ? 14 : 5,
                background: i <= phraseIdx ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.06)',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
