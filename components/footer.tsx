"use client";

import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";
import { SectionReveal } from "@/components/section-reveal";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: <Github className="h-3.5 w-3.5" />,
  linkedin: <Linkedin className="h-3.5 w-3.5" />,
  twitter: <Twitter className="h-3.5 w-3.5" />,
  email: <Mail className="h-3.5 w-3.5" />,
};

interface FooterProps {
  socialLinks: { platform: string; url: string }[];
}

export function Footer({ socialLinks }: FooterProps) {
  return (
    <footer className="relative z-10 border-t border-border/30 py-12">
      <div className="h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
      <div className="mx-auto max-w-5xl px-5">
        <SectionReveal>
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            {/* Copyright */}
            <span className="font-mono text-[10px] text-muted-foreground">
              &copy; {new Date().getFullYear()} rindang alam nur muhammad
            </span>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-all duration-300 hover:bg-secondary/10 hover:text-secondary"
                >
                  {SOCIAL_ICONS[link.platform] ?? (
                    <span className="font-mono text-[8px] uppercase">{link.platform.slice(0, 2)}</span>
                  )}
                </a>
              ))}
            </div>

            {/* Back to top */}
            <a
              href="#hero"
              className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowUp size={12} />
              Back to top
            </a>
          </div>
        </SectionReveal>
      </div>
    </footer>
  );
}
