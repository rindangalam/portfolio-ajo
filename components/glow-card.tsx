"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({
  children,
  className,
  glowColor = "hsl(var(--primary))",
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={cardRef}
      className={cn(
        "retro-card-bevel rounded relative bg-card p-6 transition-all duration-200",
        "hover:shadow-[4px_4px_0px_hsl(var(--primary)/0.4),0_0_20px_hsl(var(--primary)/0.08)]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 rounded opacity-30 crt-overlay"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(0, 0, 0, 0.08) 1px,
              rgba(0, 0, 0, 0.08) 2px
            )`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
