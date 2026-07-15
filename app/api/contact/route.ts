import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateEmail } from "@/lib/email-validator";
import { sendContactEmail } from "@/lib/mail";

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

    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    }).catch((err) => console.error("Email notification failed:", err));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
