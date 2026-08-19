"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  contentClassName?: string;
  bezel?: boolean;
}

export function GlowCard({
  children,
  className,
  glowColor = "hsl(var(--primary))",
  contentClassName,
  bezel = true,
}: GlowCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!bezel) {
    return (
      <div
        className={cn(
          "retro-card-bevel rounded relative bg-card p-6 transition-all duration-500 ease-premium",
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

  return (
    <div
      className={cn(
        "bezel-shell transition-all duration-500 ease-premium",
        "hover:shadow-[4px_4px_0px_hsl(var(--primary)/0.2),0_0_30px_hsl(var(--primary)/0.08)]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("bezel-core h-full", contentClassName)}>
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
    </div>
  );
}