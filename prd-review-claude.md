# Claude's PRD review — APPROVED with two required one-line amendments (2026-08-15)

**Verdict: approved.** The PRD correctly consumes DESIGN.md, my design review, Garvit's answers, and the work-split amendment. The verification plan is a real gate, not a checklist. Tasks 3–5 (my lane) start immediately; apply the two amendments below in place and reply `PRD PATCHED` — no re-review needed unless you disagree.

## Required amendments (one line each)

1. **§5.4 vs §13 contradiction — no-JS phone.** §5.4 says server-render an accessible "Call / reveal phone" button placeholder; §13's matrix says no-JS = "phone omitted." A server-rendered reveal button is a dead control when JS never loads. Resolve in favor of §13: **the reveal control is client-rendered only; no-JS visitors see the email path and no phone UI at all.** Amend §5.4's server/no-JS bullet accordingly.
2. **§7 `21 SP*` — the asterisk is undefined.** Either define its footnote in the board UI spec (e.g., a candid `*actually shipped, so points were a lie anyway` micro-note — your call on copy, it must exist somewhere reachable) or drop the asterisk. An unexplained symbol on the most-viewed ticket invites confusion.

## Notes (no PRD change required — logged for later gates)

3. **§5.3 intro sentence is new authored copy** ("I'm Garvit. I write PRDs on GitHub, deploy prototypes on weekends, and build dashboards before asking engineering."). Register is right and claims are plausible, but Garvit has only approved the headline. Add it to §18's release-time decisions in spirit: he confirms or tweaks it at RC play-through. (I'll carry this in my Task 11 checklist; no edit needed.)
4. **§12 Vercel page views vs "no external asset request" (§16).** Vercel Web Analytics injects a first-party-routed script. At Task 9 I'll implement it as the sanctioned exception (same-origin `/_vercel/insights` route) and scope the §16 test to third-party origins. Flagging so the test intent is agreed now.

## Confirmations worth recording

- Dropping `/changelog` and keeping three notes: agreed, and now tested (§16).
- Phone: footer-only, memory-only reveal state, leak tests against server HTML/metadata/OG: exactly right.
- §8 "patented" caution on Maxie: good catch — treat as concept, not IP, unless documentation appears.
- §18 availability-line check before RC: good catch; stale availability is a credibility bug.
- Release-note dates must be real milestones: agreed — the candor register only works if the dates are true.

## My lane is starting now (per §15)

Task 3 begins immediately in my subagent lane: git init (docs committed first, then scaffold), pnpm + Next.js App Router + strict TS, CSS Modules, MDX, Vitest + Playwright harnesses, `next/font/local` with fonts extracted from the approved slice, security headers, five route shells, `src/data/site.ts` per §4. Chosen paths will be recorded in `ARCHITECTURE.md` before any parallel work, per your freeze rule. Your Task 6 (flags) can begin as soon as Task 4's shell lands — I'll signal.
