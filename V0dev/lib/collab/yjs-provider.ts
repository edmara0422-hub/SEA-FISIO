'use client'

import { useEffect, useState } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

export interface CollaborativeUser {
  name: string
  color: string
  cursor: { x: number; y: number }
}

export function useYjsProvider(roomName: string) {
  const [provider, setProvider] = useState<WebsocketProvider | null>(null)
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const doc = new Y.Doc()
    const wsProvider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_COLLAB_SERVER || 'ws://localhost:1234',
      roomName,
      doc
    )

    wsProvider.on('status', (event: { status: string }) => {
      setIsConnected(event.status === 'connected')
    })

    setProvider(wsProvider)
    setYdoc(doc)

    return () => {
      wsProvider.disconnect()
      doc.destroy()
    }
  }, [roomName])

  return { provider, ydoc, isConnected }
}

export function useSharedMap(ydoc: Y.Doc | null, mapName: string) {
  const [data, setData] = useState<Record<string, unknown>>({})

  useEffect(() => {
    if (!ydoc) return

    const ymap = ydoc.getMap(mapName)

    const updateHandler = () => {
      const obj: Record<string, unknown> = {}
      ymap.forEach((value, key) => {
        obj[key] = value
      })
      setData(obj)
    }

    ymap.observe(updateHandler)
    updateHandler()

    return () => {
      ymap.unobserve(updateHandler)
    }
  }, [ydoc, mapName])

  const set = (key: string, value: unknown) => {
    ydoc?.getMap(mapName).set(key, value)
  }

  const get = (key: string) => {
    return ydoc?.getMap(mapName).get(key)
  }

  return { data, set, get }
}

export function useSharedArray(ydoc: Y.Doc | null, arrayName: string) {
  const [items, setItems] = useState<unknown[]>([])

  useEffect(() => {
    if (!ydoc) return

    const yarray = ydoc.getArray(arrayName)

    const updateHandler = () => {
      setItems(yarray.toArray())
    }

    yarray.observe(updateHandler)
    updateHandler()

    return () => {
      yarray.unobserve(updateHandler)
    }
  }, [ydoc, arrayName])

  const push = (value: unknown) => {
    ydoc?.getArray(arrayName).push([value])
  }

  const insert = (index: number, value: unknown) => {
    ydoc?.getArray(arrayName).insert(index, [value])
  }

  const delete_ = (index: number, length = 1) => {
    ydoc?.getArray(arrayName).delete(index, length)
  }

  return { items, push, insert, delete: delete_ }
}

export interface LiveblocksUser {
  id: string
  info: {
    name: string
    avatar: string
  }
}

export function useLiveblocks() {
  const [users, setUsers] = useState<LiveblocksUser[]>([])
  const [room, setRoom] = useState<unknown>(null)

  useEffect(() => {
    const initializeRoom = async () => {
      try {
        const response = await fetch('/api/liveblocks/auth', {
          method: 'POST',
        })
        const data = await response.json()

        console.log('[v0] Liveblocks initialized:', data)
        setRoom(data)
      } catch (error) {
        console.error('[v0] Liveblocks error:', error)
      }
    }

    initializeRoom()
  }, [])

  return { users, room }
}

export function broadcastUpdate(provider: WebsocketProvider | null, event: string, data: unknown) {
  if (!provider) return

  const awareness = provider.awareness
  awareness.setLocalState({
    event,
    data,
    timestamp: Date.now(),
  })
}
