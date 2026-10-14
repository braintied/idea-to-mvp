import "server-only";
import { z } from "zod";

// Every secret the app needs, checked in one place.
// If something is missing, you get a clear message naming the variable
// instead of a mystery crash somewhere else.
// Each feature reads only its own group, so the website works before
// you've set up the AI or email parts.

function read<T extends z.ZodRawShape>(feature: string, shape: T) {
  const result = z.object(shape).safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(
      `${feature} is not set up yet. Check these in .env.local (see .env.example): ${missing}`,
    );
  }
  return result.data;
}

export const supabaseAdminEnv = () =>
  read("Supabase (server)", {
    NEXT_PUBLIC_SUPABASE_URL: z.url(),
    SUPABASE_SECRET_KEY: z.string().min(1),
  });

export const emailEnv = () =>
  read("Email (Resend)", {
    RESEND_API_KEY: z.string().startsWith("re_"),
    EMAIL_FROM: z.string().min(3),
  });

export const ownerEnv = () =>
  read("Owner", {
    OWNER_EMAIL: z.email(),
  });

export const aiEnv = () =>
  read("AI", {
    ANTHROPIC_API_KEY: z.string().min(1),
    AI_MODEL: z.string().min(1),
  });

export const siteEnv = () =>
  read("Site", {
    NEXT_PUBLIC_SITE_URL: z.url(),
  });
