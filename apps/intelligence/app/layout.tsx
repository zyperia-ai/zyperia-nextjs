import type { Metadata } from 'next';
import Header from '@zyperia/shared-ui/components/Header';
import Footer from '@zyperia/shared-ui/components/Footer';

export const metadata: Metadata = {
  title: 'Intelligence | ZYPERIA — AI & Business Automation',
  description:
    'Master AI tools and business automation. Learn Claude, ChatGPT, automation platforms to save time and grow.',
  openGraph: {
    title: 'Intelligence | ZYPERIA',
    description: 'Practical guides to AI and business automation',
    type: 'website',
  },
};

export default function IntelligenceLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-white text-gray-900 font-sans antialiased">
        <div className="flex flex-col min-h-screen">
          <Header blogName="Intelligence" blogIcon="🧠" isDark={false} />

          <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">{children}</main>

          <Footer
            blogName="Intelligence"
            isDark={false}
            affiliateDisclosure="We earn affiliate commissions from tool recommendations. This supports our free content."
          />
        </div>
      </body>
    </html>
  );
}
