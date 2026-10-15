---
name: connect-domain
description: Connect the person's own domain (bought on Cloudflare) to their Vercel site, sign-in links and email. Use when someone says connect my domain, use my .com, custom domain, DNS, or their domain doesn't work.
---

# Connect a domain

Go one step at a time and wait for "done" after each; the person does the clicking.

1. **Vercel → your project → Settings → Domains → Add** the domain (and `www` if they want
   it; Vercel offers to redirect one to the other).
2. **Cloudflare → the domain → DNS → Records.** Add each record Vercel shows, exactly.
   Set **Proxy status to DNS only** (grey cloud) on every one. The orange cloud breaks
   Vercel's certificate and causes redirect loops.
3. Wait until Vercel shows the domain as **Valid Configuration** (usually minutes).
4. **Supabase → Authentication → URL Configuration:** Site URL `https://THEIRDOMAIN`, and
   add `https://THEIRDOMAIN/**` to Redirect URLs (keep the Vercel and localhost ones).
5. **Vercel → Settings → Environment Variables:** set `NEXT_PUBLIC_SITE_URL` to
   `https://THEIRDOMAIN`, then **Deployments → ⋯ → Redeploy**. Variables only reach new
   deploys.
6. **Email from the domain (optional, same day is fine):** Resend → Domains → Add, copy its
   DNS records into Cloudflare (also DNS only), wait for Verified, then change `EMAIL_FROM`
   in Vercel and `.env.local` to `Name <hello@THEIRDOMAIN>` and redeploy. Update the
   Supabase SMTP sender email to the same address.
7. Open `https://THEIRDOMAIN` on their phone, sign in, and join the waitlist once to see
   the email arrive.
