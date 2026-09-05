# Execution RFC — OUTLINE (advisory; no implementation before Codex+Garvit pixel lock, per DD-014)

> Status: outline for Codex review. Becomes an RFC only after the Neo Futurist mock receives the joint pixel lock. Every lane brief below gets a Direction Audit (GI/DD check, per DD-015) before launch.

## 0. Preconditions (all must be recorded in the decision register first)
- Pixel lock on the Neo Futurist mock (DD-010 → Locked; DD-017 seam proposal explicitly approved or rejected).
- Cockpit semantics lock (visitor-session live-fill left / authored benchmark right) — decided 2026-08-18, needs register entry.
- V1 guide contract entry (existing Muko WebGL for welcome + reactions; posters as fallback tier; no character production — DD-013).
- Token source-of-truth decision: chassis tokens extend or replace DESIGN.md §3 values (DD-016 scoping).

## 1. Lane structure (disjoint file ownership — the D2/E parallel pattern)

| Lane | Tier | Scope | Owned paths (frozen at launch) |
|---|---|---|---|
| **T — Tokens & chassis primitives** (runs FIRST, alone) | Sonnet | Neo Futurist token layer + shared chassis components (frame, pane, label, instrument card) | `src/app/globals.css` (token block), new `src/components/chassis/**` |
| **A — Onboarding system** | Sonnet | IntroDirector state machine (locked states/guards: DD-001–005, persistent `completedAt`, tab-latch→Persona), overlay surfaces, live-Muko welcome integration via existing world scene targets, in-place dissolve reveal | new `src/features/intro/**`; read-only consumption of `src/features/world/**` (new scene targets added by this lane in `world/` — ONLY this lane touches world) |
| **B — Homepage migration** | Sonnet | Static triptych hero (maturity-as-materiality), subordinate flags row restyle, board chassis re-skin, agent chip `TRACKING · n/5 → OPEN` | `src/components/hero/**`, `src/app/page.module.css`, board/flags CSS modules (visual only — no behavior files) |
| **C — Session cockpit** | Sonnet | Full-screen cockpit (visitor live-fill funnel + authored benchmark pane + instruments + insights + trust line), compact summary line, retire of old journey shell | new `src/features/cockpit/**`, `src/features/journey/` (shell retire + helper extraction per inventory) |
| **D — Grunt trail** (follows each lane's lock) | Haiku | Retire/cleanup per reuse-retire-inventory, test migrations per interface lock, capture matrices, evidence docs | `e2e/**`, `docs/qa/**`, deletions inventory |

Constraints: no two lanes share a file; behavior contracts (board physics, flags logic, journey store, analytics whitelist incl. `persona_selected`, storage keys) are UNTOUCHABLE by all lanes (DD-016); ownership recorded in ARCHITECTURE.md before parallel start.

## 2. Sequencing
T (solo, ~half-day) → A ∥ B ∥ C (parallel, disjoint) → D trails each lock → integration pass (Sonnet, single lane) → gates.

## 3. Gates
- Per-lane: Codex visual gate on captures (Apple/Taste scored, floors per plan Task 8 precedent).
- Integration: one Opus contradiction review (registers + drift alarms) + full e2e/budget/matrix suite (existing harnesses).
- RC2: full release suite + three-engine matrix + analytics-split re-proof (five events) + fresh HCM note.
- Final: Garvit live play-through (the acceptance criterion), then RC commit; deploy on separate authorization.

## 4. Standing disciplines
- Direction audit before every lane launch (name GI/DD entries; report aligned / possible drift / decision required).
- Pull model at codex turn-ends; pane is the only cross-agent channel.
- No agent self-reports success without programmatic verification (blank-render lesson).
- One correction round per gate maximum unless Codex+Garvit extend.

## 5. Rough shape (post-lock)
T: 0.5d · A/B/C parallel: 1.5–2d wall-clock · D + integration + gates: 1–1.5d · RC2 + play-through: 0.5d → **~3.5–4.5 working days from pixel lock to RC2**, review cycles included.
