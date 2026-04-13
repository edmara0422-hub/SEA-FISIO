'use client'

import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { trackLogin } from '@/lib/analytics/track'
import type { User, Session } from '@supabase/supabase-js'

export type Profile = {
  id: string
  name: string | null
  email: string | null
  photo_url: string | null
  role: 'user' | 'admin'
  notifications_enabled: boolean
  theme: string
  created_at: string
  updated_at: string
}

type AuthState = {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  isAdmin: boolean
  initialized: boolean
}

type AuthActions = {
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  fetchProfile: (userId: string) => Promise<void>
  updateProfile: (data: Partial<Pick<Profile, 'name' | 'photo_url' | 'notifications_enabled' | 'theme'>>) => Promise<{ error: string | null }>
  setSession: (session: Session | null) => void
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isAdmin: false,
  initialized: false,

  initialize: async () => {
    if (!supabase || get().initialized) return
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        set({ user: session.user, session })
        await get().fetchProfile(session.user.id)
      }
    } catch { /* empty */ }
    set({ isLoading: false, initialized: true })

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ user: session?.user ?? null, session })
      if (session?.user) {
        await get().fetchProfile(session.user.id)
      } else {
        set({ profile: null, isAdmin: false })
      }
    })
  },

  fetchProfile: async (userId: string) => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) {
      console.warn('[authStore] fetchProfile error:', error.message)
      // Profile might not exist yet (trigger delay) — create fallback
      return
    }
    if (data) {
      const profile = data as Profile
      set({ profile, isAdmin: profile.role === 'admin' })
    }
  },

  signIn: async (email, password) => {
    if (!supabase) return { error: 'Supabase nao configurado.' }
    set({ isLoading: true })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    set({ isLoading: false })
    if (error) {
      if (error.message.includes('Invalid login')) return { error: 'Email ou senha incorretos.' }
      if (error.message.includes('Email not confirmed')) return { error: 'Confirme seu email antes de entrar.' }
      return { error: error.message }
    }
    trackLogin()
    return { error: null }
  },

  signUp: async (email, password, name) => {
    if (!supabase) return { error: 'Supabase nao configurado.' }
    set({ isLoading: true })
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    set({ isLoading: false })
    if (error) {
      if (error.message.includes('already registered')) return { error: 'Este email ja esta cadastrado.' }
      if (error.message.includes('Password')) return { error: 'Senha deve ter no minimo 6 caracteres.' }
      return { error: error.message }
    }
    return { error: null }
  },

  signOut: async () => {
    if (!supabase) return
    try { await supabase.auth.signOut() } catch { /* empty */ }
    set({ user: null, session: null, profile: null, isAdmin: false, initialized: false })
    // Clear any localStorage remnants
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sea_user')
    }
  },

  resetPassword: async (email) => {
    if (!supabase) return { error: 'Supabase nao configurado.' }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) return { error: error.message }
    return { error: null }
  },

  updateProfile: async (data) => {
    if (!supabase) return { error: 'Supabase nao configurado.' }
    const user = get().user
    if (!user) return { error: 'Nao autenticado.' }
    const updateData = { ...data, updated_at: new Date().toISOString() }
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
    if (error) {
      console.warn('[authStore] updateProfile error:', error.message)
      return { error: error.message }
    }
    await get().fetchProfile(user.id)
    return { error: null }
  },

  setSession: (session) => {
    set({ user: session?.user ?? null, session })
  },
}))
