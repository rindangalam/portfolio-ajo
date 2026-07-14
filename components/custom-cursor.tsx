"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const TRAIL_COUNT = 5;

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 200, damping: 25, mass: 0.5 });
  const ringY = useSpring(cursorY, { stiffness: 200, damping: 25, mass: 0.5 });

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trailPos = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );
  const targetPos = useRef({ x: -100, y: -100 });
  const animFrame = useRef<number>(0);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    const tx = targetPos.current.x;
    const ty = targetPos.current.y;

    for (let i = 0; i < TRAIL_COUNT; i++) {
      const prev = i === 0 ? { x: tx, y: ty } : trailPos.current[i - 1];
      const speed = 0.15 + i * 0.04;
      trailPos.current[i].x = lerp(trailPos.current[i].x, prev.x, speed);
      trailPos.current[i].y = lerp(trailPos.current[i].y, prev.y, speed);

      const el = trailRefs.current[i];
      if (el) {
        el.style.transform = `translate(${trailPos.current[i].x - 4}px, ${trailPos.current[i].y - 4}px)`;
      }
    }

    animFrame.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animFrame.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrame.current);
    };
  }, [cursorX, cursorY, animate]);

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          className="absolute h-2 w-2 rounded-full"
          style={{
            backgroundColor: `hsla(140, 80%, 60%, ${0.35 - i * 0.06})`,
            transform: "translate(-100px, -100px)",
          }}
        />
      ))}
      <motion.div
        ref={ringRef}
        className="absolute h-9 w-9 rounded-full border border-primary/40"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <motion.div
        ref={dotRef}
        className="absolute h-2 w-2 rounded-full bg-primary"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          boxShadow: "0 0 12px hsl(var(--primary) / 0.6)",
        }}
      />
    </div>
  );
}
