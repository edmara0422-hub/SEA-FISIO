'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

/* ──────────────────────────────────────────────────────────────
   PEEP — Recrutamento Alveolar Interativo
   Visualização de alvéolos recrutados conforme PEEP aumenta
   ────────────────────────────────────────────────────────────── */

interface Alveolus {
  x: number; y: number; baseR: number
  recruitPEEP: number // PEEP mínima para recrutar
  phase: number       // fase de animação de respiração
}

export function RespiratoryVmiPeepSim({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef  = useRef(0)
  const timeRef   = useRef(0)

  const [peep, setPeep] = useState(5)
  const [paused, setPaused] = useState(false)

  // Gerar alvéolos deterministicamente
  const alveoliRef = useRef<Alveolus[]>([])
  if (alveoliRef.current.length === 0) {
    const alveoli: Alveolus[] = []
    // Seed-based pseudo-random
    let seed = 42
    const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return seed / 2147483647 }

    // 2 clusters (pulmões L e R)
    const centers = [
      { cx: 0.32, cy: 0.5 }, // esquerdo
      { cx: 0.68, cy: 0.5 }, // direito
    ]

    for (const c of centers) {
      for (let i = 0; i < 24; i++) {
        const angle = rand() * Math.PI * 2
        const dist = rand() * 0.22
        alveoli.push({
          x: c.cx + Math.cos(angle) * dist,
          y: c.cy + Math.sin(angle) * dist * 1.3,
          baseR: 10 + rand() * 6,
          recruitPEEP: Math.floor(rand() * 18) + 1, // 1-18 cmH₂O
          phase: rand() * Math.PI * 2,
        })
      }
    }
    alveoliRef.current = alveoli
  }

  const draw = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number, dt: number) => {
    timeRef.current += dt

    ctx.fillStyle = '#050a14'
    ctx.fillRect(0, 0, W, H)

    const alveoli = alveoliRef.current
    const recruited = alveoli.filter(a => a.recruitPEEP <= peep).length
    const total = alveoli.length
    const pct = Math.round((recruited / total) * 100)

    // Draw title
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = 'bold 12px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('RECRUTAMENTO ALVEOLAR', W / 2, 22)

    // Draw lung outlines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    const lungsY = 55
    const lungsH = H - 100

    // Left lung outline
    ctx.beginPath()
    ctx.ellipse(W * 0.32, lungsY + lungsH * 0.5, W * 0.22, lungsH * 0.42, 0, 0, Math.PI * 2)
    ctx.stroke()

    // Right lung outline
    ctx.beginPath()
    ctx.ellipse(W * 0.68, lungsY + lungsH * 0.5, W * 0.22, lungsH * 0.42, 0, 0, Math.PI * 2)
    ctx.stroke()

    // Trachea
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(W * 0.5, lungsY - 10)
    ctx.lineTo(W * 0.5, lungsY + lungsH * 0.15)
    ctx.lineTo(W * 0.38, lungsY + lungsH * 0.3)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(W * 0.5, lungsY + lungsH * 0.15)
    ctx.lineTo(W * 0.62, lungsY + lungsH * 0.3)
    ctx.stroke()

    // Draw alveoli
    const breathCycle = Math.sin(timeRef.current * 1.2) * 0.5 + 0.5 // 0-1

    alveoli.forEach(a => {
      const ax = a.x * W
      const ay = lungsY + a.y * lungsH

      const isRecruited = a.recruitPEEP <= peep

      if (isRecruited) {
        // Alvéolo aberto — respira
        const breathPhase = Math.sin(timeRef.current * 1.2 + a.phase) * 0.5 + 0.5
        const expansionFactor = 1 + breathPhase * 0.25 + (peep / 40) // mais PEEP = mais expandido
        const r = a.baseR * expansionFactor

        // Glow
        ctx.shadowColor = 'rgba(34, 211, 238, 0.3)'
        ctx.shadowBlur = 8

        // Fill
        const grad = ctx.createRadialGradient(ax, ay, 0, ax, ay, r)
        grad.addColorStop(0, 'rgba(34, 211, 238, 0.15)')
        grad.addColorStop(0.7, 'rgba(34, 211, 238, 0.06)')
        grad.addColorStop(1, 'rgba(34, 211, 238, 0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(ax, ay, r, 0, Math.PI * 2)
        ctx.fill()

        // Border
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.5)'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.arc(ax, ay, r, 0, Math.PI * 2)
        ctx.stroke()

        ctx.shadowBlur = 0

      } else {
        // Alvéolo colapsado (atelectasia)
        const r = a.baseR * 0.35

        ctx.fillStyle = 'rgba(248, 113, 113, 0.15)'
        ctx.beginPath()
        ctx.arc(ax, ay, r, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = 'rgba(248, 113, 113, 0.35)'
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.arc(ax, ay, r, 0, Math.PI * 2)
        ctx.stroke()

        // X mark
        ctx.strokeStyle = 'rgba(248, 113, 113, 0.3)'
        ctx.lineWidth = 0.8
        const s = r * 0.5
        ctx.beginPath(); ctx.moveTo(ax - s, ay - s); ctx.lineTo(ax + s, ay + s); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(ax + s, ay - s); ctx.lineTo(ax - s, ay + s); ctx.stroke()
      }
    })

    // Stats bar at bottom
    const barY = H - 40
    const barW = W * 0.6
    const barX = (W - barW) / 2
    const barH = 10

    // Background
    ctx.fillStyle = 'rgba(255,255,255,0.03)'
    ctx.beginPath()
    ctx.roundRect(barX, barY, barW, barH, 5)
    ctx.fill()

    // Fill
    const fillW = barW * (pct / 100)
    const barGrad = ctx.createLinearGradient(barX, 0, barX + fillW, 0)
    barGrad.addColorStop(0, 'rgba(34,211,238,0.5)')
    barGrad.addColorStop(1, pct > 70 ? 'rgba(74,222,128,0.5)' : 'rgba(251,191,36,0.5)')
    ctx.fillStyle = barGrad
    ctx.beginPath()
    ctx.roundRect(barX, barY, fillW, barH, 5)
    ctx.fill()

    // Stats text
    ctx.fillStyle = '#22d3ee'
    ctx.font = 'bold 13px "SF Mono", Menlo, monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`${recruited}/${total} alvéolos recrutados (${pct}%)`, W / 2, barY - 8)

    // PEEP display
    ctx.fillStyle = '#fbbf24'
    ctx.font = 'bold 16px "SF Mono", Menlo, monospace'
    ctx.textAlign = 'right'
    ctx.fillText(`PEEP: ${peep} cmH₂O`, W - 12, 22)

    // SpO₂ estimada
    const spo2 = Math.min(99, Math.round(82 + pct * 0.17))
    ctx.fillStyle = spo2 >= 90 ? '#4ade80' : spo2 >= 85 ? '#fbbf24' : '#f87171'
    ctx.font = 'bold 12px "SF Mono", Menlo, monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`SpO₂ ≈ ${spo2}%`, 12, 22)

  }, [peep, paused])

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    if (!ctx) return

    let prev = 0
    const loop = (now: number) => {
      const dt = prev ? Math.min((now - prev) / 1000, 0.05) : 0.016
      prev = now

      const dpr = window.devicePixelRatio || 1
      const r = cvs.getBoundingClientRect()
      if (cvs.width !== r.width * dpr || cvs.height !== r.height * dpr) {
        cvs.width = r.width * dpr; cvs.height = r.height * dpr
      }

      ctx.save(); ctx.scale(dpr, dpr)
      draw(ctx, r.width, r.height, paused ? 0 : dt)
      ctx.restore()

      frameRef.current = requestAnimationFrame(loop)
    }
    frameRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameRef.current)
  }, [draw, paused])

  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <div className="flex items-center gap-3 px-1">
        <span className="text-[9px] text-amber-400/70 font-mono font-bold">PEEP</span>
        <input type="range" min={0} max={20} value={peep}
          onChange={e => setPeep(+e.target.value)}
          className="flex-1 h-1 accent-amber-400" />
        <span className="text-sm font-bold text-amber-400 font-mono w-8 text-right">{peep}</span>
        <span className="text-[8px] text-white/20 font-mono">cmH₂O</span>

        <button onClick={() => setPaused(!paused)}
          className="px-2 py-1 rounded text-[10px] font-semibold bg-white/[0.03] border border-white/8 text-white/40 hover:text-white/70 ml-auto"
        >{paused ? '▶' : '⏸'}</button>
      </div>

      <canvas ref={canvasRef}
        className="w-full rounded-lg border border-white/8"
        style={{ height: 440, background: '#050a14' }}
      />

      <div className="flex items-center justify-center gap-4">
        {[
          { c: '#22d3ee', l: 'Alvéolo recrutado (aberto)' },
          { c: '#f87171', l: 'Atelectasia (colapsado)' },
        ].map(x => (
          <div key={x.l} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: x.c, background: `color-mix(in srgb, ${x.c} 15%, transparent)` }} />
            <span className="text-[9px] text-white/30 font-mono">{x.l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
