'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/stores/authStore'

export type AppNotification = {
  id: string
  title: string
  body: string
  type: string
  read: boolean
  created_at: string
}

export function useNotifications() {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  const fetchAll = useCallback(async () => {
    if (!supabase || !user) return
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30)
    if (data) setNotifications(data)
  }, [user])

  useEffect(() => {
    fetchAll()
    if (!supabase || !user) return

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => setNotifications(prev => [payload.new as AppNotification, ...prev])
      )
      .subscribe()

    return () => { supabase?.removeChannel(channel) }
  }, [fetchAll, user])

  const markAllRead = useCallback(async () => {
    if (!supabase || !user) return
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [user])

  const unreadCount = notifications.filter(n => !n.read).length

  return { notifications, unreadCount, markAllRead }
}
