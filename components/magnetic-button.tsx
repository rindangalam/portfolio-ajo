"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  href?: string;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  href,
  onClick,
}: MagneticButtonProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    e.currentTarget.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "translate(0px, 0px)";
  };

  const Tag = href ? "a" : "button";

  return (
    <motion.div
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <Tag
        href={href}
        onClick={onClick}
        className={cn(
          "group relative inline-flex items-center gap-2",
          "rounded-lg border border-primary/30 bg-primary/10",
          "px-6 py-3 font-display text-sm font-semibold text-primary",
          "transition-all duration-300",
          "hover:border-primary/60 hover:bg-primary/20 hover:shadow-[0_0_40px_hsl(var(--primary)/0.3)]",
          "active:scale-95",
          className
        )}
      >
        {children}
      </Tag>
    </motion.div>
  );
}
