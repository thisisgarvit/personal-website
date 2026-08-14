import { expect, test } from "@playwright/test";

test("homepage renders the hero h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "I turn fuzzy product ideas into things people can use",
  );
});
