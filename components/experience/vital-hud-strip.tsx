const metrics = [
  { label: 'Neuro Fidelity', value: 'Scene + signal split', tone: 'text-purple-300' },
  { label: 'Cardio Engine', value: 'Canvas-ready ECG', tone: 'text-red-300' },
  { label: 'VMI Model', value: 'Motion equation core', tone: 'text-cyan-300' },
  { label: 'Architecture', value: 'Parallel V2 lab', tone: 'text-emerald-300' },
]

export function VitalHudStrip() {
  return (
    <section className="grid gap-4 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl"
        >
          <p className="text-xs uppercase tracking-[0.28em] text-white/40">{metric.label}</p>
          <p className={`mt-3 text-lg font-semibold ${metric.tone}`}>{metric.value}</p>
        </div>
      ))}
    </section>
  )
}
