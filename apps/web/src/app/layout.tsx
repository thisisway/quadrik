import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/providers'

export const metadata: Metadata = {
  title: 'Quadrik — Plataforma de Gestão para Esportes de Praia',
  description:
    'Gerencie sua arena, quadras, reservas, torneios e jogadores com o Quadrik.',
  openGraph: {
    title: 'Quadrik',
    description: 'Sua arena no controle. Sua comunidade em movimento.',
    siteName: 'Quadrik',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
