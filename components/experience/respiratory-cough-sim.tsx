'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface RespiratoryCoughSimProps {
  className?: string
}

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.025)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.35)'
const COL_AIRWAY = 'rgba(45, 212, 191, 0.4)'
const COL_GLOTTIS = 'rgba(250, 204, 21, 0.7)'
const COL_PRESSURE = 'rgba(244, 63, 94, 0.6)'
const COL_AIR = 'rgba(34, 211, 238, 0.7)'
const COL_MUCUS_P = 'rgba(45, 212, 191, 0.6)'
const COL_IRRITANT = 'rgba(251, 146, 60, 0.7)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

const PHASES = [
  { name: 'Irritativa', desc: 'Estímulo irrita receptores na laringe, traqueia ou brônquios', duration: 0.12 },
  { name: 'Inspiratória', desc: 'Inspiração profunda (~2,5L) prepara pulmões para expulsão', duration: 0.25 },
  { name: 'Compressiva', desc: 'Glote fecha + contração muscular → Pressão intratorácica ↑↑ (até 300mmHg)', duration: 0.2 },
  { name: 'Expulsiva', desc: 'Glote abre bruscamente → Ar expelido até 160 km/h', duration: 0.25 },
  { name: 'Relaxamento', desc: 'Músculos relaxam, via aérea volta ao normal', duration: 0.18 },
]

/* ─────────────────────── helpers ─────────────────────── */

function lerp(a: number, b: number, t: number): number { return a + (b - a) * t }
function easeInOut(t: number): number { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 }

/* ─────────────────────── component ─────────────────────── */

export function RespiratoryCoughSim({ className }: RespiratoryCoughSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [paused, setPaused] = useState(false)
  const stateRef = useRef({
    t: 0,
    lastTimestamp: 0,
    cycleT: 0, // 0→1 full cough cycle
    cycles: 0,
    pressure: 0,
    lungVolume: 2400,
    glottisOpen: 1, // 0=closed, 1=open
    expelledParticles: [] as { x: number; y: number; vx: number; vy: number; life: number; size: number }[],
  })

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const st = stateRef.current
    const S = Math.min(w / 700, h / 420)

    ctx.fillStyle = COL_BG
    ctx.fillRect(0, 0, w, h)

    // grid
    ctx.strokeStyle = COL_GRID
    ctx.lineWidth = 0.5
    const gs = 28 * S
    for (let gx = 0; gx < w; gx += gs) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke() }
    for (let gy = 0; gy < h; gy += gs) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke() }

    // advance cycle
    if (!paused) {
      st.cycleT += 0.003
      if (st.cycleT >= 1) { st.cycleT = 0; st.cycles++ }
    }

    // determine current phase
    let phaseIdx = 0
    let phaseT = 0
    let cumT = 0
    for (let i = 0; i < PHASES.length; i++) {
      if (st.cycleT >= cumT && st.cycleT < cumT + PHASES[i].duration) {
        phaseIdx = i
        phaseT = (st.cycleT - cumT) / PHASES[i].duration
        break
      }
      cumT += PHASES[i].duration
    }

    const phase = PHASES[phaseIdx]

    // ── compute state variables per phase
    switch (phaseIdx) {
      case 0: // irritativa
        st.glottisOpen = 1
        st.pressure = 0
        st.lungVolume = 2400
        break
      case 1: // inspiratória
        st.glottisOpen = 1
        st.pressure = 0
        st.lungVolume = lerp(2400, 4900, easeInOut(phaseT)) // ~2.5L intake
        break
      case 2: // compressiva
        st.glottisOpen = lerp(1, 0, easeInOut(Math.min(1, phaseT * 2))) // closes fast
        st.pressure = lerp(0, 300, easeInOut(phaseT))
        st.lungVolume = 4900
        break
      case 3: // expulsiva
        st.glottisOpen = lerp(0, 1, easeInOut(Math.min(1, phaseT * 3))) // opens fast
        st.pressure = lerp(300, 0, easeInOut(phaseT))
        st.lungVolume = lerp(4900, 2000, easeInOut(phaseT))
        // spawn expelled particles
        if (phaseT < 0.5 && !paused) {
          for (let ep = 0; ep < 2; ep++) {
            st.expelledParticles.push({
              x: w * 0.38,
              y: h * 0.28 + (Math.random() - 0.5) * 15,
              vx: 4 + Math.random() * 6,
              vy: (Math.random() - 0.5) * 2,
              life: 1,
              size: 2 + Math.random() * 3,
            })
          }
        }
        break
      case 4: // relaxamento
        st.glottisOpen = 1
        st.pressure = 0
        st.lungVolume = lerp(2000, 2400, easeInOut(phaseT))
        break
    }

    // ── layout: simplified airway cross-section (sagittal view)
    const cx = w * 0.38
    const cy = h * 0.5

    // lungs (simplified expanding shape)
    const lungScale = st.lungVolume / 2400
    const lungW2 = 90 * S * lungScale
    const lungH2 = 100 * S * lungScale
    const lungY = cy + 20 * S

    // left lung
    ctx.beginPath()
    ctx.ellipse(cx - 40 * S, lungY, lungW2 * 0.7, lungH2 * 0.5, 0, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(45, 212, 191, ${0.04 + st.pressure / 3000 * 0.08})`
    ctx.fill()
    ctx.strokeStyle = `rgba(45, 212, 191, ${0.15 + st.pressure / 300 * 0.2})`
    ctx.lineWidth = 1.5
    ctx.stroke()

    // right lung
    ctx.beginPath()
    ctx.ellipse(cx + 40 * S, lungY, lungW2 * 0.75, lungH2 * 0.5, 0, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(45, 212, 191, ${0.04 + st.pressure / 3000 * 0.08})`
    ctx.fill()
    ctx.strokeStyle = `rgba(45, 212, 191, ${0.15 + st.pressure / 300 * 0.2})`
    ctx.lineWidth = 1.5
    ctx.stroke()

    // pressure visualization inside lungs
    if (st.pressure > 10) {
      const pAlpha = st.pressure / 300 * 0.3
      const grad = ctx.createRadialGradient(cx, lungY, 0, cx, lungY, lungW2)
      grad.addColorStop(0, `rgba(244, 63, 94, ${pAlpha})`)
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(cx - lungW2, lungY - lungH2 * 0.5, lungW2 * 2, lungH2)
    }

    // trachea tube
    const traTop = cy - 55 * S
    const traBot = cy + 5
    const traW2 = 12 * S
    ctx.beginPath()
    ctx.roundRect(cx - traW2, traTop, traW2 * 2, traBot - traTop, 3)
    ctx.fillStyle = 'rgba(34, 211, 238, 0.04)'
    ctx.fill()
    ctx.strokeStyle = COL_AIRWAY
    ctx.lineWidth = 1.5
    ctx.stroke()

    // cartilage rings
    for (let r = 0; r < 5; r++) {
      const ry = traTop + 8 + r * ((traBot - traTop - 16) / 4)
      ctx.beginPath()
      ctx.arc(cx, ry, traW2 * 0.85, -0.5, Math.PI + 0.5)
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.12)'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // glottis (at top of trachea)
    const glotY = traTop - 5
    const glotGap = st.glottisOpen * 8 * S

    // larynx outline
    ctx.beginPath()
    ctx.moveTo(cx - 18 * S, glotY - 18 * S)
    ctx.lineTo(cx - 16 * S, glotY + 8)
    ctx.lineTo(cx + 16 * S, glotY + 8)
    ctx.lineTo(cx + 18 * S, glotY - 18 * S)
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.2)'
    ctx.lineWidth = 1
    ctx.stroke()

    // vocal cords / glottis
    ctx.beginPath()
    ctx.moveTo(cx - 14 * S, glotY)
    ctx.lineTo(cx - glotGap, glotY)
    ctx.strokeStyle = st.glottisOpen < 0.3 ? 'rgba(244, 63, 94, 0.8)' : COL_GLOTTIS
    ctx.lineWidth = 3
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(cx + glotGap, glotY)
    ctx.lineTo(cx + 14 * S, glotY)
    ctx.strokeStyle = st.glottisOpen < 0.3 ? 'rgba(244, 63, 94, 0.8)' : COL_GLOTTIS
    ctx.lineWidth = 3
    ctx.stroke()

    // glottis label
    ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = st.glottisOpen < 0.3 ? COL_PRESSURE : COL_GLOTTIS
    ctx.fillText(st.glottisOpen < 0.3 ? 'GLOTE FECHADA' : 'GLOTE ABERTA', cx, glotY - 22 * S)

    // upper airway (mouth/pharynx exit)
    ctx.beginPath()
    ctx.moveTo(cx - 10 * S, glotY - 18 * S)
    ctx.quadraticCurveTo(cx, glotY - 35 * S, cx + 25 * S, glotY - 40 * S)
    ctx.lineTo(w * 0.55, glotY - 40 * S)
    ctx.strokeStyle = COL_AIRWAY
    ctx.lineWidth = 1.5
    ctx.stroke()

    // irritant particle (phase 0)
    if (phaseIdx === 0) {
      const irritX = cx + Math.sin(st.t * 5) * 5
      const irritY = traTop + 20 + Math.sin(st.t * 3) * 8
      ctx.beginPath()
      for (let s = 0; s <= 6; s++) {
        const a = (s / 6) * Math.PI * 2
        const sr = 5 * (1 + (s % 2) * 0.4)
        ctx.lineTo(irritX + Math.cos(a + st.t) * sr, irritY + Math.sin(a + st.t) * sr)
      }
      ctx.closePath()
      ctx.fillStyle = 'rgba(251, 146, 60, 0.3)'
      ctx.fill()
      ctx.strokeStyle = COL_IRRITANT
      ctx.lineWidth = 1.5
      ctx.stroke()

      // receptor activation flash
      const flash = 0.3 + Math.sin(st.t * 8) * 0.2
      ctx.beginPath()
      ctx.arc(irritX, irritY, 15, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(251, 146, 60, ${flash})`
      ctx.lineWidth = 1
      ctx.setLineDash([2, 3])
      ctx.stroke()
      ctx.setLineDash([])

      ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
      ctx.fillStyle = COL_IRRITANT
      ctx.fillText('IRRITANTE', irritX, irritY - 18)
    }

    // air flow during inspiration (phase 1)
    if (phaseIdx === 1) {
      const airCount = 6
      for (let a = 0; a < airCount; a++) {
        const ap = (phaseT + a * 0.15) % 1
        const ax = lerp(w * 0.55, cx, ap)
        const ay = glotY - 40 * S + Math.sin(st.t * 3 + a) * 3
        ctx.beginPath()
        ctx.arc(ax, ay, 2, 0, Math.PI * 2)
        ctx.fillStyle = COL_AIR
        ctx.fill()
      }
      // down into trachea
      for (let a = 0; a < 4; a++) {
        const ap = (phaseT * 0.7 + a * 0.2) % 1
        const ay = lerp(glotY, traBot, ap)
        ctx.beginPath()
        ctx.arc(cx + Math.sin(st.t * 2 + a) * 3, ay, 2, 0, Math.PI * 2)
        ctx.fillStyle = COL_AIR
        ctx.fill()
      }
    }

    // expelled particles (phase 3-4)
    for (let i = st.expelledParticles.length - 1; i >= 0; i--) {
      const ep = st.expelledParticles[i]
      if (!paused) {
        ep.x += ep.vx
        ep.y += ep.vy
        ep.life -= 0.015
        ep.vx *= 0.98
      }
      if (ep.life <= 0 || ep.x > w + 20) {
        st.expelledParticles.splice(i, 1)
        continue
      }

      ctx.globalAlpha = ep.life
      // mucus/debris particle
      ctx.beginPath()
      ctx.arc(ep.x, ep.y, ep.size, 0, Math.PI * 2)
      ctx.fillStyle = ep.size > 3 ? COL_MUCUS_P : COL_AIR
      ctx.fill()

      // speed lines
      ctx.beginPath()
      ctx.moveTo(ep.x, ep.y)
      ctx.lineTo(ep.x - ep.vx * 3, ep.y)
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      ctx.globalAlpha = 1
    }

    // ── phase timeline bar (bottom)
    const barY = h - 55 * S
    const barH = 8 * S
    const barLeft = 80 * S
    const barRight = w - 20
    const barW = barRight - barLeft

    let bx = barLeft
    for (let i = 0; i < PHASES.length; i++) {
      const pw = barW * PHASES[i].duration
      const isActive = i === phaseIdx
      const colors = [COL_IRRITANT, COL_AIR, COL_PRESSURE, 'rgba(250, 204, 21, 0.7)', 'rgba(45, 212, 191, 0.5)']

      ctx.fillStyle = isActive ? colors[i].replace('0.7', '0.3').replace('0.6', '0.25').replace('0.5', '0.2') : 'rgba(255,255,255,0.03)'
      ctx.fillRect(bx, barY, pw, barH)
      ctx.strokeStyle = isActive ? colors[i] : 'rgba(255,255,255,0.06)'
      ctx.lineWidth = isActive ? 1.5 : 0.5
      ctx.strokeRect(bx, barY, pw, barH)

      // phase label
      ctx.font = `${isActive ? '700' : '500'} ${Math.max(6, 7 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = isActive ? colors[i] : COL_TEXT_DIM
      ctx.fillText(`${i + 1}. ${PHASES[i].name}`, bx + pw / 2, barY - 6)

      bx += pw
    }

    // progress indicator
    const progX = barLeft + st.cycleT * barW
    ctx.beginPath()
    ctx.moveTo(progX, barY - 2)
    ctx.lineTo(progX, barY + barH + 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.lineWidth = 2
    ctx.stroke()

    // ── right side info panel
    const infoX = w * 0.62
    const infoY = 30

    ctx.font = `700 ${Math.max(11, 14 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    const phaseColors = [COL_IRRITANT, COL_AIR, COL_PRESSURE, 'rgba(250, 204, 21, 0.7)', 'rgba(45, 212, 191, 0.7)']
    ctx.fillStyle = phaseColors[phaseIdx]
    ctx.fillText(`FASE ${phaseIdx + 1}: ${phase.name.toUpperCase()}`, infoX, infoY)

    ctx.font = `500 ${Math.max(7, 8.5 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    // wrap description
    const words = phase.desc.split(' ')
    let line = ''
    let lineY = infoY + 18
    for (const word of words) {
      const test = line + word + ' '
      if (ctx.measureText(test).width > w - infoX - 15) {
        ctx.fillText(line, infoX, lineY)
        line = word + ' '
        lineY += 13
      } else {
        line = test
      }
    }
    ctx.fillText(line, infoX, lineY)

    // vitals
    const vitY = lineY + 30
    ctx.font = `600 ${Math.max(8, 10 * S)}px ${FONT_MONO}`

    ctx.fillStyle = 'rgba(45, 212, 191, 0.6)'
    ctx.fillText(`Volume: ${Math.round(st.lungVolume)} mL`, infoX, vitY)

    ctx.fillStyle = st.pressure > 100 ? COL_PRESSURE : 'rgba(255,255,255,0.3)'
    ctx.fillText(`Pressão: ${Math.round(st.pressure)} mmHg`, infoX, vitY + 18)

    ctx.fillStyle = COL_GLOTTIS
    ctx.fillText(`Glote: ${st.glottisOpen < 0.3 ? 'FECHADA' : 'ABERTA'}`, infoX, vitY + 36)

    if (phaseIdx === 3) {
      ctx.fillStyle = 'rgba(250, 204, 21, 0.7)'
      ctx.fillText(`Velocidade: até 160 km/h`, infoX, vitY + 54)
    }

    // cycle counter
    ctx.font = `500 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText(`Ciclos: ${st.cycles}`, infoX, vitY + 75)

    // HUD
    ctx.font = `600 ${Math.max(9, 10 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('COUGH.REFLEX', 12, h - 12)
    ctx.fillStyle = 'rgba(45, 212, 191, 0.45)'
    ctx.fillText('▸ 5 FASES', 12, h - 26)
  }, [paused])

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
      <canvas ref={canvasRef} className="w-full rounded-2xl" style={{ aspectRatio: '16/9', background: COL_BG }} />
      <div className="absolute top-3 right-3">
        <button
          onClick={() => setPaused(p => !p)}
          className="px-2.5 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-wider bg-white/10 text-white/80 border border-white/20 transition-all"
        >
          {paused ? '▶ Retomar' : '⏸ Pausar'}
        </button>
      </div>
    </div>
  )
}
