"use server";

import { z } from "zod";
import { siteUrl } from "@/lib/env";
import { createUserClient } from "@/lib/supabase/server";

export type LoginState =
  | { status: "idle" }
  | { status: "sent"; email: string }
  | { status: "error"; message: string };

export async function sendMagicLink(_previous: LoginState, form: FormData): Promise<LoginState> {
  const parsed = z.email().safeParse(form.get("email"));
  if (!parsed.success) return { status: "error", message: "Enter a valid email address." };

  // Supabase keys or the site address not set yet: say so instead of crashing.
  let supabase: Awaited<ReturnType<typeof createUserClient>>;
  let site: string;
  try {
    supabase = await createUserClient();
    site = siteUrl();
  } catch (setupError) {
    console.error("sign-in not connected", setupError);
    return {
      status: "error",
      message: "Sign-in isn't connected yet. Run pnpm keys (or check Vercel's Supabase integration).",
    };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: { emailRedirectTo: `${site}/auth/callback` },
  });
  if (error) return { status: "error", message: error.message };

  return { status: "sent", email: parsed.data };
}
