# 2026-10-15 · Workshop rehearsal: setup fixes, three app bugs, Academy links

Created 2026-10-15 · Updated 2026-10-15 · Version 2

A full run of the README as a first-time attendee, on a fresh clone of the template.
Cloud accounts were not approved for the run, so the database, sign-in, CRM and Inngest
ran against a local Supabase stack (`supabase start`, Docker) and the Inngest dev server.
Resend, Anthropic and OpenAI calls ran with placeholder keys and show the error path
only. Vercel was not exercised.

## What broke, and the fix

| # | Step | What a first-timer hit | Fix |
|---|---|---|---|
| 1 | Before the workshop | `corepack enable` is not found on Node 25+ (nodejs.org "Current"). | Install Node LTS, then `npm install -g pnpm`. |
| 2 | `pnpm install` | Template pinned pnpm 8.15 (end of life). Under current pnpm 12 the same install stops with `ERR_PNPM_IGNORED_BUILDS`. | `packageManager` is `pnpm@12.8.2`; `pnpm-workspace.yaml` allows the two packages that need install scripts (`inngest-cli`, `unrs-resolver`). |
| 3 | `pnpm db:link` | Fails at once: "Access token not provided" (README never logged in). | New `pnpm db:login` step. |
| 4 | DB and keys steps | `supabase login`, `supabase link` and filling `.env.local` ask questions or open a browser, so Claude's shell can't do them, and `.env.local` is hidden in Finder. Claude is (rightly) blocked from it. | Steps marked "⌨ in Terminal"; new `pnpm keys` asks for each key, hides secrets, checks prefixes, prefills the Supabase URL after linking. CLAUDE.md tells Claude to hand these to the person. |
| 5 | Email | `EMAIL_FROM` defaulted to an unverified domain, so every email (welcome, follow-up, digest) failed. | Default is `onboarding@resend.dev`; README, `.env.example` and lesson 05 explain the own-address limit and how to move to a verified domain. |
| 6 | Sign-in | The runbook said Supabase's email limit means "wait a minute". Built-in email only reaches the project's team and sends a few per hour. | Runbook and README say so and give the Resend SMTP settings. |
| 7 | `/crm`, `/crm/[id]` in dev | Next 16 "unstable value `Date.now()` while prerendering" on every visit: a red "2 Issues" badge in the corner. Supabase reads the clock after `cookies()`. | `createUserClient` calls `await connection()` first, which fixes every page that reads the signed-in user. Rule 13 in CLAUDE.md. |
| 8 | AI buttons on the live site | Any failure (bad key, no credit, unverified email domain) showed "Minified React error #441", because Next.js hides thrown server-action errors in production. | `summarize`, `draft` and `sendFollowUp` return `{ ok, value \| error }` through `attempt()` in `src/lib/action-result.ts`, which turns known setup errors into a next step. `sendFollowUp` also stopped ignoring failed note and contact writes. Rule 12 in CLAUDE.md. |
| 9 | `pnpm inngest` | The function never appeared. Inngest v4 assumes Cloud, so the dev server rejected the app: "Expected server kind cloud, got dev". | `src/inngest/client.ts` sets `isDev` while `pnpm dev` runs. |
| 10 | `/design` | Playwright screenshots land in `.playwright-mcp/` inside the project. | Added to `.gitignore`. |

Plugin fixes (braintied/claude-plugins 0.2.0): the image script path in `/design` used
`${CLAUDE_PLUGIN_ROOT}`, which is empty in Claude's shell, so it now comes from
`${CLAUDE_SKILL_DIR}`. A new `/learn` skill was added, and `/design` and `/ship-it` now
log Academy milestones.

## Academy

Each `docs/learn/` lesson names its lesson in the
[Idea to Live Product](https://braintied.com/academy/idea-to-live-product) track, and the
README has a "Learn alongside" section. The track and its lesson pages are being built
separately; lessons link to the track page until per-lesson URLs exist.

## How it was checked

- `pnpm check` (typecheck, lint, build) passes.
- Local Supabase: migration applies cleanly (twice, with `db reset`).
- Playwright run of README step 5, 14 seconds end to end:
  - joining the waitlist saves the row;
  - signed out, `/crm` redirects to `/login`;
  - the magic link arrives (Mailpit) and lands on `/crm`;
  - **Add to CRM** creates the contact and stamps the waitlist row;
  - the note saves.
- Summarize with a bad key shows the readable message in both `pnpm dev` and a
  production build (`pnpm build && pnpm start`).
- Inngest dev server lists `daily-follow-up-digest`. **Invoke Function** runs it.
  `find-stale-contacts` finds the contact and the owner lookup works. The email step
  fails only on the placeholder Resend key.
- `/design` stages 1–6 ran headless on the "Tiffin" sample idea (images planned, not
  generated). It produced the brief, direction, tokens, five image prompts, a composed
  landing page and a critique with four fixes. Checked at 390 and 1440 px.

## Live run (real Supabase, Resend, Anthropic, OpenAI)

Run on a private repo from the template (`braintied/idea-to-mvp-rehearsal`) and a
throwaway Supabase project in Mumbai, all to be deleted after the rehearsal.

| Step | Result | Time |
|---|---|---|
| Use this template → private repo, clone | works | 10 s |
| `pnpm install` | works | 2 s (warm cache) |
| Supabase project create (free org) | healthy | 10 s |
| `pnpm db:link` / `pnpm db:push` | works | 3 s / 2 s |
| `pnpm mcp:link` | **crashed**: `.mcp.json` was missing from the template (bug 11) | fixed |
| Waitlist + welcome email (Resend, `mail.sentigen.ai`) | delivered | 5 s |
| Sign-in email through Resend SMTP → `/crm` | delivered in 4 s, signed in | 13 s |
| Add to CRM, add contact, note | works on the real database | 5 s |
| Summarize / Draft follow-up | the readable error showed "out of credit": the Braintied Anthropic org has no credit | blocked |
| `gpt-image-2.5-flare` hero for the `/design` sample | on brief, 1536×1024 | 29 s |
| Push through the pre-push gate | `pnpm check` passed | 11 s |

More found live:

11. **`.mcp.json` never shipped.** A global gitignore on the authoring machine excluded
    it, so repos made from the template had no Supabase, docs or browser tools, and
    `pnpm mcp:link` crashed. It's now tracked and re-included in the template's
    `.gitignore`.
12. **Supabase's built-in email** allows two emails an hour per project, plus one per
    address per minute. The second sign-in request locked the rehearsal out. Contrary
    to what the docs said before, it delivered to a non-team address. Resend SMTP is
    now a setup step (README step 3), not an option.
13. **First sign-in is a "Confirm your email address" email**, not "Your sign-in link".
    It works the same way. The callback needs the same browser that asked for the
    link (PKCE), so the email must be opened on the same device.
14. **The live address isn't known before the first deploy**, yet the README said to set
    `NEXT_PUBLIC_SITE_URL` to it. `siteUrl()` now falls back to Vercel's
    `VERCEL_PROJECT_PRODUCTION_URL`.

## W0: Deploy Button

- The README opens with **Deploy with Vercel**. It clones the template and provisions
  Supabase (`stores`: `supabase/supabase`) and Inngest (`inngest/account`) through the
  Vercel Marketplace. It also prompts for `ANTHROPIC_API_KEY`, `AI_MODEL`,
  `RESEND_API_KEY`, `EMAIL_FROM` and `OWNER_EMAIL`. Integration ids from the
  Marketplace pages: Supabase `oac_VqOgBHqhEoFTPzGkPd7L0iH6`, Inngest
  `oac_H9biZULoTuJYFO32xkUydDmT`, Resend `oac_KfIFnjXqCl4YJCHnt1bDTBI1` (Resend is left
  out: its Marketplace plans start at $20).
- The Supabase Marketplace syncs exactly the names the app reads
  (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
  `SUPABASE_SECRET_KEY`) plus `POSTGRES_URL_NON_POOLING`.
- `vercel-build` runs `scripts/migrate-on-deploy.mjs` before `next build`, on production
  builds only (previews never touch the live database). It moves a transaction-pooler
  `:6543` address to session mode `:5432`, because Vercel's build machines are IPv4-only.
  It skips when there is no database address. The script and
  `scripts/deploy-button-url.mjs` (`pnpm deploy-button` prints the link) came from the
  stage C session's parallel W0 branch (`feat/deploy-button` @ 6189a0d), merged here so
  there is one W0. That session tested the script against a local Postgres 17.11
  container: it applied the migration, a second run reported up to date, and a wrong
  password exited 1.
- First-laptop check: with no git credentials, `git clone` of a private repo made from
  the template fails ("could not read Username"); the public template clones. Attendees
  need `gh auth login` (or GitHub Desktop sign-in) before cloning their own copy.
- The two manual steps left, for Kit to send with the link: Supabase URL configuration
  plus Resend SMTP, and the Resend domain.
- **Not yet tested end to end.** That needs a click-through in a signed-in Vercel
  session plus G's deploy go-ahead.

## Not yet run

Real Supabase project (`db:login`/`link`/`push`, `mcp:link`, `/mcp` sign-in), Resend
delivery, Anthropic summaries and drafts, the one gpt-image-2.5-flare image, Vercel
deploy with the Inngest integration, and the live magic-link redirect.

## Timing for the workshop schedule

Measured on this rehearsal where marked; the rest are estimates for a first-timer with
accounts already made the night before.

| Step | Time | Basis |
|---|---|---|
| Use this template, clone, `pnpm install` | 3–5 min | install measured at 29 s on a warm cache; allow for slow venue Wi-Fi |
| Supabase: `db:login`, `db:link`, `db:push`, `mcp:link`, URL config | 8–10 min | estimate (cloud not run); finding the DB password is the usual stall |
| `pnpm keys` (collect 5–6 keys from dashboards) | 8–10 min | estimate |
| Restart Claude, trust folder, plugin, `/mcp` sign-in | 3–5 min | estimate |
| `pnpm dev` + the step 5 loop (waitlist, sign-in, CRM, note, AI, send) | 10 min | measured 14 s automated; human pace and email waits dominate |
| `pnpm inngest` + Invoke digest | 3 min | measured under 1 min once the app syncs |
| `/design` stages 1–6 | 45–60 min | measured 20 min with every stage pre-approved; real choices at stages 1–3 and image retakes add the rest |
| Ship: Vercel import, env vars, Inngest integration, domain | 20–30 min | estimate (not run); DNS propagation can add more |

Setup through a working local app: about 45 minutes. With `/design` and going live, plan
on 2–2.5 hours of the afternoon block.
