import { z } from "zod";
import { ACTIVE_STAGES } from "@/lib/crm";
import { sendEmail } from "@/lib/email";
import { siteUrl } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/server";
import { inngest } from "./client";

const STALE_AFTER_DAYS = 7;

// What the "crm/digest.requested" event may carry. Anything else (or no
// data at all) falls back to the usual 7 days.
const digestRequest = z.object({ days: z.number().int().min(0).max(365) });

// Every morning: email each user the people they haven't followed up
// with in a week. This keeps running when your laptop is closed.
// Each step.run is saved by Inngest, so if one email fails it retries
// that step alone instead of starting over.
//
// To try it now: Inngest dashboard → this function → Invoke, with data
// {"days": 0}. That counts today's contacts too, so you get a real email.
export const dailyFollowUpDigest = inngest.createFunction(
  {
    id: "daily-follow-up-digest",
    triggers: [{ cron: "TZ=Asia/Kolkata 0 9 * * *" }, { event: "crm/digest.requested" }],
  },
  async ({ event, step }) => {
    const request = digestRequest.safeParse(event.data);
    const days = request.success ? request.data.days : STALE_AFTER_DAYS;

    const stale = await step.run("find-stale-contacts", async () => {
      const cutoff = new Date(Date.now() - days * 86_400_000).toISOString();
      const { data, error } = await createAdminClient()
        .from("contacts")
        .select("id, user_id, name, company, last_contacted_at, created_at")
        .in("stage", ACTIVE_STAGES)
        // Last contacted before the cutoff, or never contacted and added before it.
        .or(`last_contacted_at.lt.${cutoff},and(last_contacted_at.is.null,created_at.lt.${cutoff})`)
        .order("last_contacted_at", { ascending: true, nullsFirst: true })
        .limit(500);
      if (error) throw new Error(error.message);
      return data;
    });

    const byUser = Map.groupBy(stale, (contact) => contact.user_id);
    const intro =
      days === 0
        ? "Your contacts to follow up with:"
        : `It's been ${days === STALE_AFTER_DAYS ? "a week" : `${days} day${days === 1 ? "" : "s"}`} or more since you talked to:`;
    const site = siteUrl();

    for (const [userId, contacts] of byUser) {
      await step.run(`email-${userId}`, async () => {
        const { data, error } = await createAdminClient().auth.admin.getUserById(userId);
        if (error) throw new Error(error.message);
        if (!data.user.email) return { skipped: "user has no email" };

        const lines = contacts
          .slice(0, 10)
          .map(
            (contact) =>
              `- ${contact.name}${contact.company ? ` (${contact.company})` : ""}: ${site}/crm/${contact.id}`,
          );
        await sendEmail({
          to: data.user.email,
          subject: `${contacts.length} people to follow up with today`,
          text: `${intro}\n\n${lines.join("\n")}\n\nOpen one, hit "Draft follow-up", edit, send.`,
        });
        return { sent: contacts.length };
      });
    }

    return { users: byUser.size, contacts: stale.length };
  },
);

export const functions = [dailyFollowUpDigest];
