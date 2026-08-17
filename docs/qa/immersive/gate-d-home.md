# Gate D3 — Integrated homepage craft, fallback parity, and full QA matrix

Date: 2026-08-17 · Branch: `main` · Base: `50ef24e` · Build dir: `.next-d3`
(isolated production build, `NEXT_PUBLIC_WORLD_PROTOTYPE=1` for the world
spec harness) · Server: `next start` port 3121 · Engineer lane: Claude;
all world tuning values remain design-owned (see "Flagged for design").

## 1. Mandatory fixes

### 1.1 Mobile `/#work-board` anchor offset — FIXED

Entering `/#work-board` used to place "Things I've built" beneath the
sticky product chrome at every width (measured: title top y17 vs chrome
bottom y53 at 320–430; y49 vs y56 at 1440).

- `src/components/board/board.module.css` — `.section` gains
  `scroll-margin-top: 4.5rem`. rem-based so the offset grows with text
  size exactly as the wrapping chrome does (chrome is 52–56px at
  authored size and ~103px when its rows wrap at 200% text).
- Measured after fix: title top y88.7 vs chrome bottom y53 at 320
  (35px clear), y121.4 vs y56 at 1440 (65px clear).
- E2E: `e2e/responsive.spec.ts` — "`#work-board` anchor clears the
  sticky chrome" at 320/390/430/768/1440 plus a real navigation flow
  test ("back-to-board navigation from a case route clears the chrome",
  via the case route's Back-to-board link at 390×844). All observed
  failing before the fix, passing after.

### 1.2 The five 320px/200%-text overflows — FIXED (reflow only)

All fixes wrap/reflow; no locked type or target size was reduced
(DESIGN.md §4 "reflow first"). Verified at 320/390/430 with
`html { font-size: 32px }` against the production build: document
`scrollWidth == clientWidth` at all three widths (was 391px at 320
before), and every named element inside its container.

| Offender | Fix | File |
|---|---|---|
| ProductChrome `productId` (was 337px fixed row → x361 at 320) | `.productId` wraps; version affordance drops to a second chrome row | `src/components/chrome/ProductChrome.module.css` |
| VersionPopover (trigger row + open panel; panel notes ran to x615 — the panel inherited the chrome's `nowrap`) | `.content` restores `white-space: normal`; `.list li` track pinned with `minmax(0, 1fr)`; `.head`/`.noteMeta` wrap; `min-width: 0` on note row items | `src/components/chrome/VersionPopover.module.css` |
| ExperimentStrip copy (x391 at 320 and 390) | `.strip` wraps: copy reflows below the variant label | `src/components/experiment/ExperimentStrip.module.css` |
| Board head `actions` (reset control pushed to x355) | `.head` wraps: actions reflow below the title | `src/components/board/board.module.css` |
| Journey title (min-content "instrumented." ≈ 433px truncated by the section's hidden overflow) | `.header > div { min-width: 0 }` + `overflow-wrap: break-word` (breaks only in 200% shells — the word fits its 12ch box at authored sizes) | `src/features/journey/SessionJourneySection.module.css` |

Additional 200% offenders found by the same probe and fixed in the same
reflow-first way (all were page-level overflow or hidden-overflow
truncation at 320@200%):

- HeroEvolution replay affordance (`.phaseRail` now wraps) —
  `src/components/hero/HeroEvolution.module.css`.
- Journey stage meta ("100% step-over-step" strong was `nowrap`;
  stage labels and readout `dt` gain wrap/`overflow-wrap`) and
  `.liveState` pill (nowrap removed) —
  `src/features/journey/SessionJourneySection.module.css`.

Regression guard: `e2e/responsive.spec.ts` —
- the 200% full-page reflow assertion now runs at ALL five matrix
  widths (320/390/430/768/1440; the pre-D2 320/430 exclusions are
  retired);
- a new per-component assertion set ("chrome, strip, board head, and
  journey reflow at 200% text size") checks each named offender's box
  against the viewport / its clipping section at 320/390/430, including
  the opened version popover.

### 1.3 Fallback parity + integrated craft (see also §3)

- **Poster/live paint parity bug found and fixed**: the fixed world
  stage (`z-index: 2`) painted the fallback poster OVER the experiment
  strip and the footer (both had no stacking context, unlike the
  hero/board/journey anchors at z3/z4). Under reduced motion /
  Save-Data / WebGL failure the strip appeared as a blank band and the
  footer was fully veiled. Fix: `position: relative; z-index: 3` on
  `.strip` (`ExperimentStrip.module.css`) and `.footer`
  (`footer.module.css`) — consistent with the locked anchor layering.
  E2E stacking assertion added to the reduced-motion poster test;
  `fallback-*-footer.png` captures prove the footer paints.
- **Posters still camera-match the locked camera after the D1 veil
  changes** — verified by side-by-side live-scene vs poster captures at
  1440×900 and 390×844 in both themes (same crop, position, scale,
  pose, pager placement). D1 only re-tuned the hero panel veil CSS; the
  scene camera and posters were untouched.
- **No layout shift at handoff/renderer failure**: the poster and
  canvas are absolutely positioned layers inside one fixed stage;
  handoff is an opacity crossfade. CLS measured 0.0001 over a full
  scroll + interaction session (§5).

### 1.4 Budgets (plan Task 8 Step 6) — already enforced, no SKIP

`scripts/check-budgets.mts` already enforces every Task 8 ceiling with
FAIL (never SKIP) when a world asset is absent; the stale "SKIPPED
while Task 8 has not landed" comment was corrected. Fresh results §4.

## 2. E2E lifecycle additions (plan Task 8 Step 1)

- `e2e/reduced-motion.spec.ts` — stale robot-era "mascot island" skip
  test replaced with a real homepage assertion: reduced motion serves
  exactly ONE theme poster request (light), zero GLB requests, zero
  canvases, poster opacity 1, and the world stage stacks beneath the
  strip and footer.
- `e2e/network.spec.ts` — new homepage Save-Data test: fallback
  `save-data`, no canvas, no GLB, exactly one theme poster transfer.
- `e2e/world.spec.ts` — capable-client homepage test now asserts
  exactly ONE GLB transfer, and that no world-shaped event name
  (`world_scene|guide_reaction|journey_stage|board_position`) appears
  in any readable PostHog payload across a full scroll + drag session
  (unit-level authority remains `src/lib/analytics.test.ts`).
- Engine guards: the two CDP-only world tests (page-scale emulation,
  forced-colors emulation) and the two link-Tab-traversal case
  navigation tests now skip on WebKit with the same documented reason
  as `keyboard.spec.ts` (Safari visits links with Option+Tab).
- `e2e/support.ts` — dead `mascotIslandPresent` helper removed.

Poster note (accepted deviation, flagged §6): single-theme transfer is
implemented via theme-scoped CSS `background-image` rules rather than a
`<picture>` element. CSS background selection has the same
one-request-per-theme property (proven by the network assertions above)
AND follows the site's `data-theme` override, which `<picture media>`
cannot.

## 3. Integrated craft (plan Task 8 Steps 3–5)

- Scene continuity (hero dominant guide + work glance; board lean
  toward active ticket; journey settle beside the latest bar) runs on
  the authored `scene-motion.ts` targets and Gate C spring constants —
  **no tuning value was changed** (design-owned; §6). Behavior is
  regression-proven by the unchanged world spec (scene handoff,
  interruption/re-entry, pause after journey/hidden) on the live
  homepage build.
- Material hierarchy: no new surfaces introduced; the D3 changes are
  stacking/reflow only. Two possible taste pre-flight smells are
  flagged to design rather than removed unilaterally (§6).
- Fallback completion: §1.3. All five fallback modes captured with
  facts (fallback reason attribute, request counts, axe, console) in
  `matrix-facts.json`.

## 4. Budgets (fresh, `.next-d3` production build)

| Budget | Measured | Limit | Result |
|---|---|---|---|
| Initial homepage JS (excl. lazy R3F/noModule) | 159.5KB gzip | ≤170KB gzip | PASS |
| Route JS /work/stay-portal | 145.0KB gzip | ≤170KB | PASS |
| Route JS /work/maxie | 144.5KB gzip | ≤170KB | PASS |
| Route JS /work/agentic-calendar | 138.8KB gzip | ≤170KB | PASS |
| Route JS /notes/dynamic-island | 138.8KB gzip | ≤170KB | PASS |
| Lazy R3F/Three vendor chunk | 228.1KB gzip | ≤234.6KB gzip | PASS |
| World/guide scene module | 5.0KB gzip | ≤25KB gzip | PASS |
| Poster guide-light.webp | 14.9KB | ≤90KB | PASS |
| Poster guide-dark.webp | 12.4KB | ≤90KB | PASS |
| Production GLB | 403.7KB | ≤1.8MB | PASS |
| Fonts total (4 woff2) | 63.6KB | ≤100KB | PASS |

No SKIP results; absent world assets are structural FAILs.

## 5. Web vitals (homepage, mobile emulation 390×844, local production server)

Measured by `scripts/capture-matrix-gate-d3.mjs` (PerformanceObserver,
buffered; full scroll down/up plus popover open/close interactions):

| Metric | Measured | PRD ceiling | Result |
|---|---|---|---|
| LCP | 68ms (local approximation — no network throttle) | ≤2.5s | PASS |
| CLS | 0.0001 | ≤0.05 | PASS |
| INP | worst interaction candidate 104ms over 5 interactions | best-effort note | Recorded |

## 6. Flagged for design (codex's eye — nothing changed by engineering)

1. **Scene tuning values kept as authored.** `scene-motion.ts`
   WIDE/NARROW targets and spring constants are untouched. The plan's
   Step 3 language ("board lean without obscuring controls", "settle
   beside the latest bar") has no numeric authority in DESIGN.md/PRD
   beyond the spring tokens, so D3 preserves Gate C/D1 values; the
   integrated Apple/Taste audit should confirm the three scene reads.
2. **Journey section wash vs the no-gradient rule.** DESIGN.md §
   "Color" says no gradient is production visual language (edge fades
   exempt); `SessionJourneySection.module.css` `.section` uses a
   `radial-gradient` `--color-context` wash and `.insights` is a tinted
   card. If the taste pre-flight reads these as generic-gradient /
   ornament smells, removal is a design call.
3. **Poster `<picture>` deviation** (§2): CSS theme-scoped background
   keeps single-theme transfer and honors the theme toggle; a
   `<picture media>` implementation cannot follow `data-theme`.
   Recommend keeping CSS; needs design/plan sign-off.
4. **Forced-colors axe artifact.** Under CDP forced-colors emulation
   axe reports `color-contrast (serious)` on the strip/hero because it
   computes authored colors while rendering is UA-forced
   (`fallback-forced-colors.png` shows correct forced black-on-white).
   Recorded as a documented exception in the harness; a real Windows
   High Contrast pass at Gate F would retire it.
5. **200% wrap aesthetics.** The reflowed 200% states (strip copy under
   the variant pill; "instrumented." breaking at 320@200%) are
   functional, not tuned compositions — see
   `home-320-200pct-light.png` / `board-320-200pct-light.png`.

## 7. Matrix capture inventory (`docs/qa/immersive/gate-d/matrix/`)

- Viewport sweep, first viewport, live scene ready:
  `home-{320x720,390x844,430x932,768x1024,1024x768,1440x900,1600x1000}-{light,dark}.png`
  — 14 captures, each recorded with console/pageerror (0), serious+
  critical axe (0), horizontal overflow (none), 2 primary CTAs, one
  canvas, scene-ready true (`matrix-facts.json`).
- 200% text size: `home-{320,1440}-200pct-light.png` +
  `board-{320,1440}-200pct-light.png` — clean facts rows.
- Fallbacks at 1440×900 (+ full-scroll footer variant each):
  `fallback-reduced-motion(.-footer).png` (reason `reduced-motion`,
  0 canvas, 0 GLB, 1 poster), `fallback-save-data*` (`save-data`),
  `fallback-webgl-failure*` (`renderer-failure`),
  `fallback-forced-colors*` and `fallback-reduced-transparency*`
  (live canvas retained by policy — these are DOM presentation modes,
  not world fallbacks).
- Keyboard-only evidence: `keyboard-focus-resume.png`,
  `keyboard-focus-contact.png` + reached-marker log in
  `matrix-facts.json` (both CTAs reached; zero errors).
- Machine facts: `matrix-facts.json` (sweep 16/16 clean, fallbacks 5/5
  clean, keyboard pass, vitals as §5).
- Harness: `scripts/capture-matrix-gate-d3.mjs` (committed; reuses the
  PostHog-blocking + scene-ready wait patterns of
  `capture-homepage-gate-d.mjs` / `gate-e-dark-captures.mjs`).

## 8. Gate results (fresh, this run, in order)

| Gate | Result |
|---|---|
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS |
| `pnpm test` (47 files / 185 tests) | PASS |
| `NEXT_DIST_DIR=.next-d3 NEXT_PUBLIC_WORLD_PROTOTYPE=1 pnpm build` | PASS |
| `NEXT_DIST_DIR=.next-d3 pnpm check:budgets` | PASS (all, no SKIP — §4) |
| Full e2e, chromium (port 3121, production server) | 115/115 PASS |
| Full e2e, webkit | 109 PASS + 6 documented engine skips (CDP-only emulation ×2, Safari link-Tab ×3 incl. pre-existing keyboard.spec skip, chromium-only synthetic drag ×1) |
| Matrix console errors / serious+critical axe / horizontal overflow | 0 / 0 / none across all 21 fact rows |

Preserved contracts re-proven by the unchanged suites: D2 board physics
+ world publications + mobile column nav (`keyboard`/`responsive`/
`world` + board unit tests), Gate E case surfaces
(`case-routes`/`case-navigation`), analytics whitelist
(`analytics.test.ts` + new wire assertion), theme system (dark sweep +
poster swap test), persona satire and hero evolution (homepage contract
tests), no-JS completeness (`no-js.spec.ts`).

Harness notes: one no-JS run failed on a hung `/_next/image` AVIF
request after the long capture session — a poisoned in-flight optimizer
entry in the long-running `next start` process (curl-reproducible,
cleared by server restart, not reproducible after). Not a code defect;
noted for Gate F server hygiene (restart the server before the release
matrix).
