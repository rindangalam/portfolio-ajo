import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const DEFAULT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#0a0a0b"/>
  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="22" font-weight="bold" fill="hsl(140,80%,60%)">R</text>
</svg>`;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profile")
      .select("avatar_url")
      .eq("id", 1)
      .single();

    if (profile?.avatar_url) {
      const res = await fetch(profile.avatar_url);
      if (res.ok) {
        const blob = await res.blob();
        return new NextResponse(blob, {
          headers: {
            "Content-Type": res.headers.get("Content-Type") ?? "image/png",
            "Cache-Control": "public, max-age=300, s-maxage=300",
          },
        });
      }
    }
  } catch {
    // fallback to default favicon
  }

  return new NextResponse(DEFAULT_SVG, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
