'use client'

import dynamic from 'next/dynamic'
import { RouteScreenFallback } from '@/components/sea/route-screen-fallback'

const SistemasPageClient = dynamic(() => import('@/components/sea/sistemas-page-client'), {
  ssr: false,
  loading: () => <RouteScreenFallback eyebrow="Carregando sistemas" title="Preparando os sistemas do SEA" />,
})

export function SistemasPageEntry() {
  return <SistemasPageClient />
}
