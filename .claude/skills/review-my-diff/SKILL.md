---
name: review-my-diff
description: Review everything that changed since the last commit before it gets pushed — bugs, security holes, leaked secrets, missing row-level security, broken mobile layout. Use when the user asks for a review, "check my work", or before shipping.
---

# Review my diff

Read `git diff` and `git status` (including new, untracked files). Check each item and
report findings in plain language, most serious first. Fix nothing until the user says so.

**Security**
- Any API key, password, or token in the code or in a file that will be committed.
- `createAdminClient` used in a file with `"use client"`, or reachable from one.
- A new table without `enable row level security` and a policy in the same migration.
- Form input used without zod validation.
- Owner-only features that don't check the user.

**Correctness**
- Supabase calls whose `error` is ignored.
- A changed table without an updated `src/lib/database.types.ts`.
- New environment variables missing from `.env.example`.
- Placeholder text, fake data, or TODOs presented as finished features.

**Experience**
- Pages that will break at phone width (fixed widths, overflowing rows).
- Hex colors in components instead of brand tokens.
- Buttons with no pending state for slow actions (AI, email).

Finish with: "Safe to ship" or "Fix these first", and the list.
