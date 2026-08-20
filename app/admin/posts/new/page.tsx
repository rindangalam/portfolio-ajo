import { createPost } from "../../actions";
import { PostForm } from "@/components/post-form";
import Link from "next/link";

export default function NewPostPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Link href="/admin/posts" className="font-mono text-xs text-muted-foreground hover:text-accent">
        &larr; Back
      </Link>
      <h1 className="font-display text-xl font-bold">Tulis Artikel</h1>
      <PostForm action={createPost} submitLabel="Create Post" />
    </div>
  );
}