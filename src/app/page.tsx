import Link from "next/link";
import { WaitlistForm } from "./waitlist-form";

// The public landing page. Ask Claude to rewrite the words from your
// brief in CLAUDE.md; keep the waitlist form.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6">
      <header className="flex items-center justify-between">
        <span className="font-semibold">Your Idea</span>
        <Link href="/crm" className="text-sm text-muted hover:text-foreground">
          Sign in
        </Link>
      </header>

      <section className="flex flex-1 flex-col justify-center gap-6 py-16">
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          The one sentence that makes someone lean in.
        </h1>
        <p className="max-w-xl text-lg text-muted">
          Who it&apos;s for, the problem they have today, and what changes for them once
          they use it. Two lines, no jargon.
        </p>
        <WaitlistForm />
      </section>

      <footer className="py-6 text-sm text-muted">© Your Idea</footer>
    </main>
  );
}
