# 08 · Shipping

> **Learn alongside:** lesson 8 of the [Idea to Live Product](https://braintied.com/academy/idea-to-live-product) track on
> Braintied Academy covers this too. `/learn` shows your progress.

## The pieces

- **GitHub** keeps every version of your code.
- **Vercel** watches GitHub and deploys each push to `main` to your live site.
- **Cloudflare** holds your domain; its DNS points the domain at Vercel.

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
time, since they change live data.

## Try it

> /ship-it
