"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Github, ExternalLink, ArrowRight, Briefcase, CalendarDays, CheckCircle2, Target, Calendar } from "lucide-react";
import { SectionReveal } from "@/components/section-reveal";
import { ScreenshotLightbox } from "@/components/screenshot-lightbox";
import { MarkdownContent } from "@/components/markdown-content";

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

interface ProjectSection {
  heading?: string;
  content?: string;
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
  role: string | null;
  duration: string | null;
  year: number | null;
  highlights: string[] | null;
  challenges: string[] | null;
  sections: ProjectSection[] | null;
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
  const highlights = project.highlights ?? [];
  const challenges = project.challenges ?? [];
  const storySections = project.sections ?? [];
  const techStack = project.tech_stack ?? [];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const hasLinks = Boolean(project.repo_url || project.live_url);
  const hasMeta = Boolean(project.role || project.duration || project.year);
  const hasRail = hasMeta || hasLinks || techStack.length > 0 || highlights.length > 0;
  const storyContent =
    storySections.length > 0
      ? null
      : project.long_description ?? project.description ?? null;

  return (
    <>
      <ScreenshotLightbox
        images={screenshots}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      {/* Hero Section */}
      <SectionReveal>
        <div className="mb-10">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              All Projects
            </Link>
          </nav>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {project.is_featured && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary shadow-[0_0_15px_hsl(var(--primary)/0.2)] animate-glow-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Featured
              </span>
            )}
            <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">
              Project Overview
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold text-gradient text-balance md:text-5xl">
            {project.title}
          </h1>

          {project.description && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>

        {/* Hero Gallery — carousel (3 visible on desktop, 1 on mobile), fallback to thumbnail */}
        {(screenshots.length > 0 || project.image_url) && (
          <div className="mb-12">
            {screenshots.length > 0 ? (
              <ScreenshotCarousel screenshots={screenshots} onOpen={setLightboxIndex} />
            ) : project.image_url ? (
              isVideo(project.image_url) ? (
                <video
                  src={project.image_url}
                  className="aspect-video w-full rounded-lg border border-border object-cover"
                  controls
                  preload="metadata"
                />
              ) : (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="aspect-video w-full rounded-lg border border-border object-cover shadow-[0_0_30px_hsl(var(--primary)/0.08)]"
                />
              )
            ) : null}
          </div>
        )}
      </SectionReveal>

      {/* Editorial layout: sticky info rail + story column */}
      <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:items-start">
        {hasRail && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <SectionReveal>
              <div className="glass rounded-xl p-5">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-secondary">
                  Project Info
                </p>

                {hasMeta && (
                  <dl className="space-y-3">
                    {project.role && (
                      <div className="flex items-start gap-2.5">
                        <Briefcase size={13} className="mt-0.5 shrink-0 text-secondary" />
                        <div className="min-w-0">
                          <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            Role
                          </dt>
                          <dd className="text-xs font-medium text-foreground/90">
                            {project.role}
                          </dd>
                        </div>
                      </div>
                    )}
                    {project.duration && (
                      <div className="flex items-start gap-2.5">
                        <CalendarDays size={13} className="mt-0.5 shrink-0 text-secondary" />
                        <div className="min-w-0">
                          <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            Duration
                          </dt>
                          <dd className="text-xs font-medium text-foreground/90">
                            {project.duration}
                          </dd>
                        </div>
                      </div>
                    )}
                    {project.year && (
                      <div className="flex items-start gap-2.5">
                        <Calendar size={13} className="mt-0.5 shrink-0 text-secondary" />
                        <div className="min-w-0">
                          <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            Year
                          </dt>
                          <dd className="text-xs font-medium text-foreground/90">
                            {project.year}
                          </dd>
                        </div>
                      </div>
                    )}
                  </dl>
                )}

                {hasLinks && (
                  <div className="mt-5 flex flex-col gap-2 border-t border-border/50 pt-5">
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 font-mono text-[11px] text-primary transition-all duration-500 ease-premium hover:bg-primary/20 hover:shadow-[0_0_25px_hsl(var(--primary)/0.2)]"
                      >
                        <Github size={13} /> Repository
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 font-mono text-[11px] text-accent transition-all duration-500 ease-premium hover:bg-accent/20 hover:shadow-[0_0_25px_hsl(var(--accent)/0.2)]"
                      >
                        <ExternalLink size={13} /> Live Demo
                      </a>
                    )}
                  </div>
                )}

                {techStack.length > 0 && (
                  <div className="mt-5 border-t border-border/50 pt-5">
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-secondary">
                      Tech Stack
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {techStack.map((tech: string) => {
                        const cat = getTechCategory(tech);
                        const colorClass = CATEGORY_COLORS[cat] ?? "border-border bg-card/50 text-muted-foreground";
                        return (
                          <span
                            key={tech}
                            className={`rounded-full border px-2.5 py-1 font-mono text-[10px] ${colorClass}`}
                          >
                            {tech}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {highlights.length > 0 && (
                  <div className="mt-5 border-t border-border/50 pt-5">
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-secondary">
                      Highlights
                    </p>
                    <ul className="space-y-2.5">
                      {highlights.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-primary" />
                          <span className="text-[11px] leading-relaxed text-foreground/80">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </SectionReveal>
          </aside>
        )}

        <div className="min-w-0">
          {/* Story — sections or fallback markdown */}
          {(storySections.length > 0 || storyContent) && (
            <>
              <div className="mb-12 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
              <SectionReveal>
                <div className="mb-12">
                  <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-secondary">
                    The Story
                  </h2>
                  {storySections.length > 0 ? (
                    <div className="space-y-8">
                      {storySections.map((section, i) =>
                        section.content ? (
                          <div key={i}>
                            {section.heading && (
                              <h3 className="mb-3 flex items-center gap-3 font-display text-base font-bold text-foreground">
                                <span className="font-mono text-[10px] text-primary">
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                {section.heading}
                              </h3>
                            )}
                            <MarkdownContent content={section.content} />
                          </div>
                        ) : null
                      )}
                    </div>
                  ) : (
                    <MarkdownContent content={storyContent!} />
                  )}
                </div>
              </SectionReveal>
            </>
          )}

          {/* Challenges Solved */}
          {challenges.length > 0 && (
            <>
              <div className="mb-12 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
              <SectionReveal>
                <div className="mb-12">
                  <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-accent">
                    Challenges Solved
                  </h2>
                  <ul className="space-y-3">
                    {challenges.map((item, i) => (
                      <li key={i} className="glass flex items-start gap-3 rounded-xl p-4">
                        <Target size={16} className="mt-0.5 shrink-0 text-accent" />
                        <span className="text-sm leading-relaxed text-foreground/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionReveal>
            </>
          )}

          {/* Tech Stack Details */}
          {techDetails.length > 0 && (
            <>
              <div className="mb-12 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
              <SectionReveal>
                <div className="mb-12">
                  <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-secondary">
                    Tech Stack Details
                  </h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    {techDetails.map((td, i) => (
                      <div key={td.name} className="glass relative rounded-xl p-5 transition-colors hover:border-primary/20">
                        <span className="pointer-events-none absolute -right-2 -top-4 select-none font-display text-5xl font-bold leading-none text-foreground/[0.06]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
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

        </div>
      </div>

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

const SLIDE_GAP = 12;

function ScreenshotCarousel({
  screenshots,
  onOpen,
}: {
  screenshots: string[];
  onOpen: (index: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  const slideStep = () => {
    const el = trackRef.current;
    if (!el) return 0;
    const first = el.children[0] as HTMLElement | undefined;
    return (first?.getBoundingClientRect().width ?? el.clientWidth) + SLIDE_GAP;
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      setCanScroll(el.scrollWidth > el.clientWidth + 4);
      const step = slideStep() || 1;
      setActive(Math.min(screenshots.length - 1, Math.round(el.scrollLeft / step)));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [screenshots.length]);

  const scrollByStep = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * slideStep(), behavior: "smooth" });
  };

  const goTo = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * slideStep(), behavior: "smooth" });
  };

  return (
    <div>
      <div className="relative">
        <div
          ref={trackRef}
          role="region"
          aria-label="Project screenshots"
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth"
        >
          {screenshots.map((src, i) => (
            <div key={i} className="w-full shrink-0 snap-center md:w-[calc(33.333%-8px)]">
              <button
                type="button"
                onClick={() => onOpen(i)}
                className="group block w-full cursor-zoom-in overflow-hidden rounded-lg border border-border bg-background text-left shadow-[0_0_30px_hsl(var(--primary)/0.08)]"
                aria-label={`Open screenshot ${i + 1} fullscreen`}
              >
                {isVideo(src) ? (
                  <video
                    src={src}
                    className="aspect-video w-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={src}
                    alt={`Screenshot ${i + 1}`}
                    className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                )}
              </button>
            </div>
          ))}
        </div>

        {canScroll && (
          <>
            <button
              type="button"
              onClick={() => scrollByStep(-1)}
              className="glass absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition-colors hover:text-primary"
              aria-label="Previous screenshots"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scrollByStep(1)}
              className="glass absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition-colors hover:text-accent"
              aria-label="Next screenshots"
            >
              <ArrowRight size={16} />
            </button>
          </>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted-foreground">
          {String(active + 1).padStart(2, "0")} / {String(screenshots.length).padStart(2, "0")}
        </span>
        {canScroll && screenshots.length > 1 && (
          <div className="flex gap-1.5">
            {screenshots.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to screenshot ${i + 1}`}
                className={`h-1.5 w-4 rounded-full transition-colors ${
                  i === active ? "bg-accent" : "bg-border hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

