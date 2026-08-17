import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PUBLIC_ROUTES } from "./support";

/**
 * Automated axe scans on every public route in light AND dark themes
 * (PRD §16). Serious/critical violations fail the suite; anything milder
 * is attached to the report as needs-review rather than blocking.
 */

const THEMES = ["light", "dark"] as const;

test("homepage exposes one valid landmark path around the decorative world", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
  await expect(
    page.getByRole("complementary", { name: "Feature flag dock" }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("complementary", { name: "Product controls" }),
  ).toHaveCount(0);

  const anchors = page.getByRole("main").locator("[data-world-anchor]");
  await expect(anchors).toHaveCount(3);
  expect(await anchors.evaluateAll((nodes) => nodes.map((node) => node.tagName)))
    .toEqual(["DIV", "DIV", "DIV"]);
  await expect(
    page.locator("section[data-world-anchor] > section"),
  ).toHaveCount(0);

  const world = page.locator("[data-experience-world]");
  await expect(world).toHaveCount(1);
  await expect(world).toHaveAttribute("aria-hidden", "true");
  await expect(
    world.locator("main, nav, a, button, input, select, textarea"),
  ).toHaveCount(0);
});

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
