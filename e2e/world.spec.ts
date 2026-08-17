import { expect, test } from "@playwright/test";
import { workItems } from "./support";

test.describe("immersive world prototype", () => {
  test("keeps one transparent world behind the real portfolio journey", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "deviceMemory", {
        configurable: true,
        get: () => 8,
      });
    });

    await page.goto("/dev/world");

    const world = page.locator("[data-experience-world]");
    await expect(world).toHaveCount(1);
    await expect(world).toHaveAttribute("aria-hidden", "true");
    await expect(world).toHaveAttribute("data-world-fallback", "none");
    await expect(world.locator("[data-world-poster]")).toHaveCount(1);

    const anchors = await page
      .locator("[data-world-anchor]")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-world-anchor")),
      );
    expect(anchors).toEqual(["hero", "board", "journey"]);
    await expect(page.locator("main section section")).toHaveCount(0);

    await expect(page.locator("a[data-primary-cta]")).toHaveCount(2);
    await expect(page.locator("[data-world-dock]")).toHaveCount(1);
    await expect(page.locator("[data-board-entry]")).toHaveAttribute(
      "href",
      workItems[0].route,
    );
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "I turn fuzzy product ideas into things people can use",
    );

    // The world loads only after its anchor measurements report a visible scene.
    // Re-fire the same passive event used in production after hydration settles.
    await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
    const canvasBoundary = page.locator("[data-world-canvas]");
    await expect(canvasBoundary).toHaveCount(1, { timeout: 20_000 });
    await expect(canvasBoundary).toHaveAttribute("aria-hidden", "true");
    const canvas = page.locator(
      "[data-world-canvas] canvas, canvas[data-world-canvas]",
    );
    await expect(canvas).toHaveCount(1);
    await expect
      .poll(() => world.getAttribute("data-scene-ready"), { timeout: 20_000 })
      .toBe("true");
    expect(
      await canvas.evaluate((node) => getComputedStyle(node).pointerEvents),
    ).toBe("none");
    await expect(world.locator("[data-world-poster]")).toHaveCSS("opacity", "0");

    const boardControls = page.getByLabel("Board scene test controls");
    const journeyControls = page.getByLabel("Journey scene test controls");
    await expect(boardControls.getByRole("button")).toHaveCount(4);
    await expect(journeyControls.getByRole("button")).toHaveCount(2);

    for (const name of [
      "Start ticket drag",
      "End ticket drag",
      "Trigger incident",
      "Resolve incident",
      "Reach journey milestone",
      "Ship ticket",
    ]) {
      await page.getByRole("button", { name }).click();
      await expect(world).toHaveCount(1);
    }
    expect(pageErrors).toEqual([]);
  });

  test("keeps the poster and content when motion policy selects fallback", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/dev/world");

    const world = page.locator("[data-experience-world]");
    await expect(world).toHaveCount(1);
    await expect(world).toHaveAttribute("data-world-fallback", "reduced-motion");
    await expect(world).toHaveAttribute("data-scene-ready", "false");
    await expect(world.locator("[data-world-canvas]")).toHaveCount(0);
    await expect(world.locator("[data-world-poster]")).toHaveCSS("opacity", "1");

    await expect(page.locator("a[data-primary-cta]")).toHaveCount(2);
    await expect(page.locator("[data-board-entry]")).toHaveCount(1);
    await expect(page.locator("[data-world-dock]")).toHaveCount(1);
  });
});
