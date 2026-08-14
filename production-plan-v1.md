# garvit.app Production Plan

## Summary

Build the approved “This site is my product” concept as a production
Next.js portfolio. The dense product chrome remains the first-glance
hook; the hero, sprint board, and case-study routes gain a controlled
density gradient with more space and larger type.

Success requires:

- A founder understands the premise, sees real work, and finds both
  primary CTAs within ten seconds.

- The interaction is the portfolio: working flags, physical tickets, and
  the reactive on-call PM—not decorative animation around a brochure.

- Every action gives instant payoff and never evaluates the visitor.
- The homepage remains portfolio-led; employment history never becomes
  the primary structure.

- The experience retains full functional parity under keyboard, touch,
  reduced motion, WebGL failure, and no JavaScript.

- No AI-template signatures, generic motion-site composition, unverified
  metrics, guest PII, or non-OFL fonts enter production.

The current folder contains the approved static slice and content
sources, but no Git repository, package manifest, or Next.js scaffold.

## Workflow and Approval Gates

1. Claude reviews this plan; revise until Claude and Codex sign off.
2. After Plan Mode ends, sol-high writes DESIGN.md first.
3. Claude reviews DESIGN.md; no PRD or code begins until its tokens and
   defenses are approved.

4. Sol-high writes the production PRD from approved DESIGN.md.
5. Claude reviews the PRD; implementation begins only after both
   documents pass.

6. Build proceeds in reviewable tiers. Terra workers receive frozen
   specifications and never invent tokens, copy, behavior, or
   dependencies.

7. Every terra diff is reviewed by sol-high before the next dependent
   task begins.

8. Claude’s Haiku lane independently checks content fidelity, privacy,
   and portfolio-not-resume compliance.

9. Production deploy happens only after the interaction, accessibility,
   content, performance, and anti-slop gates pass.

## DESIGN.md Specification

DESIGN.md becomes the visual and motion source of truth. Every visual
choice must include a one-line “Concept defense” explaining how it
follows from garvit.app as a product visibly being PM-ed.

### 1. Concept and hierarchy

Document:

- The product-ritual interaction model.
- Ten-second persona test for founders, recruiters, and product leads.
- Zero-visitor-homework rule.
- Homepage priority: product chrome → positioning and CTAs → live
  controls and mascot → sprint-board work.

- Calm case-study reading routes.
- Explicit portfolio-not-resume exclusions.

### 2. Color tokens

Preserve the approved release-management palette:

 Semantic role            Light       Dark
━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━  ━━━━━━━━━
 Canvas                 #EDF0EB    #101319
─────────────────────  ─────────  ─────────
 Primary panel          #F8F9F4    #191D25
─────────────────────  ─────────  ─────────
 Secondary panel        #E3E8E2    #222832
─────────────────────  ─────────  ─────────
 Ink                    #171923    #F2F4ED
─────────────────────  ─────────  ─────────
 Muted ink              #5F675F    #A9B2A9
─────────────────────  ─────────  ─────────
 Rule                   #AEB7AD    #3D4650
─────────────────────  ─────────  ─────────
 Release blue           #3F49E8    #7580FF
─────────────────────  ─────────  ─────────
 Merge lime             #CBED45    #D4F35E
─────────────────────  ─────────  ─────────
 Incident coral         #FF6B52    #FF7A61
─────────────────────  ─────────  ─────────
 Open-question lilac    #C4B7FF    #BCAEFF
─────────────────────  ─────────  ─────────
 Context cyan           #72D7D0    #70DCD4

Rules:

- Solid semantic fields, never mesh gradients.
- Color never carries status alone; pair it with labels, icons, and
  structural placement.

- Translucency is limited to sticky product chrome and anchored overlays.
  Light chrome uses approximately rgba(248,249,244,.88) and dark chrome
  rgba(25,29,37,.88), with a 12px blur and visible rule.

- No decorative glass cards, glowing blue/purple haze, or translucent
  content panels.

### 3. Typography

Keep self-hosted, OFL-licensed Archivo Variable and IBM Plex Mono.

 Token            Size / line         Tracking
                  height
━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Hero             clamp(3.25rem,      -.065em; mobile -.045em
                  7.6vw,
                  7.25rem) / .88
───────────────  ──────────────────  ────────────────────────────────────
 Section title    clamp(2.25rem,      -.05em
                  4.5vw,
                  4.5rem) / .94
───────────────  ──────────────────  ────────────────────────────────────
 Card title       clamp(1.25rem,      -.035em
                  1.8vw,
                  1.75rem) / 1.05
───────────────  ──────────────────  ────────────────────────────────────
 Lead             clamp(1.125rem,     -.015em
                  1.6vw,
                  1.375rem) / 1.45
───────────────  ──────────────────  ────────────────────────────────────
 Body             1rem / 1.6          -.01em
───────────────  ──────────────────  ────────────────────────────────────
 Small            .875rem / 1.45      0
───────────────  ──────────────────  ────────────────────────────────────
 Product mono     .6875rem / 1.35     .055em, uppercase only where
                                      semantic

Hero line-height loosens to .92 on narrow screens. IBM Plex Mono is
limited to build metadata, flags, tickets, dates, and annotations; long-
form prose remains Archivo.

### 4. Space, width, and density gradient

Use one spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160px.

- Dense chrome uses 4–16px spacing and a 50–56px product bar.
- The experiment banner stays compact and opaque.
- The application shell has a 1600px maximum width and responsive 16–32px
  gutters.

- Hero padding uses 48–80px desktop and 24–32px mobile.
- The hero keeps the mascot/flags rail but removes secondary visual
  competition; larger type and controlled blank space provide the
  expansion.

- Hero-to-board spacing is 64–96px.
- Board outer padding is 32–48px; column gaps are 24px and ticket gaps
  16px.

- Long-form routes use a 68-character reading column and 96–144px section
  spacing.

- The homepage ends after the playable work index and a compact build/
  contact footer. It does not become a multi-act scroll narrative.

### 5. Shape and elevation

- Radii: 4px for micro-controls, 8px for buttons/tickets, 12px for
  panels, 18px for dialogs.

- Pill radii are reserved for statuses, switches, and build health.
- Tickets rest on borders without generic shadows.
- Drag lift alone uses 0 14px 32px rgba(23,25,35,.18); dark mode uses
  rgba(0,0,0,.32).

- One-pixel rules and hard semantic color blocks provide the product
  character.

### 6. Motion tokens and principles

Canonical tokens:

 Token                  Exact intent
━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 --ease-out             cubic-bezier(.23,1,.32,1)
─────────────────────  ──────────────────────────────────────────────────
 --ease-in-out          cubic-bezier(.77,0,.175,1)
─────────────────────  ──────────────────────────────────────────────────
 --duration-feedback    120ms
─────────────────────  ──────────────────────────────────────────────────
 --duration-enter       200ms
─────────────────────  ──────────────────────────────────────────────────
 --duration-exit        140ms
─────────────────────  ──────────────────────────────────────────────────
 --spring-settle        response .36s, damping ratio 1.0
─────────────────────  ──────────────────────────────────────────────────
 --spring-flick         response .42s, damping ratio .82; rotation/
                        follow-through after momentum only
─────────────────────  ──────────────────────────────────────────────────
 --spring-look          response .30s, damping ratio 1.0
─────────────────────  ──────────────────────────────────────────────────
 --rubber-band          resistance constant .55

Motion rules:

- Immediate pointer-down feedback; 1:1 functional dragging inside bounds.
- Springs begin from the current presentation value and remain
  interruptible.

- Release velocity is handed into settle motion; fast flicks use momentum
  projection.

- Rubber-banding replaces hard board-edge stops.
- Keyboard-triggered movement is immediate and unanimated.
- Dynamic UI uses transitions or an interruptible spring, not restart-
  prone keyframes.

- UI transitions remain under 300ms; exits are faster than entrances.
- Animate transform and opacity, not per-frame left, top, height, or
  inherited CSS variables.

- Popovers originate from their trigger; dialogs remain centered.
- No transition: all, ease-in, scale(0), ungated hover motion, ornamental
  parallax, or generic scroll reveals.

- Reduced motion replaces spatial movement with a 120–160ms crossfade and
  removes confetti, ticker movement, cursor following, breathing, spring
  settle, and celebration.

### 7. Current-slice motion corrections

The design document must record these known production deficits:

- The slice’s damped cursor follower violates 1:1 ticket dragging.
- Per-frame left and top updates cause layout/paint work.
- Velocity is derived from the latest horizontal sample only; there is no
  momentum projection.

- The WAAPI FLIP settle cannot be safely grabbed from its current
  presentation position.

- Pointer-up without several pointer-move events can be rejected or
  misclassified.

- Several shorthand transitions implicitly animate every changing
  property.

- Keyboard ticket movement currently animates.
- Reduced motion currently collapses durations globally instead of
  providing purposeful crossfades.

### 8. Named anti-AI-slop defense

DESIGN.md includes a rejection checklist and a concept defense beside
every token/layout decision:

- No purple/blue mesh gradients.
- No decorative glassmorphism.
- No floating 3D blobs; the only 3D object is the functional on-call PM.
- No centered generic Framer hero.
- No Inter, Space Grotesk, warm lifestyle cream, acid-on-black default,
  emoji markers, numbered section template, or universal rounded cards.

- No Unsplash hero imagery or generated texture used to create
  superficial richness.

- No motionsites.ai layout or aesthetic borrowing; it is only a motion-
  confidence benchmark.

- Motion must correspond to product state, agency, continuity, or
  feedback.

- Product artifacts and sourced screenshots carry the case-study visuals.

## PRD Specification

### Routes and responsibilities

 Route                     Responsibility
━━━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 /                         Product chrome, experiment banner, spacious
                           hero, primary CTAs, feature flags, on-call
                           PM, sprint-board portfolio, compact footer
────────────────────────  ───────────────────────────────────────────────
 /work/stay-portal         Shipped case: situation, bet, artifact,
                           decisions/exclusions, evidence, next change
────────────────────────  ───────────────────────────────────────────────
 /work/maxie               Clearly labelled 0→1 AI-browser concept
────────────────────────  ───────────────────────────────────────────────
 /work/agentic-calendar    Clearly labelled agentic-calendar concept
────────────────────────  ───────────────────────────────────────────────
 /notes/dynamic-island     Product teardown presented as a note, not a
                           shipped case

Also provide typed metadata, canonical URLs, Open Graph images, sitemap,
robots metadata, and a concept-consistent not-found state. There is no
primary About or work-history route.

### Typed data contracts

No external API or database is required. Static typed modules and MDX are
the source of truth.

type WorkSlug =
  | "stay-portal"
  | "maxie"
  | "agentic-calendar"
  | "dynamic-island";

type BoardColumn = "shipped" | "in-progress" | "backlog";
type WorkKind = "shipped" | "concept" | "research";
type FeatureFlagKey =
  | "dark_mode"
  | "confetti_on_scroll"
  | "candid_mode"
  | "comic_sans";

interface WorkItem {
  id: string;
  slug: WorkSlug;
  route: string;
  kind: WorkKind;
  authoredColumn: BoardColumn;
  title: string;
  summary: string;
  priority: "P0" | "P1" | "P2";
  points: number | "research";
  accent: "lime" | "cyan" | "lilac" | "coral";
  candidNote: string;
  previewFacts: readonly PreviewFact[];
}

interface FeatureFlagDefinition {
  key: FeatureFlagKey;
  label: string;
  descriptor: string;
  defaultValue: boolean;
  disabled: boolean;
  persistence: "local" | "session" | "none";
}

type MascotReaction =
  | "idle"
  | "notice"
  | "flag-check"
  | "drag-watch"
  | "shipped";

type PublicAnalyticsEvent =
  | "resume_download"
  | "contact_click"
  | "case_open"
  | "full_case_read";

Release notes, tickets, flags, route metadata, and case summaries live in
focused typed modules. Long-form bodies live in local MDX and may consume
only approved case-study components.

### Product chrome and experiment

- Server-render garvit.app v2.4.1, build health, Delhi/IST, and the
  candid changelog.

- Version opens an accessible anchored release-note popover.
- Variant B is an authored joke, not a hidden visitor experiment.
- Dismissal is stored for the tab session and yields the existing
  product-flavoured toast.

- Fake “event logged” microcopy is not connected to real behavioral
  tracking.

### Feature-flag behavior

- Panel is expanded by default.
- dark_mode: follows OS preference initially, allows a user override, and
  stores that preference locally.

- confetti_on_scroll: on by default for a new session; maximum three edge
  bursts per session, eight pieces per burst, separated by at least 480px
  of deliberate scrolling.

- candid_mode: on by default and reveals useful candid ticket
  annotations. Replace CODEX LAB with FIELD NOTES.

- comic_sans: permanently disabled, with “disabled in prod for a reason.”
- Confetti and animated reactions are forcibly suppressed under reduced
  motion, Save-Data, or the performance kill switch even if their visible
  flag remains enabled.

- Feature controls never block access to portfolio content.

### Sprint-board behavior matrix

 Input/state           Required behavior
━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Mouse/pen             Drag only from a 44px grip; preserve grab offset;
                       10px drag hysteresis; pointer capture; 1:1 motion
                       inside bounds
────────────────────  ───────────────────────────────────────────────────
 Low-sample stream     Process pointer-up as a final movement sample;
                       use coalesced events where available; fall back
                       to total displacement/time when fewer than two
                       move samples exist
────────────────────  ───────────────────────────────────────────────────
 Release               Derive velocity from samples in the last 100ms,
                       cap outliers, project the ticket center with
                       decay .998 and a ±280px projection cap, then
                       choose the closest valid column
────────────────────  ───────────────────────────────────────────────────
 Board edge            Apply rubber-band constant .55; never abruptly
                       clamp under the pointer
────────────────────  ───────────────────────────────────────────────────
 Settle                Independent x/y critical springs using --spring-
                       settle; use --spring-flick only for rotational
                       follow-through
────────────────────  ───────────────────────────────────────────────────
 Mid-settle re-grab    Cancel the active settle, read the computed
                       transform through DOMMatrix, and begin the new
                       drag from that visible position with inherited
                       velocity
────────────────────  ───────────────────────────────────────────────────
 Click/Enter           Open the relevant case preview without moving the
                       ticket
────────────────────  ───────────────────────────────────────────────────
 Keyboard              Alt+Left/Right moves one column instantly,
                       announces the result, and never animates
────────────────────  ───────────────────────────────────────────────────
 Touch                 Grip uses touch-action:none; non-grip ticket
                       content preserves board/page scrolling
────────────────────  ───────────────────────────────────────────────────
 Drop on Shipped       Open the relevant preview after settle and run
                       the mascot’s shipped reaction; no scoring or
                       judgment
────────────────────  ───────────────────────────────────────────────────
 Reset                 Restore authored columns and clear session board
                       state
────────────────────  ───────────────────────────────────────────────────
 Reduced motion        Functional direct drag remains; release
                       crossfades to the final position without
                       momentum, confetti, or mascot movement
────────────────────  ───────────────────────────────────────────────────
 No JavaScript         Each ticket remains a direct link to its full
                       route; authored columns and summaries remain
                       readable

Board state uses sessionStorage; it survives a refresh within the tab but
never becomes account or server state.

### Case previews and long-form routes

- Ticket activation opens an accessible modal preview with real sourced
  content and a visible “Read full case” link.

- Modal focus is trapped and restored, Escape closes, background becomes
  inert, and route links remain the fallback.

- Stay Portal uses only privacy-safe demo screenshots.
- Maxie may use its supplied prototype screenshot only where it explains
  a decision.

- Concepts and shipped work are labelled honestly.
- Long-form pages remain calm, spacious, and substantially less animated
  than the homepage.

- Metrics are published only after resume/source verification.

### R3F on-call PM

Sol-high authors one purposeful R3F figure, not a floating blob:

- One compressed GLB containing torso, head, eyes, arms, and pager badge.
- One matte material atlas, one key light, one soft fill, no post-
  processing.

- Shared look-at rig across torso, head, and pupils.
- Reactions: notice, flag-check, drag-watch, and shipped celebration.
- Immediate SVG/WebP poster uses the same camera and silhouette.
- Lazy-load WebGL after first paint when the mascot enters the viewport
  or during idle time, with a 1.5-second maximum delay.

- Crossfade only after the first rendered WebGL frame.
- Clamp DPR to 1.5.
- Pause offscreen and while the document is hidden.
- Skip WebGL under reduced motion, Save-Data, low-memory detection,
  renderer failure, or an explicit runtime kill switch.

- Functional outcomes never depend on the mascot and are not announced
  from its decorative reactions.

### Accessibility and no-JS matrix

- WCAG 2.2 AA target.
- Native links, buttons, checkboxes, and semantic headings.
- Unstyled accessible primitives for dialog, popover, tooltip, and focus
  management.

- Minimum 44px primary targets and visible focus treatment in both
  themes.

- One polite live region announces deliberate state changes only.
- Color, hover, cursor tracking, and mascot reactions never provide
  unique information.

- Forced-colors styles preserve outlines and status labels.
- Reduced motion uses crossfades rather than near-zero-duration spatial
  animations.

- Server-render hero, CTAs, authored board, summaries, and direct case
  links.

- A no-JS visitor sees the default build without broken flag controls or
  an instruction to enable JavaScript.

### Analytics stance

- Separate real analytics from product-gag copy.
- Default recommendation: aggregate Vercel page views only for v1.
- Build a typed no-op analytics adapter so the four whitelisted events
  can be enabled later without touching interaction code.

- Never record cursor positions, drag paths, feature-flag changes, mascot
  reactions, session replay, heatmaps, identities, or case-study guest
  information.

- No visitor-facing event log or surveillance implication.

## Technical Architecture

- Next.js App Router, strict TypeScript, React Server Components by
  default, and small client islands for flags, board, overlays, confetti,
  and mascot.

- Pin the stable Next.js release and Vercel-supported Active LTS Node
  version at scaffold time; commit the package-manager lockfile.

- Use pnpm.
- Use CSS custom properties and CSS Modules; no Tailwind or arbitrary
  visual-value layer.

- Use local MDX for long-form routes and typed TypeScript metadata for
  board/previews.

- Use an unstyled accessible primitive library for dialog/popover/tooltip
  behavior.

- Use Motion only where interruption or gesture physics justify it;
  predetermined feedback remains CSS/WAAPI.

- Board drag uses a dedicated pointer/physics controller and transform
  strings, not generic drag defaults.

- Use a small React context/reducer store:
    - local storage: theme preference only;
    - session storage: banner dismissal, non-theme flags, board
      positions;

    - memory only: active drag and queued mascot reaction.

- Avoid cookies, backend state, authentication, CMS, and remote content
  fetching.

- Self-host subset WOFF2 files through next/font/local; preload Archivo’s
  used variable range, load only required IBM Plex Mono weights, include
  the rupee sign and final punctuation glyphs, and retain both OFL
  notices.

- Never use SF Pro, Nerd Font variants, remote Google Fonts, or CDN
  assets.

- Use local next/image assets; do not ship the source Unsplash covers.
- R3F/Three/drei and the GLB live in a dynamically imported client chunk.
- Budgets:
    - initial homepage JS excluding lazy R3F: ≤170KB gzip;
    - lazy R3F/Three chunk: ≤230KB gzip;
    - compressed GLB: ≤200KB;
    - poster: ≤35KB;
    - LCP ≤2.5s, CLS ≤0.05, INP ≤200ms on the agreed mobile test profile.

## Tiered Work Breakdown

Every terra task receives the approved plan, DESIGN.md, PRD, relevant
source files, exact paths/interfaces, acceptance commands, and a
prohibition against inventing values or copy.

 Task              1. Design source of truth
 Owner             sol-high
 Exact assignment  Write DESIGN.md with all locked tokens, responsive
                   states, motion rules, component anatomy, and one-line
                   concept defenses
 Review gate       Claude checks anti-slop, density gradient, Apple
                   motion principles, and complete visual decisions
─────────────────────────────────────────────────────────────────────────
 Task              2. Production PRD
 Owner             sol-high
 Exact assignment  Write the PRD with the interfaces and behavior
                   matrices above, content status, acceptance criteria,
                   and open decisions
 Review gate       Claude checks scope, zero homework, route/content
                   completeness, and no hidden design invention
─────────────────────────────────────────────────────────────────────────
 Task              3. Repository foundation
 Owner             terra
 Exact assignment  Preserve source artifacts; initialize Git and Next App
                   Router; configure strict TS, pnpm, lint, unit/E2E
                   harnesses, MDX, image/font handling, security headers,
                   Vercel config, and empty route shells
 Review gate       Sol-high reviews every dependency/config diff; clean
                   install, typecheck, lint, unit smoke test, and
                   production build must pass
─────────────────────────────────────────────────────────────────────────
 Task              4. Tokens and structural shell
 Owner             terra
 Exact assignment  Transcribe approved tokens exactly; implement product
                   bar, banner, hero structure, CTAs, flags shell, board
                   shell, modal/popover primitives, responsive layout,
                   dark selectors, forced-colors, and no-JS markup
 Review gate       Token diff against DESIGN.md must be exact;
                   screenshots at 1440×900 and 390×844 reviewed by sol-
                   high and Claude
─────────────────────────────────────────────────────────────────────────
 Task              5. Content and route port
 Owner             terra
 Exact assignment  Create typed release/work modules; port the four
                   supplied sources into the five routes; use the
                   approved case structure; wire resume/contact links and
                   local assets; add metadata, sitemap, and OG templates
 Review gate       Typecheck/content-schema tests pass; Claude’s Haiku
                   lane compares every claim to source, flags PII and
                   resume-style drift; sol-high reviews presentation
─────────────────────────────────────────────────────────────────────────
 Task              6. Feature-flag system
 Owner             sol-high
 Exact assignment  Personally build typed flag definitions, storage
                   hydration, dark theme, candid notes, constrained
                   confetti, disabled Comic Sans state, accessible
                   feedback, and kill-switch overrides
 Review gate       Unit/component tests plus light/dark/reduced/Save-Data
                   manual matrix; Claude judges whether each flag changes
                   the real product
─────────────────────────────────────────────────────────────────────────
 Task              7. Sprint-board physics
 Owner             sol-high
 Exact assignment  Personally implement pointer capture, threshold
                   handling, coalesced/fallback sampling, 1:1 drag,
                   rubber-banding, velocity projection, interruptible
                   presentation-value settle, keyboard path, session
                   state, and reset
 Review gate       Low-sample and mid-settle automated tests; real
                   Chrome/WebKit/Firefox and physical touch feel-check;
                   slow-motion/frame inspection
─────────────────────────────────────────────────────────────────────────
 Task              8. R3F mascot
 Owner             sol-high
 Exact assignment  Personally author GLB/scene, look rig, reaction state
                   machine, poster handoff, lazy loading, DPR clamp,
                   offscreen pause, and kill switches
 Review gate       Poster-first screenshot passes; no first-paint
                   regression; fallback matrix passes; sol-high and
                   Claude judge personality and restraint
─────────────────────────────────────────────────────────────────────────
 Task              9. Mechanical QA and deploy wiring
 Owner             terra
 Exact assignment  Add route, accessibility, no-JS, visual, asset-budget,
                   Lighthouse, and Vercel preview checks; document
                   deployment and rollback commands
 Review gate       Sol-high reviews tests/config; all automated checks
                   pass from a clean install; no production deployment
                   yet
─────────────────────────────────────────────────────────────────────────
 Task              10. Integration and craft pass
 Owner             sol-high
 Exact assignment  Resolve visual rhythm, interaction conflicts, dark-
                   theme issues, awkward copy, and cross-component
                   motion; run anti-slop and presentation-value audits
 Review gate       Claude reviews the complete preview; Garvit receives
                   only a judge-approved release candidate
─────────────────────────────────────────────────────────────────────────
 Task              11. Content QA mirror
 Owner             Claude/Haiku
 Exact assignment  Compare route copy with source files and resume;
                   verify concepts are labelled, metrics are sourced,
                   Delhi is correct, and no guest PII survives
 Review gate       Claude supplies a pass/fail report; sol-high fixes
                   accepted findings before RC
─────────────────────────────────────────────────────────────────────────
 Task              12. Release
 Owner             terra, supervised by sol-high
 Exact assignment  Connect repository to Vercel, create preview/
                   production targets, attach verified domain, validate
                   headers/redirects/analytics setting, and run smoke
                   tests
 Review gate       Sol-high approves the exact deployment diff and post-
                   deploy smoke report; Claude performs final visual
                   judge pass

No two workers edit the same subsystem concurrently. Terra outputs are
commits or isolated diffs with a clean status and exact verification
evidence.

## Test and Acceptance Plan

### Automated

- Unit-test typed content uniqueness and route validity.
- Test flag defaults, disabled behavior, persistence, hydration, and
  kill-switch precedence.

- Test board reducer, reset, projection math, bounds resistance, and
  column selection.

- Reproduce pointer-down → pointer-up with zero/one intermediate move
  samples.

- Test re-grabbing during settle from the visible transform.
- Test pointer cancellation and second-finger rejection.
- Test dialog focus trap/return, Escape, background inertness, and direct
  route fallback.

- Test resume and contact labels/hrefs.
- Playwright journeys in Chromium, WebKit, and Firefox.
- Axe scan every route in light and dark mode.
- Run a JavaScript-disabled route suite.
- Enforce font, GLB, poster, route-JS, and image budgets in CI.

### Visual and manual

- Fixed screenshots: 1440×900, 1280×832, 768×1024, and 390×844.
- States: light, dark, reduced motion, forced colors, WebGL poster, flags
  open/closed, ticket lifted, valid drop, case preview.

- Physical touch-device test for board-scroll/drag-grip conflict.
- Slow-motion and frame-by-frame inspection of lift, release, re-grab,
  popovers, and mascot handoffs.

- Screen-reader pass for homepage controls, board instructions,
  announcements, and modal navigation.

- Content scan for banned template patterns, generic AI phrasing,
  unverified claims, Bengaluru references, internal tool names, and PII.

### Release acceptance

- Static top screenshot looks unmistakably like a live product.
- Hero and both primary CTAs are legible without scrolling.
- Real work appears in or immediately below the first viewport.
- Founder screenshare test passes within ten seconds.
- All primary content is usable without animation, WebGL, pointer input,
  or JavaScript.

- No material console errors, hydration warnings, layout shifts, broken
  routes, or unapproved visual constants.

- Performance and accessibility budgets pass on the deployed preview.

## Deployment Plan

- Create a private Git repository from the project folder after the
  documentation gates.

- Connect it to a Vercel project named garvit-app.
- main deploys production; every pull request gets a Vercel preview.
- Claude and Garvit review immutable preview URLs, never an uncommitted
  local build.

- Use the purchased garvit.app apex domain when available; redirect www
  to apex.

- Until then, launch/review on the assigned vercel.app URL without
  delaying the build.

- Require preview checks for typecheck, lint, unit tests, Playwright
  smoke tests, asset budgets, and production build.

- Add X-Content-Type-Options, conservative Referrer-Policy, and a
  Permissions-Policy disabling unused camera, microphone, and geolocation
  access.

- No production secrets are expected.
- Verify HTTPS, canonical URL, PDF download, mail link, sitemap, OG
  rendering, 404, WebGL failure, analytics setting, and rollback before
  domain cutover.

- Retain the last approved Vercel deployment for immediate rollback.

## Open Questions and Recommended Defaults

1. Hero copy: Does Garvit explicitly approve “I turn fuzzy product ideas
   into things people can use”?
   Recommended default: keep it only as provisional design copy and block
   public launch until he explicitly approves or replaces it.

2. Domain: Has garvit.app been purchased and can DNS access be provided?
   Recommended default: use the Vercel fallback throughout previews and
   attach the apex domain after RC approval.

3. Resume and contact: Is the existing PDF final, and is
   garvit.sukh@gmail.com still the intended public address?
   Recommended default: wire the existing files during development, but
   treat both as launch-verification items.

4. Analytics: Should v1 measure anything beyond aggregate page views?
   Recommended default: Vercel aggregate page views only; keep custom
   event tracking as a disabled typed adapter.

