'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface NeuroNeuronAnatomySimProps {
  className?: string
}

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS

const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_SOMA = 'rgba(45, 212, 191, 0.85)'
const COL_SOMA_FILL = 'rgba(45, 212, 191, 0.15)'
const COL_DENDRITE = 'rgba(34, 211, 238, 0.8)'
const COL_AXON = 'rgba(250, 204, 21, 0.85)'
const COL_MYELIN = 'rgba(120, 180, 160, 0.5)'
const COL_MYELIN_STROKE = 'rgba(45, 212, 191, 0.4)'
const COL_TERMINAL = 'rgba(244, 63, 94, 0.85)'
const COL_TERMINAL_FILL = 'rgba(244, 63, 94, 0.2)'
const COL_NUCLEUS = 'rgba(167, 139, 250, 0.8)'
const COL_NUCLEUS_FILL = 'rgba(167, 139, 250, 0.15)'
const COL_TEXT = 'rgba(255, 255, 255, 0.88)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.38)'
const COL_GRID = 'rgba(255, 255, 255, 0.03)'
const COL_SIGNAL = 'rgba(250, 204, 21, 0.95)'
const COL_SIGNAL_GLOW = 'rgba(250, 204, 21, 0.3)'
const COL_SPINE = 'rgba(34, 211, 238, 0.6)'

const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

type NeuronPart = 'soma' | 'dendrites' | 'axon' | 'myelin' | 'terminals' | 'nucleus' | null

const PART_INFO: Record<string, { title: string; desc: string; detail: string }> = {
  soma: {
    title: 'Corpo Celular (Soma)',
    desc: 'Centro metabólico do neurônio',
    detail: 'Contém núcleo, RE, mitocôndrias e Golgi. Síntese proteica e controle genético.',
  },
  dendrites: {
    title: 'Dendritos',
    desc: 'Receptores de informação',
    detail: 'Ramificações com espinhos dendríticos que aumentam a área de superfície para receber sinais.',
  },
  axon: {
    title: 'Axônio',
    desc: 'Condutor de sinais elétricos',
    detail: 'Transmite potencial de ação do cone axonal até os terminais sinápticos.',
  },
  myelin: {
    title: 'Bainha de Mielina',
    desc: 'Isolante elétrico',
    detail: 'Formada por oligodendrócitos (SNC) ou células de Schwann (SNP). Permite condução saltatória.',
  },
  terminals: {
    title: 'Terminais Sinápticos',
    desc: 'Liberação de neurotransmissores',
    detail: 'Vesículas sinápticas liberam moléculas mensageiras na fenda sináptica.',
  },
  nucleus: {
    title: 'Núcleo',
    desc: 'DNA e controle genético',
    detail: 'Contém o material genético que serve de molde para toda a síntese proteica do neurônio.',
  },
}

/* ─────────────────────── helpers ─────────────────────── */

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/* ─────────────────────── component ─────────────────────── */

export function NeuroNeuronAnatomySim({ className }: NeuroNeuronAnatomySimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredPart, setHoveredPart] = useState<NeuronPart>(null)
  const [selectedPart, setSelectedPart] = useState<NeuronPart>(null)
  const stateRef = useRef({
    t: 0,
    lastTimestamp: 0,
    signalPos: -0.1, // 0→1 along axon
    hovered: null as NeuronPart,
    mouseX: 0,
    mouseY: 0,
  })

  // hit-test regions stored after each draw
  const regionsRef = useRef<{ part: NeuronPart; x: number; y: number; w: number; h: number }[]>([])

  /* ── draw dendrite branch ── */
  const drawBranch = useCallback(
    (ctx: CanvasRenderingContext2D, x0: number, y0: number, angle: number, len: number, depth: number, glow: boolean) => {
      if (depth > 4) return
      const x1 = x0 + Math.cos(angle) * len
      const y1 = y0 + Math.sin(angle) * len

      ctx.beginPath()
      ctx.moveTo(x0, y0)
      ctx.lineTo(x1, y1)
      ctx.strokeStyle = glow ? COL_DENDRITE : 'rgba(34, 211, 238, 0.45)'
      ctx.lineWidth = Math.max(1, 3.5 - depth * 0.7)
      ctx.stroke()

      // spines on deeper branches
      if (depth >= 2) {
        const spineCount = 2
        for (let s = 0; s < spineCount; s++) {
          const st = 0.3 + (s * 0.4)
          const sx = lerp(x0, x1, st)
          const sy = lerp(y0, y1, st)
          const sa = angle + (s % 2 === 0 ? 0.8 : -0.8)
          const sl = 4 + Math.random() * 3
          ctx.beginPath()
          ctx.moveTo(sx, sy)
          ctx.lineTo(sx + Math.cos(sa) * sl, sy + Math.sin(sa) * sl)
          ctx.strokeStyle = COL_SPINE
          ctx.lineWidth = 1
          ctx.stroke()
          // spine head
          ctx.beginPath()
          ctx.arc(sx + Math.cos(sa) * sl, sy + Math.sin(sa) * sl, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = COL_SPINE
          ctx.fill()
        }
      }

      // recurse
      const spread = 0.55 - depth * 0.05
      const newLen = len * 0.68
      drawBranch(ctx, x1, y1, angle - spread, newLen, depth + 1, glow)
      drawBranch(ctx, x1, y1, angle + spread, newLen, depth + 1, glow)
    },
    [],
  )

  /* ── main draw ── */
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const st = stateRef.current
      const scale = Math.min(w / 700, h / 400)
      const cx = w * 0.5
      const cy = h * 0.5

      // layout
      const somaR = 38 * scale
      const somaX = cx - 120 * scale
      const somaY = cy
      const axonStartX = somaX + somaR
      const axonEndX = cx + 200 * scale
      const axonY = somaY

      // ── background
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

      const regions: typeof regionsRef.current = []

      // ── dendrites
      const dendGlow = st.hovered === 'dendrites'
      const dendAngles = [-2.8, -3.14, -3.5, -2.3, -3.9]
      for (const a of dendAngles) {
        drawBranch(ctx, somaX - somaR * 0.7, somaY + Math.sin(a) * somaR * 0.5, a, 42 * scale, 0, dendGlow)
      }
      regions.push({ part: 'dendrites', x: somaX - somaR - 130 * scale, y: somaY - 80 * scale, w: 130 * scale, h: 160 * scale })

      // ── axon hillock → axon
      const axonGlow = st.hovered === 'axon'
      ctx.beginPath()
      ctx.moveTo(axonStartX, axonY)
      ctx.lineTo(axonEndX, axonY)
      ctx.strokeStyle = axonGlow ? COL_AXON : 'rgba(250, 204, 21, 0.5)'
      ctx.lineWidth = 3 * scale
      ctx.stroke()

      // cone axonal label
      ctx.beginPath()
      ctx.moveTo(axonStartX, axonY)
      ctx.lineTo(axonStartX + 12 * scale, axonY - 6 * scale)
      ctx.lineTo(axonStartX + 12 * scale, axonY + 6 * scale)
      ctx.closePath()
      ctx.fillStyle = COL_AXON
      ctx.fill()

      regions.push({ part: 'axon', x: axonStartX, y: axonY - 20 * scale, w: axonEndX - axonStartX, h: 40 * scale })

      // ── myelin sheaths
      const myelinGlow = st.hovered === 'myelin'
      const sheathCount = 4
      const sheathW = ((axonEndX - axonStartX) / (sheathCount * 2 + 1)) * 1.5
      const sheathH = 18 * scale
      const gapW = ((axonEndX - axonStartX) - sheathCount * sheathW) / (sheathCount + 1)

      for (let i = 0; i < sheathCount; i++) {
        const sx = axonStartX + gapW + i * (sheathW + gapW)
        const sy = axonY - sheathH / 2

        // sheath body
        ctx.beginPath()
        const rr = 8 * scale
        ctx.roundRect(sx, sy, sheathW, sheathH, rr)
        ctx.fillStyle = myelinGlow ? 'rgba(120, 180, 160, 0.35)' : COL_MYELIN
        ctx.fill()
        ctx.strokeStyle = myelinGlow ? 'rgba(45, 212, 191, 0.7)' : COL_MYELIN_STROKE
        ctx.lineWidth = 1.5
        ctx.stroke()

        // wrap lines inside
        ctx.globalAlpha = 0.3
        for (let li = 0; li < 3; li++) {
          const ly = sy + 4 + li * (sheathH - 8) / 3
          ctx.beginPath()
          ctx.moveTo(sx + 4, ly)
          ctx.lineTo(sx + sheathW - 4, ly)
          ctx.strokeStyle = COL_MYELIN_STROKE
          ctx.lineWidth = 0.7
          ctx.stroke()
        }
        ctx.globalAlpha = 1

        // node of Ranvier label (small dot between sheaths)
        if (i < sheathCount - 1) {
          const nodeX = sx + sheathW + gapW / 2
          ctx.beginPath()
          ctx.arc(nodeX, axonY, 2.5 * scale, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(45, 212, 191, 0.7)'
          ctx.fill()
        }
      }
      regions.push({ part: 'myelin', x: axonStartX, y: axonY - sheathH, w: axonEndX - axonStartX, h: sheathH * 2 })

      // ── signal pulse traveling along axon
      st.signalPos += 0.008
      if (st.signalPos > 1.15) st.signalPos = -0.15
      const sigX = lerp(axonStartX, axonEndX, st.signalPos)
      if (st.signalPos >= 0 && st.signalPos <= 1) {
        // glow
        const grad = ctx.createRadialGradient(sigX, axonY, 0, sigX, axonY, 20 * scale)
        grad.addColorStop(0, COL_SIGNAL_GLOW)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(sigX - 25 * scale, axonY - 25 * scale, 50 * scale, 50 * scale)
        // dot
        ctx.beginPath()
        ctx.arc(sigX, axonY, 4 * scale, 0, Math.PI * 2)
        ctx.fillStyle = COL_SIGNAL
        ctx.fill()
      }

      // ── terminals
      const termGlow = st.hovered === 'terminals'
      const termCount = 5
      const termSpread = 55 * scale
      for (let i = 0; i < termCount; i++) {
        const angle = -0.6 + (i / (termCount - 1)) * 1.2
        const tx = axonEndX + Math.cos(angle) * 30 * scale
        const ty = axonY + Math.sin(angle) * termSpread * 0.5
        // branch line
        ctx.beginPath()
        ctx.moveTo(axonEndX, axonY)
        ctx.lineTo(tx, ty)
        ctx.strokeStyle = COL_AXON
        ctx.lineWidth = 1.5
        ctx.stroke()
        // bulb
        ctx.beginPath()
        ctx.arc(tx + Math.cos(angle) * 8 * scale, ty + Math.sin(angle) * 8 * scale, 6 * scale, 0, Math.PI * 2)
        ctx.fillStyle = termGlow ? 'rgba(244, 63, 94, 0.35)' : COL_TERMINAL_FILL
        ctx.fill()
        ctx.strokeStyle = termGlow ? 'rgba(244, 63, 94, 1)' : COL_TERMINAL
        ctx.lineWidth = 1.5
        ctx.stroke()

        // vesicles inside
        const bx = tx + Math.cos(angle) * 8 * scale
        const by = ty + Math.sin(angle) * 8 * scale
        for (let v = 0; v < 3; v++) {
          const va = (v / 3) * Math.PI * 2 + st.t * 0.5
          ctx.beginPath()
          ctx.arc(bx + Math.cos(va) * 2.5, by + Math.sin(va) * 2.5, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = COL_TERMINAL
          ctx.fill()
        }
      }
      regions.push({ part: 'terminals', x: axonEndX - 5, y: axonY - termSpread * 0.5 - 15, w: 60 * scale, h: termSpread + 30 })

      // ── soma
      const somaGlow = st.hovered === 'soma'
      // glow
      if (somaGlow) {
        const grad = ctx.createRadialGradient(somaX, somaY, somaR * 0.5, somaX, somaY, somaR * 1.8)
        grad.addColorStop(0, 'rgba(45, 212, 191, 0.15)')
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(somaX - somaR * 2, somaY - somaR * 2, somaR * 4, somaR * 4)
      }
      ctx.beginPath()
      ctx.arc(somaX, somaY, somaR, 0, Math.PI * 2)
      ctx.fillStyle = somaGlow ? 'rgba(45, 212, 191, 0.2)' : COL_SOMA_FILL
      ctx.fill()
      ctx.strokeStyle = somaGlow ? 'rgba(45, 212, 191, 1)' : COL_SOMA
      ctx.lineWidth = 2
      ctx.stroke()

      // organelles inside soma
      // ER lines
      ctx.globalAlpha = 0.35
      for (let i = 0; i < 3; i++) {
        const ey = somaY - 10 + i * 8
        ctx.beginPath()
        ctx.moveTo(somaX - 15, ey)
        ctx.quadraticCurveTo(somaX, ey + 4 * Math.sin(st.t + i), somaX + 15, ey)
        ctx.strokeStyle = COL_SOMA
        ctx.lineWidth = 1
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // mitochondria
      ctx.beginPath()
      ctx.ellipse(somaX + 18, somaY + 12, 8, 4, 0.5, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)'
      ctx.lineWidth = 1
      ctx.stroke()
      // cristae
      for (let ci = 0; ci < 3; ci++) {
        ctx.beginPath()
        const cx2 = somaX + 14 + ci * 4
        ctx.moveTo(cx2, somaY + 10)
        ctx.lineTo(cx2, somaY + 14)
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.3)'
        ctx.lineWidth = 0.7
        ctx.stroke()
      }

      regions.push({ part: 'soma', x: somaX - somaR, y: somaY - somaR, w: somaR * 2, h: somaR * 2 })

      // ── nucleus
      const nucGlow = st.hovered === 'nucleus'
      const nucR = somaR * 0.42
      ctx.beginPath()
      ctx.arc(somaX - 5, somaY - 2, nucR, 0, Math.PI * 2)
      ctx.fillStyle = nucGlow ? 'rgba(167, 139, 250, 0.25)' : COL_NUCLEUS_FILL
      ctx.fill()
      ctx.strokeStyle = nucGlow ? 'rgba(167, 139, 250, 1)' : COL_NUCLEUS
      ctx.lineWidth = 1.5
      ctx.stroke()
      // nucleolus
      ctx.beginPath()
      ctx.arc(somaX - 5, somaY - 2, nucR * 0.35, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(167, 139, 250, 0.35)'
      ctx.fill()

      regions.push({ part: 'nucleus', x: somaX - 5 - nucR, y: somaY - 2 - nucR, w: nucR * 2, h: nucR * 2 })

      // ── labels
      const fontSize = Math.max(9, 11 * scale)
      ctx.font = `600 ${fontSize}px ${FONT_MONO}`
      ctx.textAlign = 'center'

      // dendrites label
      ctx.fillStyle = st.hovered === 'dendrites' ? COL_DENDRITE : COL_TEXT_DIM
      ctx.fillText('DENDRITOS', somaX - somaR - 55 * scale, somaY - 65 * scale)

      // soma label
      ctx.fillStyle = st.hovered === 'soma' ? COL_SOMA : COL_TEXT_DIM
      ctx.fillText('SOMA', somaX, somaY + somaR + 20 * scale)

      // axon label
      ctx.fillStyle = st.hovered === 'axon' ? COL_AXON : COL_TEXT_DIM
      ctx.fillText('AXÔNIO', (axonStartX + axonEndX) / 2, axonY + 35 * scale)

      // myelin label
      ctx.fillStyle = st.hovered === 'myelin' ? COL_MYELIN_STROKE : COL_TEXT_DIM
      ctx.fillText('MIELINA', (axonStartX + axonEndX) / 2, axonY - 22 * scale)

      // terminals label
      ctx.fillStyle = st.hovered === 'terminals' ? COL_TERMINAL : COL_TEXT_DIM
      ctx.fillText('TERMINAIS', axonEndX + 30 * scale, axonY + termSpread * 0.5 + 25 * scale)

      // Nó de Ranvier label (small)
      ctx.font = `500 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
      ctx.fillStyle = COL_TEXT_DIM
      ctx.fillText('Nó de Ranvier', axonStartX + (sheathW + gapW) * 1.5 + gapW / 2, axonY - sheathH - 6 * scale)

      // direction arrow
      ctx.font = `500 ${fontSize}px ${FONT_MONO}`
      ctx.fillStyle = 'rgba(250, 204, 21, 0.5)'
      ctx.textAlign = 'left'
      ctx.fillText('→ sinal', axonEndX - 55 * scale, axonY + 50 * scale)

      // ── HUD top-left
      ctx.font = `600 ${Math.max(9, 10 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'left'
      ctx.fillStyle = COL_TEXT_DIM
      ctx.fillText('NEURON.ANATOMY', 12, 20)
      ctx.fillStyle = 'rgba(45, 212, 191, 0.5)'
      ctx.fillText('▸ INTERATIVO', 12, 34)

      // store regions for hit-testing
      regionsRef.current = regions
    },
    [drawBranch],
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
      st.t += 0.04

      const dpr = window.devicePixelRatio || 1
      const rect = cvs.getBoundingClientRect()
      const w = rect.width * dpr
      const h = rect.height * dpr
      if (cvs.width !== w || cvs.height !== h) {
        cvs.width = w
        cvs.height = h
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
    stateRef.current.mouseX = mx
    stateRef.current.mouseY = my

    let found: NeuronPart = null
    // check regions in reverse (later = higher priority like nucleus inside soma)
    for (let i = regionsRef.current.length - 1; i >= 0; i--) {
      const r = regionsRef.current[i]
      if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
        found = r.part
        break
      }
    }
    stateRef.current.hovered = found
    setHoveredPart(found)
    cvs.style.cursor = found ? 'pointer' : 'default'
  }, [])

  const handleClick = useCallback(() => {
    setSelectedPart(stateRef.current.hovered)
  }, [])

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
        onMouseLeave={() => {
          stateRef.current.hovered = null
          setHoveredPart(null)
        }}
      />
      {/* info panel */}
      {info && (
        <div
          className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md px-4 py-3"
          style={{ pointerEvents: 'none' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="h-2 w-2 rounded-full"
              style={{
                background:
                  activePart === 'soma' ? COL_SOMA
                    : activePart === 'dendrites' ? COL_DENDRITE
                    : activePart === 'axon' ? COL_AXON
                    : activePart === 'myelin' ? COL_MYELIN_STROKE
                    : activePart === 'terminals' ? COL_TERMINAL
                    : COL_NUCLEUS,
              }}
            />
            <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider">
              {info.title}
            </span>
          </div>
          <p className="text-[10px] text-white/60 leading-relaxed">{info.desc} — {info.detail}</p>
        </div>
      )}
    </div>
  )
}
