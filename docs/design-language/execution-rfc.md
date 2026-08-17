# Neo Futurist V1 — Parallel Execution RFC

> **For agentic workers:** REQUIRED SUB-SKILL: use `superpowers:subagent-driven-development` or `superpowers:executing-plans`. Work from frozen contracts, write tests first, and commit only owned paths.

**Status:** Ready for execution immediately after Gate 0 pixel approval.

**Goal:** Replace the rejected visual shells with one coherent Neo Futurist onboarding, homepage, and live-session cockpit while preserving the working board, cases, analytics separation, world rig, fallbacks, and accessibility contracts.

**Architecture:** A small shared chassis/token layer feeds three disjoint UI lanes. Existing business logic remains authoritative: onboarding adds one state machine, the homepage consumes existing flags/board/world behavior, and the cockpit reads the existing browser-local journey store. An integration owner alone edits `page.tsx` and retires legacy shells.

**Tech stack:** Next.js, React, CSS Modules, Radix Dialog, existing R3F world, Vitest, Playwright.

## 0. Authority and non-negotiables

Read before editing:

- `docs/process/garvit-idea-ledger.md`
- `docs/process/direction-decision-register.md`
- `docs/design-language/neo-futurist-direction.md` once Gate 0 locks it

Every lane names the affected `GI-*`/`DD-*` entries and ends with `aligned`, `possible drift`, or `decision required`.

- One fullscreen onboarding stage: Welcome → Persona → Punchline → in-place homepage reveal.
- No Skip, Escape dismissal, outside-click dismissal, route change, or scrolling during onboarding.
- Persona choices and payoff remain exact.
- `persona_selected` payload remains `{ persona, surface: "hero_onboarding", $set: { visitor_persona } }`.
- Journey events remain browser-local. PostHog remains pageviews/autocapture plus the five allowlisted custom events.
- Homepage order remains hero → subordinate flags → board.
- Hero shows simultaneous static MVP/Beta/GA unless Gate 0 explicitly approves motion.
- V1 reuses the existing live Muko/WebGL world and matching poster fallback. No new character production.
- Board physics, flags behavior, case routes/content, journey store, analytics whitelist, world capability policy, and storage-denied fallbacks are consume-only.
- No dependency additions.

## 1. Gate 0 — visual and semantic lock

Garvit and Codex approve one capture set before production files change:

- onboarding welcome/persona/punchline at 1440 and 390;
- homepage at 1440 and 390;
- cockpit at 1440 and 390;
- authored dark-theme stress check for homepage and cockpit.

The lock must resolve:

1. Neo Futurist chassis, typography, materials, sparse semantic accents, mobile composition.
2. Hero seam treatment under DD-017.
3. Cockpit meaning: **this visitor’s** five stages are binary reached/not reached and fill live; the “typical visitor” comparison is diminished, static, and labeled `authored benchmark`.
4. Trust line remains exact: `this funnel is computed in your browser. PostHog sees the rest. I check it obsessively.`
5. V1 rendering: live Muko in supported tiers; matching poster in reduced-motion/Save-Data/low-memory/WebGL-failure tiers; DOM flow remains usable.

## 2. Frozen interfaces

```tsx
<OnboardingExperience />
<Hero statusSlot={<SessionCockpitLauncher />} />
<SessionCockpitLauncher />
```

Selectors:

```text
[data-onboarding-root]
[data-onboarding-step="welcome|persona|punchline"]
[data-persona-choice]
[data-triptych-hero]
[data-maturity-band="mvp|beta|ga"]
[data-session-cockpit-trigger]
[data-session-cockpit]
```

Existing selectors remain unchanged: `#hero-title`, `#resume-cta`, `[data-primary-cta]`, `#work-board`, `[data-world-anchor]`, `[data-experience-world]`.

Storage contract:

```ts
type OnboardingCompletion = { completedAt: number };
// localStorage: "garvit-onboarding:v1"

type OnboardingTabState = { step: "persona" };
// sessionStorage: "garvit-onboarding-tab:v1"
```

- Write `completedAt` only when a persona is selected.
- Clear tab state after selection.
- If unfinished tab state exists, reload at Persona; otherwise start at Welcome.
- Bypass when `Date.now() - completedAt < 86_400_000`.
- Storage denial keeps the current flow usable and simply prevents cooldown persistence.

## 3. Parallel lanes

All agents branch from one frozen integration base. Use isolated worktrees; only the integration worktree serves Garvit’s play-through. Do not rebase or rewrite another lane’s branch.

### Lane F — foundations and chassis

**Owner:** Sonnet  
**Files:** create `src/styles/neo-tokens.css`, `src/styles/neo-materials.css`, `src/components/chassis/**`; modify only the corresponding import in `src/app/globals.css`.

Produces scoped primitives for chassis, panes, eyebrow labels, hatch/drop-off texture, instrument numerals, semantic lime/coral states, focus rings, and reduced-motion behavior. It owns no page layout.

**Gate:** token unit/static tests, Storybook-free fixture render, light/dark 1440/390 captures. Estimated 60–90 minutes.

### Lane Q — contract tests and QA harness

**Owner:** Haiku  
**Files:** new or updated `e2e/onboarding.spec.ts`, `e2e/session-cockpit.spec.ts`, `e2e/home.spec.ts`, `e2e/responsive.spec.ts`, capture scripts and `docs/qa/neo-v1/**`. No production edits.

Begins beside Lane F. Writes failing tests for the frozen selectors, storage rules, analytics payload, focus behavior, responsive geometry, and preservation contracts. Runs focused tests against each merged lane and the full matrix only after integration.

### Lane A — onboarding

**Owner:** Sonnet  
**Files:** create `src/features/onboarding/**`, onboarding tests, and onboarding-only CSS. It may consume—but not modify—`src/features/world/**` and `src/lib/analytics.ts`.

Implements the single-stage state machine and persistent/tab-local storage contract. The existing world renders beneath the DOM chassis; no WebGL text or new model behavior is required. Reduced motion uses immediate/crossfade state changes. No-JS/crawlers see homepage content directly.

**Gate:** focused unit tests plus welcome/persona/punchline captures at 1440/390. Estimated 3–4 hours after Lane F.

### Lane B — homepage and hero

**Owner:** Sonnet  
**Files:** modify `src/components/hero/Hero.*`; create `TriptychHero.*`; modify presentation-only files for `FeatureFlagDock`; create page-independent tests. Do not edit `page.tsx`, board behavior, or flag logic.

Implements the static maturity triptych, text hierarchy, two existing CTAs, status-slot contract, subordinate flags treatment, and board-compatible chassis presentation. The page remains work-led and avoids generic card grids.

**Gate:** one H1, CTA contracts, 1440/390 visual captures, 200% text and keyboard focus. Estimated 3–4 hours after Lane F.

### Lane C — live-session cockpit

**Owner:** Sonnet  
**Files:** create `src/features/cockpit/**` and tests. Read `src/features/journey/journey-store.ts`; do not modify it unless the integration owner approves a demonstrated interface gap.

Implements an accessible fullscreen Radix cockpit: live reached/not-reached visitor funnel, visually diminished authored benchmark, instrument metrics, candid insights, exact trust line, and live `TRACKING · n/5 → OPEN` launcher. Escape closes the cockpit and restores focus. Opening it sends no analytics event.

**Gate:** all five journey states, live update while open, benchmark labeling, focus trap/restoration, 1440/390 captures. Estimated 4–5 hours after Lane F.

### Lane I — integration and retirement

**Owner:** senior Sonnet, begins after A/B/C pass focused gates.  
**Files:** exclusive ownership of `src/app/page.tsx`, `src/app/page.module.css`, public exports, and legacy-shell retirement.

Wires the three approved interfaces, retains exactly one provider/world/main/H1, preserves world anchors and `#work-board`, and removes old `PersonaSatire`, `HeroEvolution`, and `SessionJourneySection` visual shells only after their replacements pass. It does not redesign board/case mechanics.

**Gate:** integration unit tests, route build, no duplicate IDs/providers/worlds. Estimated 60–90 minutes.

## 4. Merge order

1. `M0` — Gate 0 pixels and register amendments.
2. `M1` — Lane F tokens/chassis and Lane Q failing contracts.
3. `M2` — A, B, and C run and merge in parallel; Q trails each interface lock.
4. `M3` — I integrates and retires old shells.
5. `M4` — Q runs the full release matrix once; Codex judges final captures once.
6. `M5` — one bounded correction round, Garvit play-through, RC commit. Deployment remains separately authorized.

## 5. Release matrix

- Unit, typecheck, lint, build, and no-SKIP budget gates.
- Chromium/WebKit/Firefox for onboarding, homepage, cockpit, board, cases, and analytics whitelist.
- 320, 390, 768, 1024, and 1440 responsive checks; 200% text at 320/390.
- Keyboard, focus restoration, axe, reduced motion, no-JS, storage denial, Save-Data, WebGL denial/context loss.
- Exactly one `persona_selected` with approved properties.
- Live journey reaches five local stages without creating PostHog scene/guide/board/funnel events.
- Fresh 1440/390 light/dark captures; tests and budgets are evidence, not visual approval.

## 6. Time box

Excluding Garvit’s approval latency:

- Gate 0 correction and lock: 1–2 hours.
- Foundation plus parallel A/B/C/Q: 5–6 hours wall clock.
- Integration, full matrix, and one correction: 3–4 hours.
- **Target RC: 8–12 focused hours after pixel lock.**

If a lane misses its time box, preserve the locked experience and cut nonessential polish inside that lane; do not reopen scope or rebuild proven mechanics.
