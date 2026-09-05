# Neo Futurist visual-system mock — notes

Companion to `neo-futurist-mock.html`. That file is the artifact to review (open it directly, or via `?capture=1` / `#state,capture` for chrome-free stills). This doc records the token system, the composition intent per surface, the GI/DD entries served, proposal items needing explicit approval, and a reuse map back to production.

**Status: this mock is a Provisional → candidate-for-Locked visual-language proposal for DD-010/DD-011.** Nothing here is binding until Garvit or Codex records approval in `direction-decision-register.md`. Flow/copy/structure came from `storyboard.md`; per DD-009 none of that file's palette, analytics UI, or component styling was reused — every visual decision below is new.

---

## 1. How to review it

- Open `docs/design-language/neo-futurist-mock.html` from a server rooted at the repo root (fonts resolve at `/src/fonts/*.woff2`; guide art resolves at `../storyboard-recovery/assets/*.png`). A bare `file://` open will 404 the fonts.
- Bottom-center pill tabs switch states: **Welcome → Persona → Punchline → Reveal → Homepage → Cockpit**. Direct-link any state via `#homepage`, etc.
- Top-right toggle switches light/dark (dark is the stress-check, not the primary — see §6).
- A second top-right toggle, **"Show seam proposal"**, reveals the one DD-017 proposal item (§5). It is force-hidden under `?capture=1` / `#capture` regardless of its state, so a capture can never accidentally ship an unapproved treatment.
- `?capture=1` or `#state,capture` hides all reviewer chrome (tabs, toggles, the clickability annotation on the Homepage tracking chip) — pattern reused verbatim from `storyboard.html`, `data-reviewer` marks every reviewer-only element.

---

## 2. Token table (as used in the file)

| Token | Light (primary) | Dark (stress-check) | Used for |
|---|---|---|---|
| `--canvas` | `#F4F2E9` | `#0C0C0A` | Page background, homepage negative space |
| `--panel` | `#FBFAF4` | `#161611` | Chassis fills, chip backgrounds |
| `--panel-alt` | `#EEEBDC` | `#1E1E17` | Secondary panel tint (unused directly on hero after the contrast fix — kept for future chassis modules) |
| `--ink` | `#131310` | `#F4F2E9` | Chassis borders, primary text, rules |
| `--graphite-900…100` | `#1C1C17 → #E7E4D6` (5-step scale) | inverted scale | Muted text, hairlines, board copy |
| `--rule` / `--rule-strong` | `rgba(ink,.22)` / `rgba(ink,.55)` | `rgba(ink,.24)` / `.55` | Hairline dividers, default seams |
| `--stage-ink` | `#1C1C17` (fixed, **not** redeclared for dark) | same `#1C1C17` | Onboarding stage interior + hero GA band — an authored fixed-dark surface, independent of the light/dark toggle (same logic as the cockpit's own palette) |
| `--lime` / `--lime-ink` | `#CBED45` / `#12180A` | unchanged | **Semantic only** — primary CTA, "on"/live flag dot, tracking chip, "reached"/"in progress" fill in the visitor's own cockpit pane |
| `--coral` | `#FF6B52` | unchanged | **Semantic only** — locked-flag dot, tracking-chip alert dot, the *authored benchmark's* biggest-drop marker in the cockpit (moved off the visitor's own pane this correction round — see §10) |
| `--lilac` | `#C4B7FF` | unchanged | Cockpit insight-card left border (informational accent, not a state signal — kept sparse) |
| `--font-display` | `"Archivo","Arial Narrow",Helvetica,Arial,sans-serif` | same | Headlines, body, buttons |
| `--font-mono` | `"IBM Plex Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace` | same | Labels, chips, tiny uppercase system copy |
| `--border-chassis` / `--border-chassis-lg` | `3px` / `4px` | same | Module frames / hero + stage frames |
| `--radius-lg` / `--radius-md` / `--radius-sm` / `--radius-pill` | `28px` / `18px` / `10px` / `999px` | same | Chassis frame / board card / chips+buttons / pills |
| `--space-1…9` | `.25rem → 6rem` (8px-ish scale) | same | Spacing scale (used ad hoc via clamp()/vw in most rules — recorded here for future componentization) |

**@font-face** — real production files, root-relative, no CDN: `Archivo-400-800.woff2` (variable, weight 400–800) for display; `IBMPlexMono-400/500/600.woff2` for mono. System fallbacks (`Arial Narrow`, `ui-monospace`) stand in if the woff2 fails to load.

---

## 3. Per-surface composition intent

### Onboarding stage (Welcome / Persona / Punchline / Reveal) — GI-004/005/006, DD-001–005
One `.stage-chassis`: a thick (4px) black rounded chassis frame inset on the near-white canvas, interior filled with the fixed `--stage-ink` near-black and a faint diagonal hatch for materiality. This is the same design language as the homepage (chassis-on-canvas), not a separate cinematic universe — no starfield, no radial glow (both were storyboard placeholders, dropped per DD-009/DD-017). The frame's position/size is identical across all four states; only the interior content changes, giving the "same-stage continuity" GI-004 asks for.

Guide art (`guide-alpha-wave/full/upper.png`) uses one shared `.guide-wrap` geometry (`min(18vw,250px)` × `min(94vh,860px)`, `scale(2.35)` bottom-anchored, `overflow:hidden`) reused across Welcome/Persona/Punchline so the character reads as literally the same size throughout the sequence — tuned during QA to land at ~13% visible-character width on desktop with zero head/foot clipping (the first pass clipped the helmet; fixed by reducing scale and growing the wrap height rather than just the width).

**Reveal** is the fourth onboarding state the brief asked for beyond what `storyboard.html` drew: a full copy of the Homepage markup sits underneath (`.reveal-echo`, `display:flex` matching the real Homepage's own layout — the first pass forgot this and the echo collapsed to zero height), with the stage chassis overlaid at 32% opacity and the punchline line ghosted at 50% opacity on top. This is **opacity-only** — no directional wipe, no seam line, no clip-path wedge — per `storyboard.md`'s binding production note on the Punchline→Homepage dissolve.

### Homepage — DD-006/007, GI-008/009
One hero chassis card, one continuous dark surface across all three maturity bands (MVP 18% / BETA 24% / GA 58%, asymmetric). Maturity is encoded as **darkness and texture resolution**, not color: MVP is the lightest/roughest graphite with a loose diagonal hatch ("sketch"); BETA is a mid-graphite with a structured grid ("blueprint"); GA resolves to solid `--stage-ink` with zero texture ("shipped"). Keeping all three bands in the same dark register (rather than light MVP/BETA + dark GA, the first draft's approach) is what makes the white headline/intro legible everywhere they land — the first pass had near-white text silently failing contrast against light MVP/BETA fills; fixed by moving the whole triptych into one dark family.

Default seams between bands are 1px hairline rules (`--rule`, DD-017-compliant). Band tags (MVP/BETA/GA) are small bordered mono chips, tiny spaced uppercase. The guide (`guide-alpha-upper.png`) sits directly in the GA field with the `TRACKING · 4/5 → OPEN` chip — the **one** lime-signal moment in the whole triptych, semantic (it's a live state readout + an affordance, not decoration). Feature flags render as quiet bordered chassis chips below the hero (real flag names, `dark_mode` live-bound to the theme toggle). Board preview is a chassis-topped ticket peek with the real GAR-101/Stay Portal copy.

Mobile (≤760px): MVP/BETA collapse into two 52px in-flow strips at the top; GA becomes an absolutely-positioned fill behind the in-flow headline/intro/CTAs/guide, so the whole lower two-thirds of the card reads as one continuous dark GA surface rather than a strip followed by an unrelated light slab (mirrors the technique `storyboard.md` already validated for this exact problem). CTAs land in the first viewport.

### Session cockpit — DD-008/011
**Semantics decided this correction round (§10) — read this section as current, not the earlier funnel-of-aggregates draft.** Amplitude's stacked-bar pattern translated to Neo Futurist per `amplitude-funnel-patterns.md`, but the two panes now mean genuinely different things, and are labeled so a viewer can't confuse one for the other:

- **Dominant pane — "YOUR SESSION · LIVE"** (70% width, `--c-panel` ground) is *this visitor's own session*, five stages (Landed / Scrolled / Played / Read work / Contact), each a binary state, not a percentage: **reached** (solid lime, full-height bar), **in progress** (half solid lime / half crosshatch — the stage the visitor is currently on), or **not yet** (full crosshatch, no solid fill — the visitor hasn't gotten there). No aggregate numbers live in this pane. The micro-table below it repeats the same five stages as a plain Stage/Status list — no Users/Convert% columns, because there's no cohort to convert.
- **Diminished pane — "TYPICAL VISITOR · AUTHORED REFERENCE"** (30% width, darker `--c-panel-2` ground, lower/duller curve) is the only place aggregate-style percentages live (100/58/24/9/2 across the same five stages) — explicitly labeled *authored reference*, not a live measurement, so it can carry the declining-funnel visualization without implying it's this visitor's data.
- The single coral dot/outline lives on the **benchmark pane's** biggest drop (Landed → Scrolled, 100%→58%) — not on the visitor's pane. Rationale: "biggest drop" is a magnitude between two aggregate percentages; the visitor's own pane has no percentages to compute a drop from, so a coral marker there would either be meaningless or falsely imply the visitor pane is also aggregate data. The visitor's furthest-not-reached stage ("Contact") gets the same plain crosshatch as any other not-yet stage.

Spatial hierarchy (dominant vs. diminished pane) still encodes the comparison, per DD-011, rather than color-coding two overlaid series. Three instrument cards (`TIME HERE` / `DELIBERATE ACTS` / `FURTHEST SIGNAL`) are thick-framed with large mono numerals — `FURTHEST SIGNAL` now reads the visitor's current in-progress stage ("Read work"). Two lilac-bordered insight cards and the verbatim trust line close the surface. Fixed dark instrument palette, independent of the light/dark toggle (matches the onboarding stage's own fixed-dark logic) — visible close button returns to Homepage.

Mobile: funnel → benchmark → instruments → insights, fully stacked, no fixed-width table columns left standing.

---

## 4. GI/DD entries served

- **GI-004, GI-005, GI-006** — same-stage onboarding sequence, satirical persona prompt, PostHog disclosure copy — all reproduced verbatim.
- **GI-008, GI-009** — MVP→Beta→GA visible as a static simultaneous composition, prioritized over a transition.
- **GI-010** — session instrumentation lives behind a compact chip that opens a full cockpit, not a permanent homepage fixture.
- **GI-013, GI-014** — Neo Futurist chassis/asymmetric-pane system built; sparse lime/coral accents kept semantic rather than the system going strictly monochrome.
- **DD-001–DD-005** — one fullscreen onboarding surface, mandatory persona selection (no skip), locked copy/choices/payoff, PostHog-only tracking implied (no wiring in a static mock).
- **DD-006, DD-007** — static triptych hero, text-led, homepage order (hero → flags → board).
- **DD-008** — cockpit is a full-screen surface reached from a compact chip, not an always-visible section.
- **DD-009** — respected as a constraint: nothing here reuses `storyboard.html`'s palette/analytics visuals, only its flow/copy.
- **DD-010** (this mock's primary deliverable) — thick chassis, near-white canvas, monochrome/graphite materiality, sparse semantic accents, no large release-blue fields. **Still Provisional** — this file is the pixel-level validation DD-010 called for; it does not self-promote to Locked.
- **DD-011** — Amplitude-informed dominant/diminished funnel hierarchy built per the research doc; **still Provisional** pending review of this exact cockpit mock.
- **DD-016** — `DESIGN.md`'s behavior/accessibility/content contracts weren't touched; only visible composition/materials/palette were redesigned here.
- **DD-017** — no default gradients anywhere; the one seam-feather idea is gated behind an explicit, force-hidden-in-capture PROPOSAL toggle (§5).

---

## 5. Proposal items needing explicit approval

**PROPOSAL — hero band seam material-light feather (DD-017).** Default seams between MVP|BETA and BETA|GA are plain 1px hairline rules. A secondary treatment exists — `.hero-seam-proposal`, a soft linear-gradient feather roughly mimicking the storyboard's old (unapproved) seam glow — visible only via the "Show seam proposal" reviewer toggle and tagged inline with a dashed-coral "PROPOSAL — feather seam" label. It is force-removed under `?capture=1`/`#capture` so it can never ship in a still by accident. **This needs an explicit yes/no from Garvit or Codex before it can become the default** — until then, the hairline stays the shipped answer.

No other gradient, glow, or lighting device exists anywhere in the file (onboarding stage, hero bands, cockpit chart, cards) — everything else is flat fills, hairline rules, or repeating-linear-gradient hatch/grid textures (which the brief explicitly permits as materiality, distinct from a decorative color-blend gradient).

---

## 6. Dark stress-check

Light is primary. Dark mode (toggle or `prefers-color-scheme`) inverts `--canvas`/`--panel`/`--ink`/the graphite scale, so the homepage chassis border/canvas relationship flips to white-on-near-black automatically — no per-component dark overrides were needed there. The onboarding stage and the hero's GA band deliberately do **not** invert (`--stage-ink` is a fixed constant, never redeclared inside the dark blocks) — they're authored dark surfaces already, same logic as the cockpit's own fixed instrument palette, which was always independent of the toggle. Verified at 1440×900: Homepage and Welcome both hold up — chassis border inverts to white, GA/stage-ink stays dark, all text stays legible, the `dark_mode` flag chip correctly flips to "on" with a lime dot.

---

## 7. Reuse map (mock surface → production component/mechanic)

Cross-referenced against `docs/storyboard-recovery/reuse-retire-inventory.md`.

| Mock surface | Maps onto (production) | Notes |
|---|---|---|
| Welcome / Persona / Punchline stage | New `src/features/onboarding/Act1Overlay.tsx` / `Act2Overlay.tsx` / `Act3Overlay.tsx` + `IntroDirector.tsx` state machine | Visual shell is new; persona **choice** handling (`personaChoices` array, `PERSONA_STORAGE_KEY` logic) reuses `PersonaSatire.tsx`'s existing functions. **`PersonaSatire.tsx`'s `skip()`/dismiss() behavior is never reused (DD-002)** — V1 persona selection has no skip path, matching this mock (no skip affordance drawn in the Persona state). Eligibility to show onboarding again is a **persistent `completedAt` timestamp (24h)**, not a session flag; an **abandoned mid-flow session uses tab-local state** and returns the visitor to the Persona step (not back to Welcome) if they come back within the same tab. |
| Reveal (in-place dissolve) | `IntroDirector`'s Act3→Homepage transition | The inventory doesn't name a dedicated component for this transition; it's a CSS/motion concern at the point `IntroDirector` unmounts, not a new persistent surface. |
| Homepage hero triptych | New `TriptychHero.tsx` replacing `HeroEvolution.tsx` | Per the inventory, `HeroEvolution`'s animated phase-cycle logic and `.phaseRail` UI fully retire; only the intro-copy/CTA structure and `data-*` mascot/journey/download attributes from `Hero.tsx` lines 13–38 carry forward. This mock's static (non-animated) triptych matches DD-006's locked direction. |
| Guide integration + tracking chip | `src/features/world/GuideScene.tsx`, `guide-rig.ts`, `guide-materials.ts` (world feature, unchanged) + `AgentStatusChip.tsx` (new) | World/guide rendering pipeline survives untouched; the chip is new per the inventory's "New surfaces needed" list. |
| Feature flags row | `src/features/flags/**` + `src/components/ops/FeatureFlagDock.tsx` | Flag system (definitions, `useFeatureFlags`, event emission) is unchanged; only this mock's chassis-chip visual treatment is new — the inventory calls this exact scope ("recomposed in a new layout, business logic unchanged"). |
| Board preview (GAR-101 peek) | `src/features/board/InteractiveBoardSection.tsx`, `CasePreview.tsx` | Entire board feature (physics/drag/case preview) survives unchanged; only the peek-card framing here is restyled to the chassis language. |
| Session cockpit | New `src/features/journey/SessionCockpit.tsx` replacing `SessionJourneySection.tsx` | Per the inventory, all funnel math/state survives (`journey-store.ts`, `deriveJourneyInsights`, `furthestJourneyStage`, `subscribeJourney`, etc.) and extracted helpers (`labels` map, `typicalVisitor` benchmark, `formatDuration`) feed this new visual shell directly. Modal/a11y plumbing (focus trap, Escape-close, overlay) can reuse `CasePreviewDialog`'s Radix Dialog wrapper per the inventory's explicit reuse contract. |
| Theme toggle (light/dark) | `src/components/chrome/ProductChrome.tsx` | Chrome/header survives unchanged; this mock's toggle mirrors its existing behavior for QA purposes only. |

---

## 7a. V1 guide render contract (binding, this correction round)

- **Supported tier** — the Welcome moment and every subsequent guide appearance (Persona standing-by, Punchline reaction, Homepage GA integration, and any cockpit guide presence) reuse the **existing live Muko WebGL scene** (`GuideScene.tsx` / `guide-rig.ts` / `guide-materials.ts` — world feature, unchanged, per the reuse map above). This mock's static `guide-alpha-*.png` stills are **placeholders standing in for that live WebGL render** — they are not a proposal to ship static images on the supported path.
- **Fallback tier only** — the transparent-poster still treatment is the fallback for browsers/devices that can't run the WebGL scene (no-WebGL, reduced-motion, low-power). It is not an alternate V1 render path for supported browsers; both tiers happen to be represented by the same mock stills here purely because this is a static design-language artifact, not a build.
- **No new character production in V1.** Any vintage-anime guide treatment is **V2, tracked under DD-013** — explicitly out of scope for this mock and for V1 engineering.

---

## 8. Open questions for the design lead

1. **Seam proposal (§5)** — approve the feathered material-light seam as the shipped default, keep the hairline, or reject the idea entirely? Needs a DD-017 status update either way.
2. ~~**Cockpit funnel semantics**~~ — **RESOLVED (§10, correction round 2026-08-18).** Decided: the dominant pane is *this visitor's own session* (binary reached/in-progress/not-yet per stage, no aggregate numbers); the diminished pane is an explicitly-labeled authored benchmark and is the only place aggregate percentages live. See §3 and §10 for the shipped version and the coral-placement rationale.
3. **Benchmark pane numbers** (100/58/24/9/2) are illustrative placeholders distinct from the visitor's own pane, chosen only to make the two panes visually distinguishable. They're not sourced from anywhere — need real (or intentionally-fictional-but-decided) benchmark data before production. Still open.
4. **MVP/BETA/GA darkness gradient** — confirm the "maturity = increasing resolution/solidity, all in one dark register" reading is the right metaphor, versus a lighter MVP that would need the headline/CTA copy to shift color per-band (rejected here for a contrast-safety and one-continuous-surface reason, but it's a legitimate alternate direction).
5. **Reveal state** — confirmed useful as a design-review artifact (shows the dissolve concept as a still); flag if it should also exist as a real reachable product state in production, or if it stays storyboard/mock-only illustration of the transition note.
6. **Persona disclosure wording (new, §10)** — the false "your pick is logged via PostHog. nothing else is." line was replaced with the minimal, truthful "your pick goes to PostHog." That's a placeholder-grade fix (accurate, not exclusive-claiming) rather than a final-copy decision — confirm the exact phrase before lock, or supply preferred copy.

---

## 9. Self-QA record

Screenshotted every state at 1440×900 and at the harness's available mobile width (~600–610px CSS px — the browser-automation tool clamped window resize to that floor rather than true 390px; the 760px mobile breakpoint is exercised correctly at that width, but native-390 has not been visually confirmed). One correction round was spent on three bugs found during that pass, in this order: (1) guide-render helmet clipping in Welcome/Persona/Punchline, (2) unreadable hero headline/intro on the light MVP/BETA bands, (3) mobile GA fill not layering behind the copy/CTAs (echoing the same bug class the storyboard itself had already solved once). All three are fixed and re-verified in the screenshots above. Dark mode spot-checked on Homepage and Welcome.

---

## 10. Correction round — 2026-08-18 (binding, Garvit + Codex direction audit)

Single correction round applied to `neo-futurist-mock.html` in response to four binding corrections from the direction audit. All four are implemented:

1. **Cockpit semantics decided.** The dominant left pane (`.ck-pane-you`, now labeled **"YOUR SESSION · LIVE"**) represents *this visitor's own session* across five stages — **Landed / Scrolled / Played / Read work / Contact** — each rendered as one of three binary states: **reached** (solid lime, full-height bar), **in progress** (half solid lime / half crosshatch — the visitor's current stage; illustrated here on "Read work"), or **not yet** (full crosshatch, no solid fill; illustrated on "Contact"). The old 100→71→34→19→6-style declining-percentage funnel and its Users/Convert% table are gone from this pane — the table now reads Stage/Status. The right pane (`.ck-pane-bench`) is the *only* place aggregate-style percentages live, and is now explicitly labeled **"TYPICAL VISITOR · AUTHORED REFERENCE"** so it can never be mistaken for a live measurement of this visitor. §3 and §8-item-2 are updated to match; the open question that ambiguity created is marked resolved.
   - **Coral-placement decision:** moved from the visitor's pane to the benchmark pane's biggest drop (Landed→Scrolled, 100%→58%, marked on the "Scrolled" bar) — same visual convention (outline + drop-mark dot) as before, just relocated. Rationale: "biggest drop" is a magnitude between two aggregate percentages; the visitor's own pane no longer has percentages to compute a drop from, so marking it there would either be meaningless or falsely imply that pane is also aggregate data. The visitor's furthest-not-reached stage ("Contact") gets a plain crosshatch like any other not-yet stage — coral keeps one meaning (biggest drop in the authored reference curve) instead of doing double duty across two different data types.
   - Renamed the five stages everywhere in the cockpit (chart, table, instrument card, insight copy) to the new taxonomy. Also softened the two homepage/reveal tracking-chip `aria-label`s from "4 of 5 stages reached" to "4 of 5 stages tracked," since one of the four is now precisely "in progress," not "reached" — the chip's visible text ("TRACKING · 4/5") already read fine as a single ratio and didn't need to change.
2. **False trust-line copy removed.** `"your pick is logged via PostHog. nothing else is."` is gone from the Persona disclosure — it was false (PostHog's pageview/autocapture already sees more than the pick). Replaced with `"your pick goes to PostHog."`, which claims no exclusivity. **Flagging this exact replacement wording as a design-lead call** (see §8 item 6) — it's minimal and truthful but not asserted as final copy. The cockpit's own trust line — `"this funnel is computed in your browser. PostHog sees the rest. I check it obsessively."` — was already accurate and is untouched, verbatim. Persona choice still doesn't personalize anything downstream (the Punchline copy was already, and remains, persona-invariant: "Noted. This changes nothing. It never does.").
3. **V1 guide contract + reuse-map correction recorded** — see new §7a (Muko WebGL scene is the supported-tier render for the Welcome moment and all agent reactions; transparent posters are fallback-tier only; no new character production in V1, vintage-anime guide deferred to V2/DD-013) and the updated Welcome/Persona/Punchline row in §7 (PersonaSatire's `skip()`/dismiss() is never reused per DD-002; eligibility is a persistent 24h `completedAt`; an abandoned mid-flow session uses tab-local state and returns to Persona, not Welcome).
4. **Capture-mode dark leak — verified, then hardened.** Tested empirically in a real browser render (`?capture=1&theme=dark`, computed-style inspection of every `[data-reviewer]` element via devtools) before touching any code: every reviewer-chrome element already computed to `display:none` — no live conflicting dark-theme display rule was present in the file as inherited. Rather than leave it as "already fine," consolidated the three scattered `body.capture-mode` hide declarations into one rule and moved it to be the literal last rule in the stylesheet, so cascade order guarantees it beats any dark-theme rule added later regardless of specificity — matching the audit's "must win unconditionally" instruction even though no live bug was reproduced.
5. **Homepage guide render + tracking-chip dot — pixel correction (2026-08-18, design-lead pass).** Two fixes, Homepage state only:
   - The GA-field guide (`guide-alpha-upper.png`, already the correct waist-up crop — feet flush to canvas bottom) was rendering small inside `.hero-guide-wrap`'s `object-fit:contain` box, so the letterboxing left the GA field reading empty and the character reading like a floating game asset rather than an anchored presence. Switched the wrap to a crop-to-fill treatment: `.hero-guide-wrap` grew from `width:min(24%,270px); aspect-ratio:320/300` to `width:min(26%,290px); height:min(80%,480px)`, positioned with a deliberate negative bleed (`right:-2.2%; bottom:-1.4%`) past the hero-card's inner edge; the `<img>` itself switched from `object-fit:contain` to `object-fit:cover` (scoped via `.hero-guide-wrap .guide-render`, not the shared base `.guide-render` rule, so onboarding's `.guide-wrap` states are untouched). Net effect: the character is materially larger, its feet are cropped clean by the card's bottom chassis border, and its right shoulder/arm bleeds past the right border — both crops happen because `hero-card` already has `overflow:hidden` (its own chassis frame doing the cropping, not a new wrapper), so the tracking chip — a sibling of the `<img>`, absolutely positioned outside the wrap's box — stays fully unclipped. Verified via screenshot at 1440 (light + dark) and 390: headline/CTA legibility and positioning are unchanged (copy stays within its existing 56%-max-width left column; the guide occupies the right/GA field only), and at 390 the CTAs (in document flow before the guide) and the tracking chip (visually separated above the guide image) both remain fully visible. Mobile's `.hero-guide-wrap` rule gained an explicit `aspect-ratio:3/4` (replacing the aspect-ratio that used to live only in the now-crop-to-fill base rule) so the mobile box keeps a definite, proportionate height under `object-fit:cover`.
   - `.hero-status-dot` (the "TRACKING · 4/5" chip's healthy-status dot) was coral — sharing a color with the register's actual alert semantics (`.flag-chip.locked .flag-dot`, `.ck-table .drop-dot`, both benchmark-drop/locked-state signals per §2's token table). Changed to `var(--lime)`, matching the cockpit's own healthy-status dot (`.ck-status-dot`, already lime) and the flags row's "on" dot (`.flag-dot.on`) — coral now reads exclusively as the alert/drop/locked signal everywhere in the file, restoring the single-meaning-per-accent-color rule the token table already documented but this one dot had drifted from.
   - Scope note: `.hero-guide-wrap`/`.guide-render`/`.hero-status-dot` are shared classes also used by the Reveal state's homepage-echo block (§3, "same markup/classes as the Homepage state, so the reveal shows the real surface, not a stand-in" — a pre-existing, intentional design choice, not something this round changed). Recapturing only re-shot `homepage-1440-light/dark.png` and `homepage-390-light.png`; Reveal's own capture was left as-is per this round's scope.
