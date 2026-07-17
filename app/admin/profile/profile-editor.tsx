"use client";

import { useState, useRef } from "react";
import { updateProfile } from "../actions";
import { createClient } from "@/lib/supabase/client";

interface ProfileEditorProps {
  profile: {
    id: number;
    full_name: string | null;
    headline: string | null;
    bio: string | null;
    about_text: string | null;
    avatar_url: string | null;
    location: string | null;
    available_for_hire: boolean | null;
    status_text: string | null;
    status_busy_text: string | null;
    resume_url: string | null;
    email: string | null;
    phone: string | null;
  } | null;
}

export function ProfileEditor({ profile }: ProfileEditorProps) {
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const filePath = `avatar.${fileExt}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
    } catch (err) {
      alert("Upload failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={updateProfile} className="space-y-6">
      {/* Avatar Section */}
      <div className="retro-card rounded p-6">
        <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Avatar
        </h2>
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-border bg-background">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl text-muted-foreground">
                ?
              </div>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded border border-secondary/30 bg-secondary/10 px-4 py-2 font-mono text-xs text-secondary transition-colors hover:bg-secondary/20"
            >
              {uploading ? "Uploading..." : "Upload Photo"}
            </button>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground/60">
              JPG, PNG or GIF. Max 2MB.
            </p>
          </div>
        </div>
        <input type="hidden" name="avatar_url" value={avatarUrl} />
      </div>

      {/* Basic Info */}
      <div className="retro-card rounded p-6">
        <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Basic Info
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground">Full Name</label>
            <input name="full_name" defaultValue={profile?.full_name ?? ""} className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-secondary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground">Headline</label>
            <input name="headline" defaultValue={profile?.headline ?? ""} className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-secondary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground">Email</label>
            <input name="email" defaultValue={profile?.email ?? ""} className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-secondary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground">Phone</label>
            <input name="phone" defaultValue={profile?.phone ?? ""} className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-secondary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground">Location</label>
            <input name="location" defaultValue={profile?.location ?? ""} className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-secondary focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Bio & About */}
      <div className="retro-card rounded p-6">
        <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Bio & About
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground">Bio (short)</label>
            <textarea name="bio" rows={2} defaultValue={profile?.bio ?? ""} className="w-full resize-none rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-secondary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground">About Text (long)</label>
            <textarea name="about_text" rows={5} defaultValue={profile?.about_text ?? ""} className="w-full resize-none rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-secondary focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Availability & Links */}
      <div className="retro-card rounded p-6">
        <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Availability & Links
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="available_for_hire"
              defaultChecked={profile?.available_for_hire ?? false}
              className="h-4 w-4 rounded border-border bg-background"
            />
            <label className="font-mono text-xs text-muted-foreground">Available for Hire</label>
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground">
              Status Text (saat tersedia)
            </label>
            <input
              name="status_text"
              defaultValue={profile?.status_text ?? "Available for hire"}
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-secondary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground">
              Status Text (saat sibuk)
            </label>
            <input
              name="status_busy_text"
              defaultValue={profile?.status_busy_text ?? "Currently busy"}
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-secondary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground">Resume URL</label>
            <input name="resume_url" defaultValue={profile?.resume_url ?? ""} className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-secondary focus:outline-none" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="rounded border border-secondary/30 bg-secondary/10 px-6 py-2 font-mono text-xs uppercase tracking-wider text-secondary transition-colors hover:bg-secondary/20"
      >
        Save Profile
      </button>
    </form>
  );
}
