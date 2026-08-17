# Direction Decision Register

> Decision authority and drift-control record for Garvit’s portfolio. Read this file together with `garvit-idea-ledger.md` before design or implementation work.

## Authority

- Garvit and Codex make product/design decisions.
- Claude advises, audits drift, and implements delegated work.
- A Claude recommendation is never a lock unless Garvit or Codex explicitly records its approval here.
- Storyboards demonstrate only the dimensions explicitly approved.
- Do not silently reinterpret an idea as a decision.

## Decision vocabulary

- **Locked** — binding until explicitly superseded.
- **Provisional** — chosen direction awaiting pixel-level validation.
- **Deferred** — intentionally outside current scope.
- **Rejected** — must not reappear without a new decision.
- **Superseded** — historical decision replaced by a later entry.

| ID | Decision | Status | Authority | Rationale / drift check |
|---|---|---|---|---|
| DD-001 | Use one fullscreen onboarding surface: Welcome → Persona → Punchline → in-place homepage reveal. | Locked | Garvit + Codex | No scrolling, route change, or separate page inside onboarding. |
| DD-002 | Persona selection is mandatory; there is no Skip or hidden Escape/click-outside dismissal. | Locked | Garvit + Codex | “Just browsing” is the frictionless choice, not a bypass. |
| DD-003 | Choices: Founder / Recruiter / Product lead / Just browsing. Payoff: “Noted. This changes nothing. It never does.” | Locked | Garvit + Codex | Keep the satire immediate and candid. |
| DD-004 | Send allowlisted PostHog event `persona_selected`; keep the session-journey event stream browser-local and separate. | Locked | Garvit + Codex | No scene, guide, board, or funnel events leak into PostHog. |
| DD-005 | Write the 24-hour onboarding timestamp only after persona selection; reload mid-flow returns to the persona state. | Locked | Garvit + Codex | No-JS/crawlers bypass; DOM fallback tiers retain the flow. |
| DD-006 | The homepage hero shows a single static MVP/Beta/GA triptych unless a reviewed transition demonstrably looks better. | Locked | Garvit + Codex | Do not add animation merely to satisfy the maturity metaphor. |
| DD-007 | Homepage order: strong text-led hero → subordinate feature flags → Kanban board. Interaction remains integral to the product-world premise. | Locked | Garvit + Codex | Preserve clarity and density gradient; avoid decorative dashboard clutter. |
| DD-008 | Retire the always-visible full-width analytics shell. Show compact agent-level session feedback that opens a bespoke fullscreen cockpit. | Locked | Garvit + Codex | Reuse accessibility plumbing if useful, not the old case-dialog visual shell. |
| DD-009 | Storyboard V2.1 approves flow/composition only. Its palette, analytics UI, and component styling are placeholders—not approved final design. | Locked | Garvit + Codex | Never cite storyboard acceptance as final visual-language approval. |
| DD-010 | Derive the final system from the Neo Futurist reference: monochrome chassis, strong black/white contrast, asymmetric panes, tactile materiality, and sparse lime/coral semantic accents. | Provisional | Garvit + Codex | Final pixels need a dedicated design-language mock. No large release-blue SaaS fields or generic card soup. |
| DD-011 | Amplitude informs funnel hierarchy and terminology, not trade dress. Use a dominant visitor funnel, diminished benchmark pane, and instrument-like metrics. | Provisional | Codex recommendation; Garvit direction | Validate in the dedicated cockpit mock before lock. |
| DD-012 | Career release-history/roadmap surface, including factual Mirogian and Languify entries. | Deferred | Garvit + Codex | Do not invent outcomes; do not turn it into a resume timeline. |
| DD-013 | V2 may use an original vintage-anime 2.5D guide. Do not use literal Zoro or copied IP; do not reopen character production in V1. | Locked scope | Garvit + Codex | Live 3D is justified only by meaningful continuous reactions. |
| DD-014 | No production migration until the revised design language and session-cockpit pixels are explicitly approved. | Locked | Garvit + Codex | Mechanical gate scores cannot substitute for rendered design judgment. |
| DD-015 | Maintain the idea ledger and this register across compactions; Claude runs drift checks but cannot lock decisions. | Locked | Garvit + Codex | Every handoff begins with these two files. |
| DD-016 | `DESIGN.md` remains authoritative for validated behavior, accessibility, content, and interaction contracts. Its visible composition, materials, and palette are reopened for the Neo Futurist pass. | Locked boundary | Garvit + Codex | Prevent old visual rules from blocking the redesign without losing proven mechanics. |
| DD-017 | The old no-gradient rule remains the default; tightly scoped material-lighting or seam-feather treatments require explicit approval in the final visual mock. | Decision required | Codex | Do not smuggle decorative SaaS gradients back in under “depth.” |

## Material supersession history

| Earlier position | Current ruling | Why it changed |
|---|---|---|
| Zero visitor homework | Amended only for the mandatory one-tap persona satire, with “Just browsing” as the low-friction choice. | The friction itself is the critique of role-collection theatre. |
| Persona gating rejected | Superseded by DD-001–DD-005. | Garvit clarified that it is satire and useful aggregate data, not fake personalization. |
| PostHog declined / four-event whitelist | Superseded by the approved five-event whitelist including `persona_selected`. | Garvit explicitly wants to know the type of visitor. |
| Storyboard V2.1 design pass | Demoted to flow/composition approval only by DD-009. | Garvit rejected its visual language, especially analytics. |
| Fully locked `DESIGN.md` visual system | Partially reopened by DD-016. | The new Neo Futurist direction needs a deliberate visual reset while preserving proven contracts. |

## Mandatory direction check

Before every design or implementation lane:

1. Read both direction files.
2. Name the affected `GI-*` and `DD-*` entries.
3. Flag contradictions or omitted intent before editing.
4. At handoff, report **aligned**, **possible drift**, or **decision required**.
5. Only Garvit or Codex may change a decision’s status.

## Current visual drift alarms

- Onboarding becomes multiple pages, scrolls, or loses the single-stage transition.
- The old analytics dashboard/card-stack shell returns.
- Large release-blue surfaces replace the monochrome chassis.
- Lime/coral accents become decorative backgrounds instead of state signals.
- A storyboard placeholder is treated as final styling.
- A literal copyrighted anime character enters production.
- V1 reopens character production without a clear live-behavior payoff.
- Test coverage or budget compliance is presented as proof of visual quality.
