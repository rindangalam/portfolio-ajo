"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
  galaxy?: boolean;
}

export function ParticleField({ className, particleCount = 50, galaxy = false }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    let height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      size: number;
      baseOpacity: number;
      hue: number;
      twinklePhase: number;
      twinkleSpeed: number;
      stationary: boolean;
    };

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      let x: number, y: number;
      let vx: number, vy: number;
      let size: number, baseOpacity: number;
      let isStationary: boolean;

      if (galaxy) {
        if (i < particleCount * 0.7) {
          const t = Math.random();
          const bandWidth = h * 0.15;
          const centerX = w * 0.3 + t * w * 0.4;
          const centerY = h * 0.2 + t * h * 0.6;
          x = centerX + (Math.random() - 0.5) * bandWidth;
          y = centerY + (Math.random() - 0.5) * bandWidth * 0.6;
        } else {
          x = Math.random() * w;
          y = Math.random() * h;
        }

        isStationary = Math.random() < 0.15;
        vx = isStationary ? 0 : (Math.random() - 0.5) * 0.4;
        vy = isStationary ? 0 : (Math.random() - 0.5) * 0.4;

        if (Math.random() < 0.1) {
          size = Math.random() * 2 + 3;
          baseOpacity = Math.random() * 0.3 + 0.6;
        } else {
          size = Math.random() * 1.2 + 0.3;
          baseOpacity = Math.random() * 0.5 + 0.15;
        }
      } else {
        x = Math.random() * w;
        y = Math.random() * h;
        vx = (Math.random() - 0.5) * 0.4;
        vy = (Math.random() - 0.5) * 0.4;
        size = Math.random() * 2.5 + 0.5;
        baseOpacity = Math.random() * 0.6 + 0.15;
        isStationary = false;
      }

      particles.push({
        x, y, vx, vy, size, baseOpacity,
        hue: Math.random() > 0.75 ? 35 : Math.random() > 0.5 ? 160 : 140,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 2 + 0.5,
        stationary: isStationary,
      });
    }

    const startTime = performance.now();

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, w, h);
      const elapsed = (timestamp - startTime) / 1000;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const twinkle = galaxy
          ? 0.5 + 0.5 * Math.sin(elapsed * p.twinkleSpeed + p.twinklePhase)
          : 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.baseOpacity * twinkle})`;
        ctx.fill();

        if (galaxy && p.size > 3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.baseOpacity * 0.15 * twinkle})`;
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [particleCount, galaxy]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
