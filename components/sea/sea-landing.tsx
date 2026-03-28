'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PHRASES = [
  { text: 'Raciocínio clínico no bolso', sub: '' },
  { text: 'Zero papel. Zero infecção cruzada.', sub: 'Sustentabilidade na prática clínica' },
  { text: 'Simulações 3D reais', sub: 'Pulmão, coração e cérebro interativos' },
  { text: 'IA que ensina na hora', sub: 'Dúvidas resolvidas em segundos' },
  { text: 'Profissionais acima da média', sub: 'Avaliação e condução de excelência' },
]

const PHASE_DURATION = 3500

// Paleta do app — preto, prata, branco
const PRIMARY = { r: 180, g: 180, b: 180 }  // prata
const ACCENT = { r: 220, g: 220, b: 220 }   // branco suave

export function SeaLanding({ onEnter }: { onEnter: () => void }) {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [showButton, setShowButton] = useState(false)
  const [exiting, setExiting] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrame = useRef(0)

  // Auto-advance phrases
  useEffect(() => {
    if (phraseIdx >= PHRASES.length) {
      setShowButton(true)
      return
    }
    const t = setTimeout(() => setPhraseIdx((i) => i + 1), PHASE_DURATION)
    return () => clearTimeout(t)
  }, [phraseIdx])

  // Animated orb
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = Math.min(window.innerWidth * 0.55, 280)
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const baseR = size * 0.35
    let t = 0

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, size, size)
      t += 0.008

      // Outer glow — bordô
      const glow = ctx.createRadialGradient(cx, cy, baseR * 0.2, cx, cy, baseR * 1.4)
      glow.addColorStop(0, `rgba(${PRIMARY.r}, ${PRIMARY.g}, ${PRIMARY.b}, 0.12)`)
      glow.addColorStop(0.5, `rgba(${PRIMARY.r}, ${PRIMARY.g}, ${PRIMARY.b}, 0.05)`)
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, size, size)

      // Main orb — breathing
      const breathe = 1 + Math.sin(t * 1.2) * 0.06
      const r = baseR * breathe

      const orbGrad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, r * 0.05, cx, cy, r)
      orbGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)')
      orbGrad.addColorStop(0.3, `rgba(${PRIMARY.r}, ${PRIMARY.g}, ${PRIMARY.b}, 0.25)`)
      orbGrad.addColorStop(0.6, `rgba(${PRIMARY.r - 40}, ${PRIMARY.g - 40}, ${PRIMARY.b - 40}, 0.12)`)
      orbGrad.addColorStop(1, 'rgba(60, 60, 60, 0.03)')

      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = orbGrad
      ctx.fill()

      // Inner ring
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.95, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${0.2 + Math.sin(t * 2) * 0.1})`
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Orbiting particles — bordô
      for (let i = 0; i < 5; i++) {
        const angle = t * (0.5 + i * 0.15) + (i * Math.PI * 2) / 5
        const orbitR = r * (1.1 + i * 0.08)
        const px = cx + Math.cos(angle) * orbitR
        const py = cy + Math.sin(angle) * orbitR * 0.85
        const pSize = 1.5 + Math.sin(t * 3 + i) * 0.8
        const alpha = 0.3 + Math.sin(t * 2 + i * 1.2) * 0.2

        ctx.beginPath()
        ctx.arc(px, py, pSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${ACCENT.r + 20}, ${ACCENT.g + 20}, ${ACCENT.b + 20}, ${alpha})`
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
      style={{ background: '#020202' }}
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* Orb */}
      <canvas ref={canvasRef} className="mb-8" />

      {/* Phrases cycling */}
      <div className="relative h-24 w-full max-w-sm px-6 text-center">
        <AnimatePresence mode="wait">
          {phraseIdx < PHRASES.length && !showButton && (
            <motion.div
              key={phraseIdx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <p className="text-lg font-light tracking-wide text-white/90">
                {PHRASES[phraseIdx].text}
              </p>
              {PHRASES[phraseIdx].sub && (
                <p className="mt-1.5 text-xs text-white/40">
                  {PHRASES[phraseIdx].sub}
                </p>
              )}
            </motion.div>
          )}

          {showButton && (
            <motion.div
              key="enter"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <p className="mb-1 text-2xl font-extralight tracking-widest text-white/90">
                SEA FISIO
              </p>
              <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-white/30">
                Acelerador de competência clínica
              </p>
              <button
                onClick={handleEnter}
                className="rounded-full px-8 py-2.5 text-sm font-light tracking-wider text-white/90 transition-all active:scale-95"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                Entrar no SEA
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-12 flex gap-2">
        {PHRASES.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: i <= phraseIdx ? 16 : 6,
              background: i <= phraseIdx
                ? `rgba(${PRIMARY.r}, ${PRIMARY.g}, ${PRIMARY.b}, 0.7)`
                : 'rgba(255, 255, 255, 0.1)',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
