import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intelligence | ZYPERIA",
  description: "Automação de negócios com IA. ChatGPT, Claude, Gemini para produtividade. Guias práticos para makers e solopreneurs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="bg-white text-gray-900">
        <header className="border-b">
          <nav className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-purple-600">🧠 Intelligence</h1>
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
