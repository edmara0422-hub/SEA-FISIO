'use client'

import { useRef, useEffect, useState } from 'react'

/* ──────────────────────────────────────────────────────────────
   CUFF-LEAK TEST — Simulação Real

   Ventilador em VCV gera ciclos respiratórios reais.
   Volume × Tempo scrolling em tempo real.

   1. Cuff insuflado: VCi ≈ VCe (baseline)
   2. Cuff desinsuflado:
      - NEGATIVO (tem leak): VCe cai → diferença > 110mL → seguro
      - POSITIVO (sem leak): VCe ≈ VCi → diferença < 110mL → risco
   ────────────────────────────────────────────────────────────── */

type Result = 'baseline' | 'negative' | 'positive'

const C = {
  insp: '#38bdf8',
  exp: '#f87171',
  leak: 'rgba(74,222,128,0.25)',
  leakLine: '#4ade80',
  riskFill: 'rgba(239,68,68,0.15)',
  riskLine: '#ef4444',
  bg: '#0a0a0a',
  grid: 'rgba(255,255,255,0.05)',
  axis: 'rgba(255,255,255,0.15)',
  text: 'rgba(255,255,255,0.35)',
  label: 'rgba(255,255,255,0.8)',
  cuffOn: '#60a5fa',
  cuffOff: '#fbbf24',
}

export function RespiratoryCuffLeakSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [result, setResult] = useState<Result>('baseline')
  const frameRef = useRef(0)
  const timeRef = useRef(0)
  const prevRef = useRef(0)

  useEffect(() => { timeRef.current = 0 }, [result])

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const W = cvs.clientWidth, H = cvs.clientHeight
    cvs.width = W * dpr; cvs.height = H * dpr
    ctx.scale(dpr, dpr)

    // Layout
    const infoW = 140
    const pad = { top: 10, bot: 30, left: 50, right: infoW + 16 }
    const gW = W - pad.left - pad.right
    const gH = H - pad.top - pad.bot

    // VCV parameters
    const vci = 500 // mL — set by ventilator
    const rr = 16 // rpm
    const cycleSec = 60 / rr // 3.75s
    const tInsp = cycleSec * 0.33 // ~1.25s
    const tExp = cycleSec - tInsp // ~2.5s
    const tau = 0.5 // expiratory time constant

    // Leak amounts
    const leakNeg = 160 // mL — negative test (safe)
    const leakPos = 30  // mL — positive test (risk)

    // Scrolling buffer
    const windowSec = 16 // show ~4 cycles
    const bufLen = 800
    const volBuf = new Float32Array(bufLen)
    const phaseBuf = new Int8Array(bufLen) // 0=insp, 1=exp
    let bIdx = 0
    let sampleAcc = 0

    // Wave generator: Volume × Time for VCV
    function getVol(t: number): { vol: number; phase: number } {
      const cycleT = ((t % cycleSec) + cycleSec) % cycleSec

      let vce: number
      if (result === 'baseline') vce = vci - 10 // tiny circuit leak
      else if (result === 'negative') vce = vci - leakNeg
      else vce = vci - leakPos

      const residual = vci - vce // volume that doesn't return

      if (cycleT < tInsp) {
        // Inspiration: linear ramp (VCV = constant flow → linear volume rise)
        const f = cycleT / tInsp
        return { vol: f * vci, phase: 0 }
      } else {
        // Expiration: exponential decay
        const tE = cycleT - tInsp
        const f = tE / tExp
        // Volume decays from vci toward residual
        const vol = residual + (vci - residual) * Math.exp(-tE / tau)
        return { vol, phase: 1 }
      }
    }

    prevRef.current = performance.now()

    const draw = (now: number) => {
      const dt = Math.min((now - prevRef.current) / 1000, 0.05)
      prevRef.current = now
      timeRef.current += dt

      // Sample
      sampleAcc += dt
      const sampleRate = windowSec / bufLen
      while (sampleAcc >= sampleRate) {
        sampleAcc -= sampleRate
        const w = getVol(timeRef.current - sampleAcc)
        volBuf[bIdx % bufLen] = w.vol
        phaseBuf[bIdx % bufLen] = w.phase
        bIdx++
      }

      // ── Clear ──
      ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H)

      // ── Graph area ──
      const yMin = -30, yMax = 560
      const toX = (i: number) => pad.left + (i / bufLen) * gW
      const toY = (v: number) => pad.top + gH - ((v - yMin) / (yMax - yMin)) * gH

      // Grid
      ctx.strokeStyle = C.grid; ctx.lineWidth = 0.5
      for (let i = 0; i <= 8; i++) {
        const y = pad.top + (gH / 8) * i
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + gW, y); ctx.stroke()
      }
      // Time grid
      const samplesPerCycle = Math.round(cycleSec / sampleRate)
      for (let i = 0; i < bufLen; i += Math.round(samplesPerCycle / 2)) {
        const x = toX(i)
        ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + gH); ctx.stroke()
      }

      // Axes
      ctx.strokeStyle = C.axis; ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(pad.left, pad.top); ctx.lineTo(pad.left, pad.top + gH); ctx.lineTo(pad.left + gW, pad.top + gH)
      ctx.stroke()

      // Zero line
      const zy = toY(0)
      ctx.strokeStyle = C.axis; ctx.lineWidth = 0.6
      ctx.beginPath(); ctx.moveTo(pad.left, zy); ctx.lineTo(pad.left + gW, zy); ctx.stroke()

      // Y axis labels
      ctx.fillStyle = C.text; ctx.font = '9px monospace'; ctx.textAlign = 'right'
      ctx.fillText('500', pad.left - 4, toY(500) + 3)
      ctx.fillText('250', pad.left - 4, toY(250) + 3)
      ctx.fillText('0', pad.left - 4, zy + 3)

      // Y axis title
      ctx.save(); ctx.translate(12, pad.top + gH / 2); ctx.rotate(-Math.PI / 2)
      ctx.fillStyle = C.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center'
      ctx.fillText('Volume (mL)', 0, 0); ctx.restore()

      // ── VCi reference line (dashed) ──
      ctx.strokeStyle = 'rgba(56,189,248,0.2)'; ctx.lineWidth = 1; ctx.setLineDash([4, 6])
      ctx.beginPath(); ctx.moveTo(pad.left, toY(vci)); ctx.lineTo(pad.left + gW, toY(vci)); ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = 'rgba(56,189,248,0.3)'; ctx.font = '8px monospace'; ctx.textAlign = 'left'
      ctx.fillText(`VCi = ${vci}`, pad.left + 4, toY(vci) - 4)

      // ── VCe reference line when deflated ──
      if (result !== 'baseline') {
        const vce = result === 'negative' ? vci - leakNeg : vci - leakPos
        const residual = vci - vce

        // Residual volume line
        ctx.strokeStyle = result === 'negative' ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'
        ctx.lineWidth = 1; ctx.setLineDash([3, 5])
        ctx.beginPath(); ctx.moveTo(pad.left, toY(residual)); ctx.lineTo(pad.left + gW, toY(residual)); ctx.stroke()
        ctx.setLineDash([])

        const leakColor = result === 'negative' ? C.leakLine : C.riskLine
        ctx.fillStyle = leakColor; ctx.font = '8px monospace'
        ctx.fillText(`Residual = ${residual} mL`, pad.left + 4, toY(residual) + 12)

        // Shade leak area between VCi line and residual line
        ctx.fillStyle = result === 'negative' ? C.leak : C.riskFill
        ctx.fillRect(pad.left, toY(vci), gW, toY(residual) - toY(vci))
      }

      // ── Waveform ──
      const start = Math.max(0, bIdx - bufLen)
      const count = bIdx - start

      // Draw filled area under curve
      if (count > 2) {
        ctx.beginPath()
        ctx.moveTo(toX(0), zy)
        for (let i = 0; i < count; i++) {
          const x = toX(i)
          const y = toY(volBuf[(start + i) % bufLen])
          ctx.lineTo(x, Math.max(pad.top, Math.min(pad.top + gH, y)))
        }
        ctx.lineTo(toX(count - 1), zy)
        ctx.closePath()
        ctx.fillStyle = 'rgba(56,189,248,0.06)'
        ctx.fill()
      }

      // Draw waveform line — color by phase
      if (count > 1) {
        ctx.lineWidth = 2
        let prevPhase = phaseBuf[start % bufLen]
        ctx.beginPath()
        ctx.strokeStyle = prevPhase === 0 ? C.insp : C.exp
        ctx.moveTo(toX(0), toY(volBuf[start % bufLen]))

        for (let i = 1; i < count; i++) {
          const phase = phaseBuf[(start + i) % bufLen]
          const x = toX(i)
          const y = Math.max(pad.top, Math.min(pad.top + gH, toY(volBuf[(start + i) % bufLen])))

          if (phase !== prevPhase) {
            ctx.stroke()
            ctx.beginPath()
            ctx.strokeStyle = phase === 0 ? C.insp : C.exp
            ctx.moveTo(x, y)
            prevPhase = phase
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }

      // ── Right info panel ──
      const ix = W - infoW - 4, iy = pad.top + 8

      // Cuff status badge
      ctx.fillStyle = result === 'baseline' ? 'rgba(96,165,250,0.12)' : 'rgba(251,191,36,0.12)'
      ctx.fillRect(ix, iy, infoW, 28)
      ctx.strokeStyle = result === 'baseline' ? 'rgba(96,165,250,0.3)' : 'rgba(251,191,36,0.3)'
      ctx.lineWidth = 0.5; ctx.strokeRect(ix, iy, infoW, 28)
      ctx.fillStyle = result === 'baseline' ? C.cuffOn : C.cuffOff
      ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center'
      ctx.fillText(result === 'baseline' ? 'CUFF INSUFLADO' : 'CUFF DESINSUFLADO', ix + infoW / 2, iy + 18)

      // VCV mode badge
      ctx.fillStyle = 'rgba(255,255,255,0.04)'
      ctx.fillRect(ix, iy + 34, infoW, 22)
      ctx.fillStyle = C.text; ctx.font = '9px system-ui'
      ctx.fillText(`Modo: VCV · RR: ${rr} · VCi: ${vci}`, ix + infoW / 2, iy + 48)

      // Calculations
      const vce = result === 'baseline' ? vci - 10 : result === 'negative' ? vci - leakNeg : vci - leakPos
      const leak = vci - vce
      const pct = Math.round((leak / vci) * 100)

      const calcY = iy + 66
      ctx.fillStyle = C.label; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center'
      ctx.fillText(`VCi = ${vci} mL`, ix + infoW / 2, calcY)
      ctx.fillText(`VCe = ${vce} mL`, ix + infoW / 2, calcY + 18)

      // Divider
      ctx.strokeStyle = C.axis; ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(ix + 10, calcY + 26); ctx.lineTo(ix + infoW - 10, calcY + 26); ctx.stroke()

      // Leak value
      const leakColor = result === 'negative' ? C.leakLine : result === 'positive' ? C.riskLine : C.label
      ctx.fillStyle = leakColor; ctx.font = 'bold 14px monospace'
      ctx.fillText(`Δ = ${leak} mL (${pct}%)`, ix + infoW / 2, calcY + 44)

      // Threshold
      ctx.fillStyle = C.text; ctx.font = '9px system-ui'
      ctx.fillText('Corte: 110 mL (10%)', ix + infoW / 2, calcY + 60)

      // Result
      if (result !== 'baseline') {
        const resY = calcY + 78
        if (result === 'negative') {
          ctx.fillStyle = 'rgba(74,222,128,0.1)'
          ctx.fillRect(ix, resY, infoW, 50)
          ctx.strokeStyle = 'rgba(74,222,128,0.3)'; ctx.lineWidth = 0.5; ctx.strokeRect(ix, resY, infoW, 50)
          ctx.fillStyle = C.leakLine; ctx.font = 'bold 12px system-ui'
          ctx.fillText('NEGATIVO', ix + infoW / 2, resY + 18)
          ctx.font = '9px system-ui'; ctx.fillStyle = 'rgba(74,222,128,0.7)'
          ctx.fillText('Tem vazamento', ix + infoW / 2, resY + 32)
          ctx.fillText('Baixo risco estridor', ix + infoW / 2, resY + 44)
        } else {
          ctx.fillStyle = 'rgba(239,68,68,0.1)'
          ctx.fillRect(ix, resY, infoW, 50)
          ctx.strokeStyle = 'rgba(239,68,68,0.3)'; ctx.lineWidth = 0.5; ctx.strokeRect(ix, resY, infoW, 50)
          ctx.fillStyle = C.riskLine; ctx.font = 'bold 12px system-ui'
          ctx.fillText('POSITIVO', ix + infoW / 2, resY + 18)
          ctx.font = '9px system-ui'; ctx.fillStyle = 'rgba(239,68,68,0.7)'
          ctx.fillText('Sem vazamento', ix + infoW / 2, resY + 32)
          ctx.fillText('Risco de estridor', ix + infoW / 2, resY + 44)
        }
      }

      // Sensitivity/Specificity at bottom of panel
      if (result !== 'baseline') {
        ctx.fillStyle = C.text; ctx.font = '8px system-ui'; ctx.textAlign = 'center'
        ctx.fillText('Sens: 27% · Esp: 88%', ix + infoW / 2, pad.top + gH - 8)
      }

      // X axis label
      ctx.fillStyle = C.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center'
      ctx.fillText('Tempo', pad.left + gW / 2, H - 8)

      frameRef.current = requestAnimationFrame(draw)
    }

    prevRef.current = performance.now()
    frameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameRef.current)
  }, [result])

  return (
    <div className={`rounded-xl overflow-hidden bg-[#0a0a0a] ${className ?? ''}`}>
      <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-black/60 border-b border-white/10">
        <span className="text-white/40 text-[10px] mr-0.5">Cuff-Leak Test:</span>
        <button onClick={() => setResult('baseline')}
          className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${
            result === 'baseline' ? 'bg-blue-500/25 text-blue-300 ring-1 ring-blue-500/40' : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}>1. Cuff Insuflado</button>
        <button onClick={() => setResult('negative')}
          className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${
            result === 'negative' ? 'bg-green-500/25 text-green-300 ring-1 ring-green-500/40' : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}>2. Negativo (seguro)</button>
        <button onClick={() => setResult('positive')}
          className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${
            result === 'positive' ? 'bg-red-500/25 text-red-300 ring-1 ring-red-500/40' : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}>3. Positivo (risco)</button>
      </div>

      <canvas ref={canvasRef} className="w-full" style={{ height: 380 }} />

      <div className="p-2.5 bg-black/60 border-t border-white/10 text-[10px]">
        {result === 'baseline' && <p className="text-white/40">Cuff insuflado em VCV: VCi ≈ VCe. Registre o baseline. Aspire secreções antes de prosseguir.</p>}
        {result === 'negative' && <p className="text-white/40">Teste NEGATIVO: leak de 160 mL (32%) — ar escapa ao redor do cuff desinsuflado. Via aérea pérvea. Baixo risco de estridor pós-extubação.</p>}
        {result === 'positive' && <p className="text-white/40">Teste POSITIVO: leak de apenas 30 mL (6%) — quase nenhum ar escapa. Possível edema de laringe. Risco de estridor. Considerar corticoide profilático antes da extubação.</p>}
      </div>
    </div>
  )
}
