# garvit.app — Production Product Requirements Document

**Status:** Draft for Claude review  
**Task:** 2 · Production PRD  
**Version:** 1.0 · 15 August 2026  
**Product owner / interaction craft:** Codex  
**Build orchestrator / mechanical lane:** Claude  
**Locked design source:** `DESIGN.md`, approved 15 August 2026

This PRD defines the production portfolio that follows the approved “This site is my product” direction. `DESIGN.md` owns every visual and motion value. This document owns product behavior, content, state, routes, data contracts, fallbacks, acceptance criteria, and the revised work split.

No implementer may invent a missing token, visual value, copy claim, interaction, route, dependency, or persistence rule. Ambiguity stops the affected task and returns to Codex/Claude for a frozen-spec amendment.

---

## 1. Product Definition

Garvit’s portfolio behaves like a live product he is visibly PM-ing. The visitor lands inside a versioned, flagged, shipped interface where product rituals are functional navigation:

- release chrome exposes candid release notes;
- a fixed A/B-banner joke behaves like a product experiment;
- feature flags change the actual website;
- a sprint board is the portfolio index;
- case-study tickets open, move, reset, and route to real work;
- a sourced session-analyst figure silently reacts to the visitor-visible local journey.

The site demonstrates product judgment without asking the visitor to demonstrate theirs.

### Product promise

> I turn fuzzy product ideas into things people can use.

Garvit approved this exact hero sentence on 15 August 2026. It ships unless he later requests an explicit copy revision. Any change requires re-running the Archivo optical-validation pass because tracking was validated against this lowercase-heavy sentence.

### Ten-second success test

Within ten seconds, a first-time visitor must be able to identify:

1. Garvit Sukhija as a product manager who builds.
2. Delhi / IST as his location.
3. Download resume and Contact Garvit as the two primary actions.
4. At least one real project.
5. That the interface is interactive and product-like rather than a styled résumé.

The founder-level outcome is voluntary sharing or screensharing, not completion of a toy.

### Audience priorities

| Audience | Required reaction | Product evidence |
|---|---|---|
| Startup founder | Trusts Garvit can turn ambiguity into shipped product | Stay Portal, candid trade-offs, functional product shell |
| Product lead | Trusts his judgment and exclusions | Case decisions, concept labels, flags, privacy and fallback choices |
| Recruiter / HR | Understands him and reaches contact/resume immediately | Clear hero, large CTAs, calm typography, accessible navigation |

### Non-goals

- Recreate Garvit’s chronological employment history as the homepage.
- Add a primary About route, metrics wall, testimonial carousel, skill grid, blog engine, CMS, account system, or contact form.
- Turn the visitor into a PM candidate through a quiz, prioritization exercise, budget toy, or score.
- Build a real experimentation, feature-management, sprint-management, analytics, or event-log backend.
- Add a `/changelog` route. Three release notes in the popover are the complete joke and product surface.
- Track cursor paths, ticket drags, feature toggles, identities, or session recordings.

---

## 2. Locked Decisions and Authoritative Facts

| Decision | Requirement |
|---|---|
| Hero | Ship “I turn fuzzy product ideas into things people can use.” |
| Hero tracking | Large `-.055em`, medium `-.05em`, small/mobile `-.045em`; revalidate if copy changes |
| Location | Delhi / IST everywhere; never Bengaluru |
| Public email | `garvit.sukh@gmail.com` |
| Public phone | `+91 75088 83655`; canonical tel value `+917508883655`; footer only with light reveal obfuscation |
| Resume | Use the current `~/Downloads/Garvit Sukhija Product.pdf` during Task 5; recheck and replace with the newest file at release-candidate review |
| Student title | `SSMS President` is correct; `SAC President` is prohibited |
| Product brand | `garvit.app` is a placeholder until a domain is purchased; all appearances consume one config module |
| Version | Launch at `v2.4.1`; bump on material content/feature releases with a candid release note |
| Analytics | No transport in v1; visitor-visible journey remains current-tab local |
| Mascot | Sourced CC0 rigged session analyst with same-crop light/dark fallback posters |
| Stay Portal media | Six cleared demo screenshots only; never production data |
| OG tagline | “Garvit Sukhija — Product Manager who builds” remains provisional until Garvit approves it during Task 8A |

`SSMS President` may appear only in supporting biography or a relevant case annotation. It must not become a homepage résumé block. Associated scale/budget claims require resume/source verification before publication.

---

## 3. Information Architecture

### Public routes

| Route | Type | Required purpose |
|---|---|---|
| `/` | Product portfolio | Product chrome, experiment strip, hero, CTAs, flags, mascot, sprint-board portfolio, compact contact/build footer |
| `/work/stay-portal` | Shipped case study | Full shipped-product narrative with privacy-safe artifacts and evidence |
| `/work/maxie` | Product concept | AI-browser 0→1 concept, assumptions, architecture, differentiation, adoption, pricing, prototype |
| `/work/agentic-calendar` | Product concept | Proactive calendar-agent concept, research, product model, approval boundaries, prototype walkthrough |
| `/notes/dynamic-island` | Product note | Product teardown of Dynamic Island and the organizational bet behind it |

### System routes and outputs

- Accessible not-found state; not a portfolio section.
- `sitemap.xml` containing the five public routes only.
- `robots.txt` that indexes production and blocks preview deployments.
- One judged `opengraph-image` output.
- Resume PDF as a static asset.

There is no `/changelog`, `/about`, `/resume`, `/contact`, `/blog`, or dynamic catch-all content route in v1.

### Homepage order

1. Sticky product chrome.
2. Dismissible experiment strip.
3. Spacious hero with copy and exactly two primary CTAs.
4. On-call PM and feature flags in the hero operations rail.
5. Sprint-board portfolio.
6. Compact build/contact footer.

Do not insert résumé chronology, logo rows, testimonials, metric bands, newsletter capture, or a second marketing CTA section into this order.

---

## 4. Site Configuration and Brand Token

All identity strings come from one typed configuration module, proposed at `src/data/site.ts`:

```ts
interface SiteConfig {
  productName: string;
  version: string;
  personName: "Garvit Sukhija";
  role: "Product Manager";
  location: "Delhi / IST";
  hero: "I turn fuzzy product ideas into things people can use";
  email: "garvit.sukh@gmail.com";
  siteOrigin: string | null;
  resumePath: string;
}
```

Initial values:

```ts
productName: "garvit.app"
version: "2.4.1"
siteOrigin: null // preview/local until a production domain is purchased
resumePath: "/Garvit-Sukhija-Product-Resume.pdf"
```

`productLabel` is a derived export—`${productName} v${version}`—rather than a second stored string that can drift.

Requirements:

- Chrome, release popover, footer, title templates, metadata, OG card, toasts that mention the build, and any test fixture import this module.
- Do not hardcode `garvit.app`, `v2.4.1`, or their concatenation outside this module and its tests.
- When Garvit buys a domain, update `productName` if he wants the product brand to match it and set `siteOrigin`; no component edits are allowed.
- Preview deployments use their Vercel origin for functional links but remain `noindex`; they do not silently replace the visible placeholder brand.
- The production canonical origin is a release-time config value, not inferred from arbitrary request headers.

---

## 5. Homepage Requirements

### 5.1 Product chrome

The chrome must display:

- live build dot plus accessible build-state text;
- configured `productLabel`;
- clickable version affordance;
- latest candid release note in the ticker;
- Delhi / IST.

The version affordance opens an anchored release-note popover containing exactly three entries. Each `ReleaseNote` contains an ID, version, ISO date, type, and candid copy.

```ts
interface ReleaseNote {
  id: string;
  version: string;
  date: `${number}-${number}-${number}`;
  type: "fixed" | "shipped" | "known-issue";
  copy: string;
}
```

Rules:

- No “Full changelog” link or route.
- Release dates must correspond to actual recorded project milestones or deployments. Task 5 may not invent dates to make the product look mature.
- The first production release is `v2.4.1`; Task 12 records its actual launch date.
- Ticker stops for hover, focus, hidden document, offscreen state, and reduced motion.
- Popover focus management, Escape behavior, and trigger-origin motion follow `DESIGN.md`.

Initial candid copy set:

1. `fixed: hero said “passionate”. rolled back.`
2. `shipped: portfolio tickets can now escape the backlog.`
3. `known issue: still opens too many product tabs.`

Task 5 attaches verified dates and may tighten grammar, but cannot replace the candor register with marketing copy.

### 5.2 Experiment strip

- Always render authored variant B for a new session.
- Copy: `You’re in variant B of this hero. Variant A converts worse.`
- Do not randomize, assign identities, request consent, or build variant A.
- Dismissal persists in `sessionStorage` for the current tab.
- Dismissal toast: `event logged: banner_dismissed. noted.`
- The toast is fictional product microcopy. It must not invoke the real analytics adapter.
- After dismissal, focus moves to the next logical focusable element.

### 5.3 Hero

Required copy:

- Availability line: `Product manager · available for the right problem` unless Garvit changes his availability before RC.
- Location: `DELHI / IST`.
- Headline: approved hero sentence exactly.
- Intro: `I’m Garvit. I write PRDs on GitHub, deploy prototypes on weekends, and build dashboards before asking engineering.`

Required actions:

1. **Download resume** — direct download of the configured PDF.
2. **Contact Garvit** — `mailto:garvit.sukh@gmail.com`.

The phone number is not a third hero CTA, hero badge, tooltip, or metadata field.

### 5.4 Footer phone treatment

The phone appears only in the footer contact cluster as a light-obfuscation progressive enhancement.

Server/no-JS state:

- Render the reveal control client-side only; no-JS visitors see the email path and no phone UI at all.
- Email remains the always-available contact path.
- Do not show an instruction telling the visitor to enable JavaScript.

Client state:

- On activation, assemble the approved number from separately stored digit chunks and reveal the formatted `+91 75088 83655` as a copyable link.
- Revealed href is exactly `tel:+917508883655`.
- The first activation reveals; the resulting link is one tap away from the dialer.
- Accessible status announces `Phone number revealed` once.
- Persist reveal state in memory only. A refresh restores the lightly obfuscated state.
- Do not include the number in metadata, JSON-LD, OG output, analytics, `data-*` attributes, hidden server text, or CSS generated content.

This is a light scraper deterrent, not a security guarantee. Garvit has explicitly approved the number for public display after reveal.

### 5.5 Footer microcopy

- `No sprint ceremony required` appears **only** in the Reset board toast.
- The footer build note is `Built, reviewed, and carrying one known issue.`
- Board persistence helper text is `State lasts for this tab.`
- Do not reuse a punchline on multiple surfaces.

---

## 6. Feature-Flag System

### Flag definitions

```ts
type FeatureFlagKey =
  | "dark_mode"
  | "confetti_on_scroll"
  | "candid_mode"
  | "comic_sans";

interface FeatureFlagDefinition {
  key: FeatureFlagKey;
  descriptor: string;
  defaultValue: boolean | "system";
  persistence: "local" | "session" | "none";
  disabled: boolean;
  accessibleLabel: string;
}
```

| Flag | Descriptor | Initial state | Persistence | Required effect |
|---|---|---|---|---|
| `dark_mode` | `theme` | OS preference | `localStorage` override | Switch complete semantic theme and native color scheme |
| `confetti_on_scroll` | `ship signal` | On | `sessionStorage` | Emit constrained edge bursts after deliberate scroll distance |
| `candid_mode` | `field notes` | On | `sessionStorage` | Show useful candid notes on tickets |
| `comic_sans` | `prod locked` | Off / disabled | None | Never changes the font; tooltip explains why |

Requirements:

- Panel is expanded on each new page load; disclosure state is memory-only.
- Header reads `3 / 4 live`; “live” means implemented, not currently enabled.
- `candid_mode` must display **FIELD NOTES**, never `CODEX LAB` or another internal tool name.
- Comic Sans tooltip is `disabled in prod for a reason`.
- Toggle semantics use native checkbox behavior and work with keyboard/screen reader.
- Functional state changes occur immediately; mascot response is decorative and secondary.
- Storage reads cannot cause a hydration mismatch or theme flash.

### Confetti constraints

- At most three bursts per tab session.
- At most eight pieces per burst.
- At least 480px of deliberate scrolling between bursts.
- Emit from viewport edges, never across the hero headline or active control.
- Disable under reduced motion, Save-Data, document-hidden state, or runtime performance kill switch regardless of visible flag state.
- Resetting the board does not reset the session confetti cap.

### State precedence

1. Accessibility/performance kill switch.
2. Explicit user flag state.
3. Stored state.
4. OS theme preference for `dark_mode`.
5. Authored default.

The visible control remains understandable when a higher-priority kill switch suppresses animation. Functional content never disappears.

---

## 7. Sprint-Board Portfolio

### Authored work matrix

| ID | Slug | Route | Kind | Authored column | Priority | Points | Accent |
|---|---|---|---|---|---|---|---|
| `GAR-101` | `stay-portal` | `/work/stay-portal` | Shipped product | Shipped | P0 | `21 SP` | Merge lime |
| `GAR-204` | `maxie` | `/work/maxie` | Concept | In progress | P1 | `13 SP` | Context cyan |
| `GAR-207` | `agentic-calendar` | `/work/agentic-calendar` | Concept | In progress | P1 | `8 SP` | Open-question lilac |
| `GAR-309` | `dynamic-island` | `/notes/dynamic-island` | Research | Backlog | R&D | `5 SP` | Incident coral |

Ticket copy is sourced from the approved slice unless Task 5’s content QA finds a factual conflict.

### Data contract

```ts
type WorkSlug =
  | "stay-portal"
  | "maxie"
  | "agentic-calendar"
  | "dynamic-island";

type BoardColumn = "shipped" | "in-progress" | "backlog";
type WorkKind = "shipped" | "concept" | "research";

interface PreviewFact {
  value: string;
  label: string;
  sourceRef: string;
}

interface WorkItem {
  id: `GAR-${number}`;
  slug: WorkSlug;
  route: `/work/${string}` | `/notes/${string}`;
  kind: WorkKind;
  authoredColumn: BoardColumn;
  title: string;
  summary: string;
  priority: "P0" | "P1" | "R&D";
  points: string;
  accent: "merge" | "context" | "question" | "incident";
  candidNote: string;
  previewFacts: readonly PreviewFact[];
}
```

Every preview fact requires a `sourceRef` pointing to the resume, source Markdown, repository evidence, or approved screenshot. Unsourced facts fail content QA.

### Pointer and pen behavior

- Drag begins only from the 44px grip.
- Preserve grab offset and capture the initiating pointer.
- Require 10px hysteresis before classifying the action as a drag.
- Process pointer-up as a final sample even when there were zero/one `pointermove` events.
- Use coalesced events where available and the pointer-down/up time-distance fallback otherwise.
- Ticket tracks 1:1 within bounds and rubber-bands at board edges with constant `.55`.
- Derive velocity from the last 100ms, cap outliers, project using decay `.998`, and cap projection at ±280px.
- Choose the nearest column from the projected ticket center.
- Settle x/y with the critically damped token and rotation with the momentum-only flick token.
- A mid-settle grab starts from the computed presentation transform and inherited velocity.
- No input lockout during settle.

### Click behavior

- Activating the non-grip ticket body opens its preview.
- Grip activation without crossing the threshold must not open the preview accidentally.
- All columns are valid destinations; the visitor is never marked wrong.
- Dropping into Shipped opens the relevant preview after settle and triggers the shipped mascot reaction.

### Keyboard behavior

- Enter on a focused ticket opens the preview.
- `Alt+Left/Right` moves one column immediately.
- Focus travels with the ticket.
- Destination receives the locked 160ms non-spatial acknowledgement.
- One polite announcement names the ticket and new column.
- Keyboard movement into Shipped opens the functional preview without ticket momentum or confetti.

### Touch behavior

- Grip alone uses `touch-action: none`.
- Ticket body preserves native activation and page/board scrolling.
- Board scrolls horizontally by column without page-level horizontal overflow.
- Ignore additional pointers after a drag begins.

### Persistence and reset

- Store only slug-to-column mapping in `sessionStorage` under a versioned key such as `garvit-board:v1`.
- State survives refresh in the same tab and does not cross tabs, devices, or accounts.
- Invalid/missing slugs and schema versions fall back to authored state.
- Reset restores the authored matrix and removes the storage entry.
- Reset toast is the sole use of `Board reset. No sprint ceremony required.`
- Helper copy is `State lasts for this tab.`

### Reduced motion and no-JS

- Reduced motion preserves direct dragging but removes momentum/rotation and crossfades to the resolved column.
- No-JS markup renders each ticket as a direct route link in its authored column.
- No functionality requires a board move before a case can be read.

---

## 8. Case Preview and Long-Form Content

### Preview requirements

Every ticket opens a distinct, accessible preview containing:

- kind and ticket ID;
- title and sourced lede;
- appropriate visual artifact;
- no more than three verified facts;
- situation/bet/decision summary;
- direct `Read full case` route link.

Modal requirements:

- Accessible dialog primitive with focus trap, labelled title, Escape, visible close, inert background, and focus restoration.
- Backdrop click may close only when it begins and ends on the backdrop.
- A direct route link remains in server/no-JS ticket markup.
- Opening a modal must not mutate the browser URL in v1.

### Long-form narrative template

Each route follows:

1. Situation.
2. Product bet.
3. Artifact or system model.
4. Decisions and explicit exclusions.
5. Evidence.
6. What Garvit would change next.

Routes may omit a section only when the source genuinely lacks evidence; they may not invent material to fill the template.

### `/work/stay-portal`

Label: **Shipped product**.

Required story:

- phone-first booking operations for five flexibly rented apartments;
- full-day, half-day, and hourly stays;
- spreadsheet-to-product adoption bridge;
- database-level overlap prevention plus UI warning;
- day view, availability, pending payments, and analytics;
- privacy decision to isolate demo data from production.

Permitted evidence after Task 11 verification:

- 484 historical bookings imported;
- ₹0 monthly infrastructure cost;
- five apartments;
- Google Sheets mirror as a familiar backup/adoption bridge.

Do not publish the raw operator names, real room identifiers, auth/session specifics that increase attack surface, or any production guest information.

Approved screenshots:

1. `analytics-1.png`
2. `analytics-2.png`
3. `availability.png`
4. `booking-overlap.png`
5. `pending.png`
6. `day-view.png`

The first five already live in `content-source/assets/stay-portal/`. During Task 5, Claude copies the verified clean day view from:

`~/Documents/Side-Projects/airbnb-portal/docs/screenshots/day-view.png`

to:

`content-source/assets/stay-portal/day-view.png`

Never copy or reference `~/Documents/carta-option-grant-screenshot-recovered.png`; it is a recovered personal financial document and is outside project scope.

The live demo may be linked as `https://airbnb-portal-demo.vercel.app` after Task 12 confirms it still serves isolated fake data and exposes no credentials.

### `/work/maxie`

Label: **0→1 product concept**, never shipped.

Required story:

- browser designed for active knowledge work rather than another chat sidebar;
- contextual memory and trainable agents;
- assumptions and target users;
- provenance and human control;
- feature architecture, differentiation/MOAT, adoption/GTM, and pricing hypotheses;
- supplied prototype screenshot where it clarifies the system.

Do not publish the source phrase claiming the idea is “patented” unless documentary proof is supplied. Treat it as Garvit’s concept, not protected IP.

### `/work/agentic-calendar`

Label: **Product concept**, never shipped.

Required story:

- an agentic layer over existing tools, not another calendar replacement;
- context ingestion from work systems;
- proactive scheduling and operational actions;
- human approval boundaries and failure handling;
- research, core features, and prototype walkthrough.

Any live prototype link is checked during Task 11/12. If unavailable, the case remains complete without it.

### `/notes/dynamic-island`

Label: **Product note / research**.

Required story:

- what made Dynamic Island delightful;
- why continuity and status feedback mattered;
- comparison only where sourced;
- the organizational willingness to care about the final 10%;
- execution and product-team implications.

Do not imply employment at or inside knowledge of Apple.

### Resume and biography facts

- Task 5 wires the current `~/Downloads/Garvit Sukhija Product.pdf` to the configured static path.
- Task 11 compares every public career claim with the newest PDF available at RC time.
- The site may state a narrower claim than the resume, never a stronger one.
- If a student-leadership title appears, it is `SSMS President`; tests reject `SAC President`.

---

## 9. Procedural On-Call PM

### Functional role

The mascot silently reflects product state. It never provides unique instructions, blocks content, speaks through an event log, or becomes a separate toy.

```ts
type MascotReaction =
  | "idle"
  | "notice"
  | "flag-check"
  | "drag-watch"
  | "shipped";

interface MascotSignal {
  reaction: MascotReaction;
  source: "resume" | "contact" | "release" | FeatureFlagKey | WorkSlug;
  timestamp: number;
}
```

### Reaction mapping

| Event | Reaction | Maximum active time |
|---|---|---:|
| Fine-pointer hover over resume/contact/version | `notice` | 900ms |
| Live flag change | `flag-check` | 1000ms |
| Pointer ticket drag | `drag-watch` | Until release/cancel |
| Pointer drop into Shipped | `shipped` | 1400ms |
| No action | `idle` | Continuous look state, no body float |

Priority: shipped → flag-check → notice → idle. Drag-watch owns the figure during the active drag, then yields to the release result. Lower-priority events do not interrupt higher-priority reactions.

### Rendering

- Procedural R3F groups/primitives only; no GLB, textures, environment map, or post-processing.
- Use the approved mesh/material/light limits from `DESIGN.md`.
- Immediate SVG poster uses the same crop, silhouette, and palette.
- Lazy WebGL begins after first paint when visible/idle, with a 1.5-second maximum delay.
- Crossfade only after the first successful WebGL frame.
- DPR cap `1.5`; pause offscreen and document-hidden.
- Use static poster under reduced motion, Save-Data, low-memory detection, renderer failure, or runtime kill switch.
- Mascot scene module ≤25KB gzip excluding shared R3F/Three vendor chunk.
- Lazy R3F/Three vendor chunk ≤230KB gzip; poster ≤35KB.

Keyboard outcomes are fully communicated through focus/dialog/live-region behavior. A keyboard action does not require an animated mascot response.

---

## 10. OG and Metadata

### Judged OG output

Task 8A is Codex-owned taste work. The image must follow `DESIGN.md` §5.12 and consume `SiteConfig` for product name/version.

- 1200×630 deterministic output.
- Must remain recognizable at 600×315 and legible at 300×158.
- No runtime external requests.
- No phone number, private data, unverified metric, mascot, or provisional domain hardcode.
- Use real work labels from `WorkItem`.

Before Task 8A implementation, Garvit must answer yes/no on:

`Garvit Sukhija — Product Manager who builds.`

If approval is unavailable when the task begins, use the factual fallback `Garvit Sukhija — Product Manager` for the reviewed preview. Do not block the rest of the build or silently ship the provisional phrase.

### Metadata

Default production metadata:

- Title: `Garvit Sukhija — Product Manager`.
- Description: approved hero sentence plus `Product work, concepts, and teardowns from Delhi.`
- Canonical origin: `SiteConfig.siteOrigin` once purchased/configured.
- Route titles append the configured product name through one title template.

Preview deployments:

- `noindex, nofollow`.
- Use the preview URL for internal absolute-link correctness.
- Never publish a preview as canonical.

No phone number is included in metadata or structured data. JSON-LD is out of scope for v1 unless Claude identifies a concrete search requirement and receives a PRD amendment.

---

## 11. State, Storage, and Client Boundaries

Use server components by default and focused client islands for flags, board, overlays, phone reveal, confetti, and mascot.

### Storage matrix

| State | Storage | Lifetime |
|---|---|---|
| Theme override | `localStorage` | Browser until cleared |
| Confetti flag | `sessionStorage` | Current tab |
| Candid flag | `sessionStorage` | Current tab |
| Experiment dismissal | `sessionStorage` | Current tab |
| Board columns | `sessionStorage` | Current tab |
| Flags-panel disclosure | Memory | Current render |
| Phone reveal | Memory | Current render |
| Active drag / mascot queue | Memory | Current interaction |

Requirements:

- Storage keys are versioned and namespaced.
- Invalid data falls back safely to authored defaults.
- No cookies, account state, server persistence, cross-tab synchronization, or URL encoding of toy state.
- Theme bootstrapping cannot create a flash or hydration warning.
- Board/flag state is never included in analytics.

---

## 12. Analytics, Privacy, and Security

### Analytics

Launch with no analytics transport. The visitor-visible session funnel is
computed from a `garvit-journey:v1` event array in `sessionStorage`; nothing in
that stream is sent to Garvit, Vercel Analytics, PostHog, or another party.

Define but do not enable:

```ts
type PublicAnalyticsEvent =
  | "resume_download"
  | "contact_click"
  | "case_open"
  | "full_case_read";

interface AnalyticsAdapter {
  track(event: PublicAnalyticsEvent): void;
}
```

The v1 adapter is a no-op. No properties, identity, URL query persistence, cursor coordinates, ticket paths, flag state, phone reveal, mascot state, replay, heatmap, or fake `banner_dismissed` event may be sent.

The local event stream may contain only the coarse authored stages and action
kinds required to render `Landed → Scrolled → Played → Read work → Converted`.
It is capped, schema-validated, current-tab only, and candidly disclosed on the
page as `computed in your browser. I never see it.`

### Public contact privacy

- Email is intentionally public.
- Phone is intentionally public only after client-side reveal.
- Light obfuscation deters trivial HTML scrapers but is not represented as strong protection.
- Do not surface the phone in source data sent to metadata/OG functions.

### Case-study privacy

- Only the six PII-cleared Stay Portal screenshots may ship.
- Run OCR/manual inspection on final optimized images, not only source files.
- Reject real names, mobile numbers, emails, addresses, booking references, access details, financial documents, or production database content.
- Synthetic demo numbers/guests are allowed only in the cleared assets.
- Do not expose live demo credentials.

### Application stance

- No CMS, database, authentication, form handling, user-generated content, remote content fetching, or production secrets.
- Disable unused camera, microphone, and geolocation permissions.
- Apply conservative referrer and content-type headers during Claude’s deployment task.

---

## 13. Accessibility and Fallback Matrix

WCAG 2.2 AA is the production target.

| Surface | Pointer/touch | Keyboard | Screen reader | Reduced motion | No JS / failure |
|---|---|---|---|---|---|
| Version notes | Anchored trigger | Enter/Space, Escape, focus return | Labelled popover and versions | Opacity only | Latest release remains visible in chrome |
| Banner | 44px dismiss | Activate and advance focus | Dismiss label and toast announcement | Fade then immediate layout | Banner remains readable |
| CTAs | Direct link | Native activation | Explicit resume/contact labels | Press motion removed | Fully functional links |
| Phone | Reveal button then tel link | Native button/link | One reveal announcement | No spatial motion | Email remains available; phone omitted |
| Flags | Native-labelled switches | Space toggles | Name, state, disabled reason | Functional state without effects | Default rendered product remains usable |
| Tickets | Grip drag / body open | Enter opens; Alt+arrows move | Instructions and one polite move announcement | Direct drag + crossfade landing | Direct case links in authored columns |
| Preview | Backdrop/close | Trap, Escape, focus return | Labelled dialog | Opacity crossfade | Direct full-case route |
| Mascot | Cursor/action reaction | No required reaction | Decorative/hidden | Static poster | Static poster |
| Case routes | Native scroll/links | Native document navigation | Semantic headings/tables/figures | Calm/static | Full server-rendered content |

Global requirements:

- Minimum 44×44px primary targets.
- Visible `focus-visible` state in both themes and forced colors.
- Text zoom to 200% without clipped controls or inaccessible content.
- One polite live region for deliberate state changes; cursor and mascot never chatter.
- Color never carries unique meaning.
- Hover effects run only for fine-pointer devices and have focus equivalents.
- Reduced transparency produces solid chrome/overlays.
- Increased contrast strengthens surfaces and rules.

---

## 14. Performance and Loading

### Budgets

| Budget | Limit |
|---|---:|
| Initial homepage JS excluding lazy R3F | ≤170KB gzip |
| Lazy R3F/Three vendor chunk | ≤230KB gzip |
| Procedural mascot scene module | ≤25KB gzip |
| Mascot poster | ≤35KB |
| LCP | ≤2.5s on agreed mobile profile |
| CLS | ≤0.05 |
| INP | ≤200ms |

### Requirements

- Next.js App Router with strict TypeScript.
- Server components except explicitly interactive islands.
- CSS Modules and approved custom properties; no Tailwind.
- Local MDX and typed metadata; no runtime CMS/network content.
- Self-hosted subset Archivo and IBM Plex Mono WOFF2 via `next/font/local`.
- Include OFL notices and rupee/final-copy glyphs.
- R3F is dynamically imported and never blocks hero text, CTAs, board markup, or poster.
- Pause ticker, mascot, and confetti when hidden/offscreen.
- Animate transform/opacity on per-frame paths.
- No remote fonts, CDN libraries, source Unsplash images, or model assets.

---

## 15. Revised Ownership and Handoffs

The terra lane is dissolved. Claude owns mechanical work through its subagent lane; Codex spends its remaining budget on the PRD and taste-critical surfaces.

| Task | Owner | Required gate |
|---|---|---|
| 1. `DESIGN.md` | Codex | Approved and locked by Claude — complete |
| 2. Production PRD | Codex | Claude reviews scope, behavior, facts, and ownership |
| 3. Repository foundation | Claude | Claude reviews scaffold/config/build in its lane |
| 4. Tokens and structural shell | Claude | Claude reviews implementation; Codex reviews only token transcription plus 1440×900 and 390×844 screenshots |
| 5. Content and route port | Claude | Claude/Haiku source-fidelity and PII gate |
| 6. Feature flags | Codex | Claude judges product effect, a11y, persistence, and restraint |
| 7. Sprint-board physics | Codex | Claude judges low-sample, mid-settle, real-device feel, and parity |
| 8. Procedural mascot | Codex | Claude judges personality, loading, fallbacks, and restraint |
| 8A. OG/social card | Codex | Garvit resolves tagline; Claude judges all three output sizes |
| 9. Mechanical QA/deploy wiring | Claude | Claude owns config/tests/plumbing review |
| 10. Integration and craft | Codex | Claude judges final preview |
| 11. Content QA | Claude | Source, resume, title, demo-media, claims, link, and PII pass |
| 12. Release | Claude | Claude deploys; Codex signs off final visual output only |

### Module ownership

Proposed boundaries:

- Claude Tasks 3–5: application scaffold, route shells, approved token transcription, structural components, content data/MDX, metadata plumbing, static assets.
- Codex Task 6: `src/features/flags/**` and flag-effect integration contract.
- Codex Task 7: `src/features/board/**` and board-to-preview/mascot signals.
- Codex Task 8: `src/features/mascot/**` and poster.
- Codex Task 8A: `app/opengraph-image.tsx` plus its visual tests.
- Claude Task 9: CI, E2E/a11y/performance harnesses, deployment configuration.

Claude may choose equivalent scaffold paths during Task 3, but must record them before parallel work begins. Once recorded, ownership paths are frozen. No two workers edit the same module concurrently.

### Review-lattice constraints

- Claude self-polices config and plumbing; Codex does not spend review budget there.
- Codex’s Task 4 gate is limited to token diff and two shell screenshots.
- Claude judges all Codex taste work.
- Codex’s Task 12 gate is final visual fidelity only.
- Any subagent consumes the locked `DESIGN.md` and this PRD and may not invent missing behavior.

---

## 16. Verification Plan

### Contract and content tests

- `SiteConfig.productLabel` is the only product-label source; test rejects stray hardcoded `garvit.app`/`v2.4.1` in UI modules.
- Exactly five public routes exist and sitemap contains all five.
- No `/changelog` route or Full changelog affordance exists.
- Every `WorkItem` slug/route is unique and resolves.
- Every preview fact has a non-empty `sourceRef`.
- `SSMS President` is allowed; `SAC President` fails the content scan.
- Approved hero copy matches exactly.
- `No sprint ceremony required` appears only in the reset toast.
- Server HTML and OG/metadata do not contain `7508883655` or `+917508883655`.
- Phone reveal produces formatted text and exact `tel:+917508883655` href.
- Resume asset exists at configured path.
- Stay Portal contains the six approved screenshots and excludes the recovered financial image.

### Feature-flag tests

- OS theme initial state and local override precedence.
- Session persistence for confetti/candid; Comic Sans remains disabled.
- Flag panel opens authored-expanded after refresh.
- Confetti caps at three × eight pieces and 480px spacing.
- Reduced-motion/Save-Data kill switches override effects.
- No flag interaction calls analytics.

### Board tests

- Authored matrix and reset.
- Same-tab persistence plus invalid-schema fallback.
- Pointer sequence with zero, one, and many move samples.
- Pointer-up as final sample and coalesced-event path.
- Grab offset, pointer capture, second-pointer rejection, cancellation.
- Rubber-band response and projection cap.
- Release velocity handoff.
- Mid-settle re-grab from `DOMMatrix` presentation state.
- Keyboard immediate move, retained focus, destination acknowledgement, and live announcement.
- Pointer and keyboard Shipped outcomes.
- Direct no-JS route links.

### Mascot tests

- Poster renders before WebGL.
- WebGL crossfades only after first frame.
- Signal priority and interruption rules.
- DPR cap, offscreen/document-hidden pause.
- Reduced-motion, Save-Data, low-memory, renderer-error, and manual-kill fallbacks.
- No GLB/texture/model request before the mascot capability and lazy-load
  boundary admits the live scene; fallback sessions remain poster-only.
- Scene and vendor budgets.

### Accessibility and browser tests

- Automated axe scan on every route in light/dark.
- Chromium, WebKit, and Firefox E2E.
- JavaScript-disabled route suite.
- Keyboard-only homepage, board, popover, flags, phone reveal, dialog, and case-route journeys.
- Screen-reader check for deliberate announcements and absence of mascot/cursor chatter.
- Forced-colors, reduced-motion, reduced-transparency, increased-contrast, and 200% text checks.
- Physical touch test for board-scroll/grip conflict.

### Visual tests

- Homepage: 1440×900, 1280×832, 768×1024, 390×844.
- Light, dark, reduced motion, poster fallback, flags open/closed, ticket lift/drop, dialog.
- Hero tracking values match locked size regions.
- OG: 1200×630, 600×315, 300×158.
- Compare Task 4 shell against approved slice direction and `DESIGN.md`, not a generic component baseline.

### Performance and release tests

- Clean install, typecheck, lint, unit, integration, E2E, and production build.
- Route JS, font, image, poster, mascot-module, and lazy-vendor budgets.
- Lighthouse/mobile metrics meet §14.
- No hydration warning, layout break, console error, broken route, or external asset request.
- Vercel preview remains `noindex`.
- Production canonical, HTTPS, resume, mailto, phone reveal, demo link, sitemap, OG, not-found, analytics mode, and rollback verified.

---

## 17. Release Acceptance

The release candidate passes only when:

1. A static top screenshot reads as a live product and shows both primary CTAs.
2. A first-time visitor reaches real work without moving a ticket or understanding the joke.
3. Product controls deliver instant payoff and never score the visitor.
4. The density gradient keeps chrome rich while hero, board, and cases breathe.
5. Every case is honestly labelled shipped, concept, or research.
6. Hero copy and tracking match the approved/validated values.
7. Feature flags visibly change the product and obey kill switches.
8. Ticket drag passes low-sample and mid-settle tests on real browsers/touch hardware.
9. The sourced CC0 session-analyst mascot visibly reacts to the same local journey stream without blocking first paint or fallback access.
10. The OG card passes Claude’s judged off-site founder-screenshot test.
11. Email and the lightly obfuscated phone path work; the hero still has only two CTAs.
12. No real guest PII, recovered financial media, forbidden title, stronger-than-resume claim, surveillance behavior, or banned AI-template signature ships.
13. Keyboard, reduced-motion, forced-colors, WebGL failure, and no-JS visitors can access the same work and actions.
14. Claude’s Task 11 content report and Task 12 release checks pass.
15. Codex signs off the final deployed visuals; Claude signs off the complete release.

---

## 18. Remaining Release-Time Decisions

These do not block Tasks 3–8 but have explicit fallbacks:

| Decision | Owner / deadline | Default if unresolved |
|---|---|---|
| Final domain/product brand | Garvit before Task 12 | Keep visible `garvit.app` placeholder and use the stable production `vercel.app` URL as `siteOrigin`; attach/swap the purchased domain later without delaying launch |
| OG tagline approval | Garvit during Task 8A | Use `Garvit Sukhija — Product Manager` |
| Updated resume PDF | Garvit before Task 11 closes | Use current Downloads PDF and ensure site claims remain no stronger |
| Availability line still accurate | Garvit before RC | Remove `available for the right problem` rather than publish stale availability |

All other product decisions in this PRD are ready for implementation after Claude’s approval.
