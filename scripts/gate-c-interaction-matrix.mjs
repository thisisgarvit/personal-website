/**
 * Gate C — Deliverable 2: interaction matrix evidence on /dev/world.
 *
 * Produces (into docs/qa/immersive/gate-c/):
 *  - Normal-speed .webm recordings: pointer look tracking (with
 *    interruption + settle), wave settle, scene-target change with
 *    mid-flight interruption, reaction sequence via the labelled test
 *    controls, and ship fired mid-wave (reaction interruption).
 *    Slowed 0.25x reviews are generated afterwards with ffmpeg
 *    (setpts=4*PTS) by scripts/gate-c-slow-motion.sh — same frames,
 *    quarter speed.
 *  - Attribute timelines (JSON) sampled during each recording so the
 *    gesture/reaction/scene arbitration is reviewable numerically.
 *  - State captures: Save-Data fallback, performance-kill fallback,
 *    WebGL-disabled (renderer-failure) fallback.
 *  - Console-error assertion across the live session and axe scans in
 *    light + dark (serious/critical must be empty).
 *
 * Usage: node scripts/gate-c-interaction-matrix.mjs
 *   env GATE_C_URL (default http://localhost:3120)
 */
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";
import { mkdir, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const baseURL = process.env.GATE_C_URL ?? "http://localhost:3120";
const output = resolve("docs/qa/immersive/gate-c");
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = { recordings: [], captures: [], console: {}, axe: {} };

const highMemory = (context) =>
  context.addInitScript(() => {
    Object.defineProperty(navigator, "deviceMemory", {
      configurable: true,
      get: () => 8,
    });
  });

async function liveContext({ record = false } = {}) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "light",
    ...(record
      ? { recordVideo: { dir: output, size: { width: 1440, height: 900 } } }
      : {}),
  });
  await highMemory(context);
  return context;
}

async function waitLive(page) {
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
}

function startTimeline(page) {
  const samples = [];
  const timer = setInterval(async () => {
    try {
      const sample = await page.evaluate(() => {
        const canvas = document.querySelector("[data-world-canvas] canvas");
        if (!canvas) return null;
        const data = canvas.dataset;
        return {
          t: Math.round(performance.now()),
          scene: data.guideScene,
          gesture: data.guideGesture,
          reaction: data.guideReaction,
          playing: data.guidePlaying,
          frame: Number(data.guideFrame),
          position: data.guidePosition,
          drawCalls: Number(data.guideDrawCalls),
        };
      });
      if (sample) samples.push(sample);
    } catch {
      /* page closing */
    }
  }, 100);
  return {
    stop: () => {
      clearInterval(timer);
      return samples;
    },
  };
}

async function finishRecording(page, context, name, shows, timeline) {
  const samples = timeline.stop();
  const video = page.video();
  await context.close();
  const source = await video.path();
  await rename(source, resolve(output, `${name}.webm`));
  await writeFile(
    resolve(output, `${name}-timeline.json`),
    `${JSON.stringify(samples, null, 2)}\n`,
  );
  results.recordings.push({ file: `${name}.webm`, shows });
  console.log(`recorded ${name}.webm (${samples.length} samples)`);
}

// ---------------------------------------------------------------- console log
const consoleErrors = [];

async function trackedPage(context) {
  const page = await context.newPage();
  page.on("pageerror", (error) =>
    consoleErrors.push(`pageerror: ${error.message}`),
  );
  page.on("console", (message) => {
    if (message.type() === "error")
      consoleErrors.push(`console: ${message.text()}`);
  });
  return page;
}

// ------------------------------------------------- 1. pointer look tracking
{
  const context = await liveContext({ record: true });
  const page = await trackedPage(context);
  await page.goto(`${baseURL}/dev/world`);
  await waitLive(page);
  await page.waitForTimeout(2_200); // let the mount wave finish first
  const timeline = startTimeline(page);
  // smooth sweep …
  for (let step = 0; step <= 50; step += 1) {
    await page.mouse.move(
      220 + step * 20,
      220 + Math.sin(step / 5) * 200,
      { steps: 3 },
    );
    await page.waitForTimeout(40);
  }
  // … abrupt interruption: jump to the opposite corner mid-track …
  await page.mouse.move(180, 780, { steps: 2 });
  await page.waitForTimeout(700);
  await page.mouse.move(1_280, 200, { steps: 2 });
  // … then stop and let the look settle to idle glance.
  await page.waitForTimeout(2_400);
  await finishRecording(
    page,
    context,
    "look-tracking-normal",
    "Fine-pointer head/torso look tracking a smooth sweep, an abrupt corner jump (interruption from current presentation values), then settle toward the idle glance.",
    timeline,
  );
}

// ------------------------------------------------------------ 2. wave settle
{
  const context = await liveContext({ record: true });
  const page = await trackedPage(context);
  const timeline = startTimeline(page);
  await page.goto(`${baseURL}/dev/world`);
  await waitLive(page);
  await page.waitForTimeout(4_000); // wave (~1.65s) + settle back to idle
  await finishRecording(
    page,
    context,
    "wave-settle-normal",
    "One wave on session mount, then spring settle into the idle hero composition. Timeline shows gesture wave->idle.",
    timeline,
  );
}

// ------------------------- 3. scene-target change with mid-flight interruption
{
  const context = await liveContext({ record: true });
  const page = await trackedPage(context);
  await page.goto(`${baseURL}/dev/world`);
  await waitLive(page);
  await page.waitForTimeout(2_400);
  const timeline = startTimeline(page);
  await page.getByLabel("Board scene test controls").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1_400); // travel hero -> board
  await page.getByLabel("Journey scene test controls").scrollIntoViewIfNeeded();
  await page.waitForTimeout(220); // interrupt mid-flight …
  await page.getByLabel("Board scene test controls").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1_800); // … re-grab toward board from current values
  await finishRecording(
    page,
    context,
    "scene-target-interrupt-normal",
    "Scene target travel hero->board, journey target grabbed mid-flight, then interrupted back to board — springs continue from current presentation values (see position timeline; no snap to scene origin).",
    timeline,
  );
}

// ------------------- 4. reaction sequence via labelled dev test controls
{
  const context = await liveContext({ record: true });
  const page = await trackedPage(context);
  await page.goto(`${baseURL}/dev/world`);
  await waitLive(page);
  await page.getByLabel("Board scene test controls").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const timeline = startTimeline(page);
  await page.getByRole("button", { name: "Start ticket drag" }).click();
  await page.waitForTimeout(1_200);
  await page.getByRole("button", { name: "Trigger incident" }).click();
  await page.waitForTimeout(1_200);
  await page.getByRole("button", { name: "End ticket drag" }).click();
  await page.waitForTimeout(1_200);
  await page.getByRole("button", { name: "Resolve incident" }).click();
  await page.waitForTimeout(2_200); // resolution then reaction settles to idle
  await finishRecording(
    page,
    context,
    "reaction-sequence-normal",
    "Test-control arbitration: drag-watch -> incident held while dragging -> pager-check on drag end -> resolution -> settle to idle.",
    timeline,
  );
}

// --------------------------- 5. reaction interruption: ship fired mid-wave
{
  const context = await liveContext({ record: true });
  const page = await trackedPage(context);
  const timeline = startTimeline(page);
  await page.goto(`${baseURL}/dev/world`);
  await waitLive(page);
  // The wave runs for ~1.65s from first frame; fire the ship signal while
  // it is still in flight WITHOUT scrolling (DOM click on the labelled
  // journey control) so the reaction interrupts the wave arbitration.
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find(
      (node) => node.textContent?.trim() === "Ship ticket",
    );
    button?.click();
  });
  await page.waitForTimeout(4_200); // wave ends -> ship-celebration -> settle
  await finishRecording(
    page,
    context,
    "ship-mid-wave-interrupt-normal",
    "Ship signal fired ~0.4s into the mount wave. Timeline shows reaction=shipped queued during gesture=wave, then ship-celebration taking over from current pose values and settling.",
    timeline,
  );
}

// ------------------------------------------------------- state captures (PNG)
async function fallbackCapture(name, reason, setup, launchOptions) {
  const local = launchOptions
    ? await chromium.launch({ headless: true, ...launchOptions })
    : browser;
  const context = await local.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "light",
  });
  await highMemory(context);
  if (setup) await setup(context);
  const page = await trackedPage(context);
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto(`${baseURL}/dev/world`);
  await page.waitForFunction(
    (expected) =>
      document
        .querySelector("[data-experience-world]")
        ?.getAttribute("data-world-fallback") === expected,
    reason,
    { timeout: 30_000 },
  );
  await page.waitForTimeout(600);
  const file = `${name}.png`;
  await page.screenshot({ path: resolve(output, file) });
  const state = await page.evaluate(() => {
    const world = document.querySelector("[data-experience-world]");
    const poster = document.querySelector("[data-world-poster]");
    return {
      fallback: world?.getAttribute("data-world-fallback"),
      sceneReady: world?.getAttribute("data-scene-ready"),
      canvasCount: document.querySelectorAll("[data-world-canvas]").length,
      posterOpacity: poster ? getComputedStyle(poster).opacity : null,
      posterImage: poster
        ? getComputedStyle(poster).backgroundImage.replace(location.origin, "")
        : null,
    };
  });
  const glbRequested = requests.some((url) => /guide\.glb/.test(url));
  results.captures.push({ file, reason, ...state, glbRequested });
  console.log(`captured ${file}`, state, { glbRequested });
  await context.close();
  if (launchOptions) await local.close();
}

await fallbackCapture(
  "save-data-fallback-light-1440x900",
  "save-data",
  (context) =>
    context.addInitScript(() => {
      const connection = new EventTarget();
      Object.defineProperty(connection, "saveData", { get: () => true });
      Object.defineProperty(navigator, "connection", {
        configurable: true,
        get: () => connection,
      });
    }),
);

await fallbackCapture(
  "performance-kill-fallback-light-1440x900",
  "performance-kill",
  (context) =>
    context.addInitScript(() => {
      const applyKill = () => {
        if (document.documentElement)
          document.documentElement.dataset.effectsDisabled = "true";
      };
      applyKill();
      document.addEventListener("readystatechange", applyKill);
      new MutationObserver(applyKill).observe(document, { childList: true });
    }),
);

await fallbackCapture(
  "webgl-disabled-fallback-light-1440x900",
  "renderer-failure",
  null,
  { args: ["--disable-webgl", "--disable-webgl2"] },
);

// -------------------------------------------------------------- console + axe
results.console = {
  errors: consoleErrors,
  pass: consoleErrors.length === 0,
};

for (const theme of ["light", "dark"]) {
  const context = await liveContext();
  const page = await context.newPage();
  await page.emulateMedia({ colorScheme: theme });
  await page.goto(`${baseURL}/dev/world`);
  await waitLive(page);
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
  await context.close();
}

await writeFile(
  resolve(output, "interaction-matrix.json"),
  `${JSON.stringify(results, null, 2)}\n`,
);
console.log(JSON.stringify(results, null, 2));
await browser.close();
