# Elevation round — client rejected the RC's visual level (2026-08-16)

Garvit, verbatim: "it is not even different from what the product-slice was built... the apple design system is also not seems to be used left alone the impeccable skill... The mascot looks third grade... looks like 2000 not 2026. What is the on-call PM even doing?"

Root cause (Claude's, owned): DESIGN.md froze the July slice's aesthetic as the ceiling. The Apple/impeccable skills got spent on invisible mechanics, not visible surfaces. The from-scratch mascot undershot badly.

## New strategy directive from Garvit (supersedes prior purity rules)

**Reuse over scratch.** "If there are things which we can immediately pick up and use why waste tokens building." Sources are now fair game — curation is the anti-slop mechanism, not origin:

- **Mascot: DO NOT hand-model from primitives again.** Source a genuinely good, modern, free/CC0-or-properly-licensed rigged 3D character (candidates: Quaternius packs, Kenney characters, Mixamo-rigged models, polyhaven, any high-quality free GLB with a friendly stylized-2026 look — soft forms, good materials, not low-poly-2015, not corporate-memphis). Re-skin it to our palette (release blue body / coral headset+pager props can be added as simple meshes ON the sourced base). Rig look-at + the four reactions on top. Budget: the vendor chunk limit stays; a compressed GLB is now ALLOWED (the procedural-only rule is REVOKED — it produced the third-grade result).
- **Motion/luxury surface patterns: motionsites.ai and 21st.dev are permitted sources** — lift what's good (hero treatments, material/depth recipes, hover physics, section transitions), re-tokenize to DESIGN.md palette/type. Slop test = does the RESULT look templated, not where the ingredient came from.
- **taste-skill vendored in skills/ may inform the elevation aesthetic.**

## The elevation scope (visible surfaces only — mechanics/content/a11y/tests stay)

1. **Mascot** — sourced character, dimensional lighting (key + fill + rim), soft shadows, and LEGIBLE behavior: visibly tracks cursor, leans in on ticket grab, checks pager on flag flip, unmissable ship celebration. Its job must explain itself in 10 seconds of mouse movement.
2. **Materials & depth (apple-design §12 for real)**: chrome/overlay translucency with blur hierarchy, layered elevation, materialize-don't-fade transitions, scroll-edge effects.
3. **Surface finish**: hero + panels get 2026 finishing — lighting/texture nuance, optical type corrections, physical press states.
4. **Self-check bar**: Garvit's two questions — "does it look 2026?" and "is the mascot's purpose obvious?" — plus impeccable critique run against the RENDERED page.

DESIGN.md remains the token source (palette/type/spacing); this round may EXTEND it (new material/elevation/lighting tokens) via amendment noted in the file. Zero-homework, PII, budgets (with GLB now inside the vendor allowance), and a11y parity all still bind.

Token discipline: prefer downloading/adapting over generating; keep reports terse.

## Addendum (2026-08-16): the mascot gets a JOB — the incident loop

Garvit asked what the on-call PM is even for; answer approved by Claude as lead: **on-call needs incidents, and the visitor can cause them.**

1. **Pager = the communication channel** (silent otherwise; no event-log stream — still banned). Dragging a Shipped ticket OUT of Shipped = incident: pager buzzes/flashes coral, mascot snaps to alert pose, chrome build-dot flickers coral, ticker prints one candid line ("incident: shipped work demoted. investigating."). Dragging back to Shipped = resolution: pager calms, lime settle, mascot visibly relieved. Instant, reversible, no scoring — zero-homework preserved.
2. **Idle guide behavior**: one wave on first load; after ~10s idle, a gesture toward the board. The PM is demoing its product, not decorating.
3. Existing four reactions stay, amplified to legibility per the main brief.
4. Build-state machine: build dot + BUILD HEALTHY/INCIDENT status become live state derived from the board (shipped ticket present in Shipped = healthy). Copy stays in the candor register.

## Addendum 2 (2026-08-16, from Garvit — SUPERSEDES the on-call/incident identity)

The mascot's identity is the **SESSION JOURNEY TRACKER**, not on-call incident responder. This is Garvit's original instrumentation gag (the Amplitude-obsessed PM) in its full form:

1. **Mascot = the analyst watching THIS visitor's session.** It tracks the current session's journey client-side and reacts to journey milestones (arrived, reached board, first interaction, opened a case, converted on resume/contact). Label changes from ON CALL to a session-analyst framing (e.g. `TRACKING YOUR SESSION` in the candor register — codex's call on exact copy).
2. **New homepage section: "Your session, instrumented."** A live funnel/journey map of the CURRENT visitor's own session, computed entirely in-memory/session-local: stages like Landed → Scrolled → Played (flag/drag/popover) → Read work → Converted (resume/contact). Show playful real metrics (time on page, interactions count, furthest stage, "drop-off point" = furthest stage not yet reached) + 1-2 candid auto-insights ("You toggled dark mode twice. Decisive."). It updates live as the visitor acts — THAT's the magic moment.
3. **Privacy constraints (bind hard):** all computation session-local in the browser; nothing leaves the page; no server, no PostHog, no third-party script in v1 (PRD §12 + no-CDN rule stand). The section itself should candidly disclose this: "computed in your browser. I never see it." — that line IS the trust joke landing.
4. The incident loop from Addendum 1 may survive ONLY if it folds naturally under the journey-tracker identity (a journey event like "shipped work demoted — churn risk"); drop the on-call naming.
5. Pager prop stays (it's charming); it can buzz on journey milestones.
6. Zero-homework: the funnel is a display the visitor discovers, never a score. No "you failed to convert" shaming — candor, not judgment.

PostHog decision (Claude, lead): declined for v1 — real third-party tracking would contradict the site's own privacy stance, break the no-CDN/self-contained rule, and turn the surveillance JOKE into actual surveillance. The typed analytics adapter (PRD §12) remains the hook if Garvit wants real PostHog later behind consent.
