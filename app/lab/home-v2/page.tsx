import { BrainHeroScene } from '@/components/experience/brain-hero-scene'
import { CardioHeroScene } from '@/components/experience/cardio-hero-scene'
import { PneumoHeroScene } from '@/components/experience/pneumo-hero-scene'
import { SystemEntryGrid } from '@/components/experience/system-entry-grid'
import { VitalHudStrip } from '@/components/experience/vital-hud-strip'

export default function HomeV2Page() {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(110,132,255,0.18),_transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs uppercase tracking-[0.32em] text-white/45">Home V2 Foundation</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-white">
              Entrada imersiva com linguagem de tecnologia medica real, sem virar tela tecnica.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
              Esta versao separa experiencia visual da home e simulacao profunda em sistemas.
              O objetivo aqui e vender presenca, anatomia e credibilidade.
            </p>
          </div>
          <div className="h-[30rem]">
            <BrainHeroScene />
          </div>
        </div>

        <div className="grid gap-6">
          <div className="overflow-hidden rounded-[2rem] border border-red-400/20 bg-[linear-gradient(180deg,rgba(255,94,94,0.12),rgba(255,255,255,0.03))]">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.28em] text-red-200/60">Cardio Presence</p>
              <h2 className="mt-2 text-xl font-semibold">Atividade cardiaca como sinal de sistema vivo</h2>
            </div>
            <div className="h-56">
              <CardioHeroScene />
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(14,165,233,0.12),rgba(255,255,255,0.03))]">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/60">Pneumo Presence</p>
              <h2 className="mt-2 text-xl font-semibold">Pulmao e mecanica respiratoria como eixo clinico</h2>
            </div>
            <div className="h-56">
              <PneumoHeroScene />
            </div>
          </div>
        </div>
      </section>

      <VitalHudStrip />
      <SystemEntryGrid />
    </div>
  )
}
