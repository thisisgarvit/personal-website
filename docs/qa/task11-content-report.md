# Task 11 — Content QA Report (read-and-report)

**Date:** 2026-08-15 · **Lane:** Claude content-QA · **Scope:** PRD §§2, 5.1, 8, 12, 16, 17; DESIGN.md §10–11; open-questions-answers.md; all four case routes; `src/data/*`; shipped media; resume ceiling.
**Resume checked:** `~/Downloads/Garvit Sukhija Product.pdf` (md5 `4ac2decd…`, byte-identical to shipped `public/Garvit-Sukhija-Product-Resume.pdf`). Re-run the ceiling check if Garvit swaps the PDF before RC (PRD §18).

Nothing was fixed or committed by this pass. Verdicts: **7 PASS · 0 FAIL · 3 NEEDS-GARVIT**.

---

## 1. Verdict table

| # | Item | Verdict | Evidence (summary) |
|---|------|---------|--------------------|
| 1 | Source fidelity (4 routes + work.ts) | **PASS** | 10+ claims per route sampled; every claim traces to its source file (details §2). No invented or exaggerated facts found. Maxie deliberately drops the source's "patented" phrasing and the unverifiable "67% of professionals" statistic — both correct weakenings. |
| 2 | Resume ceiling | **PASS** | Site role is `Product Manager` (`src/data/site.ts:14`) vs resume's stronger "Technical Product Manager" — narrower, allowed. Hero intro (`src/components/hero/Hero.tsx:25-27`) mirrors the resume summary line almost verbatim, no stronger. No SSMS/SAC, TestMu, Pixxel, BITS, budget, or ARR claim appears anywhere in shipped copy (grep clean; only test fixtures in `src/data/content.test.ts`). Note: site says `DELHI / IST`, resume says Noida — Delhi/IST is a PRD §2 locked decision approved by Garvit; not a stronger claim. |
| 3 | PII sweep on shipped media | **NEEDS-GARVIT** | All 7 shipped images visually inspected (§3). Guests, mobiles, booking refs are demonstrably synthetic. Two residual items need Garvit's explicit re-confirmation: (a) referral names **Ishika / Harsh / Kshitij / Yash** — *Ishika and Harsh are the two real operator names* in `airbnb-portal-case-study-raw.md:7`; (b) the **real room identifiers 4202/3707/3611/2206/2128** (`airbnb-portal-case-study-raw.md:5`) are visible in five screenshots while PRD §8 says "Do not publish … real room identifiers." |
| 4 | Honest labels | **PASS** | `Shipped product` (stay-portal/page.tsx:16), `0→1 product concept` + "it was never built" (maxie/page.tsx:16, content.mdx:13), `Product concept` (agentic-calendar/page.tsx:16), `Product note / research` (dynamic-island/page.tsx:16). Board kind chips PRODUCT/CONCEPT/RESEARCH (`src/data/work.ts:186-195`). Dynamic-island opens with "I don't work at Apple; this is a close-use read from the outside, not inside knowledge" (content.mdx:8-9). No "patented" anywhere in `src` (grep clean). Minor note: calendar route says "A concept for…" but never states "never built" as explicitly as Maxie — acceptable, flagged as polish only. |
| 5 | Voice register (DESIGN.md §10) | **PASS** (one sub-item in NEEDS-GARVIT) | No "passionate/innovative/results-driven/crafting experiences" in shipped copy — the only "passionate" hit is inside the approved release-note joke itself (`src/data/releases.ts:53`). One dry line per surface holds (ticker line, banner line, one candid note per ticket, one footer note). Candid notes disclose real trade-offs. `candid_mode` descriptor is `field notes`, never "CODEX LAB" (`src/components/ops/FlagsPanel.tsx:57`). All codex/claude/terra/sol hits in components are code comments (not rendered) — **except** "generated with Claude" in agentic-calendar body copy, see NG-3. |
| 6 | Links | **PASS** | All three external links return 200 (curl -L, 2026-08-15): `https://airbnb-portal-demo.vercel.app` → 200 (lands on `/welcome`, read-only synthetic demo, no credentials shown); Maxie prototype `https://claude.ai/public/artifacts/8dab7fe9-…` → 200; calendar prototype `https://html-starter-sandy-sigma.vercel.app/` → 200 (live, so no "case stands without it" flag needed). Internal: all 4 ticket routes exist and match `work.ts` routes; `Read full case` href = `item.route` (`InteractiveBoardSection.tsx:625`); resume asset exists at configured path `public/Garvit-Sukhija-Product-Resume.pdf`; not-found links home. Sitemap = exactly the 5 public routes; `/dev/preview` is `notFound()`-guarded in production (`src/app/dev/preview/page.tsx:13`) and absent from sitemap. |
| 7 | Release notes | **PASS** | `src/data/releases.ts:47-69`: three entries, candid register intact, no "Full changelog". Dates map to real recorded milestones and the mapping is documented in-file (lines 14-30): 2026-08-15 = DESIGN/PRD locked + Task 3 scaffold; 2026-07-17 = approved slice + concept choice (file dates + CONCEPT-SPEC); 2026-07-14 = Stay Portal's 21 commits (`airbnb-portal-case-study-raw.md:26`). The file also corrects Task 4's unsupported 07-16 date. Task 12 still owes the real v2.4.1 launch date. |
| 8 | Privacy invariants | **PASS** | No phone digit group appears in any server-rendered content/data/metadata file: the number exists only as split chunks `"750","88","836","55"` in the client-only `PhoneReveal.tsx:27` (greps for `7508883655`, `75088`, `83655`, `8836` across `src`+`public` return nothing else); assembled tel href is exactly `tel:+917508883655`. Email only in hero CTA, footer, and `site.ts` — intended. "Bengaluru": zero shipped hits (only a test comment). Carta filename: absent (the test deliberately builds the string via `join` so the name never appears — `content.test.ts:31`). Demo credentials: none in copy or on the demo welcome page. Note (intended, not a violation): the downloadable resume PDF itself contains the raw phone — that is the resume's own content, approved. |
| 9 | "10% where delight lives" preview fact | **NEEDS-GARVIT** | See NG-2 — exact wording quoted there. Confirms Task 5's flag: the fact's own `sourceRef` points at **PRD.md §8**, not at the source essay; the essay never states a 10% figure. |
| 10 | Metadata | **PASS** | `layout.tsx:34-38`: default title `Garvit Sukhija — Product Manager`, template `%s · garvit.app` (via SiteConfig), description = approved hero sentence + `Product work, concepts, and teardowns from Delhi.` — exact PRD §10 strings. Hero sentence in `site.ts:16/28` matches PRD §2 character-for-character. Route titles/descriptions come from `WorkItem` title/summary (sourced). No phone anywhere in metadata, no JSON-LD. OG card (`opengraph-image.tsx:43`) uses the **factual fallback** `Garvit Sukhija — Product Manager` — correct per PRD §10 while the "who builds" tagline is unapproved; no phone/unverified metric/mascot/domain hardcode; consumes SiteConfig + real WorkItem labels. |

---

## 2. Source-fidelity samples (evidence for item 1)

### /work/stay-portal (`content.mdx`) vs `airbnb-portal-case-study-raw.md`
| Claim (mdx line) | Source |
|---|---|
| Five apartments; full-day/half-day/hourly; run from a phone (14-16) | raw:5 |
| Google Sheets workbook, one tab per room, edited by hand (20-21) | raw:7,16 |
| Channels: Airbnb, offline walk-ins, referrals (22) | raw:5 |
| Failure modes: double-bookings, no today view, untracked pending payments, zero analytics (26-29) | raw:7 |
| Non-technical operators working from phones (28-29) | raw:9 |
| Installable web app, phone-first (35) | raw:9 |
| Nightly one-way Sheets mirror = familiar view + free daily backup (101-105, 121-122) | raw:16 |
| DB exclusion constraint on room+time; live form warning; API rejects with conflict attached (96-99) | raw:13 |
| Two operator accounts / two people (106-107) | raw:7,27 |
| Browser never talks to the DB directly (108-109) | raw:21 |
| 484 bookings imported across five apartments (117) | raw:24 |
| ₹0/month infrastructure (120) | raw:25 |
| Demo isolated from production because production holds real guest PII (110-113) | raw:36 |
| Pending screen: ₹8,950 across 7 bookings (alt text, 72) | matches `pending.png` exactly |

Note: the route omits template section 6 ("What I'd change next"); the raw source genuinely contains no such material, which PRD §8 permits.

### /work/maxie (`content.mdx`) vs `content-source/ai-browser-maxie.md`
20+ tabs (22↔15); Comet/Dia as chat-sidebar critique (18-19↔13); "agents will replace browser extensions" (39↔73); users/JTBD (44-47↔35-36); competitor list identical (50-51↔42); MVP within 6 months (53↔52); three systems (57↔60); NotebookLM-style + browsing tree forecast branches (60-64↔66-68); training inputs list (66-67↔75); marketplace one-time/subscription + org sharing (68-70↔76); frontend-dev example (69-71↔77); memory agent + provenance (74-75, 93↔84); agent linking summarizer→mail (75-76↔87); policy/safety engine, action logs, encrypted-to-account training (94-98↔85, 91-92); moat compounding (102-105↔101); differentiation table cell-for-cell (107-162↔103-111); adoption (166-175↔117-131); 20-30% commission, $0/$25/$115 plan matrix (179-239↔141-155). **Correct weakenings:** "patented to Garvit" (source:7) not reproduced — replaced by "Garvit's concept… it was never built" framing; "research says 67% of professionals" (source:15) shipped without the unverifiable 67%.

### /work/agentic-calendar (`content.mdx`) vs `content-source/agentic-calendar.md`
Brief (10-12↔7-8); layer-not-app + "second, colder reason" data-collection rationale (22-29↔12-14); 9 current players identical (16-18↔20); Reddit/blogs (18↔19); five integrations incl. Granola, Uber/MakeMyTrip cab-before-flight (37-47↔30-34); creative/operational/restorative timespace (51-54↔46-49); "30 minutes over… two hours after" negotiation example (56-58↔56); sick-leave proxy/decline (59-60↔58); "talk to your agent, not your assistant" (60-61↔59); approval boundaries / Actions tab (72-77↔90); five tabs + chat/mic (82-84↔82); git-style diff suggestions (90-92↔94); tasks from Gmail/Jira/Slack/Notion (93-95↔98); analytics purpose (96-97↔102). "Wireframes generated with Claude" (81-82) ↔ source:76-78 — see NG-3.

### /notes/dynamic-island (`content.mdx`) vs `content-source/one-delightful-product-experience.md`
Shortlist Arc/Dia last-tab at 40+ tabs, CRED skins, Linear-Slack (13-18↔11-13); Swiggy/CRED FaceID/music expand (22-26↔21-23); S25 Now Bar as only direct alternative + Android third-party apps (30-31↔29); Spotify-in-notification-bar precedent, cohesion/feel gap (31-35↔31); "living part of the hardware," tasteful motion (36-38↔33); continuity philosophy, more-than-notification less-than-multitasking, third-party extensibility (42-45↔39); sacrificed screen area while competitors sold immersion (49-52↔41); "never a feature until Apple made them one," unnamed-problem anxiety, premium/brand affection (56-61↔47-49); scope-decay risk and Apple limiting third-party use (65-67↔55); "months of engineering," "making a notch look pretty," leadership + animation-obsessed culture (69-74↔57). Added disclaimer (8-9) and "The bet, read from outside" heading satisfy the no-Apple-insider rule.

### `src/data/work.ts` preview facts
All 12 facts carry non-empty `sourceRef`s and 11 of 12 verify against their cited source (5 rooms, 484, ₹0, 20+ tabs, 3 systems, 6 mo, 5 surfaces, 4 capabilities, 1 agentic layer, 1 hardware constraint, 0 new core functions). The 12th is NG-2.

---

## 3. Shipped-media inspection detail (item 3)

Checksums: all six `src/app/work/stay-portal/*.png` are byte-identical (md5) to the PII-verified set in `content-source/assets/stay-portal/`; `maxie-prototype.png` is identical to `content-source/assets/ai-browser-maxie/image.png`. No other raster ships (`public/` holds only the resume PDF).

| Image | Contents seen | Verdict |
|---|---|---|
| `day-view.png` | Guests Myra Pillai, Aarav Mehta, Zoya Mirza, Riya Deshmukh, Manav Joshi; refs HM0000002K/M/Q (sequential synthetic); rooms **4202, 3707**; referral source "**Kshitij**" | Synthetic guests ✓; NOT the recovered financial document ✓; room IDs + Kshitij → NG-1 |
| `analytics-1.png` | Aggregate ₹ figures, 6.9% occupancy, daily income chart — no names/numbers | Clean ✓ |
| `analytics-2.png` | Rooms **4202/3707/3611/2206/2128**; repeat guests Aarav Mehta, Ira Banerjee, Diya Verma, Kabir Singh with sequential fake mobiles 9100000100 01–04; referral leaderboard **Ishika, Yash, Harsh, Kshitij** | Guests/mobiles synthetic ✓; leaderboard names + room IDs → NG-1 |
| `availability.png` | Room 2128 free, 4202 busy; demo guests Aarav Mehta, Zoya Mirza | Synthetic ✓; room IDs → NG-1 |
| `booking-overlap.png` | Overlap warning for 4202 / Myra Pillai; channels incl. Booking.com | Synthetic ✓; room ID → NG-1 |
| `pending.png` | ₹8,950 / 7 bookings; Diya Verma, Zoya Mirza, Riya Deshmukh; rooms 2206/4202/3707 | Synthetic ✓; room IDs → NG-1 |
| `maxie-prototype.png` | Mock browser UI, generic project cards, illustrated avatars | Clean ✓ |

No real emails, addresses, credentials, financial documents, or production DB content in any shipped image. The carta screenshot is not present anywhere in the repo (filename grep clean; `day-view.png` verified to be the restored demo day view).

---

## 4. NEEDS-GARVIT list (with recommended defaults)

**NG-1 — Referral names + real room identifiers in the cleared screenshots.**
- Evidence: `airbnb-portal-case-study-raw.md:7` names the two real operators "Harsh" and "Ishika"; `analytics-2.png` referral leaderboard shows **Ishika / Yash / Harsh / Kshitij**, and `day-view.png` shows "Kshitij" as a referral source. In the real operation, referral credit plausibly attaches to real people — these read as real-person first names, not synthetic guests. Separately, five screenshots show the real room numbers **4202/3707/3611/2206/2128** (`airbnb-portal-case-study-raw.md:5`), and PRD §8 says "Do not publish the raw operator names, real room identifiers…". The demo's own welcome page also says "Demo key 4202".
- Garvit did PII-clear this set (open-questions-answers.md §6), so this is a re-confirmation, not a discovery of a broken gate.
- **Recommended default:** (a) Names — reshoot `analytics-2.png` (and `day-view.png`) from the demo with neutral referrer names, OR give explicit written OK that first-name referrers are acceptable public exposure; first names of the operators + a business relation is the kind of thing that looks fine today and awkward in a screenshot that outlives the site. Reshoot is ~10 minutes against the live demo. (b) Room IDs — cheaper to amend PRD §8 to "real room identifiers are acceptable in demo screenshots (they identify units, not people)" than to reshoot five images; the numbers alone don't locate a building. PM default: reshoot analytics-2 for the names, amend the PRD for the room IDs.

**NG-2 — The "10%" preview fact is authored framing, not source fact.**
- Exact current wording, `src/data/work.ts:174-180`:
  `value: "10%"`, `label: "where delight lives"`, `sourceRef: "PRD.md §8 /notes/dynamic-island required story (the final 10%); slice-product.html cases.island"` — and the related candid note at `work.ts:160-161`: `"The real dependency was leadership willing to care about the last 10%."`
- The source essay (`one-delightful-product-experience.md`) never states a 10% figure; the number originates in PRD §8's own phrasing "the organizational willingness to care about the final 10%." The route MDX itself never says 10% — only the board surfaces do. The fact technically satisfies "non-empty sourceRef," but the ref is to the PRD, i.e., to ourselves.
- **Recommended default:** keep it, reclassified as editorial framing rather than evidence — it's a thesis label, not a metric, and it's honest as one. If Garvit prefers strictly essay-sourced facts, swap to `value: "0"`, `label: "direct alternatives until S25's Now Bar"` (sourced to the essay's "There was no direct alternative to this until Samsung S25's Now Bar"). Whatever he picks, update the `sourceRef` to say "editorial framing, PRD §8" explicitly so future QA doesn't re-flag it.

**NG-3 — "Claude" appears in user-facing case copy.**
- `src/app/work/agentic-calendar/content.mdx:81-82`: "The [mockups](…) — wireframes **generated with Claude**, deployed on Vercel…" and `src/app/work/maxie/content.mdx:86` links to a `claude.ai/public/artifacts/…` URL. The Task 11 brief bans codex/claude/terra/sol in user-facing strings; DESIGN.md §10 bans *internal* agent/tool names.
- These are references to Claude the public Anthropic product (and the source doc itself says "mockups generated by Claude"), not to the internal build lane — and the disclosure is candid in a way that suits the site's register. The claude.ai prototype URL is simply where the artifact lives.
- **Recommended default:** keep both. The rule's intent is not leaking build-pipeline internals ("CODEX LAB"), which holds everywhere. If Garvit wants zero tool names anyway, minimal edit: "AI-generated wireframes, deployed on Vercel" — the prototype URL should stay as-is either way (it's the real link).

**Standing reminders (already tracked in PRD §18, restated for RC):**
- Availability line "available for the right problem" needs Garvit's re-confirmation before RC, else remove.
- OG tagline "who builds" still awaits yes/no; the shipped OG correctly uses the factual fallback meanwhile.
- Re-run the resume-ceiling check if the PDF is replaced (~2026-08-16 was mentioned); today's shipped PDF equals the Downloads PDF byte-for-byte.
- Task 12 must record the real v2.4.1 launch date in `releases.ts`.

---

## 5. FIX list

No FAIL items. Nothing requires a code fix from this pass. Conditional edits, pending Garvit's NG decisions:

| Location | Conditional change |
|---|---|
| `src/app/work/stay-portal/analytics-2.png` (+ `content-source/assets/stay-portal/analytics-2.png`, possibly `day-view.png`) | If NG-1(a) = reshoot: replace with demo screenshots using neutral referrer names; keep alt/caption text valid (captions don't name people, so no MDX edit needed) |
| `PRD.md §8` | If NG-1(b) = amend: relax "real room identifiers" for demo screenshots |
| `src/data/work.ts:174-180` (and `:160-161`) | Per NG-2: keep + annotate sourceRef as editorial framing, or swap to the essay-sourced "0 direct alternatives" fact |
| `src/app/work/agentic-calendar/content.mdx:82` | Only if NG-3 = strip: "wireframes generated with Claude" → "AI-generated wireframes" |
