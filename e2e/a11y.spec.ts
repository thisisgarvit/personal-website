import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PUBLIC_ROUTES } from "./support";

/**
 * Automated axe scans on every public route in light AND dark themes
 * (PRD §16). Serious/critical violations fail the suite; anything milder
 * is attached to the report as needs-review rather than blocking.
 */

const THEMES = ["light", "dark"] as const;

for (const route of PUBLIC_ROUTES) {
  for (const theme of THEMES) {
    test(`axe: ${route} [${theme}]`, async ({ page }, testInfo) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page }).analyze();

      const blocking = results.violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical",
      );
      const needsReview = results.violations.filter(
        (violation) =>
          violation.impact !== "serious" && violation.impact !== "critical",
      );

      if (needsReview.length > 0) {
        await testInfo.attach(`needs-review ${route} ${theme}`, {
          body: JSON.stringify(needsReview, null, 2),
          contentType: "application/json",
        });
      }

      expect(
        blocking,
        blocking
          .map(
            (violation) =>
              `${violation.id} (${violation.impact}): ${violation.help} → ${violation.nodes
                .map((node) => node.target.join(" "))
                .join("; ")}`,
          )
          .join("\n"),
      ).toEqual([]);
    });
  }
}
