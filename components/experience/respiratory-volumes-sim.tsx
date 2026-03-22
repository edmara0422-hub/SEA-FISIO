'use client'

import { useRef, useCallback, useState, useEffect } from 'react'

/* ─── Pulmonary data (Guyton & Hall) ─── */

const VR = 1200, VRE = 1100, VC = 500, VRI = 3000
const CI = VC + VRI, CRF = VR + VRE, CV = VRI + VC + VRE, CPT = CV + VR
const L_VR = VR, L_CRF = VR + VRE, L_VC = L_CRF + VC, L_CPT = L_CRF + VC + VRI

type Hi = 'vc' | 'vri' | 'vre' | 'vr' | 'ci' | 'crf' | 'cv' | 'cpt' | null

const INFO: Record<string, { name: string; val: number; desc: string }> = {
  vr:  { name: 'Volume Residual (VR)',               val: VR,  desc: 'Ar que permanece após expiração máxima. Não mensurável por espirometria.' },
  vre: { name: 'Vol. Reserva Expiratória (VRE)',     val: VRE, desc: 'Extra expirável além da expiração normal.' },
  vc:  { name: 'Volume Corrente (VC)',                val: VC,  desc: 'Inspirado/expirado em respiração tranquila.' },
  vri: { name: 'Vol. Reserva Inspiratória (VRI)',     val: VRI, desc: 'Extra inspirável além da inspiração normal.' },
  ci:  { name: 'Cap. Inspiratória (CI = VC+VRI)',     val: CI,  desc: 'Máx. inspirável do nível expiratório normal.' },
  crf: { name: 'Cap. Residual Func. (CRF = VRE+VR)', val: CRF, desc: 'Volume ao final de expiração normal.' },
  cv:  { name: 'Cap. Vital (CV = VRI+VC+VRE)',        val: CV,  desc: 'Máximo de ar mobilizável.' },
  cpt: { name: 'Cap. Pulmonar Total (CPT = CV+VR)',   val: CPT, desc: 'Todo o ar que os pulmões comportam.' },
}

/* ─── Pre-computed spirometry trace (classic textbook shape) ─── */

function buildTrace(): number[] {
  const pts: number[] = []
  const addSine = (from: number, to: number, n: number) => {
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1)
      pts.push(from + (to - from) * (0.5 - 0.5 * Math.cos(t * Math.PI)))
    }
  }
  const addFlat = (v: number, n: number) => { for (let i = 0; i < n; i++) pts.push(v) }
  const addTidal = (count: number) => {
    for (let c = 0; c < count; c++) {
      addSine(L_CRF, L_VC, 20)   // inspire
      addSine(L_VC, L_CRF, 25)   // expire
    }
  }

  // 1. Normal tidal × 3
  addTidal(3)
  // 2. Max inspiration (VRI demo): from normal inspire level up to CPT
  addSine(L_CRF, L_VC, 15)     // normal inspire start
  addSine(L_VC, L_CPT, 25)     // continue up to CPT
  // 3. Hold at CPT
  addFlat(L_CPT, 12)
  // 4. Max expiration (full CV): CPT → VR
  addSine(L_CPT, L_VR, 40)
  // 5. Hold at VR
  addFlat(L_VR, 15)
  // 6. Return to CRF
  addSine(L_VR, L_CRF, 20)
  // 7. Normal tidal × 3
  addTidal(3)

  return pts
}

const TRACE = buildTrace()

/* ─── Constants ─── */

const FONT = '"SF Mono", "Fira Code", ui-monospace, monospace'
const COL_BG = 'rgba(2, 6, 12, 0.94)'

/* ─── Component ─── */

export function RespiratoryVolumesSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hi, setHi] = useState<Hi>(null)
  const animRef = useRef({ cursor: 0, raf: 0, last: 0 })

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, cursor: number) => {
    const S = Math.min(w / 760, h / 440)
    ctx.fillStyle = COL_BG; ctx.fillRect(0, 0, w, h)

    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.02)'; ctx.lineWidth = 0.5
    for (let x = 0; x < w; x += 26 * S) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
    for (let y = 0; y < h; y += 26 * S) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

    // ════ LAYOUT ════
    const gL = 55 * S, gR = w - 105 * S, gT = 42 * S, gB = h - 28 * S
    const gW = gR - gL, gH = gB - gT
    const vY = (v: number) => gB - (v / CPT) * gH

    // ════ VOLUME BANDS (background) ════
    const bands = [
      { id: 'vri', bot: L_VC, top: L_CPT, r: 45, g: 212, b: 191, label: 'VRI', val: VRI },
      { id: 'vc', bot: L_CRF, top: L_VC, r: 34, g: 211, b: 238, label: 'VC', val: VC },
      { id: 'vre', bot: L_VR, top: L_CRF, r: 250, g: 204, b: 21, label: 'VRE', val: VRE },
      { id: 'vr', bot: 0, top: L_VR, r: 244, g: 63, b: 94, label: 'VR', val: VR },
    ]

    for (const b of bands) {
      const y1 = vY(b.top), y2 = vY(b.bot)
      const lit = hi === b.id
        || (hi === 'ci' && (b.id === 'vc' || b.id === 'vri'))
        || (hi === 'crf' && (b.id === 'vre' || b.id === 'vr'))
        || (hi === 'cv' && b.id !== 'vr')
        || hi === 'cpt'
      const a = lit ? 0.14 : 0.03

      // fill
      ctx.fillStyle = `rgba(${b.r},${b.g},${b.b},${a})`
      ctx.fillRect(gL, y1, gW, y2 - y1)
      // top border
      ctx.beginPath(); ctx.moveTo(gL, y1); ctx.lineTo(gR, y1)
      ctx.strokeStyle = `rgba(${b.r},${b.g},${b.b},${lit ? 0.3 : 0.06})`
      ctx.lineWidth = lit ? 1 : 0.5; ctx.stroke()

      // label RIGHT of graph
      const midY = (y1 + y2) / 2
      ctx.font = `800 ${Math.max(12, 16 * S)}px ${FONT}`
      ctx.textAlign = 'left'
      ctx.fillStyle = `rgba(${b.r},${b.g},${b.b},${lit ? 0.65 : 0.12})`
      ctx.fillText(b.label, gR + 8, midY + 3)
      ctx.font = `600 ${Math.max(7, 9 * S)}px ${FONT}`
      ctx.fillStyle = `rgba(${b.r},${b.g},${b.b},${lit ? 0.5 : 0.08})`
      ctx.fillText(`${b.val} mL`, gR + 8, midY + 17)
    }

    // bottom border
    ctx.beginPath(); ctx.moveTo(gL, gB); ctx.lineTo(gR, gB)
    ctx.strokeStyle = 'rgba(244,63,94,0.06)'; ctx.lineWidth = 0.5; ctx.stroke()

    // ════ AXES ════
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1.2
    ctx.beginPath(); ctx.moveTo(gL, gT - 2); ctx.lineTo(gL, gB); ctx.lineTo(gR, gB); ctx.stroke()

    // Y ticks + key level values
    ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT}`
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(255,255,255,0.22)'
    const yTicks = [0, L_VR, L_CRF, L_VC, L_CPT]
    for (const v of yTicks) {
      const y = vY(v)
      ctx.fillText(`${v}`, gL - 5, y + 3)
      ctx.beginPath(); ctx.moveTo(gL - 2, y); ctx.lineTo(gL, y)
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.8; ctx.stroke()
    }

    // Y label
    ctx.save(); ctx.translate(12, gT + gH / 2); ctx.rotate(-Math.PI / 2)
    ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT}`
    ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.fillText('Volume (mL)', 0, 0); ctx.restore()

    // ════ DRAW FULL TRACE (static, already computed) ════
    const totalPts = TRACE.length
    const visiblePts = Math.min(cursor, totalPts)

    ctx.beginPath()
    for (let i = 0; i < visiblePts; i++) {
      const x = gL + (i / totalPts) * gW
      const y = vY(TRACE[i])
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.9)'
    ctx.lineWidth = 2.5 * S; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.stroke()

    // cursor dot
    if (visiblePts > 0 && visiblePts <= totalPts) {
      const ci2 = visiblePts - 1
      const cx2 = gL + (ci2 / totalPts) * gW
      const cy2 = vY(TRACE[ci2])
      ctx.beginPath(); ctx.arc(cx2, cy2, 4, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(45, 212, 191, 1)'; ctx.fill()

      // value
      ctx.font = `700 ${Math.max(9, 11 * S)}px ${FONT}`
      ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(45, 212, 191, 0.75)'
      ctx.fillText(`${Math.round(TRACE[ci2])} mL`, cx2 + 8, cy2 - 5)
    }

    // ════ ANNOTATIONS on trace (pointing to key moments) ════
    // Find key indices in the trace
    const maxI = TRACE.indexOf(L_CPT)
    const minI = TRACE.lastIndexOf(L_VR)

    if (maxI > 0 && maxI < visiblePts) {
      const ax = gL + (maxI / totalPts) * gW
      const ay = vY(L_CPT)
      // arrow pointing down to peak
      ctx.font = `700 ${Math.max(7, 9 * S)}px ${FONT}`
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(167, 139, 250, 0.6)'
      ctx.fillText('CPT', ax, ay - 10)
      ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT}`
      ctx.fillText(`${CPT} mL`, ax, ay - 1)
    }

    if (minI > 0 && minI < visiblePts) {
      const ax = gL + (minI / totalPts) * gW
      const ay = vY(L_VR)
      ctx.font = `700 ${Math.max(7, 9 * S)}px ${FONT}`
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(244, 63, 94, 0.6)'
      ctx.fillText('VR', ax, ay + 16)
      ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT}`
      ctx.fillText(`${VR} mL`, ax, ay + 26)
    }

    // VRI annotation (rising part before CPT)
    if (maxI > 20 && maxI < visiblePts) {
      const ariX = gL + ((maxI - 20) / totalPts) * gW
      const ariY = vY((L_VC + L_CPT) / 2)
      ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT}`
      ctx.textAlign = 'right'
      ctx.fillStyle = 'rgba(45, 212, 191, 0.45)'
      ctx.fillText('VRI ↑', ariX - 8, ariY)
    }

    // VRE annotation (falling part after CRF level toward VR)
    if (minI > 20 && minI < visiblePts) {
      const areX = gL + ((minI - 15) / totalPts) * gW
      const areY = vY((L_VR + L_CRF) / 2)
      ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT}`
      ctx.textAlign = 'right'
      ctx.fillStyle = 'rgba(250, 204, 21, 0.45)'
      ctx.fillText('VRE ↓', areX - 8, areY)
    }

    // VC annotation on first tidal breath
    if (visiblePts > 30) {
      const vcX = gL + (12 / totalPts) * gW
      const vcY1 = vY(L_VC), vcY2 = vY(L_CRF)
      // small bracket
      ctx.beginPath()
      ctx.moveTo(vcX + 4, vcY1); ctx.lineTo(vcX, vcY1)
      ctx.lineTo(vcX, vcY2); ctx.lineTo(vcX + 4, vcY2)
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)'; ctx.lineWidth = 1; ctx.stroke()
      ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT}`
      ctx.textAlign = 'left'
      ctx.fillStyle = 'rgba(34, 211, 238, 0.5)'
      ctx.fillText('VC', vcX + 6, (vcY1 + vcY2) / 2 + 3)
    }

    // CRF level label on left
    ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT}`
    ctx.textAlign = 'right'
    ctx.fillStyle = 'rgba(250, 204, 21, 0.3)'
    ctx.fillText('CRF →', gL - 5, vY(L_CRF) - 6)

    // ════ CAPACITY BRACKETS (far right) ════
    const brkX = gR + 65 * S
    const caps = [
      { id: 'ci' as Hi, label: 'CI', val: CI, bot: L_CRF, top: L_CPT, r: 34, g: 211, b: 238 },
      { id: 'crf' as Hi, label: 'CRF', val: CRF, bot: 0, top: L_CRF, r: 250, g: 204, b: 21 },
      { id: 'cv' as Hi, label: 'CV', val: CV, bot: L_VR, top: L_CPT, r: 45, g: 212, b: 191 },
      { id: 'cpt' as Hi, label: 'CPT', val: CPT, bot: 0, top: L_CPT, r: 167, g: 139, b: 250 },
    ]

    for (let ci3 = 0; ci3 < caps.length; ci3++) {
      const c = caps[ci3]
      const y1 = vY(c.top), y2 = vY(c.bot)
      const x = brkX + ci3 * 20 * S
      const lit = hi === c.id

      ctx.beginPath()
      ctx.moveTo(x + 3, y1 + 1); ctx.lineTo(x, y1 + 1)
      ctx.lineTo(x, y2 - 1); ctx.lineTo(x + 3, y2 - 1)
      ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${lit ? 0.7 : 0.1})`
      ctx.lineWidth = lit ? 2 : 0.8; ctx.stroke()

      ctx.font = `${lit ? '800' : '600'} ${Math.max(6, 8 * S)}px ${FONT}`
      ctx.textAlign = 'center'
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${lit ? 0.75 : 0.15})`
      ctx.fillText(c.label, x + 1, (y1 + y2) / 2 + 3)
      ctx.font = `500 ${Math.max(4, 5 * S)}px ${FONT}`
      ctx.fillText(`${c.val}`, x + 1, (y1 + y2) / 2 + 13)
    }

    // ════ DEAD SPACE ════
    ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT}`
    ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,255,255,0.18)'
    ctx.fillText('Espaço Morto: Anatômico 150 mL  •  Alveolar ≈ 0 mL  •  Fisiológico = Anat + Alv', gL, h - 6)
  }, [hi])

  useEffect(() => {
    const c = canvasRef.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const a = animRef.current
    a.cursor = 0

    const loop = (now: number) => {
      a.raf = requestAnimationFrame(loop)
      if (now - a.last < 1000 / 30) return
      a.last = now

      // advance cursor (drawing the trace progressively)
      if (a.cursor < TRACE.length) a.cursor += 2
      else a.cursor = 0 // restart

      const dpr = window.devicePixelRatio || 1
      const r = c.getBoundingClientRect()
      const cw = r.width * dpr, ch = r.height * dpr
      if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(ctx, r.width, r.height, a.cursor)
    }
    a.raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(a.raf)
  }, [draw])

  const info = hi ? INFO[hi] : null

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas ref={canvasRef} className="w-full rounded-2xl" style={{ aspectRatio: '16/9', background: COL_BG }} />
      <div className="absolute top-2 left-2 flex gap-0.5 flex-wrap" style={{ maxWidth: '280px' }}>
        {(['vc', 'vri', 'vre', 'vr', 'ci', 'crf', 'cv', 'cpt'] as Hi[]).map(v => (
          <button key={v!} onClick={() => setHi(p => p === v ? null : v)}
            className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all ${
              hi === v ? 'bg-white/15 text-white/90 border border-white/30' : 'text-white/30 hover:text-white/50 border border-transparent'
            }`}>{v!.toUpperCase()}</button>
        ))}
      </div>
      {info && (
        <div className="absolute bottom-2 left-2 right-2 rounded-xl border border-white/10 bg-black/85 backdrop-blur-md px-4 py-2" style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white/85">{info.name}</span>
            <span className="text-[11px] font-bold text-teal-400 ml-auto">{info.val} mL</span>
          </div>
          <p className="text-[9px] text-white/40">{info.desc}</p>
        </div>
      )}
    </div>
  )
}
