import { expect, test } from "@playwright/test";

/**
 * Network purity (PRD §16, amended by Task 9 for PRD §12 analytics):
 * every request must be same-origin; the ONLY sanctioned analytics path
 * is same-origin `/_vercel/insights/*` (aggregate page views).
 *
 * Local `pnpm dev` exception: @vercel/analytics swaps in its debug
 * script from va.vercel-scripts.com in development mode only. CI runs
 * the production server and enforces the strict rule.
 */

const DEV_ONLY_ALLOWED_HOSTS = new Set(["va.vercel-scripts.com"]);

test("all requests stay same-origin (plus /_vercel/insights)", async ({
  page,
  baseURL,
}) => {
  const origin = new URL(baseURL ?? "http://localhost:3000").origin;
  const offenders: string[] = [];

  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.protocol === "data:" || url.protocol === "blob:") return;
    if (url.origin === origin) return;
    if (!process.env.CI && DEV_ONLY_ALLOWED_HOSTS.has(url.hostname)) return;
    offenders.push(request.url());
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // Scroll the full page so lazy islands/effects load too.
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(750);

  expect(offenders, `external requests: ${offenders.join(", ")}`).toEqual([]);
});

test("no console errors or page errors on the homepage", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    // Outside Vercel the insights script 404s by design; not a product error.
    if (
      text.includes("/_vercel/insights") ||
      message.location().url.includes("/_vercel/insights")
    ) {
      return;
    }
    errors.push(`console: ${text}`);
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(500);

  expect(errors).toEqual([]);
});
