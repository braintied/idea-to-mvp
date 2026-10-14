"use client";

import { useActionState } from "react";
import { joinWaitlist, type WaitlistState } from "./actions/waitlist";

const initial: WaitlistState = { status: "idle" };

export function WaitlistForm() {
  const [state, action, pending] = useActionState(joinWaitlist, initial);

  if (state.status === "joined") {
    return (
      <p className="rounded-xl border border-line bg-surface p-4 text-center">
        You&apos;re on the list. Check your inbox.
      </p>
    );
  }

  return (
    <form action={action} className="flex w-full flex-col gap-3 sm:flex-row">
      <input
        name="name"
        placeholder="Your name"
        autoComplete="name"
        className="flex-1 rounded-xl border border-line bg-surface px-4 py-3"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="you@example.com"
        autoComplete="email"
        className="flex-1 rounded-xl border border-line bg-surface px-4 py-3"
      />
      <button
        disabled={pending}
        className="rounded-xl bg-brand px-5 py-3 font-medium text-brand-ink disabled:opacity-60"
      >
        {pending ? "Joining…" : "Join the waitlist"}
      </button>
      {state.status === "error" && (
        <p role="alert" className="text-sm text-danger sm:basis-full">
          {state.message}
        </p>
      )}
    </form>
  );
}
