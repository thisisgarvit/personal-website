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
