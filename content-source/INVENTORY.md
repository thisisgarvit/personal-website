# Content Inventory — Notion Export (July 2026)

Source: Notion HTML export `ExportBlock-82649866-1469-4d7b-9b00-ccea531172d5-Part-1` (4 pages, 1 local image asset). Markdown files below are faithful, unedited conversions — source-of-truth for the portfolio build.

| Page title | File | Words | Images | What it is |
| --- | --- | --- | --- | --- |
| Garvit Sukhija - Product Thinking & Case Studies | `garvit-sukhija-product-thinking-and-case-studies.md` | ~700 | 0 local (remote Unsplash cover) | Portfolio landing page: intro bio, "A Bit About Me" (BITS Pilani, FoodInsta), teaser cards for the 3 case studies, "Things I've Built" (4 shipped PM projects), and contact links. |
| AI Browser - Maxie | `ai-browser-maxie.md` | ~2,030 | 1 (`assets/ai-browser-maxie/image.png`) | Full 0-to-1 product concept for an AI browser: problem statement, vision, WHO/WHAT/WHY/WHEN assumptions, feature architecture, MOAT comparison table, GTM/adoption strategy, pricing table, and prototype walkthrough with screenshot. |
| Agentic Calendar | `agentic-calendar.md` | ~1,260 | 0 | Concept design for a proactive, autonomous calendar agent: thought process, competitive research, integration architecture (Slack, Gmail, Jira, Granola, Uber), 4 core features, and a 5-tab mockup walkthrough (Vercel-deployed wireframes). |
| One Delightful Product Experience | `one-delightful-product-experience.md` | ~770 | 0 | Product teardown of iOS Dynamic Island in a structured Q&A format: the experience, what made it special (vs Samsung Now Bar), product team philosophy, user impact, and execution challenges. |

**Assets:** `assets/ai-browser-maxie/image.png` (364 KB, Maxie prototype screenshot) — the only local image in the export. Each page also has a remote Unsplash cover image (URLs preserved as comments at the top of each .md file).

**Conversion notes:**
- Notion callouts → blockquotes (with their emoji icons preserved); open toggles in the Maxie page (WHO/WHAT/WHY/WHEN) → bold labels + bullet lists; two-column Notion layouts flattened to sequential blocks (noted with HTML comments where relevant).
- Internal Notion page links on the landing page rewritten to point at the sibling `.md` files.
- Original wording preserved exactly, including typos/quirks (e.g. "ideas and concept is patented to Garvit", "smoothen the browsing experience").

---

## Old personal website — worth salvaging

Reviewed `~/Documents/Side-Projects/Personal Website/personal-website/garvit-portfolio/` (Next.js 16 site, LLM-generated). No code should be copied, but the following **content/facts are genuinely useful** — they cover career details the Notion export doesn't:

1. **`src/lib/data.ts` — the single most useful file.** Real, structured facts:
   - Contact/identity: name, role ("Product Manager · AI Builder"), location (Delhi, India), email `garvit.sukh@gmail.com`, LinkedIn `linkedin.com/in/garvitsukhija`, **GitHub `github.com/garvitsukhija`** (not present anywhere in the Notion export), status "Open to AI PM roles".
   - Real bio copy (`about` array): 3 paragraphs — "thinks in user stories and ships in sprint cycles", 3 years across enterprise SaaS / satellite imagery / edtech, 20+ engineers managed, BITS dual-degree angle.
   - Full work history with dates and concrete metrics (`changelog` array): LambdaTest/TestMu AI PM (Mar 2025–present: 2 GUI releases in 90 days, $13.5K upsell from churn-risk account, RBAC PRD for Fortune 50 bank, 6+ enterprise deals); Pixxel Space APM (Aug 2023–Feb 2025: 0-to-1 EO SaaS, 10+ ML models, satellite tasking API, Stripe billing/IAM, 25% onboarding cut, 20-customer alpha); Languify Growth Intern (Jun–Jul 2021: 10K+ students, 15% email CTR boost, 50% social growth).
   - Headline metrics, skills matrix (`toolkit`), and side stories (FoodInsta finalist; SAC President — ₹30Cr budget, 137 employees, 9 canteens, ₹1Cr incremental revenue — richer than the Notion version).
   - Motto: "Product is about taste. I have been told mine's oddly reliable."
2. **Nothing else is salvageable.** `public/` contains only default Next.js SVGs and a favicon — no real photos of Garvit, no resume PDF (the site links to `/resume.pdf` but the file does not exist in the repo). All components/copy elsewhere are generic LLM-generated UI text.

**Caution:** the old site is itself LLM-generated; verify the metrics in `data.ts` against the real resume before publishing them.
