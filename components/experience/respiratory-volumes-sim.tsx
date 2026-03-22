'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface RespiratoryVolumesSimProps { className?: string }

type VolumeHighlight = 'vc' | 'vri' | 'vre' | 'vr' | 'ci' | 'crf' | 'cv' | 'cpt' | null

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.02)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.30)'
const COL_TRACE = 'rgba(45, 212, 191, 0.8)'
const COL_VC = 'rgba(34, 211, 238, 0.6)'
const COL_VRI = 'rgba(45, 212, 191, 0.5)'
const COL_VRE = 'rgba(250, 204, 21, 0.5)'
const COL_VR = 'rgba(244, 63, 94, 0.4)'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

// Real pulmonary volumes (adult male, mL)
const VR = 1200   // Volume Residual
const VRE = 1100  // Volume de Reserva Expiratória
const VC = 500    // Volume Corrente
const VRI = 3000  // Volume de Reserva Inspiratória
const CPT = VR + VRE + VC + VRI // 5800 - Capacidade Pulmonar Total
const CV = VRI + VC + VRE        // 4600 - Capacidade Vital
const CRF = VR + VRE             // 2300 - Capacidade Residual Funcional
const CI = VC + VRI              // 3500 - Capacidade Inspiratória

// Volume levels (from bottom of graph = 0)
const LVR = VR                    // 1200 - top of VR
const LVRE = LVR + VRE            // 2300 - top of VRE (= CRF)
const LVC = LVRE + VC             // 2800 - top of VC (normal expiratory level + VC)
const LVRI = LVC + VRI            // 5800 - top of VRI (= CPT)

const VOLUME_INFO: Record<string, { name: string; value: string; color: string; desc: string }> = {
  vc: { name: 'Volume Corrente (VC)', value: `${VC} mL`, color: COL_VC, desc: 'Volume inspirado/expirado em respiração normal tranquila' },
  vri: { name: 'Volume de Reserva Inspiratória (VRI)', value: `${VRI} mL`, color: COL_VRI, desc: 'Volume EXTRA que pode ser inspirado além do VC (inspiração máxima)' },
  vre: { name: 'Volume de Reserva Expiratória (VRE)', value: `${VRE} mL`, color: COL_VRE, desc: 'Volume EXTRA que pode ser expirado além do VC (expiração forçada)' },
  vr: { name: 'Volume Residual (VR)', value: `${VR} mL`, color: COL_VR, desc: 'Volume que PERMANECE nos pulmões mesmo após expiração máxima. Não pode ser medido por espirometria' },
  ci: { name: 'Capacidade Inspiratória (CI)', value: `${CI} mL`, color: 'rgba(34, 211, 238, 0.5)', desc: 'VC + VRI — volume máximo inspirável a partir do nível expiratório normal' },
  crf: { name: 'Capacidade Residual Funcional (CRF)', value: `${CRF} mL`, color: 'rgba(250, 204, 21, 0.5)', desc: 'VRE + VR — volume nos pulmões ao final de expiração normal' },
  cv: { name: 'Capacidade Vital (CV)', value: `${CV} mL`, color: 'rgba(45, 212, 191, 0.6)', desc: 'VRI + VC + VRE — volume máximo de ar mobilizável' },
  cpt: { name: 'Capacidade Pulmonar Total (CPT)', value: `${CPT} mL`, color: 'rgba(167, 139, 250, 0.5)', desc: 'CV + VR — todo o ar que os pulmões podem conter' },
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

/* ─────────────────────── component ─────────────────────── */

export function RespiratoryVolumesSim({ className }: RespiratoryVolumesSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [highlight, setHighlight] = useState<VolumeHighlight>(null)
  const stRef = useRef({ t: 0, last: 0, traceHistory: [] as number[] })

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const s = stRef.current
    const S = Math.min(w / 740, h / 500)

    ctx.fillStyle = COL_BG; ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = COL_GRID; ctx.lineWidth = 0.5
    const gs = 26 * S
    for (let gx = 0; gx < w; gx += gs) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke() }
    for (let gy = 0; gy < h; gy += gs) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke() }

    // spirometry graph area
    const gL = 55 * S, gR = w * 0.60, gT = 30 * S, gB = h - 40 * S
    const gW = gR - gL, gH = gB - gT

    const volToY = (vol: number) => gB - (vol / CPT) * gH

    // ── generate breathing trace
    // Pattern: 3 normal breaths → 1 max inspiration → 1 max expiration → return to normal
    const cycleLen = 600 // frames per full pattern
    const phase = (s.traceHistory.length % cycleLen) / cycleLen

    let currentVol: number
    if (phase < 0.45) {
      // normal tidal breathing (3 cycles)
      const tidPhase = (phase / 0.45) * 3
      const tidCycle = tidPhase % 1
      const tidVal = tidCycle < 0.4 ? Math.sin((tidCycle / 0.4) * Math.PI) : (tidCycle < 0.6 ? Math.sin(Math.PI) * (1 - (tidCycle - 0.4) / 0.2) : 0)
      currentVol = LVRE + tidVal * VC * 0.95
    } else if (phase < 0.55) {
      // max inspiration
      const t = (phase - 0.45) / 0.1
      currentVol = lerp(LVRE, LVRI, t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
    } else if (phase < 0.62) {
      // hold at max
      currentVol = LVRI
    } else if (phase < 0.75) {
      // max expiration
      const t = (phase - 0.62) / 0.13
      currentVol = lerp(LVRI, VR + 50, t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
    } else if (phase < 0.82) {
      // hold at min
      currentVol = VR + 50
    } else {
      // return to normal
      const t = (phase - 0.82) / 0.18
      currentVol = lerp(VR + 50, LVRE, t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
    }

    s.traceHistory.push(currentVol)
    if (s.traceHistory.length > Math.floor(gW / 1.5)) s.traceHistory.shift()

    // ── axes
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(gL, gT); ctx.lineTo(gL, gB); ctx.lineTo(gR, gB); ctx.stroke()

    // Y axis labels (volume)
    ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'right'
    for (let v = 0; v <= CPT; v += 1000) {
      const y = volToY(v)
      ctx.beginPath(); ctx.moveTo(gL - 3, y); ctx.lineTo(gL, y)
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1; ctx.stroke()
      ctx.fillStyle = COL_TEXT_DIM
      ctx.fillText(`${v}`, gL - 6, y + 3)
      // grid
      ctx.beginPath(); ctx.moveTo(gL, y); ctx.lineTo(gR, y)
      ctx.strokeStyle = 'rgba(255,255,255,0.02)'; ctx.lineWidth = 0.5; ctx.stroke()
    }

    ctx.save()
    ctx.translate(gL - 35, gT + gH / 2); ctx.rotate(-Math.PI / 2)
    ctx.font = `600 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'; ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('Volume (mL)', 0, 0)
    ctx.restore()

    // time label
    ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'; ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('Tempo →', gL + gW / 2, gB + 18)

    // ── VOLUME ZONE BANDS (behind trace)
    const zones = [
      { id: 'vr', bot: 0, top: LVR, color: COL_VR, label: 'VR' },
      { id: 'vre', bot: LVR, top: LVRE, color: COL_VRE, label: 'VRE' },
      { id: 'vc', bot: LVRE, top: LVC, color: COL_VC, label: 'VC' },
      { id: 'vri', bot: LVC, top: LVRI, color: COL_VRI, label: 'VRI' },
    ]

    for (const z of zones) {
      const y1 = volToY(z.top), y2 = volToY(z.bot)
      const isHi = highlight === z.id
      const isCap = highlight === 'ci' && (z.id === 'vc' || z.id === 'vri')
        || highlight === 'crf' && (z.id === 'vre' || z.id === 'vr')
        || highlight === 'cv' && (z.id === 'vri' || z.id === 'vc' || z.id === 'vre')
        || highlight === 'cpt'

      ctx.fillStyle = (isHi || isCap) ? z.color.replace(/[\d.]+\)$/, '0.12)') : z.color.replace(/[\d.]+\)$/, '0.03)')
      ctx.fillRect(gL + 1, y1, gW - 1, y2 - y1)

      // zone label on right edge
      ctx.font = `700 ${Math.max(8, 10 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'left'
      ctx.fillStyle = (isHi || isCap) ? z.color : z.color.replace(/[\d.]+\)$/, '0.2)')
      ctx.fillText(z.label, gR + 6, (y1 + y2) / 2 + 4)

      // value
      ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
      const vals: Record<string, number> = { vr: VR, vre: VRE, vc: VC, vri: VRI }
      ctx.fillText(`${vals[z.id]} mL`, gR + 6, (y1 + y2) / 2 + 14)

      // horizontal line at zone boundary
      ctx.beginPath(); ctx.moveTo(gL, y1); ctx.lineTo(gR, y1)
      ctx.strokeStyle = z.color.replace(/[\d.]+\)$/, '0.15)')
      ctx.lineWidth = 0.5; ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([])
    }

    // ── CAPACITY BRACKETS (far right)
    const brkX = gR + 55 * S
    const capacities = [
      { id: 'ci', bot: LVRE, top: LVRI, label: 'CI', value: `${CI}`, color: 'rgba(34, 211, 238, 0.5)' },
      { id: 'crf', bot: 0, top: LVRE, label: 'CRF', value: `${CRF}`, color: 'rgba(250, 204, 21, 0.5)' },
      { id: 'cv', bot: VR, top: LVRI, label: 'CV', value: `${CV}`, color: 'rgba(45, 212, 191, 0.5)' },
      { id: 'cpt', bot: 0, top: LVRI, label: 'CPT', value: `${CPT}`, color: 'rgba(167, 139, 250, 0.5)' },
    ]

    for (let ci = 0; ci < capacities.length; ci++) {
      const cap = capacities[ci]
      const y1 = volToY(cap.top), y2 = volToY(cap.bot)
      const x = brkX + ci * 28 * S
      const isHi2 = highlight === cap.id

      // bracket
      ctx.beginPath()
      ctx.moveTo(x - 3, y1 + 2); ctx.lineTo(x, y1 + 2)
      ctx.lineTo(x, y2 - 2); ctx.lineTo(x - 3, y2 - 2)
      ctx.strokeStyle = isHi2 ? cap.color : cap.color.replace(/[\d.]+\)$/, '0.15)')
      ctx.lineWidth = isHi2 ? 2 : 1; ctx.stroke()

      // label
      ctx.font = `${isHi2 ? '700' : '600'} ${Math.max(7, 8 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = isHi2 ? cap.color : cap.color.replace(/[\d.]+\)$/, '0.25)')
      ctx.fillText(cap.label, x, (y1 + y2) / 2 + 3)

      ctx.font = `500 ${Math.max(5, 5.5 * S)}px ${FONT_MONO}`
      ctx.fillText(cap.value, x, (y1 + y2) / 2 + 13)
    }

    // ── SPIROMETRY TRACE (real-time waveform)
    ctx.beginPath()
    for (let i = 0; i < s.traceHistory.length; i++) {
      const x = gL + (i / s.traceHistory.length) * gW
      const y = volToY(s.traceHistory[i])
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.strokeStyle = COL_TRACE; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke()

    // current value marker
    if (s.traceHistory.length > 0) {
      const lastX = gR
      const lastY = volToY(s.traceHistory[s.traceHistory.length - 1])
      ctx.beginPath(); ctx.arc(lastX, lastY, 4, 0, Math.PI * 2)
      ctx.fillStyle = COL_TRACE; ctx.fill()

      // current volume text
      ctx.font = `700 ${Math.max(9, 11 * S)}px ${FONT_MONO}`
      ctx.textAlign = 'left'
      ctx.fillStyle = COL_TRACE
      ctx.fillText(`${Math.round(currentVol)} mL`, lastX + 8, lastY + 4)
    }

    // ── DEAD SPACE INFO (bottom)
    const dsY = h - 30 * S
    ctx.font = `600 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.fillText('Espaços Mortos:', 15, dsY)
    ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('Anatômico: 150mL  •  Alveolar: ≈0mL (normal)  •  Fisiológico = Anat + Alv', 15, dsY + 12)

    // ── phase labels on trace
    ctx.font = `500 ${Math.max(5, 6 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    const traceLen = s.traceHistory.length
    if (traceLen > 50) {
      // find where max inspiration happens
      const maxIdx = s.traceHistory.indexOf(Math.max(...s.traceHistory))
      if (maxIdx > 10 && maxIdx < traceLen - 10) {
        const mx = gL + (maxIdx / traceLen) * gW
        ctx.fillStyle = 'rgba(45, 212, 191, 0.3)'
        ctx.fillText('Insp. Máx', mx, volToY(LVRI) - 8)
      }
      const minIdx = s.traceHistory.indexOf(Math.min(...s.traceHistory))
      if (minIdx > 10 && minIdx < traceLen - 10) {
        const mx = gL + (minIdx / traceLen) * gW
        ctx.fillStyle = 'rgba(244, 63, 94, 0.3)'
        ctx.fillText('Exp. Máx', mx, volToY(VR) + 14)
      }
    }
  }, [highlight])

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

  const info = highlight ? VOLUME_INFO[highlight] : null

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas ref={canvasRef} className="w-full rounded-2xl" style={{ aspectRatio: '16/9', background: COL_BG }} />
      {/* Volume/Capacity buttons */}
      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 max-w-[200px]">
        {(['vc', 'vri', 'vre', 'vr'] as VolumeHighlight[]).map(v => (
          <button key={v!} onClick={() => setHighlight(prev => prev === v ? null : v)}
            className={`px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-wider transition-all ${
              highlight === v ? 'bg-white/10 text-white/80 border border-white/20' : 'text-white/25 hover:text-white/50 border border-transparent'
            }`}>{v!.toUpperCase()}</button>
        ))}
        {(['ci', 'crf', 'cv', 'cpt'] as VolumeHighlight[]).map(v => (
          <button key={v!} onClick={() => setHighlight(prev => prev === v ? null : v)}
            className={`px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-wider transition-all ${
              highlight === v ? 'bg-white/10 text-white/80 border border-white/20' : 'text-white/20 hover:text-white/40 border border-transparent'
            }`}>{v!.toUpperCase()}</button>
        ))}
      </div>
      {info && (
        <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md px-4 py-2.5" style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="h-2 w-2 rounded-full" style={{ background: info.color }} />
            <span className="text-[11px] font-semibold text-white/90">{info.name}</span>
            <span className="text-[11px] font-bold ml-auto" style={{ color: info.color }}>{info.value}</span>
          </div>
          <p className="text-[9px] text-white/45">{info.desc}</p>
        </div>
      )}
    </div>
  )
}
