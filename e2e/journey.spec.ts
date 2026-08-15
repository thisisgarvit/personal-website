import { expect, test } from "@playwright/test";

const journeyKey = "garvit-journey:v1";

test("the disclosed session funnel and mascot share one tab-local event stream", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Your session, instrumented." })).toBeVisible();
  await expect(page.getByText("computed in your browser. I never see it.")).toBeVisible();

  await page.getByRole("checkbox", { name: "Toggle dark mode" }).click();
  await page.getByRole("link", { name: /Stay Portal/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");

  const events = await page.evaluate((key) => {
    return JSON.parse(sessionStorage.getItem(key) ?? "[]");
  }, journeyKey);

  expect(events.map((event: { type: string }) => event.type)).toEqual(
    expect.arrayContaining(["landed", "scrolled", "played", "read-work"]),
  );

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
