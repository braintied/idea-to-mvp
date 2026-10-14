import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { createUserClient } from "@/lib/supabase/server";
import { addNote, setStage } from "../actions";
import { AiPanel } from "./ai-panel";

const stages = ["lead", "talking", "customer", "partner", "archived"];

export default function ContactPage({ params }: PageProps<"/crm/[id]">) {
  return (
    <Suspense fallback={<p className="px-4 py-6 text-muted sm:px-6">Loading…</p>}>
      <Contact params={params} />
    </Suspense>
  );
}

async function Contact({ params }: Pick<PageProps<"/crm/[id]">, "params">) {
  const { id } = await params;
  const supabase = await createUserClient();
  const { data: contact } = await supabase.from("contacts").select("*").eq("id", id).maybeSingle();
  if (!contact) notFound();

  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .eq("contact_id", id)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <Link href="/crm" className="text-sm text-muted hover:text-foreground">
        ← All contacts
      </Link>

      <header className="mt-4 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">{contact.name}</h1>
          <p className="text-muted">
            {[contact.company, contact.email].filter(Boolean).join(" · ") || "No details yet"}
          </p>
        </div>
        <form action={setStage.bind(null, id)} className="flex gap-2">
          <select name="stage" defaultValue={contact.stage} className="rounded-lg border border-line bg-surface px-3 py-2">
            {stages.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </select>
          <button className="rounded-lg border border-line px-3 py-2 text-sm">Save</button>
        </form>
      </header>

      <AiPanel contactId={id} hasEmail={Boolean(contact.email)} />

      <form action={addNote.bind(null, id)} className="my-6 flex flex-col gap-2">
        <textarea
          name="body"
          required
          rows={3}
          placeholder="What happened? Met for coffee, they want a demo next week…"
          className="rounded-xl border border-line bg-surface px-4 py-3"
        />
        <button className="self-end rounded-lg bg-brand px-4 py-2 font-medium text-brand-ink">Add note</button>
      </form>

      <ol className="space-y-3">
        {notes.map((note) => (
          <li key={note.id} className="rounded-xl border border-line bg-surface p-4">
            <time className="text-xs text-muted">{new Date(note.created_at).toLocaleString()}</time>
            <p className="mt-1 whitespace-pre-wrap">{note.body}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
