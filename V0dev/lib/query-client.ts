import { QueryClient } from '@tanstack/react-query'

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // 10 minutos (anteriormente cacheTime)
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: 1,
      },
    },
  })

let clientQueryClientSingleton: QueryClient | undefined

export const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: sempre cria um novo client
    return createQueryClient()
  }

  // Browser: usar singleton
  if (!clientQueryClientSingleton) clientQueryClientSingleton = createQueryClient()
  return clientQueryClientSingleton
}
