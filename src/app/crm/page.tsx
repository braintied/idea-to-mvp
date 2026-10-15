import Link from "next/link";
import { Suspense } from "react";
import { createAdminClient, createUserClient, getUser } from "@/lib/supabase/server";
import { ownerEnv } from "@/lib/env";
import { ActionForm } from "./action-form";
import { addContact, addWaitlistEntryToCrm, signOut } from "./actions";

async function newWaitlistSignups() {
  const { data, error } = await createAdminClient()
    .from("waitlist")
    .select("*")
    .is("added_to_crm_at", null)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  return data;
}

export default function CrmPage() {
  return (
    <Suspense fallback={<p className="px-4 py-6 text-muted sm:px-6">Loading contacts…</p>}>
      <Contacts />
    </Suspense>
  );
}

// Live data (who is signed in, their contacts) loads inside <Suspense>,
// so the page shell shows instantly and the list streams in.
async function Contacts() {
  const user = await getUser();
  const supabase = await createUserClient();
  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("*")
    .neq("stage", "archived")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  // The owner also sees new waitlist signups, ready to pull into the CRM.
  const isOwner = user?.email?.toLowerCase() === ownerEnv().OWNER_EMAIL;
  const waitlist = isOwner ? await newWaitlistSignups() : null;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
      <header className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <form action={signOut}>
          <button className="text-sm text-muted hover:text-foreground">Sign out</button>
        </form>
      </header>

      <ActionForm
        action={addContact}
        className="mb-8 grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-4"
      >
        <input name="name" required placeholder="Name" className="rounded-lg border border-line bg-background px-3 py-2" />
        <input name="email" type="email" placeholder="Email" className="rounded-lg border border-line bg-background px-3 py-2" />
        <input name="company" placeholder="Company" className="rounded-lg border border-line bg-background px-3 py-2" />
        <button className="rounded-lg bg-brand px-4 py-2 font-medium text-brand-ink">Add contact</button>
      </ActionForm>

      {waitlist && waitlist.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted">New on the waitlist</h2>
          <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {waitlist.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="min-w-0 truncate">
                  {entry.name ?? entry.email} <span className="text-muted">{entry.name ? entry.email : ""}</span>
                </span>
                <form action={addWaitlistEntryToCrm.bind(null, entry.id)}>
                  <button className="shrink-0 text-sm text-brand">Add to CRM</button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      )}

      {contacts.length === 0 ? (
        <p className="text-muted">No contacts yet. Add your first one above.</p>
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {contacts.map((contact) => (
            <li key={contact.id}>
              <Link href={`/crm/${contact.id}`} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-background">
                <span className="min-w-0 truncate">
                  <span className="font-medium">{contact.name}</span>
                  {contact.company && <span className="text-muted"> · {contact.company}</span>}
                </span>
                <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-xs text-muted">{contact.stage}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
