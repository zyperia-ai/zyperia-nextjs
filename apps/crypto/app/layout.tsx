import type { Metadata } from 'next';
import EnhancedHeader from '@zyperia/shared-ui/components/EnhancedHeader';
import EnhancedFooter from '@zyperia/shared-ui/components/EnhancedFooter';

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
        <meta name="theme-color" content="#030712" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-slate-950 text-slate-100 font-sans antialiased">
        <div className="flex flex-col min-h-screen">
          <EnhancedHeader blogName="Crypto" blogIcon="🪙" theme="crypto" isDark />

          <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">{children}</main>

          <EnhancedFooter
            blogName="Crypto"
            theme="crypto"
            isDark
            affiliateDisclosure="We may earn commissions from affiliate links. This helps us provide free educational content."
          />
        </div>
      </body>
    </html>
  );
}
