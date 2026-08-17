import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { workItems } from "./support";

const MODEL_REQUEST = /\/models\/guide\/guide\.glb/i;

async function installHighMemory(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "deviceMemory", {
      configurable: true,
      get: () => 8,
    });
  });
}

async function openLiveWorld(page: Page) {
  await installHighMemory(page);
  await page.goto("/dev/world");
  await page.evaluate(() => window.dispatchEvent(new Event("scroll")));

  const world = page.locator("[data-experience-world]");
  const canvas = page.locator("[data-world-canvas] canvas");
  await expect(canvas).toHaveCount(1, { timeout: 20_000 });
  await expect.poll(() => world.getAttribute("data-scene-ready"), {
    timeout: 20_000,
  }).toBe("true");
  await expect(canvas).toHaveAttribute("data-guide-scene", "hero");
  return { world, canvas };
}

async function vector(canvas: Locator, attribute: string) {
  const raw = await canvas.getAttribute(attribute);
  expect(raw, `${attribute} should be exposed by the prototype`).not.toBeNull();
  return raw!.split(",").map(Number);
}

function distance(left: number[], right: number[]) {
  return Math.hypot(...left.map((value, index) => value - right[index]));
}

test.describe("immersive world prototype", () => {
  test("keeps one pointer-transparent canvas while presentation moves continuously", async ({
    page,
  }) => {
    const { world, canvas } = await openLiveWorld(page);
    await expect(world).toHaveCount(1);
    await expect(world).toHaveAttribute("aria-hidden", "true");
    await expect(world).toHaveAttribute("data-world-fallback", "none");
    await expect(world.locator("[data-world-poster]")).toHaveCSS("opacity", "0");
    await expect(canvas).toHaveCSS("pointer-events", "none");
    await expect(page.locator("[data-world-canvas]")).toHaveCSS(
      "pointer-events",
      "none",
    );

    const anchors = await page
      .locator("[data-world-anchor]")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-world-anchor")),
      );
    expect(anchors).toEqual(["hero", "board", "journey"]);
    await expect(page.locator("main section section")).toHaveCount(0);
    await expect(page.locator("a[data-primary-cta]")).toHaveCount(2);
    for (const cta of await page.locator("a[data-primary-cta]").all()) {
      await expect(cta).toBeVisible();
    }
    await expect(page.locator("[data-world-dock]")).toHaveCount(1);
    await expect(page.locator("[data-board-entry]")).toHaveAttribute(
      "href",
      workItems[0].route,
    );

    await canvas.evaluate((node) => {
      node.setAttribute("data-gate-c-canvas", "persistent");
    });
    await expect(canvas).toHaveAttribute("data-guide-gesture", "idle", {
      timeout: 6_000,
    });
    const heroPosition = await vector(canvas, "data-guide-position");
    const heroProgress = await canvas.getAttribute("data-guide-progress");

    await page.evaluate(() => window.scrollBy(0, 140));
    await expect(canvas).toHaveAttribute("data-guide-scene", "hero");
    await expect.poll(() => canvas.getAttribute("data-guide-progress")).not.toBe(
      heroProgress,
    );
    await expect.poll(async () => {
      const next = await vector(canvas, "data-guide-position");
      return distance(heroPosition, next);
    }).toBeGreaterThan(0.005);

    await page.getByLabel("Board scene test controls").scrollIntoViewIfNeeded();
    await expect(canvas).toHaveAttribute("data-guide-scene", "board");
    await expect(canvas).toHaveAttribute("data-gate-c-canvas", "persistent");
    await page.getByLabel("Journey scene test controls").scrollIntoViewIfNeeded();
    await expect(canvas).toHaveAttribute("data-guide-scene", "journey");
    await expect(canvas).toHaveAttribute("data-gate-c-canvas", "persistent");
    await expect(page.locator("[data-world-canvas] canvas")).toHaveCount(1);
    await expect.poll(async () =>
      Number(await canvas.getAttribute("data-guide-draw-calls")),
    ).toBeGreaterThan(0);
    expect(
      Number(await canvas.getAttribute("data-guide-draw-calls")),
    ).toBeLessThanOrEqual(30);
  });

  test("arbitrates reactions and interrupts scene travel from presentation state", async ({
    page,
  }) => {
    const { canvas } = await openLiveWorld(page);
    const boardControls = page.getByLabel("Board scene test controls");
    await boardControls.scrollIntoViewIfNeeded();
    await expect(canvas).toHaveAttribute("data-guide-scene", "board");

    await page.getByRole("button", { name: "Start ticket drag" }).click();
    await expect(canvas).toHaveAttribute("data-guide-reaction", "drag-watch");
    await expect(canvas).toHaveAttribute("data-guide-gesture", "drag-watch");

    await page.getByRole("button", { name: "Trigger incident" }).click();
    await expect(canvas).toHaveAttribute("data-guide-reaction", "incident");
    await expect(canvas).toHaveAttribute("data-guide-gesture", "drag-watch");

    await page.getByRole("button", { name: "End ticket drag" }).click();
    await expect(canvas).toHaveAttribute("data-guide-gesture", "pager-check");
    await page.getByRole("button", { name: "Resolve incident" }).click();
    await expect(canvas).toHaveAttribute("data-guide-gesture", "resolution");
    await expect(canvas).toHaveAttribute("data-guide-reaction", "idle", {
      timeout: 3_000,
    });

    await page.getByLabel("Journey scene test controls").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Ship ticket" }).click();
    await expect(canvas).toHaveAttribute("data-guide-gesture", "ship-celebration");

    await boardControls.scrollIntoViewIfNeeded();
    await expect(canvas).toHaveAttribute("data-guide-scene", "board");
    await page.waitForTimeout(700);
    const boardPosition = await vector(canvas, "data-guide-position");

    await page.getByLabel("Journey scene test controls").scrollIntoViewIfNeeded();
    await expect(canvas).toHaveAttribute("data-guide-scene", "journey");
    await page.waitForTimeout(90);
    const interruptedPosition = await vector(canvas, "data-guide-position");

    await boardControls.scrollIntoViewIfNeeded();
    await expect(canvas).toHaveAttribute("data-guide-scene", "board");
    await page.waitForTimeout(45);
    const reenteredPosition = await vector(canvas, "data-guide-position");

    expect(distance(reenteredPosition, interruptedPosition)).toBeLessThan(
      distance(boardPosition, interruptedPosition),
    );
  });

  test("pauses simulation while hidden or outside the anchor union and resumes in place", async ({
    page,
  }) => {
    const { canvas } = await openLiveWorld(page);
    await expect(canvas).toHaveAttribute("data-guide-playing", "true");

    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => "hidden",
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expect(canvas).toHaveAttribute("data-guide-playing", "false");
    const hiddenFrame = await canvas.getAttribute("data-guide-frame");
    await page.waitForTimeout(280);
    await expect(canvas).toHaveAttribute("data-guide-frame", hiddenFrame!);

    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => "visible",
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expect(canvas).toHaveAttribute("data-guide-playing", "true");
    await page.mouse.move(120, 120);
    await expect.poll(async () => Number(await canvas.getAttribute("data-guide-frame")))
      .toBeGreaterThan(Number(hiddenFrame));

    await page.evaluate(() => {
      document.querySelectorAll<HTMLElement>("[data-world-anchor]").forEach(
        (anchor) => {
          anchor.dataset.gateCDisplay = anchor.style.display;
          anchor.style.display = "none";
        },
      );
      window.dispatchEvent(new Event("resize"));
    });
    await expect(canvas).toHaveAttribute("data-guide-playing", "false");
    const outsideFrame = await canvas.getAttribute("data-guide-frame");
    await page.waitForTimeout(280);
    await expect(canvas).toHaveAttribute("data-guide-frame", outsideFrame!);

    await page.evaluate(() => {
      document.querySelectorAll<HTMLElement>("[data-world-anchor]").forEach(
        (anchor) => {
          anchor.style.display = anchor.dataset.gateCDisplay ?? "";
          delete anchor.dataset.gateCDisplay;
        },
      );
      window.dispatchEvent(new Event("resize"));
    });
    await expect(canvas).toHaveAttribute("data-guide-playing", "true");
  });

  for (const fallback of [
    {
      name: "reduced motion",
      reason: "reduced-motion",
      setup: async (page: Page) => page.emulateMedia({ reducedMotion: "reduce" }),
    },
    {
      name: "Save-Data",
      reason: "save-data",
      setup: async (page: Page) => {
        await page.addInitScript(() => {
          const connection = new EventTarget();
          Object.defineProperty(connection, "saveData", { get: () => true });
          Object.defineProperty(navigator, "connection", {
            configurable: true,
            get: () => connection,
          });
        });
      },
    },
    {
      name: "performance kill",
      reason: "performance-kill",
      setup: async (page: Page) => {
        await page.addInitScript(() => {
          const applyKill = () => {
            if (document.documentElement) {
              document.documentElement.dataset.effectsDisabled = "true";
            }
          };
          applyKill();
          document.addEventListener("readystatechange", applyKill);
          new MutationObserver(applyKill).observe(document, { childList: true });
        });
      },
    },
  ]) {
    test(`${fallback.name} avoids scene and model requests`, async ({ page }) => {
      const requests: string[] = [];
      page.on("request", (request) => requests.push(request.url()));
      await installHighMemory(page);
      await fallback.setup(page);
      await page.goto("/dev/world");
      await page.waitForLoadState("networkidle");

      const world = page.locator("[data-experience-world]");
      await expect(world).toHaveAttribute("data-world-fallback", fallback.reason);
      await expect(world).toHaveAttribute("data-scene-ready", "false");
      await expect(world.locator("[data-world-canvas]")).toHaveCount(0);
      await expect(world.locator("[data-world-poster]")).toHaveCSS("opacity", "1");
      expect(requests.filter((url) => MODEL_REQUEST.test(url))).toEqual([]);
      await expect(page.locator("a[data-primary-cta]")).toHaveCount(2);
      await expect(page.locator("[data-board-entry]")).toHaveCount(1);
    });
  }

  test("explicit theme overrides swap the visible fallback poster", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await installHighMemory(page);
    await page.goto("/dev/world");

    const poster = page.locator("[data-world-poster]");
    await expect(poster).toHaveCSS(
      "background-image",
      /guide-light\.webp/,
    );
    await page.getByLabel("Toggle dark mode").check();
    await expect(poster).toHaveCSS("background-image", /guide-dark\.webp/);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.getByLabel("Toggle dark mode").uncheck();
    await expect(poster).toHaveCSS("background-image", /guide-light\.webp/);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(poster).toHaveCSS("background-position", /68%/);
  });

  test("has no serious accessibility, console, or overflow defects", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    await openLiveWorld(page);

    for (const viewport of [
      { width: 320, height: 720 },
      { width: 390, height: 844 },
      { width: 430, height: 932 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1440, height: 900 },
      { width: 1600, height: 1000 },
    ]) {
      await page.setViewportSize(viewport);
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect.poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      ).toBe(true);
      await expect(page.locator("a[data-primary-cta]")).toHaveCount(2);
    }

    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter(
      ({ impact }) => impact === "critical" || impact === "serious",
    );
    expect(blocking).toEqual([]);
    expect(errors).toEqual([]);
  });

  test("remains usable with keyboard-only navigation at 200% page scale", async ({
    page,
  }) => {
    await openLiveWorld(page);
    const session = await page.context().newCDPSession(page);
    await session.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });

    const reached = new Set<string>();
    for (let index = 0; index < 32; index += 1) {
      await page.keyboard.press("Tab");
      const marker = await page.evaluate(() => {
        const active = document.activeElement;
        if (!(active instanceof HTMLElement)) return "";
        return active.id || active.textContent?.trim() || "";
      });
      if (marker === "resume-cta") reached.add("resume");
      if (marker === "Contact Garvit") reached.add("contact");
    }

    expect(reached).toEqual(new Set(["resume", "contact"]));
    await expect(page.locator("a[data-primary-cta]")).toHaveCount(2);
  });

  test("homepage board drag stays intact beside the live world canvas", async ({
    page,
  }) => {
    // Gesture-level board→world proof lives in the /dev/world fixtures and
    // the InteractiveBoardSection unit contract (diagnostic data-guide-*
    // attributes are dev-route-only). Here: the production board's drag
    // physics complete underneath one pointer-transparent canvas.
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    await installHighMemory(page);
    await page.goto("/");
    await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
    const world = page.locator("[data-experience-world]");
    const canvas = page.locator("[data-world-canvas] canvas");
    await expect(canvas).toHaveCount(1, { timeout: 20_000 });
    await expect
      .poll(() => world.getAttribute("data-scene-ready"), { timeout: 20_000 })
      .toBe("true");
    await expect(canvas).toHaveCSS("pointer-events", "none");

    // Maxie stays in its own column: pure drag lifecycle, no incident or
    // shipped side-effect.
    await page.locator("#work-board").scrollIntoViewIfNeeded();
    const grip = page.getByRole("button", { name: /Drag AI Browser — Maxie/ });
    const gripBox = (await grip.boundingBox())!;
    await page.mouse.move(gripBox.x + 22, gripBox.y + 22);
    await page.mouse.down();
    await page.mouse.move(gripBox.x + 90, gripBox.y + 34, { steps: 5 });
    await expect(page.locator('[data-ticket="maxie"]')).toHaveAttribute(
      "data-drag-state",
      "dragging",
    );

    await page.mouse.move(gripBox.x + 40, gripBox.y + 20, { steps: 5 });
    await page.mouse.up();
    // Proven physics finish a real move: storage written, ticket at rest,
    // exactly one canvas persisting, zero errors.
    await expect
      .poll(() => page.evaluate(() => sessionStorage.getItem("garvit-board:v1")))
      .not.toBeNull();
    await expect(page.locator('[data-ticket="maxie"]')).not.toHaveAttribute(
      "data-drag-state",
      /.+/,
    );
    await expect(page.locator("[data-world-canvas] canvas")).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test("keeps core content operable in forced colors and reduced transparency", async ({
    page,
  }) => {
    await installHighMemory(page);
    const session = await page.context().newCDPSession(page);
    await session.send("Emulation.setEmulatedMedia", {
      features: [
        { name: "forced-colors", value: "active" },
        { name: "prefers-reduced-transparency", value: "reduce" },
      ],
    });
    await page.goto("/dev/world");

    expect(
      await page.evaluate(() => matchMedia("(forced-colors: active)").matches),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => matchMedia("(prefers-reduced-transparency: reduce)").matches,
      ),
    ).toBe(true);
    await expect(page.locator("a[data-primary-cta]")).toHaveCount(2);
    await expect(page.locator("[data-board-entry]")).toHaveCount(1);
    await expect.poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBe(true);
  });
});
