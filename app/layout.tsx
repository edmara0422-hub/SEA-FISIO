import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SEA - Sistema de Estudo Avancado',
  description: 'Plataforma imersiva de aprendizado com simulacoes avancadas em Fisioterapia, Marketing, Branding e Neurociencia.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  )
}
