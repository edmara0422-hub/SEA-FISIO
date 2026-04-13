'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/authStore'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, initialized, initialize } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (initialized && !isLoading && !user) {
      router.replace('/auth')
    }
  }, [initialized, isLoading, user, router])

  if (!initialized || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#010101]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
