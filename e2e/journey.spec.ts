import { expect, test } from "@playwright/test";

const journeyKey = "garvit-journey:v1";

test("the disclosed session funnel and mascot share one tab-local event stream", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Your session, instrumented." })).toBeVisible();
  await expect(
    page.getByText(
      "this funnel is computed in your browser. PostHog sees the rest. I check it obsessively.",
    ),
  ).toBeVisible();

  await page.getByRole("checkbox", { name: "Toggle dark mode" }).click();
  await page.getByRole("link", { name: /Stay Portal/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");

  const events = await page.evaluate((key) => {
    return JSON.parse(sessionStorage.getItem(key) ?? "[]");
  }, journeyKey);
  const localEvents = await page.evaluate((key) => localStorage.getItem(key), journeyKey);

  expect(events.map((event: { type: string }) => event.type)).toEqual(
    expect.arrayContaining(["landed", "scrolled", "played", "read-work"]),
  );
  expect(localEvents).toBeNull();

  const funnel = page.getByRole("list", {
    name: "This session’s journey funnel",
  });
  await expect(funnel.getByText("Played", { exact: true })).toBeVisible();
  await expect(funnel.getByText("Read work", { exact: true })).toBeVisible();

  await page.reload();
  const restored = await page.evaluate((key) => {
    return JSON.parse(sessionStorage.getItem(key) ?? "[]");
  }, journeyKey);
  expect(restored).toEqual(events);
});

test("local funnel play stays in this tab without a PostHog capture", async ({
  page,
}) => {
  const posthogCaptureRequests: string[] = [];
  const configuredHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  const posthogOrigin = configuredHost ? new URL(configuredHost).origin : null;
  const posthogAssetOrigin = posthogOrigin?.replace(
    ".i.posthog.com",
    "-assets.i.posthog.com",
  );

  for (const origin of [posthogOrigin, posthogAssetOrigin]) {
    if (!origin) continue;
    await page.route(`${origin}/**`, (route) => route.abort("blockedbyclient"));
  }

  page.on("request", (request) => {
    const requestUrl = request.url();
    if (
      posthogOrigin &&
      requestUrl.startsWith(posthogOrigin) &&
      request.method() === "POST" &&
      /(?:^|\/)(?:e|batch|capture)(?:\/|$)/.test(
        new URL(requestUrl).pathname,
      )
    ) {
      posthogCaptureRequests.push(requestUrl);
    }
  });

  await page.goto("/");
  await page.getByRole("checkbox", { name: "Toggle dark mode" }).click();
  await page
    .getByRole("checkbox", { name: "Toggle confetti while scrolling" })
    .click();
  await page
    .getByRole("checkbox", { name: "Toggle candid ticket annotations" })
    .click();
  await page.waitForTimeout(750);

  const stores = await page.evaluate((key) => {
    return {
      session: JSON.parse(sessionStorage.getItem(key) ?? "[]"),
      local: localStorage.getItem(key),
    };
  }, journeyKey);
  const playedKinds = stores.session
    .filter((event: { type: string }) => event.type === "played")
    .map((event: { kind?: string }) => event.kind);

  expect(stores.local).toBeNull();
  expect(playedKinds).toEqual(["dark_mode", "flag", "flag"]);
  expect(posthogCaptureRequests).toEqual([]);
});

test("the 404 is a tiny blameless SEV-3 postmortem", async ({ page }) => {
  await page.goto("/not-a-real-route");
  await expect(page.getByText(/SEV-3 · RESOLVED/)).toBeVisible();
  await expect(
    page.getByText("PM overestimated his own information architecture."),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Go home/ })).toHaveAttribute(
    "href",
    "/",
  );
  await expect(page.getByRole("link", { name: /Open the board/ })).toHaveAttribute(
    "href",
    "/#work-board",
  );
});
