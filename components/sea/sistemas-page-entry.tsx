'use client'

import dynamic from 'next/dynamic'
import { RouteScreenFallback } from '@/components/sea/route-screen-fallback'

const SistemasPageClient = dynamic(() => import('@/components/sea/sistemas-page-client'), {
  ssr: false,
})

export function SistemasPageEntry() {
  return <SistemasPageClient />
}
