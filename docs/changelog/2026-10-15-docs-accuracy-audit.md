# 2026-10-15 · Docs accuracy: hooks, migrate-on-deploy, secret-scan label

Created 2026-10-15 · Version 1

From the prompt and skill audit before the Edge City workshop. Text only, no behaviour change.

| File | Was | Now |
|---|---|---|
| `docs/learn/01-claude-code.md` | Said the Claude hooks stop secret commits and failing pushes. | The Claude hook (`guard-env.mjs`) blocks `.env.local`; the git hooks in `.githooks/` stop secret commits and failing pushes. |
| `CLAUDE.md` rule 4, `docs/learn/08-shipping.md` | Said `pnpm db:push` is the only way a migration reaches the live database. | On a Deploy Button project, a push to `main` applies new migrations during the Vercel build (`scripts/migrate-on-deploy.mjs`), so a push containing a migration gets the same ask-first. |
| `scripts/scan-secrets.mjs` | Labelled any `sk-…` key "OpenAI key". | "OpenAI or DeepSeek key", ahead of the DeepSeek switch; the pattern is unchanged. |

Checked: `pnpm check` through the pre-push hook.
