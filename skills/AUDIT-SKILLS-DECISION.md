# Audit-skill adoption decision (2026-08-15, Claude as lead; suggested by Garvit)

Two skills evaluated for the remaining build phases (Tasks 8A/10/11/12).

## ADOPTED: impeccable (pbakaus) — as the release-audit rubric

Files vendored: `skills/impeccable/SKILL.md`, `audit.md`, `craft-floor.md`, `critique.md`.

- `audit.md`'s five-dimension scored audit (Accessibility / Performance / Theming / Responsive / **Implementation Integrity**) with P0–P3 severity tagging becomes the **frame for the release-candidate audit** (Claude's Task 11/12 judge pass) and an input lens for codex's Task 10 craft pass.
- It audits implementation against what we locked — zero authority conflict with DESIGN.md/PRD. "Implementation Integrity" (does the code express a coherent product-specific system, or template drift?) is precisely our anti-slop gate, but scored and evidence-based.
- `craft-floor.md` = minimum craft bar for Task 10; `critique.md` = deep-dive reference if a surface fails.

## DECLINED as authority: taste-skill (Leonxlnx)

Files vendored for reference only: `skills/taste-skill/SKILL.md`.

- It is a **generation-time** skill: read the brief → set VARIANCE/MOTION/DENSITY dials → pick an aesthetic family. We are past that phase — the concept survived three client rejection cycles, and DESIGN.md is locked with per-token defenses. Introducing a second aesthetic authority now invites drift and re-litigation of decided taste.
- Its anti-default list (§0.D: AI-purple gradients, centered mesh hero, three equal cards, glassmorphism-everywhere, Inter+slate-900) is already fully covered — and exceeded — by DESIGN.md §2's banned list.
- Worth one glance at RC: its framing question "would this pass as templated?" duplicates our founder-screenshot test.

## Rule

DESIGN.md and PRD.md remain the only design authority. Impeccable is a *measurement instrument* pointed at them, not a source of new visual values.
