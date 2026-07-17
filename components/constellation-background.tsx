"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ConstellationBackgroundProps {
  className?: string;
  nodeCount?: number;
  connectionDistance?: number;
  mouseRadius?: number;
}

export function ConstellationBackground({
  className,
  nodeCount = 70,
  connectionDistance = 180,
  mouseRadius = 140,
}: ConstellationBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = window.devicePixelRatio;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;

    type Node = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
      phase: number;
    };

    const cwInit = canvas.offsetWidth;
    const chInit = canvas.offsetHeight;
    const nodes: Node[] = [];
    const clusterCount = Math.ceil(nodeCount / 10);
    for (let c = 0; c < clusterCount; c++) {
      const cx = Math.random() * cwInit;
      const cy = Math.random() * chInit;
      const count = Math.min(10, nodeCount - nodes.length);
      for (let i = 0; i < count; i++) {
        const isBright = Math.random() < 0.12;
        nodes.push({
          x: cx + (Math.random() - 0.5) * cwInit * 0.3,
          y: cy + (Math.random() - 0.5) * chInit * 0.3,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: isBright ? Math.random() * 2 + 2.5 : Math.random() * 1.5 + 0.8,
          opacity: isBright
            ? Math.random() * 0.4 + 0.6
            : Math.random() * 0.4 + 0.2,
          hue:
            Math.random() > 0.7
              ? 35
              : Math.random() > 0.5
                ? 160
                : 145,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    const startTime = performance.now();
    let mouseX = -10000;
    let mouseY = -10000;

    const getCanvasPos = (clientX: number, clientY: number) => {
      const rect = canvas!.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const handleMouse = (e: MouseEvent) => {
      const pos = getCanvasPos(e.clientX, e.clientY);
      mouseX = pos.x;
      mouseY = pos.y;
    };

    const handleLeave = () => {
      mouseX = -10000;
      mouseY = -10000;
    };

    const handleTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) {
        const pos = getCanvasPos(t.clientX, t.clientY);
        mouseX = pos.x;
        mouseY = pos.y;
      }
    };

    const handleTouchEnd = () => {
      mouseX = -10000;
      mouseY = -10000;
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("mouseleave", handleLeave, { passive: true });
    window.addEventListener("touchmove", handleTouch, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    const animate = (timestamp: number) => {
      const cw = canvas!.offsetWidth;
      const ch = canvas!.offsetHeight;
      const dpr2 = window.devicePixelRatio;

      ctx.setTransform(dpr2, 0, 0, dpr2, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      const elapsed = (timestamp - startTime) / 1000;

      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];

        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius) {
          const force = (1 - dist / mouseRadius) * 0.8;
          p.vx += (dx / dist) * force * 0.5;
          p.vy += (dy / dist) * force * 0.5;
        }

        p.vx *= 0.97;
        p.vy *= 0.97;

        p.vx += Math.sin(elapsed * 0.3 + p.phase) * 0.01;
        p.vy += Math.cos(elapsed * 0.2 + p.phase) * 0.01;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -30) p.x = cw + 30;
        if (p.x > cw + 30) p.x = -30;
        if (p.y < -30) p.y = ch + 30;
        if (p.y > ch + 30) p.y = -30;

        const twinkle = 0.7 + 0.3 * Math.sin(elapsed * 1.5 + p.phase);
        const alpha = p.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 75%, 60%, ${alpha})`;
        ctx.fill();

        if (p.size > 2.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 75%, 60%, ${alpha * 0.1})`;
          ctx.fill();
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const q = nodes[j];
          const dx2 = q.x - p.x;
          const dy2 = q.y - p.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < connectionDistance) {
            const lineAlpha = (1 - dist2 / connectionDistance) * 0.35 * ((p.opacity + q.opacity) / 2);
            const avgHue = (p.hue + q.hue) / 2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `hsla(${avgHue}, 65%, 55%, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [nodeCount, connectionDistance, mouseRadius]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
    />
  );
}
