import { Inngest } from "inngest";

// One Inngest client for the whole app. Locally it talks to the
// Inngest dev server (pnpm inngest); in production it uses
// INNGEST_EVENT_KEY and INNGEST_SIGNING_KEY from Vercel.
export const inngest = new Inngest({ id: "idea-to-mvp" });
