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

---

# Task 4 additions — tokens + structural shell (Claude lane)

## Tokens

All DESIGN.md §3 + §7.2 (CSS timing) tokens live in `src/app/globals.css`:
light values on `:root`, dark values under BOTH
`@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`
and `:root[data-theme="dark"]` (override wins in both directions; the two
dark blocks are intentionally duplicated — keep them identical). Type ramp
tokens are `font:` -shorthand size/line-height pairs (`--type-hero` …
`--type-product`) with companion `--track-*` tokens; `--track-hero` moves
between the three locked hero values via media queries at 842px/1264px
(derived from the §3.2 clamp). Reduced-transparency, increased-contrast,
forced-colors, and reduced-motion behaviors are also global there.

## Theme bootstrap

Inline script (first child of `<body>` in `src/app/layout.tsx`) reads
`THEME_STORAGE_KEY` and sets `document.documentElement.dataset.theme`
before content paints; `<html>` carries `suppressHydrationWarning` for
this attribute only. Codex Task 6's `dark_mode` flag must write
`"light" | "dark"` to that key and set the same attribute.

## Storage keys — `src/data/storage.ts`

`THEME_STORAGE_KEY` (`garvit-theme:v1`, localStorage),
`BOARD_STORAGE_KEY` (`garvit-board:v1`, sessionStorage),
`BANNER_DISMISSED_KEY` (`garvit-banner:v1`, sessionStorage),
`FLAG_CONFETTI_KEY` (`garvit-flag-confetti:v1`, sessionStorage),
`FLAG_CANDID_KEY` (`garvit-flag-candid:v1`, sessionStorage).
Import these constants; never inline key strings.

## Toast / live region — `src/components/toast/`

ONE polite live region for the whole product (PRD §13), rendered by
`<Toaster />` in the root layout. API (client only):

```ts
import { toast, announce } from "@/components/toast/toast";
toast("message");                    // visual toast + polite announcement
toast("message", { announce: false }); // visual only
announce("message");                 // live region only, no toast
```

Do not render additional `aria-live` regions; route board/flag
announcements (keyboard moves, reset toast) through this module.

## Component contracts for Codex lanes

- **Flags shell** — `src/components/ops/FlagsPanel.tsx` is a static
  visual shell (no handlers/state). Task 6 rewires the inputs or swaps in
  a stateful component reusing `ops.module.css` classes. Preserve: row
  order (`dark_mode`, `confetti_on_scroll`, `candid_mode`, `comic_sans`),
  descriptors (`theme` / `ship signal` / `field notes` / `prod locked` —
  never `CODEX LAB`), native checkbox semantics, `3 / 4 live` header,
  Comic Sans tooltip copy. Intended row props:
  `{ definition: FeatureFlagDefinition; checked: boolean; onCheckedChange(next: boolean): void }`.
- **Mascot slot** — `src/components/ops/MascotSlot.tsx` reserves the
  on-call stage (`[data-mascot-slot]`, min-height 204px, panel-2 fill,
  `ON CALL` label). Task 8 renders poster/canvas inside it, keeping the
  label and stage geometry.
- **Case preview** — `src/components/case-preview/CasePreviewDialog.tsx`
  (Radix dialog, §5.9 styling; focus trap/Escape/restore handled). Props:
  `{ open, onOpenChange, kindLabel, ticketId, title, lede, facts (≤3), artifact?, children?, readFullCaseHref }`.
  Task 7 owns open-state wiring from tickets. A dev-only styling demo
  lives at `/dev/preview` (404s in production; not linked in nav).
- **Candid notes** — ticket markup includes `[data-candid-note]`
  (visible by default). Task 6/7 toggle visibility via that attribute.
- **Board shell** — `src/components/board/` renders the authored matrix
  statically (real route links, inert 44px grips, inert reset). Task 7
  replaces interactivity in `src/features/board/**`; the reset toast
  (`Board reset. No sprint ceremony required.`) and helper copy
  (`State lasts for this tab.`) ship with Task 7, not the shell.

## Task 4 dependencies

`@radix-ui/react-popover`, `@radix-ui/react-dialog`,
`@radix-ui/react-tooltip`, `@radix-ui/react-visually-hidden` (installed;
visually-hidden currently unused — the global `.sr-only` utility covers
it — kept for Codex overlay work).

## QA artifacts

`scripts/shell-screens.mts` captures the four design-gate screenshots
(1440×900 + 390×844, light + dark) to `docs/qa/task4/` against a running
production build:
`pnpm build && pnpm start & node --experimental-strip-types scripts/shell-screens.mts`.
`src/data/phone-privacy.test.ts` enforces PRD §5.4 (no assembled phone
number anywhere under `src/`).

# Task 7 additions — sprint-board physics (Codex lane)

## Interactive board island

`src/features/board/InteractiveBoardSection.tsx` replaces the homepage's
static `BoardSection` import while reusing its approved CSS module classes.
Its server snapshot is still the authored four-ticket matrix with direct route
links, so no-JS behavior is unchanged. Pointer transforms, keyboard moves,
dialog state, and reset are contained in the client island.

The island imports the Task 4 `CasePreviewDialog` contract unchanged. Preview
copy in `preview-content.tsx` is the approved slice `cases` copy; the four
artifacts are local CSS/HTML diagrams and introduce no remote assets.

## Board persistence

`BOARD_STORAGE_KEY` stores only a JSON slug-to-column mapping. Missing or
invalid slugs/columns fall back individually to the authored matrix; malformed
JSON falls back completely. Reset removes the entry rather than writing the
authored mapping.

## Physics constants and conversion

Pure, tested mechanics live in `src/features/board/physics.ts`: 10px intent
hysteresis, `.55` rubber-band resistance, a 100ms sample window, pointer-up as
the final sample, a 2400px/s defensive release-velocity cap, decay `.998`, and
projection capped at ±280px. The previously-unspecified outlier cap is 2400px/s
because projected destination selection already saturates at ~561px/s, while
the higher cap preserves expressive spring handoff without allowing a single
bad timestamp to destabilize the settle.

The locked response/damping-ratio tokens are converted for Motion's physical
spring API with mass 1 (`ω = 2π/response`, `k = ω²`, `c = 2ζω`). X and Y use
independent critically damped springs. Rotation uses the `.42s`/`.82` flick
spring only when pointer velocity created a lean. Re-grab reads the computed
presentation transform through `DOMMatrixReadOnly` before stopping the current
controls and carries their live axis velocity into the next release.

Keyboard relocation never calls the spring runner: it commits immediately,
moves focus with the ticket, applies the locked 160ms non-spatial destination
acknowledgement, and routes its message through the shared `announce()` API.

## MascotSignal contract

The shared decorative signal bus now lives at
`src/features/mascot/signals.ts`:

```ts
import { emitMascotSignal, subscribeMascotSignals } from "@/features/mascot/signals";
```

It implements PRD §9's `MascotSignal` shape exactly. Task 7 emits `drag-watch`
only after hysteresis, `idle` on release/cancel/reset, and `shipped` after a
pointer settle into Shipped. Keyboard board moves emit no mascot reaction.
Task 6 flag events bridge to the same bus as `flag-check`; Task 8 should consume
this bus and apply the locked reaction priority/expiry state machine.
