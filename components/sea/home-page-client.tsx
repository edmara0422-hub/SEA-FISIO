'use client'

import dynamic from 'next/dynamic'
import { BookOpen, Cpu, Brain } from 'lucide-react'
import BusinessClock from '@/components/sea/greeting-clock-card'
import { PerformanceBar } from '@/components/sea/performance-bar'
import { SeaBackdrop } from '@/components/sea/sea-backdrop'
import { TopBarSEA } from '@/components/sea/top-bar-sea'

const SimulationMarquee = dynamic(
  () => import('@/components/sea/simulation-marquee').then((m) => m.SimulationMarquee),
  { ssr: false, loading: () => <div className="h-[clamp(140px,24vw,190px)] animate-pulse rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }} /> }
)

export default function HomePageClient() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020202] text-white">
      <SeaBackdrop />
      <TopBarSEA />

      <main className="relative z-10 pb-32 pt-28 md:pt-32">
        <div className="mx-auto max-w-2xl px-4 md:px-8">
          {/* Greeting + Clock */}
          <div className="mb-8">
            <BusinessClock variant="hero" showGreeting />
          </div>
        </div>

        {/* ── 3D Marquee — single WebGL, all models ── */}
        <SimulationMarquee />

        <div className="mx-auto max-w-2xl px-4 md:px-8">
          {/* Quick stats */}
          <div className="mt-8 grid grid-cols-3 gap-2">
            <QuickStat icon={BookOpen} label="Modulos" value="3" sub="Neuro · Cardio · Pneumo" />
            <QuickStat icon={Cpu} label="Simulacoes" value="40+" sub="Interativas" />
            <QuickStat icon={Brain} label="Topicos" value="14" sub="Conteudo clinico" />
          </div>

          {/* Performance */}
          <div className="mt-5">
            <PerformanceBar />
          </div>
        </div>
      </main>
    </div>
  )
}

// ── Simulation Strip: infinite marquee with 3D scenes ──
function SimulationStrip() {
  const [scenesReady, setScenesReady] = useState(false)

  // Delay 3D mount by 1.5s so the strip shows immediately with placeholders
  useEffect(() => {
    const t = setTimeout(() => setScenesReady(true), 1500)
    return () => clearTimeout(t)
  }, [])

  // 3 originals + 3 clones for seamless loop
  const items = [...SCENES, ...SCENES]

  return (
    <div className="relative overflow-hidden" style={{ height: 'clamp(150px, 26vw, 200px)' }}>
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20" style={{ background: 'linear-gradient(to right, #020202, transparent)' }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20" style={{ background: 'linear-gradient(to left, #020202, transparent)' }} />

      {/* Perspective wrapper */}
      <div className="h-full" style={{ perspective: '800px', perspectiveOrigin: '50% 50%' }}>
        <div
          className="flex h-full items-center gap-4 pl-4"
          style={{ animation: 'marquee-strip 18s linear infinite', width: 'max-content' }}
        >
          {items.map((scene, i) => {
            const isOriginal = i < SCENES.length
            const Icon = scene.icon

            return (
              <div
                key={`${scene.id}-${i}`}
                className="relative shrink-0 overflow-hidden"
                style={{
                  width: 'clamp(180px, 38vw, 260px)',
                  height: '82%',
                  borderRadius: '1.3rem',
                  border: `1px solid ${scene.color}15`,
                  background: `radial-gradient(ellipse at 50% 80%, ${scene.color}08, #050505 70%)`,
                  transform: 'rotateY(-6deg)',
                }}
              >
                {/* 3D Scene — only originals, delayed mount */}
                {isOriginal && scenesReady && (
                  <div className="absolute inset-0 opacity-90">
                    <scene.Scene transparent />
                  </div>
                )}

                {/* Animated placeholder before 3D loads */}
                {(!scenesReady || !isOriginal) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="h-10 w-10 animate-pulse" style={{ color: `${scene.color}20` }} />
                  </div>
                )}

                {/* Bottom gradient */}
                <div className="pointer-events-none absolute inset-0" style={{
                  background: `linear-gradient(to top, ${scene.color}10 0%, transparent 50%)`,
                }} />

                {/* Top shimmer line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{
                  background: `linear-gradient(90deg, transparent, ${scene.color}25 50%, transparent)`,
                }} />

                {/* Label */}
                <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5">
                  <Icon className="h-2.5 w-2.5" style={{ color: `${scene.color}80` }} />
                  <span className="text-[9px] font-semibold tracking-wider" style={{ color: `${scene.color}70` }}>
                    {scene.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes marquee-strip {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

// ── Quick stat card ──
function QuickStat({ icon: Icon, label, value, sub }: { icon: typeof BookOpen; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/8 p-3 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <Icon className="mx-auto mb-1.5 h-4 w-4 text-white/25" />
      <p className="text-lg font-bold text-white/80">{value}</p>
      <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/30">{label}</p>
      <p className="mt-0.5 text-[7px] text-white/18">{sub}</p>
    </div>
  )
}
