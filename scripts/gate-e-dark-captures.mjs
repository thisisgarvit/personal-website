import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Gate E dark-theme evidence captures (plan Task 7).
 *
 * Captures first-viewport dark-theme screenshots of the four case routes.
 * Dark theme is forced the same way a returning visitor with a saved
 * override gets it: THEME_STORAGE_KEY ("garvit-theme:v1", see
 * src/data/storage.ts) is written to localStorage BEFORE page load via
 * addInitScript, which the layout.tsx pre-hydration script reads and
 * applies as document.documentElement.dataset.theme. The script asserts
 * dataset.theme === "dark" after load and fails hard if it is not.
 *
 * Usage: node scripts/gate-e-dark-captures.mjs
 * Env:   GATE_E_URL (default http://localhost:3150)
 *        GATE_E_OUT (default docs/qa/immersive/gate-e)
 */

const baseURL = process.env.GATE_E_URL ?? "http://localhost:3150";
const output = resolve(process.env.GATE_E_OUT ?? "docs/qa/immersive/gate-e");

// Must match THEME_STORAGE_KEY in src/data/storage.ts.
const THEME_STORAGE_KEY = "garvit-theme:v1";

const captures = [
  { route: "/work/stay-portal", name: "stay-390-dark.png", width: 390, height: 844 },
  { route: "/work/maxie", name: "maxie-1440-dark.png", width: 1440, height: 900 },
  { route: "/work/maxie", name: "maxie-390-dark.png", width: 390, height: 844 },
  { route: "/work/agentic-calendar", name: "calendar-1440-dark.png", width: 1440, height: 900 },
  { route: "/work/agentic-calendar", name: "calendar-390-dark.png", width: 390, height: 844 },
  { route: "/notes/dynamic-island", name: "island-1440-dark.png", width: 1440, height: 900 },
  { route: "/notes/dynamic-island", name: "island-390-dark.png", width: 390, height: 844 },
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const evidence = [];

for (const capture of captures) {
  const context = await browser.newContext({
    viewport: { width: capture.width, height: capture.height },
    colorScheme: "dark",
  });
  await context.addInitScript(
    ([key]) => {
      sessionStorage.clear();
      localStorage.clear();
      localStorage.setItem(key, "dark");
    },
    [THEME_STORAGE_KEY],
  );
  const page = await context.newPage();
  await page.goto(`${baseURL}${capture.route}`, { waitUntil: "networkidle" });
  await page.addStyleTag({
    content: "nextjs-portal { display: none !important; }",
  });

  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  if (theme !== "dark") {
    throw new Error(
      `${capture.route}: expected data-theme="dark", got "${theme}"`,
    );
  }

  // Let fonts/images settle before capturing.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  const facts = await page.evaluate(() => {
    const style = (el) => (el ? getComputedStyle(el) : null);
    const luminance = (cssColor) => {
      const m = cssColor?.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
      if (!m) return null;
      const alpha = m[4] === undefined ? 1 : Number(m[4]);
      if (alpha === 0) return null; // transparent — not a surface
      return (0.2126 * Number(m[1]) + 0.7152 * Number(m[2]) + 0.0722 * Number(m[3])) / 255;
    };

    const artifact = document.querySelector("main figure");
    const caption = artifact?.querySelector("figcaption") ?? null;
    const nav = document.querySelector("nav, header");
    const bodyStyle = style(document.body);

    // Scan the artifact (authored diagram or figure) for light opaque
    // surfaces that would break dark theme.
    const lightSurfaces = [];
    if (artifact) {
      for (const el of [artifact, ...artifact.querySelectorAll("*")]) {
        if (el.tagName === "IMG") continue; // photographic content is exempt
        const s = getComputedStyle(el);
        const bgLum = luminance(s.backgroundColor);
        if (bgLum !== null && bgLum > 0.7) {
          lightSurfaces.push(
            `${el.tagName.toLowerCase()}.${[...el.classList].join(".")} bg=${s.backgroundColor}`,
          );
        }
      }
    }

    const textSamples = [...document.querySelectorAll("main p, main li, main h1, main h2, main dt, main dd")]
      .slice(0, 40)
      .map((el) => {
        const s = getComputedStyle(el);
        return { color: s.color, bg: s.backgroundColor };
      });
    const lowContrastText = textSamples.filter((t) => {
      const lum = luminance(t.color);
      return lum !== null && lum < 0.35; // dark text on (presumed) dark page
    }).length;

    return {
      theme: document.documentElement.dataset.theme,
      bodyBackground: bodyStyle?.backgroundColor,
      bodyColor: bodyStyle?.color,
      hasArtifact: Boolean(artifact),
      artifactHasImage: Boolean(artifact?.querySelector("img")),
      captionText: caption?.textContent?.trim().slice(0, 90) ?? null,
      hasNav: Boolean(nav),
      h1: document.querySelector("main h1")?.textContent?.trim() ?? null,
      factsList: document.querySelectorAll("main dl dt, main dl dd").length,
      lightSurfacesInArtifact: lightSurfaces,
      lowContrastTextNodes: lowContrastText,
      textNodesSampled: textSamples.length,
    };
  });

  await page.screenshot({ path: resolve(output, capture.name) });
  evidence.push({ capture: capture.name, route: capture.route, ...facts });
  await context.close();
}

await browser.close();
console.log(JSON.stringify(evidence, null, 2));
