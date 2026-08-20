"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import { GlowCard } from "@/components/glow-card";
import type { Post } from "@/lib/data";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".mkv"];
function isVideo(src: string): boolean {
  const lower = src.split("?")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function BlogCard({ post, index }: { post: Post; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <GlowCard className="overflow-hidden transition-all duration-300 group-hover:border-primary/40" contentClassName="p-0">
          {post.cover_image && (
            <div className="relative h-44 overflow-hidden">
              {isVideo(post.cover_image) ? (
                <video
                  src={post.cover_image}
                  className="h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            </div>
          )}

          <div className="p-6">
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
              <CalendarDays size={12} />
              <time dateTime={post.published_at ?? post.created_at}>
                {formatDate(post.published_at ?? post.created_at)}
              </time>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span className="text-muted-foreground/40">/</span>
                  <span className="text-primary">{post.tags[0]}</span>
                </>
              )}
            </div>

            <h3 className="mb-2 font-display text-lg font-bold text-foreground transition-colors group-hover:text-primary">
              {post.title}
            </h3>

            {post.excerpt && (
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
            )}

            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-secondary transition-colors group-hover:text-primary">
              Read article
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </GlowCard>
      </Link>
    </motion.div>
  );
}