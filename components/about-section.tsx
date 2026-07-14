"use client";

import { SectionReveal } from "@/components/section-reveal";
import { GlowCard } from "@/components/glow-card";
import { cn } from "@/lib/utils";

interface AboutSectionProps {
  aboutText: string | null;
  skills: {
    id: string;
    name: string;
    category: string;
    proficiency: number;
  }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  frontend: "hsl(140, 80%, 60%)",
  backend: "hsl(160, 75%, 55%)",
  database: "hsl(35, 85%, 60%)",
  devops: "hsl(200, 70%, 55%)",
  language: "hsl(270, 70%, 60%)",
  other: "hsl(80, 10%, 50%)",
};

export function AboutSection({ aboutText, skills }: AboutSectionProps) {
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="about" className="relative px-5 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionReveal>
          <div className="mb-12 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              About Me
            </span>
          </div>
        </SectionReveal>

        <div className="grid gap-12 lg:grid-cols-2">
          <SectionReveal direction="left">
            <div className="glass rounded-2xl p-8">
              <h2 className="mb-4 font-display text-2xl font-bold text-foreground">
                Who I Am
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {aboutText ?? "A passionate fullstack developer who loves building systems that connect things together."}
              </p>
            </div>
          </SectionReveal>

          <SectionReveal direction="right" delay={0.15}>
            <div className="space-y-4">
              {Object.entries(grouped).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <GlowCard
                        key={skill.id}
                        glowColor={CATEGORY_COLORS[skill.category] ?? CATEGORY_COLORS.other}
                        className="!p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-display text-sm font-semibold text-foreground">
                            {skill.name}
                          </span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "h-1.5 w-4 rounded-full",
                                  i < skill.proficiency
                                    ? "bg-primary"
                                    : "bg-border"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </GlowCard>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
