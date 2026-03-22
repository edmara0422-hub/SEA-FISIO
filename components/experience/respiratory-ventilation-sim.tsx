'use client'

import { useEffect, useRef, useCallback } from 'react'

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.02)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.30)'
const COL_WALL = 'rgba(45, 212, 191, 0.35)'
const COL_LUNG = 'rgba(45, 212, 191,'
const COL_DIA = 'rgba(244, 63, 94,'
const COL_RIBS = 'rgba(167, 139, 250, 0.15)'
const COL_AIR = 'rgba(34, 211, 238,'
const COL_MUSCLE_INS = 'rgba(34, 211, 238, 0.6)'
const COL_MUSCLE_EXP = 'rgba(244, 63, 94, 0.5)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

function ease(t: number) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

/* ─────────────────────── component ─────────────────────── */

export function RespiratoryVentilationSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stRef = useRef({ t: 0, last: 0, cycle: 0 })

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const s = stRef.current
    const S = Math.min(w / 720, h / 480)

    ctx.fillStyle = COL_BG; ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = COL_GRID; ctx.lineWidth = 0.5
    const gs = 26 * S
    for (let x = 0; x < w; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
    for (let y = 0; y < h; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

    // breathing cycle: 0→0.45 inhale, 0.45→0.5 pause, 0.5→0.95 exhale, 0.95→1 pause
    s.cycle = (s.cycle + 0.004) % 1
    const isInhale = s.cycle < 0.45
    const isExhale = s.cycle >= 0.5 && s.cycle < 0.95
    const bt = isInhale ? ease(s.cycle / 0.45) : isExhale ? ease((s.cycle - 0.5) / 0.45) : (s.cycle < 0.5 ? 1 : 0)
    const expand = isInhale ? bt : isExhale ? 1 - bt : (s.cycle < 0.5 ? 1 : 0)

    // pressures (cmH₂O)
    const pPleural = lerp(-5, -7.5, expand)
    const pAlveolar = isInhale ? -1 * Math.sin(bt * Math.PI) : isExhale ? 1 * Math.sin(bt * Math.PI) : 0
    const volume = lerp(2400, 2900, expand) // tidal ~500mL

    // ═══ LEFT SIDE: THORAX CROSS-SECTION ═══
    const thCx = w * 0.32
    const thCy = h * 0.44
    const thW = 130 * S * (1 + expand * 0.08)
    const thH = 150 * S

    // ── thoracic cage (ribs outline)
    ctx.beginPath()
    ctx.ellipse(thCx, thCy, thW, thH * 0.52, 0, 0, Math.PI * 2)
    ctx.strokeStyle = COL_RIBS
    ctx.lineWidth = 3 * S; ctx.stroke()

    // rib lines
    for (let r = 0; r < 7; r++) {
      const ra = -0.6 + (r / 6) * 1.2
      const rx1 = thCx + Math.cos(ra) * thW * 0.3
      const ry1 = thCy + Math.sin(ra) * thH * 0.48
      const rx2 = thCx + Math.cos(ra) * thW * 0.97
      const ry2 = thCy + Math.sin(ra) * thH * 0.5
      ctx.beginPath(); ctx.moveTo(rx1, ry1); ctx.lineTo(rx2, ry2)
      ctx.strokeStyle = COL_RIBS; ctx.lineWidth = 2 * S; ctx.stroke()
      // mirror
      ctx.beginPath(); ctx.moveTo(thCx * 2 - rx1 - (thCx - rx1) * 2, ry1); ctx.lineTo(thCx * 2 - rx2 - (thCx - rx2) * 2, ry2)
      ctx.stroke()
    }

    // ── intercostal muscles (arrows on ribs)
    const icColor = isInhale ? COL_MUSCLE_INS : (isExhale ? COL_MUSCLE_EXP : COL_TEXT_DIM)
    if (isInhale || isExhale) {
      for (let r = 0; r < 4; r++) {
        const ra = -0.3 + r * 0.25
        const rx = thCx + Math.cos(ra) * thW * 0.85
        const ry = thCy + Math.sin(ra) * thH * 0.49
        const dir = isInhale ? -1 : 1 // up during inspiration
        ctx.beginPath()
        ctx.moveTo(rx, ry)
        ctx.lineTo(rx, ry + dir * 8 * S)
        ctx.lineTo(rx - 3, ry + dir * 5 * S)
        ctx.moveTo(rx, ry + dir * 8 * S)
        ctx.lineTo(rx + 3, ry + dir * 5 * S)
        ctx.strokeStyle = icColor; ctx.lineWidth = 1.2; ctx.stroke()
      }
    }

    // ── lungs inside thorax
    const lungExp = expand * 0.12
    for (const side of [-1, 1]) {
      const lx = thCx + side * 35 * S
      const lw = (55 + expand * 8) * S
      const lh = (60 + expand * 6) * S

      ctx.beginPath()
      ctx.ellipse(lx, thCy - 8 * S, lw * 0.65, lh * 0.48, 0, 0, Math.PI * 2)
      ctx.fillStyle = `${COL_LUNG} ${0.06 + expand * 0.04})`
      ctx.fill()
      ctx.strokeStyle = `${COL_LUNG} ${0.25 + expand * 0.1})`
      ctx.lineWidth = 1.5; ctx.stroke()

      // bronchus into lung
      ctx.beginPath()
      ctx.moveTo(thCx, thCy - 50 * S)
      ctx.quadraticCurveTo(thCx + side * 10 * S, thCy - 30 * S, lx, thCy - 15 * S)
      ctx.strokeStyle = `${COL_LUNG} 0.3)`; ctx.lineWidth = 2.5 * S; ctx.stroke()
    }

    // trachea
    ctx.beginPath()
    ctx.moveTo(thCx - 5 * S, thCy - 75 * S)
    ctx.lineTo(thCx - 5 * S, thCy - 50 * S)
    ctx.moveTo(thCx + 5 * S, thCy - 75 * S)
    ctx.lineTo(thCx + 5 * S, thCy - 50 * S)
    ctx.strokeStyle = COL_WALL; ctx.lineWidth = 1.5; ctx.stroke()

    // ── air flow arrows at top (nose/mouth)
    if (isInhale) {
      for (let a = 0; a < 3; a++) {
        const ay = thCy - 80 * S - a * 12 * S - ((s.t * 30 + a * 10) % 25)
        const alpha = 0.3 + Math.sin(s.t * 3 + a) * 0.15
        ctx.beginPath()
        ctx.moveTo(thCx, ay)
        ctx.lineTo(thCx - 4, ay - 5)
        ctx.moveTo(thCx, ay)
        ctx.lineTo(thCx + 4, ay - 5)
        ctx.moveTo(thCx, ay - 5)
        ctx.lineTo(thCx, ay + 5)
        ctx.strokeStyle = `${COL_AIR} ${alpha})`; ctx.lineWidth = 1.5; ctx.stroke()
      }
      ctx.font = `600 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = `${COL_AIR} 0.6)`
      ctx.fillText('AR ENTRA ↓', thCx, thCy - 82 * S)
    } else if (isExhale) {
      for (let a = 0; a < 3; a++) {
        const ay = thCy - 82 * S + a * 12 * S + ((s.t * 25 + a * 10) % 25) - 25
        const alpha = 0.3 + Math.sin(s.t * 3 + a) * 0.15
        ctx.beginPath()
        ctx.moveTo(thCx, ay)
        ctx.lineTo(thCx - 4, ay + 5)
        ctx.moveTo(thCx, ay)
        ctx.lineTo(thCx + 4, ay + 5)
        ctx.moveTo(thCx, ay + 5)
        ctx.lineTo(thCx, ay - 5)
        ctx.strokeStyle = `${COL_DIA} ${alpha})`; ctx.lineWidth = 1.5; ctx.stroke()
      }
      ctx.font = `600 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = `${COL_DIA} 0.6)`
      ctx.fillText('AR SAI ↑', thCx, thCy - 82 * S)
    }

    // ── DIAPHRAGM (dome shape that flattens on inspiration)
    const diaBaseY = thCy + thH * 0.42
    const diaDome = (1 - expand) * 20 * S // dome is high when relaxed, flat when contracted
    const diaWw = thW * 0.85

    ctx.beginPath()
    ctx.moveTo(thCx - diaWw, diaBaseY + 5)
    ctx.quadraticCurveTo(thCx, diaBaseY - diaDome, thCx + diaWw, diaBaseY + 5)
    ctx.strokeStyle = isInhale ? `${COL_AIR} 0.6)` : (isExhale ? `${COL_DIA} 0.5)` : `${COL_DIA} 0.3)`)
    ctx.lineWidth = 3.5 * S; ctx.stroke()

    // diaphragm fill
    ctx.beginPath()
    ctx.moveTo(thCx - diaWw, diaBaseY + 5)
    ctx.quadraticCurveTo(thCx, diaBaseY - diaDome, thCx + diaWw, diaBaseY + 5)
    ctx.lineTo(thCx + diaWw, diaBaseY + 18 * S)
    ctx.quadraticCurveTo(thCx, diaBaseY + 8 * S, thCx - diaWw, diaBaseY + 18 * S)
    ctx.closePath()
    ctx.fillStyle = `${COL_DIA} 0.06)`; ctx.fill()

    // diaphragm arrows + label
    if (isInhale) {
      ctx.font = `700 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = COL_MUSCLE_INS
      ctx.fillText('DIAFRAGMA CONTRAI ↓', thCx, diaBaseY + 28 * S)
      // arrows down
      for (let a = -1; a <= 1; a++) {
        ctx.beginPath()
        ctx.moveTo(thCx + a * 30 * S, diaBaseY + 8)
        ctx.lineTo(thCx + a * 30 * S, diaBaseY + 16)
        ctx.strokeStyle = COL_MUSCLE_INS; ctx.lineWidth = 1.5; ctx.stroke()
      }
    } else if (isExhale) {
      ctx.font = `700 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = COL_MUSCLE_EXP
      ctx.fillText('DIAFRAGMA RELAXA ↑', thCx, diaBaseY + 28 * S)
    } else {
      ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = COL_TEXT_DIM
      ctx.fillText('DIAFRAGMA', thCx, diaBaseY + 25 * S)
    }

    // ── pleural space indicator
    ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(250, 204, 21, 0.3)'
    ctx.fillText('Espaço pleural', thCx + 50 * S, thCy + thH * 0.2)
    ctx.fillText(`P = ${pPleural.toFixed(1)} cmH₂O`, thCx + 50 * S, thCy + thH * 0.2 + 11)

    // ═══ RIGHT SIDE: INFO PANEL ═══
    const infoX = w * 0.60
    const infoTop = 25

    // phase title
    ctx.font = `800 ${Math.max(14, 18 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = isInhale ? COL_MUSCLE_INS : (isExhale ? COL_MUSCLE_EXP : 'rgba(255,255,255,0.3)')
    ctx.fillText(isInhale ? 'INSPIRAÇÃO' : (isExhale ? 'EXPIRAÇÃO' : 'PAUSA'), infoX, infoTop)

    ctx.font = `600 ${Math.max(8, 10 * S)}px ${FONT_MONO}`
    ctx.fillStyle = isInhale ? 'rgba(34, 211, 238, 0.5)' : (isExhale ? 'rgba(244, 63, 94, 0.4)' : COL_TEXT_DIM)
    ctx.fillText(isInhale ? 'Processo ATIVO' : (isExhale ? 'Processo PASSIVO' : ''), infoX, infoTop + 18)

    // mechanism description
    const descY = infoTop + 42
    ctx.font = `500 ${Math.max(7, 8.5 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(255,255,255,0.4)'

    if (isInhale) {
      const lines = [
        '1. Músculos contraem',
        '2. Volume torácico ↑',
        '3. Pressão alveolar ↓',
        '4. P.alv < P.atm → ar entra',
      ]
      lines.forEach((l, i) => ctx.fillText(l, infoX, descY + i * 16))
    } else if (isExhale) {
      const lines = [
        '1. Músculos relaxam',
        '2. Volume torácico ↓',
        '3. Pressão alveolar ↑',
        '4. P.alv > P.atm → ar sai',
      ]
      lines.forEach((l, i) => ctx.fillText(l, infoX, descY + i * 16))
    }

    // ── VITALS PANEL
    const vitY = descY + 80
    ctx.font = `700 ${Math.max(9, 11 * S)}px ${FONT_MONO}`

    // volume
    ctx.fillStyle = `${COL_LUNG} 0.6)`
    ctx.fillText(`Volume: ${Math.round(volume)} mL`, infoX, vitY)
    const volBar = 130 * S
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.fillRect(infoX, vitY + 5, volBar, 6 * S)
    ctx.fillStyle = `${COL_LUNG} 0.35)`
    ctx.fillRect(infoX, vitY + 5, volBar * ((volume - 2000) / 1500), 6 * S)

    // P alveolar
    ctx.fillStyle = pAlveolar < 0 ? COL_MUSCLE_INS : (pAlveolar > 0 ? COL_MUSCLE_EXP : COL_TEXT_DIM)
    ctx.fillText(`P.Alveolar: ${pAlveolar >= 0 ? '+' : ''}${pAlveolar.toFixed(1)} cmH₂O`, infoX, vitY + 28)
    // bar centered at 0
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.fillRect(infoX, vitY + 33, volBar, 6 * S)
    const pCenter = infoX + volBar / 2
    const pWidth = Math.abs(pAlveolar) / 1.5 * volBar / 2
    ctx.fillStyle = pAlveolar < 0 ? `${COL_AIR} 0.35)` : `${COL_DIA} 0.35)`
    if (pAlveolar < 0) {
      ctx.fillRect(pCenter - pWidth, vitY + 33, pWidth, 6 * S)
    } else {
      ctx.fillRect(pCenter, vitY + 33, pWidth, 6 * S)
    }
    // zero line
    ctx.beginPath(); ctx.moveTo(pCenter, vitY + 32); ctx.lineTo(pCenter, vitY + 40)
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.stroke()

    // P pleural
    ctx.fillStyle = 'rgba(250, 204, 21, 0.5)'
    ctx.fillText(`P.Pleural: ${pPleural.toFixed(1)} cmH₂O`, infoX, vitY + 55)
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.fillRect(infoX, vitY + 60, volBar, 6 * S)
    const plFrac = (-pPleural - 4) / 5 // -5 to -9 → 0.2 to 1
    ctx.fillStyle = 'rgba(250, 204, 21, 0.25)'
    ctx.fillRect(infoX, vitY + 60, volBar * Math.min(1, Math.max(0.05, plFrac)), 6 * S)

    // ── MUSCLES LIST
    const muscY = vitY + 90
    ctx.font = `700 ${Math.max(8, 9 * S)}px ${FONT_MONO}`
    ctx.fillStyle = isInhale ? COL_MUSCLE_INS : (isExhale ? COL_MUSCLE_EXP : COL_TEXT_DIM)
    ctx.fillText(isInhale ? 'MÚSCULOS INSPIRATÓRIOS' : (isExhale ? 'MÚSCULOS EXPIRATÓRIOS' : 'MÚSCULOS'), infoX, muscY)

    ctx.font = `500 ${Math.max(6, 7.5 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(255,255,255,0.35)'

    if (isInhale) {
      const muscles = [
        '▸ Diafragma (C3-C5) — principal',
        '▸ Intercostais Externos (T1-T12)',
        '▸ Escalenos — 1ªs costelas',
        '▸ ECM — eleva esterno (acessório)',
      ]
      muscles.forEach((m, i) => ctx.fillText(m, infoX, muscY + 14 + i * 13))
    } else if (isExhale) {
      const muscles = [
        '▸ Retração elástica (passivo)',
        '▸ Reto Abdominal (forçada)',
        '▸ Intercostais Internos (forçada)',
        '▸ Oblíquos/Transverso (forçada)',
      ]
      muscles.forEach((m, i) => ctx.fillText(m, infoX, muscY + 14 + i * 13))
    }

    // ── PRESSURE MINI-GRAPH (bottom)
    const gX = w * 0.08, gY = h - 75 * S, gW = w * 0.84, gH = 55 * S

    // axes
    ctx.beginPath(); ctx.moveTo(gX, gY); ctx.lineTo(gX, gY + gH); ctx.lineTo(gX + gW, gY + gH)
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1; ctx.stroke()

    // zero line
    const zeroY = gY + gH * 0.45
    ctx.beginPath(); ctx.moveTo(gX, zeroY); ctx.lineTo(gX + gW, zeroY)
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 0.5; ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([])

    ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'right'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('0', gX - 3, zeroY + 3)
    ctx.fillText('+1', gX - 3, gY + 8)
    ctx.fillText('-1', gX - 3, gY + gH - 2)
    ctx.textAlign = 'center'
    ctx.fillText('cmH₂O', gX - 12, gY + gH / 2)

    // draw alveolar pressure curve (sinusoidal)
    ctx.beginPath()
    for (let px = 0; px <= gW; px += 2) {
      const t = px / gW
      const cyclePhase = (t + s.cycle) % 1
      let pVal = 0
      if (cyclePhase < 0.45) pVal = -Math.sin((cyclePhase / 0.45) * Math.PI) * 1
      else if (cyclePhase >= 0.5 && cyclePhase < 0.95) pVal = Math.sin(((cyclePhase - 0.5) / 0.45) * Math.PI) * 1

      const py = zeroY - pVal * (gH * 0.4)
      px === 0 ? ctx.moveTo(gX + px, py) : ctx.lineTo(gX + px, py)
    }
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)'; ctx.lineWidth = 1.5; ctx.stroke()

    // current position marker
    const markerX = gX + s.cycle * gW
    ctx.beginPath(); ctx.arc(markerX, zeroY - pAlveolar * gH * 0.4, 4, 0, Math.PI * 2)
    ctx.fillStyle = pAlveolar < 0 ? COL_MUSCLE_INS : (pAlveolar > 0 ? COL_MUSCLE_EXP : 'rgba(255,255,255,0.3)')
    ctx.fill()

    // graph label
    ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(250, 204, 21, 0.45)'
    ctx.fillText('P.Alveolar', gX + gW + 5, zeroY + 3)

    // inspiration/expiration labels on graph
    ctx.textAlign = 'center'
    ctx.fillStyle = `${COL_AIR} 0.3)`
    ctx.fillText('INSP', gX + gW * 0.22, gY + gH + 12)
    ctx.fillStyle = `${COL_DIA} 0.3)`
    ctx.fillText('EXP', gX + gW * 0.72, gY + gH + 12)

    // HUD
    ctx.font = `600 ${Math.max(9, 10 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM; ctx.fillText('VENTILATION.MECHANICS', 12, h - 6)
  }, [])

  useEffect(() => {
    const c = canvasRef.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    let raf = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const s = stRef.current
      if (now - s.last < FRAME_MS) return; s.last = now; s.t += 0.03
      const dpr = window.devicePixelRatio || 1
      const r = c.getBoundingClientRect()
      const cw = r.width * dpr, ch = r.height * dpr
      if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(ctx, r.width, r.height)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [draw])

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas ref={canvasRef} className="w-full rounded-2xl" style={{ aspectRatio: '16/9', background: COL_BG }} />
    </div>
  )
}
