# Gate E — Artifact-led case openings (Claude lane report)

Date: 2026-08-17 · Base commit: `bdd89a3` · Build dir: `.next-gate-e` · Server: port 3140 (production `next start`)

## Structure per route

All four routes now render the same Gate E contract via `CaseShell`:
product chrome → `CaseOpening` (back-to-board `/#work-board`, kind label ·
ticket id, H1 title, one-sentence value, exactly three verified facts, ONE
large artifact) → calm 68ch prose (`data-case-body`) → null-ended
previous/next case navigation (`Start of board` / `End of board` markers at
the line ends; never wraps).

| Route | Opening artifact | Section treatments used |
| --- | --- | --- |
| `/work/stay-portal` (GAR-101, Shipped product) | Real day-view product screenshot `day-view.png` (PII-cleared demo data) | constraint: Situation · decision: The bet · decision: Decisions and exclusions · outcome: Evidence |
| `/work/maxie` (GAR-204, 0→1 product concept) | Real clickable-prototype screenshot `maxie-prototype.png` (local asset) | constraint: Problem · decision: The bet |
| `/work/agentic-calendar` (GAR-207, Product concept) | Authored product-system diagram in code (`agentic-calendar-system.tsx`) | decision: The bet · constraint: Approval boundaries |
| `/notes/dynamic-island` (GAR-309, Product note / research) | Authored continuity/status diagram in code (`dynamic-island-continuity.tsx`) | decision: The bet, read from outside · outcome: User impact · constraint: Execution challenge |

Treatments are rules/type/material, not rounded cards: decision = 3px
release-blue left rule; constraint = hairline top/bottom rules with a
bracketed mono eyebrow; outcome = 3px ink top rule with a merge-green tick.

## Artifact provenance

- **Stay Portal** — `src/app/work/stay-portal/day-view.png`, the existing
  local PII-cleared demo screenshot (open-questions-answers.md §6; synthetic
  guests/numbers). Promoted from the MDX body to the opening; alt/caption
  text moved verbatim with it.
- **Maxie** — `src/app/work/maxie/maxie-prototype.png`, the existing local
  prototype screenshot (same asset as content-source/assets/ai-browser-maxie).
  Promoted from mid-MDX to the opening; alt/caption moved verbatim.
- **Agentic Calendar** — no rights-cleared product image exists, so the
  opening is a verified product-system diagram built in code from the
  route's own sourced facts (content-source/agentic-calendar.md): 1 agentic
  layer (on Google Calendar / Notion Calendar / Reclaim), 4 core
  capabilities (verbatim capability headings), 5 product surfaces (the
  prototype's five tabs). Caption declares it an authored diagram.
- **Dynamic Island** — authored continuity/status diagram
  (`dynamic-island-continuity.tsx`) from sourced claims only
  (content-source/one-delightful-product-experience.md): the
  "more than a notification, less than a multitasking window" spectrum and
  the source's three example states (ongoing order, Face ID, music). Caption
  declares it authored, not an Apple asset. No invented metrics or UI.

## What moved out of MDX

- `stay-portal/content.mdx`: the day-view `CaseFigure` (import + figure)
  moved to `page.tsx` as the opening artifact. All prose unchanged.
- `maxie/content.mdx`: the prototype `CaseFigure` (import + figure) moved to
  `page.tsx`; the adjacent prototype link sentence now references the
  opening screenshot. All other prose unchanged.
- All four MDX files: decision/constraint/outcome `## headings` wrapped in
  `<CaseSection treatment=… title=…>`; heading text and body prose verbatim.
- `not-found.tsx` no longer borrows `CaseShell` (it would now demand an
  opening artifact + board adjacency); it renders the same calm layout from
  its own module CSS. Its test still passes unchanged.

## Analytics

`CaseShell`/`CaseOpening`/`CaseSection` and the four routes import no
analytics; `CaseShell.test.tsx` asserts zero `analytics.track` calls.
`CasePreviewDialog` remains the sole `full_case_read` owner. No new events.

## Gate results

- `pnpm typecheck` — PASS
- `pnpm lint` — PASS
- `pnpm test` (full) — 47 files / 185 tests PASS
- `NEXT_DIST_DIR=.next-gate-e pnpm build` — PASS (all 4 case routes static)
- `NEXT_DIST_DIR=.next-gate-e pnpm check:budgets` — all PASS (case route JS
  138.8–145.0KB gzip, ≤170KB ceiling)
- `e2e/case-routes.spec.ts` + `e2e/case-navigation.spec.ts` (chromium,
  production server, port 3140) — 23 PASS (200s on all 4 routes,
  artifact-before-prose DOM order, factual values, back/prev/next, single
  H1, no image overflow, no horizontal overflow, keyboard focus order and
  full forward/backward traversal)
- `e2e/a11y.spec.ts --grep "work|notes"` — 8 PASS (all case routes, light +
  dark, no serious/critical axe)
- Console: zero errors/pageerrors across all capture runs.

## Captures

- `stay-1440.png`, `stay-390.png`, `stay-1440-dark.png`
- `maxie-1440.png`, `maxie-390.png`
- `calendar-1440.png`, `calendar-390.png`
- `island-1440.png`, `island-390.png`

## Deviations

- Per lane file-ownership rules, keyboard-flow coverage lives in the NEW
  `e2e/case-navigation.spec.ts` instead of modifying `e2e/keyboard.spec.ts`
  (plan Task 7 listed keyboard.spec.ts; that file is owned by the D2 lane
  this run).
- Evidence index is this file (`gate-e/claude-e-report.md`) per the lane
  brief; the plan's `gate-e-cases.md` name was superseded by the brief.
- `not-found.tsx`/`not-found.module.css` were touched (not in the Task 7
  file list) because the 404 previously reused `CaseShell`; it now owns its
  layout so the case contract could become required-props.
- Maxie's opening `sizes` hint widened to `(max-width: 1120px) 92vw, 1024px`
  to match the larger opening measure (asset is 2582px wide; still the same
  local file).
