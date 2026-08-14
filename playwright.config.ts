import { defineConfig, devices } from "@playwright/test";

/**
 * E2E harness (Task 3 smoke; Task 9 expands suites).
 *
 * Three engines are configured per PRD §16. Only the chromium browser binary
 * is installed during Task 3; run `pnpm exec playwright install webkit firefox`
 * before running the full matrix, or scope with `--project=chromium`.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
