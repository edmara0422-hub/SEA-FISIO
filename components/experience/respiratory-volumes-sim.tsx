'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface RespiratoryVolumesSimProps { className?: string }
type Highlight = 'vc' | 'vri' | 'vre' | 'vr' | 'ci' | 'crf' | 'cv' | 'cpt' | null

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.02)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.28)'
const COL_TRACE = 'rgba(45, 212, 191, 0.85)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

// ── Valores reais (homem adulto, mL)
const VR  = 1200  // Volume Residual
const VRE = 1100  // Volume de Reserva Expiratória
const VC  = 500   // Volume Corrente
const VRI = 3000  // Volume de Reserva Inspiratória

// Níveis absolutos (do zero)
const L0   = 0                      // base
const L_VR = VR                     // 1200 — topo do VR
const L_CRF = VR + VRE              // 2300 — topo do VRE = CRF = nível exp. normal
const L_VC  = L_CRF + VC            // 2800 — topo do VC = nível insp. normal
const L_CPT = L_CRF + VC + VRI      // 5800 — topo do VRI = CPT

// Capacidades (somas)
const CI  = VC + VRI               // 3500
const CRF = VR + VRE               // 2300
const CV  = VRI + VC + VRE          // 4600
const CPT = CV + VR                 // 5800

// Cores por volume
const COL_VRI = { fill: 'rgba(45, 212, 191, 0.08)', stroke: 'rgba(45, 212, 191, 0.4)', text: 'rgba(45, 212, 191, 0.7)' }
const COL_VC  = { fill: 'rgba(34, 211, 238, 0.10)', stroke: 'rgba(34, 211, 238, 0.5)', text: 'rgba(34, 211, 238, 0.8)' }
const COL_VRE = { fill: 'rgba(250, 204, 21, 0.08)', stroke: 'rgba(250, 204, 21, 0.4)', text: 'rgba(250, 204, 21, 0.7)' }
const COL_VR  = { fill: 'rgba(244, 63, 94, 0.06)', stroke: 'rgba(244, 63, 94, 0.35)', text: 'rgba(244, 63, 94, 0.6)' }

const HIGHLIGHT_INFO: Record<string, { name: string; formula: string; value: number; desc: string }> = {
  vr:  { name: 'Volume Residual (VR)',              formula: '—',                value: VR,  desc: 'Ar que PERMANECE nos pulmões após expiração máxima. Não mensurável por espirometria.' },
  vre: { name: 'Volume de Reserva Expiratória (VRE)', formula: '—',             value: VRE, desc: 'Volume EXTRA expirável além da expiração normal (expiração forçada).' },
  vc:  { name: 'Volume Corrente (VC)',               formula: '—',               value: VC,  desc: 'Volume inspirado e expirado em cada respiração normal tranquila.' },
  vri: { name: 'Volume de Reserva Inspiratória (VRI)', formula: '—',             value: VRI, desc: 'Volume EXTRA inspirável além da inspiração normal (inspiração máxima).' },
  ci:  { name: 'Capacidade Inspiratória (CI)',       formula: 'VC + VRI',         value: CI,  desc: 'Máximo de ar inspirável a partir do nível expiratório normal.' },
  crf: { name: 'Capacidade Residual Funcional (CRF)', formula: 'VRE + VR',       value: CRF, desc: 'Volume nos pulmões ao final de expiração normal.' },
  cv:  { name: 'Capacidade Vital (CV)',              formula: 'VRI + VC + VRE',   value: CV,  desc: 'Máximo de ar mobilizável. Medida clínica mais importante.' },
  cpt: { name: 'Capacidade Pulmonar Total (CPT)',    formula: 'CV + VR',          value: CPT, desc: 'Todo o ar que os pulmões podem conter.' },
}

function ez(t: number) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

/* ─────────────────────── component ─────────────────────── */

export function RespiratoryVolumesSim({ className }: RespiratoryVolumesSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hi, setHi] = useState<Highlight>(null)
  const stRef = useRef({ t: 0, last: 0, trace: [] as number[] })

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const s = stRef.current
    const S = Math.min(w / 750, h / 480)

    ctx.fillStyle = COL_BG; ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = COL_GRID; ctx.lineWidth = 0.5
    const gs = 26 * S
    for (let gx = 0; gx < w; gx += gs) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke() }
    for (let gy = 0; gy < h; gy += gs) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke() }

    // ════════════════════════════════════════════════
    // LAYOUT: graph LEFT (55%) | volume bands RIGHT (45%)
    // ════════════════════════════════════════════════

    const gL = 50 * S          // graph left
    const gR = w * 0.52        // graph right
    const gT = 45 * S          // graph top
    const gB = h - 35 * S      // graph bottom
    const gW = gR - gL
    const gH = gB - gT

    // volume → y coordinate
    const vToY = (v: number) => gB - (v / CPT) * gH

    // ── GENERATE SPIROMETRY TRACE ──
    // Classic pattern: normal breathing → max insp → max exp → normal
    const cycleLen = 380
    const phase = (s.trace.length % cycleLen) / cycleLen

    let vol: number
    if (phase < 0.28) {
      // 3 normal tidal breaths (between CRF=2300 and CRF+VC=2800)
      const tp = (phase / 0.28) * 3
      const tc = tp % 1
      const tv = tc < 0.35 ? ez(tc / 0.35) : (tc < 0.5 ? 1 : (tc < 0.85 ? 1 - ez((tc - 0.5) / 0.35) : 0))
      vol = lerp(L_CRF, L_VC, tv)
    } else if (phase < 0.38) {
      // MAX INSPIRATION → up to CPT (5800)
      vol = lerp(L_VC, L_CPT, ez((phase - 0.28) / 0.10))
    } else if (phase < 0.42) {
      vol = L_CPT // hold
    } else if (phase < 0.56) {
      // MAX EXPIRATION → down to VR (1200)
      vol = lerp(L_CPT, L_VR, ez((phase - 0.42) / 0.14))
    } else if (phase < 0.60) {
      vol = L_VR // hold
    } else if (phase < 0.68) {
      // return to CRF level
      vol = lerp(L_VR, L_CRF, ez((phase - 0.60) / 0.08))
    } else {
      // 2 more normal breaths
      const tp = ((phase - 0.68) / 0.32) * 2
      const tc = tp % 1
      const tv = tc < 0.35 ? ez(tc / 0.35) : (tc < 0.5 ? 1 : (tc < 0.85 ? 1 - ez((tc - 0.5) / 0.35) : 0))
      vol = lerp(L_CRF, L_VC, tv)
    }

    s.trace.push(vol)
    const maxPts = Math.floor(gW / 1.2)
    if (s.trace.length > maxPts) s.trace.shift()

    // ── GRAPH AXES ──
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1.2
    ctx.beginPath(); ctx.moveTo(gL, gT - 3); ctx.lineTo(gL, gB); ctx.lineTo(gR + 3, gB); ctx.stroke()

    // Y-axis ticks
    ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'right'; ctx.fillStyle = COL_TEXT_DIM
    for (let v = 0; v <= CPT; v += 1000) {
      const y = vToY(v)
      ctx.fillText(`${v}`, gL - 5, y + 3)
      ctx.beginPath(); ctx.moveTo(gL - 2, y); ctx.lineTo(gL, y)
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.8; ctx.stroke()
    }

    // Y label
    ctx.save()
    ctx.translate(12, gT + gH / 2); ctx.rotate(-Math.PI / 2)
    ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'; ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('Volume (mL)', 0, 0)
    ctx.restore()

    // X label
    ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'; ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('Tempo →', gL + gW / 2, gB + 16)

    // ── HORIZONTAL REFERENCE LINES in graph ──
    const refs = [
      { v: L_CPT, label: 'CPT', c: 'rgba(167,139,250,0.2)' },
      { v: L_VC,  label: '',     c: 'rgba(34,211,238,0.1)' },
      { v: L_CRF, label: 'CRF', c: 'rgba(250,204,21,0.15)' },
      { v: L_VR,  label: 'VR',  c: 'rgba(244,63,94,0.15)' },
    ]
    for (const r of refs) {
      const y = vToY(r.v)
      ctx.beginPath(); ctx.moveTo(gL + 1, y); ctx.lineTo(gR, y)
      ctx.strokeStyle = r.c; ctx.lineWidth = 0.6
      ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([])
    }

    // ── DRAW TRACE ──
    ctx.beginPath()
    for (let i = 0; i < s.trace.length; i++) {
      const x = gL + (i / maxPts) * gW
      const y = vToY(s.trace[i])
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.strokeStyle = COL_TRACE; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.stroke()

    // current point
    const curX = gL + (s.trace.length / maxPts) * gW
    const curY = vToY(vol)
    ctx.beginPath(); ctx.arc(curX, curY, 4, 0, Math.PI * 2)
    ctx.fillStyle = COL_TRACE; ctx.fill()
    ctx.font = `700 ${Math.max(8, 10 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'right'; ctx.fillStyle = COL_TRACE
    ctx.fillText(`${Math.round(vol)} mL`, gR - 5, gT + 14)

    // ════════════════════════════════════════════════
    // RIGHT SIDE: VOLUME BANDS + CAPACITY BRACKETS
    // ════════════════════════════════════════════════

    const bandL = w * 0.56       // left edge of bands
    const bandR = w * 0.76       // right edge of bands
    const bandW = bandR - bandL
    const brkL  = w * 0.78       // left edge of capacity brackets
    const bandT = gT             // aligned with graph top
    const bandB = gB             // aligned with graph bottom
    const bandH = bandB - bandT

    const bvToY = (v: number) => bandB - (v / CPT) * bandH

    // ── 4 VOLUME BANDS (stacked rectangles)
    const volumes = [
      { id: 'vri', bot: L_VC,  top: L_CPT, col: COL_VRI, label: 'VRI', val: VRI },
      { id: 'vc',  bot: L_CRF, top: L_VC,  col: COL_VC,  label: 'VC',  val: VC },
      { id: 'vre', bot: L_VR,  top: L_CRF, col: COL_VRE, label: 'VRE', val: VRE },
      { id: 'vr',  bot: L0,    top: L_VR,  col: COL_VR,  label: 'VR',  val: VR },
    ]

    for (const v of volumes) {
      const y1 = bvToY(v.top), y2 = bvToY(v.bot)
      const isHi = hi === v.id
        || (hi === 'ci' && (v.id === 'vc' || v.id === 'vri'))
        || (hi === 'crf' && (v.id === 'vre' || v.id === 'vr'))
        || (hi === 'cv' && (v.id === 'vri' || v.id === 'vc' || v.id === 'vre'))
        || hi === 'cpt'

      // band fill
      ctx.fillStyle = isHi ? v.col.fill.replace(/[\d.]+\)$/, '0.18)') : v.col.fill
      ctx.fillRect(bandL, y1, bandW, y2 - y1)

      // band border
      ctx.strokeStyle = isHi ? v.col.stroke : v.col.stroke.replace(/[\d.]+\)$/, '0.15)')
      ctx.lineWidth = isHi ? 1.5 : 0.8
      ctx.strokeRect(bandL, y1, bandW, y2 - y1)

      // label centered in band
      ctx.font = `800 ${Math.max(10, 13 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = isHi ? v.col.text : v.col.text.replace(/[\d.]+\)$/, '0.35)')
      const midY = (y1 + y2) / 2
      ctx.fillText(v.label, bandL + bandW / 2, midY + 2)

      // value below label
      ctx.font = `600 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
      ctx.fillStyle = isHi ? v.col.text.replace(/[\d.]+\)$/, '0.6)') : v.col.text.replace(/[\d.]+\)$/, '0.2)')
      ctx.fillText(`${v.val} mL`, bandL + bandW / 2, midY + 15)
    }

    // ── 4 CAPACITY BRACKETS (to the right of bands)
    const caps = [
      { id: 'ci',  bot: L_CRF, top: L_CPT, label: 'CI',  val: CI,  color: COL_VC.text },
      { id: 'crf', bot: L0,    top: L_CRF, label: 'CRF', val: CRF, color: COL_VRE.text },
      { id: 'cv',  bot: L_VR,  top: L_CPT, label: 'CV',  val: CV,  color: COL_VRI.text },
      { id: 'cpt', bot: L0,    top: L_CPT, label: 'CPT', val: CPT, color: 'rgba(167, 139, 250, 0.7)' },
    ]

    for (let ci = 0; ci < caps.length; ci++) {
      const cap = caps[ci]
      const y1 = bvToY(cap.top), y2 = bvToY(cap.bot)
      const x = brkL + ci * 22 * S
      const isHi2 = hi === cap.id

      // bracket [ shape
      ctx.beginPath()
      ctx.moveTo(x + 4, y1 + 2); ctx.lineTo(x, y1 + 2)
      ctx.lineTo(x, y2 - 2); ctx.lineTo(x + 4, y2 - 2)
      ctx.strokeStyle = isHi2 ? cap.color : cap.color.replace(/[\d.]+\)$/, '0.15)')
      ctx.lineWidth = isHi2 ? 2 : 1
      ctx.stroke()

      // label
      ctx.font = `${isHi2 ? '800' : '600'} ${Math.max(7, 9 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = isHi2 ? cap.color : cap.color.replace(/[\d.]+\)$/, '0.2)')
      ctx.fillText(cap.label, x + 2, (y1 + y2) / 2 + 3)

      // value
      ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
      ctx.fillText(`${cap.val}`, x + 2, (y1 + y2) / 2 + 14)
    }

    // ── LEVEL LABELS on right edge of bands
    ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    const lvlX = bandR + 3
    ctx.fillStyle = 'rgba(167,139,250,0.3)'; ctx.fillText(`${L_CPT}`, lvlX, bvToY(L_CPT) + 3)
    ctx.fillStyle = 'rgba(34,211,238,0.25)'; ctx.fillText(`${L_VC}`, lvlX, bvToY(L_VC) + 3)
    ctx.fillStyle = 'rgba(250,204,21,0.3)'; ctx.fillText(`${L_CRF}`, lvlX, bvToY(L_CRF) + 3)
    ctx.fillStyle = 'rgba(244,63,94,0.25)'; ctx.fillText(`${L_VR}`, lvlX, bvToY(L_VR) + 3)
    ctx.fillStyle = COL_TEXT_DIM; ctx.fillText('0', lvlX, bvToY(0) + 3)

    // ── BOTTOM: dead space info
    ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.fillText('Espaço Morto Anatômico: 150 mL  •  Alveolar: ≈0 mL  •  Fisiológico = Anat + Alv', 12, h - 8)
  }, [hi])

  useEffect(() => {
    const c = canvasRef.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    let raf = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const s = stRef.current
      if (now - s.last < FRAME_MS) return; s.last = now; s.t += 1
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

  const info = hi ? HIGHLIGHT_INFO[hi] : null

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas ref={canvasRef} className="w-full rounded-2xl" style={{ aspectRatio: '16/9', background: COL_BG }} />
      {/* Buttons top-left */}
      <div className="absolute top-2 left-2 flex gap-1 flex-wrap" style={{ maxWidth: '180px' }}>
        <span className="text-[6px] text-white/20 uppercase w-full">Volumes:</span>
        {(['vc', 'vri', 'vre', 'vr'] as Highlight[]).map(v => (
          <button key={v!} onClick={() => setHi(prev => prev === v ? null : v)}
            className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase transition-all ${
              hi === v ? 'bg-white/15 text-white/90 border border-white/25' : 'text-white/30 hover:text-white/50 border border-transparent'
            }`}>{v!.toUpperCase()}</button>
        ))}
        <span className="text-[6px] text-white/20 uppercase w-full mt-0.5">Capacidades:</span>
        {(['ci', 'crf', 'cv', 'cpt'] as Highlight[]).map(v => (
          <button key={v!} onClick={() => setHi(prev => prev === v ? null : v)}
            className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase transition-all ${
              hi === v ? 'bg-white/15 text-white/90 border border-white/25' : 'text-white/25 hover:text-white/40 border border-transparent'
            }`}>{v!.toUpperCase()}</button>
        ))}
      </div>
      {info && (
        <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-black/85 backdrop-blur-md px-4 py-2.5" style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[11px] font-bold text-white/90">{info.name}</span>
            {info.formula !== '—' && <span className="text-[9px] text-white/40">= {info.formula}</span>}
            <span className="text-[12px] font-bold text-teal-400 ml-auto">{info.value} mL</span>
          </div>
          <p className="text-[9px] text-white/45">{info.desc}</p>
        </div>
      )}
    </div>
  )
}
