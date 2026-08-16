# Immersive Product World Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `garvit.app` as a continuous, accessible product world in which a production-quality metaverse guide, the real sprint board, and the live session funnel feel like one authored experience while Garvit's work and primary CTAs remain immediately legible.

**Architecture:** The DOM remains the authoritative interface and one lazy, pointer-transparent R3F canvas supplies persistent character continuity across named `hero`, `board`, and `journey` anchors. A small external-store director owns only discrete world state; scroll progress, pointer look, and springs remain mutable presentation values sampled inside the render loop so React does not rerender continuously. Work first proves the licensed character and Scene 1 composition in an isolated development route, then migrates the homepage and case routes only after both visual gates pass.

**Tech Stack:** Next.js 16.3.1 App Router, React 19.2.8, TypeScript 5, CSS Modules, Motion 13.1, React Three Fiber 9.7, Drei 10.7.8, Three.js 0.185.1, Radix Dialog/Popover/Tooltip, Vitest, Testing Library, Playwright, axe-core, self-hosted Archivo and IBM Plex Mono.

## Global Constraints

- Authority order is `DESIGN.md` + `PRD.md`, then the approved immersive spec at `docs/superpowers/specs/2026-08-17-immersive-product-world-design.md`, then this plan. Task 0 must remove their current contradictions before product code changes.
- The recoverable baseline is annotated tag `checkpoint/pre-sougen-rebuild-2026-08-17` at commit `f8b91fe`.
- No new runtime dependency or `package.json` change is allowed without Garvit's approval. Use the installed R3F/Drei/Three/Motion/Radix stack.
- Hard stop order: candidate contact sheet passes → isolated Scene 1 static composition passes → interactive Scene 1 Apple/Taste audit passes → only then homepage or case-route migration begins.
- Codex owns art direction, world architecture, composition, motion tuning, performance tradeoffs, and every visual acceptance decision. Claude owns candidate acquisition/inspection, contact sheets, repetitive migrations, interface-locked test migrations, capture matrices, gate execution, and mechanical regression fixes. Nothing delegated ships without Codex reviewing the render.
- Garvit has removed the “relocate, never rebuild” restriction. Existing board, flags, funnel, case content, 404, and OG behavior may be rebuilt when the new visual system warrants it, but their working semantics, verified facts, accessibility, privacy, and analytics contracts may not regress.
- The session-local journey event stream remains in `sessionStorage` and never feeds PostHog. PostHog retains pageviews/autocapture plus only `resume_download`, `contact_click`, `case_open`, and `full_case_read`; no scene, guide, board-position, or funnel-stage custom capture may be added.
- The exact session disclosure is: “this funnel is computed in your browser. PostHog sees the rest. I check it obsessively.”
- If Muko is selected, Garvit has approved repository-only attribution: preserve its exact license, creator, source URL, revision, and modification record in the repository; do not add visible site credit. Select Muko or Quaternius on rendered and technical merit at the contact-sheet gate.
- The guide remains abstract, never a likeness. Target: smooth hooded/helmeted metaverse field agent, large graphic head, opaque graphite visor, porcelain shell, release-blue underlayer, fitted coral milestone hardware, and no floating/grafted props.
- Asset ceilings: one local GLB, ≤25k triangles, ≤30 draw calls measured in the production R3F renderer, ≤1.8 MB transferred, and 512–1024px textures. “One atlas” means one UV/material set with permitted base-color, normal, and ORM maps; a visually superior smaller asset is not rejected for falling below a quality lower bound. No runtime CDN, ambiguous third-party texture, or trademarked patch.
- DOM content and navigation remain complete without WebGL. The canvas is `pointer-events: none`, never owns navigation, never scroll-jacks, and never hides content behind mandatory animation.
- The persistent canvas is lazy-only. It renders on demand when idle, runs continuously only during look/reaction/transition, pauses when `document.hidden` or after the journey leaves the active viewport union, and falls back to camera-matched light/dark posters for reduced motion, Save-Data, low capability, performance kill switch, or renderer failure.
- Hero tracking values from the old layout are not automatically reused. The new two-line desktop headline must receive optical validation at its actual size and measure; reject any value that creates glyph collision or visibly uneven color.
- At 1440×900, the approved hero sentence is at most two lines, the character has a meaningful 40–50% crop, both CTAs are obvious, and real work enters the viewport boundary. At 390×844, both CTAs stay in the first viewport and the board follows immediately.
- Mobile board discovery is explicit at 320/390/430px: labelled column tabs, `1 of 3`, previous/next controls, next-column peek, no invisible horizontal-scroll dependency, and no requirement to drag.
- Apple audit gate: at least 34/40, no dimension below 4, no input lockout, no unmotivated motion. Taste audit gate: at least 22/25, no dimension below 4, and all applicable pre-flight items pass.
- Every visual gate stores light/dark captures at 1440×900 and 390×844, normal and slowed interaction recordings when motion exists, reduced-motion and poster/WebGL-failure captures, scorecards, and bundle/asset/console/axe/Core Web Vitals evidence under `docs/qa/immersive/`.
- Preserve factual content. Do not invent metrics, product screenshots, shipped status, or case-study claims. If an artifact is unavailable, use an authored diagram made only from verified facts.
- All touched functionality is test-driven: create the failing test, run it and observe the expected failure, make the smallest implementation, rerun focused tests, then run the task gate before committing.

## Locked File Map

### Authority and evidence

- Modify `DESIGN.md` — add the approved immersive amendment, new layout/material/motion authority, selected-model record after Gate A, poster budget, and optical-tracking result.
- Modify `PRD.md` — add new ordering, world/fallback behavior, mobile discovery acceptance, case-opening requirements, and the exact two-stream analytics/privacy contract.
- Modify `docs/superpowers/specs/2026-08-17-immersive-product-world-design.md` — mark approved and correct the stale disclosure; record Garvit's attribution and rebuild decisions.
- Create `docs/qa/immersive/model-inspection.md` — immutable candidate source/license/hash/rig/mesh/texture/budget report.
- Create `docs/qa/immersive/gate-a-model.md`, `gate-b-composition.md`, `gate-c-world.md`, `gate-d-home.md`, `gate-e-cases.md`, and `gate-f-rc.md` — evidence indices and scored decisions.

### Model and world

- Create in Task 4 `public/models/guide/guide.glb` — selected, fitted, optimized, locally served production asset; Task 1 must not publish a pre-customization GLB at this path.
- Create in Task 4 `public/models/guide/LICENSE.md` and `public/models/guide/source.json` — source, revision, original/final hashes, license, modification record, final node manifest, and selected-candidate metadata.
- Create `public/images/world/guide-light.webp` and `guide-dark.webp` — camera-matched fallback posters.
- Create `src/features/world/types.ts` — shared world IDs, discrete state, anchor metrics, and public director API.
- Create `src/features/world/world-store.ts` and `world-store.test.ts` — external store, registration, discrete setters, and immutable snapshots.
- Create `src/features/world/WorldProvider.tsx` — stable director instance and context access.
- Create `src/features/world/WorldAnchor.tsx` and `WorldAnchor.test.tsx` — semantic DOM sections registering measurable anchors.
- Create `src/features/world/ExperienceWorld.tsx`, `ExperienceWorld.test.tsx`, and `world.module.css` — capability/lifecycle boundary, lazy scene, posters, and fixed canvas stage.
- Create `src/features/world/capability-policy.ts` and `capability-policy.test.ts` — world-named port of the existing reduced-motion/Save-Data/low-memory/performance-kill/renderer-failure decision.
- Create `src/features/world/WorldCanvas.tsx` — one R3F canvas and invalidation policy.
- Create `src/features/world/GuideScene.tsx` — selected GLB, material assignment, rig pose application, lighting, camera choreography, and scene targets.
- Create `src/features/world/guide-rig.ts` and `guide-rig.test.ts` — selected-rig semantic bone adapter.
- Create `src/features/world/scene-motion.ts` and `scene-motion.test.ts` — critically damped scene target interpolation and re-entry/presentation-state behavior.
- Create `src/features/world/index.ts` — public exports only.
- Retire `src/features/mascot/MascotExperience.tsx`, `MascotPoster.tsx`, `SourcedMascotScene.tsx`, `capability-policy.ts`, robot-specific rig/pose modules, their obsolete tests, old poster/model assets, and `src/components/ops/MascotSlot.tsx` only after the new world passes its integration gate. The capability truth table moves to `src/features/world/capability-policy.ts`; no hidden mascot-named production dependency remains.
- Preserve `src/features/mascot/signals.ts` and `reaction-machine.ts` contracts until consumers have migrated; then either re-export them from `src/features/world/signals.ts` or leave compatibility exports with no duplicate event bus.

### Homepage, board, journey, and flags

- Create `src/app/dev/world/page.tsx`, `WorldPrototype.tsx`, and `world-prototype.module.css` — isolated static and interactive Scene 1 gate; excluded from public navigation.
- Modify `src/app/page.tsx` and `src/app/page.module.css` — product chrome → experiment strip → immersive hero → board → journey → footer.
- Modify `src/components/hero/Hero.tsx` and `Hero.module.css` — borderless release field, dominant copy/CTAs, guide-safe composition, one locale mention globally.
- Create in Task 2 `src/components/ops/FeatureFlagDock.tsx`, `FeatureFlagDock.test.tsx`, and `FeatureFlagDock.module.css` — compact accessible wrapper around the existing flag system, proven in Gate B before homepage integration.
- Retire `src/components/ops/OperationsRail.tsx`, `FlagsPanel.tsx`, and obsolete rail styles/tests after the dock is live.
- Modify `src/features/board/InteractiveBoardSection.tsx`, its tests, `src/components/board/board.module.css`, and `src/features/board/board-interactions.module.css` — world event publication, actual overlap, explicit mobile navigation, and responsive artifact treatment while preserving drag/keyboard/storage/reset/dialog semantics.
- Create `src/features/board/MobileColumnNav.tsx`, `MobileColumnNav.test.tsx`, and `useBoardViewport.ts` — accessible tab/previous/next/position plumbing.
- Modify `src/features/journey/SessionJourneySection.tsx` and its module/tests — move after work, publish stage to world, preserve the exact disclosure and session-local event store.
- Modify `src/features/journey/JourneyObserver.tsx` and tests only if the reordered geometry changes the existing `scrolled` observer behavior; do not add analytics.

### Case surfaces

- Modify `src/components/case/CaseShell.tsx`, `CaseShell.module.css`, and add `CaseShell.test.tsx` — artifact-led opening, factual signals, back-to-board, structured reading treatments, and previous/next navigation.
- Create `src/components/case/CaseOpening.tsx`, `CaseOpening.test.tsx`, and `CaseOpening.module.css` — shared opening contract.
- Create `src/components/case/CaseSection.tsx` and `CaseSection.module.css` — `decision`, `constraint`, and `outcome` treatments without prose-card repetition.
- Create `src/data/case-openings.ts` and `case-openings.test.ts` — typed verified opening data and navigation adjacency.
- Modify each public case `page.tsx` and MDX file under `src/app/work/**` and `src/app/notes/dynamic-island/**` — mechanical prop/section migration without claim changes.
- Create `src/app/notes/dynamic-island/dynamic-island-continuity.tsx` — verified authored status/continuity diagram.
- Localize an approved Agentic Calendar artifact under `src/app/work/agentic-calendar/` only if its source rights and claim accuracy pass Gate E; otherwise create a verified product-system diagram in code.

### Tests and tooling

- Modify `scripts/check-budgets.mts` and add/update its fixture-level assertions if needed — named world scene chunk, selected GLB, and one active poster transfer budget.
- Modify `e2e/home.spec.ts`, `keyboard.spec.ts`, `responsive.spec.ts`, `reduced-motion.spec.ts`, `network.spec.ts`, `no-js.spec.ts`, `journey.spec.ts`, `a11y.spec.ts`, and `case-routes.spec.ts` immediately after the corresponding interface lock.
- Create `e2e/world.spec.ts` — lazy canvas lifecycle, fallback, one-canvas rule, scene changes, and non-interference.
- Keep `src/lib/analytics.test.ts` as the analytics whitelist authority; extend it with a regression assertion that world/journey event names are rejected.

---

### Task 0: Lock authority, privacy, and public interfaces

**Owner:** Codex writes and judges; Claude reviews contradictions and runs the document checks.

**Files:**
- Modify: `DESIGN.md`
- Modify: `PRD.md`
- Modify: `docs/superpowers/specs/2026-08-17-immersive-product-world-design.md`
- Create: `src/features/world/types.ts`
- Test: `src/lib/analytics.test.ts`

**Interfaces:**
- Consumes: `WorkSlug` from `src/data/work.ts`; `MascotSignal` from `src/features/mascot/signals.ts`; the existing four-name analytics union from `src/lib/analytics.ts`.
- Produces:

```ts
export type WorldSceneId = "hero" | "board" | "journey";

export interface WorldAnchorMetrics {
  readonly id: WorldSceneId;
  readonly top: number;
  readonly height: number;
  readonly viewportProgress: number;
  readonly intersecting: boolean;
}

export interface WorldDiscreteState {
  readonly activeScene: WorldSceneId;
  readonly activeWork: WorkSlug | null;
  readonly dragging: boolean;
  readonly reaction: MascotReactionState;
  readonly documentVisible: boolean;
  readonly activeRegionVisible: boolean;
}

export interface WorldDirector {
  getSnapshot(): WorldDiscreteState;
  subscribe(listener: () => void): () => void;
  registerAnchor(id: WorldSceneId, node: HTMLElement | null): void;
  readAnchor(id: WorldSceneId): WorldAnchorMetrics | null;
  measure(viewportHeight?: number): void;
  setActiveWork(slug: WorkSlug | null): void;
  setDragging(dragging: boolean): void;
  receiveSignal(signal: MascotSignal): void;
  advanceReaction(now: number): void;
  setDocumentVisible(visible: boolean): void;
}
```

`MascotReactionState` is imported from `src/features/mascot/reaction-machine.ts`; it remains the single authority for priority, expiry, queued reactions, incident persistence, drag ownership, and return to idle.

- [ ] **Step 1: Write the failing analytics-boundary test**

Replace the stale adapter tests with configured and unconfigured cases. Mock `posthog.capture`, set the two public PostHog environment variables for the configured case, accept exactly the four approved custom event names, reject `world_scene`, `guide_reaction`, `journey_stage`, and `board_position`, and assert the journey store neither imports nor invokes the analytics adapter.

```ts
expect(allowedAnalyticsEvents).toEqual([
  "resume_download",
  "contact_click",
  "case_open",
  "full_case_read",
]);
expect(isAllowedAnalyticsEvent("world_scene")).toBe(false);
```

The test commentary must state the current conditional-PostHog contract: without public environment configuration it is a no-op; with configuration it may capture only the exported whitelist. PostHog's configured pageviews/autocapture are provider behavior outside this custom-event adapter.

- [ ] **Step 2: Run the focused test and observe the interface failure**

Run: `pnpm test src/lib/analytics.test.ts`

Expected: FAIL because the exact exported whitelist helper is not yet present or does not assert all rejected names.

- [ ] **Step 3: Freeze the analytics boundary without adding captures**

Export the existing four-name constant and a type guard from `src/lib/analytics.ts`; keep every existing call site unchanged. The local journey store continues to dispatch `garvit:mascot-signal` and write only `garvit-journey:v1` session storage.

- [ ] **Step 4: Amend the three authority documents**

Record all Global Constraints verbatim, mark the immersive spec `approved`, replace the stale Scene 3 disclosure with the PostHog sentence, state repository-only attribution if Muko wins, explicitly allow warranted surface rebuilds, and specify the actual-board-overlap strategy: the board section moves upward so its real first ticket enters the hero boundary; the hero never renders a duplicate ticket.

- [ ] **Step 5: Add the world public types without implementation**

Create `types.ts` with the signatures above. Add comments that `measure()` updates mutable presentation metrics without publishing React snapshots, while only the six fields in `WorldDiscreteState` may notify subscribers.

- [ ] **Step 6: Run authority and type checks**

Run:

```bash
rg -n "computed in your browser|I never see it|PostHog|OperationsRail|session.*board|board.*session|visible credit|repository-only" DESIGN.md PRD.md docs/superpowers/specs/2026-08-17-immersive-product-world-design.md
pnpm test src/lib/analytics.test.ts
pnpm typecheck
```

Expected: one consistent disclosure, board-before-journey ordering, no public-credit requirement, exactly four PostHog events, and all checks PASS.

- [ ] **Step 7: Claude contradiction review and immediate correction**

Claude reads the amended sections and `types.ts`, reports exact conflicting lines or returns `AUTHORITY LOCK PASS`. Codex resolves every conflict before Task 1.

- [ ] **Step 8: Commit the authority lock**

```bash
git add DESIGN.md PRD.md docs/superpowers/specs/2026-08-17-immersive-product-world-design.md src/features/world/types.ts src/lib/analytics.ts src/lib/analytics.test.ts
git commit -m "docs: lock immersive world contracts"
```

### Task 1: Acquire, inspect, and select the guide model — Gate A

**Owner:** Claude performs acquisition, inspection, contact-sheet rendering, and reporting; Codex selects/rejects on visual and technical merit.

**Files:**
- Create: `docs/qa/immersive/model-inspection.md`
- Create: `docs/qa/immersive/gate-a-model.md`
- Create: `docs/qa/immersive/contact-sheets/muko-*.png`
- Create: `docs/qa/immersive/contact-sheets/quaternius-*.png`
- Create: `docs/qa/immersive/source-manifests/muko.json`
- Create: `docs/qa/immersive/source-manifests/quaternius.json`
- Modify after selection: `DESIGN.md`

**Interfaces:**
- Consumes: Muko candidate URL `https://sketchfab.com/3d-models/astronaut-character-stylized-rigged-free-model-c8daa753952e454eb3c6195446751e88`; Quaternius candidate URL `https://quaternius.com/packs/universalbasecharacters.html`; asset limits in Global Constraints.
- Produces: selected candidate identity plus inspection metadata `{ sourceUrl, creator, license, sourceSha256, sourceNodes, sourceBones, sourceTriangles, sourceMaterials, textureDimensions, animations }`. Task 1 deliberately does not create the stable production GLB or final hash; fitted props, final topology/materials, optimization, renderer draw-call measurement, and production manifest belong to Task 4.

- [ ] **Step 1: Verify the local 3D tool path before downloading**

Run:

```bash
command -v blender || true
pnpm dlx @gltf-transform/cli@4.4.2 --version
```

Expected: record exact versions. If Blender is absent, stop and ask Garvit before installing it; do not use runtime Three.js primitives as a substitute for fitted geometry.

- [ ] **Step 2: Acquire both original candidates into a temporary evidence workspace**

Claude downloads the original archives, records final source URLs, displayed revision/date, creator, license text, and SHA-256 hashes. Reject a candidate immediately if download rights, texture rights, or source provenance cannot be verified.

- [ ] **Step 3: Inspect technical anatomy before modification**

For each candidate, record mesh names/count, triangle count, draw calls, material names, texture paths/dimensions/color space, skeleton/root/bone names, bind pose, animation clips/durations, root scale, bone orientation, and presence of trademarks or third-party patches. Render the unmodified neutral pose once to expose missing textures and visor-sorting defects.

- [ ] **Step 4: Prepare reversible web previews**

Duplicate source files, remove trademark patches, apply only the shared test palette and opaque graphite visor, and preserve the original archive untouched. Do not join skinned meshes or resample animation clips before validating the bind pose.

- [ ] **Step 5: Render the required six-view sheets for both candidates**

Export front three-quarter, profile, 1440 hero crop, 390 mobile crop, light scene, and dark scene using the same neutral camera family and soft-key/cool-fill/rim rig. Label each image with candidate, view, triangles, draw calls, and source/optimized size.

- [ ] **Step 6: Run the model gate checks**

Reject any candidate with an uncanny or game-NPC face, weak silhouette at mobile crop, unusable humanoid rig, floating/grafted accessory requirement, ambiguous rights, >25k triangles after safe cleanup, >30 projected production draw calls, or >1.8 MB after texture-first optimization. Counts below those ceilings are acceptable when the rendered character meets the visual bar.

- [ ] **Step 7: Codex selects on merit and records the decision**

Codex scores silhouette, friendly/default read, crop strength, material response, rig usefulness, fitted-prop feasibility, light/dark parity, and budget. `gate-a-model.md` must name the winner, rejected candidate, evidence, known rig limitations, and either `PASS` or `STOP`.

- [ ] **Step 8: Freeze the selected source record**

Keep the untouched winning source in the approved temporary art workspace for Task 4 and commit only its source manifest, contact-sheet evidence, exact license text, and original SHA-256 under `docs/qa/immersive/`. If Muko wins, record creator, CC-BY text/link, source URL, and planned modification disclosure without adding a public-site credit. Do not write `public/models/guide/guide.glb` yet.

- [ ] **Step 9: Run asset checks**

Run against the staged original and committed manifest:

```bash
shasum -a 256 /private/tmp/garvit-guide-source/selected-source.*
rg -n 'sourceUrl|creator|license|sourceSha256|sourceBones|sourceTriangles|sourceMaterials|textureDimensions|animations' docs/qa/immersive/source-manifests
pnpm typecheck
```

Expected: the original hash matches the selected manifest, ceilings are feasible, and `gate-a-model.md` says PASS.

- [ ] **Step 10: Commit Gate A**

```bash
git add DESIGN.md docs/qa/immersive/model-inspection.md docs/qa/immersive/gate-a-model.md docs/qa/immersive/contact-sheets docs/qa/immersive/source-manifests
git commit -m "assets: select immersive guide model"
```

**STOP:** Do not start Scene 1 until `gate-a-model.md` is PASS.

### Task 2: Prove the isolated Scene 1 composition — Gate B

**Owner:** Codex creates and tunes the composition; Claude wires deterministic capture fixtures after markup locks and prepares comparison evidence.

**Files:**
- Create: `src/app/dev/world/page.tsx`
- Create: `src/app/dev/world/WorldPrototype.tsx`
- Create: `src/app/dev/world/world-prototype.module.css`
- Create: `src/app/dev/world/WorldPrototype.test.tsx`
- Create temporarily: `public/images/world/prototype-guide.webp`
- Create: `src/components/ops/FeatureFlagDock.tsx`
- Create: `src/components/ops/FeatureFlagDock.module.css`
- Create: `src/components/ops/FeatureFlagDock.test.tsx`
- Modify: `src/features/flags/FeatureFlagsPanel.tsx`
- Modify: `src/features/flags/FeatureFlagsPanel.test.tsx`
- Create: `docs/qa/immersive/gate-b-composition.md`
- Create: `docs/qa/immersive/gate-b/*`

**Interfaces:**
- Consumes: approved hero copy and CTA data from `src/data/site.ts`; real work item from `src/data/work.ts`; selected model contact-sheet render from Task 1; existing stateful `FeatureFlagsPanel` behavior.
- Produces: a static, poster-only Scene 1 composition contract with DOM hooks `data-world-prototype`, `data-world-copy`, `data-world-guide`, `data-world-dock`, and `data-board-entry`; plus `FeatureFlagsPanel({ variant?: "panel" | "dock" })`, where `panel` preserves the current default and `dock` changes presentation only. No public homepage files change.

- [ ] **Step 1: Write the failing composition contract test**

Assert the prototype renders one `h1`, exactly two primary CTA links, one real `workItems[0]` ticket/link, one feature flag dock, one decorative guide poster (`alt=""`, `aria-hidden="true"`) whose meaning is already carried by DOM copy, and no `Canvas` or dynamically imported Three module.

- [ ] **Step 2: Run the focused test and observe failure**

Run: `pnpm test src/app/dev/world/WorldPrototype.test.tsx`

Expected: FAIL because the isolated prototype does not exist.

- [ ] **Step 3: Build only the static dev-route composition**

Copy the chosen contact-sheet render to temporary public path `/images/world/prototype-guide.webp` and use it as a decorative `<picture>` source. Build a broad release field with copy on the left, cropped guide on the right, compact flag dock at a subordinate edge, and the actual first work item entering from the bottom. Do not import `InteractiveBoardSection`; the isolated gate renders the same ticket data but makes no homepage migration claim. Task 4 deletes the temporary poster after final camera-matched posters exist.

- [ ] **Step 4: Claude locks the dock presentation interface immediately**

After Codex freezes the compact shell, add `variant: "panel" | "dock"` to the existing stateful `FeatureFlagsPanel`, default it to `panel`, share the same flag rows/store/effects, and use `dock` in the prototype. Migrate `FeatureFlagsPanel.test.tsx` and `FeatureFlagDock.test.tsx` now; both variants must preserve native checkboxes, disabled Comic Sans, row order, storage, signals, and journey events.

- [ ] **Step 5: Tune headline optics at 1440**

Test the new font-size clamp, max measure, and tracking near the prior region values `-.055em`, `-.05em`, and `-.045em`. Capture at 100% zoom and reject any setting with `rn` collision, uneven word color, or a third line. Record the selected size/measure/tracking in `DESIGN.md` only after visual comparison.

- [ ] **Step 6: Tune the 390×844 first viewport**

Keep both 56px-minimum CTAs fully visible, retain a meaningful upper/right guide crop, prevent copy/figure collision, and show a clear work-entry edge below. Do not reduce body copy or controls below existing locked accessibility sizes.

- [ ] **Step 7: Claude migrates the prototype test immediately after markup lock**

Claude updates only the new test/selectors and adds Playwright capture coverage for `/dev/world`; no public homepage E2E selector changes yet.

- [ ] **Step 8: Capture and score Gate B**

Store 1440×900 and 390×844 light/dark images. Codex scores the five Taste dimensions and the static-applicable Apple dimensions. Gate B requires Taste ≥22/25, no dimension below 4, founder ten-second comprehension, no dashboard-card stack, and no fake duplicate ticket.

- [ ] **Step 9: Run focused checks**

Run:

```bash
pnpm test src/app/dev/world/WorldPrototype.test.tsx src/components/ops/FeatureFlagDock.test.tsx src/features/flags/FeatureFlagsPanel.test.tsx
pnpm typecheck
pnpm lint
```

Expected: PASS and `gate-b-composition.md` says PASS with the locked optical values.

- [ ] **Step 10: Commit Gate B**

```bash
git add DESIGN.md src/app/dev/world src/components/ops/FeatureFlagDock.tsx src/components/ops/FeatureFlagDock.module.css src/components/ops/FeatureFlagDock.test.tsx src/features/flags/FeatureFlagsPanel.tsx src/features/flags/FeatureFlagsPanel.test.tsx public/images/world/prototype-guide.webp docs/qa/immersive/gate-b-composition.md docs/qa/immersive/gate-b
git commit -m "feat: prove immersive hero composition"
```

**STOP:** Do not create the public homepage layout or case templates until Gate C also passes.

### Task 3: Implement the world director and anchor contracts

**Owner:** Codex defines and implements interfaces; Claude migrates tests immediately after the contract commit and reports any consumer friction.

**Files:**
- Create: `src/features/world/world-store.ts`
- Create: `src/features/world/world-store.test.ts`
- Create: `src/features/world/WorldProvider.tsx`
- Create: `src/features/world/WorldAnchor.tsx`
- Create: `src/features/world/WorldAnchor.test.tsx`
- Create: `src/features/world/index.ts`

**Interfaces:**
- Consumes: exact `WorldDirector` and state types from Task 0.
- Produces: `createWorldDirector(): WorldDirector`, `WorldProvider({ children })`, `useWorldDirector(): WorldDirector`, `useWorldSnapshot(): WorldDiscreteState`, and `WorldAnchor({ id, as?, className?, children })`.

- [ ] **Step 1: Write failing store tests**

Cover stable snapshot identity when `measure()` changes continuous metrics, one subscriber notification per discrete change, no notification for idempotent setters, anchor replacement/unregistration, active scene chosen from the strongest intersecting anchor, and `receiveSignal()` retaining the exact event.

```ts
const director = createWorldDirector();
const before = director.getSnapshot();
director.measure(900);
expect(director.getSnapshot()).toBe(before);
director.setDragging(true);
expect(director.getSnapshot()).toEqual({ ...before, dragging: true });
```

- [ ] **Step 2: Run the store tests and observe failure**

Run: `pnpm test src/features/world/world-store.test.ts`

Expected: FAIL because `createWorldDirector` is absent.

- [ ] **Step 3: Implement the smallest external store**

Keep anchor nodes and their latest measurements in private maps. Publish immutable `WorldDiscreteState` only for active scene/work/drag/reaction/visibility changes. `measure()` reads each registered rect once per requested frame, computes clamped `viewportProgress`, and publishes only when `activeScene` or `activeRegionVisible` changes. Rank anchors by viewport-center proximity with DOM order `hero → board → journey` as an exact tie-breaker; keep the current scene until another anchor is at least 8% of viewport height closer to prevent overlap thrash. `GuideScene` reads `readAnchor(activeScene)` per frame for continuous within-scene progress rather than reducing motion to three jumps.

- [ ] **Step 4: Write failing provider/anchor tests**

Render three existing semantic sections inside `WorldProvider`, register them with `WorldAnchor as="div"`, verify registration on mount and `null` unregistration on unmount, preserve each inner section's labelled heading, forward refs and valid div props, and throw a clear error when `useWorldDirector()` is used outside the provider. The homepage must never wrap an existing `<section>` with another `<section>`.

- [ ] **Step 5: Implement provider and anchor**

Create one director per provider with `useRef`; use `useSyncExternalStore` only in `useWorldSnapshot`. `WorldAnchor` defaults to `<section>`, forwards ordinary section props, and never changes layout by itself.

- [ ] **Step 6: Subscribe the director to the existing signal bus**

Within `WorldProvider`, subscribe once to `subscribeMascotSignals` and call `director.receiveSignal(signal)`. The director delegates to `receiveMascotSignal(current.reaction, signal, now)`; the provider schedules exactly one timer for `reaction.expiresAt` and calls `advanceReaction(Date.now())`, which delegates to `advanceMascotState`. Do not create a second `CustomEvent`, do not persist world state, and do not call analytics.

- [ ] **Step 7: Claude migrates contract tests immediately**

Claude adds assertions to existing board and journey signal tests that the compatibility bus still emits the same `MascotSignal`; no R3F import may appear in those modules.

- [ ] **Step 8: Run contract checks**

Run:

```bash
pnpm test src/features/world src/features/board/mascot-signals.test.ts src/features/journey
pnpm typecheck
```

Expected: PASS with no continuous measurement-driven React rerenders.

- [ ] **Step 9: Commit the contract**

```bash
git add src/features/world src/features/board/mascot-signals.test.ts src/features/journey
git commit -m "feat: add persistent world director"
```

### Task 4: Build and audit the isolated interactive world prototype — Gate C

**Owner:** Codex implements canvas, rig, materials, camera, and motion; Claude optimizes assets, exports posters, migrates gate tests, records interactions, and runs mechanical audits.

**Files:**
- Create: `src/features/world/ExperienceWorld.tsx`
- Create: `src/features/world/ExperienceWorld.test.tsx`
- Create: `src/features/world/capability-policy.ts`
- Create: `src/features/world/capability-policy.test.ts`
- Create: `src/features/world/WorldCanvas.tsx`
- Create: `src/features/world/GuideScene.tsx`
- Create: `src/features/world/guide-rig.ts`
- Create: `src/features/world/guide-rig.test.ts`
- Create: `src/features/world/scene-motion.ts`
- Create: `src/features/world/scene-motion.test.ts`
- Create: `src/features/world/world.module.css`
- Create: `src/features/world/asset-manifest.test.ts`
- Modify: `src/app/dev/world/WorldPrototype.tsx`
- Modify: `src/app/dev/world/WorldPrototype.test.tsx`
- Delete after final poster export: `public/images/world/prototype-guide.webp`
- Create: `public/models/guide/guide.glb`
- Create: `public/models/guide/LICENSE.md`
- Create: `public/models/guide/source.json`
- Create: `public/images/world/guide-light.webp`
- Create: `public/images/world/guide-dark.webp`
- Modify: `scripts/check-budgets.mts`
- Create: `e2e/world.spec.ts`
- Create: `docs/qa/immersive/gate-c-world.md`
- Create: `docs/qa/immersive/gate-c/*`

**Interfaces:**
- Consumes: `WorldDirector`, selected source manifest/original hash from Gate A, `MascotSignal`, existing `getMascotFallback()` policy behavior, semantic CSS palette tokens.
- Produces:

```ts
export type GuideGesture =
  | "idle"
  | "wave"
  | "board-guide"
  | "drag-watch"
  | "pager-check"
  | "ship-celebration"
  | "resolution";

export interface SceneTarget {
  position: readonly [number, number, number];
  rotation: readonly [number, number, number];
  scale: number;
  camera: readonly [number, number, number];
  lookAt: readonly [number, number, number];
}

export function gestureForWorldState(state: WorldDiscreteState): GuideGesture;
export function targetForScene(id: WorldSceneId, narrow: boolean): SceneTarget;
export function resolveGuideRig(root: Object3D): GuideRig;

export interface GuideRig {
  root: Object3D;
  hips: Object3D;
  spine: Object3D;
  chest: Object3D;
  neck: Object3D;
  head: Object3D;
  leftUpperArm: Object3D;
  rightUpperArm: Object3D;
  leftForearm: Object3D;
  rightForearm: Object3D;
  leftHand: Object3D;
  rightHand: Object3D;
}

export type WorldFallbackReason =
  | "reduced-motion"
  | "save-data"
  | "low-memory"
  | "performance-kill"
  | "renderer-failure";

export function getWorldFallback(input: {
  reducedMotion: boolean;
  saveData: boolean;
  deviceMemory?: number;
  performanceKill: boolean;
  rendererFailed: boolean;
}): WorldFallbackReason | null;
```

- [ ] **Step 1: Write failing rig-contract tests from the selected manifest**

Test exact required semantic bones—root, hips, spine, chest, neck, head, both upper arms, forearms, and hands—and make the thrown error list missing semantics. Validate the final selected GLB's actual names, not robot-era aliases. Add `asset-manifest.test.ts` to compare the committed GLB byte size/hash and final node manifest against `source.json`.

- [ ] **Step 2: Run rig tests and observe failure**

Run: `pnpm test src/features/world/guide-rig.test.ts`

Expected: FAIL because the selected-rig adapter is absent.

- [ ] **Step 3: Author the final fitted and optimized production asset**

Start from the selected original whose SHA-256 passed Gate A. Fit helmet headset modules and pager geometry in the source asset/Blender scene, remove trademarks, apply the production material/UV set, and optimize textures/meshes without breaking bind pose. Measure draw calls in the production R3F renderer. Write the final GLB, repository license, final/original hashes, modification record, exact node/bone manifest, texture dimensions, triangle count, renderer draw calls, and clips to `public/models/guide/`.

- [ ] **Step 4: Implement the rig adapter and pose mapping**

Resolve the exact final manifest names once, preserve bind quaternions, and apply additive local rotations. Map the derived `WorldDiscreteState.reaction` to the seven guide gestures without renaming the shared signal payload. The scene never chooses a gesture directly from the last raw signal.

- [ ] **Step 5: Write failing motion tests**

Test critically damped convergence, no overshoot beyond target tolerance, direct reduced-motion materialization, scene re-entry beginning from current presentation values, and interruption replacing an in-flight target without resetting to the old scene origin.

- [ ] **Step 6: Implement presentation-state springs**

Use independent critically damped springs for position, rotation, camera crop, and gesture weights. Keep values in refs sampled by `useFrame`; do not mirror them into React state. `targetForScene()` owns authored target constants for wide and narrow crops.

- [ ] **Step 7: Write failing lifecycle/component tests**

Mock the lazy canvas and assert: poster renders before first frame; only one canvas boundary mounts; canvas is pointer-transparent and `aria-hidden`; WebGL failure restores poster without layout shift; reduced motion/Save-Data/performance kill never imports the Three scene; `document.hidden` disables playback; scene events never call analytics.

Port the existing capability-policy truth table into `world/capability-policy.test.ts` first, including low-memory threshold behavior and renderer-failure precedence, then implement `getWorldFallback` without importing the mascot-named policy. The old mascot policy stays only until Task 9 proves it has no consumers and deletes it.

- [ ] **Step 8: Implement `ExperienceWorld` and one-canvas lifecycle**

Use a dynamic import inside an idle callback only after capability and active-union checks pass. The world stage is fixed/persistent across the prototype anchors, calls `director.measure()` from a single rAF only while active, and invalidates R3F on pointer look, signal, section transition, palette change, or spring continuation. Set `frameloop="demand"`; request continuous frames only while a spring or reaction is unsettled.

Extend only `/dev/world` with lightweight, semantic `board` and `journey` anchor fixtures plus labelled test controls for drag-start/drag-end, incident/resolved, milestone, and ship signals after Scene 1's static composition is locked. They exist to prove one-canvas persistence, reaction arbitration, target interruption/re-grab, and pause-after-journey behavior without migrating or duplicating the production board/funnel. Gate C's visual score is still taken on Scene 1; the other fixtures are behavioral evidence only.

- [ ] **Step 9: Author materials, lighting, and camera in `GuideScene`**

Use porcelain shell, graphite opaque visor, release-blue underlayer, fitted coral hardware, subtle roughness/normal distinction, soft key, cool fill, narrow rim, and grounded contact shadow. Remove all source trademarks. Ensure the default crop is friendly and legible in both themes before adding reactions.

- [ ] **Step 10: Tune guide behavior in the isolated route**

Implement one wave per session mount, restrained fine-pointer head/torso look, idle glance toward work, drag-watch, pager check, celebration, and settle. Touch gets the authored idle composition. Every transition remains interruptible from its current presentation values; no scroll motion controls DOM visibility.

- [ ] **Step 11: Claude performs immediate test migration and asset validation**

Claude updates `WorldPrototype.test.tsx` and `e2e/world.spec.ts` after the lifecycle/control selectors lock, compares every gesture and silhouette against the Gate A source renders, and exports light/dark posters from the exact locked hero camera. Use `<picture>` so only the active theme poster transfers. Record final asset hashes and measurements, then delete the temporary prototype poster.

- [ ] **Step 12: Execute Gate C evidence matrix**

Capture both themes at 1440×900 and 390×844; normal-speed and 0.25× reviews of look interruption, wave settle, scene target interruption, and reaction settle; reduced motion; Save-Data; performance kill; document-hidden pause; WebGL failure. Run axe and console checks.

- [ ] **Step 13: Codex scores the blocking Apple and Taste audits**

Apple: eight dimensions, ≥34/40, none <4. Taste: five dimensions, ≥22/25, none <4. Record each score, visible failure, correction, and rescored result in `gate-c-world.md`. A technically functioning but weak model/crop/material result fails the gate.

- [ ] **Step 14: Run focused automated gates**

Run:

```bash
pnpm test src/features/world src/app/dev/world
pnpm exec playwright test e2e/world.spec.ts
pnpm typecheck
pnpm lint
pnpm build
pnpm check:budgets
```

Expected: all PASS; world/Three code is absent from initial route scripts; GLB and posters meet the amended budgets.

- [ ] **Step 15: Commit Gate C**

```bash
git add src/features/world src/app/dev/world public/images/world public/models/guide e2e/world.spec.ts docs/qa/immersive/gate-c-world.md docs/qa/immersive/gate-c scripts/check-budgets.mts
git commit -m "feat: prove persistent guide world"
```

**STOP:** Public page migration begins only when `gate-c-world.md` says PASS.

### Task 5: Migrate the homepage composition and flag dock — Gate D1

**Owner:** Codex locks composition and CSS; Claude integrates the Gate B dock plus immediate home/no-JS/a11y test migration.

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/page.module.css`
- Modify: `src/components/hero/Hero.tsx`
- Modify: `src/components/hero/Hero.module.css`
- Modify: `src/components/ops/FeatureFlagDock.tsx`
- Modify: `src/components/ops/FeatureFlagDock.module.css`
- Modify: `src/components/ops/FeatureFlagDock.test.tsx`
- Modify: `src/features/flags/FeatureFlagsPanel.tsx`
- Modify: `src/features/flags/FeatureFlagsPanel.test.tsx`
- Modify: `src/features/journey/SessionJourneySection.tsx`
- Modify: `src/features/journey/SessionJourneySection.test.tsx`
- Modify: `e2e/home.spec.ts`
- Modify: `e2e/no-js.spec.ts`
- Modify: `e2e/a11y.spec.ts`
- Modify: `e2e/journey.spec.ts`

**Interfaces:**
- Consumes: `WorldProvider`, `WorldAnchor`, `ExperienceWorld`; Gate B's locked `FeatureFlagDock`/`FeatureFlagsPanel({ variant: "dock" })`; existing `InteractiveBoardSection`; existing `SessionJourneySection`.
- Produces: homepage order `hero → board → journey`, one world provider/canvas, `[data-world-anchor="hero|board|journey"]`, and `FeatureFlagDock` preserving native checkbox labels/defaults/storage/effects.

- [ ] **Step 1: Write failing homepage-order and semantics tests**

Assert one `main`, one `h1`, hero before board before journey in DOM order, exactly two primary hero CTAs, no `OperationsRail`, one labelled feature-flag dock, and one `ExperienceWorld` sibling that does not wrap or own DOM navigation.

- [ ] **Step 2: Run focused tests and observe failure**

Run: `pnpm test src/components/ops src/features/flags src/features/journey`

Expected: FAIL because the dock and new order do not exist.

- [ ] **Step 3: Claude integrates the already-locked flag dock**

Mount the Gate B dock without duplicating or reshaping its store. Preserve row order, native checkbox semantics, disabled Comic Sans tooltip, current descriptors, persisted theme/confetti/candid behavior, journey `played` event, mascot signal, and all existing data attributes. Only integration spacing may change; the dock remains compact and subordinate to hero CTAs.

- [ ] **Step 4: Codex migrates the public page composition**

Mount `WorldProvider` once, place `ExperienceWorld` once, register existing semantic hero/board/journey sections through `WorldAnchor as="div"` (or a forwarded registration ref on the section itself), dissolve the operations rail, and move journey after the board. Make the board's own section overlap upward; do not render a cloned hero ticket or create nested `<section>` landmarks.

- [ ] **Step 5: Apply the locked Scene 1 CSS to the real homepage**

Reconcile actual chrome/experiment-strip heights, preserve the two-line desktop headline and first-screen mobile CTAs, keep `DELHI / IST` only in product chrome, ensure a single dominant accent, and prevent the fixed canvas from blocking focus rings, dialogs, popovers, or ticket drag.

- [ ] **Step 6: Claude migrates tests immediately after DOM selectors lock**

Update `home`, `no-js`, `a11y`, and journey-order tests now. No-JS must retain hero CTAs, every case route link, and readable poster; it need not render client-only flag toggles. Axe must see the experiment strip and flag dock inside valid landmarks.

- [ ] **Step 7: Run Gate D1 checks and captures**

Run:

```bash
pnpm test src/components/ops src/features/flags src/features/journey
pnpm exec playwright test e2e/home.spec.ts e2e/no-js.spec.ts e2e/a11y.spec.ts e2e/journey.spec.ts
pnpm typecheck
pnpm lint
```

Capture 1440×900 and 390×844 light/dark. Expected: ordering, CTAs, dock, no-JS, landmarks, disclosure, and local funnel persistence all PASS.

- [ ] **Step 8: Commit the homepage interface lock**

```bash
git add src/app/page.tsx src/app/page.module.css src/components/hero src/components/ops src/features/flags src/features/journey e2e/home.spec.ts e2e/no-js.spec.ts e2e/a11y.spec.ts e2e/journey.spec.ts
git commit -m "feat: migrate homepage into product world"
```

### Task 6: Integrate board signals and explicit mobile discovery — Gate D2

**Owner:** Codex owns overlap, ticket/artifact judgment, and guide responses; Claude implements mobile state/controls and migrates keyboard/responsive tests immediately.

**Files:**
- Modify: `src/features/board/InteractiveBoardSection.tsx`
- Modify: `src/features/board/InteractiveBoardSection.test.tsx`
- Create: `src/features/board/MobileColumnNav.tsx`
- Create: `src/features/board/MobileColumnNav.test.tsx`
- Create: `src/features/board/useBoardViewport.ts`
- Modify: `src/components/board/board.module.css`
- Modify: `src/features/board/board-interactions.module.css`
- Modify: `src/features/board/preview-artifacts.module.css`
- Modify: `e2e/keyboard.spec.ts`
- Modify: `e2e/responsive.spec.ts`
- Modify: `e2e/world.spec.ts`

**Interfaces:**
- Consumes: existing pointer/velocity/projection/spring/storage/dialog implementation; `WorldDirector.setActiveWork`, `setDragging`, and shared signal bus.
- Produces: `MobileColumnNav({ columns, activeIndex, onSelect, onPrevious, onNext })`, `useBoardViewport()` returning `{ activeIndex, scrollToIndex, previous, next }`, visible `n of 3`, and world drag/work publication.

- [ ] **Step 1: Write failing mobile navigation tests**

Test tab semantics/labels, roving selection, `1 of 3`, previous disabled at first, next disabled at last, tab click and controls calling exact indices, and all controls remaining buttons/links without drag.

- [ ] **Step 2: Run tests and observe failure**

Run: `pnpm test src/features/board/MobileColumnNav.test.tsx src/features/board/InteractiveBoardSection.test.tsx`

Expected: FAIL because mobile navigation and world publications are absent.

- [ ] **Step 3: Claude implements mobile navigation plumbing**

Use a horizontal scroll container with CSS scroll snap, `scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", inline: "start" })`, IntersectionObserver for active column, explicit tabs plus previous/next controls, and a visible next-column peek. Keep all tickets as real links and preserve keyboard Alt+Arrow movement independently.

- [ ] **Step 4: Codex wires the board into the world director**

On pointer-down/drag start, set active work and drag state immediately; on every release/cancel, clear dragging while keeping the last active work long enough for settle; publish existing shipped/incident/resolved signals unchanged. Never send continuous pointer samples through React state or analytics.

- [ ] **Step 5: Preserve the complete board behavior matrix**

Re-run pointer-up-as-final-sample, low-sample release, `.55` rubber band, `.998` projection decay capped at 280px, independent x/y spring velocity handoff, presentation-value re-grab via DOMMatrix, keyboard immediate move/focus travel/live announcement, `garvit-board:v1`, Reset, preview focus restoration, and Escape close.

- [ ] **Step 6: Decide resting artifact treatment from verified inventory**

Use artifact fragments only if all four tickets have truthful, visually coherent assets. Otherwise keep resting tickets typographic and reserve artifacts for case openings. Do not use placeholder imagery or the remote Agentic Calendar image without local rights verification.

- [ ] **Step 7: Claude migrates responsive and keyboard tests immediately**

Add 320/390/430 WebKit touch paths that reach all four projects without dragging; assert active position text, controls, next peek, no horizontal page overflow, preview CTA in first screen, and unchanged desktop drag/keyboard/storage behavior.

- [ ] **Step 8: Run Gate D2**

Run:

```bash
pnpm test src/features/board
pnpm exec playwright test e2e/keyboard.spec.ts e2e/responsive.spec.ts e2e/world.spec.ts
pnpm typecheck
pnpm lint
```

Expected: all behavior and discovery checks PASS at 320/390/430/768 plus desktop; no console errors.

- [ ] **Step 9: Commit board integration**

```bash
git add src/features/board src/components/board e2e/keyboard.spec.ts e2e/responsive.spec.ts e2e/world.spec.ts
git commit -m "feat: connect work board to immersive world"
```

### Task 7: Elevate all four case openings — Gate E

**Owner:** Codex authors the case-opening visual system and artifact judgment; Claude inventories assets, transcribes repeated route data/MDX, and migrates case tests immediately after the prop contract locks.

**Files:**
- Create: `src/data/case-openings.ts`
- Create: `src/data/case-openings.test.ts`
- Create: `src/components/case/CaseOpening.tsx`
- Create: `src/components/case/CaseOpening.module.css`
- Create: `src/components/case/CaseOpening.test.tsx`
- Create: `src/components/case/CaseSection.tsx`
- Create: `src/components/case/CaseSection.module.css`
- Modify: `src/components/case/CaseShell.tsx`
- Modify: `src/components/case/CaseShell.module.css`
- Create: `src/components/case/CaseShell.test.tsx`
- Modify: four route `page.tsx` files and four MDX files
- Create: `src/app/notes/dynamic-island/dynamic-island-continuity.tsx`
- Modify: `e2e/case-fixtures.ts`
- Modify: `e2e/case-routes.spec.ts`
- Modify: `e2e/keyboard.spec.ts`

**Interfaces:**
- Produces:

```ts
export type CaseTreatment = "decision" | "constraint" | "outcome";

export interface CaseOpeningData {
  slug: WorkSlug;
  kindLabel: string;
  ticketId: string;
  title: string;
  value: string;
  facts: readonly PreviewFact[];
  previous: WorkSlug | null;
  next: WorkSlug | null;
}

export interface CaseShellProps extends CaseOpeningData {
  artifact: ReactNode;
  children: ReactNode;
}
```

- [ ] **Step 1: Claude completes the evidence inventory**

Map every current local/remote artifact to route, source, rights, factual claim, duplication point, and recommended opening. Stay uses its day-view/product artifact; Maxie uses its local prototype; Agentic Calendar uses a rights-cleared local artifact or verified code diagram; Dynamic Island uses the authored continuity/status diagram.

- [ ] **Step 2: Write failing data and component tests**

Assert exactly four slugs, each opening has exactly three facts reused from `workItems` rather than copied strings, linear previous/next adjacency with `previous: null` on the first case and `next: null` on the last, back-to-board href `/#work-board`, one opening artifact, and a calm 68ch body after the opening. Assert no opening claims not found in approved data.

- [ ] **Step 3: Run focused tests and observe failure**

Run: `pnpm test src/data/case-openings.test.ts src/components/case`

Expected: FAIL because the typed opening system does not exist.

- [ ] **Step 4: Codex implements and visually locks one representative case**

Use Stay Portal to establish the opening: product chrome, immediate back-to-board, kind/ticket, title, one-sentence value, three factual signals, one large real artifact, then 68ch reading. Define distinct but restrained `decision`, `constraint`, and `outcome` sections with rules/type/material—not a repeated rounded-card stack.

- [ ] **Step 5: Capture the representative case lock**

Capture Stay at 1440 and 390 in both themes. Taste must score ≥22/25 with no dimension below 4 before repeated route migration.

- [ ] **Step 6: Claude transcribes the remaining three routes immediately**

Apply the locked props and section wrappers to Maxie, Agentic Calendar, and Dynamic Island; remove duplicated opening figures from MDX; keep all prose and factual claims unchanged; add non-wrapping previous/next navigation. `CasePreviewDialog.tsx` remains the sole owner of `full_case_read`; `CaseShell` and route navigation must not emit it.

- [ ] **Step 7: Build only verified missing artifacts**

Create the Dynamic Island continuity/status diagram from sourced facts. For Agentic Calendar, localize the approved artifact only when rights are documented; otherwise build a product-system diagram from its five surfaces/four capabilities/one layer facts. No synthetic screenshots.

- [ ] **Step 8: Claude migrates route and keyboard tests immediately**

Assert artifact-before-prose, correct factual values, back/previous/next links, primary headings, focus order, no image overflow, and all four route status codes. Keep analytics assertions limited to `case_open` and `full_case_read` where already intended.

- [ ] **Step 9: Run Gate E**

Run:

```bash
pnpm test src/data/case-openings.test.ts src/components/case
pnpm exec playwright test e2e/case-routes.spec.ts e2e/keyboard.spec.ts
pnpm typecheck
pnpm lint
```

Capture all four openings at desktop/mobile in both themes. Expected: artifacts and facts precede prose, navigation is complete, all checks PASS, and `gate-e-cases.md` records the artifact provenance.

- [ ] **Step 10: Commit case elevation**

```bash
git add src/data/case-openings.ts src/data/case-openings.test.ts src/components/case src/app/work src/app/notes/dynamic-island e2e/case-fixtures.ts e2e/case-routes.spec.ts e2e/keyboard.spec.ts docs/qa/immersive/gate-e-cases.md docs/qa/immersive/gate-e
git commit -m "feat: add artifact-led case openings"
```

### Task 8: Integrate motion, materials, fallback, and performance craft — Gate D3

**Owner:** Codex makes all visible craft/performance decisions; Claude runs matrix captures, optimization passes, and mechanical regression fixes.

**Files:**
- Modify: `src/features/world/**`
- Modify: `src/app/page.module.css`
- Modify: `src/app/globals.css`
- Modify: board/journey/flags CSS modules as visually required
- Modify: `scripts/check-budgets.mts`
- Modify: `e2e/world.spec.ts`
- Modify: `e2e/network.spec.ts`
- Modify: `e2e/reduced-motion.spec.ts`
- Modify: `e2e/responsive.spec.ts`
- Create: `docs/qa/immersive/gate-d-home.md`
- Create: `docs/qa/immersive/gate-d/*`

**Interfaces:**
- Consumes: locked homepage, board, journey, guide, and capability contracts.
- Produces: release-quality continuous scene choreography and measurable fallback/performance behavior without changing content or analytics contracts.

- [ ] **Step 1: Write failing lifecycle and budget assertions**

Extend tests to assert one theme poster request, no GLB/Three request under reduced motion/Save-Data/performance kill, one GLB request on capable clients, canvas pause after journey/footer and while hidden, no world-triggered PostHog calls, and named asset/scene budget checks with no `SKIP` result.

- [ ] **Step 2: Run focused failures**

Run:

```bash
pnpm exec playwright test e2e/world.spec.ts e2e/network.spec.ts e2e/reduced-motion.spec.ts
pnpm build
pnpm check:budgets
```

Expected: at least the new exact lifecycle/budget assertions FAIL before final integration.

- [ ] **Step 3: Tune scene continuity across all three anchors**

Hero: dominant friendly guide and work glance. Board: guide moves/leans toward active ticket without obscuring controls. Journey: guide settles beside the latest reached bar and acknowledges milestones. Re-entry resumes from presentation state. Limit palette dominance to one scene accent and keep release/merge/incident colors semantic.

- [ ] **Step 4: Apply Apple material hierarchy to visible surfaces**

Use depth to explain fixed world vs foreground DOM, contact/ambient shadows to anchor rather than decorate, and restrained translucency only where contrast remains stable. Remove generic gradients, excessive pills, interchangeable cards, ornamental badges, and duplicated metadata revealed by the Taste pre-flight.

- [ ] **Step 5: Complete fallback parity**

Export final camera-matched posters after camera lock, use `<picture>` media selection so only one theme downloads, preserve the guide silhouette and board cue in both, and prevent layout shift at handoff/renderer failure. Reduced motion materializes final scene states without deleting state meaning.

- [ ] **Step 6: Optimize from measured bottlenecks only**

Keep R3F/Three lazy. If limits fail, first reduce atlas payload/draw calls and client-island reach; do not weaken the hero copy, CTA size, or model silhouette. Update `check-budgets.mts` to enforce: homepage initial JS ≤170KB gzip, lazy Three vendor ≤235KB gzip, world scene module ≤25KB gzip, selected GLB ≤1.8MB raw transfer, active poster ≤90KB, fonts ≤100KB. The 90KB poster authority replaces the old 35KB mascot-card ceiling because only one hero-scale theme poster transfers.

- [ ] **Step 7: Claude runs the integrated capture and regression matrix**

Capture 320/390/430/768/1024/1440/1600 in light/dark; keyboard, fine/coarse pointer, WebKit touch, 200% zoom, reduced motion, reduced transparency, forced colors, Save-Data, WebGL failure, and document hidden. Record normal and slowed drag/guide transitions plus console, axe, layout shift, LCP, INP, asset, and bundle measurements.

- [ ] **Step 8: Codex runs integrated Apple and Taste audits**

Score all dimensions. Fix every dimension below 4 and every pre-flight failure, then recapture and rescore. Gate D requires Apple ≥34/40, Taste ≥22/25, both CTAs unmissable, the board visibly connected to the hero, and no content/control obstruction.

- [ ] **Step 9: Run full integration checks**

Run:

```bash
pnpm test
pnpm exec playwright test e2e/home.spec.ts e2e/world.spec.ts e2e/journey.spec.ts e2e/responsive.spec.ts e2e/network.spec.ts e2e/reduced-motion.spec.ts e2e/a11y.spec.ts
pnpm typecheck
pnpm lint
pnpm build
pnpm check:budgets
```

Expected: all PASS, zero console errors, no serious/critical axe violations, no horizontal overflow, and no budget `SKIP`/FAIL for world assets.

- [ ] **Step 10: Commit the integrated craft pass**

```bash
git add src scripts/check-budgets.mts e2e docs/qa/immersive/gate-d-home.md docs/qa/immersive/gate-d public/images/world public/models/guide
git commit -m "feat: polish immersive product world"
```

### Task 9: Release-candidate audit, cleanup, and handoff — Gate F

**Owner:** Claude executes exhaustive gates and reports raw failures; Codex judges/fixes visible failures and makes the final release recommendation. Garvit performs the final live play-through.

**Files:**
- Delete after verification: obsolete mascot/operations modules and assets enumerated in the Locked File Map
- Modify: all affected tests after deletions
- Create: `docs/qa/immersive/gate-f-rc.md`
- Create: `docs/qa/immersive/gate-f/*`
- Modify: `ARCHITECTURE.md`
- Modify: `DESIGN.md`
- Modify: `PRD.md`

**Interfaces:**
- Consumes: the complete production build.
- Produces: a clean architecture with one guide/world implementation, final audit evidence, and an explicit revert pointer to `checkpoint/pre-sougen-rebuild-2026-08-17`.

- [ ] **Step 1: Prove obsolete code is unreachable before deleting it**

Run:

```bash
rg -n "OperationsRail|MascotExperience|MascotPoster|SourcedMascotScene|robot-rig|CaptainRipley|mascot-poster" src e2e scripts
```

Expected: matches occur only in obsolete modules/tests or intentional migration notes. If a live consumer remains, migrate and test it before deletion.

- [ ] **Step 2: Delete obsolete implementations and remove stale exports**

Remove the old robot scene, robot rig/pose tests, rail wrapper, old posters/model, and unused CSS. Preserve the single shared signal bus and reaction semantics; do not leave parallel mascot/world systems.

- [ ] **Step 3: Claude runs the complete automated release suite**

Run in this order and record command, commit, duration, and exact result:

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm check:budgets
pnpm test:e2e
```

Expected: zero failing/fixme release tests, zero type/lint/build errors, all budgets PASS, no console errors, no serious/critical axe violations.

- [ ] **Step 4: Run cross-browser and failure-path acceptance**

Verify Chromium, WebKit, and Firefox at desktop/mobile; keyboard only; coarse pointer; reduced motion/transparency; forced colors; Save-Data; JS disabled; storage denied; WebGL denied/context lost; tab hidden/reopened; and 200% zoom. Verify every project is reachable and every CTA/case link works without the canvas.

- [ ] **Step 5: Run final Apple and Taste audits from fresh captures**

Claude prepares the four core captures, normal/slow recordings, failure captures, and measurements. Codex scores Apple ≥34/40 and Taste ≥22/25 with no dimension below 4. Fix, recapture, and rescore any failure; do not average away a weak dimension.

- [ ] **Step 6: Validate analytics separation in a real session**

Exercise scroll, flags, guide reactions, board drag, funnel milestones, case preview, full case read, resume, and contact. Confirm the session funnel events remain only in `garvit-journey:v1`; PostHog receives pageviews/autocapture and only the four approved custom events; no scene/guide/funnel-stage custom event appears.

- [ ] **Step 7: Update architecture and authority status**

Document the one-canvas lifecycle, world director, anchor API, selected model/license path, fallback policy, two-stream analytics boundary, mobile board navigation, budgets, and obsolete-module removal. Mark implemented clauses complete without changing approved copy.

- [ ] **Step 8: Garvit live visual acceptance**

Serve the production build and have Garvit test the live R3F scene, guide quality, 10-second founder read, mobile discovery, and case openings. A screenshare-worthy visual reaction is the acceptance criterion; automated correctness alone does not pass.

- [ ] **Step 9: Commit the release candidate**

```bash
git add -A
git commit -m "feat: complete immersive portfolio rebuild"
```

- [ ] **Step 10: Record the release handoff**

In `gate-f-rc.md`, include final commit, all command results, Apple/Taste scorecards, unresolved non-blocking observations, and rollback command guidance using tag `checkpoint/pre-sougen-rebuild-2026-08-17`. Do not deploy unless Garvit separately authorizes deployment.

## Gate Summary

| Gate | Stop condition | Prepared by | Judged by |
|---|---|---|---|
| A — Model | Six views, verified license/rights, usable rig, within asset/draw limits | Claude | Codex |
| B — Static Scene 1 | Four core captures, two-line desktop hero, first-screen mobile CTAs, real-work edge, Taste pass | Claude | Codex |
| C — Interactive Scene 1 | One canvas, responsive guide, interruption/fallback parity, Apple ≥34/40, Taste ≥22/25 | Claude | Codex |
| D1 — Homepage | Correct order, dock semantics, no-JS/a11y, public composition | Claude | Codex |
| D2 — Board/mobile | Physics unchanged, all work explicit at 320/390/430, WebKit touch | Claude | Codex |
| E — Cases | Four truthful artifact-led openings, navigation, desktop/mobile captures | Claude | Codex |
| D3 — Integrated craft | Full viewport/input/fallback matrix, budgets, Apple/Taste pass | Claude | Codex |
| F — RC | Full suite, three browsers, analytics separation, Garvit visual acceptance | Claude | Codex + Garvit |

## Execution Discipline

1. Use an isolated worktree at execution time via `superpowers:using-git-worktrees`; keep the checkpoint tag untouched.
2. Execute one numbered task at a time with `superpowers:subagent-driven-development`.
3. Within each task, Codex freezes interfaces/art direction before assigning Claude mechanical work.
4. Claude migrates affected tests immediately after each interface lock and reports exact failures; it does not batch test migration at the end.
5. Every task receives a requirements review and a code/visual-quality review before its commit.
6. A gate marked STOP blocks all later tasks. Record a failed score and iterate within the current task instead of quietly continuing.
7. Before any completion claim, invoke `superpowers:verification-before-completion` and cite fresh command output.
8. Before the RC commit, invoke `superpowers:requesting-code-review` for Claude's final adversarial review and resolve each finding with `superpowers:receiving-code-review`.
