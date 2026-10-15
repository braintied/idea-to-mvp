---
name: make-it-mine
description: Put the person's product name and pitch everywhere the starter still says Your Idea or idea-to-mvp. Use after they've picked a name, or when they say rename it, make it mine, use my brand name.
---

# Make it mine

Ask for the name and the one-line pitch if CLAUDE.md's "The idea" doesn't have them yet.
Then change every place the starter's placeholder shows, and show the diff:

- `src/app/layout.tsx`: `metadata.title` and `description`.
- `src/app/page.tsx`: the name in the header and the footer.
- `src/app/actions/waitlist.ts`: the welcome email's subject and text, in their voice.
- `.env.example`: the `EMAIL_FROM` display name. Tell them to change `EMAIL_FROM` the same
  way in Vercel (then Redeploy) and with `pnpm keys` locally.
- `package.json` `name`, `src/inngest/client.ts` `id`, `supabase/config.toml`
  `project_id`: a lowercase-with-dashes version of the name. Changing the Inngest `id`
  makes it a new app in Inngest; tell them to Sync it after the next deploy.
- `README.md`: title and first paragraph about their product (keep the setup sections).
- `CLAUDE.md`: fill in **The idea** and **Name / Domain**.
- `LICENSE`: keep the MIT text and Braintied's line; add `Copyright (c) 2026 THEIR NAME`.

Run `pnpm check`, open the page at phone and desktop width, then suggest `/ship-it`.
