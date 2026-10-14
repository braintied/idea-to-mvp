# 01 · Working with Claude Code

Claude Code is an AI that works inside your project: it reads files, runs commands,
opens the app in a browser, and edits code. Your job is to say what you want, check what
it did, and decide. Six ideas make it reliable.

## 1. CLAUDE.md is its memory

Claude reads [CLAUDE.md](../../CLAUDE.md) at the start of every session. It holds your
idea, your brand, how the app is built, and your rules. If Claude makes the same mistake
twice, add a rule there. Keep it short; it's read every time.

## 2. Plan before building

Press **Shift+Tab** to switch to plan mode. Claude researches and writes a plan without
changing anything. Read it, push back, then approve. Most bad results come from skipping
this on anything bigger than a small fix.

## 3. Small steps, checked

Ask for one feature at a time. After each one: it runs `pnpm check`, shows you the page
working, and writes a changelog entry. Then the next.

## 4. Skills: saved know-how

A skill is a folder with instructions Claude follows for one kind of job. Type its name:
`/design`, `/explain`, `/review-my-diff`, `/ship-it`. They come from the Braintied
plugin (see the README), so they improve without you changing anything.

## 5. Subagents: specialists

[`.claude/agents/`](../../.claude/agents) holds three specialists Claude can hand work to:

- **planner** breaks a feature into steps and finds the files involved.
- **reviewer** reads a change looking for bugs, leaks and missing security.
- **designer** judges a page against the brand and fixes layout, type and color.

Ask for one by name: *"Have the reviewer look at this before I push."*

## 6. Hooks and MCP: guardrails and tools

**Hooks** ([`.claude/settings.json`](../../.claude/settings.json)) are scripts that run
automatically. Here they stop Claude from reading `.env.local`, from committing a secret,
and from pushing without `pnpm check` passing.

**MCP servers** ([`.mcp.json`](../../.mcp.json)) give Claude extra tools:

- **supabase**: look at your real database (read-only; changes go through migrations).
- **context7**: current docs for every library, so it doesn't guess old APIs.
- **playwright**: open the app in a browser and look at it.

## Try it

> Use plan mode: I want a "companies" page that groups contacts by company. Plan it,
> then wait for me.
