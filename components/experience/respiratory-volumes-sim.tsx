'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface RespiratoryVolumesSimProps { className?: string }
type Hi = 'vc' | 'vri' | 'vre' | 'vr' | 'ci' | 'crf' | 'cv' | 'cpt' | null

/* ─────────────────────── pulmonary data (Guyton) ─────────────────────── */

const VR = 1200, VRE = 1100, VC = 500, VRI = 3000
const CI = VC + VRI, CRF = VR + VRE, CV = VRI + VC + VRE, CPT = CV + VR
// absolute levels from bottom
const L_VR = VR, L_CRF = VR + VRE, L_VC = L_CRF + VC, L_CPT = L_CRF + VC + VRI

const VOLS = [
  { id: 'vri' as Hi, label: 'VRI', val: VRI, bot: L_VC, top: L_CPT, r: 45, g: 212, b: 191 },
  { id: 'vc'  as Hi, label: 'VC',  val: VC,  bot: L_CRF, top: L_VC,  r: 34, g: 211, b: 238 },
  { id: 'vre' as Hi, label: 'VRE', val: VRE, bot: L_VR, top: L_CRF, r: 250, g: 204, b: 21 },
  { id: 'vr'  as Hi, label: 'VR',  val: VR,  bot: 0, top: L_VR,       r: 244, g: 63, b: 94 },
]

const CAPS = [
  { id: 'ci'  as Hi, label: 'CI',  val: CI,  formula: 'VC+VRI',     bot: L_CRF, top: L_CPT, r: 34, g: 211, b: 238 },
  { id: 'crf' as Hi, label: 'CRF', val: CRF, formula: 'VRE+VR',     bot: 0,     top: L_CRF, r: 250, g: 204, b: 21 },
  { id: 'cv'  as Hi, label: 'CV',  val: CV,  formula: 'VRI+VC+VRE', bot: L_VR,  top: L_CPT, r: 45, g: 212, b: 191 },
  { id: 'cpt' as Hi, label: 'CPT', val: CPT, formula: 'CV+VR',      bot: 0,     top: L_CPT, r: 167, g: 139, b: 250 },
]

const INFO: Record<string, { name: string; desc: string }> = {
  vr:  { name: 'Volume Residual (VR) = 1.200 mL',                   desc: 'Ar que permanece nos pulmões após expiração máxima. Não mensurável por espirometria.' },
  vre: { name: 'Vol. Reserva Expiratória (VRE) = 1.100 mL',        desc: 'Volume extra expirável além da expiração normal.' },
  vc:  { name: 'Volume Corrente (VC) = 500 mL',                      desc: 'Volume inspirado/expirado em respiração tranquila.' },
  vri: { name: 'Vol. Reserva Inspiratória (VRI) = 3.000 mL',        desc: 'Volume extra inspirável além da inspiração normal.' },
  ci:  { name: 'Capacidade Inspiratória (CI) = VC+VRI = 3.500 mL',  desc: 'Máximo de ar inspirável a partir do nível expiratório normal.' },
  crf: { name: 'Cap. Residual Funcional (CRF) = VRE+VR = 2.300 mL', desc: 'Volume nos pulmões ao final de expiração normal.' },
  cv:  { name: 'Capacidade Vital (CV) = VRI+VC+VRE = 4.600 mL',     desc: 'Máximo de ar mobilizável.' },
  cpt: { name: 'Cap. Pulmonar Total (CPT) = CV+VR = 5.800 mL',      desc: 'Todo o ar que os pulmões comportam.' },
}

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30, FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const FONT = '"SF Mono", "Fira Code", ui-monospace, monospace'

function ez(t: number) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

/* ─────────────────────── component ─────────────────────── */

export function RespiratoryVolumesSim({ className }: RespiratoryVolumesSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hi, setHi] = useState<Hi>(null)
  const st = useRef({ t: 0, last: 0, trace: [] as number[] })

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const s = st.current
    const S = Math.min(w / 750, h / 460)
    ctx.fillStyle = COL_BG; ctx.fillRect(0, 0, w, h)

    // subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.02)'; ctx.lineWidth = 0.5
    const gs = 26 * S
    for (let x = 0; x < w; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
    for (let y = 0; y < h; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

    // ════════ FULL-WIDTH GRAPH ════════
    const gL = 58 * S, gR = w - 110 * S, gT = 50 * S, gB = h - 30 * S
    const gW = gR - gL, gH = gB - gT
    const vY = (v: number) => gB - (v / CPT) * gH

    // ── VOLUME BANDS as background inside graph ──
    for (const v of VOLS) {
      const y1 = vY(v.top), y2 = vY(v.bot)
      const isVHi = hi === v.id
        || (hi === 'ci' && (v.id === 'vc' || v.id === 'vri'))
        || (hi === 'crf' && (v.id === 'vre' || v.id === 'vr'))
        || (hi === 'cv' && v.id !== 'vr')
        || hi === 'cpt'
      const a = isVHi ? 0.12 : 0.035

      ctx.fillStyle = `rgba(${v.r},${v.g},${v.b},${a})`
      ctx.fillRect(gL, y1, gW, y2 - y1)

      // borders
      ctx.strokeStyle = `rgba(${v.r},${v.g},${v.b},${isVHi ? 0.35 : 0.08})`
      ctx.lineWidth = isVHi ? 1.2 : 0.5
      ctx.beginPath(); ctx.moveTo(gL, y1); ctx.lineTo(gR, y1); ctx.stroke()
    }
    // bottom border of VR
    ctx.beginPath(); ctx.moveTo(gL, gB); ctx.lineTo(gR, gB)
    ctx.strokeStyle = 'rgba(244,63,94,0.08)'; ctx.lineWidth = 0.5; ctx.stroke()

    // ── VOLUME LABELS on right side of graph (inside, right-aligned) ──
    for (const v of VOLS) {
      const y1 = vY(v.top), y2 = vY(v.bot)
      const midY = (y1 + y2) / 2
      const isVHi = hi === v.id || hi === 'ci' && (v.id === 'vc' || v.id === 'vri')
        || hi === 'crf' && (v.id === 'vre' || v.id === 'vr')
        || hi === 'cv' && v.id !== 'vr' || hi === 'cpt'

      ctx.textAlign = 'right'
      ctx.font = `800 ${Math.max(11, 15 * S)}px ${FONT}`
      ctx.fillStyle = `rgba(${v.r},${v.g},${v.b},${isVHi ? 0.6 : 0.15})`
      ctx.fillText(v.label, gR - 8, midY + 3)

      ctx.font = `600 ${Math.max(7, 8 * S)}px ${FONT}`
      ctx.fillStyle = `rgba(${v.r},${v.g},${v.b},${isVHi ? 0.45 : 0.1})`
      ctx.fillText(`${v.val} mL`, gR - 8, midY + 16)
    }

    // ── AXES ──
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1.2
    ctx.beginPath(); ctx.moveTo(gL, gT - 3); ctx.lineTo(gL, gB); ctx.lineTo(gR, gB); ctx.stroke()

    // Y ticks
    ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT}`
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(255,255,255,0.25)'
    for (let v = 0; v <= CPT; v += 1000) {
      const y = vY(v)
      ctx.fillText(`${v}`, gL - 5, y + 3)
      ctx.beginPath(); ctx.moveTo(gL - 2, y); ctx.lineTo(gL, y)
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.8; ctx.stroke()
    }
    // Y axis label
    ctx.save(); ctx.translate(14, gT + gH / 2); ctx.rotate(-Math.PI / 2)
    ctx.font = `600 ${Math.max(6, 7 * S)}px ${FONT}`
    ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.fillText('Volume (mL)', 0, 0); ctx.restore()

    // ── GENERATE TRACE ──
    const cycleLen = 400
    const ph = (s.trace.length % cycleLen) / cycleLen

    let vol: number
    if (ph < 0.26) {
      // 3 tidal breaths
      const tp = (ph / 0.26) * 3, tc = tp % 1
      const tv = tc < 0.3 ? ez(tc / 0.3) : tc < 0.45 ? 1 : tc < 0.75 ? 1 - ez((tc - 0.45) / 0.3) : 0
      vol = lerp(L_CRF, L_VC, tv)
    } else if (ph < 0.36) {
      // max inspiration
      vol = lerp(L_VC, L_CPT, ez((ph - 0.26) / 0.10))
    } else if (ph < 0.40) {
      vol = L_CPT
    } else if (ph < 0.55) {
      // max expiration all the way down
      vol = lerp(L_CPT, L_VR, ez((ph - 0.40) / 0.15))
    } else if (ph < 0.59) {
      vol = L_VR
    } else if (ph < 0.67) {
      // back to CRF
      vol = lerp(L_VR, L_CRF, ez((ph - 0.59) / 0.08))
    } else {
      // 2 tidal breaths
      const tp = ((ph - 0.67) / 0.33) * 2, tc = tp % 1
      const tv = tc < 0.3 ? ez(tc / 0.3) : tc < 0.45 ? 1 : tc < 0.75 ? 1 - ez((tc - 0.45) / 0.3) : 0
      vol = lerp(L_CRF, L_VC, tv)
    }

    s.trace.push(vol)
    const maxPts = Math.floor(gW / 1.5)
    if (s.trace.length > maxPts) s.trace.shift()

    // ── DRAW TRACE ──
    ctx.beginPath()
    for (let i = 0; i < s.trace.length; i++) {
      const x = gL + 1 + (i / maxPts) * (gW - 2)
      const y = vY(s.trace[i])
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.9)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.stroke()

    // current dot
    const cx2 = gL + 1 + (s.trace.length / maxPts) * (gW - 2)
    const cy2 = vY(vol)
    ctx.beginPath(); ctx.arc(cx2, cy2, 4.5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(45, 212, 191, 0.9)'; ctx.fill()

    // current volume number near top-left of graph
    ctx.font = `700 ${Math.max(10, 13 * S)}px ${FONT}`
    ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(45, 212, 191, 0.7)'
    ctx.fillText(`${Math.round(vol)} mL`, gL + 8, gT + 18)

    // ════════ CAPACITY BRACKETS (far right, outside graph) ════════
    const brkX = gR + 12 * S

    for (let ci = 0; ci < CAPS.length; ci++) {
      const c = CAPS[ci]
      const y1 = vY(c.top), y2 = vY(c.bot)
      const x = brkX + ci * 22 * S
      const isHi = hi === c.id

      // bracket line
      ctx.beginPath()
      ctx.moveTo(x + 4, y1 + 2); ctx.lineTo(x, y1 + 2)
      ctx.lineTo(x, y2 - 2); ctx.lineTo(x + 4, y2 - 2)
      ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${isHi ? 0.7 : 0.12})`
      ctx.lineWidth = isHi ? 2.5 : 1; ctx.stroke()

      // label
      ctx.font = `${isHi ? '800' : '600'} ${Math.max(7, 9 * S)}px ${FONT}`
      ctx.textAlign = 'center'
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${isHi ? 0.8 : 0.18})`
      const mY = (y1 + y2) / 2
      ctx.fillText(c.label, x + 2, mY - 2)

      // value
      ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT}`
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${isHi ? 0.55 : 0.12})`
      ctx.fillText(`${c.val}`, x + 2, mY + 10)
    }

    // ── LEVEL VALUES on left axis (key boundaries)
    ctx.font = `600 ${Math.max(5, 6 * S)}px ${FONT}`
    ctx.textAlign = 'right'
    const lvls = [
      { v: L_CPT, label: 'CPT', c: '167,139,250' },
      { v: L_VC, label: '', c: '34,211,238' },
      { v: L_CRF, label: 'CRF', c: '250,204,21' },
      { v: L_VR, label: 'VR', c: '244,63,94' },
    ]
    for (const l of lvls) {
      if (!l.label) continue
      const y = vY(l.v)
      ctx.fillStyle = `rgba(${l.c},0.35)`
      ctx.fillText(`← ${l.label}`, gL - 5, y - 5)
    }

    // ── DEAD SPACE (bottom)
    ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT}`
    ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.fillText('Espaço Morto: Anatômico 150mL • Alveolar ≈0mL • Fisiológico = Anat + Alv', gL, h - 8)
  }, [hi])

  useEffect(() => {
    const c = canvasRef.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    let raf = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const s = st.current
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

  const info = hi ? INFO[hi] : null

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas ref={canvasRef} className="w-full rounded-2xl" style={{ aspectRatio: '16/9', background: COL_BG }} />
      <div className="absolute top-2 left-2 flex gap-0.5 flex-wrap" style={{ maxWidth: '260px' }}>
        {(['vc', 'vri', 'vre', 'vr', 'ci', 'crf', 'cv', 'cpt'] as Hi[]).map(v => (
          <button key={v!} onClick={() => setHi(p => p === v ? null : v)}
            className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all ${
              hi === v ? 'bg-white/15 text-white/90 border border-white/30' : 'text-white/30 hover:text-white/50 border border-transparent'
            }`}>{v!.toUpperCase()}</button>
        ))}
      </div>
      {info && (
        <div className="absolute bottom-2 left-2 right-2 rounded-xl border border-white/10 bg-black/85 backdrop-blur-md px-4 py-2" style={{ pointerEvents: 'none' }}>
          <p className="text-[10px] font-bold text-white/85">{info.name}</p>
          <p className="text-[9px] text-white/40">{info.desc}</p>
        </div>
      )}
    </div>
  )
}
