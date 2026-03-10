import { createClient } from 'redis'

let redisClient: ReturnType<typeof createClient> | null = null

export async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    })

    redisClient.on('error', (err) => console.error('Redis Error:', err))
    await redisClient.connect()
  }

  return redisClient
}

export interface RateLimitConfig {
  windowMs: number // Janela de tempo em ms
  maxRequests: number // Máximo de requisições
  keyPrefix: string // Prefixo da chave Redis
}

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{
  allowed: boolean
  remaining: number
  resetTime: number
}> {
  const client = await getRedisClient()
  const key = `${config.keyPrefix}:${identifier}`

  try {
    const current = await client.incr(key)

    if (current === 1) {
      // Primera requisição - configurar expiração
      await client.expire(key, Math.ceil(config.windowMs / 1000))
    }

    const ttl = await client.ttl(key)
    const resetTime = Date.now() + ttl * 1000

    return {
      allowed: current <= config.maxRequests,
      remaining: Math.max(0, config.maxRequests - current),
      resetTime,
    }
  } catch (error) {
    console.error('Rate limit check error:', error)
    // Em caso de erro, permitir a requisição
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetTime: Date.now() + config.windowMs,
    }
  }
}

// Configurações padrão
export const RATE_LIMITS = {
  API: {
    windowMs: 1000 * 60, // 1 minuto
    maxRequests: 60,
    keyPrefix: 'rl:api',
  },
  CALCULATION: {
    windowMs: 1000 * 60, // 1 minuto
    maxRequests: 100,
    keyPrefix: 'rl:calc',
  },
  EXPORT: {
    windowMs: 1000 * 60 * 5, // 5 minutos
    maxRequests: 10,
    keyPrefix: 'rl:export',
  },
  AUTH: {
    windowMs: 1000 * 60 * 15, // 15 minutos
    maxRequests: 5,
    keyPrefix: 'rl:auth',
  },
  PUSH_NOTIFICATION: {
    windowMs: 1000 * 60 * 60, // 1 hora
    maxRequests: 100,
    keyPrefix: 'rl:push',
  },
}

// Middleware para Next.js
export async function rateLimitMiddleware(req: Request, limiter: RateLimitConfig) {
  const identifier = req.headers.get('x-forwarded-for') || 'unknown'

  const result = await checkRateLimit(identifier, limiter)

  if (!result.allowed) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000)),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.resetTime),
      },
    })
  }

  return null // Continuar com a requisição
}

// Cache distribuído com Redis
export async function getCachedData<T>(key: string, ttl: number = 300): Promise<T | null> {
  const client = await getRedisClient()

  try {
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Cache retrieval error:', error)
    return null
  }
}

export async function setCachedData<T>(key: string, data: T, ttl: number = 300): Promise<boolean> {
  const client = await getRedisClient()

  try {
    await client.setEx(key, ttl, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Cache set error:', error)
    return false
  }
}

export async function invalidateCache(pattern: string): Promise<number> {
  const client = await getRedisClient()

  try {
    const keys = await client.keys(pattern)
    if (keys.length > 0) {
      return await client.del(keys)
    }
    return 0
  } catch (error) {
    console.error('Cache invalidation error:', error)
    return 0
  }
}

export async function closeRedisConnection() {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
  }
}
