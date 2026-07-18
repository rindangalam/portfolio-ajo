"use client";

import { useEffect, useState } from "react";
import { GradientMesh } from "@/components/gradient-mesh";
import { ConstellationBackground } from "@/components/constellation-background";

export function PageBackground() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <GradientMesh />
      {isMobile ? null : (
        <ConstellationBackground />
      )}
    </div>
  );
}
