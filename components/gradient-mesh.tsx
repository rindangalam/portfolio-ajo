"use client";

import { cn } from "@/lib/utils";

interface GradientMeshProps {
  className?: string;
}

export function GradientMesh({ className }: GradientMeshProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute -left-[20%] -top-[20%] h-[70%] w-[70%] rounded-full opacity-40 animate-gradient-shift"
        style={{
          background: "radial-gradient(circle, hsl(140 90% 55% / 0.3), transparent 70%)",
          filter: "blur(80px)",
          backgroundSize: "200% 200%",
        }}
      />
      <div
        className="absolute -right-[15%] top-[10%] h-[60%] w-[60%] rounded-full opacity-30 animate-gradient-shift"
        style={{
          background: "radial-gradient(circle, hsl(160 85% 50% / 0.3), transparent 70%)",
          filter: "blur(80px)",
          backgroundSize: "200% 200%",
          animationDelay: "2s",
        }}
      />
      <div
        className="absolute bottom-[0%] left-[30%] h-[50%] w-[50%] rounded-full opacity-20 animate-gradient-shift"
        style={{
          background: "radial-gradient(circle, hsl(35 90% 55% / 0.25), transparent 70%)",
          filter: "blur(80px)",
          backgroundSize: "200% 200%",
          animationDelay: "4s",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}
