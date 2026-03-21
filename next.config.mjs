import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

// Ativado com: CAPACITOR_BUILD=true npm run build:cap
// Gera pasta out/ para embutir no app iOS (funciona fora de casa, sem servidor)
const isCapacitorBuild = process.env.CAPACITOR_BUILD === 'true'

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,

  allowedDevOrigins: ['192.168.18.9', '127.0.0.1', 'localhost'],

  compress: true,
  productionBrowserSourceMaps: false,

  // Modo export estático para Capacitor — pasta out/ embutida no iOS
  ...(isCapacitorBuild && {
    output: 'export',
    trailingSlash: true,
  }),

  // Keep heavy server-only packages OUT of the browser bundle
  serverExternalPackages: [
    '@pinecone-database/pinecone',
    '@launchdarkly/node-server-sdk',
    '@huggingface/transformers',
    'bull',
    'y-websocket',
    'yjs',
  ],

  experimental: {
    // Tree-shake large UI packages — only import what's used
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'recharts',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
    ],
  },

  // Cache GLB 3D models e assets estáticos (apenas no modo servidor)
  ...(!isCapacitorBuild && {
    async headers() {
      return [
        {
          source: '/:file*.glb',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          ],
        },
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
          ],
        },
      ]
    },
  }),
}

export default withBundleAnalyzer(nextConfig)
