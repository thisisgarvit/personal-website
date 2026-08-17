import { expect, test } from "@playwright/test";
import { siteConfig } from "./support";

const viewports = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
] as const;

/**
 * Gate D3: 200% text size must reflow without horizontal overflow at the
 * FULL width matrix — the pre-D2 320/430 exclusions are retired now that
 * the chrome/strip/board-head/journey offenders wrap instead of clipping.
 */
const reflowViewports = viewports;

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

/**
 * Gate D3 — the five 320px/200% overflow offenders must never regress:
 * product-chrome id row, version affordance, experiment-strip copy,
 * board head actions, and the journey title/live state. Per DESIGN.md §4
 * the fix is reflow (wrapping) — locked type and target sizes stay.
 */
for (const viewport of mobileViewports) {
  test(`chrome, strip, board head, and journey reflow at 200% text size at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.addStyleTag({ content: "html { font-size: 32px !important; }" });

    const width = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    const inViewport = async (
      locator: ReturnType<typeof page.locator>,
      label: string,
    ) => {
      const box = await locator.boundingBox();
      expect(box, label).not.toBeNull();
      expect(box!.x, `${label} left edge`).toBeGreaterThanOrEqual(-1);
      expect(box!.x + box!.width, `${label} right edge`).toBeLessThanOrEqual(
        width + 1,
      );
    };

    await inViewport(
      page.locator('[class*="ProductChrome_productId"]'),
      "product chrome id",
    );
    await inViewport(
      page.getByRole("button", { name: `v${siteConfig.version}` }),
      "version affordance",
    );
    await inViewport(
      page.locator('[class*="ExperimentStrip_copy__"]'),
      "experiment strip copy",
    );
    await inViewport(
      page.locator('#work-board [class*="board_actions"]'),
      "board head actions",
    );

    // The hero evolution replay affordance is in-flow hero content.
    const replay = page.getByRole("button", { name: /Replay/ });
    if ((await replay.count()) > 0 && (await replay.first().isVisible())) {
      await inViewport(replay.first(), "hero evolution replay");
    }

    // Journey title and live state reflow inside their clipping section
    // (the section hides overflow, so a plain scrollWidth check would
    // miss a truncated heading).
    const journeySection = page
      .locator('[data-world-anchor="journey"] section')
      .first();
    const sectionBox = (await journeySection.boundingBox())!;
    for (const [selector, label] of [
      ['[class*="SessionJourneySection_title"]', "journey title"],
      ['[class*="SessionJourneySection_liveState"]', "journey live state"],
    ] as const) {
      const box = await page.locator(selector).boundingBox();
      expect(box, label).not.toBeNull();
      expect(
        box!.x + box!.width,
        `${label} stays inside its section`,
      ).toBeLessThanOrEqual(sectionBox.x + sectionBox.width + 1);
    }

    // The version popover itself must also reflow when opened.
    await page.getByRole("button", { name: `v${siteConfig.version}` }).click();
    const dialog = page.getByRole("dialog", { name: "Release notes" });
    await expect(dialog).toBeVisible();
    const dialogBox = (await dialog.boundingBox())!;
    expect(dialogBox.x).toBeGreaterThanOrEqual(-1);
    expect(dialogBox.x + dialogBox.width).toBeLessThanOrEqual(width + 1);

    const widths = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
  });
}

/**
 * Gate D3 correction 1 — the feature-flag dock must NEVER intersect the
 * hero headline, intro, CTA group, or the persona tray. 880–1179px
 * reserves the dock's column for the copy measure; 620–879px recomposes
 * the dock in flow below the hero. Bounding-box (getBoundingClientRect)
 * non-intersection assertions at both failing matrix widths.
 */
for (const viewport of [
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
] as const) {
  test(`feature-flag dock never intersects hero copy at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator("[data-persona-satire]")).toBeVisible();

    const rects = await page.evaluate(() => {
      const measure = (selector: string) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const { left, top, right, bottom } = element.getBoundingClientRect();
        return { left, top, right, bottom };
      };
      return {
        dock: measure("[data-world-dock]"),
        headline: measure("#hero-title"),
        intro: measure('[class*="Hero_intro__"], [class*="Hero_intro"]'),
        ctaGroup: measure('[class*="Hero_actions__"], [class*="Hero_actions"]'),
        persona: measure("[data-persona-satire]"),
      };
    });

    expect(rects.dock, "dock rect").not.toBeNull();
    for (const [label, rect] of [
      ["hero headline", rects.headline],
      ["hero intro", rects.intro],
      ["hero CTA group", rects.ctaGroup],
      ["persona tray", rects.persona],
    ] as const) {
      expect(rect, label).not.toBeNull();
      const overlapX =
        Math.min(rects.dock!.right, rect!.right) -
        Math.max(rects.dock!.left, rect!.left);
      const overlapY =
        Math.min(rects.dock!.bottom, rect!.bottom) -
        Math.max(rects.dock!.top, rect!.top);
      const intersects = overlapX > 0 && overlapY > 0;
      expect(
        intersects,
        `${label} must not enter the dock rectangle (overlap ${overlapX.toFixed(
          1,
        )}x${overlapY.toFixed(1)})`,
      ).toBe(false);
    }

    // The persona tray is the hero's other overlay — the recomposed copy
    // must clear it too (the wrapped headline used to rise beneath it).
    for (const [label, rect] of [
      ["hero headline", rects.headline],
      ["hero intro", rects.intro],
      ["hero CTA group", rects.ctaGroup],
    ] as const) {
      const overlapX =
        Math.min(rects.persona!.right, rect!.right) -
        Math.max(rects.persona!.left, rect!.left);
      const overlapY =
        Math.min(rects.persona!.bottom, rect!.bottom) -
        Math.max(rects.persona!.top, rect!.top);
      expect(
        overlapX > 0 && overlapY > 0,
        `${label} must not sit beneath the persona tray`,
      ).toBe(false);
    }
  });
}

/**
 * Gate D3 correction 3 — at 200% text the next-column peek must yield so
 * the active board column keeps a readable measure (no type or target
 * reduction). Tabs and previous/next controls remain the discovery
 * affordance and stay functional.
 */
for (const viewport of mobileViewports) {
  test(`200% text keeps a readable active board column at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.addStyleTag({ content: "html { font-size: 32px !important; }" });
    await page.locator("#work-board").scrollIntoViewIfNeeded();

    const measure = await page.evaluate(() => {
      const board = document.querySelector("[data-board]")!;
      const column = board.querySelector("[data-column]")!;
      return {
        port: board.clientWidth,
        column: column.getBoundingClientRect().width,
      };
    });
    // Adequate readable measure: the active column takes (at least) the
    // full scroll port — the peek is suppressed to ≤2px — and never
    // becomes a narrow strip.
    expect(measure.column).toBeGreaterThanOrEqual(176);
    expect(measure.column).toBeGreaterThanOrEqual(measure.port - 2);

    // Explicit discovery controls are preserved and functional.
    await expect(
      page.getByRole("tablist", { name: "Board columns" }),
    ).toBeVisible();
    const position = page.locator("[data-board-position]");
    await expect(position).toHaveText("1 of 3");
    await page.getByRole("button", { name: "Next column" }).click();
    await expect(position).toHaveText("2 of 3");
    await page.getByRole("button", { name: "Previous column" }).click();
    await expect(position).toHaveText("1 of 3");
  });
}

/**
 * Gate D3 — entering /#work-board must land "Things I've built" below
 * the sticky product chrome at every matrix width (mobile regression:
 * the heading used to sit beneath the chrome).
 */
for (const viewport of viewports) {
  test(`#work-board anchor clears the sticky chrome at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/#work-board");
    await expect(page.locator("#board-title")).toBeVisible();
    const gap = await page.evaluate(() => {
      const chrome = document
        .querySelector("body header")!
        .getBoundingClientRect();
      const title = document
        .querySelector("#board-title")!
        .getBoundingClientRect();
      return title.top - chrome.bottom;
    });
    expect(gap).toBeGreaterThanOrEqual(8);
  });
}

test("back-to-board navigation from a case route clears the chrome", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/work/stay-portal");
  await page.getByRole("link", { name: "Back to board" }).click();
  await expect(page).toHaveURL(/\/#work-board$/);
  await expect(page.locator("#board-title")).toBeVisible();
  const gap = await page.evaluate(() => {
    const chrome = document
      .querySelector("body header")!
      .getBoundingClientRect();
    const title = document
      .querySelector("#board-title")!
      .getBoundingClientRect();
    return title.top - chrome.bottom;
  });
  expect(gap).toBeGreaterThanOrEqual(8);
});

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
