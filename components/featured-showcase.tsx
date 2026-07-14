"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import { SectionReveal } from "@/components/section-reveal";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".mkv"];
function isVideo(src: string): boolean {
  const lower = src.split("?")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

interface FeaturedProject {
  id: string;
  title: string;
  description: string | null;
  long_description: string | null;
  slug: string;
  image_url: string | null;
  tech_stack: string[] | null;
  repo_url: string | null;
  live_url: string | null;
}

interface FeaturedShowcaseProps {
  projects: FeaturedProject[];
}

export function FeaturedShowcase({ projects }: FeaturedShowcaseProps) {
  if (projects.length === 0) return null;

  return (
    <section className="relative px-5 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionReveal>
          <div className="mb-12 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-secondary/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gradient">
              Featured
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-secondary/40" />
          </div>
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground">
            Highlighted Work
          </h2>
        </SectionReveal>

        <div className="space-y-16">
          {projects.map((project, i) => (
            <FeaturedProjectCard key={project.id} project={project} index={i} reversed={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProjectCard({
  project,
  index,
  reversed,
}: {
  project: FeaturedProject;
  index: number;
  reversed: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div className="relative">
      <div className="mb-6 h-1 w-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent" />
      <span className="pointer-events-none absolute -right-6 -top-6 select-none font-display text-[140px] font-bold leading-none text-foreground/[0.03]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        className="grid gap-8 md:grid-cols-2"
      >
      {/* Image */}
      <div className={reversed ? "md:order-2" : ""}>
        <Link href={`/projects/${project.slug}`} className="group block">
          <div className="group/image relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(var(--primary)/0.1)]">
            {project.image_url ? (
              isVideo(project.image_url) ? (
                <video
                  src={project.image_url}
                  className="aspect-video w-full object-cover"
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )
            ) : (
              <div className="flex aspect-video items-center justify-center bg-background">
                <span className="font-mono text-sm text-muted-foreground/40">No preview</span>
              </div>
            )}
            {project.image_url && (
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            )}
          </div>
        </Link>
      </div>

      {/* Details */}
      <div className={`flex flex-col justify-center ${reversed ? "md:order-1" : ""}`}>
        <span className="mb-2 font-mono text-[10px] uppercase tracking-widest text-secondary">
          Featured Project
        </span>
        <h3 className="mb-2 font-display text-2xl font-bold text-foreground">
          {project.title}
        </h3>
        {project.description && (
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        )}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-1.5">
            {project.tech_stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-card px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-transform duration-200 hover:scale-105"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-3">
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-secondary/20 bg-secondary/5 px-3 py-1.5 font-mono text-[11px] text-secondary transition-all hover:bg-secondary/10 hover:shadow-[0_0_15px_hsl(var(--secondary)/0.3)]"
            >
              <Github size={12} /> Code
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-accent/20 bg-accent/5 px-3 py-1.5 font-mono text-[11px] text-accent transition-all hover:bg-accent/10 hover:shadow-[0_0_15px_hsl(var(--accent)/0.3)]"
            >
              <ExternalLink size={12} /> Live Demo
            </a>
          )}
          <Link
            href={`/projects/${project.slug}`}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-all hover:border-secondary/30 hover:text-secondary"
          >
            Details →
          </Link>
        </div>
      </div>
    </motion.div>
    </div>
  );
}
