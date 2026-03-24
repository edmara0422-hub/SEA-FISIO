'use client'

import { useRef, useEffect, useState } from 'react'

/* ──────────────────────────────────────────────────────────────
   TRE — Teste de Respiração Espontânea
   Curvas reais: Pressão × Tempo, Fluxo × Tempo, Volume × Tempo
   Modos: PSV 7+PEEP5, Tubo T, CPAP+ATC, ZEEP
   Desfechos: Sucesso (estável) vs Falha (deterioração progressiva)
   ────────────────────────────────────────────────────────────── */

type Method = 'psv' | 'tubo-t' | 'cpap-atc' | 'zeep'
type Outcome = 'success' | 'failure'

const CLR = {
  paw: '#fbbf24', flow: '#f472b6', vol: '#4ade80',
  bg: '#0a0a0a', grid: 'rgba(255,255,255,0.06)', axis: 'rgba(255,255,255,0.18)',
  text: 'rgba(255,255,255,0.4)', label: 'rgba(255,255,255,0.7)',
  warn: '#ef4444', ok: '#22c55e',
}

const METHOD_LABELS: Record<Method, string> = { psv: 'PSV 7 + PEEP 5', 'tubo-t': 'Tubo T', 'cpap-atc': 'CPAP + ATC', zeep: 'ZEEP' }

// Hermite smooth step
const smooth = (t: number) => t * t * (3 - 2 * t)

export function RespiratoryTreSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [method, setMethod] = useState<Method>('psv')
  const [outcome, setOutcome] = useState<Outcome>('success')
  const frameRef = useRef(0)
  const timeRef = useRef(0)
  const prevTimeRef = useRef(0)

  // Reset simulation time when outcome changes
  useEffect(() => { timeRef.current = 0 }, [outcome])

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const W = cvs.clientWidth
    const H = cvs.clientHeight
    cvs.width = W * dpr; cvs.height = H * dpr
    ctx.scale(dpr, dpr)

    // Layout: 3 stacked graphs + right panel for vitals
    const vitalsW = 82
    const pad = { top: 8, bot: 14, left: 48, right: vitalsW + 12 }
    const gW = W - pad.left - pad.right
    const graphGap = 6
    const gH = Math.floor((H - pad.top - pad.bot - graphGap * 2) / 3)

    // Waveform buffer — scrolling window of ~6 seconds
    const windowSec = 6
    const bufferLen = 600
    const pBuf = new Float32Array(bufferLen)
    const fBuf = new Float32Array(bufferLen)
    const vBuf = new Float32Array(bufferLen)
    let bufIdx = 0
    let sampleAcc = 0

    // Respiratory mechanics
    const R = 8 // cmH2O/(L/s)
    const C = 0.05 // L/cmH2O

    function getParams(t: number) {
      const progress = Math.min(t / 30, 1) // deterioration over 30s
      const fail = outcome === 'failure'

      let peep: number, ps: number, rr: number
      if (method === 'psv') { peep = 5; ps = 7 }
      else if (method === 'cpap-atc') { peep = 5; ps = 3 }
      else if (method === 'zeep') { peep = 0; ps = 0 }
      else { peep = 0; ps = 0 } // tubo-t

      rr = fail ? 18 + 20 * progress : 18
      const vtMult = fail ? 1 - 0.35 * progress : 1
      const jitter = fail ? 0.12 * progress : 0

      return { peep, ps, rr, vtMult, jitter, progress }
    }

    function wave(t: number, params: ReturnType<typeof getParams>) {
      const { peep, ps, rr, vtMult, jitter } = params
      const cycleSec = 60 / rr
      const iRatio = 0.35
      const tInsp = cycleSec * iRatio
      const tExp = cycleSec - tInsp

      // Add jitter to cycle phase
      const cycleT = ((t + jitter * Math.sin(t * 3.7) * 0.3) % cycleSec + cycleSec) % cycleSec
      const tau = R * C // 0.4s

      let P: number, F: number, V: number

      if (method === 'tubo-t') {
        // No ventilator — patient effort only
        const pMus = -5 * vtMult
        if (cycleT < tInsp) {
          const f = cycleT / tInsp
          P = pMus * Math.sin(Math.PI * f)
          F = 30 * vtMult * Math.sin(Math.PI * f)
          V = 400 * vtMult * (1 - Math.cos(Math.PI * f)) / 2
        } else {
          const f = (cycleT - tInsp) / tExp
          P = 0
          F = -20 * vtMult * Math.exp(-f * 3)
          V = 400 * vtMult * Math.exp(-f * 3)
        }
      } else {
        // Ventilator-assisted
        const deltaP = ps
        const fPeak = (deltaP / R) * 60 // L/min
        const vMax = deltaP * C * 1000 // mL

        if (cycleT < 0.08) {
          // Trigger dip
          const f = cycleT / 0.08
          P = peep - 2 * Math.sin(Math.PI * f)
          F = 0
          V = 0
        } else if (cycleT < tInsp) {
          const tI = cycleT - 0.08
          const tImax = tInsp - 0.08
          const fI = tI / tImax

          // Pressure: rise to peep+ps via smooth step
          const riseF = Math.min(tI / 0.12, 1)
          P = peep + ps * smooth(riseF)

          // Flow: decelerating (PSV pattern)
          F = fPeak * vtMult * Math.exp(-tI / tau)

          // Volume: integral of flow
          V = vMax * vtMult * (1 - Math.exp(-tI / tau))

          // Cycling at 25% of peak
          if (F < fPeak * vtMult * 0.25 && fI > 0.3) {
            F = fPeak * vtMult * 0.25 * (1 - (fI - 0.3) / 0.7)
          }
        } else {
          // Expiration
          const tE = cycleT - tInsp
          const riseF = Math.min(tE / 0.06, 1)
          P = peep + ps * (1 - smooth(riseF))
          if (tE > 0.06) P = peep

          const vAtEnd = vMax * vtMult * 0.95
          V = vAtEnd * Math.exp(-tE / (tau * 1.2))
          F = -(vAtEnd / (tau * 1.2)) * Math.exp(-tE / (tau * 1.2)) * 0.06 // convert to L/min approx
          F = Math.max(F, -40 * vtMult)
          if (tE < 0.05) F = -40 * vtMult * smooth(tE / 0.05)
        }
      }

      return { P, F, V }
    }

    prevTimeRef.current = performance.now()

    const draw = (now: number) => {
      const dt = (now - prevTimeRef.current) / 1000
      prevTimeRef.current = now
      timeRef.current += dt

      const params = getParams(timeRef.current)

      // Sample waveforms
      sampleAcc += dt
      const sampleRate = windowSec / bufferLen
      while (sampleAcc >= sampleRate) {
        sampleAcc -= sampleRate
        const w = wave(timeRef.current - sampleAcc, params)
        pBuf[bufIdx % bufferLen] = w.P
        fBuf[bufIdx % bufferLen] = w.F
        vBuf[bufIdx % bufferLen] = w.V
        bufIdx++
      }

      // Clear
      ctx.fillStyle = CLR.bg; ctx.fillRect(0, 0, W, H)

      // Draw each graph
      const graphs = [
        { buf: pBuf, color: CLR.paw, label: 'Paw', unit: 'cmH₂O', min: -8, max: 20 },
        { buf: fBuf, color: CLR.flow, label: 'Fluxo', unit: 'L/min', min: -50, max: 50 },
        { buf: vBuf, color: CLR.vol, label: 'Volume', unit: 'mL', min: -20, max: 500 },
      ]

      graphs.forEach((g, gi) => {
        const y0 = pad.top + gi * (gH + graphGap)
        const toY = (v: number) => y0 + gH - ((v - g.min) / (g.max - g.min)) * gH

        // Background
        ctx.fillStyle = 'rgba(255,255,255,0.015)'
        ctx.fillRect(pad.left, y0, gW, gH)

        // Grid lines
        ctx.strokeStyle = CLR.grid; ctx.lineWidth = 0.5
        for (let i = 0; i <= 4; i++) {
          const y = y0 + (gH / 4) * i
          ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + gW, y); ctx.stroke()
        }

        // Zero line
        if (g.min < 0) {
          const zy = toY(0)
          ctx.strokeStyle = CLR.axis; ctx.lineWidth = 0.6
          ctx.beginPath(); ctx.moveTo(pad.left, zy); ctx.lineTo(pad.left + gW, zy); ctx.stroke()
        }

        // Left axis label
        ctx.fillStyle = g.color; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'right'
        ctx.fillText(g.label, pad.left - 4, y0 + 10)
        ctx.fillStyle = CLR.text; ctx.font = '8px monospace'
        ctx.fillText(g.unit, pad.left - 4, y0 + 20)
        ctx.fillText(String(g.max), pad.left - 4, y0 + gH * 0.15)
        ctx.fillText(String(g.min), pad.left - 4, y0 + gH - 2)

        // Waveform — draw from buffer
        ctx.beginPath(); ctx.strokeStyle = g.color; ctx.lineWidth = 1.8
        const start = Math.max(0, bufIdx - bufferLen)
        let first = true
        for (let i = start; i < bufIdx; i++) {
          const x = pad.left + ((i - start) / bufferLen) * gW
          const y = toY(g.buf[i % bufferLen])
          const cy = Math.max(y0, Math.min(y0 + gH, y))
          if (first) { ctx.moveTo(x, cy); first = false } else ctx.lineTo(x, cy)
        }
        ctx.stroke()

        // Border
        ctx.strokeStyle = CLR.axis; ctx.lineWidth = 0.5
        ctx.strokeRect(pad.left, y0, gW, gH)
      })

      // ── Vital signs panel (right side) ──
      const vx = W - vitalsW - 4
      const progress = Math.min(timeRef.current / 30, 1)
      const fail = outcome === 'failure'

      const fr = fail ? Math.round(18 + 20 * progress) : 18
      const spo2 = fail ? Math.round(97 - 9 * progress) : 97
      const fc = fail ? Math.round(82 + 38 * progress) : 82
      const pas = fail ? Math.round(125 + 35 * progress) : 125

      const vitals = [
        { label: 'FR', value: fr, unit: 'ipm', color: fr > 35 ? CLR.warn : CLR.label, y: pad.top + 10 },
        { label: 'SpO₂', value: spo2, unit: '%', color: spo2 < 90 ? CLR.warn : '#22d3ee', y: pad.top + 70 },
        { label: 'FC', value: fc, unit: 'bpm', color: fc > 120 ? CLR.warn : CLR.ok, y: pad.top + 130 },
        { label: 'PAS', value: pas, unit: 'mmHg', color: pas > 180 ? CLR.warn : CLR.label, y: pad.top + 190 },
      ]

      // Vitals background
      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.fillRect(vx - 4, pad.top, vitalsW + 8, 240)
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 0.5
      ctx.strokeRect(vx - 4, pad.top, vitalsW + 8, 240)

      vitals.forEach(v => {
        // Blink effect for critical values
        const blink = (v.color === CLR.warn && Math.sin(timeRef.current * 6) > 0)
        ctx.fillStyle = blink ? 'rgba(239,68,68,0.3)' : 'transparent'
        ctx.fillRect(vx - 2, v.y - 2, vitalsW + 4, 50)

        ctx.fillStyle = v.color; ctx.font = 'bold 22px monospace'; ctx.textAlign = 'center'
        ctx.fillText(String(v.value), vx + vitalsW / 2, v.y + 28)
        ctx.font = '8px system-ui'; ctx.fillStyle = CLR.text
        ctx.fillText(v.label, vx + vitalsW / 2, v.y + 8)
        ctx.fillText(v.unit, vx + vitalsW / 2, v.y + 42)
      })

      // Method label
      ctx.fillStyle = CLR.label; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'center'
      ctx.fillText(METHOD_LABELS[method], vx + vitalsW / 2, pad.top + 258)

      // Status indicator
      if (fail && progress > 0.5) {
        ctx.fillStyle = 'rgba(239,68,68,0.15)'
        ctx.fillRect(vx - 4, pad.top + 270, vitalsW + 8, 20)
        ctx.fillStyle = CLR.warn; ctx.font = 'bold 9px system-ui'
        ctx.fillText('⚠ FALHA', vx + vitalsW / 2, pad.top + 283)
      } else if (!fail) {
        ctx.fillStyle = 'rgba(34,197,94,0.1)'
        ctx.fillRect(vx - 4, pad.top + 270, vitalsW + 8, 20)
        ctx.fillStyle = CLR.ok; ctx.font = 'bold 9px system-ui'
        ctx.fillText('✓ ESTÁVEL', vx + vitalsW / 2, pad.top + 283)
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameRef.current)
  }, [method, outcome])

  return (
    <div className={`rounded-xl overflow-hidden bg-[#0a0a0a] ${className ?? ''}`}>
      <div className="flex flex-wrap gap-1 p-2.5 bg-black/60 border-b border-white/10">
        <span className="text-white/40 text-[10px] self-center mr-0.5">Método:</span>
        {(['psv', 'tubo-t', 'cpap-atc', 'zeep'] as Method[]).map(m => (
          <button key={m} onClick={() => { setMethod(m); timeRef.current = 0 }}
            className={`px-2 py-1.5 rounded-md text-[10px] font-bold transition-all ${
              method === m ? 'bg-amber-500/25 text-amber-300 ring-1 ring-amber-500/40' : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}>{METHOD_LABELS[m]}</button>
        ))}
        <div className="w-px bg-white/10 mx-1" />
        <button onClick={() => setOutcome('success')}
          className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${
            outcome === 'success' ? 'bg-green-500/25 text-green-300 ring-1 ring-green-500/40' : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}>Sucesso</button>
        <button onClick={() => setOutcome('failure')}
          className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${
            outcome === 'failure' ? 'bg-red-500/25 text-red-300 ring-1 ring-red-500/40' : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}>Falha</button>
      </div>

      <canvas ref={canvasRef} className="w-full" style={{ height: 340 }} />

      <div className="p-2.5 bg-black/60 border-t border-white/10 text-[10px]">
        {outcome === 'success' && <p className="text-white/40">TRE bem-sucedido: FR estável ~18, SpO₂ {'>'} 95%, sinais vitais normais. Paciente elegível para extubação após 30-120 min.</p>}
        {outcome === 'failure' && <p className="text-white/40">Falha no TRE: FR progressivamente {'>'} 35, SpO₂ cai {'<'} 90%, taquicardia. Retornar ao suporte anterior, investigar causa, reavaliar em 24h.</p>}
      </div>
    </div>
  )
}
