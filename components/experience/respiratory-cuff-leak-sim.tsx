'use client'

import { useRef, useEffect, useState } from 'react'

/* ──────────────────────────────────────────────────────────────
   CUFF-LEAK TEST — Teste de Vazamento do Balonete
   Avalia risco de estridor pós-extubação
   Cuff insuflado → VCi ≈ VCe (volumes iguais)
   Cuff desinsuflado → VCe cai (NEGATIVO = tem leak = seguro)
                      → VCe fica igual (POSITIVO = sem leak = risco)
   ────────────────────────────────────────────────────────────── */

type Step = 'inflated' | 'deflated'
type Result = 'negative' | 'positive'

const CLR = {
  ref: '#666666',
  safe: '#4ade80',
  risk: '#ef4444',
  bg: '#111111',
  grid: 'rgba(255,255,255,0.06)',
  axis: 'rgba(255,255,255,0.2)',
  text: 'rgba(255,255,255,0.4)',
  label: '#ffffff',
  fill_safe: 'rgba(74,222,128,0.12)',
  fill_risk: 'rgba(239,68,68,0.12)',
}

export function RespiratoryCuffLeakSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [step, setStep] = useState<Step>('inflated')
  const [result, setResult] = useState<Result>('negative')

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const W = cvs.clientWidth, H = cvs.clientHeight
    cvs.width = W * dpr; cvs.height = H * dpr
    ctx.scale(dpr, dpr)

    const pad = { top: 30, bot: 44, left: 55, right: 20 }
    const gW = W - pad.left - pad.right, gH = H - pad.top - pad.bot

    const vci = 500 // inspiratory volume (set by ventilator)
    const vceInflated = 490 // expiratory vol with cuff inflated (nearly matches)
    const vceDeflatedNeg = 340 // negative test: big leak
    const vceDeflatedPos = 465 // positive test: barely any leak

    const nCycles = 4
    const tInsp = 1.0, tExp = 2.0, tCycle = tInsp + tExp
    const tTotal = nCycles * tCycle

    const xMin = 0, xMax = tTotal, yMin = -20, yMax = 550
    const toX = (v: number) => pad.left + ((v - xMin) / (xMax - xMin)) * gW
    const toY = (v: number) => pad.top + gH - ((v - yMin) / (yMax - yMin)) * gH

    // Generate breath waveform
    const genBreaths = (vce: number) => {
      const pts: [number, number][] = []
      for (let c = 0; c < nCycles; c++) {
        const tBase = c * tCycle
        // Inspiration: ramp up to vci
        for (let i = 0; i <= 40; i++) {
          const f = i / 40
          pts.push([tBase + f * tInsp, f * vci])
        }
        // Expiration: exponential decay to residual
        const residual = vci - vce
        for (let i = 1; i <= 60; i++) {
          const f = i / 60
          const vol = residual + (vci - residual) * Math.exp(-f * 4)
          pts.push([tBase + tInsp + f * tExp, vol])
        }
      }
      return pts
    }

    const inflatedPts = genBreaths(vceInflated)

    let testVce: number
    if (step === 'inflated') testVce = vceInflated
    else testVce = result === 'negative' ? vceDeflatedNeg : vceDeflatedPos
    const testPts = genBreaths(testVce)

    // ── Draw ──
    ctx.fillStyle = CLR.bg; ctx.fillRect(0, 0, W, H)

    // Title
    ctx.fillStyle = CLR.label; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center'
    if (step === 'inflated') ctx.fillText('Cuff-Leak Test — Cuff Insuflado (Baseline)', W / 2, 18)
    else ctx.fillText(`Cuff-Leak Test — Cuff Desinsuflado (${result === 'negative' ? 'NEGATIVO' : 'POSITIVO'})`, W / 2, 18)

    // Grid
    ctx.strokeStyle = CLR.grid; ctx.lineWidth = 0.5
    for (let i = 0; i <= 6; i++) {
      const y = pad.top + (gH / 6) * i
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke()
    }
    for (let i = 0; i <= nCycles * 3; i++) {
      const x = pad.left + (gW / (nCycles * 3)) * i
      ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + gH); ctx.stroke()
    }

    // Axes
    ctx.strokeStyle = CLR.axis; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(pad.left, pad.top); ctx.lineTo(pad.left, pad.top + gH); ctx.lineTo(W - pad.right, pad.top + gH); ctx.stroke()

    // Zero line
    ctx.strokeStyle = CLR.axis; ctx.lineWidth = 0.6
    ctx.beginPath(); ctx.moveTo(pad.left, toY(0)); ctx.lineTo(W - pad.right, toY(0)); ctx.stroke()

    // Axis labels
    ctx.fillStyle = CLR.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center'
    ctx.fillText('Tempo (s)', pad.left + gW / 2, H - 6)
    ctx.save(); ctx.translate(13, pad.top + gH / 2); ctx.rotate(-Math.PI / 2)
    ctx.fillText('Volume (mL)', 0, 0); ctx.restore()

    ctx.font = '9px monospace'; ctx.textAlign = 'right'; ctx.fillStyle = CLR.text
    ctx.fillText('500', pad.left - 4, toY(500) + 3)
    ctx.fillText('0', pad.left - 4, toY(0) + 3)

    // Draw path helper
    const drawPts = (pts: [number, number][], color: string, lw: number, dash?: number[]) => {
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = lw
      if (dash) ctx.setLineDash(dash)
      pts.forEach((p, i) => { if (i === 0) ctx.moveTo(toX(p[0]), toY(p[1])); else ctx.lineTo(toX(p[0]), toY(p[1])) })
      ctx.stroke()
      if (dash) ctx.setLineDash([])
    }

    if (step === 'deflated') {
      // Draw reference (inflated) as gray dashed
      drawPts(inflatedPts, CLR.ref, 1.5, [4, 4])

      // Fill area between curves (leak volume)
      const fillColor = result === 'negative' ? CLR.fill_safe : CLR.fill_risk
      ctx.beginPath()
      inflatedPts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(toX(p[0]), toY(p[1])); else ctx.lineTo(toX(p[0]), toY(p[1]))
      })
      for (let i = testPts.length - 1; i >= 0; i--) {
        ctx.lineTo(toX(testPts[i][0]), toY(testPts[i][1]))
      }
      ctx.closePath()
      ctx.fillStyle = fillColor; ctx.fill()

      // Draw test curve
      const testColor = result === 'negative' ? CLR.safe : CLR.risk
      drawPts(testPts, testColor, 2.5)
    } else {
      // Inflated: single curve
      drawPts(testPts, '#38bdf8', 2.5)
    }

    // ── Annotations ──
    ctx.textAlign = 'left'

    if (step === 'inflated') {
      // VCi and VCe labels
      ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 10px system-ui'
      ctx.fillText(`VCi = ${vci} mL`, toX(tCycle * 0.3), toY(vci) - 8)
      ctx.fillText(`VCe = ${vceInflated} mL`, toX(tCycle * 1.5), toY(30) + 14)
      ctx.fillStyle = CLR.text; ctx.font = '9px system-ui'
      ctx.fillText('Volumes praticamente iguais', toX(tCycle * 1.5), toY(30) + 28)
      ctx.fillText('→ Baseline estabelecido', toX(tCycle * 1.5), toY(30) + 40)
    } else {
      const leak = vci - testVce
      const pct = Math.round((leak / vci) * 100)

      if (result === 'negative') {
        ctx.fillStyle = CLR.safe; ctx.font = 'bold 11px system-ui'
        ctx.fillText('NEGATIVO — Tem vazamento', toX(tCycle * 1.2), toY(350))
        ctx.font = '10px system-ui'
        ctx.fillText(`Leak = ${leak} mL (${pct}%)`, toX(tCycle * 1.2), toY(350) + 16)
        ctx.fillStyle = CLR.text; ctx.font = '9px system-ui'
        ctx.fillText('> 110 mL (> 10%) → Baixo risco de estridor', toX(tCycle * 1.2), toY(350) + 30)
        ctx.fillText('→ Seguro para extubação', toX(tCycle * 1.2), toY(350) + 42)
      } else {
        ctx.fillStyle = CLR.risk; ctx.font = 'bold 11px system-ui'
        ctx.fillText('POSITIVO — Sem vazamento', toX(tCycle * 1.2), toY(350))
        ctx.font = '10px system-ui'
        ctx.fillText(`Leak = ${leak} mL (${pct}%)`, toX(tCycle * 1.2), toY(350) + 16)
        ctx.fillStyle = CLR.text; ctx.font = '9px system-ui'
        ctx.fillText('< 110 mL (< 10%) → Risco de estridor', toX(tCycle * 1.2), toY(350) + 30)
        ctx.fillText('→ Considerar corticoide pré-extubação', toX(tCycle * 1.2), toY(350) + 42)
      }

      // Legend
      ctx.font = '9px system-ui'; ctx.textAlign = 'left'
      const ly = pad.top + 6
      ctx.strokeStyle = CLR.ref; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4])
      ctx.beginPath(); ctx.moveTo(pad.left + 8, ly + 6); ctx.lineTo(pad.left + 28, ly + 6); ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = CLR.ref; ctx.fillText('Cuff insuflado (ref)', pad.left + 32, ly + 10)

      const tc = result === 'negative' ? CLR.safe : CLR.risk
      ctx.strokeStyle = tc; ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.moveTo(pad.left + 8, ly + 22); ctx.lineTo(pad.left + 28, ly + 22); ctx.stroke()
      ctx.fillStyle = tc; ctx.fillText('Cuff desinsuflado', pad.left + 32, ly + 26)
    }

    // Threshold line annotation
    if (step === 'deflated') {
      const threshVol = vci - 110
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.setLineDash([2, 4])
      ctx.beginPath(); ctx.moveTo(pad.left, toY(threshVol)); ctx.lineTo(W - pad.right, toY(threshVol)); ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '8px system-ui'; ctx.textAlign = 'right'
      ctx.fillText('Corte: VCi − 110 mL', W - pad.right - 4, toY(threshVol) - 4)
    }

  }, [step, result])

  return (
    <div className={`rounded-xl overflow-hidden bg-[#111] ${className ?? ''}`}>
      <div className="flex flex-wrap gap-1.5 p-2.5 bg-black/40 border-b border-white/10">
        <span className="text-white/40 text-[10px] self-center mr-0.5">Etapa:</span>
        <button onClick={() => setStep('inflated')}
          className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${
            step === 'inflated' ? 'bg-blue-500/25 text-blue-300 ring-1 ring-blue-500/40' : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}>Cuff Insuflado</button>
        <button onClick={() => setStep('deflated')}
          className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${
            step === 'deflated' ? 'bg-purple-500/25 text-purple-300 ring-1 ring-purple-500/40' : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}>Cuff Desinsuflado</button>
        {step === 'deflated' && <>
          <div className="w-px bg-white/10 mx-0.5" />
          <span className="text-white/40 text-[10px] self-center mr-0.5">Resultado:</span>
          <button onClick={() => setResult('negative')}
            className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${
              result === 'negative' ? 'bg-green-500/25 text-green-300 ring-1 ring-green-500/40' : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}>Negativo (seguro)</button>
          <button onClick={() => setResult('positive')}
            className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${
              result === 'positive' ? 'bg-red-500/25 text-red-300 ring-1 ring-red-500/40' : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}>Positivo (risco)</button>
        </>}
      </div>

      <canvas ref={canvasRef} className="w-full" style={{ height: 380 }} />

      <div className="p-2.5 bg-black/40 border-t border-white/10 text-[10px]">
        {step === 'inflated' && <p className="text-white/40">Cuff insuflado: VCi ≈ VCe. Baseline em VCV. Volumes inspirado e expirado praticamente iguais.</p>}
        {step === 'deflated' && result === 'negative' && <p className="text-white/40">Teste NEGATIVO (tem vazamento): VCe cai significativamente (leak {'>'} 110 mL ou {'>'} 10%). Baixa possibilidade de estridor. Seguro para extubação.</p>}
        {step === 'deflated' && result === 'positive' && <p className="text-white/40">Teste POSITIVO (sem vazamento): VCe praticamente não muda (leak {'<'} 110 mL ou {'<'} 10%). Risco de estridor pós-extubação. Considerar corticoide profilático. Sens 27%, Esp 88%.</p>}
      </div>
    </div>
  )
}
