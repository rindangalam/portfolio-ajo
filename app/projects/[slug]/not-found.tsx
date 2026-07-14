import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function ProjectNotFound() {
  return (
    <div className="dark">
      <div className="flex min-h-screen flex-col items-center justify-center px-5">
        <h1 className="font-display text-4xl font-bold text-fg-primary">404</h1>
        <p className="mt-2 font-mono text-sm text-fg-muted">Project not found</p>
        <Link
          href="/"
          className="mt-6 font-mono text-xs uppercase tracking-wider text-accent-amber hover:underline"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
