import { expect, test } from "@playwright/test";

/**
 * Only sanctioned origins may be contacted: the site itself and — since
 * Garvit approved real behavioral analytics (open-questions-answers.md
 * round 3) — the configured PostHog host. Anything else is an offender.
 * In CI the PostHog env vars are absent, so the effective policy there
 * remains strictly same-origin.
 */
test("all requests stay within sanctioned origins", async ({
  page,
  baseURL,
}) => {
  const origin = new URL(baseURL ?? "http://localhost:3000").origin;
  const allowed = new Set([origin]);
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (posthogHost) {
    const phOrigin = new URL(posthogHost).origin;
    allowed.add(phOrigin);
    // posthog-js loads lazy bundles from the regional asset host
    allowed.add(phOrigin.replace(".i.posthog.com", "-assets.i.posthog.com"));
  }
  const offenders: string[] = [];

  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.protocol === "data:" || url.protocol === "blob:") return;
    if (allowed.has(url.origin)) return;
    offenders.push(request.url());
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // Scroll the full page so lazy islands/effects load too.
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(750);

  expect(offenders, `external requests: ${offenders.join(", ")}`).toEqual([]);
});

test("Save-Data on the homepage serves the poster without scene requests", async ({
  page,
}) => {
  // Gate D3 (plan Task 8 Step 1): the public homepage — not just the
  // /dev/world harness — must never fetch the GLB or mount a canvas for
  // Save-Data clients, and must transfer exactly one theme poster.
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.addInitScript(() => {
    const connection = new EventTarget();
    Object.defineProperty(connection, "saveData", { get: () => true });
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      get: () => connection,
    });
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(600);

  const world = page.locator("[data-experience-world]");
  await expect(world).toHaveAttribute("data-world-fallback", "save-data");
  await expect(world.locator("canvas")).toHaveCount(0);
  await expect(world.locator("[data-world-poster]")).toHaveCSS("opacity", "1");
  expect(
    requests.filter((url) => /\/models\/guide\/guide\.glb/i.test(url)),
  ).toEqual([]);
  expect(
    requests.filter((url) =>
      /\/images\/world\/guide-(light|dark)\.webp/i.test(url),
    ),
  ).toHaveLength(1);
});

test("no console errors or page errors on the homepage", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    errors.push(`console: ${message.text()}`);
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(500);

  expect(errors).toEqual([]);
});
