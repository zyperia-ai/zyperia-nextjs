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
  title: "ZYPERIA OnlineBiz — Rendimento Online, Sem Rodeios",
  description:
    "Guias sem enchimento sobre rendimento online. Afiliados, produtos digitais, micro-SaaS, conteúdo, e os sistemas por trás do dinheiro.",
  openGraph: {
    title: "ZYPERIA OnlineBiz",
    description: "Rendimento online, sem rodeios.",
    images: ["/og-image.png"],
    type: "website",
    locale: "pt_PT",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZYPERIA OnlineBiz",
    description: "Rendimento online, sem rodeios.",
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
