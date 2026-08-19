import Link from "next/link";

export default function NotFound() {
  return (
    <main className="dark relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
        <p className="retro-border mb-6 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-accent">
          &gt; error 404: page not found
        </p>
        <h1 className="font-display text-8xl font-bold text-gradient-animated glow-text sm:text-9xl">
          404
        </h1>
        <p className="mt-6 font-mono text-sm leading-relaxed text-muted-foreground">
          <span className="text-secondary">$</span> find --path
          <span className="text-foreground"> ~/</span>
          <span className="text-primary" style={{ animation: "cursor-blink 1s step-end infinite" }}>█</span>
          <br />
          <span className="text-muted-foreground/70">
            command not found: the page you are looking for does not exist or has been moved.
          </span>
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 retro-card-bevel rounded px-6 py-3 font-display text-sm font-bold text-primary transition-all hover:shadow-[4px_4px_0px_hsl(var(--primary)/0.4),0_0_20px_hsl(var(--primary)/0.15)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            <span className="font-mono text-[10px] text-muted-foreground">~/</span>
            cd home
          </Link>
          <Link
            href="/projects"
            className="font-mono text-xs uppercase tracking-wider text-secondary transition-colors hover:text-secondary/80"
          >
            view projects
          </Link>
        </div>
      </div>
    </main>
  );
}
