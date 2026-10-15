# Work in any coding tool: Claude app, ChatGPT app (Codex), OpenCode with DeepSeek, or a terminal

Created 2026-10-15 · Version 1

## What changed

- **One set of rules for every tool.** The project rules moved from `CLAUDE.md` into
  `AGENTS.md`, which Codex and OpenCode read. `CLAUDE.md` now imports it (`@AGENTS.md`) and
  keeps only Claude-specific notes. Before this, Codex and OpenCode saw only a one-line
  pointer and none of the rules.
- **OpenCode:** `opencode.json` sets DeepSeek Flash (`deepseek/deepseek-flash`, the same
  DeepSeek key the app uses) and the three tools (Supabase read-only, context7,
  playwright), and denies reading or editing `.env` files.
- **Codex:** `.codex/config.toml` sets medium reasoning, on-request approvals, a
  workspace-write sandbox and the three tools. It loads once the person trusts the project.
- **Skills everywhere:** `.agents/skills` is a link to `.claude/skills`, so Codex finds the
  same 8 skills. OpenCode reads `.claude/skills` directly.
- **Claude Code:** the project defaults to Opus on medium effort.
- **`pnpm mcp:link`** writes the person's Supabase project into all three tools' configs.
- **README:** a "pick your coding tool" table: the Claude app, the ChatGPT app (Codex),
  OpenCode with DeepSeek, or any of them in Ghostty or another terminal.
- **`.gitattributes`:** keeps shell scripts and git hooks on Unix line endings on Windows.
- **`.gitignore`:** un-ignores the shared tool configs (some global gitignores hide
  `.codex/config.toml`).

## How it was checked

- OpenCode 1.18 in this repo (`opencode debug config`, `opencode debug skill`): model
  `deepseek/deepseek-flash`, the three MCP servers, the `.env` denies, and each of the 8
  skills listed exactly once.
- `.codex/config.toml` parses as TOML. Codex loading it in a trusted project follows its
  docs; not run here, to avoid changing this machine's trust settings.
- `pnpm mcp:link` on a copy wrote the same project ref into `.mcp.json`, `opencode.json` and
  `.codex/config.toml`.

## Known limits

- Windows clones check the `.agents/skills` link out as a text file unless Git symlinks are
  on, so Codex on Windows won't see the skills (Claude Code and OpenCode still do).
- OpenCode's download page now offers a version 2, which reads `AGENTS.md` but may look for
  skills elsewhere. Not verified.
- The `/design` plugin and the `.claude/agents` subagents are Claude-only.
