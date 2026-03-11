import { LoopCanvas } from '@/components/signals/loop-canvas'
import { VMWaveCanvas } from '@/components/signals/vm-wave-canvas'
import { buildFVLoop, buildPVLoop } from '@/lib/clinical/vmi/loop-engine'
import { DEFAULT_VENTILATOR_CONFIG, generateVentilatorWaveforms } from '@/lib/clinical/vmi/ventilator-engine'
import { calculateVMIMetrics } from '@/lib/clinical/vmi/vmi-metrics'

export default function VMIV2Page() {
  const waveforms = generateVentilatorWaveforms(DEFAULT_VENTILATOR_CONFIG)
  const metrics = calculateVMIMetrics(DEFAULT_VENTILATOR_CONFIG)
  const pvLoop = buildPVLoop(waveforms.volume, waveforms.pressure)
  const fvLoop = buildFVLoop(waveforms.flow, waveforms.volume)

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <p className="text-xs uppercase tracking-[0.32em] text-white/45">VMI V2</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Fundacao para curva ventilatoria de verdade.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60">
          Aqui a home deixa de ser confundida com monitor tecnico e a VMI ganha seu lugar proprio:
          fluxo, volume, pressao e loops derivados da equacao de movimento.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[2rem] border border-white/10 bg-black/40 p-5">
          <VMWaveCanvas />
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <MetricCard label="Driving Pressure" value={`${metrics.drivingPressureCmH2O.toFixed(1)} cmH2O`} />
            <MetricCard label="Cest" value={`${metrics.staticComplianceMlPerCmH2O.toFixed(1)} mL/cmH2O`} />
            <MetricCard label="Mechanical Power" value={`${metrics.mechanicalPowerJMin.toFixed(1)} J/min`} />
            <MetricCard label="Ti / Te" value={`${waveforms.meta.inspiratoryTimeSec.toFixed(2)} / ${waveforms.meta.expiratoryTimeSec.toFixed(2)} s`} />
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-white/40">Motor</p>
            <p className="mt-3 text-lg font-semibold">Equacao de movimento + integracao de fluxo</p>
            <p className="mt-2 text-sm leading-6 text-white/60">
              O motor novo calcula volume pela integral do fluxo e gera pressao a partir de resistencia,
              elastancia e PEEP. O renderer de tela entra depois.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
          <LoopCanvas
            title="Loop Pressao x Volume"
            xLabel="Volume (L)"
            yLabel="Pressao (cmH2O)"
            points={pvLoop}
            stroke="rgba(56,189,248,0.95)"
          />
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
          <LoopCanvas
            title="Loop Fluxo x Volume"
            xLabel="Volume (L)"
            yLabel="Fluxo (L/s)"
            points={fvLoop}
            stroke="rgba(34,197,94,0.95)"
          />
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
