import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fashion UGC Generator - AI-Powered Image Enhancement',
  description: 'Enhance fashion images and create UGC videos with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased bg-gradient-to-br from-fashion-light via-white to-pink-50">
        {children}
      </body>
    </html>
  )
}
