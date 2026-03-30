import { defineConfig, devices } from "@playwright/test";

const reuseExistingServer = process.env.E2E_REUSE_EXISTING_SERVER === "1" || !process.env.CI;

export default defineConfig({
	testDir: "./e2e",
	globalSetup: "./e2e/init.ts",
	outputDir: "./results",
	webServer: [
		{
			name: "Frontend",
			command: "bun run e2e:build && bun run e2e:start",
			url: process.env.VITE_ORIGIN,
			ignoreHTTPSErrors: true,
			reuseExistingServer,
			timeout: 60_000,
		},
	],
	reporter: process.env.CI
		? [
				[
					"list",
				],
				[
					"html",
					{
						open: "never",
					},
				],
			]
		: [
				[
					"list",
				],
			],
	use: {
		baseURL: process.env.VITE_ORIGIN,
		ignoreHTTPSErrors: true,
		locale: "cs-CZ",
		trace: "retain-on-failure",
		screenshot: "on",
		video: "retain-on-failure",
	},
	projects: [
		{
			name: "iphone-se",
			use: {
				browserName: "chromium",
				...devices["iPhone SE"],
			},
		},
	],
});
