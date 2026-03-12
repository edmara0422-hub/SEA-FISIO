'use client'

import * as React from 'react'

export interface StreamEvent {
  type: string
  data: unknown
  timestamp: number
}

export class SSEClient {
  private eventSource: EventSource | null = null
  private url: string
  private handlers: Map<string, Set<(data: unknown) => void>> = new Map()

  constructor(url: string) {
    this.url = url
  }

  connect() {
    if (this.eventSource) return

    this.eventSource = new EventSource(this.url)

    this.eventSource.addEventListener('message', (event) => {
      try {
        const parsed = JSON.parse(event.data) as StreamEvent
        const typeHandlers = this.handlers.get(parsed.type)
        if (typeHandlers) {
          typeHandlers.forEach((handler) => handler(parsed.data))
        }
      } catch (error) {
        console.error('[v0] SSE parse error:', error)
      }
    })

    this.eventSource.onerror = () => {
      console.error('[v0] SSE connection error')
      this.disconnect()
      setTimeout(() => this.connect(), 3000)
    }
  }

  on(eventType: string, handler: (data: unknown) => void) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }
    this.handlers.get(eventType)?.add(handler)
  }

  off(eventType: string, handler: (data: unknown) => void) {
    this.handlers.get(eventType)?.delete(handler)
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
  }
}

export class WebSocketClient {
  private ws: WebSocket | null = null
  private url: string
  private handlers: Map<string, Set<(data: unknown) => void>> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  constructor(url: string) {
    this.url = url
  }

  connect() {
    if (this.ws) return

    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      console.log('[v0] WebSocket connected')
      this.reconnectAttempts = 0
    }

    this.ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as StreamEvent
        const typeHandlers = this.handlers.get(parsed.type)
        if (typeHandlers) {
          typeHandlers.forEach((handler) => handler(parsed.data))
        }
      } catch (error) {
        console.error('[v0] WebSocket parse error:', error)
      }
    }

    this.ws.onerror = () => {
      console.error('[v0] WebSocket error')
    }

    this.ws.onclose = () => {
      console.log('[v0] WebSocket closed')
      this.ws = null
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++
        setTimeout(() => this.connect(), 3000 * this.reconnectAttempts)
      }
    }
  }

  send(eventType: string, data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: eventType, data, timestamp: Date.now() }))
    }
  }

  on(eventType: string, handler: (data: unknown) => void) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }
    this.handlers.get(eventType)?.add(handler)
  }

  off(eventType: string, handler: (data: unknown) => void) {
    this.handlers.get(eventType)?.delete(handler)
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

export function useSSE(url: string, eventType: string) {
  const [data, setData] = React.useState<unknown>(null)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    const client = new SSEClient(url)
    client.connect()

    const handler = (newData: unknown) => {
      setData(newData)
      setError(null)
    }

    client.on(eventType, handler)

    return () => {
      client.off(eventType, handler)
      client.disconnect()
    }
  }, [url, eventType])

  return { data, error }
}

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = React.useState(false)
  const wsRef = React.useRef<WebSocketClient | null>(null)

  React.useEffect(() => {
    wsRef.current = new WebSocketClient(url)
    wsRef.current.connect()

    const checkConnection = setInterval(() => {
      setIsConnected(wsRef.current?.isConnected() || false)
    }, 1000)

    return () => {
      clearInterval(checkConnection)
      wsRef.current?.disconnect()
    }
  }, [url])

  return {
    isConnected,
    send: (eventType: string, data: unknown) => wsRef.current?.send(eventType, data),
    on: (eventType: string, handler: (data: unknown) => void) => wsRef.current?.on(eventType, handler),
    off: (eventType: string, handler: (data: unknown) => void) => wsRef.current?.off(eventType, handler),
  }
}
