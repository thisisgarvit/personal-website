# Gate C — persistent immersive world

**Status:** AWAITING CODEX JUDGMENT  
**Route:** `/dev/world`  
**Mechanical verification:** PASS

## Mechanical acceptance

| Requirement | Evidence | Result |
| --- | --- | --- |
| One persistent world canvas | The same marked canvas survives hero → board → journey; canvas count stays one. | PASS |
| Continuous scroll presentation | Same-scene 140px scroll changes both viewport progress and presented XYZ position. Motion's lazy `scroll()` observer owns measurement; there is no direct application `window` scroll listener. | PASS |
| Tuned motion and interruption | Closed-form springs retain position/velocity; E2E interrupts board → journey at 90ms and reverses at 45ms, proving re-entry starts closer to the interrupted presentation than the settled board target. | PASS |
| Reaction arbitration | Drag owns the rig over incident; release reveals pager check; resolution supersedes lower priorities; ship celebration runs after settlement. | PASS |
| Pause behavior | Hidden document and empty anchor union freeze the measured frame counter; visibility/layout restoration resumes it. | PASS |
| Pointer agency | Stage, wrapper, and native canvas are `pointer-events: none`; underlying CTAs and fixtures remain operable. | PASS |
| Capability fallbacks | Reduced motion, Save-Data, performance kill, and renderer failure materialize a camera-matched poster; policy fallbacks make no GLB request and mount no scene. | PASS |
| Theme parity | Live light/dark captures and light → dark → light fallback CSS-background assertions pass. | PASS |
| Mobile fallback crop | Real 390×844 capture plus computed `68% center` assertion pass. | PASS |
| Renderer ceiling | Actual `gl.info.render.calls` is 21 including shadow/contact passes; limit is 30. | PASS |
| Asset ceilings | GLB 403.7KB; posters 14.9KB and 12.4KB; scene module 4.1KB gzip. | PASS |
| Initial-load ceiling | Homepage initial JS 161.2KB gzip; limit 170KB. R3F/Three stays lazy. | PASS |
| Accessibility smoke | Axe serious/critical 0; console errors 0; overflow 0 at 320/390/430/768/1024/1440/1600; keyboard reaches both primary CTAs at 200% Chromium page scale. | PASS |
| Alternate media | Forced colors and CDP-emulated reduced transparency preserve core content and width. | PASS |

Full command output, method limits, hashes, and every capture are recorded in
[Gate C mechanical evidence](./gate-c/evidence.md).

## Judge capture set

- [Desktop light](./gate-c/desktop-light-1440x900.png)
- [Desktop dark](./gate-c/desktop-dark-1440x900.png)
- [Mobile light](./gate-c/mobile-light-390x844.png)
- [Mobile dark](./gate-c/mobile-dark-390x844.png)
- [Reduced-motion desktop](./gate-c/reduced-motion-light-1440x900.png)
- [Reduced-motion mobile](./gate-c/reduced-motion-mobile-light-390x844.png)
- [Renderer failure](./gate-c/renderer-failure-light-1440x900.png)
- [Drag watch](./gate-c/reaction-drag-watch.png)
- [Pager check](./gate-c/reaction-pager-check.png)
- [Ship celebration](./gate-c/reaction-ship-celebration.png)

## Apple interaction audit — judge only

The implementing lane deliberately leaves these scores blank.

| Principle | Score | Judge evidence |
| --- | ---: | --- |
| Purpose | — | — |
| Agency | — | — |
| Responsibility | — | — |
| Familiarity | — | — |
| Flexibility | — | — |
| Simplicity | — | — |
| Craft | — | — |
| Delight | — | — |

**Apple total:** — / 40  
**Blocking rule:** no dimension below 4.

## Taste audit — judge only

The implementing lane deliberately leaves these scores blank.

| Dimension | Score | Judge evidence |
| --- | ---: | --- |
| Composition and first-glance richness | — | — |
| Hierarchy, density, and CTA comprehension | — | — |
| Authorship and anti-template character | — | — |
| Asset, material, palette, and pose judgment | — | — |
| Responsive, theme, accessibility, and performance craft | — | — |

**Taste total:** — / 25  
**Blocking rule:** no dimension below 4.

## Release condition

Mechanical acceptance is complete. The public homepage remains blocked until
the independent judge records both audit tables and explicitly writes
`Gate C PASS`. No public migration is authorized by this document.

