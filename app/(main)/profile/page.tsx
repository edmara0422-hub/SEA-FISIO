'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/authStore'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft, Bell, Camera, ChevronRight, Info, Key, LogOut, Mail,
  Moon, PencilLine, Save, Shield, User, X,
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { profile, user, isAdmin, signOut, updateProfile } = useAuthStore()

  // Edit states
  const [editField, setEditField] = useState<'name' | 'email' | null>(null)
  const [editValue, setEditValue] = useState('')
  const [changePassword, setChangePassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // UI
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const flash = (msg: string) => { setMessage(msg); setError(''); setTimeout(() => setMessage(''), 3000) }
  const flashErr = (msg: string) => { setError(msg); setMessage(''); setTimeout(() => setError(''), 5000) }

  // ── Handlers ──

  const handleSaveName = async () => {
    if (!editValue.trim()) { flashErr('Nome nao pode ser vazio.'); return }
    setSaving(true)
    const result = await updateProfile({ name: editValue.trim() })
    setSaving(false)
    if (result.error) { flashErr(result.error); return }
    setEditField(null)
    flash('Nome atualizado.')
  }

  const handleSaveEmail = async () => {
    if (!editValue.trim() || !editValue.includes('@')) { flashErr('Email invalido.'); return }
    if (!supabase) { flashErr('Supabase nao configurado.'); return }
    setSaving(true)
    // Update auth email
    const { error: authErr } = await supabase.auth.updateUser({ email: editValue.trim() })
    if (authErr) { flashErr(authErr.message); setSaving(false); return }
    // Update profile table
    await updateProfile({})
    setSaving(false)
    setEditField(null)
    flash('Email atualizado. Verifique a caixa de entrada para confirmar.')
  }

  const handleChangePassword = async () => {
    setError('')
    if (newPassword.length < 6) { flashErr('Minimo 6 caracteres.'); return }
    if (newPassword !== confirmPassword) { flashErr('Senhas nao coincidem.'); return }
    if (!supabase) { flashErr('Supabase nao configurado.'); return }
    setSaving(true)
    const { error: err } = await supabase.auth.updateUser({ password: newPassword })
    setSaving(false)
    if (err) { flashErr(err.message); return }
    setChangePassword(false)
    setNewPassword('')
    setConfirmPassword('')
    flash('Senha alterada com sucesso.')
  }

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !supabase || !user) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (upErr) { flashErr(upErr.message); setUploading(false); return }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    await updateProfile({ photo_url: data.publicUrl + '?t=' + Date.now() })
    setUploading(false)
    flash('Foto atualizada.')
  }

  const handleToggleNotifications = async () => {
    await updateProfile({ notifications_enabled: !profile?.notifications_enabled })
  }

  const handleLogout = async () => {
    await signOut()
    window.location.href = '/auth'
  }


  const inputClass = 'w-full h-8 rounded-[0.5rem] border border-white/10 bg-white/5 px-2 text-[10px] text-white placeholder:text-white/30 outline-none focus:border-white/20'
  const menuBtn = 'flex w-full items-center gap-2 rounded-[0.7rem] border border-white/6 bg-white/[0.02] px-3 py-2 text-left'

  return (
    <div className="relative min-h-screen bg-[#010101] text-white px-3 pb-32 pt-16 md:px-6">
      {/* Back */}
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-1 text-[8px] text-white/40 hover:text-white/60">
        <ArrowLeft className="h-3 w-3" /> Voltar
      </button>

      {/* Messages */}
      {message && <div className="mb-3 rounded-[0.5rem] border border-[#4ade8030] bg-[#4ade8008] px-3 py-1.5"><p className="text-[8px] text-[#86efac]">{message}</p></div>}
      {error && <div className="mb-3 rounded-[0.5rem] border border-[#f8717130] bg-[#f8717108] px-3 py-1.5"><p className="text-[8px] text-[#fca5a5]">{error}</p></div>}

      {/* ═══ Avatar + Header ═══ */}
      <div className="mb-5 flex items-center gap-3">
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
            {profile?.photo_url ? (
              <img src={profile.photo_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <User className="h-6 w-6 text-white/30" />
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/80">
            {uploading ? <div className="h-2.5 w-2.5 animate-spin rounded-full border border-white/30 border-t-white" /> : <Camera className="h-2.5 w-2.5 text-white/60" />}
            <input type="file" accept="image/*" className="hidden" onChange={handleUploadPhoto} />
          </label>
        </div>
        <div>
          <p className="text-[10px] font-semibold">{profile?.name || 'Usuario'}</p>
          <p className="text-[7px] text-white/40">{profile?.email || user?.email}</p>
          {isAdmin && <span className="mt-0.5 inline-block rounded-full border border-[#a78bfa30] bg-[#a78bfa10] px-1.5 py-0.5 text-[6px] font-semibold text-[#a78bfa]">ADMIN</span>}
        </div>
      </div>

      <p className="mb-2 text-[7px] font-semibold uppercase tracking-[0.14em] text-white/30">Conta</p>
      <div className="space-y-1 mb-4">

        {/* ── Nome ── */}
        {editField === 'name' ? (
          <div className="flex items-center gap-1 rounded-[0.7rem] border border-white/10 bg-white/[0.03] px-3 py-1.5">
            <User className="h-3.5 w-3.5 shrink-0 text-white/30" />
            <input className={inputClass} value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder="Seu nome" autoFocus />
            <button onClick={handleSaveName} disabled={saving} className="shrink-0 text-[#4ade80]"><Save className="h-3.5 w-3.5" /></button>
            <button onClick={() => setEditField(null)} className="shrink-0 text-white/30"><X className="h-3.5 w-3.5" /></button>
          </div>
        ) : (
          <button onClick={() => { setEditField('name'); setEditValue(profile?.name || '') }} className={menuBtn}>
            <User className="h-3.5 w-3.5 text-white/40" />
            <div className="flex-1">
              <p className="text-[6px] text-white/30">Nome</p>
              <p className="text-[8px] text-white/70">{profile?.name || 'Nao informado'}</p>
            </div>
            <PencilLine className="h-3 w-3 text-white/20" />
          </button>
        )}

        {/* ── Email ── */}
        {editField === 'email' ? (
          <div className="flex items-center gap-1 rounded-[0.7rem] border border-white/10 bg-white/[0.03] px-3 py-1.5">
            <Mail className="h-3.5 w-3.5 shrink-0 text-white/30" />
            <input className={inputClass} type="email" value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder="Seu email" autoFocus />
            <button onClick={handleSaveEmail} disabled={saving} className="shrink-0 text-[#4ade80]"><Save className="h-3.5 w-3.5" /></button>
            <button onClick={() => setEditField(null)} className="shrink-0 text-white/30"><X className="h-3.5 w-3.5" /></button>
          </div>
        ) : (
          <button onClick={() => { setEditField('email'); setEditValue(profile?.email || user?.email || '') }} className={menuBtn}>
            <Mail className="h-3.5 w-3.5 text-white/40" />
            <div className="flex-1">
              <p className="text-[6px] text-white/30">Email</p>
              <p className="text-[8px] text-white/70">{profile?.email || user?.email}</p>
            </div>
            <PencilLine className="h-3 w-3 text-white/20" />
          </button>
        )}

        {/* ── Senha ── */}
        <button onClick={() => { setChangePassword(!changePassword); setError('') }} className={menuBtn}>
          <Key className="h-3.5 w-3.5 text-white/40" />
          <span className="flex-1 text-[8px] text-white/70">Alterar senha</span>
          <ChevronRight className={`h-3 w-3 text-white/20 transition-transform ${changePassword ? 'rotate-90' : ''}`} />
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
      </div>

      {/* ═══ Configurações ═══ */}
      <p className="mb-2 text-[7px] font-semibold uppercase tracking-[0.14em] text-white/30">Configuracoes</p>
      <div className="space-y-1 mb-4">
        {/* Notificações */}
        <button onClick={handleToggleNotifications} className={menuBtn}>
          <Bell className="h-3.5 w-3.5 text-white/40" />
          <span className="flex-1 text-[8px] text-white/70">Notificacoes</span>
          <span className={`rounded-full px-1.5 py-0.5 text-[6px] font-semibold ${profile?.notifications_enabled ? 'border border-[#4ade8030] bg-[#4ade8010] text-[#4ade80]' : 'border border-white/10 bg-white/5 text-white/30'}`}>
            {profile?.notifications_enabled ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Tema */}
        <div className={menuBtn}>
          <Moon className="h-3.5 w-3.5 text-white/40" />
          <span className="flex-1 text-[8px] text-white/70">Tema</span>
          <span className="text-[7px] text-white/30">Dark</span>
        </div>
      </div>

      {/* ═══ Admin Panel ═══ */}
      {isAdmin && (
        <>
          <p className="mb-2 text-[7px] font-semibold uppercase tracking-[0.14em] text-[#a78bfa]/50">Administracao</p>
          <div className="space-y-1 mb-4">
            <button
              onClick={() => router.push('/admin')}
              className="flex w-full items-center gap-2 rounded-[0.7rem] border border-[#a78bfa20] bg-[#a78bfa08] px-3 py-2"
            >
              <Shield className="h-3.5 w-3.5 text-[#a78bfa]" />
              <span className="flex-1 text-left text-[8px] font-semibold text-[#a78bfa]">Painel Admin</span>
              <ChevronRight className="h-3 w-3 text-[#a78bfa]/50" />
            </button>
          </div>
        </>
      )}

      {/* ═══ Sobre ═══ */}
      <p className="mb-2 text-[7px] font-semibold uppercase tracking-[0.14em] text-white/30">Sobre</p>
      <div className="space-y-1 mb-4">
        <div className={menuBtn}>
          <Info className="h-3.5 w-3.5 text-white/40" />
          <div className="flex-1">
            <p className="text-[8px] text-white/70">SEA Fisio</p>
            <p className="text-[6px] text-white/30">Versao 1.0.0 · Sistema de Estudo Avancado.</p>
          </div>
        </div>
      </div>

      {/* ═══ Logout ═══ */}
      <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-[0.7rem] border border-[#f8717120] bg-[#f8717108] px-3 py-2">
        <LogOut className="h-3.5 w-3.5 text-[#fca5a5]" />
        <span className="text-[8px] font-semibold text-[#fca5a5]">Sair da conta</span>
      </button>
    </div>
  )
}
