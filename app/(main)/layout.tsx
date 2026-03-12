import { BottomNav } from '@/components/sea/bottom-nav'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <main className="pb-28">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
