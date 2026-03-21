import { defineConfig } from "@playwright/test";
import { APP_ORIGIN } from "./config";

export default defineConfig({
	testDir: ".",
	testMatch: [
		"smoke.spec.ts",
	],
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
		command: "dotenv -c development -- bun ./preview.ts",
		url: `${APP_ORIGIN}/cs`,
		reuseExistingServer: false,
		timeout: 180_000,
	},
});
