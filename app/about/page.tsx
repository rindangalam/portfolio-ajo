import type { Metadata } from "next";
import { Suspense } from "react";
import { BentoAbout } from "@/components/bento-about";
import { ExperienceSection } from "@/components/experience-section";
import { LocationSection } from "@/components/location-section";
import { TechMarquee } from "@/components/tech-marquee";
import { StatsSection } from "@/components/stats-section";
import { SectionReveal } from "@/components/section-reveal";
import { PageTransition } from "@/components/page-transition";
import { getProfile, getAllSkills, getExperiences, getStats } from "@/lib/data";

export const metadata: Metadata = {
  title: "About — Rindang Alam",
  description:
    "Tentang Rindang Alam Nur Muhammad — pengalaman kerja, skill, dan perjalanan sebagai full-stack developer.",
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

async function BentoSection() {
  const [profile, skills] = await Promise.all([getProfile("about_text"), getAllSkills()]);
  return <BentoAbout aboutText={profile?.about_text ?? null} skills={skills} />;
}

async function ExperienceSectionWrapper() {
  const experiences = await getExperiences();
  return <ExperienceSection experiences={experiences} />;
}

async function TechMarqueeSection() {
  const skills = await getAllSkills();
  return (
    <TechMarquee skills={skills.map((s) => ({ name: s.name, category: s.category }))} />
  );
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

async function LocationSectionWrapper() {
  const profile = await getProfile(
    "location, available_for_hire, status_text, status_busy_text"
  );
  return (
    <LocationSection
      location={profile?.location ?? null}
      availableForHire={profile?.available_for_hire ?? false}
      statusText={profile?.status_text ?? "Open to work"}
      statusBusyText={profile?.status_busy_text ?? "Currently busy"}
    />
  );
}

export default function AboutPage() {
  return (
    <div className="bg-grid flex min-h-dvh flex-col">
      <PageTransition>
        <main id="main-content" className="relative z-10 flex-1">
          <div className="pt-28">
            <SectionReveal>
              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-secondary/40" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gradient">
                  About
                </span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-secondary/40" />
              </div>
              <h1 className="mb-12 text-center font-display text-4xl font-bold text-foreground md:text-5xl">
                About Me
              </h1>
            </SectionReveal>
          </div>

          <Suspense fallback={<SectionSkeleton />}>
            <BentoSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <ExperienceSectionWrapper />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <TechMarqueeSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <StatsSectionWrapper />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <LocationSectionWrapper />
          </Suspense>
        </main>
      </PageTransition>
    </div>
  );
}