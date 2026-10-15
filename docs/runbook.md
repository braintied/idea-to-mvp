# Runbook: when something breaks

Created 2026-10-14 · Updated 2026-10-15 · Version 3

Paste the exact error into Claude Code first, and run `pnpm doctor`: one line per piece of
the setup, never your key values. These are the usual causes.

| Symptom | Likely cause | Fix |
|---|---|---|
| "X is not set up yet. Check these in .env.local" | A missing env var | Add it to `.env.local` (and Vercel for the live site). The message names it. |
| Magic link email never arrives | Asked twice within a minute (Supabase sends one per address per minute), or the built-in email's two-an-hour limit | Wait a minute and ask once. Set Supabase → Authentication → Emails → SMTP Settings to Resend (README step 3) to lift the hourly limit. |
| "email rate limit exceeded" on sign-in | Supabase's built-in email: two an hour | Set up Resend SMTP (README step 3), or wait up to an hour. |
| `pnpm db:link` says "Access token not provided" | Not logged in to Supabase | Run `pnpm db:login` first, in your own Terminal. |
| `pnpm db:link` or `pnpm keys` hangs or errors when Claude runs it | They ask questions only you can answer | Run them yourself in Terminal. |
| Magic link opens but lands on /login, or "That link didn't work" | Opened in a different browser or device than the one that asked, or the redirect URL isn't allowed | Ask again and open the email in the same browser. Supabase → Authentication → URL Configuration: add `<site>/**`. |
| Waitlist saves but no welcome email | With `onboarding@resend.dev`, Resend only emails the address you signed up with | Test with your own email. To email anyone: Resend → Domains, add the DNS records in Cloudflare, change `EMAIL_FROM`. The `pnpm dev` Terminal shows the reason. |
| "new row violates row-level security policy" | Writing a row the policy forbids | Usually the admin/user client mix-up; see docs/learn/03-supabase.md. |
| Push blocked: pnpm check failed | Type, lint or build error | Run `pnpm check`, paste the first error to Claude. |
| Commit blocked: possible secret | A key in a staged file | Move it to `.env.local`, `git restore --staged <file>`. If it was ever pushed, rotate the key. |
| Live site shows old version | Deploy failed or still running | Vercel → Deployments: open the latest, read the build log. |
| `pnpm inngest` shows no functions, or "Expected server kind cloud, got dev" | The app isn't in Inngest dev mode | `src/inngest/client.ts` sets `isDev` while `pnpm dev` runs; make sure `pnpm dev` (not `pnpm start`) is running on port 3000. |
| AI or Send button says "Minified React error" on the live site | An action threw instead of returning its error | Wrap it in `attempt()` from `src/lib/action-result.ts`, like the AI panel's actions. |
| Deploy Button build fails at "migrate-on-deploy" | The database refused the migration (the Supabase message is just above) | Paste that message into Claude Code. If a migration file is wrong, fix it in a new migration; never edit one that already ran. |
| Live sign-in link opens the login page again | Redirect URL not set for the Vercel address | Supabase → Authentication → URL Configuration: add `https://<your-project>.vercel.app/auth/callback`. |
| "email rate limit exceeded" on the live site | Supabase's built-in email: two an hour | Supabase → Authentication → Emails → SMTP Settings → Resend (README, "Deploy in one click"). |
| Inngest shows no app after the first deploy | The integration hasn't synced yet | Inngest dashboard → Apps → Sync new app, URL `https://<your-project>.vercel.app/api/inngest`. |
| Digest never sends | Inngest not connected in production | Vercel → Integrations → Inngest; then Inngest dashboard → Apps should list this app. |
| AI button errors | Missing or empty-balance DeepSeek key, or wrong `AI_MODEL` | Top up at platform.deepseek.com → Top up; `AI_MODEL` should be `deepseek-flash`. `pnpm doctor` shows the balance state. |
| Sign-in link opens the home page and you're not signed in | Redirect URL not allow-listed, so Supabase fell back to the Site URL | Add `<site>/**` to Redirect URLs. (The app now forwards a stray `?code=` to sign-in.) |
| First email says "Confirm your email address" | Normal for a first sign-in | Click it in the same browser; it signs you in. |
| Live sign-in link points at `localhost` | Site URL is still `http://localhost:3000` | Site URL → your live address; localhost goes in Redirect URLs only. |
| `git clone` or `git push` asks for a username, hangs, or says 403 | Git isn't signed in to GitHub | Run `gh auth login` in your own Terminal (README, Before the workshop, step 9). |
| `pnpm db:push` says the tables already exist | The Deploy Button already made them | Skip `db:push` on a button project; new migrations apply on every push. |
| `pnpm db:link` lists no projects | The Supabase CLI is signed in to an account outside the org Vercel made | Open Supabase once through Vercel → Storage → Supabase → Open in Supabase, then `pnpm db:login` again. Or skip linking: `pnpm keys` with values from Vercel's `.env.local` tab is enough. |
| Build fails: `password authentication failed` at migrate-on-deploy | The database password was reset in Supabase, so Vercel's saved one no longer matches | Don't reset it. If you did: update `POSTGRES_URL_NON_POOLING` and `POSTGRES_PASSWORD` in Vercel → Settings → Environment Variables, then redeploy, or ask a helper. |
| Changed an Environment Variable in Vercel, site unchanged | Variables only reach new deploys | Vercel → Deployments → ⋯ on the latest → Redeploy. |
| Inngest: 401, "signing key", or app missing after adding the integration | The deploy is older than the integration's keys | Redeploy, then Inngest → Apps → Sync. |
| `pnpm dev` says port 3000 is in use and starts on 3001 | Another dev server is running | Stop it (close that Terminal tab). Sign-in links and `pnpm inngest` expect port 3000. |
| Domain won't verify, SSL error, or redirect loop | The Cloudflare record is Proxied (orange cloud) | Cloudflare → DNS → set the record to DNS only (grey cloud). `/connect-domain` walks through it. |
| Supabase project "paused" | Free projects pause after a week idle | Supabase → your project → Restore. |
| `pnpm: command not found`, or `node -v` is below 22 | Node or pnpm missing | Install Node LTS from nodejs.org, then `npm install -g pnpm`. |
| `/design` says unknown, or Claude has no database or browser tools | Claude is open one folder above the repo, or the plugin isn't installed | Reopen Claude on the folder that contains `CLAUDE.md`; `/plugin install braintied@braintied`. |
| Digest Invoke sends nothing | Every contact is younger than 7 days | Invoke with the data `{"days": 0}` to include today's contacts. |
