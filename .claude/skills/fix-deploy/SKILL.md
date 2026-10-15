---
name: fix-deploy
description: Get a failed Vercel deploy working again. Use when the live site didn't update, Vercel shows an error or a red deployment, the build failed, or someone pastes a Vercel build log.
---

# Fix a deploy

1. Ask for the first red lines of the build log: Vercel → your project → **Deployments**
   → the failed one → **Building**. (If the Vercel CLI is installed and signed in,
   `vercel inspect --logs <url>` works too.) Never ask for environment variable values.
2. Match the error:
   - **`migrate-on-deploy` failed:** a migration was refused. The Supabase message is just
     above. Fix it in a *new* migration; never edit one that already ran.
   - **`password authentication failed`:** the database password was reset in Supabase.
     The person updates `POSTGRES_URL_NON_POOLING` and `POSTGRES_PASSWORD` in Vercel, then
     redeploys (runbook).
   - **"X is not set up yet" / missing env:** add it in Vercel → Settings → Environment
     Variables, then Redeploy.
   - **Type or lint error:** reproduce with `pnpm check` locally and fix the cause.
3. Run `pnpm check` until it passes, then commit and push (the pre-push hook reruns it),
   or Redeploy if only a variable changed.
4. Watch the new deployment, open the live address, and confirm the page that failed now
   loads, at phone and desktop width.
