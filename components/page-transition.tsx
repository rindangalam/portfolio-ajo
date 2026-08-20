"use client";

import { motion } from "framer-motion";

const EASE_PREMIUM = [0.32, 0.72, 0, 1] as const;

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: EASE_PREMIUM }}
    >
      {children}
    </motion.div>
  );
}