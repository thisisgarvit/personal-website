# Gate C mechanical evidence

**Route:** `/dev/world`  
**Capture date:** 2026-08-17  
**Browser:** on-device Playwright Chromium  
**Renderer calls:** 21 measured, 30 maximum

## Browser contract

The expanded world suite passed 10/10 in 15.6 seconds:

```text
E2E_PORT=3100 pnpm exec playwright test e2e/world.spec.ts --project=chromium
10 passed (15.6s)
```

The suite proves:

- one fixed, pointer-transparent canvas persists across hero, board, and journey;
- hero position and viewport progress change continuously during a same-scene scroll;
- scene travel can be interrupted and re-entered from the current presented position;
- drag, incident, resolution, and ship signals follow the reaction priority contract;
- `document.hidden` and an empty anchor union stop the frame counter, then resume it;
- reduced motion, Save-Data, and the performance kill switch mount no scene, request no GLB, preserve both primary CTAs, and preserve the board entry;
- explicit light → dark → light changes swap the CSS fallback background without an image hydration race;
- the narrow fallback keeps the authored `68% center` crop;
- serious/critical axe violations, console errors, and horizontal overflow are all zero;
- 320, 390, 430, 768, 1024, 1440, and 1600px viewport widths pass the overflow smoke;
- keyboard-only tab order reaches Download resume and Contact Garvit under Chromium's 200% page scale;
- forced-colors and `prefers-reduced-transparency: reduce` emulation preserve the CTAs, board entry, and overflow contract.

`data-guide-*` measurements exist only at `/dev/world`; the public homepage does
not receive per-frame DOM writes. Renderer calls are read from
`gl.info.render.calls`, including the authored shadow/contact passes, rather
than estimated from the asset manifest.

## Static captures

### Judging matrix

- [Desktop light, 1440×900](./desktop-light-1440x900.png)
- [Desktop dark, 1440×900](./desktop-dark-1440x900.png)
- [Mobile light, 390×844](./mobile-light-390x844.png)
- [Mobile dark, 390×844](./mobile-dark-390x844.png)

### Fallbacks

- [Reduced motion, light, 1440×900](./reduced-motion-light-1440x900.png)
- [Reduced motion, light, 390×844](./reduced-motion-mobile-light-390x844.png)
- [Renderer failure, light, 1440×900](./renderer-failure-light-1440x900.png)

The renderer-failure capture uses a real `webglcontextlost` event after scene
readiness, then records the camera-matched poster. The reduced-motion captures
never mount the canvas.

### Reaction legibility

- [Direct-manipulation watch](./reaction-drag-watch.png)
- [Pager check](./reaction-pager-check.png)
- [Ship celebration](./reaction-ship-celebration.png)

The automated arbitration test is the motion evidence: it checks both the
normal reaction path and a deliberately interrupted 700ms → 90ms → 45ms scene
travel, using presented positions rather than target-state labels. The stills
are complementary pose evidence, not a substitute for that test.

## Build and unit gates

```text
pnpm lint
PASS

pnpm typecheck
PASS

pnpm test
42 files passed; 155 tests passed

NEXT_DIST_DIR=.next-gate-c pnpm build
PASS; 13/13 static pages generated
```

Focused world coverage also passed 50/50:

```text
pnpm test src/features/world src/app/dev/world
11 files passed; 50 tests passed
```

## Production budgets

Command:

```text
NEXT_DIST_DIR=.next-gate-c pnpm check:budgets
```

| Surface | Measured | Limit | Result |
| --- | ---: | ---: | --- |
| Homepage initial JS | 161.2KB gzip | 170.0KB | PASS |
| Lazy R3F/Three vendor | 227.2KB gzip | 234.6KB | PASS |
| Guide scene module | 4.1KB gzip | 25.0KB | PASS |
| Light poster | 14.9KB | 90.0KB | PASS |
| Dark poster | 12.4KB | 90.0KB | PASS |
| Production GLB | 403.7KB | 1,757.8KB | PASS |
| Four subset fonts | 63.6KB | 100.0KB regression ceiling | PASS |

The Motion scroll bridge changed initial JS from the immediately prior build
by approximately +0.1KB gzip; the lazy Three total remained 227.2KB.

## Frozen asset identity

| Asset | Bytes | SHA-256 |
| --- | ---: | --- |
| `guide-light.webp` | 15,226 | `97818891aefe3de969c72c7f94a36bcf745c4138883a06e2e2822a4bf9bb86d0` |
| `guide-dark.webp` | 12,708 | `4ec48d869610a028790b205929c96e8e0bc27dfbc213a31905e567c1d36b8dc3` |
| `guide.glb` | 413,356 | `30547b8f9fd5fa8c51484374a90394f9b8e481df28498df84d3a401827f5ee89` |

## Method boundaries

- Kane was not used because its available execution path would send the local
  site to a third-party LambdaTest session. All browser evidence above was
  captured locally on the device.
- The 200% result is Chromium compositor page-scale plus keyboard reachability,
  not a manual operating-system magnifier or screen-reader session.
- Reduced transparency is Chromium DevTools media-feature emulation; Playwright
  has no first-class option for it. Forced colors uses the same Chromium media
  engine. These are operability checks, not visual-quality scores.
- Apple and Taste scores are intentionally absent here. They belong to the
  independent Gate C judge.

