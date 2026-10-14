import { Inngest } from "inngest";

// One Inngest client for the whole app. `pnpm dev` talks to the local
// Inngest dev server (`pnpm inngest`); the live site uses Inngest Cloud
// with INNGEST_EVENT_KEY and INNGEST_SIGNING_KEY from Vercel. Inngest v4
// assumes Cloud unless told otherwise, so development mode is set here.
export const inngest = new Inngest({
  id: "idea-to-mvp",
  isDev: process.env.NODE_ENV === "development",
});
