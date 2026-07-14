import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createExperience, deleteExperience, updateExperience } from "../actions";
import { Suspense } from "react";
import { InlineEditForm } from "@/components/inline-edit-form";

const EXP_FIELDS = [
  { name: "company", label: "Company", required: true },
  { name: "role", label: "Role", required: true },
  { name: "description", label: "Description", type: "textarea" as const, span: 2 },
  { name: "start_date", label: "Start Date", type: "date" as const, required: true },
  { name: "end_date", label: "End Date", type: "date" as const },
  { name: "sort_order", label: "Order", type: "number" as const },
];

async function ExperienceList() {
  const supabase = await createClient();
  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });

  if (!experiences || experiences.length === 0) {
    return <p className="text-sm text-muted-foreground">No experiences yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {experiences.map((exp) => (
        <div
          key={exp.id}
          className="glass flex items-center justify-between rounded-xl p-4"
        >
          <div>
            <span className="font-display text-sm font-semibold">{exp.role}</span>
            <span className="ml-2 font-mono text-[10px] text-accent">{exp.company}</span>
            <span className="ml-2 font-mono text-[10px] text-muted-foreground">
              {exp.start_date} — {exp.is_current ? "Present" : exp.end_date ?? "—"}
            </span>
          </div>
          <div className="flex gap-2">
            <InlineEditForm
              id={exp.id}
              fields={EXP_FIELDS}
              values={{ ...exp, is_current: exp.is_current }}
              action={updateExperience}
            />
            <form
              action={async () => {
                "use server";
                await deleteExperience(exp.id);
              }}
            >
              <Button type="submit" variant="outline" size="sm" className="h-9 border-border bg-transparent font-mono text-xs uppercase text-red-400 hover:bg-red-500/10">
                Delete
              </Button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ExperiencesPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-xl font-bold">Experiences</h1>

      <form action={createExperience} className="glass rounded-xl p-6 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="company" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Company</Label>
            <Input id="company" name="company" required className="mt-1 h-8 border-border bg-card text-sm" />
          </div>
          <div>
            <Label htmlFor="role" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Role</Label>
            <Input id="role" name="role" required className="mt-1 h-8 border-border bg-card text-sm" />
          </div>
        </div>
        <div>
          <Label htmlFor="description" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Description</Label>
          <textarea id="description" name="description" rows={3} className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="start_date" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Start Date</Label>
            <Input id="start_date" name="start_date" type="date" required className="mt-1 h-8 border-border bg-card text-sm" />
          </div>
          <div>
            <Label htmlFor="end_date" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">End Date</Label>
            <Input id="end_date" name="end_date" type="date" className="mt-1 h-8 border-border bg-card text-sm" />
          </div>
          <div>
            <Label htmlFor="sort_order" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Order</Label>
            <Input id="sort_order" name="sort_order" type="number" defaultValue={0} className="mt-1 h-8 w-16 border-border bg-card text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_current" name="is_current" className="h-4 w-4" />
          <Label htmlFor="is_current" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Currently working here</Label>
        </div>
        <Button type="submit" className="w-fit bg-accent font-mono text-xs uppercase text-background hover:bg-accent/80">Add Experience</Button>
      </form>

      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <ExperienceList />
      </Suspense>
    </div>
  );
}
