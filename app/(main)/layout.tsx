import Link from 'next/link'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <main className="pb-20">
        {children}
      </main>
      <div data-bottom-nav>
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-[#0a0a0a]/95 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-xl items-center justify-around px-4 text-sm text-white/70">
            <Link href="/home" className="rounded-lg px-3 py-2 transition hover:bg-white/8 hover:text-white">
              Home
            </Link>
            <Link href="/explore" className="rounded-lg px-3 py-2 transition hover:bg-white/8 hover:text-white">
              Explorar
            </Link>
            <Link href="/profile" className="rounded-lg px-3 py-2 transition hover:bg-white/8 hover:text-white">
              Perfil
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
