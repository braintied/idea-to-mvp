"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { draftFollowUp, summarizeContact } from "@/lib/ai";
import { sendEmail } from "@/lib/email";
import { ownerEnv } from "@/lib/env";
import { createAdminClient, createUserClient, getUser } from "@/lib/supabase/server";

// Every action here runs as the signed-in user, so row-level security
// guarantees they can only touch their own contacts and notes.

const stages = ["lead", "talking", "customer", "partner", "archived"] as const;

const newContact = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.union([z.email(), z.literal("")]),
  company: z.string().trim().max(200),
});

export async function addContact(form: FormData) {
  const parsed = newContact.parse({
    name: form.get("name"),
    email: form.get("email") ?? "",
    company: form.get("company") ?? "",
  });
  const supabase = await createUserClient();
  const { data, error } = await supabase
    .from("contacts")
    .insert({ name: parsed.name, email: parsed.email || null, company: parsed.company || null })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  redirect(`/crm/${data.id}`);
}

export async function addNote(contactId: string, form: FormData) {
  const body = z.string().trim().min(1).max(10000).parse(form.get("body"));
  const supabase = await createUserClient();
  const { error } = await supabase.from("notes").insert({ contact_id: contactId, body });
  if (error) throw new Error(error.message);
  revalidatePath(`/crm/${contactId}`);
}

export async function setStage(contactId: string, form: FormData) {
  const stage = z.enum(stages).parse(form.get("stage"));
  const supabase = await createUserClient();
  const { error } = await supabase.from("contacts").update({ stage }).eq("id", contactId);
  if (error) throw new Error(error.message);
  revalidatePath(`/crm/${contactId}`);
  revalidatePath("/crm");
}

// Waitlist → CRM. Only the owner (OWNER_EMAIL) can see the waitlist.
export async function addWaitlistEntryToCrm(entryId: string) {
  const user = await getUser();
  if (!user || user.email !== ownerEnv().OWNER_EMAIL) throw new Error("Only the owner can do this.");

  const admin = createAdminClient();
  const { data: entry, error } = await admin.from("waitlist").select("*").eq("id", entryId).single();
  if (error) throw new Error(error.message);

  const supabase = await createUserClient();
  const { error: insertError } = await supabase.from("contacts").insert({
    name: entry.name ?? entry.email,
    email: entry.email,
    stage: "lead",
  });
  if (insertError) throw new Error(insertError.message);

  await admin.from("waitlist").update({ added_to_crm_at: new Date().toISOString() }).eq("id", entryId);
  revalidatePath("/crm");
}

async function loadContact(contactId: string) {
  const supabase = await createUserClient();
  const [{ data: contact, error }, { data: notes, error: notesError }] = await Promise.all([
    supabase.from("contacts").select("*").eq("id", contactId).single(),
    supabase
      .from("notes")
      .select("*")
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);
  if (error) throw new Error(error.message);
  if (notesError) throw new Error(notesError.message);
  return { contact, notes };
}

export async function summarize(contactId: string) {
  const { contact, notes } = await loadContact(contactId);
  return summarizeContact(contact, notes);
}

export async function draft(contactId: string) {
  const user = await getUser();
  if (!user?.email) throw new Error("Sign in first.");
  const { contact, notes } = await loadContact(contactId);
  return draftFollowUp(contact, notes, user.email);
}

const outgoing = z.object({
  subject: z.string().trim().min(1).max(300),
  body: z.string().trim().min(1).max(10000),
});

// Sends the (edited) draft, logs it as a note, and marks the contact
// as contacted today so the daily digest stops nagging about them.
export async function sendFollowUp(contactId: string, form: FormData) {
  const user = await getUser();
  if (!user?.email) throw new Error("Sign in first.");
  const { subject, body } = outgoing.parse({
    subject: form.get("subject"),
    body: form.get("body"),
  });
  const { contact } = await loadContact(contactId);
  if (!contact.email) throw new Error("This contact has no email address.");

  await sendEmail({ to: contact.email, subject, text: body, replyTo: user.email });

  const supabase = await createUserClient();
  await supabase.from("notes").insert({ contact_id: contactId, body: `Emailed: ${subject}\n\n${body}` });
  await supabase
    .from("contacts")
    .update({ last_contacted_at: new Date().toISOString() })
    .eq("id", contactId);
  revalidatePath(`/crm/${contactId}`);
}

export async function signOut() {
  const supabase = await createUserClient();
  await supabase.auth.signOut();
  redirect("/");
}
