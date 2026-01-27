import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0, // Reduced from 2 to 1 for speed
  workers: process.env.CI ? 2 : undefined, // Increased from 1 to 2 for parallel execution

  // GitHub-friendly reporter in CI, HTML locally
  reporter: process.env.CI ? [["github"], ["list"]] : [["html"], ["list"]],

  timeout: 30000,
  expect: {
    timeout: 5000, // Reduced from 10000 for faster failures
  },

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    headless: true,

    // Optimize for CI
    trace: process.env.CI ? "retain-on-failure" : "on-first-retry",
    screenshot: "only-on-failure",
    video: process.env.CI ? "off" : "retain-on-failure", // Turn off video in CI for speed

    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  // Only run Chromium in CI, all browsers locally
  projects: process.env.CI
    ? [
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"] },
        },
      ]
    : [
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"] },
        },
        {
          name: "firefox",
          use: { ...devices["Desktop Firefox"] },
        },
        {
          name: "webkit",
          use: { ...devices["Desktop Safari"] },
        },
        {
          name: "mobile-chrome",
          use: { ...devices["Pixel 5"] },
        },
        {
          name: "mobile-safari",
          use: { ...devices["iPhone 12"] },
        },
      ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60000, // Reduced from 120000 for faster startup
    stdout: "ignore",
    stderr: "pipe",
  },
});
