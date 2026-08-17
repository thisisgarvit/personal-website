# Gate D1 — Claude engineering report (homepage migration)

Date: 2026-08-17 · Branch: `main` · Base: `8928450` (codex's mid-run capture
commit; rebased nothing — work sits directly on top).

## What was changed vs the design draft

The dirty working tree left by the design lead (codex) was treated as a design
draft and completed to production quality. Almost all of it survived intact:

**Kept as drafted (no functional change):**

- `src/app/page.tsx` — one `WorldProvider`, one `ExperienceWorld` sibling of
  `main`, `WorldAnchor as="div"` sections in hero → board → journey order,
  `FeatureFlagDock` mounted inside the hero anchor, `OperationsRail` gone.
- `src/app/page.module.css` — anchor stacking, `.boardAnchor` negative
  overlap margin (codex-tuned; respected untouched), dock placement that
  clears the board overlap, mobile sequential flow under 620px.
- `src/components/hero/Hero.tsx` + `Hero.module.css` — borderless release
  field, two primary CTAs, guide-safe right crop, scrim gradients.
- `src/components/hero/HeroEvolution.{tsx,module.css}` and
  `PersonaSatire.{tsx,module.css}` — promoted from `/dev/world` with logic
  IDENTICAL to the Gate B originals (verified against the git diff): same
  MVP → BETA → GA phase timings with reduced-motion → immediate GA, same
  replay affordance, same persona choices/disclosure/payoff, same
  `persona_selected` payload (`persona`, `surface: "hero_onboarding"`,
  `$set.visitor_persona`), same `PERSONA_STORAGE_KEY` session semantics,
  same `ph-no-capture` class. Skip still emits nothing.
- `src/app/dev/world/{HeroEvolution,PersonaSatire}.tsx` — now one-line
  re-exports of the shared components (single source of truth; the dev
  prototype keeps rendering).
- `src/components/footer/SiteFooter.tsx` — DELHI / IST removed from the
  footer so it appears exactly once globally, in `ProductChrome`.

**Changed by Claude (one file):**

- `src/app/dev/world/WorldPrototype.test.tsx` — added the identical jsdom
  WebGL-probe stub already used by `ExperienceWorld.test.tsx` (from commit
  `c642050`): `resetWebGlProbeForTests()` + `HTMLCanvasElement.getContext`
  spy, plus `vi.restoreAllMocks()` in afterEach. Reason: committed fix
  `16a6e50` made the capability policy probe WebGL context creation, and
  jsdom has none, so the prototype contract test failed with
  `renderer-failure` at HEAD even before the draft changes. This is an
  environment stub, not a contract weakening — no assertion was removed or
  loosened. The committed homepage contract tests at `src/app/page.test.tsx`
  (fab5ca1/6a22673) are untouched and pass as written.

## Acceptance checklist

| Criterion | Status |
|---|---|
| One WorldProvider / one ExperienceWorld / one `<main>` / one `h1` | PASS (unit contract + capture facts) |
| Div-registered anchors hero → board → journey, no nested `<section>` landmark | PASS |
| OperationsRail removed; exactly one FeatureFlagDock | PASS (`Product controls` complementary absent; dock count 1) |
| Dock preserves checkbox semantics, row order, comic_sans tooltip, storage keys, journey `played`, mascot signal | PASS (Gate B `FeatureFlagDock`/`FeatureFlagsPanel` tests + journey e2e) |
| Persona satire + `persona_selected` preserved exactly as drafted | PASS (code identical to Gate B; analytics whitelist test green — no new event names) |
| MVP → BETA → GA evolution; no-JS/reduced-motion get GA immediately; replay affordance; headline/CTAs never blocked | PASS (initial state is `ga`; animation only starts client-side without reduced motion) |
| Exactly two prominent CTAs (Download resume / Contact Garvit) | PASS |
| Desktop board overlaps hero lower edge without dock collision (codex margin respected) | PASS (see `home-1440x900-*.png`; dock bottom ≈ y717, board top ≈ y800) |
| Mobile clean sequential flow | PASS (`home-390x844-*.png`) |
| DELHI / IST exactly once globally (product chrome) | PASS (footer duplicate removed; chrome hides it responsively under 620px) |
| Homepage contract tests pass unweakened | PASS |

## Gate results (fresh, this run)

| Gate | Result |
|---|---|
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS |
| `pnpm test` (full suite, 43 files / 163 tests incl. analytics whitelist, flags, journey, world) | PASS |
| `pnpm build` (webpack, `NEXT_DIST_DIR=.next-e2e`, `NEXT_PUBLIC_WORLD_PROTOTYPE=1` for the world spec) | PASS |
| `pnpm check:budgets` | PASS — homepage initial JS **157.2KB gzip** (≤170KB); lazy Three vendor 228.1KB (≤234.6KB); scene module 5.0KB; posters 14.9/12.4KB; GLB 403.7KB; fonts 63.6KB |
| `playwright` chromium: `home` + `no-js` + `a11y` + `journey` + `world` | PASS — 37/37 |
| `playwright` chromium: `keyboard`, `responsive`, `reduced-motion`, `network`, `case-routes`, `phone-reveal` (regression sweep) | PASS — 36 passed, 1 intentional engine skip |

E2E ran against the isolated production build (`NEXT_DIST_DIR=.next-e2e`,
port 3111) per ARCHITECTURE isolation guidance. Note for future runs: the
`network.spec.ts` sanctioned-origin test needs the shell to export the
PostHog vars from `.env` (Next inlines them at build; Playwright does not
load `.env` itself).

## Captures (production build, full first viewport)

- `docs/qa/immersive/gate-d/home-1440x900-light.png`
- `docs/qa/immersive/gate-d/home-1440x900-dark.png`
- `docs/qa/immersive/gate-d/home-390x844-light.png`
- `docs/qa/immersive/gate-d/home-390x844-dark.png`
- `docs/qa/immersive/gate-d/capture-facts.json` — machine-checked per
  capture: 1 world (scene-ready), 1 main, 1 h1, 2 primary CTAs; DELHI / IST
  visible once at desktop, hidden by chrome CSS at 390px.

Codex's own D1 first-fold captures + visual findings remain at
`docs/qa/immersive/gate-d1/` (commit `8928450`); the three findings there
(mascot contrast, mobile dock below the fold, desktop board teaser) are
visual-judgment items in codex's lane and were deliberately not "fixed" by
engineering.

## Deviations

1. `WorldPrototype.test.tsx` jsdom WebGL stub (documented above) — the only
   test change; pre-existing red at HEAD, same pattern as `c642050`.
2. The world spec's `/dev/world` prototype tests require a build with
   `NEXT_PUBLIC_WORLD_PROTOTYPE=1` (the documented Gate C harness
   deviation); the public production build still 404s that route.
3. No other deviation: no dependency changes, no analytics event names
   added, no copy changes, no CSS re-tuning of codex's draft.

## Gate D1 correction round (visual acceptance)

Date: 2026-08-17 · Base: `e085623` · Corrections ordered by the design lead
after judging the first D1 captures (engineering pass, design fail: Apple
34/40, Taste 20/25 — asset/material 3/5). Three blocking items, all fixed at
the CSS layer. **No `src/features/world/` file was touched** — no material,
lighting, or scene-motion change; the render itself was always fine, it was
being veiled by the hero panel.

### Correction 1 — mascot contrast (worst in dark mode)

Root cause: the hero panel painted a uniform
`color-mix(in srgb, var(--color-panel-2) 76%, transparent)` wash across its
full width — including the guide zone — on top of the `::after` scrims. In
dark mode that put a 76% near-black film over the white suit (watermark); in
light mode it flattened all suit shading.

Changes (`src/components/hero/Hero.module.css`):

- `.hero` background is now a 90° gradient: 82% panel-mix at the copy edge,
  76% at 50%, falling to 12%/10% across 82–100% — full text backing on the
  left, near-clear glass over the guide.
- `.hero::after` horizontal scrim's transparent stop pulled in from 76% to
  68% so it no longer bleeds over the guide's torso.
- `.hero::after` bottom scrim *strengthened* (88% → 52% at 16% → transparent
  at 34%) so the guide's feet ground out into canvas before the board panel
  (94% opaque `--material-panel`) composites over them — without this, the
  deeper board overlap (correction 2) left ghost legs visible through the
  board surface.

Result at 1440×900 (verified at full size and 360px thumbnail): LIGHT —
helmet, dark visor, shoulders, both arms, orange pager, and full body
silhouette read clearly. DARK — visor boundary and torso separation (chest
straps/hardware against the lit suit) visible; the headline remains the
dominant mass, guide reads as a supporting character. Same result at
390×844 in both themes.

### Correction 2 — desktop board teaser at 1440×900

Changes:

- `.hero` max height 47rem → 44rem (`Hero.module.css`).
- `.boardAnchor` overlap deepened: `clamp(-4.5rem, -4vw, -3rem)` →
  `clamp(-11rem, -11.5vw, -3rem)` (`page.module.css`).
- `.dock` raised: `bottom: clamp(7.5rem, 10vw, 10rem)` →
  `clamp(9rem, 14vw, 13rem)`; tablet override (≤880px) 7rem → 8.5rem so the
  2vw+ dock/board gap holds across the 620–1440 range.

Measured at 1440×900 (production build, machine-read rects): board heading
fully in frame (y699–760), first real ticket row tops visibly entering
(GAR-101 / GAR-204 / GAR-309 rows, top y865 → 35px in frame — real board,
no cloned teaser), dock bottom y614 vs board top y650 = **36px optical
clearance** (≥24 required), both CTAs fully visible (bottom y609).

### Correction 3 — mobile dock peek at 390×844

Change: mobile `.hero` min-height `calc(100dvh - 5.75rem)` →
`calc(100dvh - 10.25rem)` (`Hero.module.css`). The dock stays in-flow below
the hero (not forced above the fold).

Measured at 390×844: dock top y801 → **43px of the dock header** ("FEATURE
FLAGS · 3 / 4 live") visible at the bottom edge (32–56px window), both CTAs
fully visible (bottoms y633/y697).

### Iterations

Three visual iterations against a dev server with Playwright screenshots +
machine-read geometry per pass:

1. Gradient unveil + height/overlap/dock rebalance — geometry landed, but a
   trial 18.5rem dock width wrapped the `confetti_on_scroll` row, and the
   deeper overlap exposed ghost legs through the translucent board panel.
2. Dock width restored to 20rem; bottom scrim strengthened to ground the
   guide at the board edge — both themes clean.
3. Overlap eased to -11.5vw and tablet dock offset raised to keep ≥24px
   dock/board clearance across mid widths (final: 36px at 1440×900).

### Gate results (fresh, after final iteration)

| Gate | Result |
|---|---|
| `pnpm typecheck` / `pnpm lint` / `pnpm test` (43 files, 163 tests) | PASS |
| `pnpm build` (webpack, `NEXT_DIST_DIR=.next-e2e`, `NEXT_PUBLIC_WORLD_PROTOTYPE=1`) | PASS |
| `pnpm check:budgets` | PASS — homepage initial JS 157.2KB gzip (≤170KB); all other budgets unchanged |
| chromium e2e `home` + `no-js` + `a11y` + `journey` + `world` | PASS — 37/37 |
| chromium regression sweep (`keyboard`, `responsive`, `reduced-motion`, `network`, `case-routes`, `phone-reveal`) | PASS — 35 passed, 1 intentional engine skip |

Harness note: an initial e2e run showed 5 spurious failures because the
previous session's `pnpm start` was still holding port 3111 and serving a
stale copy of `.next-e2e` that had been rebuilt underneath it. Verified by
building HEAD into a separate dist dir (all green), then killed the stale
server and re-ran — all green. No test was changed.

### Captures

The four canonical shots were re-captured from the production build and
overwrite the originals in place (`docs/qa/immersive/gate-d/home-{1440x900,390x844}-{light,dark}.png`),
with `capture-facts.json` regenerated on the same schema (1 world
scene-ready, 1 main, 1 h1, 2 primary CTAs, DELHI / IST once on desktop,
chrome-hidden at 390px). The capture harness is now committed as
`scripts/capture-homepage-gate-d.mjs` (same wait conditions and PostHog
blocking as the gate-d1 script).
