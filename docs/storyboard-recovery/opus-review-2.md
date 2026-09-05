# Opus review 2 — recomposition delta (one locked surface, four states)

**Subject:** `docs/storyboard-recovery/storyboard.html` + `storyboard.md`, after the mechanical fix pass (all of opus-review.md applied) and after Garvit's composition clarification (onboarding is ONE locked fullscreen surface with internal states — not pages/routes/scroll-sections/screens).
**Method:** fresh render (Playwright, `file://`, 1440 light + dark and 390 light, full-page + `.stage-filmstrip` / `.continuity-strip` clips) plus full markup/CSS read. The `captures/` PNGs and the parallel-lane scratchpad captures (`*-f1/f2a/f2b/f3/f4`) are **stale** — they predate the recomposition and use the old three-frame naming; ignored. This review is against the freshly rendered filmstrip.
**Scope:** delta only — the five questions in the brief. Everything opus-review.md already cleared is not re-litigated except to confirm it survived.

---

## 1. Central question — can the four states be misread as separate pages? Almost no. One contradiction to remove.

The filmstrip device works. At 1440 and stacked at 390, in both themes, the "one surface across time" reading is carried by **five reinforcing signals**, which is more than a still storyboard usually manages:

- Section eyebrow `ONE STAGE, FOUR STATES` + header chip `ONBOARDING · SAME SURFACE = INTERNAL STATES` + title "A single locked surface — arrival → persona → punchline → reveal".
- Four **identical** dark stage panels — same aspect ratio, same radial+starfield treatment, same rounded chrome, same `LOCKED SURFACE` corner chip on A/B/C.
- The connective **arrows carry "same stage" captions** ("chips replace the welcome copy — same stage", "selection resolves into the punchline — same stage", "one dissolve — the only transition out"). This is the single most effective anti-"separate screens" cue — the transitions are explicitly labelled as in-place.
- The `no scroll, no dismissal — surface is locked until selection` dashed annotation above the strip.
- The `GUIDE CONTINUITY` dotted track below, one node per state, same art asset repositioned — the explicit motion-path device the brief asked for. It reads clearly and does its job.

Judged individually: **filmstrip — strong; continuity strip — strong; State D reveal — clear** (see §4). A reviewer is not going to walk away thinking these are four routes.

**The one thing that fights all of the above — a genuine contradiction the fix pass missed:**

**C-1 (blocking, one-line fix). State B's kicker literally reads `act 2 of 3`** (`storyboard.html:841`). This is the exact framing the recomposition exists to kill: it labels a state an "act", numbers it, and asserts a set of "3". It is the only place in the whole artifact that contradicts "one surface, four states", and it sits in the busiest panel where a reviewer's eye lands. It also mis-counts (four states, "of 3") and is inconsistent with State A's kicker (`garvit.app — session boot`). Replace with a non-counting, non-"act" kicker in State A's register — e.g. `garvit.app — persona` or `same stage · persona` — or drop it. This edit is the difference between the central question being "no" and "mostly".

**C-2 (minor, related). The three-segment `stage-progress` tracker** (`:824,:850`) is defensible on its own (three input beats — arrival/persona/punchline — before the reveal is an exit, not a beat), but paired with "act 2 of 3" it compounds the "3 discrete steps" read. Once C-1 is fixed the tracker is fine as-is; if you want zero ambiguity, relabel it in `storyboard.md` as "input beats, not pages" so an implementer doesn't wire it to a router.

---

## 2. Prior fix pass — survived the recomposition. Spot-checked in the render.

| opus-review.md fix | State in this render | Verdict |
|---|---|---|
| GA band → solid `--color-release`, no gradient/glow | `.hero-band.ga` + `.mock-band.ga` both `background:var(--release-blue)`, flat; no `ga::after` lime radial | **Held** |
| Porthole guide, no watermark halo | Hard-edged bordered dark porthole crop inside GA band; clean at 1440 and 390, no dark halo blob | **Held** |
| 56px CTAs | `.btn min-height:56px`; both hero CTAs render at height in the shot | **Held** |
| Disclose-before-input | State B: `your pick is logged via PostHog. nothing else is.` sits **above** the chip row | **Held** |
| Locked-surface strip copy | `no scroll, no dismissal — surface is locked until selection` verbatim above the strip | **Held** |
| Coherent cockpit story | Chip `TRACKING · 4/5`, funnel 4 reached + Contact `not yet`, furthest stage `Opened a prototype`, teaser `4/5 stages` — all agree. Binary "you" bars confirmed in markup (`width:100%` ×4, `width:0%` ×1, `reached`/`not yet` tags) | **Held — and the 3/5-vs-Contact contradiction is gone** |
| Muted fine print (WCAG) | `.chip-note`/`.f2b-fineprint` no longer on `--rule`; State-B disclosure light-gray on near-black stage passes AA | **Held** (nit: disclosure uses a raw `#8B93A7` hex, not a token — cosmetic, not a contrast fail) |
| Restored A/B strip locked copy | `YOU'RE IN VARIANT B OF THIS HERO. VARIANT A CONVERTS WORSE.` — the invented "no cookies until you say so" claim is gone | **Held** |

No regressions. The mechanical pass landed cleanly.

---

## 3. Homepage frame order / subordination — matches the clarification.

Reading top-to-bottom in the render: **dominant headline text block** ("I turn fuzzy product ideas into things people can use", intro, two CTAs) sitting unbroken across the triptych surface → **flags subordinate** (the quiet `persona_overlay / triptych_hero / cockpit_v2` chip row + the re-styled cockpit teaser, both below the card in normal flow) → **board sliver below** (`Board ↓`). This is exactly "dominant triptych text block, flags subordinate, board below."

The **re-styled cockpit teaser** is correct: quiet panel background + hairline border + blue accent (`Your session, instrumented · 4/5 stages → open cockpit`), no longer a solid dark-ink fill competing with the hero — it reads as one subordinate below-hero row, not a second CTA. Triptych legibility holds: headline is fully legible over all three bands in both themes; single-accent discipline intact (MVP graphite hatch / BETA desaturated cyan grid / GA the only accent). No persona residue on the homepage. Frame annotation `FRAME 3 · AFTER STATE D — HOMEPAGE` even reinforces the continuity claim.

---

## 4. State D transition — production recommendation.

**Recommend: an in-place feathered dissolve of the stage layer** (the covering surface dissolves/lifts to reveal the homepage sitting in the same screen position beneath it), **not** a straight wipe, fade-through-black, or scale-recede.

One-line reason (apple-design §7 spatial consistency + §12 "materialize, don't just fade"): only an **in-place** reveal communicates "the homepage was already there underneath" — a wipe or a scale-recede both read as *moving between two separate screens*, which is the precise misread the whole recomposition fights; fade-through-black additionally hides the reveal and violates the "no abrupt brightness jump" guidance (§14).

Production note for codex: the storyboard's hard-edged diagonal lime seam is a good *still* proxy for "which layer is leaving", but in motion soften it into a feathered luminance dissolve with a slight blur+scale-up on the departing stage (so the stage reads as real material leaving, not a graphic wipe), homepage static beneath, and keep it interruptible/reduced-motion-swappable per the tier matrix. The diagonal-clip's one real virtue — the guide fading *within the same clipped region* so it's visibly the same material receding — should be preserved.

---

## 5. New risks the recomposition introduced.

1. **`act 2 of 3` (C-1 above)** — the only substantive one; a leftover from the three-act model that the recomposition otherwise scrubbed. Blocking because it directly contradicts the central claim.
2. **Kicker inconsistency across states** — State A has a kicker (`session boot`), State B has a different one (`act 2 of 3`), C/D have none. Distinct per-state "page-header" kickers subtly imply distinct screens. Fixing C-1 by harmonising the kicker register (or dropping B's) resolves this too.
3. **Three-segment progress tracker vs four states** (C-2) — count mismatch; low risk once C-1 is gone, worth a one-line note in `storyboard.md`.
4. **Deferred, already flagged (not new, not blocking):** the mobile thin three-segment MVP/BETA/GA strip is still "not yet drawn" (`storyboard.html:771`, and the §4 open-question in `storyboard.md`) — mobile is GA-only as intended; the hinting strip is an acknowledged next-pass addendum, correctly carried in the md.

No other recomposition-induced breakage. The State D panel, continuity strip, and the four-up layout introduced no contrast, legibility, or flow problems in the render.

---

## Verdict

**Ready for codex + Garvit after one edit** — fix **C-1** (`storyboard.html:841`: replace `act 2 of 3` with a non-counting kicker in State A's register, or drop it). That single change removes the only real contradiction to "one locked surface, four states."

Optional, non-blocking, fold in if touching the file anyway: note the progress-tracker semantics in `storyboard.md` (C-2); harmonise the per-state kicker treatment (risk 2); record the State-D "in-place feathered dissolve" call from §4 in the open-questions section so it reaches production motion.

Everything the prior pass fixed survived; the homepage subordination, cockpit coherence, and the filmstrip device are all sound. No frame needs redrawing.
