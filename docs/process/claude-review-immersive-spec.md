# Claude's review — Immersive Product World spec (2026-08-17)

Caught up via the pane transcript + the committed spec (4c5fad3). **Verdict: endorse the direction with five corrections and two process guards.** Approach A (persistent guide over authoritative DOM) is the right pick — it's the only one of the three that scales the ambition without reintroducing visitor homework or breaking the a11y parity we've paid for. The spec's own guardrails (no scroll-jacking, canvas pointer-events none, reduced-motion parity, checkpoint tag) are exactly the ones I'd have demanded.

## Corrections (fold into the implementation plan)

1. **Stale trust line — factual conflict.** Scene 3 requires "computed in your browser. I never see it." to remain prominent. That line no longer exists: Garvit approved PostHog behavioral tracking (open-questions-answers.md round 3, commit f8b91fe — the exact commit your checkpoint sits on), and the shipped copy is now "this funnel is computed in your browser. PostHog sees the rest. I check it obsessively." The spec must adopt the new line; reverting it would make the site lie.
2. **CC-BY attribution is a visible-obligation, not a repo file.** The Muko astronaut is CC-BY: credit must be public-facing, not just a preserved license text. Plan it now — my suggestion: one candor-register colophon line in the footer or 404 ("character base by Muko Art (CC-BY), suit tailored in-house.") plus the license file. If attribution is unacceptable visually, that's a reason to prefer the CC0 Quaternius fallback — decide at the contact-sheet gate, not after integration.
3. **Hero copy at two lines needs optical revalidation.** The locked tracking values (−.055/−.05/−.045em) were validated per size region. Forcing the sentence to two lines at 1440px alongside a 40–50% character crop implies a size/measure change — rerun the rendered check at the new clamp before locking (same procedure as DESIGN.md §3.2; cheap, one capture set).
4. **PostHog event discipline under the new architecture.** The world director/scene system must NOT become a new analytics surface: the four whitelisted events stay the only captures; scene transitions, guide reactions, and funnel stages remain session-local. autocapture will grab clicks anyway — do not add custom capture calls beyond the whitelist without a decision.
5. **Test-suite migration is in my lane and is large — name it.** Dissolving OperationsRail, moving flags to a dock, reordering sections, and the mobile tab controls will break meaningful parts of keyboard.spec, no-js.spec, a11y.spec, responsive tests, and the shell screenshots. The plan should schedule my test-migration pass immediately after each interface lock, not at the end — otherwise we fly blind through the riskiest refactor of the project.

## Process guards (protecting Garvit's token concern)

6. **Hard gate order: contact sheet → world prototype → integration.** No page migration work (dock extraction, section reorder, case templates) until the character passes the contact-sheet gate AND the scene-1 prototype passes its Apple/Taste audit. If the prototype fails, we've spent one scene's tokens, not a full rebuild's. The spec stages this; the plan must enforce it as a stop, not a milestone label.
7. **The funnel, board physics, flags, 404, OG card, and case content are DONE surfaces.** They move or re-skin; they do not get rebuilt. Any plan task that rewrites (rather than relocates) a passed surface should be challenged in review.

## Answers to the work split

Accepted as drafted — both my lanes (implementation + grunt). For the grunt lane: I'll produce the contact sheets, GLB inspection reports, optimization/poster exports, artifact inventory, screenshot matrix, and run all gates, returning failures as data. Send interface locks as they freeze and I'll start the corresponding migration immediately.
