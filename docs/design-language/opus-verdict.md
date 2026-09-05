# Opus verdict — Neo Futurist corrected mock

> Single taste/contradiction verdict on `neo-futurist-mock.html` (+ `neo-futurist-notes.md`), for the pixel-lock gate. Judged against DD-001–011/013/016/017, GI-004/005/008/009/010/013/014, the drift alarms, and `amplitude-funnel-patterns.md`. **Judged from a LIVE render, not the delivered captures — see Finding B-1.** Authority unchanged: this file advises; only Garvit/Codex lock. Date 2026-08-18.

## Capture integrity — read first
The 15 delivered captures are **not fresh, not assertion-clean, and not of this mock**. They are two unique files (`md5 4f01034a…` at 1440, `705aed56…` at 390) duplicated across all 15 names — every one a plain **"Not found" 404 page** (white canvas, black mono "Not found" top-left, zero mock pixels). The capture harness was pointed at a wrong path and screenshotted the server's 404. The notes §9 "screenshotted every state" record and the task's "6 states × 3 conditions, assertion-clean" premise are both contradicted by the bytes on disk. The mock itself renders **correctly** when served from repo root (fonts, guide art, all states 200) — so this is a capture-pipeline failure, not a mock defect. I re-rendered all six states live (1440 light, homepage+welcome dark) to produce this verdict.

## Per-surface verdict (from live render)

**Onboarding stage (Welcome / Persona / Punchline / Reveal) — PASS, direction-true.** One thick 4px black rounded chassis inset on warm near-white canvas, fixed near-black interior with faint diagonal hatch, identical frame across all four states — genuine chassis-on-canvas, not a separate cinematic universe. Lime CTA/pill accents are semantic. Copy locked-correct: "your pick goes to PostHog." (corrected), 2×2 bordered persona chips, "Noted. This changes nothing. It never does." verbatim, lime "FOUNDER" in the selected pill. Reveal reads as an opacity-only dissolve midpoint (homepage echo beneath, translucent chassis + 50%-ghosted punchline over it), clearly captioned. No blue, no starfield, no glow. Neo Futurist confirmed.

**Homepage triptych — PASS.** One hero chassis, MVP/BETA/GA as one continuous dark register graded by texture (loose hatch → structured grid → solid ink) and asymmetric width (18/24/rest). White headline holds contrast across all three bands. Mono uppercase band tags carry the maturity reading. Lime appears once semantically (tracking chip); flags are quiet bordered mono chips (`dark_mode` live-binds to theme). Reads premium-editorial. No card soup, no release-blue field.

**Session cockpit — PASS, credible as an instrument.** Fixed authored-dark surface. The visitor-live-fill vs authored-benchmark split reads **cleanly at a glance**: dominant 70% left pane "YOUR SESSION / LIVE" is binary lime bars (reached / half-hatch in-progress / full-hatch not-yet) with a Stage/Status table and **no percentages**; diminished 30% gray right pane "TYPICAL VISITOR / AUTHORED REFERENCE" is the only place aggregate percentages (100/58/24/9/2) live, with the single coral marker on the biggest-drop bar. Spatial hierarchy (not colour-coded overlays) encodes the comparison per DD-011. Instrument cards, lilac-accented insights, and the verbatim DD-018 trust line all present.

## Taste — blunt
Premium-editorial, not costume. The chassis system, the shared astronaut guide, the tiny spaced mono labels, and the disciplined lime/coral read as **one product** from onboarding through homepage to cockpit — a designer's system, not a template. The triptych's maturity gradient is readable in one glance on desktop (it leans on the band tags to say "left→right = maturity"; the texture alone is suggestive, not self-explaining — acceptable, not costume). The cockpit is the strongest surface: it looks like an instrument someone who PMs their own site would actually build, and the "this is my data / this is the benchmark" distinction is unambiguous. Nothing here reads as SaaS-card or old-blue language. This is a real visual system.

## Contradictions vs registers / drift alarms
- **No live drift-alarm breaches.** No multi-page onboarding, no returning analytics card-stack, no release-blue fields, no decorative lime/coral, no copyrighted-character production, no coverage-as-quality claim.
- **DD-009 held** — flow/copy reused, storyboard palette/analytics not.
- **DD-017** — hairline default; the feather is proposal-only and force-hidden in capture (verified: no feather in live capture render).
- **One self-QA contradiction:** notes §9 claims "screenshotted every state" and "zero head/foot clipping." Neither survives contact — the captures are 404s (B-1), and the Welcome guide's raised hand **is** clipped at the chassis top edge (N-1). Head/helmet are fine; the "zero clipping" claim overstates.
- **Minor coral semantic double-use:** coral is defined as locked/alert/biggest-drop, yet the homepage TRACKING chip carries a coral status dot on a *healthy* live-tracking affordance. Reads as a neutral pulse, not an alert — mild inconsistency with the strict coral meaning enforced everywhere else.

## Recommendations on §8 open questions
1. **Seam proposal** — Keep the hairline as shipped default; **reject the feather as default.** The texture gradient already carries band separation; a gradient feather buys nothing and reopens DD-017 risk. Record DD-017 as resolved-to-hairline.
2. **Benchmark numbers (100/58/24/9/2)** — Adopt as *intentionally illustrative* and label once in-product ("illustrative reference"); no need to source real data for a personal site — just record the decision so it isn't mistaken for measured.
3. **MVP/BETA/GA darkness gradient** — Keep the one-dark-register metaphor (contrast-safe, one continuous surface). Reject the lighter-MVP alternate. Optionally strengthen the left→right maturity legibility so it leans less on the tags.
4. **Reveal state** — Keep as mock/review-only illustration of the dissolve; do **not** promote to a reachable production route (it's a transition midpoint, not a destination).
5. **Persona disclosure wording** — "your pick goes to PostHog." is accurate, minimal, non-exclusive; **ship as-is** (or tighten to "this pick goes to PostHog."). Not a blocker.

## Findings list (for design lead)

**BLOCKING**
- **B-1 — Captures are all 404 "Not found" pages.** The artifact Garvit is meant to lock pixels on does not exist in the captures folder; all 15 files are two duplicated 404 screenshots. Regenerate from a repo-root server at the correct path (`/docs/design-language/neo-futurist-mock.html#<state>,capture`) before any pixel-lock session. Until then this review round's stated input is unfulfillable from the delivered files.
- **B-2 — Native-390 mobile unverified.** The browser harness clamps window width (~600px floor) and ignored the 390 resize — the desktop triptych kept rendering, so the ≤760px stacked layout (GA-fill-behind technique, stacked cockpit) was **never exercised in pixels**, by me or by the prior round (notes §9 admits this). CSS reads sound, but confirm at true 390 before lock.

**NICE**
- **N-1 — Welcome guide raised hand clipped** at the chassis top edge (helmet is fine). Contradicts the "zero clipping" QA claim; the wave gesture is partially lost. Grow the guide-wrap headroom or nudge scale.
- **N-2 — "01 · WELCOME" step label partially occluded** by the helmet on Welcome. Reposition the step label or the guide.
- **N-3 — Guide anchoring inconsistent across onboarding** (Welcome right / Persona centred / Punchline right). On Persona the centred astronaut visually dominates the *interactive* persona chips — the mandatory-selection affordance should out-weight the mascot.
- **N-4 — Coral status dot on the healthy homepage TRACKING chip** softly conflicts with coral's reserved alert/drop/locked meaning. Consider lime or a neutral dot there.
- **N-5 — Dark mode (stress-check only) softly inverts the maturity metaphor:** fixed-graphite MVP/BETA bands become the brightest patches against the near-black canvas. Acceptable since dark is not primary; note it.

## FINAL CALL
**The design is READY for codex + Garvit pixel judgment. The capture artifact is NOT — and pixel judgment cannot proceed on the delivered captures because they are all 404 pages (B-1).** Rendered live, all three surfaces are direction-true, premium-editorial, and free of drift-alarm breaches; the corrections (cockpit semantics, coral placement, PostHog copy, dark-leak hardening) all land. Gate action is mechanical, not creative: **regenerate real captures at the correct path and verify at true 390 (B-1, B-2)**; N-1–N-5 are polish, not blockers. Once real captures exist, this locks.
