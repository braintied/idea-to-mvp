"use client";

import Link from "next/link";

// Shown when a CRM page crashes, for example when the database tables
// don't exist yet or a key is missing. The rest of the site keeps working.
export default function CrmError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-4 py-6">
      <h1 className="text-2xl font-semibold">The CRM couldn&apos;t load</h1>
      <p className="text-muted">
        Usually this means the database isn&apos;t set up yet (deploy again, or run{" "}
        <code className="font-mono">pnpm db:push</code>) or a Supabase key is missing (run{" "}
        <code className="font-mono">pnpm keys</code>, or check Vercel → Settings → Environment Variables).
      </p>
      <p className="text-sm text-muted">
        The full error is in Vercel → Logs (or your <code className="font-mono">pnpm dev</code> Terminal)
        {error.digest ? (
          <>
            . Search for <code className="font-mono">{error.digest}</code>
          </>
        ) : null}
        .
      </p>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => retry()} className="rounded-xl bg-brand px-5 py-3 font-medium text-brand-ink">
          Try again
        </button>
        <Link href="/crm" className="rounded-xl border border-line px-5 py-3">
          All contacts
        </Link>
      </div>
    </main>
  );
}
