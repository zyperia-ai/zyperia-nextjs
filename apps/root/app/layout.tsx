import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZYPERIA — 3 Expert Blogs',
  description:
    'Expert content on Cryptocurrency, AI & Business Automation, and How to Earn Online.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
