# 05 · Resend

> **Learn alongside:** lesson 5 of the [Idea to Live Product](https://braintied.com/academy/idea-to-live-product) track on
> Braintied Academy covers this too. `/learn` shows your progress.

Resend sends email from your app: the waitlist welcome, follow-ups from the CRM, and the
morning digest. All of it goes through one function,
[`sendEmail` in `src/lib/email.ts`](../../src/lib/email.ts).

## Your own domain

Until you verify a domain, `EMAIL_FROM` stays `onboarding@resend.dev` (Resend's shared
test address), and Resend only delivers to the email you signed up with. In Resend →
**Domains**, add yours; it shows a few DNS records. Add those in Cloudflare → DNS. Once verified, set
`EMAIL_FROM` to something like `Your Idea <hello@yourdomain.com>`.

## Why errors are loud

`sendEmail` throws with Resend's own message when sending fails ("domain not verified",
"invalid key"). The waitlist still saves the signup if the email fails, and logs why.

## Replies

Follow-ups set `replyTo` to your own email, so when a contact answers, it lands in your
inbox, not Resend's.

## Try it

> Add a "Send me a test email" button on the CRM page that emails OWNER_EMAIL.
