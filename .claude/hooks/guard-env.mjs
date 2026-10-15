// Claude Code hook (PreToolUse). Stops Claude from reading, printing, or
// editing real env files, so your keys never end up in the conversation.
// .env.example is fine: it only has fake values.
// Exit code 2 = blocked, and the message goes back to Claude.
import { readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8"));
const tool = input.tool_name;
const args = input.tool_input ?? {};

const realEnvFile = /(^|[\s/'"=])\.env(\.(local|development|production|test))?(\.local)?($|[\s'";|&)])/;

const target =
  tool === "Bash" ? String(args.command ?? "") : String(args.file_path ?? args.path ?? "");

// Creating .env.local from the template is safe: it only copies fake values.
const copyingTemplate = /^\s*cp\s+\.env\.example\s+\.env\.local\s*$/.test(target);

if (realEnvFile.test(target) && !copyingTemplate) {
  console.error(
    "Blocked by .claude/hooks/guard-env.mjs: real env files hold secrets and stay out of the conversation. " +
      "Read .env.example for variable names, and ask the user to add or change values in .env.local themselves.",
  );
  process.exit(2);
}

// grep -r (and -R, egrep -r, fgrep -r) searches every file, including
// .env.local, and prints matching lines, keys and all. Unlike the Grep tool
// and rg, it doesn't skip ignored files. Allowed only when it excludes env files.
const recursiveGrep =
  tool === "Bash" &&
  /\b[ef]?grep\b[^|;&]*\s(-[A-Za-z]*[rR]|--(dereference-)?recursive\b)/.test(target) &&
  !/--exclude=['"]?\.env/.test(target);

if (recursiveGrep) {
  console.error(
    "Blocked: recursive grep would print .env.local. Use the Grep tool (it skips env files) or add --exclude='.env*'.",
  );
  process.exit(2);
}
