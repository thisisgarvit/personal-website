# Codex execution checkpoint — Immersive world Task 2

**Checkout:** `/Users/garvits/Documents/Side-Projects/Garvit-Portfolio-July`,
`main`, shared by Garvit, Codex, and Claude. No alternate worktree.

## Completed

- Baseline tag: `checkpoint/pre-sougen-rebuild-2026-08-17` at `f8b91fe`.
- Authority lock: `d3ba08d`.
- Gate A: Muko selected 36/40 at `8285302`; see
  `docs/qa/immersive/gate-a-model.md`.
- Muko-specific assumptions stay inside `guide-rig.ts` and `GuideScene` so a
  future model replacement remains bounded.

## Active ownership

- Task 2 / Gate B is the isolated static `/dev/world` Scene 1.
- Codex owns composition, CSS, optical judgment, and markup lock.
- Claude owns post-lock mechanical work: flag-dock wiring, persona state and
  analytics plumbing, immediate test migration, captures, and gate mechanics.
- Claude is a reviewer, not design authority. Codex independently adjudicates
  suggestions against Garvit's goals and the rendered page. Do not duplicate
  another lane's work.

## Garvit-approved decisions

1. Hero: pencil/white sheet → digital structure → release color, mapping MVP →
   beta → GA. Never a loader. Semantic headline and CTAs are immediate;
   no-JS/reduced-motion get GA. Gate B locks GA pixels/hook; Gate C animates.
2. Guide waves once, then glances toward the board. Persona selection later
   gets one restrained pager acknowledgment.
3. Persona satire is modeless, optional, skippable, and never a prerequisite.
   Choices: Founder, Recruiter, Product lead, Just browsing. No free text.
   Payoff: `Noted. This changes nothing. It never does.` No personalization.
4. Persona analytics: UI state is tab-local, but selection is sent to PostHog
   as `persona_selected` with `persona`, `surface: "hero_onboarding"`, and
   `$set: { visitor_persona: persona }`. This supports event breakdowns and
   person segmentation. Disclose before input; Skip sends nothing. Funnel and
   world streams remain local-only.
5. Career timeline is deferred. A future version uses release history rather
   than resume chronology. Mirogian Apr–Sep 2020 BD intern and Languify Jun–Dec
   2021 Growth Product intern are facts only; invent no outcomes.
6. Funnel remains visible. Optional deeper expansion may come later.

## Gate B implementation state

- `src/app/dev/world/page.tsx`
- `src/app/dev/world/WorldPrototype.tsx`
- `src/app/dev/world/world-prototype.module.css`
- `src/app/dev/world/WorldPrototype.test.tsx`
- `public/images/world/prototype-guide.webp`
- `src/app/dev/world/PersonaSatire.tsx` and tests
- `src/data/storage.ts` persona session key
- `docs/qa/immersive/gate-b-composition.md` and four final captures
- Gate B optical lock in `DESIGN.md`

The prototype has chrome, the narrowed mobile experiment strip, exact hero
copy, two CTAs, Muko poster, persona satire, feature-flag dock, final-GA hook,
and one real work ticket. The public homepage remains untouched. True 390×844
captures replaced invalid Chrome-window crops.

## Next sequence

1. Commit Gate B and mark Task 2 complete in the SDD ledger.
2. Begin Task 3 world director/anchor contracts. Public migration remains
   blocked until interactive Gate C also passes.

## Continuation — Task 3 locked / Task 4 active

- Task 3 compatibility tests: `b8b791d`; persistent director/anchors:
  `a84d15b`. Fresh gate: 21/21 focused tests, non-incremental TypeScript,
  lint, and diff check passed. Independent spec/code-quality re-review passed
  with no findings after the 8%-equality and provider-timer corrections.
- Muko provenance/license manifest: `69bd8c9`. Production GLB export is
  delegated to Claude as mechanical work; Codex owns its rendered judgment.
- Task 4 world contracts are implemented locally (not yet committed): rig
  adapter, critically damped scene targets, capability policy, one-canvas lazy
  lifecycle, demand-rendered R3F guide, and `/dev/world` hero/board/journey
  fixtures. Focused world tests are green; the obsolete static prototype test
  is intentionally queued for Claude's immediate interface-lock migration.
- Garvit's hero idea is now a real replayable MVP pencil-sheet → beta grid →
  GA color sequence. The semantic headline and CTAs never wait; reduced motion
  and no-JS materialize GA.
- Public homepage migration remains blocked until the interactive `/dev/world`
  render is visually audited and Gate C passes.

## Gate B bar

- 1440: headline at most two lines; guide 40–50% meaningful crop; both CTAs
  obvious; one real work ticket crosses the viewport boundary.
- 390×844: both 56px CTAs in the first viewport; clear guide crop and work
  entry; persona tray cannot crowd out the hero and remains dismissible.
- Static only: no Canvas, Three, or dynamic import; no homepage migration.
- Taste at least 22/25 with no dimension below 4; static Apple gate passes; no
  dashboard-card stack and no fake duplicate ticket.

Current scored evidence: Taste 23/25, Apple static-applicable 36/40. Claude's
fix-round re-review is clean. Focused suite: 25/25 tests; non-incremental
TypeScript, lint, and diff check exit 0. (`pnpm typecheck` itself is prevented
from writing `tsconfig.tsbuildinfo` by the managed checkout sandbox.)

## Continuation — Gate C correction round

- Production Muko asset: `8b5c44d`, 413,356 bytes, 11,458 triangles, one GLB
  primitive, 58-joint semantic rig, 1024px WebP maps. Runtime-authored hardware
  stays bone-attached in `GuideScene`: pager on chest; fitted comms modules on
  head. The modules intentionally intersect the helmet silhouette; no external
  band or floating tube remains.
- Independent audit caught and Codex fixed: continuous anchor progress now
  invalidates the demand world and feeds scene targets; pose/pointer channels
  are spring-blended from presentation state; hidden/out-of-union playback
  returns before simulation; journey idle settles; explicit theme overrides
  select the matching fallback poster; authored coral/lime hardware is excluded
  from the porcelain source reskin.
- The approved hero MVP→beta→GA evolution remains. The audit's suggestion to
  remove it was rejected because Garvit explicitly locked it after the cutoff
  clarification.
- `e7488b3` lazy-loads the already-approved PostHog client. Five-event whitelist
  and pageview/autocapture initialization remain; initial homepage JS fell from
  237.9KB to 161.2KB gzip. Session-local journey/world data still never enters
  PostHog.
- Claude now owns the maximum mechanical lane: Gate C E2E expansion,
  axe/console/overflow checks, exact-camera poster export, capture matrix,
  evidence records, and immediate public test/flag migrations after Codex
  declares Gate C PASS. Codex retains art/motion tuning and Apple/Taste judgment.
- Public homepage migration remains blocked until the final Gate C evidence and
  scorecards pass.
