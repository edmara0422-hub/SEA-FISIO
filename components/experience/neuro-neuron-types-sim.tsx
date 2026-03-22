'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface NeuroNeuronTypesSimProps {
  className?: string
}

type NeuronType = 'multipolar' | 'pseudounipolar' | 'bipolar' | 'anaxonic'

interface NeuronDef {
  type: NeuronType
  label: string
  subtitle: string
  color: string
  colorGlow: string
  desc: string
  examples: string[]
  features: string[]
}

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.03)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.38)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

const NEURON_DEFS: NeuronDef[] = [
  {
    type: 'multipolar',
    label: 'Multipolar',
    subtitle: 'Tipo mais comum no SNC',
    color: 'rgba(45, 212, 191, 0.85)',
    colorGlow: 'rgba(45, 212, 191, 0.2)',
    desc: 'Vários dendritos + 1 axônio longo',
    examples: ['Neurônios motores', 'Interneurônios corticais', 'Células piramidais'],
    features: [
      'Múltiplos dendritos ramificados',
      '1 axônio longo com colaterais',
      'Tipo predominante no encéfalo e medula',
      'Integração de muitos sinais simultâneos',
    ],
  },
  {
    type: 'pseudounipolar',
    label: 'Pseudounipolar',
    subtitle: 'Neurônio sensorial típico',
    color: 'rgba(250, 204, 21, 0.85)',
    colorGlow: 'rgba(250, 204, 21, 0.2)',
    desc: 'Corpo celular lateral, processo em T',
    examples: ['Gânglios da raiz dorsal', 'Nervos sensoriais periféricos'],
    features: [
      'Corpo celular lateral ao processo',
      'Processo único que se divide em T',
      'Ramo periférico → receptor sensorial',
      'Ramo central → medula espinhal / SNC',
    ],
  },
  {
    type: 'bipolar',
    label: 'Bipolar',
    subtitle: 'Retina e epitélio olfatório',
    color: 'rgba(34, 211, 238, 0.85)',
    colorGlow: 'rgba(34, 211, 238, 0.2)',
    desc: '1 axônio + 1 dendrito (polaridade clara)',
    examples: ['Células bipolares da retina', 'Epitélio olfatório', 'Gânglio vestibulococlear'],
    features: [
      'Apenas 1 dendrito + 1 axônio',
      'Polaridade clara e direcional',
      'Processamento sensorial especializado',
      'Transferência direta de sinal',
    ],
  },
  {
    type: 'anaxonic',
    label: 'Anaxônico',
    subtitle: 'Células amácrinas (retina)',
    color: 'rgba(244, 63, 94, 0.85)',
    colorGlow: 'rgba(244, 63, 94, 0.2)',
    desc: 'Sem axônio identificável, dendritos difusos',
    examples: ['Células amácrinas da retina', 'Alguns interneurônios do SNC'],
    features: [
      'Sem axônio identificável',
      'Inúmeros dendritos ramificados',
      'Comunicação local / modulatória',
      'Sinalização sem potencial de ação clássico',
    ],
  },
]

/* ─────────────────────── helpers ─────────────────────── */

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/* ─────────────────────── component ─────────────────────── */

export function NeuroNeuronTypesSim({ className }: NeuroNeuronTypesSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedType, setSelectedType] = useState<NeuronType | null>(null)
  const [hoveredType, setHoveredType] = useState<NeuronType | null>(null)
  const stateRef = useRef({ t: 0, lastTimestamp: 0 })
  const cellsRef = useRef<{ type: NeuronType; x: number; y: number; radius: number }[]>([])

  /* ── draw multipolar ── */
  const drawMultipolar = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, r: number, t: number, glow: boolean) => {
    const col = glow ? 'rgba(45, 212, 191, 0.9)' : 'rgba(45, 212, 191, 0.55)'
    const colFill = glow ? 'rgba(45, 212, 191, 0.25)' : 'rgba(45, 212, 191, 0.1)'
    const somaR = r * 0.32

    // dendrites (multiple, branching)
    const dendAngles = [-2.5, -2.9, -3.3, -2.1, -3.7]
    for (const a of dendAngles) {
      const len1 = r * (1.1 + Math.sin(t * 0.6 + a) * 0.05)
      const ex = x + Math.cos(a) * len1
      const ey = y + Math.sin(a) * len1

      // main branch
      ctx.beginPath()
      ctx.moveTo(x + Math.cos(a) * somaR, y + Math.sin(a) * somaR)
      ctx.lineTo(ex, ey)
      ctx.strokeStyle = col
      ctx.lineWidth = glow ? 2 : 1.5
      ctx.stroke()

      // sub-branches
      for (let b = 0; b < 2; b++) {
        const ba = a + (b === 0 ? 0.4 : -0.4) + Math.sin(t * 0.4 + b) * 0.03
        const bl = len1 * 0.5
        const bx = ex + Math.cos(ba) * bl
        const by = ey + Math.sin(ba) * bl
        ctx.beginPath()
        ctx.moveTo(ex, ey)
        ctx.lineTo(bx, by)
        ctx.strokeStyle = col
        ctx.lineWidth = 1
        ctx.stroke()

        // tiny tips
        for (let tt = 0; tt < 2; tt++) {
          const ta = ba + (tt === 0 ? 0.5 : -0.5)
          const tl = bl * 0.45
          ctx.beginPath()
          ctx.moveTo(bx, by)
          ctx.lineTo(bx + Math.cos(ta) * tl, by + Math.sin(ta) * tl)
          ctx.strokeStyle = col.replace('0.55', '0.3').replace('0.9', '0.5')
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }

      // spines on main branch
      for (let s = 0; s < 3; s++) {
        const st2 = 0.3 + s * 0.25
        const sx = lerp(x + Math.cos(a) * somaR, ex, st2)
        const sy = lerp(y + Math.sin(a) * somaR, ey, st2)
        const sa = a + (s % 2 === 0 ? 0.9 : -0.9)
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(sx + Math.cos(sa) * 4, sy + Math.sin(sa) * 4)
        ctx.strokeStyle = col.replace('0.55', '0.25').replace('0.9', '0.4')
        ctx.lineWidth = 0.7
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(sx + Math.cos(sa) * 4, sy + Math.sin(sa) * 4, 1, 0, Math.PI * 2)
        ctx.fillStyle = col.replace('0.55', '0.3').replace('0.9', '0.5')
        ctx.fill()
      }
    }

    // axon (one, long, going right)
    const axonLen = r * 1.8
    const axonEndX = x + axonLen
    ctx.beginPath()
    ctx.moveTo(x + somaR, y)
    ctx.lineTo(axonEndX, y)
    ctx.strokeStyle = glow ? 'rgba(250, 204, 21, 0.7)' : 'rgba(250, 204, 21, 0.4)'
    ctx.lineWidth = glow ? 2.5 : 2
    ctx.stroke()

    // myelin segments
    const sheathCount = 3
    const sheathW = (axonLen - somaR) / (sheathCount * 2)
    for (let i = 0; i < sheathCount; i++) {
      const sx = x + somaR + 8 + i * sheathW * 2
      ctx.beginPath()
      ctx.roundRect(sx, y - 5, sheathW, 10, 4)
      ctx.fillStyle = glow ? 'rgba(45, 212, 191, 0.2)' : 'rgba(45, 212, 191, 0.08)'
      ctx.fill()
      ctx.strokeStyle = glow ? 'rgba(45, 212, 191, 0.4)' : 'rgba(45, 212, 191, 0.2)'
      ctx.lineWidth = 0.8
      ctx.stroke()
    }

    // axon hillock triangle
    ctx.beginPath()
    ctx.moveTo(x + somaR, y)
    ctx.lineTo(x + somaR + 8, y - 3)
    ctx.lineTo(x + somaR + 8, y + 3)
    ctx.closePath()
    ctx.fillStyle = glow ? 'rgba(250, 204, 21, 0.6)' : 'rgba(250, 204, 21, 0.3)'
    ctx.fill()

    // terminal boutons
    const termAngles = [-0.3, 0, 0.3]
    for (const ta of termAngles) {
      const tx = axonEndX + Math.cos(ta) * 10
      const ty = y + Math.sin(ta) * 12
      ctx.beginPath()
      ctx.moveTo(axonEndX, y)
      ctx.lineTo(tx, ty)
      ctx.strokeStyle = glow ? 'rgba(250, 204, 21, 0.5)' : 'rgba(250, 204, 21, 0.25)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(tx + Math.cos(ta) * 4, ty + Math.sin(ta) * 4, 3, 0, Math.PI * 2)
      ctx.fillStyle = glow ? 'rgba(244, 63, 94, 0.3)' : 'rgba(244, 63, 94, 0.15)'
      ctx.fill()
      ctx.strokeStyle = glow ? 'rgba(244, 63, 94, 0.7)' : 'rgba(244, 63, 94, 0.4)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // signal pulse
    const sigPhase = (t * 0.8) % (Math.PI * 2)
    const sigX = x + somaR + ((Math.sin(sigPhase) + 1) / 2) * (axonLen - somaR)
    if (sigPhase > 0 && sigPhase < Math.PI) {
      const grad = ctx.createRadialGradient(sigX, y, 0, sigX, y, 12)
      grad.addColorStop(0, 'rgba(250, 204, 21, 0.4)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(sigX - 15, y - 15, 30, 30)
      ctx.beginPath()
      ctx.arc(sigX, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(250, 204, 21, 0.9)'
      ctx.fill()
    }

    // soma
    ctx.beginPath()
    ctx.arc(x, y, somaR, 0, Math.PI * 2)
    ctx.fillStyle = colFill
    ctx.fill()
    ctx.strokeStyle = col
    ctx.lineWidth = glow ? 2 : 1.5
    ctx.stroke()

    // nucleus
    ctx.beginPath()
    ctx.arc(x - 2, y, somaR * 0.4, 0, Math.PI * 2)
    ctx.fillStyle = col.replace('0.55', '0.25').replace('0.9', '0.35')
    ctx.fill()
  }, [])

  /* ── draw pseudounipolar ── */
  const drawPseudounipolar = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, r: number, t: number, glow: boolean) => {
    const col = glow ? 'rgba(250, 204, 21, 0.9)' : 'rgba(250, 204, 21, 0.55)'
    const colFill = glow ? 'rgba(250, 204, 21, 0.25)' : 'rgba(250, 204, 21, 0.1)'
    const somaR = r * 0.25

    // soma offset above the main process
    const somaY = y - r * 0.55

    // stem from soma down to T-junction
    const juncY = y + 2
    ctx.beginPath()
    ctx.moveTo(x, somaY + somaR)
    ctx.lineTo(x, juncY)
    ctx.strokeStyle = col
    ctx.lineWidth = glow ? 2.5 : 2
    ctx.stroke()

    // horizontal process (T shape)
    const leftX = x - r * 1.5
    const rightX = x + r * 1.5

    ctx.beginPath()
    ctx.moveTo(leftX, juncY)
    ctx.lineTo(rightX, juncY)
    ctx.strokeStyle = col
    ctx.lineWidth = glow ? 2.5 : 2
    ctx.stroke()

    // T-junction dot
    ctx.beginPath()
    ctx.arc(x, juncY, 3, 0, Math.PI * 2)
    ctx.fillStyle = col
    ctx.fill()

    // left side = peripheral (receptor end)
    // peripheral branching
    const periAngles = [-2.8, -3.14, -3.5]
    for (const a of periAngles) {
      const len = r * 0.6
      const ex = leftX + Math.cos(a) * len
      const ey = juncY + Math.sin(a) * len
      ctx.beginPath()
      ctx.moveTo(leftX, juncY)
      ctx.lineTo(ex, ey)
      ctx.strokeStyle = col.replace('0.55', '0.35').replace('0.9', '0.6')
      ctx.lineWidth = 1
      ctx.stroke()

      // receptor ending
      ctx.beginPath()
      ctx.arc(ex, ey, 3, 0, Math.PI * 2)
      ctx.fillStyle = glow ? 'rgba(244, 63, 94, 0.3)' : 'rgba(244, 63, 94, 0.15)'
      ctx.fill()
      ctx.strokeStyle = glow ? 'rgba(244, 63, 94, 0.6)' : 'rgba(244, 63, 94, 0.35)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // right side = central (SNC end)
    // terminal in SNC
    const termAngles2 = [-0.3, 0, 0.3]
    for (const a of termAngles2) {
      const tx = rightX + Math.cos(a) * 12
      const ty = juncY + Math.sin(a) * 10
      ctx.beginPath()
      ctx.moveTo(rightX, juncY)
      ctx.lineTo(tx, ty)
      ctx.strokeStyle = col.replace('0.55', '0.35').replace('0.9', '0.6')
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(tx + Math.cos(a) * 3, ty + Math.sin(a) * 3, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = glow ? 'rgba(45, 212, 191, 0.3)' : 'rgba(45, 212, 191, 0.15)'
      ctx.fill()
      ctx.strokeStyle = glow ? 'rgba(45, 212, 191, 0.6)' : 'rgba(45, 212, 191, 0.3)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // labels for sides
    const fontSize = Math.max(6, 7)
    ctx.font = `500 ${fontSize}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = glow ? 'rgba(244, 63, 94, 0.7)' : 'rgba(244, 63, 94, 0.35)'
    ctx.fillText('Periferia', leftX, juncY + r * 0.65)
    ctx.fillStyle = glow ? 'rgba(45, 212, 191, 0.7)' : 'rgba(45, 212, 191, 0.35)'
    ctx.fillText('SNC', rightX, juncY + r * 0.65)

    // signal along process
    const sigPhase = (t * 0.6) % 1
    const sigX = lerp(leftX, rightX, sigPhase)
    const grad = ctx.createRadialGradient(sigX, juncY, 0, sigX, juncY, 10)
    grad.addColorStop(0, 'rgba(250, 204, 21, 0.35)')
    grad.addColorStop(1, 'transparent')
    ctx.fillStyle = grad
    ctx.fillRect(sigX - 12, juncY - 12, 24, 24)
    ctx.beginPath()
    ctx.arc(sigX, juncY, 2.5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(250, 204, 21, 0.85)'
    ctx.fill()

    // soma
    ctx.beginPath()
    ctx.arc(x, somaY, somaR, 0, Math.PI * 2)
    ctx.fillStyle = colFill
    ctx.fill()
    ctx.strokeStyle = col
    ctx.lineWidth = glow ? 2 : 1.5
    ctx.stroke()

    // nucleus
    ctx.beginPath()
    ctx.arc(x, somaY, somaR * 0.4, 0, Math.PI * 2)
    ctx.fillStyle = col.replace('0.55', '0.25').replace('0.9', '0.35')
    ctx.fill()
  }, [])

  /* ── draw bipolar ── */
  const drawBipolar = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, r: number, t: number, glow: boolean) => {
    const col = glow ? 'rgba(34, 211, 238, 0.9)' : 'rgba(34, 211, 238, 0.55)'
    const colFill = glow ? 'rgba(34, 211, 238, 0.25)' : 'rgba(34, 211, 238, 0.1)'
    const somaR = r * 0.26

    // dendrite (left side - single, with small branches)
    const dendLen = r * 1.4
    const dendEndX = x - dendLen
    ctx.beginPath()
    ctx.moveTo(x - somaR, y)
    ctx.lineTo(dendEndX, y)
    ctx.strokeStyle = col
    ctx.lineWidth = glow ? 2 : 1.5
    ctx.stroke()

    // dendrite end branches
    const dendBranches = [-0.5, -0.2, 0.2, 0.5]
    for (const a of dendBranches) {
      const bLen = r * 0.35
      const bx = dendEndX + Math.cos(Math.PI + a) * bLen
      const by = y + Math.sin(Math.PI + a) * bLen
      ctx.beginPath()
      ctx.moveTo(dendEndX, y)
      ctx.lineTo(bx, by)
      ctx.strokeStyle = col.replace('0.55', '0.35').replace('0.9', '0.6')
      ctx.lineWidth = 1
      ctx.stroke()
      // tip
      ctx.beginPath()
      ctx.arc(bx, by, 1.5, 0, Math.PI * 2)
      ctx.fillStyle = col.replace('0.55', '0.3').replace('0.9', '0.5')
      ctx.fill()
    }

    // axon (right side)
    const axonLen = r * 1.4
    const axonEndX = x + axonLen
    ctx.beginPath()
    ctx.moveTo(x + somaR, y)
    ctx.lineTo(axonEndX, y)
    ctx.strokeStyle = glow ? 'rgba(250, 204, 21, 0.6)' : 'rgba(250, 204, 21, 0.35)'
    ctx.lineWidth = glow ? 2 : 1.5
    ctx.stroke()

    // axon terminal
    const termAngles3 = [-0.3, 0, 0.3]
    for (const a of termAngles3) {
      const tx = axonEndX + Math.cos(a) * 10
      const ty = y + Math.sin(a) * 10
      ctx.beginPath()
      ctx.moveTo(axonEndX, y)
      ctx.lineTo(tx, ty)
      ctx.strokeStyle = glow ? 'rgba(244, 63, 94, 0.5)' : 'rgba(244, 63, 94, 0.25)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(tx + Math.cos(a) * 3, ty + Math.sin(a) * 3, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = glow ? 'rgba(244, 63, 94, 0.3)' : 'rgba(244, 63, 94, 0.12)'
      ctx.fill()
      ctx.strokeStyle = glow ? 'rgba(244, 63, 94, 0.6)' : 'rgba(244, 63, 94, 0.35)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // signal
    const sigPhase = (t * 0.7) % 1
    const sigX = lerp(dendEndX, axonEndX, sigPhase)
    const grad = ctx.createRadialGradient(sigX, y, 0, sigX, y, 10)
    grad.addColorStop(0, 'rgba(34, 211, 238, 0.4)')
    grad.addColorStop(1, 'transparent')
    ctx.fillStyle = grad
    ctx.fillRect(sigX - 12, y - 12, 24, 24)
    ctx.beginPath()
    ctx.arc(sigX, y, 2.5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(34, 211, 238, 0.9)'
    ctx.fill()

    // labels
    const fontSize = Math.max(6, 7)
    ctx.font = `500 ${fontSize}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = col.replace('0.55', '0.35').replace('0.9', '0.5')
    ctx.fillText('dendrito', dendEndX, y + r * 0.55)
    ctx.fillStyle = glow ? 'rgba(250, 204, 21, 0.5)' : 'rgba(250, 204, 21, 0.3)'
    ctx.fillText('axônio', axonEndX, y + r * 0.55)

    // soma (elongated)
    ctx.beginPath()
    ctx.ellipse(x, y, somaR * 1.3, somaR, 0, 0, Math.PI * 2)
    ctx.fillStyle = colFill
    ctx.fill()
    ctx.strokeStyle = col
    ctx.lineWidth = glow ? 2 : 1.5
    ctx.stroke()

    // nucleus
    ctx.beginPath()
    ctx.arc(x, y, somaR * 0.35, 0, Math.PI * 2)
    ctx.fillStyle = col.replace('0.55', '0.3').replace('0.9', '0.4')
    ctx.fill()
  }, [])

  /* ── draw anaxonic ── */
  const drawAnaxonic = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, r: number, t: number, glow: boolean) => {
    const col = glow ? 'rgba(244, 63, 94, 0.9)' : 'rgba(244, 63, 94, 0.55)'
    const colFill = glow ? 'rgba(244, 63, 94, 0.25)' : 'rgba(244, 63, 94, 0.1)'
    const somaR = r * 0.28

    // many dendrites radiating in all directions (no identifiable axon)
    const armCount = 10
    for (let i = 0; i < armCount; i++) {
      const a = (i / armCount) * Math.PI * 2 + Math.sin(t * 0.3 + i) * 0.05
      const len = r * (0.9 + Math.sin(t * 0.5 + i * 2) * 0.08)
      const ex = x + Math.cos(a) * len
      const ey = y + Math.sin(a) * len

      // wavy dendrite
      const mx = x + Math.cos(a + 0.15) * len * 0.5
      const my = y + Math.sin(a + 0.15) * len * 0.5
      ctx.beginPath()
      ctx.moveTo(x + Math.cos(a) * somaR, y + Math.sin(a) * somaR)
      ctx.quadraticCurveTo(mx, my, ex, ey)
      ctx.strokeStyle = col
      ctx.lineWidth = glow ? 1.8 : 1.2
      ctx.stroke()

      // sub-branches at tips
      for (let b = 0; b < 2; b++) {
        const ba = a + (b === 0 ? 0.5 : -0.5)
        const bl = len * 0.35
        const bx = ex + Math.cos(ba) * bl
        const by = ey + Math.sin(ba) * bl
        ctx.beginPath()
        ctx.moveTo(ex, ey)
        ctx.lineTo(bx, by)
        ctx.strokeStyle = col.replace('0.55', '0.3').replace('0.9', '0.5')
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      // local signal sparkles (no action potential, just local signals)
      if (i % 3 === 0) {
        const sparkPhase = (t * 1.5 + i) % (Math.PI * 2)
        const sparkR = 2 + Math.sin(sparkPhase) * 1.5
        if (sparkR > 2) {
          const sparkX = lerp(x + Math.cos(a) * somaR, ex, 0.6 + Math.sin(t + i) * 0.2)
          const sparkY = lerp(y + Math.sin(a) * somaR, ey, 0.6 + Math.sin(t + i) * 0.2)
          ctx.beginPath()
          ctx.arc(sparkX, sparkY, sparkR, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(244, 63, 94, ${0.2 + Math.sin(sparkPhase) * 0.15})`
          ctx.fill()
        }
      }
    }

    // soma
    ctx.beginPath()
    ctx.arc(x, y, somaR, 0, Math.PI * 2)
    ctx.fillStyle = colFill
    ctx.fill()
    ctx.strokeStyle = col
    ctx.lineWidth = glow ? 2 : 1.5
    ctx.stroke()

    // nucleus
    ctx.beginPath()
    ctx.arc(x, y, somaR * 0.4, 0, Math.PI * 2)
    ctx.fillStyle = col.replace('0.55', '0.3').replace('0.9', '0.4')
    ctx.fill()

    // "?" label to indicate no identifiable axon
    ctx.font = `700 ${Math.max(8, 10)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = col.replace('0.55', '0.3').replace('0.9', '0.45')
    ctx.fillText('sem axônio', x, y + r + 16)
  }, [])

  /* ── main draw ── */
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const st = stateRef.current
      const scale = Math.min(w / 700, h / 420)

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

      // classification headers
      const fontSize = Math.max(9, 10 * scale)

      // divider
      const divY = h * 0.52
      ctx.beginPath()
      ctx.setLineDash([4, 4])
      ctx.moveTo(30, divY)
      ctx.lineTo(w - 30, divY)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.setLineDash([])

      // functional label area
      ctx.font = `600 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'left'
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.fillText('CLASSIFICAÇÃO ESTRUTURAL', 12, divY - 5)

      // position 4 neurons in a 2x2 grid
      const cells = [
        { ...NEURON_DEFS[0], x: w * 0.28, y: h * 0.27, radius: 32 * scale },    // multipolar
        { ...NEURON_DEFS[1], x: w * 0.75, y: h * 0.27, radius: 30 * scale },    // pseudounipolar
        { ...NEURON_DEFS[2], x: w * 0.28, y: h * 0.76, radius: 30 * scale },    // bipolar
        { ...NEURON_DEFS[3], x: w * 0.75, y: h * 0.76, radius: 28 * scale },    // anaxonic
      ]
      cellsRef.current = cells.map(c => ({ type: c.type, x: c.x, y: c.y, radius: c.radius }))

      const active = selectedType || hoveredType

      for (const cell of cells) {
        const isActive = cell.type === active
        const isUnfocused = active && !isActive
        ctx.globalAlpha = isUnfocused ? 0.25 : 1

        // glow ring
        if (isActive) {
          const grad = ctx.createRadialGradient(cell.x, cell.y, 0, cell.x, cell.y, cell.radius * 2.5)
          grad.addColorStop(0, cell.colorGlow)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(cell.x - cell.radius * 3, cell.y - cell.radius * 3, cell.radius * 6, cell.radius * 6)
        }

        switch (cell.type) {
          case 'multipolar': drawMultipolar(ctx, cell.x, cell.y, cell.radius, st.t, isActive); break
          case 'pseudounipolar': drawPseudounipolar(ctx, cell.x, cell.y, cell.radius, st.t, isActive); break
          case 'bipolar': drawBipolar(ctx, cell.x, cell.y, cell.radius, st.t, isActive); break
          case 'anaxonic': drawAnaxonic(ctx, cell.x, cell.y, cell.radius, st.t, isActive); break
        }

        // label
        ctx.font = `700 ${Math.max(8, 10 * scale)}px ${FONT_MONO}`
        ctx.textAlign = 'center'
        ctx.fillStyle = isActive ? cell.color : COL_TEXT_DIM
        ctx.fillText(cell.label, cell.x, cell.y - cell.radius * 1.7 - 8)

        // subtitle
        ctx.font = `500 ${Math.max(6, 7.5 * scale)}px ${FONT_MONO}`
        ctx.fillStyle = isActive ? cell.color.replace('0.85', '0.55') : 'rgba(255,255,255,0.2)'
        ctx.fillText(cell.subtitle, cell.x, cell.y - cell.radius * 1.7 + 4)

        ctx.globalAlpha = 1
      }

      // HUD
      ctx.font = `600 ${Math.max(9, 10 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'left'
      ctx.fillStyle = COL_TEXT_DIM
      ctx.fillText('NEURON.TYPES', 12, h - 12)
      ctx.fillStyle = 'rgba(45, 212, 191, 0.5)'
      ctx.fillText('▸ INTERATIVO', 12, h - 26)
    },
    [selectedType, hoveredType, drawMultipolar, drawPseudounipolar, drawBipolar, drawAnaxonic],
  )

  /* ── animation loop ── */
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
      if (cvs.width !== cw || cvs.height !== ch) {
        cvs.width = cw
        cvs.height = ch
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(ctx, rect.width, rect.height)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [draw])

  /* ── mouse handlers ── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const cvs = canvasRef.current
    if (!cvs) return
    const rect = cvs.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    let found: NeuronType | null = null
    for (const cell of cellsRef.current) {
      const dx = mx - cell.x
      const dy = my - cell.y
      if (Math.sqrt(dx * dx + dy * dy) < cell.radius * 2.2) {
        found = cell.type
        break
      }
    }
    setHoveredType(found)
    cvs.style.cursor = found ? 'pointer' : 'default'
  }, [])

  const handleClick = useCallback(() => {
    setSelectedType(prev => prev === hoveredType ? null : hoveredType)
  }, [hoveredType])

  const active = selectedType || hoveredType
  const activeDef = active ? NEURON_DEFS.find(n => n.type === active) : null

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas
        ref={canvasRef}
        className="w-full rounded-2xl"
        style={{ aspectRatio: '16/9', background: COL_BG }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={() => setHoveredType(null)}
      />
      {activeDef && (
        <div
          className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md px-4 py-3"
          style={{ pointerEvents: 'none' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full" style={{ background: activeDef.color }} />
            <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider">
              {activeDef.label}
            </span>
            <span className="text-[9px] text-white/40 ml-1">{activeDef.desc}</span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-1">
            {activeDef.features.map((fn, i) => (
              <span key={i} className="text-[9px] text-white/40">▸ {fn}</span>
            ))}
          </div>
          <div className="flex gap-2">
            {activeDef.examples.map((ex, i) => (
              <span key={i} className="text-[8px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">
                {ex}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
