# How this app works

Created 2026-10-14 · Updated 2026-10-14 · Version 1

One page that shows how the pieces fit. Read this before changing anything big, and
ask Claude `/explain <anything>` when a part isn't clear.

## The map

```
                    ┌──────────────────────────────┐
  Visitor ────────▶ │  Vercel (hosting)            │
                    │  ┌────────────────────────┐  │
                    │  │ Next.js app (src/app)  │  │
                    │  │  pages + server actions│  │
                    │  └──┬──────┬──────┬───────┘  │
                    └─────┼──────┼──────┼──────────┘
                          │      │      │
             ┌────────────┘      │      └─────────────┐
             ▼                   ▼                    ▼
   ┌──────────────────┐ ┌────────────────┐  ┌──────────────────┐
   │ Supabase         │ │ Resend         │  │ Anthropic (AI)   │
   │ database + login │ │ sends email    │  │ via the AI SDK   │
   └──────────────────┘ └────────────────┘  └──────────────────┘
             ▲
             │ every morning
   ┌──────────────────┐
   │ Inngest          │──▶ calls /api/inngest on your app
   │ background jobs  │
   └──────────────────┘
```

Your domain (bought on Cloudflare) points at Vercel. GitHub holds the code; every push
to `main` makes Vercel deploy the new version.

## Three journeys through the code

**1. Someone joins the waitlist**

1. `src/app/page.tsx` shows the form (`src/app/waitlist-form.tsx`).
2. Submitting runs `joinWaitlist` in `src/app/actions/waitlist.ts` **on the server**.
3. zod checks the email. The admin Supabase client saves it to the `waitlist` table.
4. `src/lib/email.ts` sends the welcome email through Resend.

**2. You draft a follow-up email with AI**

1. `src/proxy.ts` checks you're signed in before `/crm` loads.
2. `src/app/crm/[id]/page.tsx` loads the contact and notes as *you*, so row-level
   security only returns your rows.
3. "Draft follow-up" calls `draft` in `src/app/crm/actions.ts`, which calls
   `draftFollowUp` in `src/lib/ai.ts`. The AI SDK sends the notes to Claude and gets
   back `{ subject, body }`.
4. You edit it and press Send. `sendFollowUp` emails it, saves it as a note, and
   updates `last_contacted_at`.

**3. The morning digest**

1. Inngest's scheduler fires `daily-follow-up-digest` (`src/inngest/functions.ts`) at
   9:00 India time.
2. It finds contacts nobody has talked to in 7 days, groups them by owner, and emails
   each owner a list. Each email is its own `step.run`, so one failure retries alone.

## Where things live

| Folder | What's in it |
|---|---|
| `src/app/` | Every page and the server code behind it. A folder = a URL. |
| `src/lib/` | Shared helpers: database clients, email, AI, env checks. |
| `src/inngest/` | Background jobs. |
| `supabase/migrations/` | The database's history, one SQL file per change. |
| `docs/learn/` | One short lesson per piece of the stack. |
| `docs/changelog/` | What changed and why, one dated file per change. |
| `.claude/` | The agent harness: settings, guard hooks, subagents. |
| `.mcp.json` | Tools Claude can use: your database (read-only), docs, a browser. |

## Server vs browser

Files that start with `"use client"` run in the visitor's browser. Everything else runs
on the server. Secrets (`SUPABASE_SECRET_KEY`, `RESEND_API_KEY`, `ANTHROPIC_API_KEY`)
are only ever read on the server, through `src/lib/env.ts`. `import "server-only"` at
the top of a file makes the build fail if browser code tries to import it.
