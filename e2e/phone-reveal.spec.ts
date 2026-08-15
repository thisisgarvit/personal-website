import { expect, test } from "@playwright/test";
import { PUBLIC_ROUTES, liveRegion } from "./support";

/**
 * Phone-reveal journey and server-HTML privacy (PRD §5.4, §12, §16).
 *
 * The number must NEVER appear in server HTML, metadata, or OG payloads —
 * it exists only after a deliberate client-side reveal. The digits below
 * are the PRD §16 forbidden-content probes, intentionally written here
 * (test-only) as the assertion target.
 */

const ASSEMBLED_DIGITS = ["7508883655", "+917508883655"];
const EXPECTED_TEL_HREF = "tel:+917508883655";
const EXPECTED_DISPLAY = "+91 75088 83655";

test.describe("server HTML privacy", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} server HTML contains no phone number or tel: link`, async ({
      request,
    }) => {
      const response = await request.get(route);
      expect(response.ok()).toBe(true);
      const html = await response.text();
      for (const digits of ASSEMBLED_DIGITS) {
        expect(html).not.toContain(digits);
      }
      expect(html).not.toContain("tel:");
      expect(html).not.toContain("Reveal phone number");
    });
  }
});

test.describe("phone reveal journey", () => {
  test("reveal button produces the exact tel href and one announcement", async ({
    page,
  }) => {
    await page.goto("/");
    const reveal = page.getByRole("button", { name: "Reveal phone number" });
    await expect(reveal).toBeVisible();
    await reveal.click();

    const phoneLink = page.locator('a[href^="tel:"]');
    await expect(phoneLink).toHaveAttribute("href", EXPECTED_TEL_HREF);
    await expect(phoneLink).toHaveText(EXPECTED_DISPLAY);
    await expect(phoneLink).toBeFocused();
    await expect(liveRegion(page)).toHaveText("Phone number revealed");
  });

  test("reveal state is memory-only — refresh restores the obfuscated state", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Reveal phone number" }).click();
    await expect(page.locator('a[href^="tel:"]')).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("button", { name: "Reveal phone number" }),
    ).toBeVisible();
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  });
});
