'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface NeuroMetabolicChainSimProps {
  className?: string
}

type ChainLink = 'o2_glucose' | 'atp' | 'gradients' | 'action_potential' | 'neural_function'

interface LinkDef {
  id: ChainLink
  label: string
  sublabel: string
  color: string
  icon: string
  detail: string
  values: string[]
}

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.03)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.38)'
const COL_DANGER = 'rgba(244, 63, 94, 0.85)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

const CHAIN: LinkDef[] = [
  {
    id: 'o2_glucose',
    label: 'O₂ + Glicose',
    sublabel: 'Suprimento contínuo',
    color: 'rgba(34, 211, 238, 0.85)',
    icon: '🫁',
    detail: 'Sangue arterial entrega O₂ e glicose continuamente',
    values: [
      'Cérebro: 2% do peso corporal',
      'Consome 20% do O₂ total',
      'Consome 25% da glicose total',
      'Sem reserva significativa',
    ],
  },
  {
    id: 'atp',
    label: 'ATP',
    sublabel: 'Fosforilação oxidativa',
    color: 'rgba(250, 204, 21, 0.85)',
    icon: '⚡',
    detail: 'Mitocôndrias convertem glicose + O₂ em ATP',
    values: [
      'Glicose + O₂ → ATP + CO₂ + H₂O',
      '~32 ATP por molécula de glicose',
      '60-80% do ATP → bombas iônicas',
      'Sem ATP: colapso em segundos',
    ],
  },
  {
    id: 'gradients',
    label: 'Gradientes',
    sublabel: 'Na⁺/K⁺-ATPase',
    color: 'rgba(45, 212, 191, 0.85)',
    icon: '🔋',
    detail: 'Bombas iônicas mantêm gradientes eletroquímicos',
    values: [
      '3 Na⁺ para fora, 2 K⁺ para dentro',
      'Mantém potencial de repouso: -70mV',
      'Funciona 24h sem parar',
      'Maior consumidor de ATP cerebral',
    ],
  },
  {
    id: 'action_potential',
    label: 'Potencial de Ação',
    sublabel: 'Sinalização elétrica',
    color: 'rgba(167, 139, 250, 0.85)',
    icon: '⚡',
    detail: 'Gradientes permitem disparo de sinais elétricos',
    values: [
      'Repouso -70mV → Pico +40mV',
      'Duração: ~1-2ms',
      'Velocidade: até 120 m/s (mielinizado)',
      'Tudo-ou-nada: depende dos gradientes',
    ],
  },
  {
    id: 'neural_function',
    label: 'Função Neural',
    sublabel: 'Emergência do sistema',
    color: 'rgba(244, 63, 94, 0.85)',
    icon: '🧠',
    detail: 'Cognição, decisão, comportamento = efeitos emergentes',
    values: [
      'Pensar, decidir, aprender, regular',
      'Emergência da cadeia metabólica',
      'Não é propriedade "mágica" da mente',
      'Sem infraestrutura → sem função',
    ],
  },
]

/* ─────────────────────── helpers ─────────────────────── */

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/* ─────────────────────── component ─────────────────────── */

export function NeuroMetabolicChainSim({ className }: NeuroMetabolicChainSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredLink, setHoveredLink] = useState<ChainLink | null>(null)
  const [brokenLink, setBrokenLink] = useState<ChainLink | null>(null)
  const stateRef = useRef({ t: 0, lastTimestamp: 0 })
  const nodesRef = useRef<{ id: ChainLink; x: number; y: number; r: number }[]>([])

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const st = stateRef.current
    const scale = Math.min(w / 750, h / 420)

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

    const chainY = h * 0.42
    const margin = 65 * scale
    const nodeR = 28 * scale
    const chainW = w - margin * 2
    const spacing = chainW / (CHAIN.length - 1)

    const nodes: typeof nodesRef.current = []
    const brokenIdx = brokenLink ? CHAIN.findIndex(c => c.id === brokenLink) : -1

    // ── draw connecting arrows first
    for (let i = 0; i < CHAIN.length - 1; i++) {
      const x1 = margin + i * spacing + nodeR + 5
      const x2 = margin + (i + 1) * spacing - nodeR - 5
      const isBroken = brokenIdx >= 0 && i >= brokenIdx
      const isActiveEdge = !isBroken

      // energy flow particles along the edge
      if (isActiveEdge) {
        const particleCount = 3
        for (let p = 0; p < particleCount; p++) {
          const phase = ((st.t * 1.5 + p * 0.33) % 1)
          const px = lerp(x1, x2, phase)
          const py = chainY + Math.sin(st.t * 3 + p * 2) * 3

          const grad = ctx.createRadialGradient(px, py, 0, px, py, 6 * scale)
          grad.addColorStop(0, CHAIN[i].color.replace('0.85', '0.5'))
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(px - 8, py - 8, 16, 16)

          ctx.beginPath()
          ctx.arc(px, py, 2 * scale, 0, Math.PI * 2)
          ctx.fillStyle = CHAIN[i].color
          ctx.fill()
        }
      }

      // arrow line
      ctx.beginPath()
      ctx.moveTo(x1, chainY)
      ctx.lineTo(x2, chainY)
      if (isBroken) {
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)'
        ctx.setLineDash([4, 4])
      } else {
        ctx.strokeStyle = `rgba(255, 255, 255, 0.15)`
        ctx.setLineDash([])
      }
      ctx.lineWidth = 2 * scale
      ctx.stroke()
      ctx.setLineDash([])

      // arrowhead
      const arrowX = x2
      ctx.beginPath()
      ctx.moveTo(arrowX, chainY)
      ctx.lineTo(arrowX - 6, chainY - 4)
      ctx.moveTo(arrowX, chainY)
      ctx.lineTo(arrowX - 6, chainY + 4)
      ctx.strokeStyle = isBroken ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255,255,255,0.2)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // break symbol ✕
      if (isBroken && i === brokenIdx) {
        const bx = (x1 + x2) / 2
        ctx.save()
        ctx.translate(bx, chainY)
        ctx.rotate(Math.PI / 4)
        ctx.beginPath()
        ctx.moveTo(-8, 0); ctx.lineTo(8, 0)
        ctx.moveTo(0, -8); ctx.lineTo(0, 8)
        ctx.strokeStyle = COL_DANGER
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.restore()

        // "COLAPSO" label
        ctx.font = `800 ${Math.max(8, 10 * scale)}px ${FONT_MONO}`
        ctx.textAlign = 'center'
        ctx.fillStyle = COL_DANGER
        ctx.fillText('COLAPSO', bx, chainY - 20 * scale)
      }
    }

    // ── draw nodes
    for (let i = 0; i < CHAIN.length; i++) {
      const link = CHAIN[i]
      const nx = margin + i * spacing
      const ny = chainY
      const isHovered = hoveredLink === link.id
      const isBroken2 = brokenIdx >= 0 && i > brokenIdx
      const isBrokenSelf = brokenIdx === i

      nodes.push({ id: link.id, x: nx, y: ny, r: nodeR })

      // pulse ring when hovered
      if (isHovered) {
        const pulseR = nodeR * (1.5 + Math.sin(st.t * 3) * 0.15)
        const grad = ctx.createRadialGradient(nx, ny, nodeR * 0.5, nx, ny, pulseR)
        grad.addColorStop(0, link.color.replace('0.85', '0.2'))
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(nx - pulseR, ny - pulseR, pulseR * 2, pulseR * 2)
      }

      // node circle
      ctx.beginPath()
      ctx.arc(nx, ny, nodeR, 0, Math.PI * 2)

      if (isBrokenSelf) {
        // red pulsing
        const flash = 0.15 + Math.sin(st.t * 4) * 0.1
        ctx.fillStyle = `rgba(244, 63, 94, ${flash})`
        ctx.fill()
        ctx.strokeStyle = COL_DANGER
        ctx.lineWidth = 2.5
        ctx.stroke()
      } else if (isBroken2) {
        // grayed out
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      } else {
        ctx.fillStyle = link.color.replace('0.85', isHovered ? '0.18' : '0.08')
        ctx.fill()
        ctx.strokeStyle = link.color.replace('0.85', isHovered ? '0.9' : '0.5')
        ctx.lineWidth = isHovered ? 2.5 : 1.5
        ctx.stroke()

        // inner activity ring
        const innerR = nodeR * 0.6
        ctx.beginPath()
        ctx.arc(nx, ny, innerR, 0 + st.t, Math.PI * 1.2 + st.t)
        ctx.strokeStyle = link.color.replace('0.85', '0.3')
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // icon text
      ctx.font = `${Math.max(14, 18 * scale)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.globalAlpha = isBroken2 ? 0.2 : 1
      ctx.fillStyle = 'white'
      ctx.fillText(link.icon, nx, ny + 1)
      ctx.globalAlpha = 1
      ctx.textBaseline = 'alphabetic'

      // label below
      ctx.font = `700 ${Math.max(8, 9 * scale)}px ${FONT_MONO}`
      ctx.fillStyle = isBroken2 ? 'rgba(255,255,255,0.1)' : (isBrokenSelf ? COL_DANGER : (isHovered ? link.color : COL_TEXT_DIM))
      ctx.fillText(link.label, nx, ny + nodeR + 16 * scale)

      // sublabel
      ctx.font = `500 ${Math.max(6, 7 * scale)}px ${FONT_MONO}`
      ctx.fillStyle = isBroken2 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.2)'
      ctx.fillText(link.sublabel, nx, ny + nodeR + 28 * scale)

      // step number
      ctx.font = `600 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
      ctx.fillStyle = isBroken2 ? 'rgba(255,255,255,0.06)' : link.color.replace('0.85', '0.35')
      ctx.fillText(`${i + 1}`, nx, ny - nodeR - 8 * scale)
    }

    nodesRef.current = nodes

    // ── bottom stats bar
    const statsY = h - 50 * scale
    const stats = [
      { label: 'Peso cerebral', value: '2% corpo', color: 'rgba(34, 211, 238, 0.7)' },
      { label: 'Consumo O₂', value: '20% total', color: 'rgba(45, 212, 191, 0.7)' },
      { label: 'Consumo glicose', value: '25% total', color: 'rgba(250, 204, 21, 0.7)' },
      { label: 'ATP → bombas', value: '60-80%', color: 'rgba(167, 139, 250, 0.7)' },
    ]
    const statW = chainW / stats.length
    for (let i = 0; i < stats.length; i++) {
      const sx = margin + i * statW + statW / 2
      ctx.font = `600 ${Math.max(10, 13 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = stats[i].color
      ctx.fillText(stats[i].value, sx, statsY)
      ctx.font = `500 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
      ctx.fillStyle = COL_TEXT_DIM
      ctx.fillText(stats[i].label, sx, statsY + 14 * scale)
    }

    // ── warning text when broken
    if (brokenIdx >= 0) {
      ctx.font = `600 ${Math.max(9, 10 * scale)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = COL_DANGER
      const warningY = chainY + nodeR + 50 * scale
      ctx.fillText('Quebrou qualquer elo → o sistema colapsa', w / 2, warningY)
      ctx.font = `500 ${Math.max(7, 8 * scale)}px ${FONT_MONO}`
      ctx.fillStyle = 'rgba(244, 63, 94, 0.5)'
      ctx.fillText('Não existe "força mental" capaz de substituir ATP', w / 2, warningY + 14 * scale)
    }

    // HUD
    ctx.font = `600 ${Math.max(9, 10 * scale)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('METABOLIC.CHAIN', 12, 20)
    ctx.fillStyle = 'rgba(45, 212, 191, 0.5)'
    ctx.fillText(brokenLink ? '▸ CLIQUE PARA RESTAURAR' : '▸ CLIQUE PARA QUEBRAR ELO', 12, 34)
  }, [hoveredLink, brokenLink])

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

    let found: ChainLink | null = null
    for (const node of nodesRef.current) {
      const dx = mx - node.x
      const dy = my - node.y
      if (Math.sqrt(dx * dx + dy * dy) < node.r * 1.5) {
        found = node.id
        break
      }
    }
    setHoveredLink(found)
    cvs.style.cursor = found ? 'pointer' : 'default'
  }, [])

  const handleClick = useCallback(() => {
    if (brokenLink) {
      setBrokenLink(null)
    } else if (hoveredLink) {
      setBrokenLink(hoveredLink)
    }
  }, [hoveredLink, brokenLink])

  const activeLink = hoveredLink ? CHAIN.find(c => c.id === hoveredLink) : null

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas
        ref={canvasRef}
        className="w-full rounded-2xl"
        style={{ aspectRatio: '16/9', background: COL_BG }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={() => setHoveredLink(null)}
      />
      {activeLink && (
        <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md px-4 py-3" style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full" style={{ background: activeLink.color }} />
            <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wider">{activeLink.label}</span>
            <span className="text-[9px] text-white/40 ml-1">{activeLink.detail}</span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {activeLink.values.map((v, i) => (
              <span key={i} className="text-[9px] text-white/40">▸ {v}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
