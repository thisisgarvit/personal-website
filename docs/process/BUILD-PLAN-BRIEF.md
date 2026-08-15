# Production build — planning brief (codex, PLAN MODE)

Garvit is back (2026-08-15) and approved the slice direction. New workflow he has mandated, in order:

1. **You (in plan mode) produce the full production plan.** No code, no file writes — plan only.
2. **Claude reviews the plan in depth.** We iterate until we both sign off.
3. Garvit switches you out of plan mode.
4. **You write `DESIGN.md` FIRST** (he explicitly wants it before the PRD), then the **build PRD**. Claude reviews both.
5. Build proceeds with **model tiering**: you (sol-high) act as PM/architect — you delegate mechanical work (scaffold, MDX case routes, config, deploy wiring) to terra-class models with tight specs, review their diffs, and personally build only the three taste-critical surfaces: **R3F mascot, sprint-board physics, feature-flag system**. Claude mirrors with Haiku-tier agents for content-porting QA and judges the result.

## New required reading (before you write one line of the plan)

`skills/` in this repo now contains five skills from Emil Kowalski (Vercel design engineer). Read ALL of them:

- `skills/apple-design/SKILL.md` — **the primary lens.** Springs (damping 1.0 default, ~0.8 only after momentum), velocity handoff at drag release, momentum projection for ticket flicks, interruptible animations that start from presentation value, rubber-banding at board edges, translucent chrome hierarchy, size-specific tracking/leading, reduced-motion as cross-fade. The slice already does several of these by instinct — the plan should name where it falls short of this skill and fix it (e.g. can a visitor grab a ticket mid-FLIP-settle? §3 says they must).
- `skills/emil-design-eng/SKILL.md`, `skills/animate/SKILL.md`, `skills/animation-vocabulary/SKILL.md`, `skills/improve-animations/SKILL.md` — supporting craft vocabulary.

One caution: apple-design §15 says "default to the system font." That rule is for *products without a brand voice*. Our Archivo + IBM Plex Mono choice stands — it IS the brand reasoning — unless your plan argues otherwise with a better OFL pair. SF Pro remains banned (licensing).

## Anti-AI-slop is now a NAMED hard requirement

Garvit: the theme must "NOT NOT be an AI slop." All DESIGN-BRIEF.md §5 guardrails remain in force, plus:

- No purple/blue mesh gradients, no glassmorphism-as-decoration, no floating 3D blobs, no generic Framer-template hero.
- Every visual decision in DESIGN.md must carry a one-line defense rooted in the garvit.app concept (apple-design §16 "Craft": nothing is random).
- motionsites.ai was raised as inspiration. Verdict after inspection: it is a **prompt marketplace for AI site builders** — the literal slop factory. Use it only as a *motion-ambition bar* (cinematic confidence, committed motion), never as a layout or aesthetic source. Nothing on this site may look like it came from a prompt library.

## Layout evolution (Garvit feedback + Claude's judged direction)

Garvit on the slice: good, "but it can be made more cleaner if we expand a little like modern artistic websites where things are spread out."

Judged direction — **density gradient, not artistic sprawl**:
- The top-of-page product chrome KEEPS its density. The 10-second founder-screenshot test depends on it reading as a live product, and that test already passes. Do not dilute it into an airy art-site hero.
- BELOW the chrome, give everything more air: larger type scale on the hero, more generous spacing rhythm around the board, sections that breathe as you scroll, fewer things fighting per viewport. Apple ships exactly this gradient: dense chrome, spacious content.
- Plan should propose the concrete spacing/scale system (type ramp, space scale) that achieves "cleaner + expanded" without becoming a scroll-narrative brochure — that would betray the concept.

## Carry-forward fix list from the judge pass (fold into plan)

- Rename `candid_mode`'s "CODEX LAB" label — internal tool-name leak.
- Ticket drag must be verified against apple-design §2/§3/§5/§6 (1:1 with grab offset, interruptible, velocity handoff, momentum projection). My synthetic drag failed to move a ticket; investigate whether the drag threshold/physics rejects low-sample pointer streams.
- Hero copy ("I turn fuzzy product ideas into things people can use") still needs Garvit's explicit sign-off — flag as open question in the PRD, don't silently keep it.

## What the plan must contain

1. **DESIGN.md outline** — tokens (color, type ramp, space scale, radii, springs as named tokens e.g. `--spring-settle`, `--spring-flick`), dark theme rules, density-gradient layout system, motion principles (from apple-design), anti-slop defenses per choice. This becomes the single source of truth the terra-class models are REQUIRED to consume — they never invent visual values.
2. **PRD outline** — routes (`/`, `/work/stay-portal`, `/work/maxie`, `/work/agentic-calendar`, `/notes/dynamic-island`), data modules, flag system, board behavior matrix, mascot spec (R3F, from slice-notes.md production section), a11y/reduced-motion matrix, no-JS path, analytics stance (sparse, no surveillance theater).
3. **Work breakdown with model assignment** — each task tagged sol-high / terra, with the spec each terra task receives and the review gate it passes through.
4. **Tech plan** — Next.js App Router + Vercel, font subsetting, R3F loading strategy (poster → lazy WebGL, DPR clamp 1.5, kill-switches per slice-notes), state approach.
5. **Deploy plan** — Vercel project, domain thinking (garvit.app if he buys it; vercel.app fallback), preview-deploy workflow for judge passes.
6. **Open questions for Garvit** — each with your recommended default (PM style).

Constraints in force, unchanged: zero visitor homework · portfolio-not-resume · OFL fonts only · Delhi · candor register · no real guest PII · anti-template guardrails · accessibility parity for every interaction.

When the plan is ready, reply in the pane with `PLAN READY` and where you've put the plan text.
