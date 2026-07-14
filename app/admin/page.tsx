import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { deleteProject, togglePublish } from "./actions";

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
      <p className="text-sm text-muted-foreground">
        No projects yet. Click &quot;+ New Project&quot; to add one.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {projects?.map((project) => (
        <div
          key={project.id}
          className="glass flex items-center justify-between gap-4 rounded-xl p-4"
        >
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold">
                {project.title}
              </span>
              <span
                className={`rounded-sm border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
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

          <div className="flex items-center gap-2">
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

async function AdminStats() {
  const supabase = await createClient();
  const [{ count: total }, { count: published }, { count: drafts }] =
    await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true),
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("is_published", false),
    ]);

  const stats = [
    { label: "Total", value: total ?? 0 },
    { label: "Published", value: published ?? 0 },
    { label: "Drafts", value: drafts ?? 0 },
  ];

  return (
    <div className="mb-6 grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="glass rounded-xl p-3 text-center"
        >
          <div className="font-display text-2xl font-bold text-accent">
            {s.value}
          </div>
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">Projects</h1>
        <Link href="/admin/projects/new">
          <Button className="rounded-xl bg-accent font-mono text-[10px] uppercase tracking-wider text-background hover:bg-accent/80">
            + New Project
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div className="mb-6 grid grid-cols-3 gap-3">{[1,2,3].map(i => <div key={i} className="h-16 skeleton-shimmer rounded-xl" />)}</div>}>
        <AdminStats />
      </Suspense>

      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <ProjectList />
      </Suspense>
    </div>
  );
}
