"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const EASE_PREMIUM = [0.32, 0.72, 0, 1] as const;

function Hamburger({ open }: { open: boolean }) {
  return (
    <span className="relative block h-4 w-5" aria-hidden="true">
      <span
        className={cn(
          "absolute left-0 top-0 block h-[2px] w-full rounded-full bg-current transition-all duration-500 ease-premium",
          open && "top-[7px] rotate-45"
        )}
      />
      <span
        className={cn(
          "absolute bottom-0 left-0 block h-[2px] w-full rounded-full bg-current transition-all duration-500 ease-premium",
          open && "bottom-[7px] -rotate-45"
        )}
      />
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <motion.nav
        initial={{ y: -28, opacity: 0, filter: "blur(6px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: EASE_PREMIUM }}
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-premium",
          isScrolled ? "glass shadow-lg shadow-black/5 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary/30 after:to-transparent" : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="font-display text-lg font-bold text-gradient-animated">
            RANM
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-1.5 font-mono text-xs transition-all duration-300 ease-premium",
                  isActive(item.href)
                    ? "bg-secondary/15 font-semibold text-secondary"
                    : "text-muted-foreground hover:bg-secondary/5 hover:text-foreground"
                )}
              >
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={cn(
              "relative flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-all duration-500 ease-premium md:hidden",
              isMobileOpen ? "text-secondary" : "text-muted-foreground"
            )}
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
          >
            <Hamburger open={isMobileOpen} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_PREMIUM }}
            className="fixed inset-0 z-40 bg-background/85 backdrop-blur-3xl md:hidden"
          >
            <div className="flex h-full flex-col justify-center px-8">
              <div className="mb-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="h-px w-8 bg-gradient-to-r from-secondary/60 to-transparent" />
                navigation
              </div>
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * i + 0.15, duration: 0.6, ease: EASE_PREMIUM }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "group flex items-baseline gap-4 py-2 font-display text-5xl font-bold transition-colors duration-300 ease-premium",
                        isActive(item.href)
                          ? "text-primary"
                          : "text-foreground hover:text-white/80"
                      )}
                    >
                      <span className="font-mono text-xs text-muted-foreground/60">
                        0{i + 1}
                      </span>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * NAV_ITEMS.length + 0.2, duration: 0.6, ease: EASE_PREMIUM }}
                className="mt-12 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60"
              >
                <span className="text-primary">$</span> rindang.alam.dev
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}