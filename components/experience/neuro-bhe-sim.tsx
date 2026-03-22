'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface NeuroBHESimProps {
  className?: string
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  type: 'o2' | 'glucose' | 'amino' | 'pathogen' | 'toxin' | 'hormone'
  canPass: boolean
  label: string
  color: string
  size: number
  blocked: boolean
  passPhase: number // 0→1 animation
}

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.03)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.38)'
const COL_BARRIER = 'rgba(45, 212, 191, 0.45)'
const COL_BARRIER_GLOW = 'rgba(45, 212, 191, 0.12)'
const COL_ENDOTHELIAL = 'rgba(45, 212, 191, 0.6)'
const COL_BLOOD = 'rgba(244, 63, 94, 0.08)'
const COL_BRAIN = 'rgba(167, 139, 250, 0.05)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

const ALLOWED_COLOR = 'rgba(45, 212, 191, 0.7)'
const BLOCKED_COLOR = 'rgba(244, 63, 94, 0.7)'

/* ─────────────────────── component ─────────────────────── */

export function NeuroBHESim({ className }: NeuroBHESimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [damageMode, setDamageMode] = useState(false)
  const stateRef = useRef({
    t: 0,
    lastTimestamp: 0,
    particles: [] as Particle[],
    initialized: false,
    passedCount: 0,
    blockedCount: 0,
  })

  const initParticles = useCallback((w: number) => {
    const particles: Particle[] = []
    const types: Particle['type'][] = ['o2', 'glucose', 'amino', 'pathogen', 'toxin', 'hormone']
    const defs: Record<Particle['type'], { label: string; color: string; canPass: boolean; size: number }> = {
      o2: { label: 'O₂', color: 'rgba(34, 211, 238, 0.85)', canPass: true, size: 4 },
      glucose: { label: 'Glicose', color: 'rgba(250, 204, 21, 0.85)', canPass: true, size: 5 },
      amino: { label: 'Aminoác.', color: 'rgba(45, 212, 191, 0.85)', canPass: true, size: 4.5 },
      hormone: { label: 'Hormônio', color: 'rgba(167, 139, 250, 0.85)', canPass: true, size: 5 },
      pathogen: { label: 'Patógeno', color: 'rgba(244, 63, 94, 0.85)', canPass: false, size: 7 },
      toxin: { label: 'Toxina', color: 'rgba(251, 146, 60, 0.85)', canPass: false, size: 5.5 },
    }

    for (let i = 0; i < 18; i++) {
      const type = types[i % types.length]
      const def = defs[type]
      particles.push({
        x: Math.random() * w * 0.35 + 20,
        y: 60 + Math.random() * 250,
        vx: 0.3 + Math.random() * 0.6,
        vy: (Math.random() - 0.5) * 0.4,
        type,
        canPass: def.canPass,
        label: def.label,
        color: def.color,
        size: def.size,
        blocked: false,
        passPhase: 0,
      })
    }
    return particles
  }, [])

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const st = stateRef.current
    const scale = Math.min(w / 700, h / 400)

    if (!st.initialized) {
      st.particles = initParticles(w)
      st.initialized = true
    }

    ctx.fillStyle = COL_BG
    ctx.fillRect(0, 0, w, h)

    // grid
    ctx.strokeStyle = COL_GRID
    ctx.lineWidth = 0.5
    const gridStep = 30 * scale
    for (let gx = 0; gx < w; gx += gridStep) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke()
    }
    for (let gy = 0; gy < h; gy += gridStep) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke()
    }

    const barrierX = w * 0.48
    const barrierW = 35 * scale

    // ── blood side background
    ctx.fillStyle = COL_BLOOD
    ctx.fillRect(0, 0, barrierX - barrierW / 2, h)

    // ── brain side background
    ctx.fillStyle = COL_BRAIN
    ctx.fillRect(barrierX + barrierW / 2, 0, w - barrierX - barrierW / 2, h)

    // ── side labels
    ctx.font = `700 ${Math.max(10, 12 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(244, 63, 94, 0.4)'
    ctx.fillText('SANGUE', (barrierX - barrierW / 2) / 2, 25)
    ctx.fillStyle = 'rgba(167, 139, 250, 0.4)'
    ctx.fillText('CÉREBRO', barrierX + barrierW / 2 + (w - barrierX - barrierW / 2) / 2, 25)

    // ── barrier structure
    const barrierLeft = barrierX - barrierW / 2
    const barrierRight = barrierX + barrierW / 2

    // tight junctions pattern
    if (!damageMode) {
      // healthy barrier - dense
      for (let by = 0; by < h; by += 6) {
        ctx.beginPath()
        ctx.moveTo(barrierLeft, by)
        ctx.lineTo(barrierRight, by)
        ctx.strokeStyle = `rgba(45, 212, 191, ${0.08 + Math.sin(by * 0.1 + st.t) * 0.04})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // endothelial cells
      const cellCount = 8
      for (let i = 0; i < cellCount; i++) {
        const cy = (i + 0.5) * (h / cellCount)
        const cellH = h / cellCount * 0.85

        ctx.beginPath()
        ctx.roundRect(barrierLeft + 2, cy - cellH / 2, barrierW - 4, cellH, 4)
        ctx.fillStyle = COL_BARRIER_GLOW
        ctx.fill()
        ctx.strokeStyle = COL_BARRIER
        ctx.lineWidth = 1.2
        ctx.stroke()

        // tight junction symbol between cells
        if (i < cellCount - 1) {
          const jy = cy + cellH / 2
          ctx.beginPath()
          for (let jx = barrierLeft + 4; jx < barrierRight - 4; jx += 5) {
            ctx.moveTo(jx, jy - 1)
            ctx.lineTo(jx + 3, jy + 1)
          }
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.5)'
          ctx.lineWidth = 1.5
          ctx.stroke()
        }

        // nucleus
        ctx.beginPath()
        ctx.ellipse(barrierX, cy, 6, 3, 0, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(45, 212, 191, 0.25)'
        ctx.fill()
      }
    } else {
      // damaged barrier - gaps
      for (let i = 0; i < 8; i++) {
        const cy = (i + 0.5) * (h / 8)
        const cellH = h / 8 * 0.85
        const isGap = i % 3 === 1 // every 3rd has a gap

        if (!isGap) {
          ctx.beginPath()
          ctx.roundRect(barrierLeft + 2, cy - cellH / 2, barrierW - 4, cellH, 4)
          ctx.fillStyle = 'rgba(244, 63, 94, 0.06)'
          ctx.fill()
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)'
          ctx.lineWidth = 1
          ctx.setLineDash([3, 3])
          ctx.stroke()
          ctx.setLineDash([])
        } else {
          // gap - broken junction
          ctx.beginPath()
          ctx.roundRect(barrierLeft + 2, cy - cellH / 2, barrierW - 4, cellH, 4)
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.15)'
          ctx.lineWidth = 1
          ctx.setLineDash([2, 6])
          ctx.stroke()
          ctx.setLineDash([])

          // warning flash
          const flash = 0.15 + Math.sin(st.t * 4 + i) * 0.1
          ctx.fillStyle = `rgba(244, 63, 94, ${flash})`
          ctx.fill()
        }
      }
    }

    // barrier label
    ctx.save()
    ctx.translate(barrierX, h / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.font = `700 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = damageMode ? 'rgba(244, 63, 94, 0.6)' : 'rgba(45, 212, 191, 0.5)'
    ctx.fillText(damageMode ? 'BHE COMPROMETIDA' : 'BARREIRA HEMATOENCEFÁLICA', 0, 3)
    ctx.restore()

    // ── transport channels (small arrows on barrier for allowed molecules)
    if (!damageMode) {
      const chanCount = 4
      for (let i = 0; i < chanCount; i++) {
        const cy = h * 0.2 + i * (h * 0.6 / (chanCount - 1))
        // small channel gate
        ctx.beginPath()
        ctx.roundRect(barrierLeft - 2, cy - 4, barrierW + 4, 8, 3)
        ctx.fillStyle = 'rgba(45, 212, 191, 0.08)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.3)'
        ctx.lineWidth = 0.8
        ctx.stroke()

        // directional arrow
        ctx.beginPath()
        ctx.moveTo(barrierLeft + 5, cy)
        ctx.lineTo(barrierRight - 5, cy)
        ctx.lineTo(barrierRight - 9, cy - 3)
        ctx.moveTo(barrierRight - 5, cy)
        ctx.lineTo(barrierRight - 9, cy + 3)
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)'
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    // ── animate particles
    for (const p of st.particles) {
      p.x += p.vx
      p.y += p.vy

      // bounce off top/bottom
      if (p.y < 40 || p.y > h - 20) p.vy *= -1

      const canPassNow = damageMode ? true : p.canPass

      // barrier interaction
      if (p.x >= barrierLeft - 5 && p.x <= barrierRight + 5) {
        if (canPassNow) {
          // slow down while passing
          p.vx = Math.max(0.15, p.vx * 0.98)
          p.passPhase = Math.min(1, p.passPhase + 0.05)
        } else {
          // bounce back
          p.vx = -Math.abs(p.vx) * 0.8
          p.x = barrierLeft - 6
          p.blocked = true
          st.blockedCount++

          // bounce flash
          ctx.beginPath()
          ctx.arc(barrierLeft, p.y, 8, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(244, 63, 94, 0.3)'
          ctx.fill()
        }
      }

      // passed through
      if (p.x > barrierRight + 10 && p.passPhase > 0) {
        p.passPhase = 0
        st.passedCount++
      }

      // reset when off screen
      if (p.x > w + 20 || p.x < -20) {
        p.x = Math.random() * 30 + 5
        p.y = 60 + Math.random() * (h - 100)
        p.vx = 0.3 + Math.random() * 0.6
        p.vy = (Math.random() - 0.5) * 0.4
        p.blocked = false
        p.passPhase = 0
      }

      // draw particle
      const isBlocking = !canPassNow && p.x >= barrierLeft - 20

      // glow
      if (!isBlocking) {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5)
        grad.addColorStop(0, p.color.replace('0.85', '0.2'))
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(p.x - p.size * 3, p.y - p.size * 3, p.size * 6, p.size * 6)
      }

      // body
      ctx.beginPath()
      if (p.type === 'pathogen') {
        // spiky
        const spikes = 8
        for (let s = 0; s <= spikes; s++) {
          const a = (s / spikes) * Math.PI * 2
          const sr = p.size * (1 + (s % 2 === 0 ? 0.4 : 0))
          const sx = p.x + Math.cos(a + st.t) * sr
          const sy = p.y + Math.sin(a + st.t) * sr
          if (s === 0) ctx.moveTo(sx, sy)
          else ctx.lineTo(sx, sy)
        }
        ctx.closePath()
      } else {
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      }
      ctx.fillStyle = isBlocking ? p.color.replace('0.85', '0.3') : p.color.replace('0.85', '0.2')
      ctx.fill()
      ctx.strokeStyle = isBlocking ? BLOCKED_COLOR : p.color
      ctx.lineWidth = isBlocking ? 1 : 1.5
      ctx.stroke()

      // label
      ctx.font = `500 ${Math.max(6, 7 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = p.color.replace('0.85', '0.7')
      ctx.fillText(p.label, p.x, p.y - p.size - 4)

      // pass/block indicator
      if (p.x < barrierLeft - 10) {
        ctx.font = `600 ${Math.max(6, 7 * scale)}px ${FONT_MONO}`
        ctx.fillStyle = canPassNow ? ALLOWED_COLOR : BLOCKED_COLOR
        ctx.fillText(canPassNow ? '✓' : '✕', p.x, p.y + p.size + 10)
      }
    }

    // ── legend
    const legY = h - 30 * scale
    ctx.font = `600 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'left'

    ctx.fillStyle = ALLOWED_COLOR
    ctx.fillText('✓ Passa: O₂, Glicose, Aminoácidos, Hormônios', 12, legY)
    ctx.fillStyle = BLOCKED_COLOR
    ctx.fillText('✕ Bloqueia: Patógenos, Toxinas, Moléculas grandes', 12, legY + 14 * scale)

    // HUD
    ctx.font = `600 ${Math.max(9, 10 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('BHE.BARRIER', 12, 20)
    ctx.fillStyle = damageMode ? 'rgba(244, 63, 94, 0.6)' : 'rgba(45, 212, 191, 0.5)'
    ctx.fillText(damageMode ? '▸ BHE DANIFICADA' : '▸ BHE ÍNTEGRA', 12, 34)
  }, [damageMode, initParticles])

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    if (!ctx) return

    let raf = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const st = stateRef.current
      if (now - st.lastTimestamp < FRAME_MS) return
      st.lastTimestamp = now
      st.t += 0.03

      const dpr = window.devicePixelRatio || 1
      const rect = cvs.getBoundingClientRect()
      const cw = rect.width * dpr
      const ch = rect.height * dpr
      if (cvs.width !== cw || cvs.height !== ch) { cvs.width = cw; cvs.height = ch }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(ctx, rect.width, rect.height)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [draw])

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas
        ref={canvasRef}
        className="w-full rounded-2xl"
        style={{ aspectRatio: '16/9', background: COL_BG }}
      />
      <div className="absolute top-3 right-3 flex gap-1">
        <button
          onClick={() => setDamageMode(false)}
          className={`px-2.5 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-wider transition-all ${
            !damageMode ? 'bg-white/10 text-white/80 border border-white/20' : 'text-white/30 hover:text-white/50 border border-transparent'
          }`}
        >
          BHE Íntegra
        </button>
        <button
          onClick={() => setDamageMode(true)}
          className={`px-2.5 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-wider transition-all ${
            damageMode ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-white/30 hover:text-white/50 border border-transparent'
          }`}
        >
          BHE Danificada
        </button>
      </div>
    </div>
  )
}
