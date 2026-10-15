import Link from "next/link";

// Shown for any address that doesn't exist, and for a contact that was
// deleted or belongs to someone else.
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-4 py-6">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted">There&apos;s nothing at this address. Check the link, or start from the home page.</p>
      <div>
        <Link href="/" className="inline-block rounded-xl bg-brand px-5 py-3 font-medium text-brand-ink">
          Go home
        </Link>
      </div>
    </main>
  );
}
