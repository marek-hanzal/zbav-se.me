import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	timeout: 30_000,
	expect: {
		timeout: 10_000,
	},
	fullyParallel: false,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	use: {
		trace: "retain-on-failure",
		headless: true,
	},
	webServer: {
		command: "bun run preview",
		url: "http://127.0.0.1:3030/cs",
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
	},
});
