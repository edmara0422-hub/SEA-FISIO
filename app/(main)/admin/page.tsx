'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, type Profile } from '@/lib/stores/authStore'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft, Ban, Bell, ChevronRight, Crown, LineChart, Lock,
  Mail, MessageSquare, PencilLine, RefreshCw, Save, Search,
  Send, Settings, Shield, Trash2, Unlock, User, Users, X,
} from 'lucide-react'

type AdminTab = 'users' | 'subscriptions' | 'analytics' | 'communication' | 'config'

type SubRow = { id: string; user_id: string; plan: string; status: string; started_at: string; expires_at: string | null; cancelled_at: string | null }
type AnalyticsRow = { event: string; count: number }

export default function AdminPage() {
  const router = useRouter()
  const { isAdmin, initialized } = useAuthStore()
  const [tab, setTab] = useState<AdminTab>('users')
  const [loading, setLoading] = useState(false)

  // Users
  const [users, setUsers] = useState<(Profile & { blocked: boolean; last_login: string | null })[]>([])
  const [search, setSearch] = useState('')
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')

  // Subscriptions
  const [subs, setSubs] = useState<SubRow[]>([])

  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsRow[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [activeToday, setActiveToday] = useState(0)
  const [activeWeek, setActiveWeek] = useState(0)
  const [activeMonth, setActiveMonth] = useState(0)

  // Communication
  const [notifTitle, setNotifTitle] = useState('')
  const [notifBody, setNotifBody] = useState('')
  const [notifTarget, setNotifTarget] = useState<'all' | 'active' | 'trial'>('all')
  const [notifSent, setNotifSent] = useState(false)

  // Config
  const [configs, setConfigs] = useState<Record<string, string>>({})
  const [configSaved, setConfigSaved] = useState(false)

  // Message
  const [msg, setMsg] = useState('')

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  // Redirect non-admin
  useEffect(() => {
    if (initialized && !isAdmin) router.replace('/sea')
  }, [initialized, isAdmin, router])

  // Load data based on tab
  const loadUsers = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (data) setUsers(data as typeof users)
    setLoading(false)
  }, [])

  const loadSubs = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    const { data } = await supabase.from('subscriptions').select('*').order('created_at', { ascending: false })
    if (data) setSubs(data as SubRow[])
    setLoading(false)
  }, [])

  const loadAnalytics = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    const { data: profiles } = await supabase.from('profiles').select('id, last_login, created_at')
    if (profiles) {
      setTotalUsers(profiles.length)
      const now = Date.now()
      const day = 86400000
      setActiveToday(profiles.filter(p => p.last_login && (now - new Date(p.last_login).getTime()) < day).length)
      setActiveWeek(profiles.filter(p => p.last_login && (now - new Date(p.last_login).getTime()) < day * 7).length)
      setActiveMonth(profiles.filter(p => p.last_login && (now - new Date(p.last_login).getTime()) < day * 30).length)
    }
    const { data: events } = await supabase.from('app_analytics').select('event').limit(5000)
    if (events) {
      const counts: Record<string, number> = {}
      events.forEach((e: { event: string }) => { counts[e.event] = (counts[e.event] || 0) + 1 })
      setAnalytics(Object.entries(counts).map(([event, count]) => ({ event, count })).sort((a, b) => b.count - a.count))
    }
    setLoading(false)
  }, [])

  const loadConfigs = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    const { data } = await supabase.from('app_config').select('*')
    if (data) {
      const map: Record<string, string> = {}
      data.forEach((r: { key: string; value: unknown }) => { map[r.key] = JSON.stringify(r.value) })
      setConfigs(map)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isAdmin) return
    if (tab === 'users') loadUsers()
    else if (tab === 'subscriptions') loadSubs()
    else if (tab === 'analytics') loadAnalytics()
    else if (tab === 'config') loadConfigs()
  }, [tab, isAdmin, loadUsers, loadSubs, loadAnalytics, loadConfigs])

  // ── Actions ──

  const blockUser = async (userId: string, block: boolean) => {
    if (!supabase) return
    await supabase.from('profiles').update({ blocked: block }).eq('id', userId)
    flash(block ? 'Usuario bloqueado.' : 'Usuario desbloqueado.')
    loadUsers()
  }

  const deleteUser = async (userId: string, email: string) => {
    if (!confirm(`Excluir ${email}? Isso remove todos os dados.`)) return
    if (!supabase) return
    await supabase.from('profiles').delete().eq('id', userId)
    flash('Usuario excluido.')
    loadUsers()
  }

  const saveUserEdit = async (userId: string) => {
    if (!supabase) return
    await supabase.from('profiles').update({ name: editName, email: editEmail }).eq('id', userId)
    setEditingUser(null)
    flash('Usuario atualizado.')
    loadUsers()
  }

  const changeSubStatus = async (subId: string, status: string) => {
    if (!supabase) return
    const update: Record<string, unknown> = { status }
    if (status === 'cancelled') update.cancelled_at = new Date().toISOString()
    await supabase.from('subscriptions').update(update).eq('id', subId)
    flash('Assinatura atualizada.')
    loadSubs()
  }

  const changeSubPlan = async (subId: string, plan: string) => {
    if (!supabase) return
    await supabase.from('subscriptions').update({ plan }).eq('id', subId)
    flash('Plano alterado.')
    loadSubs()
  }

  const sendNotification = async () => {
    if (!supabase || !notifTitle || !notifBody) return
    let targetUsers = users
    if (notifTarget === 'active') {
      const activeSubs = subs.filter(s => s.status === 'active').map(s => s.user_id)
      targetUsers = users.filter(u => activeSubs.includes(u.id))
    } else if (notifTarget === 'trial') {
      const trialSubs = subs.filter(s => s.status === 'trial').map(s => s.user_id)
      targetUsers = users.filter(u => trialSubs.includes(u.id))
    }
    const rows = targetUsers.map(u => ({ user_id: u.id, title: notifTitle, body: notifBody, type: 'system' as const }))
    if (rows.length === 0) { flash('Nenhum usuario no segmento.'); return }
    await supabase.from('notifications').insert(rows)
    setNotifSent(true)
    flash(`Notificacao enviada para ${rows.length} usuario(s).`)
    setTimeout(() => setNotifSent(false), 3000)
  }

  const saveConfig = async (key: string, value: string) => {
    if (!supabase) return
    try {
      const parsed = JSON.parse(value)
      await supabase.from('app_config').upsert({ key, value: parsed, updated_at: new Date().toISOString() })
      setConfigSaved(true)
      setTimeout(() => setConfigSaved(false), 2000)
    } catch {
      flash('JSON invalido.')
    }
  }

  const filteredUsers = users.filter(u =>
    !search || (u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const inputClass = 'w-full h-7 rounded-[0.4rem] border border-white/10 bg-white/5 px-2 text-[10px] text-white placeholder:text-white/30 outline-none focus:border-white/20'
  const chipActive = (active: boolean) => active
    ? 'border-[#60a5fa30] bg-[#60a5fa10] text-[#60a5fa]'
    : 'border-white/8 bg-white/[0.02] text-white/40 hover:text-white/60'

  if (!isAdmin) return null

  const TABS: { id: AdminTab; label: string; icon: typeof Users }[] = [
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'subscriptions', label: 'Assinaturas', icon: Crown },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'communication', label: 'Comunicacao', icon: MessageSquare },
    { id: 'config', label: 'Config', icon: Settings },
  ]

  return (
    <div className="relative min-h-screen bg-[#010101] text-white px-3 pb-32 pt-16 md:px-6">
      <button onClick={() => router.push('/profile')} className="mb-3 flex items-center gap-1 text-[8px] text-white/40 hover:text-white/60">
        <ArrowLeft className="h-3 w-3" /> Voltar ao perfil
      </button>

      <div className="mb-3 flex items-center gap-2">
        <Shield className="h-4 w-4 text-[#a78bfa]" />
        <h1 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a78bfa]">Painel Admin</h1>
      </div>

      {msg && <div className="mb-2 rounded-[0.5rem] border border-[#4ade8030] bg-[#4ade8008] px-2 py-1"><p className="text-[7px] text-[#86efac]">{msg}</p></div>}

      {/* Tabs */}
      <div className="mb-3 scrollbar-hide flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 flex items-center gap-1 rounded-full border px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] transition-all ${chipActive(tab === t.id)}`}
          >
            <t.icon className="h-2.5 w-2.5" />
            {t.label}
          </button>
        ))}
      </div>

      {loading && <div className="flex justify-center py-8"><div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#a78bfa]" /></div>}

      {/* ═══════════ USERS TAB ═══════════ */}
      {tab === 'users' && !loading && (
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/30" />
              <input className={`${inputClass} pl-7`} placeholder="Buscar nome ou email..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button onClick={loadUsers} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.4rem] border border-white/10 bg-white/5"><RefreshCw className="h-3 w-3 text-white/40" /></button>
          </div>

          <p className="text-[7px] text-white/30">{filteredUsers.length} usuario(s)</p>

          <div className="space-y-1">
            {filteredUsers.map((u) => (
              <div key={u.id} className="rounded-[0.6rem] border border-white/6 bg-white/[0.02] px-2 py-1.5">
                {editingUser === u.id ? (
                  <div className="space-y-1">
                    <input className={inputClass} value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nome" />
                    <input className={inputClass} value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Email" />
                    <div className="flex gap-1">
                      <button onClick={() => saveUserEdit(u.id)} className="flex h-6 items-center gap-1 rounded-[0.4rem] border border-[#4ade8020] bg-[#4ade8008] px-2 text-[7px] text-[#4ade80]"><Save className="h-2.5 w-2.5" /> Salvar</button>
                      <button onClick={() => setEditingUser(null)} className="flex h-6 items-center gap-1 rounded-[0.4rem] border border-white/10 px-2 text-[7px] text-white/40"><X className="h-2.5 w-2.5" /> Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/[0.03]">
                      <User className="h-3 w-3 text-white/25" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="truncate text-[8px] font-semibold text-white/70">{u.name || 'Sem nome'}</p>
                        {u.role === 'admin' && <span className="text-[5px] font-bold text-[#a78bfa]">ADM</span>}
                        {u.blocked && <span className="text-[5px] font-bold text-[#f87171]">BLOQ</span>}
                      </div>
                      <p className="truncate text-[6px] text-white/30">{u.email}</p>
                      <p className="text-[5px] text-white/20">
                        Criado: {new Date(u.created_at).toLocaleDateString('pt-BR')}
                        {u.last_login ? ` · Ultimo login: ${new Date(u.last_login).toLocaleDateString('pt-BR')}` : ' · Nunca logou'}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-0.5">
                      <button onClick={() => { setEditingUser(u.id); setEditName(u.name || ''); setEditEmail(u.email || '') }} title="Editar" className="flex h-5 w-5 items-center justify-center rounded-[0.3rem] border border-white/8 text-white/30 hover:text-white/60"><PencilLine className="h-2.5 w-2.5" /></button>
                      <button onClick={() => blockUser(u.id, !u.blocked)} title={u.blocked ? 'Desbloquear' : 'Bloquear'} className="flex h-5 w-5 items-center justify-center rounded-[0.3rem] border border-white/8 text-white/30 hover:text-white/60">{u.blocked ? <Unlock className="h-2.5 w-2.5" /> : <Ban className="h-2.5 w-2.5" />}</button>
                      {u.role !== 'admin' && <button onClick={() => deleteUser(u.id, u.email || '')} title="Excluir" className="flex h-5 w-5 items-center justify-center rounded-[0.3rem] border border-[#f8717120] text-[#fca5a5]/50 hover:text-[#fca5a5]"><Trash2 className="h-2.5 w-2.5" /></button>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ SUBSCRIPTIONS TAB ═══════════ */}
      {tab === 'subscriptions' && !loading && (
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-1">
            {[
              { label: 'Total', value: subs.length, color: '#60a5fa' },
              { label: 'Ativos', value: subs.filter(s => s.status === 'active').length, color: '#4ade80' },
              { label: 'Trial', value: subs.filter(s => s.status === 'trial').length, color: '#facc15' },
              { label: 'Cancel.', value: subs.filter(s => s.status === 'cancelled').length, color: '#fb923c' },
              { label: 'Devendo', value: subs.filter(s => s.status === 'overdue').length, color: '#f87171' },
            ].map((s) => (
              <div key={s.label} className="rounded-[0.5rem] border border-white/6 bg-black/20 px-1 py-1.5 text-center">
                <p className="text-[10px] font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[5px] text-white/30">{s.label}</p>
              </div>
            ))}
          </div>

          {subs.length === 0 && <p className="text-center text-[7px] text-white/30 py-4">Nenhuma assinatura registrada.</p>}

          {subs.map((s) => {
            const userProfile = users.find(u => u.id === s.user_id)
            return (
              <div key={s.id} className="rounded-[0.6rem] border border-white/6 bg-white/[0.02] px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[8px] font-semibold text-white/70">{userProfile?.name || userProfile?.email || s.user_id}</p>
                    <p className="text-[6px] text-white/30">Plano: {s.plan} · Status: {s.status} · Desde: {new Date(s.started_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="flex shrink-0 gap-0.5">
                    <select
                      className="h-5 rounded-[0.3rem] border border-white/10 bg-black/30 px-1 text-[6px] text-white/60 outline-none"
                      value={s.status}
                      onChange={(e) => changeSubStatus(s.id, e.target.value)}
                    >
                      <option value="active">Ativo</option>
                      <option value="trial">Trial</option>
                      <option value="cancelled">Cancelado</option>
                      <option value="overdue">Devendo</option>
                      <option value="expired">Expirado</option>
                    </select>
                    <select
                      className="h-5 rounded-[0.3rem] border border-white/10 bg-black/30 px-1 text-[6px] text-white/60 outline-none"
                      value={s.plan}
                      onChange={(e) => changeSubPlan(s.id, e.target.value)}
                    >
                      <option value="free">Free</option>
                      <option value="monthly">Mensal</option>
                      <option value="yearly">Anual</option>
                      <option value="trial">Trial</option>
                    </select>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ═══════════ ANALYTICS TAB ═══════════ */}
      {tab === 'analytics' && !loading && (
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-1">
            {[
              { label: 'Total usuarios', value: totalUsers, color: '#60a5fa' },
              { label: 'Ativos hoje', value: activeToday, color: '#4ade80' },
              { label: 'Ativos semana', value: activeWeek, color: '#facc15' },
              { label: 'Ativos mes', value: activeMonth, color: '#fb923c' },
            ].map((s) => (
              <div key={s.label} className="rounded-[0.5rem] border border-white/6 bg-black/20 px-1.5 py-2 text-center">
                <p className="text-[12px] font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[5px] text-white/30">{s.label}</p>
              </div>
            ))}
          </div>

          <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-white/30">Features mais usadas</p>
          {analytics.length === 0 ? (
            <p className="text-center text-[7px] text-white/20 py-4">Nenhum evento registrado ainda. Analytics comeca a popular quando usuarios interagem com o app.</p>
          ) : (
            <div className="space-y-0.5">
              {analytics.slice(0, 15).map((a) => (
                <div key={a.event} className="flex items-center gap-2 rounded-[0.4rem] border border-white/4 bg-white/[0.02] px-2 py-1">
                  <div className="h-1.5 rounded-full bg-[#60a5fa]" style={{ width: `${Math.min((a.count / (analytics[0]?.count || 1)) * 100, 100)}%`, minWidth: 4 }} />
                  <p className="flex-1 truncate text-[7px] text-white/50">{a.event}</p>
                  <p className="shrink-0 text-[7px] font-bold text-white/60">{a.count}</p>
                </div>
              ))}
            </div>
          )}

          <button onClick={loadAnalytics} className="flex items-center gap-1 text-[7px] text-white/30 hover:text-white/50"><RefreshCw className="h-2.5 w-2.5" /> Atualizar</button>
        </div>
      )}

      {/* ═══════════ COMMUNICATION TAB ═══════════ */}
      {tab === 'communication' && !loading && (
        <div className="space-y-2">
          <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-white/30">Enviar notificacao</p>

          <div className="space-y-1">
            <input className={inputClass} placeholder="Titulo da notificacao" value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)} />
            <textarea className={`${inputClass} h-16 resize-none py-1.5`} placeholder="Mensagem..." value={notifBody} onChange={(e) => setNotifBody(e.target.value)} />
          </div>

          <div className="flex gap-1">
            {(['all', 'active', 'trial'] as const).map((t) => (
              <button key={t} onClick={() => setNotifTarget(t)} className={`rounded-full border px-2 py-0.5 text-[7px] font-semibold ${chipActive(notifTarget === t)}`}>
                {t === 'all' ? 'Todos' : t === 'active' ? 'Ativos' : 'Trial'}
              </button>
            ))}
          </div>

          <button
            onClick={sendNotification}
            disabled={!notifTitle || !notifBody}
            className="flex items-center gap-1 rounded-[0.5rem] border border-[#a78bfa30] bg-[#a78bfa10] px-3 py-1.5 text-[8px] font-semibold text-[#a78bfa] disabled:opacity-30"
          >
            <Send className="h-3 w-3" />
            Enviar
          </button>

          {notifSent && <p className="text-[7px] text-[#4ade80]">Enviado com sucesso.</p>}
        </div>
      )}

      {/* ═══════════ CONFIG TAB ═══════════ */}
      {tab === 'config' && !loading && (
        <div className="space-y-2">
          <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-white/30">Configuracoes do app</p>

          {Object.entries(configs).map(([key, value]) => (
            <div key={key} className="rounded-[0.6rem] border border-white/6 bg-white/[0.02] px-2 py-1.5">
              <p className="mb-0.5 text-[7px] font-semibold text-white/50">{key}</p>
              <div className="flex gap-1">
                <input
                  className={inputClass}
                  value={value}
                  onChange={(e) => setConfigs((prev) => ({ ...prev, [key]: e.target.value }))}
                />
                <button onClick={() => saveConfig(key, value)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.4rem] border border-white/10 bg-white/5 text-white/40 hover:text-white/60">
                  <Save className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}

          {configSaved && <p className="text-[7px] text-[#4ade80]">Configuracao salva.</p>}
        </div>
      )}
    </div>
  )
}
