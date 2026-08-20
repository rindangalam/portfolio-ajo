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
            hsl(0 0% 100% / 0.1) 60px,
            hsl(0 0% 100% / 0.1) 120px,
            transparent 120px,
            transparent 180px,
            hsl(82 100% 66% / 0.06) 180px,
            hsl(82 100% 66% / 0.06) 240px,
            transparent 240px,
            transparent 300px,
            hsl(0 0% 100% / 0.06) 300px,
            hsl(0 0% 100% / 0.06) 360px
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
            hsl(0 0% 100% / 0.08) 40px,
            hsl(0 0% 100% / 0.08) 80px,
            transparent 80px,
            transparent 120px,
            hsl(0 0% 100% / 0.05) 120px,
            hsl(0 0% 100% / 0.05) 160px
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
            hsl(82 100% 66% / 0.14) 80px,
            hsl(82 100% 66% / 0.14) 85px,
            transparent 85px,
            transparent 160px,
            hsl(0 0% 100% / 0.1) 160px,
            hsl(0 0% 100% / 0.1) 165px
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
