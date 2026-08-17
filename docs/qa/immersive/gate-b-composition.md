# Gate B: isolated Scene 1 composition

**Decision:** PASS  
**Route:** `/dev/world`  
**Date:** 2026-08-17  
**Design read:** Product-manager portfolio for founders, hiring teams, and
product leads; playful product-world language with immediate commercial
clarity. `DESIGN_VARIANCE: 8`, `MOTION_INTENSITY: 8` for the finished world
(Gate B deliberately proves the static GA state), `VISUAL_DENSITY: 6` in
chrome tapering to `4` in content.

## Evidence

- [`final-light-1440.png`](gate-b/final-light-1440.png)
- [`final-dark-1440.png`](gate-b/final-dark-1440.png)
- [`final-light-390.png`](gate-b/final-light-390.png)
- [`final-dark-390.png`](gate-b/final-dark-390.png)

The first invalid mobile CLI captures used a browser window with a clamped
layout viewport and were replaced by true Playwright `390×844` emulation. The
files named `final-*` are the judging set.

## Acceptance measurements

| Check | 1440×900 | 390×844 | Result |
| --- | ---: | ---: | --- |
| Hero headline lines | 2 | 4 | PASS |
| Primary CTA height | 56px | 56px | PASS |
| Secondary CTA height | 56px | 56px | PASS |
| Both CTAs inside first viewport | yes | yes, second ends at ~758px | PASS |
| Real ticket visible at boundary | ~115px | ~55px | PASS |
| Persona choices visible | 4 of 4 | 4 of 4 | PASS |
| Persona Skip visible | yes | yes | PASS |
| Guide crop | head and torso, ~43% field | upper/right head and torso cue | PASS |

The founder ten-second read is: name/product chrome, concrete product promise,
resume/contact actions, authored guide, optional onboarding satire, feature
flags, and real work entering the frame. There is no duplicate hero ticket and
no dashboard-card stack.

## Optical decision

- Desktop ≥1264px: `clamp(4.25rem, 5.8vw, 5.3rem) / .9`, max `58rem`,
  `-.055em`.
- Intermediate 843-1263px: `-.05em` retained.
- Mobile ≤842px: `clamp(2.5rem, 11.3vw, 2.85rem) / .92`, max `22rem`,
  `-.045em`.

At 1440px the actual max-size render remains legible: the `rn` in `turn` is
distinct, inter-word spaces remain open, line color is even, and the sentence
holds two lines. The mobile setting keeps the same word shapes without forcing
either CTA below the viewport.

## Taste audit

| Dimension | Score | Evidence |
| --- | ---: | --- |
| Composition and first-glance richness | 5/5 | Asymmetric headline/guide field, optional tray, dock, and real ticket create one authored product scene. |
| Hierarchy, density, and CTA comprehension | 5/5 | Headline dominates; lime resume and high-contrast contact actions are unmistakable; dense chrome yields to a breathable field. |
| Authorship and anti-template character | 5/5 | Product chrome, candid experiment copy, persona satire, release figure, flags, and ticket are specific to Garvit's product premise. |
| Asset, material, and palette judgment | 4/5 | The Muko silhouette and semantic release/lime palette hold in both themes; final fitted materials belong to Gate C. |
| Responsive, theme, accessibility, and performance craft | 4/5 | Both themes and true 390px layout pass; semantic controls and 44-56px targets hold. Full axe/performance proof belongs to the interactive gate. |

**Taste total: 23/25. No dimension below 4. PASS.**

Pre-flight exceptions are deliberate authority decisions, not defaults: the
product version/changelog syntax and `DELHI / IST` chrome are functional parts
of the approved `garvit.app` product metaphor; the modeless persona tray is an
approved satire surface rather than extra marketing copy. There is one real
visual asset, no fake screenshot, no duplicated CTA intent, no decorative
scroll cue, and no generic three-card layout.

## Apple static-applicable audit

| Principle | Score | Evidence |
| --- | ---: | --- |
| Purpose | 5/5 | The promise, two actions, and first work item explain the portfolio without visitor homework. |
| Agency | 5/5 | Persona input is optional and skippable; primary content is never gated. |
| Responsibility | 5/5 | PostHog disclosure precedes selection, fixed choices avoid free text, and Skip emits nothing. |
| Familiarity | 4/5 | Native links, buttons, checkboxes, and product-status conventions make the unusual composition predictable. |
| Flexibility | 4/5 | Desktop/mobile and light/dark compositions preserve hierarchy; full failure-mode coverage belongs to Gate C. |
| Simplicity | 4/5 | The dense product premise remains glanceable, though the optional tray intentionally adds one temporary layer. |
| Craft | 4/5 | Optical type, responsive reflow, material hierarchy, and real-ticket overlap are tuned; final 3D material craft is not yet judged. |
| Delight | 5/5 | The candid experiment/persona humor and oversized field guide create a memorable but credible first screen. |

**Apple static-applicable total: 36/40. No dimension below 4. PASS.**

Direct manipulation, velocity handoff, interruption, scene continuity, and
reduced-motion materialization are intentionally not claimed by this static
gate. They are blocking requirements for Gate C.

## Corrections made during the gate

1. Replaced the too-wide four-column mobile persona row with a two-by-two grid.
2. Pinned the mobile tray with left and right insets so every choice and Skip
   remain visible.
3. Hid only the quiet second experiment sentence at narrow widths; the variant,
   main sentence, and 44px dismiss control remain.
4. Brightened and repositioned the mobile guide treatment so it reads as a
   character rather than a washed-out background.
5. Restored the lead paragraph to the approved `--type-lead` size and retained
   all persona choices at the locked 44px minimum target.
6. Kept the narrow experiment abbreviation inside `/dev/world`; the shared
   public `ExperimentStrip` CSS remains unchanged before Gate C.
7. Replaced hardcoded headline fragments with a line break derived from
   `siteConfig.hero`, and made invalid persona storage restore the authored tray.

## Residual scope

- The temporary poster is composition evidence, not final art. Gate C must fit
  the production asset, author its materials and props, and export camera-matched
  theme posters.
- Gate C must add the pencil-to-digital-to-color evolution, one wave, restrained
  look behavior, board glance, persona pager acknowledgment, scene interruption,
  capability fallbacks, and full Apple/Taste interaction evidence.
