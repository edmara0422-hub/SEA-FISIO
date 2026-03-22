'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface RespiratoryDefenseSimProps {
  className?: string
}

type DefenseLayer = 'nasal' | 'mucociliary' | 'immune' | null

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.03)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.38)'
const COL_MUCUS = 'rgba(45, 212, 191, 0.5)'
const COL_CILIA = 'rgba(34, 211, 238, 0.7)'
const COL_IGA = 'rgba(250, 204, 21, 0.8)'
const COL_PATHOGEN = 'rgba(244, 63, 94, 0.8)'
const COL_DUST = 'rgba(251, 146, 60, 0.7)'
const COL_EPITHELIUM = 'rgba(167, 139, 250, 0.4)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

interface ThreatParticle {
  x: number
  y: number
  vx: number
  vy: number
  type: 'pathogen' | 'dust' | 'pollen'
  trapped: boolean
  trapPhase: number
  label: string
  size: number
}

/* ─────────────────────── component ─────────────────────── */

export function RespiratoryDefenseSim({ className }: RespiratoryDefenseSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeLayer, setActiveLayer] = useState<DefenseLayer>(null)
  const stateRef = useRef({
    t: 0,
    lastTimestamp: 0,
    threats: [] as ThreatParticle[],
    initialized: false,
    trappedCount: 0,
    passedCount: 0,
  })

  const initThreats = useCallback((w: number, h: number): ThreatParticle[] => {
    const threats: ThreatParticle[] = []
    const types: ThreatParticle['type'][] = ['pathogen', 'dust', 'pollen']
    const labels = { pathogen: 'Patógeno', dust: 'Partícula', pollen: 'Pólen' }
    const sizes = { pathogen: 5, dust: 3.5, pollen: 4 }

    for (let i = 0; i < 15; i++) {
      const type = types[i % 3]
      threats.push({
        x: -20 - Math.random() * 80,
        y: 50 + Math.random() * (h - 120),
        vx: 0.5 + Math.random() * 1,
        vy: (Math.random() - 0.5) * 0.3,
        type,
        trapped: false,
        trapPhase: 0,
        label: labels[type],
        size: sizes[type],
      })
    }
    return threats
  }, [])

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const st = stateRef.current
    const scale = Math.min(w / 700, h / 420)

    if (!st.initialized) {
      st.threats = initThreats(w, h)
      st.initialized = true
    }

    ctx.fillStyle = COL_BG
    ctx.fillRect(0, 0, w, h)

    // grid
    ctx.strokeStyle = COL_GRID
    ctx.lineWidth = 0.5
    const gs = 30 * scale
    for (let gx = 0; gx < w; gx += gs) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke() }
    for (let gy = 0; gy < h; gy += gs) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke() }

    // three defense barriers
    const b1X = w * 0.22 // nasal barrier
    const b2X = w * 0.50 // mucociliary barrier
    const b3X = w * 0.78 // immune barrier
    const bW = 30 * scale
    const bTop = 45
    const bBot = h - 45

    const showNasal = !activeLayer || activeLayer === 'nasal'
    const showMuco = !activeLayer || activeLayer === 'mucociliary'
    const showImmune = !activeLayer || activeLayer === 'immune'

    // ═══ BARRIER 1: NASAL ═══
    if (showNasal) {
      ctx.globalAlpha = activeLayer === 'nasal' ? 1 : (activeLayer ? 0.2 : 0.9)

      // barrier zone
      ctx.fillStyle = 'rgba(251, 146, 60, 0.04)'
      ctx.fillRect(b1X - bW, bTop, bW * 2, bBot - bTop)

      // nasal hairs
      const hairCount = 12
      for (let i = 0; i < hairCount; i++) {
        const hy = bTop + 15 + (i / (hairCount - 1)) * (bBot - bTop - 30)
        const sway = Math.sin(st.t * 1.5 + i * 0.8) * 8

        // hair from left wall
        ctx.beginPath()
        ctx.moveTo(b1X - bW * 0.6, hy)
        ctx.quadraticCurveTo(b1X - bW * 0.3 + sway, hy - 5, b1X, hy + 2)
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.5)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // hair from right wall
        ctx.beginPath()
        ctx.moveTo(b1X + bW * 0.6, hy + 8)
        ctx.quadraticCurveTo(b1X + bW * 0.3 - sway, hy + 3, b1X, hy + 10)
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.5)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // mucus layer on walls
      ctx.beginPath()
      ctx.moveTo(b1X - bW * 0.7, bTop)
      for (let y = bTop; y < bBot; y += 10) {
        ctx.lineTo(b1X - bW * 0.7 + Math.sin(y * 0.05 + st.t) * 3, y)
      }
      ctx.strokeStyle = COL_MUCUS
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(b1X + bW * 0.7, bTop)
      for (let y = bTop; y < bBot; y += 10) {
        ctx.lineTo(b1X + bW * 0.7 + Math.sin(y * 0.05 + st.t + 1) * 3, y)
      }
      ctx.strokeStyle = COL_MUCUS
      ctx.lineWidth = 3
      ctx.stroke()

      // label
      ctx.font = `700 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(251, 146, 60, 0.7)'
      ctx.fillText('1ª BARREIRA', b1X, bTop - 18)
      ctx.font = `500 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
      ctx.fillStyle = 'rgba(251, 146, 60, 0.5)'
      ctx.fillText('Pelos + Muco', b1X, bTop - 5)

      ctx.globalAlpha = 1
    }

    // ═══ BARRIER 2: MUCOCILIARY ═══
    if (showMuco) {
      ctx.globalAlpha = activeLayer === 'mucociliary' ? 1 : (activeLayer ? 0.2 : 0.9)

      // epithelium base
      ctx.fillStyle = 'rgba(167, 139, 250, 0.04)'
      ctx.fillRect(b2X - bW, bTop, bW * 2, bBot - bTop)

      // epithelial cells along walls
      const cellCount = 15
      for (let i = 0; i < cellCount; i++) {
        const cy = bTop + 10 + (i / (cellCount - 1)) * (bBot - bTop - 20)

        // left wall cell
        ctx.beginPath()
        ctx.roundRect(b2X - bW * 0.8, cy - 5, 8, 10, 2)
        ctx.fillStyle = 'rgba(167, 139, 250, 0.12)'
        ctx.fill()
        ctx.strokeStyle = COL_EPITHELIUM
        ctx.lineWidth = 0.8
        ctx.stroke()

        // cilia on top of cell
        const ciliaCount2 = 4
        for (let c = 0; c < ciliaCount2; c++) {
          const cx2 = b2X - bW * 0.8 + 2 + c * 2
          const sway = Math.sin(st.t * 5 + i * 0.6 + c * 0.4) * 5
          ctx.beginPath()
          ctx.moveTo(cx2, cy - 5)
          ctx.quadraticCurveTo(cx2 + sway * 0.5, cy - 12, cx2 + sway, cy - 16)
          ctx.strokeStyle = COL_CILIA
          ctx.lineWidth = 0.8
          ctx.stroke()
        }

        // right wall cell
        ctx.beginPath()
        ctx.roundRect(b2X + bW * 0.8 - 8, cy - 5, 8, 10, 2)
        ctx.fillStyle = 'rgba(167, 139, 250, 0.12)'
        ctx.fill()
        ctx.strokeStyle = COL_EPITHELIUM
        ctx.lineWidth = 0.8
        ctx.stroke()

        for (let c = 0; c < ciliaCount2; c++) {
          const cx3 = b2X + bW * 0.8 - 6 + c * 2
          const sway2 = Math.sin(st.t * 5 + i * 0.6 + c * 0.4 + Math.PI) * 5
          ctx.beginPath()
          ctx.moveTo(cx3, cy - 5)
          ctx.quadraticCurveTo(cx3 - sway2 * 0.5, cy - 12, cx3 - sway2, cy - 16)
          ctx.strokeStyle = COL_CILIA
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }

      // mucus escalator (upward moving layer)
      const mucusY = ((st.t * 15) % 40)
      for (let my = bBot; my > bTop; my -= 40) {
        const my2 = my - mucusY
        if (my2 < bTop || my2 > bBot) continue
        ctx.beginPath()
        ctx.moveTo(b2X - bW * 0.5, my2)
        ctx.lineTo(b2X + bW * 0.5, my2)
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.15)'
        ctx.lineWidth = 1
        ctx.stroke()

        // upward arrow
        ctx.beginPath()
        ctx.moveTo(b2X, my2 + 3)
        ctx.lineTo(b2X, my2 - 3)
        ctx.lineTo(b2X - 2, my2 - 1)
        ctx.moveTo(b2X, my2 - 3)
        ctx.lineTo(b2X + 2, my2 - 1)
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.3)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      ctx.font = `700 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = COL_CILIA
      ctx.fillText('2ª BARREIRA', b2X, bTop - 18)
      ctx.font = `500 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
      ctx.fillStyle = 'rgba(34, 211, 238, 0.5)'
      ctx.fillText('Mucociliar', b2X, bTop - 5)
      ctx.fillText('600-900 bat/min', b2X, bBot + 15)

      ctx.globalAlpha = 1
    }

    // ═══ BARRIER 3: IMMUNE ═══
    if (showImmune) {
      ctx.globalAlpha = activeLayer === 'immune' ? 1 : (activeLayer ? 0.2 : 0.9)

      ctx.fillStyle = 'rgba(250, 204, 21, 0.03)'
      ctx.fillRect(b3X - bW, bTop, bW * 2, bBot - bTop)

      // IgA antibodies floating
      for (let i = 0; i < 8; i++) {
        const igY = bTop + 30 + (i / 8) * (bBot - bTop - 60)
        const igX = b3X + Math.sin(st.t * 0.8 + i * 1.2) * bW * 0.4
        const igSize = 6 * scale

        // Y-shape antibody
        ctx.beginPath()
        ctx.moveTo(igX, igY + igSize)
        ctx.lineTo(igX, igY)
        ctx.lineTo(igX - igSize * 0.6, igY - igSize * 0.5)
        ctx.moveTo(igX, igY)
        ctx.lineTo(igX + igSize * 0.6, igY - igSize * 0.5)
        ctx.strokeStyle = COL_IGA
        ctx.lineWidth = 1.5
        ctx.stroke()

        // binding sites
        ctx.beginPath()
        ctx.arc(igX - igSize * 0.6, igY - igSize * 0.5, 2, 0, Math.PI * 2)
        ctx.arc(igX + igSize * 0.6, igY - igSize * 0.5, 2, 0, Math.PI * 2)
        ctx.fillStyle = COL_IGA
        ctx.fill()

        // label
        if (i % 3 === 0) {
          ctx.font = `600 ${5}px ${FONT_MONO}`
          ctx.textAlign = 'center'
          ctx.fillStyle = 'rgba(250, 204, 21, 0.5)'
          const igLabels = ['IgA', 'IgG', 'IgM']
          ctx.fillText(igLabels[i % 3], igX, igY + igSize + 8)
        }
      }

      // macrophage
      const macX = b3X + bW * 0.2
      const macY = bBot - 40
      const macR = 10
      ctx.beginPath()
      const pts = 8
      for (let i = 0; i <= pts; i++) {
        const a = (i / pts) * Math.PI * 2
        const mr = macR * (1 + 0.2 * Math.sin(a * 3 + st.t * 2))
        const mx = macX + Math.cos(a) * mr
        const my = macY + Math.sin(a) * mr
        if (i === 0) ctx.moveTo(mx, my)
        else ctx.lineTo(mx, my)
      }
      ctx.closePath()
      ctx.fillStyle = 'rgba(250, 204, 21, 0.12)'
      ctx.fill()
      ctx.strokeStyle = COL_IGA
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.font = `500 ${5}px ${FONT_MONO}`
      ctx.fillStyle = 'rgba(250, 204, 21, 0.5)'
      ctx.fillText('Macrófago', macX, macY + macR + 10)

      ctx.font = `700 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = COL_IGA
      ctx.fillText('3ª BARREIRA', b3X, bTop - 18)
      ctx.font = `500 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
      ctx.fillStyle = 'rgba(250, 204, 21, 0.5)'
      ctx.fillText('Imunológica', b3X, bTop - 5)
      ctx.fillText('IgA + IgG + IgM', b3X, bBot + 15)

      ctx.globalAlpha = 1
    }

    // ═══ THREAT PARTICLES ═══
    const barriers = [
      { x: b1X, w: bW, trapChance: 0.4 },
      { x: b2X, w: bW, trapChance: 0.5 },
      { x: b3X, w: bW, trapChance: 0.6 },
    ]

    for (const t of st.threats) {
      if (t.trapped) {
        t.trapPhase += 0.01
        // float upward (escalator)
        t.y -= 0.3
        if (t.trapPhase > 1 || t.y < bTop) {
          // reset
          t.x = -20 - Math.random() * 60
          t.y = 60 + Math.random() * (h - 140)
          t.trapped = false
          t.trapPhase = 0
          t.vx = 0.5 + Math.random() * 1
        }

        // draw trapped
        ctx.globalAlpha = 1 - t.trapPhase
        ctx.beginPath()
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2)
        ctx.fillStyle = COL_MUCUS
        ctx.fill()
        ctx.beginPath()
        ctx.arc(t.x, t.y, t.size * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = t.type === 'pathogen' ? COL_PATHOGEN : COL_DUST
        ctx.fill()
        ctx.globalAlpha = 1
        continue
      }

      t.x += t.vx
      t.y += t.vy + Math.sin(st.t + t.x * 0.01) * 0.2

      // check barrier collision
      for (const b of barriers) {
        if (t.x >= b.x - b.w * 0.5 && t.x <= b.x + b.w * 0.5) {
          if (Math.random() < 0.01 * b.trapChance) {
            t.trapped = true
            st.trappedCount++
            break
          }
        }
      }

      // reset if past all barriers
      if (t.x > w + 30) {
        t.x = -20 - Math.random() * 60
        t.y = 60 + Math.random() * (h - 140)
        t.vx = 0.5 + Math.random() * 1
        st.passedCount++
      }

      // draw threat
      const colors = { pathogen: COL_PATHOGEN, dust: COL_DUST, pollen: 'rgba(250, 204, 21, 0.6)' }

      if (t.type === 'pathogen') {
        // spiky
        ctx.beginPath()
        for (let s = 0; s <= 8; s++) {
          const a = (s / 8) * Math.PI * 2
          const sr = t.size * (1 + (s % 2 === 0 ? 0.3 : 0))
          ctx.lineTo(t.x + Math.cos(a + st.t) * sr, t.y + Math.sin(a + st.t) * sr)
        }
        ctx.closePath()
      } else {
        ctx.beginPath()
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2)
      }
      ctx.fillStyle = (colors[t.type] || COL_DUST).replace('0.8', '0.3').replace('0.7', '0.2').replace('0.6', '0.2')
      ctx.fill()
      ctx.strokeStyle = colors[t.type] || COL_DUST
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // ── air flow direction
    ctx.font = `600 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.fillText('AR INSPIRADO →', 55, h - 15)
    ctx.fillText('→ PULMÕES', w - 55, h - 15)

    // stats
    ctx.font = `600 ${Math.max(9, 10 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'right'
    ctx.fillStyle = COL_MUCUS
    ctx.fillText(`Capturados: ${st.trappedCount}`, w - 15, 22)
    ctx.fillStyle = COL_PATHOGEN
    ctx.fillText(`Passaram: ${st.passedCount}`, w - 15, 36)

    // HUD
    ctx.font = `600 ${Math.max(9, 10 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('DEFENSE.SYSTEM', 12, 20)
    ctx.fillStyle = 'rgba(45, 212, 191, 0.5)'
    ctx.fillText('▸ 3 BARREIRAS DE DEFESA', 12, 34)
  }, [activeLayer, initThreats])

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
        {([
          { id: null as DefenseLayer, label: 'Todas' },
          { id: 'nasal' as DefenseLayer, label: 'Nasal' },
          { id: 'mucociliary' as DefenseLayer, label: 'Mucociliar' },
          { id: 'immune' as DefenseLayer, label: 'Imune' },
        ]).map(m => (
          <button
            key={String(m.id)}
            onClick={() => setActiveLayer(m.id)}
            className={`px-2 py-1 rounded-lg text-[8px] font-semibold uppercase tracking-wider transition-all ${
              activeLayer === m.id
                ? 'bg-white/10 text-white/80 border border-white/20'
                : 'text-white/30 hover:text-white/50 border border-transparent'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  )
}
