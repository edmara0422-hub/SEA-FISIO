import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const code  = req.nextUrl.searchParams.get('code')
  const error = req.nextUrl.searchParams.get('error')

  if (error || !code) {
    return new NextResponse(`
      <html><body style="font-family:monospace;background:#000;color:#fff;padding:2rem;">
        <h2 style="color:#f87171">Erro na autorização Zoho</h2>
        <p>${error ?? 'Código não recebido'}</p>
      </body></html>
    `, { headers: { 'Content-Type': 'text/html' } })
  }

  const clientId     = process.env.ZOHO_CLIENT_ID     ?? ''
  const clientSecret = process.env.ZOHO_CLIENT_SECRET ?? ''
  const redirectUri  = process.env.ZOHO_REDIRECT_URI  ?? 'https://sea-fisio.vercel.app/api/zoho/callback'

  // Exchange code for tokens
  const res = await fetch('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code, client_id: clientId, client_secret: clientSecret,
      redirect_uri: redirectUri, grant_type: 'authorization_code',
    }),
  })

  const tokens = await res.json()

  if (!tokens.refresh_token) {
    return new NextResponse(`
      <html><body style="font-family:monospace;background:#000;color:#fff;padding:2rem;">
        <h2 style="color:#f87171">Erro ao obter tokens</h2>
        <pre>${JSON.stringify(tokens, null, 2)}</pre>
      </body></html>
    `, { headers: { 'Content-Type': 'text/html' } })
  }

  // Save refresh_token in Supabase app_config (service role)
  const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL     ?? ''
  const supabaseService = process.env.SUPABASE_SERVICE_ROLE_KEY    ?? ''

  if (supabaseUrl && supabaseService) {
    const db = createClient(supabaseUrl, supabaseService)
    await db.from('app_config').upsert({
      key: 'zoho_refresh_token',
      value: tokens.refresh_token,
      updated_at: new Date().toISOString(),
    })
  }

  return new NextResponse(`
    <html><body style="font-family:monospace;background:#000;color:#fff;padding:2rem;max-width:600px;">
      <h2 style="color:#4ade80">✓ Zoho CRM conectado ao SEA FISIO</h2>
      <p style="color:#aaa">Refresh token salvo no Supabase. A integração já está ativa.</p>
      <p style="margin-top:1rem;color:#666;font-size:0.8rem;">
        Se o Supabase service role não estava configurado, adicione manualmente no Vercel:<br>
        <strong style="color:#fff">ZOHO_REFRESH_TOKEN</strong> =
        <code style="background:#111;padding:0.2rem 0.5rem;border-radius:4px;color:#4ade80;word-break:break-all">${tokens.refresh_token}</code>
      </p>
      <p style="margin-top:1rem;color:#666;font-size:0.8rem;">Você pode fechar esta janela e voltar ao Admin SEA.</p>
    </body></html>
  `, { headers: { 'Content-Type': 'text/html' } })
}
