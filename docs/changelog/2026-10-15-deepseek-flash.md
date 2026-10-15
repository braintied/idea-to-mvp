# AI runs on DeepSeek V4.1 Flash, streamed

**Date:** 2026-10-15
**Files:** src/lib/ai.ts, src/lib/env.ts, src/lib/action-result.ts, scripts/keys.mjs, scripts/deploy-button-url.mjs, README.md, .env.example, docs/architecture.md, docs/learn/06-ai-sdk.md, docs/runbook.md, package.json

## What changed

| Before | After |
|---|---|
| `@ai-sdk/anthropic`, `ANTHROPIC_API_KEY`, `AI_MODEL=claude-sonnet-5-5`, $5 to start | `@ai-sdk/deepseek` 3.0.64, `DEEPSEEK_API_KEY`, `AI_MODEL=deepseek-flash`, $2 to start |
| `generateText` | `streamText`, awaiting the finished text or object; the real provider error is kept for the friendly message |

## Evidence

- Braintied's fleet default is DeepSeek V4.1 Flash (`@braintied/models` `DEEPSEEK_FLASH`, catalog `deepseek-flash`, $0.15 in / $0.60 out per million tokens).
- Measured 2026-10-15 from Goa and from a Fly machine in the US: DeepSeek's non-streaming chat endpoint did not answer within 60 s, while the same request streamed answered in 1.9 s.
- Live run through the new code path: Summarize in 4.1 s and Draft follow-up in 9.2 s (a 57-word email, no invented facts), about $0.001 for both. Most output tokens are the model's reasoning.
- A bad key surfaces "Authentication Fails …", which maps to the DEEPSEEK_API_KEY fix message.

## Verification

`pnpm check` passes (typecheck, lint, build).
