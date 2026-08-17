import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { gunzipSync } from "node:zlib";

/**
 * Gate F analytics-separation validation (plan Task 9 Step 6).
 *
 * Drives one REAL visitor session (chromium, production build, live
 * PostHog network) through: scroll, flag toggles, persona selection,
 * board drag, keyboard ticket move, funnel milestones, case preview,
 * full case read, resume click, and contact click — while capturing
 * EVERY outbound request. Then asserts the two-stream contract:
 *
 *  - the session journey event stream exists ONLY in
 *    `sessionStorage["garvit-journey:v1"]` (never localStorage, never
 *    the network);
 *  - PostHog receives pageviews/autocapture plus AT MOST the five
 *    approved custom events (resume_download, contact_click, case_open,
 *    full_case_read, persona_selected);
 *  - ZERO scene/guide/board-position/funnel-stage custom events.
 *
 * Output: docs/qa/immersive/gate-f/analytics-session.json (captured
 * event names, request inventory, journey store contents, verdict).
 *
 * Usage: GATE_F_URL=http://localhost:3199 node scripts/validate-analytics-gate-f.mjs
 */

// posthog-js `defaults: "2026-01-30"` classifies localhost/127.0.0.1 as
// internal-or-test-user traffic and suppresses capture entirely, so the
// session must browse via a mapped non-localhost hostname to behave like
// a real visitor (Chromium --host-resolver-rules maps it to 127.0.0.1).
const HOST_ALIAS = "rc.garvit-qa.test";
const rawBase = process.env.GATE_F_URL ?? "http://localhost:3199";
const basePort = new URL(rawBase).port || "80";
const baseURL = `http://${HOST_ALIAS}:${basePort}`;
const output = resolve(process.env.GATE_F_OUT ?? "docs/qa/immersive/gate-f");
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
if (!posthogHost) {
  console.error("NEXT_PUBLIC_POSTHOG_HOST missing — source .env first.");
  process.exit(1);
}
const posthogOrigin = new URL(posthogHost).origin;

const APPROVED = new Set([
  "resume_download",
  "contact_click",
  "case_open",
  "full_case_read",
  "persona_selected",
]);

await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: [`--host-resolver-rules=MAP ${HOST_ALIAS} 127.0.0.1`],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  acceptDownloads: true,
  // posthog-js drops all capture for bot user agents (HeadlessChrome).
  // This validation needs the SDK to behave as it does for a real
  // visitor, so present a regular Chrome UA and mask webdriver.
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
});
await context.addInitScript(() => {
  // NOTE: no storage.clear() here — init scripts run on EVERY document
  // load, and the full-page case navigation would wipe the tab-local
  // journey stream mid-session. A fresh context starts empty anyway.
  Object.defineProperty(navigator, "webdriver", {
    configurable: true,
    get: () => false,
  });
  Object.defineProperty(navigator, "deviceMemory", {
    configurable: true,
    get: () => 8,
  });
});
const page = await context.newPage();

const outbound = [];
const posthogEvents = [];

function decodeCaptureBody(request) {
  const buffer = request.postDataBuffer();
  if (!buffer) return null;
  let text = null;
  try {
    if (buffer[0] === 0x1f && buffer[1] === 0x8b) {
      // gzip magic — posthog-js gzip-js compression.
      text = gunzipSync(buffer).toString("utf8");
    } else {
      text = buffer.toString("utf8");
      if (text.startsWith("data=")) {
        text = Buffer.from(
          decodeURIComponent(text.slice(5)),
          "base64",
        ).toString("utf8");
      }
    }
    const parsed = JSON.parse(text);
    const events = Array.isArray(parsed) ? parsed : (parsed.batch ?? [parsed]);
    return events
      .map((entry) => entry?.event)
      .filter((name) => typeof name === "string");
  } catch (error) {
    return [`<decode-failure: ${error.message}>`];
  }
}

// Route interception (not just page.on) so sendBeacon flush bodies —
// how posthog empties its queue at pagehide/navigation — are readable.
await context.route(`${posthogOrigin}/**`, async (route) => {
  const request = route.request();
  if (request.method() === "POST") {
    const events = decodeCaptureBody(request);
    if (events) {
      outbound.push({
        url: request.url().slice(0, 140),
        method: "POST",
        posthog: true,
        beacon: request.resourceType() === "ping",
        events,
      });
      posthogEvents.push(...events);
    }
  }
  await route.continue();
});

page.on("request", (request) => {
  const url = request.url();
  const isPostHog =
    url.includes("posthog.com") || url.startsWith(posthogOrigin);
  if (isPostHog && request.method() === "POST") return; // logged by route
  outbound.push({
    url: url.slice(0, 140),
    method: request.method(),
    posthog: isPostHog,
  });
});

const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message.slice(0, 160)));

// ---------------------------------------------------------------- session
await page.goto(baseURL);
await page.locator("[data-persona-satire]").waitFor({ state: "visible" });
await page.waitForTimeout(3_000); // idle → PostHog boot

// 1. Persona selection (persona_selected). NOTE: the tray's first
// button is "Skip", which by design stores locally and tracks nothing —
// pick a real persona choice.
await page.locator('[data-persona-choice="founder"]').click();
await page.waitForTimeout(8_000); // batch flush cadence

// 2. Flag toggles (journey "played" milestone + autocapture).
await page
  .getByRole("checkbox", { name: "Toggle confetti while scrolling" })
  .click();
await page.waitForTimeout(400);
await page
  .getByRole("checkbox", { name: "Toggle candid ticket annotations" })
  .click();
await page.waitForTimeout(400);

// 3. Scroll through board to journey (scrolled milestone, world scenes).
await page.locator("#work-board").scrollIntoViewIfNeeded();
await page.waitForTimeout(1_200);

// 4. Board drag (chromium synthetic pointer recipe from e2e).
{
  const grip = page.locator(
    '[data-ticket="stay-portal"] button[aria-label^="Drag"]',
  );
  await grip.scrollIntoViewIfNeeded();
  const gripBox = await grip.boundingBox();
  const backlogBox = await page.locator('[data-column="backlog"]').boundingBox();
  if (gripBox && backlogBox) {
    const startX = gripBox.x + gripBox.width / 2;
    const startY = gripBox.y + gripBox.height / 2;
    const endX = backlogBox.x + backlogBox.width - 50;
    const endY = backlogBox.y + 120;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    for (let step = 1; step <= 8; step += 1) {
      await page.mouse.move(
        startX + ((endX - startX) * step) / 8,
        startY + ((endY - startY) * step) / 8,
      );
    }
    await page.mouse.up();
    await page.waitForTimeout(700);
  }
}

// 5. Keyboard ticket move (Alt+Arrow on the ticket link).
await page.locator('[data-ticket="maxie"] a').first().focus();
await page.keyboard.press("Alt+ArrowRight");
await page.waitForTimeout(700);

// 6. Journey section (funnel milestones render session-locally).
await page.locator("[data-journey-section]").scrollIntoViewIfNeeded().catch(() => {});
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1_200);

// 7. Case preview (case_open) then full case read (full_case_read).
await page.locator('a[href="/work/maxie"]').first().scrollIntoViewIfNeeded();
await page.locator('a[href="/work/maxie"]').first().click();
const fullCase = page.getByRole("link", { name: /Read full case/ });
await fullCase.waitFor({ state: "visible", timeout: 5_000 });
await page.waitForTimeout(6_000); // let case_open flush before more input
// full_case_read fires on this click; a plain click would unload the
// document before the SDK's next batch flush (the unload beacon body is
// not always observable). Meta+click opens the case in a new tab — the
// handler still runs — so the event flushes from the live home page.
const popupPromise = context.waitForEvent("page").catch(() => null);
await fullCase.click({ modifiers: ["Meta"] });
const popup = await popupPromise;
await page.waitForTimeout(8_000); // full_case_read batch flush
await popup?.close();
await page.keyboard.press("Escape"); // close the preview dialog
// Visit the case page itself for the real pageview, then return.
await page.goto(`${baseURL}/work/maxie`);
await page.waitForTimeout(1_500);
await page.goBack();
await page.waitForURL(`${baseURL}/`);
await page.waitForTimeout(1_000);

// 8. Resume click (resume_download) — a download, not a navigation.
const downloadPromise = page.waitForEvent("download").catch(() => null);
await page.locator('#resume-cta').click();
await downloadPromise;
await page.waitForTimeout(700);

// 9. Contact click (contact_click) — mailto; headless has no handler.
await page
  .locator('a[data-primary-cta][data-journey-conversion="contact"]')
  .click();
await page.waitForTimeout(700);

// Let PostHog flush its batch queue, then force a visibility flush so
// anything still queued beacons out while we can observe it.
await page.waitForTimeout(8_000);
await page.evaluate(() => {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => "hidden",
  });
  Object.defineProperty(document, "hidden", {
    configurable: true,
    get: () => true,
  });
  document.dispatchEvent(new Event("visibilitychange"));
  window.dispatchEvent(new Event("pagehide"));
});
await page.waitForTimeout(3_000);

// ---------------------------------------------------------------- readout
const storage = await page.evaluate((journeyKey) => {
  const parse = (raw) => {
    try {
      return JSON.parse(raw ?? "null");
    } catch {
      return raw;
    }
  };
  return {
    sessionJourney: parse(sessionStorage.getItem(journeyKey)),
    localJourney: localStorage.getItem(journeyKey),
    sessionKeys: Object.keys(sessionStorage),
    localKeys: Object.keys(localStorage),
  };
}, "garvit-journey:v1");

await browser.close();

const uniqueEvents = [...new Set(posthogEvents)].sort();
const customEvents = uniqueEvents.filter((name) => !name.startsWith("$"));
const unapproved = customEvents.filter((name) => !APPROVED.has(name));
const missingApproved = [...APPROVED].filter(
  (name) => !customEvents.includes(name),
);
const forbiddenPatterns = uniqueEvents.filter((name) =>
  /scene|guide|mascot|world|board|funnel|journey|stage|drag/i.test(name),
);
const journeyEvents = Array.isArray(storage.sessionJourney)
  ? storage.sessionJourney
  : [];
const journeyOnNetwork = outbound.filter((entry) =>
  (entry.events ?? []).some((name) => /journey/i.test(name)),
);

const report = {
  baseURL,
  posthogOrigin,
  outboundRequestCount: outbound.length,
  outboundNonLocalHosts: [
    ...new Set(
      outbound
        .map((entry) => new URL(entry.url.split("?")[0]).host)
        .filter((host) => !host.startsWith("localhost")),
    ),
  ].sort(),
  posthogCaptureRequests: outbound.filter((entry) => entry.events).length,
  capturedPostHogEventNames: uniqueEvents,
  customEvents,
  unapprovedCustomEvents: unapproved,
  approvedEventsNotObserved: missingApproved,
  forbiddenPatternMatches: forbiddenPatterns,
  journeyStore: {
    key: "garvit-journey:v1",
    inSessionStorage: journeyEvents.length > 0,
    eventCount: journeyEvents.length,
    types: [...new Set(journeyEvents.map((event) => event?.type))],
    inLocalStorage: storage.localJourney !== null,
    onNetwork: journeyOnNetwork.length > 0,
  },
  sessionStorageKeys: storage.sessionKeys,
  localStorageKeys: storage.localKeys,
  pageErrors,
  verdict:
    unapproved.length === 0 &&
    forbiddenPatterns.length === 0 &&
    journeyEvents.length > 0 &&
    storage.localJourney === null &&
    journeyOnNetwork.length === 0
      ? "PASS"
      : "FAIL",
};

await writeFile(
  resolve(output, "analytics-session.json"),
  `${JSON.stringify({ report, outbound }, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
