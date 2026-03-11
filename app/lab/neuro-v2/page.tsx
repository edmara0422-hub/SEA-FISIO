import { BrainHeroScene } from '@/components/experience/brain-hero-scene'
import { SignalCanvas } from '@/components/signals/signal-canvas'
import { calculateNeuroMetrics } from '@/lib/clinical/neuro/neuro-metrics'
import { generateEEGSignal } from '@/lib/clinical/neuro/eeg-engine'
import { EEG_PATTERNS } from '@/lib/clinical/neuro/neuro-patterns'

export default function NeuroV2Page() {
  const pattern = EEG_PATTERNS.alpha
  const signal = generateEEGSignal({
    seconds: 4,
    sampleRateHz: 256,
    dominantFrequencyHz: pattern.dominantFrequencyHz,
    amplitudeMicrovolts: pattern.amplitudeMicrovolts,
    noiseFactor: pattern.noiseFactor,
  })
  const metrics = calculateNeuroMetrics(signal, 256)

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-white/45">Neuro V2</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Neuro visual forte com base de sinal coerente.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60">
            A experiencia continua cinematica, mas a base agora separa cena, padrao neural e metricas.
          </p>
          <div className="mt-6 h-[25rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/40">
            <BrainHeroScene compact />
          </div>
        </div>

        <div className="space-y-4 rounded-[2rem] border border-white/10 bg-black/40 p-5">
          <SignalCanvas
            title="Atividade neural"
            subtitle={`${pattern.label} | ${pattern.dominantFrequencyHz} Hz`}
            samples={signal}
            stroke="rgba(168,85,247,0.95)"
            height={260}
            gain={2.8}
            verticalOrigin={0.5}
          />
          <div className="grid grid-cols-2 gap-4">
            <MetricCard label="Frequencia dominante" value={`${metrics.dominantBandLabel}`} />
            <MetricCard label="RMS" value={`${metrics.rmsMicrovolts.toFixed(1)} uV`} />
            <MetricCard label="Picos" value={`${metrics.peakCount}`} />
            <MetricCard label="Janela" value="4.0 s" />
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
