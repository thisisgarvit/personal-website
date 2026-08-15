# garvit.app — polished vertical-slice notes

## What this slice proves

This is not a portfolio page styled like product software. The product rituals are the navigation and interaction model:

- `garvit.app v2.4.1` opens real release notes.
- The A/B banner dismisses and returns product-flavoured feedback.
- Feature flags change the actual interface.
- The sprint board is the portfolio index; tickets can be opened, dragged, keyboard-moved, and reset.
- Dropping work into Shipped opens the case preview and triggers a silent on-call-PM celebration.
- The mascot follows the visitor and reacts to releases, flags, CTAs, drag state, and shipping without an event-log stream.

The default screen is deliberately dense enough to read as a live product in a screenshot. It still has one clear hierarchy: positioning, resume/contact, product controls, then real work.

## Visual system

### Palette

The palette uses release-management semantics rather than portfolio decoration:

| Token | Hex | Role |
|---|---:|---|
| Build sheet | `#EDF0EB` | Cool application canvas; avoids the banned warm lifestyle-cream default. |
| Panel white | `#F8F9F4` | Tickets, controls, and readable case surfaces. |
| Product ink | `#171923` | Chrome, type, outlines, and hard contrast. |
| Release blue | `#3F49E8` | The authored hero/product identity—not a purple-to-blue gradient. |
| Merge lime | `#CBED45` | Healthy builds, Shipped, resume, and successful reactions. |
| Incident coral | `#FF6B52` | Research, attention, and on-call state. |
| Open-question lilac | `#C4B7FF` | Experiments and conceptual work. |
| Context cyan | `#72D7D0` | Maxie and memory/agent work. |

The dark theme is separately tuned rather than inverted. Panels move to blue-black, Release Blue becomes a brighter periwinkle, and semantic accents retain their roles and contrast. Color is never the only status signal.

### Type

**Archivo Variable** is the main face. Its dense, industrial display weights make the hero feel like a product launch surface, while its quieter weights remain highly readable in tickets and case-study copy. It has enough character to avoid the default Inter/Space Grotesk SaaS voice.

**IBM Plex Mono** handles versions, flags, ticket IDs, dates, build states, and annotations. It connects directly to GitHub PRDs, instrumentation, and release practice without turning the site into a terminal theme.

Both families are SIL Open Font License webfonts. The Latin WOFF2 files are embedded directly in `slice-product.html`; there is no CDN or Apple-platform/patched font dependency.

## Interaction and motion decisions

### Ticket physics

Pointer dragging uses a damped spring follower rather than attaching the ticket rigidly to the cursor. Horizontal velocity contributes a clamped ±3° lean. Drop zones respond before release, then a FLIP-style overshoot animation settles the ticket into its new column. The board is transient by design and says so after a move; Reset and page refresh restore the authored state.

Dragging onto Shipped is the largest reward: focused confetti, a mascot celebration, and the relevant case preview. No destination is wrong and nothing scores the visitor.

Keyboard parity is built into the same model:

- `Enter` opens the focused ticket.
- `Alt + Left/Right Arrow` moves it between columns.
- The new column is announced through a polite live region.

### On-call PM

The slice uses a polished Canvas 2D mascot with a spring-smoothed look target, occasional blink, subtle breathing/bob, and a small reaction state machine. It is silent by design after Garvit cut the event log. Reaction badges are decorative; all functional outcomes also exist in the interface and accessible announcements.

### Feature flags

- `dark_mode` switches the complete dual theme.
- `confetti_on_scroll` emits small edge bursts after meaningful scroll distance, not a constant shower.
- `candid_mode` is the added concept extension. It expands and collapses Garvit-style annotations on the tickets, so the invented flag changes useful portfolio content.
- `comic_sans` is disabled with the specified tooltip: “disabled in prod for a reason.”

Flags are expanded by default for first-glance legibility and can collapse. They remain session-local so every refresh starts from the intended demo state.

## Case previews

Each ticket opens a distinct visual artifact and real sourced content:

- **Stay Portal:** five-room timeline, 484 imported bookings, ₹0 monthly infrastructure, database overlap prevention, and the Sheets mirror as an adoption bridge.
- **AI Browser — Maxie:** browser/memory field, contextual memory, trainable agents, provenance, and human-controlled automation.
- **Agentic Calendar:** an optimized day view with creative, operational, restorative, and approval states.
- **Dynamic Island teardown:** a hover-reactive phone/island vignette and the organizational bet behind the interaction.

These previews are intentionally substantial but not substitutes for final case routes. The homepage stays a playable index; long-form reading remains calm.

## Production upgrades

### Mascot renderer

Replace Canvas 2D with a small authored React Three Fiber scene:

- One compressed GLB with a torso, head, eyes, arms, and pager badge.
- Look-at rig shared across torso yaw, head pitch/yaw, and pupil targets.
- Three short authored reactions: notice, flag-check, and shipped celebration.
- One key light, one soft fill, one matte material atlas, no post-processing.
- Clamp device pixel ratio to 1.5, pause rendering offscreen, and retain the Canvas/SVG poster until the first WebGL frame.
- Skip WebGL for reduced motion, Save-Data, low-memory devices, or renderer failure.

### Application architecture

- Move release data, flags, tickets, and case content into typed data modules.
- Use Next.js routes for `/work/stay-portal`, `/work/maxie`, `/work/agentic-calendar`, and `/notes/dynamic-island`.
- Preserve board position only for the current session. Do not turn a portfolio toy into account state.
- Connect the resume CTA to the verified final PDF and keep `resume` explicit in the label.
- Keep real analytics separate from the fake-product microcopy. Use sparse, consent-aware measurement; never expose a visitor-facing event stream or imply surveillance.
- Subset fonts to the final glyph set and retain the OFL notices in the repository.

### Content and media

- Replace the generated Stay Portal timeline with privacy-safe screenshots from the isolated demo data.
- Add the supplied Maxie prototype screenshot where it advances the case, not as background decoration.
- Verify any career metrics against the final resume before publishing them.
- Add full long-form case routes with the situation → bet → artifact → decisions/exclusions → evidence → next-change structure.

## Accessibility and fallback

- Native buttons, checkboxes, links, and a semantic `dialog` cover the primary controls.
- Tickets have focus states, explicit instructions, Enter-to-open, and keyboard movement.
- Deliberate state changes announce through one polite live region; hover and cursor movement do not chatter.
- Reduced motion disables confetti, spring animation, ticker movement, cursor blinking, and mascot motion while preserving every state change.
- The mobile board scrolls horizontally by column; page-level horizontal overflow remains zero.
- With JavaScript unavailable, the authored hero, controls, and initial portfolio tickets remain readable. Production should render full case links directly in the ticket markup as the no-JS path.
- The style uses high-contrast outlines, minimum 44px primary targets, and forced-colors fallbacks.

## Scope boundary

This file is the approved vertical slice, not the final Next.js scaffold. Routing, persistence modules, real asset loading, the R3F mascot, and complete case-study pages belong to the production build after this interaction direction is approved.
