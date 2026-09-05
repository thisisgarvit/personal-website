# garvit.app recovery — storyboard notes (V2)

Companion to `storyboard.html`. That file is the artifact to review; this doc explains the composition choices, records the locked copy, and flags the open questions and build gates that surfaced while drawing it.

**This is the V2 rebuild per the design lead's correction verdict.** V1's filmstrip/stacked-documentation presentation is retired. Everything below reflects the new model: one full-viewport product surface at a time, reviewer chrome reduced to a small tab switcher, and a capture mode that shows pure product frames with zero storyboard scaffolding.

Type note (unchanged from V1): the HTML uses system stand-ins (`Archivo, Arial Narrow, Helvetica` for display; `IBM Plex Mono, ui-monospace, SF Mono, Menlo, Consolas` for mono) with no CDN fonts, per the no-external-requests constraint. Production should render both frames in the real Archivo and IBM Plex Mono files.

---

## Presentation model (mandate 1)

The storyboard is no longer a scrollable documentation page. It is **five full-viewport product states** — Welcome, Persona, Punchline, Homepage, Cockpit — each occupying the entire real viewport (`100dvh`/`100svh`) at any window size, including phone widths. There is no filmstrip, no stacked frame-after-frame page, no scroll-snap document.

- **Reviewer chrome** is a small pill-shaped tab bar, bottom-center, and the existing light/dark theme toggle, top-right. Both are corner-positioned, low-contrast against the page, and get a shared `.reviewer-chrome` class.
- **State switching**: clicking a tab (or any in-product element wired to `data-goto`, e.g. the Welcome "Continue" button, a Persona chip, the Homepage tracking chip, or the Cockpit close button) sets `location.hash` to the target state and swaps which `.state-panel` has `.active`. Direct links work too — open `storyboard.html#homepage` to land straight on a given state, useful for screenshotting or sharing a single frame.
- **Capture mode**: append `?capture=1` to the URL, or add `capture` as a hash token (e.g. `#homepage,capture`). `body.capture-mode` is set, and `.reviewer-chrome` (tabs + theme toggle) is hidden with `display:none !important`. What's left on screen is the pure product frame — no storyboard scaffolding, no annotation chips. One `.reviewer-note` callout exists in the whole file (the Homepage tracking-chip clickability note) and it is hidden in capture mode too.

This is a genuine behavior change from V1, not just a restyle: V1's five/six sections all lived in one scrollable document and were always all visible at once (that's what "filmstrip" and "stacked documentation page" meant in the rejected version). V2 renders one state's markup as `display:flex` and the rest as `display:none` — there is exactly one product surface on screen at a time, matching how the real onboarding-overlay-then-homepage-then-cockpit experience actually behaves for a visitor.

---

## Guide asset — RESOLVED. Real Cycles renders now in place

An earlier pass of this doc flagged the three supplied guide renders (`guide-alpha-full.png`, `guide-alpha-upper.png`, `guide-alpha-wave.png`, 1600×2000 RGBA) as **completely empty** — alpha 0 on every pixel, verified by decoding the raw pixel buffer directly, not just a visual preview. `storyboard.html` shipped an authored inline-SVG stand-in (three poses: `guide-wave`, `guide-stand`, `guide-bust`) so the rebuild wasn't blocked on it.

**Root cause, found by instrumenting the headless Blender import/render script** (`/Applications/Blender.app/Contents/MacOS/Blender -b --python … `, rendering `public/models/guide/guide.glb`): the camera framing was being sized off the wrong object. Blender's glTF importer creates a `glTF_not_exported` helper collection containing a leftover round-trip artifact (a unit Icosphere at the world origin) — a prior script version force-unhid *every* collection (including this one) while "checking for hidden collections," which pulled that junk mesh into the world-bounds calculation. Compounding that, an even earlier framing approach read the **armature** object's `.dimensions` (≈713 × 160 × 644 units — a bone-rest-pose artifact) instead of the true skinned mesh's world-space bounding box (≈1.84 × 0.44 × 1.80 m). Camera distance computed from either of those numbers put the camera nowhere near the actual ~1.8 m-tall character, so every render came back blank — deterministically, which is why all three files were identical size and equally empty.

**Fix:** compute world-space bounds only from `MESH`-type objects, transforming each `bound_box` corner through `matrix_world`, explicitly excluding the `glTF_not_exported` helper collection by name. That produced correct bounds immediately; a debug render with a solid background and world-space-bounds-driven camera showed the actual figure on the first try (saved as `assets/guide-debug-framing.png`). The model itself was never the problem — it renders a light-suit figure with blue helmet/trim/boot accents (no coral was visible in the actual bundled textures; flagged as a discrepancy below).

The rig's only baked animation (`mixamo.com`) turned out to be a single-frame T-pose with no alternate "standing" pose in the file, so the neutral standing pose used for `full`/`upper` (and the base pose for `wave`) was built in Python via `bpy.ops.object.mode_set(mode="POSE")`, empirically finding that `mixamorig:LeftArm_08`/`mixamorig:RightArm_028` local-X rotation lowers/raises each arm (same sign convention on both bones). The wave pose additionally raises and bends the right arm (`mixamorig:RightForeArm_029`) into a hand-by-the-head wave.

All three renders are genuine RGBA alpha content, content-verified by exact pixel count (not sampling):

```
guide-alpha-full.png   non-transparent: 517,453 / 3,200,000 px  (16.17%)   center px (172,172,172,255)
guide-alpha-upper.png  non-transparent: 985,890 / 3,200,000 px  (30.81%)   center px (163,163,163,255)
guide-alpha-wave.png   non-transparent: 544,761 / 3,200,000 px  (17.02%)   center px (171,171,171,255)
```

Edges were also checked by compositing each PNG over a dark release-blue background — no dark halo/fringe at the alpha boundary. `storyboard.html`'s guide placements (Welcome, Persona, Punchline, Homepage GA) now use `<img>` tags pointing at these three files instead of the SVG stand-in; the SVG `<symbol>` defs and their now-unused `--guide-*` CSS variables were removed. Re-verified by screenshotting the served storyboard at 1440px — the real render sits correctly lit, bottom-anchored, with no card/porthole/border in every placement.

**One remaining item for the design lead:** the model's bundled textures render a light suit with blue helmet/shoulder/boot trim only — no coral accent is present anywhere on the actual mesh, despite coral being called out as an expected detail and used as the guide's pager-dot accent color in the old SVG stand-in (and in `--incident-coral` elsewhere in the product palette). Worth confirming whether that's intentional or whether the production model is missing a texture pass.

---

## Welcome (mandate 2)

Cinematic, simple, one dominant idea: the guide is arriving. The real waving render (`guide-alpha-wave.png`) fills roughly 50% of the frame width and close to full viewport height, anchored bottom-center-right, on the same fixed dark authored stage (radial glow + starfield) used across all three onboarding states. Text sits to the left, vertically centered:

- **Headline (locked, verbatim):** "Welcome to garvit.app."
- **Subcopy (locked, verbatim):** "Garvit asked me to keep this brief."
- **CTA (locked, verbatim):** "Continue"

The only other mark on the surface is a small `garvit.app` wordmark, top-left — an identity mark, not a kicker or a stage-direction line. No eyebrow, no meta copy, no state-progress dots (V1 had a three-dot tracker on this state; it's cut here because it reads as storyboard scaffolding rather than product UI, and the mandate explicitly wants zero meta copy on this surface). On narrow viewports the layout stacks: guide art on top (46vh), copy below, still filling the full viewport with no scroll.

## Persona (mandate 3)

Same `.stage` class as Welcome — identical gradient anchor and starfield, not a new background, so the continuity is structural, not just visually similar. The guide moves aside: the real standing render (`guide-alpha-full.png`), bottom-right, still fully legible — "moved aside," not "gone."

**V2.1 correction:** the first V2 pass sized the wrap box to ~20% of viewport width but left `object-fit:contain` untouched, and the source render's opaque figure occupies only ~25% of the PNG's own canvas (the camera framing left a lot of transparent margin around a slim standing figure) — so the *character* actually read at only ~4% of frame width, not the ~20% the box implied, which is what the design lead flagged as "near-invisible." The fix crops in: the wrap now clips (`overflow:hidden`) a bottom-anchored `transform:scale()` on the `<img>`, so the box shows a tight crop of the actual figure instead of the figure-plus-padding. Measured result: the visible character now reads at ~12.8% of viewport width on desktop and ~20% on mobile (390px), both within the design lead's requested 12–16% / 16–22% bands, with zero head/foot clipping. Same treatment applies to Punchline below (same asset, same math).

- **Headline (locked, verbatim):** "Quick question. What brings you here?"
- **Disclosure (locked, verbatim, pre-input, small/muted):** "your pick is logged via PostHog. nothing else is."
- **Four equal choices:** Founder / Recruiter / Product lead / Just browsing — one `.persona-chip` class, identical size/weight/border for all four, 2×2 grid. Clicking any of them advances to Punchline (storyboard interaction, not a claim about which persona was "selected" in the punchline pill — that's illustrative, per the V1 note it inherited).

The disclosure sits above the chip grid, so it discloses before the pick is logged, not after.

## Punchline (mandate 4)

Same stage again. The locked line dominates the frame, centered:

- **Locked, verbatim:** "Noted. This changes nothing. It never does."

The real standing render (`guide-alpha-full.png`, same asset as Persona, at Punchline's own scale) sits to the side (bottom-right), reacting to the pick. The SVG stand-in this replaced had an animated coral pager-dot pulse on the guide's chest; that device is dropped along with the SVG — the real render has no pager badge in its geometry/textures (see the "Guide asset" note above), so "reacting" here reads through the copy and framing rather than a chest-badge cue. **No diagonal lime seam graphic anywhere in this state or anywhere else in the file.** The reveal itself — the move from Punchline into Homepage — is not drawn as a graphic at all in this pass. Per the design lead's correction, the production lock is:

> **Production note, binding:** Punchline → Homepage is an **in-place feathered material dissolve** — the dark stage's material properties (opacity/blur) resolve directly into the homepage's first viewport in place, with no directional wipe, no seam line, no clip-path wedge. If a future pass wants to depict this moment as a still, the only acceptable device is a subtle in-place opacity crossfade — never a diagonal graphic. This storyboard intentionally does not attempt to draw a static representation of a dissolve (a single frame can't show a transition faithfully without inventing a misleading wipe-like edge), so the five states in `storyboard.html` jump straight from Punchline to Homepage; the dissolve is a note for engineering/motion, not a drawn frame.

## Homepage (mandates 5, 6, 7, 8)

**Triptych, less glued-together (mandate 6).** The hero card is still one continuous rounded surface with three background bands (graphite MVP hatch, cyan Beta blueprint grid, release-blue GA), but several changes reduce the "three cards glued together" read: (1) a faint continuous horizontal baseline grid (`repeating-linear-gradient`, 34px rhythm, 5% white opacity) runs across the *entire* card, spanning all three bands, so there's one shared geometry tying the surface together; (2) the seams are feathered gradients (`hero-seam.s1/.s2`) — no hard vertical rule was added or exists. MVP/BETA/GA tags remain, small and quiet.

**V2.1 correction:** GA was previously a flat, fully-saturated release-blue fill with no texture of its own — the design lead flagged it as reading like "a glued SaaS-purple column" against MVP/BETA's textured surfaces. Fixed three ways: (1) GA now gets its own faint diagonal hatch (`.hero-band.ga::after`, same 115°/14px rhythm as MVP's, just in white-on-blue) so it shares the same texture *language* as the other two bands, not just the shared baseline grid; (2) `--release-blue` is desaturated ~18% in both themes (`#3F49E8`→`#4E56D9` light, `#7580FF`→`#818AF3` dark) with hue held exactly constant (236.4°→236.5°), so the semantic release-blue identity is retained everywhere else it's used (band tags, board-card kicker) while the GA fill itself reads calmer; (3) the GA-side seam (`.hero-seam.s2`) widened from 8% to 20% of the card's width, so BETA visibly bleeds into GA rather than the two meeting at a hard-ish edge. The integrated guide (`guide-alpha-upper.png`) is also lifted off the card's bottom edge (`bottom:3%`, up from flush `bottom:0`) and sized up slightly (23%→26% of GA width) so its crop reads as an intentional bust framing rather than the figure sinking out of frame.

**Guide integration (mandate 5).** The real waist-up render (`guide-alpha-upper.png`) sits directly inside the GA band — no card, no border, no porthole crop (V1's bordered `hero-guide-frame` treatment is gone entirely). It's a genuine alpha PNG now (see the "Guide asset" note above), so it just sits on the release-blue field with nothing behind it, edges checked clean against the field color with no dark halo/fringe.

**Status affordance (mandate 5).** A compact pill, `TRACKING · 4/5 → OPEN`, is pinned to the guide's shoulder — a coral dot, lime-tinted fill and border at rest (not just on hover), hover-lift, and a visible `:focus-visible` ring — styled as real product chrome, not a callout. It's a `<button data-goto="cockpit">`, so clicking it (in the actual reviewable HTML, not just in principle) opens the Cockpit state. One `.reviewer-note` — "↳ clickable — opens cockpit" — sits just above it as the one piece of storyboard-only annotation in the whole Homepage state, and it disappears in capture mode along with the rest of the reviewer chrome.

**V2.1 correction:** the chip previously read `TRACKING · 4/5` with a dark translucent fill that only gained a lime border on hover — in a still (capture mode, no cursor), it read as a passive status readout, not something clickable. The design lead flagged this: a reviewer looking at a static frame needs the affordance without relying on the hover state or the reviewer-only annotation. Fixed by adding `→ OPEN` to the label itself and giving the chip a lime-tinted background/border at rest, so the "this opens something" signal survives a single screenshot.

**Feature flags (mandate 7).** Replaced the invented V1 placeholder chips (`persona_overlay`, `triptych_hero`, `cockpit_v2`) with the real four:

| Flag | Register | State |
|---|---|---|
| `dark_mode` | THEME | on/off — **live-bound to the actual theme toggle**, so this chip visibly flips when you use the reviewer dark-mode button |
| `confetti_on_scroll` | SHIP SIGNAL | on |
| `candid_mode` | FIELD NOTES | on |
| `comic_sans` | PROD LOCKED | disabled |

Header reads `FEATURE FLAGS · 3/4 live`, read as "3 of the 4 flags are live/toggleable in prod; 1 (`comic_sans`) is permanently locked off" — not "3 are currently on," since `dark_mode`'s on/off state changes with the toggle. The block sits in normal document flow beneath the hero, styled as a quiet subordinate surface (mono chips, panel background, hairline border) — never floating over the hero.

**Board preview (mandate 8).** Replaced the blank rectangle with the real heading ("Things I've built") and the top edge of the actual first ticket — `GAR-101 · PRODUCT` kicker, `Stay Portal` title, and the description "Five apartments, flexible bookings, and no more spreadsheet collisions." — cropped by a fixed-height (`10vh`, min 78px) container so only the card's top edge peeks above the fold, same "there's more below" signal V1 had, now with real content instead of an empty div.

**Mobile triptych (mandate 6).** At ≤760px, MVP and BETA stay as compact stacked precursor strips (56px each) at the top of the hero card — so the release history is still visibly present on a phone, not hidden (this replaces V1's mobile behavior, which dropped MVP/BETA entirely and showed only GA, flagged in the V1 doc as an open question and resolved as: don't hide them, stack them).

**V2.1 correction:** the first V2 pass also gave GA its own third 56px strip, then put the headline/intro in a separate white `.hero-copy` panel below it, with the guide floating in its own small blue box further down and the CTAs in a second white panel below that. The design lead flagged this as broken storytelling — MVP/BETA/GA strips followed by "an unrelated white copy slab." Fixed by pulling GA out of the strip stack entirely: `.hero-band.ga` is now an absolutely-positioned fill that sits *behind* the headline, intro, integrated guide, and both CTAs, sized to match whatever height that in-flow content needs (`top:112px` — after MVP+BETA — to `bottom:0`). Headline and intro now render in the same light-on-blue treatment as desktop (no more dark text on a white slab), the guide sits directly on that same field with no separate colored box, and both CTA buttons live inside the one continuous GA-colored card. The GA tag moves to the top-right of that card (matching its desktop position) instead of stacking in MVP/BETA's left-aligned tag column, since it would otherwise collide with the headline's first line.

## Cockpit (mandate 9)

Unchanged from the approved design: fixed dark instrument palette (independent of the light/dark toggle, same authored-surface logic as the onboarding stage), agent status chip top-left (`tracking · 4/5`), circular close button top-right, paired you-vs-typical-visitor funnel bars with step-over-step drop-off labels, three stat tiles, two lilac-accented insight cards, and the trust line as a small italic mono closing statement below a hairline rule. The only change this pass: the close button (`✕`) is now wired (`data-goto="homepage"`) so it actually returns to the Homepage state, and — like every other state — Cockpit's own product chrome (status chip, close button) is never hidden by capture mode; only the shared reviewer tab bar and theme toggle are.

---

## Locked copy — quick reference

| Surface | Copy | Status |
|---|---|---|
| Welcome headline | "Welcome to garvit.app." | verbatim, locked |
| Welcome subcopy | "Garvit asked me to keep this brief." | verbatim, locked |
| Welcome CTA | "Continue" | verbatim, locked |
| Persona headline | "Quick question. What brings you here?" | verbatim, locked |
| Persona disclosure | "your pick is logged via PostHog. nothing else is." | verbatim, locked |
| Persona choices | Founder / Recruiter / Product lead / Just browsing | verbatim, locked |
| Punchline line | "Noted. This changes nothing. It never does." | verbatim, locked |
| Homepage flags | `dark_mode` (THEME), `confetti_on_scroll` (SHIP SIGNAL), `candid_mode` (FIELD NOTES), `comic_sans` (PROD LOCKED) | verbatim, locked |
| Board preview ticket | GAR-101 · PRODUCT / Stay Portal / "Five apartments, flexible bookings, and no more spreadsheet collisions." | verbatim, locked |

No kicker placeholder exists anywhere in this file. `garvit.app — visitor context` (the rejected V1 Persona kicker) has been removed, along with every other stage-direction-style eyebrow line V1 had (`garvit.app — session boot`, etc.) — mandate 10.

---

## Degraded-tier behavior matrix (required before build)

Reframed for the five-state model. Degraded tiers keep the same DOM flow as the full-fidelity path, with motion/poster substitutions — they are not separate states, so no separate stills exist for them.

| Client tier | Onboarding (Welcome/Persona/Punchline) | Homepage | Cockpit |
|---|---|---|---|
| **Full-fidelity** (JS on, no reduced-motion, capable device) | Full dark-stage treatment, real Cycles-rendered guide poses as drawn | Full triptych hero, guide integrated in GA band, animated hover states | Full cockpit as drawn |
| **Degraded — low-memory / Save-Data** | Same DOM flow; starfield background-image layer omitted, guide `<img>`s unchanged (three ~650-750KB PNGs, not a lazy-load target worth deferring at this scale, but production should add `loading="lazy"`/responsive `srcset` if these ship as-is) | Same DOM flow; baseline-grid overlay and hover-lift transitions omitted | Same DOM flow; bars render at final widths, no fill animation |
| **Degraded — `prefers-reduced-motion`** | State-to-state changes become instant swaps | No hover-lift transform on CTAs/chip | No bar-fill animation |
| **No-JS / crawlers** | The tab-switching script never runs; only the Welcome state's markup is visible (`display:none` is the default for all other `.state-panel`s, so without JS the page silently shows exactly one state — this needs a `<noscript>` fallback in production to force the Homepage markup visible instead, since a crawler should index the real homepage content, not the onboarding gate) | Not directly reachable without JS in this storyboard's implementation — **flagged as a production gap below** | Not reachable |

**New production gap this pass:** the storyboard's client-side hash-routing means a no-JS client sees only Welcome (the first `.state-panel` in DOM order lacks the `.active` class without the script running, so — unless the production build changes this — nothing renders at all without JS, which is worse than V1's always-visible document flow). This is a storyboard-implementation detail, not a locked product decision, but production must not literally ship "hide everything until JS decides which state to show" — the real build should either server-render the homepage as the default no-JS state, or use a `<noscript>` block that forces Homepage's markup visible and hides the onboarding gate entirely. Flagging this explicitly since it's new risk introduced by moving to single-state-visible presentation.

---

## Decisions needed before build

1. **DESIGN.md gradient-exception amendment — still pending, unresolved.** Carried over from V1, unchanged: the no-gradient rule has no written exemption for (a) the Homepage hero card's feathered band seams and new baseline-grid overlay, (b) the fixed dark authored surfaces (Welcome/Persona/Punchline stage, Cockpit instrument panel — starfield + radial stage-light), (c) the standing tension between DESIGN.md §5.4's "broad, mostly borderless release field" language and the locked triptych hero, which is a bordered, rounded, shadowed card. None of this authorizes a GA-band gradient or glow — those stay cut. This still needs an explicit written amendment so the next implementer isn't inheriting two contradictory sources of truth.

2. **Guide asset — resolved.** The three renders were re-generated from `public/models/guide/guide.glb` via headless Blender/Cycles after diagnosing and fixing a camera-framing bug (see the "Guide asset" section above). `storyboard.html` now uses the real `guide-alpha-{wave,full,upper}.png` renders in all four placements instead of the SVG stand-in. **Open item for the design lead:** the model's actual textures render blue trim only, no coral — worth confirming whether that's intentional before this ships as the final guide asset.
