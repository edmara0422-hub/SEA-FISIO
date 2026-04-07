import type { CapacitorConfig } from '@capacitor/cli';

// ─── MODOS DE USO ────────────────────────────────────────────────────────────
//
// DEV (rede local, cabo USB):
//   server.url aponta pro Mac. Funciona só no Wi-Fi de casa.
//   Comando: npm run dev  →  cabo USB  →  Xcode Run
//
// PRODUÇÃO (funciona em qualquer lugar, sem depender do Mac):
//   1. npm run build:cap        ← gera pasta out/ e sincroniza com iOS
//   2. Abre Xcode → Product → Run (ou Archive para distribuir)
//   O app fica embutido no iPhone. Funciona em qualquer rede ou dados móveis.
//   Obs: funcionalidades de IA (chat) ficam indisponíveis no modo estático.
//
// ─────────────────────────────────────────────────────────────────────────────

// true = usa arquivos embutidos no app (produção, funciona em qualquer lugar)
// false = carrega do servidor Next.js local (dev, só no Wi-Fi de casa)
const PRODUCTION_MODE = true;

const DEV_SERVER_URL = 'http://192.168.18.9:3000';
const VERCEL_URL = 'https://sea-fisio.vercel.app';

const config: CapacitorConfig = {
  appId: 'com.seafisio.app',
  appName: 'SEA Fisio',
  webDir: 'out',
  server: { url: VERCEL_URL },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'SEA Fisio',
    allowsLinkPreview: false,
    scrollEnabled: true,
  },
  plugins: {
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
