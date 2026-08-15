# Design Brief — Garvit's Portfolio Website (Phase 1)

Orchestrator: Claude (judge). Designer: Codex (gpt-5.6). Client: Garvit Sukhija, Product Manager.
Stack: Next.js (App Router) on Vercel. Repo: this folder.

## 1. What this site is

A product portfolio that makes three personas react in ten seconds:
1. **Startup founders** — trust Garvit's product sense from the work itself, and smile at one subtle silly quirk.
2. **HR / recruiters** — love the aesthetics.
3. **Product leads** — trust his judgment.

**Hard rule (from Garvit, verbatim intent): this is a PRODUCT PORTFOLIO, not a resume.** Resumes "do not depict who I am — just a journey and some inflated metrics." The information architecture leads with product work: case studies, teardowns, shipped side projects. Work history = a small about note at most. The resume exists ONLY as a download CTA ("Download resume" — file: `Garvit Sukhija Product.pdf`). No metrics walls, no check-marked outcome lists, no chronological role timeline as a primary surface.

## 2. Content inventory (already converted, in `content-source/`)

- Landing-page bio + "Things I've Built" (4 shipped PM projects) — `garvit-sukhija-product-thinking-and-case-studies.md`
- **AI Browser – Maxie** (~2,030 words, 1 screenshot): 0→1 product concept — problem, vision, assumptions, MOAT table, GTM, pricing, prototype
- **Agentic Calendar** (~1,260 words): proactive calendar agent concept + 5-tab mockup walkthrough (live wireframes at html-starter-sandy-sigma.vercel.app)
- **One Delightful Product Experience** (~770 words): iOS Dynamic Island teardown, Q&A format
- **Coming soon (design a slot for it):** Stay Portal — a real shipped booking manager for 5 flexibly-rented apartments (case study raw material in `airbnb-portal-case-study-raw.md`; screenshots + demo login arriving from another agent)

## 3. Direction (chosen by Garvit): "Quiet Operator, One Killer Toy"

Restrained, tasteful, credible-in-ten-seconds base layer + ONE committed, contained playful device.

### Taste spec — from Garvit's actual votes on 24 reference sites

**LOVED** (design toward these):
- mc1ane.com — near-silent minimal, huge imagery, ONE microcopy joke ("I'm touched"), pun domain
- sj.land — number-key nav, personality via curation, zero decoration
- gokulkrishnan.com — status strip (hello/time/weather), huge cycling type, minimal shell + one live-data quirk
- alejandroverdeja.com — clear readable project stories + "I also really like to draw" human sidecar
- marco.fyi — iMessage contact page, sound micro-interactions, projects as live mockups in device frames
- gkoberger.com — clickable illustrated-desk navigation, joke projects with real execution
- chusmargallo.space — full retro-OS with draggable windows (he loves committed play, even maximalist)
- getcoleman.com — the slider that rewrites the pitch; the mechanic IS the skill demo
- samuelfaith.com — text-first candor; dry honest copy as a design feature

**PASSED** (do NOT design toward these):
- borisverks.com, justinfarrugia.com, molly.info — resume-density, dark utility/command-surface aesthetics
- sriponnada.com, fromjason.xyz — voice-heavy/jokey prose, zine register
- pacolui.com, spencer.place, havananguyen.com, carsonfidje.com — webcam toys, artist register, doodle systems

**Synthesis:** polished minimal base + confident committed interactivity + mechanic-driven humor + candid copy. Humor lives in INTERACTIONS and honest microcopy, never in jokey prose. Editorial depth (case studies) is a supporting layer, not the spine.

## 4. The Toy — the one signature quirk device

Garvit is open to a Three.js moment. Judge's bar (non-negotiable): **the toy must demonstrate product thinking, not decorate.** getcoleman's slider works because the mechanic is proof of copywriting skill. A spinning 3D object is decoration and fails. Constraints: contained (never blocks the 10-second credibility read), lazy-loaded off the critical path, static fallback for mobile/reduced-motion.

Deliver **3 toy concepts**: at least one using Three.js/react-three-fiber, at least one not. For each: what it is, what it PROVES about Garvit as a PM, where it lives, cost/risk. Recommend one.

Candidate seeds he liked (build on or beat these): depth slider ("elevator pitch ↔ full PRD"), iMessage contact card, keyboard-first nav + easter egg, desk/OS-object navigation, "(actual)/(other) work" structural split.

## 5. Anti-template guardrails (judge will reject on these)

The design must not smell AI-generated. Banned defaults: warm-cream #F4F1EA + serif display + terracotta accent; near-black + lone acid-green/vermilion pop; purple-to-blue gradient hero; Inter or Space Grotesk as the "safe" face; emoji section markers; everything-centered layouts; rounded-lg cards everywhere; generic numbered 01/02/03 markers. Also banned: any famous-site cloning (brittanychiang, bruno-simon genre). The palette, type pairing, and layout system must each have a stated reason rooted in Garvit specifically.

## 6. Deliverables for this round (DESIGN ONLY — no Next.js scaffolding yet)

1. **`design-concept.md`** — positioning statement; sitemap/IA (portfolio-led per §1); design language: palette (named hex values + why), type pairing (faces + why, must be self-hostable), layout system, motion principles; the 3 toy concepts (§4) with recommendation; microcopy quirk plan (5-8 concrete lines, candor register); dark/light strategy; mobile + reduced-motion + accessibility notes.
2. **`style-tile.html`** — ONE self-contained static HTML file (no CDNs) rendering the visual language: type specimen, palette, hero mock with real copy from `content-source/`, one case-study card, one microcopy quirk in situ. This is what Garvit will look at to approve pixels before any build.

Claude (judge) reviews both for uniqueness and persona fit before they reach Garvit. If it reads generic, it comes back.
