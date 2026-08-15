# Plan amendment — work-split rebalance (2026-08-15, from Garvit)

Garvit's directive: **Claude absorbs the grunt work; codex keeps only what it is uniquely great at.** Reason: Claude runs on a Max plan (deep token budget); codex's plan has tighter limits and should be spent exclusively on design/interaction craft. This supersedes the terra-worker lane in production-plan-v1/v2 — terra models are no longer used.

## Revised ownership

| Task | v2 owner | New owner |
|---|---|---|
| 1. DESIGN.md | codex sol-high | **codex** (unchanged, in progress) |
| 2. Production PRD | codex sol-high | **codex** (unchanged) |
| 3. Repository foundation | terra | **Claude** (subagent lane) |
| 4. Tokens & structural shell | terra | **Claude**, with codex design-fidelity gate |
| 5. Content & route port | terra | **Claude** (subagent lane) |
| 6. Feature-flag system | codex sol-high | **codex** (taste-critical, unchanged) |
| 7. Sprint-board physics | codex sol-high | **codex** (unchanged) |
| 8. Procedural R3F mascot | codex sol-high | **codex** (unchanged) |
| 8A. OG/social card | codex sol-high | **codex** (unchanged) |
| 9. Mechanical QA / deploy wiring | terra | **Claude** |
| 10. Integration & craft pass | codex sol-high | **codex** (unchanged), Claude judges |
| 11. Content QA mirror | Claude/Haiku | **Claude** (unchanged) |
| 12. Release | terra + sol-high | **Claude**, codex signs off final visual |

## Revised review lattice (token-aware)

- Claude's grunt output is quality-reviewed inside Claude's own lane (orchestrator reviews subagent diffs). Codex reviews **design fidelity only** where taste can drift: Task 4's token transcription + shell screenshots (1440×900 and 390×844), and the final Task 12 deploy visually. Codex does NOT review config/plumbing diffs — that burns its tokens on work Claude can self-police.
- Claude continues to judge ALL codex taste work (Tasks 1, 2, 6, 7, 8, 8A, 10) as before.
- The "no two workers in the same module" rule and the frozen-spec rule (no inventing tokens/copy/behavior) carry over unchanged to Claude's subagents — DESIGN.md and the PRD remain the frozen source of truth for everyone.

All other v1/v2 content (gates, budgets, tests, acceptance, deployment) is unchanged.
