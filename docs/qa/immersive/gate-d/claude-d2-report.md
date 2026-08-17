# Gate D2 — Claude engineering report (board world integration + explicit mobile discovery)

Date: 2026-08-17 · Branch: `main` · Base: `bdd89a3`.

## Scope delivered (plan Task 6)

1. **Board → WorldDirector publication** (`InteractiveBoardSection.tsx`):
   - `setActiveWork(slug)` publishes **immediately on pointer-down** on a grip.
   - `setDragging(true)` publishes at the actual drag start (the existing
     10px hysteresis crossing — the same point the `drag-watch` bus signal
     fires), `setDragging(false)` on every release/cancel/reset.
   - Active work is **kept through visual settlement** and cleared in the
     settle `onComplete` (or immediately on Reset).
   - Continuous pointer samples never touch React state, the director, or
     analytics — unit-proven with a subscriber-notification counter across
     a 15-sample move storm (0 notifications).
   - The board consumes the director through a new optional accessor
     `useOptionalWorldDirector()` (`src/features/world/WorldProvider.tsx`),
     so the board renders unchanged outside a `WorldProvider`.
   - Incident / resolution / milestone / shipped signals still flow through
     the untouched `garvit:mascot-signal` bus (contract test intact).

2. **Explicit mobile discovery** (320/390/430, nothing requires drag):
   - `MobileColumnNav({ columns, activeIndex, onSelect, onPrevious, onNext })`
     — labelled tablist ("Board columns") of real `<button role="tab">`
     column tabs with roving selection (Arrow/Home/End move focus and
     selection, clamped, no wrap), visible **"n of 3"** position text
     (`[data-board-position]`), and Previous/Next controls (prev disabled at
     first, next at last). All controls ≥44px.
   - `useBoardViewport(containerRef, columnCount)` →
     `{ activeIndex, scrollToIndex, previous, next }` — IntersectionObserver
     (root = the board scroll container) derives the dominant column;
     `scrollToIndex` uses
     `scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", inline: "start", block: "nearest" })`.
     A short-lived pending target keeps mid-flight observer readings from
     bouncing the pager while a smooth scroll travels; manual swipes keep
     observer authority.
   - CSS scroll-snap container unchanged in kind (`x proximity`); under
     620px columns are now `calc(82vw - 3rem)` so the **next column always
     peeks** past the 24px gap (measured: 28px of real neighbour at 390,
     ≥16px at 320). Nav is `display: none` at ≥880px — desktop DOM, tab
     order, and grid are untouched.
   - All tickets remain plain links (`/work/*`, `/notes/*`).
   - Resting tickets stay **typographic** — no artifact treatment was added
     (no truthful, coherent artifact set exists for all four; artifact
     judgment stays in the design lead's lane per plan Step 6).

3. **Preview CTA in first screen (mobile)**: on ≤879.98px the dialog's
   "Read full case" link is `position: sticky; bottom: 0` with a material
   backing (`CasePreviewDialog.module.css`) — visible in the first screen at
   320/390/430 instead of ~1100px deep below the artifact + facts stack.
   Same link, same DOM order, `CasePreviewDialog` remains the sole
   `full_case_read` owner.

## Physics / behavior preservation (test-proven, unchanged)

Pointer-up-as-final-sample, low-sample release fallback, `.55` rubber band,
`.998` projection decay capped 280px, independent x/y spring velocity
handoff, DOMMatrix presentation re-grab, keyboard Alt+Arrow immediate move +
focus travel + exact announcements, `garvit-board:v1` storage, Reset,
preview focus restoration, Escape close — none of these code paths changed;
all pre-existing unit + e2e assertions run unmodified and pass. The five
analytics event names and the persona property are untouched
(`analytics.test.ts` green, no new capture sites).

## Acceptance checklist

| Contract item | Status |
|---|---|
| `MobileColumnNav` with exact `{ columns, activeIndex, onSelect, onPrevious, onNext }` | PASS |
| `useBoardViewport()` → `{ activeIndex, scrollToIndex, previous, next }` | PASS |
| Visible "n of 3" position text | PASS (unit + e2e + captures) |
| Labelled column tabs, real buttons, roving selection | PASS (unit + webkit/chromium e2e + axe) |
| Prev disabled at first / next at last | PASS |
| Next-column peek at 320/390/430 | PASS (e2e geometry assertion + captures, 28px at 390) |
| Scroll-snap container + `scrollIntoView` behavior/inline contract | PASS |
| IntersectionObserver active column (syncs on manual swipe) | PASS (e2e scroll-sync assertion) |
| All tickets real links; nothing requires drag | PASS |
| Publish active work on pointer-down; dragging during manipulation; clear on release with settle grace | PASS (unit lifecycle test) |
| No continuous pointer samples through React state/analytics | PASS (notification-counter unit test) |
| Signals preserved through existing bus | PASS (contract tests unchanged) |
| Analytics whitelist untouched | PASS |
| Desktop drag/keyboard/storage unchanged; nav hidden ≥880px | PASS (all pre-D2 assertions unmodified; new desktop e2e guards) |
| Resting tickets typographic | PASS (nothing changed) |

## Gate results (fresh, isolated verification build)

Because the design lead's Task 7 (case openings) lane was mid-refactor and
red in the shared checkout (see Deviations), gates ran in a scratch
worktree at `bdd89a3` + exactly the D2 diff, production build
(`NEXT_DIST_DIR=.next-e2e`, `NEXT_PUBLIC_WORLD_PROTOTYPE=1`, port 3112):

| Gate | Result |
|---|---|
| `pnpm typecheck` / `pnpm lint` | PASS |
| `pnpm test` (full: 44 files / 172 tests) | PASS |
| `pnpm build` | PASS |
| `pnpm check:budgets` | PASS (all budgets; homepage JS unchanged ceiling-wise) |
| chromium e2e: `keyboard` + `responsive` + `world` + `home` + `a11y` + `journey` + `no-js` | PASS — 66/66 |
| webkit (touch) e2e: `responsive` + `keyboard` | PASS — 26 passed, 1 by-design Safari tab-traversal skip |
| Console/pageerror | zero (asserted inside world + a11y specs) |
| axe on the board section at 390 (new spec) | zero serious/critical |

**Integrated confirmation on the shared tree**: after the design lead's
Gate E commit (`2e0412a`) landed mid-run, the same gates were re-run on the
shared checkout with D2 applied on top: `pnpm typecheck` PASS, full
`pnpm test` PASS (47 files / 185 tests), `pnpm build` PASS, `pnpm
check:budgets` all PASS, chromium `keyboard`+`responsive`+`world`+`home`+
`a11y` 54/54 PASS, webkit touch specs 26 PASS + 1 by-design skip
(production build `NEXT_DIST_DIR=.next-d2`, port 3113).

Mobile discovery e2e (`responsive.spec.ts`, runs with `hasTouch`) walks all
four projects at each of 320/390/430 through tabs + pager only, asserts the
position text at every step, prev/next disabled edges, peek geometry, page
overflow ≤ client+1, ticket hrefs, and the swipe → position-text sync.

## Mobile interaction evidence (from the e2e runs)

At 390×844 (identical shape at 320/430): the board header is followed by
three pill tabs — SHIPPED (selected), IN PROGRESS, BACKLOG — then a
`← 1 of 3 →` pager row; the In-progress column visibly peeks at the right
edge. Tapping **IN PROGRESS** smooth-scrolls the snap container until
Maxie + Agentic Calendar fill the port and the text reads "2 of 3"; **→**
reaches BACKLOG ("3 of 3", → disabled); **←←** returns to Shipped ("1 of
3", ← disabled). A manual horizontal swipe to the end flips the text to
"3 of 3" via the observer with no button involved. Arrow keys on a focused
tab move focus and selection together (WebKit and Chromium). Opening Stay
Portal's preview shows "Read full case" pinned inside the first screen.

## Captures (production build)

- `docs/qa/immersive/gate-d/board-desktop-light-1440x900.png` — full grid,
  no mobile nav, desktop untouched.
- `docs/qa/immersive/gate-d/board-390-light.png` — tabs + "1 of 3" + peek.
- `docs/qa/immersive/gate-d/board-390-dark.png` — same, dark.

## Deviations

1. **`useOptionalWorldDirector` added to `src/features/world/WorldProvider.tsx`
   + barrel** (world files were not in Task 6's modify list). Minimal,
   additive accessor; required for the board to consume the director without
   throwing outside a provider. No world behavior changed.
2. **`mascot-signals.test.ts` renderer-boundary regex narrowed**: it
   previously banned *any* `@/features/world` import from board production
   modules; Task 6 explicitly makes the board consume `WorldDirector`. The
   boundary now bans three/`@react-three/*` and every world renderer module
   (ExperienceWorld/WorldCanvas/GuideScene/rig/materials/scene-motion/
   capability-policy/asset-manifest + the barrel), matching the plan's
   actual rule ("no R3F import", Task 3 Step 7).
3. **`CasePreviewDialog.module.css` mobile sticky CTA** (file not in Task
   6's list; `preview-artifacts.module.css` was): the "preview CTA in first
   screen" acceptance physically lives in the dialog stylesheet. CSS-only,
   mobile-only.
4. **Homepage world e2e asserts physics + non-interference, not gestures**:
   the `data-guide-*` diagnostics are deliberately `/dev/world`-only, so
   gesture-level board→world proof stays in the unit lifecycle test and the
   Gate C fixtures; the new homepage test proves a real mouse drag completes
   (storage written, ticket at rest) under one pointer-transparent canvas
   with zero console errors.
5. **200% text-size reflow kept to its pre-D2 matrix (390/768/1440)**:
   probing 320 @ 200% exposed pre-existing overflows outside the board lane
   (`ProductChrome_productId`, `VersionPopover`, `ExperimentStrip_copy`,
   board head `actions`, `SessionJourneySection_title`). Normal-text
   overflow IS asserted at 320/390/430. Flagged for the design lead's D3
   integrated pass rather than silently patching foreign CSS.
6. **Gates ran in an isolated worktree** (see above): the shared checkout's
   `pnpm typecheck`/`pnpm test` were red from the concurrent Task 7 case
   lane (`CaseShell` prop refactor mid-flight — `CaseShell.test.tsx`,
   `CaseOpening.test.tsx`, `not-found.test.tsx`, four route pages). Nothing
   in that lane was touched or committed by this task; board-scoped suites
   (`pnpm test src/features/board`) also pass inside the shared checkout.
