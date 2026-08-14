/**
 * Task 5 content QA screenshot (extends the shell-screens.mts pattern):
 * captures /work/stay-portal at 1440×900 in the light theme into
 * docs/qa/task5/.
 *
 * Usage (against a running production build):
 *   pnpm build && pnpm start &   # server on :3000
 *   node --experimental-strip-types scripts/case-screens.mts
 */

import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE_URL = process.env.SHELL_SCREENS_URL ?? "http://localhost:3000";
const OUT_DIR = "docs/qa/task5";

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: "light",
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/work/stay-portal`, {
      waitUntil: "networkidle",
    });
    const path = `${OUT_DIR}/stay-portal-1440x900-light.png`;
    await page.screenshot({ path });
    console.log(`captured ${path}`);
    await context.close();
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
