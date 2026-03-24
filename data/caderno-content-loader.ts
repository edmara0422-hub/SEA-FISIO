import type { CadernoModuleContent } from '@/types/caderno'

const MODULE_LOADERS: Record<string, () => Promise<CadernoModuleContent>> = {
  M1: () => import('./caderno-content-m1').then(m => m.M1_CONTENT),
  M2: () => import('./caderno-content-m2').then(m => m.M2_CONTENT),
  M3: () => import('./caderno-content-m3').then(m => m.M3_CONTENT),
}

const cache = new Map<string, CadernoModuleContent>()

export async function loadModuleContent(moduleId: string): Promise<CadernoModuleContent | null> {
  const cached = cache.get(moduleId)
  if (cached) return cached

  const loader = MODULE_LOADERS[moduleId]
  if (!loader) return null

  const content = await loader()
  cache.set(moduleId, content)
  return content
}
