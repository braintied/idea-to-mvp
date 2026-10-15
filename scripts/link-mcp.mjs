// Points the Supabase MCP server at your own project in every coding tool's
// config, so your agent can only ever see that one database (and only read it).
// Run after `pnpm db:link`, which saves your project ref locally.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

let ref;
try {
  ref = readFileSync("supabase/.temp/project-ref", "utf8").trim();
} catch {
  console.error("No linked Supabase project yet. Run `pnpm db:link` first.");
  process.exit(1);
}
if (!/^[a-z0-9]{20}$/.test(ref)) {
  console.error(`supabase/.temp/project-ref doesn't look like a project ref: "${ref}"`);
  process.exit(1);
}

// One read-only Supabase address, written into each coding tool's config:
// Claude Code (.mcp.json), OpenCode (opencode.json) and Codex (.codex/config.toml).
function pointAtProject(address) {
  const url = new URL(address);
  url.searchParams.set("project_ref", ref);
  url.searchParams.set("read_only", "true");
  return url.toString();
}

const claude = JSON.parse(readFileSync(".mcp.json", "utf8"));
claude.mcpServers.supabase.url = pointAtProject(claude.mcpServers.supabase.url);
writeFileSync(".mcp.json", JSON.stringify(claude, null, 2) + "\n");

if (existsSync("opencode.json")) {
  const opencode = JSON.parse(readFileSync("opencode.json", "utf8"));
  opencode.mcp.supabase.url = pointAtProject(opencode.mcp.supabase.url);
  writeFileSync("opencode.json", JSON.stringify(opencode, null, 2) + "\n");
}

if (existsSync(".codex/config.toml")) {
  const toml = readFileSync(".codex/config.toml", "utf8");
  const updated = toml.replace(
    /(\[mcp_servers\.supabase\]\s*\nurl = ")([^"]+)(")/,
    (_, start, address, end) => start + pointAtProject(address) + end,
  );
  writeFileSync(".codex/config.toml", updated);
}

console.log(`Supabase now points at project ${ref} (read-only) in Claude Code, OpenCode and Codex.`);
console.log("Restart your coding tool, then sign in to Supabase when it asks (Claude Code: /mcp).");
