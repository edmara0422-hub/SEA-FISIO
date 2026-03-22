'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface RespiratorySystemSimProps {
  className?: string
}

type AirwayPart = 'nose' | 'pharynx' | 'larynx' | 'trachea' | 'bronchi' | 'alveoli' | 'diaphragm' | 'lungs' | null

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.025)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.35)'
const COL_AIRWAY = 'rgba(34, 211, 238, 0.45)'
const COL_AIRWAY_HI = 'rgba(34, 211, 238, 0.85)'
const COL_AIRWAY_FILL = 'rgba(34, 211, 238, 0.05)'
const COL_AIRWAY_FILL_HI = 'rgba(34, 211, 238, 0.12)'
const COL_O2 = 'rgba(34, 211, 238, 0.9)'
const COL_CO2 = 'rgba(244, 63, 94, 0.75)'
const COL_CONDUCT = 'rgba(45, 212, 191, 0.65)'
const COL_RESP = 'rgba(250, 204, 21, 0.65)'
const COL_LUNG_L = 'rgba(45, 212, 191, 0.07)'
const COL_LUNG_R = 'rgba(45, 212, 191, 0.09)'
const COL_LUNG_STROKE = 'rgba(45, 212, 191, 0.22)'
const COL_RIB = 'rgba(255, 255, 255, 0.04)'
const COL_RIB_STROKE = 'rgba(255, 255, 255, 0.07)'
const COL_DIAPHRAGM = 'rgba(244, 63, 94, 0.35)'
const COL_MUCUS = 'rgba(45, 212, 191, 0.2)'
const COL_CARTILAGE = 'rgba(167, 139, 250, 0.18)'
const COL_EPIGLOTTIS = 'rgba(250, 204, 21, 0.45)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

const PART_INFO: Record<string, { title: string; zone: string; desc: string; details: string[] }> = {
  nose: {
    title: 'Nariz e Cavidade Nasal',
    zone: 'Zona Condutora',
    desc: 'Filtra, aquece e umidifica o ar inspirado.',
    details: ['Pelos nasais (vibrissas)', 'Conchas nasais ↑ turbulência', 'Muco + IgA', 'Aquece ar a 37°C'],
  },
  pharynx: {
    title: 'Faringe',
    zone: 'Zona Condutora',
    desc: 'Via compartilhada para ar e alimento.',
    details: ['Nasofaringe', 'Orofaringe', 'Laringofaringe', 'Tecido linfóide (tonsilas)'],
  },
  larynx: {
    title: 'Laringe',
    zone: 'Zona Condutora',
    desc: 'Pregas vocais + epiglote (protege aspiração).',
    details: ['Cartilagem tireóidea', 'Epiglote fecha na deglutição', 'Pregas vocais: fonação', 'Glote: passagem do ar'],
  },
  trachea: {
    title: 'Traqueia',
    zone: 'Zona Condutora',
    desc: '16-20 anéis cartilaginosos em C. Epitélio mucociliar.',
    details: ['Anéis em C (aberto posterior)', 'Músculo traqueal posterior', 'Cílios: 600-900 bat/min', 'Espaço morto: ~150 mL'],
  },
  bronchi: {
    title: 'Brônquios e Bronquíolos',
    zone: 'Condutora → Respiratória',
    desc: '23 gerações de ramificação dicotômica.',
    details: ['Brônquio D mais vertical', 'Músculo liso → broncoconstrição', '23 gerações até alvéolos', 'Bronquíolo: <1mm diâmetro'],
  },
  alveoli: {
    title: 'Alvéolos Pulmonares',
    zone: 'Zona Respiratória',
    desc: '300-500 milhões. Superfície ≈70m². Hematose.',
    details: ['Pneumócito I: troca gasosa', 'Pneumócito II: surfactante', 'Membrana: 0,2 µm', 'Capilares pulmonares'],
  },
  diaphragm: {
    title: 'Diafragma',
    zone: 'Motor Primário',
    desc: 'Principal músculo inspiratório. Inervação: nervo frênico (C3-C5).',
    details: ['Contrai → desce → ↑ volume', 'Relaxa → sobe → ↓ volume', 'Responsável por 75% da ventilação', 'Nervo frênico: C3-C5'],
  },
  lungs: {
    title: 'Pulmões',
    zone: 'Órgão Central',
    desc: 'Direito: 3 lobos. Esquerdo: 2 lobos + incisura cardíaca.',
    details: ['Pulmão D: lobo sup/méd/inf', 'Pulmão E: lobo sup/inf', 'Incisura cardíaca (E)', 'Pleura visceral + parietal'],
  },
}

/* ─────────────────────── helpers ─────────────────────── */

function lerp(a: number, b: number, t: number): number { return a + (b - a) * t }
function easeInOut(t: number): number { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 }

interface FlowParticle {
  phase: number
  speed: number
  type: 'o2' | 'co2'
  side: 'left' | 'right' | 'center'
  wobble: number
  size: number
}

/* ─────────────────────── component ─────────────────────── */

export function RespiratorySystemSim({ className }: RespiratorySystemSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredPart, setHoveredPart] = useState<AirwayPart>(null)
  const [selectedPart, setSelectedPart] = useState<AirwayPart>(null)
  const stateRef = useRef({
    t: 0,
    lastTimestamp: 0,
    breathCycle: 0,
    particles: null as FlowParticle[] | null,
    volumeMl: 2400,
  })
  const regionsRef = useRef<{ part: AirwayPart; x: number; y: number; w: number; h: number }[]>([])

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const st = stateRef.current
    const S = Math.min(w / 750, h / 500)

    ctx.fillStyle = COL_BG
    ctx.fillRect(0, 0, w, h)

    // subtle grid
    ctx.strokeStyle = COL_GRID
    ctx.lineWidth = 0.5
    const gs = 28 * S
    for (let gx = 0; gx < w; gx += gs) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke() }
    for (let gy = 0; gy < h; gy += gs) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke() }

    // ── breathing mechanics
    st.breathCycle = (st.breathCycle + 0.005) % 1
    const isInhale = st.breathCycle < 0.45
    const isExhale = st.breathCycle >= 0.5 && st.breathCycle < 0.95
    const breathT = isInhale ? easeInOut(st.breathCycle / 0.45) : (isExhale ? easeInOut((st.breathCycle - 0.5) / 0.45) : (st.breathCycle < 0.5 ? 1 : 0))
    const expand = isInhale ? breathT * 0.10 : (isExhale ? (1 - breathT) * 0.10 : (st.breathCycle < 0.5 ? 0.10 : 0))
    st.volumeMl = Math.round(2400 + expand * 5000)

    // layout centers
    const cx = w * 0.38
    const topY = 18 * S

    // key Y positions
    const noseY = topY
    const noseH = 38 * S
    const pharY = noseY + noseH + 4
    const pharH = 28 * S
    const larY = pharY + pharH + 4
    const larH = 26 * S
    const traY = larY + larH + 3
    const traH = 62 * S
    const bifY = traY + traH
    const bronchLen = 52 * S
    const bronchSpread = 75 * S

    const lungTop = bifY - 8
    const lungW = 105 * S * (1 + expand)
    const lungH = 140 * S * (1 + expand * 0.8)
    const lungCenterY = lungTop + lungH * 0.45

    const regions: typeof regionsRef.current = []

    // ═══════════════════ RIB CAGE ═══════════════════
    const ribCount = 7
    for (let i = 0; i < ribCount; i++) {
      const ry = lungTop + 8 + i * (lungH - 16) / (ribCount - 1)
      const ribW = (lungW * 2 + bronchSpread * 2 + 20 * S) * (1 - Math.abs(i - 3) * 0.06)
      ctx.beginPath()
      ctx.ellipse(cx, ry, ribW * 0.52, 4 * S, 0, 0.15, Math.PI - 0.15)
      ctx.strokeStyle = COL_RIB_STROKE
      ctx.lineWidth = 2.5 * S
      ctx.stroke()
      // fill
      ctx.beginPath()
      ctx.ellipse(cx, ry, ribW * 0.52, 3 * S, 0, 0.15, Math.PI - 0.15)
      ctx.strokeStyle = COL_RIB
      ctx.lineWidth = 5 * S
      ctx.stroke()
    }

    // ═══════════════════ LUNGS ═══════════════════
    const isLungHi = hoveredPart === 'lungs' || selectedPart === 'lungs'
    const lungBase = lungTop + lungH // bottom of both lungs
    const lungStroke = isLungHi ? 'rgba(45, 212, 191, 0.4)' : COL_LUNG_STROKE

    // ── RIGHT LUNG (3 lobes — wider)
    const rlx = cx + bronchSpread * 0.55 // medial edge
    const rrx = rlx + lungW              // lateral edge
    ctx.beginPath()
    // apex (top)
    ctx.moveTo(rlx + 2, lungTop + 8)
    // lateral border going down — big convex curve
    ctx.bezierCurveTo(
      rlx + lungW * 0.6, lungTop - 4,
      rrx + 4, lungTop + lungH * 0.25,
      rrx + 2, lungCenterY
    )
    // continue lateral down to base
    ctx.bezierCurveTo(
      rrx + 2, lungCenterY + lungH * 0.35,
      rrx - lungW * 0.1, lungBase - 4,
      rlx + lungW * 0.5, lungBase
    )
    // base (flat/slightly curved bottom)
    ctx.bezierCurveTo(
      rlx + lungW * 0.15, lungBase + 2,
      rlx - 2, lungBase - 8,
      rlx - 2, lungBase - lungH * 0.18
    )
    // medial border going back up
    ctx.bezierCurveTo(
      rlx - 2, lungTop + lungH * 0.3,
      rlx, lungTop + 12,
      rlx + 2, lungTop + 8
    )
    ctx.closePath()
    ctx.fillStyle = isLungHi ? 'rgba(45, 212, 191, 0.14)' : COL_LUNG_R
    ctx.fill()
    ctx.strokeStyle = lungStroke
    ctx.lineWidth = 1.5
    ctx.stroke()

    // fissures right (horizontal + oblique)
    ctx.beginPath()
    ctx.moveTo(rlx + 5, lungCenterY - lungH * 0.08)
    ctx.quadraticCurveTo(rlx + lungW * 0.5, lungCenterY - lungH * 0.04, rrx - 8, lungCenterY + lungH * 0.02)
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.14)'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(rlx + 8, lungCenterY + lungH * 0.16)
    ctx.quadraticCurveTo(rlx + lungW * 0.5, lungCenterY + lungH * 0.22, rrx - 10, lungCenterY + lungH * 0.26)
    ctx.stroke()

    // lobe labels right
    ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(45, 212, 191, 0.28)'
    ctx.fillText('Sup', rlx + lungW * 0.5, lungCenterY - lungH * 0.18)
    ctx.fillText('Méd', rlx + lungW * 0.5, lungCenterY + lungH * 0.1)
    ctx.fillText('Inf', rlx + lungW * 0.5, lungCenterY + lungH * 0.36)

    // ── LEFT LUNG (2 lobes + cardiac notch — slightly narrower)
    const lW2 = lungW * 0.92  // left lung slightly smaller
    const llx = cx - bronchSpread * 0.55 // medial edge
    const llxL = llx - lW2               // lateral edge
    const notchY = lungCenterY + lungH * 0.12  // cardiac notch starts here
    const notchDepth = lW2 * 0.28               // how deep the notch goes

    ctx.beginPath()
    // apex (top)
    ctx.moveTo(llx - 2, lungTop + 8)
    // lateral border going down
    ctx.bezierCurveTo(
      llx - lW2 * 0.6, lungTop - 4,
      llxL - 4, lungTop + lungH * 0.25,
      llxL - 2, lungCenterY
    )
    // continue lateral down to base
    ctx.bezierCurveTo(
      llxL - 2, lungCenterY + lungH * 0.35,
      llxL + lW2 * 0.1, lungBase - 4,
      llx - lW2 * 0.5, lungBase
    )
    // base (flat bottom — same as right lung)
    ctx.bezierCurveTo(
      llx - lW2 * 0.15, lungBase + 2,
      llx + 2, lungBase - 5,
      llx + 2, lungBase - lungH * 0.12
    )
    // medial border going up — with cardiac notch indentation
    ctx.bezierCurveTo(
      llx + 2, notchY + lungH * 0.2,
      llx + 2, notchY + lungH * 0.05,
      llx + notchDepth, notchY
    )
    // cardiac notch curve (indentation toward medial)
    ctx.bezierCurveTo(
      llx + notchDepth * 0.6, notchY - lungH * 0.06,
      llx + 4, notchY - lungH * 0.1,
      llx + 2, notchY - lungH * 0.15
    )
    // continue medial border up to apex
    ctx.bezierCurveTo(
      llx, lungTop + lungH * 0.25,
      llx - 2, lungTop + 12,
      llx - 2, lungTop + 8
    )
    ctx.closePath()
    ctx.fillStyle = isLungHi ? 'rgba(45, 212, 191, 0.12)' : COL_LUNG_L
    ctx.fill()
    ctx.strokeStyle = lungStroke
    ctx.lineWidth = 1.5
    ctx.stroke()

    // fissure left (oblique)
    ctx.beginPath()
    ctx.moveTo(llx - 5, lungCenterY + lungH * 0.02)
    ctx.quadraticCurveTo(llx - lW2 * 0.5, lungCenterY + lungH * 0.1, llxL + 10, lungCenterY + lungH * 0.18)
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.14)'
    ctx.lineWidth = 1
    ctx.stroke()

    // cardiac notch heart symbol
    ctx.font = `${Math.max(12, 16 * S)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(244, 63, 94, 0.2)'
    ctx.fillText('♥', llx + notchDepth * 0.5, notchY + 5)

    // lobe labels left
    ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(45, 212, 191, 0.28)'
    ctx.fillText('Sup', llx - lW2 * 0.5, lungCenterY - lungH * 0.12)
    ctx.fillText('Inf', llx - lW2 * 0.5, lungCenterY + lungH * 0.32)

    regions.push({ part: 'lungs', x: llxL - 5, y: lungTop, w: (rrx + 5) - (llxL - 5), h: lungH + 5 })

    // ═══════════════════ DIAPHRAGM ═══════════════════
    const isDiaHi = hoveredPart === 'diaphragm' || selectedPart === 'diaphragm'
    const diaY = lungTop + lungH * (0.92 - expand * 0.5)
    const diaW = (lungW * 2 + bronchSpread) * 0.9

    ctx.beginPath()
    ctx.moveTo(cx - diaW, diaY + 15 * S)
    ctx.quadraticCurveTo(cx, diaY - 10 * S * (1 - expand * 3), cx + diaW, diaY + 15 * S)
    ctx.strokeStyle = isDiaHi ? 'rgba(244, 63, 94, 0.7)' : COL_DIAPHRAGM
    ctx.lineWidth = isDiaHi ? 4 : 3
    ctx.stroke()

    // diaphragm fill
    ctx.beginPath()
    ctx.moveTo(cx - diaW, diaY + 15 * S)
    ctx.quadraticCurveTo(cx, diaY - 10 * S * (1 - expand * 3), cx + diaW, diaY + 15 * S)
    ctx.lineTo(cx + diaW, diaY + 30 * S)
    ctx.quadraticCurveTo(cx, diaY + 10 * S, cx - diaW, diaY + 30 * S)
    ctx.closePath()
    ctx.fillStyle = isDiaHi ? 'rgba(244, 63, 94, 0.1)' : 'rgba(244, 63, 94, 0.04)'
    ctx.fill()

    // diaphragm arrows
    const arrowDir = isInhale ? 1 : -1
    if (isInhale || isExhale) {
      for (let da = 0; da < 3; da++) {
        const dax = cx + (da - 1) * diaW * 0.5
        const day = diaY + 8 * S
        ctx.beginPath()
        ctx.moveTo(dax, day)
        ctx.lineTo(dax, day + arrowDir * 10 * S)
        ctx.lineTo(dax - 4, day + arrowDir * 6 * S)
        ctx.moveTo(dax, day + arrowDir * 10 * S)
        ctx.lineTo(dax + 4, day + arrowDir * 6 * S)
        ctx.strokeStyle = `rgba(244, 63, 94, ${0.3 + Math.sin(st.t * 3) * 0.1})`
        ctx.lineWidth = 1.2
        ctx.stroke()
      }
    }

    regions.push({ part: 'diaphragm', x: cx - diaW, y: diaY - 15, w: diaW * 2, h: 50 * S })

    // ═══════════════════ AIRWAY STRUCTURES ═══════════════════

    const isHi = (part: AirwayPart) => hoveredPart === part || selectedPart === part
    const col = (part: AirwayPart) => isHi(part) ? COL_AIRWAY_HI : COL_AIRWAY
    const colF = (part: AirwayPart) => isHi(part) ? COL_AIRWAY_FILL_HI : COL_AIRWAY_FILL

    // ── NOSE (more anatomical)
    const nW = 34 * S
    const nX = cx - nW / 2
    ctx.beginPath()
    ctx.moveTo(nX + nW * 0.5, noseY)
    ctx.bezierCurveTo(nX - 8 * S, noseY + 5, nX - 12 * S, noseY + noseH * 0.6, nX, noseY + noseH)
    ctx.lineTo(nX + nW, noseY + noseH)
    ctx.bezierCurveTo(nX + nW + 12 * S, noseY + noseH * 0.6, nX + nW + 8 * S, noseY + 5, nX + nW * 0.5, noseY)
    ctx.closePath()
    ctx.fillStyle = colF('nose')
    ctx.fill()
    ctx.strokeStyle = col('nose')
    ctx.lineWidth = 1.8
    ctx.stroke()

    // nasal conchas (turbinates) - 3 shelves
    for (let c = 0; c < 3; c++) {
      const cy2 = noseY + 8 + c * (noseH - 14) / 3
      const cw = nW * (0.7 - c * 0.1)
      ctx.beginPath()
      ctx.moveTo(cx - cw * 0.4, cy2)
      ctx.quadraticCurveTo(cx, cy2 + 4 + Math.sin(st.t * 1.5 + c) * 1, cx + cw * 0.4, cy2)
      ctx.strokeStyle = isHi('nose') ? 'rgba(34, 211, 238, 0.4)' : 'rgba(34, 211, 238, 0.15)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    // nasal hairs at entrance
    for (let nh = 0; nh < 6; nh++) {
      const nhx = nX + 5 + nh * (nW - 10) / 5
      const sway = Math.sin(st.t * 2 + nh * 0.9) * 3
      ctx.beginPath()
      ctx.moveTo(nhx, noseY + noseH - 3)
      ctx.quadraticCurveTo(nhx + sway, noseY + noseH - 10, nhx + sway * 0.5, noseY + noseH - 14)
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.35)'
      ctx.lineWidth = 0.8
      ctx.stroke()
    }

    // mucus layer inside nose
    ctx.beginPath()
    for (let my = noseY + 5; my < noseY + noseH - 3; my += 3) {
      ctx.lineTo(nX + 3 + Math.sin(my * 0.15 + st.t * 1.5) * 2, my)
    }
    ctx.strokeStyle = COL_MUCUS
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.beginPath()
    for (let my = noseY + 5; my < noseY + noseH - 3; my += 3) {
      ctx.lineTo(nX + nW - 3 + Math.sin(my * 0.15 + st.t * 1.5 + 1) * 2, my)
    }
    ctx.strokeStyle = COL_MUCUS
    ctx.lineWidth = 2
    ctx.stroke()

    regions.push({ part: 'nose', x: nX - 14, y: noseY - 5, w: nW + 28, h: noseH + 10 })

    // ── PHARYNX (wider, tapered)
    const phW1 = 22 * S
    const phW2 = 18 * S
    ctx.beginPath()
    ctx.moveTo(cx - phW1 / 2, pharY)
    ctx.lineTo(cx - phW2 / 2, pharY + pharH)
    ctx.lineTo(cx + phW2 / 2, pharY + pharH)
    ctx.lineTo(cx + phW1 / 2, pharY)
    ctx.closePath()
    ctx.fillStyle = colF('pharynx')
    ctx.fill()
    ctx.strokeStyle = col('pharynx')
    ctx.lineWidth = 1.5
    ctx.stroke()

    // tonsillar tissue
    ctx.beginPath()
    ctx.arc(cx - phW1 / 2 - 4, pharY + pharH * 0.4, 4, 0, Math.PI * 2)
    ctx.arc(cx + phW1 / 2 + 4, pharY + pharH * 0.4, 4, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(244, 63, 94, 0.08)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.15)'
    ctx.lineWidth = 0.8
    ctx.stroke()

    regions.push({ part: 'pharynx', x: cx - phW1 / 2 - 8, y: pharY - 3, w: phW1 + 16, h: pharH + 6 })

    // ── LARYNX (thyroid cartilage shape + epiglottis)
    const lW = 28 * S
    ctx.beginPath()
    ctx.moveTo(cx, larY)
    ctx.lineTo(cx + lW / 2, larY + larH * 0.2)
    ctx.lineTo(cx + lW / 2 - 2, larY + larH)
    ctx.lineTo(cx - lW / 2 + 2, larY + larH)
    ctx.lineTo(cx - lW / 2, larY + larH * 0.2)
    ctx.closePath()
    ctx.fillStyle = colF('larynx')
    ctx.fill()
    ctx.strokeStyle = col('larynx')
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Adam's apple notch
    ctx.beginPath()
    ctx.moveTo(cx - 3, larY)
    ctx.lineTo(cx, larY + 4)
    ctx.lineTo(cx + 3, larY)
    ctx.strokeStyle = col('larynx')
    ctx.lineWidth = 1
    ctx.stroke()

    // epiglottis
    ctx.beginPath()
    ctx.moveTo(cx - 4, larY + 2)
    ctx.quadraticCurveTo(cx - 8 * S, larY - 8 * S, cx, larY - 12 * S)
    ctx.quadraticCurveTo(cx + 8 * S, larY - 8 * S, cx + 4, larY + 2)
    ctx.fillStyle = 'rgba(250, 204, 21, 0.08)'
    ctx.fill()
    ctx.strokeStyle = COL_EPIGLOTTIS
    ctx.lineWidth = 1.2
    ctx.stroke()

    // vocal cords
    const vcY = larY + larH * 0.55
    const vcGap = 2.5 + Math.sin(st.t * 2.5) * 2
    ctx.beginPath()
    ctx.moveTo(cx - lW / 2 + 5, vcY)
    ctx.lineTo(cx - vcGap, vcY)
    ctx.moveTo(cx + vcGap, vcY)
    ctx.lineTo(cx + lW / 2 - 5, vcY)
    ctx.strokeStyle = isHi('larynx') ? 'rgba(250, 204, 21, 0.7)' : 'rgba(250, 204, 21, 0.35)'
    ctx.lineWidth = 2
    ctx.stroke()
    // cord thickness
    ctx.beginPath()
    ctx.ellipse(cx - vcGap - 3, vcY, 3, 1.5, 0, 0, Math.PI * 2)
    ctx.ellipse(cx + vcGap + 3, vcY, 3, 1.5, 0, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(250, 204, 21, 0.15)'
    ctx.fill()

    regions.push({ part: 'larynx', x: cx - lW / 2 - 5, y: larY - 14 * S, w: lW + 10, h: larH + 16 * S })

    // ── TRACHEA (detailed C-rings)
    const tW = 18 * S
    ctx.beginPath()
    ctx.roundRect(cx - tW / 2, traY, tW, traH, 3)
    ctx.fillStyle = colF('trachea')
    ctx.fill()
    ctx.strokeStyle = col('trachea')
    ctx.lineWidth = 1.5
    ctx.stroke()

    // C-shaped cartilage rings
    const ringCount = 10
    for (let r = 0; r < ringCount; r++) {
      const ry = traY + 4 + r * (traH - 8) / (ringCount - 1)
      // C-ring (open posteriorly)
      ctx.beginPath()
      ctx.arc(cx, ry, tW * 0.48, -0.6, Math.PI + 0.6)
      ctx.strokeStyle = isHi('trachea') ? 'rgba(167, 139, 250, 0.4)' : COL_CARTILAGE
      ctx.lineWidth = 2.5
      ctx.stroke()
      // ring fill
      ctx.beginPath()
      ctx.arc(cx, ry, tW * 0.48, -0.6, Math.PI + 0.6)
      ctx.strokeStyle = isHi('trachea') ? 'rgba(167, 139, 250, 0.15)' : 'rgba(167, 139, 250, 0.06)'
      ctx.lineWidth = 4
      ctx.stroke()
    }

    // cilia on inner walls
    for (let ci = 0; ci < 12; ci++) {
      const ciy = traY + 3 + ci * (traH - 6) / 11
      const phase = st.t * 5 + ci * 0.6
      const sway = Math.sin(phase) * 3

      // left wall cilia
      ctx.beginPath()
      ctx.moveTo(cx - tW / 2 + 2, ciy)
      ctx.quadraticCurveTo(cx - tW / 2 + 2 + sway, ciy - 4, cx - tW / 2 + 2 + sway * 1.2, ciy - 6)
      ctx.strokeStyle = `rgba(45, 212, 191, ${0.25 + Math.sin(phase) * 0.1})`
      ctx.lineWidth = 0.7
      ctx.stroke()

      // right wall cilia
      ctx.beginPath()
      ctx.moveTo(cx + tW / 2 - 2, ciy)
      ctx.quadraticCurveTo(cx + tW / 2 - 2 - sway, ciy - 4, cx + tW / 2 - 2 - sway * 1.2, ciy - 6)
      ctx.strokeStyle = `rgba(45, 212, 191, ${0.25 + Math.sin(phase) * 0.1})`
      ctx.lineWidth = 0.7
      ctx.stroke()
    }

    // mucus escalator arrows (upward)
    const mucArrowY = ((st.t * 20) % 15)
    for (let ma = traY + 5; ma < traY + traH - 5; ma += 15) {
      const may = ma - mucArrowY
      if (may < traY || may > traY + traH) continue
      ctx.beginPath()
      ctx.moveTo(cx, may + 2)
      ctx.lineTo(cx, may - 2)
      ctx.lineTo(cx - 1.5, may)
      ctx.moveTo(cx, may - 2)
      ctx.lineTo(cx + 1.5, may)
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.12)'
      ctx.lineWidth = 0.8
      ctx.stroke()
    }

    regions.push({ part: 'trachea', x: cx - tW / 2 - 6, y: traY - 3, w: tW + 12, h: traH + 6 })

    // ── BRONCHI (anatomical bifurcation with curvature)
    // carina
    ctx.beginPath()
    ctx.arc(cx, bifY + 3, 3, 0, Math.PI)
    ctx.fillStyle = 'rgba(167, 139, 250, 0.2)'
    ctx.fill()

    // main bronchi (right is more vertical/wider)
    const drawMainBronchus = (side: number, spread: number, angle: number, bW2: number) => {
      const endX = cx + side * spread
      const endY = bifY + bronchLen

      // tube with width
      ctx.beginPath()
      ctx.moveTo(cx + side * 3, bifY)
      ctx.quadraticCurveTo(cx + side * spread * 0.35, bifY + bronchLen * 0.35, endX, endY)
      ctx.strokeStyle = isHi('bronchi') ? COL_AIRWAY_HI : COL_AIRWAY
      ctx.lineWidth = bW2
      ctx.stroke()

      // cartilage rings on bronchus
      for (let br = 0; br < 4; br++) {
        const bt = 0.15 + br * 0.22
        const bx = lerp(cx + side * 3, endX, bt)
        const by = lerp(bifY, endY, bt)
        ctx.beginPath()
        ctx.arc(bx, by, bW2 * 0.7, angle - 0.5, angle + Math.PI + 0.5)
        ctx.strokeStyle = isHi('bronchi') ? 'rgba(167, 139, 250, 0.25)' : 'rgba(167, 139, 250, 0.1)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      return { x: endX, y: endY }
    }

    const leftEnd = drawMainBronchus(-1, bronchSpread, Math.PI * 0.3, 3.5 * S)
    const rightEnd = drawMainBronchus(1, bronchSpread, -Math.PI * 0.3, 4 * S) // right wider

    // secondary/tertiary branches (recursive tree)
    const drawTree = (bx: number, by: number, angle: number, len: number, depth: number, maxD: number) => {
      if (depth > maxD) return
      const ex = bx + Math.cos(angle) * len
      const ey = by + Math.sin(angle) * len
      ctx.beginPath()
      ctx.moveTo(bx, by)
      ctx.lineTo(ex, ey)
      const alpha = isHi('bronchi') ? (0.55 - depth * 0.1) : (0.25 - depth * 0.04)
      ctx.strokeStyle = `rgba(34, 211, 238, ${Math.max(0.05, alpha)})`
      ctx.lineWidth = Math.max(0.4, (3.5 - depth * 0.7) * S)
      ctx.stroke()
      const spread = 0.45 - depth * 0.05
      drawTree(ex, ey, angle - spread, len * 0.62, depth + 1, maxD)
      drawTree(ex, ey, angle + spread, len * 0.62, depth + 1, maxD)
    }

    // left branches
    drawTree(leftEnd.x, leftEnd.y, Math.PI * 0.58, 24 * S, 0, 4)
    drawTree(leftEnd.x, leftEnd.y, Math.PI * 0.78, 20 * S, 0, 3)

    // right branches (more, 3 lobes)
    drawTree(rightEnd.x, rightEnd.y, Math.PI * 0.42, 24 * S, 0, 4)
    drawTree(rightEnd.x, rightEnd.y, Math.PI * 0.28, 22 * S, 0, 3)
    drawTree(rightEnd.x, rightEnd.y, Math.PI * 0.52, 18 * S, 0, 3)

    regions.push({ part: 'bronchi', x: leftEnd.x - 20, y: bifY - 5, w: rightEnd.x - leftEnd.x + 40, h: bronchLen + 30 })

    // ═══════════════════ ALVEOLI CLUSTERS ═══════════════════
    const isAlvHi = isHi('alveoli')
    const drawAlvCluster = (ax: number, ay: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const aa = (i / count) * Math.PI * 2
        const ar = 7 * S * (1 + expand * 2.5)
        const aox = ax + Math.cos(aa) * ar * 1.8
        const aoy = ay + Math.sin(aa) * ar * 1.8

        // alveolus
        ctx.beginPath()
        ctx.arc(aox, aoy, ar, 0, Math.PI * 2)
        ctx.fillStyle = isAlvHi ? 'rgba(250, 204, 21, 0.1)' : 'rgba(250, 204, 21, 0.03)'
        ctx.fill()
        ctx.strokeStyle = isAlvHi ? 'rgba(250, 204, 21, 0.6)' : 'rgba(250, 204, 21, 0.2)'
        ctx.lineWidth = 0.8
        ctx.stroke()

        // capillary wrap
        ctx.beginPath()
        ctx.arc(aox, aoy, ar * 1.15, aa - 0.4, aa + 1.2)
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.18)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // O₂/CO₂ exchange dots
        if (isAlvHi && i % 2 === 0) {
          const edx = aox + Math.cos(aa) * ar * 0.7
          const edy = aoy + Math.sin(aa) * ar * 0.7
          ctx.beginPath()
          ctx.arc(edx + Math.sin(st.t * 3 + i) * 2, edy, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = COL_O2
          ctx.fill()
        }
      }
      // center
      ctx.beginPath()
      ctx.arc(ax, ay, 5 * S * (1 + expand * 2.5), 0, Math.PI * 2)
      ctx.fillStyle = isAlvHi ? 'rgba(250, 204, 21, 0.12)' : 'rgba(250, 204, 21, 0.04)'
      ctx.fill()
      ctx.strokeStyle = isAlvHi ? 'rgba(250, 204, 21, 0.5)' : 'rgba(250, 204, 21, 0.15)'
      ctx.lineWidth = 0.8
      ctx.stroke()
    }

    // clusters in both lungs
    const alvPositions = [
      { x: rlx + lungW * 0.2, y: lungCenterY - lungH * 0.12, n: 6 },
      { x: rlx + lungW * 0.55, y: lungCenterY + lungH * 0.15, n: 6 },
      { x: rlx + lungW * 0.3, y: lungCenterY + lungH * 0.35, n: 5 },
      { x: llx - lW2 * 0.25, y: lungCenterY - lungH * 0.08, n: 6 },
      { x: llx - lW2 * 0.55, y: lungCenterY + lungH * 0.12, n: 6 },
      { x: llx - lW2 * 0.35, y: lungCenterY + lungH * 0.32, n: 5 },
    ]
    for (const ap of alvPositions) drawAlvCluster(ap.x, ap.y, ap.n)

    regions.push({ part: 'alveoli', x: rlx, y: lungCenterY - lungH * 0.25, w: lungW * 0.7, h: lungH * 0.65 })

    // ═══════════════════ FLOW PARTICLES ═══════════════════
    if (!st.particles) {
      st.particles = []
      for (let i = 0; i < 20; i++) {
        st.particles.push({
          phase: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          type: i < 14 ? 'o2' : 'co2',
          side: i % 3 === 0 ? 'left' : (i % 3 === 1 ? 'right' : 'center'),
          wobble: Math.random() * 10,
          size: 2 + Math.random() * 1.5,
        })
      }
    }

    // build path waypoints
    const centerPath = [
      { x: cx, y: noseY - 8 },
      { x: cx, y: noseY + noseH * 0.5 },
      { x: cx, y: pharY + pharH * 0.5 },
      { x: cx, y: larY + larH * 0.5 },
      { x: cx, y: traY + traH * 0.3 },
      { x: cx, y: traY + traH * 0.7 },
      { x: cx, y: bifY },
    ]

    const leftPath = [...centerPath, leftEnd, { x: llx - lW2 * 0.35, y: lungCenterY }]
    const rightPath = [...centerPath, rightEnd, { x: rlx + lungW * 0.3, y: lungCenterY }]

    for (const p of st.particles) {
      const path = p.side === 'left' ? leftPath : (p.side === 'right' ? rightPath : centerPath)
      const totalSeg = path.length - 1

      if (p.type === 'o2') {
        p.phase += p.speed * (isInhale ? 1.5 : 0.5)
        if (p.phase > 1) p.phase = 0

        const segIdx = Math.floor(p.phase * totalSeg)
        const segT = (p.phase * totalSeg) - segIdx
        const p1 = path[Math.min(segIdx, path.length - 1)]
        const p2 = path[Math.min(segIdx + 1, path.length - 1)]
        const px = lerp(p1.x, p2.x, segT) + Math.sin(st.t * 3 + p.wobble) * 3
        const py = lerp(p1.y, p2.y, segT)

        // glow
        const grad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3)
        grad.addColorStop(0, 'rgba(34, 211, 238, 0.25)')
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(px - p.size * 4, py - p.size * 4, p.size * 8, p.size * 8)

        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = COL_O2
        ctx.fill()
      } else {
        p.phase += p.speed * (isExhale ? 1.5 : 0.5)
        if (p.phase > 1) p.phase = 0

        const revPhase = 1 - p.phase
        const segIdx = Math.floor(revPhase * totalSeg)
        const segT = (revPhase * totalSeg) - segIdx
        const p1 = path[Math.min(segIdx, path.length - 1)]
        const p2 = path[Math.min(segIdx + 1, path.length - 1)]
        const px = lerp(p1.x, p2.x, segT) + Math.sin(st.t * 2 + p.wobble) * 3
        const py = lerp(p1.y, p2.y, segT)

        ctx.beginPath()
        ctx.arc(px, py, p.size * 0.8, 0, Math.PI * 2)
        ctx.fillStyle = COL_CO2
        ctx.fill()
      }
    }

    // ═══════════════════ LABELS & UI ═══════════════════
    const labelX = w * 0.73
    const fontSize = Math.max(8, 9.5 * S)

    // structure labels with connector lines
    const labels: { text: string; y: number; color: string; part: AirwayPart; anchorX?: number }[] = [
      { text: 'NARIZ', y: noseY + noseH * 0.5, color: COL_CONDUCT, part: 'nose' },
      { text: 'FARINGE', y: pharY + pharH * 0.5, color: COL_CONDUCT, part: 'pharynx' },
      { text: 'LARINGE', y: larY + larH * 0.3, color: COL_CONDUCT, part: 'larynx' },
      { text: 'TRAQUEIA', y: traY + traH * 0.4, color: COL_CONDUCT, part: 'trachea' },
      { text: 'BRÔNQUIOS', y: bifY + bronchLen * 0.4, color: COL_CONDUCT, part: 'bronchi' },
      { text: 'ALVÉOLOS', y: lungCenterY, color: COL_RESP, part: 'alveoli' },
      { text: 'DIAFRAGMA', y: diaY + 5, color: COL_DIAPHRAGM, part: 'diaphragm' },
    ]

    ctx.font = `600 ${fontSize}px ${FONT_MONO}`
    ctx.textAlign = 'left'

    for (const lbl of labels) {
      const isActive = isHi(lbl.part)
      const anchorX = lbl.anchorX ?? cx + 50 * S

      // connector
      ctx.beginPath()
      ctx.moveTo(anchorX, lbl.y)
      ctx.lineTo(labelX - 5, lbl.y)
      ctx.strokeStyle = isActive ? lbl.color : 'rgba(255,255,255,0.04)'
      ctx.lineWidth = 0.6
      ctx.setLineDash([2, 3])
      ctx.stroke()
      ctx.setLineDash([])

      // dot
      ctx.beginPath()
      ctx.arc(labelX - 8, lbl.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = isActive ? lbl.color : 'rgba(255,255,255,0.08)'
      ctx.fill()

      ctx.fillStyle = isActive ? lbl.color : COL_TEXT_DIM
      ctx.fillText(lbl.text, labelX, lbl.y + 4)
    }

    // zone indicators
    ctx.font = `700 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    const zoneX = w - 15
    ctx.textAlign = 'right'
    ctx.fillStyle = COL_CONDUCT
    ctx.fillText('ZONA CONDUTORA', zoneX, noseY - 2)
    ctx.beginPath()
    ctx.moveTo(zoneX, noseY + 2)
    ctx.lineTo(zoneX, bifY - 5)
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.12)'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = COL_RESP
    ctx.fillText('ZONA RESPIRATÓRIA', zoneX, bifY + bronchLen * 0.7)
    ctx.beginPath()
    ctx.moveTo(zoneX, bifY + bronchLen * 0.75)
    ctx.lineTo(zoneX, lungCenterY + lungH * 0.3)
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.12)'
    ctx.lineWidth = 2
    ctx.stroke()

    // breathing indicator
    ctx.font = `700 ${Math.max(11, 14 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'right'
    ctx.fillStyle = isInhale ? COL_O2 : (isExhale ? COL_CO2 : 'rgba(255,255,255,0.2)')
    ctx.fillText(isInhale ? '↓ INSPIRAÇÃO' : (isExhale ? '↑ EXPIRAÇÃO' : '· · ·'), w - 15, h - 40 * S)

    // volume bar
    const volBarW = 80 * S
    const volBarH = 6 * S
    const volBarX = w - 15 - volBarW
    const volBarY = h - 25 * S
    const volFill = (st.volumeMl - 2400) / 5000
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.fillRect(volBarX, volBarY, volBarW, volBarH)
    ctx.fillStyle = isInhale ? 'rgba(34, 211, 238, 0.4)' : 'rgba(244, 63, 94, 0.3)'
    ctx.fillRect(volBarX, volBarY, volBarW * Math.max(0.02, volFill), volBarH)

    ctx.font = `600 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'right'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText(`${st.volumeMl} mL`, volBarX - 5, volBarY + volBarH)

    // legend
    ctx.font = `500 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'right'
    ctx.fillStyle = COL_O2
    ctx.fillText('● O₂', w - 15, h - 55 * S)
    ctx.fillStyle = COL_CO2
    ctx.fillText('● CO₂', w - 50, h - 55 * S)

    // HUD
    ctx.font = `600 ${Math.max(9, 10 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('RESPIRATORY.SYSTEM', 12, h - 12)
    ctx.fillStyle = 'rgba(45, 212, 191, 0.45)'
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
            <div className="h-2 w-2 rounded-full" style={{
              background: info.zone.includes('Respiratória') ? COL_RESP
                : info.zone.includes('Motor') ? COL_DIAPHRAGM
                : info.zone.includes('Órgão') ? COL_LUNG_STROKE
                : COL_CONDUCT
            }} />
            <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider">{info.title}</span>
            <span className="text-[9px] text-white/40 ml-1">{info.zone}</span>
          </div>
          <p className="text-[10px] text-white/50 mb-1">{info.desc}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {info.details.map((d, i) => (
              <span key={i} className="text-[9px] text-white/35">▸ {d}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
