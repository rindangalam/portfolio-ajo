import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { deletePost, togglePostPublish } from "../actions";

async function PostList() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-sm text-red-400">Error: {error.message}</p>;
  }

  if (posts?.length === 0) {
    return (
      <div className="retro-card rounded p-8 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          Belum ada artikel. Klik &quot;+ New Post&quot; untuk menulis artikel pertama.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {posts?.map((post) => (
        <div
          key={post.id}
          className="retro-card flex items-center justify-between gap-4 rounded p-4"
        >
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="truncate font-display text-sm font-semibold">
                {post.title}
              </span>
              <span
                className={`shrink-0 rounded-sm border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                  post.is_published
                    ? "border-secondary/30 text-secondary"
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {post.is_published ? "Published" : "Draft"}
              </span>
              {post.is_featured && (
                <span className="shrink-0 rounded-sm border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary">
                  Featured
                </span>
              )}
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              /blog/{post.slug}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <form
              action={async () => {
                "use server";
                await togglePostPublish(post.id, post.is_published);
              }}
            >
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="h-9 border-border bg-transparent font-mono text-xs uppercase text-muted-foreground hover:text-accent"
              >
                {post.is_published ? "Unpublish" : "Publish"}
              </Button>
            </form>
            <Link href={`/admin/posts/${post.id}/edit`}>
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-border bg-transparent font-mono text-xs uppercase text-muted-foreground hover:text-secondary"
              >
                Edit
              </Button>
            </Link>
            <form
              action={async () => {
                "use server";
                await deletePost(post.id);
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

export default function PostsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground/60">
          <Link href="/admin" className="hover:text-foreground">Admin</Link>
          <span className="text-muted-foreground/30">/</span>
          <span className="text-foreground/80">Posts</span>
        </div>
        <h1 className="mt-1 font-display text-xl font-bold">Blog Posts</h1>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          Kelola artikel blog yang tampil di halaman publik.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Semua Artikel
        </h2>
        <Link href="/admin/posts/new">
          <Button className="rounded bg-accent font-mono text-[10px] uppercase tracking-wider text-background hover:bg-accent/80">
            + New Post
          </Button>
        </Link>
      </div>

      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <PostList />
      </Suspense>
    </div>
  );
}