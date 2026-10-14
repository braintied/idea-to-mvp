# 07 · Inngest

A web page only runs while someone is looking at it. Inngest runs work at other times:
on a schedule, after an event, or in the background when a task takes too long for a
page.

## The digest

[`src/inngest/functions.ts`](../../src/inngest/functions.ts) defines
`daily-follow-up-digest`:

- `triggers: [{ cron: "TZ=Asia/Kolkata 0 9 * * *" }]` means every day at 9:00 India
  time. Change the time zone to yours.
- `step.run("find-stale-contacts", …)` is one saved step. If a later step fails,
  Inngest retries from there without redoing finished steps.
- Each user's email is its own step, so one bad address doesn't block the rest.

## How it connects

Inngest calls your app at [`/api/inngest`](../../src/app/api/inngest/route.ts). Locally,
`pnpm inngest` runs a dashboard at http://localhost:8288 where you can trigger a function
by hand and watch each step. In production, the Vercel integration sets the keys.

## Events

Besides schedules, functions can wait for events your app sends:

```ts
await inngest.send({ name: "contact/created", data: { contactId } });
```

## Try it

> When a new contact is added, wait 3 days, and if they still have no notes, email me a
> reminder. Use an Inngest event and step.sleep.
