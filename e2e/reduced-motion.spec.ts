import { expect, test } from "@playwright/test";
import { liveRegion } from "./support";

/**
 * Reduced-motion smoke (PRD §13 fallback matrix, §16).
 *
 * With prefers-reduced-motion the board stays fully functional (direct
 * moves, no spatial animation requirement asserted here), effects are
 * suppressed with a visible reason, and the dialog still works.
 */

test.use({ contextOptions: { reducedMotion: "reduce" } });

test.describe("reduced motion", () => {
  test("board keyboard move still works and announces", async ({ page }) => {
    await page.goto("/");
    const ticket = page.getByRole("link", { name: /Stay Portal/ });
    await ticket.focus();
    await page.keyboard.press("Alt+ArrowRight");
    await expect(
      page.locator('[data-column="in-progress"] [data-ticket="stay-portal"]'),
    ).toBeVisible();
    await expect(liveRegion(page)).toHaveText(
      "Stay Portal moved to In progress",
    );
  });

  test("pointer drag still relocates a ticket", async ({
    page,
    browserName,
  }) => {
    // Synthetic pointer capture (grip setPointerCapture + protocol-level
    // mouse events) is unreliable on Playwright Firefox/WebKit: pointerup
    // never reaches the capturing grip, so the drop never commits. Real
    // input works (Task 7 real-device gate); keep this smoke on chromium
    // and rely on the keyboard-move test for cross-engine coverage.
    test.skip(
      browserName !== "chromium",
      "synthetic pointer-capture drag is chromium-only in Playwright",
    );
    await page.goto("/");
    const grip = page.locator('[data-ticket="stay-portal"] button[aria-label^="Drag"]');
    const backlog = page.locator('[data-column="backlog"]');
    // The board sits below the fold — bring it into the viewport so the
    // synthesized pointer coordinates actually hit the grip.
    await grip.scrollIntoViewIfNeeded();
    const gripBox = await grip.boundingBox();
    const backlogBox = await backlog.boundingBox();
    test.skip(!gripBox || !backlogBox, "layout boxes unavailable");
    if (!gripBox || !backlogBox) return;

    const startX = gripBox.x + gripBox.width / 2;
    const startY = gripBox.y + gripBox.height / 2;
    // Aim deep into the backlog column: the grip rides the ticket's
    // right edge, so targeting the column center would leave the ticket
    // center near the in-progress/backlog midpoint.
    const endX = backlogBox.x + backlogBox.width - 50;
    const endY = backlogBox.y + 120;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    // Multiple samples so hysteresis (10px) is crossed deliberately.
    for (let step = 1; step <= 8; step += 1) {
      await page.mouse.move(
        startX + ((endX - startX) * step) / 8,
        startY + ((endY - startY) * step) / 8,
      );
    }
    await page.mouse.up();

    await expect(
      page.locator('[data-column="backlog"] [data-ticket="stay-portal"]'),
    ).toBeVisible();
  });

  test("confetti effect is held with a visible reduced-motion reason", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByText("animation held: reduced motion"),
    ).toBeVisible();
  });

  test("case preview dialog opens and closes", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-ticket="maxie"] a').first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("world falls back to one theme poster without scene requests", async ({
    page,
  }) => {
    // Gate D3 (plan Task 8 Step 1): reduced motion must serve the
    // camera-matched poster — no canvas, no Three scene chunk, no GLB,
    // and exactly ONE theme poster transferred (single-theme parity).
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.mouse.wheel(0, 4000);
    await page.waitForTimeout(600);

    const world = page.locator("[data-experience-world]");
    await expect(world).toHaveAttribute("data-world-fallback", "reduced-motion");
    await expect(world.locator("[data-world-canvas]")).toHaveCount(0);
    await expect(world.locator("canvas")).toHaveCount(0);
    await expect(world.locator("[data-world-poster]")).toHaveCSS("opacity", "1");

    expect(
      requests.filter((url) => /\/models\/guide\/guide\.glb/i.test(url)),
    ).toEqual([]);
    const posterRequests = requests.filter((url) =>
      /\/images\/world\/guide-(light|dark)\.webp/i.test(url),
    );
    expect(posterRequests).toHaveLength(1);
    expect(posterRequests[0]).toContain("guide-light");

    // Paint parity: the fixed world stage must sit BENEATH every
    // foreground surface — the poster used to veil the experiment strip
    // and footer (Gate D3 regression fix).
    const layers = await page.evaluate(() => {
      const stackLevel = (element: Element | null) => {
        if (!element) return null;
        const style = getComputedStyle(element);
        return style.position === "static"
          ? -1
          : Number(style.zIndex) || 0;
      };
      return {
        stage: stackLevel(
          document.querySelector("[data-experience-world]"),
        ),
        strip: stackLevel(
          document.querySelector('[aria-label="Experiment status"]'),
        ),
        footer: stackLevel(document.querySelector("footer")),
      };
    });
    expect(layers.stage).not.toBeNull();
    expect(layers.strip!).toBeGreaterThan(layers.stage!);
    expect(layers.footer!).toBeGreaterThan(layers.stage!);
  });
});
