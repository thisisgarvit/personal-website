import { expect, test } from "@playwright/test";

/** The portfolio's privacy joke is literal: v1 makes no third-party request. */
test("all requests stay same-origin", async ({
  page,
  baseURL,
}) => {
  const origin = new URL(baseURL ?? "http://localhost:3000").origin;
  const offenders: string[] = [];

  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.protocol === "data:" || url.protocol === "blob:") return;
    if (url.origin === origin) return;
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
    errors.push(`console: ${message.text()}`);
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(500);

  expect(errors).toEqual([]);
});
