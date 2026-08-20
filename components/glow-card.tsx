"use client";

import { useRef, useState } from "react";
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
  const shellRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50, on: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = shellRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      on: true,
    });
  };

  if (!bezel) {
    return (
      <div
        className={cn(
          "retro-card-bevel rounded relative bg-card p-6 transition-all duration-500 ease-premium",
          "hover:shadow-[4px_4px_0px_hsl(0_0%_0%/0.5),0_0_30px_hsl(0_0%_100%/0.05)]",
          className
        )}
      >
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className={cn(
        "bezel-shell transition-all duration-500 ease-premium",
        "hover:shadow-[0_0_40px_hsl(0_0%_100%/0.06)]",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSpot((s) => ({ ...s, on: false }))}
    >
      <div className={cn("bezel-core h-full", contentClassName)}>
        <div
          className="pointer-events-none absolute inset-0 rounded opacity-0 transition-opacity duration-500 ease-premium"
          style={{
            opacity: spot.on ? 1 : 0,
            background: `radial-gradient(320px circle at ${spot.x}% ${spot.y}%, hsl(82 100% 66% / 0.08), transparent 60%)`,
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}