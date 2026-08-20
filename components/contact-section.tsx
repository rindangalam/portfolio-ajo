"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Github, Linkedin, Twitter, Mail, MailCheck } from "lucide-react";
import { SectionReveal } from "@/components/section-reveal";
import { cn } from "@/lib/utils";

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

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 transition-all hover:border-white/40 focus:border-transparent focus:ring-2 focus:ring-primary/30 focus:outline-none";

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p id="field-error" className="mt-1.5 font-mono text-[11px] text-red-400" role="alert">
      {message}
    </p>
  );
}

export function ContactSection({ socialLinks, email }: ContactSectionProps) {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "verify" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = (name: string, message: string, emailValue: string): FieldErrors => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!message.trim()) next.message = "Please write a message.";
    if (!emailValue.trim()) {
      next.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      next.email = "That email doesn't look right — check it and try again.";
    }
    return next;
  };

  const handleBlur = (field: "name" | "email" | "message") => {
    if (formState === "error" || formState === "sending") return;
    setErrors((prev) => {
      const form = document.querySelector<HTMLFormElement>("#contact-form");
      if (!form) return prev;
      const fd = new FormData(form);
      const next = validate(
        String(fd.get("name") ?? ""),
        String(fd.get("message") ?? ""),
        String(fd.get("email") ?? "")
      );
      return { ...prev, [field]: next[field] };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const emailValue = formData.get("email") as string;
    const nameValue = formData.get("name") as string;
    const messageValue = formData.get("message") as string;

    const nextErrors = validate(nameValue, messageValue, emailValue);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const first = (["name", "email", "message"] as const).find((f) => nextErrors[f]);
      if (first) {
        const el = form.querySelector<HTMLElement>(`[name="${first}"]`);
        el?.focus();
      }
      return;
    }

    setFormState("sending");
    setSubmittedEmail(emailValue);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameValue, email: emailValue, message: messageValue }),
      });

      if (res.ok) {
        setFormState("verify");
        form.reset();
        setErrors({});
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
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <SectionReveal direction="left">
            <form id="contact-form" onSubmit={handleSubmit} noValidate className="retro-card rounded p-8">
              {formState === "verify" ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                    <MailCheck className="h-8 w-8 text-primary" />
                  </span>
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
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground transition-all hover:brightness-110"
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
                    <label htmlFor="contact-name" className="mb-1 block font-mono text-xs text-muted-foreground">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      className={cn(INPUT_CLASS, errors.name && "border-red-500/50 focus:ring-red-500/30")}
                      placeholder="Your name"
                      onBlur={() => handleBlur("name")}
                    />
                    <ErrorText message={errors.name} />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1 block font-mono text-xs text-muted-foreground">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      className={cn(INPUT_CLASS, errors.email && "border-red-500/50 focus:ring-red-500/30")}
                      placeholder="your@email.com"
                      onBlur={() => handleBlur("email")}
                    />
                    <ErrorText message={errors.email} />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="mb-1 block font-mono text-xs text-muted-foreground">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      aria-invalid={Boolean(errors.message)}
                      className={cn(INPUT_CLASS, "resize-none", errors.message && "border-red-500/50 focus:ring-red-500/30")}
                      placeholder="Your message..."
                      onBlur={() => handleBlur("message")}
                    />
                    <ErrorText message={errors.message} />
                  </div>

                  <button
                    type="submit"
                    disabled={formState === "sending"}
                    className="group relative w-full overflow-hidden rounded-lg bg-primary px-6 py-3 font-display text-sm font-bold text-primary-foreground transition-all duration-500 ease-premium hover:shadow-[0_0_40px_hsl(82_100%_66%/0.35)] hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {formState === "sending" ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Verifying & Sending...
                        </>
                      ) : (
                        <>
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/10 transition-transform duration-500 ease-premium group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                            <Send className="h-4 w-4" />
                          </span>
                          Send Message
                        </>
                      )}
                    </span>
                  </button>

                  {formState === "error" && errorMessage && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center" role="alert">
                      <p className="font-mono text-xs text-red-400">
                        {errorMessage}
                      </p>
                      <button
                        type="button"
                        onClick={() => setFormState("idle")}
                        className="mt-2 font-mono text-xs text-red-400 underline underline-offset-4 transition-colors hover:text-red-300"
                      >
                        Try again
                      </button>
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
                      aria-label={link.platform}
                      className="flex h-11 w-11 items-center justify-center retro-border bg-card text-muted-foreground transition-all duration-300 hover:border-primary/60 hover:text-primary"
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
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                  </span>
                  <span className="font-mono text-xs text-primary">
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