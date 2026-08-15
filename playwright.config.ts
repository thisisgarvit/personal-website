import { defineConfig, devices } from "@playwright/test";

/**
 * E2E harness (Task 9).
 *
 * Three engines are configured per PRD §16. CI runs chromium only (the
 * webkit/firefox projects run in the local pre-release matrix — install
 * binaries with `pnpm exec playwright install webkit firefox`).
 *
 * Server under test: CI builds first and runs the production server
 * (`pnpm start`) so budgets/network purity match deployment; local runs
 * default to `pnpm dev` for iteration speed. For a production-faithful
 * local run isolated from other work lanes (recommended before release):
 *
 *   NEXT_DIST_DIR=.next-e2e pnpm build
 *   NEXT_DIST_DIR=.next-e2e pnpm start -p 3105 &
 *   E2E_PORT=3105 pnpm test:e2e --project=chromium
 *
 * (the config reuses an existing server locally).
 */
const PORT = process.env.E2E_PORT ?? "3000";
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: process.env.CI
      ? `pnpm start -p ${PORT}`
      : `pnpm dev -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
