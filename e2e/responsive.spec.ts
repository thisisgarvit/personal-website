import { expect, test } from "@playwright/test";

const viewports = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
] as const;

/**
 * 200% text-size reflow keeps its pre-D2 matrix: 320/430 at 200% expose
 * pre-existing chrome/journey overflows outside the board lane (reported
 * to the design lead; not a Gate D2 regression).
 */
const reflowViewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
] as const;

const mobileViewports = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
] as const;

/** Column order is authored data: Shipped → In progress → Backlog. */
const columnPlan = [
  { id: "shipped", label: "Shipped", tickets: ["stay-portal"] },
  {
    id: "in-progress",
    label: "In progress",
    tickets: ["maxie", "agentic-calendar"],
  },
  { id: "backlog", label: "Backlog", tickets: ["dynamic-island"] },
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

    if (viewport.width < 880) {
      const board = page.locator("[data-board]");
      await expect(board).toBeVisible();
      const boardWidths = await board.evaluate((element) => ({
        client: element.clientWidth,
        scroll: element.scrollWidth,
      }));
      expect(boardWidths.scroll).toBeGreaterThan(boardWidths.client);
    }
  });

}

for (const viewport of reflowViewports) {
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
    ...(await page.getByRole("checkbox").all()),
    ...(await page.getByRole("tab").all()),
    page.getByRole("button", { name: "Previous column" }),
    page.getByRole("button", { name: "Next column" }),
  ];

  for (const control of controls) {
    const box = await control.boundingBox();
    expect(box, (await control.getAttribute("aria-label")) ?? "control").not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

/**
 * Gate D2 — explicit mobile board discovery (plan Task 6 Step 7).
 *
 * At 320/390/430 the board must be fully discoverable without drag:
 * labelled column tabs, a visible "n of 3" position, previous/next
 * controls, a next-column peek, and every project reachable through
 * real buttons and links. Runs with touch enabled so WebKit exercises
 * the same coarse-pointer path as iOS Safari.
 */
test.describe("explicit mobile board discovery", () => {
  test.use({ hasTouch: true });

  for (const viewport of mobileViewports) {
    test(`reaches all four projects without dragging at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const board = page.locator("#work-board");
      await board.scrollIntoViewIfNeeded();

      // Labelled tab per column + visible position text.
      const tablist = page.getByRole("tablist", { name: "Board columns" });
      await expect(tablist).toBeVisible();
      const position = page.locator("[data-board-position]");
      await expect(position).toHaveText("1 of 3");
      const previous = page.getByRole("button", { name: "Previous column" });
      const next = page.getByRole("button", { name: "Next column" });
      await expect(previous).toBeDisabled();
      await expect(next).toBeEnabled();

      // Next-column peek: with Shipped active, In progress already shows
      // a real slice inside the scroll port — no invisible-scroll secret.
      const boardBox = (await page.locator("[data-board]").boundingBox())!;
      const inProgressBox = (await page
        .locator('[data-column="in-progress"]')
        .boundingBox())!;
      expect(inProgressBox.x).toBeLessThan(boardBox.x + boardBox.width - 12);
      expect(inProgressBox.x + inProgressBox.width).toBeGreaterThan(
        boardBox.x + boardBox.width,
      );

      // Walk every column by tab; every ticket stays a real link and its
      // column scrolls fully into the horizontal viewport.
      for (const [index, column] of columnPlan.entries()) {
        await page.getByRole("tab", { name: column.label }).click();
        await expect(position).toHaveText(`${index + 1} of 3`);
        for (const slug of column.tickets) {
          const ticketLink = page.locator(`[data-ticket="${slug}"] a`);
          await expect(ticketLink).toHaveAttribute("href", new RegExp(slug));
          await expect
            .poll(
              async () => {
                const box = await ticketLink.boundingBox();
                return box
                  ? box.x >= -2 && box.x + box.width <= viewport.width + 2
                  : false;
              },
              { message: `${slug} inside the horizontal viewport` },
            )
            .toBe(true);
        }
      }

      // Pager controls: next is exhausted at Backlog, previous walks home.
      await expect(next).toBeDisabled();
      await expect(previous).toBeEnabled();
      await previous.click();
      await expect(position).toHaveText("2 of 3");
      await previous.click();
      await expect(position).toHaveText("1 of 3");
      await expect(previous).toBeDisabled();

      // Swiping (native horizontal scroll) still syncs the position text.
      // Wait out the smooth scroll from the pager first so the manual
      // scroll is not cancelled by the in-flight animation.
      const boardScroller = page.locator("[data-board]");
      await expect
        .poll(() => boardScroller.evaluate((element) => element.scrollLeft))
        .toBeLessThan(4);
      await boardScroller.evaluate((element) =>
        element.scrollTo({ left: element.scrollWidth, behavior: "instant" }),
      );
      await expect(position).toHaveText("3 of 3");
    });

    test(`preview CTA lands in the first screen at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.locator("#work-board").scrollIntoViewIfNeeded();

      await page.locator('[data-ticket="stay-portal"] a').click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      const readFull = dialog.getByRole("link", { name: /Read full case/ });
      // 0.95: WebKit reports ~0.996 from sub-pixel sticky positioning.
      await expect(readFull).toBeInViewport({ ratio: 0.95 });
      const box = (await readFull.boundingBox())!;
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
    });
  }
});

test("desktop board keeps the full grid without mobile navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  await expect(page.locator("[data-board-mobile-nav]")).toBeHidden();
  const columns = page.locator("[data-column]");
  await expect(columns).toHaveCount(3);
  for (const column of await columns.all()) {
    await expect(column).toBeVisible();
  }
  const board = page.locator("[data-board]");
  const widths = await board.evaluate((element) => ({
    client: element.clientWidth,
    scroll: element.scrollWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
});
