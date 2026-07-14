"use client";

import { useState, useEffect } from "react";
import { SectionReveal } from "@/components/section-reveal";
import { MapPin, Clock, Briefcase } from "lucide-react";

interface LocationSectionProps {
  location: string | null;
  availableForHire: boolean;
}

export function LocationSection({ location, availableForHire }: LocationSectionProps) {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative px-5 py-16">
      <div className="mx-auto max-w-3xl">
        <SectionReveal>
          <div className="glass rounded-2xl p-8">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-secondary/20 bg-secondary/10">
                  <MapPin className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="mb-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Location
                  </p>
                  <p className="font-display text-sm font-semibold text-foreground">
                    {location ?? "Earth"}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                  <Clock className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="mb-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Local Time
                  </p>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    {currentTime || "--:--:--"}
                  </p>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cat-language/20 bg-cat-language/10">
                  <Briefcase className="h-4 w-4 text-cat-language" />
                </div>
                <div>
                  <p className="mb-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    {availableForHire && (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                      </span>
                    )}
                    <p className="font-display text-sm font-semibold text-foreground">
                      {availableForHire ? "Open to work" : "Currently busy"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
