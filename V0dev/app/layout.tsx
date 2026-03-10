import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'SEA - Sistema de Estudo Avancado',
  description: 'Plataforma imersiva de aprendizado com simulacoes avancadas em Fisioterapia, Marketing, Branding e Neurociencia.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon.svg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark bg-[#0a0a0a]">
      <body className={`${poppins.variable} font-sans antialiased bg-[#0a0a0a] text-white min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
