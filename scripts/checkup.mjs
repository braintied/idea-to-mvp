// `pnpm checkup`: checks that everything the app needs is set up and working.
// One line per check. It never prints a secret value, so it's safe to run
// with Claude watching or to paste the output to a helper.
//
// It reads .env.local (and anything already set in your Terminal, which wins,
// like in Next.js), then asks each service whether your keys work:
//   Supabase  - the database answers and the waitlist table exists
//   Resend    - the email key is accepted
//   DeepSeek  - the AI key is accepted and the account has credit
//   Inngest   - is the local dev server (pnpm inngest) running? (info only)
// It exits with an error if anything required is missing or broken.
import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const FILE = ".env.local";
const TIMEOUT_MS = 8000;

// --- Read the env ------------------------------------------------------------

const fromFile = {};
if (existsSync(FILE)) {
  for (const line of readFileSync(FILE, "utf8").split("\n")) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    fromFile[match[1]] = match[2].trim().replace(/^(['"])(.*)\1$/, "$2");
  }
}
const value = (name) => (process.env[name] || fromFile[name] || "").trim();

// Values still equal to the fake ones in .env.example count as not set
// (the same rule pnpm keys uses).
const placeholder = (v) =>
  !v || v.includes("...") || v.includes("your-project-ref") || v === "you@example.com" || v.includes("yourdomain.com");

// --- Output ------------------------------------------------------------------

let failures = 0;
const ok = (label, detail) => console.log(`✓ ${label.padEnd(22)} ${detail}`);
const bad = (label, detail) => {
  failures += 1;
  console.log(`✗ ${label.padEnd(22)} ${detail}`);
};
const info = (label, detail) => console.log(`• ${label.padEnd(22)} ${detail}`);

// --- 1. Env groups: set, missing, or malformed --------------------------------

// Each variable with a check that says what's wrong, or true when it looks right.
// The same groups as src/lib/env.ts and src/lib/supabase/public-env.ts.
const groups = [
  {
    label: "Supabase (browser)",
    vars: {
      NEXT_PUBLIC_SUPABASE_URL: (v) =>
        /^https:\/\/[a-z0-9]{20}\.supabase\.co\/?$/.test(v) || "should look like https://abcdefghijklmnopqrst.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: (v) => v.startsWith("sb_publishable_") || "should start with sb_publishable_",
    },
  },
  {
    label: "Supabase (server)",
    vars: { SUPABASE_SECRET_KEY: (v) => v.startsWith("sb_secret_") || "should start with sb_secret_" },
  },
  {
    label: "Email (Resend)",
    vars: {
      RESEND_API_KEY: (v) => v.startsWith("re_") || "should start with re_",
      EMAIL_FROM: (v) =>
        /<[^@\s]+@[^@\s]+>$|^[^@\s]+@[^@\s]+$/.test(v) || "should look like Name <hello@yourdomain.com>",
    },
  },
  {
    label: "Owner",
    vars: { OWNER_EMAIL: (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()) || "should be an email address" },
  },
  {
    label: "AI (DeepSeek)",
    vars: {
      DEEPSEEK_API_KEY: (v) => v.startsWith("sk-") || "should start with sk-",
      AI_MODEL: (v) => v.length > 0 || "should be a model id, like deepseek-flash",
    },
  },
];

if (!existsSync(FILE)) info(".env.local", "not found. Run pnpm keys to create it.");

// Which groups are usable, so the service checks below can skip the rest.
const ready = {};
for (const group of groups) {
  const problems = [];
  for (const [name, check] of Object.entries(group.vars)) {
    const v = value(name);
    if (placeholder(v)) {
      problems.push(`${name} missing`);
      continue;
    }
    const result = check(v);
    if (result !== true) problems.push(`${name} ${result}`);
  }
  ready[group.label] = problems.length === 0;
  if (problems.length === 0) ok(group.label, "set");
  else bad(group.label, `${problems.join("; ")}. Fix with pnpm keys.`);
}

const openai = value("OPENAI_API_KEY");
info("OpenAI (optional)", placeholder(openai) ? "not set (only needed for /design images)" : "set");

// --- 2. Site address ----------------------------------------------------------

// The same order as siteUrl() in src/lib/env.ts.
const site = value("NEXT_PUBLIC_SITE_URL");
const vercel = value("VERCEL_PROJECT_PRODUCTION_URL");
if (site && !placeholder(site)) {
  if (z.url().safeParse(site).success) ok("Site address", `${site.replace(/\/$/, "")} (from NEXT_PUBLIC_SITE_URL)`);
  else bad("Site address", "NEXT_PUBLIC_SITE_URL isn't a full address. Use http://localhost:3000 or https://yourdomain.com.");
} else if (vercel) {
  ok("Site address", `https://${vercel} (Vercel's production address)`);
} else {
  bad("Site address", "NEXT_PUBLIC_SITE_URL missing. Set it to http://localhost:3000 in .env.local.");
}

// --- 3. Services ----------------------------------------------------------------

// fetch with a time limit, so a dead network never hangs the checkup.
const timedFetch = (url, init = {}) => fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });

// Why a request failed, in words: timed out, or couldn't connect at all.
const networkProblem = (error) =>
  error instanceof Error && error.name === "TimeoutError"
    ? `no answer after ${TIMEOUT_MS / 1000}s (check your internet)`
    : `couldn't connect (${error instanceof Error ? error.message : String(error)})`;

async function checkSupabase() {
  const label = "Supabase database";
  if (!ready["Supabase (browser)"] || !ready["Supabase (server)"]) return info(label, "skipped (fix the Supabase keys first)");
  const supabase = createClient(value("NEXT_PUBLIC_SUPABASE_URL"), value("SUPABASE_SECRET_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: timedFetch },
  });
  try {
    const { count, error } = await supabase.from("waitlist").select("*", { count: "exact", head: true });
    if (!error) return ok(label, `reachable, waitlist table has ${count ?? 0} signups`);
    const message = `${error.code ?? ""} ${error.message ?? ""}`;
    if (/PGRST205|42P01|does not exist|could not find the table/i.test(message)) {
      return bad(label, "reachable, but the waitlist table is missing. Deploy, or run pnpm db:push.");
    }
    if (/invalid api key|jwt|unauthorized|401/i.test(message)) {
      return bad(label, "rejected SUPABASE_SECRET_KEY. Copy it again: Supabase → Project Settings → API Keys.");
    }
    if (/fetch failed|timeout|abort/i.test(message)) return bad(label, networkProblem(new Error(message.trim())));
    return bad(label, message.trim() || "unknown error");
  } catch (error) {
    return bad(label, networkProblem(error));
  }
}

async function checkSupabasePublishable() {
  const label = "Supabase sign-in key";
  if (!ready["Supabase (browser)"]) return info(label, "skipped (fix the Supabase keys first)");
  try {
    const url = value("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
    const response = await timedFetch(`${url}/auth/v1/settings`, {
      headers: { apikey: value("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") },
    });
    if (response.ok) return ok(label, "accepted");
    if (response.status === 401) {
      return bad(label, "rejected NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Copy it again: Supabase → Project Settings → API Keys.");
    }
    return bad(label, `unexpected answer (HTTP ${response.status})`);
  } catch (error) {
    return bad(label, networkProblem(error));
  }
}

// GET /domains needs a full-access key. A "sending access" key answers with
// restricted_api_key, which still means the key is real and can send.
// A bad key gets 401, or 400 "API key is invalid".
const resendError = z.object({ name: z.string(), message: z.string().optional() });
const resendDomains = z.object({ data: z.array(z.object({ name: z.string(), status: z.string() })) });

async function checkResend() {
  const label = "Resend";
  if (!ready["Email (Resend)"]) return info(label, "skipped (fix the Resend keys first)");
  try {
    const response = await timedFetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${value("RESEND_API_KEY")}` },
    });
    const body = await response.json().catch(() => null);
    const problem = resendError.safeParse(body).data;
    if (response.status === 401 && problem?.name === "restricted_api_key") {
      return ok(label, "key accepted (sending only)");
    }
    if (response.status === 401 || response.status === 403 || /api key is invalid/i.test(problem?.message ?? "")) {
      return bad(label, "rejected RESEND_API_KEY. Create a new one: resend.com → API Keys.");
    }
    if (!response.ok) return bad(label, `unexpected answer (HTTP ${response.status})`);

    // Is the address in EMAIL_FROM on a domain Resend has verified?
    const fromDomain = /@([^@\s>]+)>?$/.exec(value("EMAIL_FROM"))?.[1]?.toLowerCase() ?? "";
    const domains = resendDomains.safeParse(body).data?.data ?? [];
    const verified = domains.some((d) => d.name.toLowerCase() === fromDomain && d.status === "verified");
    if (fromDomain === "resend.dev") return ok(label, "key accepted (onboarding@resend.dev only emails your own address)");
    if (verified) return ok(label, `key accepted, ${fromDomain} is verified`);
    return bad(label, `key accepted, but ${fromDomain || "the EMAIL_FROM domain"} isn't verified in Resend → Domains yet.`);
  } catch (error) {
    return bad(label, networkProblem(error));
  }
}

const deepseekBalance = z.object({
  is_available: z.boolean(),
  balance_infos: z.array(z.object({ currency: z.string(), total_balance: z.string() })),
});

async function checkDeepSeek() {
  const label = "DeepSeek";
  if (!ready["AI (DeepSeek)"]) return info(label, "skipped (fix the DeepSeek key first)");
  try {
    const response = await timedFetch("https://api.deepseek.com/user/balance", {
      headers: { Authorization: `Bearer ${value("DEEPSEEK_API_KEY")}`, Accept: "application/json" },
    });
    if (response.status === 401) {
      return bad(label, "rejected DEEPSEEK_API_KEY. Create a new one: platform.deepseek.com → API keys.");
    }
    if (!response.ok) return bad(label, `unexpected answer (HTTP ${response.status})`);
    const parsed = deepseekBalance.safeParse(await response.json().catch(() => null));
    if (!parsed.success) return bad(label, "key accepted, but the balance answer looked unfamiliar");
    const balance = parsed.data.balance_infos.map((b) => `${b.total_balance} ${b.currency}`).join(", ") || "0";
    if (!parsed.data.is_available) return bad(label, `key accepted, but out of credit (${balance}). Top up at platform.deepseek.com.`);
    return ok(label, `key accepted, balance ${balance}`);
  } catch (error) {
    return bad(label, networkProblem(error));
  }
}

// Info only: the local Inngest dev server is needed only while testing
// background jobs on your laptop.
async function checkInngest() {
  const label = "Inngest dev server";
  try {
    await fetch("http://localhost:8288", { signal: AbortSignal.timeout(1500) });
    info(label, "running on localhost:8288");
  } catch {
    info(label, "not running (only needed to test background jobs: run pnpm inngest)");
  }
}

// One at a time, so the lines print in a steady order.
await checkSupabase();
await checkSupabasePublishable();
await checkResend();
await checkDeepSeek();
await checkInngest();

console.log("");
if (failures > 0) {
  console.log(`${failures} problem${failures === 1 ? "" : "s"} to fix. The runbook (docs/runbook.md) has more help.`);
  process.exit(1);
}
console.log("Everything checks out.");
