import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Business | ZYPERIA",
  description: "Como ganhar dinheiro online. Side hustles, passive income, freelancing, negócios digitais. Guias completos e atualizados.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="bg-white text-gray-900">
        <header className="border-b">
          <nav className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-green-600">💰 Online Biz</h1>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t mt-12 py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
            <p>&copy; 2026 ZYPERIA. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
