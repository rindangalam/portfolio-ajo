import { createClient } from "@/lib/supabase/server";
import { ProfileEditor } from "./profile-editor";
import { Suspense } from "react";

async function ProfileData() {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .eq("id", 1)
    .single();

  return <ProfileEditor profile={profile} />;
}

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 skeleton-shimmer rounded" />
      <div className="h-64 skeleton-shimmer rounded" />
    </div>
  );
}

export default function AdminProfilePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold">Profile Settings</h1>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          Informasi profil yang ditampilkan di portofolio.
        </p>
      </div>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileData />
      </Suspense>
    </div>
  );
}
