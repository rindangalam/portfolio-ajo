import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogCard } from "@/components/blog-card";
import { SectionReveal } from "@/components/section-reveal";
import { PageTransition } from "@/components/page-transition";
import { getPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog — Rindang Alam",
  description:
    "Artikel tentang web development, arsitektur sistem, dan hal-hal yang saya pelajari di perjalanan.",
};

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-72 skeleton-shimmer rounded-xl border border-border" />
      ))}
    </div>
  );
}

async function PostGrid() {
  const posts = await getPosts();

  if (!posts || posts.length === 0) {
    return (
      <div className="retro-card rounded p-12 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          no posts yet
        </p>
        <p className="mt-3 font-display text-lg font-bold text-foreground">
          Articles are on the way
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Check back soon — I&apos;m writing about web development and system architecture.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => (
        <BlogCard key={post.id} post={post} index={i} />
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <div className="bg-grid flex min-h-dvh flex-col">
      <PageTransition>
        <main id="main-content" className="relative z-10 flex-1" data-nav-section="blog">
          <div className="pt-28">
            <SectionReveal>
              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-secondary/40" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gradient">
                  Blog
                </span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-secondary/40" />
              </div>
              <h1 className="mb-4 text-center font-display text-4xl font-bold text-foreground md:text-5xl">
                Writing & Notes
              </h1>
              <p className="mx-auto mb-12 max-w-xl text-center text-sm text-muted-foreground">
                Catatan tentang pengembangan web, arsitektur sistem, dan hal-hal yang saya pelajari.
              </p>
            </SectionReveal>
          </div>

          <section className="px-5 pb-24">
            <div className="mx-auto max-w-7xl">
              <Suspense fallback={<GridSkeleton />}>
                <PostGrid />
              </Suspense>
            </div>
          </section>
        </main>
      </PageTransition>
    </div>
  );
}