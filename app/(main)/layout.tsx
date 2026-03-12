import { BottomNav } from '@/components/sea/bottom-nav'

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
      <BottomNav />
    </div>
  )
}
