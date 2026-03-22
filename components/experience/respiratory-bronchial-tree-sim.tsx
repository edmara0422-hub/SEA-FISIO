'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ─────────────────────── types ─────────────────────── */

interface RespiratoryBronchialTreeSimProps { className?: string }

/* ─────────────────────── constants ─────────────────────── */

const FPS = 30
const FRAME_MS = 1000 / FPS
const COL_BG = 'rgba(2, 6, 12, 0.94)'
const COL_GRID = 'rgba(255, 255, 255, 0.02)'
const COL_TEXT_DIM = 'rgba(255, 255, 255, 0.30)'
const COL_CONDUCT = 'rgba(45, 212, 191,'
const COL_RESP = 'rgba(250, 204, 21,'
const FONT_MONO = '"SF Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace'

// generation definitions (matching the classic Weibel diagram)
const GEN_DEFS = [
  { gen: 0,  name: 'Traqueia',                 zone: 'c' },
  { gen: 1,  name: 'Brônquio',                 zone: 'c' },
  { gen: 2,  name: '',                          zone: 'c' },
  { gen: 3,  name: 'Bronquíolos',              zone: 'c' },
  { gen: 4,  name: '',                          zone: 'c' },
  { gen: 5,  name: 'Bronquíolos terminais',    zone: 'c' },
  // skip 6-14 (shown as dashed)
  { gen: 15, name: 'Bronquíolos de transição',  zone: 'r', zp: 0 },
  { gen: 16, name: '',                           zone: 'r', zp: 1 },
  { gen: 17, name: 'Bronquíolos respiratórios', zone: 'r', zp: 2 },
  { gen: 18, name: '',                           zone: 'r', zp: 3 },
  { gen: 19, name: '',                           zone: 'r', zp: 4 },
  { gen: 20, name: 'Ductos alveolares',         zone: 'r', zp: 5 },
  { gen: 21, name: '',                           zone: 'r', zp: 6 },
  { gen: 22, name: '',                           zone: 'r', zp: 7 },
  { gen: 23, name: 'Sacos alveolares',          zone: 'r', zp: 8 },
]

/* ─────────────────────── component ─────────────────────── */

export function RespiratoryBronchialTreeSim({ className }: RespiratoryBronchialTreeSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredGen, setHoveredGen] = useState<number | null>(null)
  const stRef = useRef({ t: 0, last: 0 })
  const rowYRef = useRef<{ gen: number; y: number; h: number }[]>([])

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const st = stRef.current
    const S = Math.min(w / 740, h / 540)

    ctx.fillStyle = COL_BG; ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = COL_GRID; ctx.lineWidth = 0.5
    const gs = 26 * S
    for (let gx = 0; gx < w; gx += gs) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke() }
    for (let gy = 0; gy < h; gy += gs) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke() }

    // layout
    const marginL = 110 * S   // left labels area
    const marginR = 65 * S    // right gen numbers
    const treeL = marginL     // tree drawing starts
    const treeR = w - marginR // tree drawing ends
    const treeCx = (treeL + treeR) / 2 // center of tree
    const treeW = treeR - treeL

    const topY = 20 * S
    const botY = h - 15 * S
    const totalH = botY - topY

    // visible rows: 15 generations shown (6 conducting + skip + 9 respiratory)
    const rows = GEN_DEFS.length // 15
    const rowH = totalH / rows
    const rowYs: typeof rowYRef.current = []

    // ── ZONE BACKGROUNDS
    // conducting zone: gen 0-5 (rows 0-5)
    const condBot = topY + 6 * rowH
    ctx.fillStyle = `${COL_CONDUCT} 0.03)`
    ctx.fillRect(0, topY, w, condBot - topY)

    // skip zone indicator
    const skipTop = condBot
    const skipBot = condBot + rowH * 0 // We'll draw dashed lines instead

    // respiratory zone: gen 15-23 (rows 6-14)
    const respTop = topY + 6 * rowH
    ctx.fillStyle = `${COL_RESP} 0.025)`
    ctx.fillRect(0, respTop, w, botY - respTop)

    // zone divider
    ctx.beginPath()
    ctx.moveTo(15, respTop); ctx.lineTo(w - 15, respTop)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.5
    ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([])

    // ── ZONE LABELS (far left, vertical)
    ctx.save()
    ctx.translate(14, topY + (condBot - topY) / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.font = `700 ${Math.max(7, 9 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = `${COL_CONDUCT} 0.55)`
    ctx.fillText('VIAS AÉREAS DE CONDUÇÃO', 0, 0)
    ctx.restore()

    ctx.save()
    ctx.translate(14, respTop + (botY - respTop) / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.font = `700 ${Math.max(7, 9 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = `${COL_RESP} 0.55)`
    ctx.fillText('ZONA RESPIRATÓRIA — ÁCINOS', 0, 0)
    ctx.restore()

    // ── RIGHT COLUMN HEADERS
    ctx.font = `700 ${Math.max(7, 8 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    const zColX = w - 35 * S
    const zpColX = w - 12 * S
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('Z', zColX, topY - 5)
    ctx.fillText("Z'", zpColX, topY - 5)

    // ── DRAW THE BIFURCATING TREE ──
    // The tree is drawn as a single continuous branching structure
    // Each generation level corresponds to a Y position
    // Branches split at each level

    // We track branch endpoints: at each gen, store all x positions
    // Gen 0: 1 branch at center
    // Gen 1: 2 branches
    // Gen 2: 4 branches
    // etc.

    // For visual clarity, max visible branches ~64 (gen 5 = 32 branches, that's enough)
    // After the skip, we continue from gen 15 with same visual density

    const genYPos: number[] = [] // Y position for each row

    for (let i = 0; i < rows; i++) {
      genYPos.push(topY + (i + 0.5) * rowH)
      rowYs.push({ gen: GEN_DEFS[i].gen, y: topY + i * rowH, h: rowH })
    }
    rowYRef.current = rowYs

    // build branch positions per visual level
    type BranchSet = number[] // x positions of branches at this level
    const branchSets: BranchSet[] = []

    // conducting zone (gen 0-5): actually bifurcate
    // gen 0: 1 branch
    branchSets.push([treeCx])
    // gen 1-5: each bifurcates
    for (let g = 1; g <= 5; g++) {
      const prev = branchSets[g - 1]
      const next: number[] = []
      // spread for this generation
      const spread = (treeW * 0.4) / Math.pow(2, g) * 0.85
      for (const px of prev) {
        next.push(px - spread)
        next.push(px + spread)
      }
      branchSets.push(next)
    }

    // respiratory zone (gen 15-23): continue from where conducting left off
    // We restart with same visual positions as gen 5 (32 branches)
    // and keep splitting but with tighter spacing
    let respBranches = [...branchSets[5]]
    const respSets: BranchSet[] = [respBranches]
    for (let rg = 1; rg <= 8; rg++) {
      const prev = respSets[rg - 1]
      const next: number[] = []
      const spread = (treeW * 0.3) / Math.pow(2, 5 + rg) * 1.2
      for (const px of prev) {
        next.push(px - spread)
        next.push(px + spread)
      }
      // limit visible branches to prevent clutter
      if (next.length > 128) {
        // subsample
        const step = Math.ceil(next.length / 128)
        const sampled: number[] = []
        for (let i = 0; i < next.length; i += step) sampled.push(next[i])
        respSets.push(sampled)
      } else {
        respSets.push(next)
      }
    }

    // ── DRAW CONDUCTING BRANCHES (gen 0-5)
    for (let g = 0; g <= 5; g++) {
      const branches = branchSets[g]
      const y = genYPos[g]
      const prevY = g > 0 ? genYPos[g - 1] : y - rowH * 0.5
      const prevBranches = g > 0 ? branchSets[g - 1] : [treeCx]
      const isHi = hoveredGen === GEN_DEFS[g].gen

      // line width decreases with generation
      const lw = Math.max(1, (5 - g * 0.7) * S)

      // draw connections from parent to children
      for (let b = 0; b < branches.length; b++) {
        const bx = branches[b]
        const parentIdx = Math.floor(b / 2)
        const parentX = prevBranches[Math.min(parentIdx, prevBranches.length - 1)]

        // vertical from parent level to this level
        if (g > 0) {
          ctx.beginPath()
          ctx.moveTo(parentX, prevY + 2)
          ctx.lineTo(parentX, prevY + rowH * 0.3)
          ctx.lineTo(bx, y - rowH * 0.15)
          ctx.lineTo(bx, y + 2)
          ctx.strokeStyle = isHi ? `${COL_CONDUCT} 0.75)` : `${COL_CONDUCT} 0.4)`
          ctx.lineWidth = lw
          ctx.lineCap = 'round'; ctx.lineJoin = 'round'
          ctx.stroke()
        } else {
          // trachea: single straight line
          ctx.beginPath()
          ctx.moveTo(bx, y - rowH * 0.35)
          ctx.lineTo(bx, y + rowH * 0.15)
          ctx.strokeStyle = isHi ? `${COL_CONDUCT} 0.75)` : `${COL_CONDUCT} 0.45)`
          ctx.lineWidth = lw * 1.5
          ctx.stroke()

          // C-rings on trachea
          for (let r = 0; r < 3; r++) {
            const ry = y - rowH * 0.25 + r * rowH * 0.15
            ctx.beginPath()
            ctx.arc(bx, ry, lw * 1.2, -0.6, Math.PI + 0.6)
            ctx.strokeStyle = `${COL_CONDUCT} 0.15)`
            ctx.lineWidth = 2 * S; ctx.stroke()
          }
        }
      }
    }

    // ── SKIP INDICATOR (dashed lines from gen 5 to gen 15)
    const skipFromY = genYPos[5] + rowH * 0.15
    const skipToY = genYPos[6] - rowH * 0.15
    const skipBranches = branchSets[5]
    // only draw a few dashed lines (subsample)
    const skipSample = Math.min(skipBranches.length, 16)
    const skipStep = Math.max(1, Math.floor(skipBranches.length / skipSample))
    for (let i = 0; i < skipBranches.length; i += skipStep) {
      const bx = skipBranches[i]
      ctx.beginPath()
      ctx.moveTo(bx, skipFromY)
      ctx.lineTo(bx, skipToY)
      ctx.strokeStyle = `${COL_CONDUCT} 0.15)`
      ctx.lineWidth = 1
      ctx.setLineDash([3, 5]); ctx.stroke(); ctx.setLineDash([])
    }

    // skip label
    ctx.font = `500 ${Math.max(6, 7 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    ctx.fillStyle = COL_TEXT_DIM
    ctx.fillText('· · · gerações 6–14 · · ·', treeCx, (skipFromY + skipToY) / 2 + 3)

    // ── DRAW RESPIRATORY BRANCHES (gen 15-23)
    for (let rg = 0; rg <= 8; rg++) {
      const rowIdx = 6 + rg // index in GEN_DEFS
      if (rowIdx >= GEN_DEFS.length) break
      const branches = respSets[rg]
      const y = genYPos[rowIdx]
      const prevY = rg > 0 ? genYPos[rowIdx - 1] : genYPos[5] // connect from conducting
      const prevBranches = rg > 0 ? respSets[rg - 1] : branchSets[5]
      const isHi = hoveredGen === GEN_DEFS[rowIdx].gen

      const lw = Math.max(0.5, (2.5 - rg * 0.2) * S)

      // draw branches
      for (let b = 0; b < branches.length; b++) {
        const bx = branches[b]
        const parentIdx = Math.floor(b / 2)
        const parentX = prevBranches[Math.min(parentIdx, prevBranches.length - 1)]

        ctx.beginPath()
        ctx.moveTo(parentX, prevY + 2)
        ctx.lineTo(bx, y + 2)
        ctx.strokeStyle = isHi ? `${COL_RESP} 0.7)` : `${COL_RESP} 0.3)`
        ctx.lineWidth = lw
        ctx.lineCap = 'round'
        ctx.stroke()

        // alveoli on gen 20+ (small circles attached to branches)
        if (GEN_DEFS[rowIdx].gen >= 20) {
          const alvN = GEN_DEFS[rowIdx].gen >= 22 ? 3 : 2
          for (let a = 0; a < alvN; a++) {
            const side = a % 2 === 0 ? -1 : 1
            const aOff = (a + 1) * 2.5 * S * side
            const ay = y - 1 + a * 1.5
            const ar = (1.5 + Math.sin(st.t * 0.6 + b + a) * 0.3) * S

            ctx.beginPath(); ctx.arc(bx + aOff, ay, ar, 0, Math.PI * 2)
            ctx.fillStyle = isHi ? `${COL_RESP} 0.12)` : `${COL_RESP} 0.04)`
            ctx.fill()
            ctx.strokeStyle = isHi ? `${COL_RESP} 0.45)` : `${COL_RESP} 0.15)`
            ctx.lineWidth = 0.4; ctx.stroke()
          }
        }

        // alveolar sacs at gen 23 (grape-like cluster at bottom)
        if (GEN_DEFS[rowIdx].gen === 23 && b % 2 === 0) {
          const sacN = 5
          for (let sa = 0; sa < sacN; sa++) {
            const saa = (sa / sacN) * Math.PI + Math.PI
            const sar = (2.5 + Math.sin(st.t * 0.5 + sa) * 0.3) * S
            const sax = bx + Math.cos(saa) * sar * 2
            const say = y + 4 + Math.sin(saa) * sar * 1.5 + sar

            ctx.beginPath(); ctx.arc(sax, say, sar, 0, Math.PI * 2)
            ctx.fillStyle = isHi ? `${COL_RESP} 0.15)` : `${COL_RESP} 0.05)`
            ctx.fill()
            ctx.strokeStyle = isHi ? `${COL_RESP} 0.5)` : `${COL_RESP} 0.2)`
            ctx.lineWidth = 0.5; ctx.stroke()
          }
        }
      }
    }

    // ── LEFT LABELS (structure names)
    ctx.textAlign = 'right'
    const labelX = marginL - 10 * S

    for (let i = 0; i < GEN_DEFS.length; i++) {
      const g = GEN_DEFS[i]
      if (!g.name) continue
      const y = genYPos[i]
      const isHi = hoveredGen === g.gen
      const isResp = g.zone === 'r'

      ctx.font = `${isHi ? '700' : '600'} ${Math.max(7, 8.5 * S)}px ${FONT_MONO}`
      ctx.fillStyle = isHi
        ? (isResp ? `${COL_RESP} 0.9)` : `${COL_CONDUCT} 0.9)`)
        : (isResp ? `${COL_RESP} 0.5)` : `${COL_CONDUCT} 0.45)`)
      ctx.fillText(g.name, labelX, y + 4)

      // connector line from label to tree
      const nearestBranch = i <= 5 ? branchSets[i] : respSets[i - 6]
      if (nearestBranch && nearestBranch.length > 0) {
        const firstBx = nearestBranch[0]
        ctx.beginPath()
        ctx.moveTo(labelX + 5, y)
        ctx.lineTo(firstBx - 5, y)
        ctx.strokeStyle = isHi
          ? (isResp ? `${COL_RESP} 0.2)` : `${COL_CONDUCT} 0.15)`)
          : 'rgba(255,255,255,0.03)'
        ctx.lineWidth = 0.5
        ctx.setLineDash([2, 3]); ctx.stroke(); ctx.setLineDash([])
      }
    }

    // ── RIGHT COLUMN: Z and Z' numbers
    ctx.textAlign = 'center'

    for (let i = 0; i < GEN_DEFS.length; i++) {
      const g = GEN_DEFS[i]
      const y = genYPos[i]
      const isHi = hoveredGen === g.gen
      const isResp = g.zone === 'r'

      // Z (generation number)
      ctx.font = `${isHi ? '700' : '600'} ${Math.max(8, 10 * S)}px ${FONT_MONO}`
      ctx.fillStyle = isHi
        ? (isResp ? `${COL_RESP} 0.9)` : `${COL_CONDUCT} 0.8)`)
        : (isResp ? `${COL_RESP} 0.4)` : `${COL_CONDUCT} 0.35)`)
      ctx.fillText(`${g.gen}`, zColX, y + 4)

      // Z' (respiratory zone generation, only for zone 'r')
      if ('zp' in g && g.zp !== undefined) {
        ctx.fillStyle = isHi ? `${COL_RESP} 0.8)` : `${COL_RESP} 0.3)`
        ctx.fillText(`${g.zp}`, zpColX, y + 4)
      }

      // row hover highlight
      if (isHi) {
        ctx.fillStyle = isResp ? `${COL_RESP} 0.04)` : `${COL_CONDUCT} 0.04)`
        ctx.fillRect(0, topY + i * rowH, w, rowH)
      }

      // subtle row line
      ctx.beginPath()
      ctx.moveTo(treeL, topY + i * rowH); ctx.lineTo(w - 10, topY + i * rowH)
      ctx.strokeStyle = 'rgba(255,255,255,0.02)'; ctx.lineWidth = 0.5; ctx.stroke()
    }

    // ── AIR FLOW PARTICLES (subtle, flowing down through the tree)
    const pN = 10
    for (let i = 0; i < pN; i++) {
      const pPhase = ((st.t * 0.3 + i * 0.1) % 1)
      const rowFloat = pPhase * (rows - 1)
      const rowIdx2 = Math.floor(rowFloat)
      const rowFrac = rowFloat - rowIdx2

      // pick a branch at this level
      const set = rowIdx2 <= 5 ? branchSets[rowIdx2] : respSets[Math.min(rowIdx2 - 6, respSets.length - 1)]
      if (!set || set.length === 0) continue
      const branchIdx = i % set.length
      const bx = set[branchIdx]
      const py = genYPos[rowIdx2] ? lerp(genYPos[rowIdx2], genYPos[Math.min(rowIdx2 + 1, rows - 1)] ?? genYPos[rowIdx2], rowFrac) : 0
      if (py === 0) continue

      const px = bx + Math.sin(st.t * 3 + i * 2) * 2

      const zone = rowIdx2 <= 5 ? 'c' : 'r'
      const col = zone === 'c' ? COL_CONDUCT : COL_RESP

      const g = ctx.createRadialGradient(px, py, 0, px, py, 4 * S)
      g.addColorStop(0, `${col} 0.25)`); g.addColorStop(1, `${col} 0)`)
      ctx.fillStyle = g; ctx.fillRect(px - 5, py - 5, 10, 10)
      ctx.beginPath(); ctx.arc(px, py, 1.5 * S, 0, Math.PI * 2)
      ctx.fillStyle = `${col} 0.7)`; ctx.fill()
    }

    // ── BOTTOM STATS
    ctx.font = `600 ${Math.max(8, 10 * S)}px ${FONT_MONO}`
    ctx.textAlign = 'center'
    const statY2 = h - 5
    const stats = [
      { v: '23 gerações', c: `${COL_CONDUCT} 0.5)` },
      { v: '2²³ ≈ 8M ramificações', c: `${COL_CONDUCT} 0.4)` },
      { v: '300–500M alvéolos', c: `${COL_RESP} 0.5)` },
      { v: 'Área: 70–100 m²', c: `${COL_RESP} 0.5)` },
    ]
    const stW = (w - 40) / stats.length
    for (let i = 0; i < stats.length; i++) {
      ctx.fillStyle = stats[i].c
      ctx.fillText(stats[i].v, 20 + i * stW + stW / 2, statY2)
    }

    function lerp(a2: number, b2: number, t2: number) { return a2 + (b2 - a2) * t2 }
  }, [hoveredGen])

  useEffect(() => {
    const c = canvasRef.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    let raf = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const s = stRef.current
      if (now - s.last < FRAME_MS) return; s.last = now; s.t += 0.03
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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current; if (!c) return
    const r = c.getBoundingClientRect()
    const my = e.clientY - r.top
    let found: number | null = null
    for (const row of rowYRef.current) {
      if (my >= row.y && my <= row.y + row.h) { found = row.gen; break }
    }
    setHoveredGen(found)
  }, [])

  const activeGen = hoveredGen !== null ? GEN_DEFS.find(g => g.gen === hoveredGen) : null

  return (
    <div className={`relative w-full ${className ?? ''}`}>
      <canvas ref={canvasRef} className="w-full rounded-2xl"
        style={{ aspectRatio: '16/10', background: COL_BG }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredGen(null)} />
      {activeGen && activeGen.name && (
        <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md px-4 py-2.5" style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-bold" style={{ color: activeGen.zone === 'c' ? `${COL_CONDUCT} 0.9)` : `${COL_RESP} 0.9)` }}>
              Geração {activeGen.gen}
            </span>
            <span className="text-[11px] font-semibold text-white/80">{activeGen.name}</span>
            <span className="text-[9px] text-white/40 ml-auto">
              {activeGen.zone === 'c' ? 'Zona Condutora' : 'Zona Respiratória'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
