import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { deleteProject, togglePublish } from "../actions";

async function ProjectList() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return <p className="text-sm text-red-400">Error: {error.message}</p>;
  }

  if (projects?.length === 0) {
    return (
      <div className="retro-card rounded p-8 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          Belum ada project. Klik &quot;+ New Project&quot; untuk membuat project pertama.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {projects?.map((project) => (
        <div
          key={project.id}
          className="retro-card flex items-center justify-between gap-4 rounded p-4"
        >
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="truncate font-display text-sm font-semibold">
                {project.title}
              </span>
              <span
                className={`shrink-0 rounded-sm border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                  project.is_published
                    ? "border-secondary/30 text-secondary"
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {project.is_published ? "Published" : "Draft"}
              </span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              /{project.slug}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <form
              action={async () => {
                "use server";
                await togglePublish(project.id, project.is_published);
              }}
            >
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="h-9 border-border bg-transparent font-mono text-xs uppercase text-muted-foreground hover:text-accent"
              >
                {project.is_published ? "Unpublish" : "Publish"}
              </Button>
            </form>
            <Link href={`/admin/projects/${project.id}/edit`}>
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-border bg-transparent font-mono text-xs uppercase text-muted-foreground hover:text-secondary"
              >
                Edit
              </Button>
            </Link>
            <form
              action={async () => {
                "use server";
                await deleteProject(project.id);
              }}
            >
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="h-9 border-border bg-transparent font-mono text-xs uppercase text-red-400 hover:bg-red-500/10"
              >
                Delete
              </Button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground/60">
          <Link href="/admin" className="hover:text-foreground">Admin</Link>
          <span className="text-muted-foreground/30">/</span>
          <span className="text-foreground/80">Projects</span>
        </div>
        <h1 className="mt-1 font-display text-xl font-bold">Projects</h1>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          Kelola project yang ditampilkan di portofolio.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Semua Project
        </h2>
        <Link href="/admin/projects/new">
          <Button className="rounded bg-accent font-mono text-[10px] uppercase tracking-wider text-background hover:bg-accent/80">
            + New Project
          </Button>
        </Link>
      </div>

      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <ProjectList />
      </Suspense>
    </div>
  );
}
