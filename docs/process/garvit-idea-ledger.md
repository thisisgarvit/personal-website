# Garvit Idea Ledger

> Durable record of Garvit-originated product and design ideas. This file preserves intent before review or implementation; it does not turn ideas into decisions. Entries are never deleted. Locks, rejections, and supersessions live in `direction-decision-register.md`.

## Status vocabulary

- **Active** — should shape the current design.
- **Deferred** — valuable, deliberately postponed.
- **Superseded** — replaced by a later Garvit idea; retained for history.
- **Rejected** — explicitly ruled out.
- **Shipped** — implemented and verified.

| ID | Garvit's idea | Intent | Status | Related decision |
|---|---|---|---|---|
| GI-001 | Make this a product portfolio, not a resume website. | Let work and product judgment lead; keep the resume downloadable. | Active | DD-001 |
| GI-002 | In the strongest references, the interaction **is** the website—not decoration added to a brochure. | Make the experience memorable and screenshare-worthy within seconds. | Active | DD-001, DD-007 |
| GI-003 | “This site is my product”: `garvit.app` behaves like a live product Garvit is visibly PM-ing. | Express product sense through the site’s operating metaphor. | Active | DD-001, DD-007 |
| GI-004 | On one locked screen, the avatar welcomes the visitor, persona choices appear, the punchline follows, and the homepage reveals smoothly. | Recreate a polished SaaS onboarding moment without scrolling or page changes. | Active | DD-001–DD-003 |
| GI-005 | The persona prompt satirizes SaaS role-collection theatre; the answer intentionally changes nothing. | Use candid PM humor while collecting useful audience context. | Active | DD-002–DD-004 |
| GI-006 | Capture the selected persona in PostHog so Garvit knows which audiences visit. | Obtain useful aggregate visitor-role information. | Active | DD-004 |
| GI-007 | Show onboarding again after 24 hours, not on every revisit inside that period. | Preserve the first-visit moment without becoming annoying. | Active | DD-005 |
| GI-008 | Make “fuzzy idea → something people can use” visible as MVP → Beta → GA. | Turn the hero sentence into a product-maturity visual. | Active | DD-006 |
| GI-009 | A static simultaneous MVP/Beta/GA composition is acceptable if it looks better than a transition. | Prioritize first-glance quality over animation for its own sake. | Active | DD-006 |
| GI-010 | Session instrumentation should mostly live at the agent/model level; clicking it should reveal rich details. | Keep analytics present but not permanently dominate the homepage. | Active | DD-008 |
| GI-011 | Show the career journey as a Jira/release-roadmap timeline; include Mirogian and Languify facts without invented outcomes. | Add career context without falling back to a resume timeline. | Deferred | DD-012 |
| GI-012 | Aim for Sougen-level spatial confidence and model quality. | Use immersive references as an ambition benchmark, not a clone target. | Active | DD-007 |
| GI-013 | Use the supplied Neo Futurist reference as the preferred design-language direction: thick black chassis, asymmetric panes, monochrome materiality. | Replace generic SaaS panels with a distinctive, cohesive visual system. | Active | DD-010 |
| GI-014 | Prefer sparse accents over strict monochrome. | Retain semantic personality without losing the disciplined base. | Active | DD-010 |
| GI-015 | Explore a vintage-anime guide, initially described as “like Zoro,” using authored shots and page animation; question whether live 3D is necessary. | Seek a more authored, contemporary character presence with less runtime weight. | Deferred | DD-013 |
| GI-016 | Treat the vintage-anime guide as a possible V2 rather than reopening current production immediately. | Protect V1 focus while preserving the stronger future direction. | Deferred | DD-013 |
| GI-017 | Maintain a durable record of Garvit’s ideas so context compaction cannot bury or distort them. | Keep Garvit, Codex, and Claude aligned across long build cycles. | Active | DD-015 |

## Adding an entry

Record only a meaningful product/design idea originating from Garvit. Preserve his closest available wording, separate the underlying intent, and link—but do not invent—a decision. Routine feedback, status questions, and implementation details do not belong here.
