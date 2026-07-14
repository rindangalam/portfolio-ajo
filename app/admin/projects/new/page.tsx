import { createProject } from "../../actions";
import { ProjectForm } from "@/components/project-form";
import Link from "next/link";

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <Link href="/admin" className="font-mono text-xs text-muted-foreground hover:text-accent">
        &larr; Back
      </Link>
      <h1 className="font-display text-xl font-bold">Tambah Project</h1>
      <ProjectForm action={createProject} submitLabel="Create Project" />
    </div>
  );
}
