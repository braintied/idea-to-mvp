# Bundle Geist fonts for offline builds

Created: 2026-10-16 (Asia/Kolkata)  
Updated: 2026-10-16 (Asia/Kolkata)  
Version: 1

The starter fetched Geist and Geist Mono from Google during `next build`.
A tenant build with external network disabled cannot make those requests.
Load the same font families from the pinned public `geist` 1.7.2 package,
which uses bundled WOFF2 files through `next/font/local`. Preserve both CSS
variables and the existing layout classes.

Update the generated pnpm lockfile and the agent font guidance. The original
pnpm 12 lockfile was already complete: its first YAML document locks the
package manager, and its second locks the application. An initial inspection
of the first document incorrectly suggested missing application dependencies;
an actual frozen install passed unchanged and corrected that finding.

Verification uses the starter's required `pnpm check` (typecheck, lint, build)
and a frozen offline reinstall. No database migration, deployment or external
credential was involved. The strict sandbox's Linux network/uid proof belongs
to its own live red-team gate.
