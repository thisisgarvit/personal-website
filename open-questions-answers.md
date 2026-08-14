# Garvit's answers to the plan's open questions (2026-08-15)

Authoritative input for the PRD (Task 2). Supersedes the recommended defaults where they differ.

1. **Hero copy — APPROVED.** "I turn fuzzy product ideas into things people can use" ships as-is. No longer blocks launch; may be revisited later as a copy tweak.
2. **Domain — not purchased yet, and may NOT be garvit.app.** Focus on the local/preview build first; deploy to Vercel later and attach whatever domain he buys. Consequence for design: the product-chrome brand string ("garvit.app v2.4.1") must be a single token/config value so the final domain name swaps in one place. Keep garvit.app as the placeholder brand until purchase.
3. **Contact — confirmed + expanded.** Public email: garvit.sukh@gmail.com. **He also wants his phone number on the site: +91 7508883655** (format with country code, use a `tel:` link). Judge note, surfaced to Garvit: a plaintext phone number on a public site gets scraped by spam bots; recommend light obfuscation (render via JS or an interaction to reveal) while keeping the tel: link one tap away — final treatment is a design decision for DESIGN.md/PRD, but the number itself is approved for publication by Garvit.
4. **Analytics —** default stands (aggregate Vercel page views only; typed no-op adapter for the 4 whitelisted events).
5. **Version semantics —** default stands (launch v2.4.1, bump with candid release notes per real release).
6. **Case-study evidence — Stay Portal demo assets are READY.**
   - Live demo: https://airbnb-portal-demo.vercel.app (isolated demo deployment, fake data).
   - Five PII-verified screenshots copied to `content-source/assets/stay-portal/`: analytics-1, analytics-2, availability, booking-overlap, pending. All show synthetic demo data (sequential fake mobile numbers, fictional guests) — cleared for public use.
   - **`day-view.png`:** the local file had been accidentally overwritten with a screenshot of a personal financial document (never committed/pushed; preserved to `~/Documents/carta-option-grant-screenshot-recovered.png`). The original demo day view was restored from git and PII-verified clean. It lives at `~/Documents/Side-Projects/airbnb-portal/docs/screenshots/day-view.png` — copy it into `content-source/assets/stay-portal/` during Task 5 (a permission rule blocked Claude's direct copy; the content is cleared).
7. **Mascot likeness —** default stands (authored abstract figure with PM props, no likeness).

Additional:
- **Resume PDF:** treat current `~/Downloads/Garvit Sukhija Product.pdf` as final for wiring; Garvit may update it (~2026-08-16) and the file can be swapped later. He confirms the current one is fine ("small exaggerations"). Task 11 verifies site claims against whichever PDF is current at RC time — the site must never state a *stronger* claim than the resume does.
- **Title discrepancy RESOLVED:** "SSMS President" (Notion) is TRUE; the old site's "SAC President" is wrong. Use SSMS wherever the title appears.
- **OG tagline** ("Product Manager who builds") remains provisional per plan-signoff.md — get Garvit's yes/no at Task 8A.
- **Git/GitHub identity (Garvit, 2026-08-15): use `thisisgarvit`** — his personal GitHub account (same as airbnb-portal). Repo-local git identity: `thisisgarvit` / garvit.sukh@gmail.com. NEVER the machine-global work identity (GarvitLT / garvits@lambdatest.com). At remote-creation time (Task 9/12): `gh auth switch -u thisisgarvit` first — the gh CLI's active account is currently the work one.
