import { redirect } from "next/navigation";
import { Suspense } from "react";
import { supabasePublicEnv } from "@/lib/supabase/public-env";
import { getUser } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

// Already signed in? Skip the form.
async function RedirectIfSignedIn() {
  // Supabase not connected yet: nobody can be signed in. Show the form,
  // which says what's missing when someone tries it.
  try {
    supabasePublicEnv();
  } catch {
    return null;
  }
  if (await getUser()) redirect("/crm");
  return null;
}

// /login?error=link: the sign-in link didn't work (see src/app/auth/callback).
async function LinkError({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { error } = await searchParams;
  if (error !== "link") return null;
  return (
    <p role="alert" className="rounded-xl border border-line bg-surface p-4 text-sm text-danger">
      That link didn&apos;t work. Open it in the same browser you asked from, or ask for a new one
      (wait a minute between requests).
    </p>
  );
}

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4">
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="text-muted">We&apos;ll email you a link. No password to remember.</p>
      <Suspense>
        <LinkError searchParams={searchParams} />
      </Suspense>
      <LoginForm />
    </main>
  );
}
