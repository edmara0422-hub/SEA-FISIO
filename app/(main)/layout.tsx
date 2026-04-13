import { MainShell } from '@/components/sea/main-shell'
import { AuthGuard } from '@/components/sea/auth-guard'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <MainShell>{children}</MainShell>
    </AuthGuard>
  )
}
