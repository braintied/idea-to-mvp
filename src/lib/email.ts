import "server-only";
import { Resend } from "resend";
import { emailEnv } from "@/lib/env";

type Email = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

// Sends one email through Resend. Throws with Resend's own message
// if it fails, so you see the real reason (unverified domain, bad key...).
export async function sendEmail({ to, subject, text, replyTo }: Email) {
  const env = emailEnv();
  const resend = new Resend(env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject,
    text,
    replyTo,
  });
  if (error) throw new Error(`Email failed: ${error.message}`);
  return data;
}
