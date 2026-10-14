import { z } from "zod";

// These two values are safe to show in the browser (that's what
// NEXT_PUBLIC_ means). Next.js copies them into the page at build time,
// so they have to be written out by name like this.
const schema = z.object({
  url: z.url(),
  publishableKey: z.string().min(1),
});

export function supabasePublicEnv() {
  const result = schema.safeParse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
  if (!result.success) {
    throw new Error(
      "Supabase is not set up yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local (see .env.example).",
    );
  }
  return result.data;
}
