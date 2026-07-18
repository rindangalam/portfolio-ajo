import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendContactEmail } from "@/lib/mail";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/verify?status=invalid", request.url));
  }

  const supabase = await createClient();

  const { data: message, error: findError } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("verification_token", token)
    .single();

  if (findError || !message) {
    return NextResponse.redirect(new URL("/verify?status=invalid", request.url));
  }

  if (message.is_verified) {
    return NextResponse.redirect(new URL("/verify?status=already", request.url));
  }

  const { error: updateError } = await supabase
    .from("contact_messages")
    .update({
      is_verified: true,
      verified_at: new Date().toISOString(),
    })
    .eq("id", message.id);

  if (updateError) {
    return NextResponse.redirect(new URL("/verify?status=error", request.url));
  }

  const emailResult = await sendContactEmail({
    name: message.name,
    email: message.email,
    message: message.message,
  });

  if (!emailResult.success) {
    console.error("Admin notification failed:", emailResult.error);
  }

  return NextResponse.redirect(new URL("/verify?status=success", request.url));
}
