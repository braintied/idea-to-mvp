// `pnpm keys`: fills in .env.local one question at a time.
// Secret values are hidden while you paste them and are never printed.
// Press Enter on any question to keep what's already there.
// Run it in your own Terminal: Claude is blocked from seeing these values on purpose.
import { existsSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { createInterface } from "node:readline";

const FILE = ".env.local";

const fields = [
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    where: "Supabase → Project Settings → Data API → Project URL",
    check: (v) => /^https:\/\/[a-z0-9]{20}\.supabase\.co$/.test(v) || "Should look like https://abcdefghijklmnopqrst.supabase.co",
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    where: "Supabase → Project Settings → API Keys → Publishable key",
    check: (v) => v.startsWith("sb_publishable_") || "Should start with sb_publishable_",
  },
  {
    name: "SUPABASE_SECRET_KEY",
    secret: true,
    where: "Supabase → Project Settings → API Keys → Secret keys → Reveal",
    check: (v) => v.startsWith("sb_secret_") || "Should start with sb_secret_",
  },
  {
    name: "RESEND_API_KEY",
    secret: true,
    where: "resend.com → API Keys → Create API Key",
    check: (v) => v.startsWith("re_") || "Should start with re_",
  },
  {
    name: "EMAIL_FROM",
    where: 'Until your domain is verified in Resend, keep: Your Idea <onboarding@resend.dev>',
    check: (v) => /<[^@\s]+@[^@\s]+>$|^[^@\s]+@[^@\s]+$/.test(v) || 'Should look like Name <hello@yourdomain.com>',
  },
  {
    name: "OWNER_EMAIL",
    where: "The email you sign up to Resend and Supabase with",
    check: (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) || "Should be an email address",
  },
  {
    name: "ANTHROPIC_API_KEY",
    secret: true,
    where: "console.anthropic.com → API Keys → Create Key",
    check: (v) => v.startsWith("sk-ant-") || "Should start with sk-ant-",
  },
  {
    name: "OPENAI_API_KEY",
    secret: true,
    where: "platform.openai.com/api-keys (only for /design images; Enter to skip)",
    check: (v) => v.startsWith("sk-") || "Should start with sk-",
  },
];

// Values still equal to the fake ones in .env.example count as not set.
const placeholder = (v) => !v || v.includes("...") || v.includes("your-project-ref") || v === "you@example.com" || v.includes("yourdomain.com");

if (!existsSync(FILE)) copyFileSync(".env.example", FILE);
let text = readFileSync(FILE, "utf8");

const current = (name) => new RegExp(`^${name}=(.*)$`, "m").exec(text)?.[1].trim() ?? "";
function set(name, value) {
  const line = `${name}=${value}`;
  const pattern = new RegExp(`^#?\\s*${name}=.*$`, "m");
  text = pattern.test(text) ? text.replace(pattern, line) : `${text.trimEnd()}\n${line}\n`;
}

// After `pnpm db:link` the project URL is known; offer it as the default.
let linkedUrl = "";
try {
  linkedUrl = `https://${readFileSync("supabase/.temp/project-ref", "utf8").trim()}.supabase.co`;
} catch {
  // not linked yet
}

const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
let hiding = false;
const write = rl._writeToOutput.bind(rl);
rl._writeToOutput = (s) => write(hiding && !s.includes("\n") ? "•".repeat(s.length) : s);

function ask(question, secret) {
  return new Promise((resolve) => {
    hiding = false;
    rl.question(question, (answer) => {
      hiding = false;
      resolve(answer.trim());
    });
    hiding = secret;
  });
}

if (!process.stdin.isTTY) {
  console.error("Run `pnpm keys` in your own Terminal window (it asks questions).");
  process.exit(1);
}

console.log(`\nFilling in ${FILE}. Paste each value and press Enter. Enter alone keeps the current value.\n`);
for (const field of fields) {
  const now = current(field.name);
  const suggested = field.name === "NEXT_PUBLIC_SUPABASE_URL" && placeholder(now) ? linkedUrl : "";
  const status = placeholder(now)
    ? suggested ? `suggested: ${suggested}` : "not set"
    : field.secret ? "set" : now;
  console.log(`${field.name}  (${status})\n  where: ${field.where}`);
  for (;;) {
    const answer = (await ask("  > ", field.secret)) || suggested;
    if (!answer) break;
    const ok = field.check(answer);
    if (ok === true) {
      set(field.name, answer);
      console.log("  saved");
      break;
    }
    console.log(`  ${ok}. Try again, or press Enter to skip.`);
  }
  console.log("");
}
rl.close();

writeFileSync(FILE, text);
const missing = fields.filter((f) => f.name !== "OPENAI_API_KEY" && placeholder(current(f.name))).map((f) => f.name);
console.log(missing.length ? `Still missing: ${missing.join(", ")}. Run pnpm keys again when you have them.` : `${FILE} is complete.`);
