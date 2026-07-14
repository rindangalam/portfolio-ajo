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
      <div className="h-8 w-48 skeleton-shimmer rounded-xl" />
      <div className="h-64 skeleton-shimmer rounded-xl" />
    </div>
  );
}

export default function AdminProfilePage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold">Profile Settings</h1>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileData />
      </Suspense>
    </div>
  );
}
