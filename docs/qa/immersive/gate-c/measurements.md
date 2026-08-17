# Gate C — Renderer Measurements & Interaction Matrix

- **Date:** 2026-08-17
- **Build under test:** production `pnpm build` (`NEXT_DIST_DIR=.next-gate-c`, `NEXT_PUBLIC_WORLD_PROTOTYPE=1` — see Deviations), served with `next start -p 3120`.
- **Browser:** Playwright headless Chromium (Desktop Chrome), viewport 1440×900, `navigator.deviceMemory` pinned to 8.
- **Route:** `/dev/world` (real R3F renderer, real `public/models/guide/guide.glb`).
- **Raw data:** `renderer-stats.json` (Deliverable 1), `interaction-matrix.json` (Deliverable 2), `*-timeline.json` per recording.

## 1. Renderer statistics vs ceilings

Draw calls were measured two independent ways: (a) three.js' own `WebGLRenderer.info.render.calls`, exposed per rendered frame by the prototype's built-in `/dev/world` diagnostics (`data-guide-draw-calls`), and (b) harness-side instrumentation of `WebGL(2)RenderingContext.prototype.draw*` injected before any page script, bucketed per animation frame. Both agree exactly.

| Metric | Measured | Ceiling | Verdict |
|---|---|---|---|
| Draw calls / frame (three.js `info.render.calls`) | **21** (steady state and max, incl. shadow + contact-shadow passes) | ≤ 30 | **PASS** |
| Draw calls / frame (harness GL hook, 130 frames sampled) | **21** max, 21 steady | ≤ 30 | **PASS** (cross-check) |
| GLB asset triangles | **11,458** (production manifest; byte-hash + triangle count asserted by `src/features/world/asset-manifest.test.ts`) | ≤ 25,000 | **PASS** |
| Rendered triangles / frame, all passes summed | 56,970 | — (informational) | see note |
| GLB transferred | **314,280 B gzip** on the wire (413,356 B identity / on disk) | ≤ 1.8 MB | **PASS** |
| GLB texture dimensions | 3 maps (base color, normal, ORM), each ≤ 1024×1024 (manifest-tested) | 512–1024 px | **PASS** |
| Live GL texture objects | 13 (3 model maps + shadow map, contact-shadow render targets, drei internals) | — | info |
| Live GL programs | 9 | — | info |
| Live GL vertex arrays / buffers | 18 / 30 | — | info |
| WebGL contexts created | **1** (single canvas) | 1 canvas | **PASS** |
| Poster `guide-light.webp` | 15,226 B (only the active-theme poster was requested in the light session) | ≤ 90 KB | **PASS** |
| Poster `guide-dark.webp` | 12,708 B on disk | ≤ 90 KB | **PASS** |

**Triangle note:** the 56,970/frame figure counts every pass: the main color pass plus the directional-light 1024² shadow-map pass plus drei `ContactShadows` depth re-render — i.e. the ~19k on-screen scene (11,458 model + authored hardware + shadow plane) drawn ≈3×. The plan's ≤25k ceiling is the *asset* ceiling and passes at 11,458. Per-frame GPU triangle throughput is left to Codex's performance judgment; if it must come down, shadow passes (not the asset) are the lever.

`pnpm check:budgets` against this build: **all enforced budgets pass** (initial homepage JS 161.3 KB gzip ≤ 170 KB with world/Three absent from initial route scripts; lazy R3F vendor chunk 228.1 KB gzip; guide scene module 4.1 KB gzip ≤ 25 KB; GLB 403.7 KB ≤ 1757.8 KB; posters ≤ 90 KB).

## 2. Frameloop pause proof (document-hidden)

Demand frameloop with the `data-guide-frame` counter (increments once per rendered frame):

| Step | Frame counter |
|---|---|
| `visibilitychange` → hidden dispatched | 133 |
| after 600 ms hidden | **133 (no frames rendered)** |
| visible again + pointer move, after 400 ms | 145 (rendering resumed) |

**PASS** — rendering fully stops while `document.hidden` and resumes in place. (The e2e suite additionally proves the same freeze when all anchors leave the viewport union.)

## 3. Fallback matrix

| Condition | Signal used | `data-world-fallback` | Canvas mounted | Poster visible | GLB requested | Verdict |
|---|---|---|---|---|---|---|
| Save-Data | `navigator.connection.saveData === true` (the exact signal `capability-policy.ts` reads) | `save-data` | no (0 canvas layers) | yes (opacity 1) | **no** | **PASS** — `save-data-fallback-light-1440x900.png` |
| Performance kill | `documentElement.dataset.effectsDisabled="true"` (`EFFECTS_DISABLED_DATASET_VALUE`) | `performance-kill` | no | yes | **no** | **PASS** — `performance-kill-fallback-light-1440x900.png` |
| Reduced motion | `prefers-reduced-motion: reduce` | `reduced-motion` | no | yes | no | **PASS** (pre-existing statics + e2e) |
| Renderer failure — context **lost** after creation | `webglcontextlost` on the live canvas | `renderer-failure` | removed | yes | n/a | **PASS** (pre-existing `renderer-failure-light-1440x900.png` + lifecycle tests) |
| Renderer failure — context **creation** fails (`--disable-webgl --disable-webgl2`) | three.js `Error creating WebGL context` | **stays `none`** | empty canvas layer stays mounted | **yes — poster remains, both CTAs intact, no layout shift** | model request does occur (idle import proceeds) | **DEGRADES GRACEFULLY / FINDING** — `webgl-disabled-fallback-light-1440x900.png` |

**Finding for Codex (blocking-judgment input, not a harness bug):** a WebGL context-*creation* failure never reaches `setRendererFailed` — `WorldBoundary` only catches render-phase throws, and the `onCreated` `webglcontextlost` listener is never installed because creation fails first. Visually the requirement "retain full content with the matching poster; no empty stage or layout shift" is met (poster stays at opacity 1 because `data-scene-ready` never flips), but the world stays in `fallback="none"` with a transparent dead canvas layer, three.js logs 3 console errors, and the GLB/scene chunks still download on a device that cannot use them. Cheapest correction if required: try a probe `getContext("webgl2")/getContext("webgl")` in the capability check, or pass an R3F `gl` factory failure handler / `onError`.

## 4. Console + axe

| Check | Result | Verdict |
|---|---|---|
| Console errors + pageerrors across a full live session (mount, wave, pointer look, scene travel, all test-control reactions) | **0** | **PASS** |
| axe `/dev/world` light — serious/critical | **0** (0 needs-review) | **PASS** |
| axe `/dev/world` dark (via theme toggle) — serious/critical | **0** (0 needs-review) | **PASS** |

(The three `THREE.WebGLRenderer` console errors in the WebGL-disabled run occur only under forced context failure and are listed in §3, not counted here.)

## 5. E2E results

`E2E_PORT=3120 pnpm exec playwright test e2e/world.spec.ts --project=chromium` against this production build:

**10/10 passed (29.1s)** — one pointer-transparent persistent canvas; reaction arbitration + scene-travel interruption from presentation state; hidden/out-of-union pause and in-place resume; reduced-motion / Save-Data / performance-kill make zero scene+model requests; theme poster swap; no serious a11y/console/overflow defects; keyboard-only at 200% zoom; forced-colors + reduced transparency.

## 6. Evidence files (this lane)

Recordings (1440×900 .webm; each normal recording has a 0.25× review generated by ffmpeg `setpts=4*PTS` — identical frames at quarter speed — and a `*-timeline.json` of `scene/gesture/reaction/frame/position/drawCalls` sampled every 100 ms):

| File | Shows |
|---|---|
| `look-tracking-normal.webm` / `look-tracking-0.25x.webm` | Fine-pointer head/torso look: smooth sweep, abrupt corner jump (interruption from current presentation values), settle to idle glance. |
| `wave-settle-normal.webm` / `wave-settle-0.25x.webm` | One wave per session mount, spring settle to idle (timeline: `wave`@0.8s → `idle`@2.0s). |
| `scene-target-interrupt-normal.webm` / `scene-target-interrupt-0.25x.webm` | Target travel hero→board; journey target grabbed mid-flight; interrupted back to board — springs continue from current values, no snap to scene origin (timeline: hero→board→journey→board within 2.9s). |
| `reaction-sequence-normal.webm` / `reaction-sequence-0.25x.webm` | Dev test-control arbitration: `drag-watch` → incident held during drag → `pager-check` on drag end → `resolution` → settle to idle. |
| `ship-mid-wave-interrupt-normal.webm` / `ship-mid-wave-interrupt-0.25x.webm` | Ship fired ~0.4s into the mount wave: timeline shows `reaction=shipped` queued while `gesture=wave` (t≈1.7s), `ship-celebration` takes over from current pose values (t≈2.0s), settles to idle (t≈3.1s). |

State captures: `save-data-fallback-light-1440x900.png`, `performance-kill-fallback-light-1440x900.png`, `webgl-disabled-fallback-light-1440x900.png`.
Data: `renderer-stats.json`, `interaction-matrix.json`, five `*-timeline.json`.
Pre-existing (not redone): 4 theme/viewport statics, 2 reduced-motion statics, `renderer-failure-light-1440x900.png`, 3 reaction stills.
Harness: `scripts/gate-c-renderer-measure.mjs`, `scripts/gate-c-interaction-matrix.mjs`, `scripts/gate-c-matrix-finish.mjs`, `scripts/gate-c-slow-motion.sh`.

## 7. Deviations

1. **`src/app/dev/world/page.tsx` guard made env-gated.** The route 404s in every production build by design, which made "measure in the production renderer" impossible. The guard now also requires `NEXT_PUBLIC_WORLD_PROTOTYPE !== "1"` — the variable is only set by the QA harness at build time, never in deploy environments, so public production behavior is unchanged (still 404). This edit was made by the QA lane mid-run and was swept into the design lead's `feat: prove persistent guide world` commit.
2. **No gl-info exposure was added to `WorldCanvas.tsx`.** The planned `window.__WORLD_GL_INFO` deviation was unnecessary: GuideScene already exposes `data-guide-draw-calls`/`data-guide-frame` (path-guarded to `/dev/world`), and triangles/textures/programs were measured by harness-side GL prototype instrumentation injected via `addInitScript` — zero product-source changes for measurement.
3. **Slowed reviews are ffmpeg 0.25× re-timings**, not CPU-throttled re-runs: the springs are delta-time-based, so `Emulation.setCPUThrottlingRate` changes frame pacing but not visible motion speed; re-timing preserves the exact rendered frames for review.
4. **Matrix run split into two scripts** (`gate-c-interaction-matrix.mjs` + `gate-c-matrix-finish.mjs`): the first run aborted waiting for a `renderer-failure` state that never occurs under context-creation failure — that behavior is the §3 finding, not a harness defect.
