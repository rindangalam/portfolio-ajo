"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagicTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function MagicText({
  text,
  className,
  delay = 0,
  staggerDelay = 0.03,
  as: Tag = "span",
}: MagicTextProps) {
  const MotionTag = motion.create(Tag);

  const words = text.split(" ");

  return (
    <MotionTag className={cn("flex flex-wrap", className)} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex mr-[0.3em]">
          {word.split("").map((char, charIndex) => {
            const totalIndex =
              words.slice(0, wordIndex).reduce((acc, w) => acc + w.length, 0) +
              charIndex;
            return (
              <motion.span
                key={charIndex}
                className="inline-block"
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.4,
                  delay: delay + totalIndex * staggerDelay,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </MotionTag>
  );
}
