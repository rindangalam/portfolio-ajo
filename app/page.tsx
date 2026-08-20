import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { HeroSchematic } from "@/components/hero-schematic";
import { TechMarquee } from "@/components/tech-marquee";
import { StatsSection } from "@/components/stats-section";
import { FeaturedShowcase } from "@/components/featured-showcase";
import { SectionReveal } from "@/components/section-reveal";
import { PageTransition } from "@/components/page-transition";
import {
  getProfile,
  getSocialLinks,
  getSkills,
  getFeaturedProjects,
  getStats,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Rindang Alam — Full-Stack Developer",
  description:
    "Portfolio Rindang Alam Nur Muhammad — full-stack developer membangun web apps modern: dashboard, fintech, dan produk digital.",
};

function HeroSkeleton() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-5">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-64 skeleton-shimmer rounded-xl" />
        <div className="h-5 w-48 skeleton-shimmer rounded-xl" />
      </div>
    </section>
  );
}

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

async function ProfileHeroSection() {
  const [profile, socialLinks] = await Promise.all([
    getProfile(
      "full_name, headline, bio, avatar_url, location, email, phone, available_for_hire, status_text, resume_url"
    ),
    getSocialLinks(),
  ]);

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
      statusText={profile?.status_text ?? "Available for hire"}
      socialLinks={socialLinks}
      resumeUrl={profile?.resume_url ?? null}
    />
  );
}

async function TechMarqueeSection() {
  const skills = await getSkills();
  return <TechMarquee skills={skills} />;
}

async function StatsSectionWrapper() {
  const stats = await getStats();
  return (
    <StatsSection
      projectCount={stats.projectCount}
      skillCount={stats.skillCount}
      availableForHire={stats.availableForHire}
      statusText={stats.statusText}
      statusBusyText={stats.statusBusyText}
    />
  );
}

async function FeaturedTeaser() {
  const featured = await getFeaturedProjects();
  return <FeaturedShowcase projects={featured.slice(0, 3)} />;
}

export default function Home() {
  return (
    <div className="bg-grid flex min-h-dvh flex-col">
      <PageTransition>
        <main id="main-content" className="relative z-10 flex-1">
          <div data-nav-section="home">
            <Suspense fallback={<HeroSkeleton />}>
              <ProfileHeroSection />
            </Suspense>
          </div>

          <div data-nav-section="home">
            <Suspense fallback={<SectionSkeleton />}>
              <TechMarqueeSection />
            </Suspense>
          </div>

          <div data-nav-section="home">
            <Suspense fallback={<SectionSkeleton />}>
              <StatsSectionWrapper />
            </Suspense>
          </div>

          <div data-nav-section="projects">
            <Suspense fallback={<SectionSkeleton />}>
              <FeaturedTeaser />
            </Suspense>
          </div>

          <section data-nav-section="projects" className="px-5 pb-24">
            <div className="mx-auto max-w-7xl">
              <SectionReveal>
                <div className="flex justify-center">
                  <Link
                    href="/projects"
                    className="retro-card-bevel rounded-lg bg-card px-8 py-4 font-display text-sm font-bold text-foreground transition-all duration-500 ease-premium hover:text-primary active:scale-[0.98]"
                  >
                    View all projects <span className="text-primary">→</span>
                  </Link>
                </div>
              </SectionReveal>
            </div>
          </section>
        </main>
      </PageTransition>
    </div>
  );
}