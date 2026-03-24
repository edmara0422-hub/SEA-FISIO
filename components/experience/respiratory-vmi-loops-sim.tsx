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

  /* ── P×V generator ──
     Hysteresis: at the SAME volume, pressure is HIGHER during inspiration
     than during expiration. So the inspiration limb sits to the RIGHT
     and expiration limb to the LEFT. They meet at (PEEP,0) and (PIP,Vt).
  */
  const generatePV = useCallback((steps: number) => {
    const pts: { x: number; y: number; phase: 'insp' | 'exp' }[] = []
    const n = Math.floor(steps / 2)
    const peep = 5, vt = 600, pip = 25

    // Inspiration (lower-right limb): volume 0→Vt
    // p = PEEP + (PIP-PEEP) * (V/Vt)^0.7  → bows RIGHT (higher P at mid-V)
    for (let i = 0; i <= n; i++) {
      const f = i / n
      const v = vt * f
      const p = peep + (pip - peep) * Math.pow(f, 0.7)
      pts.push({ x: p, y: v, phase: 'insp' })
    }
    // Expiration (upper-left limb): volume Vt→0
    // p = PEEP + (PIP-PEEP) * (V/Vt)^1.4  → bows LEFT (lower P at mid-V)
    for (let i = 0; i <= n; i++) {
      const f = i / n // 0=top(Vt), 1=bottom(0)
      const vfrac = 1 - f
      const v = vt * vfrac
      const p = peep + (pip - peep) * Math.pow(vfrac, 1.4)
      pts.push({ x: p, y: v, phase: 'exp' })
    }
    return pts
  }, [])

  /* ── Linear interpolation for straight segments (inspiration) ── */
  const linear = (pts: [number, number][], n: number, phase: 'insp' | 'exp') => {
    const out: { x: number; y: number; phase: 'insp' | 'exp' }[] = []
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * (pts.length - 1)
      const idx = Math.min(Math.floor(t), pts.length - 2)
      const f = t - idx
      const x = pts[idx][0] + (pts[idx + 1][0] - pts[idx][0]) * f
      const y = pts[idx][1] + (pts[idx + 1][1] - pts[idx][1]) * f
      out.push({ x, y, phase })
    }
    return out
  }

  /* ── Exponential decay curve for expiration ── */
  const expCurve = (vStart: number, vEnd: number, peakFlow: number, n: number, tau: number) => {
    const out: { x: number; y: number; phase: 'exp' }[] = []
    for (let i = 0; i <= n; i++) {
      const f = i / n
      const v = vStart + (vEnd - vStart) * f
      const flow = peakFlow * Math.exp(-f * tau)
      out.push({ x: v, y: flow, phase: 'exp' as const })
    }
    return out
  }

  const generateFV = useCallback((type: 'normal' | 'obstruct' | 'restrict') => {
    // Key points: [volume, flow]
    // Traced from real ventilator images

    if (type === 'normal') {
      // Inspiration: straight lines (like real ventilator)
      const insp = linear([
        [0, 0],        // 1. Disparo
        [30, 95],      // 2. Pico insp (vertical rise)
        [600, 35],     // straight descending ramp
        [650, 12],     // 3. Ciclagem
        [700, 0],      // crosses zero
      ], 100, 'insp')

      // Transition: vertical drop to peak exp
      const drop = linear([
        [700, 0],      // 4. Volume atingido
        [685, -70],    // 5. Pico exp (nearly vertical)
      ], 10, 'exp')

      // Expiration: smooth exponential decay back to origin
      const exp = expCurve(685, 0, -70, 100, 3.5)

      return [...insp, ...drop, ...exp]
    }

    if (type === 'obstruct') {
      const insp = linear([
        [0, 0],
        [20, 24],
        [420, 16],     // straight descending ramp
        [450, 6],
        [470, 0],
      ], 100, 'insp')

      // Exp: tiny drop then flat line (flow limitation), doesn't close
      const drop = linear([[470, 0], [460, -8]], 8, 'exp')
      // Very slow decay — almost flat
      const exp = expCurve(460, 60, -8, 100, 0.3) // tau=0.3 = very slow, ends at vol=60 (auto-PEEP)

      return [...insp, ...drop, ...exp]
    }

    // Restrictive: diamond shape
    const insp = linear([
      [0, 0],
      [15, 60],
      [60, 65],        // peak
      [150, 25],
      [200, 0],        // small VC
    ], 100, 'insp')

    const drop = linear([[200, 0], [190, -95]], 8, 'exp')
    const exp = expCurve(190, 0, -95, 100, 5) // tau=5 = very fast return (alta elastância)

    return [...insp, ...drop, ...exp]
  }, [])

  /* ── WOB generator (P×V with diagonal reference) ──
     Same hysteresis principle. WOB = area between curve and compliance diagonal.
     More bowing = more work.
     - normal: moderate hysteresis
     - exp (bronchospasm): expiration bows further LEFT (more exp work)
     - insp-exp (kinked ETT): both limbs bow further out (more total work)
  */
  const generateWOB = useCallback((type: 'normal' | 'exp' | 'insp-exp', steps: number) => {
    const pts: { x: number; y: number; phase: 'insp' | 'exp' }[] = []
    const n = Math.floor(steps / 2)
    const peep = 5, vt = 500
    const pip = type === 'insp-exp' ? 28 : type === 'exp' ? 22 : 20

    // Inspiration exponents: lower = bows more RIGHT (more insp work)
    const inspExp = type === 'insp-exp' ? 0.5 : 0.7
    // Expiration exponents: higher = bows more LEFT (more exp work)
    const expExp = type === 'exp' ? 2.0 : type === 'insp-exp' ? 1.8 : 1.4

    // Inspiration (right limb)
    for (let i = 0; i <= n; i++) {
      const f = i / n
      const v = vt * f
      const p = peep + (pip - peep) * Math.pow(f, inspExp)
      pts.push({ x: p, y: v, phase: 'insp' })
    }
    // Expiration (left limb)
    for (let i = 0; i <= n; i++) {
      const f = i / n
      const vfrac = 1 - f
      const v = vt * vfrac
      const p = peep + (pip - peep) * Math.pow(vfrac, expExp)
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
      pts = generateFV(type)
      xMin = 0
      xMax = type === 'restrict' ? 240 : type === 'obstruct' ? 520 : 800
      yMin = type === 'restrict' ? -120 : type === 'obstruct' ? -15 : -100
      yMax = type === 'restrict' ? 80 : type === 'obstruct' ? 30 : 120
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

      // Direction labels instead of arrows (arrows create visual artifacts on curves)
      if (isFV) {
        ctx.font = 'bold 9px system-ui'
        ctx.fillStyle = C.insp; ctx.textAlign = 'left'
        const inspMid = inspPts[Math.floor(inspPts.length * 0.4)]
        if (inspMid) ctx.fillText('→', toX(inspMid.x) + 4, toY(inspMid.y) - 6)
        ctx.fillStyle = C.exp
        const expMid = expPts[Math.floor(expPts.length * 0.5)]
        if (expMid) ctx.fillText('←', toX(expMid.x) - 10, toY(expMid.y) + 14)
      }

      // (animated dot removed — clean loop like real ventilator)

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
        const markers = [
          { n: '1', label: 'Disparo', x: 0, y: 0 },
          { n: '2', label: 'Pico fluxo insp', x: 30, y: 95 },
          { n: '3', label: 'Ciclagem', x: 650, y: 12 },
          { n: '4', label: 'Volume atingido', x: 700, y: 0 },
          { n: '5', label: 'Pico fluxo exp', x: 680, y: -70 },
          { n: '6', label: 'Constantes de tempo', x: 450, y: -28 },
        ]
        markers.forEach(m => {
          const mx = toX(m.x), my = toY(m.y)
          // Circle
          ctx.beginPath(); ctx.arc(mx, my, 8, 0, Math.PI * 2)
          ctx.strokeStyle = C.annotation; ctx.lineWidth = 1.5; ctx.stroke()
          ctx.fillStyle = C.annotation; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'center'
          ctx.fillText(m.n, mx, my + 3)
        })
        // Legend on the right side
        ctx.font = '9px system-ui'; ctx.textAlign = 'left'; ctx.fillStyle = C.annotation
        const legendX = W - pad.right - 135, legendY = pad.top + 10
        markers.forEach((m, i) => {
          ctx.fillText(`${m.n} = ${m.label}`, legendX, legendY + i * 13)
        })
        ctx.fillStyle = C.insp; ctx.font = 'bold 10px system-ui'
        ctx.fillText('Fase Inspiratória', toX(200), toY(60))
        ctx.fillStyle = C.exp
        ctx.fillText('Fase Expiratória', toX(200), toY(-40))
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
