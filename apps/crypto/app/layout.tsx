import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crypto Intelligence | ZYPERIA',
  description: 'Master cryptocurrency, blockchain & DeFi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="m-0 p-0 bg-white text-gray-900 font-sans" style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}}>
        {children}
      </body>
    </html>
  )
}
