import { NextResponse } from 'next/server'

export async function GET() {
  const clientId    = process.env.ZOHO_CLIENT_ID
  const redirectUri = process.env.ZOHO_REDIRECT_URI ?? 'https://sea-fisio.vercel.app/api/zoho/callback'

  if (!clientId) {
    return NextResponse.json({ error: 'ZOHO_CLIENT_ID não configurado no Vercel' }, { status: 500 })
  }

  const params = new URLSearchParams({
    scope: 'ZohoCRM.modules.ALL,ZohoCRM.settings.READ',
    client_id: clientId,
    response_type: 'code',
    access_type: 'offline',
    redirect_uri: redirectUri,
  })

  const authUrl = `https://accounts.zoho.com/oauth/v2/auth?${params.toString()}`
  return NextResponse.redirect(authUrl)
}
