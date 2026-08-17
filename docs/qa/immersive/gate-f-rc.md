# Gate F — Release-candidate audit, cleanup, and handoff (Task 9)

**Prepared by:** Claude (engineering lane), 2026-08-17.
**Base:** clean `main` at `4c9ae3c` (D3 closed at Apple 38/40, Taste 24/25 —
`gate-d-home.md` §10.6). All evidence below was produced AFTER the obsolete-module
cleanup, from a fresh isolated production build (`.next-rc`).

**This gate is NOT marked passed here.** Outstanding before the RC commit
(`feat: complete immersive portfolio rebuild`): the design lead's final
Apple/Taste audit from the §6 captures (plan Step 5), Garvit's live visual
acceptance (Step 8), and the release recommendation. No deploy occurred.

---

## 1. Obsolete cleanup (plan Steps 1–2)

### 1.1 Reachability proof (before deletion)

`rg -n "OperationsRail|MascotExperience|MascotPoster|SourcedMascotScene|robot-rig|CaptainRipley|mascot-poster|robot" src e2e scripts`
matched only: the obsolete modules themselves and their tests, the unrelated
SEO `robots.ts` family, one guide-rig test description ("does not accept
aliases from the retired robot rig"), and comments. Live-consumer sweep
confirmed: `OperationsRail` had zero importers; `MascotSlot` was imported only
by `OperationsRail`; the static `FlagsPanel.tsx` shell (Task 4) had zero
importers — the live flags UI is `FeatureFlagsPanel` (`variant="dock"`) inside
`FeatureFlagDock`, which stays. Post-deletion re-run of the same sweep shows
only intentional retirement notes.

### 1.2 Deleted (verified obsolete)

- `src/features/mascot/`: `MascotExperience.tsx` + test, `MascotPoster.tsx`
  + test, `SourcedMascotScene.tsx`, `capability-policy.ts` + test,
  `character-poses.ts` + test, `rig.ts` + test, `robot-rig.ts` + test,
  `mascot-model-contract.test.ts`, `mascot.module.css`
- `src/components/ops/`: `OperationsRail.tsx`, `MascotSlot.tsx`,
  `FlagsPanel.tsx` (static shell); dead classes pruned from `ops.module.css`
  (`rail`, `mascotStage`, `trackerLabel`, `tooltip`, `tooltipArrow`) — the
  panel/flag/switch classes consumed by `FeatureFlagsPanel` remain
- `public/mascot/**`: `session-analyst-robot.glb`, both robot posters,
  `LICENSE.md` (asset removed, so its license record goes with it;
  `public/models/guide/**` untouched)

### 1.3 Preserved (shared signal bus — per plan)

- `src/features/mascot/signals.ts`, `reaction-machine.ts` (+ its test) — the
  single shared bus/reducer consumed by board, flags, journey, and world.
  Compatibility notes added; `src/features/mascot/index.ts` now exports only
  the signal surface. No duplicate event bus was created in
  `src/features/world`. No consumer migration was required (all live imports
  already target `signals.ts`/`reaction-machine.ts` directly).

### 1.4 Config normalization

`tsconfig.json` `include` reduced to the canonical `.next` type entries; the
stale isolated-dist entries (`.next-e2e`, `.next-d3`, `.next-d3c`,
`.next-d3d`) were removed; the committed file carries only the canonical
`.next` entries. Note: `next build` auto-appends the active `NEXT_DIST_DIR`
type paths, so any isolated QA build will transiently re-add its own —
re-normalize before committing.

---

## 2. Full release suite (plan Step 3 — in order, fresh `.next-rc` dist, clean servers)

| # | Command | Result | Duration |
|---|---|---|---|
| 1 | `pnpm test` | PASS — 40 files / 162 tests, 0 fail/fixme | 6.2s |
| 2 | `pnpm typecheck` | PASS — 0 errors | 2.7s |
| 3 | `pnpm lint` | PASS — 0 errors | 2.9s |
| 4 | `NEXT_DIST_DIR=.next-rc NEXT_PUBLIC_WORLD_PROTOTYPE=1 pnpm build` | PASS — fresh isolated dist, all routes prerendered | 17.7s |
| 5 | `NEXT_DIST_DIR=.next-rc pnpm check:budgets` | PASS — 11/11 budgets, **no SKIP** | 0.3s |
| 6 | `E2E_PORT=3199 pnpm test:e2e` (chromium + firefox + webkit, prod server on :3199 from `.next-rc`, stale servers killed first) | PASS — **360 passed, 9 skipped, 0 failed** | 2m18s |

Unit-test count is 162 (was 185 at D3): 23 tests belonged to the deleted
obsolete mascot modules.

### 2.1 The 9 e2e skips (all documented engine limitations, unchanged from D3)

| Engine | Test | Reason (in-spec) |
|---|---|---|
| firefox, webkit | `reduced-motion` › pointer drag still relocates a ticket | synthetic pointer-capture drag is chromium-only in Playwright; keyboard-move covers cross-engine |
| firefox, webkit | `world` › keyboard-only navigation at 200% page scale | CDP page-scale emulation is chromium-only |
| firefox, webkit | `world` › forced colors + reduced transparency | CDP media-feature emulation is chromium-only |
| webkit | `case-navigation` × 2, `keyboard` × 1 | WebKit link traversal is Option+Tab by design |

---

## 3. Cross-browser and failure matrix (plan Step 4)

Harness: `scripts/capture-gate-f.mjs` → `gate-f/rc-facts.json`. Production
server `.next-rc` on :3199. "Reachable" = all four case links present, both
CTAs present, plus a real click-through round trip to a case route and back.

### 3.1 Engine matrix (chromium / firefox / webkit)

| Engine | 1440×900 desktop | 390×844 mobile | WebGL denied |
|---|---|---|---|
| chromium | live scene, reachable, round-trip OK, 0 errors | same | poster shown, 0 canvas, 0 GLB requests, reachable |
| firefox | live scene, reachable, round-trip OK, 0 errors | live scene, reachable, round-trip OK, 0 errors (§7.1 resolved by `d323071`) | poster shown, 0 canvas, 0 GLB, reachable |
| webkit | live scene, reachable, round-trip OK, 0 errors | same | poster shown, 0 canvas, 0 GLB, reachable |

Additional cross-engine coverage from the full e2e run (§2): keyboard-only
(chromium+firefox; webkit per skip table), coarse pointer + explicit mobile
board discovery at 320/390/430 (all engines), reduced motion (all engines),
Save-Data / performance-kill fallback purity (all engines), tab hidden/resume
pause (all engines), 200% text size (all engines) and 200% page zoom
(chromium CDP), storage/journey semantics (all engines).

### 3.2 Failure paths (chromium, 1440×900; captures in `gate-f/`)

| Path | Result |
|---|---|
| JS disabled | Full DOM serves; poster visible; 4 case links + both CTAs in HTML; full-page navigation to a case route works (`failure-no-js.png`, `-case.png`) |
| Storage denied (both storages throw `SecurityError`) | Page renders with the LIVE scene, 0 pageerrors; board/preview/CTAs work; round trip OK (`failure-storage-denied.png`) |
| WebGL denied (context creation blocked) | `renderer-failure` fallback, poster visible, 0 canvas, 0 GLB requests, round trip OK (`failure-webgl-denied.png`) |
| WebGL context loss (live `WEBGL_lose_context.loseContext()`) | scene → `renderer-failure` poster handoff with **0.0000 layout shift**, round trip OK (`failure-context-loss.png`) |
| Save-Data | `save-data` fallback, poster, 0 GLB requests, round trip OK (`failure-save-data.png`) |

---

## 4. Analytics split validation (plan Step 6 — real session, live PostHog network)

Harness: `scripts/validate-analytics-gate-f.mjs` → full request inventory in
`gate-f/analytics-session.json`. One chromium session (production build,
PostHog env from `.env`, real network) drove: scroll, persona selection
(founder), two flag toggles, board drag, keyboard ticket move, funnel
milestones, case preview, full case read, resume click, contact click.

**Verdict: PASS.**

- **Captured PostHog event names (complete):** `$pageview`, `$pageleave`,
  `$autocapture`, `case_open`, `contact_click`, `full_case_read`,
  `persona_selected`, `resume_download`.
- Custom (non-`$`) events = exactly the five approved; **zero**
  scene/guide/board-position/funnel-stage/journey events on the wire.
- Journey stream: 11 events, all five milestone types
  (`landed/played/scrolled/read-work/converted`), present ONLY in
  `sessionStorage["garvit-journey:v1"]` — absent from `localStorage`, absent
  from every outbound request.
- Only non-local hosts contacted the entire session: `us.i.posthog.com`,
  `us-assets.i.posthog.com`.

Methodology notes (details in the harness header): posthog-js
`defaults: "2026-01-30"` classifies `localhost` as internal/test traffic and
sends nothing, so the session browsed via a Chromium host-resolver alias;
beacon flush bodies were read via route interception; `full_case_read` was
exercised via meta-click (open-in-new-tab) so its batch flushed observably
instead of racing the unload beacon. The persona tray's Skip button sends
nothing — verified intentionally (`ph-no-capture` + no track call).

---

## 5. Measurements

### 5.1 Budgets (fresh `.next-rc`, no SKIP)

| Budget | Measured | Limit |
|---|---|---|
| Initial homepage JS (excl. lazy R3F) | 159.4KB gzip | ≤170KB |
| Route JS (4 case routes) | 138.8–145.0KB gzip | ≤170KB |
| Lazy R3F/Three vendor chunk | 228.1KB gzip | ≤234.6KB |
| Guide scene module | 5.2KB gzip | ≤25KB |
| Guide poster light / dark | 14.9KB / 12.4KB | ≤90KB each (one downloads) |
| Production guide GLB | 403.7KB | ≤1757.8KB |
| Fonts (4 woff2) | 63.6KB | ≤100KB |

### 5.2 Web vitals (mobile emulation 390×844, production server)

| Metric | Measured | Ceiling |
|---|---|---|
| LCP | 72ms | ≤2500ms |
| CLS | 0.0001 | ≤0.05 |
| INP (worst of 5 interactions) | 104ms | best-effort |

### 5.3 Core captures + axe (chromium)

`home-1440x900-{light,dark}.png`, `home-390x844-{light,dark}.png`: live scene
(1 canvas), 0 console/page errors, 0 serious/critical axe violations, no
horizontal overflow, both CTAs + all four case links present in every capture.

---

## 6. Evidence inventory (`docs/qa/immersive/gate-f/`)

- Core: `home-1440x900-light.png`, `home-1440x900-dark.png`,
  `home-390x844-light.png`, `home-390x844-dark.png`
- Scene stills: `motion/scene-{board,journey}-{1440,390}-{light,dark}.png`
  (8, guide settled at scene positions, bounding-box facts in
  `motion/motion-facts.json`)
- Motion: `motion/hero-board-journey-normal.webm` (full hero→board→journey
  scroll incl. one real grip drag) + `motion/hero-board-journey-0.25x.webm`
  (ffmpeg `setpts=4*PTS`, D3 correction-harness recipe)
- Failure paths: `failure-no-js.png`, `failure-no-js-case.png`,
  `failure-storage-denied.png`, `failure-webgl-denied.png`,
  `failure-context-loss.png`, `failure-save-data.png`
- Engines: `engine-{chromium,firefox,webkit}-{1440,390}.png`
- Data: `rc-facts.json` (matrix facts), `analytics-session.json` (full
  outbound inventory + decoded event names)

---

## 7. Observations record (7.1 resolved; 7.2 pending Garvit's decision)

### 7.1 Firefox: unhandled rejection when navigation aborts the lazy PostHog chunk — RESOLVED

**Resolution (2026-08-17, authorized Gate F preparation fix; design lead
accepted the root cause below):** fixed in
`fix: make lazy posthog chunk load non-fatal and retryable`.

- **Root cause:** `src/lib/posthog-client.ts` cached
  `import("posthog-js").then(...)` with no rejection handler. A client
  navigation can abort the in-flight lazy chunk fetch; the rejected import
  then escaped as an unhandled promise rejection from BOTH fire-and-forget
  callers (`initializePostHog`'s `void loadPostHog()` and `capturePostHog`'s
  `void loadPostHog().then(...)`) — surfaced by Firefox as
  `pageerror: Loading chunk 340 failed`. The rejected promise also stayed
  cached, so every later capture in the session silently chained onto it.
- **Fix (smallest root-cause hardening, single site covering both paths):**
  a `.catch` on the cached promise in `loadPostHog` that resolves to `null`
  (captures no-op via the existing `posthog?.capture` guard) and resets
  `clientPromise` to `null` so a later call retries the import. No new
  captures, no whitelist change, no event-behavior change.
- **TDD record:** two regression tests added to
  `src/lib/posthog-client.test.ts` ("treats an aborted lazy chunk load as
  non-fatal on both paths" — asserts zero `unhandledRejection` events with
  both paths racing a rejecting import; "retries the lazy import after a
  failed chunk load" — import rejects once then succeeds, second capture
  must init and capture). At `682f320` both FAIL exactly as diagnosed
  (2 unhandled `Loading chunk 340 failed.` rejections; retry times out,
  capture never fires). Post-fix: 4/4 file, full suite 164/164 (was 162 + 2
  new), typecheck and lint clean.
- **Firefox re-run (fresh `.next-rc` prod build on :3199):** focused
  harness mirroring the §3.1 firefox 390×844 matrix cell plus a
  deterministic variant that stalls the lazy posthog chunk so the case
  navigation is guaranteed to abort it mid-flight. Pre-fix build: 4×
  `pageerror: Loading chunk 340 failed` (exact §7.1 error). Post-fix
  build: **zero pageerrors in both variants** (chunk confirmed requested
  and aborted), round trips OK. Full `--project=firefox` e2e: 120 passed /
  3 skipped (the §2.1 engine skips) / 0 failed; `--project=chromium`:
  123 passed / 0 failed. `check:budgets`: 11/11 PASS on the rebuilt dist
  (homepage JS unchanged at 159.4KB gzip). `tsconfig.json` re-normalized
  after the isolated build per §1.4.

Original observation (for the record):

Reproduced on Playwright Firefox at 390×844: clicking through to a case route
while the lazy `posthog-js` chunk (webpack chunk 340) is in flight aborts the
chunk load and surfaces `pageerror: Loading chunk 340 failed`. Root cause:
`src/lib/posthog-client.ts` — `capturePostHog`/`loadPostHog` chain
`import("posthog-js").then(...)` with no rejection handler, so an aborted
chunk load becomes an unhandled promise rejection (console-only; the
navigation itself succeeds and the app is unaffected). Load-only sessions are
clean; chromium/webkit do not surface it. Suggested one-line hardening (NOT
applied — analytics module is the whitelist authority and this is a
post-audit call): add a `.catch` in `capturePostHog` (and reset
`clientPromise` on rejection if retry is wanted). Codex to judge whether to
fix before RC or accept as known-benign.

### 7.2 Forced colors: real Windows High-Contrast pass unavailable — FLAG for Garvit

The forced-colors matrix cell ran under Chromium CDP emulation only (macOS
hardware). Under emulation: core content operable, canvas non-blocking,
switch tracks use `forced-color-adjust: auto`; the pre-existing axe
`color-contrast (serious)` exception remains recorded because axe computes
contrast from authored custom properties while rendering is UA-forced (see
`gate-d-home.md` and the D3 matrix note). **Real Windows HCM evidence cannot
be produced on this hardware — the axe exception is NOT retired. Needs a
Windows machine pass or an explicit waiver from Garvit.** Nothing was
fabricated.

### 7.3 PostHog on localhost (informational, not a defect)

posthog-js `defaults: "2026-01-30"` intentionally drops all capture when the
page host is `localhost`/`127.0.0.1` (`internal_or_test_user_hostname`).
Local production servers therefore send nothing to PostHog — deployed
`garvit.app` traffic is unaffected. Worth remembering when smoke-testing
analytics locally.

### 7.4 Playwright-only drag skips

The synthetic pointer-capture drag remains chromium-only in Playwright
(§2.1); real-device drag was proven in the Task 7 gate and keyboard movement
covers all three engines.

---

## 8. Rollback guidance

The recoverable baseline is the annotated tag
`checkpoint/pre-sougen-rebuild-2026-08-17` (commit `f8b91fe`).

```bash
# Inspect the baseline
git show --stat checkpoint/pre-sougen-rebuild-2026-08-17

# Full rollback of main (destructive — coordinate with Garvit first)
git checkout main
git reset --hard checkpoint/pre-sougen-rebuild-2026-08-17

# Non-destructive alternative: branch from the tag and revert forward
git checkout -b rollback/pre-sougen checkpoint/pre-sougen-rebuild-2026-08-17
```

Do not deploy any state without Garvit's separate authorization.

---

## 9. Handoff — what remains before the RC commit

1. Design lead (codex): final audit COMPLETE — **Apple 38/40, Taste 24/25,
   visual/design PASS** (no dimension below 4). The §7.1 Firefox fix
   (`d323071`) is independently verified by codex; nothing remains for
   design judgment.
2. Garvit: (a) §7.2 decision — Windows HCM waiver (codex + Claude recommend
   waiver, real Windows check post-RC) or a Windows pass; (b) live
   play-through of the production build (10-second founder read, guide
   quality, mobile discovery, case openings) — the screenshare-worthy
   reaction is the acceptance criterion.
3. Only then: `feat: complete immersive portfolio rebuild` RC commit and the
   Step 10 final handoff record (final commit hash + scorecards appended
   here). No deploy without Garvit's separate authorization.
