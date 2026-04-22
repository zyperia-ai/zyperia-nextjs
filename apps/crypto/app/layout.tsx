import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypto | ZYPERIA",
  description: "Guia completo sobre cryptocurrency, trading, DeFi, segurança. Educação prática sobre Bitcoin, Ethereum e blockchain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="bg-white text-gray-900 font-sans">
        <header className="border-b border-gray-200">
          <nav className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-blue-600">🪙 Crypto</h1>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 mt-12 py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
            <p>&copy; 2026 ZYPERIA. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
