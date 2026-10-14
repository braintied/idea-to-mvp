import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import { supabaseAdminEnv } from "@/lib/env";
import { supabasePublicEnv } from "./public-env";

// The everyday client: acts as the signed-in user, so row-level
// security decides what they can see. Use this almost everywhere.
export async function createUserClient() {
  // Reading cookies first marks the page as per-request (never pre-built).
  const cookieStore = await cookies();
  const { url, publishableKey } = supabasePublicEnv();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components can't set cookies. The proxy (src/proxy.ts)
          // refreshes the session on every request, so this is safe to skip.
        }
      },
    },
  });
}

// The admin client: skips row-level security entirely.
// Only for trusted server code (the waitlist form, background jobs).
// Never import this into a component that runs in the browser.
export function createAdminClient() {
  const env = supabaseAdminEnv();
  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Returns the signed-in user, or null.
export async function getUser() {
  const supabase = await createUserClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}
