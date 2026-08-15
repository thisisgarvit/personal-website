# Prompt to forward to the airbnb-portal (Stay Portal) coding agent

> Forward everything below the line verbatim to the agent working in `~/Documents/Side-Projects/airbnb-portal`.

---

**Task: Portfolio demo mode for Stay Portal — demo data, read-only demo login, and screenshots**

I want to show this project publicly in a PM portfolio case study. Real production data contains real guest names and mobile numbers, so nothing real may ever be visible to a portfolio visitor. Do the following four things:

**0. Isolation first (hard requirement).** The demo must not run against the production database. Set up an isolated demo environment: a separate free Postgres database (Supabase or Neon — the app only needs `DATABASE_URL`) with the existing migration in `supabase/migrations/` applied, and a separate Vercel deployment (or a clearly separated preview deployment, e.g. `airbnb-portal-demo.vercel.app`) pointing at it. The Google Sheets sync env vars should be left unset in the demo environment so the cron is inert. Production stays untouched.

**1. Seed realistic-but-fake demo data.** Write an idempotent seed script (e.g. `scripts/seed-demo.ts`, runnable with `tsx`, using the existing `lib/db.ts` pool — no new npm dependencies). Seed against the schema as it exists:

- **rooms**: keep the 5 seeded rooms (4202, 3707, 3611, 2206, 2128).
- **platforms**: keep Airbnb / Offline / Referral; optionally add Booking.com (`needs_detail=true`, "Booking ref").
- **bookings**: ~80–120 bookings spanning roughly the last 90 days through 14 days in the future, **generated relative to today's date at seed time** so the day view is never empty. Shape them to exercise every feature:
  - Mix of full-day stays (default 14:00 check-in / 11:00 checkout), half-day slots (e.g. 10:00–18:00), and hourly slots (e.g. 13:00–16:00), with several days where one room has 2–3 back-to-back bookings — this is the product's differentiator.
  - Realistic fake Indian guest names and fake +91 mobiles (use obviously non-real ranges); `final_amount` roughly ₹800–₹4,500 scaled to duration; a mix of fully paid, partially paid, and unpaid so timeline blocks show all three colors (emerald/amber/red).
  - Past bookings get `checkout_actual_at`; current/future ones don't. Include 5–8 active bookings with `paid_amount < final_amount` so the Pending payments page has content, a handful of `status='cancelled'` bookings, 3–4 repeat guests (same mobile across 2–4 stays) so the Repeat guests analytics section populates, and 6–10 Referral bookings across 3–4 distinct referrer names so the Referral leaderboard populates. Airbnb bookings get plausible fake booking refs in `platform_detail`.
  - Respect the `no_overlap` exclusion constraint — generate non-overlapping half-open ranges per room; the seed must complete with zero constraint violations.
- Business time is IST — build timestamps with the helpers in `lib/time.ts`, not raw local dates.

**2. Read-only demo login.** Add a third user, name `Demo`, passcode from env `AUTH_PASSCODE_DEMO` (follow the existing `getAuthUsers()` / `readRuntimeSecret` pattern in `lib/runtime-config.ts`). Enforce read-only for this session server-side, not just in the UI: when the session user is `Demo`, reject every mutating API request (`POST`/`PATCH`/`DELETE` on `/api/*`, except `POST /api/auth/login` and `POST /api/auth/logout`) with a 403 like `{error:'demo_readonly', message:'Demo account is read-only'}`. The middleware is the natural single choke point. The demo user **can**: log in, browse day view/search/availability/pending/analytics/settings (viewing), and open the new/edit booking forms — but any save attempt gets a clean, friendly error (surface the 403 message in the existing form error UI rather than a raw failure). The demo user **cannot**: create/edit/cancel/checkout bookings, mark paid, change settings/rooms/platforms, or trigger the Sheets "Sync now". Configure `AUTH_PASSCODE_DEMO` only in the demo deployment; do not set it in production, and make sure the Demo user is simply absent/unusable when the env var is missing (production must fail closed, consistent with the existing secrets policy).

**3. Screenshots.** From the seeded demo deployment (or a local run against the demo DB), capture clean screenshots at a mobile viewport (~390×844, since the app is phone-first) and save them to `docs/screenshots/`:
1. `day-view.png` — home day view on a date where several rooms have multiple color-coded bookings, including at least one room with 2+ slots that day.
2. `analytics.png` — Analytics page on a ~30-day window showing income/occupancy charts plus the Repeat guests and Referral leaderboard sections (multiple captures if it doesn't fit one screen: `analytics-1.png`, `analytics-2.png`).
3. `booking-overlap.png` — New booking form with the live overlap warning / conflict state visible.
4. `availability.png` — Availability checker showing results for a queried time window.
5. `pending.png` — Pending payments list with several dues.

No real data may appear in any screenshot.

**4. Report back** with: the demo deployment URL, the demo credentials (name + passcode), the seed script path and the exact command to re-run it, the file paths of all screenshots, and confirmation that (a) production DB/env were not modified and (b) mutation attempts as Demo return 403.

Commit the seed script, the demo-user/read-only changes, and the screenshots on a branch, and keep the existing conventions: TypeScript strict passes, no new npm dependencies, new migrations only as new timestamped files (though none should be needed — this task changes no schema).
