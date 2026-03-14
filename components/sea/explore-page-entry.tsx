'use client'

import dynamic from 'next/dynamic'
import { RouteScreenFallback } from '@/components/sea/route-screen-fallback'

const ExplorePageClient = dynamic(() => import('@/components/sea/explore-page-client'), {
  ssr: false,
})

export function ExplorePageEntry() {
  return <ExplorePageClient />
}
