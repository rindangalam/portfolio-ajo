import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

async function AdminStats() {
  const supabase = await createClient();
  const [
    { count: total },
    { count: published },
    { count: drafts },
    { count: skills },
    { count: unreadMessages },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("is_published", false),
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false)
      .eq("is_verified", true),
  ]);

  const stats = [
    { label: "Total", value: total ?? 0 },
    { label: "Published", value: published ?? 0 },
    { label: "Drafts", value: drafts ?? 0 },
    { label: "Skills", value: skills ?? 0 },
    { label: "Unread", value: unreadMessages ?? 0 },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {stats.map((s) => (
        <Link key={s.label} href={s.label === "Unread" ? "/admin/contacts" : "/admin/projects"} className="retro-card rounded p-4 text-center transition-colors hover:bg-accent/5">
          <div className="font-display text-2xl font-bold text-accent">
            {s.value}
          </div>
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            {s.label}
          </div>
        </Link>
      ))}
    </div>
  );
}

async function RecentMessages() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("is_verified", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (!messages || messages.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`retro-card rounded p-3 ${
            msg.is_read ? "" : "border-l-2 border-l-accent"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="shrink-0 font-display text-xs font-semibold">{msg.name}</span>
            <span className="truncate font-mono text-[9px] text-secondary">{msg.email}</span>
            <span className="shrink-0 font-mono text-[9px] text-muted-foreground">
              {new Date(msg.created_at).toLocaleDateString()}
            </span>
            {!msg.is_read && (
              <span className="shrink-0 rounded-full bg-accent/15 px-1.5 py-0.5 font-mono text-[8px] uppercase text-accent">New</span>
            )}
            <span className={`shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[8px] uppercase ${msg.is_verified ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"}`}>
              {msg.is_verified ? "Verified" : "Pending"}
            </span>
          </div>
          <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">{msg.message}</p>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground/60">
          <Link href="/admin" className="hover:text-foreground">Admin</Link>
          <span className="text-muted-foreground/30">/</span>
          <span className="text-foreground/80">Dashboard</span>
        </div>
        <h1 className="mt-1 font-display text-xl font-bold">Dashboard</h1>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          Ringkasan dan akses cepat untuk mengelola portofolio.
        </p>
      </div>

      <Suspense fallback={<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">{[1,2,3,4,5].map(i => <div key={i} className="h-20 skeleton-shimmer rounded" />)}</div>}>
        <AdminStats />
      </Suspense>

      <div>
        <h2 className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/projects/new">
            <Button className="rounded bg-accent font-mono text-[10px] uppercase tracking-wider text-background hover:bg-accent/80">
              + New Project
            </Button>
          </Link>
          <Link href="/admin/skills">
            <Button variant="outline" className="rounded border-border font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-secondary">
              + New Skill
            </Button>
          </Link>
          <Link href="/admin/experiences">
            <Button variant="outline" className="rounded border-border font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-secondary">
              + New Experience
            </Button>
          </Link>
          <Link href="/admin/social-links">
            <Button variant="outline" className="rounded border-border font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-secondary">
              + Social Link
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pesan Terbaru
          </h2>
          <Link href="/admin/contacts" className="font-mono text-[10px] uppercase tracking-wider text-accent hover:underline">
            Lihat semua
          </Link>
        </div>
        <Suspense fallback={null}>
          <RecentMessages />
        </Suspense>
      </div>
    </div>
  );
}
