import type { CapacitorConfig } from '@capacitor/cli';

// ─── MODOS DE USO ────────────────────────────────────────────────────────────
//
// DEV (rede local, cabo USB):
//   Mantém server.url apontando pro Mac (IP local da rede de casa).
//   Funciona só conectado ao mesmo Wi-Fi que o Mac.
//
// PRODUÇÃO (fora de casa, sem depender do Mac):
//   1. Faça deploy no Vercel: `vercel --prod`  (ou `npx vercel`)
//   2. Troque server.url pela URL do Vercel (ex: https://sea-fisio.vercel.app)
//   3. npx cap sync ios → build no Xcode → instalar no iPhone
//   Assim o app funciona em qualquer lugar com internet.
//
// ─────────────────────────────────────────────────────────────────────────────

const DEV_SERVER_URL = 'http://192.168.18.9:3000';       // Mac na rede de casa
const PROD_SERVER_URL = '';                               // ← cole a URL Vercel aqui

const isProd = !!PROD_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.seafisio.app',
  appName: 'SEA Fisio',
  webDir: 'out',
  server: isProd
    ? { url: PROD_SERVER_URL, cleartext: false }
    : { url: DEV_SERVER_URL, cleartext: true },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'SEA Fisio',
    allowsLinkPreview: false,
    scrollEnabled: true,
  },
};

export default config;
