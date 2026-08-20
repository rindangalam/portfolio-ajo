"use client";

import { useMemo, useState } from "react";
import { Eye, Pencil } from "lucide-react";
import { MarkdownContent } from "@/components/markdown-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/image-uploader";

interface PostFormData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  tags: string[] | null;
  is_published: boolean;
  is_featured: boolean | null;
}

interface PostFormProps {
  initialData?: PostFormData;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}

const inputClass = "h-8 border-border bg-card text-sm";
const labelClass = "font-mono text-[10px] uppercase tracking-wider text-muted-foreground";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function PostForm({ initialData, action, submitLabel }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [coverImage, setCoverImage] = useState(initialData?.cover_image ?? "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") ?? "");
  const [preview, setPreview] = useState(false);

  const slugTouched = useMemo(() => {
    return slug === "" || slug === slugify(title);
  }, [slug, title]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (slugTouched) setSlug(slugify(value));
  };

  return (
    <form
      action={async (formData) => {
        formData.set("cover_image", coverImage);
        formData.set("content", content);
        await action(formData);
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="title" className={labelClass}>Title *</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          placeholder="Post title"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="slug" className={labelClass}>Slug</Label>
        <div className="flex items-center gap-2">
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated-from-title"
            className={inputClass}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 font-mono text-[10px] text-muted-foreground"
            onClick={() => setSlug(slugify(title))}
          >
            Regenerate
          </Button>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground/60">
          URL: /blog/{slug || "your-slug"}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="excerpt" className={labelClass}>Excerpt</Label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={initialData?.excerpt ?? ""}
          rows={2}
          placeholder="Short summary shown on the blog list"
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="tags" className={labelClass}>Tags (comma separated)</Label>
        <Input
          id="tags"
          name="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="webdev, tutorial"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="content" className={labelClass}>Content (Markdown) *</Label>
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] text-muted-foreground/60">
            Supports headings, lists, code, tables, blockquotes, links.
          </p>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-secondary transition-colors hover:text-primary"
          >
            {preview ? <Pencil size={12} /> : <Eye size={12} />}
            {preview ? "Edit" : "Preview"}
          </button>
        </div>
        {preview ? (
          <div className="min-h-[280px] rounded-md border border-border bg-card p-4">
            {content.trim() ? (
              <MarkdownContent content={content} />
            ) : (
              <span className="text-xs italic text-muted-foreground/50">
                No content yet — switch to Edit to write markdown.
              </span>
            )}
          </div>
        ) : (
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={16}
            placeholder={"## Heading\n\nWrite your article in **markdown**..."}
            className="w-full rounded-md border border-border bg-card px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/50"
          />
        )}
      </div>

      <div className="rounded border border-border bg-card p-4">
        <ImageUploader
          bucket="blog"
          currentUrl={initialData?.cover_image}
          onUpload={setCoverImage}
          onRemove={() => setCoverImage("")}
          label="Cover image / video"
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
          <Label htmlFor="is_featured" className={labelClass}>Featured</Label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_published"
            name="is_published"
            defaultChecked={initialData?.is_published ?? false}
            className="h-4 w-4 rounded border-border"
          />
          <Label htmlFor="is_published" className={labelClass}>Publish</Label>
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