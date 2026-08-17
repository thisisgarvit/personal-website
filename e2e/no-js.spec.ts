import { expect, test } from "@playwright/test";
import { siteConfig, workItems } from "./support";

/**
 * JavaScript-disabled suite (PRD §13 fallback matrix, §16).
 *
 * The server render must keep every visitor path working: hero + CTAs,
 * the authored board with direct case links, readable case routes, the
 * banner, and NO phone UI (email remains the always-available channel).
 */

test.use({ javaScriptEnabled: false });

test.describe("no-JS homepage", () => {
  test("keeps the authored poster, landmarks, and world order readable", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    const world = page.locator("[data-experience-world]");
    const poster = world.locator("[data-world-poster]");
    await expect(world).toHaveCount(1);
    await expect(world).toHaveAttribute("aria-hidden", "true");
    await expect(world.locator("canvas")).toHaveCount(0);
    await expect(poster).toBeVisible();
    await expect(poster).toHaveCSS("background-image", /guide-light\.webp/);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    expect(
      await page
        .getByRole("main")
        .locator("[data-world-anchor]")
        .evaluateAll((nodes) =>
          nodes.map((node) => node.getAttribute("data-world-anchor")),
        ),
    ).toEqual(["hero", "board", "journey"]);
  });

  test("hero and both CTAs are fully functional links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      siteConfig.hero,
    );

    const resume = page.locator("#resume-cta");
    await expect(resume).toHaveAttribute("href", siteConfig.resumePath);
    await expect(resume).toHaveAttribute("download", "");

    const contact = page
      .getByRole("main")
      .getByRole("link", { name: "Contact Garvit" });
    await expect(contact).toHaveAttribute(
      "href",
      `mailto:${siteConfig.email}`,
    );
    await expect(page.locator("a[data-primary-cta]")).toHaveCount(2);
  });

  test("banner and latest release remain visible in the chrome", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByText(/variant B of this hero/)).toBeVisible();
    // The version affordance and the latest release line stay readable
    // (PRD §13: "Latest release remains visible in chrome").
    await expect(
      page.getByRole("button", { name: `v${siteConfig.version}` }),
    ).toBeVisible();
    await expect(page.getByLabel("Latest changelog")).toBeVisible();
  });

  test("authored board renders every ticket as a direct case link", async ({
    page,
  }) => {
    await page.goto("/");
    for (const item of workItems) {
      const link = page.locator(
        `[data-column="${item.authoredColumn}"] a[href="${item.route}"]`,
      );
      await expect(link, `${item.slug} in ${item.authoredColumn}`).toBeVisible();
    }
  });

  test("no phone UI is present anywhere in the no-JS render", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByText("Reveal phone number")).toHaveCount(0);
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
    const html = await page.content();
    expect(html).not.toContain("7508883655");
  });
});

test.describe("no-JS case routes", () => {
  for (const item of workItems) {
    test(`${item.route} serves full readable content`, async ({ page }) => {
      await page.goto(item.route);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        item.title,
      );
      // Long-form body actually rendered (server MDX), not an empty shell.
      await expect(
        page.getByRole("article").locator("p").first(),
      ).toBeVisible();
    });
  }
});
