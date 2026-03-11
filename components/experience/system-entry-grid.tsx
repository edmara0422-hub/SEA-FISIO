import Link from 'next/link'
import { Activity, Brain, HeartPulse, Wind } from 'lucide-react'

const items = [
  {
    href: '/lab/cardio-v2',
    title: 'Cardio V2',
    description: 'Canvas para ECG, ritmos e metricas cardiacas.',
    icon: HeartPulse,
    color: 'from-red-500/18 to-transparent text-red-300',
  },
  {
    href: '/lab/vmi-v2',
    title: 'VMI V2',
    description: 'Curvas ventilatorias, loops e motor fisiologico.',
    icon: Wind,
    color: 'from-cyan-500/18 to-transparent text-cyan-300',
  },
  {
    href: '/lab/neuro-v2',
    title: 'Neuro V2',
    description: 'Cena neuro mais forte e base de padroes de sinal.',
    icon: Brain,
    color: 'from-purple-500/18 to-transparent text-purple-300',
  },
  {
    href: '/explore',
    title: 'Voltar ao app',
    description: 'Mantem o fluxo atual intacto enquanto a V2 evolui.',
    icon: Activity,
    color: 'from-white/10 to-transparent text-white',
  },
]

export function SystemEntryGrid() {
  return (
    <section className="grid gap-4 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${item.color} p-5 transition hover:border-white/20 hover:bg-white/[0.05]`}
          >
            <Icon className="h-6 w-6" />
            <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">{item.description}</p>
          </Link>
        )
      })}
    </section>
  )
}
