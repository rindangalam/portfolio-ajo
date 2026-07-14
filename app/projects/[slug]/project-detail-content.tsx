"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Github, ExternalLink, ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/section-reveal";
import { ScreenshotLightbox } from "@/components/screenshot-lightbox";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".mkv"];
function isVideo(src: string): boolean {
  const lower = src.split("?")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

const CATEGORY_COLORS: Record<string, string> = {
  frontend: "border-cat-frontend/30 bg-cat-frontend/10 text-cat-frontend",
  backend: "border-cat-backend/30 bg-cat-backend/10 text-cat-backend",
  database: "border-cat-database/30 bg-cat-database/10 text-cat-database",
  devops: "border-cat-devops/30 bg-cat-devops/10 text-cat-devops",
};

function getTechCategory(tech: string): string {
  const t = tech.toLowerCase();
  if (["react", "next.js", "nextjs", "vue", "vue.js", "nuxt", "angular", "svelte", "tailwind", "tailwind css", "html", "css", "javascript", "typescript", "jsx", "tsx"].includes(t)) return "frontend";
  if (["node.js", "nodejs", "node", "express", "express.js", "fastapi", "django", "flask", "nest.js", "nestjs", "python", "go", "java", "ruby", "php", "rust"].includes(t)) return "backend";
  if (["postgresql", "postgres", "mysql", "mongodb", "redis", "supabase", "firebase", "sqlite", "elasticsearch", "prisma", "drizzle"].includes(t)) return "database";
  if (["docker", "aws", "vercel", "netlify", "github actions", "ci/cd", "kubernetes", "terraform", "nginx"].includes(t)) return "devops";
  return "other";
}

interface ProjectData {
  title: string;
  description: string | null;
  long_description: string | null;
  image_url: string | null;
  tech_stack: string[] | null;
  repo_url: string | null;
  live_url: string | null;
  is_featured: boolean | null;
  screenshots: string[] | null;
  tech_details: { name: string; role: string; note?: string }[] | null;
}

interface NavProject {
  slug: string;
  title: string;
}

interface ProjectDetailContentProps {
  project: ProjectData;
  prevProject: NavProject | null;
  nextProject: NavProject | null;
  screenshots: string[];
}

export function ProjectDetailContent({
  project,
  prevProject,
  nextProject,
  screenshots,
}: ProjectDetailContentProps) {
  const techDetails = project.tech_details ?? [];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <ScreenshotLightbox
        images={screenshots}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />      {/* Hero Section — split layout */}
      <SectionReveal>
        <div className="mb-10 flex flex-col gap-8 md:flex-row md:items-start">
          {/* Left — Info */}
          <div className="flex-1">
            {project.is_featured && (
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary shadow-[0_0_15px_hsl(var(--primary)/0.2)] animate-glow-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Featured
              </span>
            )}
            <h1 className="font-display text-2xl font-bold text-gradient md:text-3xl">
              {project.title}
            </h1>

            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tech_stack.map((tech: string) => {
                  const cat = getTechCategory(tech);
                  const colorClass = CATEGORY_COLORS[cat] ?? "border-border bg-card/50 text-muted-foreground";
                  return (
                    <span
                      key={tech}
                      className={`rounded-full border px-3 py-1 font-mono text-[11px] ${colorClass}`}
                    >
                      {tech}
                    </span>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 font-mono text-xs text-primary transition-all hover:bg-primary/20 hover:shadow-[0_0_25px_hsl(var(--primary)/0.2)]"
                >
                  <Github size={14} /> Repository
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2.5 font-mono text-xs text-accent transition-all hover:bg-accent/20 hover:shadow-[0_0_25px_hsl(var(--accent)/0.2)]"
                >
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
            </div>

            {(project.long_description ?? project.description) && (
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                {project.long_description ?? project.description}
              </p>
            )}
          </div>

          {/* Right — Hero Image / Video */}
          {project.image_url && (
            <div className="shrink-0 md:w-[45%]">
              {isVideo(project.image_url) ? (
                <video
                  src={project.image_url}
                  className="w-full rounded-lg object-contain"
                  controls
                />
              ) : (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full rounded-lg object-contain"
                />
              )}
            </div>
          )}
        </div>
      </SectionReveal>

      {/* Tech Stack Details */}
      {techDetails.length > 0 && (
        <>
          <div className="mb-12 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
          <SectionReveal>
            <div className="mb-12">
<h2 className="mb-5 font-mono text-xs uppercase tracking-widest text-secondary">
              Tech Stack Details
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {techDetails.map((td) => (
                  <div key={td.name} className="glass rounded-xl p-5 transition-colors hover:border-primary/20">
                    <h3 className="font-display text-sm font-semibold text-foreground">{td.name}</h3>
                    <p className="mt-1 font-mono text-[10px] text-primary">{td.role}</p>
                    {td.note && <p className="mt-2 text-xs text-muted-foreground">{td.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </>
      )}

      {/* Screenshots */}
      {screenshots.length > 0 && (
        <>
          <div className="mb-12 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
          <SectionReveal>
            <div className="mb-12">
              <h2 className="mb-5 font-mono text-xs uppercase tracking-widest text-accent">
                Screenshots
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {screenshots.map((src, i) => (
                  <ScreenshotThumb key={i} src={src} index={i} onClick={() => setLightboxIndex(i)} />
                ))}
              </div>
            </div>
          </SectionReveal>
        </>
      )}

      {/* Prev/Next Navigation */}
      {(prevProject || nextProject) && (
        <>
          <div className="mt-16 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
          <SectionReveal>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {prevProject ? (
                <Link
                  href={`/projects/${prevProject.slug}`}
                  className="glass group flex flex-col items-start gap-2 rounded-xl p-4 transition-all hover:border-primary/30 hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)]"
                >
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary">
                    <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
                    Previous
                  </span>
                  <span className="font-display text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    {prevProject.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextProject && (
                <Link
                  href={`/projects/${nextProject.slug}`}
                  className="glass group flex flex-col items-end gap-2 rounded-xl p-4 transition-all hover:border-accent/30 hover:shadow-[0_0_20px_hsl(var(--accent)/0.1)]"
                >
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-accent">
                    Next
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="font-display text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
                    {nextProject.title}
                  </span>
                </Link>
              )}
            </div>
          </SectionReveal>
        </>
      )}
    </>
  );
}

function ScreenshotThumb({ src, index, onClick }: { src: string; index: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-background text-left transition-all hover:border-primary/30 hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)]"
    >
      {isVideo(src) ? (
        <video
          src={src}
          className="max-h-[200px] w-full object-contain"
          controls
          preload="metadata"
        />
      ) : (
        <img
          src={src}
          alt={`Screenshot ${index + 1}`}
          className="max-h-[200px] w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      )}
    </button>
  );
}
