// `node scripts/deploy-button-url.mjs`: prints the one-click Deploy to Vercel link.
// The README button and Kit's setup message both use this exact link, so change it here.
//
// What the link does, in Vercel's own screens:
// - copies this template into the person's GitHub
// - creates their Vercel project
// - adds Supabase and Inngest through the Vercel Marketplace (free plans; they set the
//   Supabase URL and keys, POSTGRES_URL_NON_POOLING, and the Inngest keys)
// - asks for the rest in Vercel's form, including the Resend key: Resend's own
//   Marketplace product starts at $20/month, its direct signup is free. Values are
//   never put in the link, because links end up in browser history.
//
// Docs: https://vercel.com/docs/deploy-button
// Marketplace slugs are read from vercel.com/marketplace/<name> (2026-10-15):
// supabase/supabase (oac_VqOgBHqhEoFTPzGkPd7L0iH6), inngest/account
// (oac_H9biZULoTuJYFO32xkUydDmT).

const params = new URLSearchParams({
  "repository-url": "https://github.com/braintied/idea-to-mvp",
  "project-name": "my-idea",
  "repository-name": "my-idea",
  env: "OWNER_EMAIL,DEEPSEEK_API_KEY,RESEND_API_KEY,AI_MODEL,EMAIL_FROM",
  envDescription:
    "OWNER_EMAIL: the email you sign in with (the one you signed up to Resend with). DEEPSEEK_API_KEY: platform.deepseek.com → API keys. RESEND_API_KEY: resend.com → API Keys. Keep the defaults for AI_MODEL and EMAIL_FROM.",
  envLink: "https://github.com/braintied/idea-to-mvp#deploy-in-one-click",
  envDefaults: JSON.stringify({
    AI_MODEL: "deepseek-flash",
    EMAIL_FROM: "My Idea <onboarding@resend.dev>",
  }),
  stores: JSON.stringify([
    { type: "integration", integrationSlug: "supabase", productSlug: "supabase", protocol: "storage" },
    { type: "integration", integrationSlug: "inngest", productSlug: "account" },
  ]),
});

console.log(`https://vercel.com/new/clone?${params.toString()}`);
