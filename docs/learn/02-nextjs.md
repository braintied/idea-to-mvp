# 02 · Next.js

> **Learn alongside:** lesson 2 of the [Idea to Live Product](https://braintied.com/academy/idea-to-live-product) track on
> Braintied Academy covers this too. `/learn` shows your progress.

Next.js is the framework the whole app is built in: the website, the CRM pages, and the
server code behind them.

## A folder is a URL

| File | URL |
|---|---|
| `src/app/page.tsx` | `/` |
| `src/app/login/page.tsx` | `/login` |
| `src/app/crm/page.tsx` | `/crm` |
| `src/app/crm/[id]/page.tsx` | `/crm/<any id>` |
| `src/app/api/inngest/route.ts` | `/api/inngest` (not a page: an endpoint) |

## Server vs browser

Components run on the **server** by default: they can read the database and secrets,
and send finished HTML. A file starting with `"use client"` runs in the **browser**: it
can react to clicks and typing, but must never touch a secret.

The waitlist form shows both: [`waitlist-form.tsx`](../../src/app/waitlist-form.tsx)
(browser, handles typing and the "Joining…" state) calls
[`actions/waitlist.ts`](../../src/app/actions/waitlist.ts) (server, `"use server"`, saves
to the database).

## Server actions

A function in a `"use server"` file can be called straight from a form. No API to
design. Every action here checks its input with zod first, because anything from a
form can be anything.

## Live data goes inside `<Suspense>`

This version of Next.js pre-builds pages ahead of time. Anything that depends on who is
signed in or what's in the database must load inside `<Suspense>` so the page frame
shows instantly and the data streams in. See
[`crm/page.tsx`](../../src/app/crm/page.tsx). `pnpm check` fails if you forget.

## The proxy

[`src/proxy.ts`](../../src/proxy.ts) runs before `/crm` and `/login` load. It refreshes
your sign-in and sends signed-out visitors to `/login`.

## Try it

> /explain what happens, file by file, when I press "Add contact"
