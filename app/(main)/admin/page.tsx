'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, type Profile } from '@/lib/stores/authStore'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft, Ban, Brain, Crown, Eye, EyeOff, Key, LineChart,
  Mail, MessageSquare, PencilLine, RefreshCw, Save, Search,
  Send, Settings, Shield, Trash2, Unlock, User, Users, X, Target,
  CheckCircle2, AlertTriangle, TrendingUp, Zap, Building2,
} from 'lucide-react'
import { StrategicPanel } from '@/components/sea/strategic-panel'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

type AdminTab = 'users' | 'subscriptions' | 'analytics' | 'communication' | 'config' | 'estrategia' | 'crm'

type ZohoLead    = { id: string; First_Name: string; Last_Name: string; Email: string; Lead_Status: string; Lead_Source: string; Created_Time: string; Phone: string }
type ZohoDeal    = { id: string; Deal_Name: string; Stage: string; Amount: number; Closing_Date: string; Account_Name: string }
type ZohoContact = { id: string; First_Name: string; Last_Name: string; Email: string; Phone: string; Account_Name: string; Created_Time: string }
type ZohoStats   = { totalLeads: number; totalContacts: number; totalDeals: number; totalPipeline: number; dealsByStage: Record<string, number>; leadsByStatus: Record<string, number> }
type UserRow = Profile & { blocked: boolean; last_login: string | null }
type SubRow = { id: string; user_id: string; plan: string; status: string; started_at: string; expires_at: string | null; cancelled_at: string | null }

const COLORS = ['#4ade80', '#facc15', '#fb923c', '#f87171', '#60a5fa', '#a78bfa']

export default function AdminPage() {
  const router = useRouter()
  const { isAdmin, initialized, user } = useAuthStore()
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
  // Password change for own account
  const [ownCurrentPw, setOwnCurrentPw] = useState('')
  const [showOwnCurrentPw, setShowOwnCurrentPw] = useState(false)
  const [ownPw, setOwnPw] = useState('')
  const [showOwnPw, setShowOwnPw] = useState(false)

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

  // CRM — Zoho
  const [crmLeads, setCrmLeads]       = useState<ZohoLead[]>([])
  const [crmDeals, setCrmDeals]       = useState<ZohoDeal[]>([])
  const [crmContacts, setCrmContacts] = useState<ZohoContact[]>([])
  const [crmStats, setCrmStats]       = useState<ZohoStats | null>(null)
  const [crmConnected, setCrmConnected] = useState<boolean | null>(null)

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

  const loadCRM = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/zoho/data')
      if (res.status === 401) { setCrmConnected(false); setLoading(false); return }
      const data = await res.json()
      if (data.error) { setCrmConnected(false); setLoading(false); return }
      setCrmConnected(true)
      setCrmLeads(data.leads ?? [])
      setCrmDeals(data.deals ?? [])
      setCrmContacts(data.contacts ?? [])
      setCrmStats(data.stats ?? null)
    } catch { setCrmConnected(false) }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isAdmin) return
    if (tab === 'users') loadUsers()
    else if (tab === 'subscriptions') loadSubs()
    else if (tab === 'analytics') loadAnalytics()
    else if (tab === 'config') loadConfigs()
    else if (tab === 'crm') loadCRM()
  }, [tab, isAdmin, loadUsers, loadSubs, loadAnalytics, loadConfigs, loadCRM])

  // ── User Actions ──
  const changeOwnPassword = async () => {
    if (!supabase || !user?.email) return
    if (!ownCurrentPw) { flash('Digite a senha atual.'); return }
    if (ownPw.length < 6) { flash('Nova senha mínimo 6 caracteres.'); return }
    // Verify current password first
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email: user.email, password: ownCurrentPw })
    if (signInErr) { flash('Senha atual incorreta.'); return }
    const { error } = await supabase.auth.updateUser({ password: ownPw })
    if (error) { flash('Erro ao alterar: ' + error.message); return }
    setOwnCurrentPw(''); setShowOwnCurrentPw(false)
    setOwnPw(''); setShowOwnPw(false)
    flash('Senha alterada com sucesso.')
  }
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

  // Exclude admin accounts from all stats
  const nonAdminProfiles = allProfiles.filter(p => {
    const u = users.find(u => u.id === p.id)
    return !u || u.role !== 'admin'
  })
  const nonAdminSubs = subs.filter(s => {
    const u = users.find(u => u.id === s.user_id)
    return !u || u.role !== 'admin'
  })

  const totalUsers = nonAdminProfiles.length
  const activeToday = nonAdminProfiles.filter(p => p.last_login && (now - new Date(p.last_login).getTime()) < DAY).length
  const activeWeek = nonAdminProfiles.filter(p => p.last_login && (now - new Date(p.last_login).getTime()) < DAY * 7).length
  const activeMonth = nonAdminProfiles.filter(p => p.last_login && (now - new Date(p.last_login).getTime()) < DAY * 30).length

  // Signups per day (last 30 days) — non-admin only
  const signupsByDay = useMemo(() => {
    const days: Record<string, number> = {}
    for (let i = 29; i >= 0; i--) { const d = new Date(now - i * DAY).toISOString().slice(0, 10); days[d] = 0 }
    nonAdminProfiles.forEach((p: { created_at: string }) => { const d = p.created_at.slice(0, 10); if (days[d] !== undefined) days[d]++ })
    return Object.entries(days).map(([date, count]) => ({ date: date.slice(5), count }))
  }, [nonAdminProfiles, now])

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
  const churnRate = nonAdminSubs.length > 0 ? Math.round((nonAdminSubs.filter((s: SubRow) => s.status === 'cancelled').length / nonAdminSubs.length) * 100) : 0

  // Sub distribution for pie — non-admin only
  const subDistribution = useMemo(() => {
    const c: Record<string, number> = { active: 0, trial: 0, cancelled: 0, overdue: 0, expired: 0 }
    nonAdminSubs.forEach((s: SubRow) => { c[s.status] = (c[s.status] || 0) + 1 })
    return Object.entries(c).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }))
  }, [nonAdminSubs])

  // Modo Fundador: early stage (< 10 real users) — forward-looking view
  const isModoFundador = totalUsers < 10

  // ── Fase auto-detectada (espelha StrategicPanel) ──
  const faseDetectada = useMemo(() => {
    if (totalUsers >= 1000 && retention30d >= 40) return 'escala'
    if (totalUsers >= 100 && retention30d >= 40) return 'crescimento'
    if (activeWeek >= 10 && retention7d >= 30) return 'pmf'
    return 'validacao'
  }, [totalUsers, activeWeek, retention7d, retention30d])

  // ── Insights IA — multi-dimensional, estratégicos, fase-aware ──
  const insights = useMemo(() => {
    type Insight = { prioridade: 'critica' | 'alta' | 'media'; dimensao: string; texto: string }
    const list: Insight[] = []

    // 1. FASE — diagnóstico atual
    const faseLabel = faseDetectada === 'validacao' ? 'Validação' : faseDetectada === 'pmf' ? 'PMF' : faseDetectada === 'crescimento' ? 'Crescimento' : 'Escala'
    list.push({ prioridade: 'alta', dimensao: 'Fase', texto: `SEA está na fase de ${faseLabel}. ${faseDetectada === 'validacao' ? 'Prioridade máxima: validar o problema real com entrevistas e conseguir os primeiros 10 usuários ativos recorrentes.' : faseDetectada === 'pmf' ? `${activeWeek} usuários ativos/semana · Retenção 7d: ${retention7d}%. Foco: reter, não adquirir. PMF se confirma quando usuários voltam sem push.` : faseDetectada === 'crescimento' ? `${totalUsers} usuários. Foco: canal de aquisição escalável + primeiros R$1.000 de MRR.` : `${totalUsers} usuários. Foco: automação de growth loops e redução de churn.`}` })

    // 2. CRESCIMENTO — velocidade
    if (totalUsers === 0) {
      list.push({ prioridade: 'critica', dimensao: 'Aquisição', texto: 'Zero usuários reais cadastrados. Ação imediata: abordar 5 fisioterapeutas intensivistas pessoalmente esta semana. Sem usuários não há produto — há uma ideia.' })
    } else if (totalUsers < 10) {
      list.push({ prioridade: 'critica', dimensao: 'Aquisição', texto: `${totalUsers} usuário(s) cadastrado(s). Em fase de Validação, qualidade de feedback > quantidade. Converse com todos esta semana. O que estão usando? O que trava? O que falta?` })
    } else if (totalUsers < 50) {
      list.push({ prioridade: 'alta', dimensao: 'Aquisição', texto: `${totalUsers} usuários. Meta próxima: 50 usuários antes de escalar marketing. Crescimento orgânico agora = word-of-mouth = sinal de PMF real.` })
    }

    // 3. RETENÇÃO — coração do produto
    if (totalUsers > 5) {
      if (retention7d < 20) {
        list.push({ prioridade: 'critica', dimensao: 'Retenção', texto: `Retenção 7 dias em ${retention7d}% — crítico. Usuários chegam mas não voltam. Problema: onboarding fraco, valor não percebido no primeiro uso, ou mercado ainda não pronto. Investigar com entrevistas de churn.` })
      } else if (retention7d < 40) {
        list.push({ prioridade: 'alta', dimensao: 'Retenção', texto: `Retenção 7 dias em ${retention7d}% (benchmark SaaS saudável: >40%). Identificar o momento "aha" do SEA e encurtar o tempo até ele acontecer no onboarding.` })
      } else {
        list.push({ prioridade: 'media', dimensao: 'Retenção', texto: `Retenção 7 dias em ${retention7d}% — saudável. Foco em aprofundar engajamento: quantas features core cada usuário usa por sessão?` })
      }
    }

    // 4. FEATURES — onde está o valor
    const topEvent = eventCounts[0]
    const prontuarioE = eventCounts.find((e: { event: string; count: number }) => e.event.toLowerCase().includes('prontuario'))
    const calcE = eventCounts.find((e: { event: string; count: number }) => e.event.toLowerCase().includes('calc'))
    const simE = eventCounts.find((e: { event: string; count: number }) => e.event.toLowerCase().includes('sim'))
    if (topEvent) {
      list.push({ prioridade: 'media', dimensao: 'Engajamento', texto: `Feature mais usada: "${topEvent.event}" (${topEvent.count} interações). ${prontuarioE && prontuarioE.event === topEvent.event ? 'Prontuário é o core. Priorize melhorias nele — é onde o usuário passa mais tempo.' : 'Analise por que esta feature domina e se ela está conectada ao core value do SEA.'}` })
    }
    if (prontuarioE && calcE && prontuarioE.count > calcE.count * 3) {
      list.push({ prioridade: 'media', dimensao: 'Produto', texto: `Prontuário (${prontuarioE.count} usos) domina sobre Calculadoras (${calcE.count}). Sinal: usuário enxerga o SEA como ferramenta de documentação clínica, não só estudo. Considere expandir prontuário (setores, exportação, histórico longitudinal).` })
    }
    if (simE && simE.count > 0) {
      list.push({ prioridade: 'media', dimensao: 'Produto', texto: `Simulações usadas ${simE.count} vezes. Se for feature premium, pode ser gatilho de conversão. Se for free, avaliar se está gerando engajamento suficiente para justificar custo de manutenção.` })
    }

    // 5. NPS — qualidade da experiência
    if (eventCounts.length === 0 && totalUsers > 0) {
      list.push({ prioridade: 'alta', dimensao: 'NPS', texto: 'Nenhum NPS coletado ainda. Com usuários ativos, ative a coleta de NPS — é o indicador mais preditivo de crescimento orgânico.' })
    }

    // 6. MONETIZAÇÃO
    if (totalUsers > 10 && nonAdminSubs.length === 0) {
      list.push({ prioridade: 'alta', dimensao: 'Monetização', texto: `${totalUsers} usuários sem nenhuma assinatura registrada. Defina o modelo de precificação agora. Early adopters têm maior tolerância a preço e menor exigência de perfeição — o melhor momento para testar pricing é agora.` })
    } else if (nonAdminSubs.length > 0 && churnRate > 20) {
      list.push({ prioridade: 'alta', dimensao: 'Churn', texto: `Churn em ${churnRate}% — elevado. Para cada usuário cancelando, o CAC já foi pago e o LTV está sendo destruído. Implemente email automatizado pós-cancelamento pedindo o motivo real.` })
    }

    // 7. ATIVIDADE — sinais de engajamento
    if (activeToday === 0 && totalUsers > 5) {
      list.push({ prioridade: 'media', dimensao: 'Ativação', texto: 'Nenhum usuário ativo hoje. Oportunidade: envie notificação de reengajamento personalizada com um insight clínico novo ou lembrete de funcionalidade subusada.' })
    }

    if (list.length === 0) {
      list.push({ prioridade: 'media', dimensao: 'Dados', texto: 'Poucos dados para insights profundos. Analytics se torna mais poderoso conforme usuários interagem. Prioridade: conseguir os primeiros 10 usuários ativos para ter padrões reais.' })
    }

    return list
  }, [faseDetectada, totalUsers, activeWeek, activeToday, retention7d, retention30d, churnRate, eventCounts, nonAdminSubs.length])

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
    { id: 'estrategia', label: 'Estrategia', icon: Target },
    { id: 'crm', label: 'CRM Zoho', icon: Building2 },
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
                    {u.id === user?.id && (
                      <div className="space-y-1">
                        <p className="text-[6px] uppercase tracking-[0.1em] text-white/30">Alterar senha (conta própria)</p>
                        {/* Senha atual */}
                        <div className="relative">
                          <input
                            className={inputClass}
                            type={showOwnCurrentPw ? 'text' : 'password'}
                            placeholder="Senha atual"
                            value={ownCurrentPw}
                            onChange={(e) => setOwnCurrentPw(e.target.value)}
                          />
                          <button type="button" onClick={() => setShowOwnCurrentPw(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                            {showOwnCurrentPw ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </button>
                        </div>
                        {/* Nova senha + botão */}
                        <div className="flex gap-1">
                          <div className="relative flex-1">
                            <input
                              className={inputClass}
                              type={showOwnPw ? 'text' : 'password'}
                              placeholder="Nova senha (mín. 6 caracteres)"
                              value={ownPw}
                              onChange={(e) => setOwnPw(e.target.value)}
                            />
                            <button type="button" onClick={() => setShowOwnPw(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                              {showOwnPw ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </button>
                          </div>
                          <button
                            onClick={changeOwnPassword}
                            disabled={!ownCurrentPw || ownPw.length < 6}
                            className="flex h-7 shrink-0 items-center gap-1 rounded-[0.4rem] border border-[#60a5fa20] bg-[#60a5fa08] px-2 text-[7px] text-[#60a5fa] disabled:opacity-30"
                          >
                            <Key className="h-2.5 w-2.5" /> Alterar
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-1">
                      <button onClick={() => saveUserEdit(u.id)} className="flex h-6 items-center gap-1 rounded-[0.4rem] border border-[#4ade8020] bg-[#4ade8008] px-2 text-[7px] text-[#4ade80]"><Save className="h-2.5 w-2.5" /> Salvar</button>
                      <button onClick={() => { setEditingUser(null); setOwnPw(''); setShowOwnPw(false) }} className="flex h-6 items-center gap-1 rounded-[0.4rem] border border-white/10 px-2 text-[7px] text-white/40"><X className="h-2.5 w-2.5" /> Cancelar</button>
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
          <p className="text-[6px] text-white/25">Conta admin excluída das estatísticas</p>
          <div className="grid grid-cols-5 gap-1">
            {[{ l: 'Total', v: nonAdminSubs.length, c: '#60a5fa' }, { l: 'Ativos', v: nonAdminSubs.filter((s: SubRow) => s.status === 'active').length, c: '#4ade80' }, { l: 'Trial', v: nonAdminSubs.filter((s: SubRow) => s.status === 'trial').length, c: '#facc15' }, { l: 'Cancel.', v: nonAdminSubs.filter((s: SubRow) => s.status === 'cancelled').length, c: '#fb923c' }, { l: 'Devendo', v: nonAdminSubs.filter((s: SubRow) => s.status === 'overdue').length, c: '#f87171' }].map((s) => (
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
          {nonAdminSubs.length === 0 && <p className="text-center text-[7px] text-white/30 py-4">Nenhuma assinatura de usuário registrada.</p>}
          {subs.filter((s: SubRow) => { const u = users.find(u => u.id === s.user_id); return !u || u.role !== 'admin' }).map((s: SubRow) => { const up = users.find(u => u.id === s.user_id); return (
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

          {/* Modo Fundador banner */}
          {isModoFundador && (
            <div className="rounded-[0.8rem] border border-white/8 bg-white/[0.02] px-3 py-2.5">
              <div className="mb-1 flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-white/50" />
                <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-white/50">Modo Fundador Ativo · Fase {faseDetectada === 'validacao' ? 'Validação' : faseDetectada === 'pmf' ? 'PMF' : 'Crescimento'}</p>
              </div>
              <p className="text-[7px] leading-relaxed text-white/35">Com {totalUsers} usuário(s) real(is), os dados ainda não revelam padrões estatísticos. Analytics se torna poderoso a partir de 30+ usuários. Abaixo você vê as métricas reais disponíveis e as metas que definem a próxima fase.</p>
              <div className="mt-2 grid grid-cols-3 gap-1">
                {[
                  { l: 'Meta usuários', v: '10 ativos/sem', ok: activeWeek >= 10 },
                  { l: 'Meta retenção', v: 'Ret 7d > 30%', ok: retention7d >= 30 },
                  { l: 'Meta NPS', v: 'NPS > 0', ok: false },
                ].map(m => (
                  <div key={m.l} className={`rounded-[0.5rem] border px-2 py-1.5 text-center ${m.ok ? 'border-white/15 bg-white/[0.04]' : 'border-white/5'}`}>
                    {m.ok ? <CheckCircle2 className="mx-auto mb-0.5 h-3 w-3 text-white/60" /> : <AlertTriangle className="mx-auto mb-0.5 h-3 w-3 text-white/20" />}
                    <p className="text-[7px] font-semibold text-white/50">{m.v}</p>
                    <p className="text-[6px] text-white/25">{m.l}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KPIs — non-admin only */}
          <div>
            <p className="mb-1 text-[6px] uppercase tracking-[0.1em] text-white/25">Usuários reais (admin excluído)</p>
            <div className="grid grid-cols-4 gap-1">
              {[{ l: 'Total', v: totalUsers, c: '#60a5fa' }, { l: 'Hoje', v: activeToday, c: '#4ade80' }, { l: 'Semana', v: activeWeek, c: '#facc15' }, { l: 'Mês', v: activeMonth, c: '#fb923c' }].map((s) => (
                <div key={s.l} className="rounded-[0.5rem] border border-white/6 bg-black/20 px-1 py-2 text-center"><p className="text-[12px] font-bold" style={{ color: s.c }}>{s.v}</p><p className="text-[5px] text-white/30">{s.l}</p></div>
              ))}
            </div>
          </div>

          {/* Retention + Churn */}
          <div className="grid grid-cols-3 gap-1">
            <div className="rounded-[0.5rem] border border-white/6 bg-black/20 px-2 py-1.5 text-center">
              <p className={`text-[10px] font-bold ${retention7d >= 40 ? 'text-[#4ade80]' : retention7d >= 20 ? 'text-[#facc15]' : 'text-[#f87171]'}`}>{retention7d}%</p>
              <p className="text-[5px] text-white/30">Ret. 7d · meta &gt;40%</p>
            </div>
            <div className="rounded-[0.5rem] border border-white/6 bg-black/20 px-2 py-1.5 text-center">
              <p className={`text-[10px] font-bold ${retention30d >= 40 ? 'text-[#4ade80]' : retention30d >= 20 ? 'text-[#facc15]' : 'text-[#f87171]'}`}>{retention30d}%</p>
              <p className="text-[5px] text-white/30">Ret. 30d · meta &gt;40%</p>
            </div>
            <div className="rounded-[0.5rem] border border-white/6 bg-black/20 px-2 py-1.5 text-center">
              <p className={`text-[10px] font-bold ${churnRate < 5 ? 'text-[#4ade80]' : churnRate < 20 ? 'text-[#facc15]' : 'text-[#f87171]'}`}>{churnRate}%</p>
              <p className="text-[5px] text-white/30">Churn · meta &lt;5%</p>
            </div>
          </div>

          {/* Signup chart */}
          <div>
            <p className="mb-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/30">Novos usuários (30 dias)</p>
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
            {eventCounts.length === 0 ? <p className="py-2 text-[7px] text-white/20">Nenhum evento registrado ainda.</p> : (
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

          {/* IA Insights — multi-dimensional */}
          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <Brain className="h-3 w-3 text-white/50" />
              <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-white/50">Insights IA · {insights.length} análises</p>
              <span className="rounded-full border border-white/8 px-1.5 py-0.5 text-[6px] text-white/30">Fase: {faseDetectada}</span>
            </div>
            <div className="space-y-1.5">
              {insights.map((insight, i) => {
                const borderColor = insight.prioridade === 'critica' ? 'border-[#f8717120]' : insight.prioridade === 'alta' ? 'border-white/10' : 'border-white/5'
                const dotColor   = insight.prioridade === 'critica' ? 'bg-[#f87171]' : insight.prioridade === 'alta' ? 'bg-white/60' : 'bg-white/25'
                return (
                  <div key={i} className={`rounded-[0.6rem] border ${borderColor} bg-white/[0.02] px-3 py-2`}>
                    <div className="mb-0.5 flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`} />
                      <span className="text-[6px] font-bold uppercase tracking-[0.12em] text-white/35">{insight.dimensao}</span>
                      {insight.prioridade === 'critica' && <span className="rounded-full border border-[#f8717120] px-1 text-[5px] font-bold uppercase text-[#f87171]/70">Crítico</span>}
                    </div>
                    <p className="text-[7px] leading-relaxed text-white/50">{insight.texto}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <button onClick={loadAnalytics} className="flex items-center gap-1 text-[7px] text-white/30 hover:text-white/50"><RefreshCw className="h-2.5 w-2.5" /> Atualizar dados</button>
        </div>
      )}

      {/* ══════ COMMUNICATION ══════ */}
      {tab === 'communication' && !loading && (
        <div className="space-y-2">
          {/* Como funciona */}
          <div className="rounded-[0.8rem] border border-white/6 bg-white/[0.02] px-3 py-3">
            <div className="mb-2 flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-white/40" />
              <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-white/40">Como funciona</p>
            </div>
            <div className="space-y-1.5 text-[7px] leading-relaxed text-white/35">
              <p>· Você escreve título e mensagem aqui e escolhe o público-alvo (Todos, Ativos ou Trial).</p>
              <p>· A notificação é inserida na tabela <span className="font-mono text-white/50">notifications</span> do Supabase para cada usuário do grupo selecionado.</p>
              <p>· Usuários que têm <span className="font-mono text-white/50">notifications_enabled = true</span> no perfil recebem em tempo real via Supabase Realtime — o sininho no topo fica com badge.</p>
              <p>· Usuários com notificações desativadas <span className="text-white/45">não recebem</span> — a inserção não ocorre para eles.</p>
              <p>· Use para: avisos de atualização, novos conteúdos, convites para feedback, alerta de manutenção.</p>
            </div>
          </div>
          <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-white/30">Enviar notificação</p>
          <input className={inputClass} placeholder="Titulo" value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)} />
          <textarea className={`${inputClass} h-16 resize-none py-1.5`} placeholder="Mensagem..." value={notifBody} onChange={(e) => setNotifBody(e.target.value)} />
          <div className="flex gap-1">
            {(['all', 'active', 'trial'] as const).map((t) => (<button key={t} onClick={() => setNotifTarget(t)} className={`rounded-full border px-2 py-0.5 text-[7px] font-semibold ${chip(notifTarget === t)}`}>{t === 'all' ? 'Todos' : t === 'active' ? 'Ativos' : 'Trial'}</button>))}
          </div>
          <button onClick={sendNotification} disabled={!notifTitle || !notifBody} className="flex items-center gap-1 rounded-[0.5rem] border border-[#a78bfa30] bg-[#a78bfa10] px-3 py-1.5 text-[8px] font-semibold text-[#a78bfa] disabled:opacity-30"><Send className="h-3 w-3" /> Enviar</button>
          {notifSent && <p className="text-[7px] text-[#4ade80]">Enviado.</p>}
        </div>
      )}

      {/* ══════ ESTRATEGIA ══════ */}
      {tab === 'estrategia' && !loading && <StrategicPanel />}

      {/* ══════ CRM ZOHO ══════ */}
      {tab === 'crm' && !loading && (
        <div className="space-y-3">
          {crmConnected === false ? (
            <div className="rounded-[1rem] border border-white/8 bg-white/[0.02] p-6 text-center space-y-3">
              <Building2 className="mx-auto h-8 w-8 text-white/15" />
              <p className="text-[9px] font-semibold text-white/50">Zoho CRM não conectado</p>
              <p className="text-[8px] text-white/30">Clique abaixo para autorizar o SEA a ler seu CRM</p>
              <a href="/api/zoho/auth" className="inline-flex items-center gap-2 rounded-[0.6rem] border border-white/15 bg-white/[0.05] px-4 py-2 text-[9px] text-white/70 hover:text-white/90">
                <Building2 className="h-3.5 w-3.5" /> Conectar Zoho CRM
              </a>
            </div>
          ) : (
            <>
              {/* Stats */}
              {crmStats && (
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { l: 'Leads', v: crmStats.totalLeads, c: '#60a5fa' },
                    { l: 'Contatos', v: crmStats.totalContacts, c: '#4ade80' },
                    { l: 'Negócios', v: crmStats.totalDeals, c: '#facc15' },
                    { l: 'Pipeline', v: `R$${(crmStats.totalPipeline/1000).toFixed(0)}k`, c: '#a78bfa' },
                  ].map(s => (
                    <div key={s.l} className="rounded-[0.6rem] border border-white/6 bg-black/20 px-2 py-2 text-center">
                      <p className="text-[13px] font-bold tabular-nums" style={{ color: s.c }}>{s.v}</p>
                      <p className="text-[6px] text-white/30">{s.l}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Funil de negócios */}
              {crmStats && Object.keys(crmStats.dealsByStage).length > 0 && (
                <div className="rounded-[0.8rem] border border-white/6 bg-white/[0.02] p-3">
                  <p className="mb-2 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/35">Funil de negócios</p>
                  <div className="space-y-1">
                    {Object.entries(crmStats.dealsByStage).map(([stage, count]) => (
                      <div key={stage} className="flex items-center gap-2">
                        <p className="w-32 shrink-0 truncate text-[8px] text-white/50">{stage}</p>
                        <div className="flex-1 rounded-full bg-white/5 h-1.5">
                          <div className="h-1.5 rounded-full bg-white/30" style={{ width: `${Math.min((count / Math.max(...Object.values(crmStats.dealsByStage))) * 100, 100)}%` }} />
                        </div>
                        <span className="text-[8px] font-bold text-white/50">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status dos leads */}
              {crmStats && Object.keys(crmStats.leadsByStatus).length > 0 && (
                <div className="rounded-[0.8rem] border border-white/6 bg-white/[0.02] p-3">
                  <p className="mb-2 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/35">Status dos leads</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(crmStats.leadsByStatus).map(([status, count]) => (
                      <div key={status} className="rounded-full border border-white/8 px-2 py-1 text-[7px] text-white/50">
                        {status} <span className="font-bold text-white/70">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leads recentes */}
              {crmLeads.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/30">Leads recentes</p>
                  <div className="space-y-1">
                    {crmLeads.slice(0, 8).map(lead => (
                      <div key={lead.id} className="flex items-center gap-2 rounded-[0.5rem] border border-white/5 bg-white/[0.02] px-2.5 py-1.5">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-[8px] font-bold text-white/30">
                          {(lead.First_Name?.[0] ?? lead.Last_Name?.[0] ?? '?').toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[8px] font-semibold text-white/70">{lead.First_Name} {lead.Last_Name}</p>
                          <p className="truncate text-[6px] text-white/30">{lead.Email}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-[6px] text-white/30">{lead.Lead_Status || '—'}</p>
                          <p className="text-[6px] text-white/20">{lead.Lead_Source || ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Negócios abertos */}
              {crmDeals.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/30">Negócios em andamento</p>
                  <div className="space-y-1">
                    {crmDeals.slice(0, 6).map(deal => (
                      <div key={deal.id} className="flex items-center gap-2 rounded-[0.5rem] border border-white/5 bg-white/[0.02] px-2.5 py-1.5">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[8px] font-semibold text-white/70">{deal.Deal_Name}</p>
                          <p className="text-[6px] text-white/30">{deal.Stage}</p>
                        </div>
                        <p className="shrink-0 text-[9px] font-bold text-white/55">
                          {deal.Amount ? `R$${Number(deal.Amount).toLocaleString('pt-BR')}` : '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button onClick={loadCRM} className="flex items-center gap-1 text-[7px] text-white/30 hover:text-white/55">
                  <RefreshCw className="h-2.5 w-2.5" /> Atualizar CRM
                </button>
                <p className="text-[6px] text-white/20">Zoho CRM conectado</p>
              </div>
            </>
          )}
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
