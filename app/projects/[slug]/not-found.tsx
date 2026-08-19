import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <main className="dark relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
        <p className="retro-border mb-6 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-accent">
          &gt; error 404: project not found
        </p>
        <h1 className="font-display text-7xl font-bold text-gradient-animated glow-text">
          404
        </h1>
        <p className="mt-4 font-mono text-sm text-muted-foreground">
          the project you are looking for does not exist or has been unpublished.
        </p>
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 retro-card-bevel rounded px-6 py-3 font-display text-sm font-bold text-primary transition-all duration-500 ease-premium hover:shadow-[4px_4px_0px_hsl(var(--primary)/0.4),0_0_20px_hsl(var(--primary)/0.15)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 font-mono text-[10px] text-muted-foreground transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:scale-105">
            ls
          </span>
          view all projects
        </Link>
      </div>
    </main>
  );
}