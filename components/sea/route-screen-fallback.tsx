import { SeaBackdrop } from '@/components/sea/sea-backdrop'

type RouteScreenFallbackProps = {
  eyebrow?: string
  title?: string
}

export function RouteScreenFallback({
  eyebrow = 'Carregando rota',
  title = 'Preparando a proxima tela',
}: RouteScreenFallbackProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#010101] text-white">
      <SeaBackdrop />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pb-28 pt-10">
        <div className="chrome-panel w-full max-w-md rounded-[1.9rem] p-6">
          <div className="flex items-center gap-4">
            <div className="chrome-subtle flex h-12 w-12 items-center justify-center rounded-[1rem]">
              <span className="metal-text pl-[0.18em] text-[0.8rem] font-semibold tracking-[0.24em]">SEA</span>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/38">{eyebrow}</p>
              <h2 className="text-sm font-semibold text-white/86">{title}</h2>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-full bg-white/8">
            <div className="h-[3px] animate-[shimmer_1.6s_linear_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.92),transparent)] bg-[length:200%_100%]" />
          </div>
        </div>
      </div>
    </div>
  )
}
