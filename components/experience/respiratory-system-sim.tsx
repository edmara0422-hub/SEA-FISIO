'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface RespiratorySystemSimProps {
  className?: string
}

type AirwayPart = 'nose' | 'pharynx' | 'larynx' | 'trachea' | 'bronchi' | 'alveoli' | null

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.03)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.38)'
const COL_AIRWAY = 'rgba(34, 211, 238, 0.5)'
const COL_AIRWAY_FILL = 'rgba(34, 211, 238, 0.06)'
const COL_O2 = 'rgba(34, 211, 238, 0.85)'
const COL_CO2 = 'rgba(244, 63, 94, 0.75)'
const COL_CONDUCT = 'rgba(45, 212, 191, 0.7)'
const COL_RESP = 'rgba(250, 204, 21, 0.7)'
const COL_LUNG = 'rgba(45, 212, 191, 0.12)'
const COL_LUNG_STROKE = 'rgba(45, 212, 191, 0.3)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

const PART_INFO: Record<string, { title: string; zone: string; desc: string }> = {
  nose: { title: 'Nariz e Cavidade Nasal', zone: 'Zona Condutora', desc: 'Filtra, aquece e umidifica o ar. Pelos nasais + muco + IgA.' },
  pharynx: { title: 'Faringe', zone: 'Zona Condutora', desc: 'Via compartilhada para ar e alimento. Nasofaringe, orofaringe e laringofaringe.' },
  larynx: { title: 'Laringe', zone: 'Zona Condutora', desc: 'Pregas vocais (fonação) e epiglote (protege contra aspiração).' },
  trachea: { title: 'Traqueia', zone: 'Zona Condutora', desc: '16-20 anéis cartilaginosos em C. Epitélio mucociliar: 600-900 batimentos/min.' },
  bronchi: { title: 'Brônquios e Bronquíolos', zone: 'Zona Condutora → Respiratória', desc: 'Ramificação dicotômica: 23 gerações. Brônquios → bronquíolos → bronquíolos respiratórios.' },
  alveoli: { title: 'Alvéolos', zone: 'Zona Respiratória', desc: '300-500 milhões. Superfície: ~70m². Membrana: 0,2µm. Local da hematose.' },
}

/* ─────────────────────── helpers ─────────────────────── */

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/* ─────────────────────── component ─────────────────────── */

export function RespiratorySystemSim({ className }: RespiratorySystemSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredPart, setHoveredPart] = useState<AirwayPart>(null)
  const [selectedPart, setSelectedPart] = useState<AirwayPart>(null)
  const stateRef = useRef({
    t: 0,
    lastTimestamp: 0,
    breathPhase: 0, // 0→1 inhale, 1→2 exhale
    particles: [] as { x: number; y: number; phase: number; type: 'o2' | 'co2'; pathIdx: number }[],
  })
  const regionsRef = useRef<{ part: AirwayPart; x: number; y: number; w: number; h: number }[]>([])

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const st = stateRef.current
    const scale = Math.min(w / 700, h / 480)

    ctx.fillStyle = COL_BG
    ctx.fillRect(0, 0, w, h)

    // grid
    ctx.strokeStyle = COL_GRID
    ctx.lineWidth = 0.5
    const gs = 30 * scale
    for (let gx = 0; gx < w; gx += gs) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke() }
    for (let gy = 0; gy < h; gy += gs) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke() }

    // breathing cycle
    st.breathPhase = (st.breathPhase + 0.008) % 2
    const isInhale = st.breathPhase < 1
    const breathT = isInhale ? st.breathPhase : st.breathPhase - 1
    const breathExpand = isInhale ? Math.sin(breathT * Math.PI) * 0.08 : -Math.sin(breathT * Math.PI) * 0.05

    // layout - centered airway system
    const cx = w * 0.42
    const regions: typeof regionsRef.current = []

    // ── NOSE
    const noseX = cx - 15 * scale
    const noseY = 35 * scale
    const noseW = 30 * scale
    const noseH = 35 * scale
    const isNoseHovered = hoveredPart === 'nose' || selectedPart === 'nose'

    ctx.beginPath()
    ctx.moveTo(noseX, noseY + noseH)
    ctx.quadraticCurveTo(noseX - 10 * scale, noseY + noseH * 0.5, noseX + noseW * 0.3, noseY)
    ctx.quadraticCurveTo(noseX + noseW * 0.5, noseY - 5, noseX + noseW * 0.7, noseY)
    ctx.quadraticCurveTo(noseX + noseW + 10 * scale, noseY + noseH * 0.5, noseX + noseW, noseY + noseH)
    ctx.closePath()
    ctx.fillStyle = isNoseHovered ? 'rgba(34, 211, 238, 0.12)' : COL_AIRWAY_FILL
    ctx.fill()
    ctx.strokeStyle = isNoseHovered ? 'rgba(34, 211, 238, 0.8)' : COL_AIRWAY
    ctx.lineWidth = 1.5
    ctx.stroke()

    // nasal hairs
    for (let nh = 0; nh < 4; nh++) {
      const nhx = noseX + 5 + nh * 7
      ctx.beginPath()
      ctx.moveTo(nhx, noseY + noseH - 5)
      ctx.quadraticCurveTo(nhx + Math.sin(st.t + nh) * 3, noseY + noseH - 12, nhx + 2, noseY + noseH - 8)
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)'
      ctx.lineWidth = 0.8
      ctx.stroke()
    }
    regions.push({ part: 'nose', x: noseX - 10, y: noseY - 5, w: noseW + 20, h: noseH + 10 })

    // ── PHARYNX
    const pharX = cx - 10 * scale
    const pharY = noseY + noseH + 5
    const pharW = 20 * scale
    const pharH = 30 * scale
    const isPharHovered = hoveredPart === 'pharynx' || selectedPart === 'pharynx'

    ctx.beginPath()
    ctx.roundRect(pharX, pharY, pharW, pharH, 4)
    ctx.fillStyle = isPharHovered ? 'rgba(34, 211, 238, 0.12)' : COL_AIRWAY_FILL
    ctx.fill()
    ctx.strokeStyle = isPharHovered ? 'rgba(34, 211, 238, 0.8)' : COL_AIRWAY
    ctx.lineWidth = 1.5
    ctx.stroke()
    regions.push({ part: 'pharynx', x: pharX - 5, y: pharY, w: pharW + 10, h: pharH })

    // ── LARYNX
    const larX = cx - 12 * scale
    const larY = pharY + pharH + 5
    const larW = 24 * scale
    const larH = 22 * scale
    const isLarHovered = hoveredPart === 'larynx' || selectedPart === 'larynx'

    // shield shape
    ctx.beginPath()
    ctx.moveTo(larX + larW * 0.5, larY)
    ctx.lineTo(larX + larW, larY + larH * 0.3)
    ctx.lineTo(larX + larW * 0.9, larY + larH)
    ctx.lineTo(larX + larW * 0.1, larY + larH)
    ctx.lineTo(larX, larY + larH * 0.3)
    ctx.closePath()
    ctx.fillStyle = isLarHovered ? 'rgba(34, 211, 238, 0.12)' : COL_AIRWAY_FILL
    ctx.fill()
    ctx.strokeStyle = isLarHovered ? 'rgba(34, 211, 238, 0.8)' : COL_AIRWAY
    ctx.lineWidth = 1.5
    ctx.stroke()

    // vocal cords
    const vcY = larY + larH * 0.5
    const vcGap = 3 + Math.sin(st.t * 2) * 1.5
    ctx.beginPath()
    ctx.moveTo(larX + 4, vcY)
    ctx.lineTo(cx - vcGap, vcY)
    ctx.moveTo(cx + vcGap, vcY)
    ctx.lineTo(larX + larW - 4, vcY)
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    regions.push({ part: 'larynx', x: larX - 5, y: larY, w: larW + 10, h: larH })

    // ── TRACHEA
    const traX = cx - 10 * scale
    const traY = larY + larH + 5
    const traW = 20 * scale
    const traH = 65 * scale
    const isTraHovered = hoveredPart === 'trachea' || selectedPart === 'trachea'

    ctx.beginPath()
    ctx.roundRect(traX, traY, traW, traH, 3)
    ctx.fillStyle = isTraHovered ? 'rgba(34, 211, 238, 0.12)' : COL_AIRWAY_FILL
    ctx.fill()
    ctx.strokeStyle = isTraHovered ? 'rgba(34, 211, 238, 0.8)' : COL_AIRWAY
    ctx.lineWidth = 1.5
    ctx.stroke()

    // cartilage rings
    const ringCount = 8
    for (let r = 0; r < ringCount; r++) {
      const ry = traY + 5 + r * (traH - 10) / (ringCount - 1)
      ctx.beginPath()
      ctx.arc(cx, ry, traW * 0.45, -0.8, Math.PI + 0.8)
      ctx.strokeStyle = isTraHovered ? 'rgba(34, 211, 238, 0.4)' : 'rgba(34, 211, 238, 0.15)'
      ctx.lineWidth = 1.2
      ctx.stroke()
    }

    // cilia animation inside
    for (let ci = 0; ci < 6; ci++) {
      const ciy = traY + 8 + ci * 10
      const sway = Math.sin(st.t * 4 + ci * 0.5) * 2
      ctx.beginPath()
      ctx.moveTo(traX + 3, ciy)
      ctx.lineTo(traX + 3 + sway, ciy - 3)
      ctx.moveTo(traX + traW - 3, ciy)
      ctx.lineTo(traX + traW - 3 - sway, ciy - 3)
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.3)'
      ctx.lineWidth = 0.7
      ctx.stroke()
    }
    regions.push({ part: 'trachea', x: traX - 5, y: traY, w: traW + 10, h: traH })

    // ── BRONCHI (bifurcation)
    const bifY = traY + traH
    const bronchSpread = 55 * scale
    const bronchLen = 50 * scale
    const isBronHovered = hoveredPart === 'bronchi' || selectedPart === 'bronchi'

    // left main bronchus
    ctx.beginPath()
    ctx.moveTo(cx, bifY)
    ctx.quadraticCurveTo(cx - bronchSpread * 0.3, bifY + bronchLen * 0.4, cx - bronchSpread, bifY + bronchLen)
    ctx.strokeStyle = isBronHovered ? 'rgba(34, 211, 238, 0.8)' : COL_AIRWAY
    ctx.lineWidth = 3
    ctx.stroke()

    // right main bronchus
    ctx.beginPath()
    ctx.moveTo(cx, bifY)
    ctx.quadraticCurveTo(cx + bronchSpread * 0.3, bifY + bronchLen * 0.4, cx + bronchSpread, bifY + bronchLen)
    ctx.strokeStyle = isBronHovered ? 'rgba(34, 211, 238, 0.8)' : COL_AIRWAY
    ctx.lineWidth = 3
    ctx.stroke()

    // secondary branches
    const drawBranch2 = (bx: number, by: number, angle: number, len: number, depth: number) => {
      if (depth > 3) return
      const ex = bx + Math.cos(angle) * len
      const ey = by + Math.sin(angle) * len
      ctx.beginPath()
      ctx.moveTo(bx, by)
      ctx.lineTo(ex, ey)
      ctx.strokeStyle = isBronHovered
        ? `rgba(34, 211, 238, ${0.6 - depth * 0.12})`
        : `rgba(34, 211, 238, ${0.3 - depth * 0.06})`
      ctx.lineWidth = Math.max(0.5, 2.5 - depth * 0.6)
      ctx.stroke()
      drawBranch2(ex, ey, angle - 0.4, len * 0.65, depth + 1)
      drawBranch2(ex, ey, angle + 0.4, len * 0.65, depth + 1)
    }

    // left branches
    const lbx = cx - bronchSpread
    const lby = bifY + bronchLen
    drawBranch2(lbx, lby, Math.PI * 0.6, 25 * scale, 0)
    drawBranch2(lbx, lby, Math.PI * 0.75, 22 * scale, 0)

    // right branches
    const rbx = cx + bronchSpread
    const rby = bifY + bronchLen
    drawBranch2(rbx, rby, Math.PI * 0.4, 25 * scale, 0)
    drawBranch2(rbx, rby, Math.PI * 0.25, 22 * scale, 0)

    regions.push({ part: 'bronchi', x: cx - bronchSpread - 30, y: bifY, w: bronchSpread * 2 + 60, h: bronchLen + 20 })

    // ── LUNGS outline
    const lungW = 80 * scale * (1 + breathExpand)
    const lungH = 110 * scale * (1 + breathExpand)
    const lungY2 = bifY + 10

    // right lung (3 lobes)
    ctx.beginPath()
    ctx.ellipse(cx + bronchSpread, lungY2 + lungH * 0.45, lungW, lungH * 0.5, 0, 0, Math.PI * 2)
    ctx.fillStyle = COL_LUNG
    ctx.fill()
    ctx.strokeStyle = COL_LUNG_STROKE
    ctx.lineWidth = 1
    ctx.stroke()
    // fissures
    ctx.beginPath()
    ctx.moveTo(cx + bronchSpread - lungW * 0.8, lungY2 + lungH * 0.25)
    ctx.lineTo(cx + bronchSpread + lungW * 0.8, lungY2 + lungH * 0.35)
    ctx.moveTo(cx + bronchSpread - lungW * 0.7, lungY2 + lungH * 0.55)
    ctx.lineTo(cx + bronchSpread + lungW * 0.7, lungY2 + lungH * 0.6)
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.15)'
    ctx.lineWidth = 0.8
    ctx.stroke()

    // left lung (2 lobes + cardiac notch)
    ctx.beginPath()
    ctx.ellipse(cx - bronchSpread, lungY2 + lungH * 0.45, lungW * 0.9, lungH * 0.5, 0, 0, Math.PI * 2)
    ctx.fillStyle = COL_LUNG
    ctx.fill()
    ctx.strokeStyle = COL_LUNG_STROKE
    ctx.lineWidth = 1
    ctx.stroke()
    // cardiac notch
    ctx.beginPath()
    ctx.arc(cx - bronchSpread + lungW * 0.5, lungY2 + lungH * 0.55, 12 * scale, -0.5, 1.2)
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.2)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.font = `500 ${Math.max(5, 6 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(244, 63, 94, 0.3)'
    ctx.fillText('♥', cx - bronchSpread + lungW * 0.55, lungY2 + lungH * 0.58)

    // ── ALVEOLI cluster (bottom detail)
    const alvX = cx + bronchSpread + lungW * 0.3
    const alvY = lungY2 + lungH * 0.65
    const isAlvHovered = hoveredPart === 'alveoli' || selectedPart === 'alveoli'
    const alvR = 8 * scale

    for (let ai = 0; ai < 7; ai++) {
      const aa = (ai / 7) * Math.PI * 2
      const ax = alvX + Math.cos(aa) * alvR * 2
      const ay = alvY + Math.sin(aa) * alvR * 2

      ctx.beginPath()
      ctx.arc(ax, ay, alvR * (1 + breathExpand * 2), 0, Math.PI * 2)
      ctx.fillStyle = isAlvHovered ? 'rgba(250, 204, 21, 0.12)' : 'rgba(250, 204, 21, 0.04)'
      ctx.fill()
      ctx.strokeStyle = isAlvHovered ? 'rgba(250, 204, 21, 0.7)' : 'rgba(250, 204, 21, 0.3)'
      ctx.lineWidth = 1
      ctx.stroke()

      // capillary wrap
      ctx.beginPath()
      ctx.arc(ax, ay, alvR * 1.3, aa - 0.5, aa + 1.5)
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.25)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
    // center alveolus
    ctx.beginPath()
    ctx.arc(alvX, alvY, alvR * (1 + breathExpand * 2), 0, Math.PI * 2)
    ctx.fillStyle = isAlvHovered ? 'rgba(250, 204, 21, 0.15)' : 'rgba(250, 204, 21, 0.06)'
    ctx.fill()
    ctx.strokeStyle = isAlvHovered ? 'rgba(250, 204, 21, 0.8)' : 'rgba(250, 204, 21, 0.4)'
    ctx.lineWidth = 1
    ctx.stroke()

    regions.push({ part: 'alveoli', x: alvX - alvR * 3.5, y: alvY - alvR * 3.5, w: alvR * 7, h: alvR * 7 })

    // ── air flow particles
    const pathPoints = [
      { x: cx, y: noseY - 10 },
      { x: cx, y: noseY + noseH * 0.5 },
      { x: cx, y: pharY + pharH * 0.5 },
      { x: cx, y: larY + larH * 0.5 },
      { x: cx, y: traY + traH * 0.5 },
      { x: cx, y: bifY },
    ]

    // initialize particles
    if (st.particles.length === 0) {
      for (let i = 0; i < 12; i++) {
        st.particles.push({
          x: 0, y: 0,
          phase: Math.random(),
          type: i < 8 ? 'o2' : 'co2',
          pathIdx: 0,
        })
      }
    }

    // draw particles
    for (const p of st.particles) {
      if (p.type === 'o2') {
        // O₂ flows in (top to bottom)
        p.phase += 0.006
        if (p.phase > 1) p.phase = 0

        const totalLen = pathPoints.length - 1
        const segIdx = Math.floor(p.phase * totalLen)
        const segT = (p.phase * totalLen) - segIdx
        const p1 = pathPoints[Math.min(segIdx, pathPoints.length - 1)]
        const p2 = pathPoints[Math.min(segIdx + 1, pathPoints.length - 1)]

        const px = lerp(p1.x, p2.x, segT) + Math.sin(st.t * 3 + p.phase * 10) * 4
        const py = lerp(p1.y, p2.y, segT)

        ctx.beginPath()
        ctx.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = COL_O2
        ctx.fill()

        const grad = ctx.createRadialGradient(px, py, 0, px, py, 8)
        grad.addColorStop(0, 'rgba(34, 211, 238, 0.2)')
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(px - 10, py - 10, 20, 20)
      } else {
        // CO₂ flows out (bottom to top)
        p.phase += 0.004
        if (p.phase > 1) p.phase = 0

        const totalLen = pathPoints.length - 1
        const segIdx = Math.floor((1 - p.phase) * totalLen)
        const segT = ((1 - p.phase) * totalLen) - segIdx
        const p1 = pathPoints[Math.min(segIdx, pathPoints.length - 1)]
        const p2 = pathPoints[Math.min(segIdx + 1, pathPoints.length - 1)]

        const px = lerp(p1.x, p2.x, segT) + Math.sin(st.t * 2.5 + p.phase * 8) * 4
        const py = lerp(p1.y, p2.y, segT)

        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fillStyle = COL_CO2
        ctx.fill()
      }
    }

    // ── labels (right side)
    const labelX = w * 0.72
    const fontSize = Math.max(8, 9 * scale)
    ctx.font = `600 ${fontSize}px ${FONT_MONO}`
    ctx.textAlign = 'left'

    const labels: { text: string; y: number; color: string; part: AirwayPart }[] = [
      { text: 'NARIZ', y: noseY + noseH * 0.5, color: COL_CONDUCT, part: 'nose' },
      { text: 'FARINGE', y: pharY + pharH * 0.5, color: COL_CONDUCT, part: 'pharynx' },
      { text: 'LARINGE', y: larY + larH * 0.5, color: COL_CONDUCT, part: 'larynx' },
      { text: 'TRAQUEIA', y: traY + traH * 0.5, color: COL_CONDUCT, part: 'trachea' },
      { text: 'BRÔNQUIOS', y: bifY + bronchLen * 0.5, color: COL_CONDUCT, part: 'bronchi' },
      { text: 'ALVÉOLOS', y: alvY, color: COL_RESP, part: 'alveoli' },
    ]

    for (const lbl of labels) {
      const isActive = hoveredPart === lbl.part || selectedPart === lbl.part
      // connector line
      ctx.beginPath()
      ctx.moveTo(cx + 45 * scale, lbl.y)
      ctx.lineTo(labelX - 5, lbl.y)
      ctx.strokeStyle = isActive ? lbl.color : 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 0.5
      ctx.setLineDash([2, 3])
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = isActive ? lbl.color : COL_TEXT_DIM
      ctx.fillText(lbl.text, labelX, lbl.y + 4)
    }

    // zone indicators
    ctx.font = `700 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
    ctx.fillStyle = COL_CONDUCT
    ctx.fillText('ZONA CONDUTORA', labelX, noseY - 5)
    // zone line
    ctx.beginPath()
    ctx.moveTo(labelX, noseY)
    ctx.lineTo(labelX, bifY + 10)
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.15)'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = COL_RESP
    ctx.fillText('ZONA RESPIRATÓRIA', labelX, bifY + bronchLen * 0.8)
    ctx.beginPath()
    ctx.moveTo(labelX, bifY + bronchLen * 0.85)
    ctx.lineTo(labelX, alvY + 20)
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.15)'
    ctx.lineWidth = 2
    ctx.stroke()

    // breathing indicator
    ctx.font = `700 ${Math.max(10, 12 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'right'
    ctx.fillStyle = isInhale ? COL_O2 : COL_CO2
    ctx.fillText(isInhale ? '↓ INSPIRAÇÃO' : '↑ EXPIRAÇÃO', w - 15, 25)

    // O₂ / CO₂ legend
    ctx.font = `500 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
    ctx.fillStyle = COL_O2
    ctx.fillText('● O₂', w - 60, 42)
    ctx.fillStyle = COL_CO2
    ctx.fillText('● CO₂', w - 60, 55)

    // HUD
    ctx.font = `600 ${Math.max(9, 10 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('RESPIRATORY.SYSTEM', 12, h - 12)
    ctx.fillStyle = 'rgba(45, 212, 191, 0.5)'
    ctx.fillText('▸ INTERATIVO', 12, h - 26)

    regionsRef.current = regions
  }, [hoveredPart, selectedPart])

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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const cvs = canvasRef.current
    if (!cvs) return
    const rect = cvs.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    let found: AirwayPart = null
    for (let i = regionsRef.current.length - 1; i >= 0; i--) {
      const r = regionsRef.current[i]
      if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) { found = r.part; break }
    }
    setHoveredPart(found)
    cvs.style.cursor = found ? 'pointer' : 'default'
  }, [])

  const handleClick = useCallback(() => {
    setSelectedPart(prev => prev === hoveredPart ? null : hoveredPart)
  }, [hoveredPart])

  const activePart = selectedPart || hoveredPart
  const info = activePart ? PART_INFO[activePart] : null

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas
        ref={canvasRef}
        className="w-full rounded-2xl"
        style={{ aspectRatio: '16/9', background: COL_BG }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={() => setHoveredPart(null)}
      />
      {info && (
        <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md px-4 py-3" style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full" style={{ background: info.zone.includes('Respiratória') ? COL_RESP : COL_CONDUCT }} />
            <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider">{info.title}</span>
            <span className="text-[9px] text-white/40 ml-1">{info.zone}</span>
          </div>
          <p className="text-[10px] text-white/50">{info.desc}</p>
        </div>
      )}
    </div>
  )
}
