import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const baseURL = process.env.GATE_D_URL ?? "http://localhost:3111";
const output = resolve(process.env.GATE_D_OUT ?? "docs/qa/immersive/gate-d");
const configuredPostHogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogOrigin = configuredPostHogHost
  ? new URL(configuredPostHogHost).origin
  : null;
const posthogAssetOrigin = posthogOrigin?.replace(
  ".i.posthog.com",
  "-assets.i.posthog.com",
);

const captures = [
  { name: "home-1440x900-light.png", width: 1440, height: 900, colorScheme: "light" },
  { name: "home-1440x900-dark.png", width: 1440, height: 900, colorScheme: "dark" },
  { name: "home-390x844-light.png", width: 390, height: 844, colorScheme: "light" },
  { name: "home-390x844-dark.png", width: 390, height: 844, colorScheme: "dark" },
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const evidence = [];

for (const capture of captures) {
  const context = await browser.newContext({
    viewport: { width: capture.width, height: capture.height },
    colorScheme: capture.colorScheme,
  });
  await context.addInitScript(() => {
    sessionStorage.clear();
    localStorage.clear();
    Object.defineProperty(navigator, "deviceMemory", {
      configurable: true,
      get: () => 8,
    });
  });
  const page = await context.newPage();

  for (const origin of [posthogOrigin, posthogAssetOrigin]) {
    if (!origin) continue;
    await page.route(`${origin}/**`, (route) => route.abort("blockedbyclient"));
  }

  await page.goto(baseURL);
  await page.addStyleTag({
    content: "nextjs-portal { display: none !important; }",
  });
  const world = page.locator("[data-experience-world]");
  await page
    .locator("[data-persona-satire]")
    .waitFor({ state: "visible", timeout: 20_000 });
  await world.locator("canvas").waitFor({ state: "visible", timeout: 30_000 });
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-experience-world]")
        ?.getAttribute("data-scene-ready") === "true",
    undefined,
    { timeout: 30_000 },
  );
  await page.waitForTimeout(1_800);

  const facts = await page.evaluate(() => {
    const visibleCount = (needle) =>
      [...document.querySelectorAll("body *")].filter(
        (el) =>
          el.children.length === 0 &&
          el.textContent?.includes(needle) &&
          el.getClientRects().length > 0 &&
          getComputedStyle(el).visibility !== "hidden" &&
          el.getBoundingClientRect().width > 0,
      ).length;
    return {
      worldCount: document.querySelectorAll("[data-experience-world]").length,
      sceneReady:
        document
          .querySelector("[data-experience-world]")
          ?.getAttribute("data-scene-ready") === "true",
      mainCount: document.querySelectorAll("main").length,
      h1Count: document.querySelectorAll("h1").length,
      primaryCtaCount: document.querySelectorAll("a[data-primary-cta]").length,
      delhiCount: visibleCount("DELHI"),
    };
  });

  await page.screenshot({ path: resolve(output, capture.name) });
  evidence.push({
    name: capture.name,
    width: capture.width,
    height: capture.height,
    colorScheme: capture.colorScheme,
    ...facts,
  });
  await context.close();
}

await browser.close();
await writeFile(
  resolve(output, "capture-facts.json"),
  `${JSON.stringify(evidence, null, 2)}\n`,
);
console.log(JSON.stringify(evidence, null, 2));
