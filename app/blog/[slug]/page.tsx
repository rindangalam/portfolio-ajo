import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { MarkdownContent } from "@/components/markdown-content";
import { PageTransition } from "@/components/page-transition";
import { BlogReadingProgress } from "@/components/blog-reading-progress";
import { getPostBySlug } from "@/lib/data";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".mkv"];
function isVideo(src: string): boolean {
  const lower = src.split("?")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <div className="mb-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            All Articles
          </Link>
        </nav>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="font-display text-3xl font-bold text-foreground text-balance md:text-5xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} />
            {formatDate(post.published_at ?? post.created_at)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} />
            {readingTime(post.content)} min read
          </span>
        </div>
      </div>

      {post.cover_image && (
        <div className="mb-10 overflow-hidden rounded-lg border border-border">
          {isVideo(post.cover_image) ? (
            <video
              src={post.cover_image}
              className="aspect-video w-full object-cover"
              controls
              preload="metadata"
            />
          ) : (
            <img
              src={post.cover_image}
              alt={post.title}
              className="aspect-video w-full object-cover"
            />
          )}
        </div>
      )}

      <MarkdownContent content={post.content} />

      <div className="mt-14 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft size={14} /> All articles
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-secondary transition-colors hover:text-primary"
        >
          Have thoughts? Let&apos;s talk →
        </Link>
      </div>
    </>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 h-4 w-24 skeleton-shimmer rounded" />
      <div className="mb-4 h-10 w-3/4 skeleton-shimmer rounded" />
      <div className="mb-10 h-4 w-48 skeleton-shimmer rounded" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 skeleton-shimmer rounded" style={{ width: `${100 - i * 8}%` }} />
        ))}
      </div>
    </div>
  );
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="bg-grid flex min-h-dvh flex-col">
      <PageTransition>
        <main id="main-content" className="relative z-10 flex-1">
          <div className="mx-auto max-w-3xl px-5 pt-32 pb-24">
            <BlogReadingProgress>
              <Suspense fallback={<DetailSkeleton />}>
                <PostDetail params={params} />
              </Suspense>
            </BlogReadingProgress>
          </div>
        </main>
      </PageTransition>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article Not Found — Rindang Alam" };
  return {
    title: `${post.title} — Rindang Alam`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
      type: "article",
      publishedTime: post.published_at ?? undefined,
    },
  };
}