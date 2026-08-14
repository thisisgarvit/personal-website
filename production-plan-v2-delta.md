# Production Plan V2 — Amendment Delta

## A. Replace GLB Mascot with a Procedural R3F Figure

Replace the complete “R3F on-call PM” section with:

- Sol-high authors the figure procedurally using R3F groups and simple
  rounded-box, sphere, cylinder, eye, arm, and pager meshes.

- Geometry, proportions, materials, rigging, and reactions remain
  reviewable as code. No Blender, GLB, Draco, Meshopt, texture atlas, or
  asset-export pipeline enters the project.

- Reuse a maximum of six matte materials, one key light, one soft fill,
  and no post-processing.

- Keep the figure under 24 visible meshes and 18 draw calls.
- Shared look-at state drives torso yaw, head pitch/yaw, and pupil
  targets.

- Reactions remain notice, flag-check, drag-watch, and shipped
  celebration.

- An immediate SVG poster reproduces the same camera, silhouette,
  palette, and pager detail.

- Lazy-load the procedural WebGL scene after first paint, with the
  existing viewport/idle trigger and 1.5-second maximum delay.

- Crossfade only after the first WebGL frame.
- Retain DPR 1.5, offscreen/document-hidden pausing, reduced-motion,
  Save-Data, low-memory, renderer-failure, and explicit runtime kill
  switches.

- Functional outcomes never depend on the figure.

Rationale: the approved stylization does not need sculpted or animated
mesh assets. Procedural construction removes an unnecessary pipeline,
keeps the mascot diffable, and makes proportion and personality revisions
faster.

Apply these consequential replacements:

- “R3F/Three/drei and the GLB” → “R3F/Three/drei and the procedural
  mascot scene.”

- Remove the compressed-GLB budget.
- Add a procedural mascot module budget of ≤25KB gzip excluding the
  shared lazy R3F/Three vendor chunk.

- Retain the lazy vendor-chunk budget of ≤230KB gzip and poster budget of
  ≤35KB.

- Replace CI’s GLB-budget check with checks for mascot module size, mesh/
  draw-call limits, poster size, and absence of model/texture network
  requests.

- Task 8 assignment becomes: “Personally author the procedural figure,
  proportions, material system, look rig, reaction state machine, poster
  handoff, lazy loading, DPR clamp, offscreen pause, and kill switches.”

## B. Elevate the OG Card to a Sol-High Taste Surface

Amend Task 5 so terra handles only:

- Route metadata contracts, canonical URLs, sitemap, and the plumbing
  that points social metadata to the canonical OG image.

- Terra does not design the OG composition.

Add Task 8A:

Task 8A — OG/social founder card

- Owner: sol-high
- Effort: M, 6–8 hours
- Depends on: approved DESIGN.md, Task 4 shell, and stable metadata/
  content from Task 5.

- Assignment: Personally author app/opengraph-image.tsx as the off-site
  founder-screenshot test.

- Composition: 1200×630 product surface with dense garvit.app v2.4.1
  chrome, build status, Delhi/IST, one candid changelog line, “Garvit
  Sukhija — Product Manager who builds,” and a compact sprint-board
  fragment containing recognisable real work.

- Constraints: use the approved solid semantic palette, Archivo/Plex
  pairing, rules, radii, and product hierarchy. No mesh gradient, glass
  decoration, floating mascot/blob, generic centred social-card layout,
  unapproved metrics, or provisional hero copy.

- Implementation: local fonts and assets only; deterministic output; no
  runtime fetches.

- Review gate: Claude judges it at 1200×630, 600×315, and 300×158.
  Garvit’s name, PM positioning, product chrome, and at least one real
  project must remain legible at the smallest preview.

- Automated gate: OG route returns a valid image with the exact
  dimensions, local font loading succeeds, and a visual snapshot detects
  unintended template drift.

Add OG approval to the release gate; metadata plumbing passing is
insufficient without Claude’s visual approval.

## C. Make Hero Tracking an Optically Validated Starting Value

Replace the locked hero tracking entry with:

- Starting value: -.065em at the largest Archivo display size.
- This is not final until rendered optical review.
- Validate the actual lowercase-heavy hero copy with the production
  Archivo file at viewport widths 320, 390, 768, 1024, 1440, and 1600px,
  in both themes.

- Inspect counter closure, letter collisions, word-shape legibility, rag,
  line wraps, and the interaction between .88 leading and descenders.

- Adjust within -.045em to -.065em; do not exceed either end without a
  documented reason and a new Claude review.

- Record the final large-, medium-, and small-display tracking values in
  DESIGN.md after this pass.

- Mobile begins at -.045em, but it is subject to the same rendered
  validation.

The concept defense remains: tight display typography gives the hero
release-surface authority, but optical legibility outranks numeric
consistency.

## D. Clarify Keyboard Ticket Movement

Replace the keyboard row in the board matrix with:

- Alt+Left/Right relocates the ticket immediately with no spatial
  movement animation.

- DOM focus travels with the ticket.
- The destination column receives a 160ms non-spatial outline/background
  acknowledgement.

- The polite live region announces the ticket title and new column.
- Moving into Shipped preserves the functional payoff by opening the
  preview, but does not run pointer-style ticket momentum or confetti.

- Reduced-motion behavior is identical except the acknowledgement may use
  a simple color change without opacity interpolation.

Add this defense to DESIGN.md:

> Keyboard movement is the board’s efficiency path. Immediate relocation
> avoids delaying a command, while retained focus, a brief destination
> highlight, and a live announcement provide spatial comprehension
> without simulating pointer physics.

Update tests to verify immediate relocation, retained focus, the
destination acknowledgement, the live announcement, and absence of ticket
transforms after a keyboard move.

## E. Sequencing and Effort Shape

Effort bands:

- S: 2–5 hours
- M: 6–12 hours
- L: 13–24 hours

 Task                   Owner                 Effort    Dependency
━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━
 1. DESIGN.md           sol-high             M, 6–8h    Plan V2 approval
─────────────────────  ─────────────────  ───────────  ──────────────────
 2. Production PRD      sol-high           S/M, 4–6h    Task 1 + Claude
                                                        design review
─────────────────────  ─────────────────  ───────────  ──────────────────
 3. Repository          terra                M, 5–7h    Task 2 + Claude
 foundation                                             PRD review
─────────────────────  ─────────────────  ───────────  ──────────────────
 4. Tokens and          terra               M/L, 10–    Task 3
 structural shell                                14h
─────────────────────  ─────────────────  ───────────  ──────────────────
 5. Content and         terra              L, 16–24h    Task 4
 route port
─────────────────────  ─────────────────  ───────────  ──────────────────
 6. Feature-flag        sol-high            M, 8–12h    Task 4
 system
─────────────────────  ─────────────────  ───────────  ──────────────────
 7. Sprint-board        sol-high           L, 16–24h    Tasks 4 and 6
 physics
─────────────────────  ─────────────────  ───────────  ──────────────────
 8. Procedural R3F      sol-high           L, 12–18h    Tasks 4, 6, and
 mascot                                                 board signal
                                                        contract from
                                                        Task 7
─────────────────────  ─────────────────  ───────────  ──────────────────
 8A. OG/social card     sol-high             M, 6–8h    Tasks 4 and 5
─────────────────────  ─────────────────  ───────────  ──────────────────
 9. Mechanical QA/      terra               M, 8–12h    Tasks 5–8A
 deploy wiring
─────────────────────  ─────────────────  ───────────  ──────────────────
 10. Integration/       sol-high           L, 10–16h    Task 9
 craft pass
─────────────────────  ─────────────────  ───────────  ──────────────────
 11. Content QA         Claude/Haiku         S, 4–6h    Begins from Task
 mirror                                                 5 output; must
                                                        finish before
                                                        Task 10 closes
─────────────────────  ─────────────────  ───────────  ──────────────────
 12. Release            terra + sol-         S, 3–5h    Tasks 10 and 11
                        high                            + Claude RC
                                                        approval

Dependency chain:

Plan approval
  → DESIGN.md
  → Claude design review
  → PRD
  → Claude PRD review
  → foundation
  → structural shell
      ├─ terra: content/routes → Haiku content QA
      └─ sol-high: flags → board physics → procedural mascot
  → sol-high OG card after content metadata stabilises
  → mechanical QA/deploy wiring
  → integration and craft
  → Claude/Garvit release-candidate review
  → production release

Parallelism:

- After Task 4, terra can port content while sol-high builds the critical
  interaction lane.

- Tasks 6, 7, and 8 are intentionally serial because board events depend
  on flag/kill-switch state and mascot reactions depend on the final
  board signal contract.

- Haiku content QA begins route-by-route as Task 5 outputs stabilise.
- Task 9’s test scaffolding may begin earlier in isolated files, but its
  final gate waits for Tasks 5–8A.

- OG concept work may begin after Task 4; production implementation waits
  for Task 5’s stable metadata and content labels.

- No parallel work may touch the same module or bypass a sol-high diff
  review.

Estimated active effort is roughly 108–160 person-hours. With terra/
content work parallel to the serial sol-high interaction lane, expect
approximately 14–18 working days of build activity, or roughly three to
four calendar weeks when Claude/Garvit review cycles are included.
Content approval, domain access, or replacement assets pause the affected
gate rather than silently expanding scope.
