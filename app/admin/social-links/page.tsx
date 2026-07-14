import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSocialLink, deleteSocialLink, updateSocialLink } from "../actions";
import { Suspense } from "react";
import { InlineEditForm } from "@/components/inline-edit-form";

const SOCIAL_FIELDS = [
  { name: "platform", label: "Platform", type: "select" as const, required: true, options: [
    { value: "github", label: "GitHub" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "twitter", label: "Twitter" },
    { value: "email", label: "Email" },
    { value: "discord", label: "Discord" },
    { value: "instagram", label: "Instagram" },
  ]},
  { name: "url", label: "URL", type: "text" as const, required: true },
  { name: "sort_order", label: "Order", type: "number" as const },
];

async function SocialLinkList() {
  const supabase = await createClient();
  const { data: links } = await supabase
    .from("social_links")
    .select("*")
    .order("sort_order", { ascending: true });

  if (!links || links.length === 0) {
    return <p className="text-sm text-muted-foreground">No social links yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {links.map((link) => (
        <div
          key={link.id}
          className="glass flex items-center justify-between rounded-xl p-4"
        >
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-accent">{link.platform}</span>
            <span className="ml-2 font-mono text-[10px] text-muted-foreground">{link.url}</span>
          </div>
          <div className="flex gap-2">
            <InlineEditForm
              id={link.id}
              fields={SOCIAL_FIELDS}
              values={link}
              action={updateSocialLink}
            />
            <form
              action={async () => {
                "use server";
                await deleteSocialLink(link.id);
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

export default function SocialLinksPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-xl font-bold">Social Links</h1>

      <form action={createSocialLink} className="flex items-end gap-3">
        <div>
          <Label htmlFor="platform" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Platform</Label>
          <select id="platform" name="platform" className="mt-1 h-8 rounded-md border border-border bg-card px-2 text-sm text-foreground">
            <option value="github">GitHub</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter</option>
            <option value="email">Email</option>
            <option value="discord">Discord</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>
        <div>
          <Label htmlFor="url" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">URL</Label>
          <Input id="url" name="url" type="url" required className="mt-1 h-8 w-64 border-border bg-card text-sm" />
        </div>
        <div>
          <Label htmlFor="sort_order" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Order</Label>
          <Input id="sort_order" name="sort_order" type="number" defaultValue={0} className="mt-1 h-8 w-16 border-border bg-card text-sm" />
        </div>
        <Button type="submit" className="bg-accent font-mono text-xs uppercase text-background hover:bg-accent/80">Add</Button>
      </form>

      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <SocialLinkList />
      </Suspense>
    </div>
  );
}
