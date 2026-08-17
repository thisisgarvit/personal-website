import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const baseURL = process.env.GATE_C_URL ?? "http://localhost:3100";
const output = resolve("docs/qa/immersive/gate-c");
const mobileOnly = process.env.GATE_C_MOBILE_ONLY === "true";

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function contextFor({ width, height, colorScheme, reducedMotion }) {
  const context = await browser.newContext({
    viewport: { width, height },
    colorScheme,
    reducedMotion,
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "deviceMemory", {
      configurable: true,
      get: () => 8,
    });
  });
  return context;
}

async function openWorld(context, live = true) {
  const page = await context.newPage();
  await page.goto(`${baseURL}/dev/world`);
  const world = page.locator("[data-experience-world]");
  if (live) {
    await world.locator("canvas").waitFor({ state: "visible", timeout: 20_000 });
    await page.waitForFunction(
      () =>
        document
          .querySelector("[data-experience-world]")
          ?.getAttribute("data-scene-ready") === "true",
      undefined,
      { timeout: 20_000 },
    );
    await page.waitForTimeout(1_800);
  }
  return page;
}

for (const capture of [
  { name: "desktop-light-1440x900.png", width: 1440, height: 900, colorScheme: "light" },
  { name: "desktop-dark-1440x900.png", width: 1440, height: 900, colorScheme: "dark" },
  { name: "mobile-light-390x844.png", width: 390, height: 844, colorScheme: "light" },
  { name: "mobile-dark-390x844.png", width: 390, height: 844, colorScheme: "dark" },
].filter((capture) => !mobileOnly || capture.width === 390)) {
  const context = await contextFor(capture);
  const page = await openWorld(context);
  if (capture.colorScheme === "dark") {
    await page.getByLabel("Toggle dark mode").check();
    await page.waitForTimeout(240);
  }
  await page.screenshot({ path: resolve(output, capture.name) });
  await context.close();
}

for (const capture of [
  { name: "reduced-motion-light-1440x900.png", width: 1440, height: 900 },
  { name: "reduced-motion-mobile-light-390x844.png", width: 390, height: 844 },
].filter((capture) => !mobileOnly || capture.width === 390)) {
  const context = await contextFor({
    ...capture,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await openWorld(context, false);
  await page
    .locator('[data-world-fallback="reduced-motion"]')
    .waitFor({ state: "visible" });
  await page.screenshot({ path: resolve(output, capture.name) });
  await context.close();
}

if (!mobileOnly) {
  const context = await contextFor({ width: 1440, height: 900, colorScheme: "light" });
  const page = await openWorld(context);
  await page.locator("[data-world-canvas] canvas").evaluate((canvas) => {
    canvas.dispatchEvent(new Event("webglcontextlost"));
  });
  await page
    .locator('[data-world-fallback="renderer-failure"]')
    .waitFor({ state: "visible", timeout: 20_000 });
  await page.screenshot({
    path: resolve(output, "renderer-failure-light-1440x900.png"),
  });
  await context.close();
}

if (!mobileOnly) {
  const context = await contextFor({ width: 1440, height: 900, colorScheme: "light" });
  const page = await openWorld(context);
  const canvas = page.locator("[data-world-canvas] canvas");
  const board = page.getByLabel("Board scene test controls");
  await board.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Start ticket drag" }).click();
  await canvas.waitFor({ state: "visible" });
  await page.waitForFunction(
    () => document.querySelector("canvas")?.dataset.guideGesture === "drag-watch",
  );
  await page.waitForTimeout(360);
  await page.screenshot({ path: resolve(output, "reaction-drag-watch.png") });

  await page.getByRole("button", { name: "End ticket drag" }).click();
  await page.getByRole("button", { name: "Trigger incident" }).click();
  await page.waitForFunction(
    () => document.querySelector("canvas")?.dataset.guideGesture === "pager-check",
  );
  await page.waitForTimeout(360);
  await page.screenshot({ path: resolve(output, "reaction-pager-check.png") });

  await page.getByRole("button", { name: "Resolve incident" }).click();
  await page.waitForFunction(
    () => document.querySelector("canvas")?.dataset.guideReaction === "idle",
    undefined,
    { timeout: 4_000 },
  );
  await page.getByLabel("Journey scene test controls").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Ship ticket" }).click();
  await page.waitForFunction(
    () =>
      document.querySelector("canvas")?.dataset.guideGesture ===
      "ship-celebration",
  );
  await page.waitForTimeout(360);
  await page.screenshot({ path: resolve(output, "reaction-ship-celebration.png") });
  await context.close();
}

await browser.close();
