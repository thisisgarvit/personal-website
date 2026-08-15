# Stay Portal (airbnb-portal) — case study raw material

Source: codebase evaluation of `~/Documents/Side-Projects/airbnb-portal` (live at airbnb-portal.vercel.app), 2026-07-17. For use when writing the portfolio case study once demo data + screenshots arrive.

**The product.** "Stay Portal" — a phone-first PWA booking manager for 5 flexibly-rented apartments (rooms 4202, 3707, 3611, 2206, 2128). The twist vs. normal vacation-rental tools: bookings can be **full-day, half-day, or hourly — several per room per day** — across Airbnb, offline walk-ins, and referrals. Everything is ₹ and IST.

**The problem.** The owner (two hardcoded users, "Harsh" and "Ishika") ran the whole operation out of a Google Sheets workbook, one tab per room. Evidence in repo: `scripts/import-csv.ts` is a one-time importer of the old workbook, tuned to its real quirks ("Mob No." column, channel prefixes, assumed-slot and shift rescue rules). Pain points answered: accidental double-bookings, no at-a-glance "what's happening today", untracked pending payments, zero analytics.

**The user.** Non-technical small-scale host operating from a phone. Mobile-first, ≥44px tap targets, ≥16px inputs, installable PWA, "Quiet Operations" UI refresh with accessibility review pass in commit history.

**Key capabilities.**
- **Day view home** — all 5 rooms as 24-hour timelines for any date, swipe between days, check-out/add-booking in place; blocks color-coded by payment (emerald paid / amber partial / red unpaid).
- **Double-booking impossible at the database level** — Postgres GiST exclusion constraint on `(room_id, tstzrange)`, live overlap warnings in the booking form, 409-with-conflict API contract.
- **Availability checker, pending-payments list, global search** (name/mobile/booking ref/remarks).
- **Analytics** — income attributed to IST checkout day, collected vs pending, occupancy by hours, income by room/platform, repeat guests (deduped by mobile digits), referral leaderboard.
- **Google Sheets mirror** — nightly one-way sync back into a spreadsheet (one tab per room): owner keeps the familiar view AND gets a free daily backup. A very PM-shaped adoption bridge.
- Audit log + sync log tables; signed JWT cookie sessions; fail-closed secrets in production.

**Data model** (`supabase/migrations/20260714000000_initial_portal_schema.sql`): `rooms`, `platforms` (Airbnb/Offline/Referral with per-platform detail fields), `bookings` (guest_name, mobile, checkin_at, planned/actual checkout, final_amount, paid_amount, id_taken, remarks, status), `settings`, `audit_log`, `sync_log`.

**Tech stack.** Next.js 14 App Router + TypeScript strict + Tailwind, raw `pg` against Supabase Postgres (deliberately no Supabase SDK — browser never talks to the DB provider, also dodges India-side DNS blocks of `*.supabase.co`), `jose` sessions, `date-fns-tz`, Recharts, `googleapis`, Vercel cron.

**Quantifiable facts.**
- 484 historical bookings imported from the old workbook across 5 rooms, zero overlap failures; room 3707 alone had 137 bookings with totals verified to match.
- ₹0/month running cost (Vercel Hobby + Supabase Free + a Google service account).
- Built in essentially one day — all 21 commits dated 2026-07-14, including multi-agent build orchestration documented in `BUILD_NOTES.md` (4 parallel feature agents with file-ownership contracts).
- 2 users, 5 rooms, 3+ booking channels, 30-day sessions.

**Strongest screens (in order).**
1. Day view home (`app/page.tsx`) — signature screen, hourly-booking differentiator.
2. Analytics (`app/analytics/page.tsx`) — business value.
3. New booking form with live overlap warning — the "double-booking is impossible" story.
4. Availability checker (`app/availability/page.tsx`) — answers "is anything free Saturday afternoon?"
5. Pending payments (`app/pending/page.tsx`) — money-recovery view.

**Privacy note for the case study.** Production DB contains real guest PII (names + mobiles), so the demo environment is fully isolated from production — worth mentioning in the case study as a deliberate trade-off, not skipping.
