import { createClient } from "@/lib/supabase/server";

type ProfileRow = {
  full_name: string | null;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  available_for_hire: boolean | null;
  status_text: string | null;
  status_busy_text: string | null;
  resume_url: string | null;
  about_text: string | null;
};

export async function getProfile(fields = "*") {
  const supabase = await createClient();
  const { data } = await supabase.from("profile").select(fields).eq("id", 1).single();
  return (data ?? {}) as ProfileRow;
}

export async function getSocialLinks() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("social_links")
    .select("platform, url")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getSkills() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skills")
    .select("name, category")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getAllSkills() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  return { projects: data ?? [], error };
}

export async function getFeaturedProjects() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getExperiences() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getStats() {
  const supabase = await createClient();
  const [{ count: pc }, { count: sc }, profile] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("skills").select("*", { count: "exact", head: true }),
    getProfile("available_for_hire, status_text, status_busy_text"),
  ]);
  return {
    projectCount: pc ?? 0,
    skillCount: sc ?? 0,
    availableForHire: profile?.available_for_hire === true,
    statusText: (profile?.status_text as string | undefined) ?? "Open",
    statusBusyText: (profile?.status_busy_text as string | undefined) ?? "Busy",
  };
}

// --- Blog posts ---

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  tags: string[] | null;
  is_published: boolean;
  is_featured: boolean | null;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
};

export async function getPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return data as Post[] | null;
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("is_published", true)
    .eq("slug", slug)
    .single();
  return data as Post | null;
}

export async function getAllPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  return data as Post[] | null;
}

export async function getPostById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  return data as Post | null;
}