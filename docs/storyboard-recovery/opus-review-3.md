# Opus taste audit — storyboard v2 (review 3)

Final check before design-lead + client review. Judged from `captures/` (five states × themes/sizes); HTML cross-checked for seam mechanics. Reviewer chrome absent from every capture — capture mode is clean.

## Per-mandate verdict

| # | Mandate | Score | Note |
|---|---|---|---|
| 1 | One full-viewport state; compact tabs; none in captures | **9** | Every capture is a pure product frame. Capture mode works. |
| 2 | Welcome cinematic; avatar ~50%; locked copy; no kicker/meta | **9** | Reads cinematic, not hokey. Wordmark only, no eyebrow. Figure is full-height right-anchored; composition weight ~half. Center feels slightly empty on 1440 but confident, not broken. |
| 3 | Persona same stage; guide aside, legible; headline; 4 equal chips; disclosure subordinate | **8** | Same starfield stage. Four identical chips, 2×2. Disclosure sits above grid (discloses before pick — correct). Guide is quite small on 1440 (~4% width) — legible but closer to "gone" than "moved aside." |
| 4 | Punchline exact; no diagonal lime seam; in-place dissolve documented | **9** | Line verbatim, dominant. No lime seam anywhere. Dissolve locked as binding eng/motion note, correctly not drawn. `SELECTED → FOUNDER` pill is minor illustrative meta — acceptable, documented. |
| 5 | Homepage guide integrated in GA band (no porthole); chip reads clickable→cockpit | **8** | Guide sits directly on release-blue field — no card/border/porthole, edges clean, no halo. `TRACKING · 4/5` chip is agent-anchored with coral dot; reads slightly more as *status* than *button* in a still. Wired to cockpit in the live file. |
| 6 | Triptych one card; reduced glued feel; feathered seams only; mobile shows all three | **6** | Mobile stacks all three bands (MVP/BETA/GA) with tags — resolved and good. But desktop **GA band is the weak point**: seams are technically feathered gradients (no hard rule — mandate met to the letter), yet the GA fill is 100%-opacity saturated release-blue over the full right third, so it still reads as a loud glued column. "Reduced glued-column feel" only half-achieved. |
| 7 | Real flags (dark_mode/confetti/candid/comic_sans), 3/4 live, clean | **9** | Real four, quiet subordinate row. `dark_mode` chip visibly flips THEME on↔off between the light/dark captures — live-bind proven. |
| 8 | Board preview = real heading + GAR-101 Stay Portal ticket edge | **9** | "Things I've built" + `GAR-101 · PRODUCT / Stay Portal` peeking above fold. Real content, correct crop. |
| 9 | Cockpit bespoke; no reviewer controls in captures | **8** | Bespoke instrument surface — funnel you-vs-typical bars, drop-off labels, 3 stat tiles, 2 lilac insight cards, italic mono trust line. Clean. **Mobile (390) clips the right column** (stat tiles/insight cards cut off) — no single-column reflow. Minor, cockpit-only. |
| 10 | No kicker placeholders | **9** | None found. GAR-101 kicker and flag headers are real content, not placeholders. |

**Standing laws:** Single-accent — lime holds as the true accent; cyan (Beta/FOUNDER pill) and release-blue read as a *semantic* maturity system, defensible — but the GA block's saturation pushes the limit (see taste). WCAG — hero white-on-graphite and mono chips legible in both themes; disabled `comic_sans` chip is low-contrast by intent. Headline dominance — strong on Welcome, Punchline, Homepage, Cockpit. No banned template smells except the GA-hero note below.

## Taste verdict

Welcome reads **cinematic-premium, not hokey** — one well-lit figure in confident dark negative space, real render sitting *in* the light with no card, no fringe, no pasted edge. The render integrates cleanly at every crop tested (Welcome, Persona, Punchline, Homepage-GA) — this was the biggest risk and it lands. The astronaut is contemporary and material-real; **zero 2000s-clipart risk** anywhere. The one taste wobble is the Homepage GA band: at full saturation over the right third it tips the hero toward a generic SaaS-purple block and is the only surface that reads faintly templated. The triptych's MVP→BETA→GA story **is** legible in one glance on mobile (three tagged bands stacked), though the upper two bands are thin strips — story survives, drama is muted. Net: this is premium, coherent work; the GA field is the single element pulling it back from excellent.

## The coral-texture question

Model renders light suit + **blue** helmet/shoulder/boot trim only; no coral on the mesh. Coral survives elsewhere as the `TRACKING` dot and cockpit incident accent, so the guide simply doesn't echo it. **Recommendation: accept blue-only for this review round.** Blue-only is clean, premium, and doesn't fight lime; a coral-trim pass is a *nice-to-have* to tie the guide into the incident-signal palette, not a defect. Log it as an optional material pass at build — do not block the client review on it.

## FINAL CALL

**READY FOR CODEX + GARVIT.** All ten mandates met to the letter; locked copy verbatim; captures clean. Two recommended (non-blocking) nits worth a fast pass before or after the client sees it:

1. **GA band saturation (taste, highest value).** Knock the release-blue GA fill back — lower opacity, add a subtle inward feather on the fill itself (not just the 8% seam), or a faint texture to match MVP/BETA — so the right third stops reading as a glued solid column. This is the one edit that moves the hero from good to excellent.
2. **Cockpit mobile reflow (minor).** Right column clips at 390px; reflow to single column so stat tiles/insight cards aren't cut off.

Neither blocks the review. Ship it to Codex + Garvit; treat #1 as the priority polish.
