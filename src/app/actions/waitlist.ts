"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/server";

export type WaitlistState =
  | { status: "idle" }
  | { status: "joined" }
  | { status: "error"; message: string };

const signup = z.object({
  email: z.email("That doesn't look like an email address."),
  name: z.string().trim().max(200).optional(),
});

// Runs on the server when someone submits the website form.
export async function joinWaitlist(
  _previous: WaitlistState,
  form: FormData,
): Promise<WaitlistState> {
  const parsed = signup.safeParse({
    email: form.get("email"),
    name: form.get("name") || undefined,
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }
  const { email, name } = parsed.data;
  const normalized = email.toLowerCase();

  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch (setupError) {
    // Supabase isn't connected yet (missing env). Say so instead of crashing
    // the page, so the landing page can be shown before the database exists.
    console.error("waitlist not connected", setupError);
    return { status: "error", message: "The waitlist isn't open yet. Please check back soon." };
  }
  const { error } = await supabase
    .from("waitlist")
    .upsert({ email: normalized, name: name ?? null }, { onConflict: "email", ignoreDuplicates: true });
  if (error) {
    console.error("waitlist insert failed", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  try {
    await sendEmail({
      to: normalized,
      subject: "You're on the list",
      text: `Hi${name ? ` ${name}` : ""},\n\nThanks for joining. You'll be the first to hear when we open the doors.\n\nReply to this email any time; a real person reads it.`,
    });
  } catch (emailError) {
    // The signup is saved even if the welcome email fails; log it so
    // you can see why (usually: the sending domain isn't verified yet).
    console.error("welcome email failed", emailError);
  }

  return { status: "joined" };
}
