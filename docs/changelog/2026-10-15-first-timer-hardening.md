# First-timer hardening: README order, button-project laptop path, workshop skills, friendlier errors

Created 2026-10-15 · Version 1

## What changed

From an audit of the starter against the workshop day (P0s and P1s):

- **README.** Prerequisites now come before the Deploy Button, and the Supabase one no longer
  says to create a project. Git sign-in (`gh auth login`) is a prerequisite. The button's
  manual steps use the real Vercel address, `/**` redirects, the SMTP sender email, DNS only
  for Cloudflare, and a redeploy after env changes. A new section covers working on a
  button-made app on a laptop: clone into this folder, values from Vercel, skip `db:push`.
  It also explains the first "Confirm your email" message and the digest demo with
  `{"days": 0}`.
- **Code** (merged with this): sign-in failures say why, error pages replace blank crashes,
  CRM forms return their errors, the owner email is case-insensitive, nothing crashes
  before keys are set, stages are defined once in `src/lib/crm.ts`, the env guard blocks
  recursive grep, the digest has a `{days}` event, and `pnpm checkup` checks the setup.
- **Claude.** Eight workshop skills in `.claude/skills/`: `/doctor`, `/fix-deploy`,
  `/connect-domain`, `/make-it-mine`, `/add-page`, `/add-table`, `/crm-fields` and `/add-env`.
  CLAUDE.md now says how to tell a button project from a hand-cloned one, and spells out the
  env-var and safeParse rules.
- **Runbook.** 16 new rows for the breaks the room will hit.

## Why

The rehearsal and the audit found the places a first-timer stalls: a second repo Vercel
doesn't watch, a subfolder clone that hides CLAUDE.md and the plugin, a database password
reset, and silent sign-in failures.

## How it was checked

`pnpm check` is green on the code branch. The built app was run with no env (`/`, `/login`,
`/login?error=link`, code forwarding, 404). Not yet run end to end on a fresh account: a
password reset on a button project, and linking a laptop to the Vercel-made Supabase
project (audit P0-3 and P0-4).
