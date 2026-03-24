'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

/* ──────────────────────────────────────────────────────────────
   LOOPS — Análise Gráfica VM
   Loop P×V: Pressão × Volume (independente do modo)
   Loop F×V: Fluxo × Volume (independente do modo)
   WOB: Work of Breathing
   ────────────────────────────────────────────────────────────── */

type View = 'pv' | 'pv-histerese' | 'fv-normal' | 'fv-obstruct' | 'fv-restrict' | 'wob-normal' | 'wob-exp' | 'wob-insp-exp'

const C = {
  insp: '#38bdf8',
  exp: '#f87171',
  wobInsp: 'rgba(56,189,248,0.22)',
  wobExp: 'rgba(248,113,113,0.22)',
  histerese: 'rgba(147,130,255,0.15)',
  grid: 'rgba(255,255,255,0.08)',
  gridMajor: 'rgba(255,255,255,0.18)',
  bg: '#111111',
  text: 'rgba(255,255,255,0.5)',
  label: '#ffffff',
  annotation: '#fbbf24',
  ref: 'rgba(255,255,255,0.15)',
}

export function RespiratoryVmiLoopsSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [view, setView] = useState<View>('pv')
  const frameRef = useRef(0)
  const progressRef = useRef(0)

  /* ── P×V generator ── */
  const generatePV = useCallback((steps: number) => {
    const pts: { x: number; y: number; phase: 'insp' | 'exp' }[] = []
    const n = Math.floor(steps / 2)
    const peep = 5, vt = 600, pip = 25

    // Inspiration: sigmoid-like curve (lower limb)
    for (let i = 0; i <= n; i++) {
      const f = i / n
      // S-shaped compliance curve
      const p = peep + (pip - peep) * f
      const v = vt * (1 - Math.exp(-f * 3.2)) * (0.85 + 0.15 * f)
      pts.push({ x: p, y: v, phase: 'insp' })
    }
    // Expiration: returns above inspiration (hysteresis)
    for (let i = 0; i <= n; i++) {
      const f = i / n
      const p = pip - (pip - peep) * f
      // Expiration curve sits ABOVE inspiration at same pressure
      const v = vt * Math.pow(1 - f, 0.55)
      pts.push({ x: p, y: v, phase: 'exp' })
    }
    return pts
  }, [])

  /* ── F×V generators ── */
  const generateFV = useCallback((type: 'normal' | 'obstruct' | 'restrict', steps: number) => {
    const pts: { x: number; y: number; phase: 'insp' | 'exp' }[] = []
    const n = Math.floor(steps / 2)

    const vcUsed = type === 'restrict' ? 300 : type === 'obstruct' ? 450 : 500
    const flowI = type === 'restrict' ? 40 : 50
    const flowE = type === 'restrict' ? -80 : type === 'obstruct' ? -18 : -45
    const autoPeepVol = type === 'obstruct' ? 70 : 0

    // Inspiration: rapid rise then constant (VCV-like square wave)
    for (let i = 0; i <= n; i++) {
      const f = i / n
      const ramp = Math.min(f * 12, 1)
      const v = autoPeepVol + (vcUsed - autoPeepVol) * f
      const fl = flowI * ramp * (1 - 0.05 * f) // slight droop
      pts.push({ x: v, y: fl, phase: 'insp' })
    }

    // Expiration
    for (let i = 0; i <= n; i++) {
      const f = i / n
      const v = vcUsed - (vcUsed - autoPeepVol) * f

      let fl: number
      if (type === 'obstruct') {
        // Low peak, very slow decay, doesn't reach zero (auto-PEEP)
        const peak = Math.min(f * 8, 1)
        const decay = Math.exp(-f * 1.2)
        fl = flowE * peak * decay
        // Flow limitation: constant low flow (square root sign)
        if (f > 0.12) fl = Math.max(fl, flowE * 0.35)
      } else if (type === 'restrict') {
        // Very high peak, returns very fast
        const peak = Math.min(f * 10, 1)
        fl = flowE * peak * Math.exp(-f * 3.5)
      } else {
        // Normal: moderate peak, exponential return to zero
        const peak = Math.min(f * 8, 1)
        fl = flowE * peak * Math.exp(-f * 2.5)
      }
      pts.push({ x: v, y: fl, phase: 'exp' })
    }
    return pts
  }, [])

  /* ── WOB generator (P×V with diagonal reference) ── */
  const generateWOB = useCallback((type: 'normal' | 'exp' | 'insp-exp', steps: number) => {
    const pts: { x: number; y: number; phase: 'insp' | 'exp' }[] = []
    const n = Math.floor(steps / 2)
    const peep = 5, vt = 500

    let pip: number
    if (type === 'exp') pip = 22 // bronchospasm: more exp resistance
    else if (type === 'insp-exp') pip = 28 // kinked ETT: both increased
    else pip = 20

    for (let i = 0; i <= n; i++) {
      const f = i / n
      const p = peep + (pip - peep) * f
      let v: number
      if (type === 'insp-exp') {
        // More bowing out on inspiration (increased insp work)
        v = vt * Math.pow(f, 1.4)
      } else {
        v = vt * (1 - Math.exp(-f * 3)) * (0.88 + 0.12 * f)
      }
      pts.push({ x: p, y: v, phase: 'insp' })
    }
    for (let i = 0; i <= n; i++) {
      const f = i / n
      let v: number, p: number
      if (type === 'exp') {
        // Expiratory limb bows outward more (increased exp work / bronchospasm)
        p = pip - (pip - peep) * f
        v = vt * Math.pow(1 - f, 0.35)
      } else if (type === 'insp-exp') {
        p = pip - (pip - peep) * f
        v = vt * Math.pow(1 - f, 0.4)
      } else {
        p = pip - (pip - peep) * f
        v = vt * Math.pow(1 - f, 0.55)
      }
      pts.push({ x: p, y: v, phase: 'exp' })
    }
    return pts
  }, [])

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const W = cvs.clientWidth
    const H = cvs.clientHeight
    cvs.width = W * dpr
    cvs.height = H * dpr
    ctx.scale(dpr, dpr)

    const pad = { top: 34, bot: 42, left: 58, right: 24 }
    const gW = W - pad.left - pad.right
    const gH = H - pad.top - pad.bot

    const steps = 300
    let pts: { x: number; y: number; phase: string }[]
    let xMin: number, xMax: number, yMin: number, yMax: number
    let title: string, xAxis: string, yAxis: string
    const isFV = view.startsWith('fv')
    const isPV = view === 'pv' || view === 'pv-histerese'
    const isWOB = view.startsWith('wob')

    if (isPV) {
      pts = generatePV(steps)
      xMin = 0; xMax = 30; yMin = -30; yMax = 680
      title = view === 'pv-histerese' ? 'Loop P × V — Histerese' : 'Loop P × V'
      xAxis = 'Pressão (cmH₂O)'; yAxis = 'Volume (mL)'
    } else if (isWOB) {
      const type = view === 'wob-exp' ? 'exp' : view === 'wob-insp-exp' ? 'insp-exp' : 'normal'
      pts = generateWOB(type, steps)
      xMin = 0; xMax = 32; yMin = -30; yMax = 580
      title = view === 'wob-normal' ? 'WOB — Normal' : view === 'wob-exp' ? 'WOB — ↑ Trabalho Expiratório' : 'WOB — ↑ Trabalho Insp + Exp'
      xAxis = 'Pressão (cmH₂O)'; yAxis = 'Volume (mL)'
    } else {
      const type = view === 'fv-restrict' ? 'restrict' : view === 'fv-obstruct' ? 'obstruct' : 'normal'
      pts = generateFV(type, steps)
      xMin = -30; xMax = 560; yMin = -100; yMax = 70
      title = view === 'fv-normal' ? 'Loop F × V — Normal' : view === 'fv-restrict' ? 'Loop F × V — Restritivo' : 'Loop F × V — Obstrutivo'
      xAxis = 'Volume (mL)'; yAxis = 'Fluxo (L/min)'
    }

    const toX = (v: number) => pad.left + ((v - xMin) / (xMax - xMin)) * gW
    const toY = (v: number) => pad.top + gH - ((v - yMin) / (yMax - yMin)) * gH

    let prevTime = performance.now()

    const draw = (now: number) => {
      const dt = (now - prevTime) / 1000
      prevTime = now
      progressRef.current = (progressRef.current + dt * 0.35) % 1

      ctx.fillStyle = C.bg
      ctx.fillRect(0, 0, W, H)

      // Title
      ctx.fillStyle = C.label
      ctx.font = 'bold 12px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(title, W / 2, 18)

      // Grid
      ctx.strokeStyle = C.grid; ctx.lineWidth = 0.5
      for (let i = 0; i <= 6; i++) {
        const y = pad.top + (gH / 6) * i
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke()
        const x = pad.left + (gW / 6) * i
        ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + gH); ctx.stroke()
      }

      // Axes
      ctx.strokeStyle = C.gridMajor; ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(pad.left, pad.top); ctx.lineTo(pad.left, pad.top + gH); ctx.lineTo(W - pad.right, pad.top + gH)
      ctx.stroke()

      // Zero line for F×V
      if (isFV) {
        const zeroY = toY(0)
        ctx.strokeStyle = C.gridMajor; ctx.lineWidth = 0.8
        ctx.beginPath(); ctx.moveTo(pad.left, zeroY); ctx.lineTo(W - pad.right, zeroY); ctx.stroke()
      }

      // Axis labels
      ctx.fillStyle = C.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center'
      ctx.fillText(xAxis, pad.left + gW / 2, H - 6)
      ctx.save(); ctx.translate(13, pad.top + gH / 2); ctx.rotate(-Math.PI / 2)
      ctx.fillText(yAxis, 0, 0); ctx.restore()

      // Axis values
      ctx.fillStyle = C.text; ctx.font = '9px monospace'
      const xMid = Math.round((xMin + xMax) / 2)
      ctx.textAlign = 'center'
      ctx.fillText(String(Math.round(xMin)), toX(xMin), H - 24)
      ctx.fillText(String(xMid), toX(xMid), H - 24)
      ctx.fillText(String(Math.round(xMax)), toX(xMax), H - 24)
      ctx.textAlign = 'right'
      ctx.fillText(String(Math.round(yMax)), pad.left - 4, pad.top + 10)
      ctx.fillText(String(Math.round(yMin)), pad.left - 4, pad.top + gH)
      ctx.fillText(String(Math.round((yMin + yMax) / 2)), pad.left - 4, toY((yMin + yMax) / 2) + 3)

      // ── WOB: draw diagonal compliance reference line ──
      if (isWOB) {
        const inspPts = pts.filter(p => p.phase === 'insp')
        const expPts = pts.filter(p => p.phase === 'exp')
        const pStart = inspPts[0], pEnd = inspPts[inspPts.length - 1]
        if (pStart && pEnd) {
          // Reference diagonal = passive compliance line from (PEEP,0) to (PIP,Vt)
          ctx.strokeStyle = C.ref; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5])
          ctx.beginPath(); ctx.moveTo(toX(pStart.x), toY(pStart.y)); ctx.lineTo(toX(pEnd.x), toY(pEnd.y)); ctx.stroke()
          ctx.setLineDash([])

          // Fill WOB INSP area (between inspiration curve and diagonal)
          ctx.beginPath()
          inspPts.forEach((p, i) => {
            const sx = toX(p.x), sy = toY(p.y)
            if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy)
          })
          // Back along diagonal
          ctx.lineTo(toX(pStart.x), toY(pStart.y))
          ctx.closePath()
          ctx.fillStyle = C.wobInsp; ctx.fill()

          // Fill WOB EXP area (between expiration curve and diagonal)
          ctx.beginPath()
          expPts.forEach((p, i) => {
            const sx = toX(p.x), sy = toY(p.y)
            if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy)
          })
          ctx.lineTo(toX(pStart.x), toY(pStart.y))
          ctx.closePath()
          ctx.fillStyle = C.wobExp; ctx.fill()

          // WOB labels
          ctx.font = 'bold 10px system-ui'
          ctx.fillStyle = C.insp; ctx.textAlign = 'center'
          ctx.fillText('WOB INSP', toX((pStart.x + pEnd.x) / 2) + 16, toY(pEnd.y * 0.35))
          ctx.fillStyle = C.exp
          ctx.fillText('WOB EXP', toX((pStart.x + pEnd.x) / 2) - 10, toY(pEnd.y * 0.72))
        }
      }

      // ── P×V histerese: fill area between curves ──
      if (view === 'pv-histerese') {
        const inspPts = pts.filter(p => p.phase === 'insp')
        const expPts = pts.filter(p => p.phase === 'exp')
        ctx.beginPath()
        inspPts.forEach((p, i) => {
          if (i === 0) ctx.moveTo(toX(p.x), toY(p.y)); else ctx.lineTo(toX(p.x), toY(p.y))
        })
        ;[...expPts].forEach((p) => ctx.lineTo(toX(p.x), toY(p.y)))
        ctx.closePath()
        ctx.fillStyle = C.histerese; ctx.fill()
      }

      // ── Draw curves ──
      const inspPts = pts.filter(p => p.phase === 'insp')
      const expPts = pts.filter(p => p.phase === 'exp')

      // Inspiration
      ctx.beginPath(); ctx.strokeStyle = C.insp; ctx.lineWidth = 2.5
      inspPts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(toX(p.x), toY(p.y)); else ctx.lineTo(toX(p.x), toY(p.y))
      })
      ctx.stroke()

      // Expiration
      ctx.beginPath(); ctx.strokeStyle = C.exp; ctx.lineWidth = 2.5
      expPts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(toX(p.x), toY(p.y)); else ctx.lineTo(toX(p.x), toY(p.y))
      })
      ctx.stroke()

      // ── Direction arrows ──
      const drawArrow = (arr: typeof pts, at: number, color: string) => {
        if (at < 1 || at >= arr.length) return
        const p0 = arr[at - 1], p1 = arr[at]
        if (!p0 || !p1) return
        const x0 = toX(p0.x), y0 = toY(p0.y), x1 = toX(p1.x), y1 = toY(p1.y)
        const angle = Math.atan2(y1 - y0, x1 - x0)
        ctx.save(); ctx.translate(x1, y1); ctx.rotate(angle)
        ctx.fillStyle = color; ctx.beginPath()
        ctx.moveTo(0, 0); ctx.lineTo(-10, -5); ctx.lineTo(-10, 5); ctx.closePath(); ctx.fill()
        ctx.restore()
      }
      if (inspPts.length > 4) drawArrow(inspPts, Math.floor(inspPts.length * 0.5), C.insp)
      if (expPts.length > 4) drawArrow(expPts, Math.floor(expPts.length * 0.5), C.exp)

      // ── Animated dot ──
      const totalPts = pts.length
      const animIdx = Math.floor(progressRef.current * totalPts)
      if (animIdx < totalPts) {
        const ap = pts[animIdx]
        ctx.beginPath(); ctx.arc(toX(ap.x), toY(ap.y), 5, 0, Math.PI * 2)
        ctx.fillStyle = ap.phase === 'exp' ? C.exp : C.insp; ctx.fill()
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke()
      }

      // ── Annotations ──
      ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left'

      if (isPV) {
        ctx.fillStyle = C.annotation
        ctx.fillText('PIP', toX(25) + 4, toY(600) + 4)
        ctx.fillText('PEEP', toX(5) + 4, toY(0) + 14)
        ctx.fillText('Vt = 600 mL', toX(1), toY(600) - 6)
        ctx.fillStyle = C.insp; ctx.fillText('Inspiração', toX(15), toY(180))
        ctx.fillStyle = C.exp; ctx.fillText('Expiração', toX(8), toY(440))
        if (view === 'pv-histerese') {
          ctx.fillStyle = 'rgba(147,130,255,0.7)'; ctx.font = 'bold 11px system-ui'
          ctx.fillText('Histerese', toX(12), toY(320))
          ctx.font = '9px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.4)'
          ctx.fillText('Pressão > para abrir alvéolos fechados', toX(8), toY(320) + 14)
          ctx.fillText('vs. esvaziar alvéolos já abertos', toX(8), toY(320) + 26)
        }
      }

      if (view === 'fv-normal') {
        ctx.fillStyle = C.annotation
        // Numbered markers
        const markers = [
          { n: '1', label: 'Disparo', x: 10, y: 5 },
          { n: '2', label: 'Pico fluxo insp', x: 80, y: 50 },
          { n: '3', label: 'Ciclagem', x: 500, y: 5 },
          { n: '4', label: 'Volume atingido', x: 500, y: -5 },
          { n: '5', label: 'Pico fluxo exp', x: 420, y: -45 },
          { n: '6', label: 'Constantes de tempo', x: 250, y: -5 },
        ]
        markers.forEach(m => {
          const mx = toX(m.x), my = toY(m.y)
          // Circle
          ctx.beginPath(); ctx.arc(mx, my, 8, 0, Math.PI * 2)
          ctx.strokeStyle = C.annotation; ctx.lineWidth = 1.5; ctx.stroke()
          ctx.fillStyle = C.annotation; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'center'
          ctx.fillText(m.n, mx, my + 3)
        })
        // Legend
        ctx.font = '9px system-ui'; ctx.textAlign = 'left'; ctx.fillStyle = C.annotation
        const legendX = toX(20), legendY = toY(-35)
        markers.forEach((m, i) => {
          ctx.fillText(`${m.n} = ${m.label}`, legendX, legendY + i * 12)
        })
        ctx.fillStyle = C.insp; ctx.font = 'bold 10px system-ui'
        ctx.fillText('Fase Inspiratória', toX(150), toY(35))
        ctx.fillStyle = C.exp
        ctx.fillText('Fase Expiratória', toX(150), toY(-30))
      }

      if (view === 'fv-obstruct') {
        ctx.fillStyle = C.annotation; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left'
        ctx.fillText('TRÍADE DA OBSTRUÇÃO', toX(200), toY(55))
        ctx.font = '9px system-ui'
        ctx.fillText('1. Pico fluxo exp BAIXO', toX(200), toY(55) + 14)
        ctx.fillText('2. Constantes de tempo equivalentes', toX(200), toY(55) + 26)
        ctx.fillText('3. Auto-PEEP (loop não fecha)', toX(200), toY(55) + 38)
        // Auto-PEEP marker
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3])
        const apX = toX(70)
        ctx.beginPath(); ctx.moveTo(apX, toY(-20)); ctx.lineTo(apX, toY(20)); ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = '#ef4444'; ctx.font = '9px system-ui'
        ctx.fillText('Auto-PEEP', toX(70) + 4, toY(20) + 12)
        ctx.fillText('Ar aprisionado', toX(70) + 4, toY(20) + 24)
        // RC_exp note
        ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '9px system-ui'
        ctx.fillText('RC_exp > 0.7s (DPOC)', toX(200), toY(55) + 54)
      }

      if (view === 'fv-restrict') {
        ctx.fillStyle = C.annotation; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left'
        ctx.fillText('PADRÃO RESTRITIVO', toX(120), toY(55))
        ctx.font = '9px system-ui'
        ctx.fillText('1. Pico fluxo exp ELEVADO', toX(120), toY(55) + 14)
        ctx.fillText('2. Alta elastância → ar sai rápido', toX(120), toY(55) + 26)
        ctx.fillText('3. VC reduzido (300 mL)', toX(120), toY(55) + 38)
        ctx.fillText('RC_exp < 0.5s (SDRA)', toX(120), toY(55) + 54)
      }

      if (isWOB && view !== 'wob-normal') {
        ctx.fillStyle = C.annotation; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'left'
        if (view === 'wob-exp') {
          ctx.fillText('↑ Resistência expiratória', toX(10), toY(-15))
          ctx.fillText('(broncoespasmo, secreção)', toX(10), toY(-15) + 12)
        } else {
          ctx.fillText('↑ Resistência insp + exp', toX(10), toY(-15))
          ctx.fillText('(TOT dobrado/mordido)', toX(10), toY(-15) + 12)
        }
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameRef.current)
  }, [view, generatePV, generateFV, generateWOB])

  const Tab = ({ id, label, active, color }: { id: View; label: string; active: boolean; color: string }) => (
    <button onClick={() => setView(id)}
      className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${
        active ? `${color} ring-1` : 'bg-white/5 text-white/60 hover:bg-white/10'
      }`}>{label}</button>
  )

  const isPV = view === 'pv' || view === 'pv-histerese'
  const isFV = view.startsWith('fv')
  const isWOB = view.startsWith('wob')

  return (
    <div className={`rounded-xl overflow-hidden bg-[#111] ${className ?? ''}`}>
      <div className="flex flex-wrap gap-1 p-2.5 bg-black/40 border-b border-white/10">
        <span className="text-white/40 text-[10px] self-center mr-0.5">P×V:</span>
        <Tab id="pv" label="Normal" active={view === 'pv'} color="bg-blue-500/30 text-blue-300 ring-blue-500/50" />
        <Tab id="pv-histerese" label="Histerese" active={view === 'pv-histerese'} color="bg-purple-500/30 text-purple-300 ring-purple-500/50" />
        <div className="w-px bg-white/10 mx-0.5" />
        <span className="text-white/40 text-[10px] self-center mr-0.5">F×V:</span>
        <Tab id="fv-normal" label="Normal" active={view === 'fv-normal'} color="bg-emerald-500/30 text-emerald-300 ring-emerald-500/50" />
        <Tab id="fv-obstruct" label="Obstrutivo" active={view === 'fv-obstruct'} color="bg-red-500/30 text-red-300 ring-red-500/50" />
        <Tab id="fv-restrict" label="Restritivo" active={view === 'fv-restrict'} color="bg-amber-500/30 text-amber-300 ring-amber-500/50" />
        <div className="w-px bg-white/10 mx-0.5" />
        <span className="text-white/40 text-[10px] self-center mr-0.5">WOB:</span>
        <Tab id="wob-normal" label="Normal" active={view === 'wob-normal'} color="bg-teal-500/30 text-teal-300 ring-teal-500/50" />
        <Tab id="wob-exp" label="↑ Exp" active={view === 'wob-exp'} color="bg-orange-500/30 text-orange-300 ring-orange-500/50" />
        <Tab id="wob-insp-exp" label="↑ Insp+Exp" active={view === 'wob-insp-exp'} color="bg-rose-500/30 text-rose-300 ring-rose-500/50" />
      </div>

      <canvas ref={canvasRef} className="w-full" style={{ height: 420 }} />

      <div className="p-3 bg-black/40 border-t border-white/10 text-[10px] space-y-1">
        <div className="flex gap-4">
          <span className="text-blue-400">● Inspiração</span>
          <span className="text-red-400">● Expiração</span>
        </div>
        {isPV && <p className="text-white/40">Loop P×V mostra a relação Pressão × Volume durante o ciclo respiratório. Independente do modo (VCV ou PCV). A histerese reflete a diferença entre abrir alvéolos fechados vs. esvaziar alvéolos já abertos.</p>}
        {view === 'fv-normal' && <p className="text-white/40">Loop F×V normal: 1=Disparo, 2=Pico fluxo insp, 3=Ciclagem, 4=Volume atingido, 5=Pico fluxo exp, 6=Constantes de tempo. Loop fecha na origem.</p>}
        {view === 'fv-obstruct' && <p className="text-white/40">Obstrutivo (DPOC/broncoespasmo): Tríade — pico exp ↓, constantes de tempo equivalentes, auto-PEEP. Sinal da raiz quadrada em obstrução severa (compressão de vias aéreas de pequeno calibre). RC_exp {'>'} 0.7s.</p>}
        {view === 'fv-restrict' && <p className="text-white/40">Restritivo (SDRA/fibrose): Pico exp ELEVADO (alta elastância empurra ar rapidamente), VC reduzido. Loop comprimido horizontalmente. RC_exp {'<'} 0.5s.</p>}
        {view === 'wob-normal' && <p className="text-white/40">WOB (Work of Breathing): Área entre a curva e a diagonal de complacência. WOB INSP = trabalho para vencer resistência inspiratória. WOB EXP = trabalho expiratório ativo (normalmente passivo).</p>}
        {view === 'wob-exp' && <p className="text-white/40">Aumento do trabalho expiratório: broncoespasmo, secreção — a curva expiratória se afasta mais da diagonal. Aumenta resistência de via aérea na expiração.</p>}
        {view === 'wob-insp-exp' && <p className="text-white/40">Aumento do trabalho insp + exp: TOT dobrado (kinked) ou mordido (bitten ETT). Aumenta resistência em ambas as fases. Ambas as áreas WOB crescem.</p>}
      </div>
    </div>
  )
}
