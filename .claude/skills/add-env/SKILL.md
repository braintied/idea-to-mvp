---
name: add-env
description: Add a new key or setting the app needs, for a new service like Stripe or a new API. Use when a feature needs a new environment variable.
---

# Add an environment variable

Never ask for the value in the chat. The person types it themselves.

1. `.env.example`: the name, with a comment saying what it's for and where to get it.
2. `scripts/keys.mjs`: a field (`name`, `where`, `secret: true` for keys, a `check` for its
   shape), so `pnpm keys` asks for it.
3. `src/lib/env.ts`: add it to a group read only where it's needed, with a zod check and
   a plain message when it's missing.
4. Tell the person to:
   - run `pnpm keys` in their own Terminal for the laptop;
   - add it in Vercel → Settings → Environment Variables (Production and Preview);
   - then Deployments → ⋯ → **Redeploy**, because variables only reach new deploys.
5. If `pnpm doctor` should check it, add a line there too.
