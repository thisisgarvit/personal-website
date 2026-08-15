import { expect, test } from "@playwright/test";

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
] as const;

for (const viewport of viewports) {
  test(`homepage keeps scrolling local at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const widths = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);

    if (viewport.width === 390) {
      const board = page.locator('[data-board]');
      await expect(board).toBeVisible();
      const boardWidths = await board.evaluate((element) => ({
        client: element.clientWidth,
        scroll: element.scrollWidth,
      }));
      expect(boardWidths.scroll).toBeGreaterThan(boardWidths.client);
    }
  });

  test(`homepage reflows at 200% text size at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.addStyleTag({ content: "html { font-size: 32px !important; }" });

    const widths = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
  });
}

test("primary homepage controls provide a 44px pointer target", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const hero = page.getByRole("region", {
    name: /I turn fuzzy product ideas/i,
  });

  const controls = [
    page.getByRole("button", { name: "v2.4.1" }),
    hero.getByRole("link", { name: /Download resume/i }),
    hero.getByRole("link", { name: /Contact Garvit/i }),
    ...await page.getByRole("checkbox").all(),
    ...await page.getByRole("button", { name: /Move .* ticket/i }).all(),
  ];

  for (const control of controls) {
    const box = await control.boundingBox();
    expect(box, await control.getAttribute("aria-label") ?? "control").not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});
