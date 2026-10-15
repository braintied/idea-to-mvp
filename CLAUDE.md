# CLAUDE.md

Created 2026-10-14 · Updated 2026-10-15 · Version 3

Claude reads this file at the start of every session. It is the project's memory:
what you're building, how it's built, and the rules. Keep it short and true. When Claude
gets something wrong twice, add a line here.

## The idea

<!-- Paste your one-paragraph brief. Example:
     "Tiffin is a weekly home-cooked lunch subscription for remote workers in Goa.
      People pick a cook near them, pay weekly, and get lunch delivered at 1pm." -->

**Who it's for:** _fill in_
**The problem today:** _fill in_
**What changes for them:** _fill in_
**Name:** _fill in_ · **Domain:** _fill in_

If this section is still blank, ask the person about their idea before building
anything, or suggest `/design` to work through it.

## The brand

Colors and fonts live only in `src/app/globals.css` as tokens (`--brand`, `--surface`,
`--muted`...). Use Tailwind classes built from them (`bg-brand`, `text-muted`,
`border-line`). Never write a hex color in a component.

Voice: _fill in, e.g. "warm, plain, short sentences, no hype words"._

## How the app is built

Read [docs/architecture.md](docs/architecture.md) for the map and three request
journeys. One lesson per piece is in [docs/learn/](docs/learn/README.md).

| Piece | What it does | Where |
|---|---|---|
| Next.js | Website and app | `src/app/` |
| Supabase | Database + sign-in | `supabase/migrations/`, `src/lib/supabase/` |
| Resend | Email | `src/lib/email.ts` |
| AI SDK | AI model calls | `src/lib/ai.ts` |
| Inngest | Scheduled and background jobs | `src/inngest/` |
| Vercel | Hosting, deploys from GitHub | |

## The harness

- **MCP** (`.mcp.json`): `supabase` (read-only, your project after `pnpm mcp:link`),
  `context7` (current library docs; use it before writing code against any library),
  `playwright` (open the app and look at it).
- **Subagents** (`.claude/agents/`): `planner`, `reviewer`, `designer`.
- **Skills** (from the `braintied` plugin): `/design`, `/brand-to-tokens`, `/explain`,
  `/review-my-diff`, `/ship-it`, `/next`, `/learn` (Academy progress; optional).
- **Guards**: Claude can't read real env files; git refuses commits containing keys and
  pushes that fail `pnpm check`.

## Rules

1. **Plan first.** For anything bigger than a one-line change, use the planner (or plan
   mode), show the plan, and wait for a go.
2. **Small steps, checked.** One feature at a time. After each: `pnpm check`, then open
   the page with playwright at phone and desktop width and show it working.
3. **Teach as you go.** The person is learning. After each change, say in one or two
   plain sentences which piece did what ("the server action saved it, RLS made sure only
   you can see it"), and link the matching `docs/learn/` lesson.
4. **Database changes are migrations.** Never change tables in the dashboard or through
   MCP. New file in `supabase/migrations/`, then `pnpm db:push` (ask first: it changes
   live data), then `pnpm db:types`. On a Deploy Button project, pushing to `main` also
   applies new migrations to the live database (`scripts/migrate-on-deploy.mjs`), so say
   so and ask first before pushing a commit that contains a migration.
5. **Every new table gets row-level security** with a policy, in the same migration.
6. **Secrets live in `.env.local` only.** Never ask the person to paste a key into the
   chat. New variable → add its name to `.env.example` and tell them where to get it.
7. **Admin client only on the server**, only when RLS must be skipped on purpose.
   Default to `createUserClient`.
8. **Check form input with zod** before using it.
9. **Live data inside `<Suspense>`.** Anything reading the user, the database, or the
   current time goes in an async component wrapped in `<Suspense>`.
10. **No fake data or placeholder features.** If something isn't built, say so.
11. **Current docs, not memory.** Library APIs change; check context7 before using one.
12. **Actions that call outside services return their errors.** On the live site Next.js
    hides any error a server action throws. Wrap AI, email and other service calls in
    `attempt()` from `src/lib/action-result.ts` and show `result.error` on the page.
13. **Signed-in reads go through `createUserClient`.** It calls `connection()` so the
    page renders per request; reading the clock or the session before that fails.

## Session exit checklist

- [ ] `pnpm check` passes.
- [ ] The change was seen working in the browser at both widths.
- [ ] New env vars are in `.env.example`; new tables have RLS.
- [ ] A changelog entry exists: `docs/changelog/YYYY-MM-DD-short-name.md` (what, why,
      how it was checked).
- [ ] If the architecture changed, `docs/architecture.md` says so.
- [ ] You told the person what changed, how to see it, and anything they must do.

## Commands

```bash
pnpm dev        # the app at http://localhost:3000
pnpm inngest    # background-jobs dashboard at http://localhost:8288
pnpm check      # typecheck + lint + build (also runs on every push)
pnpm db:push    # apply new migrations (changes the live database)
pnpm db:types   # refresh src/lib/database.types.ts after a migration
pnpm mcp:link   # point the Supabase MCP at your project (after pnpm db:link)
pnpm keys       # the person fills in .env.local (their Terminal, never this chat)
```

`pnpm db:login`, `pnpm db:link` and `pnpm keys` ask questions or open a browser. Ask the
person to run them in their own Terminal; they won't work from your shell.

## Provenance

Started from [braintied/idea-to-mvp](https://github.com/braintied/idea-to-mvp), the
Edge City "Idea to Live Product in a Day" starter. Harness conventions follow the
Braintied repo standard, simplified for first-time builders.
