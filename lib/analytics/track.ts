import { supabase } from '@/lib/supabase'

/** Track an event to app_analytics table.
 *  Call from anywhere: track('view_prontuario'), track('calc_gasometria'), etc. */
export function track(event: string, metadata?: Record<string, unknown>) {
  if (!supabase) return
  // Get user id from current session (non-blocking)
  supabase.auth.getSession().then(({ data }) => {
    const userId = data.session?.user?.id
    supabase.from('app_analytics').insert({
      user_id: userId || null,
      event,
      metadata: metadata || {},
    }).then(() => { /* fire and forget */ })
  })
}

/** Update last_login timestamp for current user */
export function trackLogin() {
  if (!supabase) return
  supabase.auth.getSession().then(({ data }) => {
    const userId = data.session?.user?.id
    if (userId) {
      supabase.from('profiles').update({ last_login: new Date().toISOString() }).eq('id', userId).then(() => {})
      track('login')
    }
  })
}
