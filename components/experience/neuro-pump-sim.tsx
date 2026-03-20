'use client'

import { useEffect, useRef, useCallback } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface NeuroPumpSimProps {
  className?: string
}

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS

// cycle timing (in normalised 0→1 progress)
const PHASE_ATP_APPROACH = 0.12
const PHASE_ATP_BIND = 0.18
const PHASE_NA_EXIT = 0.55
const PHASE_CONFORM = 0.62
const PHASE_K_ENTER = 0.92
// 0.92 → 1.0 = reset/cooldown

// colors
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_MEMBRANE = 'rgba(45, 90, 80, 0.55)'
const COL_MEMBRANE_EDGE = 'rgba(45, 212, 191, 0.25)'
const COL_PUMP_BODY = 'rgba(30, 70, 65, 0.85)'
const COL_PUMP_STROKE = 'rgba(45, 212, 191, 0.6)'
const COL_PUMP_ACTIVE = 'rgba(45, 212, 191, 0.9)'
const COL_NA = 'rgba(244, 63, 94, 0.92)' // rose-500
const COL_NA_GLOW = 'rgba(244, 63, 94, 0.35)'
const COL_K = 'rgba(34, 211, 238, 0.92)' // cyan-400
const COL_K_GLOW = 'rgba(34, 211, 238, 0.35)'
const COL_ATP = 'rgba(250, 204, 21, 0.92)' // yellow-400
const COL_ATP_GLOW = 'rgba(250, 204, 21, 0.35)'
const COL_ADP = 'rgba(180, 140, 40, 0.75)'
const COL_TEXT = 'rgba(255, 255, 255, 0.88)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.38)'
const COL_TEAL_ACCENT = 'rgba(45, 212, 191, 0.7)'

const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

/* ─────────────────────── helpers ─────────────────────── */

/** cubic bezier ease-in-out (cheap approximation) */
function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/** lerp */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** clamp-remap a value from [lo,hi] → [0,1] */
function remap01(v: number, lo: number, hi: number): number {
  if (v <= lo) return 0
  if (v >= hi) return 1
  return (v - lo) / (hi - lo)
}

/* ─────────────────────── component ─────────────────────── */

export function NeuroPumpSim({ className }: NeuroPumpSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    cycles: 0,
    atpConsumed: 0,
    cycleT: 0, // 0→1
    lastTimestamp: 0,
    cycleDurationMs: 4200,
  })

  /* ── drawing routines ── */

  const drawMembrane = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, memY: number, memH: number) => {
      // lipid bilayer gradient
      const grad = ctx.createLinearGradient(0, memY - memH / 2, 0, memY + memH / 2)
      grad.addColorStop(0, COL_MEMBRANE_EDGE)
      grad.addColorStop(0.15, COL_MEMBRANE)
      grad.addColorStop(0.5, 'rgba(35, 75, 70, 0.65)')
      grad.addColorStop(0.85, COL_MEMBRANE)
      grad.addColorStop(1, COL_MEMBRANE_EDGE)
      ctx.fillStyle = grad
      ctx.fillRect(0, memY - memH / 2, w, memH)

      // phospholipid texture (small circles along edges)
      ctx.fillStyle = 'rgba(45, 212, 191, 0.12)'
      const spacing = 18
      for (let x = spacing / 2; x < w; x += spacing) {
        ctx.beginPath()
        ctx.arc(x, memY - memH / 2 + 4, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x, memY + memH / 2 - 4, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    },
    [],
  )

  const drawPump = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      cx: number,
      memY: number,
      memH: number,
      pumpW: number,
      pumpH: number,
      isActive: boolean,
      openingT: number, // 0 = closed, 1 = fully open for K
    ) => {
      const x = cx - pumpW / 2
      const y = memY - pumpH / 2
      const r = 14

      // pump body
      ctx.fillStyle = COL_PUMP_BODY
      ctx.strokeStyle = isActive ? COL_PUMP_ACTIVE : COL_PUMP_STROKE
      ctx.lineWidth = 2.5

      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + pumpW - r, y)
      ctx.quadraticCurveTo(x + pumpW, y, x + pumpW, y + r)
      ctx.lineTo(x + pumpW, y + pumpH - r)
      ctx.quadraticCurveTo(x + pumpW, y + pumpH, x + pumpW - r, y + pumpH)
      ctx.lineTo(x + r, y + pumpH)
      ctx.quadraticCurveTo(x, y + pumpH, x, y + pumpH - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // channel hole (visual opening)
      const channelW = pumpW * 0.32
      const channelH = pumpH * 0.6
      const channelX = cx - channelW / 2
      const channelY = memY - channelH / 2

      const channelGrad = ctx.createLinearGradient(channelX, channelY, channelX, channelY + channelH)
      channelGrad.addColorStop(0, 'rgba(0,0,0,0.6)')
      channelGrad.addColorStop(0.5, 'rgba(10,30,28,0.7)')
      channelGrad.addColorStop(1, 'rgba(0,0,0,0.6)')
      ctx.fillStyle = channelGrad
      ctx.beginPath()
      ctx.roundRect(channelX, channelY, channelW, channelH, 6)
      ctx.fill()

      // pump label
      ctx.fillStyle = COL_TEXT_DIM
      ctx.font = `bold 9px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Na⁺/K⁺', cx, memY - pumpH / 2 + 12)
      ctx.fillText('ATPase', cx, memY - pumpH / 2 + 23)

      // active glow
      if (isActive) {
        ctx.shadowBlur = 20
        ctx.shadowColor = COL_TEAL_ACCENT
        ctx.strokeStyle = COL_PUMP_ACTIVE
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.roundRect(x + 2, y + 2, pumpW - 4, pumpH - 4, 12)
        ctx.stroke()
        ctx.shadowBlur = 0
      }
    },
    [],
  )

  const drawIon = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      color: string,
      glowColor: string,
      label: string,
    ) => {
      // glow
      ctx.shadowBlur = 14
      ctx.shadowColor = glowColor

      // body
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.shadowBlur = 0

      // label
      ctx.fillStyle = '#fff'
      ctx.font = `bold ${Math.max(9, radius * 0.85)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, x, y + 0.5)
    },
    [],
  )

  /* ── main animation ── */

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId = 0
    const state = stateRef.current

    const render = (timestamp: number) => {
      // throttle
      if (timestamp - state.lastTimestamp < FRAME_MS) {
        rafId = requestAnimationFrame(render)
        return
      }
      const dt = Math.min(timestamp - state.lastTimestamp, 100) // clamp large gaps
      state.lastTimestamp = timestamp

      // advance cycle
      state.cycleT += dt / state.cycleDurationMs
      if (state.cycleT >= 1) {
        state.cycleT -= 1
        state.cycles += 1
        state.atpConsumed += 1
      }

      const t = state.cycleT // shorthand

      /* ── canvas sizing (DPR-aware) ── */
      const ratio = window.devicePixelRatio || 1
      const bounds = canvas.getBoundingClientRect()
      const w = Math.max(1, Math.floor(bounds.width))
      const h = Math.max(1, Math.floor(bounds.height))

      if (canvas.width !== w * ratio || canvas.height !== h * ratio) {
        canvas.width = w * ratio
        canvas.height = h * ratio
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

      /* ── background ── */
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = COL_BG
      ctx.fillRect(0, 0, w, h)

      /* ── layout parameters ── */
      const memY = h * 0.5
      const memH = Math.max(50, h * 0.14)
      const pumpW = Math.max(68, Math.min(110, w * 0.18))
      const pumpH = memH + Math.max(40, h * 0.1)
      const cx = w * 0.5
      const ionR = Math.max(11, Math.min(16, w * 0.028))

      /* ── zone labels ── */
      ctx.fillStyle = COL_TEXT_DIM
      ctx.font = `bold 11px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.letterSpacing = '3px'
      ctx.fillText('EXTRACELULAR', cx, 14)
      ctx.letterSpacing = '0px'

      ctx.textBaseline = 'bottom'
      ctx.letterSpacing = '3px'
      ctx.fillText('INTRACELULAR', cx, h - 14)
      ctx.letterSpacing = '0px'

      /* ── concentration labels ── */
      ctx.font = `10px ${FONT_MONO}`
      ctx.textBaseline = 'top'
      ctx.textAlign = 'left'
      ctx.fillStyle = 'rgba(244,63,94,0.45)'
      ctx.fillText('Na⁺ baixo', 12, 32)
      ctx.fillStyle = 'rgba(34,211,238,0.45)'
      ctx.fillText('K⁺ alto', 12, 46)

      ctx.textBaseline = 'bottom'
      ctx.fillStyle = 'rgba(244,63,94,0.45)'
      ctx.fillText('Na⁺ alto', 12, h - 32)
      ctx.fillStyle = 'rgba(34,211,238,0.45)'
      ctx.fillText('K⁺ baixo', 12, h - 46)

      /* ── membrane ── */
      drawMembrane(ctx, w, h, memY, memH)

      /* ── pump ── */
      const pumpActive = t >= PHASE_ATP_BIND && t < PHASE_K_ENTER
      const openingT = remap01(t, PHASE_CONFORM, PHASE_K_ENTER)
      drawPump(ctx, cx, memY, memH, pumpW, pumpH, pumpActive, openingT)

      /* ── ATP / ADP molecule ── */
      const atpR = ionR * 0.9

      if (t < PHASE_ATP_BIND) {
        // ATP approaching from left toward the pump (intracellular side)
        const at = easeInOut(remap01(t, 0, PHASE_ATP_APPROACH))
        const startX = cx - pumpW * 1.6
        const endX = cx - pumpW / 2 - atpR * 0.5
        const ay = memY + pumpH / 2 + ionR * 1.5
        const ax = lerp(startX, endX, at)
        drawIon(ctx, ax, ay, atpR, COL_ATP, COL_ATP_GLOW, 'ATP')
      } else if (t < PHASE_NA_EXIT) {
        // ATP bound → flash then become ADP
        const bindFlash = remap01(t, PHASE_ATP_BIND, PHASE_ATP_BIND + 0.04)
        const ax = cx - pumpW / 2 - atpR * 0.5
        const ay = memY + pumpH / 2 + ionR * 1.5
        if (bindFlash < 1) {
          // flash
          ctx.shadowBlur = 30 * (1 - bindFlash)
          ctx.shadowColor = COL_ATP
          drawIon(ctx, ax, ay, atpR * (1 + 0.3 * (1 - bindFlash)), COL_ATP, COL_ATP_GLOW, 'ATP')
          ctx.shadowBlur = 0
        } else {
          drawIon(ctx, ax, ay, atpR * 0.85, COL_ADP, 'rgba(180,140,40,0.2)', 'ADP')
          // phosphate flying away
          const pt = easeInOut(remap01(t, PHASE_ATP_BIND + 0.04, PHASE_NA_EXIT))
          const px = lerp(ax, ax - pumpW * 0.8, pt)
          const py = lerp(ay, ay + 20, pt)
          const pAlpha = 1 - pt
          ctx.globalAlpha = pAlpha
          ctx.fillStyle = 'rgba(250,204,21,0.7)'
          ctx.beginPath()
          ctx.arc(px, py, 4, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#fff'
          ctx.font = `bold 7px ${FONT_MONO}`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('Pᵢ', px, py)
          ctx.globalAlpha = 1
        }
      } else if (t < PHASE_K_ENTER) {
        // ADP still bound, then released
        const releaseT = easeInOut(remap01(t, PHASE_CONFORM, PHASE_K_ENTER))
        const ax = cx - pumpW / 2 - atpR * 0.5
        const ay = memY + pumpH / 2 + ionR * 1.5
        const fadeAlpha = 1 - releaseT
        if (fadeAlpha > 0.02) {
          ctx.globalAlpha = fadeAlpha
          drawIon(ctx, ax - releaseT * 30, ay + releaseT * 15, atpR * 0.8, COL_ADP, 'rgba(180,140,40,0.15)', 'ADP')
          ctx.globalAlpha = 1
        }
      }

      /* ── Na⁺ ions (3 going OUT = upward) ── */
      const naPhaseStart = PHASE_ATP_BIND + 0.03
      const naPhaseEnd = PHASE_NA_EXIT

      for (let i = 0; i < 3; i++) {
        const offset = i * 0.04
        const nt = easeInOut(remap01(t, naPhaseStart + offset, naPhaseEnd))

        // start positions (intracellular, spread around pump)
        const startX = cx + (i - 1) * ionR * 2.8
        const startY = memY + pumpH / 2 + ionR * 3 + i * ionR * 1.2

        // mid position (through pump channel)
        const midX = cx + (i - 1) * ionR * 0.5
        const midY = memY

        // end positions (extracellular, spread out)
        const endX = cx + (i - 1) * ionR * 3.2
        const endY = memY - pumpH / 2 - ionR * 3 - i * ionR * 1.5

        let nx: number, ny: number
        if (nt < 0.4) {
          // move toward pump
          const sub = nt / 0.4
          nx = lerp(startX, midX, easeInOut(sub))
          ny = lerp(startY, midY + pumpH * 0.2, easeInOut(sub))
        } else if (nt < 0.6) {
          // pass through pump
          const sub = (nt - 0.4) / 0.2
          nx = lerp(midX, midX, sub)
          ny = lerp(midY + pumpH * 0.2, midY - pumpH * 0.2, easeInOut(sub))
        } else {
          // exit to extracellular
          const sub = (nt - 0.6) / 0.4
          nx = lerp(midX, endX, easeInOut(sub))
          ny = lerp(midY - pumpH * 0.2, endY, easeInOut(sub))
        }

        // only draw if cycle is in Na phase or ion hasn't reached final spot
        if (t >= naPhaseStart + offset || t < 0.05) {
          drawIon(ctx, nx, ny, ionR, COL_NA, COL_NA_GLOW, 'Na⁺')
        }
      }

      /* ── K⁺ ions (2 coming IN = downward) ── */
      const kPhaseStart = PHASE_CONFORM
      const kPhaseEnd = PHASE_K_ENTER

      for (let i = 0; i < 2; i++) {
        const offset = i * 0.04
        const kt = easeInOut(remap01(t, kPhaseStart + offset, kPhaseEnd))

        // start positions (extracellular)
        const startX = cx + (i - 0.5) * ionR * 3.5
        const startY = memY - pumpH / 2 - ionR * 3.5 - i * ionR * 1.5

        // mid position (pump channel)
        const midX = cx + (i - 0.5) * ionR * 0.5
        const midY = memY

        // end positions (intracellular)
        const endX = cx + (i - 0.5) * ionR * 3.2
        const endY = memY + pumpH / 2 + ionR * 4 + i * ionR * 1.2

        let kx: number, ky: number
        if (kt < 0.35) {
          const sub = kt / 0.35
          kx = lerp(startX, midX, easeInOut(sub))
          ky = lerp(startY, midY - pumpH * 0.2, easeInOut(sub))
        } else if (kt < 0.6) {
          const sub = (kt - 0.35) / 0.25
          kx = lerp(midX, midX, sub)
          ky = lerp(midY - pumpH * 0.2, midY + pumpH * 0.2, easeInOut(sub))
        } else {
          const sub = (kt - 0.6) / 0.4
          kx = lerp(midX, endX, easeInOut(sub))
          ky = lerp(midY + pumpH * 0.2, endY, easeInOut(sub))
        }

        if (t >= kPhaseStart + offset) {
          drawIon(ctx, kx, ky, ionR, COL_K, COL_K_GLOW, 'K⁺')
        }
      }

      /* ── ambient / waiting ions ── */
      // static Na⁺ floating intracellular
      const floatSin = Math.sin(timestamp * 0.001)
      const floatCos = Math.cos(timestamp * 0.0013)

      ctx.globalAlpha = 0.3
      drawIon(ctx, w * 0.15 + floatSin * 4, memY + h * 0.2 + floatCos * 3, ionR * 0.7, COL_NA, COL_NA_GLOW, 'Na⁺')
      drawIon(ctx, w * 0.82 + floatCos * 3, memY + h * 0.15 - floatSin * 4, ionR * 0.7, COL_NA, COL_NA_GLOW, 'Na⁺')
      drawIon(ctx, w * 0.3 - floatSin * 3, memY + h * 0.28 + floatSin * 2, ionR * 0.6, COL_NA, COL_NA_GLOW, 'Na⁺')

      // static K⁺ floating extracellular
      drawIon(ctx, w * 0.2 - floatCos * 4, memY - h * 0.18 + floatSin * 3, ionR * 0.7, COL_K, COL_K_GLOW, 'K⁺')
      drawIon(ctx, w * 0.78 + floatSin * 3, memY - h * 0.22 - floatCos * 4, ionR * 0.7, COL_K, COL_K_GLOW, 'K⁺')
      drawIon(ctx, w * 0.65 + floatCos * 2, memY - h * 0.12 + floatCos * 3, ionR * 0.6, COL_K, COL_K_GLOW, 'K⁺')
      ctx.globalAlpha = 1

      /* ── HUD / counters ── */
      ctx.textAlign = 'right'
      ctx.textBaseline = 'top'
      ctx.font = `10px ${FONT_MONO}`
      ctx.fillStyle = COL_TEXT_DIM

      const hudX = w - 14
      ctx.fillText(`Ciclos: ${state.cycles}`, hudX, 14)
      ctx.fillText(`ATP consumido: ${state.atpConsumed}`, hudX, 28)

      // stoichiometry reminder
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.font = `9px ${FONT_MONO}`
      ctx.fillStyle = COL_TEAL_ACCENT
      ctx.fillText('3 Na⁺ ↑ saem  ·  2 K⁺ ↓ entram  ·  1 ATP → ADP + Pᵢ', cx, h - 30)

      /* ── next frame ── */
      rafId = requestAnimationFrame(render)
    }

    // kickstart
    state.lastTimestamp = performance.now()
    rafId = requestAnimationFrame(render)

    return () => cancelAnimationFrame(rafId)
  }, [drawMembrane, drawPump, drawIon])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
