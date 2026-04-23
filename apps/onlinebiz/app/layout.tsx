import type { Metadata } from 'next';
import Header from '@zyperia/shared-ui/components/Header';
import Footer from '@zyperia/shared-ui/components/Footer';

export const metadata: Metadata = {
  title: 'Earn Online | ZYPERIA — Make Money From Home',
  description:
    'Learn how to earn money online. Freelancing, side hustles, passive income, digital products. Real strategies that work in 2026.',
  openGraph: {
    title: 'Earn Online | ZYPERIA',
    description: 'Practical ways to make money from home',
    type: 'website',
  },
};

export default function OnlineBizLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-white text-gray-900 font-sans antialiased">
        <div className="flex flex-col min-h-screen">
          <Header blogName="Earn Online" blogIcon="💰" isDark={false} />

          <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">{children}</main>

          <Footer
            blogName="Earn Online"
            isDark={false}
            affiliateDisclosure="We recommend products we genuinely use. Affiliate commissions help us create free guides."
          />
        </div>
      </body>
    </html>
  );
}
