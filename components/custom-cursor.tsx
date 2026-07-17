"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

const NODE_COUNT = 18;
const BASE_HUE = 150;

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Point[]>(
    Array.from({ length: NODE_COUNT }, () => ({ x: 0, y: 0 }))
  );
  const mouseRef = useRef({ x: -1000, y: -1000, prevX: -1000, prevY: -1000 });
  const visibleRef = useRef(true);
  const fadeRef = useRef(0);
  const hoverRef = useRef(false);
  const trailHeadRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const styleEl = document.createElement("style");
    styleEl.textContent = "* { cursor: none !important }";
    document.head.appendChild(styleEl);

    const resize = () => {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let rafIdle: ReturnType<typeof setTimeout> | null = null;

    const handleMove = (e: MouseEvent) => {
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (!visibleRef.current) {
        visibleRef.current = true;
        const cx = e.clientX;
        const cy = e.clientY;
        for (let i = 0; i < NODE_COUNT; i++) {
          nodesRef.current[i] = { x: cx, y: cy };
        }
        trailHeadRef.current = { x: cx, y: cy };
      }

      if (rafIdle) {
        clearTimeout(rafIdle);
        rafIdle = null;
      }
      rafIdle = setTimeout(() => {
        visibleRef.current = false;
      }, 1000);
    };

    const handleLeave = () => {
      visibleRef.current = false;
    };

    const handleEnter = () => {
      visibleRef.current = true;
    };

    const handleHoverIn = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.matches("a, button, input, textarea, select, [data-cursor]")) {
        hoverRef.current = true;
      }
    };

    const handleHoverOut = () => {
      hoverRef.current = false;
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave, { passive: true });
    document.addEventListener("mouseenter", handleEnter, { passive: true });
    document.addEventListener("mouseover", handleHoverIn, { passive: true });
    document.addEventListener("mouseout", handleHoverOut, { passive: true });

    let lastTime = performance.now();

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 16.67, 2);
      lastTime = timestamp;

      const w = canvas!.width;
      const h = canvas!.height;

      ctx.clearRect(0, 0, w, h);

      const m = mouseRef.current;
      const dx = m.x - m.prevX;
      const dy = m.y - m.prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      const isMoving = speed > 0.5;
      const targetFade = visibleRef.current && isMoving ? 1 : 0.2;
      fadeRef.current += (targetFade - fadeRef.current) * 0.05 * dt;

      if (fadeRef.current < 0.01) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      const headScale = hoverRef.current ? 1.6 : 1;

      trailHeadRef.current.x += (m.x - trailHeadRef.current.x) * 0.25 * dt;
      trailHeadRef.current.y += (m.y - trailHeadRef.current.y) * 0.25 * dt;

      const nodes = nodesRef.current;
      nodes[0].x += (trailHeadRef.current.x - nodes[0].x) * 0.35 * dt;
      nodes[0].y += (trailHeadRef.current.y - nodes[0].y) * 0.35 * dt;

      const lerpFactors = [0.22, 0.18, 0.16, 0.14, 0.12, 0.11, 0.1, 0.09, 0.085, 0.08, 0.075, 0.07, 0.065, 0.06, 0.055, 0.05, 0.045];

      for (let i = 1; i < NODE_COUNT; i++) {
        const f = Math.min(lerpFactors[i - 1] * dt, 0.5);
        nodes[i].x += (nodes[i - 1].x - nodes[i].x) * f;
        nodes[i].y += (nodes[i - 1].y - nodes[i].y) * f;
      }

      for (let i = 0; i < NODE_COUNT; i++) {
        const t = i / (NODE_COUNT - 1);
        const size = (7 - t * 6.2) * headScale * fadeRef.current;
        const alpha = (0.85 - t * 0.8) * fadeRef.current;
        const hue = BASE_HUE + t * 20;

        if (alpha < 0.01 || size < 0.1) continue;

        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 75%, 60%, ${alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < NODE_COUNT - 1; i++) {
        const t = i / (NODE_COUNT - 1);
        const alpha = (0.35 - t * 0.33) * fadeRef.current;
        const hue = BASE_HUE + t * 20;

        if (alpha < 0.005) continue;

        const p = nodes[i];
        const q = nodes[i + 1];
        const dist = Math.sqrt((q.x - p.x) ** 2 + (q.y - p.y) ** 2);
        const lineAlpha = Math.min(alpha, Math.max(0, 1 - dist / 60) * 0.8) * fadeRef.current;

        if (lineAlpha < 0.005) continue;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `hsla(${hue}, 70%, 55%, ${lineAlpha})`;
        ctx.lineWidth = (1.2 - t * 0.9) * headScale * fadeRef.current;
        ctx.stroke();
      }

      const head = nodes[0];
      if (fadeRef.current > 0.1) {
        ctx.beginPath();
        ctx.arc(head.x, head.y, 14 * headScale * fadeRef.current, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${BASE_HUE}, 75%, 60%, ${0.1 * fadeRef.current})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
      document.removeEventListener("mouseover", handleHoverIn);
      document.removeEventListener("mouseout", handleHoverOut);
      styleEl.remove();
      if (rafIdle) clearTimeout(rafIdle);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    />
  );
}
