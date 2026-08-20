"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
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
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const observed = new WeakSet<Element>();

    const observeSections = () => {
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && !observed.has(el)) {
          observer.observe(el);
          observed.add(el);
        }
      }
    };

    observeSections();

    const mutationObserver = new MutationObserver(observeSections);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <>
      <motion.nav
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-premium",
          isScrolled ? "glass shadow-lg shadow-black/5 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary/30 after:to-transparent" : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <a href="#hero" className="font-display text-lg font-bold text-gradient-animated">
            RANM
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "relative rounded-md px-3 py-1.5 font-mono text-xs transition-all duration-300 ease-premium",
                  activeSection === item.id
                    ? "bg-secondary/15 font-semibold text-secondary"
                    : "text-muted-foreground hover:bg-secondary/5 hover:text-foreground"
                )}
              >
                <span className="relative z-10">{item.label}</span>
              </a>
            ))}
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-all duration-500 ease-premium md:hidden",
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
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setIsMobileOpen(false)}
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * i + 0.15, duration: 0.6, ease: EASE_PREMIUM }}
                    className={cn(
                      "group flex items-baseline gap-4 py-2 font-display text-5xl font-bold transition-colors duration-300 ease-premium",
                      activeSection === item.id
                        ? "text-primary"
                        : "text-foreground hover:text-white/80"
                    )}
                  >
                    <span className="font-mono text-xs text-muted-foreground/60">
                      0{i + 1}
                    </span>
                    {item.label}
                  </motion.a>
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