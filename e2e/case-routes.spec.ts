import { expect, test } from "@playwright/test";
import { siteConfig, workBySlugFixture, workItems } from "./case-fixtures";

/**
 * Case-route content checks (PRD §8, §16, §17.5).
 *
 * Every case is honestly labelled (shipped / concept / research kind
 * label near the title), and every board preview links to its full case.
 */

test.describe("case routes", () => {
  for (const item of workItems) {
    const fixture = workBySlugFixture[item.slug];
    test(`${item.route} shows kind label, ticket id, and title`, async ({
      page,
    }) => {
      await page.goto(item.route);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        item.title,
      );
      await expect(
        page.getByText(`${fixture.kindLabel} · ${item.id}`),
      ).toBeVisible();
      await expect(page).toHaveTitle(
        `${item.title} · ${siteConfig.productName}`,
      );
    });
  }

  test('"Shipped product" labels only the actually-shipped case', async ({
    page,
  }) => {
    for (const item of workItems) {
      await page.goto(item.route);
      const shippedLabel = page.getByText(/^Shipped product/);
      if (item.kind === "shipped") {
        await expect(shippedLabel).toBeVisible();
      } else {
        await expect(shippedLabel).toHaveCount(0);
      }
    }
  });
});

test.describe("preview → full case links", () => {
  test("every ticket's preview offers a Read full case link to its route", async ({
    page,
  }) => {
    await page.goto("/");
    for (const item of workItems) {
      await page.locator(`[data-ticket="${item.slug}"] a`).first().click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect(
        dialog.getByRole("link", { name: /Read full case/ }),
      ).toHaveAttribute("href", item.route);
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
    }
  });

  test("Read full case navigates to the case route", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-ticket="stay-portal"] a').first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("link", { name: /Read full case/ }).click();
    await expect(page).toHaveURL(/\/work\/stay-portal$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Stay Portal",
    );
  });
});
