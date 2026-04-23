import type { Metadata } from 'next';
import Header from '@zyperia/shared-ui/components/Header';
import Footer from '@zyperia/shared-ui/components/Footer';

export const metadata: Metadata = {
  title: 'Crypto | ZYPERIA — Bitcoin, Ethereum & DeFi Education',
  description:
    'Learn about cryptocurrency, Bitcoin, Ethereum, DeFi, trading, and blockchain security. Expert-reviewed, updated daily.',
  openGraph: {
    title: 'Crypto | ZYPERIA',
    description: 'The complete guide to cryptocurrency and blockchain',
    type: 'website',
  },
};

export default function CryptoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#1f2937" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-gray-900 text-gray-100 font-sans antialiased">
        <div className="flex flex-col min-h-screen">
          <Header blogName="Crypto" blogIcon="🪙" isDark />

          <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">{children}</main>

          <Footer
            blogName="Crypto"
            isDark
            affiliateDisclosure="We may earn commissions from affiliate links. This helps us provide free educational content."
          />
        </div>
      </body>
    </html>
  );
}
