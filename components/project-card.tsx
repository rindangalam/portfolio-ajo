"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { GlowCard } from "@/components/glow-card";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".mkv"];
function isVideo(src: string): boolean {
  const lower = src.split("?")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    slug: string;
    image_url: string | null;
    tech_stack: string[] | null;
    is_featured: boolean | null;
  };
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ perspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="transition-transform duration-200"
      >
        <Link href={`/projects/${project.slug}`} className="group block">
          <GlowCard className="overflow-hidden transition-all duration-300 group-hover:border-primary/40" contentClassName="p-0">
          <div className="h-[2px] w-full bg-primary/80" />
          {project.image_url && (
            <div className="relative h-44 overflow-hidden">
              {isVideo(project.image_url) ? (
                <video
                  src={project.image_url}
                  className="h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent transition-opacity duration-300" />
            </div>
          )}

          <div className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                {project.title}
              </h3>
              <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>

            {project.description && (
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                {project.description}
              </p>
            )}

            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.tech_stack.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-border bg-background/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-transform duration-200 hover:scale-105"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </GlowCard>
        </Link>
      </motion.div>
    </motion.div>
  );
}
