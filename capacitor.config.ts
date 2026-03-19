import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.seafisio.app',
  appName: 'SEA Fisio',
  webDir: 'out',
  server: {
    // Dev mode: aponta pro servidor Next.js do Mac
    // O iPhone conectado via cabo acessa por este IP
    url: 'http://192.168.18.9:3000',
    cleartext: true,
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'SEA Fisio',
    allowsLinkPreview: false,
    scrollEnabled: true,
  },
};

export default config;
