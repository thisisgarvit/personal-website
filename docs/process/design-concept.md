# Design concept — Quiet Operator, One Killer Toy

Status: design direction for pixel approval. No application architecture or Next.js scaffolding is included.

## Positioning

**Garvit makes ambiguous product ideas concrete enough to debate, test, and ship.**

The portfolio should feel like opening a calm working surface belonging to a product manager who can move between strategy and a live prototype. It is not a career archive, a metrics wall, or a designer cosplay site. The visitor sees work, decisions, and artifacts before biography. The quiet base earns trust; one contained prioritization mechanic earns the smile.

The ten-second read should communicate:

1. Garvit is a product manager who builds.
2. He has credible product material worth opening: a real shipped operations product, two detailed AI concepts, and a teardown.
3. He can explain a decision without inflating it.

## Sitemap and information architecture

### Primary navigation

- **Work** — default landing and dominant route.
- **Notes** — teardowns and shorter product observations.
- **About** — one compact personal note, current focus, contact, and resume download.

Keyboard hints may expose `W`, `N`, and `A` as accelerators. They are shortcuts, not decorative numbering.

### Home `/`

1. **Status strip** — hello, Bengaluru time, current focus. This establishes presence without a biography block.
2. **Positioning hero** — “Product manager who builds” plus the real proof sentence: “I write PRDs on GitHub, deploy prototypes on weekends, and build dashboards before asking engineering.”
3. **Selected product work** — project-led, in this order:
   - **Stay Portal** — first because it is real, shipped, specific, and visually demonstrable.
   - **AI Browser — Maxie** — the richest product-strategy case.
   - **Agentic Calendar** — systems and autonomy thinking.
   - **One Delightful Product Experience** — a shorter Dynamic Island teardown.
4. **Signature toy: MVP Budget** — after the first project has already established credibility. It is visible but never modal, full-screen, or required.
5. **Things I’ve built** — a compact border-led index of the KPI dashboard, interactive prototypes, AI Jira automation, and Amplitude setup. These are supporting proof, not equally weighted portfolio cards.
6. **Small human sidecar** — two or three specific non-work interests or artifacts only if Garvit supplies them. No generic hobbies grid.
7. **Contact and resume** — direct email/LinkedIn; resume is a secondary download link.

### Case study routes

- `/work/stay-portal`
- `/work/maxie`
- `/work/agentic-calendar`
- `/notes/dynamic-island`

Case studies use a consistent decision narrative rather than a school-portfolio process template:

1. **The situation** — user, constraint, and why this mattered.
2. **The bet** — one sentence describing the product decision.
3. **What I made** — real screenshots/prototype, shown large.
4. **Decisions and trade-offs** — 3–5 concrete choices, each paired with what was deliberately excluded.
5. **Evidence** — observed usage, prototype feedback, verified facts, or current unknowns. Concept work labels assumptions as assumptions.
6. **What I’d change next** — candid reflection.

There is no primary experience timeline. Work history stays to a short paragraph on `/about`; chronology lives in `Garvit Sukhija Product.pdf` behind “Download resume.”

## Design language

### Palette

The base is cool and mineral rather than cream or pitch black. It references the tools in Garvit’s work—browser chrome, calendar blocks, product-status states—without turning the site into a dashboard.

| Token | Name | Hex | Use and reason |
|---|---|---:|---|
| `--canvas` | Cool Sheet | `#F5F7F6` | Main background. Reads like a clean working document, not a beige lifestyle template. |
| `--ink` | Wet Graphite | `#14211E` | Primary type. A softened green-black is calmer than pure black without creating dark-utility drama. |
| `--muted` | Review Grey | `#5B6964` | Secondary text and metadata; still passes AA at normal text size on Cool Sheet. |
| `--line` | Trace | `#CBD5D1` | Rules, dividers, table structure, and browser-frame edges. Structure comes from lines, not rounded cards. |
| `--surface` | Interface Mist | `#E7EEEB` | Screenshots, diagrams, and alternate reading surfaces. Suggests prototype chrome while staying quiet. |
| `--action` | Browser Blue | `#0F6073` | Links, focus, and active controls. Rooted in Maxie/browser work and distinct from generic SaaS cobalt. |
| `--decision` | Planning Yellow | `#F1C94A` | The toy’s finite budget and selected decision. It behaves like a physical planning token; never used for body text. |
| `--shipped` | Approval Green | `#2D6F5E` | Shipped/approved states and positive budget status. Always paired with text or an icon. |

There are no gradients. Planning Yellow is concentrated inside the toy and a few focus moments; it is not a lone site-wide “pop color.” Browser Blue handles interaction, and Approval Green handles state.

### Type pairing

**Primary: Schibsted Grotesk Variable** (SIL Open Font License, downloadable and self-hostable). It has an editorial calm and slightly idiosyncratic proportions without the polished-anonymous feeling of Inter or Space Grotesk. Its open forms support long case studies, while its heavier weights can carry the large, compressed hero.

**Annotation: Fragment Mono** (SIL Open Font License, downloadable and self-hostable). Garvit writes PRDs on GitHub and builds prototypes; a code-literate annotation face is honest to the work. Fragment’s human, slightly mechanical rhythm feels more like working notes than a terminal theme. It is restricted to 12–14px status, constraints, keyboard hints, and artifact labels.

Production must use the unmodified upstream webfont files—not SF Pro, SF Mono, or patched Nerd Font variants. Subset Schibsted Grotesk and Fragment Mono into local WOFF2 files and serve them with `font-display: swap`. The style tile names the chosen families and uses neutral system fallbacks because it is a single-file, no-CDN artifact.

Type scale:

- Hero: `clamp(4rem, 9.6vw, 8.75rem)`, 0.88–0.92 line height, −0.055em tracking.
- Section statement: `clamp(2.4rem, 5vw, 5.4rem)`, 0.96 line height.
- Project title: `clamp(2rem, 3.4vw, 4rem)`.
- Reading lead: 22–26px, 1.35 line height, maximum 28 characters per line.
- Body: 18–20px, 1.6 line height, 62–68 character measure.
- Annotation: 12–13px mono, uppercase only for short labels.

### Layout system

- **Desktop frame:** maximum 1,520px, with 32–64px fluid outer gutters.
- **Grid:** 12 columns. A two-column left rail holds status/section context; the primary story uses seven or eight columns; the remaining space creates an intentional right-side void or holds supporting facts.
- **Alignment:** left-biased and asymmetric. Hero, work text, and controls do not share one centered axis.
- **Project modules:** ruled compositions, image bleeds, and full-width work surfaces. Corners stay square. A project is identified by its problem and artifact, not a generic card shell.
- **Images:** one large artifact is better than a montage of tiny device mockups. Stay Portal’s day view gets the widest frame; supporting screens appear only when they advance the narrative.
- **Rhythm:** 8px base unit; major vertical intervals of 96/144/192px. Rules create pacing between sections.
- **Navigation:** a small, persistent top row. Key hints are literal keyboard affordances, not `01 / 02 / 03` decoration.

## Motion principles

1. **Nothing moves until it communicates.** The base page is stable; no perpetual marquee, floating mockup, cursor follower, or scroll hijack.
2. **Feedback is quick.** Links and control states resolve in 120–180ms. Project previews may translate 4px; they do not zoom theatrically.
3. **The toy has the motion budget.** Budget bars and feature allocations settle in 260–420ms with restrained spring behavior. State text updates immediately.
4. **Sound is opt-in.** A tiny token-snap sound may be available inside the toy only after a visible “Sound on” action. Default is silent.
5. **Page transitions are continuity, not spectacle.** Shared project titles/artifacts may cross-fade in 180–240ms; content remains accessible without JavaScript.

## Signature toy concepts

### Concept A — MVP Budget (recommended, no Three.js)

**What it is.** A contained mini product exercise titled “You have 24 weeks. Make the cut.” Visitors allocate two-week increments across five Maxie workstreams: Context Memory, Agent Recorder, Safety & Action Logs, Pilot/Onboarding, and Marketplace. The total cannot be hidden. As the allocation changes, a one-line consequence updates. “Compare with Garvit’s cut” reveals his sequencing: establish memory, prove one repeatable agent workflow, build guardrails, invest in onboarding, and defer the marketplace until supply and retention exist.

**What it proves.** Prioritization under constraint; separating a compelling vision from an MVP; sequencing learning before network effects; and explaining what is excluded. This is core PM judgment, not portfolio decoration.

**Where it lives.** On the homepage after Stay Portal and before the remaining selected work. It is introduced as a small product decision and links into the Maxie case study. The case study can repeat the final allocation as a static decision artifact, not a second toy.

**Humor device.** The interface, not prose, creates the joke. Over budget: “Strong roadmap. Different quarter.” Zero marketplace allocation: “Network effects can wait for a network.” Unspent time: “Unallocated weeks are also a decision.”

**Cost/risk.** Medium-low. Native inputs and a small client-side state module; no rendering library. Main risk is implying false precision, solved by labeling the 24-week frame as a discussion model and showing assumptions. Analytics should record only interaction completion, never every allocation.

**Fallback.** Mobile retains accessible range inputs. No-JS and reduced-motion users see Garvit’s allocation as a static five-row table with the rationale expanded.

### Concept B — Context Dial (no Three.js)

**What it is.** A three-position control—`10 seconds`, `2 minutes`, `Full case`—changes one Maxie preview from a problem/bet pair, to constraints and trade-offs, to the case study entry point. The control alters information depth, not font size or visual noise.

**What it proves.** Progressive disclosure, executive communication, and the ability to tailor the same product decision to different audiences without changing the truth.

**Where it lives.** Attached to the Maxie featured project, below the initial static summary so it never blocks comprehension.

**Cost/risk.** Low-medium. Straightforward HTML state and content transitions. The risks are layout shift, duplicated indexed content, and resemblance to getcoleman’s pitch slider. It would need distinct “decision depth” content and careful URL/SEO handling to feel authored.

**Fallback.** The 10-second version stays visible; the other layers become normal disclosure sections.

### Concept C — Constraint Atlas (Three.js / react-three-fiber)

**What it is.** A bounded 3D decision field for Maxie. Labeled feature planes sit across three axes—user trust, learning speed, and platform leverage. Choosing a constraint such as `six-month MVP`, `privacy-first`, or `team adoption` moves features into Now / Next / Later zones and exposes the reason for each move. There is no decorative spinning object; the scene changes only when the visitor changes a product constraint.

**What it proves.** Systems thinking, scenario planning, and recognition that the roadmap is a dependency model rather than a feature list.

**Where it lives.** Inside the Maxie case study after the product vision and before the chosen MVP. It is lazy-loaded after an explicit “Explore the constraints” action, never above the fold.

**Cost/risk.** High. 3D labels, camera controls, small-screen legibility, keyboard equivalence, GPU cost, and the possibility of looking like an abstract graph all require care. Even well executed, it is harder to understand than MVP Budget in ten seconds.

**Fallback.** The same decisions render as an accessible two-dimensional Now / Next / Later matrix. Reduced-motion users never load the WebGL scene.

### Recommendation

Build **MVP Budget**. It has the clearest line from mechanic to PM skill, stays contained, works on mobile, and can be genuinely useful inside the Maxie narrative. Context Dial is the reserve concept if Garvit prefers a quieter interaction. Constraint Atlas meets the Three.js exploration brief but should not win unless visual spectacle becomes a higher priority than immediate comprehension.

## Microcopy quirk plan

Register: candid, concise, specific. No emoji labels, fake bravado, jokes in every paragraph, or “building the future” language. Humor appears after an action or beside an honest constraint.

1. **Status strip:** “Hello. Bengaluru, 14:32 IST. Currently: shipping AI features.”
2. **Hero proof:** “I write PRDs on GitHub, deploy prototypes on weekends, and build dashboards before asking engineering.”
3. **Stay Portal caption:** “Built for five rooms. Designed like the owner has better things to do.”
4. **Concept label:** “Concept, not theatre. Assumptions included.”
5. **Toy over-budget state:** “Strong roadmap. Different quarter.”
6. **Case reflection heading:** “What I’d change with another week.”
7. **Resume CTA:** “Need the chronology? Download the resume.”
8. **Email-copy feedback:** “Copied. One less tab to keep open.”

## Light and dark strategy

Light is the authored primary theme and the only theme shown in the approval tile. That choice prevents the site from drifting toward the rejected dark command-surface references and gives screenshots/prototypes neutral surroundings.

The implementation may respect `prefers-color-scheme: dark` without adding a prominent theme toy or manual toggle:

| Light | Dark equivalent |
|---|---|
| Cool Sheet `#F5F7F6` | Night Sheet `#101714` |
| Wet Graphite `#14211E` | Chalk `#EAF0ED` |
| Review Grey `#5B6964` | Night Review `#A8B6B0` |
| Trace `#CBD5D1` | Night Trace `#34423D` |
| Interface Mist `#E7EEEB` | Night Surface `#18221F` |
| Browser Blue `#0F6073` | Screen Blue `#67BED2` |
| Planning Yellow `#F1C94A` | Planning Yellow `#F1C94A` |
| Approval Green `#2D6F5E` | Mint State `#72B9A2` |

Dark mode preserves the light theme’s hierarchy and line structure; it does not introduce neon accents, glows, gradients, or terminal motifs. If visual QA shows screenshots becoming muddy, v1 should ship the authored light theme alone rather than an unconsidered toggle.

## Mobile, reduced motion, and accessibility

- Mobile is a first-class one-column reading order, not a scaled desktop composition. The status rail becomes a top strip; project metadata moves before the artifact it describes.
- Hero type clamps to 48–64px and avoids orphaned one-word lines. Body text stays at least 17px.
- Controls and navigation have a minimum 44×44px target. The MVP Budget uses labeled native range controls plus visible numeric output.
- Every interactive mechanism works with keyboard, touch, and screen reader. Key shortcuts never fire while an input is focused and are always optional.
- Focus is a 3px Browser Blue outline with 3px offset; Planning Yellow may be added as a second contrast ring on dark surfaces.
- Color never carries state alone. Budget status includes text; Stay Portal payment states retain labels/patterns; charts have direct labels.
- `prefers-reduced-motion: reduce` removes spring interpolation, shared-element transitions, and smooth scrolling. State changes become immediate.
- The live clock uses `aria-live="off"` so it does not repeatedly announce. Time is supplemental, not essential information.
- Sound is off by default and never the sole feedback channel.
- Case study screenshots require meaningful alt text describing the product decision shown, not “screenshot of app.” Decorative UI fragments are hidden from assistive technology.
- WebGL is never required for content or navigation. If Constraint Atlas is explored later, the 2D decision matrix remains the semantic source of truth.

## Anti-template check

- No cream/serif/terracotta lifestyle palette.
- No near-black canvas with one acid accent.
- No gradient hero.
- No Inter or Space Grotesk.
- No emoji section markers.
- No centered-everything composition.
- No rounded card stack.
- No decorative `01 / 02 / 03` labels.
- No experience timeline, metrics wall, or “my journey” spine.
- The only high-play interaction explains a real product trade-off and remains optional.
