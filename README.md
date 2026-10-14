# Idea to MVP

A starter for going from an idea to a working product in a day, built with Claude Code.
It's what you build in the afternoon session of the Edge City workshop
**Idea to Live Product in a Day**.

What you get, already wired:

- **A landing page with a waitlist.** Signups are saved and get a welcome email.
- **Sign-in by email link.** No passwords.
- **A CRM.** Contacts, a notes timeline per person, and stages (lead → talking → customer).
  Waitlist signups go into it with one click.
- **AI on every contact.** "Summarize" tells you where things stand. "Draft follow-up"
  writes an email you edit and send without leaving the page.
- **A daily digest.** Every morning, a background job emails you everyone you haven't
  followed up with in a week. It runs even with your laptop closed.

| Piece | What it's for | Free tier |
|---|---|---|
| [Next.js](https://nextjs.org) | The website and app | Yes |
| [Supabase](https://supabase.com) | Database and sign-in | Yes |
| [Resend](https://resend.com) | Email | Yes |
| [AI SDK](https://ai-sdk.dev) + [Anthropic](https://console.anthropic.com) | AI features | Pay as you go (cents) |
| [Inngest](https://www.inngest.com) | Background and scheduled jobs | Yes |
| [Vercel](https://vercel.com) | Hosting | Yes |
| [Cloudflare](https://cloudflare.com) | Your domain | ~$10/year |

## Before the workshop

You need these accounts, a computer with [Claude](https://claude.ai/download) installed,
and a Claude Pro plan (it includes Claude Code).

1. **GitHub.** Sign up at github.com.
2. **Vercel.** Sign up at vercel.com *with your GitHub account*.
3. **Supabase.** Sign up at supabase.com with GitHub, then create a new project. Save
   the database password somewhere safe.
4. **Resend.** Sign up at resend.com and create an API key.
5. **Anthropic API.** Sign up at console.anthropic.com, add $5 of credit, create a key.
6. **Inngest.** Sign up at inngest.com with GitHub.
7. **Cloudflare.** Sign up at cloudflare.com (you'll buy your domain in the morning).
8. **Node.js 22 or newer.** Install it from nodejs.org, then in Terminal run
   `corepack enable` (this turns on `pnpm`).

Check that each one works by logging in once. Stuck? Come to the help hour the night before.

## Setup (about 20 minutes)

You can do every step below by asking Claude Code. Open Claude, choose Code, pick an empty
folder, and say: *"Set up this starter for me: github.com/braintied/idea-to-mvp. Walk me
through the README one step at a time."*

### 1. Get the code

On GitHub, click **Use this template → Create a new repository**, then:

```bash
git clone https://github.com/YOUR-NAME/YOUR-REPO.git
cd YOUR-REPO
pnpm install
cp .env.example .env.local
```

### 2. Database (Supabase)

In Supabase → **Project Settings → API Keys**, copy the URL, the publishable key and the
secret key into `.env.local`. Then create the tables:

```bash
pnpm db:link
pnpm db:push
pnpm mcp:link
```

`pnpm mcp:link` points Claude's Supabase tool at your project (read-only). Restart
Claude Code and run `/mcp` to sign in to Supabase.

In Supabase → **Authentication → URL Configuration**, set the Site URL to
`http://localhost:3000` and add `http://localhost:3000/auth/callback` to Redirect URLs.
(Add your live domain's `/auth/callback` too once you have one.)

### 3. Email (Resend)

Put your Resend key in `.env.local`. To send from your own domain, add it in Resend →
**Domains** and add the DNS records it shows you in Cloudflare. Until it's verified, you
can only send to your own email address.

### 4. AI

Put your Anthropic key in `.env.local`. `AI_MODEL` can be any Claude model; the default
is a good balance of speed and quality. For `/design` images, also add an
`OPENAI_API_KEY` from platform.openai.com.

### 5. Run it

```bash
pnpm dev
```

Open http://localhost:3000. Join your own waitlist, then go to `/login` and sign in with
the email you set as `OWNER_EMAIL`.

To see background jobs locally, run this in a second Terminal tab and open
http://localhost:8288:

```bash
pnpm inngest
```

### 6. Put it live

1. Push your code to GitHub.
2. In Vercel, **Add New → Project**, import the repo, paste every value from `.env.local`
   into Environment Variables, and change `NEXT_PUBLIC_SITE_URL` to your live address.
3. In Vercel → **Integrations**, add **Inngest**. It sets the Inngest keys for you.
4. In Vercel → **Domains**, add your Cloudflare domain and copy the DNS records it asks
   for into Cloudflare.
5. Add `https://yourdomain.com/auth/callback` to Supabase's Redirect URLs.

## The harness: how this repo helps you build

This isn't just starter code. It comes with the setup we use to build with AI every day,
simplified for first-time builders:

| Piece | Where | What it does for you |
|---|---|---|
| Project memory | [CLAUDE.md](CLAUDE.md) | Your idea, brand and rules. Claude reads it every session. Fill in **The idea** first. |
| How it works | [docs/architecture.md](docs/architecture.md) | One map of the whole app and three journeys through the code. |
| Lessons | [docs/learn/](docs/learn/README.md) | One short lesson per piece of the stack, using this repo's real code. |
| Tools for Claude | [.mcp.json](.mcp.json) | Your database (read-only), current library docs, and a browser to check its work. |
| Specialists | [.claude/agents/](.claude/agents) | `planner`, `reviewer`, `designer`. |
| Guardrails | [.claude/settings.json](.claude/settings.json), [.githooks/](.githooks) | Claude can't read your keys; git refuses commits containing keys and pushes that don't build. |
| Skills | the [braintied plugin](https://github.com/braintied/claude-plugins) | `/design`, `/explain`, `/next`, `/brand-to-tokens`, `/review-my-diff`, `/ship-it`. |
| History | [docs/changelog/](docs/changelog) | What changed, why, and how it was checked. |
| When it breaks | [docs/runbook.md](docs/runbook.md) | Common errors and their fixes. |

When you first open the folder in Claude Code, accept the prompts to trust it, install
the **braintied** plugin, and enable the MCP servers. If the plugin prompt doesn't
appear:

```
/plugin marketplace add braintied/claude-plugins
/plugin install braintied@braintied
```

Start with `/design` to give the site a real brand, `/explain` whenever something is
unclear, and `/next` when you're not sure what to build.

Good next requests:

- *"Add a companies page that groups contacts by company."*
- *"Let me import contacts from a CSV."*
- *"Add a Kanban board view of contacts by stage."*
- *"Make the daily digest suggest a first line for each follow-up."*

## Commands

```bash
pnpm dev        # run locally
pnpm inngest    # local background-jobs dashboard
pnpm check      # typecheck + lint + build (run before every push)
pnpm db:push    # apply new database migrations
pnpm db:types   # refresh database types after a migration
pnpm mcp:link   # point Claude's Supabase tool at your project
```

## License

MIT
