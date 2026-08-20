import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectCard } from "@/components/project-card";
import { FeaturedShowcase } from "@/components/featured-showcase";
import { SectionReveal } from "@/components/section-reveal";
import { getProjects, getFeaturedProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects — Rindang Alam",
  description:
    "Kumpulan proyek Rindang Alam: web apps, dashboard, fintech, dan produk digital lainnya.",
};

function SectionSkeleton() {
  return (
    <div className="px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex justify-center">
          <div className="h-4 w-24 skeleton-shimmer rounded-xl" />
        </div>
        <div className="h-48 skeleton-shimmer rounded-xl border border-border" />
      </div>
    </div>
  );
}

export default async function ProjectsPage() {
  const [{ projects, error }, featured] = await Promise.all([
    getProjects(),
    getFeaturedProjects(),
  ]);

  return (
    <div className="bg-grid flex min-h-dvh flex-col">
      <main id="main-content" className="relative z-10 flex-1">
        <div className="pt-28">
          <SectionReveal>
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-secondary/40" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gradient">
                Work
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-secondary/40" />
            </div>
            <h1 className="mb-12 text-center font-display text-4xl font-bold text-foreground md:text-5xl">
              Selected Projects
            </h1>
          </SectionReveal>
        </div>

        {featured.length > 0 && (
          <Suspense fallback={<SectionSkeleton />}>
            <FeaturedShowcase projects={featured} />
          </Suspense>
        )}

        <section className="px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <SectionReveal>
              <div className="mb-12 flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-secondary/40" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gradient">
                  All Projects
                </span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-secondary/40" />
              </div>
            </SectionReveal>
            {error ? (
              <p className="text-center text-sm text-red-400">
                Failed to load projects: {error.message}
              </p>
            ) : projects.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                No published projects yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {projects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}