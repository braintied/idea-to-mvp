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
8. **Node.js.** Install the **LTS** version from nodejs.org, then in Terminal run
   `npm install -g pnpm` (pnpm is the tool that installs the app's building blocks).
   Check with `node -v` (22 or newer) and `pnpm -v`.

Check that each one works by logging in once. Stuck? Come to the help hour the night before.

## Setup (about 45 minutes)

You can ask Claude Code to do most steps below. Open Claude, choose Code, pick an empty
folder, and say: *"Set up this starter for me: github.com/braintied/idea-to-mvp. Walk me
through the README one step at a time."*

Steps marked **⌨ in Terminal** ask you questions or open a browser, so type those
yourself in a Terminal window opened in the project folder (in the Claude app: the
Terminal panel). Claude can't answer the questions for you, and it's blocked from
seeing your keys on purpose.

### 1. Get the code

On GitHub, open [braintied/idea-to-mvp](https://github.com/braintied/idea-to-mvp), click
**Use this template → Create a new repository**, pick a name, choose **Private**, then:

```bash
git clone https://github.com/YOUR-NAME/YOUR-REPO.git
cd YOUR-REPO
pnpm install
```

### 2. Database (Supabase) ⌨ in Terminal

Connect to your Supabase project and create the tables:

```bash
pnpm db:login    # opens your browser: approve, then come back
pnpm db:link     # pick your project, then type its database password
pnpm db:push     # creates the tables; answer Y
pnpm mcp:link    # lets Claude read (never change) your database
```

Forgot the database password? Supabase → **Project Settings → Database → Reset
database password**.

In Supabase → **Authentication → URL Configuration**, set the Site URL to
`http://localhost:3000` and add `http://localhost:3000/auth/callback` to Redirect URLs.
(Add your live domain's `/auth/callback` too once you have one.)

### 3. Keys ⌨ in Terminal

```bash
pnpm keys
```

It asks for each key, says where to find it, checks it looks right, and saves it in
`.env.local` (a hidden file that never goes to GitHub). Secret keys are hidden as you
paste. Run it again any time to change one.

| It asks for | Where to get it |
|---|---|
| Supabase URL, publishable key, secret key | Supabase → **Project Settings → API Keys** (the URL is filled in for you after `pnpm db:link`) |
| Resend key | resend.com → **API Keys → Create API Key** |
| `EMAIL_FROM` | Keep `onboarding@resend.dev` for now. It can only email the address you signed up to Resend with. To email anyone, add your domain in Resend → **Domains**, copy the DNS records it shows into Cloudflare, then change `EMAIL_FROM` to `you@yourdomain.com`. |
| `OWNER_EMAIL` | The email you'll sign in with. Use the one you signed up to Resend with. |
| Anthropic key | console.anthropic.com → **API Keys** |
| OpenAI key (optional) | platform.openai.com/api-keys. Only `/design` images use it. |

### 4. Turn on Claude's tools

Quit and reopen Claude Code in this folder (or start a new session), accept the prompts
to trust the folder, enable the MCP servers and install the **braintied** plugin. Then
type `/mcp`, choose **supabase** and sign in.

### 5. Run it

```bash
pnpm dev
```

Open http://localhost:3000 and try the whole loop:

1. Join your own waitlist with your `OWNER_EMAIL`. A welcome email arrives.
2. Click **Sign in**, enter the same email, and open the link Supabase emails you.
3. In the CRM, add your waitlist entry as a contact, write a note, then try
   **Summarize**, **Draft follow-up** and **Send** (to yourself).

Supabase's built-in sign-in email only reaches people on your Supabase team and sends
a few per hour. That's fine for you; before real users sign in, set Supabase →
**Authentication → Emails → SMTP Settings** to Resend (host `smtp.resend.com`, port
`465`, user `resend`, password: your Resend key).

To see background jobs, run this in a second Terminal tab, open http://localhost:8288,
go to **Functions → daily-follow-up-digest → Invoke**, and check your inbox:

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
| Skills | the [braintied plugin](https://github.com/braintied/claude-plugins) | `/design`, `/explain`, `/next`, `/learn`, `/brand-to-tokens`, `/review-my-diff`, `/ship-it`. |
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

## Learn alongside

[Braintied Academy](https://braintied.com/academy) has a track that follows this
build step by step: **[Idea to Live Product](https://braintied.com/academy/idea-to-live-product)**.
Each of its lessons matches one in [docs/learn/](docs/learn/README.md).

To have your milestones count as you build (design direction written, first deploy,
first CRM contact...), sign in once in Terminal:

```bash
npx @braintied/academy login
```

Then `/learn` in Claude Code shows your progress, and `/design` and `/ship-it` log
milestones when you reach them. It's optional; without signing in, nothing changes.

## Commands

```bash
pnpm dev        # run locally
pnpm inngest    # local background-jobs dashboard
pnpm check      # typecheck + lint + build (run before every push)
pnpm keys       # add or change a key in .env.local
pnpm db:push    # apply new database migrations
pnpm db:types   # refresh database types after a migration
pnpm mcp:link   # point Claude's Supabase tool at your project
```

## License

MIT
