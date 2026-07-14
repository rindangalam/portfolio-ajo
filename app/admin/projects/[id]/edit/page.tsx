import { createClient } from "@/lib/supabase/server";
import { updateProject } from "../../../actions";
import { ProjectForm } from "@/components/project-form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function EditForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) notFound();

  const updateProjectWithId = updateProject.bind(null, id);

  return (
    <ProjectForm
      initialData={{
        id: project!.id,
        title: project!.title ?? "",
        slug: project!.slug ?? "",
        description: project!.description ?? "",
        long_description: project!.long_description ?? "",
        tech_stack: project!.tech_stack ?? [],
        repo_url: project!.repo_url ?? "",
        live_url: project!.live_url ?? "",
        image_url: project!.image_url ?? null,
        screenshots: project!.screenshots ?? [],
        is_featured: project!.is_featured ?? false,
        is_published: project!.is_published ?? false,
      }}
      action={updateProjectWithId}
      submitLabel="Update Project"
    />
  );
}

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <Link href="/admin" className="font-mono text-xs text-muted-foreground hover:text-accent">
        &larr; Back
      </Link>
      <h1 className="font-display text-xl font-bold">Edit Project</h1>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <EditForm params={params} />
      </Suspense>
    </div>
  );
}
