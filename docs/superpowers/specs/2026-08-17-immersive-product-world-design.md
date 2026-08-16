# Immersive Product World — Design Specification

**Status:** approved production direction
**Date:** 17 August 2026  
**Safety checkpoint:** `checkpoint/pre-sougen-rebuild-2026-08-17` at `f8b91fe`

## Outcome

Recompose `garvit.app` from a polished dashboard-style portfolio into one continuous interactive product world. The visitor should understand Garvit's product value immediately, discover real work before the session analytics, and feel that the character, work board, and instrumentation are parts of one authored experience.

The Sougen reference is a quality and commitment benchmark, not a visual template. We will borrow its spatial confidence, dominant character, controlled palette, and continuity. We will not copy its metaverse copy, crypto context, cyan-on-white styling, or scroll-jacking.

**Design read:** Reading this as a full-overhaul PM portfolio for founders, recruiters, and product leads, with a playful cinematic product-world language, leaning toward bespoke native CSS, R3F, and the existing Radix product primitives.

**Taste dials:** `DESIGN_VARIANCE: 9`, `MOTION_INTENSITY: 8`, `VISUAL_DENSITY: 4`. The dense product chrome is a deliberate local exception to the global density value; the content beneath it must breathe.

**System decision:** this is a bespoke portfolio aesthetic, not an imitation of an official product design system. Keep the existing semantic tokens and accessible Radix primitives. Do not add a second component system.

## Approaches considered

### A. Persistent metaverse guide — selected

One WebGL world spans the hero, work, and session sections. A large character changes position and behavior as the visitor moves through the page while accessible DOM content remains the primary interface. The board enters the hero composition and becomes the next section. This achieves immersion without making case studies or controls inaccessible.

### B. 3D hero with conventional sections

The character appears only in the opening screen and the rest remains a normal scroll page. This is cheaper and lighter, but repeats the current failure: a strong object decorating a brochure.

### C. Full 3D portfolio world

Tickets, navigation, and cases all become WebGL objects. This offers maximum spectacle but introduces visitor homework, weakens keyboard and screen-reader access, complicates long-form evidence, and makes the PM work harder to inspect.

## Experience architecture

The homepage has three connected scenes, not a stack of rounded panels.

### Scene 1: Landed

- Sticky product chrome remains dense and immediately identifies `garvit.app`.
- The hero becomes a broad, mostly borderless release field rather than a card inside a grid.
- Garvit's approved sentence and the resume/contact CTAs remain dominant and legible.
- A replayable pencil/white-sheet → structured digital → release-color sequence
  expresses MVP → beta → GA without acting as a loader. Copy and CTAs are
  immediate; reduced-motion and no-JS use GA.
- A modeless, skippable onboarding-satire tray asks only `Founder`, `Recruiter`,
  `Product lead`, or `Just browsing`, then admits `Noted. This changes nothing.
  It never does.` It never gates or personalizes. Its UI state is tab-local,
  while selection sends `persona_selected` to PostHog with `persona`,
  `surface: "hero_onboarding"`, and `$set.visitor_persona`; the tray discloses
  this before input. Skip emits nothing.
- The metaverse guide occupies roughly 40–50% of the desktop viewport and is deliberately cropped at an edge. It is a spatial anchor, not an illustration in a widget.
- One real work ticket rises into the bottom of the composition. It is an entry to the board, not duplicated fake content.
- The guide waves once, tracks a fine pointer with restrained head/torso motion, and glances toward the work ticket after idle. Touch users get an authored idle composition.
- Feature flags move from the tall operations rail into a compact product dock. Every existing flag remains functional and accessible.

### Scene 2: Things I've built

- The sprint board follows the hero directly. The session funnel no longer delays access to work.
- The board visually overlaps or grows out of the hero's lower edge, so it feels like the same product surface.
- Existing spring drag, keyboard movement, persistence, build health, preview, reset, and announcements remain intact.
- During drag, the guide leans toward the active ticket. A shipped/demoted milestone changes its visor/pager state and pose through the existing shared signal system.
- Resting tickets use larger artifact thumbnails or product fragments where available. Project identity comes from real work, not extra decoration.

### Scene 3: Your session, instrumented

- The existing live funnel stays because it is the strongest screenshare mechanic.
- It appears after work, where its events now have meaningful visitor history.
- The guide settles alongside the funnel and gestures to the latest reached stage. The disclosure “this funnel is computed in your browser. PostHog sees the rest. I check it obsessively.” remains prominent.
- Metrics are display-only. No scoring, quiz, conversion shame, or interaction prerequisite is introduced.

The footer remains compact. The page does not add a resume timeline, testimonials, skill clouds, or a generic About section.

## 3D character direction and acquisition

The current CaptainRipley robot is retired. It cannot reach the target through lighting or material changes because its silhouette, eyes, and proportions read as a game mascot, and its headset/pager additions read as attached primitives.

The new guide is an abstract metaverse field agent, not a likeness of Garvit. Its target silhouette is a smooth hooded/helmeted humanoid with a large graphic head, simple dark visor, and soft technical clothing. It should feel compatible with Sougen's visual world while retaining `garvit.app`'s product vocabulary.

### Asset route

1. Evaluate the rigged, 11.7k-triangle CC-BY [Muko Art stylized astronaut](https://sketchfab.com/3d-models/astronaut-character-stylized-rigged-free-model-c8daa753952e454eb3c6195446751e88) as the primary outfitted base because its helmeted silhouette already provides the required metaverse read.
2. Keep the 2025 CC0 [Quaternius Universal Base Characters](https://quaternius.com/packs/universalbasecharacters.html) regular/teen masculine rig as the fallback if the Muko download has unsuitable mesh separation, animation bindings, or texture rights.
3. Reject avatar-platform dependencies whose availability or commercial-serving terms could change underneath the portfolio. Reject Kenney-class low-detail figures because they remain visibly game-asset quality.

The selected source must pass a rendered contact-sheet gate before integration: front three-quarter, profile, hero crop, mobile crop, light scene, and dark scene.

Garvit approved repository-only attribution if Muko wins: preserve the exact
CC-BY license, creator, source URL, revision, original hash, and modification
record in the repository; no visible site credit is required. The contact-sheet
gate selects between Muko and Quaternius on rendered and technical merit.

### Art direction

- Porcelain/light-gray outer shell, graphite visor, release-blue soft technical underlayer.
- Coral is restricted to the pager/milestone hardware; lime or cyan is used for healthy/live visor state.
- The headset becomes helmet architecture: fitted ear modules and a subtle mic/light strip. No external orange tube.
- The pager becomes a chest or wrist module aligned to the suit topology. Nothing floats.
- Materials use controlled roughness variation, one subtle normal/detail treatment, and no chrome/glass spectacle.
- Lighting uses a soft key, cool fill, narrow rim, and grounded contact shadow. The character must retain readable volume in both themes.
- Required poses are friendly idle, wave, board guide, drag-watch, milestone/pager check, ship celebration, and resolution/settle. They must read at the actual on-page crop.

### Delivery budget

- One locally hosted GLB; no runtime CDN.
- Hard ceilings are 25k triangles, 30 draw calls measured in the production
  R3F renderer, and 1.8 MB transferred. A visually superior smaller asset is
  not rejected for falling below a quality lower bound.
- Textures are 512–1024px and compressed for web delivery. One atlas means one
  UV/material set with permitted base-color, normal, and ORM maps.
- Existing R3F, Drei, and Three dependencies remain the runtime stack.
- The poster is derived from the same camera and model in light and dark states.
- The canvas pauses when hidden or out of its active region, respects reduced motion/data and the performance kill switch, and never blocks pointer interaction.

Exact Sougen asset fidelity would require a dedicated 3D artist. This plan reaches the same class of web experience by combining a strong licensed base with authored materials, integrated props, camera choreography, and page-scale staging; it does not pretend a random free GLB is equivalent to custom character production.

## Technical boundaries

### Persistent world

- Create `src/features/world/ExperienceWorld.tsx` to own the single persistent canvas, scene state, and capability fallback.
- Create `src/features/world/WorldAnchor.tsx` to publish named DOM targets: `hero`, `board`, and `journey`.
- Create a small world director/store with an explicit state shape: active
  scene, active-region/document visibility, active work slug, drag state, and
  the existing derived `MascotReactionState`. Continuous section progress
  stays in mutable anchor metrics and never becomes per-frame React state.
- Keep DOM sections authoritative. The canvas has `pointer-events: none`, cannot be the only source of information, and never owns navigation.
- Replace `MascotExperience` with the world-owned experience boundary after the
  isolated prototype passes; do not extend the retired rail-card lifetime.
- Replace the current robot-specific skeleton resolver with an adapter for the selected rig. Preserve the reaction state machine and signal contracts.

### Homepage composition

- `src/app/page.tsx` order becomes chrome, experiment strip, immersive hero, board, session journey, footer.
- `page.module.css` changes from a hero/rail dashboard grid to an overlapping world-and-content composition.
- `OperationsRail` is dissolved. Its feature flags survive as a compact dock and its former mascot slot becomes a world anchor/status surface.
- The hero receives a world anchor and a real work-entry affordance.
- The board publishes active ticket/drag state to the world director without depending on Three.js.
- The journey section publishes stage changes to the same event provider already used by the mascot.

### Case-study template

Each case route opens as a designed product surface, then becomes calm long-form reading.

- Retain global product chrome and add an immediate back-to-board affordance.
- Add an artifact-led opening with project kind, title, one-sentence value, two or three factual signals, and one large real product artifact.
- Stay Portal opens on its day-view/product artifact; Maxie and Agentic Calendar open on their product-system artifacts; Dynamic Island opens on its continuity/status diagram.
- After the opening, retain a 68-character reading measure.
- Introduce distinct decision, constraint, and outcome treatments instead of leaving every section as undifferentiated MDX prose.
- Add previous/next project navigation.
- Never invent metrics, screenshots, or shipped status.

## Mobile design

Mobile must remain dramatic and must make every project obvious.

- The hero uses a purposeful model crop, not a stack of the desktop cards. The character occupies the upper/right field while copy remains readable.
- The hero sentence is tuned to about five lines at 390px if possible without reducing below the locked readable range.
- The work board appears immediately after the hero.
- The board exposes column tabs plus a visible `1 of 3` indicator, previous/next controls, and a next-column peek. Tapping a tab scrolls to its column.
- All four projects are reachable without dragging and without discovering invisible horizontal scroll.
- The first-screen case-preview layout includes the primary “Read full case” CTA.
- The model poster uses the same authored camera crop as WebGL; reduced motion or low capability does not receive a visually unrelated fallback.
- Test widths are 320, 390, 430, 768, 1024, 1440, and 1600px in both themes. Test 200% zoom, keyboard only, coarse pointer, reduced motion, reduced transparency, save-data fallback, and WebGL failure.

## Motion and continuity

- No scroll-jacking, mandatory scrub, parallax wallpaper, or content hidden behind animation.
- Section progress is observed and fed into critically damped scene transitions.
- The character changes target position, camera crop, and pose; the DOM itself remains stable.
- A re-entered scene continues smoothly from presentation state rather than restarting.
- Reduced motion replaces travel with direct materialized state changes and the same information.
- Existing board physics remain independent of the scene. The world listens to drag state but never controls ticket movement.

## Work split

### Codex leads and implements

- Art direction and final model selection after the rendered contact-sheet gate.
- Persistent-world architecture and world director.
- Character materials, camera choreography, look-at, and reaction tuning.
- Homepage scene composition and board-to-world integration.
- Final mobile composition, case-template design judgment, performance decisions, and visual acceptance.

### Claude Code implementation lane

- Mechanical page/component migrations after interfaces are locked.
- Feature-flag dock extraction while preserving semantics and tests.
- Case-route prop/data transcription and repeated MDX migrations.
- Mobile column tabs/indicator plumbing and repetitive responsive states.
- Regression fixes that do not require new art-direction decisions.

### Claude Code grunt-work lane

- Download candidates, capture source URLs/revisions, preserve license texts, and produce the six-view contact sheets.
- Inspect GLB meshes, skeleton names, animations, texture dimensions, triangle count, draw calls, and transferred size.
- Run/record optimization passes and poster exports from the locked camera.
- Inventory existing case artifacts and map each to its route without changing claims.
- Maintain the viewport/theme/input screenshot matrix and compare it to acceptance captures.
- Run unit, integration, E2E, accessibility, type, lint, build, and bundle-budget gates; return exact failures for Codex judgment.

No delegated output ships without Codex reviewing the rendered result.

Garvit removed the earlier “relocate, never rebuild” restriction. Passed
surfaces may be rebuilt when the redesign warrants it, but their verified
facts, functional semantics, accessibility, privacy, and analytics contracts
may not regress. Claude migrates affected tests immediately after each
interface lock rather than batching test work at the end.

## Approved execution constraints

- Shared execution checkout:
  `/Users/garvits/Documents/Side-Projects/Garvit-Portfolio-July` on `main` for
  Codex, Claude, and Garvit's play-through; no split checkout.
- No new runtime dependency or `package.json` change without Garvit's approval.
- Hard stop order: model contact sheet → isolated static Scene 1 composition →
  isolated interactive Scene 1 Apple/Taste pass → public-page migration.
- The session-local journey stream never feeds PostHog. PostHog keeps
  pageviews/autocapture and only `resume_download`, `contact_click`,
  `case_open`, `full_case_read`, and `persona_selected` as custom events.
- The board itself overlaps the hero; no duplicate hero ticket exists.
- DOM content is authoritative; the one canvas is pointer-transparent, lazy,
  demand-rendered when idle, paused outside the active region/hidden document,
  and never owns navigation.
- Fallback posters use the locked production camera and only the active theme
  downloads. Poster ceiling is 90KB; initial homepage JS stays ≤170KB gzip,
  lazy Three vendor ≤235KB gzip, world scene ≤25KB gzip, GLB ≤1.8MB, and fonts
  ≤100KB.
- The changed hero size/measure receives a new optical validation; old tracking
  values are candidates rather than an automatic lock.
- Mobile exposes column tabs, `1 of 3`, previous/next controls, and a next peek
  at 320/390/430px. All projects remain accessible without dragging.
- Apple audits require ≥34/40 with no dimension below 4. Taste audits require
  ≥22/25 with no dimension below 4. Evidence includes both themes at 1440×900
  and 390×844 plus interaction, reduced-motion, poster/failure, bundle, asset,
  console, axe, and Core Web Vitals records.

## Binding design audits

The implementation plan must include these as explicit blocking tasks. They are not end-of-project suggestions.

### Apple Design audit

Codex judges the rendered interaction using `skills/apple-design/SKILL.md`. Claude prepares captures, slow-motion recordings, measurements, and regression evidence.

Run the audit at the interactive world prototype, integrated homepage, and release-candidate milestones. Score each dimension from 0 to 5:

1. Purpose and zero visitor homework.
2. Agency, reversibility, and wayfinding.
3. Immediate and continuous response.
4. Direct manipulation, velocity handoff, and interruption from presentation state.
5. Spatial continuity and symmetric paths.
6. Materials, depth, and hierarchy.
7. Flexibility across pointer, touch, keyboard, motion, transparency, contrast, and fallback modes.
8. Craft, typography optics, frame stability, and delight.

Gate: at least 34/40, no dimension below 4, no input lockout, and no unmotivated motion. Every moving element must communicate hierarchy, feedback, state transition, or continuity. Gesture-driven elements must respond on pointer-down, track continuously, and remain interruptible. Large scene moves require a reduced-motion equivalent rather than simple removal of meaning.

### Taste audit

Codex judges the rendered page using `skills/taste-skill/SKILL.md`. Claude runs the mechanical pre-flight checks and produces the desktop/mobile comparison matrix.

Run the audit at composition lock, case-template lock, and release candidate. Score each dimension from 0 to 5:

1. Composition, silhouette, and first-viewport richness.
2. Hierarchy, content density, CTA legibility, and first-glance comprehension.
3. Authorship: no template rhythm, generic card stack, fake product UI, or AI-slop copy.
4. Asset quality, material restraint, palette consistency, and real artifact use.
5. Responsive integrity, theme parity, accessibility, and performance.

Gate: at least 22/25, no dimension below 4, and every applicable Taste pre-flight item passes.

Project-specific contextual decisions for the Taste audit:

- Version chrome is retained because “this site is my product” is the explicit premise, but version metadata stays out of the hero copy stack.
- `DELHI / IST` appears once in product chrome. Remove duplicated atmospheric locale labels from the hero.
- The semantic release, merge, and incident colors may coexist because they encode real product state. Only one is visually dominant in any scene; question/context colors remain subordinate ticket identity.
- The approved hero sentence must fit within two lines at 1440px while preserving a meaningful character crop. On mobile, it may reflow further but must keep both CTAs in the first viewport at 390×844.
- Existing authored inline icons are preserved for continuity. New icons must come from the already installed Radix family or be simple conventional typographic marks; do not add a mixed icon library.
- The local session funnel may retain bar tracks because live comparison is the product mechanic, not decorative marketing scoring. It must remain clearly labelled as session-local display rather than visitor evaluation.

### Audit evidence

For every gate, store:

- light and dark captures at 1440×900 and 390×844;
- one pointer interaction recording at normal speed and one slowed review of interruption/settle;
- reduced-motion and poster/WebGL-failure captures;
- the completed Apple and Taste scorecards with concrete failures and changes made;
- bundle, asset, console, axe, and Core Web Vitals evidence.

An audit does not pass because the checklist was run. It passes only after its visible failures are corrected and the rendered result is re-scored.

## Failure handling

- If the primary model lacks a usable humanoid rig or clean mesh/material separation, reject it at the contact-sheet gate and use the Quaternius fallback.
- If the selected model cannot stay within the transfer/render budget after optimization, keep the authored poster on constrained devices and load WebGL only on capable clients.
- If WebGL fails, retain full content and interactions with the matching poster; no empty stage or layout shift.
- If a scroll scene cannot meet reduced-motion parity, simplify the transition rather than adding an exception.
- If a case lacks a trustworthy hero artifact, use an authored diagram built from verified product facts rather than synthetic product UI.

## Acceptance criteria

1. A 1440×900 homepage screenshot reads as one rich interactive world, not a hero card plus dashboard widgets.
2. The character is visually dominant and obviously purposeful within ten seconds.
3. The work board begins before the session funnel and is visibly connected to the hero.
4. At 390×844, every project is discoverable through explicit controls; no invisible horizontal-scroll dependency remains.
5. Case routes open with a real artifact and factual signals before long-form prose.
6. Resume and contact remain unmissable without waiting for animation.
7. Keyboard, touch, reduced-motion, poster, and WebGL-failure paths preserve access and meaning.
8. No console errors, axe serious/critical violations, horizontal page overflow, invented evidence, or budget regression.
9. The current RC remains recoverable from `checkpoint/pre-sougen-rebuild-2026-08-17`.
10. Garvit's final test is visual: the result should feel 2026 and screenshare-worthy, not merely technically correct.
