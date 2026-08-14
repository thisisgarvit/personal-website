/**
 * Task 4 design-fidelity screenshots (DESIGN.md §12 gate; PRD §15 Codex
 * review scope: token diff + 1440×900 and 390×844 shell screenshots).
 *
 * Captures the homepage top-of-page in light and dark themes at both
 * viewports into docs/qa/task4/.
 *
 * Usage (against a production build):
 *   pnpm build && pnpm start &   # server on :3000
 *   node --experimental-strip-types scripts/shell-screens.mts
 */

import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE_URL = process.env.SHELL_SCREENS_URL ?? "http://localhost:3000";
const OUT_DIR = "docs/qa/task4";

const viewports = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "390x844", width: 390, height: 844 },
] as const;

const themes = ["light", "dark"] as const;

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const viewport of viewports) {
      for (const theme of themes) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          colorScheme: theme,
          deviceScaleFactor: 2,
        });
        const page = await context.newPage();
        await page.goto(BASE_URL, { waitUntil: "networkidle" });
        const path = `${OUT_DIR}/home-${viewport.name}-${theme}.png`;
        await page.screenshot({ path });
        console.log(`captured ${path}`);
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
