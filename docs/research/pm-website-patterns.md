# PM Website Patterns — Research Report

**For:** garvit.app — concept: "the site is a product he's visibly PM-ing"
**Date:** August 2026
**Method:** Web research across PM portfolio roundups (SiteBuilderReport, CareerFoundry, Underdog, Aakash Gupta, HelloPM), direct fetches of individual portfolios, and research into session-visualization / self-referential-analytics mechanics (clickclickclick.click, webkay, PartyKit cursor-party, Plausible public dashboards, Receiptify, funnel-chart UX literature).

---

## TRACK 1 — Existing PM portfolio landscape

### 1.1 The examples (what's actually out there)

| # | Site | Person | Memorable device (or why forgettable) | Case-study approach | "Invisible work" handling |
|---|------|--------|----------------------------------------|---------------------|---------------------------|
| 1 | pshimanshu.netlify.app | Himanshu Sharma | **Site is structured as a PRD** — solution-space sections, career timeline as version history, drag-to-compare before/after sliders. The closest existing site to the garvit.app concept. | Case study = PRD with problem/solution framing | Shows *thinking process* as the artifact itself — "how I think" over polished outputs |
| 2 | elezea.com | Rian van der Merwe | Text-first, long-form writing platform doubling as portfolio; mixed media (GIFs, IA charts). Memorable via voice, not mechanics. | Blog-post-style narratives with artifacts embedded | Writing volume = proof of thinking |
| 3 | sriponnada.com | Sri Ponnada | "Corporate entity (PM) by day, stand-up comedian by night" — self-aware humor, work split into "actual" and "other." Memorable via personality. | Light; personality-led | Humor as differentiation, not evidence |
| 4 | samuelfaith.com | Samuel Faith | Quirky indie-builder charm, subtle animations. Middle of the pack. | Conventional | Not addressed |
| 5 | samdickie.me | Sam Dickie | Maker vibe: shipped side products, AI-experiment site, downloadable Notion kits. Evidence-by-artifact. | Projects + templates instead of case studies | Ships things → work becomes visible |
| 6 | kanesherwell.com | Kane Sherwell | Big stat anchors ("500+ products launched"), Webflow gradients. Polished but conventional — projects lack problem/solution/outcome depth. | Card gallery, thin narrative | Metrics-as-credibility only |
| 7 | havananguyen.com | Havana Nguyen | Hand-drawn icons, candid microcopy ("Ah, the bane of every UX researcher"), "a peek into how I work." | Process peeks + video, links out | Shows process fragments + testimonials |
| 8 | justinhinh.com | Justin Hinh | "Key Takeaways" box per case study; scannable structure. | Storytelling + takeaway summary | Reflection sections |
| 9 | thaisafernandes.com | Thaisa Fernandes | "It all started when…" narrative openings; meticulous case-study layout. | Narrative long-form | Story arc = the work |
| 10 | rezarezaeipour.com | Reza Rezaeipour | One-pager with career timeline and three prominent CTAs. Efficient, forgettable. | Timeline summaries | Not addressed |
| 11 | luisjurado.me | Luis Jurado | Testimonial-heavy; skill icons. | Summary cards | Social proof carries the load |
| 12 | miamdavis.com | Mia Davis | Bold minimalism, whitespace + headline typography. Looks great, reads generic. | Conventional | Not addressed |
| 13 | wjessewright.com / jennyatkins.me / nicolasbackal.com | (Squarespace cluster) | Clean, professional, indistinguishable — the "resume with CSS" baseline. | Standard project pages | Not addressed |
| 14 | omololaodunowo.netlify.app | Omolola Odunowu | Direct "Hire me" CTA, optional-depth user flows (progressive disclosure). | Summary → optional detail | Progressive disclosure of process |
| 15 | mokoron.com | Yuliya Rubtsova | Timeline format, AI/data focus. | Concise summaries | Not addressed |

Sources: [SiteBuilderReport 20+ PM portfolios](https://www.sitebuilderreport.com/inspiration/product-manager-portfolios), [CareerFoundry 9 examples](https://careerfoundry.com/en/blog/product-management/product-manager-portfolio/), [Underdog.io](https://underdog.io/blog/product-manager-portfolio-examples), ["I built myself like a product"](https://pshimanshu.substack.com/p/i-built-myself-like-a-product), direct site fetches.

### 1.2 What the best ones share (patterns)

1. **Process over polish.** Every strong source converges: show decision-making, trade-offs, ambiguity navigation — not just shipped screenshots. (Aakash Gupta: "show your work-in-progress, your decision-making frameworks.") The portfolio that *demonstrates* PM craft beats the one that *claims* it.
2. **Metric-anchored storytelling.** "Drove 15% WAU increase by redesigning onboarding" — number + mechanism, in the first line, not buried.
3. **Real artifacts as evidence.** Roadmaps, PRD excerpts, dashboards, IA charts embedded in case studies. Artifacts are how invisible work becomes visible.
4. **Progressive disclosure.** Scannable summary → optional depth (Justin Hinh's Key Takeaways, Omolola's optional user flows). Respects the 90-second recruiter scan AND the 20-minute hiring-manager read.
5. **Voice is the only durable differentiator at the template layer.** Sri Ponnada and Havana Nguyen are memorable purely through candid, self-aware copy. Sites with identical Squarespace bones live or die on this.
6. **Focused selection.** 2–3 deep case studies beat 9 shallow cards (Kane Sherwell is the cautionary example: 9 projects, zero narratives).

### 1.3 PM-portfolio clichés (the equivalent of designer-portfolio clichés)

- **"Passionate about building products users love"** — the PM "ninja unicorn" phrase. Means nothing.
- **The stat wall without stories** — "500+ products launched, 15+ years of impact" as hero content. Credibility theater.
- **The framework museum** — personas, journey maps, RICE matrices displayed as trophies rather than used on anything. (Designlab: "ditch overused flowcharts and user personas.")
- **Generic Squarespace/Notion sameness** — ~70% of found examples are visually interchangeable.
- **Case study = feature tour** — describing what shipped instead of what problem existed and what was decided.
- **Claiming team outcomes without stating personal contribution** — flagged by CareerFoundry as the #1 credibility killer.
- **Buried CTA / no contact path** — surprisingly common.
- **Design polish over substance** — Underdog explicitly lists "prioritizing design polish over substantive storytelling" as a top mistake.

### 1.4 Genuinely playful vs. resume-with-CSS — the verdict

**Almost nobody in the PM space is playful-interactive.** The interactive high bar lives in creative-dev land (Bruno Simon's drivable 3D portfolio — Awwwards Site of the Month; the lesson from that world: *interaction must serve content discovery, never decoration*). In PM land, the only found example of "site as product demo" is pshimanshu's PRD-site — and it's a static metaphor, not a working one.

**Implication for garvit.app: the lane is empty.** A site where the PM tooling actually *works* (real flags, real board, real funnel, real changelog) has no direct competitor in any roundup found. The concept doesn't need to out-design designers — it needs to out-*demonstrate* PMs. The site being the case study is itself the answer to the "PM work is invisible" problem: visitors watch PM craft operating on the very page they're reading.

---

## TRACK 2 — PM responsibilities → playful interactions

Legend: ✅ = already on garvit.app · 🆕 = new opportunity. Constraint check applied throughout: zero visitor homework, session-local data only, candor humor, buildable in Next.js (client components + localStorage/sessionStorage; no backend needed except where noted).

### 2.1 Discovery / user research
- 🆕 **The 3-second fake intercept survey.** A pitch-perfect parody of "Got 30 seconds for feedback?" modals that answers itself before you can click ("You were going to say 4/5. Everyone says 4/5. Dismissed."). Instant payoff, mocks the genre.
- 🆕 **Visitor persona card.** Session-local segmentation played straight: device + hour + referrer + scroll behavior → a persona card ("Segment: Late-Night Mobile Skimmer, n=1. JTBD: decide if Garvit is worth a coffee chat"). Webkay-adjacent but warm, and explicitly labeled "computed on your device, forgotten on refresh."
- 🆕 **Hallway-test hotspots.** Small "what users actually said" tooltips pinned to real site elements ("3 of 5 testers didn't notice this button. You just did. Thank you.").

### 2.2 Prioritization / roadmapping
- ✅ Sprint board with draggable case-study tickets.
- 🆕 **RICE hover-scores on everything.** Every section/feature of the site shows its own RICE score on hover — including embarrassingly low ones that shipped anyway, with a one-line excuse ("Confidence: 0.3. Shipped it anyway. PM prerogative.").
- 🆕 **One-click public roadmap voting.** "What should this site ship next?" — three items, one anonymous click, live tally (Features.Vote pattern: no signup, one click). Needs tiny persistence (Vercel KV / Edge Config).
- 🆕 **"You prioritize it" micro-moment.** Drag three backlog cards into an order; the site replies with candid commentary on your choices ("Interesting. You deprioritized 'Contact form'. Recruiters usually do the opposite."). No right answer, no score.

### 2.3 Writing PRDs / specs
- 🆕 **Case studies rendered as PRDs with live margin comments.** Fake stakeholder comment threads in the gutter ("Eng: is this scoped? — resolved") that resolve as you scroll. Turns the most invisible PM skill into a visible, funny surface.
- 🆕 **Spec-vs-shipped diff toggle.** A v1-PRD / what-actually-shipped toggle per case study (strikethroughs, "descoped, see §Cut" links). Drag-to-compare precedent: pshimanshu.
- 🆕 **"Open questions" that are actually open.** Each case study ends with the real open questions at ship time — some marked "still don't know."

### 2.4 A/B experiments
- ✅ A/B experiment banner.
- 🆕 **"Which variant are you?" reveal.** Small chip showing the visitor's assigned variant + a live-ish results bar and an honest verdict ("n=214. Not significant. Running it anyway because I like B."). Extends the existing banner into a payoff.
- 🆕 **Significance meter gag.** A p-value meter that never quite crosses 0.05, with candid caption ("This is most A/B tests, by the way").

### 2.5 Analytics / funnels / retention
- ✅ Session journey funnel (in build) — see §2.13 for the researched mechanics.
- 🆕 **North-star metric in the header.** One live number the whole site "optimizes for" ("Coffee chats booked: 12 this quarter") — every section ties back to it, exactly like a real product org.
- 🆕 **Retention cohort joke.** A Day-0/1/7/30 retention grid for the site where the visitor's cell says "you are here" and Day-7 says "statistically, not you. Prove me wrong →" (links to newsletter/contact).

### 2.6 Stakeholder alignment
- 🆕 **Alignment meter.** Per case study, a meter labeled "Stakeholders aligned" that fills as you scroll the story — dipping at the conflict paragraph. Scroll-progress bar reskinned as PM narrative.
- 🆕 **The fake Slack thread.** One reconstructed (anonymized) stakeholder-pushback thread per case study, collapsed by default: the realest PM artifact almost nobody shows.
- 🆕 **"Who I had to convince" org strip.** Row of role avatars (Eng, Design, Legal, Sales) per project; hover = each one's actual objection, one line.

### 2.7 Sprint rituals (standup / retro / planning)
- ✅ Sprint board (planning surface).
- 🆕 **Site standup widget.** Auto-rotating "Yesterday / Today / Blockers" for the site itself ("Yesterday: shipped funnel v1. Today: you're looking at it. Blockers: perfectionism"). Content from the real changelog feed.
- 🆕 **Retro block per case study.** Went well / Didn't / Action items — with at least one genuinely uncomfortable "Didn't." Candor register does the differentiating.

### 2.8 Incident response
- 🆕 **404 page as blameless postmortem.** "INC-0042 · SEV-3: visitor reached nonexistent route. Root cause: PM overestimated own information architecture. Remediation: →Home." Highest delight-per-effort item in this entire list; 404s are guaranteed traffic.
- 🆕 **Status banner with a history.** Occasional "Investigating: hero animation jank on Safari (mitigated)" banner linking to a tiny /status page with honest uptime + past "incidents" (real bugs, blameless writeups).

### 2.9 GTM / launch
- 🆕 **Launch-checklist page load.** On first visit, a corner checklist ticks itself as assets hydrate ("assets ✓ · copy ✓ · confidence ◐") then dismisses. Loading state as theater — zero homework.
- 🆕 **Product-Hunt-style launch card per case study.** Tagline, "hunted by," upvote arrow that thanks you and admits the count is decorative.

### 2.10 Pricing
- 🆕 **Satirical pricing page for hiring Garvit.** Free: read this site. Pro: coffee chat (₹0, Delhi metro area). Enterprise: "Contact sales (me. I am sales)." Annual toggle that changes nothing, footnoted honestly. Pricing pages are a universally understood genre — parody lands instantly and doubles as the contact CTA.
- 🆕 **Willingness-to-pay slider gag.** A WTP slider on the pricing page whose only effect is changing the testimonial's enthusiasm.

### 2.11 Saying no / cutting scope
- 🆕 **The Cut List (scope graveyard).** A real section of features designed for this site and killed, each with reason + RICE score at time of death ("3D avatar: cut. Effort 13, novelty already claimed by Bruno Simon"). Directly demonstrates the rarest PM skill and is pure candor. Strong "About this site" anchor.
- 🆕 **"Add one more feature" button.** Pressing it visibly degrades the page (extra banners, a chatbot, a cookie modal) for 5 seconds, then reverts: "This is why we say no." One button, one lesson, instant payoff.

### 2.12 Changelogs / release notes
- ✅ Release-notes popover · ✅ candid changelog ticker.
- 🆕 **"Since you were last here" diff.** Return visits (localStorage) open with a personal changelog: "2 things shipped since your last visit." Turns retention into a feature.

### 2.13 The "your session journey" funnel — researched mechanics

**Best-in-class references found:**

1. **clickclickclick.click (Studio Moniker)** — the canonical "site narrates your behavior" piece: live event log ("Subject has moved to the bottom-left area"), achievements for behavior, sarcastic narrator. Built to induce surveillance unease — garvit.app should invert the register: same live narration, but warm, candid, session-local, and explicitly self-hosted ("this log dies when you close the tab"). *The mechanic to steal: a running plain-language event feed in a PM's voice.*
2. **webkay.robinlinus.com** — "What every browser knows about you": passive data rendered back honestly. Steal the *radical transparency framing*, not the creepiness: "The only analytics this site has on you" panel showing exactly the session-local signals used by the persona card/funnel.
3. **Receiptify pattern** — data-as-receipt is beloved and instantly shareable. **Session receipt** at exit/footer: sections visited as line items, qty, time-on-section as price, scroll depth as tax, "TOTAL: 1 informed opinion about Garvit." Perfect closer for the funnel section; printable/downloadable.
4. **PartyKit cursor-party** — one script tag for live multiplayer cursors + `/` cursor chat. Ambient "other people are here" presence; anonymous, cheap, joyful. Optional (needs a PartyKit/WebSocket host), and the one idea here that leaves session-local scope — if used, keep it presence-only.
5. **Plausible public-dashboard convention** — footer link to the site's real, public analytics. Zero build cost, maximum "PM who shows the numbers" credibility.
6. **Funnel-chart craft rules** (Amplitude/PostHog-style UX, per funnel-viz literature): 4–8 steps max; label every step with name + value + step-over-step conversion (the actionable number); horizontal step bars beat funnel-shaped trapezoids for readability; use Sankey only for multi-path stories.

**Recommended composite for the in-build funnel section:**
- **Steps (5):** Landed → Read a case study → Opened the flags panel / touched the board → Visited pricing (contact) → Booked/emailed. Visitor's own bar fills live as they do each thing — the funnel completes itself while they watch, which is the payoff.
- **Overlay** a muted "typical visitor" bar (hardcoded or from Plausible aggregate) so their session reads *against* a benchmark: "You're outperforming the median visitor. Conversion pressure is now on step 5."
- **Beneath it, the narration log** (clickclickclick mechanic, candid register), 5–7 most recent events.
- **Exit: the session receipt**, generated from the same event array.
- One event array in a context/provider feeds all three (funnel, log, receipt) — one system, three payoffs. All sessionStorage; Next.js client components; zero backend.

---

## Ranked shortlist — new ideas by delight-per-effort

| Rank | Idea | Effort | Why it wins |
|------|------|--------|-------------|
| 1 | 404-as-blameless-postmortem | Half a day | Guaranteed traffic surface, pure candor, zero state |
| 2 | Session receipt (funnel closer) | 1 day (reuses funnel events) | Shareable artifact; receipt genre is pre-loved |
| 3 | Satirical pricing page (= contact CTA) | 1 day | Genre parody + converts; "Enterprise: contact sales (me. I am sales.)" |
| 4 | The Cut List (scope graveyard) | Half a day (content work) | Demonstrates the rarest PM skill; nobody else has it |
| 5 | Candid narration log under the funnel | 1–2 days | The clickclickclick mechanic inverted to warmth; makes the funnel section feel alive |
| 6 | Visitor persona card | 1 day | Discovery made tangible; pairs with transparency panel |
| 7 | "Add one more feature" button | 1 day | One-click lesson in saying no |
| 8 | PRD margin comments in case studies | 2–3 days | Deepest craft signal, but content-heavy |
| 9 | Retro block per case study | Content only | Candor register, cheap |
| 10 | North-star metric header | Half a day | Ties the whole "site as product" concept together |

---

## Constraint audit

- **Zero homework:** every idea above pays off on sight or one click; nothing evaluates the visitor (the "you prioritize it" moment explicitly has no right answer).
- **No surveillance creepiness:** all session mechanics are sessionStorage/localStorage, no fingerprinting, and §2.13's transparency panel *advertises* that. Cursor-party is the only networked idea; flag it as optional.
- **Candor register:** the differentiator in every ranked item is the honest caption, matching the existing changelog ticker's voice.
- **Next.js buildability:** everything is client components + one shared session-event provider; only roadmap-voting and north-star counter need trivial persistence (Vercel KV); Plausible link needs nothing.
