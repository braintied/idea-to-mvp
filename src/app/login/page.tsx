import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getUser } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

// Already signed in? Skip the form.
async function RedirectIfSignedIn() {
  if (await getUser()) redirect("/crm");
  return null;
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4">
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="text-muted">We&apos;ll email you a link. No password to remember.</p>
      <LoginForm />
    </main>
  );
}
