import type { Metadata } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZYPERIA — Rede Editorial Lusófona para o Mundo",
  description:
    "Jornalismo editorial autónomo sobre cripto, inteligência artificial e negócios digitais. Em português, para o mundo.",
  openGraph: {
    title: "ZYPERIA",
    description: "Rede Editorial Lusófona para o Mundo",
    images: ["/og-image.png"],
    type: "website",
    locale: "pt_PT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT" className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-[#070707] text-white">
        {children}
      </body>
    </html>
  );
}
