import dynamic from 'next/dynamic'

const HomePageClient = dynamic(() => import('@/components/sea/home-page-client'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black text-white">
      <div className="relative flex h-[55vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }} />
        <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 shadow-[0_0_120px_rgba(255,255,255,0.14)]" />
        <div className="relative z-10 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">SEA</p>
          <h1 className="mt-3 text-3xl font-semibold">Carregando ambiente imersivo</h1>
          <p className="mt-2 text-sm text-white/55">Preparando simulacao e painel clinico.</p>
        </div>
      </div>
      <div className="px-4 pb-28">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="h-5 w-36 rounded bg-white/10" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="h-20 rounded-xl bg-white/6" />
            <div className="h-20 rounded-xl bg-white/6" />
            <div className="h-20 rounded-xl bg-white/6" />
          </div>
        </div>
      </div>
    </div>
  ),
})

export default function HomePage() {
  return <HomePageClient />
}
