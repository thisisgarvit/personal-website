import AxeBuilder from "@axe-core/playwright";
import { chromium, firefox, webkit } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Gate F release-candidate evidence harness (plan Task 9 Steps 4–6).
 *
 * Produces, under docs/qa/immersive/gate-f/:
 *  - the four core captures: home at 1440x900 and 390x844, light + dark,
 *    each with console/pageerror/axe/overflow/CTA facts (chromium);
 *  - failure-path captures with reachability proof (chromium): JS
 *    disabled, storage denied, WebGL denied, live WebGL context loss,
 *    and Save-Data — every project link and both CTAs must survive each;
 *  - a cross-engine reachability matrix (chromium + firefox + webkit,
 *    desktop 1440x900 and mobile 390x844): render, scene/fallback state,
 *    four case links, two CTAs, case navigation round-trip, plus a
 *    per-engine WebGL-denied poster check;
 *  - LCP/CLS/INP measurements on mobile emulation vs PRD ceilings;
 *  - rc-facts.json with every measurement.
 *
 * Usage: GATE_F_URL=http://localhost:3199 node scripts/capture-gate-f.mjs
 */

const baseURL = process.env.GATE_F_URL ?? "http://localhost:3199";
const output = resolve(process.env.GATE_F_OUT ?? "docs/qa/immersive/gate-f");
const configuredPostHogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogOrigin = configuredPostHogHost
  ? new URL(configuredPostHogHost).origin
  : null;
const posthogAssetOrigin = posthogOrigin?.replace(
  ".i.posthog.com",
  "-assets.i.posthog.com",
);

const CASE_ROUTES = [
  "/work/stay-portal",
  "/work/maxie",
  "/work/agentic-calendar",
  "/notes/dynamic-island",
];

await mkdir(output, { recursive: true });
const facts = { core: [], failures: [], engines: [], vitals: null };

function watchErrors(page, sink) {
  page.on("pageerror", (error) => sink.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    // The harness aborts PostHog requests itself; blocked-resource logs
    // are harness noise, not app errors (same policy as the D3 matrix).
    // Chromium reports the abort as ERR_BLOCKED_BY_CLIENT; Firefox
    // surfaces the same abort as a CORS failure on the PostHog origin.
    if (message.text().includes("ERR_BLOCKED_BY_CLIENT")) return;
    if (
      message.text().includes("Cross-Origin Request Blocked") &&
      message.text().includes("posthog.com")
    )
      return;
    sink.push(`console: ${message.text()}`);
  });
}

async function blockPostHog(page) {
  for (const origin of [posthogOrigin, posthogAssetOrigin]) {
    if (!origin) continue;
    await page.route(`${origin}/**`, (route) => route.abort("blockedbyclient"));
  }
}

async function newContext(browser, options = {}, init = {}) {
  const context = await browser.newContext(options);
  if (options.javaScriptEnabled !== false) {
    await context.addInitScript(() => {
      try {
        sessionStorage.clear();
        localStorage.clear();
      } catch {
        /* storage-denied run */
      }
      Object.defineProperty(navigator, "deviceMemory", {
        configurable: true,
        get: () => 8,
      });
    });
  }
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
  if (init.storageDenied) {
    await context.addInitScript(() => {
      const deny = {
        get length() {
          throw new DOMException("denied", "SecurityError");
        },
        key() {
          throw new DOMException("denied", "SecurityError");
        },
        getItem() {
          throw new DOMException("denied", "SecurityError");
        },
        setItem() {
          throw new DOMException("denied", "SecurityError");
        },
        removeItem() {
          throw new DOMException("denied", "SecurityError");
        },
        clear() {
          throw new DOMException("denied", "SecurityError");
        },
      };
      Object.defineProperty(window, "sessionStorage", {
        configurable: true,
        get: () => deny,
      });
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get: () => deny,
      });
    });
  }
  return context;
}

async function settle(page, { expectScene, js = true }) {
  await page.goto(baseURL);
  if (!js) {
    await page.waitForTimeout(600);
    return;
  }
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
  return page.evaluate((caseRoutes) => {
    const links = [...document.querySelectorAll("a[href]")].map((a) =>
      a.getAttribute("href"),
    );
    return {
      fallback: document
        .querySelector("[data-experience-world]")
        ?.getAttribute("data-world-fallback"),
      sceneReady: document
        .querySelector("[data-experience-world]")
        ?.getAttribute("data-scene-ready"),
      canvasCount: document.querySelectorAll("[data-world-canvas] canvas")
        .length,
      posterVisible:
        document.querySelector("[data-world-poster]") != null &&
        getComputedStyle(document.querySelector("[data-world-poster]"))
          .opacity === "1",
      caseLinksPresent: caseRoutes.filter((route) => links.includes(route)),
      resumeCta: links.includes("/Garvit-Sukhija-Product-Resume.pdf"),
      contactCta: links.some((href) => href?.startsWith("mailto:")),
      horizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    };
  }, CASE_ROUTES);
}

async function axeSummary(page) {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations
    .filter(({ impact }) => impact === "critical" || impact === "serious")
    .map(({ id, impact }) => `${id} (${impact})`);
}

/**
 * Navigate to one case route and back; proves CTA/case links work.
 * With JS, a board ticket click opens the case-preview dialog first
 * (the designed interaction) — follow its "Read full case" link. On
 * mobile only the active column's tickets are visible, so use the
 * first visible case link.
 */
async function caseRoundTrip(page) {
  const selector = CASE_ROUTES.map((route) => `a[href="${route}"]`).join(", ");
  const link = page.locator(selector).locator("visible=true").first();
  await link.scrollIntoViewIfNeeded();
  const target = await link.getAttribute("href");
  await link.click();
  const fullCase = page.getByRole("link", { name: /Read full case/ });
  try {
    await fullCase.waitFor({ state: "visible", timeout: 4_000 });
    await fullCase.click();
  } catch {
    // Direct navigation (no preview dialog on this surface).
  }
  await page.waitForURL(`**${target}`, { timeout: 20_000 });
  const caseH1 = await page.locator("h1").first().textContent();
  await page.goBack();
  await page.waitForURL(`${baseURL}/`);
  return { target, caseH1: caseH1?.trim().slice(0, 60) ?? null };
}

// ------------------------------------------------ 1. four core captures
{
  const browser = await chromium.launch({ headless: true });
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    for (const colorScheme of ["light", "dark"]) {
      const context = await newContext(browser, { viewport, colorScheme });
      const page = await context.newPage();
      const errors = [];
      watchErrors(page, errors);
      await blockPostHog(page);
      await settle(page, { expectScene: true });
      const name = `home-${viewport.width}x${viewport.height}-${colorScheme}.png`;
      await page.screenshot({ path: resolve(output, name) });
      facts.core.push({
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
  await browser.close();
}

// ------------------------------------------------ 2. failure paths
{
  const browser = await chromium.launch({ headless: true });
  const runs = [
    { name: "failure-no-js", context: { javaScriptEnabled: false }, js: false },
    { name: "failure-storage-denied", init: { storageDenied: true } },
    { name: "failure-webgl-denied", init: { webglFailure: true } },
    { name: "failure-save-data", init: { saveData: true } },
  ];
  for (const run of runs) {
    const context = await newContext(
      browser,
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
    const requests = [];
    page.on("request", (request) => requests.push(request.url()));
    // Storage-denied still mounts the live scene; the others fall back.
    const expectScene = run.name === "failure-storage-denied";
    await settle(page, { expectScene, js: run.js !== false });
    await page.screenshot({ path: resolve(output, `${run.name}.png`) });
    const base = await pageFacts(page);
    let roundTrip = null;
    if (run.js === false) {
      // No-JS: navigation is full-page; prove the case route serves.
      await page.click(`a[href="${CASE_ROUTES[1]}"]`);
      await page.waitForURL(`**${CASE_ROUTES[1]}`);
      roundTrip = {
        target: CASE_ROUTES[1],
        caseH1: (await page.locator("h1").first().textContent())
          ?.trim()
          .slice(0, 60),
      };
      await page.screenshot({
        path: resolve(output, `${run.name}-case.png`),
      });
    } else {
      roundTrip = await caseRoundTrip(page);
    }
    facts.failures.push({
      name: run.name,
      ...base,
      roundTrip,
      glbRequests: requests.filter((url) => /guide\.glb/i.test(url)).length,
      errors,
    });
    await context.close();
  }

  // Live WebGL context loss: scene up, then force-lose the context.
  {
    const context = await newContext(browser, {
      viewport: { width: 1440, height: 900 },
      colorScheme: "light",
    });
    const page = await context.newPage();
    const errors = [];
    watchErrors(page, errors);
    await blockPostHog(page);
    await page.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await settle(page, { expectScene: true });
    const before = await pageFacts(page);
    const clsBefore = await page.evaluate(() => window.__cls);
    await page.evaluate(() => {
      const canvas = document.querySelector("[data-world-canvas] canvas");
      const gl =
        canvas?.getContext("webgl2") ?? canvas?.getContext("webgl") ?? null;
      const ext = gl?.getExtension("WEBGL_lose_context");
      if (ext) ext.loseContext();
      else canvas?.dispatchEvent(new Event("webglcontextlost"));
    });
    await page.waitForFunction(
      () =>
        document
          .querySelector("[data-experience-world]")
          ?.getAttribute("data-world-fallback") !== "none",
      undefined,
      { timeout: 10_000 },
    );
    await page.waitForTimeout(700);
    const after = await pageFacts(page);
    const clsAfter = await page.evaluate(() => window.__cls);
    await page.screenshot({
      path: resolve(output, "failure-context-loss.png"),
    });
    const roundTrip = await caseRoundTrip(page);
    facts.failures.push({
      name: "failure-context-loss",
      before: {
        fallback: before.fallback,
        canvasCount: before.canvasCount,
      },
      ...after,
      handoffLayoutShift: Number((clsAfter - clsBefore).toFixed(4)),
      roundTrip,
      errors,
    });
    await context.close();
  }
  await browser.close();
}

// ------------------------------------------------ 3. cross-engine matrix
for (const [engineName, engine] of [
  ["chromium", chromium],
  ["firefox", firefox],
  ["webkit", webkit],
]) {
  const browser = await engine.launch({ headless: true });
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    const context = await newContext(browser, {
      viewport,
      colorScheme: "light",
    });
    const page = await context.newPage();
    const errors = [];
    watchErrors(page, errors);
    await blockPostHog(page);
    await settle(page, { expectScene: true });
    const name = `engine-${engineName}-${viewport.width}.png`;
    await page.screenshot({ path: resolve(output, name) });
    const base = await pageFacts(page);
    const roundTrip = await caseRoundTrip(page);
    facts.engines.push({ engine: engineName, ...viewport, name, ...base, roundTrip, errors });
    await context.close();
  }
  // Per-engine WebGL-denied poster check (desktop only).
  {
    const context = await newContext(
      browser,
      { viewport: { width: 1440, height: 900 }, colorScheme: "light" },
      { webglFailure: true },
    );
    const page = await context.newPage();
    const errors = [];
    watchErrors(page, errors);
    await blockPostHog(page);
    const requests = [];
    page.on("request", (request) => requests.push(request.url()));
    await settle(page, { expectScene: false });
    facts.engines.push({
      engine: engineName,
      name: `webgl-denied (${engineName})`,
      ...(await pageFacts(page)),
      glbRequests: requests.filter((url) => /guide\.glb/i.test(url)).length,
      errors,
    });
    await context.close();
  }
  await browser.close();
}

// ------------------------------------------------ 4. web vitals (mobile)
{
  const browser = await chromium.launch({ headless: true });
  const context = await newContext(browser, {
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
  await browser.close();
}

await writeFile(
  resolve(output, "rc-facts.json"),
  `${JSON.stringify(facts, null, 2)}\n`,
);

const reachabilityOk = (row) =>
  row.caseLinksPresent?.length === CASE_ROUTES.length &&
  row.resumeCta &&
  row.contactCta;
const coreBad = facts.core.filter(
  (row) =>
    row.errors.length ||
    row.axeBlocking.length ||
    row.horizontalOverflow ||
    !reachabilityOk(row),
);
const failureBad = facts.failures.filter(
  (row) => row.errors.length || !reachabilityOk(row),
);
const engineBad = facts.engines.filter(
  (row) => row.errors.length || !reachabilityOk(row),
);
console.log(
  JSON.stringify(
    {
      coreCaptures: facts.core.length,
      coreClean: facts.core.length - coreBad.length,
      coreBad,
      failureRuns: facts.failures.length,
      failureClean: facts.failures.length - failureBad.length,
      failureBad,
      engineRuns: facts.engines.length,
      engineClean: facts.engines.length - engineBad.length,
      engineBad,
      vitals: facts.vitals,
    },
    null,
    2,
  ),
);
