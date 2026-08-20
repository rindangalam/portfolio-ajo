import { createClient } from "@/lib/supabase/server";
import { updatePost } from "../../../actions";
import { PostForm } from "@/components/post-form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function EditForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  const updatePostWithId = updatePost.bind(null, id);

  return (
    <PostForm
      initialData={{
        id: post!.id,
        title: post!.title ?? "",
        slug: post!.slug ?? "",
        excerpt: post!.excerpt ?? null,
        content: post!.content ?? "",
        cover_image: post!.cover_image ?? null,
        tags: post!.tags ?? [],
        is_published: post!.is_published ?? false,
        is_featured: post!.is_featured ?? false,
      }}
      action={updatePostWithId}
      submitLabel="Update Post"
    />
  );
}

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Link href="/admin/posts" className="font-mono text-xs text-muted-foreground hover:text-accent">
        &larr; Back
      </Link>
      <h1 className="font-display text-xl font-bold">Edit Artikel</h1>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <EditForm params={params} />
      </Suspense>
    </div>
  );
}