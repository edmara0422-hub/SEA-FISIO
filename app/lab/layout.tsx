import Link from 'next/link'

const items = [
  { href: '/lab/home-v2', label: 'Home V2' },
  { href: '/lab/cardio-v2', label: 'Cardio V2' },
  { href: '/lab/vmi-v2', label: 'VMI V2' },
  { href: '/lab/neuro-v2', label: 'Neuro V2' },
]

export default function LabLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#050607] text-white">
      <div className="border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4">
          <Link
            href="/sea"
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/60 transition hover:border-white/20 hover:text-white"
          >
            SEA
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex flex-wrap items-center gap-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
    </div>
  )
}
