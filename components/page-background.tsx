"use client";

import { GradientMesh } from "@/components/gradient-mesh";
import { ConstellationBackground } from "@/components/constellation-background";

export function PageBackground() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <GradientMesh />
      <ConstellationBackground />
    </div>
  );
}
