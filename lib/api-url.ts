// URL base para chamadas de API
// Em dev: vazio (usa o servidor local Next.js)
// No Capacitor build estático: aponta para o servidor remoto
// No Capacitor (estático): aponta para Vercel. No browser normal: relativo.
const isCapacitor = typeof window !== 'undefined' && !!(window as unknown as Record<string, unknown>).Capacitor
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || (isCapacitor ? 'https://sea-fisio.vercel.app' : '')
