---
name: add-table
description: Add a new kind of data to the app, with its own database table, safely. Use when someone wants to store something new: orders, bookings, companies, products, anything.
---

# Add a table

1. Agree on the columns in plain words ("each booking has a date, a guest, a status").
2. `pnpm exec supabase migration new <name>` creates the file in `supabase/migrations/`.
   Write the table there, with:
   - `user_id uuid not null default auth.uid() references auth.users(id) on delete cascade`
     if each person owns their rows;
   - `alter table ... enable row level security;` and a policy in the **same file**
     (copy the pattern from `20261014000000_crm.sql`). A table without RLS is never OK.
3. Apply it:
   - **Deploy Button project:** it applies on the next push to `main`. Say so, with one
     line on what it changes, and ask before pushing.
   - **Hand-cloned project:** ask, then `pnpm db:push`.
4. `pnpm db:types` (if the project is linked) so the code knows the new columns.
5. Read and write it through `createUserClient` so RLS applies; check input with zod
   `safeParse`; show errors on the page.
6. `pnpm check`, try it in the browser, and add a changelog entry.
