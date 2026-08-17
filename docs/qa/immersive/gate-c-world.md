# Gate C — persistent immersive world

**Status:** GATE C PASS  
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

## Apple interaction audit — Codex judgment

| Principle | Score | Judge evidence |
| --- | ---: | --- |
| Purpose | 5 | The product-world metaphor makes the promise visible: version chrome, experiment satire, a real work entry, and the guide all explain how Garvit thinks without a visitor task. |
| Agency | 5 | Skip, replay, two primary CTAs, theme control, persona choices, work entry, and keyboard reach remain available while the world stays pointer-transparent. |
| Responsibility | 5 | Reduced motion, Save-Data, performance kill, document visibility, renderer failure, and lazy loading all reduce cost without withholding the portfolio. |
| Familiarity | 4 | Buttons, links, phase labels, and product chrome remain conventional; the persistent guide is novel but never owns navigation or input. |
| Flexibility | 4 | Light/dark, 320–1600px widths, 200% page scale, keyboard, forced colors, and reduced transparency preserve the core route. |
| Simplicity | 4 | The first screen is intentionally dense, but its reading order stays persona satire → evolution state → promise → proof copy → two CTAs. |
| Craft | 5 | One canvas, 21 measured calls, velocity-preserving springs, current-theme poster parity, deliberate mobile crop, and zero console/serious axe failures show production discipline. |
| Delight | 5 | The guide has distinct wave, watch, pager, resolution, milestone, and ship behaviors that are tied to real product actions rather than decorative loops. |

**Apple total:** 37 / 40  
**Blocking rule:** no dimension below 4.

## Taste audit — Codex judgment

| Dimension | Score | Judge evidence |
| --- | ---: | --- |
| Composition and first-glance richness | 4 | The asymmetric guide overlap, oversized two-tone headline, glass persona surface, product chrome, and board peek create an immediately authored scene. Mobile deliberately uses the guide as a depth layer rather than shrinking it into an illustration card. |
| Hierarchy, density, and CTA comprehension | 4 | Headline and lime/dark CTAs dominate; chrome stays dense while the content plane breathes. Mobile persona labels were raised to `0.72rem` while retaining 44px targets. |
| Authorship and anti-template character | 5 | The MVP/BETA/GA evolution, candid role-collection joke, live feature dock, and action-reactive guide form a portfolio-specific product premise rather than a landing-page component stack. |
| Asset, material, palette, and pose judgment | 5 | The sourced Muko rig is materially re-authored with graphite visor, release-blue comms, coral pager, lime state, coherent light/dark treatment, and clearly different reaction silhouettes. |
| Responsive, theme, accessibility, and performance craft | 5 | Seven widths, 200% scale, keyboard, forced colors, reduced transparency, capability fallbacks, 21/30 calls, and all asset/bundle ceilings pass. The raw window scroll listener was removed in favor of the lazy Motion bridge. |

**Taste total:** 23 / 25  
**Blocking rule:** no dimension below 4.

## Release condition

Mechanical acceptance and both independent audits pass. **Gate C PASS.** The
public migration may begin under the approved hard-stop sequence; production
surfaces remain subject to their own content and regression gates.
