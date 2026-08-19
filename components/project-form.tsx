"use client";

import { useState } from "react";
import { Plus, Trash2, Eye, Pencil } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/image-uploader";
import { MultiImageUploader } from "@/components/multi-image-uploader";

interface ProjectSection {
  heading: string;
  content: string;
}

interface TechDetail {
  name: string;
  role: string;
  note: string;
}

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
  role: string;
  duration: string;
  year: number | null;
  highlights: string[];
  challenges: string[];
  sections: ProjectSection[];
  tech_details: TechDetail[];
}

interface ProjectFormProps {
  initialData?: ProjectFormData;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}

const TABS = [
  { id: "basic", label: "Basic Info" },
  { id: "story", label: "Story" },
  { id: "stack", label: "Stack" },
  { id: "media", label: "Media" },
  { id: "publish", label: "Publish" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const inputClass = "h-8 border-border bg-card text-sm";
const labelClass = "font-mono text-[10px] uppercase tracking-wider text-muted-foreground";

export function ProjectForm({ initialData, action, submitLabel }: ProjectFormProps) {
  const [tab, setTab] = useState<TabId>("basic");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "");
  const [screenshots, setScreenshots] = useState<string[]>(initialData?.screenshots ?? []);
  const [sections, setSections] = useState<ProjectSection[]>(
    initialData?.sections?.length ? initialData.sections : [{ heading: "", content: "" }]
  );
  const [highlights, setHighlights] = useState<string[]>(
    initialData?.highlights?.length ? initialData.highlights : [""]
  );
  const [challenges, setChallenges] = useState<string[]>(
    initialData?.challenges?.length ? initialData.challenges : [""]
  );
  const [techDetails, setTechDetails] = useState<TechDetail[]>(initialData?.tech_details ?? []);
  const [previewSection, setPreviewSection] = useState<number | null>(null);

  return (
    <form
      action={async (formData) => {
        formData.set("image_url", imageUrl);
        formData.set("screenshots", JSON.stringify(screenshots));
        formData.set(
          "sections",
          JSON.stringify(sections.filter((s) => s.content.trim() || s.heading.trim()))
        );
        formData.set("highlights", JSON.stringify(highlights.map((h) => h.trim()).filter(Boolean)));
        formData.set("challenges", JSON.stringify(challenges.map((c) => c.trim()).filter(Boolean)));
        formData.set(
          "tech_details",
          JSON.stringify(techDetails.filter((t) => t.name.trim()))
        );
        await action(formData);
      }}
      className="flex flex-col gap-4"
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-md px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
              tab === t.id
                ? "bg-accent text-background"
                : "text-muted-foreground hover:bg-accent/10 hover:text-accent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Basic Info */}
      {tab === "basic" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title" className={labelClass}>Title</Label>
              <Input id="title" name="title" defaultValue={initialData?.title ?? ""} required className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="slug" className={labelClass}>Slug</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={initialData?.slug ?? ""}
                required
                pattern="[a-z0-9-]+"
                placeholder="my-cool-project"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className={labelClass}>
              Short Description
            </Label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={initialData?.description ?? ""}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="role" className={labelClass}>Role</Label>
              <Input
                id="role"
                name="role"
                defaultValue={initialData?.role ?? ""}
                placeholder="Fullstack Developer"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="duration" className={labelClass}>Duration</Label>
              <Input
                id="duration"
                name="duration"
                defaultValue={initialData?.duration ?? ""}
                placeholder="2025 - 2026"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="year" className={labelClass}>Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                min={2000}
                max={2100}
                defaultValue={initialData?.year ?? ""}
                placeholder="2026"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="repo_url" className={labelClass}>Repo URL</Label>
              <Input id="repo_url" name="repo_url" type="url" defaultValue={initialData?.repo_url ?? ""} className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="live_url" className={labelClass}>Live URL</Label>
              <Input id="live_url" name="live_url" type="url" defaultValue={initialData?.live_url ?? ""} className={inputClass} />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Story */}
      {tab === "story" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Label className={labelClass}>Story Sections (markdown)</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                setSections((s) => [...s, { heading: "", content: "" }])
              }
              className="h-7 gap-1 text-[10px] uppercase font-mono text-accent"
            >
              <Plus size={12} /> Add Section
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {sections.map((section, i) => (
              <div key={i} className="rounded-md border border-border bg-card p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Section {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewSection(previewSection === i ? null : i)}
                      className="flex items-center gap-1 rounded px-2 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                    >
                      {previewSection === i ? <Pencil size={11} /> : <Eye size={11} />}
                      {previewSection === i ? "Edit" : "Preview"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSections((s) => s.filter((_, idx) => idx !== i))}
                      disabled={sections.length <= 1}
                      className="rounded px-2 py-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                      aria-label={`Remove section ${i + 1}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <Input
                  value={section.heading}
                  onChange={(e) =>
                    setSections((s) => s.map((sec, idx) => (idx === i ? { ...sec, heading: e.target.value } : sec)))
                  }
                  placeholder="Heading (e.g. The Problem)"
                  className="mb-2 h-8 border-border bg-background text-sm"
                />
                {previewSection === i ? (
                  <div className="min-h-[120px] rounded-md border border-border/50 bg-background px-3 py-2 text-sm text-muted-foreground">
                    {section.content.trim() ? (
                      <div className="prose-sm max-w-none space-y-3 text-sm leading-relaxed [&_h2]:font-display [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 [&_code]:rounded [&_code]:bg-card [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[11px]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <span className="text-xs italic text-muted-foreground/50">
                        No content yet — switch to Edit to write markdown.
                      </span>
                    )}
                  </div>
                ) : (
                  <textarea
                    value={section.content}
                    onChange={(e) =>
                      setSections((s) => s.map((sec, idx) => (idx === i ? { ...sec, content: e.target.value } : sec)))
                    }
                    rows={5}
                    placeholder="Markdown content..."
                    className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="long_description" className={labelClass}>
              Legacy Story (fallback if sections empty)
            </Label>
            <textarea
              id="long_description"
              name="long_description"
              rows={4}
              defaultValue={initialData?.long_description ?? ""}
              className="rounded-md border border-border bg-card px-3 py-2 font-mono text-sm text-foreground"
            />
          </div>

          <div className="rounded-md border border-border bg-card p-3">
            <div className="mb-2 flex items-center justify-between">
              <Label className={labelClass}>Key Highlights</Label>
              <button
                type="button"
                onClick={() => setHighlights((h) => [...h, ""])}
                className="flex items-center gap-1 rounded px-2 py-1 font-mono text-[10px] uppercase text-accent transition-colors hover:bg-accent/10"
              >
                <Plus size={12} /> Add
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {highlights.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={item}
                    onChange={(e) =>
                      setHighlights((h) => h.map((v, idx) => (idx === i ? e.target.value : v)))
                    }
                    placeholder="e.g. Reduced load time by 40%"
                    className="h-8 border-border bg-background text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setHighlights((h) => h.filter((_, idx) => idx !== i))}
                    disabled={highlights.length <= 1}
                    className="shrink-0 rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                    aria-label="Remove highlight"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border bg-card p-3">
            <div className="mb-2 flex items-center justify-between">
              <Label className={labelClass}>Challenges Solved</Label>
              <button
                type="button"
                onClick={() => setChallenges((c) => [...c, ""])}
                className="flex items-center gap-1 rounded px-2 py-1 font-mono text-[10px] uppercase text-accent transition-colors hover:bg-accent/10"
              >
                <Plus size={12} /> Add
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {challenges.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={item}
                    onChange={(e) =>
                      setChallenges((c) => c.map((v, idx) => (idx === i ? e.target.value : v)))
                    }
                    placeholder="e.g. Solved rate-limit bottleneck with Redis caching"
                    className="h-8 border-border bg-background text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setChallenges((c) => c.filter((_, idx) => idx !== i))}
                    disabled={challenges.length <= 1}
                    className="shrink-0 rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                    aria-label="Remove challenge"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Stack */}
      {tab === "stack" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tech_stack" className={labelClass}>
              Tech Stack (comma-separated)
            </Label>
            <Input
              id="tech_stack"
              name="tech_stack"
              defaultValue={initialData?.tech_stack?.join(", ") ?? ""}
              placeholder="Next.js, Supabase, Tailwind"
              className={inputClass}
            />
          </div>

          <div className="rounded-md border border-border bg-card p-3">
            <div className="mb-2 flex items-center justify-between">
              <Label className={labelClass}>Tech Stack Details</Label>
              <button
                type="button"
                onClick={() => setTechDetails((t) => [...t, { name: "", role: "", note: "" }])}
                className="flex items-center gap-1 rounded px-2 py-1 font-mono text-[10px] uppercase text-accent transition-colors hover:bg-accent/10"
              >
                <Plus size={12} /> Add
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {techDetails.map((td, i) => (
                <div key={i} className="flex flex-col gap-2 rounded border border-border/60 bg-background p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Detail {String(i + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTechDetails((t) => t.filter((_, idx) => idx !== i))}
                      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Remove detail"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Input
                      value={td.name}
                      onChange={(e) =>
                        setTechDetails((t) => t.map((v, idx) => (idx === i ? { ...v, name: e.target.value } : v)))
                      }
                      placeholder="Name (e.g. Next.js)"
                      className="h-8 border-border text-sm"
                    />
                    <Input
                      value={td.role}
                      onChange={(e) =>
                        setTechDetails((t) => t.map((v, idx) => (idx === i ? { ...v, role: e.target.value } : v)))
                      }
                      placeholder="Role (e.g. SSR & Routing)"
                      className="h-8 border-border text-sm"
                    />
                  </div>
                  <Input
                    value={td.note}
                    onChange={(e) =>
                      setTechDetails((t) => t.map((v, idx) => (idx === i ? { ...v, note: e.target.value } : v)))
                    }
                    placeholder="Note (optional)"
                    className="h-8 border-border text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Media */}
      {tab === "media" && (
        <div className="flex flex-col gap-4">
          <div className="rounded border border-border bg-card p-4">
            <ImageUploader
              bucket="projects"
              currentUrl={initialData?.image_url}
              onUpload={setImageUrl}
              onRemove={() => setImageUrl("")}
              label="Project Image"
              hiddenFieldName="image_url"
            />
          </div>

          <div className="rounded border border-border bg-card p-4">
            <MultiImageUploader
              bucket="projects"
              currentUrls={initialData?.screenshots}
              onChange={setScreenshots}
              label="Screenshots"
              maxImages={8}
              hiddenFieldName="screenshots"
            />
          </div>
        </div>
      )}

      {/* Tab: Publish */}
      {tab === "publish" && (
        <div className="flex flex-col gap-4">
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
        </div>
      )}
    </form>
  );
}