import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { HeroSchematic } from "@/components/hero-schematic";
import { ProjectCard } from "@/components/project-card";
import { StatsSection } from "@/components/stats-section";
import { BentoAbout } from "@/components/bento-about";
import { TechMarquee } from "@/components/tech-marquee";
import { FeaturedShowcase } from "@/components/featured-showcase";
import { LocationSection } from "@/components/location-section";
import { ExperienceSection } from "@/components/experience-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { SectionReveal } from "@/components/section-reveal";
import { SectionDivider } from "@/components/section-divider";
import { Suspense } from "react";

function HeroSkeleton() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-5">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-64 skeleton-shimmer rounded-xl" />
        <div className="h-5 w-48 skeleton-shimmer rounded-xl" />
      </div>
    </section>
  );
}

function ProjectGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-64 skeleton-shimmer rounded-xl border border-border" />
      ))}
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="px-5 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex justify-center">
          <div className="h-4 w-24 skeleton-shimmer rounded-xl" />
        </div>
        <div className="h-48 skeleton-shimmer rounded-xl border border-border" />
      </div>
    </div>
  );
}

async function ProfileHeroSection() {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .eq("id", 1)
    .single();

  const { data: socialLinks } = await supabase
    .from("social_links")
    .select("platform, url")
    .order("sort_order", { ascending: true });

  return (
    <HeroSchematic
      name={profile?.full_name ?? "Rindang Alam Nur Muhammad"}
      headline={profile?.headline ?? null}
      bio={profile?.bio ?? null}
      avatarUrl={profile?.avatar_url ?? null}
      location={profile?.location ?? null}
      email={profile?.email ?? null}
      phone={profile?.phone ?? null}
      availableForHire={profile?.available_for_hire ?? false}
      socialLinks={socialLinks ?? []}
      resumeUrl={profile?.resume_url ?? null}
    />
  );
}

async function TechMarqueeSection() {
  const supabase = await createClient();
  const { data: skills } = await supabase
    .from("skills")
    .select("name, category")
    .order("sort_order", { ascending: true });

  return <TechMarquee skills={skills ?? []} />;
}

async function ProjectGrid() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return <p className="text-center text-sm text-red-400">Failed to load projects: {error.message}</p>;
  }

  if (!projects || projects.length === 0) {
    return <p className="text-center text-sm text-muted-foreground">No published projects yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </div>
  );
}

async function FeaturedShowcaseSection() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true });

  return <FeaturedShowcase projects={projects ?? []} />;
}

async function StatsSectionWrapper() {
  const supabase = await createClient();
  const [{ count: projectCount }, { count: skillCount }, { data: profile }] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase.from("profile").select("available_for_hire").eq("id", 1).single(),
  ]);

  return (
    <StatsSection
      projectCount={projectCount ?? 0}
      skillCount={skillCount ?? 0}
      availableForHire={profile?.available_for_hire ?? false}
    />
  );
}

async function BentoAboutSection() {
  const supabase = await createClient();
  const [{ data: profile }, { data: skills }] = await Promise.all([
    supabase.from("profile").select("about_text").eq("id", 1).single(),
    supabase.from("skills").select("*").order("sort_order", { ascending: true }),
  ]);

  return <BentoAbout aboutText={profile?.about_text ?? null} skills={skills ?? []} />;
}

async function LocationSectionWrapper() {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profile")
    .select("location, available_for_hire")
    .eq("id", 1)
    .single();

  return (
    <LocationSection
      location={profile?.location ?? null}
      availableForHire={profile?.available_for_hire ?? false}
    />
  );
}

async function ExperienceSectionWrapper() {
  const supabase = await createClient();
  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });

  return <ExperienceSection experiences={experiences ?? []} />;
}

async function ContactSectionWrapper() {
  const supabase = await createClient();
  const [{ data: socialLinks }, { data: profile }] = await Promise.all([
    supabase.from("social_links").select("*").order("sort_order", { ascending: true }),
    supabase.from("profile").select("email, full_name").eq("id", 1).single(),
  ]);

  return <ContactSection socialLinks={socialLinks ?? []} email={profile?.email ?? null} />;
}

async function FooterWrapper() {
  const supabase = await createClient();
  const { data: socialLinks } = await supabase
    .from("social_links")
    .select("platform, url")
    .order("sort_order", { ascending: true });

  return <Footer socialLinks={socialLinks ?? []} />;
}

async function NavbarWrapper() {
  return <Navbar />;
}

export default function Home() {
  return (
    <div className="bg-grid flex min-h-screen flex-col">
      <Suspense fallback={<nav className="h-16 w-full" />}>
        <NavbarWrapper />
      </Suspense>

      <main id="main-content" className="relative z-10 flex-1">
        <Suspense fallback={<HeroSkeleton />}>
          <ProfileHeroSection />
        </Suspense>

        <SectionDivider color="secondary" />

        <Suspense fallback={<SectionSkeleton />}>
          <TechMarqueeSection />
        </Suspense>

        <SectionDivider color="secondary" />

        <Suspense fallback={<SectionSkeleton />}>
          <StatsSectionWrapper />
        </Suspense>

        <SectionDivider color="secondary" />

        <Suspense fallback={<SectionSkeleton />}>
          <BentoAboutSection />
        </Suspense>

        <SectionDivider color="secondary" />

        <Suspense fallback={<SectionSkeleton />}>
          <FeaturedShowcaseSection />
        </Suspense>

        <SectionDivider color="secondary" />

        <section id="projects" className="px-5 py-20">
          <div className="mx-auto max-w-5xl">
            <SectionReveal>
              <div className="mb-12 flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-secondary/40" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gradient">
                  All Projects
                </span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-secondary/40" />
              </div>
            </SectionReveal>
            <Suspense fallback={<ProjectGridSkeleton />}>
              <ProjectGrid />
            </Suspense>
          </div>
        </section>

        <SectionDivider color="secondary" />

        <Suspense fallback={<SectionSkeleton />}>
          <LocationSectionWrapper />
        </Suspense>

        <SectionDivider color="secondary" />

        <Suspense fallback={<SectionSkeleton />}>
          <ExperienceSectionWrapper />
        </Suspense>

        <SectionDivider color="secondary" />

        <Suspense fallback={<SectionSkeleton />}>
          <ContactSectionWrapper />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <FooterWrapper />
      </Suspense>
    </div>
  );
}
