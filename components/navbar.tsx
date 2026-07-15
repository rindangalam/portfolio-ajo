"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

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
    <motion.nav
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        isScrolled ? "glass shadow-lg shadow-black/10 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary/30 after:to-transparent" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <a href="#hero" className="font-display text-lg font-bold text-gradient-animated">
          RANM
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "relative rounded-md px-3 py-1.5 font-mono text-xs transition-all",
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
           className="text-muted-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass overflow-hidden border-t border-border/50 md:hidden shadow-lg shadow-black/20"
          >
            <div className="flex flex-col gap-1 p-4">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 font-mono text-xs transition-all",
                    activeSection === item.id
                      ? "bg-secondary/15 font-semibold text-secondary"
                      : "text-muted-foreground hover:bg-secondary/5 hover:text-foreground"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
