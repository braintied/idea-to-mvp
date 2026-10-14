# Runbook: when something breaks

Created 2026-10-14 · Updated 2026-10-15 · Version 2

Paste the exact error into Claude Code first. These are the usual causes.

| Symptom | Likely cause | Fix |
|---|---|---|
| "X is not set up yet. Check these in .env.local" | A missing env var | Add it to `.env.local` (and Vercel for the live site). The message names it. |
| Magic link email never arrives | Supabase's built-in email only reaches your Supabase team and sends a few per hour | Use your own (team) email and wait. For anyone else, set Supabase → Authentication → Emails → SMTP Settings to Resend (see README step 5). |
| "email rate limit exceeded" on sign-in | Same limit | Wait up to an hour, or set up Resend SMTP. |
| `pnpm db:link` says "Access token not provided" | Not logged in to Supabase | Run `pnpm db:login` first, in your own Terminal. |
| `pnpm db:link` or `pnpm keys` hangs or errors when Claude runs it | They ask questions only you can answer | Run them yourself in Terminal. |
| Magic link opens but lands on /login | Redirect URL not allowed | Supabase → Authentication → URL Configuration: add `<site>/auth/callback`. |
| Waitlist saves but no welcome email | With `onboarding@resend.dev`, Resend only emails the address you signed up with | Test with your own email. To email anyone: Resend → Domains, add the DNS records in Cloudflare, change `EMAIL_FROM`. The `pnpm dev` Terminal shows the reason. |
| "new row violates row-level security policy" | Writing a row the policy forbids | Usually the admin/user client mix-up; see docs/learn/03-supabase.md. |
| Push blocked: pnpm check failed | Type, lint or build error | Run `pnpm check`, paste the first error to Claude. |
| Commit blocked: possible secret | A key in a staged file | Move it to `.env.local`, `git restore --staged <file>`. If it was ever pushed, rotate the key. |
| Live site shows old version | Deploy failed or still running | Vercel → Deployments: open the latest, read the build log. |
| `pnpm inngest` shows no functions, or "Expected server kind cloud, got dev" | The app isn't in Inngest dev mode | `src/inngest/client.ts` sets `isDev` while `pnpm dev` runs; make sure `pnpm dev` (not `pnpm start`) is running on port 3000. |
| AI or Send button says "Minified React error" on the live site | An action threw instead of returning its error | Wrap it in `attempt()` from `src/lib/action-result.ts`, like the AI panel's actions. |
| Digest never sends | Inngest not connected in production | Vercel → Integrations → Inngest; then Inngest dashboard → Apps should list this app. |
| AI button errors | Missing/empty-credit Anthropic key, or wrong `AI_MODEL` | Check console.anthropic.com usage and the model id. |
