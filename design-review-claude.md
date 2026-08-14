# Claude's DESIGN.md review — APPROVED (2026-08-15)

**Verdict: approved as the locked production design source of truth.** This is the strongest document produced in the project so far — complete tokens, per-row concept defenses, an honest density map, and a motion system that correctly internalizes the apple-design skill (presentation-value starts, velocity handoff, momentum projection, per-surface reduced-motion equivalents). The anti-slop section is enforceable, not aspirational.

## Optical validation — completed, values locked

Rendered production Archivo 800 at .88 leading in Chrome (light + dark) at the clamp stops using the slice's embedded font. Results recorded in DESIGN.md §3.2:

- **Large ≥ ~96px: −.055em** · **Medium: −.05em** · **Small/mobile: −.045em**
- **−.065em rejected at every size** — the `rn` pair in "turn" collides and reads as "tum"; word gaps nearly vanish. The validation is copy-dependent; re-run if the hero line changes.
- Optional, implementer's discretion with review: `word-spacing: .01–.02em` at the largest sizes.

## Factual updates made directly in DESIGN.md (review edits, not redesign)

1. §3.2 Copy status: hero line is **approved by Garvit (2026-08-15)** — no longer provisional. The OG line "Product Manager who builds" stays provisional until Task 8A.
2. §12 pending-values list resolved accordingly.

## Four items to fold into the PRD (Task 2) — none block DESIGN.md approval

1. **Phone number.** Garvit wants +91 7508883655 as a public contact (see open-questions-answers.md, which post-dates your DESIGN.md start). DESIGN.md's footer/CTA spec doesn't cover it. PRD must specify treatment: `tel:` link, light scraper obfuscation (render via JS or one-tap reveal), placement (footer contact cluster is my default suggestion, not a third hero CTA — hero stays two controls).
2. **"Full changelog" affordance (§5.2) has no destination.** Routes don't include a changelog. Pick one in the PRD: add a small `/changelog` route, or drop the affordance and keep the popover at three notes. My PM-default: drop it — three candid notes are the joke at full strength; a full changelog page is maintenance surface without payoff.
3. **Brand string is a token.** Domain is unpurchased and may not be garvit.app. The wordmark/version string must be one config value everywhere it appears (chrome, OG card, footer, metadata).
4. **Microcopy dedupe (§10).** "No sprint ceremony required" appears in two example lines; your own ceiling is one dry line per surface — keep the punchline on one surface only.

## Required reading before you write the PRD

- `open-questions-answers.md` — Garvit's answers (hero copy approved; domain TBD; phone; resume stance; **SSMS President is the true title**, old site's "SAC" was wrong; Stay Portal demo live at airbnb-portal-demo.vercel.app with six PII-verified screenshots, five already in `content-source/assets/stay-portal/`).
- `plan-amendment-work-split.md` — **terra lane is dissolved.** Garvit's directive: Claude absorbs all mechanical work (Tasks 3, 4, 5, 9, 12) in its own subagent lane; your tokens go exclusively to Tasks 2, 6, 7, 8, 8A, 10 plus design-fidelity spot-reviews of Claude's Task 4 output (token diff + two screenshot sizes only — no config/plumbing review). Plan your remaining budget around that narrower, deeper lane.

Proceed to Task 2 (PRD) when ready. Reply `PRD READY` when done.
