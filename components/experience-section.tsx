"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SectionReveal } from "@/components/section-reveal";
import { cn } from "@/lib/utils";

interface Experience {
  id: string;
  company: string;
  role: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function TimelineItem({ exp, index }: { exp: Experience; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative flex gap-6"
    >
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "h-3 w-3 rounded-full border-2",
            exp.is_current
              ? "border-accent bg-accent shadow-[0_0_12px_hsl(var(--accent)/0.5)]"
              : "border-border bg-card"
          )}
        >
          {exp.is_current && (
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent/30" />
          )}
        </div>
        <div className="w-px flex-1 bg-gradient-to-b from-primary/30 via-secondary/30 to-accent/30" />
      </div>

      <div className={cn("glass mb-6 flex-1 rounded-xl p-6 border-l-2 border-l-transparent", exp.is_current && "border-l-accent")}>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h3 className="font-display text-base font-bold text-gradient">
            {exp.role}
          </h3>
          {exp.is_current && (
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent">
              Current
            </span>
          )}
        </div>
        <p className="mb-2 font-mono text-xs text-primary">{exp.company}</p>
        <p className="mb-3 font-mono text-[10px] text-muted-foreground">
          {formatDate(exp.start_date)} — {exp.end_date ? formatDate(exp.end_date) : "Present"}
        </p>
        {exp.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {exp.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="relative px-5 py-20">
      <div className="mx-auto max-w-3xl">
        <SectionReveal>
          <div className="mb-12 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gradient">
              Experience
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/40" />
          </div>
        </SectionReveal>

        <div className="space-y-0">
          {experiences.map((exp, i) => (
            <TimelineItem key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
