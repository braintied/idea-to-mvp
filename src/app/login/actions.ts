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

  const supabase = await createUserClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: { emailRedirectTo: `${siteUrl()}/auth/callback` },
  });
  if (error) return { status: "error", message: error.message };

  return { status: "sent", email: parsed.data };
}
