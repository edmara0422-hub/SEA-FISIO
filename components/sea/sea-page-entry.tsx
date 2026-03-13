'use client'

import dynamic from 'next/dynamic'
import { RouteScreenFallback } from '@/components/sea/route-screen-fallback'

const HomePageClient = dynamic(() => import('@/components/sea/home-page-client'), {
  ssr: false,
  loading: () => <RouteScreenFallback eyebrow="Carregando home" title="Preparando a entrada SEA" />,
})

export function SeaPageEntry() {
  return <HomePageClient />
}
