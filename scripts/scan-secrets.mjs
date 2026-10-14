// Looks through the files you're about to commit for anything that
// looks like a real key, and refuses the commit if it finds one.
// Runs automatically from .githooks/pre-commit.
import { execFileSync } from "node:child_process";

const patterns = [
  ["Anthropic key", /sk-ant-[A-Za-z0-9_-]{20,}/],
  ["OpenAI key", /sk-(proj-)?[A-Za-z0-9_-]{32,}/],
  ["Resend key", /\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{16,}/],
  ["Supabase secret key", /sb_secret_[A-Za-z0-9_-]{16,}/],
  ["Supabase service-role JWT", /eyJhbGciOi[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]*cm9sZSI6InNlcnZpY2Vfcm9sZS[A-Za-z0-9_-]*/],
  ["Supabase access token", /sbp_[a-f0-9]{40}/],
  ["Stripe live key", /sk_live_[A-Za-z0-9]{16,}/],
  ["GitHub token", /gh[pousr]_[A-Za-z0-9]{36,}/],
  ["Private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
];

const staged = execFileSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACM"], {
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean);

const findings = [];
for (const file of staged) {
  if (/(^|\/)\.env(\.|$)/.test(file) && !file.endsWith(".env.example")) {
    findings.push(`${file}: env files never go in git`);
    continue;
  }
  let content;
  try {
    content = execFileSync("git", ["show", `:${file}`], { encoding: "utf8", maxBuffer: 20e6 });
  } catch {
    continue; // binary or unreadable
  }
  for (const [name, pattern] of patterns) {
    if (pattern.test(content)) findings.push(`${file}: looks like a ${name}`);
  }
}

if (findings.length > 0) {
  console.error("\nCommit blocked: possible secret in staged files.\n");
  for (const finding of findings) console.error(`  - ${finding}`);
  console.error("\nMove the value to .env.local, unstage the file (git restore --staged <file>), and try again.\n");
  process.exit(1);
}
