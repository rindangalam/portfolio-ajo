"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StatsSectionProps {
  projectCount: number;
  skillCount: number;
  availableForHire: boolean;
  statusText: string;
  statusBusyText: string;
}

function AnimatedCounter({ value, label, delay }: { value: number; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="text-center">
      <div className="relative inline-block">
        <motion.span
          className="block font-display text-4xl font-bold text-gradient md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay }}
        >
          {isInView ? value : 0}
        </motion.span>
        <div className="pointer-events-none absolute -inset-4 rounded-full bg-primary/10 blur-2xl animate-glow-pulse" />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: delay + 0.3 }}
        className="mt-2 font-mono text-xs uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </motion.p>
    </div>
  );
}

export function StatsSection({ projectCount, skillCount, availableForHire, statusText, statusBusyText }: StatsSectionProps) {
  return (
    <section id="stats" className="relative px-5 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="retro-card rounded p-6">
            <AnimatedCounter value={projectCount} label="Projects" delay={0} />
          </div>
          <div className="retro-card rounded p-6">
            <AnimatedCounter value={skillCount} label="Skills" delay={0.1} />
          </div>
          <div className="retro-card rounded flex items-center justify-center p-6">
            <div className="text-center">
              <div className="relative inline-flex items-center gap-2">
                {availableForHire && (
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
                  </span>
                )}
                <span className="font-display text-lg font-bold text-accent">
                  {availableForHire ? statusText : statusBusyText}
                </span>
              </div>
              <p className="mt-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Status
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
