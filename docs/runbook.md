# Runbook: when something breaks

Created 2026-10-14 · Updated 2026-10-14 · Version 1

Paste the exact error into Claude Code first. These are the usual causes.

| Symptom | Likely cause | Fix |
|---|---|---|
| "X is not set up yet. Check these in .env.local" | A missing env var | Add it to `.env.local` (and Vercel for the live site). The message names it. |
| Magic link email never arrives | Supabase's built-in email is rate-limited | Wait a minute; for real use, set Supabase → Auth → SMTP to Resend. |
| Magic link opens but lands on /login | Redirect URL not allowed | Supabase → Authentication → URL Configuration: add `<site>/auth/callback`. |
| Waitlist saves but no welcome email | Sending domain not verified | Resend → Domains; add the DNS records in Cloudflare. Server logs show the reason. |
| "new row violates row-level security policy" | Writing a row the policy forbids | Usually the admin/user client mix-up; see docs/learn/03-supabase.md. |
| Push blocked: pnpm check failed | Type, lint or build error | Run `pnpm check`, paste the first error to Claude. |
| Commit blocked: possible secret | A key in a staged file | Move it to `.env.local`, `git restore --staged <file>`. If it was ever pushed, rotate the key. |
| Live site shows old version | Deploy failed or still running | Vercel → Deployments: open the latest, read the build log. |
| Digest never sends | Inngest not connected in production | Vercel → Integrations → Inngest; then Inngest dashboard → Apps should list this app. |
| AI button errors | Missing/empty-credit Anthropic key, or wrong `AI_MODEL` | Check console.anthropic.com usage and the model id. |
