"use client";

import { cn } from "@/lib/utils";

interface GradientMeshProps {
  className?: string;
}

export function GradientMesh({ className }: GradientMeshProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute left-0 top-0 h-full w-full opacity-[0.08]"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 60px,
            hsl(140 90% 55% / 0.15) 60px,
            hsl(140 90% 55% / 0.15) 120px,
            transparent 120px,
            transparent 180px,
            hsl(160 85% 50% / 0.1) 180px,
            hsl(160 85% 50% / 0.1) 240px,
            transparent 240px,
            transparent 300px,
            hsl(35 90% 55% / 0.08) 300px,
            hsl(35 90% 55% / 0.08) 360px
          )`,
          maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      />
      <div
        className="absolute left-0 top-0 h-full w-full opacity-[0.06]"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            hsl(160 85% 50% / 0.12) 40px,
            hsl(160 85% 50% / 0.12) 80px,
            transparent 80px,
            transparent 120px,
            hsl(140 90% 55% / 0.08) 120px,
            hsl(140 90% 55% / 0.08) 160px
          )`,
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      />
      <div
        className="absolute left-[10%] top-[20%] h-[60%] w-[80%] opacity-[0.07]"
        style={{
          background: `repeating-linear-gradient(
            100deg,
            transparent 0px,
            transparent 80px,
            hsl(35 90% 55% / 0.2) 80px,
            hsl(35 90% 55% / 0.2) 85px,
            transparent 85px,
            transparent 160px,
            hsl(140 90% 55% / 0.15) 160px,
            hsl(140 90% 55% / 0.15) 165px
          )`,
          animation: "gradient-shift 12s linear infinite",
          backgroundSize: "200% 100%",
          filter: "blur(40px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}
