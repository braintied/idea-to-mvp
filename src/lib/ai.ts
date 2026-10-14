import "server-only";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText, Output } from "ai";
import { z } from "zod";
import type { Contact, Note } from "@/lib/database.types";
import { aiEnv } from "@/lib/env";

// All AI calls go through here. To switch models, change AI_MODEL in
// .env.local. To switch providers, swap @ai-sdk/anthropic for another
// AI SDK provider (openai, google...) — the rest of the app doesn't change.
function model() {
  const env = aiEnv();
  return createAnthropic({ apiKey: env.ANTHROPIC_API_KEY })(env.AI_MODEL);
}

function describe(contact: Contact, notes: Note[]) {
  const timeline = notes.length
    ? notes.map((note) => `- ${note.created_at.slice(0, 10)}: ${note.body}`).join("\n")
    : "(no notes yet)";
  return [
    `Name: ${contact.name}`,
    `Company: ${contact.company ?? "unknown"}`,
    `Stage: ${contact.stage}`,
    `Last contacted: ${contact.last_contacted_at?.slice(0, 10) ?? "never"}`,
    `Notes, newest first:\n${timeline}`,
  ].join("\n");
}

export async function summarizeContact(contact: Contact, notes: Note[]) {
  const { text } = await generateText({
    model: model(),
    system:
      "You help a founder keep track of relationships. Be concrete and brief. Only use facts from the notes; never invent details.",
    prompt: `Summarize where things stand with this person in 3 short bullet points, then one line starting "Next:" with the single best next step.\n\n${describe(contact, notes)}`,
  });
  return text;
}

const draftSchema = z.object({
  subject: z.string(),
  body: z.string(),
});

export async function draftFollowUp(contact: Contact, notes: Note[], senderName: string) {
  const { output } = await generateText({
    model: model(),
    output: Output.object({ schema: draftSchema }),
    system:
      "You write short, warm, specific follow-up emails. Plain text, no markdown, under 120 words. Reference something real from the notes. Never invent facts, dates, or promises.",
    prompt: `Write a follow-up email from ${senderName} to ${contact.name}.\n\n${describe(contact, notes)}`,
  });
  return output;
}
