---
name: ship-it
description: Check, commit, and push the current work so Vercel deploys it, then confirm the live site works. Use when the user says ship it, deploy, push, publish, or "put it live".
---

# Ship it

1. Run `/review-my-diff` first. Stop and report if it finds a problem.
2. Run `pnpm check`. If it fails, fix the cause and run it again. Never skip it.
3. Make sure no secret is staged: `git diff --cached` and `git status` must not include
   `.env.local` or any key. If one is, stop and tell the user.
4. Commit with a message that says what changed for the user, e.g.
   "Add follow-up email drafts on contact pages".
5. `git push`. Vercel deploys automatically from GitHub.
6. If the change added an environment variable, remind the user to add it in
   Vercel → Project → Settings → Environment Variables, then redeploy.
7. If the change added a migration, run `pnpm db:push` (with the user's OK: it
   changes the live database).
8. Wait for the deploy (`vercel ls` if the CLI is installed, or ask the user to check
   the Vercel dashboard), open the live URL, and confirm the changed page works.
9. Tell the user in one or two plain sentences what's live.
