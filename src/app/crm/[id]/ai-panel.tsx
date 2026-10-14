"use client";

import { useState, useTransition } from "react";
import { draft, sendFollowUp, summarize } from "../actions";

type Draft = { subject: string; body: string };

// The AI buttons on a contact page. Nothing is sent without you
// reading and editing the draft first.
export function AiPanel({ contactId, hasEmail }: { contactId: string; hasEmail: boolean }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [followUp, setFollowUp] = useState<Draft | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  // Each action returns { ok: true, value } or { ok: false, error }.
  const run = <T,>(action: () => Promise<{ ok: true; value: T } | { ok: false; error: string }>, done: (value: T) => void) =>
    start(async () => {
      setMessage(null);
      const result = await action();
      if (result.ok) done(result.value);
      else setMessage(result.error);
    });

  return (
    <section className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex flex-wrap gap-2">
        <button
          disabled={pending}
          onClick={() => run(() => summarize(contactId), setSummary)}
          className="rounded-lg border border-line px-3 py-2 text-sm disabled:opacity-60"
        >
          Summarize
        </button>
        {hasEmail && (
          <button
            disabled={pending}
            onClick={() => run(() => draft(contactId), setFollowUp)}
            className="rounded-lg border border-line px-3 py-2 text-sm disabled:opacity-60"
          >
            Draft follow-up
          </button>
        )}
        {pending && <span className="self-center text-sm text-muted">Thinking…</span>}
      </div>

      {summary && <p className="mt-4 whitespace-pre-wrap">{summary}</p>}

      {followUp && (
        <form
          action={(form) =>
            run(
              () => sendFollowUp(contactId, form),
              () => {
                setFollowUp(null);
                setMessage("Sent, and logged as a note.");
              },
            )
          }
          className="mt-4 flex flex-col gap-2"
        >
          <input
            name="subject"
            defaultValue={followUp.subject}
            className="rounded-lg border border-line bg-background px-3 py-2"
          />
          <textarea
            name="body"
            defaultValue={followUp.body}
            rows={8}
            className="rounded-lg border border-line bg-background px-3 py-2"
          />
          <button disabled={pending} className="self-end rounded-lg bg-brand px-4 py-2 font-medium text-brand-ink">
            Send
          </button>
        </form>
      )}

      {message && (
        <p role="status" className="mt-3 text-sm text-muted">
          {message}
        </p>
      )}
    </section>
  );
}
