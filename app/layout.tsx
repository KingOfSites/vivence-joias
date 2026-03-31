import React from "react"
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'

import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { WhatsAppFloatingButton } from '@/components/WhatsAppFloatingButton'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vivence Jóias | Joalheria Premium em Prata 925 e Ouro 18K',
  description: 'Explore nossa curadoria exclusiva em Prata 925 e Ouro 18K. Design que conta histórias, qualidade que atravessa gerações.',
  keywords: ['joias', 'prata 925', 'ouro 18k', 'joalheria premium', 'anéis', 'colares', 'brincos'],
}

export const viewport: Viewport = {
  themeColor: '#0F0F0F',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${playfair.variable} ${inter.variable}`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <WhatsAppFloatingButton />
            <Toaster />
          <SonnerToaster
            theme="dark"
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: 'var(--color-background-card)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              },
            }}
          />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
