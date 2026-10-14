---
name: brand-to-tokens
description: Turn brand guidelines (a palette, fonts, a logo, or a pasted guidelines doc) into the design tokens in src/app/globals.css, so every page picks up the brand. Use when the user shares brand colors, fonts, a logo, or says "apply my brand".
---

# Brand to tokens

1. Find the brand inputs: what the user pasted, a file they named, or the "The brand"
   section of CLAUDE.md. If there's no palette, ask for one before guessing.
2. Map them onto the existing tokens in `src/app/globals.css`. Keep the names; change
   the values:
   - `--brand`: the main action color (buttons, links).
   - `--brand-ink`: text on top of `--brand`. Must pass 4.5:1 contrast against it.
   - `--background`, `--surface`, `--foreground`, `--muted`, `--line`, `--danger`.
3. Write a matching dark-mode set inside the `prefers-color-scheme: dark` block. Don't
   just invert: keep the brand hue, lighten it for dark backgrounds.
4. Check contrast for `--foreground` on `--background` and `--brand-ink` on `--brand`
   in both modes. Report the ratios.
5. Fonts: if the brand names a Google Font, swap it in `src/app/layout.tsx` with
   `next/font/google` and keep the `--font-geist-sans` variable name or update
   `--font-sans` to match.
6. Logo: put the file in `public/` and use it in the header on `src/app/page.tsx` with
   `next/image`, with real alt text.
7. Update "The brand" section in CLAUDE.md with the palette and voice.
8. Run `pnpm dev` and show the landing page in light and dark, at phone and desktop
   width.

Never hard-code a hex color in a component. If a new color is needed, add a token.
