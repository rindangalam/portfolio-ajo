import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://rindang-alam.vercel.app";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: projects }, { data: posts }] = await Promise.all([
    supabase
      .from("projects")
      .select("slug, updated_at, created_at")
      .eq("is_published", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("posts")
      .select("slug, published_at, updated_at, created_at")
      .eq("is_published", true),
  ]);

  const projectEntries: MetadataRoute.Sitemap = (projects ?? []).map(
    (project) => ({
      url: `${BASE_URL}/projects/${project.slug}`,
      lastModified: project.updated_at ?? project.created_at ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }),
  );

  const postEntries: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updated_at ?? post.published_at ?? post.created_at ?? new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/verify`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...projectEntries,
    ...postEntries,
  ];
}
