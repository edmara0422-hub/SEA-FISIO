'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, type Profile } from '@/lib/stores/authStore'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft, Ban, Bell, Brain, ChevronRight, Crown, Key, LineChart,
  Lock, MessageSquare, PencilLine, RefreshCw, Save, Search,
  Send, Settings, Shield, Trash2, Unlock, User, Users, X,
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

type AdminTab = 'users' | 'subscriptions' | 'analytics' | 'communication' | 'config'
type UserRow = Profile & { blocked: boolean; last_login: string | null }
type SubRow = { id: string; user_id: string; plan: string; status: string; started_at: string; expires_at: string | null; cancelled_at: string | null }

const COLORS = ['#4ade80', '#facc15', '#fb923c', '#f87171', '#60a5fa', '#a78bfa']

export default function AdminPage() {
  const router = useRouter()
  const { isAdmin, initialized } = useAuthStore()
  const [tab, setTab] = useState<AdminTab>('users')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  // Users
  const [users, setUsers] = useState<UserRow[]>([])
  const [search, setSearch] = useState('')
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [resetPwUser, setResetPwUser] = useState<string | null>(null)
  const [resetPwValue, setResetPwValue] = useState('')

  // Subscriptions
  const [subs, setSubs] = useState<SubRow[]>([])

  // Analytics
  const [events, setEvents] = useState<{ event: string; created_at: string }[]>([])
  const [allProfiles, setAllProfiles] = useState<{ id: string; created_at: string; last_login: string | null }[]>([])

  // Communication
  const [notifTitle, setNotifTitle] = useState('')
  const [notifBody, setNotifBody] = useState('')
  const [notifTarget, setNotifTarget] = useState<'all' | 'active' | 'trial'>('all')
  const [notifSent, setNotifSent] = useState(false)

  // Config
  const [configs, setConfigs] = useState<Record<string, string>>({})
  const [configSaved, setConfigSaved] = useState(false)

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  useEffect(() => { if (initialized && !isAdmin) router.replace('/sea') }, [initialized, isAdmin, router])

  // ── Data Loaders ──
  const loadUsers = useCallback(async () => {
    if (!supabase) return; setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (data) setUsers(data as UserRow[])
    setLoading(false)
  }, [])

  const loadSubs = useCallback(async () => {
    if (!supabase) return; setLoading(true)
    const { data } = await supabase.from('subscriptions').select('*').order('created_at', { ascending: false })
    if (data) setSubs(data as SubRow[])
    // Also load users for name lookup
    if (users.length === 0) { const { data: u } = await supabase.from('profiles').select('*'); if (u) setUsers(u as UserRow[]) }
    setLoading(false)
  }, [users.length])

  const loadAnalytics = useCallback(async () => {
    if (!supabase) return; setLoading(true)
    const { data: ev } = await supabase.from('app_analytics').select('event, created_at').order('created_at', { ascending: true }).limit(10000)
    if (ev) setEvents(ev as typeof events)
    const { data: pr } = await supabase.from('profiles').select('id, created_at, last_login')
    if (pr) setAllProfiles(pr as typeof allProfiles)
    setLoading(false)
  }, [])

  const loadConfigs = useCallback(async () => {
    if (!supabase) return; setLoading(true)
    const { data } = await supabase.from('app_config').select('*')
    if (data) { const m: Record<string, string> = {}; data.forEach((r: { key: string; value: unknown }) => { m[r.key] = JSON.stringify(r.value) }); setConfigs(m) }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isAdmin) return
    if (tab === 'users') loadUsers()
    else if (tab === 'subscriptions') loadSubs()
    else if (tab === 'analytics') loadAnalytics()
    else if (tab === 'config') loadConfigs()
  }, [tab, isAdmin, loadUsers, loadSubs, loadAnalytics, loadConfigs])

  // ── User Actions ──
  const blockUser = async (id: string, block: boolean) => { if (!supabase) return; await supabase.from('profiles').update({ blocked: block }).eq('id', id); flash(block ? 'Bloqueado.' : 'Desbloqueado.'); loadUsers() }
  const deleteUser = async (id: string, email: string) => { if (!confirm(`Excluir ${email}?`)) return; if (!supabase) return; await supabase.from('profiles').delete().eq('id', id); flash('Excluido.'); loadUsers() }
  const saveUserEdit = async (id: string) => { if (!supabase) return; await supabase.from('profiles').update({ name: editName, email: editEmail }).eq('id', id); setEditingUser(null); flash('Atualizado.'); loadUsers() }
  const resetUserPassword = async (email: string) => {
    if (!supabase || !resetPwValue || resetPwValue.length < 6) { flash('Senha min 6 caracteres.'); return }
    // Admin can't directly change another user's password via client SDK
    // Instead send reset email
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/reset-password` })
    setResetPwUser(null); setResetPwValue('')
    flash(`Email de reset enviado para ${email}.`)
  }

  // ── Sub Actions ──
  const changeSubStatus = async (id: string, status: string) => { if (!supabase) return; const u: Record<string, unknown> = { status }; if (status === 'cancelled') u.cancelled_at = new Date().toISOString(); await supabase.from('subscriptions').update(u).eq('id', id); flash('Assinatura atualizada.'); loadSubs() }
  const changeSubPlan = async (id: string, plan: string) => { if (!supabase) return; await supabase.from('subscriptions').update({ plan }).eq('id', id); flash('Plano alterado.'); loadSubs() }

  // ── Communication ──
  const sendNotification = async () => {
    if (!supabase || !notifTitle || !notifBody) return
    let targets = users
    if (notifTarget === 'active') { const ids = subs.filter(s => s.status === 'active').map(s => s.user_id); targets = users.filter(u => ids.includes(u.id)) }
    else if (notifTarget === 'trial') { const ids = subs.filter(s => s.status === 'trial').map(s => s.user_id); targets = users.filter(u => ids.includes(u.id)) }
    if (targets.length === 0) { flash('Nenhum usuario.'); return }
    const rows = targets.map(u => ({ user_id: u.id, title: notifTitle, body: notifBody, type: 'system' as const }))
    await supabase.from('notifications').insert(rows)
    setNotifSent(true); flash(`Enviado para ${rows.length} usuario(s).`); setTimeout(() => setNotifSent(false), 3000)
  }

  // ── Config ──
  const saveConfig = async (key: string, value: string) => { if (!supabase) return; try { const p = JSON.parse(value); await supabase.from('app_config').upsert({ key, value: p, updated_at: new Date().toISOString() }); setConfigSaved(true); setTimeout(() => setConfigSaved(false), 2000) } catch { flash('JSON invalido.') } }

  // ── Analytics Computed ──
  const now = Date.now()
  const DAY = 86400000

  const totalUsers = allProfiles.length
  const activeToday = allProfiles.filter(p => p.last_login && (now - new Date(p.last_login).getTime()) < DAY).length
  const activeWeek = allProfiles.filter(p => p.last_login && (now - new Date(p.last_login).getTime()) < DAY * 7).length
  const activeMonth = allProfiles.filter(p => p.last_login && (now - new Date(p.last_login).getTime()) < DAY * 30).length

  // Signups per day (last 30 days)
  const signupsByDay = useMemo(() => {
    const days: Record<string, number> = {}
    for (let i = 29; i >= 0; i--) { const d = new Date(now - i * DAY).toISOString().slice(0, 10); days[d] = 0 }
    allProfiles.forEach(p => { const d = p.created_at.slice(0, 10); if (days[d] !== undefined) days[d]++ })
    return Object.entries(days).map(([date, count]) => ({ date: date.slice(5), count }))
  }, [allProfiles, now])

  // Events by type
  const eventCounts = useMemo(() => {
    const c: Record<string, number> = {}
    events.forEach(e => { c[e.event] = (c[e.event] || 0) + 1 })
    return Object.entries(c).sort((a, b) => b[1] - a[1]).map(([event, count]) => ({ event, count }))
  }, [events])

  // Events per day (last 14 days)
  const eventsByDay = useMemo(() => {
    const days: Record<string, number> = {}
    for (let i = 13; i >= 0; i--) { const d = new Date(now - i * DAY).toISOString().slice(0, 10); days[d] = 0 }
    events.forEach(e => { const d = e.created_at.slice(0, 10); if (days[d] !== undefined) days[d]++ })
    return Object.entries(days).map(([date, count]) => ({ date: date.slice(5), count }))
  }, [events, now])

  // Retention: % who logged in last 7 days vs total
  const retention7d = totalUsers > 0 ? Math.round((activeWeek / totalUsers) * 100) : 0
  const retention30d = totalUsers > 0 ? Math.round((activeMonth / totalUsers) * 100) : 0
  const churnRate = subs.length > 0 ? Math.round((subs.filter(s => s.status === 'cancelled').length / subs.length) * 100) : 0

  // Sub distribution for pie
  const subDistribution = useMemo(() => {
    const c: Record<string, number> = { active: 0, trial: 0, cancelled: 0, overdue: 0, expired: 0 }
    subs.forEach(s => { c[s.status] = (c[s.status] || 0) + 1 })
    return Object.entries(c).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }))
  }, [subs])

  // IA Insights
  const insights = useMemo(() => {
    const list: string[] = []
    if (retention7d < 30 && totalUsers > 5) list.push(`Retencao de 7 dias em ${retention7d}% — abaixo do ideal (>50%). Considerar onboarding melhor ou notificacoes de reengajamento.`)
    if (churnRate > 20) list.push(`Taxa de churn em ${churnRate}% — elevada. Investigar motivos de cancelamento. Sugestao: pesquisa NPS ou email automatico pos-cancelamento.`)
    if (activeToday === 0 && totalUsers > 3) list.push('Nenhum usuario ativo hoje. Enviar push notification de reengajamento.')
    const topEvent = eventCounts[0]
    if (topEvent) list.push(`Feature mais usada: "${topEvent.event}" com ${topEvent.count} interacoes. Priorizar melhorias nessa area.`)
    const prontuarioEvents = eventCounts.find(e => e.event.includes('prontuario'))
    const calcEvents = eventCounts.find(e => e.event.includes('calc'))
    if (prontuarioEvents && calcEvents && prontuarioEvents.count > calcEvents.count * 2) list.push(`Prontuario tem ${prontuarioEvents.count} usos vs Calculadoras ${calcEvents.count}. Usuarios preferem o prontuario — considerar expandir funcionalidades.`)
    if (totalUsers > 0 && subs.length === 0) list.push('Nenhuma assinatura registrada. Configurar planos e fluxo de pagamento.')
    if (list.length === 0) list.push('Poucos dados para gerar insights. Analytics melhora conforme usuarios interagem com o app.')
    return list
  }, [retention7d, churnRate, activeToday, totalUsers, eventCounts, subs.length])

  const filteredUsers = users.filter(u => !search || (u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase()))
  const inputClass = 'w-full h-7 rounded-[0.4rem] border border-white/10 bg-white/5 px-2 text-[10px] text-white placeholder:text-white/30 outline-none focus:border-white/20'
  const chip = (active: boolean) => active ? 'border-[#60a5fa30] bg-[#60a5fa10] text-[#60a5fa]' : 'border-white/8 bg-white/[0.02] text-white/40 hover:text-white/60'

  if (!isAdmin) return null

  const TABS: { id: AdminTab; label: string; icon: typeof Users }[] = [
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'subscriptions', label: 'Assinaturas', icon: Crown },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'communication', label: 'Avisos', icon: MessageSquare },
    { id: 'config', label: 'Config', icon: Settings },
  ]

  return (
    <div className="relative min-h-screen bg-[#010101] text-white px-3 pb-32 pt-16 md:px-6">
      <button onClick={() => router.push('/profile')} className="mb-3 flex items-center gap-1 text-[8px] text-white/40 hover:text-white/60"><ArrowLeft className="h-3 w-3" /> Perfil</button>
      <div className="mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-[#a78bfa]" /><h1 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a78bfa]">Painel Admin</h1></div>
      {msg && <div className="mb-2 rounded-[0.5rem] border border-[#4ade8030] bg-[#4ade8008] px-2 py-1"><p className="text-[7px] text-[#86efac]">{msg}</p></div>}

      {/* Tabs */}
      <div className="mb-3 scrollbar-hide flex gap-1 overflow-x-auto">
        {TABS.map((t) => (<button key={t.id} onClick={() => setTab(t.id)} className={`shrink-0 flex items-center gap-1 rounded-full border px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] transition-all ${chip(tab === t.id)}`}><t.icon className="h-2.5 w-2.5" />{t.label}</button>))}
      </div>

      {loading && <div className="flex justify-center py-8"><div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#a78bfa]" /></div>}

      {/* ══════ USERS ══════ */}
      {tab === 'users' && !loading && (
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <div className="relative flex-1"><Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/30" /><input className={`${inputClass} pl-7`} placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <button onClick={loadUsers} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.4rem] border border-white/10 bg-white/5"><RefreshCw className="h-3 w-3 text-white/40" /></button>
          </div>
          <p className="text-[6px] text-white/30">{filteredUsers.length} usuario(s)</p>
          <div className="space-y-1 max-h-[60vh] overflow-y-auto scrollbar-hide">
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
                ) : resetPwUser === u.id ? (
                  <div className="space-y-1">
                    <p className="text-[7px] text-white/50">Enviar email de reset para {u.email}?</p>
                    <div className="flex gap-1">
                      <button onClick={() => resetUserPassword(u.email || '')} className="flex h-6 items-center gap-1 rounded-[0.4rem] border border-[#60a5fa20] bg-[#60a5fa08] px-2 text-[7px] text-[#60a5fa]"><Mail className="h-2.5 w-2.5" /> Enviar reset</button>
                      <button onClick={() => setResetPwUser(null)} className="flex h-6 items-center gap-1 rounded-[0.4rem] border border-white/10 px-2 text-[7px] text-white/40"><X className="h-2.5 w-2.5" /> Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/[0.03]"><User className="h-3 w-3 text-white/25" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="truncate text-[8px] font-semibold text-white/70">{u.name || 'Sem nome'}</p>
                        {u.role === 'admin' && <span className="text-[5px] font-bold text-[#a78bfa]">ADM</span>}
                        {u.blocked && <span className="text-[5px] font-bold text-[#f87171]">BLOQ</span>}
                      </div>
                      <p className="truncate text-[6px] text-white/30">{u.email}</p>
                      <p className="text-[5px] text-white/20">Criado: {new Date(u.created_at).toLocaleDateString('pt-BR')}{u.last_login ? ` · Login: ${new Date(u.last_login).toLocaleDateString('pt-BR')}` : ''}</p>
                    </div>
                    <div className="flex shrink-0 gap-0.5">
                      <button onClick={() => { setEditingUser(u.id); setEditName(u.name || ''); setEditEmail(u.email || '') }} title="Editar" className="flex h-5 w-5 items-center justify-center rounded-[0.3rem] border border-white/8 text-white/30 hover:text-white/60"><PencilLine className="h-2.5 w-2.5" /></button>
                      <button onClick={() => setResetPwUser(u.id)} title="Reset senha" className="flex h-5 w-5 items-center justify-center rounded-[0.3rem] border border-white/8 text-white/30 hover:text-white/60"><Key className="h-2.5 w-2.5" /></button>
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

      {/* ══════ SUBSCRIPTIONS ══════ */}
      {tab === 'subscriptions' && !loading && (
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-1">
            {[{ l: 'Total', v: subs.length, c: '#60a5fa' }, { l: 'Ativos', v: subs.filter(s => s.status === 'active').length, c: '#4ade80' }, { l: 'Trial', v: subs.filter(s => s.status === 'trial').length, c: '#facc15' }, { l: 'Cancel.', v: subs.filter(s => s.status === 'cancelled').length, c: '#fb923c' }, { l: 'Devendo', v: subs.filter(s => s.status === 'overdue').length, c: '#f87171' }].map((s) => (
              <div key={s.l} className="rounded-[0.5rem] border border-white/6 bg-black/20 px-1 py-1.5 text-center"><p className="text-[10px] font-bold" style={{ color: s.c }}>{s.v}</p><p className="text-[5px] text-white/30">{s.l}</p></div>
            ))}
          </div>
          {subDistribution.length > 0 && (
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={subDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={45} innerRadius={20} strokeWidth={0}>{subDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 10 }} /></PieChart>
              </ResponsiveContainer>
            </div>
          )}
          {subs.length === 0 && <p className="text-center text-[7px] text-white/30 py-4">Nenhuma assinatura.</p>}
          {subs.map((s) => { const up = users.find(u => u.id === s.user_id); return (
            <div key={s.id} className="flex items-center gap-2 rounded-[0.6rem] border border-white/6 bg-white/[0.02] px-2 py-1.5">
              <div className="min-w-0 flex-1"><p className="truncate text-[8px] font-semibold text-white/70">{up?.name || up?.email || s.user_id}</p><p className="text-[6px] text-white/30">{s.plan} · {s.status} · {new Date(s.started_at).toLocaleDateString('pt-BR')}</p></div>
              <select className="h-5 rounded-[0.3rem] border border-white/10 bg-black/30 px-1 text-[6px] text-white/60 outline-none" value={s.status} onChange={(e) => changeSubStatus(s.id, e.target.value)}><option value="active">Ativo</option><option value="trial">Trial</option><option value="cancelled">Cancelado</option><option value="overdue">Devendo</option><option value="expired">Expirado</option></select>
              <select className="h-5 rounded-[0.3rem] border border-white/10 bg-black/30 px-1 text-[6px] text-white/60 outline-none" value={s.plan} onChange={(e) => changeSubPlan(s.id, e.target.value)}><option value="free">Free</option><option value="monthly">Mensal</option><option value="yearly">Anual</option><option value="trial">Trial</option></select>
            </div>
          ) })}
        </div>
      )}

      {/* ══════ ANALYTICS ══════ */}
      {tab === 'analytics' && !loading && (
        <div className="space-y-3">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-1">
            {[{ l: 'Total', v: totalUsers, c: '#60a5fa' }, { l: 'Hoje', v: activeToday, c: '#4ade80' }, { l: 'Semana', v: activeWeek, c: '#facc15' }, { l: 'Mes', v: activeMonth, c: '#fb923c' }].map((s) => (
              <div key={s.l} className="rounded-[0.5rem] border border-white/6 bg-black/20 px-1 py-2 text-center"><p className="text-[12px] font-bold" style={{ color: s.c }}>{s.v}</p><p className="text-[5px] text-white/30">{s.l}</p></div>
            ))}
          </div>

          {/* Retention + Churn */}
          <div className="grid grid-cols-3 gap-1">
            <div className="rounded-[0.5rem] border border-white/6 bg-black/20 px-2 py-1.5 text-center"><p className="text-[10px] font-bold text-[#4ade80]">{retention7d}%</p><p className="text-[5px] text-white/30">Retencao 7d</p></div>
            <div className="rounded-[0.5rem] border border-white/6 bg-black/20 px-2 py-1.5 text-center"><p className="text-[10px] font-bold text-[#facc15]">{retention30d}%</p><p className="text-[5px] text-white/30">Retencao 30d</p></div>
            <div className="rounded-[0.5rem] border border-white/6 bg-black/20 px-2 py-1.5 text-center"><p className="text-[10px] font-bold text-[#f87171]">{churnRate}%</p><p className="text-[5px] text-white/30">Churn rate</p></div>
          </div>

          {/* Signup chart */}
          <div>
            <p className="mb-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/30">Novos usuarios (30 dias)</p>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={signupsByDay}><defs><linearGradient id="gSignup" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa" stopOpacity={0.3} /><stop offset="100%" stopColor="#60a5fa" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="date" tick={{ fontSize: 7, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} /><YAxis hide /><Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 10 }} /><Area type="monotone" dataKey="count" stroke="#60a5fa" fill="url(#gSignup)" strokeWidth={1.5} /></AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Events chart */}
          <div>
            <p className="mb-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/30">Eventos por dia (14 dias)</p>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventsByDay}><XAxis dataKey="date" tick={{ fontSize: 7, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} /><YAxis hide /><Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 10 }} /><Bar dataKey="count" fill="#a78bfa" radius={[2, 2, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top features */}
          <div>
            <p className="mb-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/30">Features mais usadas</p>
            {eventCounts.length === 0 ? <p className="text-[7px] text-white/20 py-2">Nenhum evento registrado.</p> : (
              <div className="space-y-0.5">
                {eventCounts.slice(0, 10).map((a) => (
                  <div key={a.event} className="flex items-center gap-2 rounded-[0.4rem] border border-white/4 bg-white/[0.02] px-2 py-1">
                    <div className="h-1.5 rounded-full bg-[#a78bfa]" style={{ width: `${Math.min((a.count / (eventCounts[0]?.count || 1)) * 100, 100)}%`, minWidth: 4 }} />
                    <p className="flex-1 truncate text-[7px] text-white/50">{a.event}</p>
                    <p className="shrink-0 text-[7px] font-bold text-white/60">{a.count}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* IA Insights */}
          <div>
            <div className="mb-1 flex items-center gap-1"><Brain className="h-3 w-3 text-[#a78bfa]" /><p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-[#a78bfa]/60">Insights IA</p></div>
            <div className="space-y-1">
              {insights.map((insight, i) => (
                <div key={i} className="rounded-[0.5rem] border border-[#a78bfa15] bg-[#a78bfa05] px-2 py-1.5">
                  <p className="text-[7px] leading-relaxed text-white/50">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          <button onClick={loadAnalytics} className="flex items-center gap-1 text-[7px] text-white/30 hover:text-white/50"><RefreshCw className="h-2.5 w-2.5" /> Atualizar</button>
        </div>
      )}

      {/* ══════ COMMUNICATION ══════ */}
      {tab === 'communication' && !loading && (
        <div className="space-y-2">
          <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-white/30">Enviar notificacao</p>
          <input className={inputClass} placeholder="Titulo" value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)} />
          <textarea className={`${inputClass} h-16 resize-none py-1.5`} placeholder="Mensagem..." value={notifBody} onChange={(e) => setNotifBody(e.target.value)} />
          <div className="flex gap-1">
            {(['all', 'active', 'trial'] as const).map((t) => (<button key={t} onClick={() => setNotifTarget(t)} className={`rounded-full border px-2 py-0.5 text-[7px] font-semibold ${chip(notifTarget === t)}`}>{t === 'all' ? 'Todos' : t === 'active' ? 'Ativos' : 'Trial'}</button>))}
          </div>
          <button onClick={sendNotification} disabled={!notifTitle || !notifBody} className="flex items-center gap-1 rounded-[0.5rem] border border-[#a78bfa30] bg-[#a78bfa10] px-3 py-1.5 text-[8px] font-semibold text-[#a78bfa] disabled:opacity-30"><Send className="h-3 w-3" /> Enviar</button>
          {notifSent && <p className="text-[7px] text-[#4ade80]">Enviado.</p>}
        </div>
      )}

      {/* ══════ CONFIG ══════ */}
      {tab === 'config' && !loading && (
        <div className="space-y-2">
          <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-white/30">Configuracoes do app</p>
          {Object.entries(configs).map(([key, value]) => (
            <div key={key} className="rounded-[0.6rem] border border-white/6 bg-white/[0.02] px-2 py-1.5">
              <p className="mb-0.5 text-[7px] font-semibold text-white/50">{key}</p>
              <div className="flex gap-1"><input className={inputClass} value={value} onChange={(e) => setConfigs((prev) => ({ ...prev, [key]: e.target.value }))} /><button onClick={() => saveConfig(key, value)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.4rem] border border-white/10 bg-white/5 text-white/40 hover:text-white/60"><Save className="h-3 w-3" /></button></div>
            </div>
          ))}
          {configSaved && <p className="text-[7px] text-[#4ade80]">Salvo.</p>}
        </div>
      )}
    </div>
  )
}
