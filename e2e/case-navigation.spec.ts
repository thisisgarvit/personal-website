import { expect, test } from "@playwright/test";
import {
  BACK_TO_BOARD_HREF,
  caseOpenings,
  routeForSlug,
  workItems,
} from "./case-fixtures";
import { tabUntil } from "./support";

/**
 * Gate E keyboard flow for case routes (new lane-owned spec — the
 * homepage keyboard contract stays in keyboard.spec.ts).
 *
 * Focus order: the opening's back-to-board affordance is reachable
 * within the first few tab stops (product chrome may precede it), body
 * links follow, and the previous/next case navigation is reachable at
 * the end. Traversal: next walks the whole board linearly and stops at
 * the null end; previous walks it back.
 */

test.describe("case keyboard flow", () => {
  test("back-to-board is an early tab stop and works by keyboard", async ({
    page,
    browserName,
  }) => {
    // Same engine boundary as keyboard.spec.ts: Safari/WebKit Tab skips
    // <a> elements by design (Option+Tab visits them). Link activation
    // is covered on WebKit by the pointer traversal test below.
    test.skip(
      browserName === "webkit",
      "Safari/WebKit Tab traversal skips links by design",
    );
    await page.goto("/work/stay-portal");
    const back = page.getByRole("link", { name: /back to board/i });
    // Product chrome (version affordance) may precede it; keep the bound
    // tight so back-to-board stays immediate.
    await tabUntil(page, back, 4, "Back to board");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`/${BACK_TO_BOARD_HREF.slice(1)}$`));
    await expect(page.locator("#work-board")).toBeVisible();
  });

  test("focus order runs opening → prose → case navigation", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit",
      "Safari/WebKit Tab traversal skips links by design",
    );
    await page.goto("/work/agentic-calendar");
    const back = page.getByRole("link", { name: /back to board/i });
    await tabUntil(page, back, 4, "Back to board");

    const previous = page.getByRole("link", { name: /previous case/i });
    await tabUntil(page, previous, 25, "Previous case");

    const next = page.getByRole("link", { name: /next case/i });
    await page.keyboard.press("Tab");
    await expect(next).toBeFocused();
  });

  test("next traverses the whole board linearly and never wraps", async ({
    page,
  }) => {
    await page.goto(workItems[0].route);
    for (const opening of caseOpenings) {
      await expect(page).toHaveURL(
        new RegExp(`${routeForSlug(opening.slug)}$`),
      );
      const nav = page.getByRole("navigation", { name: "Case navigation" });
      if (opening.next) {
        await nav.getByRole("link", { name: /next case/i }).click();
      } else {
        // Last case: no next link — the line ends here.
        await expect(
          nav.getByRole("link", { name: /next case/i }),
        ).toHaveCount(0);
        await expect(nav.getByText("End of board")).toBeVisible();
      }
    }
  });

  test("previous traverses back to the first case and stops", async ({
    page,
  }) => {
    await page.goto(workItems[workItems.length - 1].route);
    for (const opening of [...caseOpenings].reverse()) {
      await expect(page).toHaveURL(
        new RegExp(`${routeForSlug(opening.slug)}$`),
      );
      const nav = page.getByRole("navigation", { name: "Case navigation" });
      if (opening.previous) {
        await nav.getByRole("link", { name: /previous case/i }).click();
      } else {
        await expect(
          nav.getByRole("link", { name: /previous case/i }),
        ).toHaveCount(0);
        await expect(nav.getByText("Start of board")).toBeVisible();
      }
    }
  });
});
