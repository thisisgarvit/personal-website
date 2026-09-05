# Opus design/contradiction review — recovery storyboard

**Subject:** `docs/storyboard-recovery/storyboard.html` + `storyboard.md`
**Method:** rendered review (served locally, Playwright captures at 1440×900 light+dark and 390×844, per-frame) plus full CSS/markup read. `captures/` was empty at review time; captures were made fresh and inspected.
**Reviewed against:** the six locks (a–f), DESIGN.md (palette/gradient/typography/microcopy/anti-slop + 2026-08-17 amendments), the rejection history (illegible 1.5s hero transition, persona tray occluding headline, PostHog-leading persona copy, 9-surface first-viewport noise, floating dock collisions, watermark guide), and the UX laws (zero-homework as amended, founder-10-second, big CTAs, headline legibility, one dominant element, portfolio-not-resume).

---

## 1. Verdict per frame

### Frame 1 — Act 1 welcome: **CONSISTENT**

- Lock (b) "no Skip/click-outside/Escape dismissal; Continue may accelerate": expressed by omission — no skip/close/escape affordance anywhere in the composition; single lime Continue with microcopy "Continue accelerates the next beat — it doesn't skip past it." Correct expression of "accelerates, doesn't skip."
- Lock (f) "onboarding owns all cinematic motion": the dark stage is the only cinematic surface; no motion leaks to the homepage. Consistent.
- Rejection history: headline is fully legible over the dark stage at both breakpoints (verified in captures); the guide bleeds in from the right and does not occlude copy. No re-introduced failure mode.
- Two notes, neither blocking: (1) the stage's faint blue radial + starfield are gradients — covered by the ruling in §2 (needs a scoped DESIGN.md exemption for authored onboarding stages, or simplification); (2) the guide render is a flat full-body near-T-pose asset drop — acceptable as storyboard stand-in, but production Act 1 must use an authored pose/crop of the Gate-A Muko guide, or it reads as a game-NPC asset, which DESIGN.md's slop list rejects.

### Frame 2A / 2B — persona + punchline: **CONSISTENT, with three required fixes**

- Lock (a): four chips render identical size/weight/treatment; "Just browsing" gets the same card, no ghost styling. Verified in captures. Consistent.
- Lock (b): no back/skip/close in 2A. Consistent.
- Punchline copy is the exact locked line ("Noted. This changes nothing. It never does.") and is the dominant element of 2B; PostHog disclosure is corner-positioned, subordinate, last in reading order. This correctly inverts the rejected "PostHog-leading persona copy."
- **Fix 1 — disclosure timing (contradiction-adjacent).** The surviving Scene-1 amendment rule is "the tray discloses this **before** input." The storyboard's only disclosure is in 2B — *after* the pick has already been logged (lock d: timestamp writes on selection). As drawn, logging precedes disclosure. Add one subordinate mono line in 2A (below the chip-row, muted, never the lead) — e.g. "your pick is logged via PostHog. nothing else is." This is not the rejected "PostHog-leading" failure; leading ≠ present-but-subordinate.
- **Fix 2 — WCAG failure on the fine print.** `.chip-note` and `.f2b-fineprint` use `color: var(--rule)` (`#AEB7AD` on `#EDF0EB`/`#F8F9F4` ≈ 1.7–1.9:1). DESIGN.md: "All text/background pairs must pass WCAG 2.2 AA before approval," and `--color-rule` is a border token, not a text token. Use `--color-muted` (`#5F675F` light / `#A9B2A9` dark). The PostHog disclosure especially cannot fail contrast — an illegible disclosure is not a disclosure.
- **Fix 3 — annotation/product ambiguity.** The 2A caption "all four are the same size, same weight — opting out costs nothing" is design commentary styled as product copy. A builder will ship it. Restyle it in the dashed `frame-label` annotation style or move it to storyboard.md. As product copy it is self-referential narration, which is off the candor register (candor is about the *work*, not about the UI describing itself).

### Frame 3 — clean homepage / triptych hero: **CONTRADICTION (fixable), otherwise consistent**

Consistent with the locks:
- Lock (f): static one-card triptych — MVP/Beta/GA are simultaneous background bands under one continuous rounded surface; no autoplay, no animation cues, no replay rail. Headline/intro/CTAs are a single unbroken text layer, fully legible over every band at 1440×900 and 390×844 in both themes (verified). Region tags present and quiet. Exact locked hero sentence and both locked CTA labels ("Download resume", "Contact Garvit").
- Flag dock sits in normal document flow under the card (no floating-dock collision possible); cockpit teaser is a distinct pill; no persona tray, avatar, or Act-2 residue anywhere; one dominant element (the headline). First viewport is ~6 quiet surfaces, not 9. Board sliver signals continuation. The rejected failure modes are genuinely absent, not re-costumed — with one exception below.

**Contradiction 1 — production gradients (see full ruling in §2).** The GA band is a 135° three-stop blue gradient, backed by a blurred lime/blue radial "glow" behind the guide and a lime radial in `ga::after`; the mobile card background is another linear gradient. DESIGN.md is unambiguous: "No gradient is part of the production visual language," and the release color's concept defense says "a single solid release color … is explicitly not a gradient" — written *specifically about hero identity*. Violation as drawn.

**Contradiction 2 — watermark guide, new clothes.** The radial mask on the baked-background webp renders as a large dark oval halo around the astronaut sitting on the blue field — pronounced on desktop, severe at 390px, where it reads as a dark sticker pasted on the card. This is the "watermark guide" rejection re-entering via masking. The storyboard's own open question 2 treats the alpha-channel asset as optional; it is not (ruling in §3.2).

**Contradiction 3 — CTA size.** `.btn` renders ≈42px tall. DESIGN.md §5.5 locks **56px minimum height** for both career CTAs, with visible focus ring. The storyboard under-draws the most important controls on the site (big-unmissable-CTAs law + explicit lock). Needs at least a spec note; preferably redraw.

**Deviation 4 — experiment strip copy.** The strip reads "session variant · B · instrumented in your browser / no cookies until you say so." DESIGN.md locks the strip copy: "You're in variant B of this hero. Variant A converts worse." The replacement drops the locked joke and adds "no cookies until you say so" — an *unverified factual privacy claim* (PostHog's default persistence uses cookies/localStorage; "until you say so" implies a consent gate that doesn't exist in the analytics contract). DESIGN.md forbids invented claims. Restore the locked line, or route the new copy to Garvit as an explicit copy-change request — not silently.

Minor: DESIGN.md §5.4's hero metadata line ("Product manager · available for the right problem") is absent; either carry it into the new card or record its retirement in the DESIGN.md amendment. The guide-as-cockpit-entry (lock e) has no visible affordance beyond "guide — online"; acceptable at storyboard fidelity, but implementation needs hover/focus treatment so the first entry point is discoverable.

### Frame 4 — session cockpit: **CONSISTENT**

- Lock (e): genuinely bespoke full-screen surface (fixed instrument-dark, not a themed modal, no CasePreview visual DNA); agent status chip top-left; plainly visible circular close top-right as the only exit; funnel gets full-width; paired you-vs-benchmark bars with step-over-step drops — the benchmark comparison is visible at every stage, which is the right call. Trust line is **verbatim** the locked disclosure, small/italic/rule-separated. Old funnel shell nowhere present. Consistent.
- Two mock-data defects that will distract the human review (see §4): the 3/5 chip contradicts the funnel, and single-session percentages are conceptually wrong.
- Density question (Sonnet's worry): five stages with paired bars is fine at this width — it reads in one scan because the side column absorbs the numbers. Do not reduce.

---

## 2. The gradient ruling

**Does DESIGN.md's no-gradient rule apply to the hero card?** Yes. The hero card is production visual language on the production homepage; the rule's only written exemption is "a short edge fade used solely to separate scrolling content from translucent chrome." The "authored fixed color object" framing does not exempt it — the no-gradient concept defense is attached to `--color-release` and hero identity specifically. There is no reading of the current DESIGN.md under which a 135° three-stop hero gradient is legal.

**Ruling, item by item:**

| Treatment | Ruling |
|---|---|
| GA band `linear-gradient(135deg, #333EDD → release → #2A34C4)` + mobile 160° equivalent | **Violation. Fix, don't amend.** Solid `--color-release` is the entire point of the token. The triptych story does not need a modulated blue; it needs *graphite → blueprint → release-blue*. |
| `hero-guide-glow` (blurred lime/blue radial) and `ga::after` lime radial | **Violation.** This is "glowing gradient fog" from the banned-defaults list, in the accent color. Once the alpha-channel guide asset exists, replace with a flat authored underlayer shape or a hard-edged contact shadow. It currently also worsens the watermark halo. |
| The two feathered **band seams** (s1, s2) | **Authored-texture exception — allowed, but only with an explicit DESIGN.md amendment.** A seam crossfade between two documented solid fields is structurally the same move as the exempt chrome edge fade: it separates/joins surfaces, it is not decorative color. Amend DESIGN.md §3.1 with a named exemption: "triptych band-seam crossfade: ≤10% card width, between the three documented band colors only." Without the amendment, implementers will correctly refuse to build it ("close enough values are not allowed"). |
| Act 1 / cockpit fixed dark stages, Act 1 faint radial stage-light + starfield | **Scoped exception in the same amendment.** These are authored scripted surfaces the locks explicitly grant to onboarding ("onboarding owns all cinematic motion"). Name them: "onboarding acts and the session cockpit are fixed authored dark surfaces, exempt from theme tokens; Act 1 may use one static authored stage-light." If the amendment isn't wanted, the radial must go too. |

Net: **two violations to fix in the storyboard, one two-part DESIGN.md amendment to write.** Do not stretch the amendment to cover the GA-band gradient or the glow — that would hollow out the single-accent/no-gradient discipline that survived every prior correction.

---

## 3. Sonnet's four open questions — answers

**3.1 Single-headline triptych vs three literal panels → single-headline. Committed correctly.**
Three panels each repeating composition means three headlines, three copy blocks, and a 3-card grid — which is simultaneously the "one dominant element" law broken, the 9-surface noise failure reborn, and the generic template smell (rounded cards everywhere) DESIGN.md bans. The single unbroken text layer is the only reading that satisfies "words stay fully legible everywhere." The at-a-glance "one card vs three glued cards" risk lives almost entirely in the hard Beta→GA seam plus the guide halo; fix those (solid GA band, alpha asset, amended seams) and the card reads as one authored surface. Do not revisit the composition.

**3.2 Transparent guide asset → make it a requirement, not a request.**
The rendered captures settle this: the radial-masked baked-background webp produces a dark halo blob on the blue field at every breakpoint — worst on mobile — and it is the watermark-guide rejection in new clothes. Production already owns the Muko GLB and a poster pipeline; rendering an alpha-channel (or blue-matched) poster crop is cheap. **Gate the Frame-3 build on the alpha asset.** The mask trick is storyboard-only and must not ship.

**3.3 Degraded-tier frames before implementation → no new frames; one tier matrix, required.**
Lock (c) says degraded tiers keep the *same DOM flow* with poster garnish — so a degraded frame would be Frame 1/2/3 again with a static image swapped in; drawing it adds nothing. What implementation actually needs is a behaviour table appended to storyboard.md: rows = full JS / degraded (reduced-motion, Save-Data, low-capability, renderer-fail) / no-JS + crawler; columns = Act 1, Act 2, homepage hero, cockpit; cells = what renders and what is bypassed. That table is required before build (it is where lock c and lock d's reload rule become testable); a fifth frame is not.

**3.4 Mobile: GA-only vs compressed triptych → GA-only, plus the thin three-segment strip.**
GA-only is the right base call: three bands in 390px is noise and endangers the headline, and no-JS/reduced-motion clients already receive GA per the Scene-1 amendment — mobile-GA is consistent with that precedent. But adopt the storyboard's own hedge: a thin three-segment MVP/BETA/GA strip (a few px tall, at the card's top edge or under the GA tag) so the progression story is *hinted*, not deleted, at zero legibility cost. Note that once the GA band is solid release-blue (per §2), mobile-GA-only becomes even cleaner.

---

## 4. Composition risks the builder missed

1. **Cockpit data contradicts itself.** Chip and teaser say `3/5 stages`, but the side column says furthest stage = *Contact* (stage 5) and the funnel shows Contact reached at 38%. Humans reviewing will trip on this before they see the design. Make the mock coherent (chip `5/5`, or furthest stage `Opened a prototype` with the Contact row at benchmark-only).
2. **Single-session funnel semantics are wrong.** For one visitor, each stage is binary — "you: 92%" is impossible. As designed, the % column and partial "you" bars describe a cohort, not this session. Decide now (it changes the drawing): "you" bar = full/empty (reached or not), percentages belong to the benchmark bar, drop labels describe the benchmark. Otherwise the cockpit's candor premise ("computed from what you actually did") is undermined by numbers that can't be true.
3. **Fine-print contrast** (§1, Frame 2 fix 2) — repeated here because it's a hard DESIGN.md gate, and it also applies to the Frame-3 A/B strip text, which uses `--rule` on `--panel`.
4. **Disclosure-before-input** (§1, Frame 2 fix 1).
5. **Experiment-strip copy drift + invented cookie claim** (§1, Frame 3 deviation 4).
6. **CTA heights below the 56px lock** (§1, Frame 3 contradiction 3), including Act 1's Continue (~46px) if the big-CTA law is applied to onboarding.
7. **DESIGN.md §5.4 conflict is unresolved on paper.** The locked hero is now a *card* triptych, while DESIGN.md still specifies a "broad, mostly borderless release field" and the 2026-08-17 correction says "not a hero card followed by dashboard panels." The locks supersede, but DESIGN.md must be amended in the same pass as the gradient exemptions, or the next implementer inherits two contradictory sources of truth.
8. Minor: mobile Frame 3's "guide — online" caption is clipped under the CTA stack; the annotation `frame-label` overlaps the `garvit` logo and the Frame-4 status chip in captures (annotation artifact only — but move the labels a step down so codex+Garvit's captures aren't confusing).

---

## 5. Final recommendation

**NOT ready as-is. Ready after one short edit pass** — everything below is mechanical; the composition, flow, and lock-expression are sound and no frame needs redrawing from scratch:

1. GA band (desktop + mobile) → solid `--color-release`; delete `hero-guide-glow` and the `ga::after` lime radial.
2. Fine print / captions / A/B strip text: `--rule` → `--color-muted` (AA).
3. Add the subordinate pre-input PostHog line to 2A; keep 2B unchanged.
4. Restyle the 2A equal-weight caption as annotation (or move to storyboard.md).
5. Restore the locked experiment-strip copy (or flag the new copy + cookie claim as an explicit change request to Garvit).
6. Fix cockpit mock coherence (3/5 vs Contact) and note the binary-"you"-bar decision in storyboard.md.
7. storyboard.md additions: 56px CTA minimum note; degraded-tier matrix (§3.3); upgrade the alpha-channel guide asset from "worth a request" to "required before Frame-3 build."
8. Draft the DESIGN.md amendment (band-seam crossfade exemption, onboarding/cockpit authored-dark-surface exemption, hero-card-vs-borderless-field reconciliation, §5.4 metadata line disposition) so it lands with Garvit's review rather than after it.

With those applied, this storyboard faithfully expresses all six locks, re-introduces none of the six rejected failure modes, and is fit for codex+Garvit attention.
