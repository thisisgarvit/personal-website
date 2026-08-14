# ARCHITECTURE — garvit.app repository foundation (Task 3)

Recorded per PRD §15: these paths are now **frozen**. No two workers edit the
same module concurrently. `DESIGN.md` and `PRD.md` remain the frozen source of
truth; no worker invents tokens, copy, behavior, or dependencies.

## Toolchain versions

| Tool | Version |
|---|---|
| Node | 22.17.0 |
| pnpm | 10.11.0 |
| Next.js | 16.3.1 (App Router) |
| React / React DOM | 19.2.8 |
| TypeScript | 5.9.3 (strict) |
| Vitest | 4.1.10 |
| @playwright/test | 1.62.1 |

## Repository layout

| Path | Purpose |
|---|---|
| `src/app/` | App Router root (note: `src/`-based — the PRD's `app/…` paths map to `src/app/…`) |
| `src/app/layout.tsx` | Root layout; `next/font/local` wiring; metadata title template from `SiteConfig` |
| `src/app/globals.css` | Bare global reset ONLY — all visual design is Task 4 (CSS Modules + custom properties; no Tailwind) |
| `src/app/page.tsx` | `/` shell |
| `src/app/work/stay-portal/page.tsx` | `/work/stay-portal` shell |
| `src/app/work/maxie/page.tsx` | `/work/maxie` shell |
| `src/app/work/agentic-calendar/page.tsx` | `/work/agentic-calendar` shell |
| `src/app/notes/dynamic-island/page.tsx` | `/notes/dynamic-island` shell |
| `src/app/not-found.tsx` | Accessible not-found state |
| `src/app/robots.ts` | Allow-all; preview `noindex` is Task 9 (TODO in file) |
| `src/app/sitemap.ts` | Exactly the five public routes |
| `src/data/site.ts` | `SiteConfig` + derived `productLabel` — the ONLY source of identity strings (PRD §4) |
| `src/data/site.test.ts` | Unit smoke test (productLabel derivation) |
| `src/fonts/` | Self-hosted subset WOFF2 (extracted from approved `slice-product.html`) + OFL notices |
| `src/mdx-components.tsx` | @next/mdx App Router hook (pass-through; Task 5 may extend) |
| `e2e/` | Playwright E2E specs (`home.spec.ts` smoke) |
| `public/` | Static assets (resume PDF lands here in Task 5 at `SiteConfig.resumePath`) |
| `next.config.ts` | MDX wiring + security headers (nosniff, strict referrer, camera/mic/geo off) |
| `vitest.config.ts` | Vitest: jsdom env, `src/**/*.test.{ts,tsx}`, `@` alias |
| `playwright.config.ts` | chromium/webkit/firefox projects; only chromium binary installed in Task 3 |
| `tsconfig.json` | Strict TS, `@/*` → `./src/*` |
| `eslint.config.mjs` | eslint-config-next (core-web-vitals + typescript) |

## Fonts

- `src/fonts/Archivo-400-800.woff2` — Archivo variable, wght 400–800
- `src/fonts/IBMPlexMono-400.woff2`, `IBMPlexMono-500.woff2`, `IBMPlexMono-600.woff2`
- OFL notices: `src/fonts/OFL-NOTICE-Archivo.txt`, `src/fonts/OFL-NOTICE-IBMPlexMono.txt`
- Wired via `next/font/local` in `src/app/layout.tsx`; CSS variables `--font-archivo` and `--font-plex-mono`.

## Frozen module ownership (PRD §15)

- **Claude (Tasks 3–5, 9):** application scaffold, route shells, token
  transcription, structural components, content data/MDX, metadata plumbing,
  static assets, CI/E2E/a11y/perf harnesses, deployment config,
  `package.json` + `pnpm-lock.yaml` (Codex never edits the manifest/lockfile).
- **Codex Task 6:** `src/features/flags/**` + flag-effect integration contract.
- **Codex Task 7:** `src/features/board/**` + board-to-preview/mascot signals.
- **Codex Task 8:** `src/features/mascot/**` + poster.
- **Codex Task 8A:** `src/app/opengraph-image.tsx` + its visual tests
  (PRD says `app/opengraph-image.tsx`; with the `src/` directory that is
  `src/app/opengraph-image.tsx`).

`src/features/` does not exist yet; Codex creates it inside its owned globs only.

## Pre-installed dependencies for later tasks

Installed in Task 3 so the lockfile stays Claude-owned; **not imported anywhere
yet** — do not use before their owning task:

- `three` 0.185.1, `@react-three/fiber` 9.7.0, `@react-three/drei` 10.7.8 — Task 8 (mascot)
- `motion` 13.1.0 — Tasks 6/7 (flag effects, board physics)
- Known gap for Task 8 typecheck: `@types/three` is not installed (not in the
  Task 3 dependency allowlist). Claude's lane adds it when Task 8 starts.

## Scripts

`dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `test`
(`vitest run`), `test:e2e` (`playwright test`).

## Styling approach

CSS Modules + approved custom properties only. No Tailwind, no CSS-in-JS,
no styled-components. Task 4 owns all tokens/visuals.
