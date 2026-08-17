import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Gate D3 CORRECTION round — integrated guide-motion evidence
 * (correction 4) on the PUBLIC homepage production build.
 *
 * Produces, under docs/qa/immersive/gate-d/motion/:
 *  - stills at 1440x900 and 390x844, light + dark, at the BOARD scene
 *    and the JOURNEY scene (guide settled at its scene positions);
 *  - full hero→board→journey scroll video including ONE board
 *    interaction (a real grip drag), at normal speed plus a 0.25x
 *    ffmpeg re-timed copy (Gate C recipe: setpts=4*PTS);
 *  - motion-facts.json: per-capture guide screen bounds (QA evidence
 *    opt-in), bounding boxes for board tabs / grips / tickets / preview
 *    dialog / funnel bars / insights card, the overlap decision for
 *    each, and the stage-beneath stacking proof.
 *
 * Usage: GATE_D3C_URL=http://localhost:3131 node scripts/capture-motion-gate-d3c.mjs
 */

const baseURL = process.env.GATE_D3C_URL ?? "http://localhost:3131";
const output = resolve(
  process.env.GATE_D3C_OUT ?? "docs/qa/immersive/gate-d/motion",
);
const configuredPostHogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogOrigin = configuredPostHogHost
  ? new URL(configuredPostHogHost).origin
  : null;
const posthogAssetOrigin = posthogOrigin?.replace(
  ".i.posthog.com",
  "-assets.i.posthog.com",
);

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const facts = { stills: [], video: null };

async function blockPostHog(page) {
  for (const origin of [posthogOrigin, posthogAssetOrigin]) {
    if (!origin) continue;
    await page.route(`${origin}/**`, (route) => route.abort("blockedbyclient"));
  }
}

async function openHome(page) {
  await page.goto(baseURL);
  await page.addStyleTag({
    content: "nextjs-portal { display: none !important; }",
  });
  await page
    .locator("[data-persona-satire]")
    .waitFor({ state: "visible", timeout: 20_000 });
  await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-experience-world]")
        ?.getAttribute("data-scene-ready") === "true",
    undefined,
    { timeout: 30_000 },
  );
  await page.evaluate(() => {
    document.documentElement.dataset.worldEvidence = "1";
  });
}

async function waitForScene(page, scene) {
  await page.waitForFunction(
    (expected) =>
      document.querySelector("[data-world-canvas] canvas")?.dataset
        .guideEvidenceScene === expected,
    scene,
    { timeout: 15_000 },
  );
  await page.waitForTimeout(1_600); // springs settle at scene targets
}

async function sceneFacts(page, extraSelectors) {
  return page.evaluate((selectors) => {
    const canvas = document.querySelector("[data-world-canvas] canvas");
    const raw = canvas?.dataset.guideScreenBounds ?? null;
    const guide = raw
      ? (() => {
          const [x, y, width, height] = raw.split(",").map(Number);
          return { left: x, top: y, right: x + width, bottom: y + height };
        })()
      : null;
    const stage = document.querySelector("[data-experience-world]");
    const rectsFor = (query) =>
      Array.from(document.querySelectorAll(query)).map((node) => {
        const { left, top, right, bottom } = node.getBoundingClientRect();
        return {
          left: Math.round(left),
          top: Math.round(top),
          right: Math.round(right),
          bottom: Math.round(bottom),
        };
      });
    const overlap = (rect) =>
      guide !== null &&
      Math.min(guide.right, rect.right) - Math.max(guide.left, rect.left) > 0 &&
      Math.min(guide.bottom, rect.bottom) - Math.max(guide.top, rect.top) > 0;
    const elements = {};
    for (const [label, query] of Object.entries(selectors)) {
      const rects = rectsFor(query);
      elements[label] = {
        count: rects.length,
        rects,
        anyOverlapWithGuide: rects.some(overlap),
      };
    }
    return {
      scene: canvas?.dataset.guideEvidenceScene ?? null,
      guideScreenBounds: guide,
      stageBeneath: {
        stageZ: stage ? Number(getComputedStyle(stage).zIndex) : null,
        anchorZ: Array.from(
          document.querySelectorAll("[data-world-anchor]"),
        ).map((anchor) => ({
          id: anchor.getAttribute("data-world-anchor"),
          z: Number(getComputedStyle(anchor).zIndex),
        })),
        stagePointerEvents: stage
          ? getComputedStyle(stage).pointerEvents
          : null,
      },
      elements,
    };
  }, extraSelectors);
}

const boardSelectors = {
  tickets: "[data-ticket]",
  grips: '[data-ticket] button[aria-label^="Drag"]',
  boardTabs: '[data-board-mobile-nav] [role="tab"]',
};
const journeySelectors = {
  funnelBars: '[class*="SessionJourneySection_bar__"]',
  insightsCard: '[class*="SessionJourneySection_insights__"]',
};

// ------------------------------------------------ 1. scene stills
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  for (const colorScheme of ["light", "dark"]) {
    const context = await browser.newContext({ viewport, colorScheme });
    const page = await context.newPage();
    await blockPostHog(page);
    await openHome(page);

    await page.locator("#work-board").scrollIntoViewIfNeeded();
    await waitForScene(page, "board");
    const boardName = `scene-board-${viewport.width}-${colorScheme}.png`;
    await page.screenshot({ path: resolve(output, boardName) });
    const boardFacts = await sceneFacts(page, boardSelectors);

    // Preview dialog measurement (listed non-coverage surface).
    await page.locator('[data-ticket="stay-portal"] a').click();
    await page
      .locator('[role="dialog"]')
      .waitFor({ state: "visible", timeout: 10_000 });
    const dialogFacts = await sceneFacts(page, {
      previewDialog: '[role="dialog"]',
    });
    const dialogLevel = await page.evaluate(() => {
      let node = document.querySelector('[role="dialog"]');
      let level = 0;
      while (node && node !== document.body) {
        const z = Number(getComputedStyle(node).zIndex);
        if (!Number.isNaN(z)) level = Math.max(level, z);
        node = node.parentElement;
      }
      return level;
    });
    await page.keyboard.press("Escape");
    await page
      .locator('[role="dialog"]')
      .waitFor({ state: "hidden", timeout: 10_000 });

    await page
      .locator('[data-world-anchor="journey"]')
      .scrollIntoViewIfNeeded();
    await waitForScene(page, "journey");
    const journeyName = `scene-journey-${viewport.width}-${colorScheme}.png`;
    await page.screenshot({ path: resolve(output, journeyName) });
    const journeyFacts = await sceneFacts(page, journeySelectors);

    facts.stills.push({
      viewport,
      colorScheme,
      board: { capture: boardName, ...boardFacts },
      previewDialog: {
        ...dialogFacts.elements.previewDialog,
        guideScreenBounds: dialogFacts.guideScreenBounds,
        stackLevel: dialogLevel,
      },
      journey: { capture: journeyName, ...journeyFacts },
    });
    await context.close();
  }
}

// ------------------------------------------------ 2. scroll video
{
  const videoDir = resolve(output, ".video-tmp");
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "light",
    recordVideo: { dir: videoDir, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await blockPostHog(page);
  await openHome(page);
  await page.waitForTimeout(1_800); // hero scene: wave settles to idle

  // Hero → board travel as a real reading scroll.
  for (let step = 0; step < 10; step += 1) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(120);
  }
  await page.locator("#work-board").scrollIntoViewIfNeeded();
  await waitForScene(page, "board");

  // ONE board interaction: a real grip drag (drag-watch gesture).
  const grip = page.getByRole("button", { name: /Drag AI Browser — Maxie/ });
  const gripBox = await grip.boundingBox();
  await page.mouse.move(gripBox.x + 22, gripBox.y + 22);
  await page.mouse.down();
  await page.mouse.move(gripBox.x + 120, gripBox.y + 60, { steps: 14 });
  await page.waitForTimeout(350);
  await page.mouse.move(gripBox.x + 30, gripBox.y + 16, { steps: 14 });
  await page.mouse.up();
  await page.waitForTimeout(900); // release physics settle

  // Board → journey travel.
  for (let step = 0; step < 8; step += 1) {
    await page.mouse.wheel(0, 140);
    await page.waitForTimeout(120);
  }
  await page
    .locator('[data-world-anchor="journey"]')
    .scrollIntoViewIfNeeded();
  await waitForScene(page, "journey");
  await page.waitForTimeout(1_200);

  facts.video = {
    capture: "hero-board-journey-normal.webm",
    slowed: "hero-board-journey-0.25x.webm",
    interaction: "grip drag on AI Browser — Maxie (drag-watch reaction)",
    journey: await sceneFacts(page, journeySelectors),
  };
  const video = page.video();
  await context.close();
  const recordedPath = await video.path();
  await copyFile(
    recordedPath,
    resolve(output, "hero-board-journey-normal.webm"),
  );
  await rm(videoDir, { recursive: true, force: true });
  execFileSync("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-i",
    resolve(output, "hero-board-journey-normal.webm"),
    "-filter:v",
    "setpts=4*PTS",
    "-an",
    resolve(output, "hero-board-journey-0.25x.webm"),
  ]);
}

await browser.close();
await writeFile(
  resolve(output, "motion-facts.json"),
  `${JSON.stringify(facts, null, 2)}\n`,
);

const coverageViolations = [];
for (const still of facts.stills) {
  for (const part of [still.board, still.journey]) {
    const beneath = part.stageBeneath;
    const stageOk =
      beneath.stageZ !== null &&
      beneath.anchorZ.every((anchor) => anchor.z > beneath.stageZ) &&
      beneath.stagePointerEvents === "none";
    if (!stageOk) {
      coverageViolations.push(
        `${part.capture}: world stage does not paint beneath the anchors`,
      );
    }
    if (!part.guideScreenBounds) {
      coverageViolations.push(`${part.capture}: guide bounds missing`);
    }
  }
  if (!(still.previewDialog.stackLevel > still.board.stageBeneath.stageZ)) {
    coverageViolations.push(
      `${still.board.capture}: preview dialog does not stack above the stage`,
    );
  }
}
if (coverageViolations.length > 0) {
  console.error("MOTION EVIDENCE VIOLATIONS:");
  for (const violation of coverageViolations) console.error(` - ${violation}`);
  process.exitCode = 1;
} else {
  console.log(
    `Motion evidence complete: ${facts.stills.length * 2} stills + 2 videos + motion-facts.json`,
  );
}
