---
name: doctor
description: Check every piece of this app's setup and say what's working, missing or broken, without ever showing a key. Use when something doesn't work, when someone says check my setup, is everything connected, why isn't X working, or before a workshop step.
---

# Doctor

1. Run `pnpm checkup`. It prints one line per piece (env values set or missing, Supabase
   reachable and tables present, Resend key valid, DeepSeek balance, site address, Inngest
   dev server) and never prints a key.
2. Read the lines back in plain words, worst first. For each red line, say the one fix,
   using [docs/runbook.md](../../../docs/runbook.md). Keys go in through `pnpm keys` in the
   person's own Terminal; never ask them to paste a key into the chat.
3. If the problem is on the live site rather than the laptop, it's usually Vercel's
   Environment Variables (add the missing one, then Deployments → Redeploy) or Supabase's
   URL Configuration. Ask them to check those; don't guess values.
4. When everything is green, say so in one line and suggest the next step they were on.
