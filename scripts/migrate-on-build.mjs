// Runs on Vercel before `next build` (package.json "vercel-build"), so a
// fresh deploy has its tables. It applies only the files in
// supabase/migrations/ that the database hasn't seen yet, and does nothing
// when they're all applied.
//
// It needs a direct Postgres address, which the Supabase integration on
// Vercel provides as POSTGRES_URL_NON_POOLING. Without it (your laptop, or a
// project set up by hand with `pnpm db:push`) it skips and says why.
import { execFileSync } from "node:child_process";

const dbUrl = process.env.POSTGRES_URL_NON_POOLING;
if (!dbUrl) {
  console.log("migrate-on-build: POSTGRES_URL_NON_POOLING is not set, skipping (run `pnpm db:push` yourself).");
  process.exit(0);
}

console.log("migrate-on-build: applying new files in supabase/migrations/ ...");
try {
  // --yes answers the "apply these migrations?" question; a build has no one to ask.
  execFileSync("supabase", ["db", "push", "--db-url", dbUrl, "--include-all", "--yes"], {
    stdio: "inherit",
    env: { ...process.env, PATH: `${process.cwd()}/node_modules/.bin:${process.env.PATH}` },
  });
} catch {
  // The deploy stops here rather than shipping code that expects tables the
  // database doesn't have. The Supabase CLI's own message is printed above.
  console.error("migrate-on-build: migrations failed, so the deploy stopped. See the error above.");
  process.exit(1);
}
