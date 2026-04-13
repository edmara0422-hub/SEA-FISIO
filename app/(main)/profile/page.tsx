'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/authStore'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft,
  Bell,
  Camera,
  ChevronRight,
  Key,
  LogOut,
  Moon,
  PencilLine,
  Save,
  Shield,
  User,
  Users,
  X,
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { profile, user, isAdmin, signOut, updateProfile } = useAuthStore()
  const [editMode, setEditMode] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [editName, setEditName] = useState(profile?.name || '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Admin stats
  const [adminStats, setAdminStats] = useState<{ total: number; active: number; cancelled: number; overdue: number; trial: number } | null>(null)
  const [adminUsers, setAdminUsers] = useState<Array<{ id: string; name: string; email: string; role: string; created_at: string }>>([])
  const [adminLoading, setAdminLoading] = useState(false)

  const handleSaveName = async () => {
    setSaving(true)
    setError('')
    const result = await updateProfile({ name: editName })
    setSaving(false)
    if (result.error) { setError(result.error); return }
    setEditMode(false)
    setMessage('Nome atualizado.')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleChangePassword = async () => {
    setError('')
    if (newPassword.length < 6) { setError('Minimo 6 caracteres.'); return }
    if (newPassword !== confirmPassword) { setError('Senhas nao coincidem.'); return }
    if (!supabase) { setError('Supabase nao configurado.'); return }
    setSaving(true)
    const { error: err } = await supabase.auth.updateUser({ password: newPassword })
    setSaving(false)
    if (err) { setError(err.message); return }
    setChangePassword(false)
    setNewPassword('')
    setConfirmPassword('')
    setMessage('Senha alterada com sucesso.')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !supabase || !user) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (upErr) { setError(upErr.message); setUploading(false); return }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    await updateProfile({ photo_url: data.publicUrl + '?t=' + Date.now() })
    setUploading(false)
    setMessage('Foto atualizada.')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleToggleNotifications = async () => {
    await updateProfile({ notifications_enabled: !profile?.notifications_enabled })
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/auth')
  }

  const loadAdminData = async () => {
    if (!supabase || !isAdmin) return
    setAdminLoading(true)
    // Fetch all profiles (admin RLS allows this)
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (profiles) {
      setAdminUsers(profiles as typeof adminUsers)
      // Fetch subscriptions
      const { data: subs } = await supabase.from('subscriptions').select('*')
      const subList = subs || []
      setAdminStats({
        total: profiles.length,
        active: subList.filter((s: { status: string }) => s.status === 'active').length,
        cancelled: subList.filter((s: { status: string }) => s.status === 'cancelled').length,
        overdue: subList.filter((s: { status: string }) => s.status === 'overdue').length,
        trial: subList.filter((s: { status: string }) => s.status === 'trial').length,
      })
    }
    setAdminLoading(false)
  }

  const inputClass = 'w-full h-8 rounded-[0.5rem] border border-white/10 bg-white/5 px-2 text-[10px] text-white placeholder:text-white/30 outline-none focus:border-white/20'

  return (
    <div className="relative min-h-screen bg-[#010101] text-white px-3 pb-32 pt-16 md:px-6">
      {/* Back button */}
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-1 text-[8px] text-white/40 hover:text-white/60">
        <ArrowLeft className="h-3 w-3" />
        Voltar
      </button>

      {/* Messages */}
      {message && (
        <div className="mb-3 rounded-[0.5rem] border border-[#4ade8030] bg-[#4ade8008] px-3 py-1.5">
          <p className="text-[8px] text-[#86efac]">{message}</p>
        </div>
      )}
      {error && (
        <div className="mb-3 rounded-[0.5rem] border border-[#f8717130] bg-[#f8717108] px-3 py-1.5">
          <p className="text-[8px] text-[#fca5a5]">{error}</p>
        </div>
      )}

      {/* Profile Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
            {profile?.photo_url ? (
              <img src={profile.photo_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <User className="h-6 w-6 text-white/30" />
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/80">
            {uploading ? (
              <div className="h-2.5 w-2.5 animate-spin rounded-full border border-white/30 border-t-white" />
            ) : (
              <Camera className="h-2.5 w-2.5 text-white/60" />
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleUploadPhoto} />
          </label>
        </div>
        <div className="flex-1">
          {editMode ? (
            <div className="flex items-center gap-1">
              <input className={inputClass} value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nome" />
              <button onClick={handleSaveName} disabled={saving} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.5rem] border border-white/10 bg-white/5">
                <Save className="h-3 w-3 text-white/60" />
              </button>
              <button onClick={() => setEditMode(false)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.5rem] border border-white/10 bg-white/5">
                <X className="h-3 w-3 text-white/40" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div>
                <p className="text-[10px] font-semibold">{profile?.name || 'Usuario'}</p>
                <p className="text-[7px] text-white/40">{profile?.email || user?.email}</p>
                {isAdmin && <span className="mt-0.5 inline-block rounded-full border border-[#a78bfa30] bg-[#a78bfa10] px-1.5 py-0.5 text-[6px] font-semibold text-[#a78bfa]">ADMIN</span>}
              </div>
              <button onClick={() => { setEditName(profile?.name || ''); setEditMode(true) }} className="text-white/30 hover:text-white/60">
                <PencilLine className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-1">
        {/* Notificações */}
        <button onClick={handleToggleNotifications} className="flex w-full items-center gap-2 rounded-[0.7rem] border border-white/6 bg-white/[0.02] px-3 py-2">
          <Bell className="h-3.5 w-3.5 text-white/40" />
          <span className="flex-1 text-left text-[8px] text-white/70">Notificacoes</span>
          <span className={`rounded-full px-1.5 py-0.5 text-[6px] font-semibold ${profile?.notifications_enabled ? 'border border-[#4ade8030] bg-[#4ade8010] text-[#4ade80]' : 'border border-white/10 bg-white/5 text-white/30'}`}>
            {profile?.notifications_enabled ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Tema */}
        <div className="flex items-center gap-2 rounded-[0.7rem] border border-white/6 bg-white/[0.02] px-3 py-2">
          <Moon className="h-3.5 w-3.5 text-white/40" />
          <span className="flex-1 text-[8px] text-white/70">Tema</span>
          <span className="text-[7px] text-white/30">Dark</span>
        </div>

        {/* Alterar senha */}
        <button onClick={() => setChangePassword(!changePassword)} className="flex w-full items-center gap-2 rounded-[0.7rem] border border-white/6 bg-white/[0.02] px-3 py-2">
          <Key className="h-3.5 w-3.5 text-white/40" />
          <span className="flex-1 text-left text-[8px] text-white/70">Alterar senha</span>
          <ChevronRight className={`h-3 w-3 text-white/30 transition-transform ${changePassword ? 'rotate-90' : ''}`} />
        </button>

        {changePassword && (
          <div className="rounded-[0.7rem] border border-white/6 bg-white/[0.02] px-3 py-2 space-y-1.5">
            <input className={inputClass} type="password" placeholder="Nova senha (min 6 caracteres)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <input className={inputClass} type="password" placeholder="Confirmar nova senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button onClick={handleChangePassword} disabled={saving} className="w-full h-7 rounded-[0.5rem] border border-white/10 bg-white/5 text-[8px] font-semibold text-white/60 disabled:opacity-50">
              {saving ? 'Salvando...' : 'Alterar senha'}
            </button>
          </div>
        )}

        {/* Admin Panel — só para admin */}
        {isAdmin && (
          <>
            <button
              onClick={() => { setShowAdmin(!showAdmin); if (!showAdmin && !adminStats) loadAdminData() }}
              className="flex w-full items-center gap-2 rounded-[0.7rem] border border-[#a78bfa20] bg-[#a78bfa08] px-3 py-2"
            >
              <Shield className="h-3.5 w-3.5 text-[#a78bfa]" />
              <span className="flex-1 text-left text-[8px] font-semibold text-[#a78bfa]">Painel Admin</span>
              <ChevronRight className={`h-3 w-3 text-[#a78bfa]/50 transition-transform ${showAdmin ? 'rotate-90' : ''}`} />
            </button>

            {showAdmin && (
              <div className="rounded-[0.7rem] border border-[#a78bfa20] bg-[#a78bfa05] px-3 py-2 space-y-2">
                {adminLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-[#a78bfa]" />
                  </div>
                ) : adminStats ? (
                  <>
                    <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-[#a78bfa]/60">Metricas</p>
                    <div className="grid grid-cols-5 gap-1">
                      {[
                        { label: 'Total', value: adminStats.total, color: '#60a5fa' },
                        { label: 'Ativos', value: adminStats.active, color: '#4ade80' },
                        { label: 'Trial', value: adminStats.trial, color: '#facc15' },
                        { label: 'Cancelados', value: adminStats.cancelled, color: '#fb923c' },
                        { label: 'Devendo', value: adminStats.overdue, color: '#f87171' },
                      ].map((s) => (
                        <div key={s.label} className="rounded-[0.5rem] border border-white/6 bg-black/20 px-1.5 py-1.5 text-center">
                          <p className="text-[10px] font-bold" style={{ color: s.color }}>{s.value}</p>
                          <p className="text-[6px] text-white/30">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    <p className="mt-2 text-[7px] font-semibold uppercase tracking-[0.14em] text-[#a78bfa]/60">Usuarios ({adminUsers.length})</p>
                    <div className="max-h-48 space-y-0.5 overflow-y-auto">
                      {adminUsers.map((u) => (
                        <div key={u.id} className="flex items-center gap-2 rounded-[0.4rem] border border-white/4 bg-black/10 px-2 py-1">
                          <Users className="h-2.5 w-2.5 shrink-0 text-white/20" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[7px] font-semibold text-white/60">{u.name || 'Sem nome'}</p>
                            <p className="truncate text-[6px] text-white/30">{u.email}</p>
                          </div>
                          {u.role === 'admin' && <span className="shrink-0 text-[5px] font-bold text-[#a78bfa]">ADM</span>}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-center text-[7px] text-white/30">Sem dados.</p>
                )}
              </div>
            )}
          </>
        )}

        {/* App info */}
        <div className="rounded-[0.7rem] border border-white/6 bg-white/[0.02] px-3 py-2">
          <p className="text-[7px] text-white/30">SEA Fisio v1.0.0</p>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-[0.7rem] border border-[#f8717120] bg-[#f8717108] px-3 py-2">
          <LogOut className="h-3.5 w-3.5 text-[#fca5a5]" />
          <span className="text-[8px] font-semibold text-[#fca5a5]">Sair da conta</span>
        </button>
      </div>
    </div>
  )
}
