import { expect, test, type Page } from "@playwright/test";
import { liveRegion, siteConfig, tabUntil } from "./support";

/**
 * Homepage keyboard-only journey (PRD §16, §13).
 *
 * Tab order per DESIGN.md §8: chrome → banner → hero CTAs → flags →
 * board → footer. The mascot is decorative and adds no required keyboard
 * surface (PRD §13); `tabUntil` tolerates — but does not require — extra
 * stops so these specs stay green while Task 8 lands concurrently.
 */

const versionTrigger = (page: Page) =>
  page.getByRole("button", { name: `v${siteConfig.version}` });

test.describe("keyboard-only homepage journey", () => {
  test("tab order runs chrome → banner → CTAs → flags → board → footer", async ({
    page,
    browserName,
  }) => {
    // WebKit follows Safari's native behavior: Tab skips <a> elements
    // (Option+Tab visits them). The link-inclusive order is asserted on
    // chromium/firefox; WebKit coverage comes from the activation tests.
    test.skip(
      browserName === "webkit",
      "Safari/WebKit Tab traversal skips links by design",
    );
    await page.goto("/");

    // Chrome: the version affordance is the first focusable control.
    await tabUntil(page, versionTrigger(page), 2, "version affordance");

    // Banner dismiss follows the chrome.
    await tabUntil(
      page,
      page.getByRole("button", { name: "Dismiss experiment banner" }),
      2,
      "banner dismiss",
    );

    // Hero CTAs: resume first (visually primary), then contact.
    await tabUntil(page, page.locator("#resume-cta"), 2, "resume CTA");
    await tabUntil(
      page,
      page.getByRole("main").getByRole("link", { name: "Contact Garvit" }),
      2,
      "contact CTA",
    );

    // Flags: three live switches; comic_sans is disabled and skipped.
    await tabUntil(
      page,
      page.getByRole("checkbox", { name: "Toggle dark mode" }),
      6,
      "dark_mode switch",
    );
    await tabUntil(
      page,
      page.getByRole("checkbox", { name: "Toggle confetti while scrolling" }),
      2,
      "confetti switch",
    );
    await tabUntil(
      page,
      page.getByRole("checkbox", {
        name: "Toggle candid ticket annotations",
      }),
      2,
      "candid switch",
    );
    await expect(
      page.getByRole("checkbox", { name: "Comic Sans disabled" }),
    ).toBeDisabled();

    // Board: reset control, then ticket links (grips are pointer-only,
    // tabindex=-1 — keyboard uses Enter/Alt+arrows on the link itself).
    await tabUntil(
      page,
      page.getByRole("button", { name: /Reset board/ }),
      3,
      "board reset",
    );
    await tabUntil(
      page,
      page.getByRole("link", { name: /Stay Portal/ }),
      2,
      "first ticket",
    );

    // Footer: resume, contact, then the phone reveal button.
    await tabUntil(
      page,
      page.getByRole("contentinfo").getByRole("link", {
        name: "Download resume",
      }),
      8,
      "footer resume link",
    );
    await tabUntil(
      page,
      page.getByRole("button", { name: "Reveal phone number" }),
      4,
      "phone reveal button",
    );
  });

  test("version popover opens on Enter and Escape restores focus", async ({
    page,
  }) => {
    await page.goto("/");
    const trigger = versionTrigger(page);
    await trigger.focus();
    await page.keyboard.press("Enter");

    const popover = page.getByRole("dialog", { name: "Release notes" });
    await expect(popover).toBeVisible();
    // Exactly three notes, no "Full changelog" affordance (PRD §5.1).
    await expect(popover.getByRole("listitem")).toHaveCount(3);
    await expect(popover.getByText(/full changelog/i)).toHaveCount(0);

    await page.keyboard.press("Escape");
    await expect(popover).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("banner dismiss announces the fictional event and hands focus to the resume CTA", async ({
    page,
  }) => {
    await page.goto("/");
    const dismiss = page.getByRole("button", {
      name: "Dismiss experiment banner",
    });
    await dismiss.focus();
    await page.keyboard.press("Enter");

    await expect(page.getByText(/variant B of this hero/)).toBeHidden();
    await expect(liveRegion(page)).toHaveText(
      "event logged: banner_dismissed. noted.",
    );
    await expect(page.locator("#resume-cta")).toBeFocused();

    // Same-tab persistence (sessionStorage, PRD §5.2).
    await page.reload();
    await expect(page.getByText(/variant B of this hero/)).toBeHidden();
  });

  test("flag toggles change the rendered product from the keyboard", async ({
    page,
  }) => {
    await page.goto("/");
    const html = page.locator("html");

    // dark_mode: Space toggles the theme attribute and shows the toast.
    const dark = page.getByRole("checkbox", { name: "Toggle dark mode" });
    await dark.focus();
    await page.keyboard.press("Space");
    await expect(html).toHaveAttribute("data-theme", "dark");
    await expect(page.getByText("dark_mode enabled")).toBeVisible();

    // candid_mode: Space hides the candid ticket annotations.
    const candid = page.getByRole("checkbox", {
      name: "Toggle candid ticket annotations",
    });
    const firstNote = page.locator("[data-candid-note]").first();
    await expect(firstNote).toBeVisible();
    await candid.focus();
    await page.keyboard.press("Space");
    await expect(html).toHaveAttribute("data-candid", "off");
    await expect(firstNote).toBeHidden();
    await page.keyboard.press("Space");
    await expect(firstNote).toBeVisible();
  });

  test("Enter opens the case preview dialog; Escape closes it", async ({
    page,
  }) => {
    await page.goto("/");
    const ticket = page.getByRole("link", { name: /Stay Portal/ });
    await ticket.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    // Opening a preview never mutates the URL (PRD §8).
    expect(new URL(page.url()).pathname).toBe("/");
    const readFull = dialog.getByRole("link", { name: /Read full case/ });
    await expect(readFull).toHaveAttribute("href", "/work/stay-portal");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  // KNOWN BUG (Task 7/10 lane, PRD §13 "Preview: … focus return"):
  // closing the preview drops focus on <body> instead of restoring it to
  // the ticket. The board unmounts the whole Dialog.Root on close
  // (`{previewItem ? <CasePreviewDialog…/> : null}`), which skips Radix's
  // focus restoration. Fix belongs in src/features/board/** (keep the
  // Root mounted, or restore focus in onOpenChange). Flip fixme → test
  // once fixed.
  test.fixme(
    "Escape returns focus to the ticket that opened the preview",
    async ({ page }) => {
      await page.goto("/");
      const ticket = page.getByRole("link", { name: /Stay Portal/ });
      await ticket.focus();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toBeHidden();
      await expect(ticket).toBeFocused();
    },
  );

  test("Alt+Arrow moves a ticket with one polite announcement and retained focus", async ({
    page,
  }) => {
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
    await expect(ticket).toBeFocused();

    // Same-tab persistence (PRD §7 / §11).
    await page.reload();
    await expect(
      page.locator('[data-column="in-progress"] [data-ticket="stay-portal"]'),
    ).toBeVisible();

    // Keyboard Shipped outcome parity (PRD §16): moving back into
    // Shipped opens the case preview, exactly like a pointer drop.
    await page.getByRole("link", { name: /Stay Portal/ }).focus();
    await page.keyboard.press("Alt+ArrowLeft");
    await expect(
      page.locator('[data-column="shipped"] [data-ticket="stay-portal"]'),
    ).toBeVisible();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("reset restores the authored matrix and shows the ceremony toast", async ({
    page,
  }) => {
    await page.goto("/");
    const ticket = page.getByRole("link", { name: /Stay Portal/ });
    await ticket.focus();
    await page.keyboard.press("Alt+ArrowRight");
    await expect(
      page.locator('[data-column="in-progress"] [data-ticket="stay-portal"]'),
    ).toBeVisible();

    const reset = page.getByRole("button", { name: /Reset board/ });
    await reset.focus();
    await page.keyboard.press("Enter");

    await expect(
      page.locator('[data-column="shipped"] [data-ticket="stay-portal"]'),
    ).toBeVisible();
    await expect(liveRegion(page)).toHaveText(
      "Board reset. No sprint ceremony required.",
    );
  });
});
