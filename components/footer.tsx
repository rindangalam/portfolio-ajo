"use client";

import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";
import Link from "next/link";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: <Github className="h-3.5 w-3.5" />,
  linkedin: <Linkedin className="h-3.5 w-3.5" />,
  twitter: <Twitter className="h-3.5 w-3.5" />,
  email: <Mail className="h-3.5 w-3.5" />,
};

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

interface FooterProps {
  socialLinks: { platform: string; url: string }[];
}

export function Footer({ socialLinks }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-border/30 py-12">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <span className="font-mono text-[10px] text-muted-foreground">
            &copy; {new Date().getFullYear()} rindang alam nur muhammad
          </span>

          <nav aria-label="Footer" className="flex items-center gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={link.platform}
                className="flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-all duration-300 hover:bg-secondary/10 hover:text-secondary"
              >
                {SOCIAL_ICONS[link.platform] ?? (
                  <span className="font-mono text-[8px] uppercase">{link.platform.slice(0, 2)}</span>
                )}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowUp size={12} />
            Back to top
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 border-t border-border/30 pt-6">
          <Link
            href="/privacy"
            className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
          >
            privacy
          </Link>
          <span className="h-1 w-1 rounded-full bg-border" />
          <Link
            href="/terms"
            className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
          >
            terms
          </Link>
        </div>
      </div>
    </footer>
  );
}