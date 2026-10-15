# 08 · Shipping

> **Learn alongside:** lesson 8 of the [Idea to Live Product](https://braintied.com/academy/idea-to-live-product) track on
> Braintied Academy covers this too. `/learn` shows your progress.

## The pieces

- **GitHub** keeps every version of your code.
- **Vercel** watches GitHub and deploys each push to `main` to your live site.
- **Cloudflare** holds your domain; its DNS points the domain at Vercel.

## The first deploy: the Deploy Button

The README's **Deploy with Vercel** button does the first deploy in one pass: it copies
the starter into your GitHub, creates the Vercel project, sets up Supabase and Inngest
through Vercel, and asks for your keys in Vercel's own form (keys never go in a link or a
chat). On the first production build, [`scripts/migrate-on-deploy.mjs`](../../scripts/migrate-on-deploy.mjs)
creates the tables from `supabase/migrations/`, and runs again on every later deploy,
applying only new files.

What the button can't do, so you do it once:

1. **Supabase sign-in links**: add your Vercel address and `/auth/callback` to Supabase →
   Authentication → URL Configuration, and set its SMTP to Resend.
2. **Your domain in Resend**: its DNS records go into Cloudflare.

Until you set `NEXT_PUBLIC_SITE_URL`, links in emails use your Vercel address
(`siteUrl()` in [`src/lib/env.ts`](../../src/lib/env.ts)).

## The check gate

`pnpm check` runs three things, and all must pass:

1. **typecheck**: every value has the shape the code expects.
2. **lint**: common mistakes and React rules.
3. **build**: the production build, exactly what Vercel will run.

A git `pre-push` hook ([`.githooks/pre-push`](../../.githooks/pre-push)) runs it on every
push, yours or Claude's, and stops the push if it fails. A broken build never reaches
your live site. (`pnpm install` turns the hooks on.)

## The changelog

Each change that ships gets a file in [`docs/changelog/`](../changelog) named
`YYYY-MM-DD-short-name.md`: what changed, why, and how it was checked. In three months,
that's how you (and Claude) know why things are the way they are.

## The ship loop

`/ship-it` does all of it: review the diff, run the check, commit, push, confirm the
deploy, and tell you what's live. Database changes (`pnpm db:push`) need your OK every
time, since they change live data. If you used the Deploy Button, a push to `main` also
applies new migrations to the live database during the Vercel build
([`scripts/migrate-on-deploy.mjs`](../../scripts/migrate-on-deploy.mjs)), so a push that
contains a migration needs the same OK.

## Try it

> /ship-it
