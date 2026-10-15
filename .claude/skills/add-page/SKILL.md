---
name: add-page
description: Add a new page to the site, like about, pricing, FAQ or contact. Use when someone asks for a new page or section of the site.
---

# Add a page

1. Agree on what the page is for and its one action, in a sentence.
2. Create `src/app/<page-name>/page.tsx` (lowercase, dashes). Give it its own `metadata`
   (title and description), using the product name from `src/app/layout.tsx`.
3. Build it from the existing pieces and tokens: same header and footer as
   `src/app/page.tsx`, Tailwind classes from `globals.css` tokens only (no hex colors),
   real words from CLAUDE.md's idea (no lorem ipsum, no invented numbers or testimonials).
4. Link it from the header in `src/app/page.tsx` (and anywhere else it belongs).
5. `pnpm check`, then open it with playwright at phone and desktop width and show it.
