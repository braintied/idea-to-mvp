# 06 · The AI SDK

> **Learn alongside:** lesson 6 of the [Idea to Live Product](https://braintied.com/academy/idea-to-live-product) track on
> Braintied Academy covers this too. `/learn` shows your progress.

The AI SDK is a library that talks to AI models (Claude, GPT, Gemini…) with one API.
Every AI call in this app lives in [`src/lib/ai.ts`](../../src/lib/ai.ts).

## Two calls, two shapes

- `summarizeContact` uses `streamText` and waits for the finished **text**.
- `draftFollowUp` uses `streamText` with `Output.object({ schema })` and gets back a
  **checked object** `{ subject, body }`. The schema is zod: if the model returns the
  wrong shape, the SDK catches it. Ask for structured output whenever code will use the
  answer.

## Prompts that don't make things up

Both calls have a `system` line that says: only use facts from the notes, never invent
details. Put the real data in the prompt (`describe()` turns a contact and notes into
plain text) and tell the model what it may not do.

## Switching models

`AI_MODEL` in `.env.local` picks the model. To switch provider, install a different
provider package (`@ai-sdk/openai`, `@ai-sdk/google`) and change the `model()` function.
Nothing else in the app changes.

## Cost

Each summary or draft costs a fraction of a cent on `deepseek-flash`. platform.deepseek.com shows usage.

## Try it

> Add an "Ask about this contact" box on the contact page: I type a question, the AI
> answers from the notes only.
