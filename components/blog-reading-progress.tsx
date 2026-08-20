"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function BlogReadingProgress({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.35"],
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-16 z-[90] h-[2px] origin-left"
        style={{
          scaleX,
          background:
            "linear-gradient(90deg, hsl(var(--primary)), hsl(0 0% 100% / 0.7), hsl(var(--primary)))",
        }}
      />
      <div ref={ref}>{children}</div>
    </>
  );
}