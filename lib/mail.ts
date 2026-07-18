import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

const SENDER_NAME = "Alam Jo's Portfolio";
const DATE = new Date().toLocaleDateString("id-ID", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function htmlEnvelope(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
</head>
<body style="margin:0;padding:0;background-color:#0a0e17;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif">
${body}
</body>
</html>`;
}

interface SendContactEmailParams {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail({ name, email, message }: SendContactEmailParams) {
  const client = getTransporter();
  if (!client) {
    console.warn("GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email notification");
    return { success: false, error: "Email service not configured" };
  }

  const toEmail = process.env.ADMIN_EMAIL || "rindangalam04@gmail.com";

  const body = `
    <div style="max-width:600px;margin:0 auto;background-color:#0a0e17;color:#e2e8f0;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#065f46,#0d9488,#065f46);padding:32px;text-align:center;">
        <h1 style="color:white;font-size:24px;margin:0;font-weight:700;">New Contact Message</h1>
        <p style="color:rgba(255,255,255,0.8);font-size:14px;margin-top:8px;">From your portfolio contact form</p>
      </div>

      <div style="padding:32px;">
        <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:24px;border:1px solid rgba(255,255,255,0.1);">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
            <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#065f46,#0d9488);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:bold;color:white;">
              ${name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style="margin:0;font-weight:600;font-size:16px;">${name}</p>
              <p style="margin:0;color:#94a3b8;font-size:13px;">${email}</p>
            </div>
          </div>

          <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:16px;">
            <p style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Message</p>
            <p style="line-height:1.7;font-size:15px;margin:0;white-space:pre-wrap;">${message}</p>
          </div>
        </div>

        <div style="margin-top:24px;text-align:center;">
          <a href="mailto:${email}?subject=Re: Your portfolio message" style="display:inline-block;background:linear-gradient(135deg,#065f46,#0d9488);color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">
            Reply to ${name}
          </a>
        </div>
      </div>

      <div style="padding:16px 32px;text-align:center;color:#64748b;font-size:12px;border-top:1px solid rgba(255,255,255,0.05);">
        Sent via your portfolio contact form &bull; ${DATE}
      </div>
    </div>
  `;

  const html = htmlEnvelope(body);
  const text = `NEW CONTACT MESSAGE\n\nFrom: ${name} (${email})\n\nMessage:\n${message}\n\n---\nSent via your portfolio contact form on ${DATE}`;

  try {
    await client.sendMail({
      from: `"${SENDER_NAME}" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: `New portfolio message from ${name}`,
      html,
      text,
      replyTo: email,
      headers: {
        "List-Unsubscribe": `<mailto:${process.env.GMAIL_USER}?subject=unsubscribe>`,
        "X-Auto-Response-Suppress": "OOF, AutoReply",
      },
    });
    return { success: true };
  } catch (error) {
    const err = error as Error & { code?: string; response?: string };
    const detail = [err.message, err.code && `code=${err.code}`, err.response && `response=${err.response}`]
      .filter(Boolean)
      .join(" | ");
    console.error("Failed to send contact email:", detail);
    return { success: false, error: err.message };
  }
}

interface SendVerificationEmailParams {
  name: string;
  email: string;
  token: string;
}

export async function sendVerificationEmail({ name, email, token }: SendVerificationEmailParams) {
  const client = getTransporter();
  if (!client) {
    console.warn("GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping verification email");
    return { success: false, error: "Email service not configured" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/api/contact/verify?token=${token}`;

  const body = `
    <div style="max-width:600px;margin:0 auto;background-color:#0a0e17;color:#e2e8f0;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#065f46,#0d9488,#065f46);padding:32px;text-align:center;">
        <h1 style="color:white;font-size:24px;margin:0;font-weight:700;">Confirm Your Message</h1>
        <p style="color:rgba(255,255,255,0.8);font-size:14px;margin-top:8px;">Hi ${name}, please confirm that you sent this message.</p>
      </div>

      <div style="padding:32px;">
        <p style="font-size:15px;line-height:1.7;margin-bottom:24px;">
          We received a message from you through my portfolio contact form.
          To ensure it's really you and deliver it to me, please confirm by clicking the button below:
        </p>

        <div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:16px;margin-bottom:24px;font-size:13px;color:#94a3b8;line-height:1.6;">
          <strong style="color:#e2e8f0;">Sent from:</strong> <a href="mailto:${email}" style="color:#0d9488;text-decoration:underline;">${email}</a><br/>
          <strong style="color:#e2e8f0;">Time:</strong> ${DATE}
        </div>

        <div style="text-align:center;margin:32px 0;">
          <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#065f46,#0d9488);color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;">
            Confirm My Message
          </a>
        </div>

        <p style="font-size:13px;color:#94a3b8;line-height:1.6;">
          If you didn't send this message, you can safely ignore this email.
          The link will expire and the message will not be delivered.
        </p>
      </div>

      <div style="padding:16px 32px;text-align:center;color:#64748b;font-size:12px;border-top:1px solid rgba(255,255,255,0.05);">
        If the button doesn't work, copy and paste this link into your browser:<br/>
        <a href="${verifyUrl}" style="color:#0d9488;text-decoration:underline;word-break:break-all;">${verifyUrl}</a>
      </div>
    </div>
  `;

  const html = htmlEnvelope(body);
  const text = `Hi ${name},\n\nWe received a message from you through Alam Jo's portfolio contact form.\n\nSent from: ${email}\nTime: ${DATE}\n\nTo confirm you sent it, please visit this link:\n${verifyUrl}\n\nIf you didn't send this message, you can safely ignore this email.\n\n---\n${SENDER_NAME}`;

  try {
    await client.sendMail({
      from: `"${SENDER_NAME}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Please confirm your message to Alam Jo`,
      html,
      text,
      headers: {
        "List-Unsubscribe": `<mailto:${process.env.GMAIL_USER}?subject=unsubscribe>`,
        "X-Auto-Response-Suppress": "OOF, AutoReply",
      },
    });
    return { success: true };
  } catch (error) {
    const err = error as Error & { code?: string; response?: string };
    const detail = [err.message, err.code && `code=${err.code}`, err.response && `response=${err.response}`]
      .filter(Boolean)
      .join(" | ");
    console.error("Failed to send verification email:", detail);
    return { success: false, error: err.message };
  }
}
