import { MainShell } from '@/components/sea/main-shell'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MainShell>{children}</MainShell>
  )
}
