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
  title: "ZYPERIA Crypto — Análise da Era dos Activos Digitais",
  description:
    "Análise cripto em profundidade, sinal sem ruído. Insights diários sobre Bitcoin, Ethereum, DeFi, e a infraestrutura que está a redesenhar as finanças.",
  openGraph: {
    title: "ZYPERIA Crypto",
    description: "Análise cripto em profundidade, sinal sem ruído.",
    images: ["/og-image.png"],
    type: "website",
    locale: "pt_PT",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZYPERIA Crypto",
    description: "Análise cripto em profundidade, sinal sem ruído.",
    images: ["/og-image.png"],
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
