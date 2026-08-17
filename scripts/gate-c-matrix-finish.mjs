/**
 * Gate C — completion pass for the interaction matrix: the WebGL-disabled
 * capture (which does NOT reach the `renderer-failure` fallback state —
 * documented finding), console assertion, and axe scans, merged with the
 * recording/capture results from scripts/gate-c-interaction-matrix.mjs
 * into interaction-matrix.json.
 *
 * Usage: node scripts/gate-c-matrix-finish.mjs
 *   env GATE_C_URL (default http://localhost:3120)
 */
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const baseURL = process.env.GATE_C_URL ?? "http://localhost:3120";
const output = resolve("docs/qa/immersive/gate-c");

const results = {
  recordings: [
    {
      file: "look-tracking-normal.webm",
      shows:
        "Fine-pointer head/torso look tracking a smooth sweep, an abrupt corner jump (interruption from current presentation values), then settle toward the idle glance.",
    },
    {
      file: "wave-settle-normal.webm",
      shows:
        "One wave on session mount, then spring settle into the idle hero composition. Timeline JSON shows gesture wave->idle.",
    },
    {
      file: "scene-target-interrupt-normal.webm",
      shows:
        "Scene target travel hero->board, journey target grabbed mid-flight, then interrupted back to board — springs continue from current presentation values (see position timeline; no snap to scene origin).",
    },
    {
      file: "reaction-sequence-normal.webm",
      shows:
        "Test-control arbitration: drag-watch -> incident held while dragging -> pager-check on drag end -> resolution -> settle to idle.",
    },
    {
      file: "ship-mid-wave-interrupt-normal.webm",
      shows:
        "Ship signal fired ~0.4s into the mount wave. Timeline shows reaction=shipped queued during gesture=wave, then ship-celebration taking over from current pose values and settling.",
    },
  ],
  captures: [
    {
      file: "save-data-fallback-light-1440x900.png",
      reason: "save-data",
      fallback: "save-data",
      sceneReady: "false",
      canvasCount: 0,
      posterOpacity: "1",
      posterImage: 'url("/images/world/guide-light.webp")',
      glbRequested: false,
    },
    {
      file: "performance-kill-fallback-light-1440x900.png",
      reason: "performance-kill",
      fallback: "performance-kill",
      sceneReady: "false",
      canvasCount: 0,
      posterOpacity: "1",
      posterImage: 'url("/images/world/guide-light.webp")',
      glbRequested: false,
    },
  ],
  console: {},
  axe: {},
};

const browser = await chromium.launch({ headless: true });

const highMemory = (context) =>
  context.addInitScript(() => {
    Object.defineProperty(navigator, "deviceMemory", {
      configurable: true,
      get: () => 8,
    });
  });

// ------------------------------ WebGL disabled at context-creation time
{
  const local = await chromium.launch({
    headless: true,
    args: ["--disable-webgl", "--disable-webgl2"],
  });
  const context = await local.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "light",
  });
  await highMemory(context);
  const page = await context.newPage();
  const consoleLines = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleLines.push(message.text());
  });
  await page.goto(`${baseURL}/dev/world`);
  await page.waitForTimeout(10_000); // idle import + renderer attempt
  const file = "webgl-disabled-fallback-light-1440x900.png";
  await page.screenshot({ path: resolve(output, file) });
  const state = await page.evaluate(() => {
    const world = document.querySelector("[data-experience-world]");
    const poster = document.querySelector("[data-world-poster]");
    return {
      fallback: world?.getAttribute("data-world-fallback"),
      sceneReady: world?.getAttribute("data-scene-ready"),
      canvasLayers: document.querySelectorAll("[data-world-canvas]").length,
      posterOpacity: poster ? getComputedStyle(poster).opacity : null,
      ctasVisible: document.querySelectorAll("a[data-primary-cta]").length,
    };
  });
  results.captures.push({
    file,
    reason: "webgl-context-creation-failure (--disable-webgl)",
    ...state,
    threeConsoleErrors: consoleLines.filter((line) =>
      /WebGL context/.test(line),
    ).length,
    finding:
      "Poster stays visible and content/CTAs remain intact (no layout shift), but data-world-fallback stays 'none' and data-scene-ready stays 'false': a context-CREATION failure inside the R3F Canvas is logged by three.js yet never reaches setRendererFailed — WorldBoundary only catches render-phase throws and the onCreated webglcontextlost listener is never installed. Context LOSS after creation does reach renderer-failure (see renderer-failure-light-1440x900.png).",
  });
  console.log("captured", file, state);
  await context.close();
  await local.close();
}

// -------------------------------------------------------------- console + axe
{
  const consoleErrors = [];
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "light",
  });
  await highMemory(context);
  const page = await context.newPage();
  page.on("pageerror", (error) =>
    consoleErrors.push(`pageerror: ${error.message}`),
  );
  page.on("console", (message) => {
    if (message.type() === "error")
      consoleErrors.push(`console: ${message.text()}`);
  });
  await page.goto(`${baseURL}/dev/world`);
  await page
    .locator("[data-world-canvas] canvas")
    .waitFor({ state: "visible", timeout: 30_000 });
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-experience-world]")
        ?.getAttribute("data-scene-ready") === "true",
    undefined,
    { timeout: 30_000 },
  );
  // Exercise the interactive surface while listening for errors.
  await page.mouse.move(700, 400, { steps: 10 });
  await page.getByLabel("Board scene test controls").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Start ticket drag" }).click();
  await page.getByRole("button", { name: "End ticket drag" }).click();
  await page.getByLabel("Journey scene test controls").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Ship ticket" }).click();
  await page.waitForTimeout(1_500);
  results.console = { errors: consoleErrors, pass: consoleErrors.length === 0 };
  await context.close();
}

for (const theme of ["light", "dark"]) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: theme,
  });
  await highMemory(context);
  const page = await context.newPage();
  await page.goto(`${baseURL}/dev/world`);
  await page
    .locator("[data-world-canvas] canvas")
    .waitFor({ state: "visible", timeout: 30_000 });
  if (theme === "dark") {
    await page.getByLabel("Toggle dark mode").check();
    await page.waitForTimeout(300);
  }
  const scan = await new AxeBuilder({ page }).analyze();
  const blocking = scan.violations.filter(
    ({ impact }) => impact === "critical" || impact === "serious",
  );
  results.axe[theme] = {
    blocking: blocking.map(({ id, impact, help }) => ({ id, impact, help })),
    needsReview: scan.violations
      .filter(({ impact }) => impact !== "critical" && impact !== "serious")
      .map(({ id, impact, help }) => ({ id, impact, help })),
    pass: blocking.length === 0,
  };
  console.log(`axe ${theme}: blocking=${blocking.length}`);
  await context.close();
}

await writeFile(
  resolve(output, "interaction-matrix.json"),
  `${JSON.stringify(results, null, 2)}\n`,
);
console.log(JSON.stringify(results.console, null, 2));
console.log(JSON.stringify(results.axe, null, 2));
await browser.close();
