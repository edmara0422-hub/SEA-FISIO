import { ECGCanvas } from '@/components/signals/ecg-canvas'
import { calculateCardioMetrics } from '@/lib/clinical/cardio/cardio-metrics'
import { RHYTHM_LIBRARY } from '@/lib/clinical/cardio/rhythm-library'

export default function CardioV2Page() {
  const rhythm = RHYTHM_LIBRARY.sinus
  const metrics = calculateCardioMetrics({
    bpm: rhythm.bpm,
    prIntervalMs: rhythm.prIntervalMs,
    qrsWidthMs: rhythm.qrsWidthMs,
    qtIntervalMs: rhythm.qtIntervalMs,
  })

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <p className="text-xs uppercase tracking-[0.32em] text-white/45">Cardio V2</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Base para ECG em canvas com sweep clinico.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60">
          Esta rota ja nasce separada da home. O proximo salto aqui e ritmo, grade clinica, sweep constante
          e biblioteca de arritmias sem depender de Recharts.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[2rem] border border-white/10 bg-black/40 p-5">
          <ECGCanvas />
        </div>
        <div className="grid gap-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Preset</p>
            <p className="mt-3 text-2xl font-semibold">{rhythm.label}</p>
            <p className="mt-2 text-sm text-white/60">
              Biblioteca inicial de ritmos organizada para evoluir sem tocar na tela antiga.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard label="FC" value={`${metrics.bpm} bpm`} />
            <MetricCard label="RR" value={`${metrics.rrIntervalMs} ms`} />
            <MetricCard label="PR" value={`${metrics.prIntervalMs} ms`} />
            <MetricCard label="QTc" value={`${metrics.qtcBazettMs} ms`} />
          </div>
        </div>
      </section>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.28em] text-white/40">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  )
}
