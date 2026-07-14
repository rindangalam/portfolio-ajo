"use client";

import { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { MapPin, Phone, Mail, Github, Linkedin, Twitter, RotateCcw } from "lucide-react";

interface HolographicIdCardProps {
  name: string;
  headline: string;
  location: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  availableForHire: boolean;
  socialLinks: { platform: string; url: string }[];
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: <Github className="h-3.5 w-3.5" />,
  linkedin: <Linkedin className="h-3.5 w-3.5" />,
  twitter: <Twitter className="h-3.5 w-3.5" />,
  email: <Mail className="h-3.5 w-3.5" />,
};

export function HolographicIdCard({
  name,
  headline,
  location,
  email,
  phone,
  avatarUrl,
  availableForHire,
  socialLinks,
}: HolographicIdCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [hueShift, setHueShift] = useState(0);
  const [shadowColor, setShadowColor] = useState("rgba(86,217,196,0.3)");

  const rotateX = useSpring(0, { stiffness: 200, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normalX = x / rect.width;
    const normalY = y / rect.height;

    rotateX.set(((y - centerY) / centerY) * -12);
    rotateY.set(((x - centerX) / centerX) * 12);
    setMousePos({ x: normalX, y: normalY });
    setHueShift((normalX - 0.5) * 60);

    // Dynamic shadow color based on mouse position (green → teal range only)
    const hue = normalX * 40 + 140; // 140 (green) to 180 (teal)
    setShadowColor(`hsla(${hue}, 50%, 55%, 0.2)`);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setHueShift(0);
    setShadowColor("rgba(86,217,196,0.3)");
  };

  const handleFlip = () => {
    if (!isFlipped) {
      rotateX.set(0);
      rotateY.set(0);
      setMousePos({ x: 0.5, y: 0.5 });
      setHueShift(0);
    }
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex justify-center"
    >
      <div style={{ perspective: "1200px" }} className={isFlipped ? "" : "animate-float"}>
        <motion.div
          ref={cardRef}
          className="relative w-[420px] cursor-pointer select-none"
          style={{
            transformStyle: "preserve-3d",
            rotateX: isFlipped ? 0 : rotateX,
          }}
          animate={{
            rotateY: isFlipped ? 180 : rotateY.get(),
          }}
          transition={{
            rotateY: isFlipped
              ? { type: "spring", stiffness: 60, damping: 20, mass: 1.2 }
              : { type: "spring", stiffness: 200, damping: 25 },
            rotateX: { type: "spring", stiffness: 200, damping: 25 },
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleFlip}
        >
          {/* === FRONT FACE === */}
          <div
            className={`card-face relative overflow-hidden rounded-2xl p-[2px] ${isFlipped ? "pointer-events-none" : ""}`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* Animated glow border */}
            <div className="absolute inset-0 rounded-2xl border-glow-animate" />

            {/* Holographic sheen — subtle brand colors */}
            <div
              className="pointer-events-none absolute inset-0 z-10 rounded-2xl mix-blend-soft-light"
              style={{
                background: `conic-gradient(from ${hueShift + 120}deg at ${mousePos.x * 100}% ${mousePos.y * 100}%, 
                  hsla(140, 60%, 60%, 0.3), 
                  hsla(160, 55%, 55%, 0.3), 
                  hsla(35, 60%, 55%, 0.3), 
                  hsla(140, 60%, 60%, 0.3))`,
                filter: `hue-rotate(${hueShift * 0.3}deg)`,
                opacity: 0.18,
              }}
            />

            {/* Holographic scanlines */}
            <div
              className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
              style={{
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(255,255,255,0.03) 2px,
                  rgba(255,255,255,0.03) 4px
                )`,
                backgroundSize: "100% 200%",
                animation: "scanline-sweep 4s linear infinite",
                opacity: 0.6,
              }}
            />

            {/* Subtle white highlight band */}
            <div
              className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
              style={{
                backgroundImage: `linear-gradient(${135 + hueShift}deg, 
                  transparent 20%, 
                  rgba(255,255,255,0.06) 45%, 
                  rgba(255,255,255,0.02) 55%, 
                  transparent 80%)`,
                backgroundPosition: `${mousePos.x * 100}% ${mousePos.y * 100}%`,
                opacity: 0.15,
              }}
            />

            {/* Internal light reflection */}
            <div
              className="pointer-events-none absolute z-10 h-[180px] w-[180px] rounded-full"
              style={{
                left: `calc(${mousePos.x * 100}% - 90px)`,
                top: `calc(${mousePos.y * 100}% - 90px)`,
                background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
                mixBlendMode: "overlay",
                transition: "left 0.1s ease-out, top 0.1s ease-out",
              }}
            />

            {/* Card content */}
            <div className="relative z-20 rounded-2xl bg-background/92 p-6 backdrop-blur-sm">
              {/* Corner brackets */}
              <span className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-secondary/70 transition-all duration-300 group-hover:border-secondary" />
              <span className="pointer-events-none absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-secondary/70 transition-all duration-300 group-hover:border-secondary" />
              <span className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-secondary/70 transition-all duration-300 group-hover:border-secondary" />
              <span className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-secondary/70 transition-all duration-300 group-hover:border-secondary" />

              <div className="flex items-center gap-5">
                {/* Avatar with glow ring */}
                <div className="relative shrink-0">
                  <div
                    className="h-24 w-24 overflow-hidden rounded-xl border-2 border-secondary/30 bg-card"
                    style={{
                      boxShadow: `0 0 30px ${shadowColor}, 0 0 40px ${shadowColor.replace("0.4", "0.15")}`,
                    }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-secondary/40">
                        {name.charAt(0)}
                      </div>
                    )}
                  </div>
                  {availableForHire && (
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-background bg-primary" />
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-xl font-bold text-foreground">{name}</h3>
                  <p className="truncate font-mono text-xs text-secondary">{headline}</p>
                  {location && (
                    <div className="mt-1.5 flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="font-mono text-[10px]">{location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              {/* Contact info + flip hint */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  {location && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="font-mono text-[10px]">{location}</span>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="h-3 w-3 shrink-0" />
                      <span className="truncate font-mono text-[10px]">{email}</span>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="h-3 w-3 shrink-0" />
                      <span className="font-mono text-[10px]">{phone}</span>
                    </div>
                  )}
                </div>
                <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/30">
                  <RotateCcw className="h-2.5 w-2.5" />
                  flip
                </span>
              </div>
            </div>
          </div>

          {/* === BACK FACE === */}
          <div
            className={`card-face absolute inset-0 overflow-hidden rounded-2xl p-[2px] ${isFlipped ? "pointer-events-auto" : "pointer-events-none"}`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Animated glow border (back) */}
            <div className="absolute inset-0 rounded-2xl border-glow-animate" />

            {/* Scanlines on back too */}
            <div
              className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
              style={{
                background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`,
                backgroundSize: "100% 200%",
                animation: "scanline-sweep 4s linear infinite",
                opacity: 0.4,
              }}
            />

            <div className="relative z-20 flex h-full flex-row items-center gap-5 rounded-2xl bg-background/92 p-6 backdrop-blur-sm">
              {/* Corner brackets */}
              <span className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-secondary/70" />
              <span className="pointer-events-none absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-secondary/70" />
              <span className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-secondary/70" />
              <span className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-secondary/70" />

              {/* QR Code */}
              <div className="shrink-0 rounded-xl border border-border bg-white p-2">
                <svg viewBox="0 0 100 100" className="h-20 w-20">
                  <rect width="100" height="100" fill="white" />
                  <rect x="5" y="5" width="25" height="25" rx="2" fill="#0E1A2B" />
                  <rect x="8" y="8" width="19" height="19" rx="1" fill="white" />
                  <rect x="11" y="11" width="13" height="13" rx="1" fill="#0E1A2B" />
                  <rect x="70" y="5" width="25" height="25" rx="2" fill="#0E1A2B" />
                  <rect x="73" y="8" width="19" height="19" rx="1" fill="white" />
                  <rect x="76" y="11" width="13" height="13" rx="1" fill="#0E1A2B" />
                  <rect x="5" y="70" width="25" height="25" rx="2" fill="#0E1A2B" />
                  <rect x="8" y="73" width="19" height="19" rx="1" fill="white" />
                  <rect x="11" y="76" width="13" height="13" rx="1" fill="#0E1A2B" />
                  <rect x="35" y="5" width="5" height="5" fill="#0E1A2B" />
                  <rect x="45" y="5" width="5" height="5" fill="#0E1A2B" />
                  <rect x="55" y="5" width="5" height="5" fill="#0E1A2B" />
                  <rect x="35" y="15" width="5" height="5" fill="#0E1A2B" />
                  <rect x="50" y="15" width="5" height="5" fill="#0E1A2B" />
                  <rect x="35" y="35" width="5" height="5" fill="#0E1A2B" />
                  <rect x="45" y="35" width="5" height="5" fill="#0E1A2B" />
                  <rect x="55" y="35" width="5" height="5" fill="#0E1A2B" />
                  <rect x="65" y="35" width="5" height="5" fill="#0E1A2B" />
                  <rect x="5" y="35" width="5" height="5" fill="#0E1A2B" />
                  <rect x="15" y="40" width="5" height="5" fill="#0E1A2B" />
                  <rect x="5" y="45" width="5" height="5" fill="#0E1A2B" />
                  <rect x="25" y="45" width="5" height="5" fill="#0E1A2B" />
                  <rect x="35" y="45" width="5" height="5" fill="#0E1A2B" />
                  <rect x="55" y="45" width="5" height="5" fill="#0E1A2B" />
                  <rect x="70" y="45" width="5" height="5" fill="#0E1A2B" />
                  <rect x="80" y="45" width="5" height="5" fill="#0E1A2B" />
                  <rect x="90" y="45" width="5" height="5" fill="#0E1A2B" />
                  <rect x="35" y="55" width="5" height="5" fill="#0E1A2B" />
                  <rect x="50" y="55" width="5" height="5" fill="#0E1A2B" />
                  <rect x="65" y="55" width="5" height="5" fill="#0E1A2B" />
                  <rect x="45" y="65" width="5" height="5" fill="#0E1A2B" />
                  <rect x="55" y="65" width="5" height="5" fill="#0E1A2B" />
                  <rect x="70" y="65" width="5" height="5" fill="#0E1A2B" />
                  <rect x="85" y="65" width="5" height="5" fill="#0E1A2B" />
                  <rect x="35" y="75" width="5" height="5" fill="#0E1A2B" />
                  <rect x="45" y="75" width="5" height="5" fill="#0E1A2B" />
                  <rect x="60" y="75" width="5" height="5" fill="#0E1A2B" />
                  <rect x="75" y="75" width="5" height="5" fill="#0E1A2B" />
                  <rect x="90" y="75" width="5" height="5" fill="#0E1A2B" />
                  <rect x="35" y="85" width="5" height="5" fill="#0E1A2B" />
                  <rect x="50" y="85" width="5" height="5" fill="#0E1A2B" />
                  <rect x="65" y="85" width="5" height="5" fill="#0E1A2B" />
                  <rect x="80" y="85" width="5" height="5" fill="#0E1A2B" />
                  <rect x="45" y="90" width="5" height="5" fill="#0E1A2B" />
                  <rect x="60" y="90" width="5" height="5" fill="#0E1A2B" />
                  <rect x="75" y="90" width="5" height="5" fill="#0E1A2B" />
                  <rect x="90" y="90" width="5" height="5" fill="#0E1A2B" />
                </svg>
              </div>

              {/* Info side */}
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Scan to view portfolio
                </p>

                <div className="h-px w-full bg-gradient-to-r from-border to-transparent" />

                {/* Social link buttons */}
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-[10px] text-muted-foreground transition-all hover:border-secondary/40 hover:bg-secondary/10 hover:text-secondary"
                    >
                      {SOCIAL_ICONS[link.platform] ?? (
                        <span className="font-mono text-[8px] uppercase">{link.platform.slice(0, 2)}</span>
                      )}
                      {link.platform}
                    </a>
                  ))}
                </div>

                <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/20">
                  <RotateCcw className="mr-1 inline h-2 w-2" />
                  click to flip back
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic shadow underneath card */}
          <div
            className="pointer-events-none absolute -bottom-4 left-4 right-4 h-10 rounded-full blur-xl transition-all duration-200"
            style={{
              background: shadowColor.replace("0.4", "0.25"),
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
