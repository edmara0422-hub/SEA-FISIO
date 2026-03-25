// URL base para chamadas de API
// Em dev: vazio (usa o servidor local Next.js)
// No Capacitor build estático: aponta para o servidor remoto
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''
