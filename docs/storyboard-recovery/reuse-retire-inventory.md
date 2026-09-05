# garvit.app Recovery Redesign: Exact Reuse/Retire Inventory

**Scope**: Recovery replaces homepage composition with 3-act onboarding overlay + static triptych hero + in-flow flag dock + full-screen session cockpit. All board/case/flag/404/world mechanics stay.

**Date**: 2026-08-17  
**Status**: READ-ONLY AUDIT (no files modified)

---

## RETIRE: Visual Shells Being Replaced

### HeroEvolution Component
**Path**: `src/components/hero/HeroEvolution.tsx`  
**Current function**: Displays animated headline with three phases (mvp → beta → ga) that cycle on load and can be replayed.

**What dies**:
- Visual animation state machine (phase cycle logic at lines 22–42)
- Three-phase timeline UI (lines 51–66: phaseRail with MVP/BETA/GA labels + Replay button)
- All phase-dependent styling (lines 33–85: color/stroke/shadow transitions by data-hero-phase)
- Entire component's render footprint on homepage

**What might be lifted** (if repurposed):
- None—this animation pattern is specific to HeroEvolution. The static triptych hero replaces this entirely with a different visual contract.

**Companion CSS file**: `src/components/hero/HeroEvolution.module.css`  
**Dies**: Lines 1–175 (entire file)
- .evolution (lines 1–49): container + animated backdrop pseudo-element
- .headline, .headlineLine, .releaseLine (lines 50–86): phase-dependent text styling
- .phaseRail (lines 87–129): flex layout for phase labels + replay button
- @media rules (lines 131–175): responsive breakpoints for wrapped headline and mobile phase rail

**Companion test file**: `src/app/dev/world/HeroEvolution.test.tsx`  
**Dies**: Entire file—tests the animation lifecycle and replay mechanics that are specific to HeroEvolution.

---

### PersonaSatire Component  
**Path**: `src/components/hero/PersonaSatire.tsx`  
**Current function**: Overlay tray on homepage that prompts visitor to select persona (Founder, Recruiter, Product lead, Just browsing) before dismissing. Persists choice in sessionStorage and tracks via analytics.

**What dies**:
- Homepage placement (`.tray` positioned absolutely top-left on hero, lines 1–15 in CSS)
- Visual shell: tray styling with blur/shadow/panel materials (CSS lines 1–15)
- Audience-facing persona choice UI as a floating overlay (component visible while dismissed=false)
- "Skip" button affordance (component lines 78–85, CSS lines 54–60)
- Persona payoff message ("Noted. This changes nothing.", component line 100)

**What reuses**:
- `personaChoices` array (lines 8–16): persona value↔label mapping reused in Act 2 overlay
- `completedPersonaValues` set (lines 18–21): validation logic reused for state tracking
- `hasCompletedPersonaPrompt()` function (lines 23–32): sessionStorage read logic reused in Act 2
- `choose()` handler (lines 51–59): sessionStorage write + analytics.track + state update — reuse exact pattern
- `skip()` handler (lines 61–64): sessionStorage write + state update — reuse pattern
- Types: `VisitorPersona` imported from analytics library stays (line 5)

**Fragment being extracted**: Persona logic will move into Act 2 of IntroDirector state machine; visual tray on homepage dies.

**Companion CSS file**: `src/components/hero/PersonaSatire.module.css`  
**Dies**: Lines 1–148 (entire file) — all layout/positioning/styling specific to the homepage floating tray
- .tray (lines 1–15): absolute positioning, blur/shadow materials
- .heading (lines 17–22): flex layout for title + skip button
- .choices (lines 62–80): grid layout + button styling for persona options
- .skip (lines 54–60): underlined muted button
- @media rules (lines 82–147): responsive adjustments for dock conflicts at various breakpoints

**Note on modal-specific patterns**: The choice grid and button styling can be partially reused in the Act 2 modal, but the `.tray` positioning/shadow/backdrop rules are homepage-specific and die.

**Companion test file**: `src/components/hero/PersonaSatire.test.tsx`  
No current test file exists for this component in the codebase.

---

### SessionJourneySection Component
**Path**: `src/features/journey/SessionJourneySection.tsx`  
**Current function**: Full-width section displaying visitor's session funnel (5 stages: Landed → Scrolled → Played → Read work → Converted) with bar charts comparing this session vs. a typical visitor benchmark, plus insights derived from session events.

**What dies**:
- Full-width section layout (CSS: `.section`, lines 1–12)
- Funnel visualization: header with title + live state indicator (lines 54–67)
- Bar chart UI: legend, stage list, bar rendering with transitions (lines 69–106)
- Readout panel: time-here, deliberate acts, furthest signal, open loop (lines 108–127)
- Insights card: dynamically rendered insight strings (lines 129–134)
- All CSS styling for the section (entire `SessionJourneySection.module.css`)

**What's extracted internally** (live inside component, need extraction):
- `labels` map (lines 16–22): JourneyStage → display label mapping
  - Format: `{ "landed": "Landed", "scrolled": "Scrolled", "played": "Played", "read-work": "Read work", "converted": "Converted" }`
  - **Action**: Extract to `src/features/journey/journey-labels.ts` (new file)
- `typicalVisitor` benchmark data (line 25): `[100, 76, 49, 28, 11]` percentages per stage
  - **Action**: Extract to `src/features/journey/benchmarks.ts` (new file) — this constant is authored reference data, not computed
- `formatDuration()` helper (lines 27–31): milliseconds → "Xs" or "Xm Ys" string
  - **Action**: Extract to `src/features/journey/duration-format.ts` (new file)

**What imports from journey-store** (these files/functions survive — see REUSE section):
- `deriveJourneyInsights` (line 51)
- `furthestJourneyStage` (line 48)
- `getJourneyServerSnapshot` (line 8)
- `getJourneySnapshot` (line 8)
- `journeyStages` (line 9)
- `nextJourneyStage` (line 49)
- `subscribeJourney` (line 34)
- `JourneyStage` type (line 12)

These functions will be reused by SessionCockpit (the new full-screen surface replacing this section). The funnel-math is in `journey-store.ts` and survives; only the visual shell (`SessionJourneySection.tsx` + its module.css) dies.

**Companion CSS file**: `src/features/journey/SessionJourneySection.module.css`  
**Dies**: Lines 1–342 (entire file)
- .section (lines 1–12): full-width section with padding, panel material, border-top
- .header (lines 23–42): flex layout for title + live state chip
- .legend (lines 82–111): flex row for "this tab" vs "typical visitor" series labels
- .funnel (lines 113–124): grid of stages with funnel container styling
- .stage, .stageMeta, .bar (lines 126–236): individual stage row layout, percentage badges, bar rendering
- .readout (lines 238–276): grid layout for time/acts/signal/loop + insights card
- .insights (lines 278–293): insights card background + typography
- @media rules (lines 295–341): responsive grid adjustments for mobile/tablet

**Companion test file**: `src/features/journey/SessionJourneySection.test.tsx`  
**Dies**: Entire file—tests component-level rendering of the funnel UI, stage bars, and insights. SessionCockpit will need new tests.

---

### Floating Dock Positioning Rules  
**Paths**:
- `src/app/page.module.css` (lines 33–42, 51–56, 63–75, 77–101)
- `src/components/hero/Hero.module.css` (lines 109–161 in media queries; especially lines 113–121, 132–161)
- `src/components/hero/PersonaSatire.module.css` (lines 82–108: dock conflict prevention)

**Current rules**:
- `.dock` positioned absolute bottom-right at ≥880px width (page.module.css lines 33–42):
  - `right: clamp(1.25rem, 3vw, 3rem)`
  - `bottom: clamp(9rem, 14vw, 13rem)`
  - Dock z-index=5, hero/board/journey anchors z-index 3/4 to sit on top
- At 880–1179px: dock reservation `width: 21.5rem` (hero copy width reduced to accommodate, Hero.module.css line 115)
- At 620–879px: dock recomposes to flow below hero (page.module.css lines 63–75)
  - `position: relative`, `right: auto`, `bottom: auto`, `margin: var(--space-4) 0 0 auto`
- At ≤619px: dock full-width with horizontal margins (page.module.css lines 83–90)

**What dies**:
- Absolute positioning logic for desktop/tablet (page.module.css `.dock` lines 33–56)
- Hero copy reservation padding adjustments (Hero.module.css media queries lines 113–161)
- PersonaSatire tray dock-conflict prevention rules (PersonaSatire.module.css lines 82–108)

**Recovery approach**: In-flow flag dock will compose differently (likely in the onboarding overlay or in-page flow, not a floating panel). The dock's DOM placement and z-index logic changes; these CSS rules are specific to the floating dock pattern and don't transfer.

---

### Split-Color Headline Rules (if present)
**Search result**: No explicit "split-color headline" pattern found as a separate concern. The color split exists WITHIN HeroEvolution's phase-dependent styling:
- `.releaseLine` class (HeroEvolution.module.css line 70, line 83–85):
  ```css
  .evolution[data-hero-phase="ga"] .releaseLine {
    color: var(--color-release);
  }
  ```
This is part of HeroEvolution's phase animation and dies with that component.

---

## REUSE UNCHANGED

### Journey Store & Observer Files
**Paths**:
- `src/features/journey/journey-store.ts` — entire file (262 lines)
- `src/features/journey/JourneyObserver.tsx` — entire file (37 lines)
- `src/features/journey/index.ts` — entire file (4 lines, exports)

**Why survives**: These implement the event recording, state derivation, and subscription plumbing that SessionCockpit will reuse identically. The `recordJourneyEvent()`, `deriveJourneyInsights()`, `furthestJourneyStage()`, `nextJourneyStage()` functions are the business logic; they're not coupled to SessionJourneySection's visual shell. JourneyObserver continues to wire scroll/click listeners.

**Exported functions reused by SessionCockpit**:
- `journeyStages` (const array of stage names)
- `JourneyState` (interface)
- `JourneyStage` (type)
- `recordJourneyEvent(event: JourneyEvent)` — visitor interaction
- `deriveJourneyInsights(state: JourneyState)` — string[] of insights
- `furthestJourneyStage(state: JourneyState)` — JourneyStage
- `nextJourneyStage(state: JourneyState)` — JourneyStage | null
- `getJourneySnapshot()` / `getJourneyServerSnapshot()` / `subscribeJourney()` — reactive store plumbing

**Test files reused**:
- `src/features/journey/journey-store.test.ts` — unit tests for funnel math; continue to pass
- `src/features/journey/JourneyObserver.test.tsx` — integration tests for scroll/click listeners; continue to pass

---

### Signals Bus & Reaction Machine
**Paths**:
- `src/features/mascot/signals.ts` (and any related files in `src/features/mascot/**`)
- All exported functions and types (e.g., `emitMascotSignal()`)

**Why survives**: The journey store calls `emitMascotSignal()` when milestones are reached (journey-store.ts line 199). This is independent of how the journey is *displayed*. SessionCockpit will inherit this behavior automatically.

**Referenced in**: `src/features/journey/journey-store.ts` line 199 when a journey stage is first reached.

---

### World Feature Entire Directory
**Path**: `src/features/world/**`  
**Files**:
- `ExperienceWorld.tsx`
- `WorldAnchor.tsx` (if exists)
- `WorldProvider.tsx`
- `GuideScene.tsx`
- `guide-rig.ts`
- `guide-materials.ts`
- `world-store.ts`
- `capability-policy.ts`
- `scene-motion.ts`
- `types.ts`
- All related `.test.ts` and `.test.tsx` files

**Why survives**: The 3D world/mascot is orthogonal to the hero/journey visual shells. The world anchors wrap homepage sections and provide visual continuity; they're not affected by the homepage composition redesign. All scene logic, rig/materials, capability policy, and interaction reactions stay intact.

**Referenced in page**: `src/app/page.tsx` lines 20–33 (ExperienceWorld provider wrapping the main shell with three WorldAnchors: hero, board, journey). The anchor structure survives; only the surfaces inside those anchors change.

---

### Board Feature Entire Directory
**Path**: `src/features/board/**`  
**Including**:
- `InteractiveBoardSection.tsx` (and test)
- `CasePreview.tsx`
- `MobileColumnNav.tsx`
- `preview-content.tsx`
- `preview-artifacts.module.css`
- `board-interactions.module.css`
- Physics/spring/presentation logic
- Storage/build-health utilities
- All tests

**Why survives**: The board is a separate anchor in the homepage composition and is not being redesigned in this recovery. Case preview dialogs, ticket interactions, drag physics, column navigation—all stay.

---

### Case Component Entire Directory
**Path**: `src/components/case/**`  
**Including**: Case card components, case-preview styling, case routing logic.

**Why survives**: Cases are displayed via the board and in individual case routes (`/work/[slug]`). The recovery doesn't touch case content or routing.

---

### Flags (Feature Flags) System
**Path**: `src/features/flags/**`  
**Files**:
- `FeatureFlagsPanel.tsx` (and test)
- `definitions.ts`
- `useFeatureFlags.ts`
- `flags.module.css`
- `confetti.ts` (and test)
- `effects-policy.ts`
- `flag-events.ts`
- `index.ts`

**Component**: `src/components/ops/FeatureFlagDock.tsx`

**Why survives**: The flag dock UI will be repositioned/restyled in the recovery, but the flag system itself (definitions, hooks, event emission) stays. FeatureFlagDock will be recomposed in a new layout, but the feature-flag business logic is unchanged. The recovery context mentions "in-flow flag dock"—this is a layout/visual change to the existing dock, not a replacement of the flags system.

---

### 404 Page
**Path**: `src/app/not-found.tsx` + `src/app/not-found.module.css`  
**Test file**: `src/app/not-found.test.tsx`

**Why survives**: Error handling is orthogonal to the recovery. No change to 404 mechanics.

---

### Chrome & Footer Components
**Paths**:
- `src/components/chrome/ProductChrome.tsx` (sticky header with version/theme toggle)
- `src/components/footer/SiteFooter.tsx`

**Why survives**: These wrap the page composition and are not redesigned.

---

### Phone Reveal Feature
**Path**: Likely in `src/features/phone/**` or similar (if exists)

**Why survives**: Not mentioned as being modified in the recovery context.

---

### Storage Keys Module
**Path**: `src/data/storage.ts`

**Why survives**: Defines constants for sessionStorage/localStorage keys. No schema changes in the recovery; new onboarding state will use existing or newly-defined keys (but the module structure stays).

**Keys used/defined**:
- `JOURNEY_STORAGE_KEY` (line 43): persists journey events
- `PERSONA_STORAGE_KEY` (line 46): persists persona choice (reused in Act 2)
- Others stay unchanged (theme, board, banner, flags)

---

### Analytics Adapter & Tests
**Path**: `src/lib/analytics.ts` (and related test files)

**Why survives**: Journey observer and persona logic call `analytics.track()`. The recovery doesn't change the analytics contract, only the surfaces sending events. All existing event names stay valid; new events may be added (onboarding-specific), but the adapter is stable.

---

## NEW SURFACES NEEDED

### 1. IntroDirector State Machine
**Contract**: Stateful manager for the 3-act onboarding overlay lifecycle.  
**Responsibilities**:
- Render state: arrival → required-persona → resolve
- Track completion (sessionStorage key: derive from PERSONA_STORAGE_KEY pattern)
- Coordinate Act 1 → Act 2 → Act 3 transitions
- Emit analytics events for each act boundary crossing
- Provide escape hatch / "Skip" affordance per act
- Coordinate with PersonaSatire logic: reuse persona choice/skip handlers in Act 2

**Location**: `src/features/onboarding/IntroDirector.tsx` (new)

---

### 2. Act 1 Overlay Surface (Arrival)
**Contract**: Modal/overlay shown to first-time or returning visitors.  
**Responsibilities**:
- Display intro headline/hero copy adapted from current homepage
- Show CTA to proceed to Act 2 (Persona selection) or skip onboarding
- Reuse styling primitives (blur/shadow/panel materials) from current PersonaSatire tray
- Close on CTA click or escape

**Location**: `src/features/onboarding/Act1Overlay.tsx` (new)

---

### 3. Act 2 Overlay Surface (Required Persona)
**Contract**: Modal prompting persona selection (Founder, Recruiter, Product lead, Just browsing).  
**Responsibilities**:
- Render persona choice buttons (reuse `personaChoices` array from PersonaSatire)
- Call `choose()` and `skip()` handlers (reuse exact logic from PersonaSatire)
- Write to sessionStorage with PERSONA_STORAGE_KEY (reuse logic)
- Track `persona_selected` event (reuse analytics call)
- Advance to Act 3 or close on completion
- Persist selected persona to derive Act 3 content (if persona-specific)

**Location**: `src/features/onboarding/Act2Overlay.tsx` (new)

---

### 4. Act 3 Overlay Surface (Resolve)
**Contract**: Final act overlay, likely showing resolution/welcome or guiding to next action.  
**Responsibilities**: TBD by design; placeholder for completion state.

**Location**: `src/features/onboarding/Act3Overlay.tsx` (new)

---

### 5. Static Triptych Hero Card
**Contract**: Replacement for HeroEvolution. Static, no animation.  
**Responsibilities**:
- Display headline split across 3 visual "cards" or regions (triptych = 3-part visual)
- Show intro copy and CTA buttons (reuse from current Hero.tsx lines 13–38)
- No animation/phase cycling; static layout throughout page lifetime
- Reuse Hero.module.css layout for copy/intro/actions (keep those rules)
- Remove phase-dependent styling (dies with HeroEvolution)

**Location**: Likely `src/components/hero/TriptychHero.tsx` (new) or modify Hero.tsx to conditionally render static version

**Reuse from current Hero.tsx**: Lines 13–38 (intro copy, action CTA structure, data-attributes for mascot/journey/downloads)

---

### 6. Agent Status Chip + DOM Click Affordance
**Contract**: In-flow indicator of LLM agent state (processing/ready) for the onboarding flow.  
**Responsibilities**:
- Display loading/ready state during onboarding acts
- Clickable affordance to manually advance acts (if permitted)
- Minimal footprint (chip/badge, not a full card)
- Coordinate state with IntroDirector

**Location**: `src/features/onboarding/AgentStatusChip.tsx` (new)

---

### 7. Compact Session Summary Line
**Contract**: Single-line condensed version of journey state, possibly shown in Act 3 or in-flow.  
**Responsibilities**:
- Display abbreviated session summary: "5 interactions · Read 2 cases · Playing now"
- Reuse `formatDuration()`, `labels` map, and `deriveJourneyInsights()` from journey-store
- One-liner footprint (no full funnel bars)
- No modal plumbing; plain text/small typography

**Location**: `src/features/onboarding/CompactSessionSummary.tsx` (new) or `src/features/journey/SessionSummaryLine.tsx` (new)

---

### 8. SessionCockpit Full-Screen Surface
**Contract**: Replacement for SessionJourneySection. Full-screen bespoke visual shell for the funnel/session data.  
**Responsibilities**:
- Display all current SessionJourneySection content (funnel bars, insights, readout panel)
- Reuse all journey-store functions: `deriveJourneyInsights()`, `furthestJourneyStage()`, `nextJourneyStage()`, `getJourneySnapshot()`, `subscribeJourney()`
- Reuse extracted helpers: `labels` map, `typicalVisitor` benchmark, `formatDuration()` (these need extraction first)
- Bespoke visual/interaction design (not yet specified; placeholder for recovery design)
- Likely modal or page-overlay rather than a section in flow
- Reuse Radix Dialog a11y plumbing from CasePreviewDialog (see section below)

**Location**: `src/features/journey/SessionCockpit.tsx` (new)

**Test file**: `src/features/journey/SessionCockpit.test.tsx` (new) — reuse journey-store test data

---

## RADIX DIALOG A11Y PLUMBING TO REUSE

### CasePreviewDialog
**Path**: `src/components/case-preview/CasePreviewDialog.tsx` + `.module.css`

**Reusable dialog primitives**:
- Dialog.Root, Dialog.Portal, Dialog.Overlay, Dialog.Content, Dialog.Close (lines 54–107)
- Focus trap, labelled title (Dialog.Title), description (Dialog.Description) — provided by Radix
- Escape key close, inert background, focus restoration
- Overlay styling pattern (blur/shadow/panel materials, likely in the CSS)

**Contract**: SessionCockpit can adopt the same Dialog.Root wrapper with `open`/`onOpenChange` props, reusing the overlay/backdrop pattern and a11y guarantees.

**Note**: CasePreviewDialog is case-specific visuals (split layout, artifact, facts); SessionCockpit will have different internals but can reuse the modal wrapper and a11y infrastructure.

---

## E2E SPEC FILES REQUIRING MIGRATION

These files contain assertions on surfaces being retired. **No changes needed now**, but specs must be updated after SessionCockpit + overlay surfaces are built. Listed for audit trail.

### 1. `e2e/responsive.spec.ts`
**Affected assertions**:
- Lines 124–128: Hero evolution replay button reflow at 200% text
  - Selector: `page.getByRole("button", { name: /Replay/ })`
  - **Action needed**: Remove or adapt after HeroEvolution is retired; if static triptych has no replay, remove test
- Lines 137–147: Journey title and live state reflow at 200% text
  - Selectors: `'[class*="SessionJourneySection_title"]'`, `'[class*="SessionJourneySection_liveState"]'`
  - **Action needed**: Update to SessionCockpit selectors after surface is built
- Lines 176–241: Dock/persona tray non-intersection test
  - Selectors: `"[data-persona-satire]"`, `"[data-world-dock]"`, `"#hero-title"`, persona CTA group
  - **Action needed**: If persona tray and floating dock are removed from homepage, delete this test or rewrite for new layout
- Lines 292–314: Hero CTA fold test at 1024×768 (persona tray reservation)
  - Selectors: Hero region role, CTA links
  - **Action needed**: Update viewport/fold calculations if hero composition changes (likely minor tweak)

### 2. `e2e/world.spec.ts`
**Affected assertions**:
- Lines 583–593: Guide never covers journey surfaces
  - Selectors: `'[class*="SessionJourneySection_bar__"]'`, `'[class*="SessionJourneySection_insights__"]'`
  - **Action needed**: Update to SessionCockpit selectors after surface is built; test intent (world stays behind) stays the same

### 3. `e2e/home.spec.ts`
**Likely assertions** (file not fully read):
- Any hero-evolution phase cycling tests
- Persona tray selection/skip tests
- Journey section visibility tests
- **Action needed**: Audit after reading full file; likely removals/adaptations

### 4. `e2e/journey.spec.ts`
**Affected assertions**:
- Lines 10–15: Session funnel heading visibility
  - Selector: `page.getByRole("heading", { name: "Your session, instrumented." })`
  - **Action needed**: Update heading text or selector after SessionCockpit replaces SessionJourneySection
- Lines 32–36: Funnel list visibility (Played, Read work)
  - Selector: `page.getByRole("list", { name: "This session's journey funnel" })`
  - **Action needed**: Update role/name after SessionCockpit built

### 5. `e2e/a11y.spec.ts`
**Likely affected**: Any accessibility assertions on SessionJourneySection, HeroEvolution, PersonaSatire.  
**Action needed**: Audit file; update a11y assertions to match new surfaces.

### 6. `e2e/reduced-motion.spec.ts`
**Likely affected**: HeroEvolution phase cycling behavior with reduced motion.  
**Action needed**: Remove if test is HeroEvolution-specific; SessionCockpit may have different motion rules.

---

## SUMMARY COUNTS

| Category | Count | Notes |
|----------|-------|-------|
| **Files to retire** | 8 | HeroEvolution (.tsx, .css, .test), PersonaSatire (.tsx, .css), SessionJourneySection (.tsx, .css, .test) |
| **Helper functions to extract** | 3 | `labels` map, `typicalVisitor` benchmark, `formatDuration()` |
| **Reuse files (no change)** | 20+ | Journey store, world dir, board dir, case dir, flags, chrome, footer, analytics, storage keys |
| **New surfaces to build** | 8 | IntroDirector + Acts 1–3, TriptychHero, AgentStatusChip, CompactSessionSummary, SessionCockpit |
| **E2E spec files to audit/update** | 6 | responsive, world, home, journey, a11y, reduced-motion |

---

## IMPLEMENTATION SEQUENCE (Recommended)

1. **Extract helpers** (pre-requisite for SessionCockpit):
   - Create `src/features/journey/journey-labels.ts` (labels map)
   - Create `src/features/journey/benchmarks.ts` (typicalVisitor data)
   - Create `src/features/journey/duration-format.ts` (formatDuration function)

2. **Build new surfaces** (can be parallel):
   - SessionCockpit using extracted helpers + journey-store (reuses subscription/math)
   - TriptychHero (static replacement for HeroEvolution)
   - IntroDirector + Act overlays (reuse PersonaSatire persona logic)

3. **Retire old surfaces** (once new ones ship):
   - Remove HeroEvolution + CSS + test
   - Remove PersonaSatire + CSS from hero/Hero.tsx
   - Replace SessionJourneySection with SessionCockpit in page layout
   - Update Hero.tsx to use TriptychHero instead of HeroEvolution
   - Update page layout to mount IntroDirector overlay + SessionCockpit

4. **Migrate e2e specs** (after surfaces stabilize):
   - Update selectors for new surfaces
   - Remove tests specific to retired animations/interactions
   - Verify world stacking, dock positioning, and a11y for new layout

---

## Radix Dialog A11y Plumbing: Reuse Contract

SessionCockpit can reuse the CasePreviewDialog pattern:
- Dialog.Root, Dialog.Portal, Dialog.Overlay, Dialog.Content, Dialog.Close primitives
- Focus trap + Escape close provided by Radix
- Panel background + blur + shadow (reuse CSS material variables)
- Overlay backdrop click-close (Radix default)
- No URL mutation (Radix default)

SessionCockpit's internal split-layout / funnel rendering / insights styling will differ, but the modal wrapper + a11y contract stays the same.

---

**End of inventory. Status: Ready for recovery design handoff.**
