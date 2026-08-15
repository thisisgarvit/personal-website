# Concept spec — "This site is my product" (garvit.app)

Chosen by Garvit from three concepts, 2026-07-17. Supersedes both comparison mocks and all prior tile directions. Process change agreed with client: **one polished vertical slice**, judged on magic, not a cheap breadth mock.

## The concept

The portfolio doesn't *describe* Garvit's product management — it **is a product he is visibly PM-ing, and the visitor is a user inside it**. Every PM ritual (releases, A/B tests, feature flags, sprint boards, changelogs, instrumentation) becomes a real UI element the visitor can play with for instant delight. The site's own existence demonstrates his craft: versioned, flagged, instrumented, shipped.

Why it fits the taste spec: the interaction IS the website (the lesson from marco.fyi / gkoberger / chusmargallo / getcoleman votes — his LOVEs were playable objects, not brochures). It's PM-native rather than designer-cosplay. Nobody else has this site.

## Vertical slice scope (build ALL of this, at full production polish)

1. **Product chrome, not page chrome.** Top bar reads `garvit.app v2.4.1` with a build-status dot and a changelog ticker (real dates, candor register: "v2.4.1 — fixed: hero said 'passionate'. rolled back."). The version number is clickable → tiny release-notes popover.
2. **A/B banner.** Dismissible strip: "You're in variant B of this hero. Variant A converts worse." Dismissing it triggers a small toast: "event logged: banner_dismissed. noted."
3. **Feature flags panel.** A visible, openable panel of REAL working toggles:
   - `dark_mode` — actually switches theme, full dual-theme craft
   - `confetti_on_scroll` — actually fires tasteful confetti while scrolling
   - `comic_sans` — permanently disabled, tooltip: "disabled in prod for a reason"
   - one more of codex's invention that actually does something delightful
4. **Hero.** Positioning line + intro (real copy from content-source; Delhi). Primary CTAs big and unmissable: **Download resume** (release-flavored microcopy allowed, but the word "resume" must be instantly legible) and **Contact**.
5. **Sprint board = the portfolio.** Columns: Shipped / In Progress / Backlog. Case studies are draggable tickets with PM texture (priority chips, tongue-in-cheek story points):
   - Stay Portal — sits in Shipped
   - AI Browser — Maxie and Agentic Calendar — In Progress (concepts)
   - Dynamic Island teardown — a "research" ticket
   - Dragging any ticket anywhere gives physical, springy feedback; clicking (or dropping onto Shipped) opens a rich case-study preview window with real content and a "read full case" affordance. Board state is a toy — no homework, no wrong moves, everything resets gracefully.
6. **The mascot.** The "on-call PM" figure (canvas placeholder acceptable in the slice, but POLISHED — smooth spring motion, personality; production upgrades to react-three-fiber). It reacts to what the visitor does: follows cursor, glances at flipped flags, celebrates a ticket reaching Shipped. No event-log text stream (Garvit cut that); the reactions carry the joke silently.

## Non-negotiables carried forward

- **Zero visitor homework** — instant payoff only; the visitor is never evaluated.
- Anti-template guardrails from DESIGN-BRIEF.md §5 still apply. Codex owns the palette/type and MAY depart from all previous palettes — but every choice needs a stated reason rooted in this concept. Licensed self-hostable fonts only.
- Portfolio-not-resume IA. Delhi. Candor microcopy register.
- Accessibility: keyboard path for every interaction (tickets movable via keyboard, flags focusable), reduced-motion = no confetti/springs, screen-reader sensible.
- Self-contained deliverable, no CDN.

## Polish bar (the reversal of the mock round)

Take the time. Motion tuned (springs, easing curves, drag physics), states polished (hover/active/drop), art direction cohesive. The acceptance test: **a founder screenshares this to their cofounder within 10 seconds of landing.** A static screenshot of the top must already look like a product, not a webpage.

## Deliverables

1. `slice-product.html` — the interactive vertical slice, self-contained.
2. `slice-notes.md` — brief: what production upgrades (r3f mascot, routing, persistence), palette/type rationale, and any concept extensions invented while building (encouraged — surprise us, within zero-homework).
