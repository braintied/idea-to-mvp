# 03 · Supabase

> **Learn alongside:** lesson 3 of the [Idea to Live Product](https://braintied.com/academy/idea-to-live-product) track on
> Braintied Academy covers this too. `/learn` shows your progress.

Supabase is your database (Postgres) plus sign-in, hosted for you.

## Tables

Three tables, defined in
[`supabase/migrations/20261014000000_crm.sql`](../../supabase/migrations/20261014000000_crm.sql):

- `waitlist`: emails from the public form.
- `contacts`: people in your CRM.
- `notes`: the timeline for each contact.

## Migrations: the database's history

Never change tables by clicking in the Supabase dashboard. Every change is a new SQL
file in `supabase/migrations/`, applied with `pnpm db:push`. That way the change is in
git, Claude can read it, and a fresh project can be rebuilt exactly. After a migration,
`pnpm db:types` refreshes [`database.types.ts`](../../src/lib/database.types.ts) so the
editor knows the new columns.

## Row-level security (RLS)

RLS is a rule inside the database saying who may see which rows. Here:

- contacts and notes: *you only see rows where `user_id` is you.*
- waitlist: *no browser can read or write it at all;* only the server's secret key can.

Even if the app had a bug that asked for everyone's contacts, the database would still
only return yours. Every new table gets RLS turned on in the same migration.

## Two clients

[`src/lib/supabase/server.ts`](../../src/lib/supabase/server.ts):

- `createUserClient()` acts as the signed-in person. RLS applies. Use it almost always.
- `createAdminClient()` uses the secret key and skips RLS. Only for trusted server jobs
  (the waitlist form, the morning digest).

## Sign-in

Magic links: `/login` asks Supabase to email a link; the link lands on
[`/auth/callback`](../../src/app/auth/callback/route.ts), which turns it into a session.

## The Supabase MCP

Claude can query your database through the Supabase MCP server in
[`.mcp.json`](../../.mcp.json). It's read-only: Claude can look, but changes still go
through migrations. Run `pnpm mcp:link` after `pnpm db:link` to point it at your project.

## Try it

> Use the supabase MCP to show me how many contacts I have in each stage.
