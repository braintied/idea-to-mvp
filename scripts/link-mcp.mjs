// Points the Supabase MCP server in .mcp.json at your own project,
// so Claude can only ever see that one database (and only read it).
// Run after `pnpm db:link`, which saves your project ref locally.
import { readFileSync, writeFileSync } from "node:fs";

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

const config = JSON.parse(readFileSync(".mcp.json", "utf8"));
const url = new URL(config.mcpServers.supabase.url);
url.searchParams.set("project_ref", ref);
url.searchParams.set("read_only", "true");
config.mcpServers.supabase.url = url.toString();
writeFileSync(".mcp.json", JSON.stringify(config, null, 2) + "\n");

console.log(`Supabase MCP now points at project ${ref} (read-only).`);
console.log("Restart Claude Code, then run /mcp to sign in to Supabase.");
