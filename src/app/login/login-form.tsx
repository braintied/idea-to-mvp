"use client";

import { useActionState } from "react";
import { sendMagicLink, type LoginState } from "./actions";

const initial: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, action, pending] = useActionState(sendMagicLink, initial);

  if (state.status === "sent") {
    return <p>Check {state.email} for your sign-in link.</p>;
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="rounded-xl border border-line bg-surface px-4 py-3"
      />
      <button
        disabled={pending}
        className="rounded-xl bg-brand px-5 py-3 font-medium text-brand-ink disabled:opacity-60"
      >
        {pending ? "Sending…" : "Email me a link"}
      </button>
      {state.status === "error" && (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      )}
    </form>
  );
}
