'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface RespiratoryControlSimProps { className?: string }
type ControlPart = 'cortex' | 'pneumotaxic' | 'dorsal' | 'ventral' | 'central_chemo' | 'peripheral_chemo' | 'muscles' | 'hering_breuer' | null

const PART_INFO: Record<string, { title: string; loc: string; desc: string; details: string[] }> = {
  cortex: {
    title: 'Córtex Cerebral', loc: 'Córtex motor/pré-motor',
    desc: 'Controle voluntário da respiração',
    details: ['Pode sobrepor o automático temporariamente', 'Fala, canto, mergulho', 'Limitado: não supera drive metabólico'],
  },
  pneumotaxic: {
    title: 'Centro Pneumotáxico', loc: 'Ponte (núcleo parabraquial)',
    desc: 'Controla frequência e amplitude',
    details: ['Sinal intenso → 30-40/min', 'Sinal débil → 3-5/min', 'Desliga a rampa inspiratória'],
  },
  dorsal: {
    title: 'Grupo Respiratório Dorsal (GRD)', loc: 'Bulbo (Núcleo do Trato Solitário)',
    desc: 'Responsável pela INSPIRAÇÃO',
    details: ['Sinal em rampa: ↑ por 2s', 'Pausa expiratória: 3s', 'Recebe aferências do vago/glossofaríngeo'],
  },
  ventral: {
    title: 'Grupo Respiratório Ventral (GRV)', loc: 'Bulbo (ventrolateral)',
    desc: 'Responsável pela EXPIRAÇÃO',
    details: ['Ativo na expiração forçada', 'Inativo na respiração tranquila', 'Contém neurônios insp. e exp.'],
  },
  central_chemo: {
    title: 'Quimiorreceptores Centrais', loc: 'Porção ventral do bulbo',
    desc: 'Detectam ↑H⁺ (acidose) no LCR',
    details: ['Principal regulador tônico', 'CO₂ cruza BHE → H₂CO₃ → H⁺', 'Responde em segundos'],
  },
  peripheral_chemo: {
    title: 'Quimiorreceptores Periféricos', loc: 'Arco aórtico + bifurcação carótida',
    desc: 'Detectam ↓O₂ (hipoxemia)',
    details: ['Corpos carotídeos (n. glossofaríngeo IX)', 'Corpos aórticos (n. vago X)', 'Ativam com PaO₂ < 60 mmHg'],
  },
  muscles: {
    title: 'Músculos Respiratórios', loc: 'Diafragma + Intercostais',
    desc: 'Efetores finais da ventilação',
    details: ['Diafragma: n. frênico (C3-C5)', 'Intercostais: nn. intercostais (T1-T12)', 'Acessórios: ECM, escalenos'],
  },
  hering_breuer: {
    title: 'Reflexo de Hering-Breuer', loc: 'Receptores de estiramento bronquial',
    desc: 'Protege pulmões contra distensão excessiva',
    details: ['Ativado com VC > 1,5L', 'Sinal via nervo vago', 'Desativa rampa inspiratória'],
  },
}

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.02)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.30)'
const COL_CORTEX = 'rgba(167, 139, 250, 0.7)'
const COL_PONTE = 'rgba(250, 204, 21, 0.7)'
const COL_BULBO = 'rgba(45, 212, 191, 0.7)'
const COL_CHEMO_C = 'rgba(244, 63, 94, 0.7)'
const COL_CHEMO_P = 'rgba(251, 146, 60, 0.7)'
const COL_MUSCLE = 'rgba(34, 211, 238, 0.6)'
const COL_SIGNAL = 'rgba(250, 204, 21, 0.6)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

/* ─────────────────────── component ─────────────────────── */

export function RespiratoryControlSim({ className }: RespiratoryControlSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hovered, setHovered] = useState<ControlPart>(null)
  const [selected, setSelected] = useState<ControlPart>(null)
  const stRef = useRef({ t: 0, last: 0, breathCycle: 0 })
  const regionsRef = useRef<{ part: ControlPart; x: number; y: number; w: number; h: number }[]>([])

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const s = stRef.current
    const S = Math.min(w / 720, h / 480)

    ctx.fillStyle = COL_BG; ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = COL_GRID; ctx.lineWidth = 0.5
    const gs = 26 * S
    for (let gx = 0; gx < w; gx += gs) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke() }
    for (let gy = 0; gy < h; gy += gs) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke() }

    s.breathCycle = (s.breathCycle + 0.005) % 1
    const isInsp = s.breathCycle < 0.4
    const rampT = isInsp ? s.breathCycle / 0.4 : 0

    const active = selected || hovered
    const isHi = (p: ControlPart) => active === p
    const regions: typeof regionsRef.current = []

    // layout
    const cx = w * 0.35
    const brainTop = 25 * S

    // ═══ BRAINSTEM STRUCTURE ═══

    // ── CORTEX (top, dome)
    const cortexY = brainTop
    const cortexW = 80 * S
    const cortexH = 40 * S
    ctx.beginPath()
    ctx.ellipse(cx, cortexY + cortexH * 0.4, cortexW, cortexH, 0, Math.PI, 0)
    ctx.fillStyle = isHi('cortex') ? 'rgba(167, 139, 250, 0.12)' : 'rgba(167, 139, 250, 0.04)'
    ctx.fill()
    ctx.strokeStyle = isHi('cortex') ? COL_CORTEX : 'rgba(167, 139, 250, 0.3)'
    ctx.lineWidth = 1.5; ctx.stroke()
    // sulci
    ctx.beginPath()
    ctx.arc(cx - 20 * S, cortexY + 8, cortexW * 0.3, Math.PI + 0.3, -0.3)
    ctx.arc(cx + 15 * S, cortexY + 12, cortexW * 0.25, Math.PI + 0.2, -0.2)
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.12)'; ctx.lineWidth = 1; ctx.stroke()

    ctx.font = `600 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = isHi('cortex') ? COL_CORTEX : 'rgba(167, 139, 250, 0.35)'
    ctx.fillText('CÓRTEX', cx, cortexY + cortexH * 0.25)
    ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
    ctx.fillText('(voluntário)', cx, cortexY + cortexH * 0.25 + 10)
    regions.push({ part: 'cortex', x: cx - cortexW, y: cortexY - 5, w: cortexW * 2, h: cortexH + 5 })

    // ── BRAINSTEM body
    const stemTop = cortexY + cortexH + 5
    const stemW = 35 * S
    const stemH = 180 * S

    // stem outline
    ctx.beginPath()
    ctx.moveTo(cx - stemW, stemTop)
    ctx.bezierCurveTo(cx - stemW * 1.1, stemTop + stemH * 0.3, cx - stemW * 0.8, stemTop + stemH * 0.8, cx - stemW * 0.6, stemTop + stemH)
    ctx.lineTo(cx + stemW * 0.6, stemTop + stemH)
    ctx.bezierCurveTo(cx + stemW * 0.8, stemTop + stemH * 0.8, cx + stemW * 1.1, stemTop + stemH * 0.3, cx + stemW, stemTop)
    ctx.closePath()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'; ctx.lineWidth = 1; ctx.stroke()

    // ── PONTE section
    const ponteTop = stemTop + 5
    const ponteH = stemH * 0.25
    const ponteBot = ponteTop + ponteH

    ctx.beginPath()
    ctx.roundRect(cx - stemW * 0.85, ponteTop, stemW * 1.7, ponteH, 6)
    ctx.fillStyle = isHi('pneumotaxic') ? 'rgba(250, 204, 21, 0.1)' : 'rgba(250, 204, 21, 0.03)'
    ctx.fill()
    ctx.strokeStyle = isHi('pneumotaxic') ? COL_PONTE : 'rgba(250, 204, 21, 0.15)'
    ctx.lineWidth = 1; ctx.stroke()

    ctx.font = `700 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = isHi('pneumotaxic') ? COL_PONTE : 'rgba(250, 204, 21, 0.4)'
    ctx.fillText('PONTE', cx, ponteTop + ponteH * 0.35)
    ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
    ctx.fillText('Centro Pneumotáxico', cx, ponteTop + ponteH * 0.35 + 10)
    regions.push({ part: 'pneumotaxic', x: cx - stemW, y: ponteTop, w: stemW * 2, h: ponteH })

    // ── BULBO section
    const bulboTop = ponteBot + 8
    const bulboH = stemH * 0.55
    const bulboBot = bulboTop + bulboH

    // bulbo background
    ctx.beginPath()
    ctx.roundRect(cx - stemW * 0.9, bulboTop, stemW * 1.8, bulboH, 6)
    ctx.fillStyle = 'rgba(45, 212, 191, 0.02)'
    ctx.fill()

    ctx.font = `700 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(45, 212, 191, 0.35)'
    ctx.fillText('BULBO', cx, bulboTop + 12)

    // GRD (dorsal) — upper half of bulbo
    const grdY = bulboTop + 22
    const grdH = bulboH * 0.35
    ctx.beginPath()
    ctx.roundRect(cx - stemW * 0.7, grdY, stemW * 1.4, grdH, 4)
    ctx.fillStyle = isHi('dorsal') ? 'rgba(45, 212, 191, 0.12)' : 'rgba(45, 212, 191, 0.04)'
    ctx.fill()
    ctx.strokeStyle = isHi('dorsal') ? COL_BULBO : 'rgba(45, 212, 191, 0.2)'
    ctx.lineWidth = 1; ctx.stroke()

    ctx.font = `600 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
    ctx.fillStyle = isHi('dorsal') ? COL_BULBO : 'rgba(45, 212, 191, 0.4)'
    ctx.fillText('GRD (Inspiração)', cx, grdY + grdH * 0.5 + 3)

    // inspiratory ramp signal inside GRD
    const rampW2 = stemW * 0.8
    ctx.beginPath()
    for (let rx = 0; rx <= 1; rx += 0.05) {
      const val = isInsp ? Math.min(rx, rampT) : 0
      const rpx = cx - rampW2 / 2 + rx * rampW2
      const rpy = grdY + grdH - 4 - val * (grdH - 10)
      rx === 0 ? ctx.moveTo(rpx, rpy) : ctx.lineTo(rpx, rpy)
    }
    ctx.strokeStyle = isInsp ? 'rgba(34, 211, 238, 0.6)' : 'rgba(34, 211, 238, 0.15)'
    ctx.lineWidth = 1.5; ctx.stroke()

    regions.push({ part: 'dorsal', x: cx - stemW * 0.7, y: grdY, w: stemW * 1.4, h: grdH })

    // GRV (ventral) — lower half of bulbo
    const grvY = grdY + grdH + 8
    const grvH = bulboH * 0.3
    ctx.beginPath()
    ctx.roundRect(cx - stemW * 0.7, grvY, stemW * 1.4, grvH, 4)
    ctx.fillStyle = isHi('ventral') ? 'rgba(45, 212, 191, 0.12)' : 'rgba(45, 212, 191, 0.03)'
    ctx.fill()
    ctx.strokeStyle = isHi('ventral') ? COL_BULBO : 'rgba(45, 212, 191, 0.15)'
    ctx.lineWidth = 1; ctx.stroke()

    ctx.font = `600 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
    ctx.fillStyle = isHi('ventral') ? COL_BULBO : 'rgba(45, 212, 191, 0.3)'
    ctx.fillText('GRV (Expiração)', cx, grvY + grvH * 0.5 + 3)
    regions.push({ part: 'ventral', x: cx - stemW * 0.7, y: grvY, w: stemW * 1.4, h: grvH })

    // ── CENTRAL CHEMORECEPTORS (ventral bulbo)
    const ccY = bulboBot - 8
    const ccX = cx - stemW * 0.3
    ctx.beginPath(); ctx.arc(ccX, ccY, 6 * S, 0, Math.PI * 2)
    ctx.fillStyle = isHi('central_chemo') ? 'rgba(244, 63, 94, 0.2)' : 'rgba(244, 63, 94, 0.06)'
    ctx.fill()
    ctx.strokeStyle = isHi('central_chemo') ? COL_CHEMO_C : 'rgba(244, 63, 94, 0.3)'
    ctx.lineWidth = 1.2; ctx.stroke()

    ctx.font = `500 ${Math.max(4, 5 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = isHi('central_chemo') ? COL_CHEMO_C : 'rgba(244, 63, 94, 0.35)'
    ctx.fillText('QRC', ccX, ccY + 14)
    regions.push({ part: 'central_chemo', x: ccX - 10 * S, y: ccY - 10 * S, w: 20 * S, h: 25 * S })

    // ── SPINAL CORD → MUSCLES
    const spineTop = stemTop + stemH + 5
    const spineBot = h - 30 * S
    ctx.beginPath()
    ctx.moveTo(cx - 5, spineTop); ctx.lineTo(cx - 5, spineBot)
    ctx.moveTo(cx + 5, spineTop); ctx.lineTo(cx + 5, spineBot)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'; ctx.lineWidth = 1; ctx.stroke()

    // muscles (at bottom)
    const muscY = spineBot - 10
    const muscW2 = 50 * S
    // diaphragm
    ctx.beginPath()
    ctx.moveTo(cx - muscW2, muscY + 5)
    ctx.quadraticCurveTo(cx, muscY - 8, cx + muscW2, muscY + 5)
    ctx.strokeStyle = isHi('muscles') ? COL_MUSCLE : 'rgba(34, 211, 238, 0.3)'
    ctx.lineWidth = 2.5; ctx.stroke()

    // intercostals (small lines on sides)
    for (let ic = 0; ic < 3; ic++) {
      const icy = muscY - 20 - ic * 8
      for (const side of [-1, 1]) {
        ctx.beginPath()
        ctx.moveTo(cx + side * 25 * S, icy)
        ctx.lineTo(cx + side * 40 * S, icy + 3)
        ctx.strokeStyle = isHi('muscles') ? COL_MUSCLE : 'rgba(34, 211, 238, 0.2)'
        ctx.lineWidth = 1.5; ctx.stroke()
      }
    }

    ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.fillStyle = isHi('muscles') ? COL_MUSCLE : 'rgba(34, 211, 238, 0.35)'
    ctx.fillText('MÚSCULOS', cx, muscY + 18)
    ctx.font = `500 ${Math.max(5, 5.5 * S)}px ${FONT_MONO}`
    ctx.fillText('Diafragma + Intercostais', cx, muscY + 28)
    regions.push({ part: 'muscles', x: cx - muscW2 - 5, y: muscY - 35, w: muscW2 * 2 + 10, h: 65 })

    // ═══ PERIPHERAL CHEMORECEPTORS (right side) ═══
    const pcX = cx + 130 * S
    const pcY = bulboTop + bulboH * 0.5

    // carotid body
    ctx.beginPath(); ctx.arc(pcX, pcY - 15 * S, 7 * S, 0, Math.PI * 2)
    ctx.fillStyle = isHi('peripheral_chemo') ? 'rgba(251, 146, 60, 0.2)' : 'rgba(251, 146, 60, 0.06)'
    ctx.fill()
    ctx.strokeStyle = isHi('peripheral_chemo') ? COL_CHEMO_P : 'rgba(251, 146, 60, 0.3)'
    ctx.lineWidth = 1.2; ctx.stroke()

    // aortic body
    ctx.beginPath(); ctx.arc(pcX, pcY + 15 * S, 6 * S, 0, Math.PI * 2)
    ctx.fillStyle = isHi('peripheral_chemo') ? 'rgba(251, 146, 60, 0.2)' : 'rgba(251, 146, 60, 0.06)'
    ctx.fill()
    ctx.strokeStyle = isHi('peripheral_chemo') ? COL_CHEMO_P : 'rgba(251, 146, 60, 0.3)'
    ctx.lineWidth = 1.2; ctx.stroke()

    ctx.font = `600 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = isHi('peripheral_chemo') ? COL_CHEMO_P : 'rgba(251, 146, 60, 0.35)'
    ctx.fillText('Corpo Carotídeo', pcX, pcY - 25 * S)
    ctx.fillText('Corpo Aórtico', pcX, pcY + 28 * S)

    ctx.font = `700 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.fillText('QR PERIFÉRICOS', pcX, pcY + 42 * S)
    ctx.font = `500 ${Math.max(5, 5.5 * S)}px ${FONT_MONO}`
    ctx.fillStyle = isHi('peripheral_chemo') ? 'rgba(251, 146, 60, 0.5)' : 'rgba(251, 146, 60, 0.25)'
    ctx.fillText('Detectam ↓O₂', pcX, pcY + 52 * S)

    // nerve connections from peripheral to bulbo
    ctx.beginPath()
    ctx.moveTo(pcX - 7 * S, pcY - 15 * S)
    ctx.quadraticCurveTo(cx + stemW + 20, pcY - 30 * S, cx + stemW * 0.7, grdY + grdH * 0.5)
    ctx.strokeStyle = isHi('peripheral_chemo') ? 'rgba(251, 146, 60, 0.4)' : 'rgba(251, 146, 60, 0.1)'
    ctx.lineWidth = 1; ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([])

    // nerve label
    ctx.font = `500 ${Math.max(4, 5 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(251, 146, 60, 0.25)'
    ctx.fillText('n. IX / n. X', pcX - 30 * S, pcY - 35 * S)

    regions.push({ part: 'peripheral_chemo', x: pcX - 15 * S, y: pcY - 30 * S, w: 30 * S, h: 85 * S })

    // ═══ HERING-BREUER (left side) ═══
    const hbX = cx - 120 * S
    const hbY = grvY + grvH * 0.5

    ctx.beginPath(); ctx.arc(hbX, hbY, 6 * S, 0, Math.PI * 2)
    ctx.fillStyle = isHi('hering_breuer') ? 'rgba(34, 211, 238, 0.15)' : 'rgba(34, 211, 238, 0.04)'
    ctx.fill()
    ctx.strokeStyle = isHi('hering_breuer') ? COL_MUSCLE : 'rgba(34, 211, 238, 0.25)'
    ctx.lineWidth = 1.2; ctx.stroke()

    ctx.font = `600 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = isHi('hering_breuer') ? COL_MUSCLE : 'rgba(34, 211, 238, 0.3)'
    ctx.fillText('Hering-Breuer', hbX, hbY - 12 * S)
    ctx.font = `500 ${Math.max(4, 5 * S)}px ${FONT_MONO}`
    ctx.fillText('Estiramento', hbX, hbY + 14 * S)
    ctx.fillText('bronquial', hbX, hbY + 22 * S)
    ctx.fillText('(VC > 1,5L)', hbX, hbY + 30 * S)

    // connection to bulbo
    ctx.beginPath()
    ctx.moveTo(hbX + 6 * S, hbY)
    ctx.quadraticCurveTo(cx - stemW - 15, hbY, cx - stemW * 0.7, grdY + grdH * 0.7)
    ctx.strokeStyle = isHi('hering_breuer') ? 'rgba(34, 211, 238, 0.35)' : 'rgba(34, 211, 238, 0.08)'
    ctx.lineWidth = 1; ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([])
    ctx.font = `500 ${Math.max(4, 5 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(34, 211, 238, 0.2)'
    ctx.fillText('n. vago', hbX + 25 * S, hbY - 5)

    regions.push({ part: 'hering_breuer', x: hbX - 12 * S, y: hbY - 15 * S, w: 24 * S, h: 50 * S })

    // ═══ SIGNAL FLOW PULSES ═══
    // descending signal from GRD to muscles
    const sigPhase = (s.t * 1.5) % 1
    if (isInsp) {
      const sigY2 = lerp(grdY + grdH, muscY - 30, sigPhase)
      ctx.beginPath(); ctx.arc(cx, sigY2, 3 * S, 0, Math.PI * 2)
      ctx.fillStyle = COL_SIGNAL; ctx.fill()
      const sg = ctx.createRadialGradient(cx, sigY2, 0, cx, sigY2, 8)
      sg.addColorStop(0, 'rgba(250, 204, 21, 0.25)'); sg.addColorStop(1, 'transparent')
      ctx.fillStyle = sg; ctx.fillRect(cx - 10, sigY2 - 10, 20, 20)
    }

    // pneumotaxic → GRD inhibitory signal
    const pnSig = ((s.t * 2) % 1)
    const pnSigY = lerp(ponteBot, grdY, pnSig)
    ctx.beginPath(); ctx.arc(cx + 5, pnSigY, 2, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(250, 204, 21, 0.35)'; ctx.fill()

    // ═══ INSPIRATORY RAMP GRAPH (bottom right) ═══
    const grX = w * 0.62, grY = h - 110 * S, grW = w * 0.34, grH = 80 * S

    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.5
    ctx.strokeRect(grX, grY, grW, grH)

    // ramp waveform
    ctx.beginPath()
    const cyclesVis = 3
    for (let px = 0; px <= grW; px += 1) {
      const t2 = (px / grW) * cyclesVis
      const phase2 = t2 % 1
      let val = 0
      if (phase2 < 0.4) val = phase2 / 0.4 // ramp up 2s
      else val = 0 // pause 3s

      const py = grY + grH - 5 - val * (grH - 10)
      px === 0 ? ctx.moveTo(grX + px, py) : ctx.lineTo(grX + px, py)
    }
    ctx.strokeStyle = COL_BULBO; ctx.lineWidth = 1.5; ctx.stroke()

    // current position
    const curX = grX + (s.breathCycle * grW / cyclesVis) % grW
    ctx.beginPath(); ctx.moveTo(curX, grY); ctx.lineTo(curX, grY + grH)
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.stroke()

    // labels
    ctx.font = `600 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = COL_BULBO
    ctx.fillText('Sinal em Rampa Inspiratória', grX + grW / 2, grY - 6)
    ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('2s ↑ rampa', grX + grW * 0.15, grY + grH + 12)
    ctx.fillText('3s pausa', grX + grW * 0.55, grY + grH + 12)

    // ═══ CHEMORECEPTOR INFO (top right) ═══
    const ciX = w * 0.62, ciY = 25

    ctx.font = `700 ${Math.max(8, 9 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_CHEMO_C
    ctx.fillText('QR Centrais (Bulbo)', ciX, ciY)
    ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(244, 63, 94, 0.4)'
    ctx.fillText('Estímulo: ↑H⁺ (CO₂→H₂CO₃→H⁺)', ciX, ciY + 12)

    ctx.font = `700 ${Math.max(8, 9 * S)}px ${FONT_MONO}`
    ctx.fillStyle = COL_CHEMO_P
    ctx.fillText('QR Periféricos (Carótida/Aorta)', ciX, ciY + 32)
    ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
    ctx.fillStyle = 'rgba(251, 146, 60, 0.4)'
    ctx.fillText('Estímulo: ↓PaO₂ (< 60 mmHg)', ciX, ciY + 44)

    // breathing status
    ctx.font = `700 ${Math.max(9, 11 * S)}px ${FONT_MONO}`
    ctx.fillStyle = isInsp ? 'rgba(34, 211, 238, 0.6)' : 'rgba(244, 63, 94, 0.4)'
    ctx.fillText(isInsp ? '↓ INSPIRAÇÃO' : '· EXPIRAÇÃO', ciX, ciY + 68)

    // HUD
    ctx.font = `600 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM; ctx.fillText('RESPIRATORY.CONTROL', 12, h - 8)
    ctx.fillStyle = 'rgba(45, 212, 191, 0.4)'; ctx.fillText('▸ INTERATIVO', 12, h - 20)

    regionsRef.current = regions
  }, [hovered, selected])

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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current; if (!c) return
    const r = c.getBoundingClientRect()
    const mx = e.clientX - r.left, my = e.clientY - r.top
    let found: ControlPart = null
    for (let i = regionsRef.current.length - 1; i >= 0; i--) {
      const rr = regionsRef.current[i]
      if (mx >= rr.x && mx <= rr.x + rr.w && my >= rr.y && my <= rr.y + rr.h) { found = rr.part; break }
    }
    setHovered(found)
    c.style.cursor = found ? 'pointer' : 'default'
  }, [])

  const handleClick = useCallback(() => {
    setSelected(prev => prev === hovered ? null : hovered)
  }, [hovered])

  const activePart = selected || hovered
  const info = activePart ? PART_INFO[activePart] : null

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas ref={canvasRef} className="w-full rounded-2xl"
        style={{ aspectRatio: '16/9', background: COL_BG }}
        onMouseMove={handleMouseMove} onClick={handleClick}
        onMouseLeave={() => setHovered(null)} />
      {info && (
        <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md px-4 py-2.5" style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider">{info.title}</span>
            <span className="text-[9px] text-white/40 ml-1">{info.loc}</span>
          </div>
          <p className="text-[10px] text-white/50 mb-1">{info.desc}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {info.details.map((d, i) => <span key={i} className="text-[9px] text-white/35">▸ {d}</span>)}
          </div>
        </div>
      )}
    </div>
  )
}
