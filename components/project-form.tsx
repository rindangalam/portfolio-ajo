"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/image-uploader";
import { MultiImageUploader } from "@/components/multi-image-uploader";

interface ProjectFormData {
  id?: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  tech_stack: string[];
  repo_url: string;
  live_url: string;
  image_url: string | null;
  screenshots: string[];
  is_featured: boolean;
  is_published: boolean;
}

interface ProjectFormProps {
  initialData?: ProjectFormData;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}

export function ProjectForm({ initialData, action, submitLabel }: ProjectFormProps) {
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "");
  const [screenshots, setScreenshots] = useState<string[]>(initialData?.screenshots ?? []);

  return (
    <form
      action={async (formData) => {
        formData.set("image_url", imageUrl);
        formData.set("screenshots", JSON.stringify(screenshots));
        await action(formData);
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="title" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Title
        </Label>
        <Input
          id="title"
          name="title"
          defaultValue={initialData?.title ?? ""}
          required
          className="h-8 border-border bg-card text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="slug" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Slug
        </Label>
        <Input
          id="slug"
          name="slug"
          defaultValue={initialData?.slug ?? ""}
          required
          pattern="[a-z0-9-]+"
          placeholder="my-cool-project"
          className="h-8 border-border bg-card text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Description
        </Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initialData?.description ?? ""}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="long_description" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Long Description (Markdown)
        </Label>
        <textarea
          id="long_description"
          name="long_description"
          rows={8}
          defaultValue={initialData?.long_description ?? ""}
          className="rounded-md border border-border bg-card px-3 py-2 font-mono text-sm text-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="tech_stack" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Tech Stack (comma-separated)
        </Label>
        <Input
          id="tech_stack"
          name="tech_stack"
          defaultValue={initialData?.tech_stack?.join(", ") ?? ""}
          placeholder="Next.js, Supabase, Tailwind"
          className="h-8 border-border bg-card text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="repo_url" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Repo URL
          </Label>
          <Input
            id="repo_url"
            name="repo_url"
            type="url"
            defaultValue={initialData?.repo_url ?? ""}
            className="h-8 border-border bg-card text-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="live_url" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Live URL
          </Label>
          <Input
            id="live_url"
            name="live_url"
            type="url"
            defaultValue={initialData?.live_url ?? ""}
            className="h-8 border-border bg-card text-sm"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="rounded-lg border border-border bg-card p-4">
        <ImageUploader
          bucket="projects"
          currentUrl={initialData?.image_url}
          onUpload={setImageUrl}
          onRemove={() => setImageUrl("")}
          label="Project Image"
          hiddenFieldName="image_url"
        />
      </div>

      {/* Screenshots Upload */}
      <div className="rounded-lg border border-border bg-card p-4">
        <MultiImageUploader
          bucket="projects"
          currentUrls={initialData?.screenshots}
          onChange={setScreenshots}
          label="Screenshots"
          maxImages={8}
          hiddenFieldName="screenshots"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_featured"
            name="is_featured"
            defaultChecked={initialData?.is_featured ?? false}
            className="h-4 w-4 rounded border-border"
          />
          <Label htmlFor="is_featured" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Featured
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_published"
            name="is_published"
            defaultChecked={initialData?.is_published ?? false}
            className="h-4 w-4 rounded border-border"
          />
          <Label htmlFor="is_published" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Publish
          </Label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-fit bg-accent font-mono text-[10px] uppercase text-background hover:bg-accent/80"
      >
        {submitLabel}
      </Button>
    </form>
  );
}
