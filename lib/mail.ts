import { Resend } from "resend";

let resend: Resend | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

interface SendContactEmailParams {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail({ name, email, message }: SendContactEmailParams) {
  const client = getResend();
  if (!client) {
    console.warn("RESEND_API_KEY not set — skipping email notification");
    return { success: false, error: "Email service not configured" };
  }

  const toEmail = process.env.ADMIN_EMAIL || "rindangalam04@gmail.com";

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0e17; color: #e2e8f0; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #065f46, #0d9488, #065f46); padding: 32px; text-align: center;">
        <h1 style="color: white; font-size: 24px; margin: 0; font-weight: 700;">New Contact Message</h1>
        <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 8px;">From your portfolio contact form</p>
      </div>

      <div style="padding: 32px;">
        <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #065f46, #0d9488); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; color: white;">
              ${name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style="margin: 0; font-weight: 600; font-size: 16px;">${name}</p>
              <p style="margin: 0; color: #94a3b8; font-size: 13px;">${email}</p>
            </div>
          </div>

          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
            <p style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Message</p>
            <p style="line-height: 1.7; font-size: 15px; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>

        <div style="margin-top: 24px; text-align: center;">
          <a href="mailto:${email}?subject=Re: Your portfolio message" style="display: inline-block; background: linear-gradient(135deg, #065f46, #0d9488); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
            Reply to ${name}
          </a>
        </div>
      </div>

      <div style="padding: 16px 32px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid rgba(255,255,255,0.05);">
        Sent via your portfolio contact form • ${new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
      </div>
    </div>
  `;

  try {
    await client.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: toEmail,
      subject: `New message from ${name} — Portfolio Contact`,
      html,
      replyTo: email,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return { success: false, error };
  }
}
