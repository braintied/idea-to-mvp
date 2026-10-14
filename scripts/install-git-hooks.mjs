// Turns on the git hooks in .githooks/ (secret scan before commit,
// `pnpm check` before push). Runs automatically on `pnpm install`.
import { execFileSync } from "node:child_process";

try {
  execFileSync("git", ["rev-parse", "--is-inside-work-tree"], { stdio: "ignore" });
  execFileSync("git", ["config", "core.hooksPath", ".githooks"]);
} catch {
  // Not a git repo yet (e.g. downloaded as a zip). Nothing to do.
}
