"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Github, Linkedin, Twitter, Mail } from "lucide-react";
import { SectionReveal } from "@/components/section-reveal";

interface ContactSectionProps {
  socialLinks: { platform: string; url: string }[];
  email: string | null;
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: <Github className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  email: <Mail className="h-5 w-5" />,
};

export function ContactSection({ socialLinks, email }: ContactSectionProps) {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "verify" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("sending");
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const emailValue = formData.get("email") as string;
    setSubmittedEmail(emailValue);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: emailValue,
          message: formData.get("message"),
        }),
      });

      if (res.ok) {
        setFormState("verify");
        form.reset();
      } else {
        const data = await res.json().catch(() => null);
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        setFormState("error");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection.");
      setFormState("error");
    }
  };

  return (
    <section id="contact" className="relative px-5 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionReveal>
          <div className="mb-12 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gradient">
              Contact
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/40" />
          </div>
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground">
            Get In Touch
          </h2>
        </SectionReveal>

        <div className="grid gap-8 lg:grid-cols-2">
          <SectionReveal direction="left">
            <form onSubmit={handleSubmit} className="retro-card rounded p-8">
              {formState === "verify" ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="text-4xl">📧</div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Check Your Email
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We sent a confirmation link to{" "}
                    <span className="text-secondary">{submittedEmail}</span>.
                    Click the link to verify your message.
                  </p>
                  <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-mono text-xs font-semibold text-background transition-colors hover:bg-accent/80"
                  >
                    Open Gmail
                  </a>
                  <button
                    type="button"
                    onClick={() => setFormState("idle")}
                    className="mt-2 font-mono text-xs text-muted-foreground underline transition-colors hover:text-secondary"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block font-mono text-xs text-muted-foreground">
                    Name
                  </label>
                  <input
                    name="name"
                    required
                    className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 transition-all hover:border-secondary/40 focus:border-transparent focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs text-muted-foreground">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 transition-all hover:border-secondary/40 focus:border-transparent focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs text-muted-foreground">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    className="w-full resize-none rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 transition-all hover:border-secondary/40 focus:border-transparent focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState === "sending"}
                  className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] px-6 py-3 font-display text-sm font-bold text-background transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                  style={{ animation: "gradient-shift 4s ease infinite" }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {formState === "sending" ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Verifying & Sending...
                      </>
                    ) : formState === "sent" ? (
                      <>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        Message Sent!
                      </>
                    ) : formState === "error" ? (
                      "Try Again"
                    ) : (
                      <>
                        Send Message
                        <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </button>

                {formState === "error" && errorMessage && (
                  <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center">
                    <p className="font-mono text-xs text-red-400">
                      ⚠️ {errorMessage}
                    </p>
                  </div>
                )}
              </div>
              )}
            </form>
          </SectionReveal>

          <SectionReveal direction="right" delay={0.15}>
            <div className="flex flex-col justify-center gap-6">
              <div className="retro-card rounded p-8">
                <h3 className="mb-4 font-display text-lg font-bold text-foreground">
                  Let&apos;s Connect
                </h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  Open for project collaborations, web development orders, or just a friendly chat. Let&apos;s work together!
                  {email && (
                    <>
                      <br />
                      <a
                        href={`mailto:${email}`}
                        className="text-primary transition-colors hover:text-primary/80"
                      >
                        {email}
                      </a>
                    </>
                  )}
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 w-10 items-center justify-center retro-border bg-card text-muted-foreground transition-all duration-300 hover:border-primary/60 hover:text-primary"
                    >
                      {SOCIAL_ICONS[link.platform] ?? (
                        <span className="font-mono text-[10px] uppercase">
                          {link.platform.slice(0, 2)}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>

              <div className="retro-card rounded p-6">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
                  </span>
                  <span className="font-mono text-xs text-accent">
                    Available for new opportunities
                  </span>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
