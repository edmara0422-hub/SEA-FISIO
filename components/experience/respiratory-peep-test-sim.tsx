'use client'

import { useRef, useEffect, useState } from 'react'

/* ──────────────────────────────────────────────────────────────
   PEEP TEST — Avaliação de Limitação de Fluxo Expiratório
   Reduz PEEP em 3 cmH₂O e observa:
   - Sem limitação: fluxo exp AUMENTA (curva muda)
   - Com limitação: fluxo exp NÃO muda (curva igual)
   ────────────────────────────────────────────────────────────── */

type Mode = 'sem-limitacao' | 'com-limitacao'

const C = {
  baseline: '#888888',
  test: '#f59e0b',
  grid: 'rgba(255,255,255,0.06)',
  axis: 'rgba(255,255,255,0.2)',
  bg: '#111111',
  text: 'rgba(255,255,255,0.45)',
  label: '#ffffff',
  annotation: '#f59e0b',
}

export function RespiratoryPeepTestSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<Mode>('sem-limitacao')

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

    const pad = { top: 34, bot: 44, left: 58, right: 24 }
    const gW = W - pad.left - pad.right
    const gH = H - pad.top - pad.bot

    const xMin = 0, xMax = 600, yMin = -80, yMax = 50
    const toX = (v: number) => pad.left + ((v - xMin) / (xMax - xMin)) * gW
    const toY = (v: number) => pad.top + gH - ((v - yMin) / (yMax - yMin)) * gH

    // ── Generate loops ──

    // Linear interpolation
    const lin = (pts: [number, number][]) => {
      const out: [number, number][] = []
      const n = 120
      for (let i = 0; i <= n; i++) {
        const t = (i / n) * (pts.length - 1)
        const idx = Math.min(Math.floor(t), pts.length - 2)
        const f = t - idx
        out.push([
          pts[idx][0] + (pts[idx + 1][0] - pts[idx][0]) * f,
          pts[idx][1] + (pts[idx + 1][1] - pts[idx][1]) * f,
        ])
      }
      return out
    }

    // Exponential curve
    const expC = (vStart: number, vEnd: number, peak: number, tau: number) => {
      const out: [number, number][] = []
      const n = 120
      for (let i = 0; i <= n; i++) {
        const f = i / n
        out.push([vStart + (vEnd - vStart) * f, peak * Math.exp(-f * tau)])
      }
      return out
    }

    // Baseline loop (PEEP normal) — gray
    const baseInsp = lin([[0, 0], [20, 40], [450, 18], [480, 5], [500, 0]])
    const baseDrop = lin([[500, 0], [490, -50]])
    const baseExp = expC(490, 0, -50, 3)
    const baseline = [...baseInsp, ...baseDrop, ...baseExp]

    // Test loop (PEEP -3) depends on mode
    let test: [number, number][]

    if (mode === 'sem-limitacao') {
      // Without limitation: exp flow INCREASES after reducing PEEP
      const testInsp = lin([[0, 0], [20, 40], [480, 18], [510, 5], [530, 0]])
      const testDrop = lin([[530, 0], [520, -70]])  // deeper peak!
      const testExp = expC(520, 0, -70, 3)          // more flow
      test = [...testInsp, ...testDrop, ...testExp]
    } else {
      // With limitation: exp flow stays THE SAME despite PEEP reduction
      const testInsp = lin([[0, 0], [20, 40], [480, 18], [510, 5], [530, 0]])
      const testDrop = lin([[530, 0], [520, -50]])   // same peak!
      const testExp = expC(520, 0, -50, 3)           // same flow — limited!
      test = [...testInsp, ...testDrop, ...testExp]
    }

    // ── Draw ──
    ctx.fillStyle = C.bg
    ctx.fillRect(0, 0, W, H)

    // Title
    ctx.fillStyle = C.label; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center'
    ctx.fillText(mode === 'sem-limitacao' ? 'PEEP Test — Sem Limitação de Fluxo' : 'PEEP Test — Com Limitação de Fluxo', W / 2, 20)

    // Grid
    ctx.strokeStyle = C.grid; ctx.lineWidth = 0.5
    for (let i = 0; i <= 6; i++) {
      const y = pad.top + (gH / 6) * i
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke()
      const x = pad.left + (gW / 6) * i
      ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + gH); ctx.stroke()
    }

    // Axes
    ctx.strokeStyle = C.axis; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(pad.left, pad.top); ctx.lineTo(pad.left, pad.top + gH); ctx.lineTo(W - pad.right, pad.top + gH); ctx.stroke()

    // Zero line
    const zy = toY(0)
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(pad.left, zy); ctx.lineTo(W - pad.right, zy); ctx.stroke()

    // Axis labels
    ctx.fillStyle = C.text; ctx.font = '10px system-ui'; ctx.textAlign = 'center'
    ctx.fillText('Volume (L)', pad.left + gW / 2, H - 6)
    ctx.save(); ctx.translate(13, pad.top + gH / 2); ctx.rotate(-Math.PI / 2)
    ctx.fillText('Fluxo (L/min)', 0, 0); ctx.restore()

    // Axis values
    ctx.font = '9px monospace'; ctx.fillStyle = C.text
    ctx.textAlign = 'right'
    ctx.fillText('0', pad.left - 4, zy + 3)
    ctx.fillText(String(yMax), pad.left - 4, pad.top + 10)
    ctx.fillText(String(yMin), pad.left - 4, pad.top + gH - 2)

    // Draw path helper
    const drawPath = (pts: [number, number][], color: string, lw: number, dash?: number[]) => {
      ctx.beginPath()
      ctx.strokeStyle = color; ctx.lineWidth = lw
      if (dash) ctx.setLineDash(dash)
      pts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(toX(p[0]), toY(p[1]))
        else ctx.lineTo(toX(p[0]), toY(p[1]))
      })
      ctx.stroke()
      if (dash) ctx.setLineDash([])
    }

    // Draw baseline (gray, dashed)
    drawPath(baseline, C.baseline, 2, [4, 4])

    // Draw test (yellow, solid)
    drawPath(test, C.test, 2.5)

    // Arrow showing where flow changes (or doesn't)
    if (mode === 'sem-limitacao') {
      // Arrow pointing down from baseline exp to test exp (flow increased)
      const ax = toX(400), ay1 = toY(-35), ay2 = toY(-55)
      ctx.strokeStyle = C.annotation; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(ax, ay1); ctx.lineTo(ax, ay2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(ax, ay2); ctx.lineTo(ax - 5, ay2 + 8); ctx.moveTo(ax, ay2); ctx.lineTo(ax + 5, ay2 + 8); ctx.stroke()
      ctx.fillStyle = C.annotation; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left'
      ctx.fillText('Fluxo AUMENTOU', ax + 10, (ay1 + ay2) / 2 + 4)
      ctx.font = '9px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.fillText('→ Sem limitação', ax + 10, (ay1 + ay2) / 2 + 18)
      ctx.fillText('→ PEEP pode ser reduzida', ax + 10, (ay1 + ay2) / 2 + 30)
    } else {
      // Arrow showing curves overlap (flow didn't change)
      const ax = toX(350)
      ctx.fillStyle = '#ef4444'; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left'
      ctx.fillText('Fluxo NÃO mudou', ax, toY(-40))
      ctx.font = '9px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.fillText('→ Limitação de fluxo presente', ax, toY(-40) + 14)
      ctx.fillText('→ NÃO reduza PEEP', ax, toY(-40) + 26)
      // X mark
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2
      const cx = ax - 15, cy = toY(-40) - 5
      ctx.beginPath(); ctx.moveTo(cx - 6, cy - 6); ctx.lineTo(cx + 6, cy + 6); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx + 6, cy - 6); ctx.lineTo(cx - 6, cy + 6); ctx.stroke()
    }

    // Legend
    ctx.font = '10px system-ui'; ctx.textAlign = 'left'
    const ly = pad.top + 12
    ctx.strokeStyle = C.baseline; ctx.lineWidth = 2; ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(pad.left + 8, ly); ctx.lineTo(pad.left + 30, ly); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = C.baseline; ctx.fillText('PEEP basal', pad.left + 34, ly + 4)

    ctx.strokeStyle = C.test; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(pad.left + 8, ly + 16); ctx.lineTo(pad.left + 30, ly + 16); ctx.stroke()
    ctx.fillStyle = C.test; ctx.fillText('PEEP −3 cmH₂O', pad.left + 34, ly + 20)

    // Method note
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '9px system-ui'; ctx.textAlign = 'center'
    ctx.fillText('Reduza a PEEP em 3 cmH₂O e observe o fluxo expiratório', W / 2, H - 26)

  }, [mode])

  return (
    <div className={`rounded-xl overflow-hidden bg-[#111] ${className ?? ''}`}>
      <div className="flex gap-1.5 p-2.5 bg-black/40 border-b border-white/10">
        <span className="text-white/40 text-[10px] self-center mr-1">PEEP Test:</span>
        <button onClick={() => setMode('sem-limitacao')}
          className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
            mode === 'sem-limitacao' ? 'bg-amber-500/30 text-amber-300 ring-1 ring-amber-500/50' : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}>Sem Limitação</button>
        <button onClick={() => setMode('com-limitacao')}
          className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
            mode === 'com-limitacao' ? 'bg-red-500/30 text-red-300 ring-1 ring-red-500/50' : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}>Com Limitação</button>
      </div>

      <canvas ref={canvasRef} className="w-full" style={{ height: 400 }} />

      <div className="p-3 bg-black/40 border-t border-white/10 text-[10px] space-y-1">
        {mode === 'sem-limitacao' && <p className="text-white/40">Sem limitação de fluxo: ao reduzir PEEP em 3 cmH₂O, o fluxo expiratório AUMENTA. A curva expiratória se aprofunda. Isso indica que a PEEP pode ser reduzida com segurança.</p>}
        {mode === 'com-limitacao' && <p className="text-white/40">Com limitação de fluxo: ao reduzir PEEP em 3 cmH₂O, o fluxo expiratório NÃO muda. As curvas se sobrepõem na fase expiratória. Não reduza a PEEP — há compressão dinâmica de vias aéreas.</p>}
      </div>
    </div>
  )
}
