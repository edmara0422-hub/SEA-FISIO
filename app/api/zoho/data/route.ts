import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ZOHO_TOKEN_URL = 'https://accounts.zoho.com/oauth/v2/token'
const ZOHO_API_BASE  = 'https://www.zohoapis.com/crm/v2'

async function getRefreshToken(): Promise<string | null> {
  // Priority: env var → Supabase app_config
  if (process.env.ZOHO_REFRESH_TOKEN) return process.env.ZOHO_REFRESH_TOKEN

  const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
  const supabaseService = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  if (!supabaseUrl || !supabaseService) return null

  const db = createClient(supabaseUrl, supabaseService)
  const { data } = await db.from('app_config').select('value').eq('key', 'zoho_refresh_token').single()
  return (data?.value as string) ?? null
}

async function getAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken()
  if (!refreshToken) return null

  const res = await fetch(ZOHO_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id:     process.env.ZOHO_CLIENT_ID     ?? '',
      client_secret: process.env.ZOHO_CLIENT_SECRET ?? '',
      grant_type:    'refresh_token',
    }),
  })

  const data = await res.json()
  return data.access_token ?? null
}

async function zohoGet(path: string, token: string) {
  const res = await fetch(`${ZOHO_API_BASE}${path}`, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  })
  if (!res.ok) return null
  return res.json()
}

export async function GET() {
  const token = await getAccessToken()
  if (!token) {
    return NextResponse.json({ error: 'Zoho não conectado. Acesse /api/zoho/auth para autorizar.' }, { status: 401 })
  }

  // Fetch in parallel: Leads, Contacts, Deals
  const [leadsR, contactsR, dealsR] = await Promise.all([
    zohoGet('/Leads?sort_by=Created_Time&sort_order=desc&per_page=20&fields=First_Name,Last_Name,Email,Lead_Source,Lead_Status,Created_Time,Phone,Company', token),
    zohoGet('/Contacts?sort_by=Created_Time&sort_order=desc&per_page=20&fields=First_Name,Last_Name,Email,Created_Time,Phone,Account_Name', token),
    zohoGet('/Deals?sort_by=Modified_Time&sort_order=desc&per_page=20&fields=Deal_Name,Stage,Amount,Closing_Date,Account_Name,Modified_Time', token),
  ])

  const leads    = leadsR?.data    ?? []
  const contacts = contactsR?.data ?? []
  const deals    = dealsR?.data    ?? []

  // Computed stats
  const dealsByStage: Record<string, number> = {}
  let totalPipeline = 0
  for (const d of deals) {
    dealsByStage[d.Stage] = (dealsByStage[d.Stage] ?? 0) + 1
    totalPipeline += Number(d.Amount ?? 0)
  }

  const leadsByStatus: Record<string, number> = {}
  for (const l of leads) {
    const s = l.Lead_Status ?? 'Sem status'
    leadsByStatus[s] = (leadsByStatus[s] ?? 0) + 1
  }

  return NextResponse.json({
    leads,
    contacts,
    deals,
    stats: {
      totalLeads:    leads.length,
      totalContacts: contacts.length,
      totalDeals:    deals.length,
      totalPipeline,
      dealsByStage,
      leadsByStatus,
    },
  })
}
