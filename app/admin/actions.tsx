"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseCommaSeperated(raw: string) {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseScreenshots(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// --- Projects ---

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").insert({
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    long_description: formData.get("long_description") as string,
    tech_stack: parseCommaSeperated(formData.get("tech_stack") as string),
    repo_url: formData.get("repo_url") as string,
    live_url: formData.get("live_url") as string,
    image_url: formData.get("image_url") as string,
    screenshots: parseScreenshots(formData.get("screenshots") as string),
    is_featured: formData.get("is_featured") === "on",
    is_published: formData.get("is_published") === "on",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      long_description: formData.get("long_description") as string,
      tech_stack: parseCommaSeperated(formData.get("tech_stack") as string),
      repo_url: formData.get("repo_url") as string,
      live_url: formData.get("live_url") as string,
      image_url: formData.get("image_url") as string,
      screenshots: parseScreenshots(formData.get("screenshots") as string),
      is_featured: formData.get("is_featured") === "on",
      is_published: formData.get("is_published") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function togglePublish(id: string, current: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ is_published: !current })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
}

// --- Skills ---

export async function createSkill(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("skills").insert({
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    proficiency: Number(formData.get("proficiency")) || 3,
    sort_order: Number(formData.get("sort_order")) || 0,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/");
  redirect("/admin/skills");
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/");
  redirect("/admin/skills");
}

export async function updateSkill(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("skills")
    .update({
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      proficiency: Number(formData.get("proficiency")) || 3,
      sort_order: Number(formData.get("sort_order")) || 0,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/");
  redirect("/admin/skills");
}

// --- Experiences ---

export async function createExperience(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("experiences").insert({
    company: formData.get("company") as string,
    role: formData.get("role") as string,
    description: formData.get("description") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string || null,
    is_current: formData.get("is_current") === "on",
    sort_order: Number(formData.get("sort_order")) || 0,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/experiences");
  revalidatePath("/");
  redirect("/admin/experiences");
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/experiences");
  revalidatePath("/");
  redirect("/admin/experiences");
}

export async function updateExperience(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("experiences")
    .update({
      company: formData.get("company") as string,
      role: formData.get("role") as string,
      description: formData.get("description") as string,
      start_date: formData.get("start_date") as string,
      end_date: (formData.get("end_date") as string) || null,
      is_current: formData.get("is_current") === "on",
      sort_order: Number(formData.get("sort_order")) || 0,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/experiences");
  revalidatePath("/");
  redirect("/admin/experiences");
}

// --- Social Links ---

export async function createSocialLink(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("social_links").insert({
    platform: formData.get("platform") as string,
    url: formData.get("url") as string,
    sort_order: Number(formData.get("sort_order")) || 0,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/social-links");
  revalidatePath("/");
  redirect("/admin/social-links");
}

export async function deleteSocialLink(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/social-links");
  revalidatePath("/");
  redirect("/admin/social-links");
}

export async function updateSocialLink(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("social_links")
    .update({
      platform: formData.get("platform") as string,
      url: formData.get("url") as string,
      sort_order: Number(formData.get("sort_order")) || 0,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/social-links");
  revalidatePath("/");
  redirect("/admin/social-links");
}

// --- Contact Messages ---

export async function markMessageRead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/contacts");
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/contacts");
}

// --- Profile ---

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profile")
    .update({
      full_name: formData.get("full_name") as string,
      headline: formData.get("headline") as string,
      bio: formData.get("bio") as string,
      about_text: formData.get("about_text") as string,
      avatar_url: formData.get("avatar_url") as string,
      location: formData.get("location") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      available_for_hire: formData.get("available_for_hire") === "on",
      resume_url: formData.get("resume_url") as string,
    })
    .eq("id", 1);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/profile");
  revalidatePath("/");
  redirect("/admin/profile");
}
