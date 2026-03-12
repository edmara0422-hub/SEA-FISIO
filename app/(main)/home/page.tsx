import Link from 'next/link'

const cards = [
  {
    href: '/explore',
    eyebrow: 'Trilhas',
    title: 'Explorar conteudos e sistemas',
    description: 'Abrir os modulos do app sem carregar simulacao pesada na entrada.',
  },
  {
    href: '/lab/home-v2',
    eyebrow: 'Laboratorio',
    title: 'Entrar nas experiencias imersivas',
    description: 'As simulacoes continuam disponiveis em uma rota dedicada.',
  },
  {
    href: '/sistemas/calculadora-vm',
    eyebrow: 'Pratica',
    title: 'Abrir calculadora ventilatoria',
    description: 'Acessar direto a ferramenta clinica e aos calculos.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050607] px-4 pb-28 pt-6 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/55">SEA</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">
            Plataforma de estudo com simulacao, calculo e laboratorio clinico.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-white/68 sm:text-base">
            A entrada foi isolada para responder rapido. Os modulos visuais continuam disponiveis
            nas rotas de laboratorio e sistemas, sem travar a abertura do app.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/explore"
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Abrir app
            </Link>
            <Link
              href="/lab/home-v2"
              className="rounded-full border border-white/14 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Ir para laboratorio
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 grid max-w-5xl gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-[24px] border border-white/8 bg-white/5 p-5 transition hover:border-white/16 hover:bg-white/[0.07]"
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">{card.eyebrow}</p>
            <h2 className="mt-3 text-lg font-medium text-white">{card.title}</h2>
            <p className="mt-2 text-sm text-white/58">{card.description}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
