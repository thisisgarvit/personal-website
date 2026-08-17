/**
 * Gate C — Deliverable 1: real renderer measurement on /dev/world.
 *
 * Measures draw calls / triangles / textures / programs in the production
 * R3F renderer two independent ways:
 *
 *  1. The prototype's own diagnostics: GuideScene disables `gl.info`
 *     autoReset and writes `data-guide-draw-calls` (three.js
 *     WebGLRenderer.info.render.calls) onto the canvas after every
 *     rendered frame — authoritative three-side count.
 *  2. Harness-side instrumentation injected via addInitScript BEFORE any
 *     page script runs: WebGL(2)RenderingContext.prototype draw* methods
 *     are wrapped to bucket calls + triangles per animation frame, and
 *     create/delete Texture/Program/Buffer/VertexArray are counted for
 *     live GPU object totals. Zero product-source modification.
 *
 * Also records GLB + poster transfer bytes from the network log and
 * proves the demand frameloop pauses on document-hidden via the
 * `data-guide-frame` counter.
 *
 * Usage: node scripts/gate-c-renderer-measure.mjs
 *   env GATE_C_URL (default http://localhost:3120)
 * Output: docs/qa/immersive/gate-c/renderer-stats.json
 */
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const baseURL = process.env.GATE_C_URL ?? "http://localhost:3120";
const output = resolve("docs/qa/immersive/gate-c");
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: "light",
});

await context.addInitScript(() => {
  Object.defineProperty(navigator, "deviceMemory", {
    configurable: true,
    get: () => 8,
  });
});

// Harness-side GL instrumentation (installed before any page script).
await context.addInitScript(() => {
  const stats = {
    buckets: [],
    current: null,
    textures: 0,
    programs: 0,
    buffers: 0,
    vaos: 0,
    contexts: 0,
  };
  window.__GATE_C_GL = stats;
  const trisFor = (gl, mode, count) => {
    if (mode === gl.TRIANGLES) return count / 3;
    if (mode === gl.TRIANGLE_STRIP || mode === gl.TRIANGLE_FAN)
      return Math.max(0, count - 2);
    return 0;
  };
  const record = (gl, mode, count, instances) => {
    if (!stats.current)
      stats.current = { calls: 0, triangles: 0, at: performance.now() };
    stats.current.calls += 1;
    stats.current.triangles += trisFor(gl, mode, count) * instances;
  };
  const wrap = (proto) => {
    if (!proto) return;
    const patch = (name, before) => {
      const original = proto[name];
      if (typeof original !== "function") return;
      proto[name] = function (...args) {
        before(this, args);
        return original.apply(this, args);
      };
    };
    patch("drawElements", (gl, [mode, count]) => record(gl, mode, count, 1));
    patch("drawArrays", (gl, [mode, , count]) => record(gl, mode, count, 1));
    patch("drawElementsInstanced", (gl, [mode, count, , , n]) =>
      record(gl, mode, count, n ?? 1),
    );
    patch("drawArraysInstanced", (gl, [mode, , count, n]) =>
      record(gl, mode, count, n ?? 1),
    );
    patch("createTexture", () => (stats.textures += 1));
    patch("deleteTexture", () => (stats.textures -= 1));
    patch("createProgram", () => (stats.programs += 1));
    patch("deleteProgram", () => (stats.programs -= 1));
    patch("createBuffer", () => (stats.buffers += 1));
    patch("deleteBuffer", () => (stats.buffers -= 1));
    patch("createVertexArray", () => (stats.vaos += 1));
    patch("deleteVertexArray", () => (stats.vaos -= 1));
  };
  wrap(window.WebGL2RenderingContext?.prototype);
  wrap(window.WebGLRenderingContext?.prototype);
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (...args) {
    const ctx = originalGetContext.apply(this, args);
    if (ctx && /webgl/.test(String(args[0]))) stats.contexts += 1;
    return ctx;
  };
  // Close the per-frame bucket at every animation-frame boundary.
  const tick = () => {
    if (stats.current) {
      stats.buckets.push(stats.current);
      if (stats.buckets.length > 900) stats.buckets.shift();
      stats.current = null;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

const page = await context.newPage();
const transfers = [];
page.on("response", async (response) => {
  const url = response.url();
  if (!/guide\.glb|images\/world\/guide-(light|dark)\.webp/.test(url)) return;
  let bodyBytes = null;
  try {
    bodyBytes = (await response.body()).length;
  } catch {
    /* body may be unavailable for cached responses */
  }
  transfers.push({
    url: url.replace(baseURL, ""),
    status: response.status(),
    contentLength: response.headers()["content-length"] ?? null,
    contentEncoding: response.headers()["content-encoding"] ?? "identity",
    contentType: response.headers()["content-type"] ?? null,
    bodyBytes,
  });
});

await page.goto(`${baseURL}/dev/world`);
const world = page.locator("[data-experience-world]");
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

// Drive continuous rendering: pointer look sweep keeps the demand
// frameloop live so per-frame buckets are representative.
for (let step = 0; step <= 60; step += 1) {
  await page.mouse.move(
    300 + step * 12,
    250 + Math.sin(step / 6) * 160,
    { steps: 2 },
  );
  await page.waitForTimeout(30);
}
await page.waitForTimeout(300);

const measured = await page.evaluate(() => {
  const stats = window.__GATE_C_GL;
  const canvas = document.querySelector("[data-world-canvas] canvas");
  const buckets = stats.buckets.filter((bucket) => bucket.calls > 0);
  const maxCalls = Math.max(...buckets.map((bucket) => bucket.calls));
  const maxTriangles = Math.max(...buckets.map((bucket) => bucket.triangles));
  const steady = buckets.slice(-120);
  return {
    threeInfo: {
      drawCalls: Number(canvas?.dataset.guideDrawCalls ?? NaN),
      source:
        "three.js WebGLRenderer.info.render.calls exposed per-frame by GuideScene diagnostics (data-guide-draw-calls)",
    },
    harnessInstrumentation: {
      framesSampled: buckets.length,
      maxDrawCallsPerFrame: maxCalls,
      maxTrianglesPerFrame: maxTriangles,
      steadyStateDrawCalls: steady.map((bucket) => bucket.calls),
      steadyStateTriangles: [
        ...new Set(steady.map((bucket) => bucket.triangles)),
      ],
      liveTextures: stats.textures,
      livePrograms: stats.programs,
      liveBuffers: stats.buffers,
      liveVertexArrays: stats.vaos,
      webglContextsCreated: stats.contexts,
    },
    diagnostics: {
      scene: canvas?.dataset.guideScene,
      gesture: canvas?.dataset.guideGesture,
      playing: canvas?.dataset.guidePlaying,
      frame: Number(canvas?.dataset.guideFrame ?? NaN),
    },
    canvasCount: document.querySelectorAll("canvas").length,
  };
});

// Frameloop pause proof: hide the document, confirm the frame counter
// freezes; restore, confirm it advances again.
const pauseProof = await (async () => {
  const frameAt = () =>
    page.evaluate(
      () =>
        Number(
          document.querySelector("[data-world-canvas] canvas")?.dataset
            .guideFrame,
        ),
    );
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(150);
  const hiddenStart = await frameAt();
  await page.waitForTimeout(600);
  const hiddenEnd = await frameAt();
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "visible",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.mouse.move(500, 400, { steps: 4 });
  await page.waitForTimeout(400);
  const resumed = await frameAt();
  return {
    hiddenStartFrame: hiddenStart,
    hiddenEndFrame: hiddenEnd,
    framesWhileHidden: hiddenEnd - hiddenStart,
    resumedFrame: resumed,
    advancedAfterResume: resumed > hiddenEnd,
    passed: hiddenEnd === hiddenStart && resumed > hiddenEnd,
  };
})();

const fallbackAttr = await world.getAttribute("data-world-fallback");
const report = {
  capturedAt: new Date().toISOString(),
  url: `${baseURL}/dev/world`,
  viewport: "1440x900",
  fallback: fallbackAttr,
  ...measured,
  pauseProof,
  transfers,
  ceilings: {
    drawCalls: 30,
    triangles: 25_000,
    glbTransferredBytes: 1_887_437, // 1.8 MB
  },
};

await writeFile(
  resolve(output, "renderer-stats.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
