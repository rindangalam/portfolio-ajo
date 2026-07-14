"use client";

import { SectionReveal } from "@/components/section-reveal";

interface TechMarqueeProps {
  skills: { name: string; category: string }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  frontend: "border-primary/40 bg-primary/15 text-primary",
  backend: "border-secondary/40 bg-secondary/15 text-secondary",
  database: "border-accent/40 bg-accent/15 text-accent",
  devops: "border-cat-devops/40 bg-cat-devops/15 text-cat-devops",
  language: "border-cat-language/40 bg-cat-language/15 text-cat-language",
  other: "border-muted-foreground/30 bg-muted-foreground/10 text-muted-foreground",
};

export function TechMarquee({ skills }: TechMarqueeProps) {
  if (skills.length === 0) return null;

  const uniqueSkills = skills.filter(
    (skill, index, self) => index === self.findIndex((s) => s.name === skill.name)
  );

  const row1 = uniqueSkills.slice(0, Math.ceil(uniqueSkills.length / 2));
  const row2 = uniqueSkills.slice(Math.ceil(uniqueSkills.length / 2));

  return (
    <section className="relative overflow-hidden py-10">
      <SectionReveal>
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-secondary/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gradient">
            Tech Stack
          </span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-secondary/40" />
        </div>
      </SectionReveal>

      <div className="space-y-3">
        {/* Row 1 — scrolls left */}
        <div className="marquee-container">
          <div className="marquee-track marquee-left">
            {[...row1, ...row1].map((skill, i) => (
              <span
                key={`r1-${i}`}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs transition-all duration-300 hover:scale-105 hover:shadow-[0_0_12px_hsl(var(--secondary)/0.2)] ${CATEGORY_COLORS[skill.category] ?? CATEGORY_COLORS.other}`}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="marquee-container">
          <div className="marquee-track marquee-right">
            {[...row2, ...row2].map((skill, i) => (
              <span
                key={`r2-${i}`}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs transition-all duration-300 hover:scale-105 hover:shadow-[0_0_12px_hsl(var(--secondary)/0.2)] ${CATEGORY_COLORS[skill.category] ?? CATEGORY_COLORS.other}`}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
