# 2026-10-15 · Workshop rehearsal: setup fixes, three app bugs, Academy links

Created 2026-10-15 · Updated 2026-10-15 · Version 1

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

## Not yet run (needs G's OK for cloud accounts)

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
