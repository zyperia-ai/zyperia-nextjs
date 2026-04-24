import type { Metadata } from 'next';
import EnhancedHeader from '@zyperia/shared-ui/components/EnhancedHeader';
import EnhancedFooter from '@zyperia/shared-ui/components/EnhancedFooter';

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
      <body className="bg-white text-slate-900 font-sans antialiased">
        <div className="flex flex-col min-h-screen">
          <EnhancedHeader blogName="Intelligence" blogIcon="🧠" theme="intelligence" isDark={false} />

          <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">{children}</main>

          <EnhancedFooter
            blogName="Intelligence"
            theme="intelligence"
            isDark={false}
            affiliateDisclosure="We earn affiliate commissions from tool recommendations. This supports our free content."
          />
        </div>
      </body>
    </html>
  );
}
