// Runs before `next build` on Vercel (the `vercel-build` script).
// When Supabase was added through Vercel (the Deploy button does this), Vercel gives
// the project a database address. This applies supabase/migrations to it, so the
// tables exist before the site goes live. It's the same `supabase db push` you'd run
// yourself, and it records what it applied the same way, so `pnpm db:push` from your
// laptop later sees the same history.
//
// It only runs on production builds. A preview build is a branch that isn't merged yet,
// and its migrations must not reach the database your live site uses.
// With no database address (you set Supabase up by hand), it does nothing.
import { spawnSync } from "node:child_process";

const env = process.env.VERCEL_ENV;
const raw = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

if (env !== "production") {
  console.log(`migrate-on-deploy: skipped (VERCEL_ENV=${env ?? "unset"}, only production migrates).`);
  process.exit(0);
}
if (!raw) {
  console.log("migrate-on-deploy: skipped (no POSTGRES_URL; Supabase was set up by hand, run pnpm db:push).");
  process.exit(0);
}

// Vercel's build machines have no IPv6, and Supabase's direct database address is
// IPv6 only. The pooler is reachable; its session mode (port 5432) behaves like a
// direct connection, which migrations need. Transaction mode (6543) does not.
const url = new URL(raw);
if (url.hostname.endsWith(".pooler.supabase.com") && url.port === "6543") {
  url.port = "5432";
}

const result = spawnSync(
  "pnpm",
  ["exec", "supabase", "db", "push", "--db-url", url.toString(), "--include-all", "--yes"],
  { stdio: ["ignore", "inherit", "inherit"] },
);
if (result.status !== 0) {
  console.error("migrate-on-deploy: supabase db push failed. The deploy stops here so the site never runs without its tables.");
  process.exit(result.status ?? 1);
}
console.log("migrate-on-deploy: database is up to date.");
