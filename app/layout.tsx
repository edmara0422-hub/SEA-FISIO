import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'SEA - Sistema de Estudo Avancado',
  description: 'Plataforma imersiva de aprendizado com simulacoes avancadas em Fisioterapia, Marketing, Branding e Neurociencia.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" style={{ background: '#010101', WebkitTextSizeAdjust: 'none', fontSize: '10px' }}>
      <body style={{ background: '#010101', fontSize: '10px' }}>
        {children}
      </body>
    </html>
  )
}
