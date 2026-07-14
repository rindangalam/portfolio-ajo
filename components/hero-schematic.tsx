"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, Download, Github, Linkedin, Twitter, Mail } from "lucide-react";
import { GradientMesh } from "@/components/gradient-mesh";
import { ParticleField } from "@/components/particle-field";
import { MagicText } from "@/components/magic-text";
import { HolographicIdCard } from "@/components/holographic-id-card";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: <Github className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
};

interface HeroSchematicProps {
  name: string | null;
  headline: string | null;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  availableForHire: boolean;
  socialLinks: { platform: string; url: string }[];
  resumeUrl: string | null;
}

export function HeroSchematic({
  name,
  headline,
  bio,
  avatarUrl,
  location,
  email,
  phone,
  availableForHire,
  socialLinks,
  resumeUrl,
}: HeroSchematicProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5"
    >
      <GradientMesh />
      <ParticleField particleCount={40} />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 text-center md:flex-row md:text-left"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Left — Text Content */}
        <div className="flex flex-1 flex-col items-center md:items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="font-mono text-xs text-secondary">Available for hire</span>
          </motion.div>

          <div className="mb-6">
            <MagicText
              text={name ?? "Rindang Alam Nur Muhammad"}
              as="h1"
              className="font-display text-5xl font-bold text-gradient-animated glow-text md:text-7xl lg:text-8xl"
              delay={0.5}
              staggerDelay={0.025}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="mx-auto mb-6 max-w-2xl font-display text-lg text-muted-foreground md:mx-0 md:text-xl"
          >
            {headline ?? "Fullstack Developer"}
            <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[-0.1em] bg-secondary" style={{ animation: "cursor-blink 1s step-end infinite" }} />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.0 }}
            className="mx-auto mb-6 flex items-center gap-3 md:mx-0"
          >
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all duration-300 hover:border-secondary/40 hover:bg-secondary/10 hover:text-secondary"
              >
                {SOCIAL_ICONS[link.platform] ?? (
                  <span className="font-mono text-[8px] uppercase">{link.platform.slice(0, 2)}</span>
                )}
              </a>
            ))}
          </motion.div>

          {bio && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.0 }}
              className="mx-auto mb-8 max-w-xl text-sm text-muted-foreground/80 md:mx-0"
            >
              {bio}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.2 }}
            className="flex items-center gap-4"
          >
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] px-6 py-3 font-display text-sm font-bold text-background transition-all hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:brightness-110 active:scale-[0.98]"
                style={{ animation: "gradient-shift 4s ease infinite" }}
              >
                <Download className="h-4 w-4" />
                Download CV
              </a>
            )}
            <a
              href="#stats"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-secondary"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
              <ArrowDown className="h-4 w-4 animate-float drop-shadow-[0_0_8px_hsl(var(--secondary)/0.5)]" />
            </a>
          </motion.div>
        </div>

        {/* Right — Holographic ID Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="shrink-0"
        >
          <HolographicIdCard
            name={name ?? "Rindang Alam Nur Muhammad"}
            headline={headline ?? "Fullstack Developer"}
            location={location ?? ""}
            email={email ?? ""}
            phone={phone ?? ""}
            avatarUrl={avatarUrl}
            availableForHire={availableForHire}
            socialLinks={socialLinks}
          />
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-48 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
}
