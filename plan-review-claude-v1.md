# Claude's review of production-plan-v1 (2026-08-15)

Verdict: **strong plan — approve pending five amendments.** The self-audit of the slice's motion deficits (§7) is exactly the honesty the process needs, and the low-sample pointer handling in the board matrix explains and fixes the synthetic-drag failure from my judge pass. The workflow gates, tiering, budgets, analytics stance, and open-question defaults all match the mandate. Revise per below and we're both signed off.

## Amendments (revise the plan)

### A. Mascot: justify GLB vs procedural — I recommend procedural
Task 8 commits to authoring a compressed GLB. Authoring + compressing + loading a GLB is an asset-pipeline risk (export tooling, draco/meshopt config, a 200KB budget to police) for a figure that is deliberately simple geometry: torso, head, eyes, arms, pager. Building it **procedurally in R3F** (primitives + groups, matte materials) removes the entire pipeline, makes the figure diffable/reviewable as code, keeps the lazy chunk smaller, and loses nothing at this level of stylization. Either change task 8 to procedural, or keep GLB with a stated reason procedural can't deliver (e.g., sculpted silhouette requirements). Don't leave it as an unexamined default.

### B. The OG/social card is a taste surface — elevate it
Task 5 buries "OG templates" in a terra content task. The OG card is the **off-site version of the founder-screenshot test** — it's what renders when someone pastes garvit.app into Slack/X/WhatsApp. It must reproduce the product-chrome aesthetic (version bar, board, candor register), be authored deliberately, and pass my judge review like any hero surface. Move OG image design to a sol-high responsibility (task 10 or its own line) with a review gate; terra can wire the plumbing.

### C. Hero tracking −.065em: flag for optical validation, don't pre-lock
apple-design §15 says large display text wants negative tracking, but −.065em at 7.25rem with .88 leading is at the crushed end for Archivo's display weights. Keep it as the DESIGN.md *starting value* with an explicit note that it gets validated optically on rendered type at all clamp stops (and against the lowercase-heavy hero copy) during the DESIGN.md review — not locked from a table nobody has seen rendered.

### D. Keyboard ticket movement: "never animates" needs a defense or a softer rule
Instant teleport on Alt+Arrow is defensible (efficiency, no vestibular need), but keyboard users are not reduced-motion users — a ~150–200ms critically-damped settle would aid comprehension of *where the ticket went*, and WCAG doesn't ask for instant. Either keep instant with a one-line defense in DESIGN.md, or adopt "brief settle unless prefers-reduced-motion." Your call as designer — but make it a decision, not an omission.

### E. Add rough sequencing and effort estimates
The breakdown has owners and gates but no calendar shape. Garvit is a PM; he'll ask "how long." Add rough effort per task (S/M/L or hours), the dependency chain, and what can run in parallel (e.g., tasks 6/7/8 after task 4; task 5 parallel with 6–8). Precision not required — shape is.

## Confirmations (no change needed — recording agreement)

- Board matrix low-sample handling + pointer-up-as-final-sample: correct fix for the observed drag failure.
- CODEX LAB → FIELD NOTES: approved.
- dark_mode follows OS first with local override; other flags session-scoped; board sessionStorage never server state: approved.
- Confetti caps (3 bursts/session, 8 pieces, 480px spacing): the restraint is right.
- Analytics: 4-event whitelist as a disabled typed adapter, nothing behavioral: approved — this keeps the surveillance joke a joke.
- CSS Modules + custom properties, no Tailwind: approved; keeps terra workers inside locked tokens.
- Budgets and the no-JS matrix: approved as gates, not aspirations.
- Open question #1 (hero copy blocks launch until Garvit approves): correct default.
- Open question #7 (abstract figure, not likeness): agree with the recommended default.

## Process note

When revising: reply `PLAN V2 READY` in the pane. Keep the revision as a delta on production-plan-v1.md (now saved in the repo) rather than a full rewrite — only the amended sections need restating.
