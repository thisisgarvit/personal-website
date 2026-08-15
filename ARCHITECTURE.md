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
  session-analyst stage (`[data-mascot-slot]`, min-height 204px, panel-2 fill,
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

# Task 8 additions — mascot runtime (superseded by elevation amendment below)

## Poster-first runtime

`src/features/mascot/MascotExperience.tsx` is the small client controller
mounted inside the existing `[data-mascot-slot]`. The inline
`MascotPoster.tsx` SVG is present in server HTML and remains the only rendered
figure until the lazy WebGL renderer completes its first explicit frame. The
poster is decorative (`aria-hidden`) and uses the same semantic palette,
headset, pager, proportions, and crop as the live figure.

The R3F module is loaded with a native `import("./ProceduralMascotScene")`
only after all of these are true: the first animation frame has passed, the
slot is in/near the viewport, the document is visible, and the capability
policy allows WebGL. `requestIdleCallback({ timeout: 1500 })` supplies the
locked maximum delay. This native import is intentional: `next/dynamic`
rendered lazily but caused R3F runtime code to enter the homepage entry group
under Turbopack.

The scene crossfade is generation-bound. A runtime kill and re-enable remounts
the canvas behind the poster and must commit a new successful frame before the
poster can leave again. A React error boundary, render-loop try/catch, and
`webglcontextlost` listener all converge on the renderer-failure poster path.

## Capability and pause policy

Pure fallback selection lives in `capability-policy.ts`. WebGL is skipped for
reduced motion, Save-Data, a reported `deviceMemory` value of 4GB or less, the
shared `[data-effects-disabled="true"]` performance kill, or a renderer
failure. Browsers that omit the non-standard memory hint are not penalized.

Offscreen and document-hidden states pause the retained R3F canvas through
`frameloop="never"`; they do not destroy a healthy renderer. DPR is clamped to
`[1, 1.5]`. Touch keeps the authored forward pose; global cursor targets are
accepted only under `(hover: hover) and (pointer: fine)`.

## Reaction and look rigs

`reaction-machine.ts` consumes the Task 7 `MascotSignal` bus. Shipped blocks
flag-check/notice, drag-watch owns the rig during active direct manipulation,
and the best queued timed reaction resumes only if it has not aged out. Locked
expiry maxima are 900ms / 1000ms / 1400ms.

`rig.ts` converts the `.30s`, damping-ratio-1 look token with
`omega = 2π / response`, `k = omega²`, and `c = 2 * damping * omega` (mass 1).
Every retarget integrates from current joint value and velocity. The target is
split across torso (35%), head (65%), and pupil finish; joint clamps prevent an
unnatural turn. There is no whole-body idle float. Only the approved random
2.6–5.2s blink remains ambient.

Fine-pointer notice sources use `data-mascot-notice="resume|contact|release"`
on the two hero CTAs and version trigger. These events are silent and never
carry unique information.

## Procedural scene and budgets

The scene is code-only: 18 visible meshes/draw calls, five reused matte
materials, one ambient fill, one directional key, no GLB, texture, environment
map, post-processing, particles, pedestal, or network asset request. Direct
Three `RoundedBoxGeometry` avoids importing the broad Drei surface. The
imperative mesh tree opts out of React Compiler memo-cache generation with the
supported `"use no memo"` directive; R3F already owns its frame lifecycle and
the compiler scaffolding pushed the lazy chunk over budget without improving
runtime behavior.

Turbopack currently emits the scene and shared R3F/Three code in one lazy
file. Task 9's gzip-9 check measures that combined file at 229.5KiB, under the
230KiB vendor ceiling; the scene source alone is 3.0KiB gzip, under its 25KiB
ceiling. The inline poster source is 3.0KB raw, under 35KB. Hashes are not
recorded because they change on every production build.

---

# Task 9 additions — QA harnesses, budgets, CI, deploy wiring (Claude lane)

## Test-suite map

| Layer | Location | Runs via | Covers |
|---|---|---|---|
| Unit/contract | `src/**/*.test.{ts,tsx}` | `pnpm test` (Vitest, jsdom) | site config/product-label contract, phone privacy scan, storage/physics/flags/mascot module tests (owned by their lanes), `src/app/robots.test.ts` (env-driven robots policy), `src/lib/analytics.test.ts` (no-op adapter fires no network/storage) |
| E2E — keyboard | `e2e/keyboard.spec.ts` | `pnpm test:e2e` | full keyboard-only journey (tab order chrome→banner→CTAs→flags→board→footer), popover open/Escape/focus-return, banner dismiss + toast + focus handoff, flag toggle product effects, ticket Enter→dialog, Alt+Arrow move + polite announcement + Shipped parity, reset |
| E2E — no-JS | `e2e/no-js.spec.ts` | 〃 (`javaScriptEnabled: false`) | hero/CTAs as plain links, banner + release line, authored board as direct case links, readable case routes, no phone UI in server render |
| E2E — case routes | `e2e/case-routes.spec.ts` + `e2e/case-fixtures.ts` | 〃 | kind label + ticket id + `<title>` per route, "Shipped product" honesty check, preview → Read-full-case links for all four tickets |
| E2E — phone | `e2e/phone-reveal.spec.ts` | 〃 | server-HTML privacy on all five routes (no digits, no `tel:`), reveal → exact `tel:+91…` href + one announcement, memory-only reveal state |
| E2E — reduced motion | `e2e/reduced-motion.spec.ts` | 〃 (`reducedMotion: reduce`) | board keyboard + pointer moves still work, confetti suppression note, dialog, mascot poster-only fallback |
| E2E — a11y | `e2e/a11y.spec.ts` | 〃 (@axe-core/playwright) | axe scan on all five routes × light/dark; serious/critical fail, milder findings attach as needs-review |
| E2E — network | `e2e/network.spec.ts` | 〃 | strict same-origin request purity, zero console/page errors |
| Budgets | `scripts/check-budgets.mts` | `pnpm check:budgets` (after `pnpm build`) | PRD §14: initial homepage JS (excl. lazy R3F + noModule polyfill), per-route JS, lazy three-vendor chunk, mascot poster (skip-if-absent), fonts regression ceiling |

Harness conventions:

- E2E fixtures import identity strings from `src/data/site.ts` (PRD §16 —
  no hardcoded `garvit.app`/version in test fixtures); shared helpers live
  in `e2e/support.ts` (`tabUntil` relative-order assertion, `liveRegion`,
  `mascotIslandPresent` skip-guard).
- Engine skips are intentional and documented in-spec: WebKit Tab skips
  links (Safari behavior) so the link-inclusive tab-order test is
  chromium/firefox; Playwright's synthesized pointer capture is
  chromium-only, so the pointer-drag smoke skips FF/WebKit (keyboard moves
  cover those engines; real-device drag is the Task 7/12 gate).
- RESOLVED (Task 10): closing the case preview returns focus to its opening
  ticket. The keyboard E2E now exercises the restoration path.
- Isolated QA builds: `NEXT_DIST_DIR=.next-e2e pnpm build`, then
  `NEXT_DIST_DIR=.next-e2e pnpm start -p 3105` and
  `E2E_PORT=3105 pnpm test:e2e`. This keeps the suite's chunks stable while
  another lane's dev server/build churns `.next/` (the corruption mode that
  produced 500s/`text/plain` chunks during Task 9). `next.config.ts` reads
  `NEXT_DIST_DIR`; default `.next` is unchanged for Vercel.

## Analytics wiring (PRD §12)

- `@vercel/analytics` remains an unused dependency, but no analytics component
  or script is mounted in v1.
- `src/lib/analytics.ts` defines the four `PublicAnalyticsEvent` names and
  the strict no-op `analytics` adapter. Nothing may call a transport
  directly; enabling real event tracking is a deliberate future decision
  with its own privacy review. The banner-dismiss "event logged" toast is
  product humor and must never route through this adapter.
- `e2e/network.spec.ts` permits only same-origin requests. There is no dev-only
  analytics exception.

## Preview/production metadata

- `src/app/robots.ts`: noindex-all unless `VERCEL_ENV === "production"`.
- `resolveSiteOrigin()` in `src/data/site.ts`: configured `siteOrigin` →
  `https://$VERCEL_URL` (previews) → localhost. Used by `sitemap.ts` and
  layout `metadataBase`. No `vercel.json` is needed — security headers
  live in `next.config.ts`.

## CI

`.github/workflows/ci.yml` (push to `main` + PRs): pnpm (from
`packageManager`) → Node 22.17 → `install --frozen-lockfile` → typecheck →
lint → unit → build → `check:budgets` → Playwright chromium E2E against
the production server. Budgets are a blocking CI gate.

**Historical Task 9 budget snapshot — resolved in Task 10.** At Task 9 close,
gzip -9, modern-browser payload (noModule polyfill excluded):

- Initial homepage JS: **~205KB gzip vs ≤170KB** (framework baseline
  ~136KB: react-dom + App Router client; homepage islands board/flags/
  mascot mount + motion + radix ~63KB; @vercel/analytics ~6KB). Candidate
  reductions: `motion/mini`, deferring the flags/board island split,
  trimming radix imports.
- Lazy three-vendor chunk: hovers at the 230KB gzip ceiling (229.5–233KB
  across builds — build-order sensitive). Needs a couple of KB of headroom
  before Task 12.
- All other enforced budgets pass (per-route JS 136–142KB, fonts 63.6KB).
  Task 10 split the heavy islands and removed the mounted analytics client.
  Current enforced results are 159.6KB initial homepage JS and 227.2KB lazy
  Three/R3F; both pass `pnpm check:budgets`.

## Deploy / rollback runbook (Task 12 executes this)

Creation (one-time):

1. `gh auth switch -u thisisgarvit` — the repo and Vercel project belong
   to the personal account, not the work account.
2. Create the **private** GitHub repo under `thisisgarvit` and push `main`.
3. Vercel: import the GitHub repo into a new project (framework preset:
   Next.js; defaults for build — `pnpm build` is auto-detected from the
   lockfile). Do NOT set `NEXT_DIST_DIR`.
4. Branch model: `main` → production deployment; every PR → preview
   deployment. Previews are automatically noindex via `robots.ts`
   (`VERCEL_ENV`), and their sitemap/metadata URLs self-resolve via
   `VERCEL_URL`.
5. Keep Vercel Web Analytics disabled for v1; the visible session funnel is
   browser-local and makes no network request.
6. Verify on the preview: `/robots.txt` disallows all; headers include
   nosniff/referrer/permissions-policy; the homepage makes no third-party
   request.

Domain attach (later, PRD §18):

1. Buy/decide the final domain; add it to the Vercel project (production).
2. Set `siteConfig.siteOrigin` in `src/data/site.ts` to the canonical
   `https://` origin (single source of truth — sitemap, metadataBase, OG
   URLs follow automatically) and redeploy.
3. Until then the stable `*.vercel.app` production URL is the origin.

Rollback:

- Vercel dashboard → project → Deployments → pick the previous good
  production deployment → "Promote to Production" (instant rollback;
  equivalent CLI: `vercel rollback <deployment-url>`). No build required.
- Git-level rollback (when the bad state must leave `main`): revert the
  offending commit on `main` and push — Vercel redeploys automatically.
- The five routes are fully static with no data dependencies, so rollback
  has no migration/coordination concerns.

---

# Elevation additions — sourced session analyst + local funnel

- `src/features/journey/journey-store.ts` is the single external-store owner
  for the validated `garvit-journey:v1` event array. The funnel and mascot
  reaction bridge subscribe to this same stream; it is capped at 80 events,
  survives same-tab reloads, and has no transport.
- `SessionJourneySection` renders five Amplitude-style step bars, authored
  comparison values (`100 / 76 / 49 / 28 / 11`), step-over-step status, four
  live readouts, and at most two candid auto-insights. Comparison values are
  explicitly labelled an authored benchmark, not measured analytics.
- `SourcedMascotScene.tsx` loads one CC0 rigged stylized robot GLB from Ariana
  Chow / CaptainRipley. Runtime material clones remove the source texture and
  apply semantic release/ink/panel colors; project-authored coral headset,
  smile, and chest-clipped pager primitives are excluded from that traversal.
  GLTFLoader sanitizes the source bone dots (`spine.004` → `spine004`, etc.),
  and `robot-rig.ts` owns that explicit mapping for the existing pose layer.
- The live scene retains the poster-first, capability, visibility-pause, and
  failure-boundary architecture. Light and dark same-crop WebP posters are
  rendered from the live asset for reduced-motion/WebGL fallback.
- `src/app/not-found.tsx` is the deliberate SEV-3 blameless postmortem and
  links directly home and to `/#work-board`.
- Material tokens in `globals.css` define separately tuned light/dark panel,
  overlay, highlight, and control elevation values. Blur remains limited to
  functional chrome, popover, and dialog layers.
- Production `pnpm build` explicitly selects Next’s supported Webpack builder.
  Next 16.3.1 Turbopack build deadlocks in the compile phase in this workspace
  (zero CPU, all Tokio workers waiting) even with the lazy mascot replaced by a
  null stub and with both default/isolated dist directories. Webpack compiles,
  typechecks, prerenders all routes, and satisfies the same budget script; dev
  may continue using Turbopack.
