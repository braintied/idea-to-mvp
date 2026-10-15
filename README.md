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
| [AI SDK](https://ai-sdk.dev) + [DeepSeek](https://platform.deepseek.com) | AI features | Pay as you go (a $2 top-up lasts the workshop) |
| [Inngest](https://www.inngest.com) | Background and scheduled jobs | Yes |
| [Vercel](https://vercel.com) | Hosting | Yes |
| [Cloudflare](https://cloudflare.com) | Your domain | ~$10/year |

## Before the workshop

You need a laptop and two kinds of AI, which do different jobs:

- **An AI to build with.** Pick one; the repo is set up for all of them (rules in
  [AGENTS.md](AGENTS.md), the same tools and skills in each):

  | Tool | What you need | Install and sign in | Open the project |
  |---|---|---|---|
  | **Claude app** (our pick) | A Claude plan (Pro or higher) | [claude.ai/download](https://claude.ai/download), sign in. This repo defaults to **Opus on medium effort**. | **Code** → choose the folder |
  | **ChatGPT app** (Codex) | A ChatGPT plan | [chatgpt.com/download](https://chatgpt.com/download), sign in, switch to **Codex** | Open the folder, then **trust** it so the repo's settings load |
  | **OpenCode** with DeepSeek | Just the DeepSeek key below (pay as you go) | The app or the terminal version from [opencode.ai/download](https://opencode.ai/download). Connect DeepSeek with your key (in the app: connect a provider → DeepSeek; in a terminal: `opencode auth login`). The repo picks **DeepSeek Flash** for you. | Open the folder in the app, or `opencode` in a terminal from the folder |
  | **Any of them in a terminal** | One of the above | [Ghostty](https://ghostty.org/download) (Mac) or your usual terminal, then run `claude`, `codex` or `opencode` from the project folder | `cd` into the folder first |

  The workshop's steps are written for the Claude app, so the other routes take a little
  more setup: get yours working before the day. The `/design` plugin is Claude-only; in the
  other tools, ask the agent to follow the same steps (brief, direction, identity, images,
  page, critique) with you.

- **An AI inside your app (an API key).** The starter's AI features (summaries, drafted
  follow-ups) use **DeepSeek**: load a few dollars at platform.deepseek.com and make a
  key (step 5). It's pay as you go and costs cents for the day.

And these accounts:

1. **GitHub.** Sign up at github.com.
2. **Vercel.** Sign up at vercel.com *with your GitHub account*, and stay signed in on
   the laptop you're bringing: the Deploy Button needs it.
3. **Supabase.** Sign up at supabase.com with GitHub. Don't create a project: the Deploy
   Button makes one for you (create one yourself only if you skip the button).
4. **Resend.** Sign up at resend.com and create an API key.
5. **DeepSeek API.** Sign up at platform.deepseek.com, top up $2 (Top up), then
   API keys → Create. Save the key somewhere safe; you'll paste it into the Deploy Button.
6. **Inngest.** Sign up at inngest.com with GitHub.
7. **Cloudflare.** Sign up at cloudflare.com (you'll buy your domain in the morning).
8. **Node.js.** Install the **LTS** version from nodejs.org, then in Terminal run
   `npm install -g pnpm` (pnpm is the tool that installs the app's building blocks).
   Check with `node -v` (22 or newer) and `pnpm -v`.

9. **Git signed in to GitHub.** Install the GitHub CLI from cli.github.com, then in
   Terminal run `gh auth login` and pick GitHub.com → HTTPS → Yes → Login with a web
   browser. Check with `gh auth status`. Without it, copying your repo to your laptop
   fails with "could not read Username".

Check that each one works by logging in once. Stuck? Come to the help hour the night before.

## Deploy in one click

**Before you click: sign in to Vercel.** The button runs inside your Vercel account, so in
the same browser you'll click it from:

1. **Sign in to [github.com](https://github.com).**
2. **Sign in to [vercel.com](https://vercel.com/login) with "Continue with GitHub".** You
   should land on your Vercel dashboard. No account yet? Signing up with GitHub there is
   the same step.
3. **Have two keys ready to paste:** your DeepSeek API key and your Resend API key (where to
   get them is in the table below).

Signed in first, the button runs in one pass and the project lands in *your* account, not
a work or teammate account you happen to be signed in to. While it runs, Vercel asks to
connect to GitHub (allow it: that's how it copies the starter into your account) and to
add Supabase and Inngest (pick the free plans).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbraintied%2Fidea-to-mvp&project-name=my-idea&repository-name=my-idea&env=OWNER_EMAIL%2CDEEPSEEK_API_KEY%2CRESEND_API_KEY%2CAI_MODEL%2CEMAIL_FROM&envDescription=OWNER_EMAIL%3A+the+email+you+sign+in+with+%28the+one+you+signed+up+to+Resend+with%29.+DEEPSEEK_API_KEY%3A+platform.deepseek.com+%E2%86%92+API+keys.+RESEND_API_KEY%3A+resend.com+%E2%86%92+API+Keys.+Keep+the+defaults+for+AI_MODEL+and+EMAIL_FROM.&envLink=https%3A%2F%2Fgithub.com%2Fbraintied%2Fidea-to-mvp%23deploy-in-one-click&envDefaults=%7B%22AI_MODEL%22%3A%22deepseek-flash%22%2C%22EMAIL_FROM%22%3A%22My+Idea+%3Conboarding%40resend.dev%3E%22%7D&stores=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22supabase%22%2C%22productSlug%22%3A%22supabase%22%2C%22protocol%22%3A%22storage%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22inngest%22%2C%22productSlug%22%3A%22account%22%7D%5D)

The button copies this starter into your GitHub, creates your Vercel project, sets up a
**Supabase** database and **Inngest** for you (both free to start, through Vercel), and
asks for five values:

| It asks for | Where to get it |
|---|---|
| `DEEPSEEK_API_KEY` | platform.deepseek.com → API keys (top up $2 first) |
| `AI_MODEL` | filled in: `deepseek-flash` |
| `RESEND_API_KEY` | resend.com → API Keys |
| `EMAIL_FROM` | filled in: `onboarding@resend.dev`; change it once your domain is verified in Resend |
| `OWNER_EMAIL` | The email you'll sign in with (the one you signed up to Resend with) |

The first production deploy creates the database tables ([`scripts/migrate-on-deploy.mjs`](scripts/migrate-on-deploy.mjs)). Two steps stay manual:

1. **Supabase sign-in links.** Find your live address first: Vercel → your project →
   **Domains** (it looks like `my-idea-abc123.vercel.app`; copy it exactly). Then in
   Vercel → **Storage → Supabase → Open in Supabase**, go to **Authentication → URL
   Configuration**:
   - **Site URL:** `https://YOUR-ADDRESS`
   - **Redirect URLs:** add `https://YOUR-ADDRESS/**` and `http://localhost:3000/**`
     (the `/**` covers every page, so links keep working as the app grows).

   While you're there, open **Authentication → Emails → SMTP Settings** and turn on custom
   SMTP with Resend: host `smtp.resend.com`, port `465`, username `resend`, password your
   Resend key, sender email `onboarding@resend.dev` (just the address, no name), sender
   name your app's name. Without it, sign-in emails stop after two an hour.
2. **Your domain in Resend**, when you have one: Resend → Domains, copy its DNS records into
   Cloudflare (set each one to **DNS only**, the grey cloud), then change `EMAIL_FROM` in
   Vercel → Settings → Environment Variables and redeploy.

> **Changed an Environment Variable in Vercel?** It only reaches new deploys. Go to
> **Deployments → ⋯ on the latest → Redeploy**.

### Work on your button-made app on your laptop

1. Make sure Git is signed in: `gh auth status` (if not, `gh auth login`, step 9 above).
2. In Claude: **Code → choose a new, empty folder**. Then ⌨ in Terminal, from that folder
   (your repo's address is on its GitHub page, under **Code**):

   ```bash
   git clone https://github.com/YOUR-NAME/YOUR-REPO.git .
   pnpm install
   ```

   The final dot matters: it puts the code in *this* folder, so Claude finds `CLAUDE.md`,
   its tools and the `/design` plugin.
3. ⌨ `pnpm keys`. The Supabase values are in Vercel → **Storage → Supabase →
   `.env.local` tab** (click **Show secret**). Use the same Resend and DeepSeek keys you
   gave the button.
4. Optional, so Claude can read your database: open Supabase once through Vercel →
   **Storage → Supabase → Open in Supabase** in this browser, then ⌨ `pnpm db:login`,
   `pnpm db:link` (pick the project with your Vercel project's name) and `pnpm mcp:link`.
   The database password is in Vercel → **Settings → Environment Variables →
   `POSTGRES_PASSWORD`**. Don't reset it in Supabase: deploys use the saved one (see the
   [runbook](docs/runbook.md)). If `db:link` lists no projects, skip this step; everything
   else still works.
5. **Skip `pnpm db:push`.** Your first deploy already made the tables, and new migrations
   apply on every push.
6. Quit Claude and reopen it on this same folder. Check with `pnpm checkup`: one line per
   piece, all green.

## Setup without the Deploy Button (about 45 minutes)

You can ask Claude Code to do most steps below. Open Claude, choose Code, pick an empty
folder, and say: *"Set up this starter for me: github.com/braintied/idea-to-mvp. Walk me
through the README one step at a time."*

Steps marked **⌨ in Terminal** ask you questions or open a browser, so type those
yourself in a Terminal window opened in the project folder (in the Claude app: the
Terminal panel). Claude can't answer the questions for you, and it's blocked from
seeing your keys on purpose.

### 1. Get the code

On GitHub, open [braintied/idea-to-mvp](https://github.com/braintied/idea-to-mvp), click
**Use this template → Create a new repository**, pick a name, choose **Private**, then,
in Claude's Terminal from your new empty folder (the final dot keeps the code in this folder):

```bash
git clone https://github.com/YOUR-NAME/YOUR-REPO.git .
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

In Supabase → **Authentication → URL Configuration**, add `http://localhost:3000/**` to
Redirect URLs. If you have no live site yet, set the Site URL to `http://localhost:3000`;
once you do, the Site URL is your live address (localhost stays in Redirect URLs only).

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
| DeepSeek key | platform.deepseek.com → **API keys** |
| OpenAI key (optional) | platform.openai.com/api-keys. Only `/design` images use it. |

Then send sign-in emails through Resend too. Supabase's built-in email stops after two
an hour, which locks you out after one typo. In Supabase → **Authentication → Emails →
SMTP Settings**, turn on custom SMTP: host `smtp.resend.com`, port `465`, username
`resend`, password your Resend key, sender email `onboarding@resend.dev` (just the
address, no name; your own domain's address once it's verified), sender name your app's name.

### 4. Turn on Claude's tools

Quit and reopen Claude Code on the folder that contains `CLAUDE.md` (or start a new
session there), accept the prompts to trust the folder, enable the MCP servers and install
the **braintied** plugin. Then type `/mcp`, choose **supabase** and sign in. If `/design`
says unknown, Claude is open one folder too high. Check everything with `pnpm checkup`.

### 5. Run it

```bash
pnpm dev
```

Open http://localhost:3000 and try the whole loop:

1. Join your own waitlist with your `OWNER_EMAIL`. A welcome email arrives.
2. Click **Sign in**, enter the same email, and open the link Supabase emails you, in
   this same browser. The very first email says "Confirm your email address": that's your
   sign-in link.
3. In the CRM, add your waitlist entry as a contact, write a note, then try
   **Summarize**, **Draft follow-up** and **Send** (to yourself).

No sign-in email? Wait a minute before asking again: Supabase sends one per address per
minute. The [runbook](docs/runbook.md) covers the rest.

To see background jobs, run this in a second Terminal tab, open http://localhost:8288,
go to **Functions → daily-follow-up-digest → Invoke** with the data `{"days": 0}` (so it
includes the contacts you made today; the morning schedule uses 7 days), and check your inbox:

```bash
pnpm inngest
```

### 6. Put it live

1. Push your code to GitHub.
2. In Vercel, **Add New → Project**, import the repo, and paste every value from
   `.env.local` into Environment Variables except `NEXT_PUBLIC_SITE_URL` (the live site
   uses its Vercel address until you add your own domain; then set it to that).
   (Used the Deploy Button? This is already done.)
3. In Vercel → **Integrations**, add **Inngest**. It sets the Inngest keys for you.
4. In Vercel → **Domains**, add your Cloudflare domain and copy the DNS records it asks
   for into Cloudflare → DNS. Set each record's proxy status to **DNS only** (grey cloud):
   the orange cloud breaks Vercel's certificate.
5. In Supabase → URL Configuration, set the Site URL to `https://yourdomain.com` and add
   `https://yourdomain.com/**` to Redirect URLs. In Vercel, set `NEXT_PUBLIC_SITE_URL` to
   `https://yourdomain.com`, then **Deployments → Redeploy** (variables only reach new
   deploys). Or ask Claude: `/connect-domain`.

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
| Workshop skills | [.claude/skills/](.claude/skills) | `/doctor` (what's set up, what isn't), `/fix-deploy`, `/connect-domain`, `/make-it-mine` (your name everywhere), `/add-page`, `/add-table`, `/crm-fields`, `/add-env`. |
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
pnpm checkup    # check every piece of the setup (never prints your keys)
```

## License

MIT
