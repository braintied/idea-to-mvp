# CLAUDE.md

@AGENTS.md

## Claude Code only

- The project rules are in [AGENTS.md](AGENTS.md), shared with Codex and OpenCode.
  Edit them there, not here.
- Skills: `.claude/skills/`. Subagents: `.claude/agents/`. The env guard:
  `.claude/hooks/guard-env.mjs` (it blocks reading or printing `.env` files).
- The `braintied` plugin adds `/design`, `/brand-to-tokens`, `/explain`, `/review-my-diff`,
  `/ship-it`, `/next` and `/learn`.
- This project defaults to Opus on medium effort (`.claude/settings.json`). `/model` and
  `/effort` change it for a session.
