import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectDetailContent } from "./project-detail-content";
import { GradientMesh } from "@/components/gradient-mesh";
import { ParticleField } from "@/components/particle-field";
import { Footer } from "@/components/footer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("title, description, image_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} — RINDANG ALAM NUR MUHAMMAD`,
    description: project.description ?? undefined,
    openGraph: project.image_url
      ? { images: [{ url: project.image_url, width: 1200, height: 630 }] }
      : undefined,
  };
}

async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!project) notFound();

  const { data: allProjects } = await supabase
    .from("projects")
    .select("slug, title")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  const currentIndex = allProjects?.findIndex((p) => p.slug === slug) ?? -1;
  const prevProject = currentIndex > 0 ? allProjects![currentIndex - 1] : null;
  const nextProject =
    currentIndex < (allProjects?.length ?? 0) - 1
      ? allProjects![currentIndex + 1]
      : null;

  return (
    <ProjectDetailContent
      project={{
        title: project.title ?? "",
        description: project.description,
        long_description: project.long_description,
        image_url: project.image_url,
        tech_stack: project.tech_stack,
        repo_url: project.repo_url,
        live_url: project.live_url,
        is_featured: project.is_featured,
        screenshots: project.screenshots,
        tech_details: project.tech_details,
      }}
      prevProject={prevProject}
      nextProject={nextProject}
      screenshots={project.screenshots ?? []}
    />
  );
}

function ProjectDetailSkeleton() {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto h-8 w-64 animate-pulse rounded bg-card" />
      <div className="mx-auto mt-4 h-4 w-48 animate-pulse rounded bg-card" />
    </div>
  );
}

export default function ProjectDetailPage({ params }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <GradientMesh />
      <ParticleField particleCount={20} />

      <nav className="sticky top-0 z-50 w-full glass">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-5">
          <Link
            href="/#projects"
            className="flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={14} />
            All Projects
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex-1">
        <div className="mx-auto max-w-4xl px-5 py-12">
          <Suspense fallback={<ProjectDetailSkeleton />}>
            <ProjectDetail params={params} />
          </Suspense>
        </div>
      </main>

      <Suspense fallback={<footer className="relative z-10 border-t border-border/30 py-12" />}>
        <ProjectFooterWrapper />
      </Suspense>
    </div>
  );
}

async function ProjectFooterWrapper() {
  const supabase = await createClient();
  let socialLinks: { platform: string; url: string }[] = [];
  try {
    const { data } = await supabase
      .from("social_links")
      .select("platform, url")
      .order("sort_order", { ascending: true });
    if (data) socialLinks = data;
  } catch {
    // fallback
  }
  return <Footer socialLinks={socialLinks} />;
}
