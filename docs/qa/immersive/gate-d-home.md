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

---

## 9. D3 CORRECTION round (design lead scored STOP → corrections applied)

Date: 2026-08-17 · Base: `8370c80` · Build dir: `.next-d3c` (fresh
isolated production build, `NEXT_PUBLIC_WORLD_PROTOTYPE=1`) · Server:
`next start` port 3131, freshly restarted (the AVIF/stale-manifest
server-reuse trap reproduced once mid-round when an old `next-server`
process survived a rebuild — killed, restarted, all evidence below is
from the fresh server against the fresh build).

### 9.1 Failed score being corrected

Apple **31/40** — Purpose 5, Agency 3, Responsibility 5, Familiarity 4,
Flexibility 3, Simplicity 3, Craft 3, Delight 5.
Taste **18/25** — composition 3, hierarchy 3, authorship 5,
asset/material 4, responsive craft 3. Verdict: STOP, four binding
corrections.

### 9.2 Correction 1 — dock/hero obstruction (automatic-stop) — FIXED

The feature-flag dock painted over hero headline/intro/CTA space at
768×1024 and 1024×768 (old matrix captures).

- **880–1179px** — headline lines now wrap (`HeroEvolution.module.css`:
  the `white-space: normal` breakpoint moved from ≤879.98 to ≤1179.98;
  ≥1180 keeps the authored two-line nowrap composition, which clears the
  dock at those widths). Safe copy measure established
  (`Hero.module.css`): `.copy { width: min(calc(100% - 21.5rem), 58rem) }`
  — 18.5rem dock + 1.5rem right offset + 1.5rem clearance — so headline,
  intro, and CTA group can never enter the dock's rectangle at ANY
  viewport height (the reservation is horizontal, the dock is
  bottom-anchored). The persona tray honors the same reservation
  (`PersonaSatire.module.css`), and the copy block reserves the tray's
  overlay band (`padding-top: 16rem`) because the wrapped headline is
  taller and otherwise rose beneath the tray.
- **620–879px** — the expanded dock recomposes IN FLOW below the hero
  (`page.module.css`: `.dock { position: relative; width: 18.5rem;
  margin: var(--space-4) 0 0 auto }`), right-aligned below the hero
  panel; `.boardAnchor` steps back from its deep negative overlap to a
  plain `var(--space-4)` gap in this range so the z4 board anchor cannot
  cover the dock. Copy keeps its 76% measure and type/target sizes
  exactly (no shrink); CTAs unchanged. `<620px` (in-flow full-width
  dock) untouched.
- **E2E (new, `e2e/responsive.spec.ts`)** — "feature-flag dock never
  intersects hero copy" at 768×1024 AND 1024×768:
  `getBoundingClientRect` intersection assertions for dock vs H1, dock
  vs intro, dock vs CTA group, dock vs persona tray, plus persona-tray
  vs headline/intro/CTA (the tray is the hero's other overlay). All
  observed failing against the pre-correction layout, passing after.
- Captures refreshed: `matrix/home-768x1024-{light,dark}.png`,
  `matrix/home-1024x768-{light,dark}.png` (plus the full sweep, §9.6).

### 9.3 Correction 2 — gradient ban (DESIGN.md) — REMOVED

`SessionJourneySection.module.css`:

- `.section` radial `--color-context` wash removed → solid
  `var(--material-panel)`.
- `.sessionBar` linear-gradient fill removed → solid
  `var(--color-release)`; the typical-visitor bar was already solid.
- Current/active stage is now expressed by the design lead's listed
  **small semantic endpoint marker** option (chosen over outline/label
  because it reuses the existing `.liveState` merge-dot vocabulary as a
  "live playhead" at the session bar's leading edge — no new visual
  language): `.stage[data-current="true"] .sessionBar::after`, solid
  `var(--color-merge)` 5px dot with the same soft ring treatment as the
  live pill.
- The approved solid question-tint on `.insights` is KEPT unchanged.
- Evidence: `motion/scene-journey-{1440,390}-{light,dark}.png` (solid
  panel, solid bars, endpoint marker on the current stage).

### 9.4 Correction 3 — 320px @ 200% board measure — FIXED

The next-column peek ate the active column's width at 320px/200% text.
Fix is a container query on EFFECTIVE size (`board.module.css`):
`.section` becomes an inline-size container, and at
`@container (max-width: 13rem)` the column plan switches to
`repeat(3, 100cqw)` — the active column takes the full scroll port and
the peek yields to 0. Container-query `rem` resolves against the real
root font size, so the rule engages exactly when text enlargement makes
the authored `82vw - 3rem` column inadequate (< ~11rem effective) and
NEVER at authored sizes at matrix widths (320px normal-text container is
15.9rem → the approved Gate D2 peek is preserved, proven by the
unchanged "explicit mobile board discovery" suite). No type or target
was reduced; tabs, "n of 3" position, and previous/next controls remain.

- **E2E (new, `e2e/responsive.spec.ts`)** — "200% text keeps a readable
  active board column" at 320/390/430: asserts the active column's
  content width ≥ 176px AND ≥ (scroll port − 2px), and that tabs +
  pager stay present and functional (next/previous walk the position
  text).
- Captures refreshed: `matrix/board-320-200pct-light.png` (active
  column at full port width, readable), `matrix/home-320-200pct-light.png`,
  plus the 1440 200% pair.

### 9.5 Correction 4 — integrated guide-motion evidence — ADDED

New harness `scripts/capture-motion-gate-d3c.mjs` against the PUBLIC
homepage production build, output `docs/qa/immersive/gate-d/motion/`:

- **Stills** (8): `scene-board-{1440,390}-{light,dark}.png`,
  `scene-journey-{1440,390}-{light,dark}.png` — guide settled at its
  scene positions.
- **Video**: `hero-board-journey-normal.webm` (16.9s) — full
  hero→board→journey scroll transition including ONE board interaction
  (a real grip drag of "AI Browser — Maxie", drag-watch reaction) — and
  `hero-board-journey-0.25x.webm` (67.6s, ffmpeg `setpts=4*PTS`, same
  Gate C recipe).
- **Bounding-box proof** (`motion-facts.json` + new e2e in
  `world.spec.ts`, "guide never covers board or journey surfaces" at
  1440 and 390): the guide's projected screen bounds are published via a
  QA-only opt-in (`<html data-world-evidence="1">` → GuideScene writes
  `data-guide-screen-bounds` on the canvas; a single string check per
  frame when off, zero cost to visitors, no tuning value touched) and
  measured against board tabs, grips, tickets, the preview dialog,
  funnel bars, and the insights card. Non-coverage holds two ways:
  (1) structurally, the world stage is fixed z2 beneath the z3/z4
  anchors in the root stacking context and precedes `main` in DOM order
  — asserted — so the canvas CANNOT paint over any listed surface, and
  the preview dialog portal stacks at 141, above both; (2) per-element:
  grips (390), board tabs, and the insights card never even intersect
  the guide's rectangle; ticket/funnel-bar rectangle intersections are
  the authored behind-the-frosted-panel composition (visible in the
  stills — the guide reads as veiled BEHIND the panel, never over
  content) with the stage subtree pointer-transparent (asserted).

### 9.6 Fresh gates (this correction round, in order)

| Gate | Result |
|---|---|
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS |
| `pnpm test` (47 files / 185 tests) | PASS |
| `NEXT_DIST_DIR=.next-d3c NEXT_PUBLIC_WORLD_PROTOTYPE=1 pnpm build` (fresh dist) | PASS |
| `NEXT_DIST_DIR=.next-d3c pnpm check:budgets` | PASS (all, no SKIP) |
| Full e2e, chromium (port 3131, fresh production server) | 122/122 PASS (115 prior + 7 new: 2 dock non-intersection, 3 200%-measure, 2 guide-coverage) |
| Full e2e, webkit | 116 PASS + 6 documented engine skips (unchanged set) |
| Matrix re-capture (`capture-matrix-gate-d3.mjs`, all 21 fact rows) | 0 console errors / 0 serious+critical axe / no horizontal overflow / 2 CTAs everywhere |
| Motion evidence (`capture-motion-gate-d3c.mjs`) | 8 stills + 2 videos + facts, 0 coverage violations |
| Web vitals (mobile emulation, fresh run) | LCP 40ms (local), CLS 0.0001 — within ceilings |

Approved items preserved: theme-scoped CSS poster loading unchanged;
forced-colors axe artifact remains a documented nonblocking exception
(real HCM pass at Gate F). Scene tuning values (`scene-motion.ts`
targets/springs) untouched — design-owned.

### 9.7 Fresh rescore (for the design lead)

| Apple criterion | Score (/5) | Notes |
|---|---|---|
| Purpose | — | |
| Agency | — | |
| Responsibility | — | |
| Familiarity | — | |
| Flexibility | — | |
| Simplicity | — | |
| Craft | — | |
| Delight | — | |
| **Apple total** | **— /40** | |

| Taste criterion | Score (/5) | Notes |
|---|---|---|
| Composition | — | |
| Hierarchy | — | |
| Authorship | — | |
| Asset/material | — | |
| Responsive craft | — | |
| **Taste total** | **— /25** | |

Verdict: —
