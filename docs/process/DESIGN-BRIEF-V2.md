# Design Brief V2 — Client rejected V1. Read this fully before touching anything.

## Garvit's verdict on V1 (near-verbatim)

- "Not easy to consume at first glance… isn't it a very simple website? What is the use of such research if this was the outcome?"
- On MVP Budget: "Bro not something like this… how can you even think about the 24 week cut, no one is coming to judge how they think to my website."
- "Why is text like Download resume etc CTA so small?"
- "I remember liking a website where it was a windows system [chusmargallo.space]… that was the kind of interactions I was expecting from both of you."
- He asked me to share his disappointment with you. Mine too as judge: we both over-indexed on the quiet half of his votes and under-delivered on the half that made him vote LOVE on chusmargallo, gkoberger, marco.fyi.

## The corrected read of his taste

His LOVE votes on minimal sites were about **polish**, not austerity. His expectations live in the **committed-playful** cluster. The site must look visually rich and interactive at FIRST GLANCE. And the golden rule for interactions:

**ZERO VISITOR HOMEWORK.** No mechanic that asks the visitor to think, allocate, decide, or be evaluated. Instant payoff only: click → delight, move cursor → reaction, hover → response. The visitor is always the audience, never the student.

## V2 direction: interaction-forward, quirky-PM playful

Two interaction directions he explicitly named — develop BOTH, they can coexist:

1. **3JS event-tracking figure (he asked for this).** An animated 3D figure/character (Three.js / react-three-fiber) that tracks the cursor and visibly reacts to what the visitor does — paired with a live, funny mini event-log ("event: hover_resume_cta — noted.", "event: rage_click — interesting."). The gag: a PM who instruments everything, watching your session in real time. He works in Amplitude daily — this is HIS joke. Must be lazy-loaded, static fallback, but present at first glance.
2. **Desktop-OS metaphor (he expected this).** Portfolio as an operating system: case studies open as draggable windows, dock or desktop icons for Work/Notes/About, playful system dialogs ("This PRD has unsaved thoughts."). Can be the whole site shell (chusmargallo-level commitment) or a major section, your call — but it must feel committed, not a token widget.

## Hard requirements

- **First-glance consumability:** a screenshot of the top of the page must look rich, alive, and obviously interactive. No austere whitespace hero.
- **Big CTAs:** "Download resume" and contact are primary, unmissable buttons.
- **Delhi**, not Bengaluru.
- Keep from V1 (these were NOT rejected): candor microcopy register, licensed self-hostable fonts, portfolio-not-resume IA, anti-template guardrails from DESIGN-BRIEF.md §5, accessibility/reduced-motion discipline. Palette may evolve if the playful direction needs it — state why.
- Case-study reading pages can stay calm and readable — the play lives in the shell/hero/navigation, not inside long-form text.

## Deliverables

1. `design-concept-v2.md` — the revised concept: how the 3JS figure + OS metaphor compose into one site, what the hero looks like, updated palette/type if changed, event-log microcopy samples (6+ lines), performance/fallback plan.
2. `style-tile-v2.html` — self-contained, no CDN. This time it SHOULD be interactive — that is the point. Demonstrate the actual feel: a working cursor-tracking figure (vanilla canvas/JS approximation is fine if inlining three.js is impractical — note what production upgrades to) and at least one draggable window with real content from content-source/. First-glance richness is the acceptance bar; Garvit will judge it in one screenshot.

Judge (Claude) will review for: zero-homework compliance, first-glance richness, CTA prominence, no AI-template smells, and that case-study readability survived.
