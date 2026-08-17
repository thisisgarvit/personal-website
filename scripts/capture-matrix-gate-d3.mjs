import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Gate D3 integrated capture + regression matrix (plan Task 8 Step 7).
 *
 * Produces, under docs/qa/immersive/gate-d/matrix/:
 *  - homepage first-viewport captures at 320/390/430/768/1024/1440/1600
 *    in light and dark, each with console/pageerror/axe/overflow facts;
 *  - fallback captures: reduced motion, reduced transparency, forced
 *    colors, Save-Data, WebGL failure;
 *  - keyboard-only pass evidence (focus travel to both CTAs);
 *  - LCP/CLS/INP measurements on mobile emulation vs PRD ceilings;
 *  - matrix-facts.json with every measurement.
 *
 * Usage: GATE_D3_URL=http://localhost:3121 node scripts/capture-matrix-gate-d3.mjs
 */

const baseURL = process.env.GATE_D3_URL ?? "http://localhost:3121";
const output = resolve(
  process.env.GATE_D3_OUT ?? "docs/qa/immersive/gate-d/matrix",
);
const configuredPostHogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogOrigin = configuredPostHogHost
  ? new URL(configuredPostHogHost).origin
  : null;
const posthogAssetOrigin = posthogOrigin?.replace(
  ".i.posthog.com",
  "-assets.i.posthog.com",
);

const VIEWPORTS = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1600, height: 1000 },
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const facts = { sweep: [], fallbacks: [], keyboard: null, vitals: null };

function watchErrors(page, sink) {
  page.on("pageerror", (error) => sink.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    // This harness aborts PostHog requests itself; the resulting
    // ERR_BLOCKED_BY_CLIENT resource logs are harness noise, not app
    // errors (same policy as capture-homepage-gate-d.mjs runs).
    if (message.text().includes("ERR_BLOCKED_BY_CLIENT")) return;
    sink.push(`console: ${message.text()}`);
  });
}

async function blockPostHog(page) {
  for (const origin of [posthogOrigin, posthogAssetOrigin]) {
    if (!origin) continue;
    await page.route(`${origin}/**`, (route) => route.abort("blockedbyclient"));
  }
}

async function newContext(options = {}, init = {}) {
  const context = await browser.newContext(options);
  await context.addInitScript(() => {
    sessionStorage.clear();
    localStorage.clear();
    Object.defineProperty(navigator, "deviceMemory", {
      configurable: true,
      get: () => 8,
    });
  });
  if (init.saveData) {
    await context.addInitScript(() => {
      const connection = new EventTarget();
      Object.defineProperty(connection, "saveData", { get: () => true });
      Object.defineProperty(navigator, "connection", {
        configurable: true,
        get: () => connection,
      });
    });
  }
  if (init.webglFailure) {
    await context.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function getContext(
        type,
        ...rest
      ) {
        if (typeof type === "string" && type.includes("webgl")) return null;
        return original.call(this, type, ...rest);
      };
    });
  }
  return context;
}

async function settle(page, { expectScene }) {
  await page.goto(baseURL);
  await page.addStyleTag({
    content: "nextjs-portal { display: none !important; }",
  });
  await page
    .locator("[data-persona-satire]")
    .waitFor({ state: "visible", timeout: 20_000 });
  if (expectScene) {
    await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
    await page.waitForFunction(
      () =>
        document
          .querySelector("[data-experience-world]")
          ?.getAttribute("data-scene-ready") === "true",
      undefined,
      { timeout: 30_000 },
    );
    await page.waitForTimeout(1_800);
  } else {
    await page.waitForTimeout(900);
  }
}

async function pageFacts(page) {
  return page.evaluate(() => ({
    fallback: document
      .querySelector("[data-experience-world]")
      ?.getAttribute("data-world-fallback"),
    sceneReady: document
      .querySelector("[data-experience-world]")
      ?.getAttribute("data-scene-ready"),
    canvasCount: document.querySelectorAll("[data-world-canvas] canvas")
      .length,
    mainCount: document.querySelectorAll("main").length,
    h1Count: document.querySelectorAll("h1").length,
    primaryCtaCount: document.querySelectorAll("a[data-primary-cta]").length,
    horizontalOverflow:
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth + 1,
  }));
}

async function axeSummary(page) {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter(
    ({ impact }) => impact === "critical" || impact === "serious",
  );
  return blocking.map(({ id, impact }) => `${id} (${impact})`);
}

// ------------------------------------------------ 1. viewport sweep
for (const viewport of VIEWPORTS) {
  for (const colorScheme of ["light", "dark"]) {
    const context = await newContext({ viewport, colorScheme });
    const page = await context.newPage();
    const errors = [];
    watchErrors(page, errors);
    await blockPostHog(page);
    await settle(page, { expectScene: true });
    const name = `home-${viewport.width}x${viewport.height}-${colorScheme}.png`;
    await page.screenshot({ path: resolve(output, name) });
    facts.sweep.push({
      name,
      ...viewport,
      colorScheme,
      ...(await pageFacts(page)),
      axeBlocking: await axeSummary(page),
      errors,
    });
    await context.close();
  }
}

// ------------------------------------------------ 1b. 200% text size
for (const viewport of [
  { width: 320, height: 720 },
  { width: 1440, height: 900 },
]) {
  const context = await newContext({ viewport, colorScheme: "light" });
  const page = await context.newPage();
  const errors = [];
  watchErrors(page, errors);
  await blockPostHog(page);
  await settle(page, { expectScene: true });
  await page.addStyleTag({ content: "html { font-size: 32px !important; }" });
  await page.waitForTimeout(500);
  const name = `home-${viewport.width}-200pct-light.png`;
  await page.screenshot({ path: resolve(output, name) });
  const boardName = `board-${viewport.width}-200pct-light.png`;
  await page.locator("#work-board").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: resolve(output, boardName) });
  facts.sweep.push({
    name: `${name} + ${boardName}`,
    ...viewport,
    colorScheme: "light",
    textSize: "200%",
    ...(await pageFacts(page)),
    axeBlocking: await axeSummary(page),
    errors,
  });
  await context.close();
}

// ------------------------------------------------ 2. fallback captures
const fallbackRuns = [
  {
    name: "fallback-reduced-motion",
    context: { reducedMotion: "reduce" },
    expectPoster: true,
  },
  { name: "fallback-save-data", init: { saveData: true }, expectPoster: true },
  {
    name: "fallback-webgl-failure",
    init: { webglFailure: true },
    expectPoster: true,
  },
  // Forced colors / reduced transparency are DOM-presentation modes, not
  // world fallbacks (capability policy): the live canvas stays.
  { name: "fallback-forced-colors", media: { forcedColors: true } },
  {
    name: "fallback-reduced-transparency",
    media: { reducedTransparency: true },
  },
];

/**
 * Known axe exception: under CDP forced-colors EMULATION axe computes
 * contrast from authored custom-property colors while the rendering is
 * UA-forced (see fallback-forced-colors.png — black on white). Real
 * forced-colors mode recolors text via CanvasText. Recorded, not fatal.
 */
const AXE_EMULATION_EXCEPTIONS = {
  "fallback-forced-colors": ["color-contrast (serious)"],
};

for (const run of fallbackRuns) {
  const context = await newContext(
    {
      viewport: { width: 1440, height: 900 },
      colorScheme: "light",
      ...(run.context ?? {}),
    },
    run.init ?? {},
  );
  const page = await context.newPage();
  const errors = [];
  watchErrors(page, errors);
  await blockPostHog(page);
  if (run.media) {
    const session = await context.newCDPSession(page);
    const features = [];
    if (run.media.forcedColors)
      features.push({ name: "forced-colors", value: "active" });
    if (run.media.reducedTransparency)
      features.push({
        name: "prefers-reduced-transparency",
        value: "reduce",
      });
    await session.send("Emulation.setEmulatedMedia", { features });
  }
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  await settle(page, { expectScene: false });
  await page.screenshot({ path: resolve(output, `${run.name}.png`) });
  // Footer parity: the poster must not veil the footer (D3 fix).
  await page.evaluate(() =>
    window.scrollTo(0, document.body.scrollHeight),
  );
  await page.waitForTimeout(500);
  await page.screenshot({ path: resolve(output, `${run.name}-footer.png`) });
  facts.fallbacks.push({
    name: run.name,
    ...(await pageFacts(page)),
    glbRequests: requests.filter((url) => /guide\.glb/i.test(url)).length,
    posterRequests: requests.filter((url) =>
      /images\/world\/guide-(light|dark)\.webp/i.test(url),
    ).length,
    axeBlocking: await axeSummary(page),
    errors,
  });
  await context.close();
}

// ------------------------------------------------ 3. keyboard evidence
{
  const context = await newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "light",
  });
  const page = await context.newPage();
  const errors = [];
  watchErrors(page, errors);
  await blockPostHog(page);
  await settle(page, { expectScene: true });
  const reached = [];
  for (let index = 0; index < 40; index += 1) {
    await page.keyboard.press("Tab");
    const marker = await page.evaluate(() => {
      const active = document.activeElement;
      if (!(active instanceof HTMLElement)) return "";
      return (
        active.id ||
        active.getAttribute("aria-label") ||
        active.textContent?.trim().slice(0, 40) ||
        active.tagName
      );
    });
    reached.push(marker);
    if (marker === "resume-cta") {
      await page.screenshot({
        path: resolve(output, "keyboard-focus-resume.png"),
      });
    }
    if (marker === "Contact Garvit") {
      await page.screenshot({
        path: resolve(output, "keyboard-focus-contact.png"),
      });
      break;
    }
  }
  facts.keyboard = {
    reached,
    hasResume: reached.includes("resume-cta"),
    hasContact: reached.includes("Contact Garvit"),
    errors,
  };
  await context.close();
}

// ------------------------------------------------ 4. web vitals (mobile)
{
  const context = await newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "light",
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
  });
  const page = await context.newPage();
  await blockPostHog(page);
  await page.addInitScript(() => {
    window.__vitals = { lcp: 0, cls: 0, inpCandidates: [] };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__vitals.lcp = Math.max(window.__vitals.lcp, entry.startTime);
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__vitals.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.interactionId) {
          window.__vitals.inpCandidates.push(entry.duration);
        }
      }
    }).observe({ type: "event", buffered: true, durationThreshold: 0 });
  });
  await settle(page, { expectScene: true });
  // Exercise the page: full scroll (world transitions + poster/canvas
  // handoff already happened), one tap interaction for INP signal.
  await page.mouse.wheel(0, 4200);
  await page.waitForTimeout(900);
  await page.mouse.wheel(0, -4200);
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: /^v/ }).first().click();
  await page.waitForTimeout(400);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1_000);
  facts.vitals = await page.evaluate(() => ({
    lcpMs: Math.round(window.__vitals.lcp),
    cls: Number(window.__vitals.cls.toFixed(4)),
    inpMsWorst: Math.round(Math.max(0, ...window.__vitals.inpCandidates)),
    interactionCount: window.__vitals.inpCandidates.length,
  }));
  facts.vitals.ceilings = { lcpMs: 2500, cls: 0.05, inp: "best-effort" };
  await context.close();
}

await browser.close();
await writeFile(
  resolve(output, "matrix-facts.json"),
  `${JSON.stringify(facts, null, 2)}\n`,
);

const sweepBad = facts.sweep.filter(
  (row) =>
    row.errors.length ||
    row.axeBlocking.length ||
    row.horizontalOverflow ||
    row.primaryCtaCount !== 2,
);
const fallbackBad = facts.fallbacks.filter((row) => {
  const expectPoster = fallbackRuns.find(
    (run) => run.name === row.name,
  )?.expectPoster;
  const unexpectedAxe = row.axeBlocking.filter(
    (id) => !(AXE_EMULATION_EXCEPTIONS[row.name] ?? []).includes(id),
  );
  return (
    row.errors.length ||
    unexpectedAxe.length ||
    (expectPoster && (row.glbRequests !== 0 || row.canvasCount !== 0))
  );
});
console.log(
  JSON.stringify(
    {
      sweepCaptures: facts.sweep.length,
      sweepClean: facts.sweep.length - sweepBad.length,
      sweepBad,
      fallbackCaptures: facts.fallbacks.length,
      fallbackClean: facts.fallbacks.length - fallbackBad.length,
      fallbackBad,
      keyboard: facts.keyboard && {
        hasResume: facts.keyboard.hasResume,
        hasContact: facts.keyboard.hasContact,
      },
      vitals: facts.vitals,
    },
    null,
    2,
  ),
);
