# CLAUDE.md

Claude reads this file at the start of every session. It is your project's memory:
what you're building, how it's built, and the rules you want followed. Keep it short
and true. When Claude gets something wrong twice, add a line here.

## The idea

<!-- Paste your one-paragraph brief from the morning session. Example: -->
<!-- "Tiffin is a weekly home-cooked lunch subscription for remote workers in Goa.
     People pick a cook near them, pay weekly, and get lunch delivered at 1pm." -->

**Who it's for:** _fill in_
**The problem today:** _fill in_
**What changes for them:** _fill in_
**Name:** _fill in_ · **Domain:** _fill in_

## The brand

Colors and fonts live only in `src/app/globals.css` as tokens (`--brand`, `--surface`,
`--muted`...). Use Tailwind classes built from them (`bg-brand`, `text-muted`,
`border-line`). Never write a hex color in a component.

Voice: _fill in, e.g. "warm, plain, short sentences, no hype words"._

## How the app is built

| Piece | What it does | Where |
|---|---|---|
| Next.js | The website and the app | `src/app/` |
| Supabase | Database + login (magic link) | `supabase/migrations/`, `src/lib/supabase/` |
| Resend | Sends email | `src/lib/email.ts` |
| AI SDK | Talks to the AI model | `src/lib/ai.ts` |
| Inngest | Jobs that run on a schedule or in the background | `src/inngest/` |
| Vercel | Hosting | deploys from GitHub |

The CRM: `waitlist` (public form signups), `contacts`, `notes`. Row-level security means
each user only ever sees their own contacts and notes.

## Rules

1. **Plan first.** For anything bigger than a one-line change, write the plan and wait
   for me to say go.
2. **Small steps.** One feature at a time. After each one, run `pnpm check` and show me
   it works in the browser before moving on.
3. **Database changes are migrations.** Never change tables by hand in the Supabase
   dashboard. Add a new file in `supabase/migrations/`, run `pnpm db:push`, then
   `pnpm db:types`.
4. **Every new table gets row-level security** turned on, with a policy, in the same
   migration.
5. **Secrets go in `.env.local` only.** Never in code, never in git. When you add a new
   one, also add it (without the value) to `.env.example`.
6. **Never use the admin client** (`createAdminClient`) in code that runs in the browser.
   Default to `createUserClient`.
7. **Check input from forms with zod** before using it.
8. **No fake data or placeholder features.** If something isn't built yet, say so
   instead of faking it.
9. **Mobile and desktop together.** Check both widths for every page you touch.
10. **Live data loads inside `<Suspense>`.** This Next.js version pre-builds pages; anything
    that reads the signed-in user, the database, or the current time goes in an async
    component wrapped in `<Suspense>` (see `src/app/crm/page.tsx`). `pnpm check` fails if not.
11. **Explain in plain words.** I'm not a programmer. When you finish, tell me what
    changed, how to see it, and anything I need to do (like add a key).

## Commands

```bash
pnpm dev        # run the app at http://localhost:3000
pnpm inngest    # run the Inngest dev server (background jobs) at http://localhost:8288
pnpm check      # typecheck + lint + build: run before every push
pnpm db:push    # apply new migrations to your Supabase project
pnpm db:types   # regenerate src/lib/database.types.ts after a migration
```

## Skills in this repo

- `/brand-to-tokens`: turn brand guidelines into the color and font tokens.
- `/ship-it`: check, commit, push, and confirm the Vercel deploy.
- `/review-my-diff`: review what changed before you push.
