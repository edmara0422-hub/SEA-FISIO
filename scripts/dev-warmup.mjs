/**
 * Pré-aquece as rotas principais após o servidor iniciar.
 * Roda automaticamente com `npm run dev`.
 */

const ROUTES = ['/sea', '/explore', '/explore/conteudos', '/explore/sistemas']
const BASE = 'http://127.0.0.1:3000'
const MAX_WAIT = 30000
const POLL = 800

async function waitForServer() {
  const start = Date.now()
  while (Date.now() - start < MAX_WAIT) {
    try {
      const res = await fetch(`${BASE}/sea`, { signal: AbortSignal.timeout(2000) })
      if (res.ok) return true
    } catch {}
    await new Promise(r => setTimeout(r, POLL))
  }
  return false
}

async function warmup() {
  console.log('[warmup] Aguardando servidor...')
  const ready = await waitForServer()
  if (!ready) { console.log('[warmup] Servidor não respondeu.'); return }

  console.log('[warmup] Servidor pronto. Pré-compilando rotas...')
  for (const route of ROUTES) {
    try {
      await fetch(`${BASE}${route}`, { signal: AbortSignal.timeout(15000) })
      console.log(`[warmup] ✓ ${route}`)
    } catch (e) {
      console.log(`[warmup] ✗ ${route}: ${e.message}`)
    }
  }
  console.log('[warmup] Concluído — app vai abrir rápido agora.')
}

warmup()
