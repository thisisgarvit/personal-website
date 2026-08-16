# Codex execution checkpoint — Immersive world Task 2

**Checkout:** `/Users/garvits/Documents/Side-Projects/Garvit-Portfolio-July`,
`main`, shared by Garvit, Codex, and Claude. No alternate worktree.

## Completed

- Baseline tag: `checkpoint/pre-sougen-rebuild-2026-08-17` at `f8b91fe`.
- Authority lock: `d3ba08d`.
- Gate A: Muko selected 36/40 at `8285302`; see
  `docs/qa/immersive/gate-a-model.md`.
- Muko-specific assumptions stay inside `guide-rig.ts` and `GuideScene` so a
  future model replacement remains bounded.

## Active ownership

- Task 2 / Gate B is the isolated static `/dev/world` Scene 1.
- Codex owns composition, CSS, optical judgment, and markup lock.
- Claude owns post-lock mechanical work: flag-dock wiring, persona state and
  analytics plumbing, immediate test migration, captures, and gate mechanics.
- Claude is a reviewer, not design authority. Codex independently adjudicates
  suggestions against Garvit's goals and the rendered page. Do not duplicate
  another lane's work.

## Garvit-approved decisions

1. Hero: pencil/white sheet → digital structure → release color, mapping MVP →
   beta → GA. Never a loader. Semantic headline and CTAs are immediate;
   no-JS/reduced-motion get GA. Gate B locks GA pixels/hook; Gate C animates.
2. Guide waves once, then glances toward the board. Persona selection later
   gets one restrained pager acknowledgment.
3. Persona satire is modeless, optional, skippable, and never a prerequisite.
   Choices: Founder, Recruiter, Product lead, Just browsing. No free text.
   Payoff: `Noted. This changes nothing. It never does.` No personalization.
4. Persona analytics: UI state is tab-local, but selection is sent to PostHog
   as `persona_selected` with `persona`, `surface: "hero_onboarding"`, and
   `$set: { visitor_persona: persona }`. This supports event breakdowns and
   person segmentation. Disclose before input; Skip sends nothing. Funnel and
   world streams remain local-only.
5. Career timeline is deferred. A future version uses release history rather
   than resume chronology. Mirogian Apr–Sep 2020 BD intern and Languify Jun–Dec
   2021 Growth Product intern are facts only; invent no outcomes.
6. Funnel remains visible. Optional deeper expansion may come later.

## Uncommitted Task 2 state

- `src/app/dev/world/page.tsx`
- `src/app/dev/world/WorldPrototype.tsx`
- `src/app/dev/world/world-prototype.module.css`
- `src/app/dev/world/WorldPrototype.test.tsx`
- `public/images/world/prototype-guide.webp`
- Authority amendments in `DESIGN.md`, `PRD.md`, the immersive spec, and plan.

The prototype already has chrome, experiment strip, exact hero copy, two CTAs,
Muko poster, existing flags, and a real work ticket. Persona markup/evolution
hook are not yet implemented. The focused test first needs a `matchMedia` stub
and filesystem-safe source path.

## Next sequence

1. Repair test harness; verify baseline GREEN.
2. Add persona/evolution contract test; observe RED.
3. Implement static markup/CSS; verify GREEN.
4. Render 1440×900 and 390×844 in light/dark; tune independently.
5. Freeze markup and signal Claude for dock/persona behavior and tests.
6. Capture and score Apple/Taste; run typecheck/lint/tests; commit Gate B only
   after every threshold passes.

## Gate B bar

- 1440: headline at most two lines; guide 40–50% meaningful crop; both CTAs
  obvious; one real work ticket crosses the viewport boundary.
- 390×844: both 56px CTAs in the first viewport; clear guide crop and work
  entry; persona tray cannot crowd out the hero and remains dismissible.
- Static only: no Canvas, Three, or dynamic import; no homepage migration.
- Taste at least 22/25 with no dimension below 4; static Apple gate passes; no
  dashboard-card stack and no fake duplicate ticket.
