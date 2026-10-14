# 04 · Secrets and env vars

API keys are passwords for services. Anyone who has your Resend key can send email as
you; anyone with the Supabase secret key can read your whole database.

## The rule

- Real values live in `.env.local` on your computer, and in Vercel's Environment
  Variables for the live site. Nowhere else.
- [`.env.example`](../../.env.example) lists every name with a fake value. It's in git so
  the next person knows what to set.
- `.env.local` is in `.gitignore`, so git won't pick it up.

## The guardrails

- A Claude hook ([`.claude/hooks/guard-env.mjs`](../../.claude/hooks/guard-env.mjs))
  stops Claude from reading or printing `.env.local`, so keys never enter the chat.
- A git hook ([`.githooks/pre-commit`](../../.githooks/pre-commit)) refuses any commit
  that contains something shaped like a key, whoever makes it.
- [`src/lib/env.ts`](../../src/lib/env.ts) checks the variables a feature needs and names
  any that are missing, instead of failing somewhere confusing.

## `NEXT_PUBLIC_` means public

Anything named `NEXT_PUBLIC_…` is copied into the page and visible to every visitor.
Only the Supabase URL and publishable key are, because RLS protects the data. Never put
a secret in a `NEXT_PUBLIC_` variable.

## If a key leaks

Rotate it: create a new key in that service, delete the old one, update `.env.local`
and Vercel. Deleting the commit isn't enough; git history keeps it.

## Try it

> I need to add a Stripe key. Walk me through where it goes, without me pasting it here.
