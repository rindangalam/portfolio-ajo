import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactSection } from "@/components/contact-section";
import { LocationSection } from "@/components/location-section";
import { SectionReveal } from "@/components/section-reveal";
import { getProfile, getSocialLinks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact — Rindang Alam",
  description:
    "Hubungi Rindang Alam untuk kolaborasi, freelance, atau tawaran kerja — full-stack developer.",
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

export default async function ContactPage() {
  const [profile, socialLinks] = await Promise.all([
    getProfile("full_name, email, location, available_for_hire, status_text, status_busy_text"),
    getSocialLinks(),
  ]);

  return (
    <div className="bg-grid flex min-h-dvh flex-col">
      <main id="main-content" className="relative z-10 flex-1">
        <div className="pt-28">
          <SectionReveal>
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-secondary/40" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gradient">
                Contact
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-secondary/40" />
            </div>
            <h1 className="mb-12 text-center font-display text-4xl font-bold text-foreground md:text-5xl">
              Let&apos;s Work Together
            </h1>
          </SectionReveal>
        </div>

        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection socialLinks={socialLinks} email={profile?.email ?? null} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <LocationSection
            location={profile?.location ?? null}
            availableForHire={profile?.available_for_hire ?? false}
            statusText={profile?.status_text ?? "Open to work"}
            statusBusyText={profile?.status_busy_text ?? "Currently busy"}
          />
        </Suspense>
      </main>
    </div>
  );
}