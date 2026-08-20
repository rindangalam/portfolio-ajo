"use client";

import { SectionReveal } from "@/components/section-reveal";
import { GlowCard } from "@/components/glow-card";

interface BentoAboutProps {
  aboutText: string | null;
  skills: {
    id: string;
    name: string;
    category: string;
    proficiency: number;
  }[];
}

const CATEGORY_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  devops: "DevOps",
  language: "Languages",
  other: "Other",
};

const CATEGORY_COLORS: Record<string, string> = {
  frontend: "hsl(82, 100%, 66%)",
  backend: "hsl(0, 0%, 62%)",
  database: "hsl(0, 0%, 72%)",
  devops: "hsl(0, 0%, 55%)",
  language: "hsl(0, 0%, 78%)",
  other: "hsl(0, 0%, 50%)",
};

export function BentoAbout({ aboutText, skills }: BentoAboutProps) {
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categories = Object.entries(grouped);

  return (
    <section id="about" className="relative px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {/* Bio — full-width card at top */}
          <SectionReveal className="col-span-2 md:col-span-4" direction="up">
            <GlowCard glowColor="hsl(0 0% 100%)" className="h-full" contentClassName="p-6 h-full">
              <h3 className="mb-3 font-display text-lg font-bold text-foreground">
                Who I Am
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {aboutText ?? "A passionate fullstack developer who loves building systems that connect things together."}
              </p>
            </GlowCard>
          </SectionReveal>

          {/* Skill categories — cards with count + sample skills */}
          {categories.map(([category, categorySkills], i) => (
            <SectionReveal key={category} direction="up" delay={0.1 * (i + 1)} className="transition-transform duration-200 hover:scale-[1.02]">
              <GlowCard
                glowColor={CATEGORY_COLORS[category] ?? CATEGORY_COLORS.other}
                contentClassName="p-4 h-full"
              >
                <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {CATEGORY_LABELS[category] ?? category}
                </p>
                <p className="font-display text-2xl font-bold text-gradient">
                  {categorySkills.length}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {categorySkills.slice(0, 3).map((s) => (
                    <span key={s.id} className="font-mono text-[9px] text-muted-foreground/60">
                      {s.name}{categorySkills.indexOf(s) < Math.min(categorySkills.length, 3) - 1 ? "," : ""}
                    </span>
                  ))}
                  {categorySkills.length > 3 && (
                    <span className="font-mono text-[9px] text-muted-foreground/40">
                      +{categorySkills.length - 3}
                    </span>
                  )}
                </div>
              </GlowCard>
            </SectionReveal>
          ))}

          {/* Total skills — full-width card at bottom */}
          <SectionReveal className="col-span-2 md:col-span-4" direction="up" delay={0.6}>
            <GlowCard glowColor="hsl(82, 100%, 66%)" className="h-full gradient-border" contentClassName="p-6 h-full">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Total Skills
              </p>
              <p className="font-display text-5xl font-bold text-gradient-animated">
                {skills.length}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {skills.slice(0, 8).map((s) => (
                  <span
                    key={s.id}
                    className="rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[9px] text-muted-foreground"
                  >
                    {s.name}
                  </span>
                ))}
                {skills.length > 8 && (
                  <span className="rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[9px] text-muted-foreground/40">
                    +{skills.length - 8} more
                  </span>
                )}
              </div>
            </GlowCard>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
