import type { Locator, Page } from "@playwright/test";
import { siteConfig } from "../src/data/site";
import { workItems } from "../src/data/work";

/**
 * Shared E2E fixtures (Task 9).
 *
 * Identity strings are imported from `src/data/site.ts` per PRD §16 —
 * test fixtures must not hardcode `garvit.app` / `v2.4.1`.
 */

export { siteConfig, workItems };

/** The five public routes (PRD §3). */
export const PUBLIC_ROUTES = [
  "/",
  "/work/stay-portal",
  "/work/maxie",
  "/work/agentic-calendar",
  "/notes/dynamic-island",
] as const;

/** The ONE polite live region rendered by <Toaster /> (PRD §13). */
export function liveRegion(page: Page): Locator {
  return page.locator('div[aria-live="polite"]');
}

/**
 * Press Tab until `target` receives focus, asserting relative tab order
 * without hard-coding absolute tab counts. `maxTabs` bounds the search so
 * an out-of-order element still fails, while additive focusables from
 * concurrent lanes (e.g. the mascot island, which is decorative and
 * SHOULD add none) do not silently break every ordering assertion.
 */
export async function tabUntil(
  page: Page,
  target: Locator,
  maxTabs: number,
  label: string,
): Promise<void> {
  for (let i = 0; i < maxTabs; i += 1) {
    await page.keyboard.press("Tab");
    const focused = await target.evaluate(
      (el) => el === document.activeElement,
    );
    if (focused) return;
  }
  throw new Error(
    `Tab order: "${label}" was not reached within ${maxTabs} tab presses`,
  );
}

/**
 * True when the Task 8 mascot island has landed inside the reserved
 * stage. Mascot-dependent assertions must skip (not fail) while another
 * builder is still working in src/features/mascot/** (Task 9 brief).
 */
export async function mascotIslandPresent(page: Page): Promise<boolean> {
  const stage = page.locator("[data-mascot-slot]");
  if ((await stage.count()) === 0) return false;
  return (await stage.locator("canvas, svg, img").count()) > 0;
}
