import { expect, test } from "@playwright/test";
import { siteConfig } from "./support";

test.describe("homepage immersive-world composition", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("keeps one main, one h1, and the locked hero → board → journey order", async ({
    page,
  }) => {
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      siteConfig.hero,
    );

    const anchors = await page
      .getByRole("main")
      .locator("[data-world-anchor]")
      .evaluateAll((nodes) =>
        nodes.map((node) => ({
          id: node.getAttribute("data-world-anchor"),
          tag: node.tagName,
        })),
      );
    expect(anchors).toEqual([
      { id: "hero", tag: "DIV" },
      { id: "board", tag: "DIV" },
      { id: "journey", tag: "DIV" },
    ]);
  });

  test("keeps one decorative world beside main and out of navigation", async ({
    page,
  }) => {
    const world = page.locator("[data-experience-world]");
    const main = page.getByRole("main");

    await expect(world).toHaveCount(1);
    await expect(world).toHaveAttribute("aria-hidden", "true");
    expect(
      await world.evaluate(
        (node) => node.parentElement === document.querySelector("main")?.parentElement,
      ),
    ).toBe(true);
    await expect(
      world.locator("main, nav, a, button, input, select, textarea"),
    ).toHaveCount(0);
    await expect(main.locator("[data-experience-world]")).toHaveCount(0);
  });

  test("keeps hero actions dominant and one live flag dock inside the hero anchor", async ({
    page,
  }) => {
    const hero = page.locator('[data-world-anchor="hero"]');

    await expect(hero.locator("a[data-primary-cta]")).toHaveCount(2);
    await expect(hero.locator("#resume-cta")).toHaveAttribute(
      "href",
      siteConfig.resumePath,
    );
    await expect(
      hero.getByRole("link", { name: "Contact Garvit" }),
    ).toHaveAttribute("href", `mailto:${siteConfig.email}`);
    await expect(
      hero.getByRole("complementary", { name: "Feature flag dock" }),
    ).toHaveCount(1);
    await expect(hero.locator("[data-world-dock]")).toHaveCount(1);
    await expect(
      page.getByRole("complementary", { name: "Product controls" }),
    ).toHaveCount(0);
  });

  test("keeps the real board and shipped journey disclosure in their anchors", async ({
    page,
  }) => {
    await expect(
      page.locator('[data-world-anchor="board"] #work-board'),
    ).toHaveCount(1);
    await expect(
      page
        .locator('[data-world-anchor="journey"]')
        .getByText(
          "this funnel is computed in your browser. PostHog sees the rest. I check it obsessively.",
        ),
    ).toBeVisible();
  });
});
