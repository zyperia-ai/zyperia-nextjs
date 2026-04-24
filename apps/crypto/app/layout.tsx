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
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZYPERIA Crypto — Intelligence for the Digital Asset Era",
  description:
    "Deep crypto research, signal over noise. Daily insights on Bitcoin, Ethereum, DeFi, and the infrastructure reshaping finance.",
  openGraph: {
    title: "ZYPERIA Crypto",
    description:
      "Deep crypto research, signal over noise. Daily insights on Bitcoin, Ethereum, DeFi, and the infrastructure reshaping finance.",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZYPERIA Crypto",
    description: "Deep crypto research, signal over noise.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-[#070707] text-white">
        {children}
      </body>
    </html>
  );
}
