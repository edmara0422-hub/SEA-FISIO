'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

/* ──────────────────────────────────────────────────────────────
   LOOPS P×V e F×V — Análise Gráfica VM
   P×V: VCV (triangular) / PCV (retangular) + histerese + WOB
   F×V: Normal / Restritivo / Obstrutivo + auto-PEEP
   ────────────────────────────────────────────────────────────── */

type LoopType = 'pv-vcv' | 'pv-pcv' | 'fv-normal' | 'fv-restrict' | 'fv-obstruct'

const LABELS: Record<LoopType, { title: string; xAxis: string; yAxis: string }> = {
  'pv-vcv':      { title: 'Loop P × V — VCV',          xAxis: 'Pressão (cmH₂O)', yAxis: 'Volume (mL)' },
  'pv-pcv':      { title: 'Loop P × V — PCV',          xAxis: 'Pressão (cmH₂O)', yAxis: 'Volume (mL)' },
  'fv-normal':   { title: 'Loop F × V — Normal',       xAxis: 'Volume (mL)',      yAxis: 'Fluxo (L/min)' },
  'fv-restrict': { title: 'Loop F × V — Restritivo',   xAxis: 'Volume (mL)',      yAxis: 'Fluxo (L/min)' },
  'fv-obstruct': { title: 'Loop F × V — Obstrutivo',   xAxis: 'Volume (mL)',      yAxis: 'Fluxo (L/min)' },
}

const C = {
  insp: '#38bdf8',     // blue - inspiration
  exp: '#f87171',      // red - expiration
  fill: 'rgba(56,189,248,0.08)',
  fillExp: 'rgba(248,113,113,0.08)',
  grid: 'rgba(255,255,255,0.08)',
  gridMajor: 'rgba(255,255,255,0.18)',
  bg: '#111111',
  text: 'rgba(255,255,255,0.5)',
  label: '#ffffff',
  annotation: '#fbbf24',
}

export function RespiratoryVmiLoopsSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loopType, setLoopType] = useState<LoopType>('pv-vcv')
  const frameRef = useRef(0)
  const progressRef = useRef(0)

  // VCV params
  const peep = 5, ppeak = 30, pplat = 22, vc = 500
  // PCV params
  const pc = 15, pinsp = peep + pc, vcPcv = 450
  // Flow params
  const flowInsp = 50, flowExpPeak = -40

  const generatePVvcv = useCallback((steps: number) => {
    const pts: { x: number; y: number; phase: 'insp' | 'exp' | 'pause' }[] = []
    const n = Math.floor(steps / 3)

    // Inspiration: P ramps linearly from PEEP to Ppeak, V ramps linearly 0→VC
    for (let i = 0; i <= n; i++) {
      const f = i / n
      pts.push({ x: peep + (ppeak - peep) * f, y: vc * f, phase: 'insp' })
    }
    // Pause: P drops from Ppeak to Pplat, V stays at VC
    for (let i = 0; i <= Math.floor(n * 0.15); i++) {
      const f = i / Math.floor(n * 0.15)
      pts.push({ x: ppeak - (ppeak - pplat) * f, y: vc, phase: 'pause' })
    }
    // Expiration: curved path back - P decreases, V decreases with hysteresis
    for (let i = 0; i <= n; i++) {
      const f = i / n
      const expV = vc * (1 - f)
      const expP = peep + (pplat - peep) * Math.pow(1 - f, 0.7) // hysteresis curve
      pts.push({ x: expP, y: expV, phase: 'exp' })
    }
    return pts
  }, [])

  const generatePVpcv = useCallback((steps: number) => {
    const pts: { x: number; y: number; phase: 'insp' | 'exp' }[] = []
    const n = Math.floor(steps / 2)

    // Inspiration: P rises fast to Pinsp, then V rises at constant P
    // Rise phase
    const riseN = Math.floor(n * 0.1)
    for (let i = 0; i <= riseN; i++) {
      const f = i / riseN
      pts.push({ x: peep + pc * f, y: vcPcv * 0.05 * f, phase: 'insp' })
    }
    // Constant pressure, volume rises curvilinearly
    for (let i = 0; i <= n - riseN; i++) {
      const f = i / (n - riseN)
      const v = vcPcv * (0.05 + 0.95 * (1 - Math.exp(-f * 3.5)))
      pts.push({ x: pinsp, y: v, phase: 'insp' })
    }
    // Expiration: P drops fast, then V decreases
    const dropN = Math.floor(n * 0.08)
    for (let i = 0; i <= dropN; i++) {
      const f = i / dropN
      pts.push({ x: pinsp - pc * f, y: vcPcv * (1 - 0.03 * f), phase: 'exp' })
    }
    for (let i = 0; i <= n - dropN; i++) {
      const f = i / (n - dropN)
      pts.push({ x: peep + 0.5 * (1 - f), y: vcPcv * (0.97) * Math.exp(-f * 3), phase: 'exp' })
    }
    return pts
  }, [])

  const generateFV = useCallback((type: 'normal' | 'restrict' | 'obstruct', steps: number) => {
    const pts: { x: number; y: number; phase: 'insp' | 'exp' }[] = []
    const n = Math.floor(steps / 2)

    const vcUsed = type === 'restrict' ? 280 : type === 'obstruct' ? 420 : vc
    const flowI = type === 'restrict' ? 45 : flowInsp
    const flowE = type === 'restrict' ? -65 : type === 'obstruct' ? -20 : flowExpPeak
    const autoPeepVol = type === 'obstruct' ? 80 : 0  // trapped volume

    // Inspiration: flow rises to constant, volume increases
    for (let i = 0; i <= n; i++) {
      const f = i / n
      const rise = Math.min(f * 8, 1)
      const v = autoPeepVol + (vcUsed - autoPeepVol) * f
      // VCV = constant flow, PCV would be decelerating
      const fl = flowI * rise * (type === 'restrict' ? Math.exp(-f * 0.5) : 1)
      pts.push({ x: v, y: fl, phase: 'insp' })
    }

    // Expiration
    for (let i = 0; i <= n; i++) {
      const f = i / n
      const v = vcUsed - (vcUsed - autoPeepVol) * f

      let fl: number
      if (type === 'obstruct') {
        // Obstructive: low peak, slow decay, doesn't return to zero
        // Square root sign in severe cases
        const peakPhase = Math.min(f * 6, 1)
        const decay = Math.exp(-f * 1.5)
        fl = flowE * peakPhase * decay
        // Flow limitation - plateau at low level
        if (f > 0.15) fl = Math.max(fl, flowE * 0.4)
      } else if (type === 'restrict') {
        // Restrictive: high peak, fast return
        const peakPhase = Math.min(f * 8, 1)
        fl = flowE * peakPhase * Math.exp(-f * 3)
      } else {
        // Normal: moderate peak, exponential decay
        const peakPhase = Math.min(f * 6, 1)
        fl = flowE * peakPhase * Math.exp(-f * 2.2)
      }
      pts.push({ x: v, y: fl, phase: 'exp' })
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

    const info = LABELS[loopType]
    const pad = { top: 30, bot: 40, left: 60, right: 20 }
    const gW = W - pad.left - pad.right
    const gH = H - pad.top - pad.bot

    // Generate loop points
    const steps = 300
    let pts: { x: number; y: number; phase: string }[]
    let xMin: number, xMax: number, yMin: number, yMax: number

    if (loopType === 'pv-vcv') {
      pts = generatePVvcv(steps)
      xMin = 0; xMax = 35; yMin = -20; yMax = 550
    } else if (loopType === 'pv-pcv') {
      pts = generatePVpcv(steps)
      xMin = 0; xMax = 25; yMin = -20; yMax = 500
    } else {
      const type = loopType === 'fv-restrict' ? 'restrict' : loopType === 'fv-obstruct' ? 'obstruct' : 'normal'
      pts = generateFV(type, steps)
      xMin = -20; xMax = 550; yMin = -80; yMax = 70
    }

    const toX = (v: number) => pad.left + ((v - xMin) / (xMax - xMin)) * gW
    const toY = (v: number) => pad.top + gH - ((v - yMin) / (yMax - yMin)) * gH

    let prevTime = performance.now()

    const draw = (now: number) => {
      const dt = (now - prevTime) / 1000
      prevTime = now
      progressRef.current = (progressRef.current + dt * 0.4) % 1

      ctx.fillStyle = C.bg
      ctx.fillRect(0, 0, W, H)

      // Title
      ctx.fillStyle = C.label
      ctx.font = 'bold 13px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(info.title, W / 2, 18)

      // Grid
      ctx.strokeStyle = C.grid
      ctx.lineWidth = 0.5
      for (let i = 0; i <= 5; i++) {
        const y = pad.top + (gH / 5) * i
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke()
        const x = pad.left + (gW / 5) * i
        ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + gH); ctx.stroke()
      }

      // Axes
      ctx.strokeStyle = C.gridMajor
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(pad.left, pad.top); ctx.lineTo(pad.left, pad.top + gH); ctx.lineTo(W - pad.right, pad.top + gH); ctx.stroke()

      // For F×V: zero line
      if (loopType.startsWith('fv')) {
        const zeroY = toY(0)
        ctx.strokeStyle = C.gridMajor; ctx.lineWidth = 0.8
        ctx.beginPath(); ctx.moveTo(pad.left, zeroY); ctx.lineTo(W - pad.right, zeroY); ctx.stroke()
        ctx.fillStyle = C.text; ctx.font = '9px monospace'; ctx.textAlign = 'right'
        ctx.fillText('0', pad.left - 4, zeroY + 3)
      }

      // Axis labels
      ctx.fillStyle = C.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center'
      ctx.fillText(info.xAxis, pad.left + gW / 2, H - 6)
      ctx.save()
      ctx.translate(14, pad.top + gH / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText(info.yAxis, 0, 0)
      ctx.restore()

      // Axis values
      ctx.fillStyle = C.text; ctx.font = '9px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(String(Math.round(xMin)), toX(xMin), H - 22)
      ctx.fillText(String(Math.round(xMax)), toX(xMax), H - 22)
      ctx.fillText(String(Math.round((xMin + xMax) / 2)), toX((xMin + xMax) / 2), H - 22)
      ctx.textAlign = 'right'
      ctx.fillText(String(Math.round(yMax)), pad.left - 4, pad.top + 10)
      ctx.fillText(String(Math.round(yMin)), pad.left - 4, pad.top + gH)

      // Draw filled area (hysteresis)
      if (pts.length > 2) {
        ctx.beginPath()
        pts.forEach((p, i) => {
          const x = toX(p.x), y = toY(p.y)
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
        })
        ctx.closePath()
        ctx.fillStyle = C.fill
        ctx.fill()
      }

      // Animated progress marker
      const totalPts = pts.length
      const animIdx = Math.floor(progressRef.current * totalPts)

      // Draw inspiratory limb
      ctx.beginPath()
      ctx.strokeStyle = C.insp; ctx.lineWidth = 2.5
      let started = false
      pts.forEach((p, i) => {
        if (p.phase === 'insp' || p.phase === 'pause') {
          const x = toX(p.x), y = toY(p.y)
          if (!started) { ctx.moveTo(x, y); started = true } else ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Draw expiratory limb
      ctx.beginPath()
      ctx.strokeStyle = C.exp; ctx.lineWidth = 2.5
      started = false
      pts.forEach((p, i) => {
        if (p.phase === 'exp') {
          const x = toX(p.x), y = toY(p.y)
          if (!started) { ctx.moveTo(x, y); started = true } else ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Direction arrows
      const drawArrow = (idx: number, color: string) => {
        if (idx < 1 || idx >= pts.length - 1) return
        const p0 = pts[idx - 1], p1 = pts[idx]
        const x0 = toX(p0.x), y0 = toY(p0.y), x1 = toX(p1.x), y1 = toY(p1.y)
        const angle = Math.atan2(y1 - y0, x1 - x0)
        const ax = toX(p1.x), ay = toY(p1.y)

        ctx.save()
        ctx.translate(ax, ay)
        ctx.rotate(angle)
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(-10, -5)
        ctx.lineTo(-10, 5)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }

      // Arrows on both limbs
      const inspPts = pts.filter(p => p.phase === 'insp')
      const expPts = pts.filter(p => p.phase === 'exp')
      if (inspPts.length > 10) drawArrow(Math.floor(pts.indexOf(inspPts[Math.floor(inspPts.length * 0.5)])), C.insp)
      if (expPts.length > 10) drawArrow(Math.floor(pts.indexOf(expPts[Math.floor(expPts.length * 0.5)])), C.exp)

      // Animated dot
      if (animIdx < pts.length) {
        const ap = pts[animIdx]
        ctx.beginPath()
        ctx.arc(toX(ap.x), toY(ap.y), 5, 0, Math.PI * 2)
        ctx.fillStyle = ap.phase === 'exp' ? C.exp : C.insp
        ctx.fill()
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke()
      }

      // Annotations per loop type
      ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left'

      if (loopType === 'pv-vcv') {
        // PIP label
        ctx.fillStyle = C.annotation
        ctx.fillText(`PIP = ${ppeak}`, toX(ppeak) + 4, toY(vc) + 4)
        ctx.fillText(`Pplatô = ${pplat}`, toX(pplat) + 4, toY(vc) - 8)
        ctx.fillText(`PEEP = ${peep}`, toX(peep) + 4, toY(0) + 14)
        ctx.fillText(`VC = ${vc} mL`, toX(0) + 4, toY(vc) - 4)
        // Hysteresis label
        ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '9px system-ui'
        ctx.fillText('Histerese', toX(14), toY(250))
        // Insp/Exp labels
        ctx.fillStyle = C.insp; ctx.font = 'bold 10px system-ui'
        ctx.fillText('Inspiração →', toX(12), toY(150))
        ctx.fillStyle = C.exp
        ctx.fillText('← Expiração', toX(8), toY(380))
      }

      if (loopType === 'pv-pcv') {
        ctx.fillStyle = C.annotation
        ctx.fillText(`Pinsp = ${pinsp}`, toX(pinsp) + 4, toY(vcPcv * 0.5))
        ctx.fillText(`PEEP = ${peep}`, toX(peep) + 4, toY(0) + 14)
        ctx.fillText(`VC ≈ ${vcPcv} mL`, toX(2), toY(vcPcv) - 4)
        ctx.fillStyle = C.insp; ctx.font = 'bold 10px system-ui'
        ctx.fillText('Inspiração →', toX(pinsp - 3), toY(200))
        ctx.fillStyle = C.exp
        ctx.fillText('← Expiração', toX(6), toY(350))
      }

      if (loopType === 'fv-normal') {
        ctx.fillStyle = C.annotation
        ctx.fillText(`Pico Insp = ${flowInsp} L/min`, toX(50), toY(flowInsp) - 6)
        ctx.fillText(`Pico Exp = ${flowExpPeak} L/min`, toX(300), toY(flowExpPeak) - 6)
        ctx.fillText(`VC = ${vc} mL`, toX(vc) - 50, toY(0) + 14)
        ctx.fillStyle = C.insp; ctx.font = 'bold 10px system-ui'
        ctx.fillText('Fase Inspiratória', toX(150), toY(35))
        ctx.fillStyle = C.exp
        ctx.fillText('Fase Expiratória', toX(150), toY(-25))
      }

      if (loopType === 'fv-restrict') {
        ctx.fillStyle = C.annotation
        ctx.fillText('Pico Exp ELEVADO', toX(80), toY(-65) - 4)
        ctx.fillText('Alta Elastância', toX(80), toY(-65) + 10)
        ctx.fillText('VC ↓ (280 mL)', toX(280) - 40, toY(0) + 14)
      }

      if (loopType === 'fv-obstruct') {
        ctx.fillStyle = C.annotation
        ctx.fillText('Pico Exp BAIXO', toX(200), toY(-20) + 14)
        ctx.fillText('Auto-PEEP', toX(80) + 4, toY(-10) + 14)
        // Draw auto-PEEP marker
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3])
        const apX = toX(80)
        ctx.beginPath(); ctx.moveTo(apX, toY(-15)); ctx.lineTo(apX, toY(15)); ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = '#ef4444'; ctx.font = '9px system-ui'
        ctx.fillText('↑ Ar aprisionado', toX(80) + 4, toY(15) + 12)
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameRef.current)
  }, [loopType, generatePVvcv, generatePVpcv, generateFV])

  return (
    <div className={`rounded-xl overflow-hidden bg-[#111] ${className ?? ''}`}>
      <div className="flex flex-wrap gap-1.5 p-3 bg-black/40 border-b border-white/10">
        <span className="text-white/40 text-xs self-center mr-1">P × V:</span>
        {(['pv-vcv', 'pv-pcv'] as LoopType[]).map(t => (
          <button key={t} onClick={() => setLoopType(t)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              loopType === t ? 'bg-blue-500/30 text-blue-300 ring-1 ring-blue-500/50' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}>{t === 'pv-vcv' ? 'VCV' : 'PCV'}</button>
        ))}
        <div className="w-px bg-white/10 mx-1" />
        <span className="text-white/40 text-xs self-center mr-1">F × V:</span>
        {(['fv-normal', 'fv-restrict', 'fv-obstruct'] as LoopType[]).map(t => (
          <button key={t} onClick={() => setLoopType(t)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              loopType === t ? 'bg-pink-500/30 text-pink-300 ring-1 ring-pink-500/50' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}>{t === 'fv-normal' ? 'Normal' : t === 'fv-restrict' ? 'Restritivo' : 'Obstrutivo'}</button>
        ))}
      </div>

      <canvas ref={canvasRef} className="w-full" style={{ height: 400 }} />

      <div className="p-3 bg-black/40 border-t border-white/10 text-[10px] space-y-1">
        <div className="flex gap-4">
          <span className="text-blue-400">● Inspiração</span>
          <span className="text-red-400">● Expiração</span>
          <span className="text-white/30">Área = Histerese / WOB</span>
        </div>
        {loopType === 'pv-vcv' && <p className="text-white/40">VCV: Pressão sobe linearmente (rampa). Histerese entre insp/exp reflete trabalho elástico. Ppico inclui componente resistivo.</p>}
        {loopType === 'pv-pcv' && <p className="text-white/40">PCV: Pressão constante (retangular). Volume sobe curvilineamente. Loop mais "quadrado" que VCV.</p>}
        {loopType === 'fv-normal' && <p className="text-white/40">Normal: Fluxo insp constante (VCV), exp exponencial. Loop fechado na origem.</p>}
        {loopType === 'fv-restrict' && <p className="text-white/40">Restritivo: VC reduzido, pico exp ELEVADO (alta elastância empurra ar rapidamente). Loop comprimido horizontalmente.</p>}
        {loopType === 'fv-obstruct' && <p className="text-white/40">Obstrutivo: Pico exp BAIXO, constantes de tempo longas. Auto-PEEP: loop não fecha na origem (ar aprisionado). Tríade: pico exp ↓, τ equivalentes, auto-PEEP.</p>}
      </div>
    </div>
  )
}
