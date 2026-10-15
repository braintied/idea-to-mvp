---
name: crm-fields
description: Change what the CRM tracks: rename or add stages, add a field like deal size, phone or source. Use when someone wants the contact list to fit their business.
---

# Change what the CRM tracks

**Stages** live in two places that must match:
- `src/lib/crm.ts`: `STAGES` (and `ACTIVE_STAGES`, the ones the digest follows up on).
- The `contacts.stage` check constraint in the database.

To change stages, write one new migration that drops and re-adds the constraint with the
new list (and moves existing rows from an old stage to a new one if needed), and change
`STAGES` in the same commit.

**A new field** (deal size, phone, source...):
1. New migration: `alter table public.contacts add column ...` (with a sensible type and
   default). Never edit the original migration.
2. The add and edit forms in `src/app/crm/` (input with a label), the zod schema in
   `src/app/crm/actions.ts` (`safeParse`), and the contact page that shows it.
3. `pnpm db:types` if linked.
4. Apply it as in `/add-table` (Deploy Button projects: on push, ask first).

`pnpm check`, try it in the browser, changelog entry.
