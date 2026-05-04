import type { Metadata } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import SiteNav from "@/components/SiteNav";

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
  title: "ZYPERIA Intelligence — IA & Automação para Operadores",
  description:
    "IA prática para quem gere e executa. Playbooks de automação, blueprints de workflows, e as ferramentas que realmente funcionam.",
  openGraph: {
    title: "ZYPERIA Intelligence",
    description: "IA prática para operadores.",
    images: ["/og-image.png"],
    type: "website",
    locale: "pt_PT",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZYPERIA Intelligence",
    description: "IA prática para operadores.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT" className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-[#070707] text-white">
        <SiteNav />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
