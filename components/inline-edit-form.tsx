"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, X } from "lucide-react";

interface Field {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "textarea";
  options?: { value: string; label: string }[];
  required?: boolean;
  min?: number;
  max?: number;
  span?: number;
}

interface InlineEditFormProps {
  fields: Field[];
  values: Record<string, string | number | boolean | null>;
  action: (id: string, formData: FormData) => Promise<void>;
  id: string;
}

export function InlineEditForm({ fields, values, action, id }: InlineEditFormProps) {
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  if (!editing) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setEditing(true)}
        className="h-7 border-border bg-transparent font-mono text-[10px] uppercase text-secondary hover:bg-secondary/10"
      >
        <Pencil className="mr-1 h-3 w-3" />
        Edit
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-border bg-background p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-foreground">Edit</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setEditing(false)}
            className="h-7 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form
          action={async (formData) => {
            await action(id, formData);
            setEditing(false);
            router.refresh();
          }}
          className="flex flex-col gap-3"
        >
          <div className="grid grid-cols-2 gap-3">
            {fields.map((field) => (
              <div key={field.name} className={field.span === 2 ? "col-span-2" : ""}>
                <Label htmlFor={`edit-${field.name}`} className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {field.label}
                </Label>
                {field.type === "select" ? (
                  <select
                    id={`edit-${field.name}`}
                    name={field.name}
                    defaultValue={String(values[field.name] ?? "")}
                    className="mt-1 h-8 w-full rounded-md border border-border bg-card px-2 text-sm text-foreground"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    id={`edit-${field.name}`}
                    name={field.name}
                    rows={3}
                    defaultValue={String(values[field.name] ?? "")}
                    required={field.required}
                    className="mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
                  />
                ) : (
                  <Input
                    id={`edit-${field.name}`}
                    name={field.name}
                    type={field.type ?? "text"}
                    defaultValue={String(values[field.name] ?? "")}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    className="mt-1 h-8 border-border bg-card text-sm"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="bg-accent font-mono text-[10px] uppercase text-background hover:bg-accent/80">
              Save
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditing(false)} className="border-border font-mono text-[10px] uppercase text-muted-foreground">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
