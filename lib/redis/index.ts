type StoredValue = {
  value: string
  expiresAt: number | null
}

class MemoryRedisClient {
  private store = new Map<string, StoredValue>()

  async connect() {
    return this
  }

  on(_event: 'error', _listener: (error: unknown) => void) {
    return this
  }

  private cleanup(key: string) {
    const entry = this.store.get(key)
    if (entry?.expiresAt && entry.expiresAt <= Date.now()) {
      this.store.delete(key)
    }
  }

  async get(key: string): Promise<string | null> {
    this.cleanup(key)
    return this.store.get(key)?.value ?? null
  }

  async setEx(key: string, ttl: number, value: string): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl * 1000,
    })
  }

  async incr(key: string): Promise<number> {
    this.cleanup(key)
    const currentValue = Number(this.store.get(key)?.value ?? '0') + 1
    const expiresAt = this.store.get(key)?.expiresAt ?? null
    this.store.set(key, {
      value: String(currentValue),
      expiresAt,
    })
    return currentValue
  }

  async expire(key: string, seconds: number): Promise<void> {
    const entry = this.store.get(key)
    if (!entry) return
    this.store.set(key, {
      ...entry,
      expiresAt: Date.now() + seconds * 1000,
    })
  }

  async ttl(key: string): Promise<number> {
    this.cleanup(key)
    const entry = this.store.get(key)
    if (!entry?.expiresAt) return -1
    return Math.max(0, Math.ceil((entry.expiresAt - Date.now()) / 1000))
  }

  async keys(pattern: string): Promise<string[]> {
    const matcher = new RegExp(
      `^${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*')}$`
    )

    return [...this.store.keys()].filter((key) => {
      this.cleanup(key)
      return this.store.has(key) && matcher.test(key)
    })
  }

  async del(keys: string | string[]): Promise<number> {
    const keyList = Array.isArray(keys) ? keys : [keys]
    let removed = 0

    for (const key of keyList) {
      if (this.store.delete(key)) {
        removed += 1
      }
    }

    return removed
  }

  async quit(): Promise<void> {
    this.store.clear()
  }
}

let redisClient: MemoryRedisClient | null = null

export async function getRedisClient() {
  if (!redisClient) {
    redisClient = new MemoryRedisClient()
    await redisClient.connect()
  }

  return redisClient
}

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyPrefix: string
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
      await client.expire(key, Math.ceil(config.windowMs / 1000))
    }

    const ttl = await client.ttl(key)
    const resetTime = Date.now() + Math.max(ttl, 0) * 1000

    return {
      allowed: current <= config.maxRequests,
      remaining: Math.max(0, config.maxRequests - current),
      resetTime,
    }
  } catch (error) {
    console.error('Rate limit check error:', error)
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetTime: Date.now() + config.windowMs,
    }
  }
}

export const RATE_LIMITS = {
  API: {
    windowMs: 1000 * 60,
    maxRequests: 60,
    keyPrefix: 'rl:api',
  },
  CALCULATION: {
    windowMs: 1000 * 60,
    maxRequests: 100,
    keyPrefix: 'rl:calc',
  },
  EXPORT: {
    windowMs: 1000 * 60 * 5,
    maxRequests: 10,
    keyPrefix: 'rl:export',
  },
  AUTH: {
    windowMs: 1000 * 60 * 15,
    maxRequests: 5,
    keyPrefix: 'rl:auth',
  },
  PUSH_NOTIFICATION: {
    windowMs: 1000 * 60 * 60,
    maxRequests: 100,
    keyPrefix: 'rl:push',
  },
}

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

  return null
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  const client = await getRedisClient()

  try {
    const data = await client.get(key)
    return data ? (JSON.parse(data) as T) : null
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
