import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Online Business Blog',
  description: 'Online business and entrepreneurship tips',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
