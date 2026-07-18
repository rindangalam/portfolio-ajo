import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateEmail } from "@/lib/email-validator";
import { generateToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }

    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid input types" },
        { status: 400 },
      );
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json(
        { error: "Name must be between 2 and 100 characters" },
        { status: 400 },
      );
    }

    if (message.trim().length < 10 || message.trim().length > 2000) {
      return NextResponse.json(
        { error: "Message must be between 10 and 2000 characters" },
        { status: 400 },
      );
    }

    const emailResult = await validateEmail(email);
    if (!emailResult.valid) {
      return NextResponse.json(
        { error: emailResult.error || "Invalid email address" },
        { status: 400 },
      );
    }

    const token = generateToken();

    const supabase = await createClient();
    const { error: insertError } = await supabase.from("contact_messages").insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      is_verified: false,
      verification_token: token,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const verificationResult = await sendVerificationEmail({
      name: name.trim(),
      email: email.trim(),
      token,
    });

    if (!verificationResult.success) {
      await supabase.from("contact_messages").delete().eq("verification_token", token);

      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
