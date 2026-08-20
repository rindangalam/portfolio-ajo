import type { Metadata } from "next";
import { Suspense } from "react";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageBackground } from "@/components/page-background";
import { CustomCursor } from "@/components/custom-cursor";
import { ScrollProgress } from "@/components/scroll-progress";
import { getSocialLinks } from "@/lib/data";
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
  verification: {
    google: "i5Wga6kNdEUz4YPE9LLMAAoZYgQeSJbY5APksD5Q_Ns",
  },
};

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500"],
});

async function FooterWrapper() {
  let socialLinks: { platform: string; url: string }[] = [];
  try {
    socialLinks = await getSocialLinks();
  } catch {
    // fallback — render footer anyway
  }
  return <Footer socialLinks={socialLinks} />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-body antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-ssr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <CustomCursor />
        <Suspense fallback={<nav className="h-16 w-full" />}>
          <Navbar />
        </Suspense>
        <PageBackground />
        {children}
        <Suspense fallback={<footer className="relative z-10 border-t border-border/30 py-12" />}>
          <FooterWrapper />
        </Suspense>
      </body>
    </html>
  );
}