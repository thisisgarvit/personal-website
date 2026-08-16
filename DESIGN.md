# garvit.app — Production Design System

**Status:** Approved · immersive amendment locked 17 August 2026
**Version:** 2.1 · 17 August 2026
**Concept:** “This site is my product”  
**Primary lens:** Apple-style purpose, agency, continuity, and physical response  
**Type licenses:** Archivo and IBM Plex Mono, SIL Open Font License only

This document is the visual and motion source of truth for production. It translates the approved vertical slice into a responsive system with a deliberate density gradient: dense product chrome, then increasingly spacious product content. It is not permission to reinterpret the site. Implementers copy these values and behaviors; they do not invent alternatives.

After Claude approves this document, visual values may change only through a reviewed amendment. The eventual PRD owns content, routes, state, and acceptance behavior. If the PRD and this document disagree about pixels or motion, stop and resolve the conflict rather than choosing locally.

Each subsection's **Concept defense** applies to every visual specification in that subsection; tabular token decisions carry their defense per row.

---

## 1. Product Idea and Design Test

The portfolio behaves like a live product Garvit is visibly PM-ing. Version chrome, release notes, feature flags, sprint tickets, and the persistent metaverse guide are the navigation and interaction model—not a theme placed over a conventional portfolio.

The first screen must answer within ten seconds:

1. Who is this? Garvit Sukhija, a product manager who builds.
2. What can I do? Download his resume, contact him, inspect real work, or play with live product controls.
3. Why is this memorable? The portfolio itself is shipped, flagged, versioned, and physical.

Three audience reactions define success:

- **Founder:** “This person can turn ambiguity into a product—and I want to show this site to someone.”
- **Product lead:** “The interaction choices show judgment, not just taste.”
- **Recruiter:** “This is immediately legible, polished, and easy to navigate.”

### Principles

| Principle | Production interpretation | Concept defense |
|---|---|---|
| Purpose | Every visible control changes the product or opens real work. | A PM portfolio should demonstrate prioritization, not accumulate decoration. |
| Agency | All playful states are reversible; board moves reset; flags never hide access. | The visitor is a user, never a candidate being tested. |
| Responsibility | No guest PII, surveillance theater, or misleading shipped/concept labels. | Product judgment includes what Garvit refuses to collect or imply. |
| Familiarity | Product bars, toggles, tickets, dialogs, and links behave conventionally. | The joke lands faster when the controls need no explanation. |
| Flexibility | Pointer, touch, keyboard, reduced-motion, poster, and no-JS paths are peers. | A polished product does not reserve delight or access for one input mode. |
| Simplicity | Dense chrome remains concise; long-form work moves to calm routes. | “Product-like” means clear hierarchy, not dashboard clutter. |
| Craft | Tokens, motion, optics, and responsive states are explicit and reviewable. | Nothing about a visibly PM-ed product should look accidental. |
| Delight | Humor comes from product mechanics and candid microcopy. | The site earns a smile by behaving unusually well, not by adding random confetti. |

### Non-negotiable exclusions

- No resume timeline, metrics wall, testimonial carousel, skill-cloud, or primary “About me” route.
- No visitor scoring, quizzes, product-thinking tests, allocation games, or hidden homework.
- No event-log stream. The mascot reacts silently.
- No Bengaluru reference. Location is **Delhi / IST**.
- No invented or unverified career metrics.

---

## 2. Named Anti-AI-Slop Requirement

“Does not look AI-generated” is a release requirement, not subjective feedback at the end.

### Banned visual defaults

- Purple/blue mesh gradients or glowing gradient fog.
- Glassmorphism used as decoration.
- Floating 3D blobs, chrome spheres, abstract rings, or ambient WebGL filler.
- Generic centered Framer-template hero with eyebrow, two CTAs, and floating cards.
- Warm lifestyle cream + serif + terracotta.
- Near-black + one acid green/vermilion accent.
- Inter, Space Grotesk, SF Pro, Nerd Font variants, or CDN fonts.
- Emoji section markers, generic `01 / 02 / 03` labels, and rounded cards everywhere.
- Scroll-reveal choreography, parallax, marquees, or cinematic transitions added merely to signal “creative website.”
- Unsplash covers, generic AI imagery, prompt-marketplace layouts, or famous-portfolio cloning.

### Authorship rules

1. Every visual table in this document includes a concept defense.
2. The palette is semantic: release, merge, incident, experiment, and context.
3. The only 3D object is the functional persistent metaverse guide.
4. Product artifacts—not atmospheric imagery—carry case-study richness.
5. Motionsites.ai may set a confidence bar for committed motion; it may not supply composition, styling, or effects.
6. If an implementer needs a value missing here, they must request a design amendment. “Close enough” values are not allowed.

---

## 3. Foundations

### 3.1 Color

Use semantic names in components. Raw palette names belong only in the token file.

| Token | Light | Dark | Role | Concept defense |
|---|---:|---:|---|---|
| `--color-canvas` | `#EDF0EB` | `#101319` | Application background | Reads as a build sheet rather than lifestyle cream or a portfolio canvas. |
| `--color-panel` | `#F8F9F4` | `#191D25` | Primary controls, tickets, reading surfaces | Keeps product content legible without generic pure-white cards. |
| `--color-panel-2` | `#E3E8E2` | `#222832` | Secondary rows and grouped surfaces | Adds product hierarchy without decorative glass stacking. |
| `--color-ink` | `#171923` | `#F2F4ED` | Primary text, hard rules, icon strokes | Product chrome needs decisive contrast, not soft editorial gray. |
| `--color-muted` | `#5F675F` | `#A9B2A9` | Secondary prose and metadata | Reduces competition while remaining readable in dense product areas. |
| `--color-rule` | `#AEB7AD` | `#3D4650` | Borders and separators | Thin structural rules make the page feel specified and inspectable. |
| `--color-release` | `#3F49E8` | `#7580FF` | Hero identity, active product state | A single solid release color feels authored; it is explicitly not a gradient. |
| `--color-merge` | `#CBED45` | `#D4F35E` | Healthy build, Shipped, resume CTA | The brightest accent belongs to shipping and the primary career action. |
| `--color-incident` | `#FF6B52` | `#FF7A61` | Research, warnings, on-call state | Incident language gives coral a product role instead of a decorative one. |
| `--color-question` | `#C4B7FF` | `#BCAEFF` | Experiments and conceptual work | Lilac marks open questions without becoming a gradient aesthetic. |
| `--color-context` | `#72D7D0` | `#70DCD4` | Maxie, memory, contextual systems | Cyan distinguishes context-heavy product concepts from release state. |

Supporting tokens:

| Token | Value | Concept defense |
|---|---|---|
| `--color-scrim` | Light `rgba(23,25,35,.58)`; dark `rgba(0,0,0,.70)` | Case previews temporarily become the task, so the shell clearly recedes. |
| `--color-focus` | Light `#171923`; dark `#F2F4ED` | Focus should look native to the product rather than imported browser blue. |
| `--color-selection` | Background `var(--color-merge)`; text `#171923` | Even text selection reinforces the “merged/shipped” vocabulary. |

Rules:

- Accent color is never the only status indicator; pair it with text, position, or iconography.
- Do not generate tints ad hoc. Use opacity on a documented semantic token only for hover/press layers.
- No gradient is part of the production visual language. A short edge fade used solely to separate scrolling content from translucent chrome is exempt.
- All text/background pairs must pass WCAG 2.2 AA before approval.

### 3.2 Typography

#### Families

| Role | Family | Use | Concept defense |
|---|---|---|---|
| Product voice | Archivo Variable | Hero, section titles, buttons, tickets, prose | Its industrial compression gives launch-surface authority without the generic SaaS voice of Inter. |
| System annotation | IBM Plex Mono | Versions, flags, ticket IDs, dates, build states | It connects the interface to PRDs, GitHub, releases, and instrumentation without becoming a terminal theme. |

Both fonts must be self-hosted as subset WOFF2 files from official OFL sources. Retain license texts in the repository. Do not synthesize unavailable italics or weights.

#### Type ramp

| Token | Archivo size / line height | Starting tracking | Use | Concept defense |
|---|---|---|---|---|
| `--type-hero` | `clamp(3.25rem, 7.6vw, 7.25rem) / .88` | See optical validation below | One positioning sentence only | Large release-note authority makes the positioning unmistakable without an empty art-site hero. |
| `--type-section` | `clamp(2.25rem, 4.5vw, 4.5rem) / .94` | `-.05em` | Board and case-study headings | Spacious content needs stronger landmarks as chrome density falls away. |
| `--type-card-title` | `clamp(1.25rem, 1.8vw, 1.75rem) / 1.05` | `-.035em` | Ticket and artifact titles | Tickets remain scannable as work, not miniature prose cards. |
| `--type-lead` | `clamp(1.125rem, 1.6vw, 1.375rem) / 1.45` | `-.015em` | Hero intro and case ledes | A restrained lead size supports the hero rather than creating two headlines. |
| `--type-body` | `1rem / 1.6` | `-.01em` | Reading copy | Long-form work gets editorial comfort without changing brand voice. |
| `--type-small` | `.875rem / 1.45` | `0` | Secondary copy | Neutral tracking protects legibility at utility sizes. |
| `--type-product` | `.6875rem / 1.35` IBM Plex Mono | `.055em` | Chrome, tickets, flags, metadata | Small product text needs positive spacing and deliberate density. |

Do not use uppercase Archivo paragraphs. Uppercase IBM Plex Mono is allowed only for semantic product metadata.

#### Required optical validation: hero

`-.065em` is the starting tracking value at the largest Archivo display size; it is **not approved until rendered**. The lowercase-heavy provisional line may make this too crushed.

During Claude’s DESIGN.md review:

1. Render the actual production Archivo file at viewport widths 320, 390, 768, 1024, 1440, and 1600px.
2. Inspect both themes at the clamp’s minimum, midpoint, and maximum.
3. Check counter closure, letter collisions, word-shape recognition, descenders against `.88` leading, rag, and line wraps.
4. Adjust hero tracking only within `-.045em` to `-.065em` unless Claude approves a documented exception.
5. Begin mobile at `-.045em`; loosen line height toward `.92` below 620px.
6. Record final small, medium, and large hero values here before implementation.

The optical decision outranks numeric consistency. Tight display type should feel like a release surface, never like compressed poster typography.

**VALIDATED (Claude, 2026-08-15, rendered with production Archivo 800 at .88 leading, light + dark):**

| Clamp region | Final tracking | Evidence |
|---|---|---|
| Large (≥ ~96px) | `-.055em` | Confident and legible; words separate cleanly. |
| Medium (~64–96px) | `-.05em` | Interpolated within the verified band; consistent with `--type-section`. |
| Small (≤ ~64px / mobile) | `-.045em` | Comfortable; tighter values crowd word gaps at this size. |

`-.065em` is **rejected at every size**: the `rn` pair in "turn" collides ("tum"), and inter-word gaps nearly vanish. Caveat: this validation is copy-dependent (the approved line is lowercase-heavy with an `rn` pair) — re-run it if the hero sentence ever changes. Optional refinement at implementers' discretion with review: `word-spacing: .01em–.02em` at the largest sizes if word boundaries feel tight in the built hero.

#### Copy status

The hero line—“I turn fuzzy product ideas into things people can use”—was **explicitly approved by Garvit on 2026-08-15** (see open-questions-answers.md). It is no longer provisional and no longer blocks launch. The OG direction is also locked: large name-first headline `Garvit Sukhija`, with the approved hero sentence beneath it. Role-first variants are rejected.

### 3.3 Spacing

The base unit is 4px. Components use only this scale:

| Token | Value | Primary use | Concept defense |
|---|---:|---|---|
| `--space-1` | `.25rem` / 4px | Optical nudges | Small alignment corrections need a controlled unit. |
| `--space-2` | `.5rem` / 8px | Compact control gaps | Dense chrome stays compact without becoming cramped. |
| `--space-3` | `.75rem` / 12px | Metadata rows | Product annotations read as grouped systems. |
| `--space-4` | `1rem` / 16px | Standard component inset | Repeated controls share one predictable rhythm. |
| `--space-6` | `1.5rem` / 24px | Ticket and column gaps | The board breathes without losing sprint-board adjacency. |
| `--space-8` | `2rem` / 32px | Panel padding, mobile section gap | Content starts opening up immediately below chrome. |
| `--space-12` | `3rem` / 48px | Desktop panel padding | Larger product areas feel deliberate rather than card-packed. |
| `--space-16` | `4rem` / 64px | Hero/board rhythm | Creates separation without turning the homepage into chapters. |
| `--space-24` | `6rem` / 96px | Section rhythm | Long-form work gets modern breathing room. |
| `--space-32` | `8rem` / 128px | Case-study major break | Major decisions deserve space, not another card container. |
| `--space-40` | `10rem` / 160px | Maximum long-form separation | Caps artistic expansion before it becomes scroll narrative. |

### 3.4 Radii, rules, and elevation

| Token | Value | Use | Concept defense |
|---|---:|---|---|
| `--radius-control` | `4px` | Small utility controls | Product chrome should feel precise, not bubbly. |
| `--radius-button` | `8px` | CTAs and tickets | A modest radius keeps pressables approachable without template-card softness. |
| `--radius-panel` | `12px` | Hero, board, flags | Shared product surfaces need family resemblance, not universal rounding. |
| `--radius-dialog` | `18px` | Case preview only | The largest task surface receives visibly more material weight. |
| `--radius-pill` | `999px` | Build state, chips, switches only | Pills are reserved for status semantics. |
| `--rule` | `1px solid var(--color-rule)` | Structural boundaries | Visible structure reinforces the inspectable-product idea. |
| `--shadow-lift` | `0 14px 32px rgba(23,25,35,.18)` | Active dragged ticket only | Elevation should communicate a changed physical state, not decorate every card. |
| `--shadow-dialog` | `0 28px 80px rgba(23,25,35,.28)` | Case preview | A modal task must separate clearly from the live shell behind it. |

Dark mode uses `rgba(0,0,0,.32)` for drag lift and `rgba(0,0,0,.52)` for dialog shadow. Resting tickets have no diffuse shadow.

### 3.5 Iconography

- Use authored inline SVG with 1.75px strokes, square or gently rounded caps, and a 24px viewBox.
- Product symbols may use typographic marks such as `×`, `↗`, or `↺` only when their meaning is conventional and labelled accessibly.
- No emoji, mixed icon libraries, filled gradient icons, or decorative illustrations in controls.

**Concept defense:** the interface should look like one shipped product, not a collage of component-library defaults.

---

## 4. Density Gradient and Layout

The page becomes more spacious with distance from the top, but never turns into an art-site story scroll.

### Global frame

| Area | Geometry | Concept defense |
|---|---|---|
| Product chrome | Full width, sticky, 56px desktop / 52px mobile | Dense persistent chrome makes the live-product premise legible in one screenshot. |
| Experiment strip | Full width, approximately 40px | A compact experiment reads as product status, not a marketing announcement. |
| Application shell | `min(100% - 2rem, 100rem)`; 16–32px gutters | A broad work surface suits a board while preventing ultrawide drift. |
| Hero-to-board rhythm | 64–96px | The hero and portfolio are distinct without becoming separate scroll acts. |
| Long-form reading column | Maximum 68 characters | Calm case reading supports judgment after the interactive hook. |

### Breakpoints

Breakpoints respond to composition, not device names:

- **≥1180px:** hero uses a broad release field with a 40–50% edge-cropped guide; the real board overlaps its lower boundary and shows three equal columns.
- **880–1179px:** the guide crop narrows while copy and CTAs retain priority; the board keeps three columns only while each remains at least 280px.
- **620–879px:** copy and guide share a composed field; the compact flag dock reflows without becoming a rail; explicit board controls begin replacing desktop-only discovery.
- **<620px:** purposeful upper/right guide crop, full-width CTAs, 16px shell gutters, and explicit board tabs/previous/next/position/peek controls.

Do not reduce type or targets merely to preserve the desktop composition. Reflow first.

### Density map

| Zone | Allowed spacing | Visual load | Concept defense |
|---|---|---|---|
| Chrome | 4–16px | Version, build state, changelog, location | Product metadata earns density because it establishes the premise. |
| Hero | 24–80px | One headline, one intro, two CTAs, dominant guide, compact flag dock | The broad world field stays rich without returning to a dashboard-card stack. |
| Board | 16–48px internally; 64–96px externally | Three columns and four authored tickets | Work stays visibly actionable while the surrounding space lowers cognitive load. |
| Case routes | 32–160px | One decision or artifact per section | Deep reading gets air without importing art-site theatrics into the homepage. |

---

## 5. Surface Anatomy

### 5.1 Product chrome

- 56px desktop and 52px mobile.
- Left: build dot, `garvit.app`, clickable `v2.4.1`.
- Center: one-line changelog ticker where width permits.
- Right: `DELHI / IST` and compact release status.
- Use IBM Plex Mono for metadata and Archivo for the wordmark only.
- Background: light `rgba(248,249,244,.88)`, dark `rgba(25,29,37,.88)`, `backdrop-filter: blur(12px) saturate(108%)`.
- Use a scroll-edge fade only when content passes beneath the sticky layer.
- `prefers-reduced-transparency` switches to the solid panel token with no blur.

**Concept defense:** translucency communicates that chrome floats above the portfolio product; it is not a decorative material applied to content.

### 5.2 Release-note popover

- Anchored to the version label and uses its transform origin.
- 300–340px wide, panel background, one-pixel rule, 12px radius, 16px padding.
- Each note uses version/date in mono and one candid sentence in Archivo.
- Maximum three notes before a direct “Full changelog” affordance; do not create a scrollable micro-window.

**Concept defense:** the version number behaves like a real product control and rewards curiosity immediately.

### 5.3 Experiment strip

- Solid release blue with high-contrast text; never translucent.
- Left semantic label: `EXPERIMENT · B`.
- Copy: “You’re in variant B of this hero. Variant A converts worse.”
- Right 44px dismiss target.
- The fake logged-event toast is product humor only and must not mirror real analytics.

**Concept defense:** the A/B ritual delivers the PM joke before the visitor has to interact or understand an invented game.

### 5.4 Hero

- Broad, mostly borderless release field connected to the board below.
- Desktop composition reserves a meaningful 40–50% edge crop for the guide without reducing the copy to a narrow card column.
- Primary hero inset: 48–80px desktop, 24–32px mobile.
- Minimum desktop height approximately 560px; do not force `100vh`.
- Top metadata: `Product manager · available for the right problem`; `DELHI / IST` appears once in product chrome, not again here.
- Main content: one hero sentence and one lead paragraph.
- Bottom: two equal-priority-at-a-glance controls, with resume visually primary.
- No floating badges, orbiting words, client-logo row, metric row, headshot, or decorative screenshots.

**Concept defense:** the guide, real work edge, and compact live controls make the interaction the website while copy and career actions remain immediate.

### 5.5 Primary CTAs

#### Download resume

- Label must contain the exact visible words **Download resume**.
- Merge-lime fill, ink text, 56px minimum height, 8px radius.
- Down-arrow SVG; optional release-flavoured secondary text may never obscure the action.

#### Contact Garvit

- Ink fill with canvas text in light mode; tuned high-contrast equivalent in dark mode.
- 56px minimum height, 8px radius, external/up-right arrow.

Both use at least 16px horizontal inset and a visible focus ring separated by 3px.

**Concept defense:** the two career actions are obvious product controls, directly correcting the rejected small-CTA direction.

### 5.6 Compact feature-flag dock

The retired operations rail and procedural/on-call figure must not be rebuilt.
The selected sourced guide lives in the persistent world; this section owns
only the compact dock presentation of the existing functional flags.

#### Feature flags panel

- Expanded by default.
- Header shows `Feature flags` and `3 / 4 live`.
- Four single-line rows with native checkbox semantics and product-styled switches.
- Row order: `dark_mode`, `confetti_on_scroll`, `candid_mode`, `comic_sans`.
- Secondary descriptors: `theme`, `ship signal`, `field notes`, `prod locked`.
- `candid_mode` must never display `CODEX LAB`; its public label is **FIELD NOTES**.
- Disabled Comic Sans tooltip: “disabled in prod for a reason.”

**Concept defense:** flags demonstrate prioritization and product state because every live switch visibly changes the actual site.

### 5.7 Sprint board

- Section heading: `Things I’ve built` with a concise product-state subtitle.
- Board panel uses the canvas/panel system, a 12px radius, and 32–48px padding.
- Columns: `Shipped`, `In progress`, `Backlog`.
- Desktop columns are equal; mobile columns are `86vw` and horizontally scroll-snap.
- Column gaps: 24px. Ticket gaps: 16px.
- Each column includes a label, count, and quiet status rule; avoid decorative column backgrounds.
- Reset is a visible text control on desktop and an accessible icon control on narrow screens.

**Concept defense:** the sprint board is the portfolio index itself, so work remains actionable rather than being converted into conventional project cards below the toy.

### 5.8 Tickets

Each ticket contains:

1. Ticket ID and work kind in IBM Plex Mono.
2. 44px drag grip.
3. Archivo title and one-sentence product summary.
4. Priority and story-point/research chips.
5. Optional candid field note controlled by `candid_mode`.

Resting tickets use a panel fill, one-pixel rule, 8px radius, and no diffuse shadow. Accent color appears as a small semantic edge/chip, not a full decorative card gradient. The entire non-grip body is a direct case link in the no-JS structure.

**Concept defense:** PM texture makes each project memorable while the title and summary preserve recruiter-level first-glance clarity.

### 5.9 Case preview

- Modal maximum width 1120px and maximum height `min(86vh, 760px)`.
- Desktop split: artifact/context surface 42%; reading summary 58%.
- Mobile becomes one scroll surface with the artifact first.
- Centered 18px-radius material over a dim scrim; close target remains visible.
- Show project label, title, lead, no more than three verified facts, decision summary, and an explicit `Read full case` link.
- Case preview is substantial but never replaces the full route.

**Concept defense:** the preview preserves the board’s instant payoff while the full route protects deep product reasoning from modal density.

### 5.10 Long-form case routes

- Calm 68-character reading column with optional wider artifact breakout.
- Sequence: situation → bet → artifact → decisions/exclusions → evidence → next change.
- Major spacing uses 96–160px; prose paragraphs do not sit in generic rounded cards.
- Use sourced product screenshots, diagrams, tables, and decision callouts only when they advance the argument.
- Stay Portal media must use privacy-safe demo data. Do not ship source Unsplash covers.
- `Concept`, `Research`, and `Shipped` labels stay visible near each route title.

**Concept defense:** after the playful index earns attention, calm case routes demonstrate judgment without asking readers to decode another interaction system.

### 5.11 Footer

- One compact full-width build strip after the board.
- Include current version, Delhi/IST, resume, contact, LinkedIn if verified, and a candid final build note.
- No large newsletter block, contact form, site map, or repeated hero.

**Concept defense:** the product ends with deployment information, not a second marketing page.

### 5.12 OG/social card — judged taste surface

The social card is the off-site founder-screenshot test, not metadata plumbing.

- Exact canvas: 1200×630.
- Dense 64px product bar with build dot, `garvit.app v2.4.1`, and `DELHI / IST`.
- One candid changelog line below the bar.
- Large name-first headline: `Garvit Sukhija`.
- Descriptor beneath: `I turn fuzzy product ideas into things people can use`.
- Compact board fragment with three column labels and at least one recognisable real-work ticket.
- Use the production solid palette, Archivo/Plex typography, hard rules, and semantic chips.
- No mascot, CTA simulation, gradient, glass, photograph, or fake browser frame.
- Must remain identifiable at 600×315 and legible at 300×158.

**Concept defense:** when garvit.app is pasted into Slack, X, or WhatsApp, the product premise should survive before anyone opens the page.

---

## 6. Dark Theme

Dark mode is separately tuned, not mechanically inverted.

- Initial theme follows `prefers-color-scheme`; a user override persists locally.
- Apply the dark values from the semantic palette table. Do not compute dark colors in CSS.
- Release blue brightens to periwinkle for contrast; semantic lime/coral/lilac/cyan retain their roles.
- Panel hierarchy must remain visible without relying on shadows.
- Product screenshots retain their authored appearance inside a defined artifact frame; do not invert or blend them.
- Theme transition changes color/background/border over 180ms using `--ease-out`; no full-screen flash, wipe, or view-transition spectacle.
- Under reduced motion, use a 120ms color change without spatial effects.
- Set `color-scheme: light dark` so native controls match the active state.

**Concept defense:** a real feature flag deserves a complete alternate product theme, not a filter applied for demo value.

---

## 7. Motion System

### 7.1 Motion principles

1. **Respond on pointer-down.** Feedback may not wait for click.
2. **Functional motion follows input 1:1.** Decorative tracking may use a spring.
3. **Start from the presentation value.** A moving ticket can be grabbed and redirected at any moment.
4. **Hand off velocity.** Drag and settle form one continuous movement.
5. **Project intent.** Choose a landing column from the flick trajectory, not release position alone.
6. **Use damping 1.0 by default.** Damping near .8 is reserved for momentum-driven follow-through.
7. **Preserve origins and paths.** Popovers grow from their controls; reversible surfaces return the way they arrived.
8. **Animate transform and opacity.** Avoid per-frame layout and inherited-variable churn.
9. **Frequency controls ambition.** Repeated actions are crisp; rare shipping moments may carry delight.
10. **Reduced motion keeps comprehension.** Replace movement with crossfade or static state, never broken functionality.

### 7.2 Tokens

#### CSS timing

| Token | Value | Use | Concept defense |
|---|---|---|---|
| `--duration-feedback` | `120ms` | Press, hover, focus acknowledgement | Product controls should feel listened to before they feel animated. |
| `--duration-enter` | `200ms` | Popover and modal entrance | Occasional overlays may orient without delaying intent. |
| `--duration-exit` | `140ms` | Overlay exit | Dismissal should feel faster than arrival. |
| `--duration-theme` | `180ms` | Theme color change | Prevents a brightness flash without turning a flag into a transition show. |
| `--ease-out` | `cubic-bezier(.23,1,.32,1)` | User-initiated appearance/feedback | Fast initial response preserves directness. |
| `--ease-in-out` | `cubic-bezier(.77,0,.175,1)` | Existing object moving between visible states | Symmetry maintains spatial continuity. |

#### Physical motion

| Token | Parameters | Use | Concept defense |
|---|---|---|---|
| `--spring-settle` | response `.36s`, damping ratio `1.0` | Ticket x/y landing and interruptible layout correction | Critical damping feels controlled and PM-like after the visitor releases control. |
| `--spring-flick` | response `.42s`, damping ratio `.82` | Velocity-driven rotation/follow-through only | A small overshoot is earned only by a physical flick. |
| `--spring-look` | response `.30s`, damping ratio `1.0` | Mascot head/eye target | The figure feels attentive without rubbery cartoon bounce. |
| `--rubber-band` | resistance constant `.55` | Board-edge overshoot | Soft resistance communicates the boundary without making the interface feel frozen. |

Spring parameters are canonical even if the implementation library requires converted stiffness/damping values. Document the conversion beside the code; do not tune by substituting a cubic Bézier.

### 7.3 Component motion matrix

| Surface | Pointer/touch behavior | Keyboard behavior | Reduced-motion equivalent |
|---|---|---|---|
| Primary CTA | Immediate `scale(.98)` on press; release 120ms | State change only; no press animation | Color/focus state only |
| Version popover | 200ms opacity + `.98→1` from trigger origin | Open immediately; focus moves into popover | 140ms opacity crossfade |
| Experiment dismiss | Fade/translate strip, then FLIP hero from current position over 200ms | Dismiss immediately; focus moves to next logical control | Fade strip, then immediate layout |
| Flags disclosure | Interruptible FLIP size change plus opacity; 180ms perceived settle | Immediate open/close with retained focus | Crossfade content; immediate size |
| Flag toggle | Immediate switch position/color; dependent UI retargets | Immediate state change | Immediate state + 120ms color |
| Ticket pointer drag | Lift, 1:1 transform, velocity lean, projected spring landing | Not applicable | Direct drag; crossfade to landing |
| Ticket keyboard move | Not applicable | Immediate relocation, retained focus, 160ms non-spatial destination highlight, live announcement | Immediate relocation and static destination highlight |
| Case preview | 200ms opacity + `.985→1`, centered | Open/close immediately while focus is managed | 160ms opacity only |
| Toast | 180ms translate/opacity; 140ms exit; retargetable | Functional announcement is immediate | 140ms opacity only |
| Mascot | Critically damped look target and authored reactions | No required animated response | Static poster |
| Confetti | Eight-piece edge burst, maximum three per session | Never triggered by keyboard board movement | Disabled |

Keyboard defense: keyboard movement is the board’s efficiency path. Immediate relocation avoids delaying a command, while retained focus, a brief destination highlight, and a live announcement provide spatial comprehension without simulating pointer physics.

### 7.4 Ticket physics

#### Press and intent

- Drag begins only on the 44px grip.
- Pointer-down gives immediate lift feedback.
- Preserve the exact grab offset.
- Use pointer capture and ignore additional pointers until completion/cancel.
- A 10px hysteresis distinguishes a grip activation from a drag.
- Pointer-up is always processed as a final movement sample, even if no intermediate `pointermove` arrived.

#### Direct manipulation

- Inside board bounds, the ticket transform follows the pointer 1:1.
- Beyond bounds, use rubber-band constant `.55`; never hard-clamp beneath the pointer.
- Use transform strings, not per-frame `left`/`top`.
- Lift state: `scale(1.015)`, `--shadow-lift`, and velocity-derived rotation clamped to ±3°.

#### Velocity and landing

- Use coalesced pointer events when present.
- Derive release velocity from samples in the last 100ms and cap outliers.
- With fewer than two move samples, derive a fallback from pointer-down, pointer-up, and elapsed time.
- Project horizontal intent using decay `.998`, capped to ±280px.
- Choose the closest valid column from the projected ticket center.
- Hand release velocity into independent x/y `--spring-settle` springs.
- Apply `--spring-flick` only to the rotational follow-through caused by momentum.

#### Interruptibility

- A new pointer-down cancels any settle.
- Read the visible transform through `DOMMatrix` and begin from that presentation position.
- Preserve current velocity when retargeting; never restart from the logical destination.
- Input is never locked during a settle.

#### Keyboard move

- `Alt+Left/Right` relocates one column immediately.
- DOM focus travels with the ticket.
- The destination column receives a 160ms outline/background acknowledgement.
- Announce ticket title and destination through the polite live region.
- Moving into Shipped opens the functional preview but does not run ticket momentum or confetti.

### 7.5 Mascot motion

- Cursor tracking is decorative and therefore spring-smoothed with `--spring-look`; it must not trail functional input.
- Torso yaw receives roughly 35% of the target, head yaw/pitch 65%, and pupils the remaining fine adjustment.
- Clamp head motion so the figure reads as glancing, not rotating unnaturally.
- No perpetual whole-body float. A random blink between approximately 2.6 and 5.2 seconds is allowed.
- Reactions are queued by priority: shipped → flag-check → notice → idle. A lower-priority hover cannot interrupt shipped celebration.
- Notice ≤900ms, flag-check ≤1000ms, shipped celebration ≤1400ms.
- Reactions begin from current joint values and return through critical damping.
- Touch devices use an authored idle/look-forward pose until a direct action supplies a target.

**Concept defense:** the figure behaves like a quietly attentive on-call teammate, not an ambient 3D mascot demanding attention.

### 7.6 Ticker and ambient motion

- Changelog may change no more frequently than every 4.3 seconds.
- Pause when offscreen, document-hidden, hovered, focused, or reduced-motion.
- Swap using a short direction-consistent opacity/translate transition.
- No marquee, auto-scroll, full-screen ambient loop, or repeated card float.

### 7.7 Reduced motion, transparency, and contrast

`prefers-reduced-motion`, `prefers-reduced-transparency`, and `prefers-contrast` are separate concerns.

- Reduced motion removes springs, momentum, confetti, cursor tracking, ticker movement, blink, and spatial overlay movement.
- Preserve state changes with 120–160ms opacity/color crossfades where useful.
- Reduced transparency makes chrome and overlays solid and removes backdrop blur.
- Increased contrast uses near-solid surfaces, stronger rules, and no low-opacity metadata.
- Forced-colors mode removes decorative accents while preserving borders, labels, focus, and native controls.

---

## 8. Responsive and Input Behavior

### Desktop pointer

- Persistent world composition and three-column board; the flag dock remains compact rather than becoming a rail.
- Hover motion is enabled only under `(hover: hover) and (pointer: fine)`.
- Hover never reveals information unavailable through focus or activation.

### Touch

- The drag grip alone uses `touch-action: none`.
- Ticket body and board retain natural scrolling.
- Columns scroll horizontally with proximity snap; page-level horizontal overflow remains zero.
- Cursor-only mascot behavior becomes action-driven reactions.

### Keyboard

- Tab order follows the visual hierarchy: chrome → banner → hero CTAs → feature flags → board → journey → footer. The decorative canvas never enters tab order.
- Tickets expose Enter-to-open and `Alt+Left/Right` move instructions in accessible help text.
- Escape closes only the topmost dismissible surface.
- Focus never disappears into a moved ticket, dismissed banner, closed popover, or modal backdrop.

### No JavaScript

- Render the hero, primary links, authored board columns, ticket summaries, and direct case links on the server.
- Hide or render inert interactive flag controls without implying they work.
- Show the camera-matched, theme-selected guide poster.
- Do not display an instruction that makes enabling JavaScript visitor homework.

---

## 9. Accessibility Visual Rules

- WCAG 2.2 AA contrast is the minimum in both themes.
- Primary targets are at least 44×44px.
- Focus ring: 2px solid `--color-focus`, 3px offset; never rely on box-shadow alone in forced colors.
- Focus-visible and hover states must be related but visually distinct.
- Text may zoom to 200% without clipping controls or hiding content.
- Product mono never drops below `.6875rem` at the default root size.
- Status color always has a text or structural companion.
- One polite live region announces deliberate board/flag state changes; cursor movement and mascot reactions remain silent.
- The modal scrim may dim but must not apply a large moving scale to the whole background.

---

## 10. Voice and Microcopy

Humor is dry, candid, and mechanical. It never becomes a paragraph-length persona performance.

Approved register examples:

- `v2.4.1 — fixed: hero said “passionate”. rolled back.`
- `You’re in variant B of this hero. Variant A converts worse.`
- `event logged: banner_dismissed. noted.`
- `disabled in prod for a reason`
- `Board reset. No sprint ceremony required.`
- `USER / YOU, APPARENTLY`
- `Board state lasts for this tab. No sprint ceremony required.`

Rules:

- Prefer specific verbs: `Download resume`, `Contact Garvit`, `Read full case`, `Reset board`.
- No “passionate,” “innovative,” “results-driven,” “crafting experiences,” or inflated superlatives.
- No constant jokes. One dry line per surface is the ceiling.
- Candid notes disclose trade-offs or exclusions; they do not perform false vulnerability.
- Internal agent/tool names never appear in public copy.

**Concept defense:** a PM’s credibility improves when the interface is specific about what shipped, what is conceptual, and what was cut.

---

## 11. Media and Artifact Rules

- Use local, sourced, privacy-safe media only.
- Stay Portal screenshots must come from isolated demo data and contain no real guest names, emails, phone numbers, addresses, booking codes, or access details.
- Maxie’s supplied prototype screenshot appears only where it clarifies the product architecture or decision.
- Agentic Calendar visuals should explain agent decisions and approval states, not decorate a calendar-shaped card.
- Dynamic Island visuals may demonstrate state morphing but must not imitate Apple marketing photography.
- Artifact frames use the product rule/radius system and may use a restrained offset shadow only when representing a physical screenshot or document.
- No full-bleed stock photography, remote image dependency, AI-generated fake product screenshot, or background media loop.

**Concept defense:** evidence of work is more persuasive than atmosphere, and privacy-safe demo artifacts show responsible product practice.

---

## 12. Design QA and Approval Gate

Before Claude can approve this document, render and judge:

1. Top-of-page at 1440×900 and 390×844 in light and dark themes.
2. Hero type at every optical-validation viewport and clamp stop.
3. Flags open/closed and all four flag states.
4. Board resting, ticket press, drag, valid drop, keyboard destination highlight, and reset.
5. Case preview desktop/mobile.
6. Selected guide's camera-matched theme poster and live-scene first frame from the same crop.
7. Reduced-motion, reduced-transparency, increased-contrast, and forced-colors states.
8. OG card at 1200×630, 600×315, and 300×158.

Claude’s approval checklist:

- The top still reads as a live product in one screenshot.
- The larger hero and additional spacing feel cleaner without diluting chrome density.
- Resume and contact remain unmissable.
- Archivo tracking is optically legible, not merely within the allowed numeric range.
- Product work remains the homepage spine.
- The guide reads as a purposeful metaverse field agent, not a marketplace asset or floating decoration.
- Motion is causal, interruptible, and restrained by frequency.
- Dark mode looks independently authored.
- The OG card passes the off-site founder-screenshot test.
- No banned AI-template signature is present.

### Values pending this review

- ~~Final hero tracking at small, medium, and large clamp stops.~~ **Resolved 2026-08-15**: −.055em large / −.05em medium / −.045em small (see §3.2 validation table).
- ~~Garvit’s approval of the provisional hero sentence.~~ **Approved by Garvit 2026-08-15.** The OG is also locked: `Garvit Sukhija` as the large headline with the approved hero sentence beneath.

**Claude review status (2026-08-15): APPROVED as locked production design direction** — see design-review-claude.md for the four items to fold into the PRD (phone-number treatment, "Full changelog" destination, brand-string token, microcopy dedupe). Rendered-state gates in §12 apply at implementation reviews (Tasks 4–10), not to this document.

---

## Elevation Amendment — 2026-08-16

This amendment supersedes the procedural/on-call mascot language in §§1, 2,
5.6, 7.5, and 12 without changing the locked palette, type, spacing, content,
board physics, or accessibility contracts.

### Session product mechanic

- The mascot is the `SESSION ANALYST`, visibly tracking this tab’s coarse
  product journey. Public label: `TRACKING YOUR SESSION`.
- One shared `garvit-journey:v1` event array owns `Landed → Scrolled → Played
  → Read work → Converted`. It is capped, schema-validated, current-tab only,
  and never transmitted.
- The homepage section title is `Your session, instrumented.` and must disclose
  `this funnel is computed in your browser. PostHog sees the rest. I check it obsessively.`
- Five horizontal step bars fill live. Each row shows step-over-step status and
  a muted authored comparison (`100 / 76 / 49 / 28 / 11`) labelled `typical
  visitor · authored benchmark`. It is a display, never a visitor score.
- The pager gives one silent physical buzz on a first milestone. Existing board
  demotion/resolution may affect chrome and pose only as journey events; no
  on-call identity or event-log stream returns.

### Sourced figure — superseded by the 2026-08-17 amendment

- The runtime uses Ariana Chow / CaptainRipley's CC0 rigged robot as an
  abstract brand-mascot base. It has a large faceted head, compact torso,
  simplified mechanical eyes, and no realistic skin, facial topology,
  garment, hair, likeness, or game-class silhouette.
- The body is re-skinned in release blue with an independently authored dark
  treatment. A fitted incident-coral headset hugs the head silhouette; its mic
  terminates at the face. The incident-coral pager is visibly clipped to the
  chest and retains the merge-lime live-state dot. Neither prop may float.
- The camera remains a friendly head-and-torso crop. A simple smile is part of
  the default expression; the figure must read as a designed product mascot,
  not a game avatar or marketplace demo.
- Reactions remain spring-driven and interruptible: load wave, idle board guide,
  pointer look-at, milestone pager check, drag lean, work-read notice, shipped
  celebration, and board-demotion/resolution variants.
- Light and dark same-crop WebP renders of the live figure replace the old
  illustrated poster for reduced-motion, Save-Data, low-memory, WebGL failure,
  and no-scene states.

### Materials and depth

| Token | Light | Dark | Role |
|---|---|---|---|
| `--color-chrome` | `rgba(248,249,244,.82)` | `rgba(25,29,37,.82)` | Sticky functional chrome |
| `--material-panel` | `rgba(248,249,244,.94)` | `rgba(25,29,37,.94)` | Primary resting surfaces |
| `--material-panel-soft` | `rgba(248,249,244,.84)` | `rgba(25,29,37,.84)` | Nested product surfaces |
| `--material-overlay` | `rgba(248,249,244,.90)` | `rgba(25,29,37,.90)` | Popover/dialog material |
| `--chrome-blur` | `blur(22px) saturate(135%)` | same | Chrome only |
| `--shadow-panel` | `0 20px 54px rgba(23,25,35,.09), 0 3px 10px rgba(23,25,35,.06)` | `0 24px 60px rgba(0,0,0,.28), 0 3px 12px rgba(0,0,0,.24)` | Major panel lift |

- Blur is functional: sticky chrome 22px, popover/dialog 28–32px, scrim 8px.
  Resting content panels do not use backdrop blur.
- Major panels use one softened edge plus offset light, not border-plus-shadow
  ghost cards. Tickets use a 3px top semantic rail, never a thick side border.
- Entering overlays materialize with small translation/scale and blur settling;
  control hover/press follows physical elevation. Reduced transparency and
  increased contrast collapse to solid authored surfaces.

### Deliberate error surface

The not-found route is a compact `SEV-3 · RESOLVED` blameless incident
postmortem. Its root cause is `PM overestimated his own information
architecture.` and resolution links are home and `/#work-board`. No other
research patterns enter the v1 scope.

---

## Immersive Product World Amendment — 2026-08-17

**Status:** Approved by Garvit. This amendment supersedes conflicting robot,
operations-rail, homepage-order, poster-budget, and static-panel language in
§§1–2, 4–5, 7–8, 12, and the 2026-08-16 elevation amendment. Unaffected type,
semantic color, board physics, copy, accessibility, privacy, and case-content
rules remain locked.

**Shared execution checkout:**
`/Users/garvits/Documents/Side-Projects/Garvit-Portfolio-July` on `main` is the
single checkout used by Codex, Claude, and Garvit's local play-through. Do not
create or serve a split worktree during this implementation.

### Approved visual and interaction direction

- The homepage is one continuous product world across named `hero`, `board`,
  and `journey` anchors. It is not a hero card followed by dashboard panels.
- Dense product chrome remains. The hero becomes a broad, mostly borderless
  release field with the approved sentence, two unmissable CTAs, a dominant
  metaverse guide, and the real board entering its lower boundary.
- The actual board overlaps upward; the hero never renders a duplicate ticket.
  The public order is chrome, experiment strip, hero, board, journey, footer.
- `OperationsRail` is dissolved. Its working flags become a compact dock and
  retain native semantics, persistence, effects policy, and candid humor.
- The CaptainRipley robot is retired. The replacement is an abstract
  hooded/helmeted metaverse field agent—not a likeness—with a large graphic
  head, opaque graphite visor, porcelain shell, release-blue underlayer, and
  fitted coral milestone hardware. No floating or runtime-grafted props.
- The guide is purposeful: wave once, restrained fine-pointer look, idle work
  glance, drag-watch, pager check, ship celebration, and resolution settle.
  Existing reaction priority, expiry, queueing, and incident persistence remain
  authoritative.
- One persistent, pointer-transparent R3F canvas provides continuity while the
  DOM remains the complete interface and sole navigation authority. No
  scroll-jacking, mandatory scrub, parallax wallpaper, or content gating.
- Section progress drives critically damped camera/character transitions.
  Re-entry and interruption continue from presentation state. Reduced motion
  materializes equivalent state rather than removing meaning.
- Work precedes the session funnel. Case routes begin with a real or
  verified-fact artifact, value sentence, and factual signals, then settle into
  the existing 68ch reading measure.
- At 1440×900, the approved hero sentence uses no more than two lines and the
  guide retains a meaningful 40–50% crop. Its final size/measure/tracking must
  pass a new optical validation; the old tracking values are candidates, not an
  automatic lock for the changed layout.
- At 390×844, both 56px-minimum CTAs remain in the first viewport and the board
  follows immediately. At 320/390/430px the board exposes labelled column tabs,
  `1 of 3`, previous/next controls, and a next-column peek; every project is
  reachable without drag or invisible horizontal-scroll discovery.

### Binding production constraints

- Authority order is `DESIGN.md` + `PRD.md`, then the approved immersive spec
  at `docs/superpowers/specs/2026-08-17-immersive-product-world-design.md`, then
  the implementation plan. Any remaining older conflict is resolved by this
  amendment.
- The recoverable baseline is annotated tag
  `checkpoint/pre-sougen-rebuild-2026-08-17` at commit `f8b91fe`.
- No new runtime dependency or `package.json` change is allowed without
  Garvit's approval. Use the installed R3F/Drei/Three/Motion/Radix stack.
- Hard stop order: candidate contact sheet passes → isolated Scene 1 static
  composition passes → interactive Scene 1 Apple/Taste audit passes → only
  then homepage or case-route migration begins.
- Codex owns art direction, world architecture, composition, motion tuning,
  performance tradeoffs, and visual acceptance. Claude owns candidate
  acquisition/inspection, contact sheets, repetitive migrations,
  interface-locked test migrations, capture matrices, gate execution, and
  mechanical regression fixes. Codex reviews every delegated render.
- Existing board, flags, funnel, case content, 404, and OG behavior may be
  rebuilt when the new visual system warrants it, but working semantics,
  verified facts, accessibility, privacy, and analytics may not regress.
- The session-local journey stream stays in `sessionStorage` and never feeds
  PostHog. PostHog retains pageviews/autocapture plus only `resume_download`,
  `contact_click`, `case_open`, and `full_case_read`; no scene, guide,
  board-position, or funnel-stage custom capture may be added.
- The exact disclosure is `this funnel is computed in your browser. PostHog
  sees the rest. I check it obsessively.`
- If Muko is selected, preserve its exact license, creator, source URL,
  revision, and modification record in the repository; visible site credit is
  not required by Garvit's product decision. Select Muko or Quaternius on
  rendered and technical merit at the contact-sheet gate.
- Asset ceilings are one local GLB, ≤25k triangles, ≤30 draw calls measured in
  the production R3F renderer, ≤1.8 MB transferred, and 512–1024px textures.
  One atlas means one UV/material set with permitted base-color, normal, and
  ORM maps. No runtime CDN, ambiguous third-party texture, or trademarked
  patch.
- The canvas renders on demand when idle, runs continuously only during
  look/reaction/transition, pauses when hidden or after the active region, and
  falls back to camera-matched light/dark posters for reduced motion,
  Save-Data, low capability, performance kill, or renderer failure.
- The poster ceiling is ≤90KB for the one theme-selected hero fallback. Initial
  homepage JS remains ≤170KB gzip, lazy Three vendor ≤235KB gzip, world scene
  module ≤25KB gzip, and fonts ≤100KB.
- Apple gate: ≥34/40, no dimension below 4, no input lockout, and no
  unmotivated motion. Taste gate: ≥22/25, no dimension below 4, and every
  applicable pre-flight item passes.
- Every visual gate stores light/dark 1440×900 and 390×844 captures, normal and
  slowed interaction recordings when motion exists, reduced-motion and
  poster/WebGL-failure captures, scorecards, and bundle/asset/console/axe/Core
  Web Vitals evidence under `docs/qa/immersive/`.
- Preserve factual content. Never invent metrics, product screenshots, shipped
  status, or case claims. A missing artifact becomes an authored diagram made
  only from verified facts.
