import { sendEmail } from "@/lib/email";
import { siteUrl } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/server";
import { inngest } from "./client";

const STALE_AFTER_DAYS = 7;

// Every morning: email each user the people they haven't followed up
// with in a week. This keeps running when your laptop is closed.
// Each step.run is saved by Inngest, so if one email fails it retries
// that step alone instead of starting over.
export const dailyFollowUpDigest = inngest.createFunction(
  { id: "daily-follow-up-digest", triggers: [{ cron: "TZ=Asia/Kolkata 0 9 * * *" }] },
  async ({ step }) => {
    const stale = await step.run("find-stale-contacts", async () => {
      const cutoff = new Date(Date.now() - STALE_AFTER_DAYS * 86_400_000).toISOString();
      const { data, error } = await createAdminClient()
        .from("contacts")
        .select("id, user_id, name, company, last_contacted_at")
        .in("stage", ["lead", "talking", "customer", "partner"])
        .or(`last_contacted_at.is.null,last_contacted_at.lt.${cutoff}`)
        .order("last_contacted_at", { ascending: true, nullsFirst: true })
        .limit(500);
      if (error) throw new Error(error.message);
      return data;
    });

    const byUser = Map.groupBy(stale, (contact) => contact.user_id);
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
          text: `It's been a week or more since you talked to:\n\n${lines.join("\n")}\n\nOpen one, hit "Draft follow-up", edit, send.`,
        });
        return { sent: contacts.length };
      });
    }

    return { users: byUser.size, contacts: stale.length };
  },
);

export const functions = [dailyFollowUpDigest];
