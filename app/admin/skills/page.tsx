import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSkill, deleteSkill, updateSkill } from "../actions";
import { Suspense } from "react";
import { InlineEditForm } from "@/components/inline-edit-form";

const SKILL_FIELDS = [
  { name: "name", label: "Name", required: true },
  { name: "category", label: "Category", type: "select" as const, options: [
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "database", label: "Database" },
    { value: "devops", label: "DevOps" },
    { value: "other", label: "Other" },
  ]},
  { name: "proficiency", label: "Level (1-5)", type: "number" as const, min: 1, max: 5 },
  { name: "sort_order", label: "Order", type: "number" as const },
];

async function SkillList() {
  const supabase = await createClient();
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  if (!skills || skills.length === 0) {
    return <p className="text-sm text-muted-foreground">No skills yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {skills.map((skill) => (
        <div
          key={skill.id}
          className="glass flex items-center justify-between rounded-xl p-4"
        >
          <div>
            <span className="font-display text-sm font-semibold">{skill.name}</span>
            <span className="ml-2 rounded-full border border-accent/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
              {skill.category}
            </span>
            <span className="ml-2 font-mono text-[10px] text-muted-foreground">
              Lvl {skill.proficiency}/5
            </span>
          </div>
          <div className="flex gap-2">
            <InlineEditForm
              id={skill.id}
              fields={SKILL_FIELDS}
              values={skill}
              action={updateSkill}
            />
            <form
              action={async () => {
                "use server";
                await deleteSkill(skill.id);
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

export default function SkillsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-xl font-bold">Skills</h1>

      <form action={createSkill} className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor="name" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Name</Label>
          <Input id="name" name="name" required className="mt-1 h-8 border-border bg-card text-sm" />
        </div>
        <div>
          <Label htmlFor="category" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Category</Label>
          <select id="category" name="category" className="mt-1 h-8 rounded-md border border-border bg-card px-2 text-sm text-foreground">
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="database">Database</option>
            <option value="devops">DevOps</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <Label htmlFor="proficiency" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Level (1-5)</Label>
          <Input id="proficiency" name="proficiency" type="number" min={1} max={5} defaultValue={3} className="mt-1 h-8 w-16 border-border bg-card text-sm" />
        </div>
        <div>
          <Label htmlFor="sort_order" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Order</Label>
          <Input id="sort_order" name="sort_order" type="number" defaultValue={0} className="mt-1 h-8 w-16 border-border bg-card text-sm" />
        </div>
        <Button type="submit" className="bg-accent font-mono text-xs uppercase text-background hover:bg-accent/80">Add</Button>
      </form>

      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <SkillList />
      </Suspense>
    </div>
  );
}
