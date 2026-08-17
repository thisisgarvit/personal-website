import { expect, test } from "@playwright/test";
import {
  BACK_TO_BOARD_HREF,
  caseOpeningBySlug,
  routeForSlug,
  siteConfig,
  workBySlugFixture,
  workItems,
} from "./case-fixtures";

/**
 * Case-route content checks (PRD §8, §16, §17.5 + Gate E, plan Task 7).
 *
 * Every case is honestly labelled, opens artifact-led (opening with kind
 * label, ticket id, title, one-sentence value, three verified facts, and
 * ONE artifact BEFORE the long-form prose), offers back-to-board plus
 * null-ended previous/next navigation, and keeps images inside the
 * viewport. Analytics: `full_case_read` belongs to the board's preview
 * dialog only — case routes emit nothing.
 */

test.describe("case routes", () => {
  for (const item of workItems) {
    const fixture = workBySlugFixture[item.slug];
    const opening = caseOpeningBySlug(item.slug);

    test(`${item.route} responds 200 with kind label, ticket id, title`, async ({
      page,
    }) => {
      const response = await page.goto(item.route);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        item.title,
      );
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(
        page.getByText(`${fixture.kindLabel} · ${item.id}`),
      ).toBeVisible();
      await expect(page).toHaveTitle(
        `${item.title} · ${siteConfig.productName}`,
      );
    });

    test(`${item.route} opens artifact-led: opening + facts before prose`, async ({
      page,
    }) => {
      await page.goto(item.route);

      const openingSurface = page.locator("[data-case-opening]");
      const body = page.locator("[data-case-body]");
      await expect(openingSurface).toHaveCount(1);
      await expect(body).toHaveCount(1);

      // The opening precedes the prose body in DOM order.
      expect(
        await page.evaluate(() => {
          const surface = document.querySelector("[data-case-opening]");
          const prose = document.querySelector("[data-case-body]");
          return Boolean(
            surface &&
              prose &&
              surface.compareDocumentPosition(prose) &
                Node.DOCUMENT_POSITION_FOLLOWING,
          );
        }),
      ).toBe(true);

      // One-sentence value and exactly the three verified workItems facts.
      await expect(openingSurface.getByText(opening.value)).toBeVisible();
      for (const fact of opening.facts) {
        const factItem = openingSurface
          .locator("dd", { hasText: fact.value })
          .first();
        await expect(factItem).toBeVisible();
      }

      // Exactly one opening artifact (figure or authored diagram figure).
      await expect(openingSurface.locator("figure")).toHaveCount(1);

      // Immediate back-to-board affordance inside the opening.
      await expect(
        openingSurface.getByRole("link", { name: /back to board/i }),
      ).toHaveAttribute("href", BACK_TO_BOARD_HREF);
    });

    test(`${item.route} has null-ended previous/next navigation`, async ({
      page,
    }) => {
      await page.goto(item.route);
      const nav = page.getByRole("navigation", { name: "Case navigation" });
      await expect(nav).toBeVisible();

      const previousLink = nav.getByRole("link", { name: /previous case/i });
      const nextLink = nav.getByRole("link", { name: /next case/i });

      if (opening.previous) {
        await expect(previousLink).toHaveAttribute(
          "href",
          routeForSlug(opening.previous),
        );
      } else {
        await expect(previousLink).toHaveCount(0);
        await expect(nav.getByText("Start of board")).toBeVisible();
      }

      if (opening.next) {
        await expect(nextLink).toHaveAttribute(
          "href",
          routeForSlug(opening.next),
        );
      } else {
        await expect(nextLink).toHaveCount(0);
        await expect(nav.getByText("End of board")).toBeVisible();
      }
    });

    test(`${item.route} images stay inside the viewport (no overflow)`, async ({
      page,
    }) => {
      await page.goto(item.route);
      await page.waitForLoadState("networkidle");

      // No horizontal page overflow.
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);

      const images = page.locator("main img");
      const count = await images.count();
      const viewport = page.viewportSize();
      for (let i = 0; i < count; i += 1) {
        const box = await images.nth(i).boundingBox();
        if (!box) continue; // lazy image out of the scrolled viewport
        expect(box.width).toBeLessThanOrEqual(viewport!.width);
      }
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
