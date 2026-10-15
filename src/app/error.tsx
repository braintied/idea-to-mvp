"use client";

import Link from "next/link";

// Shown when a page crashes. On the live site the real message is hidden
// from visitors (it could hold private details), so this says what to do
// and where the full error is.
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-4 py-6">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted">
        This page hit an error. Try again; if it keeps happening, the cause is usually a missing key or a
        database that isn&apos;t set up yet.
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
        <Link href="/" className="rounded-xl border border-line px-5 py-3">
          Go home
        </Link>
      </div>
    </main>
  );
}
