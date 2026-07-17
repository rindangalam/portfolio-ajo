import type { Metadata } from "next";
import { VT323, Inter, JetBrains_Mono } from "next/font/google";
import { CustomCursor } from "@/components/custom-cursor";
import { ScrollProgress } from "@/components/scroll-progress";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Rindang Alam Nur Muhammad — Fullstack Developer",
  description:
    "Fullstack developer specializing in connecting systems. Building with Next.js, Supabase, Python, and more.",
  icons: {
    icon: "/favicon",
  },
};

const vt323 = VT323({
  variable: "--font-vt323",
  display: "swap",
  subsets: ["latin"],
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${vt323.variable} ${inter.variable} ${jetbrainsMono.variable} font-body antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-ssr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <CustomCursor />
        <div className="crt-overlay pointer-events-none fixed inset-0 z-30" />
        {children}
      </body>
    </html>
  );
}
